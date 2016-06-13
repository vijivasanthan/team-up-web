define(['services/services', 'config'],
       function(services, config)
       {
	       'use strict';

	       services.factory('Login',
	                        function($rootScope,
	                                 $q,
	                                 Store,
	                                 TeamUp,
	                                 Teams,
	                                 Permission,
	                                 Settings,
	                                 Dater,
	                                 Session,
	                                 $location,
	                                 MD5)
	                        {
		                        // constructor \\
		                        var loginService = function()
		                        {
			                        /**
			                         * Initializing the login
			                         */
			                        if( $location.path() == '/logout' )
			                        {
				                        setBackgroundColor();
			                        }
		                        };

		                        // public methods \\
		                        (function()
		                        {
			                        this.init = function()
			                        {
				                        var loginData, locStore = hasLocalStorageFunctionality();

				                        if( locStore )
				                        {
					                        hideAndChangeInterfaceParts();

					                        if( ! Store('app').get('app') )
					                        {
						                        // TODO: Soon not needed!
						                        Dater.registerPeriods();
						                        Store('app').save('app', '{}');
					                        }
					                        else
					                        {
						                        var periods = Store('app').get('periods');
						                        loginData   = Store('app').get('loginData');

						                        Store('app').nuke();
						                        Store('app').save('periods', periods);
						                        Store('app').save('loginData', loginData);
					                        }
				                        }
			                        };

			                        /**
			                         * Check if there is a session by a key in the local storage
			                         * By a session timeout a key value pair will be set by key name of sessionTimeout
			                         */
			                        this.checkSessionTimeout = function()
			                        {
				                        var errorMessage = null;

				                        if( localStorage.hasOwnProperty('sessionTimeout') )
				                        {
					                        localStorage.removeItem('sessionTimeout');
					                        errorMessage = showErrorAlert($rootScope.ui.teamup.sessionTimeout, true);
				                        }
				                        return errorMessage;
			                        },
			                        /**
			                         * Resave initials after validation, to create a auto login if the user sign the remember me
			                         * by the login
			                         */
				                        this.reSaveInitials = function(viewLoginData)
				                        {
					                        var localLoginData = Store('app').get('loginData');

					                        //Checks if there is already a password, otherwise encrypt the given password
					                        var password = (viewLoginData.password == '1234' && localLoginData.password)
						                        ? localLoginData.password
						                        : MD5(viewLoginData.password);

					                        var newLoginData = {
						                        username: viewLoginData.username
					                        };

					                        //Check if the user want to save his password and add it to the local storage
					                        if( viewLoginData.remember == true )
					                        {
						                        newLoginData.password = password;
					                        }
					                        Store('app').save('loginData', newLoginData);

					                        return {
						                        userName: newLoginData.username,
						                        password: password
					                        };
				                        },
			                        /**
			                         * Validate the initials of the user. If one of the fields is empty
			                         * a errormessage will show up
			                         * @loginData the username and password of the user
			                         */
				                        this.validate = function(loginData)
				                        {
					                        angular.element('#alertDiv').hide();

					                        return (! loginData || ! loginData.username || ! loginData.password)
						                        ? showErrorAlert($rootScope.ui.login.alert_fillfiled, true)
						                        : null;
				                        },
			                        /**
			                         * if the logindata is found in the localstorage
			                         * add the data to the Scope, so the user doesn't have to fill in
			                         */
				                        this.getInitials = function(loginData)
				                        {
					                        var localLoginData = Store('app').get('loginData');

					                        //Check if there is loginData local
					                        if( localLoginData )
					                        {
						                        //if there is a username, show it
						                        var currentLoginData = {
							                        username: localLoginData.username
						                        };

						                        //if there is a local encrypted password, show a random string
						                        //and select the remember login
						                        if( localLoginData.password )
						                        {
							                        currentLoginData.password = 1234;
							                        currentLoginData.remember = true;
						                        }
						                        return currentLoginData;
					                        }
				                        },
			                        /**
			                         * Authenticate the user who tries to login
			                         * Thereby the backend directory will be set,
			                         * by authenticating the log atempt
			                         * If the result is not a statuscode 0, 505, 400, 401 or 404
			                         * the user is permitted to login and a session is stored
			                         * @param uuid Username
			                         * @param pass Password
			                         */
				                        this.authenticate = function(uuid, pass)
				                        {
					                        var self     = this,
					                            deferred = $q.defer();

					                        Settings
						                        .initBackEnd(config.app.host, uuid, pass)
						                        .then(
							                        function(result)
							                        {
								                        if( result.valid === false && result.errorMessage )
								                        {
									                        var errorMessage = showErrorAlert(result.errorMessage, true);
									                        deferred.reject(errorMessage);
									                        angular.element('#login button[type=submit]')
									                               .text($rootScope.ui.login.button_login)
									                               .removeAttr('disabled');
								                        }
								                        else if( result.valid === true )
								                        {
									                        Session.set(result['X-SESSION_ID']);//set session
									                        self.preLoadData(function()
									                                         {
										                                         //Permission.saveProfile();
										                                         Permission.getAccess(function(permissionProfile)
										                                                              {
											                                                              if( permissionProfile.chat && ! $rootScope.browser.mobile ) $rootScope.$broadcast('loadChatsCurrentTeam');
											                                                              Permission.location(permissionProfile);
											                                                              //Set current version stuff Back end
											                                                              $rootScope.getVersionInfo();
											                                                              self.hideStyling();

											                                                              deferred.resolve(result);
										                                                              });
									                                         });
								                        }
							                        });
					                        return deferred.promise;
				                        };

			                        /**
			                         * Hide styling
			                         */
			                        this.hideStyling = function()
			                        {
				                        setTimeout(
					                        function()
					                        {
						                        angular.element('.navbar').show();
						                        angular.element('body').addClass('background');

						                        if( ! $rootScope.browser.mobile ) angular.element('#footer').show();
					                        }, 100);
			                        }

			                        /**
			                         * Preload logged userdata, all team names and id's
			                         * and the ACL to give the user the right permissions
			                         */
			                        this.preLoadData = function(cb)
			                        {
				                        var self = this;
				                        angular.element('#login').hide();
				                        angular.element('#download').hide();
				                        angular.element('#preloader').show();

				                        progress(33, $rootScope.ui.login.loading_User);

				                        TeamUp._('user')
				                              .then(function(resources)
				                                    {
					                                    $rootScope.app.resources = resources;
					                                    Store('app').save('resources', $rootScope.app.resources);
					                                    progress(66, $rootScope.ui.login.loading_teams);
					                                    return Teams.getAllLocal();
				                                    })
				                              .then(function(teams)
				                                    {
					                                    progress(100, $rootScope.ui.login.loading_everything);
					                                    //update the avatar once, because the resources were not set when the directive was loaded
					                                    $rootScope.showChangedAvatar('team', $rootScope.app.resources.uuid);
					                                    //TODO for testpurposes only
					                                    (cb && cb());
				                                    });

				                        /**
				                         * The progressbar will show which data is loading at the moment
				                         * @param ratio Shows on a scale of one till hundred, how much data is already loaded
				                         * @param message
				                         */
				                        function progress(ratio, message)
				                        {
					                        angular.element('#preloader .progress .bar')
					                               .css({width: ratio + '%'});
					                        angular.element('#preloader span')
					                               .text(message);
				                        }
			                        }

		                        }).call(loginService.prototype);

		                        // private methods \\

		                        /**
		                         * Hide or change a few parts in the login, so it's looks different,
		                         * then the rest of the application
		                         */
		                        function hideAndChangeInterfaceParts()
		                        {
			                        angular.element('.navbar').hide();
			                        angular.element('#footer').hide();
			                        angular.element('#watermark').hide();
			                        angular.element('body').css({'backgroundColor': '#1dc8b6'});
		                        }

		                        /**
		                         * set background color
		                         */
		                        function setBackgroundColor()
		                        {
			                        angular.element('body')
			                               .css(
				                               {
					                               'backgroundColor': '#1dc8b6',
					                               'backgroundImage': 'none'
				                               }
			                               );
		                        }

		                        /**
		                         * @param errorMessage The message who will show up
		                         * @param display If it's displayed or not
		                         * @returns {{login: {display: boolean, message: (string|string|string|string)}}}
		                         */
		                        function showErrorAlert(errorMessage, display)
		                        {
			                        return {
				                        login: {
					                        display: display,
					                        message: errorMessage
				                        }
			                        };
		                        }

		                        /**
		                         * Check before initializing the local storage if it's possible in to use
		                         * otherwise show a message, that the application depends on it
		                         * @returns {boolean} has local storage true or false
		                         */
		                        function hasLocalStorageFunctionality()
		                        {
			                        var hasLocalStorage = false;
			                        try
			                        {
				                        localStorage.test = 'test';
				                        hasLocalStorage   = true;
			                        }
			                        catch(e)
			                        {
				                        var urlPrivateMode = 'http://support.apple.com/nl-nl/ht6366',
				                            template       = '<p>' + $rootScope.ui.teamup.checkLocalStorage + '</p>';

				                        template += "<a href='" + urlPrivateMode + "'>";
				                        template += urlPrivateMode + '</a>';

				                        setBackgroundColor();

				                        angular.element('#login')
				                               .html('')
				                               .append(template);

				                        hasLocalStorage = false;
			                        }
			                        finally
			                        {
				                        return hasLocalStorage;
			                        }
		                        }

		                        return new loginService();
	                        });
       });