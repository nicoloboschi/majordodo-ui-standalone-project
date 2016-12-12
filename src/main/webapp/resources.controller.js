//function resourcesController($scope, $http, $route, $timeout, $location, $state) {
//
//    $scope.brokerUrl;
//    if (!$state.brokerUrl) {
//        $scope.brokerUrl = $location.search().brokerUrl;
//        $state.brokerUrl = $scope.brokerUrl;
//    } else {
//        $scope.brokerUrl = $state.brokerUrl;
//    }
//    $scope.resources = [];
//
//    $scope.go = function (path) {
//        $location.path(path);
//    };
//
//    $scope.keyPress = function (event) {
//        if (event.keyCode == 13) {
//            $scope.reloadData();
//        }
//    }
//
//
//
//    $scope.reloadData = function () {
//        if (!$scope.brokerUrl) {
//            $scope.brokerUrl = "http://localhost:8086/monitor/proxymd/majordodo?endpointid=jmsbroker@sviluppo-ref3.sviluppo.dna";
//        }
//        $state.brokerUrl = $scope.brokerUrl;
//
//
//        var theUrl = $scope.brokerUrl + '&view=resources';
//
//        $http.get(theUrl).
//                success(function (data, status, headers, config) {
//                    $('#warning-alert').hide();
//                    if (data.ok) {
//                        var resources = [];
//                        for (var i in data.resources) {
//                            var resource = data.resources[i];
//                            resources.push({id: resource.id, runningTasks: resource.runningTasks, actualLimit: resource.actualLimit});
//                        }
//                        $scope.lastupdate = new Date();
//                        $scope.resources = resources;
//                    }
//                }).
//                error(function (data, status, headers, config) {
//                    $('#warning-alert').fadeIn(500);
//                });
//
//    };
//
//    if ($scope.brokerUrl) {
//        $timeout($scope.reloadData(), 1000);
//    }
//    $(document).ready(function () {
//        $('#warning-alert').hide();
//        $('#dataTables').DataTable();
//    });
//}
//

function resourcesController($scope, DTOptionsBuilder, DTColumnBuilder) {
    var vm = this;
    vm.message = '';
    vm.someClickHandler = someClickHandler;
    vm.dtOptions = DTOptionsBuilder.fromSource('data.json')
            .withPaginationType('full_numbers')
            .withOption('rowCallback', rowCallback);
    vm.dtColumns = [
        DTColumnBuilder.newColumn('id').withTitle('ID'),
        DTColumnBuilder.newColumn('firstName').withTitle('First name'),
        DTColumnBuilder.newColumn('lastName').withTitle('Last name').notVisible()
    ];

    function someClickHandler(info) {
        vm.message = info.id + ' - ' + info.firstName;
    }
    function rowCallback(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
        // Unbind first in order to avoid any duplicate handler (see https://github.com/l-lin/angular-datatables/issues/87)
        $('td', nRow).unbind('click');
        $('td', nRow).bind('click', function () {
            $scope.$apply(function () {
                vm.someClickHandler(aData);
            });
        });
        return nRow;
    }
}