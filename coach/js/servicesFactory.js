app.factory('coach', function($http, $modal, $state, $location, $rootScope) {
    var coach = {};
    $rootScope.coach = coach;
    coach.struct = {};
    coach.homeData = [];
    coach.repeatAll = {};
    coach.tab = 'home';
    coach.mainPage;
    coach.currentLinkClick = {};
    $rootScope.global.sendRequest('/mongo/getMainPage',
		undefined,
		'GET',
		function (data, status, headers, config) {
			coach.mainPage = data[0].content;
			coach.repeatAll['home'] = coach.mainPage[0].innerItem;
			coach.struct.home = coach.mainPage[0].structure.split('_');
			coach.repeatAll['footer'] = data[0].footer;
			coach.struct.latestNews = coach.repeatAll['footer'].latestNews.structure.split('_');
			coach.struct.teachingSupport = coach.repeatAll['footer'].teachingSupport.structure.split('_');
			//for dynamic content
			coach.dataBackUp = data;
			coach.linkArray = coach.mainPage;
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