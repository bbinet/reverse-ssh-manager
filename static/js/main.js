var app = angular.module('rsm', ['smart-table', 'toggle-switch', 'angularMoment', 'mgcrea.ngStrap.alert']);

app.controller('MainCtrl', ['$scope', '$http', '$alert',
  function($scope, $http, $alert) {

    $scope.displayedCollection = [];

    var watchers = [];
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
        angular.forEach(watchers, function(unwatch) {
          // unregister old watchers
          unwatch();
        });
        $scope.internalCollection = resp.db;
        angular.forEach($scope.internalCollection, function(item, idx) {
          watchers.push(
            $scope.$watch(
              'displayedCollection[' + idx +'].active', function(active) {
                $http.post('../uuid/' + item.uuid, {active: active})
                  .success(function(resp) {
                    $scope.displayedCollection[idx] = resp;
                  });
              }));
        });
      }).error(error_cb);
    };

  }
]);
