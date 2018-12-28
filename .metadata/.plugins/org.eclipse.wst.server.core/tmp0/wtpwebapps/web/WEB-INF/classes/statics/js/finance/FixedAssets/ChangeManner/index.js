var ve = new Vue({
    el: '#change-manner',
    data () {
        let This = this;
        return {
            openTime:'',
            writeIsChange: true,
            tid:'zTreeAssetClass',
            inputTreeId:'inputTreeClass',
            sobId:'',
            parentName:'',
            formData: {
                id:'',
                modeName: '',
                voucherGroupId: '',
                modeCode: '',
                parentCode:'',
                parentId: '',
                relativeSubjectId: '',
                relativeSubjectName: '',
                itemRelateDetailEntity:[]
            },
            itemRelateDetailEntity:[],
            selectList:{},
            organizationList: [],
            voucherList:[],
            //收支类型树形
            nodes: [],
            inputNodes:[],
            treeNode:{},
            setting: {
                callback: {
                    onClick: this.clickEvent
                }
            },
            treeSetting: {
                callback: {
                    onClick: this.treeClickCallBack
                }
            },
            isEdit: false,
            editDisabled :false,
            delDisabled : false,
            saveDisabled:false,
            showAssetClass: false,
            subjectVisable: false,
            subjectTpye:'',
            tableList: [],
        }
    },
    methods: {
        test(){
            this.$Message.info("请~~~~");
        },
        // 科目下拉框
        showSubjectVisable (type) {
            this.subjectVisable = true;
            this.subjectTpye = type;
        },
        subjectClose () {
            this.subjectVisable = false;
        },
        subjectData (treeNode) {
            this.formData.relativeSubjectName = treeNode.subjectCode+" "+treeNode.subjectName;
            this.formData.relativeSubjectId = treeNode.id;
            this.getAccountingProject(treeNode.id);  //获取科目核算项目
        },
        treeClickCallBack (event, treeId, treeNode) {
            this.parentName = treeNode.name;
            this.formData.parentId = treeNode.id;
            this.formData.parentCode = treeNode.modeCode;
            this.showAssetClass = false;
        },
        treeBeforeClick (treeId, treeNode, clickFlag) {
            return !treeNode.isParent; //当单击父节点，返回false，不让选取
        },
        showAssetClassTree(value){
            if(this.showAssetClass === true){
                this.showAssetClass = false;
            }else{
                this.showAssetClass = value;
            }
        },
        _nullData (_t) {
            if (_t) {
                return _t;
            } else {
                return '';
            }
        },
        formartMoney(value){
            return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
        },
        modify(type){
            switch(type){
                case 'add':
                    this.writeIsChange = false;
                    this.saveDisabled = false;
                    this.formData.id = '';
                    this.formData.modeCode ='';
                    this.formData.modeName = '';
                    this.formData.relativeSubjectId = '';
                    this.formData.relativeSubjectName ='';
                    this.tableList = [];
                    break;
                case 'edit':
                    this.clickEvent(null,null,this.treeNode);
                    this.writeIsChange = false;
                    this.saveDisabled = false;
                    break;
                default:
                    break;
            }
        },
        confirm (){
          this.$Modal.confirm({
            title: '信息提示',
            content: '是否删除?',
            onOk: () => {
                this.delFun();
             },
            onCancel: () => {

            }
        });
      },
        delFun() {
            let that = this;
            $.ajax({
                type: 'post',
                url: contextPath + "/app/financeFaChangeMode/deleteById",
                data:JSON.stringify(this.formData),
                contentType: 'application/json;charset=utf-8',
                success: function (ret) {
                    console.log(ret,"初始化数据~~~~");
                    if (ret.code == '100100') {
                        that.init();
                    } else {
                        that.$Message.info({
                            content: ret.msg,
                            duration: 5
                        });
                    }
                }
            });
        },
        //点击保存
        saveFun: function () {
            let that = this;
            var regu = "^[ ]+$";
            var re = new RegExp(regu);
            var sobId = that.sobId;
            var modeCode = that.formData.modeCode;
            var modeName = that.formData.modeName;
            if(sobId==''|| typeof sobId =='undefined'|| sobId==null||re.test(sobId)){
                that.$Message.info("所属组织必填！");
                return;
            }
            if(modeCode==''||typeof modeCode=='undefined'|| modeCode == null||re.test(modeCode)){
                that.$Message.info("请填写编码！");
                return;
            }
            if(modeName==''||  typeof modeName =='undefined' || modeName == null||re.test(modeName)){
                that.$Message.info("请填写名称！");
                return;
            }
            that.itemRelateDetailEntity = [];
            if(that.tableList!=null){
                for (var i =0 ;i<that.tableList.length;i++){
                    var _i = {
                        relateType: 6,
                        itemClassId:that.tableList[i].itemClassId,
                        itemId:that.tableList[i].itemId,
                        relateId: 0
                    }
                    that.itemRelateDetailEntity.push(_i);
                }
            }
            that.formData.itemRelateDetailEntity = that.itemRelateDetailEntity;
            $.ajax({
                type: 'post',
                url: contextPath + "/app/financeFaChangeMode/save",
                data:JSON.stringify(this.formData),
                contentType: 'application/json;charset=utf-8',
                success: function (ret) {
                    console.log(ret,"初始化数据~~~~");
                    if (ret.code == '100100') {
                         that.init();
                    } else {
                         that.$Modal.info({
                             title:'信息提示',
                             content:ret.msg
                         });
                    }
                }
            });
        },
        closeWindow(){ window.parent.closeCurrentTab({ name: '变动方式', openTime: this.openTime, exit: true });},
        refreshFun(){
            this.init();
        },
        init() {
            let _vm = this;
            _vm.writeIsChange=true;
            _vm.formData = {};
            _vm.inputNodes = [];
            $.ajax({
                type: 'post',
                url: contextPath + "/app/financeFaChangeMode/initData",
                success: function (ret) {
                    if (ret.code == '100100') {
                        _vm.nodes = ret.data.treeData;
                        var newObject = jQuery.extend(true, _vm.inputNodes , _vm.nodes);
                        newObject.splice(0,0,{id:null,pId:-1,name:'主干'});
                        if(_vm.nodes.length>0){
                            _vm.editDisabled = false;
                            _vm.delDisabled = false;
                        }else{
                            _vm.editDisabled = true;
                            _vm.delDisabled = true;
                        }
                        _vm.organizationList = ret.data.organizationList;
                        _vm.voucherList = ret.data.voucherList;
                        if(_vm.voucherList.length>0){
                            _vm.formData.voucherGroupId =  _vm.voucherList[0].id;
                        }
                        if(_vm.organizationList.length>0){
                            _vm.sobId = ret.data.sobId;
                        }
                    } else {
                        _vm.$Message.info("初始化数据失败！");
                    }
                }
            });
            setTimeout(function(){ _vm.selectNodes(); }, 500);
        },
        getAccountingProject(subjectId){ //获取核算项目
            let that = this;
            $.ajax({
                type: 'post',
                url: contextPath+"/app/financeFaChangeMode/getAccountingProject",
                data: {'subjectId':subjectId},
                success: function (ret) {
                    console.log(ret);
                    that.tableList = ret.data;
                }
            });
        },
        selectNodes(){
            var treeObj = $.fn.zTree.getZTreeObj(this.tid);		    //获取节点
            var nodes = treeObj.getNodes();
            this.tableList = [];
            if (nodes.length>0){
                treeObj.selectNode(nodes[0]);  //默认选中第一个
                this.clickEvent(null,null,nodes[0]);
            }
        },
        clickEvent (event, treeId, treeNode) {
            var modeCode = treeNode.modeCode;
            let that = this;
            that.writeIsChange = true;
            that.saveDisabled = true;
            that.treeNode =treeNode;
            that.formData = {};
            that.parentName = '';
            that.formData.id = treeNode.id;
            that.formData.modeCode = modeCode;
            that.formData.modeName = treeNode.modeName;
            that.formData.voucherGroupId = treeNode.voucherGroupId;
            that.formData.relativeSubjectId = treeNode.subjectId;
            that.formData.relativeSubjectName = treeNode.subjectName;
            var treeObj = $.fn.zTree.getZTreeObj(that.inputTreeId);//ztree树的ID
            var node = treeObj.getNodeByParam("id", treeNode.pId);//根据ID找到该节点
            if(node!=null){
                treeObj.selectNode(node);//根据该节点选中
                that.parentName = node.name;
                that.formData.parentId = node.id;
                that.formData.parentCode =node.modeCode;
            }else{
                treeObj.cancelSelectedNode();
                that.parentName = "";
                that.formData.parentId ="";
                that.formData.parentCode="";
            }
            $.ajax({   //核算项目信息
                type: 'post',
                url: contextPath + "/app/financeFaChangeMode/getInfoBySubjectId",
                data:{subjectId:treeNode.subjectId,relateId:treeNode.id},
                success: function (ret) {
                    if (ret.code == '100100') {
                        that.tableList = ret.data;
                    } else {
                        that.$Message.error(ret.msg);
                    }
                }
            });
            console.log(modeCode,'001或002不允許修改刪除');
            // if(modeCode=='001'||modeCode=='002'){
            //      that.saveDisabled = true;
            //      that.editDisabled = true;
            //      that.delDisabled = true;
            // }else {
            //     that.saveDisabled = false;
            //     that.editDisabled = false;
            //     that.delDisabled = false;
            // }
        },
    },
    //获取会计科目列表
    mounted () {
        this.openTime = window.parent.params && window.parent.params.openTime;
        this.init();
    },
})