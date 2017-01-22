(function () {
  'use strict';
  angular.module('NarrowItDownApp',[]).
  controller('NarrowItDownController', NarrowItDownController).
  service('MenuSearchService',MenuSearchService).
  directive('foundItems',FoundItems).
  constant('ApiBasePath', "https://davids-restaurant.herokuapp.com");
  
  MenuSearchService.$inject = ['$http', 'ApiBasePath'];
  NarrowItDownController.$inject = ['MenuSearchService'];

  function FoundItems(){
    var ddo = {
      restrict: "E",
      templateUrl: 'foundItems.html',
      scope: {
        foundItems: '<',
        onRemove: '&'
      }
    };
    return ddo;
  }

  function NarrowItDownController(MenuSearchService){
    var controller = this;
    controller.searchTerm = "";
    controller.foundItems = [];
    controller.errorMessage = "";
    controller.getMatchedMenuItems = function(){
	  if(controller.searchTerm==""){
		controller.errorMessage = "Nothing found";
		controller.foundItems = [];
	  }else{
                controller.errorMessage = "";
		var promise = MenuSearchService.getMatchedMenuItems(controller.searchTerm);
		promise.then(function(response) {
			controller.foundItems = response;
			if(controller.foundItems.length==0)
				controller.errorMessage = "Nothing found";
		}).catch(function (error) {
			console.log(error);
		})
	  }
	};
      controller.removeItem = function(index){
      controller.foundItems.splice(index,1);
    };
  }

  function MenuSearchService($http, ApiBasePath){
    var service = this;
    service.getMatchedMenuItems = function(searchTerm){
        var response = $http({
           method: "GET",
           url: (ApiBasePath + "/menu_items.json"),
        });
        return response.then(function(result){
          var items = result.data.menu_items;
          var foundItems = [];
          for(var i=0;i<items.length;i++){
            if(items[i].description.toUpperCase().indexOf(searchTerm.toUpperCase())!=-1)
              foundItems.push(items[i]);
          }
          return foundItems;
        });
    };
  }

})();
