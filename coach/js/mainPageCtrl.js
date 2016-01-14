app.controller('homeCoachCtrl', function ($scope, global, coach) {
  
   $scope.dummy = '';
   $scope.loadMore = function(property, length) {
   		if (coach[property] <= length)
   			coach[property] += 4;
   }
   $scope.reduce = function(property) {
   		if (coach[property] > 4)
   			coach[property] -= 4;
   }
    /*$scope.setMapCluster = function(tindle) {
        $scope.mapCluster = tindle;
    }*/
});
app.controller('dynamicCoachCtrl', function ($scope, global, coach) {
  
   $scope.img = {};
   $scope.hideShow = {};
   $scope.colorClasses = ['red', 'blue', 'green'];
});
/*app.controller('headerCoachCtrl', function ($scope, global, coach) {
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
      var arr = data[0].dynamic_structure.split('@'),
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
});*/