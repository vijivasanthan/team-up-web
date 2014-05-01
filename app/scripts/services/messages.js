define(
	['services/services', 'config'],
	function (services, config)
	{
		'use strict';

		services.factory(
			'Messages', [
				'$rootScope', '$resource', '$q',
				function ($rootScope, $resource, $q)
				{
					var Messages = $resource(
							config.app.host + config.app.namespace + '/team/teamMessage/',
							{},
							{
								query:       {
									method:  'GET',
									params:  {
										action: '',
										// 0: 'dm'
										0:      'all',
										status: 'READ',
										limit:  50,
										offset: 0
									},
									isArray: true
								},
								get:         {
									method: 'GET',
									params: {}
								},
								send:        {
									method: 'POST'
								},
								save:        {
									method: 'POST',
									params: {}
								},
								changeState: {
									method: 'POST',
									params: {
										action: 'changeState'
									}
								},
								remove:      {
									method: 'POST',
									params: {
										action: 'deleteQuestions'
									}
								}
							}
					);

					var TeamMessage = $resource(
							config.app.host + config.app.namespace + '/team/teamMessage/:teamId',
							{},
							{
								query: {
									method:  'GET',
									params:  {},
									isArray: true
								}
							}
					);


					Messages.prototype.queryTeamMessage = function (tId)
					{
						var deferred = $q.defer();

						TeamMessage.query(
							{
								teamId: tId
							},
							function (result)
							{
								deferred.resolve(result);
							},
							function (error) { deferred.resolve({error: error}) }
						);

						return deferred.promise;
					};


					Messages.prototype.sendTeamMessage = function (messageObj)
					{
						var deferred = $q.defer();

						Messages.send(
							messageObj,
							function (result)
							{
								deferred.resolve(result);
							},
							function (error) { deferred.resolve({error: error}) }
						);

						return deferred.promise;
					};


					return new Messages;
				}
			]
		);
	}
);