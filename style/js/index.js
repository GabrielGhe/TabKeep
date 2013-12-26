/* ###############################################################################
 * ##																			##
 * ##						@author: Gabriel Gheorghian							##
 * ##																			##
 * ############################################################################### */

var MyApp = angular.module('MyApp', ['ui.bootstrap']);

//config routing
MyApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
	$routeProvider
	.when('/', { templateUrl: 'partials/save.html', controller: "SaveController"})
	.when('/search', { templateUrl: 'partials/search.html', controller: "SearchController"})
	.otherwise({ redirectTo: '/'});
}]);


/* ###############################################################################
 * ##																			##
 * ##							Save Controller									##
 * ##																			##
 * ############################################################################### */

//controllers
MyApp.controller("SaveController",['$scope', '$location', function($scope, $location){

	/* VARIABLE DECLARATIONS ########################### */

	
	/*  METHOD DECLARATIONS ########################### */
	

	/**
	 * Method used to go to different routes
	 * @param  {String} hash [New url]
	 */
	$scope.go = function ( hash ) {
		$location.path(hash);
	};
}]);


/* ###############################################################################
 * ##																			##
 * ##						QuizUsage Controller								##
 * ##																			##
 * ############################################################################### */

MyApp.controller("SearchController", ['$scope','$location', function($scope, $location){

	/**
		Method used to go to different routes
	 */
	$scope.go = function ( hash ) {
		$location.path(hash);
	};
}]);
