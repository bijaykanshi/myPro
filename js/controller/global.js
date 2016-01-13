app.factory('global', function($http, $modal, $state, $location, $rootScope){
     
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
    global.msgList = {};
    global.msg = commonMsg;
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
		//$state.go(state);
		//Session.clear();
		/*localStorage.clear();
                window.location = '/';
    $location.path('/');
		 var backlen = history.length;
     history.go(-backlen);
     window.location.href = loggedOutPageUrl*/
     	if (!chat.myInfo && chat.myInfo.id)
     		return;
     	chat.logout = true;
     	chat.socket.emit('logout',{id: global.myInfo.id});
     	if (state) {
     		$state.go(state);
     	}
     	/*this.sendRequest('/logout?id=' + chat.myInfo.id,
	        undefined,
	        'GET',
	        function (data, status, headers, config){
	          	console.log('success');
	        },
	        function (data, status, headers, config) {
	          console.log('error');
        });*/
	}
	global.bringMoreMsg = function(id, name) {
		var bothId = id < chat.myInfo.id ? id.toString() + chat.myInfo.id.toString() : chat.myInfo.id.toString() + id.toString();
        var msgCount = global.msgList[bothId] ? global.msgList[bothId].length : 0;
        this.sendRequest('/getPreviousMsg?id=' + bothId + '&start=' + msgCount,
	        undefined,
	        'GET',
	        function (data, status, headers, config){
	          	if (data.length) {
                    //chat.insertPreviousMsg(data);
                    var msgList = global.msgList;
                    if (msgList[bothId]) {
                        data.push.apply(data, msgList[bothId]);
                    }
                    msgList[bothId] = data;
                    if(name) {
                    	insertPopup(id, name);
                    }
              	}
	        },
	        function (data, status, headers, config) {
	          if(name) {
            	insertPopup(id, name);
            }
        });
		//alert('scroll');
	}
    global.sendRequest = function(url, dataObj, method, successFn, failureFn) {
    	global.isLoading = true;
    	var res = $http[method.toLocaleLowerCase()](url, dataObj);
		res.success(function(data, status, headers, config) {
			global.isLoading = false;
			if (successFn) {
				successFn(data, status, headers, config);
			}
		});
		res.error(function(data, status, headers, config) {
			global.isLoading = false;
			if (failureFn) {
				failureFn(data, status, headers, config);
			}
			alert( "failure message: " + JSON.stringify({data: data}));
		});	
    };
    global.openModal = function(templateUrl, controllerName, parameter, windowClass, extra){
	  $modal.open({
	    templateUrl: templateUrl,
	    resolve: {
	            parameter: function(){
	                return parameter
	            },
	            extra: function(){
	                return extra
	            }
	        },
	    controller: controllerName,
	    windowClass: windowClass
	  });
	};
	global.press = function (id, msg) {
		var bothId = id < global.myInfo.id ?  id.toString() + global.myInfo.id.toString() : global.myInfo.id.toString() + id.toString();
		if (msg) {
			if (!global.msgList[bothId]) {
				global.msgList[bothId] = [];
			}
			global.msgList[bothId].push({id: bothId, msg: msg, senderId: id});
		} else {
			global.msgList[bothId].push({id: bothId, msg: global.textMsg, senderId: global.myInfo.id});
			chat.socket.emit('msg', {msg: global.textMsg, receiver: id, sender: global.myInfo, insertDbId: bothId});
			global.textMsg = "";
		}
	};
	global.con = function (id, msg) {
		var bothId = id < global.myInfo.id ?  id.toString() + global.myInfo.id.toString() : global.myInfo.id.toString() + id.toString();
		var obj = {id: id, msg: msg, senderId: id};
		$rootScope.dg = angular.copy(obj);
		global.press($rootScope.dg.id, $rootScope.dg.msg);
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
    };

    return global;
});

app.run(function($rootScope, $state, global) {
    $rootScope.global = global;//setTimeout(function(){ global.b = 'omkjksjdjo889367262877l'; }, 2500000);
    chat.global = global;
    /*$rootScope.$on("$routeChangeStart", function (event, next, current) {
        if (!(next.templateUrl == "firstPage/index.html")) {
            $location.path("/login");
        }
    })*/
	global.sendRequest('./js/data.json',
        undefined,
        'GET',
        function (data, status, headers, config) {
        	angular.forEach(data.route, function (value, key) { 
		          var state = {
		            "url": value.url,
		            "views": {}
		          };
		          var enter;
		          /*if (value.onEnter) {
		          		enter = function($modal) {
			              $modal.open({
			                controller: "loginSignUp",
			                templateUrl: 'template/modals/login.html',
			                resolve: {
			                    parameter: function(){
			                        return undefined
			                    }
			                },
			              })
			            }
			            state.onEnter = ["$modal", enter];
		          }*/
		          angular.forEach(value.views, function (view) {
		          	/*if (view.templateUrl === "") {
		          		view.templateUrl = function ($stateParams) {
		                    return 'coach/template/' +  $stateParams.param + '.html'
		                }
		          	} */
		          	var obj = {};
		          	if (view.controller) {
		          		obj.controller = view.controller;
		          	}
		          	obj.templateUrl = view.templateUrl;
		          	state.views[view.view] = obj;
		          });
		          $stateProviderRef.state(value.state, state);
		    });
			//$state.go('home', {param : 'home'}, {reload: false});
		    //$state.go("home");
		    $state.go("coach.home");
          	console.log('success');
        },
        function (data, status, headers, config) {
          console.log('error');
    });
});
String.prototype.capFirst = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

