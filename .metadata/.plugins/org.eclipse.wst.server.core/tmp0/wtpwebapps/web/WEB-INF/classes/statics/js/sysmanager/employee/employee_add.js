var vm = new Vue({
    el: "#app",
    data: {
        htHaveChange:false,
        isCheckedAll: false,
        selectedIndex:null,
        isAdd: false,
        ruleValidate: {
            empName:[
                {required:true}
            ],
            deptName:[
                {required:true}
            ],
            entryDate:[
                {required:true}
            ]
        },
        reload: false,
        selected: [],
        isSearchHide: true,
        isTabulationHide: true,
        showDepartment: false,
        //是否显示新增奖惩记录的弹框
        frameTab: false,
        //新增奖惩记录弹框的对象
        rewardsOrPunishmentRecord: {
            result: "",
            content: "",
            status: "",
            rpDate: "",
            checked:false
        },
        area: {},
        areaInit:{
            isInit:false,
            province:'',
            area:'',
            city:'',
            county:'',
            detail:'',
            disabled:false
        },
        selectStatus: [
            {
                value: 1,
                label: "奖励"
            },
            {
                value: 0,
                label: "惩罚"
            }
        ],
        selectSex: [
            {
                value: 0,
                label: "男"
            },
            {
                value: 1,
                label: "女"
            }
        ],
        selectMaritalStatus: [
            {
                value: 0,
                label: "未婚"
            },
            {
                value: 1,
                label: "已婚"
            },
        ],
        selectJobNature: [
            {
                value: 0,
                label: "兼职"
            },
            {
                value: 1,
                label: "全职"
            },
        ],
        selectEmpStatus: [
            {
                value: 1,
                label: "在职"
            },
            {
                value: 0,
                label: "已离职"
            },

        ],
        selectIsSecrecyAgreement: [
            {
                value: 1,
                label: "是"
            },
            {
                value: 0,
                label: "否"
            }
        ],
        selectIsTrustAgreement: [
            {
                value: 1,
                label: "是"
            },
            {
                value: 0,
                label: "否"
            },
        ],
        selectEducation: [],
        selectStation: [],
        selectRank: [],
        selectStationLevel: [],
        openTime: '',
        params: {},
        body: {
            empStatus:1,
            pictureUrl: '',
            sysEmployeeRprecordEntityList: [],
            sysEmployeeChangeEntityList: [],
        },
    },
    methods: {
        // 校验联系人手机号码
        checkPhone() {
            let phone = this.body.phone;
            if (!phone) {
                return;
            }
            var reg = /^[1][3,4,5,7,8][0-9]{9}$/;
            if (!reg.test(phone)) {
                this.$Modal.info({
                    title: "提示",
                    okText: "确定",
                    content: "格式不正确,请重新输入!"
                });
                this.body.phone = "";
            }
        },
        // 校验紧急联系人手机号码
        checkEmergencyPhone() {
            let phone = this.body.emergencyTelephone;
            if (!phone) {
                return;
            }
            var reg = /^[1][3,4,5,7,8][0-9]{9}$/;
            if (!reg.test(phone)) {
                this.$Modal.info({
                    title: "提示",
                    okText: "确定",
                    content: "格式不正确,请重新输入!"
                });
                this.body.emergencyTelephone = "";
            }
        },
        // 校验邮箱有效性
        checkEmail() {
            let email = this.body.mailbox;
            if (!email) {
                return;
            }
            var reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
            if (!reg.test(email)) {
                this.$Modal.info({
                    title: "提示",
                    okText: "确定",
                    content: "格式不正确,请重新输入!"
                });
                this.body.mailbox = "";
            }
        },
        //验证身份证号码是否正确
        checkIdCard(){
            let idCard = this.body.idCard;
            let reg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
            if (!reg.test(idCard)) {
                this.$Modal.info({
                    title: "提示",
                    okText: "确定",
                    content: "格式不正确,请重新输入!"
                });
                this.body.idCard = "";
            }
        },
        // 附件是编辑还是查看 传入Y表示编辑，传入N表示查看,页面初始化的时候就需要调用这个方法
        isEdit: function (isEdit) {
            eventHub.$emit('isEdit', isEdit);
        },
        // 保存附件 保存的时候调用
        saveAccess: function (id, type) {
            eventHub.$emit('saveFile', id, type);
        },
        // 查找附件 查看的时候调用
        getAccess: function (id, type) {
            eventHub.$emit('queryFile', id, type);
        },

        //学历
        getEducation() {
            this.selectEducation = getCodeList("sys_education");
        },

        //岗位
        getStation() {
            this.selectStation = getCodeList("sys_station");
        },

        //岗位等级
        getStationLevel() {
            this.selectStationLevel = getCodeList("sys_station_level");
        },

        //职级
        getRank() {
            this.selectRank = getCodeList("sys_rank");
        },

        //保存人员
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
                  this.$Modal.info({
                      content: "数据有误，请认真填写",
                      title: "提示信息"
                  })
                  return false;
              }

            let This = this

            Object.assign(This.body,This.area)
            $.ajax({
                type: "POST",
                url: contextPath + "/employee/save",
                contentType: 'application/json',
                data: JSON.stringify(This.body),
                dataType: "json",
                async:false,
                success: function (data) {
                    window.top.home.loading('hide');
                    This.htHaveChange = false;
                    if (data.code == "100100") {
                        This.$Modal.success({
                            content: "保存成功",
                            title: "提示信息"
                        })
                        This.body = data.data
                        This.saveAccess(This.body.id, 'T_SYS_EMPLOYEE');

                        //格式化日期
                        if (This.body.sysEmployeeRprecordEntityList && This.body.sysEmployeeRprecordEntityList.length > 0) {
                            for (var i = 0; i < This.body.sysEmployeeRprecordEntityList.length; i++) {
                                This.body.sysEmployeeRprecordEntityList[i].rpDate =
                                    new Date(This.body.sysEmployeeRprecordEntityList[i].rpDate).format("yyyy-MM-dd");
                            }
                        }
                    } else {
                        This.$Modal.info({
                            content: "系统异常，请联系相关管理员",
                            title: "提示信息"
                        })
                    }
                }
            })
        },

        //部门树的显示隐藏
        showDepartmentTree(value) {
            // console.log(value,111)
            //condolr.log(value,11111)
            if (this.showDepartment === true) {
                this.showDepartment = false;
                return;
            }
            this.showDepartment = value;
        },

        //回调函数
        treeClickCallBack(event, treeId, treeNode) {
            this.body.deptId = treeNode.id;
            this.body.deptName = treeNode.name;
            console.log(this.body.deptId, this.body.deptName)
            this.showDepartment = false;
        },

        treeBeforeClick(treeId, treeNode, clickFlag) {
            console.log(treeNode.isParent,treeNode,clickFlag)
            return !treeNode.isParent && treeNode.depGroupStatus != 0; //当单击父节点，返回false，不让选取
        },

        sideHandleSuccess(result) {
            console.log(result)
            this.body.pictureUrl = result.data.fdUrl;
            this.htTestChange()
            if (result.code === "100100") {
                //this.commodity.sidePic = result.data;

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
        //奖惩记录新增行
        rowClick() {
            this.rewardsOrPunishmentRecord = {
                result: "",
                content: "",
                nature: "",
                createTime: (new Date()).format("yyyy-MM-dd"),
                createName: layui.data('user').username,
                createId: layui.data('user').id,
                checked:false
            }
            this.frameTab = true;
            this.htTestChange()
        },
        //新增奖惩记录弹框点击取消的方法
        addRecordCancel() {
            this.frameTab = false;
        },
        //新增奖惩记录弹框点击确定的方法
        addRecordDone() {
            this.body.sysEmployeeRprecordEntityList.push({...this.rewardsOrPunishmentRecord})
            this.frameTab = false;
        },
        checkItem(index){
            var selectContants = this.body.sysEmployeeRprecordEntityList[index];
            if (!selectContants.checked) {
                selectContants.checked = true;
            } else {
                selectContants.checked = false;
            }
            this.checkIsAllSelected();
        },
        //奖惩记录删除行
        deleteRow(){
            var This = this;
            var arr = [];
            This.body.sysEmployeeRprecordEntityList.forEach(function (val, index) {
                if (val.checked == undefined || val.checked == false) {
                    arr.push(val);
                }
            });
            This.body.sysEmployeeRprecordEntityList = arr;
            this.checkIsAllSelected();
            this.htTestChange()
        },
        checkIsAllSelected(){
            let flag = true;
            let arr = this.body.sysEmployeeRprecordEntityList;
            if(arr.length){
                arr.forEach((el, i) => {
                    if(!el.checked){
                        flag = false;
                    }
                });
            }else{
                flag = false;
            }
            this.isCheckedAll =flag;
        },
        checkAllValues() {
            if (!this.isCheckedAll) {
                this.body.sysEmployeeRprecordEntityList.forEach((el, i) => {
                    el.checked = true;
                })
            } else {
                this.body.sysEmployeeRprecordEntityList.forEach((el, i) => {
                    el.checked = false;
                })
            }
        },
        //数据回显
        findEmpInfo() {
            let This = this;

            let obj = This.params;
            delete obj["activeType"];

            $.ajax({
                type: "POST",
                url: contextPath + "/employee/findEmpInfo",
                contentType: 'application/json',
                data: JSON.stringify(obj),
                dataType: "json",
                success: function (data) {
                    if (data.code == "100100") {
                        This.body = data.data;

                        This.getAccess(This.body.id, 'T_SYS_EMPLOYEE');
                        if (This.body.province) {
                            This.areaInit = {
                                isInit: true,
                                province: This.body.province,
                                city: This.body.city,
                                area: This.body.area,
                                county: This.body.county,
                                detail: This.body.detail,
                                concreteAddress: This.body.concreteAddress,
                                disabled: false
                            };
                        }
                        //格式化日期
                        if (This.body.sysEmployeeRprecordEntityList && This.body.sysEmployeeRprecordEntityList.length > 0) {
                            for (var i = 0; i < This.body.sysEmployeeRprecordEntityList.length; i++) {
                                This.body.sysEmployeeRprecordEntityList[i].rpDate =
                                    new Date(This.body.sysEmployeeRprecordEntityList[i].rpDate).format("yyyy-MM-dd");
                            }
                        }
                    } else {
                        This.$Modal.info({
                            content: data.msg,
                            title: "提示信息"
                        })
                    }

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
        },
    },

    created() {
        this.treetSetting = {
            callback: {
                onClick: this.treeClickCallBack,
                beforeClick: this.treeBeforeClick
            }
        };
        this.isEdit('Y');
        // window.handlerClose = this.handlerClose;
        this.openTime = window.parent.params.openTime;
        this.params = window.parent.params.params;
        this.getEducation();
        this.getStation();
        this.getStationLevel();
        this.getRank();

        if (this.params.activeType === 'update') {
            this.findEmpInfo();
        } else if (this.params.activeType === 'check') {
            this.findEmpInfo();
        }
    },

})