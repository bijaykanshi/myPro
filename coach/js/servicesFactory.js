app.factory('coach', function($http, $modal, $state, $location, $rootScope) {
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
    coach.setEditLink = function (objRef, key, dec) {
    	if (dec) {
    		coach.objRef = objRef;
      		coach.key = key;
    	} else {
    		coach.key = undefined;
    	}
      	
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
		},
		function (data, status, headers, config) {
			console.log('error');
	});
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