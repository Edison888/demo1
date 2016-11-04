var app = angular.module('form', []);
app.controller('form_detail', function ($scope, $http) {
    $scope.agree = 'agree';
    $scope.disagree = 'disagree';
    $scope.mreject = 'reject';
    $scope.currentOper = '';
    $scope.goApprove = function () {
        var uri = new URI('/history');
        uri.addQuery('billid', urlObj.billid);
        uri.addQuery('billtype', urlObj.billtype);
        window.location = uri.toString();
    };
    $scope.oper = function (operation) {
        $scope.currentOper = operation;
        $http({
            method: 'get',
            url: requrl,
            params: {
                userid: urlObj.userid,
                taskid: urlObj.taskid,
                action: operation,
                note: '��׼��',
                method: 'dealTask'
            }
        }).success(function (response) {
            console.log(response);
        });
    };
    $http(
        {
            method: 'get',
            url: requrl,
            //url: 'json/form',
            params: {
                statuskey: statuskeyparam,
                statuscode: statuscodeparam,
                taskid: urlObj.taskid,
                method: 'GetTask'
            }
        }
    ).success(function (response) {
            console.log(response);
            $scope.heads = response.data.taskbill.head.tabContent;
            $scope.bodys = response.data.taskbill.body.tabContent;
            $('#myTab a').click(function (e) {
                e.preventDefault();
                $(this).tab('show')
            });
            $('#myTab a:first').tab('show');
        });

});