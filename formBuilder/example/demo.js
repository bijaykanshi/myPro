
app.controller('DemoController', [
    '$scope', '$builder', '$validator', '$modalInstance', 'global', function($scope, $builder, $validator, $modalInstance, global) {
      var checkbox, textbox;
      textbox = $builder.addFormObject('default', {
        id: 'textbox',
        component: 'textInput',
        label: 'Name',
        description: 'Your name',
        placeholder: 'Your name',
        required: true,
        editable: false
      });
      checkbox = $builder.addFormObject('default', {
        id: 'checkbox',
        component: 'checkbox',
        label: 'Pets',
        description: 'Do you have any pets?',
        options: ['Dog', 'Cat']
      });
      $builder.addFormObject('default', {
        component: 'sampleInput'
      });
      $scope.form = $builder.forms['default'];
      $scope.input = [];
      $scope.defaultValue = {};
      $scope.defaultValue[textbox.id] = 'default value';
      $scope.defaultValue[checkbox.id] = [true, true];
      $scope.close = function () {
          $modalInstance.dismiss('cancel');
      };
      $scope.saveFormJson = function () {
          var param = {};
          param.json = $scope.form;
          global.sendRequest('/coach/saveFormJson',
              param,
              'POST',
              function (data, status, headers, config) {
                  alert('success');
              },
              function (data, status, headers, config) {
                console.log('error');
            });
      };
      return $scope.submit = function() {
        return $validator.validate($scope, 'default').success(function() {
          return console.log('success');
        }).error(function() {
          return console.log('error');
        });
      };
    }
  ]);
