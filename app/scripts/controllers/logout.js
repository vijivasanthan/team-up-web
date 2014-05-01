define(
	['controllers/controllers'],
	function (controllers)
	{
		'use strict';

		controllers.controller(
			'logout',
			[
				'$rootScope', '$scope', '$window', 'Session', 'Storage', 'TeamUp',
				function ($rootScope, $scope, $window, Session, Storage, TeamUp)
				{
					$('.navbar').hide();
					$('#footer').hide();

					var logindata = angular.fromJson(Storage.get('logindata'));

					TeamUp.caller('logout')
						.then(
						function (result)
						{
							if (result.error)
							{
								console.warn('error ->', result);
							}
							else
							{
								Storage.session.clearAll();

								Storage.add('logindata', angular.toJson(logindata));

								Storage.cookie.clearAll();

								$window.location.href = 'logout.html';
							}
						}
					);
				}
			]
		);
	}
);