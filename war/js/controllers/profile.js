/*jslint node: true */
/*global angular */
'use strict';


angular.module('WebPaige.Controllers.Profile', [])


/**
 * Profile controller
 */
.controller('profileCtrl', 
[
	'$rootScope', '$scope', '$q', '$location', '$window', '$route', 'data', 'Profile', 'Storage', 'Teams', 'Dater', 'MD5','$filter', 
	function ($rootScope, $scope, $q, $location, $window, $route, data, Profile, Storage, Teams, Dater, MD5,$filter) 
	{
	  /**
	   * Fix styles
	   */
	  $rootScope.fixStyles();

	  /**
	   * Pass the self
	   */
	  $scope.self = this;
		
	  /**
	   * Pass periods
	   */
	  $scope.periods = Dater.getPeriods();

	  /**
	   * apply the host to img url
	   */
	  $scope.imgHost = profile.host();
	  
	  /**
	   * Pass current
	   */
		$scope.current = {
	      day:    Date.today().getDayOfYear() + 1,
	      week:   new Date().getWeek(),
	      month:  new Date().getMonth() + 1
	    };
	
		/**
	     * Grab and set roles for view
	     */
	    $scope.roles = $rootScope.config.roles;
	    $scope.mfuncs = $rootScope.config.mfunctions;  
	     
	
	  /**
	   * Set data for view
	   */
	  if (data.slots) 
	  	data.user = data.slots.data;


	  /**
	   * PAss data container
	   */
	  $scope.data = data;
	  $scope.noImgURL = $rootScope.config.noImgURL;
	  
	  /**
	   * Pass profile information
	   */
	  $scope.profilemeta = data.resources;
	  // deal with date 
	  $scope.profilemeta.birthday = $filter('nicelyDate')(data.resources.birthDate);	  
	  
	  $scope.currentRole = $scope.profilemeta.role; 
	  /**
	   * Get teams of user
	   */
	  var teams = [];
	  var storage_teams = angular.fromJson(Storage.get("Teams"));
	  angular.forEach($scope.profilemeta.teamUuids,function(teamId,index){
	      angular.forEach(storage_teams,function(team,index){
	         if(team.uuid == teamId){
	             teams.add(team);
	         } 
	      });
	  });

	  $scope.teams = teams;
	  $scope.selectTeams = storage_teams;
	  
	  /**
	   * Default values for passwords
	   */
	  $scope.passwords = {
	    current: 	'',
	    new1: 		'',
	    new2: 		''
	  };


	  /**
	   * Default form views
	   */
	  $scope.forms = {
	    add:  false,
	    edit: false
	  };


	  /**
	   * Slot form toggler
	   */
	  $scope.toggleSlotForm = function ()
	  {
	    if ($scope.forms.add)
	    {
	      $scope.resetInlineForms();
	    }
	    else
	    {
	      $scope.slot = {};

	      $scope.slot = {
	        start: {
	          date: new Date().toString($rootScope.config.formats.date),
	          time: new Date().toString($rootScope.config.formats.time),
	          datetime: new Date().toISOString()
	        },
	        end: {
	          date: new Date().toString($rootScope.config.formats.date),
	          time: new Date().addHours(1).toString($rootScope.config.formats.time),
	          datetime: new Date().toISOString()
	        },
	        state:      '',
	        recursive:  false,
	        id:         ''
	      };

	      $scope.forms = {
	        add: 	true,
	        edit: false
	      };
	    }
	  };


	  /**
	   * Reset inline forms
	   */
	  $scope.resetInlineForms = function ()
	  {
	    $scope.slot = {};

	    $scope.original = {};

	    $scope.forms = {
	      add:  false,
	      edit: false
	    };
	  };


	  /**
	   * Extract view action from url and set view
	   */
	  setView($location.hash());


	  /**
	   * View setter
	   */
	  function setView (hash)
	  {
	    $scope.views = {
	      profile:  false,
	      edit:     false,
	      editImg:     false,
	      password: false,
	      timeline: false
	    };

	    $scope.views[hash] = true;

	    $scope.views.user = ($rootScope.app.resources.uuid == $route.current.params.userId) ? true : false;
	    
	    // load the avatar by ajax way
	    var memberId = $route.current.params.userId;
	    var imgURL = $scope.imgHost+"/teamup/team/member/"+memberId+"/photo";
        Teams.loadImg(imgURL).then(function(result){
            // console.log("loading pic " + imgURL);
            
            var imgId = memberId.replace(".","").replace("@","");
            if(result.status && (result.status == 404 || result.status == 403 || result.status == 500) ){
                console.log("loading pic " ,result);
                $('#img_'+imgId).css('background-image','url('+$scope.noImgURL+')');
            }else{
                $('#img_'+imgId).css('background-image','url('+imgURL+')');
            }
            
        },function(error){
            console.log("error when load pic " + error);
        });
	  };


	  /**
	   * Switch between the views and set hash ccordingly
	   */
	  $scope.setViewTo = function (hash)
	  {
	    $scope.$watch($location.hash(), function ()
	    {
	      $location.hash(hash);

	      setView(hash);
	    });
	  };


	  /**
	   * Save user
	   */
	  $scope.save = function (resources)
	  {
	    $rootScope.statusBar.display($rootScope.ui.profile.saveProfile);
	    
	    if(resources.teamUuids == null || typeof resources.teamUuids[0] == 'undefined'){
	        resources.teamUuids = [];
	        if($scope.teams.length == 0 ){
	            //resources.teamUuids.push($scope.selectTeams[0].uuid);
	            resources.teamUuids.push(sessionStorage.getItem(resources.uuid+"_team"));
	        }else{
	            resources.teamUuids.push($scope.teams[0].uuid);
	        }
	            
	    }
	    // deal with birthday 
	    delete resources.birthday;
	    
	    Profile.save($route.current.params.userId, resources)
	    .then(function (result)
	    {
	      if (result.error)
	      {
	        $rootScope.notifier.error('Error with saving profile information.');
	        console.warn('error ->', result);
	      }
	      else
	      {
	        $rootScope.statusBar.display($rootScope.ui.profile.refreshing);

	        var flag = ($route.current.params.userId == $rootScope.app.resources.uuid) ? true : false;

	        Profile.get($route.current.params.userId, flag)
	        .then(function (data)
	        {
	          if (data.error)
	          {
	            $rootScope.notifier.error('Error with getting profile data.');
	            console.warn('error ->', data);
	          }
	          else
	          {
	            $rootScope.notifier.success($rootScope.ui.profile.dataChanged);

	            $scope.data = data;

	            $rootScope.statusBar.off();
	            
	            $scope.setViewTo("profile");
	          };
	        });
	      };
	    });
	  };


	  /**
	   * Change passwords
	   */
	  $scope.change = function (passwords)
	  {
	    if (passwords.new1 == '' || passwords.new2 == '')
	    {
	      $rootScope.notifier.error($rootScope.ui.profile.pleaseFill, true);

	      return false;
	    };

	    if (passwords.new1 != passwords.new2)
	    {
	      $rootScope.notifier.error($rootScope.ui.profile.passNotMatch, true);

	      return false;
	    }
	    else if ($rootScope.app.resources.askPass == MD5(passwords.current))
	    {
	      $rootScope.statusBar.display($rootScope.ui.profile.changingPass);

	      Profile.changePassword(passwords)
	      .then(function (result)
	      {
	        if (result.error)
	        {
	          $rootScope.notifier.error('Error with changing password.');
	          console.warn('error ->', result);
	        }
	        else
	        {
	          $rootScope.statusBar.display($rootScope.ui.profile.refreshing);

	          Profile.get($rootScope.app.resources.uuid, true)
	          .then(function (data)
	          {
	            if (data.error)
	            {
	              $rootScope.notifier.error('Error with getting profile data.');
	              console.warn('error ->', data);
	            }
	            else
	            {
	              $rootScope.notifier.success($rootScope.ui.profile.passChanged);

	              $scope.data = data;

	              $rootScope.statusBar.off();
	            };
	          });
	        };
	      });
	    }
	    else
	    {
	      $rootScope.notifier.error($rootScope.ui.profile.passwrong, true);
	    };
	  };
	  

	  /**
	   * Render timeline if hash is timeline
	   */
	  // if ($location.hash() == 'timeline')
//	  if ($rootScope.app.resources.uuid != $route.current.params.userId)
//	  {
//	  	timelinebooter();
//	  };



	  /**
	   * Redraw timeline
	   */
	  $scope.redraw = function ()
	  {
	  	setTimeout(function ()
	  	{
	  		// timelinebooter();
	  	}, 100);
		};


	  function timelinebooter ()
	  {
      $scope.timeline = {
      	id: 'userTimeline',
      	main: false,
      	user: {
      		id: $route.current.params.userId
      	},
        current: $scope.current,
        options: {
          start:  new Date($scope.periods.weeks[$scope.current.week].first.day),
          end:    new Date($scope.periods.weeks[$scope.current.week].last.day),
          min:    new Date($scope.periods.weeks[$scope.current.week].first.day),
          max:    new Date($scope.periods.weeks[$scope.current.week].last.day)
        },
        range: {
          start: 	$scope.periods.weeks[$scope.current.week].first.day,
          end: 		$scope.periods.weeks[$scope.current.week].last.day
        },
        config: {
          legenda:    {},
          legendarer: $rootScope.config.timeline.config.legendarer,
          states:     $rootScope.config.timeline.config.states
        }
      };

      var states = {};

      angular.forEach($scope.timeline.config.states, function (state, key) { states[key] = state.label });

      $scope.states = states;

      angular.forEach($rootScope.config.timeline.config.states, function (state, index)
      {
        $scope.timeline.config.legenda[index] = true;
      });


	  /**
	   * Prepeare timeline range for dateranger widget
	   */
	  $scope.daterange =  Dater.readable.date($scope.timeline.range.start) + ' / ' + 
	                      Dater.readable.date($scope.timeline.range.end);

	                      

      $('#timeline').html('');
      $('#timeline').append('<div id="userTimeline"></div>');
	  };

	  /**
	   * show edit member profile TabView  
	   */
	  
	  $scope.editProfile = function(){
	      setView('edit');
	  }
	  
	  /**
	   * load the dynamic upload URL for GAE 
	   */
	  $scope.editImg = function(){
	      $rootScope.statusBar.display($rootScope.ui.profile.loadUploadURL);
	      Profile.loadUploadURL($route.current.params.userId)
	        .then(function (result)
	        {
	          if (result.error){
	            $rootScope.notifier.error('Error with loading upload URL.');
	            console.warn('error ->', result);
	          }else{
	              
	            $rootScope.statusBar.off();
	            $scope.uploadURL = result.url;
	            
	            $scope.setViewTo('editImg');
	          };
	      });
	      
	      
	  }
	  
	}
]);