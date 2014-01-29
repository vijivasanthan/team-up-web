'use strict';


angular.module('WebPaige.Modals.Clients', ['ngResource'])


/**
 * Teams modal
 */
.factory('Clients', 
[
    '$resource', '$config', '$q', 'Storage', '$rootScope', 
    function ($resource, $config, $q, Storage, $rootScope)
    {
        
		var ClientGroups = $resource($config.host + $config.namespace + '/client/clientGroups/', {
		}, {
			query : {
				method : 'GET',
				params : {},
				isArray : true
			},
			get : {
				method : 'GET',
				params : {
					id : ''
				}
			},
			save : {
				method : 'POST',
				params : {
					id : ''
				}
			},
			edit : {
				method : 'PUT',
				params : {
					id : ''
				}
			},
			remove : {
				method : 'DELETE',
				params : {
					id : ''
				}
			}
		});
	
		var Clients_ByGroupId = $resource($config.host + $config.namespace + '/client/clientGroup/:clientGroupId/clients/', {}, {
			get : {
				method : 'GET',
				params : {},
				isArray : true
			},
			save : {
				method : 'POST',
			},
			remove : {
				method : 'DELETE',
			}
		});
	
		var ClientGroup = $resource($config.host + $config.namespace + '/clientGroup/:clientGroupId', {}, {
			save : {
				method : 'POST',
			},
			edit : {
				method : 'PUT',
			},
			del : {
				method : 'DELETE',
			}
		});
	
		var Client = $resource($config.host + $config.namespace + '/client/:clientId', {}, {
			save : {
				method : 'POST',
			},
			edit : {
				method : 'PUT',
			},
			del : {
				method : 'DELETE'
			},
		});


        
        
		var Clients = $resource($config.host + $config.namespace + '/client/clients', {}, {
			query : {
				method : 'GET',
				params : {},
				isArray : true
			}
		});

		var ClientReports = $resource($config.host + $config.namespace + '/client/:clientId/reports', {}, {
            query : {
                method : 'GET',
                params : {},
                isArray : true
            }
        }); 
		
		var ClientsRemove = $resource($config.host + $config.namespace + '/client/clientGroup/:clientGroupId/removeClients/', {}, {
            remove : {
                method : 'PUT',
            }
        });
		
		var ClientGroupReports = $resource($config.host + $config.namespace + '/clientGroup/:clientGroupId/reports', {}, {
            query : {
                method : 'GET',
                params : {},
                isArray : true
            }
        });
        
        var GroupTasks = $resource($config.host + $config.namespace + '/clientGroup/:clientGroupId/tasks', {
		}, {
			query : {
				method : 'GET',
				params : {
					from : '',
					to: ''
				}
			}
		});
        
        var ClientReport = $resource($config.host + $config.namespace + '/client/:clientId/report', {
		}, {
			save : {
				method : 'POST',
			},
			remove : {
				method : 'DELETE',
				params : {reportId : ''}
			}
		}); 
        
  	  	var ClientImg = $resource(
          $config.host + $config.namespace + '/client/:clientId/photourl',{},{
            getURL: {
              method: 'GET',
              isArray: false              
            }
          }
        ); 
        
		/**
		 * get the client groups and the clients
		 */
		ClientGroups.prototype.query = function(only, routePara) {
			var deferred = $q.defer();

			ClientGroups.query(function(cGroups) {
				Storage.add('ClientGroups', angular.toJson(cGroups));

				if(!only) {
					var calls = [];

					angular.forEach(cGroups, function(clientGroup, index) {
						if(routePara.uuid) {
							if(routePara.uuid == clientGroup.id) {
								calls.push(ClientGroups.prototype.get(clientGroup.id));
							}
						} else {
							calls.push(ClientGroups.prototype.get(clientGroup.id));
						}

					});

					$q.all(calls).then(function(results) {
						//                        Teams.prototype.uniqueMembers();

						var data = {};

						data.clients = {};

						angular.forEach(cGroups, function(cGroup, gindex) {
							data.clientGroups = cGroups;

							data.clients[cGroup.id] = [];

							angular.forEach(results, function(result, mindex) {
								if(routePara.uuid) {
									if(result.id == cGroup.id && routePara.uuid == cGroup.id) {
										data.clients[cGroup.id] = result.data;
									} else {
										data.clients[cGroup.id] = angular.fromJson(Storage.get(cGroup.id));
									}
								} else {
									if(result.id == cGroup.id) {
										data.clients[cGroup.id] = result.data;
									}
								}

							});
						});
						if( typeof data.clientGroups == 'undefined') {
							data.clientGroups = {};
						}

						deferred.resolve(data);
					});
				} else {
					deferred.resolve(cGroups);
				}

			}, function(error) {
				console.log("Error" + error);
				deferred.resolve({
					error : error
				});
			});
			return deferred.promise;
		};


        
        /**
         * Get team data ( clients in the group)
         */
        ClientGroups.prototype.get = function (id)
        {   
          var deferred = $q.defer();

          Clients_ByGroupId.get(
            {clientGroupId : id}, 
            function (result) 
            {
              /**
               * DIRTY CHECK!
               * 
               * Check for 'null' return from back-end
               * if team is empty
               */
              var returned;

              if (result.length == 4 && 
                  result[0][0] == 'n' && 
                  result[1][0] == 'u')
              {
                returned = [];
              }
              else
              {
                returned = result;
              };

              Storage.add(id, angular.toJson(returned));

              deferred.resolve({
                id: id,
                data: returned
              });
            },
            function (error)
            {
              deferred.resolve({error: error});
            }
          );

          return deferred.promise;
        };
        
        /**
         * add new client group
         */
        ClientGroups.prototype.saveGroup = function(group){
        	var deferred = $q.defer();
        	
        	ClientGroup.save(
        		group,
        		function(result){
        			Storage.add(result.id, angular.toJson(result));
        			
        			deferred.resolve(result);
        		},function(error){
        			deferred.resolve({error: error});
        		}
        	);
        	
        	return deferred.promise;
        };
        
        /**
         * add new client 
         */
        ClientGroups.prototype.save = function(client){
        	var deferred = $q.defer();
        	
        	Client.save(
        		client,
        		function(result){
        			Storage.add(result.id, angular.toJson(result));
        			
        			deferred.resolve(result);
        		},function(error){
        			deferred.resolve({error: error});
        		}
        	);
        	
        	return deferred.promise;
        };
        
        /**
         * update client group
         */
        ClientGroups.prototype.edit = function(clientGroup){
        	var deferred = $q.defer();
		
		     /**
		      * Check if team id supplied
		      * if save submitted from add / edit form
		      */
		     if (clientGroup.id){
		       ClientGroup.edit({clientGroupId: clientGroup.id}, clientGroup, function (result) 
		       {
		         deferred.resolve(result);
		       });
		     }
		     
		     return deferred.promise;
        };
        
        /**
         * update client 
         */
        ClientGroups.prototype.updateClient = function(client){
        	var deferred = $q.defer();
        	
        	Client.edit(
        		{clientId: client.uuid },
        		client,
        		function(result){
        			deferred.resolve(result);
        		},function(error){
        			deferred.resolve({error: error});
        		}
        	);
        	
        	return deferred.promise;
        };
        
        
          
		/**
		 * Add Member to a team
		 */
		ClientGroups.prototype.addClient = function(id, memberIds) {
			var deferred = $q.defer();
			Clients_ByGroupId.save({
				clientGroupId : id
			}, memberIds, function(result) {
				deferred.resolve(result);
			}, function(error) {
				deferred.resolve({
					error : error
				});
			});
			return deferred.promise;
		};


		
		    
		/**
		 * Remove member from team
		 */
		ClientGroups.prototype.delClient = function(id, memberIds) {
			var deferred = $q.defer();
	
			ClientsRemove.remove({
				clientGroupId : id
			}, memberIds, function(result) {
				deferred.resolve(result);
			}, function(error) {
				deferred.resolve({
					error : error
				});
			});
			return deferred.promise;
		};

		
		// private function 
		var getClientFromLocal = function(clientId){
			var ret;
			var cGrps = angular.fromJson(Storage.get("ClientGroups"));
			angular.forEach(cGrps,function(cGrp,i){
				var clients = angular.fromJson(Storage.get(cGrp.id));
				angular.forEach(clients,function(client,j){
					if(client.uuid == clientId){
						ret = client;
					}
				});
			});
			return ret;
		};
		
		/**
		 * add or remove the clientfrom the client group
		 */
		ClientGroups.prototype.manage = function(changes) {
			var deferred = $q.defer();
		
			var calls = [];
		
			angular.forEach(changes, function(change, clientGroupId) {
				if(change.a.length > 0) {
					calls.push(ClientGroups.prototype.addClient(clientGroupId, {
						ids : change.a
					}));
				}
				if(change.r.length > 0) {
					calls.push(ClientGroups.prototype.delClient(clientGroupId, {
						ids : change.r
					}));
				}
			});
		
			$q.all(calls).then(function(results) {
				//                Teams.prototype.uniqueMembers();
				var queryCalls = [];
		
				var data = {};
		
				var refreshGroups = [];
				angular.forEach(changes, function(change, clientGroupId) {
					// refresh the groups that used to have the client inside. 
					refreshGroups.add(clientGroupId);
					if(change.a.length > 0){
						angular.forEach(change.a,function(clientId){
							var client = getClientFromLocal(clientId);
							if(typeof client != 'undefined' && refreshGroups.indexOf(client.clientGroupUuid) == -1){
								refreshGroups.add(client.clientGroupUuid);
								queryCalls.push(ClientGroups.prototype.get(client.clientGroupUuid));
							}
						});
					}
					
					queryCalls.push(ClientGroups.prototype.get(clientGroupId));
				});
		
				$q.all(queryCalls).then(function(results) {
					deferred.resolve(data);
				});
			});
			return deferred.promise;
		};


				
		/**
		 * get all the clients , in or not in the client gourps
		 */
		ClientGroups.prototype.queryAll = function(changes) {
			var deferred = $q.defer();
	
			Clients.query(function(clients) {
				Storage.add('clients', angular.toJson(clients));
				deferred.resolve(clients);
			}, function(error) {
				deferred.resolve({
					error : error
				});
			});
	
			return deferred.promise;
		};

	
	
		/**
		 * get reports by the client id
		 */
		ClientGroups.prototype.queryReports = function(cId) {
			var deferred = $q.defer();

			ClientReports.query({
				clientId : cId
			}, function(reports) {
				Storage.add('reports_' + cId, angular.toJson(reports));
				deferred.resolve(reports);
			}, function(error) {
				deferred.resolve({
					error : error
				});
			});
			return deferred.promise;
		}; 

	
      
	
		/**
		 * try  to preload the image from here, that ng-src can use the cache.
		 */
		ClientGroups.prototype.loadImg = function(imgURL) {

			var LoadImg = $resource(imgURL, {
			}, {
				get : {
					method : 'GET',
				}
			});

			var deferred = $q.defer();

			LoadImg.get(function(result) {
				deferred.resolve(result);
			}, function(error) {
				deferred.resolve(error);
			});
			return deferred.promise;
		}; 

	
	
		/**
		 * get client groups and clients from local storage
		 */
		ClientGroups.prototype.queryLocal = function() {
			var deferred = $q.defer();

			var clientGroups_local = angular.fromJson(Storage.get("ClientGroups"));

			var data = {};
			data.clientGroups = clientGroups_local;

			data.clients = {};
			angular.forEach(clientGroups_local, function(clientGroup, i) {
				var clients = angular.fromJson(Storage.get(clientGroup.id));
				data.clients[clientGroup.id] = clients;
			});

			deferred.resolve(data);

			return deferred.promise;
		}; 

		/**
		 * get reports by the client group Id
		 */
		ClientGroups.prototype.queryGroupReports = function(cId) {
			var deferred = $q.defer();
			
			ClientGroupReports.query({
				clientGroupId : cId
			}, function(reports) {
//				Storage.add('reports_' + cId, angular.toJson(reports));
				
				deferred.resolve(reports);
			}, function(error) {
				deferred.resolve({
					error : error
				});
			});
			
			return deferred.promise;
		};
		
	
		/**
		 * get  the client group for specific team
		 */
		ClientGroups.prototype.getClientTasks = function(id, start, end) {
			var deferred = $q.defer();

			GroupTasks.query({
				clientGroupId : id,
				from : start,
				to : end
			}, function(result) {

				deferred.resolve(result);
			}, function(error) {
				deferred.resolve({
					error : error
				});
			});

			return deferred.promise;
		}; 
		
		/**
		 * delete the client group 
		 */
		ClientGroups.prototype.deleteClientGroup = function(id){
			var deferred = $q.defer();

			ClientGroup.del({
				clientGroupId : id				
			}, function(result) {
				var rs = angular.fromJson(result)
				deferred.resolve(rs);
			}, function(error) {
				deferred.resolve({
					error : error
				});
			});

			return deferred.promise;
		}
		
		ClientGroups.prototype.deleteClient = function(id){
			var deferred = $q.defer();

			Client.del({
				clientId : id				
			}, function(result) {
				var rs = angular.fromJson(result)
				deferred.resolve(rs);
			}, function(error) {
				deferred.resolve({
					error : error
				});
			});

			return deferred.promise;
		};
		
		// add or edit report
		ClientGroups.prototype.saveReport = function(id,report){
			var deferred = $q.defer();

			ClientReport.save({
				clientId : id				
			}, report,function(result) {
				var rs = angular.fromJson(result)
				deferred.resolve(rs);
			}, function(error) {
				deferred.resolve({
					error : error
				});
			});

			return deferred.promise;
		};
		
		// remove the report
		ClientGroups.prototype.removeReport = function(cId,rId){
			var deferred = $q.defer();
			ClientReport.remove({
				clientId : cId,
				reportId : rId
			},function(result){
				var rs = angular.fromJson(result)
				deferred.resolve(rs);
			},function(error){
				deferred.resolve({
					error : error
				});
			});
			
			return deferred.promise;
		};
		

		/**
		 * get the upload URL
		 */
		ClientGroups.prototype.loadUploadURL = function(id) {
			var deferred = $q.defer();

			ClientImg.getURL({
				clientId : id
			}, function(result) {
				deferred.resolve(result);
			}, function(error) {
				deferred.resolve({
					error : error
				});
			});
			return deferred.promise;
		};
	

        return new ClientGroups; 
    }
    
  
   
   
    
    
]);