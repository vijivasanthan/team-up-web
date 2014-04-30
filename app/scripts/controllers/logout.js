define(
	['controllers/controllers'],
	function (controllers)
	{
		'use strict';

		controllers.controller(
			'logout',
			[
				'$rootScope', '$scope', '$window', 'Session', 'User', 'Storage',
				function ($rootScope, $scope, $window, Session, User, Storage)
				{
					$('.navbar').hide();
					$('#footer').hide();

					var logindata = angular.fromJson(Storage.get('logindata'));

					User.logout()
						.then(
						function (result)
						{
							if (result.error)
							{
								console.warn('error ->', result);
							}
							else
							{
								// Storage.clearAll();

								Storage.session.clearAll();

								Storage.add('logindata', angular.toJson(logindata));

								Storage.cookie.clearAll();
								$window.location.href = 'logout.html';
							}
						});
				}
			]);

	}
);