define(
	['services/services', 'config'],
	function (services, config)
	{
		'use strict';

		services.factory(
			'User',
			[
				'$resource', '$q', '$location', 'Storage',
				function ($resource, $q, $location, Storage)
				{
					var User = $resource();

					var Login = $resource(
							config.app.host + config.app.namespace + '/login',
							{},
							{
								process: {
									method: 'GET',
									params: {
										uuid: '',
										pass: ''
									}
								}
							}
					);

					var Logout = $resource(
							config.app.host + 'logout',
							{},
							{
								process: {
									method:  'GET',
									params:  {},
									isArray: true
								}
							}
					);

					var MemberInfo = $resource(
							config.app.host + config.app.namespace + '/team/member',
							{},
							{
								get: {
									method: 'GET',
									params: {}
								}
							}
					);

					var Reset = $resource(
							config.app.host + '/passwordReset',
							{},
							{
								password: {
									method: 'GET',
									params: {
										uuid: '',
										path: ''
									}
								}
							}
					);

					User.prototype.password = function (uuid)
					{
						var deferred = $q.defer();

						Reset.password(
							{
								uuid: uuid.toLowerCase(),
								path: $location.absUrl()
							},
							function (result)
							{
								if (angular.equals(result, []))
								{
									deferred.resolve("ok");
								}
								else
								{
									deferred.resolve(result);
								}
							},
							function (error) { deferred.resolve({error: error}) }
						);

						return deferred.promise;
					};

					User.prototype.login = function (username, passwordHash)
					{
						var deferred = $q.defer();

						Login.process(
							{
								uuid: username,
								pass: passwordHash
							},
							function (result)
							{
								if (angular.equals(result, []))
								{
									deferred.reject("Something went wrong with login!");
								}
								else
								{
									deferred.resolve(result);
								}
							},
							function (error) { deferred.resolve({error: error}) }
						);

						return deferred.promise;
					};

					User.prototype.logout = function ()
					{
						var deferred = $q.defer();

						Logout.process(
							null,
							function (result)
							{
								deferred.resolve(result);
							},
							function (error) { deferred.resolve({error: error}) }
						);

						return deferred.promise;
					};

					User.prototype.memberInfo = function ()
					{
						var deferred = $q.defer();

						MemberInfo.get(
							null,
							function (result)
							{
								if (angular.equals(result, []))
								{
									deferred.reject("User has no resources!");
								}
								else
								{
									Storage.add('resources', angular.toJson(result));

									deferred.resolve(result);
								}
							},
							function (error) { deferred.resolve({error: error}) }
						);

						return deferred.promise;
					};

					return new User;
				}
			]
		);
	}
);