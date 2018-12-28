var parvm = new Vue({
    el: '#paraLevel',
    data() {
        let This = this;
        return {
            isEdit: false,
            isView: false,
            reload: false,
            disabledFlag : false,
            codeFlag: false,
            excelShow: false,
            bodyShow: true,
            nameFlag:true,
            showUpload: false,
            buttonFlag: true,
            isSearchHide: true, //搜索栏
            query:"",
            openTime:"",
            dataValue:[],
            itemList:[],
            selected:[],
            styles:[],
            optionStyle: {},
            
            body: {
                styleCode: "",
                styleName: "",
                startQualifiedRatio: "",
                endQualifiedRatio: "",
                startLaborRateRatio: "",
                endLaborRateRatio: "",
                startKossFateRatio: "",
                endKossFateRatio: "",
                startDeliveryCycleRatio: "",
                endDeliveryCycleRatio: "",
                startUpdateTime: "",
                endUpdateTime: "",
                updateName: ""
            },
            paramWeight:{
                id: '',
                styleCode: '',
                styleName:'',
                qualifiedRatio: '',
                laborRateRatio: '',
                kossFateRatio: '',
                deliveryCycleRatio: '',
                otherRatio: '',
                remark:'',
                createId: '',
                createName: '',
                updateId: '',
                updateName: ''
            },

            data_config:{
                url: contextPath+'/tbaseparamweight/list?ktcStatus=0',
                colNames : [ '商品代码','商品名称',  '质量合格率占比', '工费率占比','损耗率占比', '交货周期占比','其它占比','备注' ],
                colModel : [
                    {name : 'styleCode',width : 250, align: "left",
                        formatter:function (value,rows) {

                            $(document).off('click', ".detail" + value).on('click',".detail"+ value,function(){
                                parvm.paramWeight.styleCode = value
                                parvm.detailClick()
                            });
                            let myCode =  `<a class="detail${value}">${value}</a>`;
                            return  myCode;
                        }},
                    {name : 'styleName',index : 'invdate',width : 250, align : "left",formatter:function (value) {
                        return value ;
                    }},
                    {name : 'qualifiedRatio',index : '',width : 140,align : "right"},
                    {name : 'laborRateRatio',index : '',width : 140,align : "right"},
                    {name : 'kossFateRatio',index : '',width : 140,sortable : false,align : "right"},
                    {name : 'deliveryCycleRatio',index : '',width : 140,align : "right"},
                    {name : 'otherRatio',index : '',width : 140,sortable : false, align : "right"},
                    {name : 'remark',index : '',width : 200,sortable : false, align : "left"}
                ]
            },
        }
    },
    methods: {
        searchItemCode(queryStr) {
            this.query = queryStr;
            this.getOption();
        },
        getOption() {
            let dataParam = {
                mainType:'',
                field:''
            };
            dataParam.field = this.query;
            let that = this;
            //   获取对应的option内容
            $.ajax({
                url: contextPath+'/tbasecommodity/findByCommodity',
                type: 'post',
                data:dataParam,
                dataType: "json",
                success(data) {
                    that.itemList=data.data;
                    that.query='';
                },
                error() {
                    alert("服务器出错")
                }
            })
        },
        // 为动
        add_click(){
            console.log(this.isEdit)
            parvm.paramWeightClear()
            parvm.codeFlag = false
            parvm.disabledFlag = false
            parvm.buttonFlag = true
            this.isEdit = true;
            this.searchItemCode("");
        },
        del_click(){
            let This = this;
            let ids = This.selected
            console.log(ids)
            if (!ht.util.hasValue(ids, "array")) {
                // layer.alert("请先选择一条记录!");
                this.$Modal.info({
                    content:'请至少选择一笔数据！'
                })
                return false;
            }
            this.$Modal.confirm({
                content:'当前数据有可能被引用，会影响数据准确性，确认是否删除？',
                onOk:() => {
                        $.ajax({
                            type: "POST",
                            url: contextPath+"/tbaseparamweight/delete",
                            contentType: 'application/json',
                            data: JSON.stringify(ids),
                            dataType: "json",
                            success: function (data) {
                                if(data.code == "100100"){
                                    /*layer.closeAll('dialog');  //加入这个信息点击确定 会关闭这个消息框
                                    layer.alert(data.data);*/
                                    setTimeout(function(){
                                        This.$Modal.success({
                                            content:data.data
                                        })
                                    },300)
                                    This.selected=[]
                                    This.reload = !This.reload;
                                }else{
                                    // layer.alert(data.msg)
                                    setTimeout(function(){
                                        This.$Modal.warning({
                                            content:data.msg
                                        })
                                    },300)
                                }

                            },
                            error: function (err) {
                                // console.log("error");
                                This.$Modal.warning({
                                    content:'服务器出错，请稍后再试！'
                                })
                            },

                        })
                }
            })
           /* layer.confirm('当前数据有可能被引用，会影响数据准确性，确认是否删除？', {
                    btn: ['确定', '取消']
                },function (index, layero) {
                    $.ajax({
                        type: "POST",
                        url: contextPath+"/tbaseparamweight/delete",
                        contentType: 'application/json',
                        data: JSON.stringify(ids),
                        dataType: "json",
                        success: function (data) {
                            if(data.code == "100100"){
                                layer.closeAll('dialog');  //加入这个信息点击确定 会关闭这个消息框
                                layer.alert(data.data);
                                This.selected=[]
                                This.reload = !This.reload;
                            }else{
                                layer.alert(data.msg)
                            }

                        },
                        error: function (err) {
                            console.log("error");
                        },

                    })
                }
            )
            */
        },
        changeDate(value) {
            this.body.startUpdateTime = value[0]=="" ? "" : (value[0].replace(/\//g, '-') + ' 00:00:00');
            this.body.endUpdateTime = value[1]=="" ? "" : (value[1].replace(/\//g, '-') + ' 23:59:59');
        },
        sure(){
            this.reload = !this.reload;
        },
        clear(){
            this.dataValue = []
            this.body = {
                styleCode: "",
                styleName: "",
                startQualifiedRatio: "",
                endQualifiedRatio: "",
                startLaborRateRatio: "",
                endLaborRateRatio: "",
                startKossFateRatio: "",
                endKossFateRatio: "",
                startDeliveryCycleRatio: "",
                endDeliveryCycleRatio: "",
                startUpdateTime: "",
                endUpdateTime: "",
                updateName: ""
            };
            // this.$refs.startUpdateTime.date="";
            // this.$refs.endUpdateTime.date="";
            this.reload = !this.reload

        },
        parvnInit(){
            this.body = {
                styleCode: "",
                styleName: "",
                startQualifiedRatio: "",
                endQualifiedRatio: "",
                startLaborRateRatio: "",
                endLaborRateRatio: "",
                startKossFateRatio: "",
                endKossFateRatio: "",
                startDeliveryCycleRatio: "",
                endDeliveryCycleRatio: "",
                startUpdateTime: "",
                endUpdateTime: "",
                updateName: ""
            };
        },
        paramWeightClear(){
            this.paramWeight = {id: '',
                styleCode: '',
                styleName:'',
                qualifiedRatio: '',
                laborRateRatio: '',
                kossFateRatio: '',
                deliveryCycleRatio: '',
                otherRatio: '',
                remark:'',
                createId: '',
                createName: '',
                updateId: '',
                updateName: ''}

        },
        modify(){
            let This = this;
            let ids = This.selected
            parvm.buttonFlag = true
            if (!ht.util.hasValue(ids, "array")) {
                // layer.alert("请先选择一条记录!");
                this.$Modal.info({
                    content:'请至少选择一笔数据！'
                })
                return false;
            }else{
                this.paramWeight.id = this.selected[0];
                parvm.queryParamWeight()
                parvm.disabledFlag = false
                this.isEdit = true;
            }
            //请求详情信息
        },
        hideSearch() {
            this.isSearchHide = !this.isSearchHide;
            $(".chevron").css("top","")
        },
        myImport(){
            console.log("进导入了。。。")
            parvm.bodyShow = false;
            parvm.excelShow = true;

/*
          layui.use('upload', function(){
                var upload = layui.upload;

                //执行上传
                var uploadInst = upload.render({
                    elem: '#upload' //绑定元素
                    ,url: contextPath+'/tbaseparamweight/import' //上传接口
                    ,method: 'POST'
                    ,accept: 'file'
                    ,size: 10720
                    ,before: function(obj){
                        layer.load();
                    }
                    ,done: function(res){//上传完毕回调
                        layer.alert(res.msg)
                        layer.closeAll('loading');
                        var result = '';

                        for(var i=0; i<res.length; i++){
                            result = result + res[i].nsrsbh+"="+res[i].container+"\n";
                        }
                        console.log('上传结果result'+result);
                        $("#result").html(result);
                    }
                    ,error: function(){//请求异常回调
                        layer.closeAll('loading');
                        layer.msg('网络异常，请稍后重试！');
                    }
                });
            });
*/
        },
        handleSuccess(res, file) {
            if (res.code == "100100") {
                this.$Modal.success({
                    content: "导入成功!"
                });
                this.showUpload = false;

            } else {
                this.$Modal.error({
                    content: "网络异常，请稍后重试！"
                });
            }
        },
        handleFormatError(file) {
            this.$Notice.warning({
                title: '提示',
                desc: '文件导入失败，请联系技术人员'
            });
        },
        handleMaxSize(file) {
            this.$Notice.warning({
                title: '提示',
                desc: '文件: ' + file.name + ' 的大小超过10M,请上传小于10M的文件'
            });
        },
        myExport(){
            console.log("进到出了。。。")
        },
        signOut(){
            parvm.bodyShow = true;
            parvm.excelShow = false;
            this.reload = !this.reload
        },
        exit() {
            console.log("仅推出了。。。")
            window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
        },
        copy(){
            console.log("进复制了。。。")
            let This = this;
            parvm.buttonFlag = true
            if (This.selected.length != 1) {
                // layer.alert("请选择一条记录!");
                this.$Modal.info({
                    content:'请选择一条记录！'
                })
                return false;
            }
            $.ajax({
                type: 'POST',
                url: contextPath+'/tbaseparamweight/info',
                data: {id: This.selected[0]},
                success: function (result) {
                    console.log(result)
                    parvm.paramWeight.qualifiedRatio = result.data.qualifiedRatio
                    parvm.paramWeight.laborRateRatio = result.data.laborRateRatio
                    parvm.paramWeight.kossFateRatio = result.data.kossFateRatio
                    parvm.paramWeight.deliveryCycleRatio = result.data.deliveryCycleRatio
                    parvm.paramWeight.otherRatio = result.data.otherRatio
                    parvm.paramWeight.remark = result.data.remark
                }
            })
            this.isEdit = true;
        },
        queryParamWeight(){
            console.log("金查询了。。。。。")
            var vm = this;
            $.ajax({
                type: 'POST',
                url: contextPath+'/tbaseparamweight/info',
                data: {id: parvm.paramWeight.id},
                success: function (result) {
                    parvm.paramWeight = result.data

                    parvm.paramWeight.styleCode = result.data.styleCode
                }
            })
            parvm.codeFlag = true
            parvm.disabledFlag = true
        },
        save(){
            let This = this;
            console.log($('#my_from').valid())
            if ($('#my_from').valid()) {
                This.buttonFlag = false
                // This.$Spin.show();
                if(This.paramWeight.id === ''){
                    console.log("进新增了。。。")
                    $.ajax({
                        type: "POST",
                        url: contextPath+"/tbaseparamweight/save",
                        contentType: 'application/json',
                        data: JSON.stringify(This.paramWeight),
                        success: function(data) {
                            This.buttonFlag = true
                            if (data.code === "100100") {
                             /*   layer.alert(data.msg,{icon: 1, end:function () {
                                    parvm.parvnInit()
                                    This.reload = !This.reload
                                    This.isEdit = false;
                                }})
                                console.log(data.msg);*/
                                setTimeout(function(){
                                    This.$Modal.success({
                                        content:data.msg
                                    })
                                    parvm.parvnInit()
                                    This.reload = !This.reload
                                    This.isEdit = false;
                                },300)
                            }else{
                                // layer.alert(data.msg);
                                setTimeout(function(){
                                    This.$Modal.warning({
                                        content:data.msg
                                    })
                                },300)
                            }

                        },
                        error: function(err){
                            console.log("服务器出错");
                        },
                    });
                }else{
                    console.log("进修改了。。。")

                    $.ajax({
                        type: 'POST',
                        url: contextPath+'/tbaseparamweight/update',
                        contentType: 'application/json',
                        data: JSON.stringify(This.paramWeight),
                        success: function(data){
                            if (data.code === "100100") {
                               /* layer.alert(data.msg,{icon: 1, end:function () {
                                    // parvm.clear()
                                    This.reload = !This.reload
                                    This.isEdit = false;
                                    // This.cancel()
                                    This.buttonFlag = true
                                }})
                                */
                                // console.log(data.msg);
                                // layer.alert(data.msg);
                                setTimeout(function(){
                                    This.$Modal.success({
                                        content:data.msg
                                    })
                                    This.reload = !This.reload
                                    This.isEdit = false;
                                    This.buttonFlag = true
                                },300)
                            }else{
                                console.log(data.msg);
                            }
                        }
                    })
                }

            }
        },
        initFormValidate(){
            var validateOptions = {
                errorPlacement: function(error, element) {
                    // Append error within linked label
                    $( element ).closest( "div" ).append(error);
                },
                rules: {
                    code: {
                        required: true,
                        max:20,
                        remote: {
                            url: contextPath+"/tbaseparamweight/infoByCodeOrName?ktcStatus=0",  //后台处理程序
                            type: "post",  //数据发送方式
                            dataType: "json",  //接受数据格式
                            data: {  //要传递的数据
                                styleCode: function () {
                                    return parvm.body.styleCode;
                                }
                            },
                            dataFilter: function (data, type) {//判断控制器返回的内容
                                var res = JSON.parse(data);
                                if (res.code === "100100") {
                                    return true;
                                }
                                else {
                                    // layer.alert(res.msg);//没有弹出对话框
                                    return false;
                                }
                            }
                        }
                    },
                    name: {
                        required: true,
                        max:20
                    },
                    qualifiedRatio: {
                        validField:true,
                        required: true,
                        range:[0,100],
                        digits:true
                    },
                    laborRateRatio: {
                        validField:true,
                        required: true,
                        range:[0,100],
                        digits:true
                    },
                    kossFateRatio: {
                        validField:true,
                        required: true,
                        range:[0,100],
                        digits:true
                    },
                    deliveryCycleRatio: {
                        validField:true,
                        required: true,
                        range:[0,100],
                        digits:true
                    },
                    otherRatio: {
                        validField:true,
                        required: true,
                        range:[0,100],
                        digits:true
                    }
                },
                messages: {
                    code: {
                        required: "请填写编码!",
                        max: "最大长度不得大于20位",
                        remote: "商品代码已存在!"
                    },
                    name: {
                        required: "请填写名称!",
                    },
                    qualifiedRatio: {
                        required: "请填写质量合格率占比!",
                        range: '请输入0 到100 位数字'
                    },
                    laborRateRatio: {
                        required: "请填写工费率占比!",
                        range: '请输入0 到100 位数字'
                    },
                    kossFateRatio: {
                        required: "请填写损耗费率占比!",
                        range: '请输入0 到100 位数字'
                    },
                    deliveryCycleRatio: {
                        required: "请填写交货周期占比!",
                        range: '请输入0 到100 位数字'
                    },
                    otherRatio: {
                        required: "请填写其他占比!",
                        range: '请输入0 到100 位数字'
                    },
                    remark:{
                        maxlength: "备注最大长度为500!"
                    },
                }
            };
            $("#my_from").validate(validateOptions);
        },
        cancel(){
            $("#my_from").validate().resetForm();
            parvm.parvnInit()
            this.isEdit = false;
            this.buttonFlag = true
            this.selected = []
            this.reload = !this.reload;
        },
        forStyle(option){
            for( let i of parvm.itemList){
                if(i.code == option){
                    parvm.paramWeight.styleName = i.name
                }
            }
        },
        getUser(){
            $.ajax({
                type: 'POST',
                url: contextPath+'/tbaseunit/findUser',
                success: function (result) {
                    console.log(result)
                    parvm.paramWeight.createName = result.data.username
                    parvm.paramWeight.createId = result.data.createId
                }
            })
        },

        detailClick(){
            $.ajax({
                type: 'POST',
                url: contextPath+'/tbaseparamweight/infoByCodeOrName',
                data: {styleCode: parvm.paramWeight.styleCode},
                success: function (result) {
                    parvm.paramWeight = result.data
                    parvm.paramWeight.styleName = result.data.styleName
                    console.log(result)
                }
            })
            parvm.codeFlag = true
            parvm.disabledFlag = true
            this.isEdit = true;


        }
    },
    watch:{
        'isEdit':function(value){
            if(value == true){

            }

        }
    },
    created(){
        // this.getUser()
        $.ajax({
            type: 'POST',
                url: contextPath+'/tbasestylecategory/list',
                success:function (result) {
                parvm.styles=result.data
                // console.log("初始化。。。",result)
            }
        })
    },
    mounted(){
        this.initFormValidate();

        jQuery.validator.addMethod("validField", function (value, element) {
            // var chrnum = /[a-zA-Z0-9]^.$/;
            var chrnum = /^(0|100|[1-9]{1}\d?)$/;
            return chrnum.test(value);
        }, "请输入0-100之间的数值，支持小数")
        this.openTime=window.parent.params.openTime;
    }
})