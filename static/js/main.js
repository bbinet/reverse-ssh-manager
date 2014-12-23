var app = angular.module('rss', ['smart-table', 'toggle-switch', 'angularMoment']);

app.controller('MainCtrl', ['$scope', '$http',
  function($scope, $http) {

    $scope.displayedCollection = [];

    var watchers = [];
    var error_cb = function() {
      console.log('catch error from server');
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
        angular.forEach(watchers, function(unwatch, idx) {
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

    $scope.updateCollection();

  }
]);
