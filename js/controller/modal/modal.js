app.controller('loginSignUp', function ($scope, $modalInstance, $state, global, coach, parameter) {
   coach.abc();
   $scope.login = ['email', 'password'];
   $scope.signUp = ['name', 'email', 'password', 'contact_No', 'Address', 'district', 'state','country','Pin_Code', 'Profession','Skills', 'msg'];
   $scope.signUpLabel = parameter ? commonMsg.label_updateProfle : commonMsg.label_signUp;
   $scope.showLogin = parameter ? false : true;
   $scope.loginData = {};
   $scope.skillProfession = {};
   $scope.skillProfession.skills = [];
   $scope.skillProfession.profession = [];
   $scope.hideSearchBox = {};
   $scope.hideSearchBox['profession'] = true;
   $scope.hideSearchBox['skills'] = true;
   $scope.closeSearchBox = function (value) {
      $scope.hideSearchBox[value] = true;
    }
    $scope.loadMore = function() {
        global.itemsLimit += 50;
    }
    $scope.setProfession = function (profession) {
      if (global.completeFilter.Profession.indexOf(profession) < 0) {
        global.completeFilter.Profession.push(profession);
      }
    };
    $scope.setSkills = function (skills) {
      if (global.completeFilter.Skills.indexOf(skills) < 0) {
        global.completeFilter.Skills.push(skills);
      }
    };
   $scope.loginFun = function(dec) {
      $scope.loginData.myPos = googleMap.myPos;
      global.myInfo.myPos = googleMap.myPos;
      var requestData = dec === 'login' ? $scope.loginData : global.myInfo;
      if (dec !== 'login') {
          requestData.professionSkill = global.completeFilter;
      }
      requestData.dec = dec;
      global.sendRequest('/loginSignUp',
        requestData,
        'POST',
        function (data, status, headers, config){
          var parameter = {};
          if (dec === 'login') {
              if (!data.length) {
                  parameter.msg = commonMsg.alert_user_not_registered;
                  global.openModal('template/modals/popupMsg.html', 'popupMsg', parameter);
              } else {
                  /*global.peopleListBackUp = data[1];
                  global.peopleList = global.getPaination(data[1]);
                  global.myInfo = $scope.searchMyInfo(data[1]);*/
                  global.peopleListBackUp = data;
                  global.peopleList = global.getPaination(data);
                  global.myInfo = $scope.searchMyInfo(data);
                  chat.initialization(global.myInfo);
                  $state.go('peopleList');
                  $scope.close();
                  $scope.loginData = {};
              }
          } else {
              global.myInfo = {};
              parameter.msg = commonMsg.alert_signUp_success;
              global.openModal('template/modals/popupMsg.html', 'popupMsg', parameter);
          }
        },
        function (data, status, headers, config) {
          console.log('error');
        });
     };
   setTimeout(function(){ global.s = undefined; }, 7200000);
   $scope.extractAddress = function() {
      var results = googleMap.address,
          j,
          i = 0,
          myInfo = global.myInfo;
      if (results.length) {
          j = results.length - 1;
          myInfo['Pin_Code'] = results[j--].long_name;
          myInfo['country'] = results[j--].long_name;
          myInfo['state'] = results[j--].long_name;
          myInfo['district'] = results[j--].long_name;
          myInfo['Address'] = '';
          for (; i <= j; i += 1) {
              myInfo['Address'] += results[i].long_name + ' , ';
          }
      }
      
   };
  $scope.searchMyInfo = function (data) {
      var returnData = {},
      i,
      loginData = $scope.loginData;
      for (i = 0; i < data.length; i += 1) {
          if (data[i].email === loginData.email) {
            returnData = data[i];
            break;
          }
      } 
      return returnData;
  };
   $scope.close = function () {
        $modalInstance.dismiss('cancel');
    };
  $scope.contact = {};
  $scope.contact.name = global.myInfo.name;
  $scope.contact.email = global.myInfo.email;
  $scope.contact.id = global.myInfo.id;
  $scope.submitContact = function ($event) {
      url = '/submitContact';
      global.sendRequest(url,
          $scope.contact,
          'POST',
          function (data, status, headers, config) {
            var parameter = {};
            parameter.msg = commonMsg.alert_Contact_Success;
            global.openModal('template/modals/popupMsg.html', 'popupMsg', parameter);
            $scope.contact.subject = '';
            $scope.contact.msg = '';
          },
          function (data, status, headers, config) {
            console.log('error');
      });
  };
});
app.controller('popupMsg', function ($scope, $modalInstance, parameter) {
    $scope.msg = parameter.msg;
    $scope.header = parameter.header || 'Alert Message';
   $scope.close = function () {
        $modalInstance.dismiss('cancel');
    };
});
app.controller('mapCtrl', function ($scope, $modalInstance, global, parameter) {
  setTimeout(function(){ 
    googleMap.initialize(global.myInfo);
    googleMap.initializeMarkerClusters(global.peopleList); 
  },50);
  $scope.mapCluster  = [];
   $scope.close = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.openModal = function () {
        alert('kjkjkj');
    };
    /*$scope.setMapCluster = function(tindle) {
        $scope.mapCluster = tindle;
    }*/
});
app.controller('showProfileCtrl', function ($scope, $modalInstance, global, parameter) {
   $scope.profile = parameter;
   $scope.close = function () {
        $modalInstance.dismiss('cancel');
    };
    /*$scope.setMapCluster = function(tindle) {
        $scope.mapCluster = tindle;
    }*/
});