var app = angular.module('rss', ['smart-table', 'toggle-switch']);

app.controller('MainCtrl', ['$scope', '$http',
  function($scope, $http) {

    $scope.displayedCollection = [];

    var error_cb = function() {
      console.log('catch error from server');
    };

    $scope.updateCollection = function() {
      $http({
        url: '../uuids',
        method: 'GET'
      }).success(function(resp) {
        if (! resp.success) {
          error_cb();
          return;
        }
        $scope.internalCollection = resp.db;
      }).error(error_cb);
    };

    $scope.updateCollection();

  }
]);
