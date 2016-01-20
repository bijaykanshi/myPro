app.filter('range', function() {
  return function(input, total) {
    total = parseInt(total);
    for (var i=0; i < total; i += 1) {
      input.push(i);
    }

    return input;
  };
});
app.directive('checkImage', function($http) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            attrs.$observe('ngSrc', function(ngSrc) {
                $http.get(ngSrc).success(function(){
                }).error(function() {
                    var imgSrc = attrs.altsrc || '/images/peopleList/map.png';
                    element.attr('src', imgSrc); // set default image
                });
            });
        }
    };
});
app.directive('productionQty', function() {
  return {
    require: 'ngModel',
    link: function (scope, element, attr, ngModelCtrl) {
      function fromUser(text) {
        var transformedInput = text.replace(/[^0-9|a-z|A-Z]/g, '');
        var a = attr;
        var b = element;
        var c = scope;
        if(transformedInput !== text) {
            ngModelCtrl.$setViewValue(transformedInput);
            ngModelCtrl.$render();
        }
        return transformedInput;  // or return Number(transformedInput)
      }
      ngModelCtrl.$parsers.push(fromUser);
    }
  }; 
});
app.directive("directiveWhenScrolled", function($document) {
  return function(scope, elm, attr) {
    var raw = elm[0];

    $document.bind('scroll', function() {
      if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
        scope.$apply(attr.directiveWhenScrolled);
      }
    });
  };
});
app.directive("scrollUp", function() {
  return function(scope, elm, attr) {
    var raw = elm[0];

    elm.bind('scroll', function() {
      if (raw.scrollTop <= raw.offsetHeight) {
        scope.$apply(attr.scrollUp);
      }
    });
  };
});
app.directive('confirmClick', ['$q', 'dialogModal', function($q, dialogModal) {
      return {
          link: function (scope, element, attrs) {
              var ngClick = attrs.ngClick.replace('confirmClick()', 'true')
                  .replace('confirmClick(', 'confirmClick(true,');
              scope.confirmClick = function(msg) {
                  if (msg===true) {
                      return true;
                  }
                  msg = msg || attrs.confirmClick || 'Are you sure You want to delete this item?';
                  dialogModal(msg).result.then(function() {
                      scope.$eval(ngClick);
                  });
                  return false;
              };
          }
      }
  }]);

  
  app.service('dialogModal', ['$modal', function($modal) {
      return function (message, title, okButton, cancelButton) {
          okButton = okButton===false ? false : (okButton || 'Confirm');
          cancelButton = cancelButton===false ? false : (cancelButton || 'Cancel');
          var ModalInstanceCtrl = function ($scope, $modalInstance, settings) {
              angular.extend($scope, settings);
              $scope.ok = function () {
                  $modalInstance.close(true);
              };
              $scope.cancel = function () {
                  $modalInstance.dismiss('cancel');
              };
          };
          var modalInstance = $modal.open({
              template: '<div class="dialog-modal"> \
                  <div class="modal-header" ng-show="modalTitle"> \
                      <h3 class="modal-title">{{modalTitle}}</h3> \
                  </div> \
                  <div class="modal-body">{{modalBody}}</div> \
                  <div class="modal-footer"> \
                      <button class="btn btn-primary" ng-click="ok()" ng-show="okButton">{{okButton}}</button> \
                      <button class="btn btn-warning" ng-click="cancel()" ng-show="cancelButton">{{cancelButton}}</button> \
                  </div> \
              </div>',
              controller: ModalInstanceCtrl,
              resolve: {
                  settings: function() {
                      return {
                          modalTitle: title,
                          modalBody: message,
                          okButton: okButton,
                          cancelButton: cancelButton
                      };
                  }
              }
          });
          return modalInstance;
      }
  }]);
 app.filter('to_trusted', ['$sce', function($sce){
        return function(text) {
            return $sce.trustAsHtml(text);
        };
    }]);
