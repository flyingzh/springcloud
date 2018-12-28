new Vue({
    el: '#receivable-settle',
    data() {
        return {
            openTime: '',
            formData:{
                settleOrReverse: '1',
                accountYearPeriod: '',
                nextAccountYearPeriod: '',
                lastAccountYearPeriod: ''
            },
            filterVisible: false,
        }
    },
    created:function (){
       this.initPage();
    },
    mounted(){
        this.openTime = window.parent.params && window.parent.params.openTime;
    },
    methods:{
        initPage(){
            let that = this;
            $.ajax({
                type:'POST',
                url:rcContextPath+'/paymentReceiptAccount/initPageInfo',
                date:'',
                dataType: 'json',
                success:function (res) {
                    let data = res.data;
                    if(data!=null){
                        that.formData.accountYearPeriod = res.data.accountYearPeriod;
                        that.formData.nextAccountYearPeriod = data.nextAccountYearPeriod;
                        that.formData.lastAccountYearPeriod = data.lastAccountYearPeriod;
                    }
                }
            });
        },
        open() {
            let that = this;
            this.$Modal.confirm({
                title: '信息提示',
                content: '<p>确定要开始结算操作吗？</p >',
                onOk: () => {
                    //   确定
                    let settleOrReverse = that.formData.settleOrReverse;
                    let url = '';
                    let param = '';
                    if (settleOrReverse==1){ //结账
                        window.top.home.loading('show',{text:'应收应付系统结账中，请稍等'});
                        url = rcContextPath+'/paymentReceiptAccount/settleAccount';
                        //未过账不结算 -- 待定
                        let voucherStatus = 2;
                        param = {'voucherStatus':voucherStatus};
                    }else if (settleOrReverse==2){//反结账
                        url = rcContextPath+'/paymentReceiptAccount/counterSettle';
                        param = {};
                    }
                    $.ajax({
                        type:'POST',
                        url:url,
                        data:param,
                        dataType:"json",
                        success:function (res) {
                            window.top.home.loading('hide')
                            layer.closeAll('dialog');
                            layer.alert(res.msg);
                            that.initPage();
                        },
                        error: function (code) {
                            window.top.home.loading('hide')
                            // console.log(code);
                            setTimeout(function () {
                                that.ishttpOK = false;
                            }, 1000)
                        }
                    })
                },
                onCancel: () => {
                    // this.$s.$Message.info('Cl('Clicked cancel');
                }
            });
        },
        refresh() {
            this.initPage();
        },
        save() {
            this.filterVisible = false;
            this.refresh();
        },
        cancel() {
            this.filterVisible = false;
        },
        outHtml(){
            window.parent.closeCurrentTab({name: name, openTime: this.openTime, exit: true})
        }
    },
})