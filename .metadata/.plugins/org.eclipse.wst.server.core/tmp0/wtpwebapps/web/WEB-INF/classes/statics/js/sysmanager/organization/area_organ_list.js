var vm = new Vue({
    el: "#app",
    data: {
        openTime:"",
        isAdd: false,
        isEdit: false,
        reload: false,
        selected:[],
        isOperatorServer: true,
        isSearchHide: true,
        isTabulationHide: true,
        //是否显示占股组织弹框
        isShowOrganization:false,
        //获取点击到的id
        clickId: "",
        //获取点击到的name
        clickName: "",
        // 获取点击的父id
        clickParentId:"",
        clickParentName:"",
        treeNameInfo: "",
        //是否是父节点  ---- true代表是
        treeFlag: false,
        setting: {

        },
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
            }
        ],
        selectArea:[
            {
                value:"1",
                label:"东北区"
            },
            {
                value:"2",
                label:"华北区"
            },
            {
                value:"3",
                label:"华中区"
            },
            {
                value:"4",
                label:"华东区"
            },
            {
                value:"5",
                label:"华南区"
            },
            {
                value:"6",
                label:"西北区"
            },
            {
                value:"7",
                label:"西南区"
            }
        ],
        organizationEntity: {
            organType:"",
            orgName:"",
            abbreviation:"",
            nature:"",
            area:"",
            sourceMark: 2
        },
        ipAddress: '',
        ktcIp:'192.168.50.183',
        serverInfo:'',
        data_config: {
            url: contextPath + '/organizationController/queryAllOrg',
            datatype:"json",
            colNames: ['组织代码', '组织名称','组织简称','状态', '所属区域', '地址', '组织类型',"性质","税率(%)"],
            colModel:[
                {name: "orgCode", width: 210, align: "left"},
                {name: "orgName", width: 210, align: "left"},
                {name: "abbreviation", width: 210, align: "left"},
                {name: "orgStatus", width: 210, align: "left"},
                {name: "area", align: "left", width: 210},
                {name: "concreteAddress", align: "left", width: 210},
                {name: "organType", align: "left", width: 210},
                {name: "nature", align: ";left", width: 210},
                {name:"taxRate",align: ";left", width: 210}
            ],
            rowNum : 5,//一页显示多少条
            rowList : [ 10, 20, 30 ],//可供用户选择一页显示多少条
            mtype : "post",//向后台请求数据的ajax的类型。可选post,get
            viewrecords : true
        }
    },
    methods: {
        clear() {
            this.organizationEntity.orgName = "";
            this.organizationEntity.abbreviation = "";
            this.organizationEntity.sourceMark = 2;
            if(this.organizationEntity.organType){
                this.$refs.organType.reset();
                this.$nextTick(() => {
                    this.organizationEntity.organType = "";

                })
            }
            if(this.organizationEntity.nature){
                this.$refs.nature.reset();
                this.$nextTick(() => {
                    this.organizationEntity.nature = "";

                })
            }
            if(this.organizationEntity.area){
                this.$refs.area.reset();
                this.$nextTick(() => {
                    this.organizationEntity.area = "";

                })
            }
        },
        clearData(val){
            if(val === 'area'){
                if(this.organizationEntity.area){
                    this.$refs.area.reset();
                    this.$nextTick(() => {
                        this.organizationEntity.area = "";

                    })
                }
            }
            if(val === 'nature'){
                if(this.organizationEntity.nature){
                    this.$refs.nature.reset();
                    this.$nextTick(() => {
                        this.organizationEntity.nature = "";

                    })
                }
            }
            if(val === 'organType'){
                if(this.organizationEntity.organType){
                    this.$refs.organType.reset();
                    this.$nextTick(() => {
                        this.organizationEntity.organType = "";

                    })
                }
            }
        },
        search(){
            this.product();
        },
        refresh(){
            this.clickId = "";
            this.clickParentId = "";
            this.treeNameInfo = "";
            this.treeFlag = false;
            this.product();
        },
        //新增
        add(){
            window.parent.activeEvent({name: '区域组织-新增', url: contextPath+'/sysmanager/organization/area_organ_info.html',params: {type:'add'}});
        },
        update(){
            let _this = this;

            console.log(_this.treeNameInfo,_this.clickId);

            //判断是否选择选择数据
            if (!_this.clickId) {
                _this.$Modal.info({
                    content: "请选择一条数据进行修改!"
                })
                return false;
            }

            window.parent.activeEvent({name: '区域组织-新增', url: contextPath+'/sysmanager/organization/area_organ_info.html',params: {type:'update',data:_this.clickId}});
        },
        exit(){
            window.parent.closeCurrentTab({name:'区域组织-列表',exit: true, openTime:this.openTime});
        },
        del_click() {
            let _this = this;
            //判断是否选择选择数据
            if (!_this.clickId) {
                _this.$Modal.info({
                    content: "请选中需要删除的行!"
                })
                return false;
            }

            //判断是否选中的是父节点
            if (_this.treeFlag) {
                _this.$Modal.info({
                    content: "不可删除父节点!"
                })
                return false;
            }

            _this.$Modal.confirm({
                title: '提示信息',
                content: '是否删除该条信息？',
                onOk: () => {
                    _this.deleteHandler(_this.clickId);
                },
                onCancel: () => {
                    console.log("点击了取消");
                }
            });
        },
        deleteHandler(id){
            let _this = this;
            $.ajax({
                type: "POST",
                url: contextPath + '/organizationController/update',
                data: JSON.stringify({"id":id,"isDel":0}),
                dataType: "JSON",
                contentType: "application/json",
                success: function (result) {
                    if (result.code === "100100") {
                        setTimeout(() => {
                            _this.$Modal.success({
                                content: '删除成功',
                                onOk: function () {
                                    _this.refresh();
                                }
                            })
                        }, 300);
                    } else {
                        setTimeout(() => {
                            _this.$Modal.warning({
                                content: '删除失败!',
                                onOk: function () {
                                    _this.refresh();
                                }
                            })
                        }, 300);
                    }
                },
                error: function (err) {
                    console.log("服务器出错");
                }
            });
        },
        organizationClick(){
            this.isShowOrganization = false;
        },
        showOrganization(){
            this.isShowOrganization = true;
        },
        zTreeOnClick(...rest) {
            let info = rest[2]


            var treeObj = $.fn.zTree.getZTreeObj("dataTree");
            var nodes = treeObj.getSelectedNodes();

            //判断选中的是否为目录
            //若为目录flag = true
            if (nodes.length > 0) {
                this.treeFlag = nodes[0].isParent;
            }
            //获取到点击的ID
            this.clickId = info.id;
            this.clickName = info.name;
            let parentNode = treeObj.getNodeByParam("id", info.parentId, null);
            if(parentNode){
                this.clickParentId = parentNode.id;
                this.clickParentName = parentNode.name;
            }else{
                this.clickParentId = "";
                this.clickParentName = "";
            }

        },
        addDiyDom(treeId, treeNode) {
            var spaceWidth = 20;
            var liObj = $("#" + treeNode.tId);
            var aObj = $("#" + treeNode.tId + "_a");
            var switchObj = $("#" + treeNode.tId + "_switch");
            var icoObj = $("#" + treeNode.tId + "_ico");
            var spanObj = $("#" + treeNode.tId + "_span");
            aObj.attr('title', '');
            aObj.removeAttr('href');
            aObj.append('<div class="divTd swich fnt" style="width:20%"></div>');
            var div = $(liObj).find('div').eq(0);
            //从默认的位置移除
            switchObj.remove();
            spanObj.remove();
            icoObj.remove();
            //在指定的div中添加
            div.append(switchObj);
            div.append(spanObj);
            //隐藏了层次的span
            var spaceStr = "<span style='height:1px;display: inline-block;width:" + (spaceWidth * treeNode.level) + "px'></span>";
            switchObj.before(spaceStr);
            //图标垂直居中
            icoObj.css("margin-top", "9px");
            switchObj.after(icoObj);
            var editStr = '';
            //宽度需要和表头保持一致
            /*editStr += '<div class="divTd" style="width:5%">' + (treeNode.id == undefined ? "" : treeNode.id) + '</div>';*/
            editStr += '<div class="divTd" style="width:10%">' + (treeNode.orgCode == undefined ? "" : treeNode.orgCode) + '</div>';
            editStr += '<div class="divTd" style="width:10%">' + (treeNode.orgName == undefined ? "" : treeNode.orgName) + '</div>';
            editStr += '<div class="divTd" style="width:10%">' + (treeNode.abbreviation == undefined ? "" : treeNode.abbreviation) + '</div>';
            editStr += '<div class="divTd" style="width:10%">' + (treeNode.orgStatus == 0 ? "失效" : "有效") + '</div>';
            editStr += '<div class="divTd" style="width:10%">' + (this.getAreaName(treeNode.area)) + '</div>';
            editStr += '<div class="divTd" style="width:30%">' + (treeNode.concreteAddress == undefined ? "" : treeNode.concreteAddress) + '</div>';
            editStr += '<div class="divTd" style="width:10%">' + (treeNode.organType == 1 ? "总平台" : treeNode.organType == 2 ? "总公司" : treeNode.organType == 3 ?
            "分公司" : treeNode.organType == 4 ? "子公司" : treeNode.organType == 5 ? "门店" : "") + '</div>';
            editStr += '<div class="divTd" style="width:10%">' + (treeNode.nature == 1 ? "挂牌" : treeNode.nature == 2 ? "联营" : treeNode.nature == 3 ?
                "加盟" : treeNode.nature == 4 ? "自营": "") + '</div>';
            editStr += '<div class="divTd" style="width:10%">' + (treeNode.taxRate == undefined ? "" : treeNode.taxRate) + '</div>';
            aObj.append(editStr);
        },
        getAreaName(value){
            switch (value){
                case '1':return '东北';break;
                case '2':return '华北';break;
                case '3':return '华中';break;
                case '4':return '华东';break;
                case '5':return '华南';break;
                case '6':return '西北';break;
                case '7':return '西南';break;
                default:return '';
            }
        },

        //初始化列表
        queryHandler(zTreeNodes) {
            //初始化树
            $.fn.zTree.init($("#dataTree"), this.setting, zTreeNodes);
            //添加表头
            var li_head = ' <li class="head"><span style="background: #E8EFF5;"><div class="divTd" style="width:20%">层级结构</div><div class="divTd" style="width:10%">组织代码</div>' +
                '<div class="divTd" style="width:10%">组织名称</div><div class="divTd" style="width:10%">组织简称</div><div class="divTd" style="width:10%">状态</div>' +
                '<div class="divTd" style="width:10%">所属区域</div><div class="divTd" style="width:30%">地址</div><div class="divTd" style="width:10%;background: #E8EFF5;"">组织类型</div><div class="divTd" style="width:10%;background: #E8EFF5;"">性质</div><div class="divTd" style="width:10%;background: #E8EFF5;">税率</div></span></li>';
            var rows = $("#dataTree").find('li');
            if (rows.length > 0) {
                rows.eq(0).before(li_head);
            } else {
                $("#dataTree").append(li_head);
                $("#dataTree").append('<li ><div style="text-align: center;line-height: 30px;" >无符合条件数据</div></li>')
            }
        },
        product() {
            let that = this;

            $.ajax({
                url: contextPath + '/organizationController/queryListByBean',
                type: 'post',
                data: JSON.stringify(that.organizationEntity),
                dataType: "json",
                contentType: "application/json",
                success: function (res) {

                    let dataInfo = res.data;

                    that.queryHandler(dataInfo);
                },
                error: function () {
                    that.$Modal.warning({title:"提示信息",content:"系统错误!"});
                }
            })
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
            let currentServerInfo = '';
            $.ajax({
                type: "POST",
                url: contextPath + '/organizationController/getLocalServerInfo',
                dataType: "JSON",
                contentType: "application/json",
                success: function (result) {
                    console.log(result.data);
                    if(result.code === '100100'){
                        console.log(result.data);
                        currentServerInfo = result.data;
                        if(result.data && result.data.serverType === 3){
                            _this.isOperatorServer = false;
                        }
                        if(result.data && result.data.serverLevel !== 1){
                            _this.selectOrganizationType = _this.selectOrganizationType
                                .filter(p => p.value !== 1);
                        }else{
                            _this.organizationEntity.sourceMark = '';
                        }
                    }
                },
                error: function () {
                    _this.$Modal.warning({title:"提示信息",content:"系统错误!"});
                }
            })
            return currentServerInfo;
        }
    },
    created(){
        this.setting = {
            view: {
                showLine: false,
                addDiyDom: this.addDiyDom,
            },
            data: {
                simpleData: {
                    enable: true,
                    idKey: "id",
                    pIdKey: "parentId",
                    rootPId: 0
                },
                key:{
                    name: "orgName"
                }
            },
            callback: {
                onClick: this.zTreeOnClick
            }
        }
    },
    mounted(){
        this.getLocalIp();
        this.getLocalServerInfo();
        this.product();
        this.openTime = window.parent.params.openTime;


    }


})