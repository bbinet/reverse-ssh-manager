var app = angular.module('rsm', [
    'smart-table', 'toggle-switch', 'angularMoment', 'mgcrea.ngStrap.alert']);

app.service('utils', function() {
  this.htmlDecode = function(input) {
    var doc = new DOMParser().parseFromString(input, "text/html");
    return doc.documentElement.textContent;
  };
});

app.directive('contenteditable', ['$sce', function($sce) {
  return {
    restrict: 'A', // only activate on element attribute
    require: '?ngModel', // get a hold of NgModelController
    link: function(scope, element, attrs, ngModel) {

      // Specify how UI should be updated
      ngModel.$render = function() {
        element.html($sce.trustAsHtml(ngModel.$viewValue || ''));
      };

      // Listen for change events to enable binding
      element.on('blur keydown change', function(evt) {
        var esc = evt.which === 27,
            enter = evt.which === 13,
            blur = evt.which === 0,
            el = evt.target;

        if (esc || evt.which === undefined) {
          element.html($sce.trustAsHtml(''));
        }
        if (enter || esc || blur ||  evt.which === undefined) {
          scope.$evalAsync(read);
          el.blur();
          evt.preventDefault();
        }
      });

      // Write data to the model
      function read() {
        ngModel.$setViewValue(element.html());
      }
    }
  };
}]);

app.controller('MainCtrl', [
    '$scope', '$window', '$interval', '$http', '$alert', 'utils',
  function($scope, $window, $interval, $http, $alert, utils) {

    $scope.internalCollection = [];

    var error_cb = function() {
      $alert({
        title: 'Server error: ',
        content: 'An server error occured...',
        type: 'danger',
        container: '#alerts-container',
        duration: 3
      });
    };

    $scope.updateCollection = function() {
      $http({
        url: '../uuids',
        method: 'GET'
      }).success(function(resp) {
        if (!resp.success) {
          error_cb();
          return;
        }
        var db = resp.db;
        angular.forEach($scope.internalCollection, function(item) {
          if (!db[item.uuid]) {
            // reload the whole page if item have been removed on the server
            $window.location.reload();
          }
          angular.extend(item, db[item.uuid]);
          delete db[item.uuid];
        });
        angular.forEach(db, function(item, uuid) {
          var idx = $scope.internalCollection.push(item) - 1;
          $scope.$watch(
            'internalCollection[' + idx +'].active',
            function(newValue, oldValue) {
              if (newValue != oldValue) {
                $http.post(
                    '../uuid/' + uuid,
                    angular.extend({}, item, {active: newValue}))
                  .success(function(resp) {
                    angular.extend(item, resp);
                  })
                  .error(error_cb);
              }
            });
          $scope.$watch(
            'internalCollection[' + idx +'].data',
            function(newValue, oldValue) {
              if (newValue != oldValue) {
                $http.post(
                    '../uuid/' + uuid,
                    angular.extend(
                      {}, item, {data: utils.htmlDecode(newValue)}))
                  .success(function(resp) {
                    angular.extend(item, resp);
                  })
                  .error(error_cb);
              }
            });
        });
      }).error(error_cb);
    };

    $interval($scope.updateCollection, 10000);

  }
]);
