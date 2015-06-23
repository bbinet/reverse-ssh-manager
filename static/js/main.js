var app = angular.module('rsm', ['smart-table', 'toggle-switch', 'angularMoment', 'mgcrea.ngStrap.alert']);

app.controller('MainCtrl', ['$scope', '$window', '$interval', '$http', '$alert',
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
                $http.post('../uuid/' + uuid, {active: newValue})
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
