function searchController($scope, $http, $route, $timeout, $location, $state) {
    var allSearchFilter = ['searchStatus', 'searchWorkerId', 'searchTasktype', 'searchTaskId', 'searchSlot', 'searchUserId'];
    $scope.brokerUrl;
    if (!$state.brokerUrl) {
        $scope.brokerUrl = $location.search().brokerUrl;
        $state.brokerUrl = $scope.brokerUrl;
    } else {
        $scope.brokerUrl = $state.brokerUrl;
    }

    $scope.tasks = [];
    $scope.filters = [];
    $scope.max = '150';

    $scope.searchThis = function (id, idsearch) {
        $('#' + idsearch + "-input").val(id);
        $scope.filters[idsearch] = id;
        toogleClassSuccess(idsearch);
        $scope.reloadData();
    }

    $scope.keyPress = function (event) {
        if (event.keyCode == 13) {
            $scope.reloadData();
        }
    }

    $scope.go = function (path) {
        $location.path(path);
    };

    $scope.clearFilters = function () {
        for (var i = 0; i < allSearchFilter.length; i++) {
            $scope.filters[allSearchFilter[i]] = "";
            toogleClassSuccess(allSearchFilter[i]);
        }
        $scope.reloadData();
    };



    $scope.reloadData = function () {
        if (!$scope.brokerUrl) {
            $scope.brokerUrl = "http://localhost:8086/monitor/proxymd/majordodo?endpointid=jmsbroker@sviluppo-ref3.sviluppo.dna";
        }
        
        $state.brokerUrl = $scope.brokerUrl;

        if (String(~~Number($scope.max)) !== $scope.max) {
            $scope.max = '150';
        }
        if ($scope.max > 300) {
            $scope.max = 300;
        }
        var theUrl = '';
        if ($scope.filters['searchTaskId']) {
            theUrl = $scope.brokerUrl + '&view=task' + '&taskId=' + encodeURIComponent($scope.filters['searchTaskId']);
            $scope.filters = [];
        } else {
            theUrl = $scope.brokerUrl + '&view=tasks';
            if ($scope.filters['searchUserId']) {
                theUrl = theUrl + '&userId=' + encodeURIComponent($scope.filters['searchUserId']);
            }
            if ($scope.filters['searchStatus']) {
                theUrl = theUrl + '&status=' + encodeURIComponent($scope.filters['searchStatus']);
            }
            if ($scope.filters['searchSlot']) {
                theUrl = theUrl + '&slot=' + encodeURIComponent($scope.filters['searchSlot']);
            }
            if ($scope.filters['searchWorkerId']) {
                theUrl = theUrl + '&workerId=' + encodeURIComponent($scope.filters['searchWorkerId']);
            }
            if ($scope.filters['searchTasktype']) {
                theUrl = theUrl + '&tasktype=' + encodeURIComponent($scope.filters['searchTasktype']);
            }
            if ($scope.max) {
                theUrl = theUrl + '&max=' + encodeURIComponent($scope.max);
            }
            $scope.filters['searchTaskId'] = "";
        }

        $http.get(theUrl).
                success(function (data, status, headers, config) {
                    $('#warning-alert').hide();
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
                    $('#warning-alert').fadeIn(500);
                });

    };

    function popTask(taskId) {
        var theUrl = $scope.brokerUrl + '&view=task&taskId=' + taskId;
        $http.get(theUrl).
                success(function (data, status, headers, config) {
                    if (data.ok) {
                        if (data.task.createdTimestamp && parseInt(data.task.createdTimestamp)) {
                            data.task.createdTimestamp = new Date(data.task.createdTimestamp);
                        }
                        if (data.task.deadline && parseInt(data.task.deadline)) {
                            data.task.deadline = new Date(data.task.deadline);
                        }
                        $scope.taskdetails = data.task;

                    }
                }).error(function (data, status, headers, config) {
            alert("cannot display data for task :" + taskId);
        });

    }

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

    if ($scope.brokerUrl) {
        $timeout($scope.reloadData(), 0);
    }

    $(document).on("click", ".taskdetails", function (event) {
        popTask(event.target.id);
    });

    $(document).on("show.bs.modal", "#myModal", function () {
        $('#myModal').find('.modal-dialog').css({
            'max-width': '30%',
            width: 'auto'
        });
    });
    $(document).ready(function () {
        $('#warning-alert').hide();
        $('#li-search').attr("style", "background-color: #E0E0E0;");
    });

}


function toogleClassSuccess(id) {
    var $el = $('#' + id);
    var value = $('#' + id + "-input").val();
    var classe = $el.attr('class');
    if (value.length === 0) {
        $el.attr('class', classe.replace("has-success", ""));
    } else {
        if (!classe.includes('has-success')) {
            $el.attr('class', classe + ' has-success');
        }
    }



}


