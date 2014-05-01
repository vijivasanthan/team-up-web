define(
	['services/services'],
	function (services)
	{
		'use strict';

		services.factory(
			'TeamUp',
			[
				'$resource', '$q', '$location', '$rootScope', 'Log',
				function ($resource, $q, $location, $rootScope, Log)
				{
					var TeamUp = $resource(
							$rootScope.config.host + '/:action/:level/:node',
							{},
							{
								register:       {
									method: 'GET',
									params: {
										action:       'register',
										name:         '',
										username:     '',
										password:     '',
										phone:        '',
										verification: ''
									}
								},
								userExists:     {
									method: 'GET',
									params: {
										action:   'user_exists',
										username: ''
									}
								},
								registerVerify: {
									method: 'GET',
									params: {
										action: 'register_verify',
										id:     '',
										code:   ''
									}
								},
								resendVerify:   {
									method: 'GET',
									params: {
										action:       'resend_verify',
										code:         '',
										verification: ''
									}
								},

								login:  {
									method: 'GET',
									params: {
										action:   'login',
										username: '',
										password: ''
									}
								},
								logout: {
									method: 'GET',
									params: {
										action: 'logout'
									}
								},

								authorizedApp: {
									method: 'GET',
									params: {
										action: 'authorized_app'
									}
								},

								info: {
									method: 'GET',
									params: {
										action: 'info'
									}
								},

								getDialog:    {
									method:  'GET',
									params:  {
										action: 'dialog'
									},
									isArray: true
								},
								createDialog: {
									method: 'POST',
									params: {
										action: 'dialog'
									}
								},
								updateDialog: {
									method: 'PUT',
									params: {
										action: 'dialog',
										level:  ''
									}
								},
								deleteDialog: {
									method: 'DELETE',
									params: {
										action: 'dialog'
									}
								},

								getAdapters:   {
									method:  'GET',
									params:  {
										action: 'adapter'
									},
									isArray: true
								},
								createAdapter: {
									method: 'POST',
									params: {
										action: 'adapter',
										level:  ''
									}
								},
								updateAdapter: {
									method: 'PUT',
									params: {
										action: 'adapter',
										level:  ''
									}
								},
								removeAdapter: {
									method: 'DELETE',
									params: {
										action: 'adapter',
										level:  ''
									}
								},
								freeAdapters:  {
									method:  'GET',
									params:  {
										action: 'free_adapters'
									},
									isArray: true
								},

								key:            {
									method: 'GET',
									params: {
										action: 'key'
									}
								},
								getAccessToken: {
									method: 'POST',
									params: {
										action: 'keyserver',
										level:  'token'
									}
								},
								log:            {
									method:  'GET',
									params:  {
										action: 'log'
									},
									isArray: true
								}
							}
					);

					TeamUp.prototype.caller = function (proxy, params, data, callback)
					{
						var deferred = $q.defer();

						params = params || {};

						try
						{
							TeamUp[proxy](
								params,
								data,
								function (result)
								{
									if (callback && callback.success) callback.success.call(this, result);

									deferred.resolve(result);
								},
								function (result)
								{
									if (callback && callback.error) callback.error.call(this, result);

									deferred.resolve({error: result});
								}
							);
						}
						catch (err) { Log.error(err) }

						return deferred.promise;
					};

					return new TeamUp();
				}
			]
		);
	}
);