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