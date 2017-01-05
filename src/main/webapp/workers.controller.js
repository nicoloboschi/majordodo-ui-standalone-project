function workersController($scope, $http, $route, $timeout, $location, $state) {
    $scope.brokerUrl;
    if (!$state.brokerUrl) {
        $scope.brokerUrl = $location.search().brokerUrl;
        $state.brokerUrl = $scope.brokerUrl;
    } else {
        $scope.brokerUrl = $state.brokerUrl;
    }

    $scope.status = {clusterMode: '', currentLedgerId: '', currentSequenceNumber: '', errorTasks: '', finishedTasks: '', pendingTasks: '', runningTasks: '', tasks: '', waitingTasks: ''};
    $scope.workers = [];
    $scope.brokers = [];
    $scope.lastupdate;

    $scope.keyPress = function (event) {
        if (event.keyCode == 13) {
            $scope.reloadData();
        }
    }

    $scope.go = function (path) {
        $location.path(path);
    };

    $scope.showWorkerResources = function (workerId) {
        $location.path('/worker').search('workerId', workerId);
    };

   
    $scope.reloadData = function () {
        if (!$scope.brokerUrl) {
            $scope.brokerUrl = "http://localhost:8086/monitor/proxymd/majordodo?endpointid=jmsbroker@sviluppo-ref3.sviluppo.dna";
        }
        $state.brokerUrl = $scope.brokerUrl;

        $http.get($scope.brokerUrl).
                success(function (data, status, headers, config) {
                    $('#warning-alert').hide();
                    if (data.ok) {
                        $scope.status = data.status;
                        $scope.workers = data.workers;
                        $scope.lastupdate = new Date();
                        $scope.colors = setColors($scope.workers);
                    }
                }).
                error(function (data, status, headers, config) {
                    $('#warning-alert').fadeIn(500);
                });

    };
    
    if ($scope.brokerUrl) {
        $timeout($scope.reloadData(), 1000);
    }
    function setColors(workers) {
        var i, colors = [];
        for (i = 0; i < $scope.workers.length; i++) {
            if ($scope.workers[i].status == "CONNECTED") {
                colors[$scope.workers[i].id] = "success";
            } else if ($scope.workers[i].status == "DEAD") {
                colors[$scope.workers[i].id] = "danger";
            }
        }
        return colors;
    }
     $(document).ready(function () {
        $('#warning-alert').hide();
        $('#li-workers').attr("style", "background-color: #E0E0E0;");
    });
}
