/*jslint node: true */
/*global angular */'use strict';

angular.module('WebPaige.Controllers.Planboard', [])

/**
 * Planboard controller
 */
.controller('planboard', ['$rootScope', '$scope', '$location', 'Dater', 'Storage', 'Teams','Clients',
function($rootScope, $scope, $location, Dater, Storage, Teams,Clients) {

	var self = this, params = $location.search();
	$scope.imgHost = profile.host();
	$scope.ns = profile.ns();

	var teams = angular.fromJson(Storage.get('Teams')), clients = angular.fromJson(Storage.get('ClientGroups'));

	$scope.data = {
		teams : {
			list : [],
			members : {},
			tasks : []
		},
		clients : {
			list : [],
			members : {},
			tasks : []
		},
		user : [{
			"count" : 0,
			"end" : 1378681200,
			"recursive" : true,
			"start" : 1378504800,
			"text" : "com.ask-cs.State.Available",
			"type" : "availability",
			"wish" : 0
		}, {
			"count" : 0,
			"end" : 1378850400,
			"recursive" : true,
			"start" : 1378720800,
			"text" : "com.ask-cs.State.Available",
			"type" : "availability",
			"wish" : 0
		}],
		members : [],
		synced : Number(Date.today()),
		periods : {
			start : Number(Date.today()) - (7 * 24 * 60 * 60 * 1000),
			end : Number(Date.today()) + (7 * 24 * 60 * 60 * 1000)
		}
	};

	angular.forEach(teams, function(team) {
		var members = angular.fromJson(Storage.get(team.uuid));

		if (members && members.length > 0) {
			$scope.data.teams.list.push({
				uuid : team.uuid,
				name : team.name
			});

			$scope.data.teams.members[team.uuid] = [];

			angular.forEach(members, function(member) {
				var imgfile = Storage.avatar.geturl(member.uuid);
				var imgURL = $scope.imgHost + imgfile;
				if(typeof imgfile == "undefined"){
					imgURL = profile.noImgURL;
				}
				var avatar = '<div class="roundedPicSmall memberStateNone" ' + 'style="float: left; background-image: url(' + imgURL + ');" memberId="'+member.uuid+'"></div>';

				var name = avatar + '<div style="float: left; margin: 15px 0 0 5px; font-size: 14px;">' + member.firstName + ' ' + member.lastName + '</div>';
				var obj = {"head" : name , "memId" : member.uuid};
				$scope.data.teams.members[team.uuid].push(obj);
			});
		}
	});

	angular.forEach(clients, function(client) {
		var members = angular.fromJson(Storage.get(client.id));

		if (members && members.length > 0) {
			$scope.data.clients.list.push({
				uuid : client.id,
				name : client.name
			});

			$scope.data.clients.members[client.id] = [];

			angular.forEach(members, function(member) {
				var imgfile = Storage.avatar.geturl(member.uuid);
				var imgURL = $scope.imgHost + imgfile;
				if(typeof imgfile == "undefined"){
					imgURL = profile.noImgURL;
				}
				var avatar = '<div class="roundedPicSmall memberStateNone" ' + 'style="float: left; background-image: url(' + imgURL + ');" memberId="'+member.uuid+'"></div>';

				var name = avatar + '<div style="float: left; margin: 15px 0 0 5px; font-size: 14px;">' + member.firstName + ' ' + member.lastName + '</div>';
				var obj = {"head" : name , "memId" : member.uuid};
				$scope.data.clients.members[client.id].push(obj);
			});
		}
	});

	function switchData() {
		switch ($scope.section) {
			case 'teams':
				$scope.list = $scope.data.teams.list;
				if(typeof $scope.currentTeam == "undefined"){
					$scope.currentTeam = $scope.data.teams.list[0].uuid;
				}
				$scope.changeCurrent($scope.currentTeam);
				break;
			case 'clients':
				$scope.list = $scope.data.clients.list;
				if(typeof $scope.currentClientGroup == "undefined"){
					$scope.currentClientGroup = $scope.data.clients.list[0].uuid;
				}
				$scope.changeCurrent($scope.currentClientGroup);
				break;
		}

		
	}


	$scope.changeCurrent = function(current) {

		angular.forEach($scope.data[$scope.section].list, function(node) {
			if (node.uuid == current) {
				$scope.currentName = node.name;
			}
		});
		
		// change the tab
//		if(typeof $scope.data.section != "undefined" && $scope.data.section != $scope.section){
//			if($scope.section == "teams"){
//				$scope.current = $scope.data.teams.list[0].uuid;
//				
//			}else if($scope.section == "clients"){
//				$scope.current = $scope.data.clients.list[0].uuid;
//				
//			}
//		}
		if($scope.section == "teams"){
			$scope.currentTeam = current;
			$scope.data.members = $scope.data[$scope.section].members[$scope.currentTeam];
		}else if($scope.section == "clients"){
			$scope.currentClientGroup = current;
			$scope.data.members = $scope.data[$scope.section].members[$scope.currentClientGroup];
		}
		$scope.data.section = $scope.section;

		
		
		// try to loading the slots from here
		var startTime = Number(Date.today()) - (7 * 24 * 60 * 60 * 1000);
		var endTime = Number(Date.today()) + (7 * 24 * 60 * 60 * 1000);
		
		var storeTask = function(tasks,startTime,endTime){
			// clear the array to keep tasks sync with sever side after changing
			$scope.data[$scope.section].tasks = [];
			angular.forEach(tasks, function(task,i) {
				if(task != null){
					var memberId = "";
					if($scope.section == "teams"){
						memberId = task.assignedTeamMemberUuid;
					}if($scope.section == "clients"){
						memberId = task.relatedClientUuid;
					}
					
					if(typeof $scope.data[$scope.section].tasks[memberId] == "undefined"){
						$scope.data[$scope.section].tasks[memberId] = new Array();
					}
					$scope.data[$scope.section].tasks[memberId].push(task);
				}
			});
			
			$rootScope.$broadcast('timeliner', {
				start : startTime,
				end : endTime 
			});
		};
		
		if($scope.data.section == "teams"){
			
			$location.search({
				uuid : $scope.currentTeam
			}).hash('teams');
			
			Teams.getTeamTasks($scope.currentTeam,startTime/1000,endTime/1000).then(function(tasks){
				// process the tasks data
				storeTask(tasks,startTime,endTime);
			},function(error){
				console.log("error happend when getting the tasks for the team members " + error);
			});
		}else if($scope.data.section == "clients"){
			
			$location.search({
				uuid : $scope.currentClientGroup
			}).hash('clients');
			
			Clients.getClientTasks($scope.currentClientGroup,startTime/1000,endTime/1000).then(function(tasks){
				storeTask(tasks,startTime,endTime);
			},function(error){
				console.log("error happend when getting the tasks for the team members " + error);
			});
		}	
		
	};


    
    
	/**
	 * View setter
	 */
	function setView(hash) {
		$scope.views = {
			teams : false,
			clients : false,
			member : false,
			slot: {
	          add:  false,
	          edit: false
		    }
		};

		$scope.views[hash] = true;
	}
	
	/**
	 * Switch between the views and set hash accordingly
	 */
	$scope.setViewTo = function(uuid,hash) {
		$scope.$watch(hash, function() {
			$location.hash(hash);

			$scope.section = hash;

			switchData();

			setView(hash);
		});
	};
	
	
	$scope.resetViews = function ()
    {
      $scope.views.slot = {
              add:  false,
              edit: false
      };
        
    };
    
	/**
     * Reset planboard views
     */
    $rootScope.$on('resetPlanboardViews', function (){
    	$scope.resetViews();    	
    });

	
    var uuid, view;
    /**
	 * If no params or hashes given in url
	 */
	if(!params.uuid && !$location.hash()) {
		uuid = $scope.data.teams.list[0].uuid;
		view = 'teams';

		$location.search({
			uuid : $scope.data.teams.list[0].uuid
		}).hash('teams');
	} else {
		uuid = params.uuid;
		view = $location.hash();
	}
	
	/**
	 * Default view
	 */
	$scope.setViewTo(uuid,view);

	/*
	var data = {
	"user": [
	{
	"count": 0,
	"end": 1378681200,
	"recursive": true,
	"start": 1378504800,
	"text": "com.ask-cs.State.Available",
	"type": "availability",
	"wish": 0
	},
	{
	"count": 0,
	"end": 1378850400,
	"recursive": true,
	"start": 1378720800,
	"text": "com.ask-cs.State.Available",
	"type": "availability",
	"wish": 0
	}
	],
	"synced": Number(Date.today()),
	"periods": {
	"start": Number(Date.today()),
	"end":   Number(Date.today()) + (7 * 24 * 60 * 60 * 1000)
	}
	};

	// console.log('data ->', angular.toJson(data));

	console.log('this week ->', Number(Date.today()));
	*/

	/**
	 * Pass the self
	 */
	$scope.self = this;

	/**
	 * Pass time slots data
	 */
	// $scope.data = data;

	/**
	 * Get groups and settings
	 */
	//      var groups  	= Storage.local.groups(),
	//        settings 	= Storage.local.settings();

	/**
	 * Pass current
	 */
	$scope.current = {
		layouts : {
			user : true,
			group : false,
			members : false
		},
		/**
		 * Fix for timeline scope to day
		 */
		day : Dater.current.today() + 1,
		week : Dater.current.week(),
		month : Dater.current.month(),
		// group:    settings.app.group,
		division : 'all'
	};

	/**
	 * Pass periods
	 */
	Dater.registerPeriods();

	$scope.periods = Dater.getPeriods();

	/**
	 * Reset and init slot container which
	 * is used for adding or changing slots
	 */
	$scope.slot = {};

	/**
	 * Set defaults for timeline
	 */
	var index_start = ((Dater.current.today() - 7) < 1 ) ? 1 : (Dater.current.today() - 7);
	$scope.timeline = {
		id : 'mainTimeline',
		main : true,
		user : {
			id : $rootScope.app.resources.uuid,
			role : $rootScope.app.resources.role
		},
		current : $scope.current,
		/**
		 * Initial start up is next 7 days
		 */
		options : {
			start : $scope.periods.days[index_start].last.day,
			end : $scope.periods.days[Dater.current.today() + 7].last.day,
			min : $scope.periods.days[index_start].last.day,
			max : $scope.periods.days[Dater.current.today() + 7].last.day
		},
		range : {
			start : $scope.periods.days[index_start].last.day,
			end : $scope.periods.days[Dater.current.today() + 7].last.day
		},
		scope : {
			day : false,
			week : true,
			month : false
		},
		config : {
			bar : $rootScope.config.timeline.config.bar,
			layouts : $rootScope.config.timeline.config.layouts,
			wishes : $rootScope.config.timeline.config.wishes,
			legenda : {},
			legendarer : $rootScope.config.timeline.config.legendarer,
			states : $rootScope.config.timeline.config.states,
			divisions : $rootScope.config.timeline.config.divisions,
			densities : $rootScope.config.timeline.config.densities
		}
	};

	/**
	 * IE8 fix for inability of - signs in date object
	 */
	if ($.browser.msie && $.browser.version == '8.0') {
		$scope.timeline.options = {
			start : $scope.periods.days[Dater.current.today() - 7].last.timeStamp,
			end : $scope.periods.days[Dater.current.today() + 7].last.timeStamp,
			min : $scope.periods.days[Dater.current.today() - 7].last.timeStamp,
			max : $scope.periods.days[Dater.current.today() + 7].last.timeStamp
		};
	}

	/**
	 * Legend defaults
	 */
	angular.forEach($rootScope.config.timeline.config.states, function(state, index) {
		$scope.timeline.config.legenda[index] = true;
	});

	/**
	 * Timeline group legend default configuration
	 */
	$scope.timeline.config.legenda.groups = {
		more : true,
		even : true,
		less : true
	};

	/**
	 * Prepare timeline range for date ranger widget
	 */
	$scope.daterange = Dater.readable.date($scope.timeline.range.start) + ' / ' + Dater.readable.date($scope.timeline.range.end);
	
	/**
	 * find the related users in the slot (could be a team member or a client) 
	 */
	$scope.processRelatedUsers = function(selectedSlot){
		
		var relatedUsers = [];
		var memberId = $(selectedSlot.group).attr("memberId");
		
		if($scope.views.teams){
			
			$scope.relatedUserLabel = $rootScope.ui.teamup.clients;
			var member = $rootScope.getTeamMemberById(memberId);
			if(typeof member.teamUuids != "undefined" && member.teamUuids.length > 0){
				relatedUsers = $rootScope.getClientsByTeam(member.teamUuids);
			}
		}else if($scope.views.clients){
			$scope.relatedUserLabel = $rootScope.ui.planboard.members;
			var client = $rootScope.getClientByID(memberId);
			if(typeof client.clientGroupUuid != "undefined" && client.clientGroupUuid != ""){
				relatedUsers = $rootScope.getMembersByClient(client.clientGroupUuid);
			}
		}
		
		return relatedUsers; 
	}
	
	/**
     * Reset inline forms
     */
    $scope.resetInlineForms = function ()
    {
      $scope.slot = {};

      $scope.original = {};

      $scope.resetViews();    
      
      if($scope.section == "teams"){
    	  $scope.changeCurrent($scope.currentTeam);
      }else if($scope.section == "clients"){
    	  $scope.changeCurrent($scope.currentClientGroup);
      }
      
    };
}]);
