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
        var ClientGroups =  $resource(
            $config.host + 'teamup/clientGroups/',
            {
            },
            {
              query: {
                method: 'GET',
                params: {},
                isArray: true
              },
              get: {
                method: 'GET',
                params: {id:''}
              },
              save: {
                method: 'POST',
                params: {id:''}
              },
              edit: {
                method: 'PUT',
                params: {id:''}
              },
              remove: {
                method: 'DELETE',
                params: {id:''}
              }
            }
         );
        
        
        var Clients_ByGroupId = $resource(
            $config.host + 'teamup/clientGroup/:clientGroupId/clients/',
            {},
            {
              get: {
                method: 'GET',
                params: {},
                isArray: true
              }
            }
         );
        
        var ClientGroup = $resource(
        	$config.host + 'teamup/clientGroup/:clientGroupId',
        	{},
        	{
        		save: {
        			method : 'POST',        		
        		},
        		edit: {
        			method : 'PUT',
        		}
        	}
        );
        
        var Client = $resource(
        	$config.host + 'teamup/client/:clientId',
        	{},
        	{
        		save:{
        		    method : 'POST',        		
        		},
        		edit: {
        		    method: 'PUT',
        		}
        	}
        );
        
        /**
         * get the client groups and the clients 
         */
        ClientGroups.prototype.query = function(only,routePara){
            var deferred = $q.defer();
            
            ClientGroups.query(
                function(cGroups){
                    Storage.add('ClientGroups', angular.toJson(cGroups));
                    
                    if (!only)
                    {
                      var calls = [];

                      angular.forEach(cGroups, function (clientGroup, index)
                      {
                      	if(routePara.uuid){
                      		if(routePara.uuid == clientGroup.id){
                      			calls.push(ClientGroups.prototype.get(clientGroup.id));
                      		}
                      	}else{
                      		calls.push(ClientGroups.prototype.get(clientGroup.id));
                      	}
                        
                      });

                      $q.all(calls)
                      .then(function (results)
                      {
//                        Teams.prototype.uniqueMembers();

                        var data = {};

                        data.clients = {};

                        angular.forEach(cGroups, function (cGroup, gindex)
                        {
                          data.clientGroups = cGroups;

                          data.clients[cGroup.id] = [];

                          angular.forEach(results, function (result, mindex)
                          {
                          	if(routePara.uuid){
                          		if (result.id == cGroup.id && routePara.uuid == cGroup.id) {
                          			data.clients[cGroup.id] = result.data;
                          		}else{
                          			data.clients[cGroup.id] = angular.fromJson(Storage.get(cGroup.id));
                          		}
                          	}else{
                          		if (result.id == cGroup.id ) {
                          			data.clients[cGroup.id] = result.data;
                          		}
                          	}
                            
                          });
                        });

                        if(typeof data.clientGroups == 'undefined'){
                            data.clientGroups = {};  
                        }
                        
                        deferred.resolve(data);
                      });
                    }
                    else
                    {
                      deferred.resolve(cGroups);
                    }
                    
                },
                function (error)
                {
                  console.log("Error" + error);
                  deferred.resolve({error: error});
                }
            );
            
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
        
        return new ClientGroups; 
    }
    
  
   
   
    
    
]);