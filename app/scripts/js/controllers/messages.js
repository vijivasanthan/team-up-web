/*jslint node: true */
/*global angular */
'use strict';


angular.module('WebPaige.Controllers.Messages', [])


/**
 * Messages controller
 */
.controller('messages', 
[
	'$scope', '$rootScope', '$q', '$location', '$route', 'data', 'Messages', 'Storage', 'Timer', 'Offsetter',
	function ($scope, $rootScope, $q, $location, $route, data, Messages, Storage, Timer, Offsetter) 
	{
    $rootScope.notification.status = false;

	  /**
	   * Fix styles
	   */
	  $rootScope.fixStyles();


	  /**
     * TODO: Still being used?
	   */
	  var self = this;


	  /**
	   * Receivers list
	   */
	  $scope.receviersList = Messages.receviers();


	  /**
	   * Set messages
	   */
	  $scope.messages 	= data.messages;
	  $scope.scheadules = data.scheadules;


	  /**
	   * Pagination
	   */
	  $scope.page = {
	  	inbox: 	0,
	  	outbox: 0,
	  	trash: 	0
	  };


	  /**
	   * Paginate engine
	   */
	  $scope.paginate = {

	  	set: function (page, box)
	  	{
	  		$scope.page[box] = page;
	  	},

	  	next: function (box)
	  	{
	  		if ($scope.page[box] + 1 != $scope.messages[box].length)
	  			$scope.page[box]++;
	  	},

	  	before: function (box)
	  	{
	  		if ($scope.page[box] != 0)
        {
          $scope.page[box]--;
        }
	  	}
	  };


	  /**
	   * Selections
	   */
	  $scope.selection = {
	    inbox: 	{},
	    outbox: {},
	    trash: 	{}
	  };


	  /**
	   * Selection masters
	   */
	  $scope.selectionMaster = {
	    inbox: 	'',
	    outbox: '',
	    trash: 	''
	  };


	  /**
	   * Initial value for broadcasting
	   */
	  $scope.broadcast = {
	    sms: 		false,
	    email: 	false
	  };


	  /**
	   * Default scheduled config
	   */
		$scope.scheaduled = {
			title: 		'',
			offsets: 	{},
			status: 	false
		};


		/**
	   * Set origin container for returning back to origin box
	   */
	  $scope.origin = 'inbox';


	  /**
	   * View setter
	   */
	  function setView (hash)
	  {
	    $scope.views = {
	      compose: 				false,
	      message: 				false,
	      inbox:   				false,
	      outbox:  				false,
	      trash:   				false,
	      notifications: 	false,
	      scheaduler: 		false
	    };

	    $scope.views[hash] = true;
	  }


	  /**
	   * Switch between the views and set hash accordingly
	   */
	  $scope.setViewTo = function (hash)
	  {
	    $scope.$watch(hash, function ()
	    {
	      $location.hash(hash);

	      setView(hash);
	    });
	  };


	  /**
	   * If no params or hashes given in url
	   */
	  if (!$location.hash())
	  {
	    var view = 'inbox';

	    $location.hash('inbox');
	  }
	  else
	  {
	    var view = $location.hash();
	  }


	  /**
	   * Set view
	   */
	  setView(view);


	  /**
	   * Default toggle for scheaduler pane
	   */
    $scope.scheadulerPane = false;


	  /**
	   * Extract view action from url and set message view
	   */
	  if ($location.search().uuid)
	  {
	  	if ($location.hash() == 'scheaduler')
	  	{
		    setNotificationView($location.search().uuid);
	  	}
	  	else
	  	{
	  		setMessageView($location.search().uuid);
	  	}
	  }


	  /**
	   * TODO: Possible bug.. Still issues with changing state of the message
	   * Set given group for view
	   */
	  function setMessageView (id)
	  {
	    $rootScope.statusBar.display($rootScope.ui.message.loadingMessage);

	    setView('message');

      // console.log('Getting message! ->', id);

	    $scope.setViewTo('message');

	    $scope.message = Messages.find(id);

      // console.log('Found message ->', $scope.message);

	    /**
	     * Change to read if message not seen yet
	     * Check only in inbox because other box messages
	     * can have 'NEW' state as well but those states are not shown
	     * Maybe only for 'trash' box to show state in later stages
	     */
	    if ($scope.message.state == "NEW" && $scope.message.box == 'inbox')
	    {
	      Messages.changeState([id], 'READ')
	      .then(function (result)
	      {
	        if (result.error)
	        {
	          $rootScope.notifier.error($rootScope.ui.errors.messages.changeState);
	          console.warn('error ->', result);
	        }
	        else
	        {
	          // console.log('state changed');
	        }
	      });

	      var _inbox = [];

	      angular.forEach($scope.messages.inbox, function (message)
	      {
	        if (message.uuid == $scope.message.uuid)
          {
            message.state = "READ";
          }

	        _inbox.push(message);
	      });

	  	  $scope.messages.inbox = _inbox;

	      Messages.unreadCount(); 
	    }

	    $rootScope.statusBar.off();
	  }


	  /**
	   * Request for a message
	   */
	  $scope.requestMessage = function (current, origin)
	  {
		  $scope.origin = origin;

	    setMessageView(current);

	    $scope.$watch($location.search(), function ()
	    {
	      $location.search({uuid: current});
	    });
	  };


  	/**
  	 * Count the schedules
  	 */
  	$scope.scheaduleCounter = function ()
  	{
  		var count = 0;

  		angular.forEach($scope.scheaduled.offsets, function ()
      {
        count++;
      });

	  	$scope.scheaduleCount = count;
  	};


	  /**
	   * Set view for notification
	   */
	  function setNotificationView (id)
	  {
	  	$scope.origin = 'notifications';

    	$scope.scheadulerPane = true;

	    var scheaduled = Messages.scheaduled.find(id);

	    angular.forEach(scheaduled.types, function (type)
	  	{
	  		if (type == 'sms') 		$scope.broadcast.sms 		= true;
	  		if (type == 'email') 	$scope.broadcast.email 	= true;
	  	});

	    var members 	= angular.fromJson(Storage.get('members')),
	    		groups 		= angular.fromJson(Storage.get('groups')),
	    		receivers = [];

	    angular.forEach(scheaduled.recipients, function (recipient)
	  	{
	  		var name;

	  		if (members[recipient])
	  		{
		  		name = members[recipient].name;

		  		receivers.push({
		  			group: 	$rootScope.ui.message.receiversUsers,
		  			id: 		recipient,
		  			name: 	name
		  		});
	  		}
	  		else
	  		{
	  			angular.forEach(groups, function (group)
	  			{
	  				if (group.uuid == recipient)
	  				{  					
			  			name = group.name;

				  		receivers.push({
				  			group: 	$rootScope.ui.message.receiversGroups,
				  			id: 		recipient,
				  			name: 	name
				  		});
	  				}
	  			});
	  		}
	  	});

	    $scope.message = {
	      subject: 		scheaduled.subject,
	      body: 			scheaduled.message,
	      receivers: 	receivers
	    };

	    angular.forEach($("div#composeTab select.chzn-select option"), function (option)
	    {
	    	angular.forEach(scheaduled.recipients, function (recipient)
	    	{
		  		if (members[recipient])
		  		{
		    		if (option.innerHTML == members[recipient].name) option.selected = true;
		    	}
		    	else
		    	{
		  			angular.forEach(groups, function (group)
		  			{
		  				if (group.uuid == recipient)
		  				{
		    				if (option.innerHTML == group.name) option.selected = true;
		  				}
		  			});
		    	}
	    	});
	    });

	    $("div#composeTab select.chzn-select").trigger("liszt:updated");

	    $scope.scheaduled = {
	    	uuid: 		scheaduled.uuid,
	    	sender: 	scheaduled.sender,
	    	title: 		scheaduled.label,
	    	status: 	scheaduled.active,
	    	offsets: 	Offsetter.factory(scheaduled.offsets)
	    };

	    /**
	     * TODO: FIX Counter is hard coded because calling counter script is not working! Maybe it is because that it is
       * $scope function and angular needs some time to wrap the things, when console log is produced at the time of
       * compilation it is observable that $scope object did not include all the functions in the controller
	     */
	    // $scope.scheaduleCounter();

  		var count = 0;

  		angular.forEach($scope.scheaduled.offsets, function (offset)
      {
        count++;
      });

	  	$scope.scheaduleCount = count;

	    // rerenderReceiversList();
	  }


	  /**
	   * Request for a notification
	   */
	  $scope.requestNotification = function (id)
	  {
	  	$rootScope.statusBar.display($rootScope.ui.message.loadingNotifications);

	    setView('scheaduler');

	    $scope.setViewTo('scheaduler');

	    setNotificationView(id);

	    $scope.$watch($location.search(), function ()
	    {
	      $location.search({uuid: id});
	    });

	    $rootScope.statusBar.off();
	  };


	  /**
	   * Compose message view toggle
	   */
	  $scope.composeMessage = function ()
	  {
	  	/**
	  	 * Close composer
	  	 */
	    if ($scope.views.compose)
	    {
	      $scope.closeTabs();
	    }
	    /**
	     * Open composer
	     */
	    else
	    {
	    	/**
	    	 * TODO: Why not working properly? Look into this one
	    	 * Reset them
	    	 */
	    	$location.search({});

	      $scope.message = {};

	      $scope.broadcast.sms 		= false;
	      $scope.broadcast.email 	= false;

	      $scope.scheadulerPane = false;

		    angular.forEach($("div#composeTab select.chzn-select option"), function (option)
		    {
		    	option.selected = false;
		    });

		    $("div#composeTab select.chzn-select").trigger("liszt:updated");

				$scope.scheaduled = {
					title: 		'',
					offsets: 	{},
					status: 	false
				};

	      $scope.scheaduleCounter();

	      $scope.setViewTo('inbox');
	    }
	  };


	  /**
	   * Reset views
	   */
	  $scope.closeTabs = function ()
	  {
	    $scope.message = {};

	    $location.search({});

	    setView($scope.origin);

	    $scope.setViewTo($scope.origin);

	    Storage.session.remove('escalation');
	  };


	  /**
	   * Toggle selections
	   */
	  $scope.toggleSelection = function (messages, inbox, master)
	  {
	    var flag = (master) ? true : false;

	    angular.forEach(messages, function (message)
	    {
	      $scope.selection[inbox][message.uuid] = flag;
	    });
	  };


	  /**
	   * Remove message
	   */
	  $scope.removeMessage = function (id)
	  {
	    $rootScope.statusBar.display($rootScope.ui.message.removing);

	    var bulk = [];

	    bulk.push(id);

	    Messages.remove(bulk)
	    .then(function (result)
	    {
	      if (result.error)
	      {
	        $rootScope.notifier.error($rootScope.ui.errors.messages.removeMessage);

	        console.warn('error ->', result);
	      }
	      else
	      {
	        $rootScope.notifier.success($rootScope.ui.message.removed);

	        $rootScope.statusBar.display($rootScope.ui.message.refreshing);

	        Messages.query()
	        .then(function (messages)
	        {
	          $scope.messages = messages.messages;

	          $rootScope.loading = false;

	          $scope.closeTabs();

	          $rootScope.statusBar.off();
	        });
	      }
	    });
	  };


	  /**
	   * Remove messages
	   */
	  $scope.removeMessages = function (selection)
	  {
	    // console.log('it is coming to bulk remove ->', selection.length);

	    $rootScope.statusBar.display($rootScope.ui.message.removingSelected);

	    var ids = [];

	    angular.forEach(selection, function (flag, id)
	    {
	      if (flag) ids.push(id);
	    });

	    Messages.remove(ids)
	    .then(function (result)
	    {
	      if (result.error)
	      {
	        $rootScope.notifier.error($rootScope.ui.errors.messages.removeMessages);

	        console.warn('error ->', result);
	      }
	      else
	      {
	        $rootScope.notifier.success($rootScope.ui.message.removed);

	        $rootScope.statusBar.display($rootScope.ui.message.refreshing);

	        Messages.query()
	        .then(function (messages)
	        {
	          $scope.messages = messages.messages;

	          $rootScope.statusBar.off();
	        });
	      }
	    });
	  };


	  /**
	   * Restore a message
	   */
	  $scope.restoreMessage = function (id)
	  {
	    $rootScope.statusBar.display($rootScope.ui.message.restoring);

	    var bulk = [];

	    bulk.push(id);

	    Messages.restore(bulk)
	    .then(function (result)
	    {
	      if (result.error)
	      {
	        $rootScope.notifier.error($rootScope.ui.errors.messages.restoreMessage);

	        console.warn('error ->', result);
	      }
	      else
	      {
	        $rootScope.notifier.success($rootScope.ui.message.restored);

	        $rootScope.statusBar.display($rootScope.ui.message.refreshing);

	        Messages.query()
	        .then(function(messages)
	        {
	          $scope.messages = messages.messages;

	          $rootScope.statusBar.off();
	        });
	      }
	    });
	  };


	  /**
	   * Restore messages
	   */
	  $scope.restoreMessages = function (selection)
	  {
	    $rootScope.statusBar.display($rootScope.ui.message.restoringSelected);

	    var ids = [];

	    angular.forEach(selection, function (flag, id)
	    {
	      if (flag) ids.push(id);
	    });

	    Messages.restore(ids)
	    .then(function (result)
	    {
	      if (result.error)
	      {
	        $rootScope.notifier.error($rootScope.ui.errors.messages.restoreMessages);

	        console.warn('error ->', result);
	      }
	      else
	      {
	        $rootScope.notifier.success($rootScope.ui.message.removed);

	        $rootScope.statusBar.display($rootScope.ui.message.refreshing);

	        Messages.query()
	        .then(function(messages)
	        {
	          $scope.messages = messages.messages;

	          $rootScope.statusBar.off();
	        });
	      }
	    });
	  };


	  /**
	   * Empty trash
	   */
	  $scope.emptyTrash = function ()
	  {
	    $rootScope.statusBar.display($rootScope.ui.message.emptying);

	    Messages.emptyTrash()
	    .then(function (result)
	    {
	      if (result.error)
	      {
	        $rootScope.notifier.error($rootScope.ui.errors.messages.emptyTrash);

	        console.warn('error ->', result);
	      }
	      else
	      {
	        $rootScope.notifier.success($rootScope.ui.message.emptied);

	        $rootScope.statusBar.display($rootScope.ui.message.refreshing);

	        Messages.query()
	        .then(function (messages)
	        {
	          if (messages.error)
	          {
	            $rootScope.notifier.error($rootScope.ui.errors.messages.query);

	            console.warn('error ->', messages);
	          }
	          else
	          {
	            $scope.messages = messages.messages;

	            $rootScope.statusBar.off();
	          }
	        });
	      }
	    });    
	  };


	  /**
	   * Reply a message
	   */
	  $scope.reply = function(message)
	  {
	    setView('compose');

	    $scope.setViewTo('compose');

	    var members = angular.fromJson(Storage.get('members'));

      // console.log('requester ->', message.requester);

	    var senderId = ($rootScope.config.profile.smartAlarm) ?
                        message.requester :
                        message.requester.split('personalagent/')[1].split('/')[0];

      // console.log('processed requester ->', senderId);

      var name = (typeof members[senderId] == 'undefined' ) ? senderId : members[senderId].name;

      // console.log('name ->', name);

	    $scope.message = {
	      subject: 		'RE: ' + message.subject,
	      receivers: 	[{
	        group: 		'Users', 
	        id: 			senderId , 
	        name: 		name
	      }]
	    };

	    renderReceiversList();
	  };


	  /**
	   * Send message
	   */
	  $scope.send = function (message, broadcast)
	  {
	    $rootScope.statusBar.display($rootScope.ui.message.sending);

	    if (message.receivers)
	    {
	      Messages.send(message, broadcast)
	      .then(function (uuid)
	      {
	        if (uuid.error)
	        {
	          $rootScope.notifier.error($rootScope.ui.errors.messages.send);

	          console.warn('error ->', uuid);
	        }
	        else
	        {
	          $rootScope.notifier.success($rootScope.ui.message.sent);

	          $rootScope.statusBar.display($rootScope.ui.message.refreshing);

	          Messages.query()
	          .then(function (messages)
	          {
	            if (messages.error)
	            {
	              $rootScope.notifier.error($rootScope.ui.errors.messages.query);

	              console.warn('error ->', messages);
	            }
	            else
	            {
	              $scope.messages = messages.messages;

	              $scope.closeTabs();

	              $scope.requestMessage(uuid, $scope.origin);

	              $rootScope.statusBar.off();
	            }
	          });
	        }
	      });
	    }
	    else
	    {
	      $rootScope.notifier.error($rootScope.ui.message.noReceivers);

	      $rootScope.statusBar.off();
	    }
	  };


		/**
	   * TODO: Is it still working? Fix for not displaying original sender in multiple receivers selector
	   * in the case that user wants to add more receivers to the list  
	   */
	  $("div#composeTab select.chzn-select").chosen()
	  .change(function ()
	  {
	  	$.each($(this).next().find("ul li.result-selected"), function (i, li)
	    {
	  		var name = $(li).html();

	  		$.each($("div#composeTab select.chzn-select option"), function (j, opt)
	      {
		      if (opt.innerHTML == name) opt.selected = true;
		    });
	  	});
	  });

	  
	  /**
	   * Re-render receivers list
	   */
	  function renderReceiversList ()
	  {
      angular.forEach($scope.message.receivers, function (receiver)
      {
        angular.forEach($("div#composeTab select.chzn-select option"), function (option)
        {
          if (option.innerHTML == receiver.name)
          {
            option.selected = true;
          }
        });
      });

	    $("div#composeTab select.chzn-select").trigger("liszt:updated");
	  }

	    
	  /**
	   * Extract escalation information
	   */
	  if ($location.search().escalate)
	  {
	    var escalation = angular.fromJson(Storage.session.get('escalation')),
	        name = escalation.group.split('>')[1].split('<')[0],
	        uuid = escalation.group.split('uuid=')[1].split('#view')[0];

	    setTimeout (function ()
	    {
	      angular.forEach($("div#composeTab select.chzn-select option"), function (option)
	      {
	        if (option.innerHTML == name) option.selected = true;
	      });

	      $("div#composeTab select.chzn-select").trigger("liszt:updated");
	    }, 100);

	    $scope.message = {
	      subject: $rootScope.ui.message.escalation,
	      receivers: [{
	        group: $rootScope.ui.message.receiversGroups, 
	        id: uuid, 
	        name: name
	      }],
	      body: $rootScope.ui.message.escalationBody(
	        escalation.diff, 
	        escalation.start.date, 
	        escalation.start.time,
	        escalation.end.date,
	        escalation.end.time)
	    };

	    $scope.broadcast = {
	      sms: true
	    };
	  }


	  /**
     * DASHBOARD
	   * Bulk cleaners for mailboxes
	   */
	  $scope.clean = {
	  	inbox: function ()
	  	{
	  		Messages.clean($scope.messages.inbox);
	  	},
	  	outbox: function ()
	  	{
	  		Messages.clean($scope.messages.outbox);
	  	},
	  	trash: function ()
	  	{
	  		Messages.clean($scope.messages.trash); 		
	  	}
	  };


	  /**
	   * Scheduler jobs manager
	   */
	  $scope.scheaduler = {

	  	/**
	  	 * Make data ready for insertion
	  	 */
	  	job: function (message, broadcast, scheaduled)
	  	{
		    var members = [],
		        types 	= [];

		    angular.forEach(message.receivers, function (receiver)
        {
          members.push(receiver.id);
        });

		    types.push('paige');

		    if (broadcast.sms) types.push('sms');
		    if (broadcast.email) types.push('email');

		    return {
		    	sender: 		$rootScope.app.resources.uuid,
		      recipients: members,
		      label: 			scheaduled.title,
		      subject: 		message.subject,
		      message: 		message.body,
		      offsets: 		Offsetter.arrayed(scheaduled.offsets),
		      repeat: 		'week',
		      types: 			types,
		      active: 		scheaduled.status
		    };
		  },


	  	/**
	  	 * Scheduler jobs lister
	  	 */
	  	list: function (callback)
	  	{
				$rootScope.statusBar.display($rootScope.ui.message.notificationsRefresh);

				Messages.scheaduled.list()
				.then(function (result)
				{
				  if (result.error)
				  {
				    $rootScope.notifier.error($rootScope.ui.errors.messages.notificationsList);
				    console.warn('error ->', result);
				  }
				  else
				  {
				    $scope.scheadules = result;

				    $rootScope.statusBar.off();

				    callback();
				  }
				});
	  	},


	  	/**
	  	 * TODO: NOT IN USE!
	  	 * Get a scheduler job
	  	 */
	  	get: function (uuid)
	  	{
				Messages.scheaduled.get(uuid)
				.then(function (result)
				{
				  if (result.error)
				  {
				    $rootScope.notifier.error($rootScope.ui.errors.messages.notificationsGet);
				    console.warn('error ->', result);
				  }
				  else
				  {
				    // console.log('notification fetched ->', result);

				    $scope.scheaduled = result;
				  }
				});
	  	},


	  	/**
	  	 * Save a schedule job
	  	 */
	  	save: function (message, broadcast, scheaduled)
	  	{
	  		if (scheaduled.uuid)
	  		{
	  			this.edit(message, broadcast, scheaduled);
	  		}
	  		else
	  		{
	  			this.add(message, broadcast, scheaduled)
	  		}
	  	},


	  	/**
	  	 * Add a schedule job
	  	 */
	  	add: function (message, broadcast, scheaduled)
	  	{
	  		var self = this;

	    	$rootScope.statusBar.display($rootScope.ui.message.notificationsAdd);

	  		Messages.scheaduled.create(this.job(message, broadcast, scheaduled))
				.then(function (result)
				{
				  if (result.error)
				  {
				    $rootScope.notifier.error($rootScope.ui.errors.messages.notificationsAdd);

				    console.warn('error ->', result);
				  }
				  else
				  {
	          $rootScope.notifier.success($rootScope.ui.message.notificationSaved);

	          self.list(function ()
	        	{
	        		$scope.setViewTo('notifications');
	        	});
				  }
				});
	  	},


	  	/**
	  	 * Edit a schedule job
	  	 */
	  	edit: function (message, broadcast, scheaduled)
	  	{
	  		var self = this;

	    	$rootScope.statusBar.display($rootScope.ui.message.notificationsEditing);

				Messages.scheaduled.edit(scheaduled.uuid, this.job(message, broadcast, scheaduled))
				.then(function (result)
				{
				  if (result.error)
				  {
				    $rootScope.notifier.error($rootScope.ui.errors.messages.notificationsEdit);

				    console.warn('error ->', result);
				  }
				  else
				  {
	          $rootScope.notifier.success($rootScope.ui.message.notificationsEdited);

	          self.list(function ()
	        	{
	        		$scope.setViewTo('notifications');

					    // $location.search({uuid: scheaduled.uuid}).hash('scheaduler');
	        	});
				  }
				});	
	  	},


	  	/**
	  	 * Remove a schedule job
	  	 */
	  	remove: function (uuid)
	  	{
	  		var self = this;

	    	$rootScope.statusBar.display($rootScope.ui.message.notificationsDeleting);

		    Messages.scheaduled.remove(uuid)
		    .then(function (result)
		    {
		      if (result.error)
		      {
		        $rootScope.notifier.error($rootScope.ui.errors.messages.notificationsDelete);

		        console.warn('error ->', result);
		      }
		      else
		      {
	          $rootScope.notifier.success($rootScope.ui.message.notificationsDeleted);

	          self.list(function ()
	        	{
	        		$scope.setViewTo('notifications');
	        	});
		      }
		    });
	  	}

	  };
	}
]);