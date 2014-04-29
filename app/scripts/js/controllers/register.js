/*jslint node: true */
/*global angular */
'use strict';


angular.module('WebPaige.Controllers.Register', [])


/**
 * Forgot password controller
 */
.controller('register',
[
	'$rootScope', '$scope', '$location',
	function ($rootScope, $scope, $location)
	{
		/**
		 * Fix styles
		 */
		$rootScope.fixStyles();

	}
]);