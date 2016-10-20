toastr.options = {
    "closeButton": false,
    "debug": true,
    "positionClass": 'toast-bottom-full-width',
    "onclick": null,
    "showDuration": "1",
    "hideDuration": "1000",
    "timeOut": "3000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
};
var app = angular.module('binding', []);
app.controller('list_controller', function ($scope, $http) {
    $scope.tableSelection = {};
    $scope.selectedRows = [];
    $scope.del = function () {
        //start from last index because starting from first index cause shifting
        //in the array because of array.splice()
        //$http().success(function(){//todo ����ɾ��������
         $scope.selectedRows.reverse();
        console.log($scope.selectedRows);
        for (var i =0;i < $scope.selectedRows.length;i++) {
            var selectIndex = $scope.selectedRows[i];
            //delete row from data
            $scope.users.splice(selectIndex, 1);
            console.log(selectIndex);
            //delete rowSelection property
            delete $scope.tableSelection[selectIndex];
            console.log($scope.tableSelection)
        }
        console.log($scope.tableSelection);
        //});
    };
    $scope.getSelectedRows = function () {
        //start from last index because starting from first index cause shifting
        //in the array because of array.splice()
        $scope.selectedRows = [];
        for (var i = 0; i < $scope.users.length; i++) {
            if ($scope.tableSelection[i]) {
                $scope.selectedRows.push(i);
            }
        }
        console.log($scope.selectedRows);
    };
    $scope.getMappings = function () {
        document.getElementById('spinner').style.visibility = 'visible';
        $http({
            method: 'get',
            url: 'http://192.168.1.158:8089/servlet/MobileApproveServlet?method=getAllUserMappingInfo',
            params: {
                method: 'getAllUserMappingInfo'
            }
        }).success(function (response) {
            document.getElementById('spinner').style.visibility = 'hidden';
            console.log(response);
            $scope.users = response.data;
        });
    };
    //��ҳ��ء�������������������������������������������������������
    var pageSize = 2;
//        var totalPages = Math.ceil(getUrlParamObj()['pagecount'] / pageSize);
    var totalPages = Math.ceil(5);
    //    document.getElementById('spinner').style.visibility = 'visible';
    /*
     * ��ҳ�ؼ���https://github.com/lyonlai/bootstrap-paginator��
     * */
    var element = $('#paginator');
    var options = {
        bootstrapMajorVersion: 3,//����ָ��bootstrap�İ汾
        currentPage: 1,//Ĭ����ʾ��һҳ
        numberOfPages: 3,//����̶�Ϊ4
        totalPages: totalPages,
        onPageChanged: function (e, oldPage, newPage) {
            $scope.getMappings(newPage, pageSize);
        }
    };
    element.bootstrapPaginator(options);
    $scope.getMappings(1, pageSize);
    //��ҳ��ء�������������������������������������������������������������������������
    $scope.addYzj = function () {
        var phoneValue = document.getElementById('yzj_phone').value;
        if (phoneValue == null || phoneValue == '' || phoneValue == undefined) {
            toastr.error('�ֻ��Ų���Ϊ��');
        } else if (!(/^1[34578]\d{9}$/.test(phoneValue))) {
            toastr.error("�ֻ���������������");
        } else {
            document.getElementById('spinner').style.visibility = 'visible'
            $http({
                method: 'get',
                url: 'json/yzj_user',
                params: {
                    mobile: phoneValue
                }
            }).success(function (response) {
                    document.getElementById('spinner').style.visibility = 'hidden'
                    if (response.success) {
                        var yzjUserObj = response.data[0];
                        var user = {
                            yzjid: yzjUserObj.openId,	//��֮���˺�ID
                            yzjmobile: yzjUserObj.phone,	//��֮����Ա�ֻ���
                            yzjname: yzjUserObj.name,   // ��֮����Ա����
                            yzjdept: yzjUserObj.department,// ��֮����Ա����
                            yzjjob: yzjUserObj.jobTitle//��֮����Աְλ
                        };
                        $http({
                            method: 'get',
                            url: 'http://192.168.1.158:8089/servlet/MobileApproveServlet',
                            params: {
                                yzjid: yzjUserObj.openId,	//��֮���˺�ID
                                yzjmobile: yzjUserObj.phone,	//��֮����Ա�ֻ���
                                yzjname: yzjUserObj.name,   // ��֮����Ա����
                                yzjdept: yzjUserObj.department,// ��֮����Ա����
                                yzjjob: yzjUserObj.jobTitle, //��֮����Աְλ
                                method: 'createUserMapping'//������

                            }

                        }).success(function (response) {
                            console.log(response);
                            if (response.flag == 0) {
                                if (response.data.success == 0) {
                                    $scope.users.push(user);
                                } else {
                                    toastr.error(response.data.desc);
                                }
                            } else {
                                toastr.error(response.desc);
                            }
                        });
                    }
                    else {
                        toastr.error(response.error)
                    }
                }
            )
            ;
        }
    };
    $scope.bindNC = function (currentSelectedNcUser) {
        //todo
        document.getElementById('spinner').style.visibility = 'visible'
        $http(
            {
                method: 'get',
                url: 'http://192.168.1.158:8089/servlet/MobileApproveServlet',
                params: {
                    ncjob: currentSelectedNcUser.ncjob,
                    ncmobile: currentSelectedNcUser.ncmobile,
                    ncunit: currentSelectedNcUser.ncmobile,
                    ncuser_code: currentSelectedNcUser.ncuser_code,
                    ncuser_name: currentSelectedNcUser.ncuser_name,
                    ncuserid: currentSelectedNcUser.ncuserid
                }
            }
        ).success(function (response) {
                document.getElementById('spinner').style.visibility = 'hidden'
                $scope.disableBind();
                if (response.flag == 0) {
                    toastr.success("�󶨳ɹ�");
                } else {
                    toastr.error(response.desc);
                }

            });

    };
    $scope.disableBind = function () {
        $('#binding').attr("disabled", true);
        document.getElementById("binding").style.backgroundColor = "grey";
    };
    $scope.selectNcUser = function (ncUser) {
        $("#binding").removeAttr("disabled", false);
        document.getElementById("binding").style.backgroundColor = "#3cbaff";
        $scope.currentSelectedNcUser = ncUser;
    };
    $scope.getYzjData = function (index) {
        var user = $scope.users[index];
        $scope.currentUser = {
            yzjid: user.yzjid,
            yzjmobile: user.yzjmobile,
            yzjname: user.yzjname,
            yzjdept: user.yzjdept,
            yzjjob: user.yzjjob
        };
        document.getElementById('spinner').style.visibility = 'visible'
        $http({
            method: 'get',
            url: 'http://192.168.1.158:8089/servlet/MobileApproveServlet',
            params: {
                ncname: user.yzjname,
                ncmobile: user.yzjmobile,
                method: 'getNCUserInfo'
            }
        }).success(function (response) {
            document.getElementById('spinner').style.visibility = 'hidden'
            console.log(response);
            $scope.ncusers = [];
            if (response.flag == 0) {
                if (response.data.length > 0) {
                    $scope.ncusers = response.data;
                }
            } else {
                toastr.error(response.desc);
            }
        });
    };

})
;