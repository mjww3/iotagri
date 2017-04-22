// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers','jett.ionic.filter.bar'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller:"InsideCtrl"
  })
  .state('outside', {
    url: '/outside',
    abstract: true,
    templateUrl: 'templates/outside.html'
  })
  .state('outside.login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  })
  .state('outside.register', {
    url: '/register',
    templateUrl: 'templates/register.html',
    controller: 'RegisterCtrl'
  })
  .state('inside', {
    url: '/inside',
    templateUrl: 'templates/inside.html',
    controller: 'InsideCtrl'
  })

  .state('app.cropname', {
    url: '/crops',
    views: {
      'menuContent': {
        templateUrl: 'templates/crops.html',
        controller:'CropCtrl'
      }
    }
  })
  .state('app.crops', {
    url: '/crops/:crop_name',
    views: {
      'menuContent': {
        templateUrl: 'templates/cropname.html',
        controller:'CropCtrl'
      }
    }
  })
   .state('app.maps', {
    url: '/maps',
    views: {
      'menuContent': {
        templateUrl: 'templates/map.html',
        controller:'MapCtrl'
      }
    }
  })
  .state('app.users',{
    url:'/users',
    views:{
      'menuContent':{
        templateUrl:'templates/users.html',
      }
    }
  })

  .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html'
        }
      }
    })
    .state('app.playlists', {
      url: '/playlists',
      views: {
        'menuContent': {
          templateUrl: 'templates/playlists.html',
          controller: 'PlaylistsCtrl'
        }
      }
    })

  .state('app.single', {
    url: '/playlists/:playlistId',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlist.html',
        controller: 'PlaylistCtrl'
      }
    }
  })
    .state('app.fertilizers',{
      url:'/fertilizers',
      views:{
        'menuContent':{
          templateUrl:'templates/fertilizers.html',
          controller:'FertilizerCtrl'
        }
      }

  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/outside/login');
});
