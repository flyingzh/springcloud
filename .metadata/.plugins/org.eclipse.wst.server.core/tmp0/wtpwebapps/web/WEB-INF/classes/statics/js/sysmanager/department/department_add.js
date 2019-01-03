var parvm = new Vue({
    el: '#department_list',
    data: {
        ruleValidate: {
            depName: [
                { required: true}
            ]
        },
        selectChargeObj: null, //所选的客户对象
        showAll:false,
        htHaveChange:false,
        showChargeObj:false,
        openTime:'',
        body:{
                id:0,
                depCode:'',
                depName:'',
                depChargeId:'',
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
                updateTime:'',
                createTime:'',
                depStatus:'',
                depGroupStatus:'',
                createName:'',
                updateName:'',
        },
        parentDept:{
            id:0,
            depCode:'',
            depName:'',
            depChargeId:'',
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
    methods:{
        save(name){
            let isFormPass = '';
            this.$refs[name].validate((valid) => {
                if (valid) {
                    isFormPass = true;
                } else {
                    isFormPass = false;
                }
            })
            if(!isFormPass){
                return false;
            }
            let This = this;

            window.top.home.loading('show');
            if(This.body.id == null || This.body.id == 0 ){
                $.ajax({
                    type: "post",
                    url: '/web/dept/saveDeptDetailed',
                    dataType: "json",
                    async:false,
                    data: JSON.stringify(This.body),
                    contentType: 'application/json;charset=utf-8',
                    success: function (data) {
                        window.top.home.loading('hide');
                        This.htHaveChange = false;
                        console.log("不走了！")
                        if (data.code === "100100") {
                            console.log(data.data,data)
                            This.body = data.data
                            console.log(This.body)
                            This.$Modal.success({
                                title: '提示信息',
                                content: '保存成功!'
                            });
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
            }else{
                $.ajax({
                    type: "post",
                    url: '/web/dept/updateDeptDetailed',
                    dataType: "json",
                    data: JSON.stringify(This.body),
                    contentType: 'application/json;charset=utf-8',
                    success: function (data) {
                        window.top.home.loading('hide');
                        if (data.code === "100100") {
                            This.$Modal.success({
                                title: '提示信息',
                                content: '保存成功!',
                            });
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
            }
        },
        closeModal(type){
            if(type === 'yes'){//提交数据
                this.save('formValidate');
                this.exit(true);
            }else if(type === 'no'){//关闭页面
                this.exit(true);
            }
        },
        exit(close){

            if(close === true){
                window.parent.closeCurrentTab({name:'部门-新增',openTime:this.openTime,exit: true})
                return;
            }

            if(this.handlerClose()){
                window.parent.closeCurrentTab({name:'部门-新增',openTime:this.openTime,exit: true})
            }
        },
        handlerClose(){
            if(this.htHaveChange){
                this.$nextTick(()=>{
                    this.$refs.closeModalRef.showCloseModal();
                });

                return false;
            }
            return true;
        },
        getUserInfo(date){
            let This = this;

            $.ajax({
                type: "post",
                url: '/web/dept/getUserInfo',
                dataType: "json",
                success: function (data) {
                    window.top.home.loading('hide');
                    if (data.code === "100100") {
                        This.body.createName = data.data.createName;
                        if (date==='') {
                            This.body.createTime = data.data.createTime;
                        }
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
        //获取上级部门组织信息 同时获取当前组织
        getParentInfo(id,parentIds){
            let This = this;

            var data;
            //id等于空获取当前组织，id不等于空获取上级组织
            if (id == ''){
                data = parentIds;
            }else{
                data = id;
            }

            $.ajax({
                type: "post",
                url: '/web/dept/getDeptInfoTree',
                dataType: "json",
                data: {parentId:data},
                success: function (data) {
                    window.top.home.loading('hide');
                    if (data.code === "100100") {
                        if (id == ''){
                            This.body = data.data[0];
                            This.getParentInfo(data.data[0].parentId,'');
                        }else{
                            This.parentDept = data.data[0];
                            This.getUserInfo(data.data[0].createTime);
                            This.$refs.chargeRef.loadEmployeeList(This.body.depChargeName,This.body.depChargeId);
                        }


                    }else{
                        This.$Modal.info({
                            title: '提示信息',
                            content: data.msg,
                        });
                    }
                },
                error: function () {
                    window.top.home.loading('hide');
                    This.$Modal.error({content:"服务器出错啦！",title:"提示信息"});
                }
            })
        },
        closeCharge() {
            if(this.selectChargeObj){
                this.body.depChargeName = this.selectChargeObj.empName;
                this.body.depChargeId = this.selectChargeObj.id;
            }

        },
        htTestChange(){
            this.htHaveChange = true;
            console.log(333333333)
        },
        clearNoNumber(item,type,floor){
            return htInputNumber(item,type,floor)
        },
    },
    mounted(){
        let params = window.parent.params.params;
        this.openTime = window.parent.params.openTime;
        console.log(params)
        if (params.type === 'modify'){
            this.getParentInfo('',params.id);
            this.body.id = params.id;
        }else if(params.type === 'add'){
            this.body.parentId = params.id;
            this.parentDept.depName = params.deptName;
            this.getUserInfo('');
        }else if(params.type === 'query'){
            this.getParentInfo('',params.id);
            this.body.id = params.id;
            this.showAll=true;
        }

    },
})