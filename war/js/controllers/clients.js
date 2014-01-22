/*jslint node: true */
/*global angular */'use strict';

angular.module('WebPaige.Controllers.Clients', [])

/**
 * Groups controller
 */.controller('clientCtrl', ['$rootScope', '$scope', '$location', 'Clients', 'data', '$route', '$routeParams', 'Storage','Dater','$filter','$modal','Teams',
function($rootScope, $scope, $location, Clients, data, $route, $routeParams, Storage,Dater,$filter,$modal, Teams) {
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
					client.birthDate = $filter('nicelyDate')(client.birthDate)
					$scope.clientmeta = client;
				}
			});
		});
	}

	$scope.clients = data.clients;
	$scope.clientGroups = data.clientGroups;
	
	// process month dropdown list
	var Months = Dater.getMonthTimeStamps();
	$scope.Months = [];
	angular.forEach(Months,function(mon,i){
		var newMon = {number : i,
				name : i,
				start : mon.first.timeStamp,
				end : 	mon.last.timeStamp};
		$scope.Months[i] = newMon;
	});
	
	$scope.Months[0] = {number: 0 , name : $rootScope.ui.teamup.selectMonth};
	
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
		editImg : false,
	}
	
	/**
	 * View setter
	 */
	var setView = function(hash) {
		$scope.views = {
			client : false,
			newClientGroup : false,
			newClient : false,
			reports : false,
			editImg:  false,
		};

		//load the reports on this view 
        if(hash == "viewClient"){
            loadReports();
        }
		
        if(hash == "reports"){
        	loadGroupReports();
        }
        
		$scope.views[hash] = true;
        
	}
	
	/**
	 * load the reports by the client ID
	 */
    var loadReports = function(){
        $rootScope.statusBar.display($rootScope.ui.teamup.loadingReports);
        Clients.queryReports($scope.client.uuid).then(function(reports){
            $rootScope.statusBar.off();
            $scope.reports = $scope.processReports(reports);
            
            $scope.$watch($scope.reports,function(rs){
            	console.log("watcher found ... " , rs);
            	$scope.loadMembersImg();
            });
            
        },function(error){
           console.log(error); 
        });
    }
    
    /**
	 *  load the reports by the client group ID
	 */
    var loadGroupReports = function(){
    	$rootScope.statusBar.display($rootScope.ui.teamup.loadingReports);
    	
    	Clients.queryGroupReports($scope.clientGroup.id).then(function(reports){
            $rootScope.statusBar.off();
            $scope.groupReports = $scope.processReports(reports);
            
            if($scope.currentCLient != 0){
            	$scope.requestReportsByFilter();
            }
            
            $scope.$watch($scope.groupReports,function(rs){
            	console.log("watcher found ... " , rs);
            	$scope.loadMembersImg();
            });
        },function(error){
           console.log(error); 
        });
    	
    }
	
    $scope.loadMembersImg = function(){
		// load the team members image
			
			var memberIds = [];
			angular.forEach($scope.groupReports, function(rept,i){
				if(memberIds.indexOf(rept.author.uuid) == -1){
					memberIds.add(rept.author.uuid);
				}
			});
			angular.forEach($scope.reports, function(rept,i){
				if(memberIds.indexOf(rept.author.uuid) == -1){
					memberIds.add(rept.author.uuid);
				}
			});
			angular.forEach(memberIds , function(memberId,j){
				var imgURL = $scope.imgHost+"teamup/team/member/"+memberId+"/photo";
				Teams.loadImg(imgURL).then(function(result){
					// console.log("loading pic " + imgURL);
					
					var imgId = memberId.replace(".","").replace("@","");
					if(result.status && (result.status == 404 || result.status == 403 || result.status == 500) ){
						console.log("no pics " ,result);
					}else{
						if(result.path){
							var avatarURL = $scope.imgHost + result.path; 
							$('.tab-content #img_'+imgId).css('background-image','url('+avatarURL+')');
						}
					}
					
				},function(error){
					console.log("error when load pic " + error);
				});
			});
	   }
    
	/**
	 * Set view
	 */
	setView(view);
	
	/**
	 * Set group
	 */
	setClientView(uuid);
	
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
		
		// show reports of this groups 
		if($scope.views.reports){
			//reset the filter 
			$scope.currentCLient = '0';
			$scope.currentMonth = '0';
			
			loadGroupReports();
		}

		// load image 
		if($scope.views.client){
			angular.forEach($scope.clients, function(client, index) {
	            var imgURL = $scope.imgHost+"teamup/client/"+client.uuid+"/photo";
	            
	            Clients.loadImg(imgURL).then(function(result){
	                // console.log("loading pic " + imgURL);
	                var imgId = client.uuid.replace(".","").replace("@","");
	                if(result.status && (result.status == 404 || result.status == 403 || result.status == 500) ){
	                    console.log("loading pic " ,result);
	                }else{
	                	//imgURL = imgURL.replace("\\:",":");
	                	if(result.path){
	                		var avatarURL = $scope.imgHost + result.path; 
	                		$('#img_'+imgId).css('background-image','url('+avatarURL+')');
	                	}
	                }
	                
	            },function(error){
	                console.log("error when load pic " + error);
	            });
	        });
		}
        
		// load the image in the client profile page 
		if($scope.views.viewClient){
			var imgURL = $scope.imgHost+"teamup/client/"+$scope.client.uuid+"/photo";
			
			Clients.loadImg(imgURL).then(function(result){
                // console.log("loading pic " + imgURL);
                var imgId = $scope.client.uuid.replace(".","").replace("@","");
                if(result.status && (result.status == 404 || result.status == 403 || result.status == 500) ){
                    console.log("loading pic " ,result);
                }else{
                	// imgURL = imgURL.replace("\\:",":");
                	if(result.path){
                		var avatarURL = $scope.imgHost + result.path;
                		$('#viewClientTab #img_'+imgId).css('background-image','url('+avatarURL+')');
                	}
                }
                
            },function(error){
                console.log("error when load pic " + error);
            });			
		}
        
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
	
	$scope.processReports = function(reports){
		var rpts = [];
		angular.forEach(reports,function(report,i){
			var newReport = {uuid : report.uuid, 
				title : report.title,
				creationTime : report.creationTime,
				clientUuid : report.clientUuid,
				body : report.body,
				author: $scope.$root.getTeamMemberById(report.authorUuid),
				client: $scope.$root.getClientByID(report.clientUuid),
				filtered: "false"};
			
			rpts.add(newReport);
		});
		return rpts;
	}
		
	/**
	 * Switch between the views and set hash accordingly
	 */
	$scope.setViewTo = function(hash) {
		$scope.$watch(hash, function() {
			if(!$scope.clientGroup){
				$scope.clientGroup = $scope.clientGroups[0]
			}
			if(($location.hash() == "viewClient" || $location.hash() == "editClient" || $location.hash() == "editImg") && hash == "client"){
				$location.path("/client").search({uuid : $scope.clientGroup.id});
			}
		
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
		Clients.query(false,result).then(function(queryRs) {
			if(queryRs.error) {
				$rootScope.notifier.error($rootScope.ui.teamup.queryCGroupError);
				console.warn('error ->', queryRs);
			} else {
				$rootScope.notifier.success($rootScope.ui.teamup.dataChanged);
				$scope.closeTabs();

				$scope.data = queryRs;
				
				$scope.clientGroups = queryRs.clientGroups;
				$scope.clients = queryRs.clients;
				
				angular.forEach(queryRs.clientGroups, function(cg_obj) {
					if(cg_obj.id == result.uuid) {
						
					    $scope.clientGroup = cg_obj;

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
				var routePara = {'uuid' : result.id};
				reloadGroup(routePara);
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
			function : '',
			phone : ''
		};
		contactPerson.firstName = $scope.contactForm.firstName;
		contactPerson.lastName = $scope.contactForm.lastName;
		contactPerson.function = $scope.contactForm.function;
		contactPerson.phone = $scope.contactForm.phone;

		if( typeof $scope.contacts == 'undefined') {
			$scope.contacts = [];
		}

		if($scope.contacts == null){
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
		try{
			client.birthDate = Dater.convert.absolute(client.birthDate, 0);
		}catch(error){
			console.log(error);
			$rootScope.notifier.error($rootScope.ui.teamup.birthdayError);
			return;
		}
		
		client.clientGroupUuid = $scope.clientGroup.id; 
		
		Clients.save(client).then(function(result) {
			if(result.error) {
				$rootScope.notifier.error($rootScope.ui.teamup.clientSubmitError);
			} else {
				var routePara = {'uuid' : result.clientGroupUuid};
				reloadGroup(routePara);
			}
		});
	}
	
	/**
	 * edit client profile 
	 */
	$scope.clientChange = function(client){
	    $rootScope.statusBar.display($rootScope.ui.teamup.savingClient);
	    
		try{
			client.birthDate = Dater.convert.absolute(client.birthDate, 0);
		}catch(error){
			console.log(error);
			$rootScope.notifier.error($rootScope.ui.teamup.birthdayError);
			return;
		}
		
		Clients.updateClient(client).then(function(result){
			if(result.error){
				$rootScope.notifier.error($rootScope.ui.teamup.clientSubmitError);
			}else{
			    $rootScope.statusBar.display($rootScope.ui.teamup.refreshing);
			    
				$rootScope.notifier.success($rootScope.ui.teamup.dataChanged);
				var routePara = {'uuid' : result.clientGroupUuid}; 
				reloadGroup(routePara);
			}
		});
	}
	
	/**
	 * save the contacts for the client
	 */
	$scope.saveContacts = function(contacts){
		console.log("client id " , $scope.client.uuid ); 
		console.log("contacts " , contacts);
        
		var client = $scope.client;
		
		try{
            client.birthDate = Dater.convert.absolute(client.birthDate, 0);
        }catch(error){
            console.log(error);
            $rootScope.notifier.error($rootScope.ui.teamup.birthdayError);
            return;
        }
		
		client.contacts = contacts;
		
		$rootScope.statusBar.display($rootScope.ui.teamup.savingContacts);
		
        Clients.updateClient(client).then(function(result){
            if(result.error){
                $rootScope.notifier.error($rootScope.ui.teamup.clientSubmitError);
            }else{
                
                $rootScope.notifier.success($rootScope.ui.teamup.dataChanged);
                $rootScope.statusBar.off();
//                
                var routePara = {'uuid' : result.clientGroupUuid};
                Clients.query(false,routePara).then(function(queryRs) {});
                
            }
            $scope.client.birthDate = $filter('nicelyDate')($scope.client.birthDate);
        });
	}
	
	/**
	 * remove this line of contact info
	 */
	$scope.removeContact = function(contact){
		angular.forEach($scope.contacts,function(ctc,i){
			if(contact.name == ctc.name && contact.func == ctc.func && contact.phone == ctc.phone){
				$scope.contacts.splice(i,1);
			}
		});
	}
	
	/**
	 * delete the client group  
	 */
	$scope.deleteClientGroup = function(){
		if(window.confirm($rootScope.ui.teamup.delClientGroupConfirm)){
			
			$rootScope.statusBar.display($rootScope.ui.teamup.deletingClientGroup);
			
			Clients.deleteClientGroup($scope.current).then(function(result){
				if(result.id){
					Clients.query(true,{}).then(function(clientGroups){
						$scope.requestClientGroup(clientGroups[0].id);
						
						angular.forEach($scope.clientGroups,function(cg,i){
							if(cg.id == result.id){
								$scope.clientGroups.splice(i,1); 
							}
						});
					},function(error){
						console.log(error);
					});
					
				}
				
				$rootScope.notifier.success($rootScope.ui.teamup.dataChanged);
                $rootScope.statusBar.off();
			},function(error){
				console.log(error);
			});
		}
	}
	
	/**
	 *  delete the client 
	 */
	$scope.deleteClient = function(clientId){
		if(window.confirm($rootScope.ui.teamup.deleteConfirm)){
			$rootScope.statusBar.display($rootScope.ui.teamup.deletingClient);
			
			// client lost the client group ID, remove this client from the group first
			angular.forEach($scope.clients, function(clt,i){
				if(clt.uuid == clientId){
					var clientGroupId = clt.clientGroupUuid; 
					if(clientGroupId == null || clientGroupId == ""){
						clientGroupId = $scope.clientGroup.id;
					}
					
					var changes = {};
					var clientIds = [];
					var emptyAddIds = []; 
					clientIds.add(clientId);
					changes[clientGroupId] = {a : emptyAddIds, r : clientIds};
					if(clientGroupId != null && clientGroupId != "" && clientGroupId != $scope.clientGroup.id){
						changes[$scope.clientGroup.id] = {a : emptyAddIds, r : clientIds};
					}
					Clients.manage(changes).then(function(result){
						// delete the client 
						Clients.deleteClient(clientId).then(function(){
							Clients.queryAll().then(function(){
								if($scope.views.viewClient == true){
									$scope.setViewTo("client");
								}else{
									$route.reload();
								}
							});
						},function(error){
							console.log(error);
						});
					});
					
				}
			});

		}
	}
	
	$scope.requestReportsByFilter = function(){
		
		angular.forEach($scope.groupReports,function(report,i){
			// filter need to be checked 
			// client Id, month
			if(report.clientUuid != $scope.currentCLient && $scope.currentCLient != "0"){
				report.filtered = "true";
			}else{
				report.filtered = "false";
			}
			
			var reportMonth = new Date(report.creationTime).getMonth() + 1; 
			
			if( ( reportMonth != $scope.currentMonth && $scope.currentMonth != "0") 
					|| report.filtered == "true"){
				report.filtered = "true";
			}else{
				report.filtered = "false";
			}
			
		});
		
		$scope.loadMembersImg();
	}
	
	
	var ModalInstanceCtrl = function($scope, $modalInstance, report) {
		
		$scope.report = report;
		
		$scope.view = {
			editReport : (report.editMode)? true : false,
			viewReport : (report.editMode || typeof report.uuid == 'undefined')? false : true,
			newReport : (typeof report.uuid == 'undefined')? true : false ,
		};
		
		$scope.close = function() {
			$modalInstance.dismiss();
		};
	
		$scope.saveReport = function(report) {
			console.log("save report");
			console.log(Clients);
			var paraObj = {uuid : report.uuid,
					title : report.title,
					body : report.body,
					creationTime : report.creationTime/1000
					};
			
			Clients.saveReport(report.clientUuid,paraObj).then(function(result){								
				$modalInstance.close(report);
				$rootScope.notifier.success($rootScope.ui.teamup.dataChanged);
			});
		};
	};
	
	$scope.openReport = function(report) {
		$scope.report = report;
		$scope.report.editMode = false;
		
		var modalInstance = $modal.open({
			templateUrl : './js/views/reportTemplate.html',
			controller : ModalInstanceCtrl,
			resolve : {
				report : function() {
					return $scope.report;
				}
			}
		});

	};
	
	$scope.newReport = function(){
		if($scope.currentCLient == 0){
			$rootScope.notifier.error($rootScope.ui.teamup.selectClient);
			return;
		}
		
		var newReport = { 
				title : $rootScope.ui.teamupnewReport,
				creationTime : new Date().getTime(),
				clientUuid : $scope.currentCLient,
				body : null,
				author: $scope.$root.getTeamMemberById($rootScope.app.resources.uuid),
				client: $scope.$root.getClientByID($scope.currentCLient),
				editMode: false};
		
		$scope.report = newReport;
		
		var modalInstance = $modal.open({
			templateUrl : './js/views/reportTemplate.html',
			controller : ModalInstanceCtrl,
			resolve : {
				report : function() {
					return $scope.report;
				},
				editMode : false
			}
		});
		
		modalInstance.result.then(function(report) {
			console.log('Modal close at: ' + new Date());
			loadGroupReports();
		}, function() {
			console.log('Modal dismissed at: ' + new Date());
		});
	}
	
	$scope.editReport = function(report){
		$scope.report = report;
		$scope.report.editMode = true;
		var modalInstance = $modal.open({
			templateUrl : './js/views/reportTemplate.html',
			controller : ModalInstanceCtrl,
			resolve : {
				report : function() {
					return $scope.report;
				}
			}
		});
	}
	
	$scope.removeReport = function(report){
		if(window.confirm($rootScope.ui.teamup.deleteConfirm)){
			$rootScope.statusBar.display($rootScope.ui.teamup.loading);
			Clients.removeReport(report.clientUuid,report.uuid).then(function(rs){
				console.log(rs);
				if(rs.result == "ok"){
					$rootScope.notifier.success($rootScope.ui.teamup.dataChanged);
					loadGroupReports();
				}else{
					$rootScope.notifier.error(rs.error);
				}
			},function(error){
				console.log(error);
			});
		}
	}
		
	/**
	 * load the dynamic upload URL for GAE
	 */
	$scope.editImg = function() {
		$rootScope.statusBar.display($rootScope.ui.profile.loadUploadURL);
		  $scope.uploadURL = $scope.imgHost+"teamup/client/"+$scope.client.uuid+"/photo";
		  Clients.loadImg($scope.uploadURL).then(function(result){
			  $rootScope.statusBar.off();
			  
			  var imgHost = $scope.imgHost.replace("\\:",":");
			  if(result.path){
				  $scope.avatarURL = imgHost+result.path;
			  }
			  $scope.uploadURL = imgHost+"teamup/client/"+$scope.client.uuid+"/photo";
			  $scope.setViewTo('editImg');
		  });
	
	}

	  
	
}]);
