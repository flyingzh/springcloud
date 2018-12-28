var vm = new Vue({
    el: '#profitLossTransfer',
    data() {
        return {
            //是否显示信息提示弹框
            isPosting: false,
            //是否有未过账凭证
            unPosting: false,
            //提示信息生成的凭证字号(fake data)
            voucherGroupNo:2,
            //完成弹窗
            complete: false,
            //会计科目树形
            isShow: false,
            voucherGroups:[],
            body:{
                voucherDate:"",
                voucherGroup:"",
                explanation:"结转本期损益"
            },
            subjectData: {},
            subjectVisable: false,
            resultStr:'',

        }
    },
    methods: {
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
            this.subjectData = val;
        },
        // 点击取消清空
        cancel(){           
            this.$refs.vDate.date = "";
            this.body = {
                voucherDate:"",
                voucherGroup:"",
                explanation:""
            }
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
                },
                error: function (e) {
                    console.log(e);
                }
            });
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
                    vm.isPosting = result.data;
                    vm.unPosting = result.data;
                },
                error: function (e) {
                    console.log(e);
                }
            });
        },
        //点击完成，生成凭证，保存数据
        finished(){
            var finalTuningRemitVO ={};
            this.voucherGroups.forEach(function (item) {
                if(item.name ==vm.body.voucherGroup){
                    finalTuningRemitVO.voucherDataEntity = item;
                }
            });
            finalTuningRemitVO.accountSubjectEntity = this.subjectData;
            finalTuningRemitVO.voucherDate = this.body.voucherDate;
            finalTuningRemitVO.explanation = this.body.explanation;
            finalTuningRemitVO.sobId = 1;
            var url = rcContextPath+"/finalOperate/lossAndGainBroughtForward";
            $.ajax({
                type: 'post',
                async: true,
                data: JSON.stringify(finalTuningRemitVO),
                url: url,
                contentType: 'application/json;charset=utf-8',
                success: function (result) {
                    vm.resultStr = result.data;
                },
                error: function (e) {
                    console.log(e);
                }
            });
            this.complete=true;
        }
       
    },
    created: function () {
        this.queryVoucherGroup();
        this.checkNoPosting();
    },
    mounted() {
       
    }
})