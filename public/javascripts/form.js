var app = angular.module('form', []);
toastr.options = {
    "closeButton": false,
    "debug": true,
    "positionClass": "toast-top-full-width",
    "onclick": null,
    "showDuration": "1",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
};
/*
 * 延时关闭当前界面
 * */
function deplayCloseCurrentPage() {
    setTimeout(function () {
        if (history.length <= 1 || getUrlParamObj()['isFromApp'] == 'true') { //顶级页面，则关闭当前Web
            XuntongJSBridge.call('closeWebView');
        } else {
            history.back();
        }
    }, 1500);
}
var yzjPerson = {};
app.controller('form_detail', function ($scope, $http) {
    XuntongJSBridge.call('setWebViewTitle', {'title': '表单详情'});
    $scope.openPersonTab = function () {
        XuntongJSBridge.call('personInfo', {
            //'openId': res.data.createopenid
            'openId': $scope.starter.openId
        }, function (result) {
        });
    };
    if (urlObj.type == 'todounhd') {
        document.getElementById('footer').style.visibility = 'visible';//fixme 跟据吉哲提供的新接口判断单据是否存在，如果已经存在，那么分两种情况，待办还是已办，不存在，那么直接大白板提示单据已作废2016-11-22 16:26:25
    } else {
        document.getElementById('footer').style.visibility = 'hidden';
    }
    $http({
        method: 'get',
        url: requrl,
        params: {
            billid: urlObj.billid,
            billtype: urlObj.billtype,
            method: 'getTaskSenderInfo'
        }
    }).success(function (response) {
        $scope.starter = response.data;

    });
    $scope.isApproved = false;
    $scope.note = '';
    $scope.onInputNote = function (note) {
        console.log(note);
        if (note == undefined || note == '') {

            document.getElementById('confirm').style = 'background-color:grey';
            return true;
        } else {
            document.getElementById('confirm').style = 'background-color:#3cbaff';
            return false;
        }
    };
    $scope.agree = 'agree';
    $scope.disagree = 'disagree';
    $scope.mreject = 'reject';
    $scope.currentOper = '';
    $scope.task = {};
    $scope.goAttach = function () {
        var uri = new URI('/attachment');
        uri.addQuery('billid', urlObj.billid);
        uri.addQuery('billtype', urlObj.billtype);
        window.location = uri.toString();
    };
    $scope.goApprove = function () {
        var uri = new URI('/history');
        uri.addQuery('billid', urlObj.billid);
        uri.addQuery('billtype', urlObj.billtype);
        uri.addQuery('taskid', urlObj.taskid);
        uri.addQuery('ts', $scope.task.data.ts);
        window.location = uri.toString();
    };
    $scope.assigns = [];
    $scope.allAssigns = [];
    $scope.selecteds = [];
    $scope.selectedUserIdStr = '';
    $scope.isZhiPai = function () {
        if ($scope.selecteds.length == 0) {
            return true;
        } else {
            return false;
        }
    };
    $scope.selectAll = function () {
        $scope.selecteds = $scope.allAssigns;
        $scope.assigns = [];
    };
    $scope.cancelAll = function () {
        $scope.selecteds = [];
        $scope.assigns = $scope.allAssigns;
    };
    $scope.zhipai = function () {
        $scope.selectedUserIdStr = $scope.selecteds[0].id;
        if ($scope.selecteds.length > 1) {
            for (var i = 1; i < $scope.selecteds.length; i++) {
                $scope.selectedUserIdStr += ',' + $scope.selecteds[i]['id'];
            }
            console.log($scope.selectedUserIdStr);
        }
        $http({
            method: 'get',
            url: requrl,
            params: {
                userid: urlObj.userid,
                taskid: urlObj.taskid,
                action: $scope.currentOper,
                note: $scope.note,
                zpuserids: $scope.selectedUserIdStr,
                method: 'dealTask'
            }
        }).success(function (response) {
            console.log(response);
            if (response.flag == 0) {
                toastr.success('审批成功');
                deplayCloseCurrentPage();
                $scope.isApproved = true;
                $('#footer > div:first-child').removeAttr('data-toggle');
                $('#footer > div:nth-child(2)').removeAttr('data-toggle');
                $('#footer > div:nth-child(3)').removeAttr('data-toggle');
            }
        });
    };
    $scope.pushSelecteds = function (index) {
        $scope.selecteds.push($scope.assigns[index]);
        $scope.assigns.splice(index, 1);
    };
    $scope.pushAssigns = function (index) {
        $scope.assigns.push($scope.selecteds[index]);
        $scope.selecteds.splice(index, 1);
    };
    $scope.oper = function (operation) {
        $scope.currentOper = operation;
        document.getElementById('confirm').style = 'background-color:#3cbaff';
        if (operation == 'agree') {
            //$http({
            //    method: 'get',
            //    url: 'json/history',
            //    params: {}
            //}).success(function (response) {
            //    console.log(response);
            //    $scope.assigns = response.data;
            //});
            $scope.note = '批准';//每次点击前，需要清空note，这样，不管之前是以何种方式关闭了对话框，不管是否已经填写了建议，都先清空，重新填写。
            //$('#myModal').modal({
            //    show: true
            //});
        } else if (operation == 'disagree') {
            $scope.note = '不批准';
        } else if (operation == 'reject') {
            $scope.note = '驳回';
        }

    };
    $scope.submit = function (operation) {
        $http({
            method: 'get',
            url: requrl,
            params: {
                userid: urlObj.userid,
                taskid: urlObj.taskid,
                action: operation,
                note: $scope.note,
                method: 'dealTask'
            }
        }).success(function (response) {
            console.log(response);
            if (response.flag == 0) {

                if (response.data.isAssign == 'Y') {//有指派信息
                    $scope.allAssigns = response.data.psnstructlist;
                    $scope.assigns = response.data.psnstructlist;
                    $('#myModal').modal({
                        show: true
                    });
                } else {//没有指派信息直接关闭当前界面
                    toastr.success('审批成功');
                    deplayCloseCurrentPage();
                    $scope.isApproved = true;
                    $('#footer > div:first-child').removeAttr('data-toggle');
                    $('#footer > div:nth-child(2)').removeAttr('data-toggle');
                    $('#footer > div:nth-child(3)').removeAttr('data-toggle');
                }
            } else {
                toastr.error(response.desc);
            }


        });
    };
    $scope.mcancel = function () {
        $scope.note = '';
    };
    distinguish(urlObj.type);
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
            //预算表单的三种类型：T1，  TBWT-01, TBWT-02
            if (response.data.billtype == 'T1' || response.data.billtype == 'TBWT-01' || response.data.billtype == 'TBWT-02') {
                angular.element(document).find("#table").html(response.data.taskbill);

            } else {
                $scope.task = response;
                if (response.flag == 0) {
                    $scope.heads = response.data.taskbill.head.tabContent;
                    $scope.bodys = response.data.taskbill.body.tabContent;
                    $('#myTab a').click(function (e) {
                        e.preventDefault();
                        $(this).tab('show')
                    });
                    $('#myTab a:first').tab('show');
                } else {
                    toastr.error(response.desc);
                }
            }
        });

});