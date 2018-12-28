var qualityBaseData=new Vue({
    el: '#qualityBasedata',
    data() {
        return {
            selected:[],
            isAdd: false,
            openModal : false,
            loading: true,
            reload: false,
            isShow:true,
            isCopy:false,
            isEdit :false,
            isSearchHide: true,
            isTabulationHide: true,
            isTabulationHide2: true,
            isHide:true,
            openTime:'',
            treeNodeId:'',
            isRight:false,
            isLeft:true,
            confirmConfig: {
                showConfirm: false,
                title: '提示',
                content: '请点击确认',
                onlySure: true,
                success: true
            },
            searchBody:{
                code:'',
                name:'',
                datatypeName:''
            },
            addBody:{
                id:null,
                code:'',
                name:'',
                status:1,
                describes:'',
                datatypeId:null,
                delStatus:1,
                organizationId:'',
                organizationName:'',
                datatypeName :''

            },
            validate:{
                name:[{required:true}]
            },
            body:{
                id: null,
                code:'',
                name:'',
                status:null,
                datatypeName:'',
                organizationId:1,
                datatypeId:null
            },


            data_config:{
                url: contextPath+"/baseDataController/list?organizationId="+window.parent.userInfo.organId,
                colNames: ['数据编码', '数据名称', '状态'],
                colModel: [

                    {name: 'code', index: 'code', align: "left", width: 280},
                    {name: 'name', index: 'name', width: 280, align: "left"},
                    /*{name: 'status', index: 'status', align: "center", width: 180}*/
                    {
                        name: 'status', index: 'status', width: 280, align: "left", formatter: function (value) {
                        return value == 1 ? "有效" : "无效";
                    }
                    },
                ],
                shrinkToFit: true
            },

            nodes:[
                {"id":1,"pId":0,"name":"质检基础数据类型","open":true},
                {"id":2,"pId":1,"name":"检验方法"},
                {"id":3,"pId":1,"name":"检验依据"},
                {"id":4,"pId":1,"name":"检验仪器"},
                {"id":5,"pId":1,"name":"不良原因"},
                {"id":6,"pId":1,"name":"缺陷等级"},
                {"id":7,"pId":1,"name":"检测值"},
                {"id":8,"pId":1,"name":"问题来源"},
            ],


            setting: {
                data: {
                    simpleData: {
                        enable: true,
                        idKey: "id",
                        pIdKey: "pId",
                        rootPId: -1
                    }
                },
                callback: {
                    onClick: this.clickEvent,
                }
            },


            // hideSearch() {
            //     qualityBaseData.isHide=!qualityBaseData.isHide;
            //     qualityBaseData.isSearchHide = !qualityBaseData.isSearchHide;
            //     $(".chevron").css("top","")
            // },
            // hidTabulation() {
            //     qualityBaseData.isHide=!qualityBaseData.isHide;
            //     qualityBaseData.isTabulationHide = !qualityBaseData.isTabulationHide;
            //     qualityBaseData.isTabulationHide2 = !qualityBaseData.isTabulationHide2;
            //     if(!qualityBaseData.isTabulationHide){
            //         $(".chevron").css("top","90%")
            //     }else{
            //         $(".chevron").css("top","")
            //     }
            // },
            showTree(){  //向右的箭头
                qualityBaseData.isShow = true;//显示树
                $(".ht-arrow").css("left","-60px");
                $(".ht-list-area").css({
                    "width":"67%",
                    "left":"220px"
                });
                qualityBaseData.isRight = false;
                // $(".ivu-icon-chevron-right").css("color","#DCDCDC");
                $(".ivu-icon-chevron-left").css("color","#49557F");
            },
            hideTree(){//向左的箭头
                qualityBaseData.isShow = false;//隐藏树
                $(".ht-arrow").css("left","-60px");
                $(".ht-list-area").css({
                    "width":"80%",
                    "left":"75px"
                });
                qualityBaseData.isRight = true;
                // $(".ivu-icon-chevron-left").css("color","#DCDCDC");
                $(".ivu-icon-chevron-right").css("color","#49557F");
            },


            // 有效无效状态
            statusList: [
                {
                    label: '有效',
                    value: 1
                },
                {
                    label: '无效',
                    value: 0
                }
            ],
        }
    },
    methods: {
        //单击树形节点,获取节点ID
        clickEvent(event, treeId, treeNode){
            let selnode = this.$ztree.getSelectedNodes();
            console.log(selnode);
            //this.treeNodeId = selnode[0].id;
            console.log(this.treeNodeId);
            qualityBaseData.addBody.datatypeId = treeNode.id;
            if((treeNode.id) == 0){
                qualityBaseData.body.datatypeId = null;
            }
            else{
                qualityBaseData.body.datatypeId = treeNode.id;
            }

            this.search2();


        },

        // 点击保存
        save(){
            setTimeout(() => {
                this.loading = false;
                this.$nextTick(() => {
                    this.loading = true;
                });
            }, 1000);
            // if(qualityBaseData.addBody.name == null || qualityBaseData.addBody.name == ''){
            //     this.$Modal.info({
            //         title: '提示信息',
            //         content: '数据名称不能为空，请输入！'
            //     });
            //     qualityBaseData.openModal  = true;
            //     return ;
            // }
            let isFormPass;
            this.$refs['baseData'].validate((valid)=>{
                if(valid){
                    isFormPass = true;
                } else {
                    isFormPass = false;
                }
            })
            if(!isFormPass) {
                return;
            }
            if(qualityBaseData.addBody.id == null && qualityBaseData.isCopy == false){
                $.ajax({
                    type:"POST",
                    url: contextPath+"/baseDataController/add",
                    contentType: 'application/json',
                    dataType:"json",
                    data : JSON.stringify(qualityBaseData.addBody),
                    success: function(result) {
                        //显示新增页面
                        qualityBaseData.isAdd = false;
                        if (result.code == "100100") {
                            // layer.alert('新增数据成功', {icon: 1});
                            qualityBaseData.$Modal.success({
                                title: '提示信息',
                                content: '新增数据成功！'
                            });
                            qualityBaseData.openModal  = false;
                        } else {
                            // layer.alert('新增数据失败', {icon: 0});
                            qualityBaseData.$Modal.info({
                                title: '提示信息',
                                content: '新增数据失败！'
                            });
                        }
                        qualityBaseData.search2();
                        qualityBaseData.isCopy = false;
                    },
                    error: function(err){
                        // alert(err);
                        qualityBaseData.$Modal.info({
                            title: '提示信息',
                            content: '服务器出错，请稍后再试！'
                        });
                    },
                })
            }

            if(qualityBaseData.addBody.id != null && qualityBaseData.isCopy == true){
                qualityBaseData.addBody.id = null;
                $.ajax({
                    type:"POST",
                    url: contextPath+"/baseDataController/add",
                    contentType: 'application/json',
                    dataType:"json",
                    data : JSON.stringify(qualityBaseData.addBody),
                    success: function(result) {
                        // qualityBaseData.addBody = result.data;
                        //显示新增页面
                        qualityBaseData.isAdd = false;
                        //  qualityBaseData.openModal  = true;
                        if (result.code == "100100") {
                            // layer.alert('复制数据成功', {icon: 1});
                            qualityBaseData.$Modal.success({
                                title: '提示信息',
                                content: '复制数据成功！'
                            });
                            qualityBaseData.openModal  = false;
                        } else {
                            // layer.alert('复制数据失败', {icon: 0});
                            qualityBaseData.$Modal.info({
                                title: '提示信息',
                                content: '复制数据失败！'
                            });
                        }
                        qualityBaseData.search2();
                        qualityBaseData.isCopy = false;
                    },
                    error: function(err){
                        // alert(err);
                        qualityBaseData.$Modal.info({
                            title: '提示信息',
                            content: '服务器出错，请稍后再试！'
                        });
                    },
                })
            }

            if(qualityBaseData.addBody.id != null && qualityBaseData.isCopy == false){
                $.ajax({
                    type:"POST",
                    url: contextPath+"/baseDataController/update",
                    contentType: 'application/json',
                    dataType:"json",
                    data : JSON.stringify(qualityBaseData.addBody),
                    success: function(result) {
                        // qualityBaseData.addBody = result.data;
                        //显示新增页面
                        qualityBaseData.isAdd = false;
                        // qualityBaseData.openModal = true;
                        if (result.code == "100100") {
                            // layer.alert('修改数据成功', {icon: 1});
                            qualityBaseData.$Modal.success({
                                title: '提示信息',
                                content: '修改数据成功！'
                            });
                            qualityBaseData.openModal  = false;
                        } else {
                            // layer.alert('修改数据失败', {icon: 0});
                            qualityBaseData.$Modal.info({
                                title: '提示信息',
                                content: '修改数据失败！'
                            });
                        }
                        qualityBaseData.search2();
                        qualityBaseData.isCopy = false;
                    },
                    error: function(err){
                        // alert(err);
                        qualityBaseData.$Modal.info({
                            title: '提示信息',
                            content: '服务器出错，请稍后再试！'
                        });
                    },
                })

            }

        },
        // 点击退出(退出页面)
        exit(){
            window.parent.closeCurrentTab({name: '质检基础数据',exit:true, openTime:this.openTime})
        },
        //点击退出（返回至列表页）
        back(){
            this.isAdd = false;
            this.isCopy = false;
            this.openModal = false;
           /* if(qualityBaseData.isCopy == false ){
            qualityBaseData.selected.length=0;
            }*/
        },
        //点击刷新
        refresh(){
            window.location.reload();
        },
        //点击搜索按钮
        search(){
            qualityBaseData.selected.length=0;
            //获取表单数据
            console.log(this.body);
            //发送请求，查询数据
            this.reload = !this.reload;

        },

        search2(){
            //获取表单数据
            console.log(this.body);
            //发送请求，查询数据
            this.reload = !this.reload;
        },

        //点击清空按钮
        clear(){
            debugger;
            this.body = {
                datatypeName:'',
                /*datatypeId:null,*/
                code:'',
                name:''
            }

        },
        //点击新增行
        addNewRow() {
            qualityBaseData.isCopy = false;
            let currentOrganId = window.parent.userInfo.organId;
            let currentOrgName = window.parent.userInfo.orgName;
            let selnode = this.$ztree.getSelectedNodes();
            var name = ''
            console.log(qualityBaseData.addBody);
            this.addBody = {
                id:null,
                status:1,
                delStatus:1,
                datatypeName:'',
                code:'',
                name:'',
                describes:'',
                organizationName:'',
            }
            if (selnode.length != 0){
                name = selnode[0].name;
            }

            if(name =='质检基础数据类型' || selnode.length == 0 ){
                this.isAdd  = false,
                    this.openModal  = false,
                    this.$Modal.info({
                        title: '提示信息',
                        content: '新增行仅能对具体数据类型进行操作，请选择一个具体类型！'
                    });
                return;
            }
            qualityBaseData.addBody.datatypeId = selnode[0].id;
            qualityBaseData.addBody.organizationId = currentOrganId;
            qualityBaseData.addBody.organizationName = currentOrgName;
            //this.isAdd = true;
            this.openModal = true;

        },

        //点击复制行时
        copyOneRow(){
           /* let id = JSON.stringify(qualityBaseData.selected[0]);*/
            qualityBaseData.$forceUpdate();
            qualityBaseData.addBody.organizationId = window.parent.userInfo.organId;
            qualityBaseData.addBody.organizationName = window.parent.userInfo.orgName;

            var id = qualityBaseData.selected[0];
            id = parseInt(id);
            if(qualityBaseData.selected.length !== 1 ){
                this.$Modal.info({
                    title: '提示信息',
                    content: '复制行仅能对单笔数据进行操作，请重新选择！'
                });
            }
            else{
                qualityBaseData.isCopy = true;
                $.ajax({
                    type:"POST",
                    url: contextPath+"/baseDataController/list?id="+id,
                    contentType: 'application/json',
                    dataType:"json",
                    success: function(result) {
                        qualityBaseData.addBody = result.data;
                        qualityBaseData.addBody.code = '系统自动生成';
                        //显示新增页面
                        /*qualityBaseData.isAdd = false;*/
                        qualityBaseData.openModal = true;
                        /*this.reload = !this.reload;*/
                    },
                    error: function(err){
                        // alert(err);
                        qualityBaseData.$Modal.info({
                            title: '提示信息',
                            content: '服务器出错，请稍后再试！'
                        });
                    },
                })
            }
        },
        //点击修改行时
        modifyOneRow(){
            qualityBaseData.addBody.organizationId = window.parent.userInfo.organId;
            qualityBaseData.addBody.organizationName = window.parent.userInfo.orgName;

            qualityBaseData.isCopy = false;
            qualityBaseData.isAdd = false;
            qualityBaseData.openModal = false;
            //  let id = JSON.stringify(qualityBaseData.selected[0]);
            var id = qualityBaseData.selected[0];
            id = parseInt(id);
            var datatypeId = qualityBaseData.body.datatypeId;
            console.log(qualityBaseData.selected.length);
            if(qualityBaseData.selected.length !== 1 ){
                this.$Modal.info({
                    title: '提示信息',
                    content: '修改行仅能对单笔数据进行操作，请重新选择！'
                });
            }else {
                //根据id，发送请求，查询该条数据记录
                $.ajax({
                    type:"POST",
                    url: contextPath+"/baseDataController/list?id="+id,
                    contentType: 'application/json',
                    dataType:"json",
                    success: function(result) {
                        qualityBaseData.addBody = result.data;
                        qualityBaseData.openModal = true;
                        this.reload = !this.reload;
                    },
                    error: function(err){
                        qualityBaseData.$Modal.info({
                            title: '提示信息',
                            content: '服务器出错，请稍后再试！'
                        });
                    },
                })

            }
        },
        //点击删除行时
        deleteMultiRows(){
            if(qualityBaseData.selected.length < 1 ){
                this.$Modal.info({
                    title: '提示信息',
                    content: '请先选择至少一笔数据！'
                });
            }else{
                this.$Modal.confirm({
                    title: '提示信息',
                    content: '是否要删除信息？',
                    onOk: () => {
                        console.log(JSON.stringify(this.selected));
                        $.ajax({
                            type:"POST",
                            url: contextPath+"/baseDataController/delete",
                            contentType: 'application/json',
                            data:JSON.stringify(qualityBaseData.selected),
                            dataType:"json",
                            success: function(result) {
                                /*qualityBaseData.confirmConfig.content = result.msg;
                                qualityBaseData.confirmConfig.showConfirm = result.code;
                                qualityBaseData.reload = !qualityBaseData.reload;*/
                                if (result.code == "100100") {
                                    // layer.alert('删除数据成功', {icon: 1});
                                  setTimeout(function(){
                                      qualityBaseData.$Modal.success({
                                          title: '提示信息',
                                          content: '删除数据成功！'
                                      });
                                  },300)
                                } else {
                                    // layer.alert('删除数据失败', {icon: 0});
                                    setTimeout(function(){
                                        qualityBaseData.$Modal.info({
                                            title: '提示信息',
                                            content: '删除数据失败！'
                                        });
                                    },300)
                                }
                                qualityBaseData.selected.length=0;
                                qualityBaseData.search2();
                            },
                            error: function(err){
                                // layer.alert(err);
                                qualityBaseData.$Modal.info({
                                    title: '提示信息',
                                    content: '服务器出错，请稍后再试！'
                                });
                            },
                        })
                    },
                    onCancel: () => {
                        // this.$Message.info('点击了取消');
                    }
                });
            }

        },
        //点击设置列
        setColumn(){

        }
    },
    mounted() {
        this.openTime=window.parent.params.openTime;
        $.ajax({
            contentType: 'application/json;charset=utf-8',
            type:"post",
            url: contextPath+"/businessTypeService/list",
            dataType:"json",
            success:function(data){
                var itemData = data.data;
                var datas = [{"id":0,"pId":null,"name":"质检基础数据类型",open:true} ];
                for(var i=0;i<itemData.length;i++){
                        datas.push({
                            "id":itemData[i].id,
                            "pId":0,
                            "name":itemData[i].name,
                        });
                }
                qualityBaseData.nodes = datas;
                let currentOrganId = window.parent.userInfo.organId;
                qualityBaseData.body.organizationId = currentOrganId;

            },
            error:function(){
                this.$Modal.info({
                    title: '提示信息',
                    content: '服务器出错，请稍后再试！'
                });
            }
        })

    }
})