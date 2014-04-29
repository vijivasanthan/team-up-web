/*jslint node: true */
/*global angular */
'use strict';


angular.module('WebPaige.Controllers.Forgotpass', [])


/**
 * Forgot password controller
 */
.controller('forgotpass',
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