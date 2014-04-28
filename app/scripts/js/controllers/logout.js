/*jslint node: true */
/*global angular */
'use strict';


angular.module('WebPaige.Controllers.Logout', [])


/**
 * Logout controller
 */
.controller('logout', 
[
	'$rootScope', '$scope', '$window', 'Session', 'User', 'Storage', 
	function ($rootScope, $scope, $window, Session, User, Storage) 
	{
	  $('.navbar').hide();
    $('#footer').hide();
    // $('#notification').hide();

    var logindata = angular.fromJson(Storage.get('logindata'));
    var registeredNotifications = angular.fromJson(Storage.get('registeredNotifications'));

		User.logout()
		.then(function (result)
		{
	    if (result.error)
	    {
	      console.warn('error ->', result);
	    }
	    else
	    {
	      Storage.clearAll();

	      Storage.session.clearAll();

        Storage.add('logindata', angular.toJson(logindata));
        Storage.add('registeredNotifications', angular.toJson(registeredNotifications));

	      $window.location.href = 'logout.html';
	    }
		});
	}
]);