var vm = new Vue({
    el: '#gold_price_container',
    data() {
        let This = this;
        return {
            isSave: true,
            openTime: '',
            userName: '',
            nowTime:new Date().Format("yyyy-MM-dd"),
            body: {
               /* pT950: '',
                pT990: '',
                aU999: '',
                aU750: '',
                s925: '',*/
                buyPrice:{},
                salePrice:{},
                updateName: '',
                updateTime: ''
            },
        }
    },
    methods: {
        exit() {
            window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
        },
        info() {
            $.ajax({
                type: "POST",
                url: contextPath+"/tbasetodygoldprice/info",
                success: function (result) {
                    if (result.code === "100100") {
                        if (result.data == undefined) {
                            vm.body.updateTime = new Date().Format("yyyy-MM-dd hh:mm:ss");
                            vm.body.updateName = vm.userName;
                        } else {
                            vm.body = result.data;
                            vm.formatNull();
                        }
                        vm.isSave =true;
                    } else {
                        vm.isSave =true;
                        vm.$Modal.warning({
                            title:'提示信息',
                            content:result.msg
                        })
                        // layer.alert(result.msg, {icon: 0});
                    }
                },
                error: function (err) {
                    vm.isSave =true;
                    // layer.alert("服务器异常，请重试！", {icon: 0});
                    vm.$Modal.warning({
                        title:'提示信息',
                        content:"服务器异常，请重试！"
                    })
                },
            });
        },
        formatNull(){

            for ( var key in this.body.buyPrice ){
                if(!this.body.buyPrice[key] || this.body.buyPrice[key] == 'null'){
                    this.body.buyPrice[key] = '';
                }
            }
            for ( var key in this.body.salePrice ){
                if(!this.body.salePrice[key] || this.body.salePrice[key] == 'null'){
                    this.body.salePrice[key] = '';
                }
            }
         },
        update(params) {
            $.ajax({
                type: "POST",
                url: contextPath+"/tbasetodygoldprice/update",
                contentType: 'application/json',
                data: JSON.stringify(params),
                dataType: "json",
                success: function (result) {
                    if (result.code === "100100") {
                        // layer.alert('操作成功', {icon: 1});
                        vm.$Modal.success({
                            title:'提示信息',
                            content:'操作成功'
                        })
                        vm.info();
                    } else {
                        // layer.alert(result.msg, {icon: 0});
                        vm.$Modal.warning({
                            title:'提示信息',
                            content:result.msg
                        })
                        vm.isSave =true;
                    }
                },
                error: function (err) {
                    // layer.alert("服务器异常，请重试！", {icon: 0});
                    vm.$Modal.warning({
                        title:'提示信息',
                        content:"服务器异常，请重试！"
                    })
                    vm.isSave =true;
                },
            });
        },
        save() {
            let This = this;
            if(!this.validateNum()){
                return false;
            }
            this.isSave = false;
            var params = this.body;
            params.createTime = '';
            this.update(params);
        },
        clearNoNum(item,type){
            item[type] = item[type].replace(/[^\d.]/g,"");  //清除“数字”和“.”以外的字符
            item[type] = item[type].replace(/^\./g,"");  //验证第一个字符是数字而不是.
            item[type] = item[type].replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的.
            item[type] = item[type].replace(".","$#$").replace(/\./g,"").replace("$#$",".");
            this.$forceUpdate();

        },

        cancel() {
            this.body = {
                PT950: '',
                PT990: '',
                PT999: '',
                AU750: '',
                S925: '',
                updateName: '',
                updateTime: ''
            }
           /* $("#gold_price_form").validate().resetForm();*/
        },
        validateNum(){
            let flag = true;
            for ( var key in this.body.buyPrice ){
                if(!this.body.buyPrice[key] || isNaN(this.body.buyPrice[key])){
                    this.$Modal.warning({
                        title:'提示信息',
                        content:'成本价中 【'+key+"】 必须填写具体数字，请重试!"
                    })
                    // layer.alert('成本价中 【'+key+"】 必须填写具体数字，请重试!", {icon: 0});
                    // flag= false;
                    return false;
                    // break;
                }
            }
            for ( var key in this.body.salePrice ){
                if(!this.body.salePrice[key] || isNaN(this.body.salePrice[key])){
                    this.$Modal.warning({
                        title:'提示信息',
                        content:'销售价中 【'+key+"】 必须填写具体数字，请重试!"
                    })
                    // layer.alert('销售价中 【'+key+"】 必须填写具体数字，请重试!", {icon: 0});
                    // flag= false;
                    return false;
                    // break;
                }
            }

            return flag;
        },
        initFormValidate() {
            var validateOptions = {
                rules: {
                    PT950: {
                        required: true,
                        number: true,
                        min: 0
                    },
                    PT990: {
                        required: true,
                        number: true,
                        min: 0
                    },
                    AU999: {
                        required: true,
                        number: true,
                        min: 0
                    },
                    AU750: {
                        required: true,
                        number: true,
                        min: 0
                    },
                    S925: {
                        required: true,
                        number: true,
                        min: 0
                    }
                },
                messages: {
                    PT950: {
                        required: "请填写编码!",
                        number: "必须是正数",
                        min: "必须是正数"
                    },
                    PT990: {
                        required: "请填写编码!",
                        number: "必须是正数",
                        min: "必须是正数"
                    },
                    AU999: {
                        required: "请填写编码!",
                        number: "必须是正数",
                        min: "必须是正数"
                    },
                    AU750: {
                        required: "请填写编码!",
                        number: "必须是正数",
                        min: "必须是正数"
                    },
                    S925: {
                        required: "请填写编码!",
                        number: "必须是正数",
                        min: "必须是正数"
                    }
                }
            };
            $("#gold_price_form").validate(validateOptions);
        }
    },

    mounted() {
        this.info();
        this.userName = layui.data('user').username;
        // this.initFormValidate();
        this.openTime = window.parent.params.openTime;
    }
})

