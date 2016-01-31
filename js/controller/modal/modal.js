app.controller('loginSignUp', function ($scope, $modalInstance, $state, global, coach, parameter, extra, constant) {
   $scope.login = ['email', 'password'];
   $scope.extra = extra;
   //$scope.signUp = ['name', 'email', 'password', 'doj' 'contact_No', 'Address', 'district', 'state','country', 'org', 'Pin_Code', 'Profession','Skills', 'msg'];
   if (parameter === 'coach') {
      $scope.selectOrg = true;
      $scope.loginLabel = msg.label_select_org;
      $scope.signUpLabel = commonMsg.label_signUp_coach;
      $scope.showLogin = false;
   } else {
      $scope.signUpLabel = parameter ? commonMsg.label_updateProfle : commonMsg.label_signUp;
      $scope.showLogin = parameter ? false : true;
      $scope.loginLabel = msg.label_login;
   }
    
   $scope.loginData = {};
   $scope.skillProfession = {};
   $scope.skillProfession.skills = [];
   $scope.skillProfession.profession = [];
   $scope.hideSearchBox = {};
   $scope.hideSearchBox['profession'] = true;
   $scope.hideSearchBox['skills'] = true;
   $scope.closeOrgBox = function() {
      $scope.showOrg = false;
   }
   $scope.setOrg = function (item) {
      $scope.showOrg = false;
      $scope.org = item.org;
      coach.itemInfo = item;
      //alert('got it');
   }
   $scope.getWebsiteJson = function () {
      global.sendRequest('/coach/getWebsiteJson?email=' + coach.itemInfo.email,
        undefined,
        'GET',
        function (data, status, headers, config) {
            if (data.status === 'error') {
               global.openModal('template/modals/popupMsg.html', 'popupMsg', {msg: commonMsg.error_server_side_file});
            } else {
              coach.a = coach.itemInfo.access_token;
              coach.siteJsonProcessing(data);
              $scope.close();
            }
        },
        function (data, status, headers, config) {
          console.log('error');
        });
   }
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
      dec = extra === 'edit_website' ? extra : dec;
      requestData.dec = dec;
      //var requestData = {email: 'prity@gmail.com', password: 'new', myPos: {}, dec: 'login'};
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
                  global.peopleListBackUp = data[1];
                  global.peopleList = global.getPaination(data[1]);
                  global.myInfo = $scope.searchMyInfo(data[1]);
                  chat.initialization(global.myInfo);
                  //$state.go('peopleList');
                  $state.go('coachList');
                  $scope.close();
                  $scope.loginData = {};
              }
          } else if (dec === 'edit_website') {
              if (data[0] && data[0].access_token === coach.a) {
                  coach.aToMatch = data[0].access_token;
                  $scope.close(); 
              } else {
                  global.openModal('template/modals/popupMsg.html', 'popupMsg', {msg: msg.alert_wrong_username_password});
              }
              
          } else {
            if (!data.error) {
                coach.itemInfo = angular.copy(global.myInfo);
                global.completeFilter.Profession = global.completeFilter.Skills = [];
                if (dec === 'coach') {
                   $scope.close();
                   coach.aToMatch = coach.a = data.access_token;
                }
                global.myInfo = {};
                parameter.msg = dec === 'coach' ? msg.alert_coach_signUp_success : commonMsg.alert_signUp_success;
            } else {
                parameter.msg = commonMsg.error_server;
            }
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
        /*if (!coach.itemInfo && $scope.selectOrg) {
            global.openModal('template/modals/popupMsg.html', 'popupMsg', {msg : commonMsg.alert_Plz_Select_Org});
            return;
        }*/
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