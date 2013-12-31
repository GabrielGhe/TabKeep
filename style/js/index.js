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
		
		$scope.sa_tabs = [];
		chrome.tabs.query({},function (tabs) {
			for(var i=0; i < tabs.length; i++){
				//create object
				var tab = {id: tabs[i].id, title: tabs[i].title, url: tabs[i].url, selected:true};

				//get favicon
				if(tabs[i].favIconUrl && tabs[i].favIconUrl != ''){
					tab.favicon = tabs[i].favIconUrl;
				}
				
				$scope.sa_tabs.push(tab);
				$scope.$apply();
			}
		});
		console.log($scope.sa_tabs);
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
		$scope.itemsPerPage = 6;

		//keepTabs
		$scope.keepTabs = [];
		$scope.setKeepTabs();
		//page items
		$scope.pageItems = 0;
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
			{title:"blah1 erbgiuerb uigrebhuireb huireb huireb huireb huireb huireb huireb huier", tags: "this1 that0 and another"},
			{title:"blah2", tags: "this2 that5 and another"},
			{title:"blah3", tags: "this3 that6 and another"},
			{title:"blah4", tags: "this4 that3 and another veruyv heruyhv eruyhv eruyhv eruyhv r eruyv heruyv heruyhv eruyhv eruyhv eruyhv eruyv heruyv heeruy"},
			{title:"blah5", tags: "this5 that6 and another"},
			{title:"blah6", tags: "this6 that9 and another"},
			{title:"blah7", tags: "this7 that2 and another"},
			{title:"blah8", tags: "this8 that6 and another"},
			{title:"blah9", tags: "this9 that0 and another"},
			{title:"blah10", tags: "this1 that8 and another"},
			{title:"blah11", tags: "this2 that7 and another"},
			{title:"blah12", tags: "this3 that1 and another"},
			{title:"blah13", tags: "this4 that5 and another"},
			{title:"blah14", tags: "this5 that2 and another"},
			{title:"blah15", tags: "this6 that5 and another"},
			{title:"blah16", tags: "this7 that7 and another"},
			{title:"blah17", tags: "this8 that9 and another"},
			{title:"blah18", tags: "this9 that0 and another"},
			{title:"blah19", tags: "this1 that3 and another"},
			{title:"blah20", tags: "this2 that4 and another"},
			{title:"blah21", tags: "this3 that7 and another"},
			{title:"blah22", tags: "this4 that2 and another"},
			{title:"blah23", tags: "this5 that9 and another"},
			{title:"blah24", tags: "this6 that1 and another"},
			{title:"blah25", tags: "this7 that4 and another"},
			{title:"blah26", tags: "this8 that2 and another"},
			{title:"blah27", tags: "this1 that8 and another"},
			{title:"blah28", tags: "this2 that9 and another"},
			{title:"blah29", tags: "this3 that4 and another"},
			{title:"blah30", tags: "this4 that6 and another"}
		];

		$scope.keepTabs = ret;
	}


	/**
	 * Gets the items per page
	 * @param  {array} array [description]
	 * @return {[type]}       [description]
	 */
	$scope.getPageItems = function( array ){
		filtered = $filter('filter')(array, $scope.search);

		start = $scope.curPage * 6;
		len = 6;
		len = (len < filtered.length - start) ? len : filtered.length - start;

		filteredSet = [];
		for(var x = start; x < start + len; x++){
			filteredSet.push(filtered[x]);
		}

		return filteredSet;
	}


	/**
	 * Sets the pageItems array
	 * @param  {array} num [number of elements]
	 * @return {array}     [Array of pages]
	 */
	$scope.getPages = function( array ){
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
		$scope.pageItems = ret.length;

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
		if($scope.curPage < $scope.pageItems - 1){
			$scope.curPage++;
		}
	}


	$scope.Init();
}]);
