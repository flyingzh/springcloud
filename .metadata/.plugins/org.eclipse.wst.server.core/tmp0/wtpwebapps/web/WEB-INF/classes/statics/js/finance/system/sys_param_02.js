var vm = new Vue({
    el: '#vmDiv',
    data: {
        yearSpan: 30,
        selectSpan: 10,
        selectOpt: [],
        accountingPeriod: [],
        years: {},
        accountingYear:{
            id: '',
            value: '',
            readOnly: '',
            sobId: ''
        },
        accountingYear_init:'',
        accountingNaturalYear:{
            id: '',
            value: '',
            readOnly: '',
            sobId: ''
        },
        accountingNaturalYear_init:'',
        accountingPeriodNumber:{
            id: '',
            value: '',
            readOnly: '',
            sobId: ''
        },
        accountingPeriodNumber_init:'',
        accountingPeriodStartDate:{
            id: '',
            value: '',
            readOnly: '',
            sobId: ''
        },
        accountingPeriodStartDate_init:'',
        canUpdateAccountPeriod: false,
    },
    watch: {
        'accountingNaturalYear.value': function (val) {
            if (val=='1') {
                this.accountingPeriodNumber.value = 12;
            }
        },
        'accountingYear.value': function(val){
            this.genSelect();
        },
        'accountingPeriodNumber.value': function(){
            this.genAccountingPeriod();
        }
    },
    methods: {
        genSelect: function(){
            var _vm = this;
            var yearStart = parseInt(_vm.accountingYear.value);
            var selectSpan = _vm.selectSpan;
            var ret = [];
            for (var i = yearStart-selectSpan; i <= yearStart+selectSpan; i++) {
                ret.push(i);
            }
            _vm.selectOpt = ret;
            _vm.genPeriods(yearStart);
        },
        genPeriods: function(val){
            var ret = {};
            var _vm = this;
            var yearStart = val;
            var ret = {};
            for (var i = yearStart; i <= yearStart+_vm.yearSpan; i++) {
                ret[i] = {};
            }
            _vm.years = ret;
            _vm.genAccountingPeriod(val + '-01-01');
        },
        genAccountingPeriod: function(date) {
            console.log(";;;;;");
            console.log(date);
            var _vm = this;
            var date = (htUtilHasValue(date)) ? date : _vm.accountingPeriod[0];
            // if (!htUtilValidDate(date)) {
            //     alert('日期格式错误（正确的例子：2018-06-18）<br>或者没有这一天 :)');
            //     return false;
            // }
            var d = new Date(date);
            var span = parseInt(this.accountingPeriodNumber.value);
            var _date = d.getDate();
            _date = _date < 10 ? '0' + _date : _date;
            var result = [];

            for (var i = 0; i < span; i++) {
                var _dt = _date;
                var m = d.getMonth()+1;
                m = m < 10 ? '0' + m : m;
                var fullDate = d.getFullYear() + '-' + m + '-' + _dt;
                var loopCheck = function (dt) {

                    // 递归检查日期，如果没有31日，向前调整为30日（2月份调整到29或28）
                    if (!htUtilValidDate(dt)) {
                        _dt--;
                        loopCheck(d.getFullYear() + '-' + m + '-' + _dt);
                    } else {
                        var m1= d.getMonth()+1;
                        d.setMonth(d.getMonth() + 1);
                        var m2= d.getMonth()+1;

                        // 判断大于28日时，如导致跨入下一月，修正回来
                        if (m2-m1==2) {
                            d.setMonth(d.getMonth() - 1);
                        }
                        result.push(dt);
                        return false;
                    }
                }
                loopCheck(fullDate);
            }
            _vm.accountingPeriod = result;
        },
        save: function(){
            if ($('form').valid()) {
                console.log(this.$data);
            }

            var firstAccountPeriod = $("#0").val();
            var regExp = new RegExp("^[1-2]\\d{3}-(0?[1-9]||1[0-2])-(0?[1-9]||[1-2][1-9]||3[0-1])$");

            try {
                if (!regExp.test(firstAccountPeriod)) {

                    var _la = layer.alert('开始日期格式不正确，请重新输入!', { icon: 0 }, function () {
                        layer.close(_la);

                        setTimeout(
                            function () {
                                console.log($("#0"));
                                $("#0").focus();
                            }, 0);
                    });

                    return;
                }

                console.log(firstAccountPeriod);

                var _that = this;
                _that.genAccountingPeriod(firstAccountPeriod);
            } catch (e) {
                var _error_la = layer.alert('开始日期输入错误，请重新输入!', { icon: 0 }, function () {
                    layer.close(_error_la);

                    setTimeout(
                        function () {
                            console.log($("#0"));
                            $("#0").focus();
                        }, 0);
                });

                return;
            }

            var array = [];
            if (vm.accountingYear.value != vm.accountingYear_init) {
                array.push(vm.accountingYear);
                vm.accountingYear_init = vm.accountingYear.value;
            }
            if (vm.accountingNaturalYear.value != vm.accountingNaturalYear_init) {
                array.push(vm.accountingNaturalYear);
                vm.accountingNaturalYear_init = vm.accountingNaturalYear.value;
            }
            if (vm.accountingPeriodNumber.value != vm.accountingPeriodNumber_init) {
                array.push(vm.accountingPeriodNumber);
                vm.accountingPeriodNumber_init = vm.accountingPeriodNumber.value;
            }
            if (vm.accountingPeriodStartDate.value != vm.accountingPeriodStartDate_init) {
                array.push(vm.accountingPeriodStartDate);
                vm.accountingPeriodStartDate_init = vm.accountingPeriodStartDate.value;
            }

            if (htUtilHasValue(array, 'array')) {
                vm.accountingYear.readOnly = 1;
                vm.accountingNaturalYear.readOnly = 1;
                vm.accountingPeriodNumber.readOnly = 1;
                vm.accountingPeriodStartDate.readOnly = 1;
                $.ajax({
                    type: 'POST',
                    contentType: 'application/json;charset=utf-8',
                    url: contextPath + '/systemProfileController/updateBatch',
                    data: JSON.stringify(array),
                    success: function (result) {
                        if (result.data > 0) {
                            alert('更改成功！');
                        } else {
                            alert('更改失败！');
                        }
                    }

                });
            } else {
                alert('暂无数据提交！');
            }
        },
        updateStartDate: function(e) {
            var $target = $(e.target);
            var firstAccountPeriod = $target.val();
            var regExp = new RegExp("^[1-2]\\d{3}-(0?[1-9]||1[0-2])-(0?[1-9]||[1-2][1-9]||3[0-1])$");

            try {
                if (!regExp.test(firstAccountPeriod)) {

                    var _la = layer.alert('开始日期格式不正确，请重新输入!', { icon: 0 }, function () {
                        layer.close(_la);

                        setTimeout(
                            function () {
                                console.log($target);
                                $target.focus();
                            }, 0);
                    });

                    return;
                }

                console.log(firstAccountPeriod);

                var _that = this;
                _that.genAccountingPeriod(firstAccountPeriod);
            } catch (e) {
                var _error_la = layer.alert('开始日期输入错误，请重新输入!', { icon: 0 }, function () {
                    layer.close(_error_la);

                    setTimeout(
                        function () {
                            console.log($target);
                            $target.focus();
                        }, 0);
                });

                return;
            }
        }
    },
    created: function(){
        //查询系统信息参数
        var sysUrl = contextPath + '/systemProfileController/queryByType?type=会计期间参数&sobId=1';
        $.ajax({
            type: 'POST',
            url: sysUrl,
            success: function (result) {
                var dataObj = result.data;
                console.log("================");
                console.log(dataObj);
                console.log("======================");
                for (var i = 0; i < dataObj.length; i++) {
                    if (dataObj[i].name == 'accountingYear') {
                        vm.accountingYear = dataObj[i];
                        vm.accountingYear_init = dataObj[i].value;
                        if(vm.accountingYear.value==''){
                            vm.accountingYear.value = (new Date()).getFullYear();
                        }

                    }
                    if (dataObj[i].name == 'accountingNaturalYear') {
                        vm.accountingNaturalYear = dataObj[i];
                        vm.accountingNaturalYear_init = dataObj[i].value;
                        if(vm.accountingNaturalYear.value==''){
                            vm.accountingNaturalYear.value = '1';
                        }
                    }
                    if (dataObj[i].name == 'accountingPeriodNumber') {
                        vm.accountingPeriodNumber = dataObj[i];
                        vm.accountingPeriodNumber_init = dataObj[i].value;
                        if(vm.accountingPeriodNumber.value==''){
                            vm.accountingPeriodNumber.value = '12';
                        }

                    }
                    if (dataObj[i].name == 'accountingPeriodStartDate') {
                        vm.accountingPeriodStartDate = dataObj[i];
                        vm.accountingPeriodStartDate_init = dataObj[i].value;
                        if(vm.accountingPeriodStartDate.value==''){
                            vm.accountingPeriodStartDate.value = (new Date()).getFullYear() + '-01-01';
                        }
                    }
                }
            }
        });
        this.genAccountingPeriod(this.accountingPeriodStartDate.value);

        // 3.查询会计期间是否可以修改
        var canUpdateAccountPeriodUrl = contextPath + '/systemProfileController/canUpdateAccountPeriod';

        $.ajax({
            type: 'POST',
            url: canUpdateAccountPeriodUrl,
            data: {"serviceType": "all"},   // 获取总账、应收应付、出纳、固定资产、工资结束初始化状态，如果有一个结束初始化或者已录入数据，则不能修改会计期间
            success: function (result) {
                var canUpdateData = result.data;
                vm.canUpdateAccountPeriod = canUpdateData;
            }
        });
    }
});