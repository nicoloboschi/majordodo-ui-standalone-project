function resourcesController($scope, $http, $route, $timeout, $location, $state) {

    $scope.brokerUrl;
    if (!$state.brokerUrl) {
        $scope.brokerUrl = $location.search().brokerUrl;
        $state.brokerUrl = $scope.brokerUrl;
    } else {
        $scope.brokerUrl = $state.brokerUrl;
    }
    $scope.resources = [];

    $scope.go = function (path) {
        $location.path(path);
    };

    $scope.keyPress = function (event) {
        if (event.keyCode == 13) {
            $scope.reloadData();
        }
    }



    $scope.reloadData = function () {
        if (!$scope.brokerUrl) {
            $scope.brokerUrl = "http:localhost:8086/monitor/proxymd/majordodo?endpointid=jmsbroker@sviluppo-ref3.sviluppo.dna";
        }
        $state.brokerUrl = $scope.brokerUrl;


        var theUrl = $scope.brokerUrl + '&view=resources';

        $http.get(theUrl).
                success(function (data, status, headers, config) {
                    $('#warning-alert').hide();
                    if (data.ok) {
                        var resources = [];
                        for (var i in data.resources) {
                            var resource = data.resources[i];
                            resources.push({id: resource.id, runningTasks: resource.runningTasks, actualLimit: resource.actualLimit});
                        }
                        $scope.lastupdate = new Date();
                        $scope.resources = resources;
                    }
                }).
                error(function (data, status, headers, config) {
                    $('#warning-alert').fadeIn(500);
                });

    };

    if ($scope.brokerUrl) {
        $timeout($scope.reloadData(), 1000);
    }
    $(document).ready(function () {
        $('#warning-alert').hide();
        $('li').attr("class", "");
        $('#li-resources').attr("class", "active");
    });
}


