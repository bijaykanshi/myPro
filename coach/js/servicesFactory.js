app.factory('coach', function($http, $modal, $state, $location, $rootScope) {
    var coach = {};
    $rootScope.coach = coach;
    coach.abc = function(a,b) {
    	alert('success');
    }
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