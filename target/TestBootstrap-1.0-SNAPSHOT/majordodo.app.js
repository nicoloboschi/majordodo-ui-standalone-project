



var modulo = angular.module('MajordodoWebUI', ['ngRoute']);

modulo.factory('$state', function () {
    var state = {};
    state.brokerUrl;
    return state;
});

modulo.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/home',
                {templateUrl: 'index_1.html', controller: MajordodoHomeCtrl});
        $routeProvider.when('/workers',
                {templateUrl: 'workers.html', controller: MajordodoWorkersCtrl});
        $routeProvider.when('/search/:userid/:tasktype/:status/:slot', //fare filtri in html per bottoni in table
                {templateUrl: 'search.html', controller: genericSearchCtrl});
        $routeProvider.when('/resources',
                {templateUrl: 'resources.html', controller: MajordodoResourcesCtrl});
        $routeProvider.otherwise({redirectTo: '/home'});
    }]);

function MajordodoHomeCtrl($scope, $http, $route, $timeout, $location, $state) {


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
        if (path == "/home") {
            $scope.reloadData();
        } else {
            $location.path(path);
        }
    };

    $scope.keyPress = function (event) {
        if (event.keyCode == 13) {
            $scope.reloadData();
        }
    }

    $scope.refreshPage = function () {
        $scope.reloadData();
    };

    if ($scope.brokerUrl) {
        $timeout($scope.refreshPage, 1000);
    }

    $scope.reloadData = function () {
        if (!$scope.brokerUrl) {
            $scope.brokerUrl = "http://localhost:8086/monitor/proxymd/majordodo?endpointid=jmsbroker@sviluppo-ref3.sviluppo.dna";
        }
        $state.brokerUrl = $scope.brokerUrl;
        $http.get($scope.brokerUrl).
                success(function (data, status, headers, config) {
                    if (data.ok) {
                        $scope.status = data.status;
                        $scope.brokers = data.brokers;
                        $scope.lastupdate = new Date();
                    }
                }).
                error(function (data, status, headers, config) {

                });


    };
}
function MajordodoWorkersCtrl($scope, $http, $route, $timeout, $location, $state) {
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

    $scope.refreshPage = function () {
        $scope.reloadData();
    };

    $scope.showWorkerResources = function (workerId) {
        $location.path('/worker').search('workerId', workerId);
    };

    if ($scope.brokerUrl) {
        $timeout($scope.refreshPage, 1000);
    }
    $scope.reloadData = function () {
        if (!$scope.brokerUrl) {
            $scope.brokerUrl = "http://localhost:8086/monitor/proxymd/majordodo?endpointid=jmsbroker@sviluppo-ref3.sviluppo.dna";
        }
        $state.brokerUrl = $scope.brokerUrl;

        $http.get($scope.brokerUrl).
                success(function (data, status, headers, config) {
                    if (data.ok) {
                        $scope.status = data.status;
                        $scope.workers = data.workers;
                        $scope.lastupdate = new Date();
                        $scope.colors = setColors($scope.workers);

                    }
                }).
                error(function (data, status, headers, config) {

                });

    };

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
}
function genericSearchCtrl($scope, $http, $route, $timeout, $location, $state, $routeParams) {
    var status = $routeParams.status;
    var userid = $routeParams.userid;
    var tasktype = $routeParams.tasktype;
    var slot = $routeParams.slot;

    $scope.brokerUrl;
    if (!$state.brokerUrl) {
        $scope.brokerUrl = $location.search().brokerUrl;
        $state.brokerUrl = $scope.brokerUrl;
    } else {
        $scope.brokerUrl = $state.brokerUrl;
    }
    $scope.tasks = [];
    $scope.filterUserId = '';
    $scope.filterStatus = '';
    $scope.filterSlot = '';
    $scope.filterWorkerId = '';
    $scope.filterTasktype = '';
    $scope.filterTaskId = '';
    $scope.max = '100';
    $scope.lastupdate;
    $scope.lastUrl = '';
    $scope.lastCount = '';

    if (status != "none") {
        $scope.filterStatus = status;
    }
    if (userid != "none") {
        $scope.filterUserId = userid;
    }
    if (tasktype != "none") {
        $scope.tasktype = tasktype;
    }
    if (slot != "none") {
        $scope.filterSlot = slot;
    }

    $scope.keyPress = function (event) {
        if (event.keyCode == 13) {
            $scope.reloadData();
        }
    }
    $scope.go = function (path) {
        $location.path(path);
    };

    $scope.refreshPage = function () {
        $scope.reloadData();
    };

    $scope.showTask = function (taskId) {
        $location.path('/task').search('taskId', taskId);
    };

    if ($scope.brokerUrl) {
        $timeout($scope.refreshPage, 1000);
    }

    $scope.reloadData = function () {
        if (!$scope.brokerUrl) {
            $scope.brokerUrl = "http://localhost:8086/monitor/proxymd/majordodo?endpointid=jmsbroker@sviluppo-ref3.sviluppo.dna";
        }
        $state.brokerUrl = $scope.brokerUrl;

        var theUrl = '';
        if ($scope.filterTaskId) {
            theUrl = $scope.brokerUrl + '&view=task' + '&taskId=' + encodeURIComponent($scope.filterTaskId);
        } else {
            theUrl = $scope.brokerUrl + '&view=tasks';
            if ($scope.filterUserId) {
                theUrl = theUrl + '&userId=' + encodeURIComponent($scope.filterUserId);
            }
            if ($scope.filterStatus) {
                theUrl = theUrl + '&status=' + encodeURIComponent($scope.filterStatus);
            }
            if ($scope.filterSlot) {
                theUrl = theUrl + '&slot=' + encodeURIComponent($scope.filterSlot);
            }
            if ($scope.filterWorkerId) {
                theUrl = theUrl + '&workerId=' + encodeURIComponent($scope.filterWorkerId);
            }
            if ($scope.filterTasktype) {
                theUrl = theUrl + '&tasktype=' + encodeURIComponent($scope.filterTasktype);
            }
            if ($scope.max) {
                theUrl = theUrl + '&max=' + encodeURIComponent($scope.max);
            }
        }

        $http.get(theUrl).
                success(function (data, status, headers, config) {
                    $scope.lastUrl = theUrl;
                    if (data.ok) {
                        $scope.tasks = data.tasks;
                        $scope.lastupdate = new Date();
                        $scope.lastCount = data.count;
                        if ($scope.tasks) {
                            $scope.colors = setTaskColors();
                        } else {
                            $scope.tasks = [];
                            $scope.tasks[0] = data.task;
                        }
                    }
                }).
                error(function (data, status, headers, config) {
                    alert("An error occurred");
                });

    };
    function setTaskColors() {
        var i, colors = [];
        for (i = 0; i < $scope.tasks.length; i++) {
            if ($scope.tasks[i].status == "waiting") {
                colors[$scope.tasks[i].taskId] = "warning";
            } else if ($scope.tasks[i].status == "error") {
                colors[$scope.tasks[i].taskId] = "danger";
            } else if ($scope.tasks[i].status == "finished") {
                colors[$scope.tasks[i].taskId] = "info";
            } else if ($scope.tasks[i].status == "running") {
                colors[$scope.tasks[i].taskId] = "success";
            }
        }
        return colors;
    }
}


function MajordodoSlotsCtrl($scope, $http, $route, $timeout, $location, $state) {
    $scope.brokerUrl;

    if (!$state.brokerUrl) {
        $scope.brokerUrl = $location.search().brokerUrl;
        $state.brokerUrl = $scope.brokerUrl;
    } else {
        $scope.brokerUrl = $state.brokerUrl;
    }
    $scope.slots = [];

    $scope.go = function (path) {
        $location.path(path);
    };

    $scope.showTask = function (taskId) {
        $location.path('/task').search('taskId', taskId);
    };

    $scope.refreshPage = function () {
        $scope.reloadData();
    };

    if ($scope.brokerUrl) {
        $timeout($scope.refreshPage, 1000);
    }

    $scope.reloadData = function () {
        if (!$scope.brokerUrl) {
            $scope.brokerUrl = "http://localhost:7364/majordodo?";
        }
        $scope.lastCount = 0;
        var theUrl = $scope.brokerUrl + '&view=slots';

        $http.get(theUrl).
                success(function (data, status, headers, config) {
                    if (data.ok) {
                        var slots = [];
                        for (var i in data.slots.busySlots) {
                            slots.push({slot: i, taskId: data.slots.busySlots[i]});
                        }
                        $scope.lastCount = slots.length;
                        $scope.slots = slots;
                        $scope.lastupdate = new Date();
                    }
                }).
                error(function (data, status, headers, config) {
                    alert("An error occurred");
                });

    };
}

function MajordodoResourcesCtrl($scope, $http, $route, $timeout, $location, $state) {
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


    $scope.refreshPage = function () {
        $scope.reloadData();
    };

    if ($scope.brokerUrl) {
        $timeout($scope.refreshPage, 1000);
    }

    $scope.reloadData = function () {
        if (!$scope.brokerUrl) {
            $scope.brokerUrl = "http://localhost:8086/monitor/proxymd/majordodo?endpointid=jmsbroker@sviluppo-ref3.sviluppo.dna";
        }
        $state.brokerUrl = $scope.brokerUrl;


        var theUrl = $scope.brokerUrl + '&view=resources';

        $http.get(theUrl).
                success(function (data, status, headers, config) {
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
                    alert("An error occurred");
                });

    };
}

function MajordodoTaskCtrl($scope, $http, $route, $timeout, $location, $state) {
    $scope.brokerUrl;
    if (!$state.brokerUrl) {
        $scope.brokerUrl = $location.search().brokerUrl;
        $state.brokerUrl = $scope.brokerUrl;
    } else {
        $scope.brokerUrl = $state.brokerUrl;
    }
    $scope.taskId = $location.search().taskId;
    $scope.loading = true;
    $scope.task = {};


    $scope.keyPress = function (event) {
        if (event.keyCode == 13) {
            $scope.reloadData();
        }
    }
    $scope.go = function (path) {
        $location.path(path);
    };

    $scope.refreshPage = function () {
        $scope.reloadData();
    };

    if ($scope.brokerUrl) {
        $timeout($scope.refreshPage, 1000);
    }

    $scope.reloadData = function () {
        if (!$scope.brokerUrl || !$scope.taskId) {
            $scope.brokerUrl = "http://localhost:7364/majordodo?";
        }
        $scope.loading = true;
        var theUrl = $scope.brokerUrl + '&view=task&taskId=' + $scope.taskId;
        $http.get(theUrl).
                success(function (data, status, headers, config) {
                    if (data.ok) {
                        if (data.task.createdTimestamp && parseInt(data.task.createdTimestamp)) {
                            data.task.createdTimestamp = new Date(data.task.createdTimestamp);
                            alert(data.task.createdTimestamp);
                        }
                        if (data.task.deadline && parseInt(data.task.deadline)) {
                            data.task.deadline = new Date(data.task.deadline);
                        }
                        $scope.task = data.task;

                        $scope.lastupdate = new Date();
                    }
                    $scope.loading = false;
                }).
                error(function (data, status, headers, config) {
                    alert("An error occurred");
                });

    };
}
function MajordodoWorkerCtrl($scope, $http, $route, $timeout, $location, $state) {
    $scope.brokerUrl;
    if (!$state.brokerUrl) {
        $scope.brokerUrl = $location.search().brokerUrl;
        $state.brokerUrl = $scope.brokerUrl;
    } else {
        $scope.brokerUrl = $state.brokerUrl;
    }
    $scope.workerId = $location.search().workerId;
    $scope.loading = true;

    $scope.go = function (path) {
        $location.path(path);
    };

    $scope.refreshPage = function () {
        $scope.reloadData();
    };

    if ($scope.brokerUrl) {
        $timeout($scope.refreshPage, 1000);
    }

    $scope.reloadData = function () {
        if (!$scope.brokerUrl || !$scope.workerId) {
            $scope.brokerUrl = "http://localhost:7364/majordodo?";
        }
        $scope.loading = true;
        var theUrl = $scope.brokerUrl + '&view=worker&workerId=' + $scope.workerId;
        $http.get(theUrl).
                success(function (data, status, headers, config) {
                    if (data.ok) {
                        if (data.worker.lastConnectionTs && parseInt(data.worker.lastConnectionTs)) {
                            data.worker.lastConnectionTs = new Date(data.worker.lastConnectionTs);
                        }
                        $scope.worker = data.worker;

                        $scope.lastupdate = new Date();
                    }
                    $scope.loading = false;
                }).
                error(function (data, status, headers, config) {
                    alert("An error occurred");
                });

    };
}
