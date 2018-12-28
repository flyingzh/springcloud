new Vue({
    el: '#cash-book',
    data() {
        return {
            openTime: '',
            formData:{
                settleOrReverse: '1',
                accountYearPeriod: '',
                nextAccountYearPeriod: '',
                isCurryOver: '',
                lastAccountYearPeriod: '',
                whetherToCancel: '',
            },
            filterVisible: false,
        }
    },
    created:function (){
        verifySystem(3);
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
                url:rcContextPath+'/cnSettleAccount/initPage',
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
                        window.top.home.loading('show',{text:'出纳系统结账中，请稍等'});
                        url = rcContextPath+'/cnSettleAccount/settleAccount';
                        // let isCurryOver = that.formData.isCurryOver ? 2:1;
                        //默认转结转
                        let isCurryOver = 2;
                        param = {'isCurryOver':isCurryOver};

                    }else if (settleOrReverse==2){//反结账
                        url = rcContextPath+'/cnSettleAccount/reverseAccount';
                        // let whetherToCancel = that.formData.whetherToCancel ? 1:0;
                        //默认取消已勾对
                        let whetherToCancel = 1;
                        param = {'whetherToCancel':whetherToCancel};
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



            // layer.confirm('确定要开始结算操作吗？', {
            //     title: "信息提示",
            //     btn: ['确定','取消'] //按钮
            //   }, function(){
            //     //   确定
            //     let settleOrReverse = that.formData.settleOrReverse;
            //     let url = '';
            //     let param = '';
            //     if (settleOrReverse==1){ //结账
            //         url = rcContextPath+'/cnSettleAccount/settleAccount';
            //         // let isCurryOver = that.formData.isCurryOver ? 2:1;
            //         //默认转结转
            //         let isCurryOver = 2;
            //         param = {'isCurryOver':isCurryOver};
            //     }else if (settleOrReverse==2){//反结账
            //         url = rcContextPath+'/cnSettleAccount/reverseAccount';
            //         // let whetherToCancel = that.formData.whetherToCancel ? 1:0;
            //         //默认取消已勾对
            //         let whetherToCancel = 1;
            //         param = {'whetherToCancel':whetherToCancel};
            //     }
            //     $.ajax({
            //         type:'POST',
            //         url:url,
            //         data:param,
            //         dataType:"json",
            //         success:function (res) {
            //
            //             layer.closeAll('dialog');
            //             layer.alert(res.msg);
            //             that.initPage();
            //         },
            //         error: function (code) {
            //             // console.log(code);
            //             setTimeout(function () {
            //                 that.ishttpOK = false;
            //             }, 1000)
            //         }
            //     })
            //   }, function(){
            //     //   取消
            //     console.log('取消')
            //   });
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