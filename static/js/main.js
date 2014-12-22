var app = angular.module('rss', ['smart-table', 'toggle-switch']);

app.controller('MainCtrl', ['$scope',
  function($scope) {

    console.log('MainCtrl');

    $scope.echo = function(str) {
      console.log(str);
    };
  }
]);
