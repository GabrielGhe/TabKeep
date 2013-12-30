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
			{title: "blah blah blah5", url:"something.com5", selected:true}
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

MyApp.controller("SearchController", ['$scope','$location', '$filter', function($scope, $location, $filter){

	/**
	 * Init method
	 */
	$scope.Init = function(){
		$scope.curPage = 0;
		$scope.itemsPerPage = 5;

		//keepTabs
		$scope.keepTabs = [];
		$scope.setKeepTabs();
	}

	/**
		Method used to go to different routes
	 */
	$scope.go = function ( hash ) {
		$location.path(hash);
	};


	/**
	 * Sets the keepTabs array
	 * @return {[type]} [description]
	 */
	$scope.setKeepTabs = function(){
		ret = [];
		ret = [
			{blah:"blah1"},
			{blah:"blah2"},
			{blah:"blah3"},
			{blah:"blah4"},
			{blah:"blah5"},
			{blah:"blah6"},
			{blah:"blah6"},
			{blah:"blah7"},
			{blah:"blah8"},
			{blah:"blah9"},
			{blah:"blah10"},
			{blah:"blah11"}
		];

		$scope.keepTabs = ret;
	}


	/**
	 * Sets the pageItems array
	 * @param  {integer} num [number of elements]
	 * @return {array}     [Array of pages]
	 */
	$scope.getPageItems = function( array ){
		num = $filter('filter')(array, $scope.search);
		num = num.length;
		ret = [];

		if(num == 0){
			ret.push(0);
		} else {
			//determine end
			end = num / $scope.itemsPerPage;
			end += (num % $scope.itemsPerPage == 0)? 0 : 1;
			end = Math.floor(end);

			for(var i= 0; i < end; i++){
				ret.push(i);
			}
		}

		return ret;
	}


	/**
	 * Watching if the search filter was changed
	 * @param  {String} newValue [new value]
	 * @param  {String} oldValue [old value]
	 */
	$scope.$watch('search', function( newValue, oldValue){
		if(newValue != oldValue){
			$scope.curPage = 0;
		}
	});


	/**
	 * Sets the page
	 * @param {integer} page [new page]
	 */
	$scope.setPage = function( page ){
		$scope.curPage = page;
	}


	/**
	 * Go to the previous page
	 */
	$scope.prevPage = function(){
		if($scope.curPage > 0){
			$scope.curPage--;
		}
	}

	/**
	 * Go to the next page
	 */
	$scope.nextPage = function(){
		if($scope.curPage < $scope.pageItems.length - 1){
			$scope.curPage++;
		}
	}


	$scope.Init();
}]);
