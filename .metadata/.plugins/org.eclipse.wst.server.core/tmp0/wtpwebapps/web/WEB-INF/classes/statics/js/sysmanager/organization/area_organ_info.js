var vm = new Vue({
    el: "#app",
    data: {
        htHaveChange:false,
        ruleValidate: {
            contactNumber: [
                { required: true,trigger:'blur',validator: function(rule, value, callback) {
                    if(!value){
                        return callback(new Error("请输入联系方式！"));
                    }else if(!(/^1[34578]\d{9}$/.test(value))){
                        return callback(new Error("请输入正确联系方式！"))
                    }else{
                        callback();
                    }
                }
              }
            ],
            orgName:[
                {required:true}
            ],
            level:[
                {required:true}
            ],
            parentId:[
                {required:false}
            ],
            organType:[
                {required:true}
            ],
            nature:[
                {required:false}
            ]
        },
        openTime:'',
        params:{},
        isAdd: false,
        openTime:"",
        isEdit: false,
        isDisabled: true,
        modalDisabled: true,
        levelDisabled: false,
        reload: false,
        selected:[],
        isSearchHide: true,
        isTabulationHide: true,
        isShowOrganization:false,
        frameTab:false,
        area:{},
        //是否显示性质下拉框
        isShowNature:false,
        areaInit:{
            isInit:false,
            province:'',
            area:'',
            city:'',
            county:'',
            detail:'',
            disabled:false
        },
        //是否显示所属上级组织弹框
        isShowParentId:false,
        selectOrganizationType:[
            {
                value:1,
                label:"总平台"
            },
            {
                value:2,
                label:"总公司"
            },
            {
                value:3,
                label:"分公司"
            },
            {
                value:4,
                label:"子公司"
            },
            {
                value:5,
                label:"门店"
            },
        ],
        selectClass:[
            {
                value:1,
                label:"最高层级"
            },
            {
                value:2,
                label:"下属层级"
            }
        ],
        selectNature:[
            {
                value:1,
                label:"挂牌"
            },
            {
                value:2,
                label:"联营"
            },
            {
                value:3,
                label:"加盟"
            },
            {
                value:4,
                label:"自营"
            }
        ],
        equityInfo:[],
        organizationEntity: {
            createId: "",
            updateId: "",
            createName: "",
            updateName: "",
            createTime: "",
            updateTime: "",
            id: "",
            orgCode: "",
            orgName: "",
            contact: "",
            contactNumber: "",
            abbreviation: "",
            area: "",
            province: "",
            city: "",
            county: "",
            detail: "",
            concreteAddress: "",
            corporate: "",
            level: "",
            organType: "",
            nature: "",
            parentId: "",
            parentName: "",
            taxRate: "",
            businessLicenseUrl: null,
            relyServer: "",
            relyOrgan: "",
            sourceServer: "",
            sourceServerType: "",
            orgStatus: "",
            isDel: 1,
            sourceMark: 2,
            isRootOrgan: "",
            rootOrganCode:"",
            equityInfoEntities:[]
        },
        organId: '',
        checkOrganNumResult:{
            mark: false,
            msg: ''
        },
        organTime:new Date(),
        organTreeSetting:{
        },
        //保存复选框勾选数据
        lotData:[],
        //保存复选框所选下标
        checkindex:[],
        isCheckedAll: false,
        ipAddress: '',
        ktcIp:'192.168.50.183',
        topOrganInfo: ''
    },
    methods: {
        showOrganization(){
            this.isShowOrganization = true;
        },
        //新增
        save(name){
            let _this = this;
            let isFormPass = false;

            if(ht.util.hasValue(_this.area,'object')){
                Object.assign(_this.organizationEntity,_this.area);
            }

            if(_this.organizationEntity.id){
                if(ht.util.hasValue(this.organizationEntity)){
                    this.areaInit={
                        isInit:true,
                        province: this.organizationEntity.province,
                        area: this.organizationEntity.area,
                        city: this.organizationEntity.city,
                        county:this.organizationEntity.county,
                        detail:this.organizationEntity.detail,
                        disabled:true
                    }
                }
            }

            let isArea = _this.$refs.area.submit();

            _this.$refs[name].validate((valid) => {
                if (valid) {
                    isFormPass = true;
                } else {
                    isFormPass = false;
                }
            })

            if(!isFormPass || !isArea){
                return false;
            }
            console.log("success!!!");
            console.log(!_this.topOrganInfo);

            if(((!_this.organizationEntity.id && _this.organizationEntity.level === 1) ||
                (_this.organizationEntity.id && _this.organizationEntity.level === 1 &&
                 _this.organizationEntity.isRootOrgan === 2)) && _this.topOrganInfo){
                _this.$Modal.warning({
                    title:"提示信息",
                    content:"该服务器下已有最高层级组织，请添加下属层级!"
                });
                return false;
            }

            let equityInfoArr = _this.organizationEntity.equityInfoEntities;
            if(equityInfoArr.length > 0){
                let num = 0;
                equityInfoArr.forEach(p =>{
                    num += Number(p.outScale);
                });
                if(num > 100 || num < 100){
                    _this.$Modal.warning({
                        title:"提示信息",
                        content:"【出资比例】之和必须等于100%!"
                    });
                    return false;
                }
            }


            if(_this.checkOrganNumResult.mark){
                _this.$Modal.warning({
                    title: "提示信息",
                    content: _this.checkOrganNumResult.msg
                });
                return false;
            }

            if(_this.organizationEntity.id){
                console.log("修改");
                _this.saveHandler(_this.organizationEntity);
            }else{

                if(_this.organizationEntity.level === 1){
                    _this.organizationEntity.isRootOrgan = 1;
                }else{
                    _this.organizationEntity.isRootOrgan = 2;
                }

                _this.saveHandler(_this.organizationEntity);
            }
        },
        checkOrganNum(organType){

            let _this = this;


            $.ajax({
                url: contextPath + '/organizationController/countOrganNumber?organType='+organType,
                type: 'post',
                dataType: "json",
                contentType: "application/json",
                success: function (res) {
                    if(res.code === '100100'){
                        if(res.data){
                            _this.checkOrganNumResult.mark = true;
                            _this.checkOrganNumResult.msg = res.data;
                        }else{
                            _this.checkOrganNumResult = Object.assign({},{mark:'',msg:''});
                        }
                    }
                },
                error: function () {
                    _this.$Modal.warning({title:"提示信息",content:"系统错误!"});
                }
            })
        },
        checkLevel(){

            let _this = this;

            $.ajax({
                url: contextPath + '/organizationController/getCurrentTopOrgan',
                type: 'post',
                dataType: "json",
                contentType: "application/json",
                success: function (res) {
                    if(res.code === '100100'){
                        _this.topOrganInfo = res.data;
                    }else{
                        _this.$Modal.warning({
                            title:"提示信息",
                            content:"系统错误!"
                        });
                    }
                },
                error: function () {
                    _this.$Modal.warning({title:"提示信息",content:"系统错误!"});
                }
            })
        },
        handlerSelectOrg(e, index){// e 选中对象，index 对应的行数
            console.log(e, index);
            let _this = this;
            let selectedData = e.selected;

            if(e.nowORg){
                _this.organizationEntity.equityInfoEntities[index].shareOrganId = -1;
                _this.organizationEntity.equityInfoEntities[index].shareOrganName = "本组织";
            }

            if(selectedData.length === 1){
                _this.organizationEntity.equityInfoEntities[index].shareOrganId = selectedData[0].id;
                _this.organizationEntity.equityInfoEntities[index].shareOrganCode = selectedData[0].orgCode;
                _this.organizationEntity.equityInfoEntities[index].shareOrganName = selectedData[0].orgName;
            }
        },
        saveHandler(organizationEntity){
            let _this = this;

            let url = "";
            let successMsg = "";
            if(_this.organizationEntity.id){
                url = contextPath+'/organizationController/updateInfo';
                successMsg = "修改";
            }else{
                url = contextPath+'/organizationController/saveInfo';
                successMsg = "保存";
            }

            $.ajax({
                url: url,
                type: 'post',
                data: JSON.stringify(_this.organizationEntity),
                dataType: "json",
                contentType: "application/json",
                async:false,
                success: function (res) {
                    _this.htHaveChange = false;
                    if(res.code === '100100'){
                        window.top.home.loading('hide');
                        _this.$Modal.success({title:"提示信息",content:successMsg+"成功"});
                        console.log(res);
                        _this.organizationEntity = res.data;
                        _this.organizationEntity.orgStatus = _this.organizationEntity.orgStatus + "";
                        _this.organTime = _this.organizationEntity.createTime;
                        if(_this.organizationEntity.equityInfoEntities.length > 0){
                            _this.organizationEntity.equityInfoEntities.forEach(p =>{
                                if(p.organId === p.shareOrganId){
                                    p.shareOrganName = '本组织';
                                    p.shareOrganId = -1;
                                }
                            })
                        }
                        //回显省市区
                        if (res.data.province) {
                            _this.areaInit = {
                                isInit: true,
                                province: res.data.province,
                                area:res.data.area,
                                city: res.data.city,
                                county: res.data.county,
                                detail: res.data.detail,
                                disabled: false,
                            }
                        } else {
                            _this.areaInit = {
                                isInit: true,
                                province: '',
                                area:'',
                                city: '',
                                county: '',
                                detail: '',
                                disabled: false,
                            }
                        }
                        return false;
                    }
                    _this.$Modal.warning({title:"提示信息",content:successMsg+"失败"});
                },
                error: function () {
                    _this.$Modal.warning({title:"提示信息",content:"系统错误!"});
                }
            })
        },
        getOrganizationInfo(){
            let _this = this;
            $.ajax({
                url: contextPath + '/organizationController/getOrganInfo',
                type: 'post',
                data: JSON.stringify(_this.organizationEntity),
                dataType: "json",
                contentType: "application/json",
                success: function (res) {
                    if(res.code === '100100'){
                        console.log(res);
                        _this.organizationEntity = res.data;
                        _this.organizationEntity.orgStatus = _this.organizationEntity.orgStatus + "";
                        _this.organTime = _this.organizationEntity.createTime;

                        _this.equityInfo = _this.organizationEntity.equityInfoEntities;

                        if(_this.organizationEntity.equityInfoEntities.length > 0){
                            _this.organizationEntity.equityInfoEntities.forEach(p =>{
                                if(p.organId === p.shareOrganId){
                                    p.shareOrganName = '本组织';
                                    p.shareOrganId = -1;
                                }
                            })
                        }

                        //回显省市区
                        if (res.data.province) {
                            _this.areaInit = {
                                isInit: true,
                                province: res.data.province,
                                area:res.data.area,
                                city: res.data.city,
                                county: res.data.county,
                                detail: res.data.detail,
                                disabled: false,
                            }
                        } else {
                            _this.areaInit = {
                                isInit: true,
                                province: '',
                                city: '',
                                county: '',
                                detail: '',
                                disabled: false,
                            }
                        }

                        /*let equityInfoArr = _this.organizationEntity.equityInfoEntities;

                        if(equityInfoArr.length > 0){
                            equityInfoArr.forEach((item,index) =>{
                                console.log('equityOrganTree'+index);
                                let treeObj = $.fn.zTree.getZTreeObj('equityOrganTree'+index);
                                console.log(treeObj)
                                let node = treeObj.getNodeByParam("id", item.id, null);
                                console.log(node);
                                //treeObj.selectNode(node);
                            });
                        }*/

                    }

                },
                error: function () {
                    _this.$Modal.warning({title:"提示信息",content:"系统错误!"});
                }
            })
        },
        //    新增页面的退出
        // exit(){
        //     window.parent.closeCurrentTab({name:'区域组织-新增',openTime:this.openTime,exit: true})
        // },
        sideHandleSuccess(result) {
            if (result.code === "100100") {
                console.log(result);
                console.log(result.data);
                //this.$set(this.organizationEntity,'businessLicenseUrl', result.data.fdUrl);
                this.organizationEntity.businessLicenseUrl = result.data.fdUrl;
            }else{
                this.$Modal.info({
                    title: "提示信息",
                    content: result.msg
                });
            }
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
        //点击单行复选框，获取该行数据保存到数组lotData中
        getData(index) {

            if (this.checkindex.indexOf(index) > -1) {
                let i = this.checkindex.indexOf(index);
                this.checkindex.splice(i, 1);
                this.lotData.splice(i, 1);
            } else {
                this.checkindex.push(index);
                this.lotData.push(this.organizationEntity.equityInfoEntities[index]);
            }

            if (this.checkindex.length === this.organizationEntity.equityInfoEntities.length) {
                this.isCheckedAll = true;
            } else {
                this.isCheckedAll = false;
            }
        },
        //新增行
        rowClick(){

            //this.frameTab = true;
            let addRowData = Object.assign({},{
                id:'',
                organId:'',
                organCode:'',
                shareOrganId:'',
                shareOrganCode:'',
                shareOrganName:'',
                outScale:'',
                isDel:1,
                checkbox: false
            });
            this.organizationEntity.equityInfoEntities.push(addRowData);
            this.htTestChange()
        },
        //删除行
        deleteRow(){

            if (this.lotData.length < 1) {
                this.$Modal.info({
                    title: '提示信息',
                    content: '请先选择一条数据!'
                });
            } else {
                this.$Modal.confirm({
                    title: '提示信息',
                    content: '是否要删除这些记录？',
                    onOk: () => {
                        let indexArray = this.checkindex;
                        indexArray.sort();
                        for (let k = indexArray.length - 1; k >= 0; k--) {
                            if(this.organizationEntity.equityInfoEntities[indexArray[k]].id){
                                this.organizationEntity.equityInfoEntities[indexArray[k]].isDel = 0;
                            }else{
                                this.organizationEntity.equityInfoEntities.splice(indexArray[k], 1);
                            }
                        }
                        this.checkindex = [];
                        this.lotData = [];
                    },
                    onCancel: () => {
                        console.log('点击了取消');
                    }
                })
            }
            this.htTestChange()
        },
        //组织点击确定
        organizationClick(){
            this.isShowOrganization = false;
        },
        showOrganization(){
            this.isShowOrganization = true;
        },
        //所属上级组织弹框点击确定
        ParentIdClick(){

            this.isShowParentId = false;
            let treeObj = $.fn.zTree.getZTreeObj("tree-demo"),
                nodes = treeObj.getSelectedNodes();

            this.organizationEntity.parentId = nodes[0].id;
            this.organizationEntity.parentName = nodes[0].orgName;

            console.log(nodes);
        },
        showParentId(){
            if(this.isDisabled){
                this.isShowParentId = false;
            }else {
                this.isShowParentId = true;
            }
            let treeObj = $.fn.zTree.getZTreeObj("tree-demo"),
                node = treeObj.getNodeByParam("id",this.organizationEntity.parentId,null);
            console.log(node);
            treeObj.selectNode(node);
            treeObj.expandAll(true);
        },
        getLocalIp(){
            let _this = this;
            $.ajax({
                url: contextPath + '/organizationController/getLocalIp',
                type: 'post',
                dataType: "json",
                contentType: "application/json",
                success: function (res) {
                    if(res.code === '100100'){
                        _this.ipAddress = res.data;
                    }else {
                        _this.$Modal.warning({title:"提示信息",content:"获取IP地址失败!"});
                    }
                },
                error: function () {
                    _this.$Modal.warning({title:"提示信息",content:"系统错误!"});
                }
            })
        },
        getLocalServerInfo(){
            let _this = this;
            $.ajax({
                type: "POST",
                url: contextPath + '/organizationController/getLocalServerInfo',
                dataType: "JSON",
                contentType: "application/json",
                success: function (result) {
                    console.log(result.data);
                    if(result.code === '100100'){
                        console.log(result.data);
                        if(result.data && result.data.serverLevel !== 1){
                            _this.selectOrganizationType = _this.selectOrganizationType
                                .filter(p => p.value !== 1);
                        }
                    }
                },
                error: function () {
                    _this.$Modal.warning({title:"提示信息",content:"系统错误!"});
                }
            })
        },
        //关闭
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
                this.save('formValidate');
                this.exit(true);
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
            console.log(333)
        },
        checkNumber(e,index){
            let re= /^\d\.([1-9]{1,2}|[0-9][1-9])$|^[1-9]\d{0,1}(\.\d{1,2}){0,1}$|^100(\.0{1,2}){0,1}$/;
            if(!re.test(e.target.value)){
                if(index !== -1){
                    this.organizationEntity.equityInfoEntities[index].outScale = '';
                }else{
                    this.organizationEntity.taxRate = '';
                }
            }
        }

    },
    created(){
        window.handlerClose = this.handlerClose;
        let $param = window.parent.params;
        this.params = $param;
        this.openTime = $param.openTime;
        this.organTreeSetting = {
            check: {
                enable: false
            },
            data:{
                simpleData:{
                    enable: true,
                        idKey: "id",
                        pIdKey: "parentId",
                        rootPId: 0
                },
                key:{
                    name:"orgName"
                }
            }
        };

    },
    mounted(){
        if(!$.isEmptyObject(this.params)){
            if(this.params.params.type === 'add'){

            }else if(this.params.params.type === 'update'){
                this.organizationEntity.id = this.params.params.data;
                this.getOrganizationInfo();
            }
        }

        this.getLocalIp();
        this.getLocalServerInfo();
        this.checkLevel();

    },
    watch:{
        "organizationEntity.level":function () {
            console.log(this.organizationEntity.level);
            if((this.organizationEntity.id && this.organizationEntity.level === 1 &&
                this.organizationEntity.isRootOrgan === 1)){
                this.levelDisabled = true;
            }else{
                this.levelDisabled = false;
            }
            if(this.organizationEntity.level === 1){
                this.isDisabled = true;
                this.ruleValidate.parentId[0].required = false;
                this.organizationEntity.parentId = '';
                this.organizationEntity.parentName = '';
            }else {
                this.isDisabled = false;
                this.ruleValidate.parentId[0].required = true;
            }

        },
        "organizationEntity.organType":function () {
            this.checkOrganNum(this.organizationEntity.organType);
            if(this.organizationEntity.organType === 4 || this.organizationEntity.organType === 5){
                this.isShowNature = true;
                this.ruleValidate.nature[0].required = true;
            }else {
                this.isShowNature = false;
                this.ruleValidate.nature[0].required = false;
                this.organizationEntity.nature = '';
            }
        }

    }
})