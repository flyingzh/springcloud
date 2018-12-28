var vm = new Vue({
    el: '#profitLossTransfer',
    data() {
        return {           
            //是否显示信息提示弹框
            isPosting: false,
            //是否有未过账
            unPosting: false,
            //完成弹窗
            isComplete: false,

            //复选框绑定
            checked: false,
          
            //结账、反结账
            checkOutType:[
                {
                    label:'结账',
                    value:0,
                    url:rcContextPath+"/finalOperate/finalSettlement"
                },
                {
                    label:'反结账',
                    value:1,
                    url:rcContextPath+"/finalOperate/finalAntiSettlement"
                }
            ],
            //默认勾选结账
            isCheckOut: 0,
            //禁用按钮
            isDisabled:false,
            //提示结果信息
            resultStr:'',
            
        }
    },
    methods: {
        // 期末结账
        start(){
            var url = this.checkOutType[this.isCheckOut].url;
            let that = this;
            $.ajax({
                type: 'post',
                async: true,
                data: {
                    checkVoucherGroupNum: that.checked
                },
                url: url,
                success: function (result) {
                    var code =result.code;
                    var msg = result.msg;
                    if(code=='100100'){
                        that.$Modal.info({
                            title: '信息提示',
                            content: msg
                        });
                    }
                },
                error: function (e) {
                    console.log(e);
                }
            });
        },
        cancel(bool){
            this.isPosting = bool;
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
       
    },
    created: function () {
      //  this.checkNoPosting();
    },
    mounted() {
       
    }
})