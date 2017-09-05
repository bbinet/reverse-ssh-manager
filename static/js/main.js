var app = angular.module('rsm', [
    'smart-table', 'toggle-switch', 'angularMoment', 'mgcrea.ngStrap.alert']);

app.directive('csSelect', function () {
  return {
    require: '^stTable',
    template: '<input type="checkbox"/>',
    scope: {
      row: '=csSelect'
    },
    link: function (scope, element, attr, ctrl) {

      element.bind('change', function () {
        scope.$apply(function () {
          ctrl.select(scope.row, 'multiple');
        });
      });

      scope.$watch('row.isSelected', function (newValue) {
        if (newValue === true) {
          element.parent().addClass('st-selected');
          element.find('input').prop('checked', true);
        } else {
          element.parent().removeClass('st-selected');
          element.find('input').prop('checked', false);
        }
      });
    }
  };
});

app.directive('stSelectAll', function () {
  return {
    require: '^stTable',
    restrict: 'E',
    template: '<input type="checkbox" ng-model="isAllSelected" />',
    scope: {
      all: '='
    },
    link: function (scope, element, attr, ctrl) {

      scope.$watch('isAllSelected', function () {
        ctrl.getFilteredCollection().forEach(function(val) {
          val.isSelected = scope.isAllSelected;
        });
      });

      scope.$watch(ctrl.getFilteredCollection(), function(newVal, oldVal) {
        if (oldVal) {
          oldVal.forEach(function (val) {
            val.isSelected = false;
          });
        }

        scope.isAllSelected = false;
      });
    }
  };
});

app.controller('MainCtrl', [
    '$scope', '$window', '$interval', '$http', '$alert',
  function($scope, $window, $interval, $http, $alert) {

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

    $scope.selectedDelete = function() {
      var bulk_json = {};
      angular.forEach($scope.internalCollection, function(item) {
        if (item.isSelected) {
          bulk_json[item.uuid] = true;
        }
      });
      if (bulk_json) {
        $http.post('../bulk_delete', bulk_json)
          .success(function(resp) {
            if (!resp.success) {
              error_cb();
              return;
            }
            // delete requires a full reload
            $window.location.reload();
          })
        .error(error_cb);
      }
    };

    $scope.selectedUpdateData = function(data) {
      var bulk_json = {};
      angular.forEach($scope.internalCollection, function(item) {
        if (item.isSelected) {
          bulk_json[item.uuid] = data || '';
        }
      });
      if (bulk_json) {
        $http.post('../bulk_update_data', bulk_json)
          .success(function(resp) {
            if (!resp.success) {
              error_cb();
              return;
            }
            $scope.updateCollection();
          })
        .error(error_cb);
      }
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
            }
          );
        });

      }).error(error_cb);
    };

    $interval($scope.updateCollection, 10000);
  }
]);
