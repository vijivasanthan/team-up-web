/*jslint node: true */
/*global angular */'use strict';

angular.module('WebPaige.Controllers.Teams', [])

/**
 * Groups controller
 */
 .controller('teamCtrl', ['$rootScope', '$scope', '$location', 'Teams', 'data', '$route', '$routeParams', 'Storage', 'MD5', 'Dater',
function($rootScope, $scope, $location, Teams, data, $route, $routeParams, Storage, MD5, Dater) {
	/**
	 * Fix styles
	 */
	$rootScope.fixStyles();

	$scope.members = data.members;
	$scope.teams = data.teams;

	/**
	 * Self this
	 */
	var self = this, params = $location.search();

	$scope.imgHost = profile.host();

	/**
	 * Init search query
	 */
	$scope.search = {
		query : ''
	};

	/**
	 * Reset selection
	 */
	$scope.selection = {};

	/**
	 * Set groups
	 */
	$scope.data = data;

	/**
	 * Grab and set roles for view
	 */
	$scope.roles = $rootScope.config.roles;
	$scope.mfuncs = $rootScope.config.mfunctions;

	var uuid, view;

	/**
	 * If no params or hashes given in url
	 */
	if(!params.uuid && !$location.hash()) {
		uuid = data.teams[0].uuid;
		view = 'team';

		$location.search({
			uuid : data.teams[0].uuid
		}).hash('team');
	} else {
		uuid = params.uuid;
		view = $location.hash();
	}

	/**
	 * Set group
	 */
	setTeamView(uuid);

	/**
	 * Set Team View
	 */
	$scope.views = {
		team : true,
		newTeam : false,
		newMember : false,
		editTeam : false,
	};

	/**
	 * Set given team for view
	 */
	function setTeamView(id) {

		angular.forEach(data.teams, function(team, index) {
			if(team.uuid == id)
				$scope.team = team;
		});

		$scope.members = data.members[id];

		$scope.current = id;
		
		// load image 
		angular.forEach($scope.members, function(member, index) {
			var imgURL = $scope.imgHost+"/teamup/team/member/"+member.uuid+"/photo";
			Teams.loadImg(imgURL).then(function(result){
				console.log("loading pic " + imgURL);
				var imgId = member.uuid.replace(".","").replace("@","");
				$('#img_'+imgId).css('background-image','url('+imgURL+')');
			},function(error){
				console.log("error when load pic " + error);
			});
		});
		
		$scope.team.phone = $rootScope.ui.teamup.loadingNumber;
		Teams.loadTeamCallinNumber($scope.team.uuid).then(function(result){
			$scope.team.phone = result.phone;
		});
		
	}

	/**
	 * Request for a team
	 */
	$scope.requestTeam = function(current, switched) {
		setTeamView(current);

		$scope.$watch($location.search(), function() {
			$location.search({
				uuid : current
			});
		});
		if(switched) {
			if($location.hash() != 'team')
				$location.hash('team');

			setView('team');
		}
	};
	/**
	 * View setter
	 */
	var setView = function(hash) {
		$scope.views = {
			team : false,
			newTeam : false,
			newMember : false,
			editTeam : false
		};

		$scope.views[hash] = true;
	};
	/**
	 * Switch between the views and set hash accordingly
	 */
	$scope.setViewTo = function(hash) {
		$scope.$watch(hash, function() {
			$location.hash(hash);

			setView(hash);
		});
	};
	/**
	 * Set view
	 */
	setView(view);

	/**
	 * Selection toggler
	 */
	$scope.toggleSelection = function(group, master) {
		var flag = (master) ? true : false, members = angular.fromJson(Storage.get(group.uuid));

		angular.forEach(members, function(member, index) {
			$scope.selection[member.uuid] = flag;
		});
	};
	/**
	 * show edit mode of the Team
	 */
	$scope.editTeam = function(team) {
		$scope.teamEditForm = {
			name : team.name,
			uuid : team.uuid
		};
		$scope.views.editTeam = true;
	};

	$scope.cancelTeamEdit = function(team) {
		$scope.teamEditForm = {
			name : team.name,
			uuid : team.uuid
		};
		$scope.views.editTeam = false;
	};
	/**
	 * save the changes on the team
	 */
	$scope.changeTeam = function(team) {

		if($.trim(team.name) == '') {
			$rootScope.notifier.error($rootScope.ui.teamup.teamNamePrompt1);
			return;
		}

		$rootScope.statusBar.display($rootScope.ui.teamup.saveTeam);

		Teams.edit(team).then(function(result) {
			if(result.error) {
				$rootScope.notifier.error("Error with saving team info : " + result.error);
			} else {
				$rootScope.statusBar.display($rootScope.ui.teamup.refreshing);

				Teams.query(false).then(function(result) {
					$rootScope.notifier.success($rootScope.ui.teamup.dataChanged);
					$rootScope.statusBar.off();

					$scope.team.name = team.name;
					$scope.views.editTeam = false;
				});
			}
		});
	};
	/**
	 * create new Team
	 */
	$scope.teamSubmit = function(team) {

		if( typeof team == 'undefined' || $.trim(team.name) == '') {
			$rootScope.notifier.error($rootScope.ui.teamup.teamNamePrompt1);
			return;
		}

		$rootScope.statusBar.display($rootScope.ui.teamup.saveTeam);

		Teams.save(team).then(function(result) {
			if(result.error) {
				$rootScope.notifier.error($rootScope.ui.teamup.teamSubmitError);
			} else {
				$rootScope.statusBar.display($rootScope.ui.teamup.refreshing);

				Teams.query(false,result).then(function(queryRs) {
					if(queryRs.error) {
						$rootScope.notifier.error($rootScope.ui.teamup.queryTeamError);
						console.warn('error ->', queryRs);
					} else {
						$rootScope.notifier.success($rootScope.ui.teamup.dataChanged);
						$scope.closeTabs();

						$scope.data = queryRs;

						angular.forEach(queryRs.teams, function(t_obj) {
							if(t_obj.uuid == result) {
								$scope.teams = queryRs.teams;

								angular.forEach(queryRs.teams, function(t) {
									if(t.uuid == t_obj.uuid) {
										$scope.team = t;
									}
								});

								$scope.members = data.members[t_obj.uuid];

								$scope.current = t_obj.uuid;

								$scope.$watch($location.search(), function() {
									$location.search({
										uuid : t_obj.uuid
									});
								});
							}
						});
					}

					$rootScope.statusBar.off();

				});
			}
		});
	};
	/**
	 * create a new team member
	 */
	$scope.memberSubmit = function(member) {
		if( typeof member == 'undefined' || !member.username || !member.password || !member.reTypePassword) {
			$rootScope.notifier.error($rootScope.ui.teamup.accountInfoFill);
			return;
		}
		if(member.password != member.reTypePassword) {
			$rootScope.notifier.error($rootScope.ui.teamup.passNotSame);
			return;
		}
		if(!member.team) {
			$rootScope.notifier.error($rootScope.ui.teamup.selectTeam);
			return;
		}

		$rootScope.statusBar.display($rootScope.ui.teamup.savingMember);

		var obj = {
			uuid : member.username,
			userName : member.username,
			passwordHash : MD5(member.password),
			firstName : member.firstName,
			lastName : member.lastName,
			phone : member.phone,
			teamUuids : [member.team],
			role : member.role,
			birthDate : Dater.convert.absolute(member.birthDate, 0)
		};

		
		Teams.saveMember(obj).then(function(result) {
			// change the REST return to json.

			if(result.error) {
				$rootScope.notifier.error($rootScope.ui.teamup.teamSubmitError + " : " + result.error);
			} else {
				$rootScope.statusBar.display($rootScope.ui.teamup.refreshing);

				Teams.query(false).then(function(queryRs) {
					if(queryRs.error) {
						$rootScope.notifier.error($rootScope.ui.teamup.queryTeamError);
						console.warn('error ->', queryRs);
					} else {
						$rootScope.notifier.success($rootScope.ui.teamup.dataChanged);
						$scope.closeTabs();

						$scope.data = queryRs;

						angular.forEach(queryRs.teams, function(t_obj) {
							if(t_obj.uuid == result) {
								$scope.teams = queryRs.teams;

								angular.forEach(queryRs.teams, function(t) {
									if(t.uuid == t_obj.uuid) {
										$scope.team = t;
									}
								});

								$scope.members = data.members[t_obj.uuid];

								$scope.current = t_obj.uuid;

								$scope.$watch($location.search(), function() {
									$location.search({
										uuid : t_obj.uuid
									});
								});
							}
						});
					}

					$rootScope.statusBar.off();

				});
			}
		});
	};
	/**
	 * Close inline form
	 */
	$scope.closeTabs = function() {
		$scope.teamForm = {};

		$scope.memberForm = {};

		$scope.setViewTo('team');
	};
}]);
