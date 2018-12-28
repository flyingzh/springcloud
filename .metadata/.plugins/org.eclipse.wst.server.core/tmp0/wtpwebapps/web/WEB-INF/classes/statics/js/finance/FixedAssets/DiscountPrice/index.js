new Vue({
    el: '#discount-price',
    data() {
        return {
            openTime: '',
            formData:{
                summary: '',
                voucherWordId: 0,
            },
            organisationList: []
        }
    },
    mounted() {
        this.openTime = window.parent.params && window.parent.params.openTime;
        this.init();
    },
    methods:{
        refresh() {
            this.init();
        },
        quit(){
            //关闭当前页签
            var name = '计提折旧';
            window.parent.closeCurrentTab({ 'name': name, 'openTime': this.openTime, 'url': this.openTime, exit: true })
        },
        //初始化页面
        init(){
            var that = this;
            var url = contextPath + "/generatingCredentialOption/getVoucherWord";
            $.ajax({
                type: 'post',
                url: url,
                data: '',
                contentType: 'application/json;charset=utf-8',
                dataType: 'json',
                success: function (res) {
                    if (res.code == '100100') {
                        console.log(res.data,"=====");
                        that.organisationList = res.data
                        that.formData.voucherWordId = res.data[0].id;
                        that.formData.summary = '固定资产计提折旧';
                    }
                }
            })
        },
        discountFun() {
            window.top.home.loading('show');
            var that = this;
            var url =  contextPath + "/fixedAssetsVoucher/depreciationGenerationCertificate";
            var _data = { 'summary': that.formData.summary, 'voucherWordId': that.formData.voucherWordId };
            $.ajax({
                type: 'post',
                url: url,
                data: _data,
                // contentType: 'application/json;charset=utf-8',
                // dataType: 'json',
                success: function (res) {
                    var text = '';
                    if (res.code == '100100') {
                        that.$Message.info({
                            content: res.msg,
                            duration: 3
                        });
                    }else if(res.code == '100010'){
                        that.depreciationVouchers(res.data,res.msg);
                    }else {
                        that.$Message.info({
                            content: res.msg,
                            duration: 3
                        });
                    }

                },
                complete: function () {
                    window.top.home.loading('hide');
                }
            })
        },
        depreciationVouchers(voucherId,msg){
            this.$Modal.confirm({
                title: '系统提示',
                content: '<p>'+msg+'</p>',
                onOk: () => {
                this.deleteMechanismVoucher(voucherId);
                },
                onCancel: () => {
                    this.$Message.info('取消删除');
                }
            });
        },
        deleteMechanismVoucher(voucherId){
            var _that = this;
            var url = contextPath +"/voucherController/deleteMechanismVoucher";
            var _data = { 'voucherId': voucherId, 'sobId': 0 };
            $.ajax({
                type: 'post',
                url: url,
                data: _data,
                // contentType: 'application/json;charset=utf-8',
                // dataType: 'json',
                success: function (res) {
                    if(res.code == '100100'){
                        _that.discountFun();
                    }else {
                        _that.$Message.info({
                            content: res.msg,
                            duration: 3
                        });
                    }
                }
            });
        },
        instance (type, title, content) {
            switch (type) {
                case 'success':
                    this.$Modal.success({
                        title: title,
                        content: content
                    });
                    break;
                case 'error':
                    this.$Modal.error({
                        title: title,
                        content: content
                    });
                    break;
            }
        },
    },
    computed:{
    }
})