var vm = new Vue({
    el: '#exchangeRateAdjust',
    data() {
        return {
            openTime: '',
            //是否显示信息提示弹框
            isPosting: false,
            //是否有未过账凭证
            unPosting: false,
            //是否生成凭证
            isCreateVoucher: false,
            //切换
            isNext: false,
            //会计科目树形
            isShow: false,
            //外币信息
            currencies: [],
            currencyId:'',
            //变更的外币信息
            changedCurrencies:[],
            voucherGroups: [],
            body: {
                voucherDate: "",
                voucherGroup: "",
                explanation: "结转汇兑损益"
            },
            //提示信息生成的凭证字号(fake data)
            voucherGroupNo:'',
            //完成弹窗
            complete: false,
            subjectData:[],
            subjectVisable: false,
            resultStr:'',

        }
    },
    methods: {
        //关闭提示窗口
        close() {
            this.isPosting = false;
        },
        //点击下一步
        nextStep() {
            this.isNext = true;
        },
        //点击上一步
        previousStep() {
            this.isNext = false;

        },
        //查看会计科目
        showSubjectTree() {
            this.subjectVisable = true;
        },
        //关闭选择科目弹窗
        subjectClose() {
            this.subjectVisable = false;
        },
        //点击保存，获取所选科目id
        subjectCheck(res) {
            console.log(res);
            this.body.accountCode = res.code;
            console.log(this.body.accountCode);
        },
        //保存会计科目树
        subjectSave(val){
            console.log(val,"选中科目对象");
            if(val.foreignCurrencyId===-1){
                this.$Modal.warning({
                    title: '信息提示',
                    content: '汇兑损益科目不能核算外币！'
                });
            }else{
                this.subjectData = val;
            }
        },
        //点击完成，生成凭证，保存数据
        finished(){
            if(this.subjectData.length===0){
                vm.$Modal.warning({
                    title: '信息提示',
                    content:'请选择汇兑损益科目！'
                });
                return;
            }
            var finalTuningRemitVO ={};
            this.voucherGroups.forEach(function (item) {
                if(item.name ==vm.body.voucherGroup){
                    finalTuningRemitVO.voucherDataEntity = item;
                }
            });
            finalTuningRemitVO.accountSubjectEntity = this.subjectData;
            finalTuningRemitVO.rateAdjustmentEntityList = this.currencies;
            finalTuningRemitVO.voucherDate = this.operateDate(this.body.voucherDate);
            finalTuningRemitVO.explanation = this.body.explanation;
            finalTuningRemitVO.isCreateVoucher = this.isCreateVoucher;
            var url = rcContextPath+"/finalOperate/createFinalTuningRemitVoucher";
            $.ajax({
                type: 'post',
                async: true,
                data: JSON.stringify(finalTuningRemitVO),
                url: url,
                contentType: 'application/json;charset=utf-8',
                success: function (result) {
                   // vm.resultStr = result.data;
                    var code = result.code;
                    if(code==='-1001'){
                        vm.$Modal.warning({
                            title: '信息提示',
                            content:result.msg,
                            onOk(){
                                vm.closeWindow();  //退出
                            }
                        });
                    }
                    if(code==='100100'){  //成功
                        vm.$Modal.success({
                            title: '信息提示',
                            content: result.msg,
                            onOk(){
                                vm.closeWindow();  //退出
                            }
                        });
                    }
                },
                error: function (e) {
                    console.log(e);
                }
            });
            //this.complete=true;
        },
        operateDate(date){
            return new Date(date).format("yyyy-MM-dd");
        },
        getDefaultDay (year, month) { //获取默认日期
            var dt = new Date(year, month, 1);
            var cdt = new Date(dt.getTime() - 1000 * 60 * 60 * 24);
            return cdt.getFullYear() + "-" + (Number(cdt.getMonth()) + 1) + "-"+cdt.getDate();
        },
        //查询是否存在未过账凭证
        checkNoPosting() {
            var url = rcContextPath+"/finalOperate/checkNoPosting";
            $.ajax({
                type: 'post',
                async: true,
                data: {
                    sobId: 1,
                },
                url: url,
                success: function (result) {
                    console.log(result,'查询是否存在未过账凭证');
                    vm.unPosting = result.data;
                    vm.isPosting = result.date;

                },
                error: function (e) {
                    console.log(e);
                }
            });
        },
        //获取外币信息表
        queryCurrencyRate() {
            var url = rcContextPath+"/finalOperate/queryCurrencyRate";
            $.ajax({
                type: 'post',
                async: true,
                url: url,
                success: function (result) {
                    console.log(result,'币别信息~~~~');
                    if(!result.data.postedStatus){
                        vm.currencies = result.data.currencyList;
                        vm.body.voucherDate= vm.getDefaultDay(result.data.accountYear,result.data.accountPeriod);
                    }else{
                        vm.$Modal.warning({
                            title: '信息提示',
                            content: '本期包含外币未过账凭证，必须都过账后才能期末调汇。',
                            onOk(){
                               vm.closeWindow();  //退出
                            }
                        });
                    }
                },
                error: function (e) {
                    console.log(e);
                }
            });
        },
        //获取凭证字
        queryVoucherGroup(){
            var url = rcContextPath+"/finalOperate/queryVoucherGroup";
            $.ajax({
                type: 'post',
                async: true,
                data: {
                    sobId: 1,
                },
                url: url,
                success: function (result) {
                    vm.voucherGroups = result.data;
                    if(vm.voucherGroups.length>0){  //默认选中第一个
                        vm.body.voucherGroup =vm.voucherGroups[0].name;
                    }
                },
                error: function (e) {
                    console.log(e);
                }
            });
        },
        closeWindow(){
            window.parent.closeCurrentTab({ name: '期末调汇', openTime: this.openTime, exit: true });
       }
    },
    mounted() {
        this.openTime = window.parent.params && window.parent.params.openTime;
    },
    created: function () {
        //this.checkNoPosting();
        this.queryCurrencyRate();
        this.queryVoucherGroup();
    },
    watch: {
        currencies: {
            handler(val, oldVal) {
                var _total = [];
                vm.changedCurrencies = [];
                if (val.length > 0) {
                    _total = val.filter(function (item) {
                        if (item.initExchangeRate != item.endExchangeRate) {
                            return item;
                            vm.changedCurrencies.push(item);
                        }

                    });
                }
                if (_total.length > 0) {
                    vm.isCreateVoucher = true;
                }else{
                    vm.isCreateVoucher = false;
                }
            },
            deep: true
        }
    },
})