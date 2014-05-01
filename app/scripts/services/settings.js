define(
	['services/services'],
	function (services)
	{
		'use strict';

		services.factory(
			'Settings',
			[
				'$rootScope', '$resource', '$q', 'Storage', 'Profile',
				function ($rootScope, $resource, $q, Storage, Profile)
				{
					var Settings = $resource();

					Settings.prototype.get = function ()
					{
						return angular.fromJson(Storage.get('resources')).settingsWebPaige || {};
					};

					Settings.prototype.save = function (id, settings)
					{
						var deferred = $q.defer();

						Profile.save(
							id, {
								settingsWebPaige: angular.toJson(settings)
							})
							.then(
							function ()
							{
								deferred.resolve(
									{
										saved: true
									});
							});

						return deferred.promise;
					};

					return new Settings;
				}
			]
		);
	}
);