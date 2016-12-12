var modulo = angular.module('majordodo-web-ui-module', ['ngRoute']);

modulo.factory('$state', function () {
    var state = {};
    state.brokerUrl;
    return state;
});

modulo.config(function ($routeProvider) {
    $routeProvider.when('/home',
            {templateUrl: 'home.html', controller: homeController});
    $routeProvider.when('/workers',
            {templateUrl: 'workers.html', controller: workersController});
    $routeProvider.when('/search',
            {templateUrl: 'search.html', controller: searchController});
    $routeProvider.when('/resources',
            {templateUrl: 'resources.html', controller: resourcesController});
    $routeProvider.otherwise({redirectTo: '/home'});
});




