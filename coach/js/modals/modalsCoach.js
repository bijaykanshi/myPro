app.controller('editShowCoachCtrl', function ($scope, $modalInstance, coach, parameter, extra) {
	var isObj = typeof parameter === 'string' ? false : true;
  	$scope.header = isObj ? 'Edit Content' : 'Add Content';
    var splitParam;
  	if (isObj) {
  		$scope.parameter = angular.copy(parameter);
  	} else {
  		$scope.parameter = {};
      splitParam = parameter.split('_');
  		coach.struct[splitParam[0]].forEach(function(item) {
  			$scope.parameter[item] = '';
  		});
  	}
   	$scope.parameterBackUp = angular.copy($scope.parameter);
   	$scope.close = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.save = function () {
    	if (isObj) {
    		Object.keys(parameter).forEach(function(key) {
	    		if (key !== '$$hashKey') {
	    			parameter[key] = $scope.parameter[key];
	    		}
	    	});
    	} else {
          if (splitParam.length > 1) {
              coach.repeatAll[splitParam[1]][splitParam[0]].innerItem.unshift($scope.parameter)
          } else {
              coach.repeatAll[parameter].push($scope.parameter);
          }
    	}
        $scope.close();
    };
    $scope.reset = function () {
        $scope.parameter = angular.copy($scope.parameterBackUp);
    };
    $scope.dispData = function(key) {
    	return key.replace(/([A-Z])/g, ' $1').trim().capFirst();
    }
});
app.controller('displayCoachCtrl', function ($scope, $modalInstance, coach, parameter, extra) {
    $scope.header = extra || '';
    $scope.parameter = parameter;
    $scope.close = function () {
        $modalInstance.dismiss('cancel');
    };
});
app.controller('editAddDynamicContentCtrl', function ($scope, $modalInstance, coach, parameter, extra) {
    $scope.header = extra || '';
    $scope.parameter = parameter || {};
    $scope.dec = extra;
    if (extra === 'new') {
        coach.struct.dynamic.upper.forEach(function(x) {
          $scope.parameter[x] = '';
        });
        $scope.parameter.listItem = [];
    }
    $scope.createListItem = function () {
        var obj = {};
        coach.struct.dynamic.listItem.forEach(function(x) {
            obj[x] = '';
        });
        obj.innerItem = [];
        $scope.parameter.listItem.push(obj);
    }
    $scope.createInnerItem = function (index) {
        var obj = {};
        coach.struct.dynamic.innerItem.forEach(function(x) {
            obj[x] = '';
        });
        $scope.parameter.listItem[index].innerItem.push(obj);
    }
    $scope.close = function () {
        $modalInstance.dismiss('cancel');
    };
});
app.controller('smallInputCoach', function ($scope, $modalInstance, global, coach, parameter) {
    $scope.header = msg.disp_creation_of_link;
    $scope.labelName = msg.disp_link_name;
    $scope.takeInput = true;
    $scope.close = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.create = function() {
        global.sendRequest('/coach/getDummyJson',
            undefined,
            'GET',
            function (data, status, headers, config) {
                data.link = $scope.inputText;
                //coach.dummyJson = data;
                coach.mainPage.push(data);
                var link = document.getElementsByName(data.link)[0];
                if (link) 
                    link.click();
            },
            function (data, status, headers, config) {
                console.log('error');
        });
    }
});