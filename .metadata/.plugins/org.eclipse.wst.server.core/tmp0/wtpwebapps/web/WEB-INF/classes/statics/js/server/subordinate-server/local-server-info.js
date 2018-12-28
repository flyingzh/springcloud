var vm = new Vue({
    el: "#app",
    data: {
        htHaveChange:false,
        //退出按钮
        openTime: '',
        areaInit:{
            isInit:false,
            province:"",
            city:"",
            country:"",
            detail:"",
            area:"",
            disabled:false
        },

        levelTreeSetting:{
            async: {
                enable: true,
            },
            callback:{
                onAsyncSuccess : this.ztreeOnAsyncSuccess,//异步加载成功后执行的方法
            }
        },
        area:{},
        moduleAuthorization:"",
        /*许可时间*/
        licenseTime:[],
        /*服务器层级关系*/
        serverList:'',
        info:{
            /*服务器信息*/
            serverInfo:{
                serverIp:'',//ip
                serverMac:'',//mac
                serverType:'',//服务器类型
                licenseStartTime:'',//许可开始时间
                licenseEndTime:'',//许可结束时间
                //所有授权模块
                serverAuthModuleList:[],
            },
            /*公司信息*/
            company:{
                companyName:'',//公司全称
                companyNameShort:'',//公司简称
                contact:'',//联系人
                contactNumber:'',//联系电话
                corporate:'',//公司法人
                creditCode:'',//社会信用代码
                businessLicenseUrl:'',//营业执照
                area:'',//区域
                province:'',//省
                city:'',//市
                county:'',//县
                detailAddress:'',//详细地址
            },
            /*授权模块*/
            authModuleIds:[],
            /*授权组织数量*/
            serverAuthNumEntity:{
                branchCompanyNum:'',//分公司授权数量
                childCompanyNum:'',//子公司授权数量
                storeNum:'',//门店授权数量
                branchOnUserNum:'',//分公司授权用户数
                childOnUserNum:'',//子公司授权用户数
                storeOnNum:'',//门店授权用户数
            }
        }
    },
    methods:{
        sideHandleSuccess(result) {
            let startTime = new Date(result.data.serverInfo.licenseStartTime).format("yyyy/MM/dd");
            let endTime = new Date(result.data.serverInfo.licenseEndTime).format("yyyy/MM/dd");
            this.$Modal.success({
                title:'恭喜您，验证通过！',
                content: "服务器授权有效期为："+startTime+'-'+endTime
            });
            this.getLocalServerInfo();
        },
        handleMaxSize(file) {
            this.$Modal.error({
                content: '文件过大,请重新选择',
            });
        },
        handleFormatError(file) {
            this.$Modal.error({
                content: '文件格式不正确,请重新选择',
            });
        },
        expand_ztree(treeId){
            console.log(treeId,"treeId")
            var treeObj = $.fn.zTree.getZTreeObj(treeId);
            treeObj.expandAll(true);
        },
        ztreeOnAsyncSuccess(){
           this.expand_ztree()
        },
        getAddress(){
            let info = this.info.company;
            this.areaInit={isInit:true,area:info.area,province:info.province,city:info.city,county:info.county,detail:info.detailAddress,disabled:true}
        },
        getLocalServerInfo(){
            let This = this;
            $.ajax({
                type: "post",
                url: contextPath + "/subordinateController/getLocalServerInfo",
                contentType: 'application/json',
                dataType: "json",
                success:function (res) {
                    This.info.serverInfo = res.data.serverInfo;
                    This.info.company = res.data.company;
                    if(res.data.authModuleIds != null && res.data.authModuleIds.length < 1){
                        This.info.authModuleIds = res.data.authModuleIds;
                    }
                    if(res.data.serverAuthNumEntity != null){
                        This.info.serverAuthNumEntity = res.data.serverAuthNumEntity;
                    }
                    /*This.licenseTime.push(
                        new Date(This.info.serverInfo.licenseStartTime),
                        new Date(This.info.serverInfo.licenseEndTime)
                    );
                    This.licenseTime.splice(0,1,new Date(This.info.serverInfo.licenseStartTime));
                    This.licenseTime.splice(1,1,new Date(This.info.serverInfo.licenseEndTime));*/
                    Vue.set(This.licenseTime,0,new Date(This.info.serverInfo.licenseStartTime));
                    Vue.set(This.licenseTime,1,new Date(This.info.serverInfo.licenseEndTime));
                    This.getAddress();
                },
                error:function () {
                    This.$Modal.info({title:'提示信息',content:'服务器出错了！'});
                }
            });
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
        closeModal(type) {
            if (type === 'yes') {//提交数据
                this.save('save');
            } else if (type === 'no') {//关闭页面
                this.exit(true);
            }
        },
        exit(close){

            if(close === true){
                window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
                return false;
            }
            if(this.handlerClose()){
                window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
            }
        },
        htTestChange(){
            this.htHaveChange = true;
        },
    },
    created(){
        window.handlerClose = this.handlerClose;
        // this.params = window.parent.params.params;
        this.openTime = window.parent.params.openTime;
    },
    mounted(){
        this.getLocalServerInfo();
        $.fn.zTree.init($("#tree-demo"), this.levelTreeSetting, null)
    }
})