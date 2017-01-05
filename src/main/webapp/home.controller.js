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
    $scope.optionsStatus = getStatusOptions();
    $scope.optionsTasks = getTasksOptions();

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
                        $scope.dataStatus = [
                            {
                                key: "Finished",
                                y: $scope.status.finishedTasks,
                                color: "#337ab7"
                            },
                            {
                                key: "Running",
                                y: $scope.status.runningTasks,
                                color: "#5cb85c"
                            },
                            {
                                key: "Error",
                                y: $scope.status.errorTasks,
                                color: "#d9534f"
                            },
                            {
                                key: "Waiting",
                                y: $scope.status.waitingTasks,
                                color: "#f0ad4e"
                            }

                        ];
                    }
                }).
                error(function (data, status, headers, config) {
                    $('#warning-alert').fadeIn(500);
                });


        $http.get($scope.brokerUrl + "&view=tasksoverview").
                success(function (data, status, headers, config) {
                    $('#warning-alert').hide();
                    if (data.ok) {
                        var r = [];
                        var tasks = data.tasks;
                        for (var i = 0; i < 17; i++) {
                            r.push({
                                label: Object.keys(tasks)[i],
                                value: ~~Number(tasks[Object.keys(tasks)[i]])
                            });
                        }
                        var g = [{key: "ciao",
                                values: r}];
                        $scope.dataTasks = g;

                    }
                }).
                error(function (data, status, headers, config) {
                    $('#warning-alert').hide();
                    $('#warning-alert').attr("class", "alert alert-danger");
                    $('#warning-alert').fadeIn(500);
                });
    };

    if ($scope.brokerUrl) {
        $timeout($scope.reloadData(), 1000);
    }
    $scope.i = 0;
    $(document).ready(function () {
        if ($scope.i === 0) {
            $scope.reloadData();
            $scope.i++;
        }

        $('li').attr("class", "");
        $('#li-home').attr("class", "active");
    });
}

function getTasksOptions() {
    return {
        chart: {
            type: 'discreteBarChart',
            height: 450,
            margin: {
                top: 20,
                right: 20,
                bottom: 50,
                left: 55
            },
            x: function (d) {
                return d.label;
            },
            y: function (d) {
                return d.value;
            },
            showXAxis: false,
            showValues: true,
            valueFormat: function (d) {
                return d;
            },
            duration: 500,
            xAxis: {
                axisLabel: 'Task type'
            },
            yAxis: {
                axisLabelDistance: -10
            }
        }
    };
}
function getStatusOptions() {
    return {
        chart: {
            type: 'pieChart',
            height: 400,
            donut: true,

            x: function (d) {
                return d.key;
            },
            y: function (d) {
                return d.y;
            },
            showLabels: false,
            pie: {
                startAngle: function (d) {
                    return d.startAngle / 2 - Math.PI / 2
                },
                endAngle: function (d) {
                    return d.endAngle / 2 - Math.PI / 2
                }
            },
            duration: 500,
            labelThreshold: 0.01,
            labelSunbeamLayout: true,
            legend: {
                margin: {
                    top: 5,
                    right: 10,
                    bottom: 5,
                    left: 0
                }
            }
        }
    };

}