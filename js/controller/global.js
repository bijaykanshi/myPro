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
    var protocol = {
        json: {'Content-type': 'application/json'},
        urlencoded: {'Content-Type': 'application/x-www-form-urlencoded'}
    }
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
    global.setMaskForSmallDuration = function() {
         global.isLoading = true;
        setTimeout(function() {
            global.isLoading = false;
        }, 500);
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
    global.sendRequest = function(url, dataObj, method, successFn, failureFn, header) {
    	global.isLoading = true;
    	//var res = $http[method.toLocaleLowerCase()](url, dataObj);
        var res = $http({
            method: method,
            url: url,
            headers: protocol[header || 'json'],
            data: dataObj
        });
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
    global.openModal = function(templateUrl, controllerName, parameter, windowClass, extra, back){
      //global.isLoading = true;
      var obj = {
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
      }
      if (back) {
            obj.backdrop = 'static';
            obj.keyboard = false;
      }
	  $modal.open(obj);
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
app.factory('constant', function($http, $modal, $state, $location, $rootScope){
     
    var constant = {};
    $rootScope.constant = constant;
    constant.listItem = {
          "header": "Dummy Text Please edit this one",
          "desc": "Dummy Text Please edit this one ",
          "image": "./coach/firstPage/images/pic4.jpg",
          "innerItem": [
            {
              "side": "Dummy Text Please edit this one",
              "middle": "Dummy Text Please edit this one ",
              "desc": "Dummy Text Please edit this one "
            },
            {
              "side": "Dummy Text Please edit this one",
              "middle": "Dummy Text Please edit this one ",
              "desc": "Dummy Text Please edit this one "
            }
          ]
    };
    constant.innerItem = {
      "side": "Dummy Text Please edit this one",
      "middle": "Dummy Text Please edit this one ",
      "desc": "Dummy Text Please edit this one "
    };
    constant.homeInnerItem = {
      "header": "Dummy Header",
      "nextHeader": "Dummy Text Please edit this one ",
      "content": "Dummy Text Please edit this one ",
      "readMore": "Dummy Text Please edit this one "
    }
    constant.footerSecondInnerItem =   {
      "link": "Dummy Text Please edit this one",
      "content": "Dummy Text Please edit this one"
    };
    constant.footerThirdInnerItem =   {
      "imgSrc": "./coach/firstPage/imgOwn/news.png",
      "date": "JDummy Text Please edit this one",
      "newsHeader": "Dummy Text Please edit this one",
      "newsContent": "Dummy Text Please edit this one"
    };
    constant.loginForm = [
        {
            "type": "email",
            "placeholder": "Email",
            "label": "Email",
            "key": "email"
        },
        {
            "type": "password",
            "placeholder": "Password",
            "label": "Password",
            "key": "password"
        }
    ];
    constant.signUpForm = [
    	{
    		"placeholder": "Name",
    		"label": "Name",
    		"key": "name"
    	},
    	{
    		"type": "checkbox",
    		"placeholder": "Sex",
    		"label": "Sex",
    		"key": "sex",
    		"class": "checkbox-inline"
    	},
    	{
    		"type": "email",
    		"placeholder": "Email",
    		"label": "Email",
    		"key": "email"
    	},
    	{
    		"type": "password",
    		"placeholder": "Password",
    		"label": "Password",
    		"key": "password"
    	},
    	{
    		"type": "date",
    		"placeholder": "Date Of Birth",
    		"label": "Date Of Birth",
    		"key": "doj"
    	},
    	{
    		"type": "number",
    		"placeholder": "Contact No",
    		"label": "Contact No",
    		"key": "contact_No"
    	},
    	{
    		"placeholder": "Address",
    		"label": "Address",
    		"key": "Address"
    	},
    	{
    		"placeholder": "District",
    		"label": "District",
    		"key": "district"
    	},
    	{
    		"placeholder": "State",
    		"label": "State",
    		"key": "state"
    	},
    	{
    		"placeholder": "Country",
    		"label": "Country",
    		"key": "country"
    	},
    	{
    		"placeholder": "Your Orgnization",
    		"label": "Your Orgnization",
    		"key": "org"
    	},
    	{
    		"type": "number",
    		"placeholder": "Pin Code",
    		"label": "Pin Code",
    		"key": "Pin_Code"
    	},
    	{
    		"placeholder": "Profession",
    		"label": "Profession",
    		"key": "Profession"
    	},
    	{
    		"placeholder": "Skills",
    		"label": "Skills",
    		"key": "Skills"
    	},
    	{
    		"type": "textarea",
    		"placeholder": "About Your self",
    		"label": "About Your self",
    		"key": "msg"
    	}
    ]

    return constant;
});

app.run(function($rootScope, $state, global, $builder) {
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
	          	if (value.onEnter) {
	          		enter = function($modal) {
		              	global.openModal(value.onEnter.templateUrl, value.onEnter.controller, value.onEnter.parameter, value.onEnter.windowClass, value.onEnter.extra, true);
		            }
		            state.onEnter = ["$modal", enter];
	          	}
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
		    //$state.go("coach.home");
            $state.go("firstPage");
          	console.log('success');
        },
        function (data, status, headers, config) {
          console.log('error');
    });
	$builder.registerComponent('sampleInput', {
        group: 'from html',
        label: 'Sample',
        description: 'From html template',
        placeholder: 'placeholder',
        required: false,
        validationOptions: [
          {
            label: 'none',
            rule: '/.*/'
          }, {
            label: 'number',
            rule: '[number]'
          }, {
            label: 'email',
            rule: '[email]'
          }, {
            label: 'url',
            rule: '[url]'
          }
        ],
        templateUrl: 'formBuilder/example/template.html',
        popoverTemplateUrl: 'formBuilder/example/popoverTemplate.html'
      });
      return $builder.registerComponent('name', {
        group: 'Default',
        label: 'Name',
        required: false,
        arrayToText: true,
        template: "<div class=\"form-group\">\n    <label for=\"{{formName+index}}\" class=\"col-md-4 control-label\" ng-class=\"{'fb-required':required}\">{{label}}</label>\n    <div class=\"col-md-8\">\n        <input type='hidden' ng-model=\"inputText\" validator-required=\"{{required}}\" validator-group=\"{{formName}}\"/>\n        <div class=\"col-sm-6\" style=\"padding-left: 0;\">\n            <input type=\"text\"\n                ng-model=\"inputArray[0]\"\n                class=\"form-control\" id=\"{{formName+index}}-0\"/>\n            <p class='help-block'>First name</p>\n        </div>\n        <div class=\"col-sm-6\" style=\"padding-left: 0;\">\n            <input type=\"text\"\n                ng-model=\"inputArray[1]\"\n                class=\"form-control\" id=\"{{formName+index}}-1\"/>\n            <p class='help-block'>Last name</p>\n        </div>\n    </div>\n</div>",
        popoverTemplate: "<form>\n    <div class=\"form-group\">\n        <label class='control-label'>Label</label>\n        <input type='text' ng-model=\"label\" validator=\"[required]\" class='form-control'/>\n    </div>\n    <div class=\"checkbox\">\n        <label>\n            <input type='checkbox' ng-model=\"required\" />\n            Required\n        </label>\n    </div>\n\n    <hr/>\n    <div class='form-group'>\n        <input type='submit' ng-click=\"popover.save($event)\" class='btn btn-primary' value='Save'/>\n        <input type='button' ng-click=\"popover.cancel($event)\" class='btn btn-default' value='Cancel'/>\n        <input type='button' ng-click=\"popover.remove($event)\" class='btn btn-danger' value='Delete'/>\n    </div>\n</form>"
      });
});
String.prototype.capFirst = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}
