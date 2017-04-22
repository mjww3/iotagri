angular.module('starter.controllers', [])
.constant('AUTH_EVENTS', {
  notAuthenticated: 'auth-not-authenticated'
})
 
.constant('API_ENDPOINT', {
  url: 'http://localhost:8080'
  //  For a simulator use: url: 'http://127.0.0.1:8080/api'
})

.controller('LoginCtrl', function($scope, AuthService, $ionicPopup, $state) {
  $scope.user = {
    name: '',
    password: ''
  };
 
  $scope.login = function() {
    AuthService.login($scope.user).then(function(msg) {
      $state.go('app.users');
    }, function(errMsg) {
      var alertPopup = $ionicPopup.alert({
        title: 'Login failed!',
        template: errMsg
      });
    });
  };
})
 
.controller('RegisterCtrl', function($scope, AuthService, $ionicPopup, $state) {
  $scope.user = {
    name: '',
    password: ''
  };
 
  $scope.signup = function() {
    AuthService.register($scope.user).then(function(msg) {
      $state.go('outside.login');
      var alertPopup = $ionicPopup.alert({
        title: 'Register success!',
        template: msg
      });
    }, function(errMsg) {
      var alertPopup = $ionicPopup.alert({
        title: 'Register failed!',
        template: errMsg
      });
    });
  };
})
 
.controller('InsideCtrl', function($scope, AuthService, API_ENDPOINT, $http, $state) {
  $scope.destroySession = function() {
    AuthService.logout();
  };
 
  $scope.getInfo = function() {
    $http.get(API_ENDPOINT.url + '/memberinfo').then(function(result) {
      $scope.memberinfo = result.data.msg;
    });
  };
 
  $scope.logout = function() {
    AuthService.logout();
    $state.go('outside.login');
  };
})
 
.controller('AppCtrl', function($scope, $state, $ionicPopup, AuthService, AUTH_EVENTS) {
  $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
    AuthService.logout();
    $state.go('outside.login');
    var alertPopup = $ionicPopup.alert({
      title: 'Session Lost!',
      template: 'Sorry, You have to login again.'
    });
  });
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('CropCtrl',function($scope,$stateParams,$state,$rootScope,$http,API_ENDPOINT,$ionicFilterBar){
 
 $http.get(API_ENDPOINT.url + '/crops/all').then(function(result){
    $scope.crops= result.data;
    console.log(result);
  });

  $scope.clickedItem = function(crop){
    $state.go()
  };
  var Values = [];
  var filterBarInstance;
  ///search bar
  $scope.doRefresh = function () {
    $scope.values = window.Values;
    $scope.$broadcast('scroll.refreshComplete');
  };

  $scope.showFilterBar = function () {
    filterBar = $ionicFilterBar.show({
      items: $scope.crops,
      update: function (filteredItems) {
        $scope.crops = filteredItems
      }
      //filterProperties : 'first_name'
    });
  }
})

.controller('PlaylistCtrl', function($scope, $stateParams,$rootScope,$http,API_ENDPOINT) {
})

///this is the controller for the fertilizers
.controller('FertilizerCtrl',function($scope,$http,API_ENDPOINT,$rootScope,$state,$stateParams){
  $scope.carbamid = 0;
  $scope.nitrate = 0;
  $scope.ammonnia = 0;

  $scope.getFertilizersAll = function(){
    $http.get(API_ENDPOINT+'/fertilizers').then(function(result){
      $scope.fertilizer = result.name;
    });
  }
  $scope.getContent = function(name){
    $http.get(API_ENDPOINT+'/fertilizers/'+name._id).then(function(result){
    });

  }

})
.controller('SoilColumn',function($scope,$rootScope,$state,$stateParams){

});




