app.factory('coach', function($http, $modal, $state, $location, $rootScope, constant, global) {
    var coach = {};
    $rootScope.coach = coach;
    coach.struct = {};
    coach.struct.dynamic = {};
    coach.homeData = [];
    coach.repeatAll = {};
    coach.tab = 'home';
    coach.mainPage;
    coach.currentLinkClick = {};
    $rootScope.img = {};
    coach.a = '12s@';
    coach.setEditLink = function (objRef, key, dec) {
    	coach.objRef = objRef;
      	coach.key = key;
      	$rootScope.global.openModal('coach/template/modals/editAddDynamicContent.html', 'loginSignUpCoach', undefined, 'extraLarge-Modal')
    	/*if (dec) {
    		coach.objRef = objRef;
      		coach.key = key;
    	} else {
    		coach.key = undefined;
    	}*/
      	
   	}
   	coach.addNewListItem = function(objRef, key) {
      var copy = angular.copy(constant[key]);
      objRef.push(copy);
      global.openModal('template/modals/popupMsg.html', 'popupMsg', {msg: msg.alert_success_in_adding_new_list});
    }
   	coach.saveJson = function () {
    	var obj = {};
	    obj.data = coach.dataBackUp;
	    obj.email = coach.itemInfo.email
	    $rootScope.global.sendRequest('/coach/saveJson',
          	obj,
          	'POST',
          	function (data, status, headers, config) {
          		coach.aToMatch = 'g5$#';
          		$rootScope.global.openModal('template/modals/popupMsg.html', 'popupMsg', {msg: msg.alert_success_in_saving_json});
          },
          function (data, status, headers, config) {
            console.log('error');
      });
   	}
   	$rootScope.global.sendRequest('/coach/getOrg',
		undefined,
		'GET',
		function (data, status, headers, config) {
			coach.orgList = data;
		},
		function (data, status, headers, config) {
			console.log('error');
	});
    $rootScope.global.sendRequest('/coach/getMainPage',
		undefined,
		'GET',
		function (data, status, headers, config) {
			coach.siteJsonProcessing(data);
		},
		function (data, status, headers, config) {
			console.log('error');
	});
	coach.siteJsonProcessing = function(data) {
		coach.mainPage = data.content;
		coach.repeatAll['home'] = coach.mainPage[0].innerItem;
		coach.struct.home = coach.mainPage[0].structure.split('_');
		coach.repeatAll['footer'] = data.footer;
		coach.struct.latestNews = coach.repeatAll['footer'].latestNews.structure.split('_');
		coach.struct.teachingSupport = coach.repeatAll['footer'].teachingSupport.structure.split('_');
		//for dynamic content
		coach.dataBackUp = data;
		coach.linkArray = coach.mainPage;
		var arr = data.dynamic_structure.split('@'),
			upper = arr[0].split('_'),
			listItem = arr[1].split('_'),
			innerItem = arr[2].split('_');
		upper.forEach(function(x) {
			coach.struct.dynamic.x = '';
		});
		coach.struct.dynamic.upper = arr[0].split('_');
		coach.struct.dynamic.listItem = arr[1].split('_');
		coach.struct.dynamic.innerItem = arr[2].split('_');
		coach.commonMsg = commonMsg;
	}
	coach.routing = function(param) {
		$state.go('home', {param : param}, {reload: false});
	};
	return coach;
});


/*angular.module('services', []).factory('coach', ["$rootScope",
  function($rootScope) {
    var coach = {};
    $rootScope.coach = coach;
    $rootScope.global.sendRequest('/mongo/getMainPage',
			undefined,
			'GET',
			function (data, status, headers, config){
				alert('success');
			},
			function (data, status, headers, config) {
				console.log('error');
			});
	return coach;
  }
]);*/