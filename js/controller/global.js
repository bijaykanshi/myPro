app.factory('global', function($http, $modal, $state){
     
    var global = {};
    global.currentPage = 0;
    global.itemsPerPage = 12;
    global.peopleList = [];
    global.peopleListBackUp = [];
    global.loginData = {};
    global.myInfo = {};
    global.countryList = [];
    global.professionList = professionList;
    global.skillsDetail = skillsDetail;
    global.itemsLimit = 50;
    global.extractCountry = function() {
    	for (var key in countryCity.list) {
    		global.countryList.push(key);
    	}
    };
    global.completeFilter = {};
	global.filterItem = ['Profession', 'Country','District', 'Gender', 'Skills'];
	for (var i = 0; i < global.filterItem.length; i += 1) {
		global.completeFilter[global.filterItem[i]] = [];
	}
	global.stateChange = function(state) {
		$state.go(state);
		//window.history.forward();
	}
    global.sendRequest = function(url, dataObj, method, successFn, failureFn) {
    	/*var req = {
			 method: method,
			 url: url,
			 headers: {
			   'Content-Type': {'Content-Type': 'application/x-www-form-urlencoded'}
			 },
			 data: dataObj
		}
		$http(req).then(function(data, status, headers, config){
				if (successFn) {
					successFn(data, status, headers, config);
				}
			}, function(data, status, headers, config){
				if (failureFn) {
					failureFn(data, status, headers, config);
				}
				alert( "failure message: " + JSON.stringify({data: data}));
			});
*/
    	var res = $http[method.toLocaleLowerCase()](url, dataObj);
		res.success(function(data, status, headers, config) {
			if (successFn) {
				successFn(data, status, headers, config);
			}
		});
		res.error(function(data, status, headers, config) {
			if (failureFn) {
				failureFn(data, status, headers, config);
			}
			alert( "failure message: " + JSON.stringify({data: data}));
		});	
    };
    global.openModal = function(templateUrl, controllerName, parameter, windowClass){
	  $modal.open({
	    templateUrl: templateUrl,
	    resolve: {
	            parameter: function(){
	                return parameter
	            }
	        },
	    controller: controllerName,
	    windowClass: windowClass
	  });
	};
    global.getPaination = function(filteredItems) {
	    var itemsPerPage = global.itemsPerPage,
	        pagination = [],
	        j = 0;
	    for (var i = itemsPerPage; i < filteredItems.length; i += itemsPerPage) {
	        pagination[j++] = filteredItems.slice(i - itemsPerPage, i);
	    }
	    pagination[j++] = filteredItems.slice(i - itemsPerPage, i);
	    return pagination;
	};
	global.getNoOfPage = function(filteredItems) {
		var page = [];
	};
	global.register_pop = function(id, name) {
    	register_popup(id, name);
    } 
    return global;
});

app.run(function($rootScope, global) {
    $rootScope.global = global;//setTimeout(function(){ global.b = 'omkjksjdjo889367262877l'; }, 2500000);
    chat.global = global;
    /*$rootScope.$on("$routeChangeStart", function (event, next, current) {
        if (!(next.templateUrl == "firstPage/index.html")) {
            $location.path("/login");
        }
    })*/
});