var parvm = new Vue({
    el: '#paraLevel',
    data() {
        let This = this;
        return {
            isTabulationHide: true,
            isEdit: false,
            reload: false,
            isSearchHide: true,
            showDepartmentAdd:false,
            showDepartmentUpdate:false,
            openTime:'',

            //常量
            constent:{

                //明细部门状态
                DEP_DETAILED:1,
                //部门组状态
                DEP_GROUPD:0,

            },



            selected:[],

            parentData:{
                id:'',
                deptName:'',
                parentId:'',
            },
            body:{
                id:0,
                depCode:'',
                depName:'',
                depChargeName:'',
                depStaff:'',
                depMobile:'',
                depPhone:'',
                parentId:'',
                depRemarks:'',
                orgId:'',
                depDuty:'',
                depCreateId:'',
                depUpdateId:'',
                depUpdateTime:'',
                depCreateTime:'',
                depStatus:'',
                depGroupStatus:'',
                createName:'',
                updateName:'',
            },
            //setting:配置相关
            setting1: {
                //注意：如果使用如上简单Json数据，以下data.simpleData.enable必须设置为true。
                data: {
                    view:{
                        dblClickExpand:false
                    },
                    simpleData: {
                        enable: true,
                        idKey: "id",
                        pIdKey: "parentId",
                    },
                    key: {
                        name: 'depName'
                    }
                },
                //callback内定义事件和回调函数，更多事件请参考官方文档。
                callback: {
                    onClick: this.subjectClickEvent,
                }
            },
            treeUrl:"",
            subjectUrl:"",
            data_config:{
                url: "/web/dept/getDeptInfoTree",
                datatype:"json",
                colNames: ['代码', '部门名称','部门主管','部门编制人数', '备注', '创建日期', '创建人'],
                colModel:[
                    {name: "depCode", width: 210, align: "left",
                        formatter: function (value, grid, rows, state) {

                            $(document).off("click", ".detail" + value).on("click", ".detail" + value, function (e) {
                                parvm.query(rows.id);
                            });
                            let btns = `<a class="detail${value}">${value}</a>`;
                            return btns
                        }
                    },
                    {name: "depName", width: 210, align: "left"},
                    {name: "depChargeName", width: 210, align: "left"},
                    {name: "depStaff", width: 210, align: "left"},
                    {name: "depRemarks", align: "left", width: 210},
                    {name: "createTime", align: "left", width: 210},
                    {name: "createName", align: "left", width: 210}

                ],
                rowNum : 5,//一页显示多少条
                rowList : [ 10, 20, 30 ],//可供用户选择一页显示多少条
                mtype : "post",//向后台请求数据的ajax的类型。可选post,get
                viewrecords : true
            }
        }
    },
    methods: {
        query(value){
            var This = this;
            window.parent.activeEvent({
                name: '查看部门',
                url: contextPath + '/sysmanager/department/department_add.html',
                params: {id: value,type:'query'}
            });
        },
        //刷新
        refurbish(){
            // this.sure();
            location.reload()
            this.selected=[];
        },
        //退出
        exit(){
            window.parent.closeCurrentTab({name:'部门管理',openTime:this.openTime,exit: true});
        },
        subjectClickEvent(treenode,treeId,parentDatas){
            console.log(treenode,"treenode")
            console.log(treeId,"treeId")
            console.log(parentDatas,"parentId")

            this.parentData.id = parentDatas.id;
            this.parentData.parentId = parentDatas.parentId;
            debugger
            this.parentData.deptName = parentDatas.depName;
            this.parentData.depGroupStatus = parentDatas.depGroupStatus;
            if(this.parentData.depGroupStatus == this.constent.DEP_DETAILED){
                $(".is-disabled").css("pointer-events", "none").css({"color": "#bbbec4"})
                $(".is-disabled_add").css("pointer-events", "none").css({"color": "#bbbec4"})
            }else if(this.parentData.id == this.constent.ROOT_ID){
                $(".is-disabled").css("pointer-events", "none").css({"color": "#bbbec4"})
                $(".is-disabled_add").css({"pointer-events":"auto "}).css({"color": "#495060"})
            }else{
                $(".is-disabled").css({"pointer-events":"auto "}).css({"color": "#495060"})
                $(".is-disabled_add").css({"pointer-events":"auto "}).css({"color": "#495060"})
            }

            this.body.id = parentDatas.id;

            this.sure();
        },
        //左侧树的新增
        addCategoty() {
            if (this.parentData.parentId === ''){
                this.$Modal.info({
                    title: '提示信息',
                    content: '请选择父级节点！',
                });
                return;
            }else if(this.parentData.depGroupStatus !== this.constent.DEP_GROUPD){
                this.$Modal.info({
                    title: '提示信息',
                    content: '只能选择部门组新增！',
                });
                return;
            }

            this.parentData.deptName = '';
            this.showDepartmentAdd = true;
        },
        //左侧树的修改
        modifyCategoty() {

            let This = this;
            if (This.parentData.parentId === ''){
                This.$Modal.info({
                    title: '提示信息',
                    content: '请选择父级节点！',
                });
                return;
            }else if(this.parentData.depGroupStatus !== this.constent.DEP_GROUPD){
                this.$Modal.info({
                    title: '提示信息',
                    content: '只能选择部门组修改！',
                });
                return;
            }
            This.showDepartmentUpdate = true;
        },
        //左侧树的删除
        delDeptGroup(){
            let This = this;

            if (This.parentData.parentId === ''){
                This.$Modal.info({
                    title: '提示信息',
                    content: '请选择父级节点！',
                });
                return;
            }else if(This.parentData.depGroupStatus === This.constent.DEP_DETAILED){
                This.$Modal.info({
                    title: '提示信息',
                    content: '只能删除部门组！',
                });
                return;
            }else if (This.parentData.parentId === null || This.parentData.parentId === ''){
                This.$Modal.info({
                    title: '提示信息',
                    content: '根节点不允许删除！',
                });
                return;
            }



            window.top.home.loading('show');
            var ajax1 = $.ajax({
                type: "post",
                url: '/web/dept/getDeptSubordinateAll',
                dataType: "json",
                data: JSON.stringify({id:This.parentData.id}),
                contentType: 'application/json;charset=utf-8',
            })

            var ajax2 = ajax1.then(function (ajax1) {
                if (ajax1.code === "100100") {
                    if (ajax1.data.length > 1){
                        This.$Modal.info({
                            title: '提示信息',
                            content: '当前部门组下有子部门！不允许删除！',
                        });
                        window.top.home.loading('hide');
                        return;
                    }
                }else{
                    This.$Modal.info({
                        title: '提示信息',
                        content: ajax1.msg,
                    });
                }

                return $.ajax({
                    type: "post",
                    url: '/web/dept/deleteDeptGroup',
                    dataType: "json",
                    data: JSON.stringify({id:This.parentData.id}),
                    contentType: 'application/json;charset=utf-8',
                });
            })

            ajax2.done(function (ajax2) {
                if (ajax2 == null) {
                    return null;
                }
                window.top.home.loading('hide');
                This.sure();
                if (ajax2.code === "100100") {
                    This.parentData.parentId = '';
                    This.parentData.deptName = '';

                    This.$Modal.success({
                        title: '提示信息',
                        content: ajax2.msg,
                    });

                    This.$refs.mytree.loadData();
                }else{
                    This.$Modal.info({
                        title: '提示信息',
                        content: ajax2.msg,
                    });
                }
            }).fail(function (error) {
                window.top.home.loading('hide');
                vm.$Modal.error({
                    title: '提示信息',
                    content: '服务器出错啦!',
                });
            })
        },
        //右侧jqgrid的新增
        add_click(){
            let This = this;

            if (This.parentData.parentId === '' || This.parentData.depGroupStatus === This.constent.DEP_DETAILED){
                This.$Modal.info({
                    title: '提示信息',
                    content: '请选择部门组！',
                });
                return;
            }

            window.parent.activeEvent({
                name: '新增部门',
                url: contextPath + '/sysmanager/department/department_add.html',
                params: {id: This.parentData.id,type:'add',deptName:This.parentData.deptName}
            });
        },

        //右侧jqgrid的修改
        modify() {
            let This = this;
            if (This.selected.length !==1){
                This.$Modal.info({
                    title: '提示信息',
                    content: '只能选择一条数据！',
                });
                return;
            }

            window.parent.activeEvent({
                name: '修改部门',
                url: contextPath + '/sysmanager/department/department_add.html',
                params: {id: This.selected[0],type:'modify'}
            });
        },
        //右侧jqgrid删除
        del_click(){
            let This = this;

            if (This.selected.length ===0){
                This.$Modal.info({
                    title: '提示信息',
                    content: '请选择要删除的数据！',
                });
                return;
            }

            window.top.home.loading('show');
            $.ajax({
                type: "post",
                url: '/web/dept/deleteDeptDetailed',
                dataType: "json",
                data: JSON.stringify({idList:This.selected}),
                contentType: 'application/json;charset=utf-8',
                success: function (data) {
                    window.top.home.loading('hide');
                    This.sure();
                    if (data.code === "100100") {
                        This.parentData.parentId = '';
                        This.parentData.deptName = '';

                        This.$Modal.success({
                            title: '提示信息',
                            content: data.msg,
                        });
                        This.$refs.mytree.loadData();
                    }else{
                        This.$Modal.info({
                            title: '提示信息',
                            content: data.msg,
                        });
                    }

                },
                error: function () {
                    window.top.home.loading('hide');
                    This.$Modal.error({content:"服务器出错啦！",title:"提示信息"})
                }
            })
        },
        sure(){
            this.reload = !this.reload;
        },
        //清空按钮
        clear(){
            this.body = {
                    depCode:'',
                    depName:'',
                    depChargeName:'',
                    depStaff:'',
                    depMobile:'',
                    depPhone:'',
                    parentId:'',
                    depRemarks:'',
                    orgId:'',
                    depDuty:'',
                    depCreateId:'',
                    depUpdateId:'',
                    depUpdateTime:'',
                    depCreateTime:'',
                    depStatus:'',
                    depGroupStatus:'',
                    createName:'',
                    updateName:'',
            }
        },
      //  新增保存
      save(){

      },
        //  新增退出
        cancel(){
            this.selected = []
            this.isEdit = false;
            this.reload = !this.reload
        },
        //新增部门组弹框中点击确定
        adddepartmentDone(){
            let This = this;
            This.showDepartmentAdd = false;

            window.top.home.loading('show');
            $.ajax({
                type: "post",
                url: '/web/dept/saveDeptGroup',
                dataType: "json",
                data: JSON.stringify({parentId:This.parentData.id,depName:This.parentData.deptName}),
                contentType: 'application/json;charset=utf-8',
                success: function (data) {
                    window.top.home.loading('hide');
                    This.sure();
                    if (data.code === "100100") {
                        This.parentData.parentId = '';
                        This.parentData.deptName = '';
                        This.$Modal.success({
                            title: '提示信息',
                            content: data.msg,
                        });
                        This.$refs.mytree.loadData();
                    }else{
                        This.$Modal.info({
                            title: '提示信息',
                            content: data.msg,
                        });
                    }
                },
                error: function () {
                    window.top.home.loading('hide');
                    This.$Modal.error({content:"服务器出错啦！",title:"提示信息"})
                }
            })
        },
        //部门组修改
        deptUpdateName() {
            let This = this;

            window.top.home.loading('show');
            $.ajax({
                type: "post",
                url: '/web/dept/updateDeptGroup',
                dataType: "json",
                data: JSON.stringify({id:This.parentData.id,depName:This.parentData.deptName}),
                contentType: 'application/json;charset=utf-8',
                success: function (data) {
                    window.top.home.loading('hide');
                    This.sure();
                    if (data.code === "100100") {
                        This.parentData.id = '';
                        This.parentData.deptName = '';
                        This.$Modal.success({
                            title: '提示信息',
                            content: data.msg
                        });
                        This.$refs.mytree.loadData();
                    }else{
                        This.$Modal.info({
                            title: '提示信息',
                            content: data.msg,
                        });
                    }
                },
                error: function () {
                    window.top.home.loading('hide');
                    This.$Modal.error({content:"服务器出错啦！",title:"提示信息"})
                }
            })

            This.showDepartmentUpdate = false;
        },
    },
    mounted(){

        this.openTime = window.parent.params.openTime;
    }
})




