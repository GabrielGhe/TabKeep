/* ###############################################################################
 * ##										##
 * ##				@author: Gabriel Gheorghian			##
 * ##										##
 * ############################################################################### */

var MyApp = angular.module('MyApp', ['ui.bootstrap']);

//config routing
MyApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
	$routeProvider
	.when('/', { templateUrl: 'partials/save.html', controller: "SaveController"})
	.when('/search', { templateUrl: 'partials/search.html', controller: "SearchController"})
	.otherwise({ redirectTo: '/'});
}]);

//services
MyApp.service('KeepTabDB', function() {

    return {
		/**
		 * Saves a session object
		 * @param  {Object} element [Holds the id, url, name and list of tabs]
		 */
		save: function(element){
			//get the db (in json)
			var itemsStr = localStorage.getItem('KeepTabDB') || "[]";
			//parse it to have an array
			var items = JSON.parse(itemsStr);
			//add new element and save
			items.splice(0,0, element);
			localStorage.setItem('KeepTabDB',JSON.stringify(items));
		},


		/**
		 * Deletes an item
		 * @param  {object} element [element to remove]
		 */
		delete: function(idx){
			//initial load db and parse the json
			var itemsStr = localStorage.getItem('KeepTabDB') || "[]";
			var items = JSON.parse(itemsStr);

			//remove the element
			items.splice(idx, 1);

    			//commit changes
	    		localStorage.setItem('KeepTabDB',JSON.stringify(items));
		},


		/**
		 * Returns the list of every saved item
		 * @return {array} [the array of all the stored session objs]
		 */
		getList: function(){
			return JSON.parse(localStorage.getItem('KeepTabDB') || "[]");
		},


		/**
		 * Save recent name and tag object for later
		 * @param  {Object} element [Holds the name and tags of recently openned session]
		 */
		recentSave: function(element){
			//get the db (in json)
			var itemsStr = localStorage.getItem('Recent') || "[]";
			//parse it to have an array
			var items = JSON.parse(itemsStr);
			//add new element and save
			items.splice(0,0, element);
			localStorage.setItem('Recent',JSON.stringify(items));
		},


		/**
		 * Deletes an item
		 * @param  {object} element [element to remove]
		 */
		recentDelete: function(idx){
			//initial load db and parse the json
			var itemsStr = localStorage.getItem('Recent') || "[]";
			var items = JSON.parse(itemsStr);

			//remove the element
			items.splice(idx, 1);

			//commit changes
			localStorage.setItem('Recent',JSON.stringify(items));
		},


		/**
		 * Returns the list of every saved item
		 * @return {array} [the array of all the stored session objs]
		 */
		recentGetList: function(){
			return JSON.parse(localStorage.getItem('Recent') || "[]");
		},
	}
});



/* ###############################################################################
 * ##										##
 * ##				Save Controller					##
 * ##										##
 * ############################################################################### */

//controllers
MyApp.controller("SaveController",['$scope', '$location', 'KeepTabDB', function($scope, $location, KeepTabDB){

	/**
	 * Init method
	 */
	$scope.Init = function(){
		$scope.sa_name = "";
		$scope.sa_tags = "";
		$scope.sa_getTabs();
		$scope.setRecent();
	}


	/**
	 * Sets the keepTabs array
	 */
	$scope.setRecent = function(){
		var x = KeepTabDB.recentGetList();
		$scope.recentList = x;
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
				var tab = {id: tabs[i].id, title: tabs[i].title, url: tabs[i].url, selected:false};

				//get favicon
				if(tabs[i].favIconUrl && tabs[i].favIconUrl != ''){
					tab.favicon = tabs[i].favIconUrl;
				}
				
				$scope.sa_tabs.push(tab);
				$scope.$apply();
			}
		});
	}


	/**
	 * Finds out if any item was selected and if the name was filled out
	 * @return {boolean} [if at least 1 item was selected]
	 */
	$scope.goodToSave = function(){
		nameB = $scope.sa_name.trim() != "";

		listB = false;
		for(var x=0; x < $scope.sa_tabs.length; x++){
			if($scope.sa_tabs[x].selected)listB = true;
		}

		return (nameB && listB);
	}


	/**
	 * Saves
	 */
	$scope.save = function(){
		if($scope.goodToSave()){
			var id = new Date();
			var urlList = [];
			var closeTabIds = [];
			for(var x=0; x < $scope.sa_tabs.length; x++){
				if($scope.sa_tabs[x].selected){
					urlList.push($scope.sa_tabs[x].url);
					closeTabIds.push($scope.sa_tabs[x].id);
				}
			}

			//save it in the db
			KeepTabDB.save({	
				id: id.getTime(),
				title: $scope.sa_name.trim(), 
				tags:  "Global " + $scope.sa_tags.trim(),
				list:  urlList
			});

			//create an empty tab if you're saving every tab
			if($scope.sa_tabs.length == closeTabIds.length){
				chrome.tabs.create();
			}

			//close selected tabs
			chrome.tabs.remove(closeTabIds, function(){
				window.close();
			});
		}
	}


	/**
	 * Select an item
	 * @param  {integer} idx [index of item selected]
	 */
	$scope.sa_select = function(idx){
		$scope.sa_tabs[idx].selected = !$scope.sa_tabs[idx].selected;		
	}


	/**
	 * TypeAhead on select function
	 * @param  {object} $item [holds object previously saved]
	 */
	$scope.onSelect = function ($item) {
		$scope.sa_tags = $item.tags;
		for(var x=0; x < $scope.recentList.length; x++){
			if($scope.recentList[x].id == $item.id){
				KeepTabDB.recentDelete(x);
			}
		}
		$scope.setRecent();
    };


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
 * ##										##
 * ##				Search Controller				##
 * ##										##
 * ############################################################################### */

MyApp.controller("SearchController", ['$scope','$location', '$filter', 'KeepTabDB', function($scope, $location, $filter, KeepTabDB){

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
	 */
	$scope.setKeepTabs = function(){
		$scope.keepTabs = KeepTabDB.getList();
	}


	/**
	 * Gets the items per page
	 * @param  {array} array [Unfiltered array]
	 * @return {array}       [array of page numbers]
	 */
	$scope.getPageItems = function( array ){
		filtered = $filter('filter')(array, $scope.search);

		start = $scope.curPage * $scope.itemsPerPage;
		len = $scope.itemsPerPage;
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
	 * Loads the session
	 * @param  {Object} item [session object]
	 */
	$scope.se_load = function( item ){
		for(var x=0; x < $scope.keepTabs.length; x++){
			if($scope.keepTabs[x].id == item.id){
				//used in typeahead on the save page
				var id = new Date();
				KeepTabDB.recentSave({	
					id: id.getTime(),
					title: item.title, 
					tags:  item.tags
				});
				KeepTabDB.delete(x);
			}
		}
		$scope.setKeepTabs();

		//load the urls
		for(var i=0; i<item.list.length; i++){
			chrome.tabs.create({url:item.list[i], active:false});
		}
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
