(function() {
    'use strict';

    angular
        .module('gpmrApp')
        .controller('DataCounterController', DataCounterController);

    DataCounterController.$inject = ['$scope', '$state', 'DataCounter', 'ParseLinks', 'AlertService'];

    function DataCounterController ($scope, $state, DataCounter, ParseLinks, AlertService) {
        var vm = this;
        vm.dataCounters = [];
        vm.predicate = 'vtype';
        vm.reverse = true;
        vm.page = 0;
        vm.loadAll = function() {
            DataCounter.query({
                page: vm.page,
                size: 20,
                sort: sort()
            }, onSuccess, onError);
            function sort() {
                var result = [vm.predicate + ',' + (vm.reverse ? 'asc' : 'desc')];
                if (vm.predicate !== 'vtype') {
                    result.push('vtype');
                }
                return result;
            }
            function onSuccess(data, headers) {
                vm.links = ParseLinks.parse(headers('link'));
                vm.totalItems = headers('X-Total-Count');
                for (var i = 0; i < data.length; i++) {
                    vm.dataCounters.push(data[i]);
                }
            }
            function onError(error) {
                AlertService.error(error.data.message);
            }
        };
        vm.reset = function() {
            vm.page = 0;
            vm.dataCounters = [];
            vm.loadAll();
        };
        vm.loadPage = function(page) {
            vm.page = page;
            vm.loadAll();
        };

        vm.loadAll();

    }
})();
