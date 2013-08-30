/*jslint node: true */
/*global angular */'use strict';

angular.module('WebPaige.Controllers.Clients', [])

/**
 * Groups controller
 */.controller('clientCtrl', ['$rootScope', '$scope', '$location', 'Clients', 'data', '$route', '$routeParams', 'Storage','Dater','$filter',
function($rootScope, $scope, $location, Clients, data, $route, $routeParams, Storage,Dater,$filter) {
	/**
	 * Fix styles
	 */
	$rootScope.fixStyles();

	if(data.clientId) {
		data.clientGroups = angular.fromJson(Storage.get("ClientGroups"));
		data.clients = {};
		angular.forEach(data.clientGroups, function(cGroup, index) {
			var clients = angular.fromJson(Storage.get(cGroup.id));

			var key = cGroup.id;
			data.clients[cGroup.id] = clients;

			angular.forEach(clients, function(client, index) {
				if(client.uuid == data.clientId) {
					$scope.client = client;
					$scope.contacts = client.contacts;
					
					// deal with the date thing for editing
					client.birthday = $filter('nicelyDate')(client.birthDate)
					$scope.clientmeta = client;
					
				}
			});
		});
	}

	$scope.clients = data.clients;
	$scope.clientGroups = data.clientGroups;
	
	
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

	var uuid, view;

	/**
	 * If no params or hashes given in url
	 */
	if(!params.uuid && !$location.hash()) {
		uuid = data.clientGroups[0].id;
		view = 'client';

		$location.search({
			uuid : data.clientGroups[0].id
		}).hash('client');
	} else {
		uuid = params.uuid;
		if( typeof uuid == 'undefined') {
			uuid = $scope.client.clientGroupUuid;
		}
		view = $location.hash();
	}

	/**
	 * Set group
	 */
	setClientView(uuid);

	/**
	 * Set Team View
	 */
	$scope.views = {
		client : true,
		newClientGroup : false,
		newClient : false,
		reports : false,
		editClientGroup : false,
		editClient : false,
		viewClient : false,
	}

	/**
	 * Set given team for view
	 */
	function setClientView(id) {

		angular.forEach(data.clientGroups, function(cGroup, index) {
			if(cGroup.id == id)
				$scope.clientGroup = cGroup;
		});

		$scope.clients = data.clients[id];

		$scope.current = id;

		//            wisher(id);
	}

	/**
	 * Request for a client group
	 */
	$scope.requestClientGroup = function(current, switched) {
		setClientView(current);

		$scope.$watch($location.search(), function() {
			$location.search({
				uuid : current
			});
		});
		if(switched) {
			if($location.hash() != 'client')
				$location.hash('client');

			setView('client');
		}
	};
	/**
	 * View setter
	 */
	var setView = function(hash) {
		$scope.views = {
			client : false,
			newClientGroup : false,
			newClient : false,
			reports : false
		};

		$scope.views[hash] = true;
	}
	
	/**
	 * Set view
	 */
	setView(view);

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
	 * Selection toggler
	 */
	//        $scope.toggleSelection = function (group, master)
	//        {
	//            var flag = (master) ? true : false,
	//                    members = angular.fromJson(Storage.get(group.uuid));
	//
	//            angular.forEach(members, function (member, index)
	//            {
	//                $scope.selection[member.uuid] = flag;
	//            });
	//        };

	/**
	 * show edit mode of the Team
	 */
	$scope.editClientGroup = function(clientGroup) {
		$scope.cGroupEditForm = {
			name : clientGroup.name,
			id : clientGroup.id
		};
		$scope.views.editClientGroup = true;
	}

	$scope.cancelClientGroupEdit = function(clientGroup) {
		$scope.cGroupEditForm = {
			name : clientGroup.name,
			id : clientGroup.id
		};
		$scope.views.editClientGroup = false;
	}
	/**
	 * save the changes on the team
	 */
	$scope.changeClientGroup = function(cGroup) {

		if($.trim(cGroup.name) == '') {
			$rootScope.notifier.error($rootScope.ui.teamup.cGroupNamePrompt1);
			return;
		}

		$rootScope.statusBar.display($rootScope.ui.teamup.saveClientGroup);

		Clients.edit(cGroup).then(function(result) {
			if(result.error) {
				$rootScope.notifier.error("Error with saving client Group info");
			} else {
				$rootScope.statusBar.display($rootScope.ui.teamup.refreshing);

				Clients.query(false).then(function(result) {
					$rootScope.notifier.success($rootScope.ui.teamup.dataChanged);
					$rootScope.statusBar.off();

					$scope.clientGroup.name = cGroup.name;
					$scope.views.editClientGroup = false;
				});
			}
		});
	}
	
	var reloadGroup = function(result) {
		Clients.query(false).then(function(queryRs) {
			if(queryRs.error) {
				$rootScope.notifier.error($rootScope.ui.teamup.queryCGroupError);
				console.warn('error ->', queryRs);
			} else {
				$rootScope.notifier.success($rootScope.ui.teamup.dataChanged);
				$scope.closeTabs();

				$scope.data = queryRs;

				angular.forEach(queryRs.cGroups, function(cg_obj) {
					if(cg_obj.id == result) {
						$scope.clientGroups = queryRs.clientGroups;

						angular.forEach(queryRs.clientGroups, function(cg) {
							if(cg.id == cg_obj.id) {
								$scope.clientGroup = cg;
							}
						});

						$scope.clients = data.clients[cg_obj.id];

						$scope.current = cg_obj.id;

						$scope.$watch($location.search(), function() {
							$location.search({
								id : cg_obj.id
							});
						});
					}
				});
			}

			$rootScope.statusBar.off();

		});
	}
	/**
	 * create new client group
	 */
	$scope.cGroupSubmit = function(cGroup) {

		if( typeof cGroup == 'undefined' || $.trim(cGroup.name) == '') {
			$rootScope.notifier.error($rootScope.ui.teamup.teamNamePrompt1);
			return;
		}

		$rootScope.statusBar.display($rootScope.ui.teamup.saveClientGroup);

		Clients.saveGroup(cGroup).then(function(result) {
			if(result.error) {
				$rootScope.notifier.error($rootScope.ui.teamup.cGroupSubmitError);
			} else {
				$rootScope.statusBar.display($rootScope.ui.teamup.refreshing);

				reloadGroup(result);
			}
		});
	}
	/**
	 * Close inline form
	 */
	$scope.closeTabs = function() {
		$scope.clientGroupForm = {};

		$scope.clientForm = {};

		setView('client');
	};
	/**
	 *  add contact to client locally.
	 */
	$scope.addContacts = function() {
		if( typeof $scope.contactForm == 'undefined' || $scope.contactForm.func == '') {
			$rootScope.notifier.error($rootScope.ui.teamup.teamNamePrompt2);
			return;
		}

		var contactPerson = {
			firstName : '',
			lastName : '',
			func : '',
			phone : ''
		};
		contactPerson.firstName = $scope.contactForm.firstName;
		contactPerson.lastName = $scope.contactForm.lastName;
		contactPerson.func = $scope.contactForm.func;
		contactPerson.phone = $scope.contactForm.phone;

		if( typeof $scope.contacts == 'undefined') {
			$scope.contacts = [];
		}

		$scope.contacts.push(contactPerson);
	}
	/**
	 * add new client
	 */
	$scope.clientSubmit = function(client) {
		if( typeof client == 'undefined' || !client.firstName || !client.lastName || !client.phone) {
			$rootScope.notifier.error($rootScope.ui.teamup.clinetInfoFill);
			return;
		}

		$rootScope.statusBar.display($rootScope.ui.teamup.savingClient);

		// might need to convert the client to client obj
		client.birthDate = Dater.convert.absolute(client.birthday, 0); 
		
		Clients.save(client).then(function(result) {
			if(result.error) {
				$rootScope.notifier.error($rootScope.ui.teamup.clientSubmitError);
			} else {
				reloadGroup(result);
			}
		});
	}
	
	/**
	 * edit client profile 
	 */
	$scope.clientChange = function(client){
		Clients.updateClient().then(function(result){
			if(result.error){
				$rootScope.notifier.error($rootScope.ui.teamup.clientSubmitError);
			}else{
				$rootScope.notifier.success($rootScope.ui.teamup.dataChanged);
			}
		});
	}
	
}]);
