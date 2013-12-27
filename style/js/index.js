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

	/*
	chrome.tabs.query({},function (tabs) {
		for(var i=0; i < tabs.length; i++){
			ret.push(tabs[i]);
		}
		$scope.Tabs = ret;
	});
	*/
	
	/**
	 * Init method
	 */
	$scope.Init = function(){
		$scope.sa_getTabs();
	}

	/**
	 * Returns the current tabs in the window
	 * @return {Array} [Array of tabs]
	 */
	$scope.sa_getTabs = function(){
		ret = [
			{title: "blah blah blah1 bguiewb euiwb geuwi bgewui gbewuib geuiw bgewui bgewui bgewui gbwei", url:"something.com1", selected:true},
			{title: "blah blah blah2", url:"something.com2", selected:true},
			{title: "blah blah blah3", url:"something.com3", selected:true},
			{title: "blah blah blah4", url:"something.com4", selected:true},
			{title: "blah blah blah5", url:"something.com5", selected:true},
			{title: "blah blah blah6", url:"something.com6", selected:true}
		]


		$scope.sa_tabs = ret;
	}


	/**
	 * Select an item
	 * @param  {integer} idx [index of item selected]
	 */
	$scope.sa_select = function(idx){
		$scope.sa_tabs[idx].selected = !$scope.sa_tabs[idx].selected;
	}

	/**
	 * Method used to go to different routes
	 * @param  {String} hash [New url]
	 */
	$scope.go = function ( hash ) {
		$location.path(hash);
	};

	$scope.Init();
}]);


/* ###############################################################################
 * ##																			##
 * ##						QuizUsage Controller								##
 * ##																			##
 * ############################################################################### */

MyApp.controller("SearchController", ['$scope','$location', function($scope, $location){

	/**
	 * Init method
	 */
	$scope.Init = function(){
	
	}

	/**
		Method used to go to different routes
	 */
	$scope.go = function ( hash ) {
		$location.path(hash);
	};

	$scope.Init();
}]);
