function homeController($scope, $http, $route, $timeout, $location, $state) {
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
            $scope.brokerUrl = "http://localhost:8086/monitor/proxymd/majordodo?endpointid=jmsbroker@sviluppo-ref3.sviluppo.dna";
        }
        $state.brokerUrl = $scope.brokerUrl;
        $http.get($scope.brokerUrl).
                success(function (data, status, headers, config) {
                    $('#warning-alert').hide();
                    if (data.ok) {
                        var allTask = data.status.tasks;
                        $scope.running = parseInt(data.status.runningTasks / allTask * 100, 10);
                        $scope.waiting = parseInt(data.status.waitingTasks / allTask * 100, 10);
                        $scope.error = parseInt(data.status.errorTasks / allTask * 100, 10);
                        $scope.finished = parseInt(data.status.finishedTasks / allTask * 100, 10);
                        var sum = $scope.finished + $scope.error + $scope.waiting + $scope.running;
                        if (sum < 100) {
                            $scope.finished += (100 - sum);
                        }

                        $scope.status = data.status;
                        $scope.brokers = data.brokers;
                        $scope.lastupdate = new Date();
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

    });
}
