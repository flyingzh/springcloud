var ve = new Vue({
    el: '#presentationMaturityFixedAssets', //固定资产到期提示表
    data() {
        let This = this;
        return {
            openTime: '',
            showUseMode: false,
            orgName: '',
            hasVoucher:null,
            accountDateStr: '',
            selectedId: '',
            clearData: {
                clearCodeAndName: '',
                clearOriginalNumber: '',
                clearFee: '',
                clearDate: '',
                clearNumber: '',
                clearSalvageIncome: '',
                clearRemark: '',
                clearAlterTypeId: '',
            },
            formData: {
                accountPeriod: '',
                accountYear: '',
                includeThisPeriodClear: false,
                withAssetTypeId: '',//类别
                withAssetCode: '',//编码
                withUseStateId: '',//使用状态
                withModel: '',//规格(型号)
                withUseDeptId: '',//使用部门
            },
            assetsTypeName: '',//-类别展示
            assetCodeName: '', //-编码展示
            useStateName: '', //-使用状态展示
            modelName: '',//-规格型号展示
            useDepartmentName: '', //-使用部门展示
            showAssetType: false, //过滤-资产类别开关
            showAssetCode: false, //过滤-资产编号开关
            showUseDept: false, //过滤-使用部门开关
            showUseStateType: false, //过滤-使用状态别开关
            cudiId: 'alterTypeId111',
            clearOneShow:false,
            faClearCardParmsVO: {
                id: '',
                sobName: layui.data('user').currentOrgName,
                assetCode: '',
                assetName: '',
                changeType: '',
                clearDate: '',
                alterTypeId: '',
                num: 1,
                clearNum: '',
                clearAmount: '',
                salvageIncome: '',
                accountYear: '',
                accountPeriod: '',
                remark:''
            },
            editIsDisabled: true, // 清理 时 是否可以保存与删除
            saveIsDisabled:false, // 清理 时 是否可以保存
            infoIsDisabled:true, // 清理 时 是否可以查看变动记录
            accountPeriodList: [],
            accountYearList: [],
            modelList: [],
            isEdit: true,
            filterVisible: true,   // 过滤弹窗
            clearVisible: false,    // 清理弹窗
            dataList: [],
            printModal: false,
            printInfo: {},
            changeDateScope: '',
            organizationList: [],
            showAssetsList: false,
            selectAssets: '',
            changeMethodName: '',       //变动方式名称
            bdfsId: 'test1222',
            alterTypeTree: [],
            clearOptions: {
                disabledDate(date) {
                    return date.valueOf() < new Date(This.changeDateScope.startDate).valueOf() || date.valueOf() > new Date(This.changeDateScope.endDate).valueOf()
                }
            },
            showChangeMethod: false,
            alterTypeSetting: {
                callback: {
                    onClick: this.alterTypeCallBack,
                    beforeClick: this.treeBeforeClick
                }
            },
            useDepartmentTreeSetting: {
                callback: {
                    onClick: this.useDepartmentTreeClickCallBack,
                    beforeClick: this.treeBeforeClick
                }
            },
            assetsClassTreeSetting: {
                callback: {
                    onClick: this.assetsClassTreeClickCallBack,
                    beforeClick: this.treeBeforeClick
                }
            },
            useStateTreeSetting: {
                callback: {
                    onClick: this.useStateTreeClickCallBack,
                    beforeClick: this.treeBeforeClick
                }
            },
            changeMethodTreeSetting: {
                callback: {
                    onClick: this.changeMethodTreeClickCallBack,
                    beforeClick: this.treeBeforeClick
                }
            },
            selectAssets: '',
            base_config: {
                mtype: 'POST',
                styleUI: 'Bootstrap',
                url: contextPath + '/presentationMaturityController/getmaturityList',
                ajaxGridOptions: {contentType: 'application/json;charset=utf-8'},
                datatype: 'json',
                //postData: JSON.stringify(_vm.formData),
                jsonReader: {
                    root: "data",
                    cell: "list",
                    // userdata: "data.userData",
                    repeatitems: false
                },

                onSelectRow: function (rowid, status) {
                    //单击某行
                    console.log("当前选择的单个id===" + rowid);
                    this.selectedId = rowid;
                },
                ondblClickRow: function (rowid) {
                    //双击某行
                    console.log("当前双击的单个id===" + rowid);
                },

                viewrecords: true,
                rowNum: 99999,
                shrinkToFit: false
            },
        }
    },
    //清理
    //获取会计科目列表
    mounted() {
        this.initPage();
        this.openTime = window.parent.params && window.parent.params.openTime;
    },
    methods: {
        //提示alert
        wrapAlert(msg) {
            this.$Message.info({
                content: msg,
                duration: 3
            });
        },
        instance (type, title, content) {
            switch (type) {
                case 'success':
                    this.$Modal.success({
                        title: title,
                        content: content
                    });
                    break;
                case 'error':
                    this.$Modal.error({
                        title: title,
                        content: content
                    });
                    break;
            }
        },

        verifyClearOneCard () {
            let that = this;
            //传id
            let cardId = this.selectedId;
            let _url = contextPath + '/faClearChange/verifyClearOneCard/' + cardId;
            $.ajax({
                type: "POST",
                url: _url,
                data: '',
                async: false,
                dataType: "json",
                success: function (res) {
                    that.getDateScope();
                    that.faClearCardParmsVO = {};
                    if (res.code === '100100') {
                        let card = that.faCardVOList.find(item => { return item.id === cardId });
                        // that.faClearCardParmsVO = card;
                        that.faClearCardParmsVO.id = cardId;
                        that.faClearCardParmsVO.sobName = layui.data('user').currentOrgName;
                        that.faClearCardParmsVO.changeType = card.changeType;
                        that.faClearCardParmsVO.assetCode = card.assetCode;
                        that.faClearCardParmsVO.assetName = card.assetName;
                        that.faClearCardParmsVO.num = card.num;
                        that.faClearCardParmsVO.clearNum = card.num;
                        that.faClearCardParmsVO.clearDate = that.changeDateScope.endDate;
                        that.faClearCardParmsVO.accountYear = card.accountYear;
                        that.faClearCardParmsVO.accountPeriod = card.accountPeriod;
                        //校验通过 - 弹出清理数据输入数据编辑框
                        that.clearOneShow = true;
                        that.editIsDisabled = true;
                        that.infoIsDisabled = true;

                    } else if (res.code === '1001001' || res.code === '1001006') {

                        res.code === '1001006' && (that.editIsDisabled = true) && (that.infoIsDisabled = true)
                        //全部清理
                        //要确定提示
                        let _msg = res.msg;
                        that.$Modal.confirm({
                            title: '信息提示',
                            content: '<p>' + _msg + '</p>',
                            onOk: () => {
                                //弹出编辑页面
                                that.faClearCardParmsVO = res.data;
                                //
                                let dataRemark =(res.data.remark==null ? '':res.data.remark.split('/')[0]);
                                that.faClearCardParmsVO.remark = dataRemark;
                                that.faClearCardParmsVO.num = 1;

                                that.faClearCardParmsVO.sobName = layui.data('user').currentOrgName;
                                that.clearOneShow = true;
                                that.editIsDisabled = false;
                                that.infoIsDisabled = false;
                                var treeObj = $.fn.zTree.getZTreeObj(that.cudiId);//ztree树的ID
                                var _node = treeObj.getNodeByParam("id", res.data.alterTypeId);//根据ID找到该节点
                                if (_node != null) {
                                    treeObj.selectNode(_node);//根据该节点选中
                                    that.faClearCardParmsVO.alterTypeName = _node.name;
                                }
                                if( res.code === '1001001'){
                                    that.saveIsDisabled = true;
                                    that.editIsDisabled = true;
                                }
                                that.clearToUpdate = (res.code === '1001006' ? true:false);
                            },
                            onCancel: () => {
                                //关闭弹框
                                // this.$Message.info('Clicked cancel');
                            }
                        });

                    } else if (res.code === '1001002') {
                        //部分清理
                    } else if (res.code === '-1') {
                        //失败
                        //提示
                        that.instance('error', "提示信息", res.msg);
                    }
                    // that.clearOneShow = true;
                },
                error: function (err) {
                },
            });
        },
        saveClear () {

            let that = this;
            let _url = '';
            this.$Modal.confirm({
                title: '提示信息',
                content: '<p>保存清理数据前必须生成一条变动记录，确认要生成吗？</p>',
                onOk: () => {
                    //执行清理
                    if(that.clearToUpdate){
                        _url=contextPath + '/faClearChange/clearToUpdate';
                    }else {
                        _url=contextPath + '/faClearChange/clearOneCard';
                    }
                    $.ajax({
                        type: 'POST',
                        url: _url,
                        data: JSON.stringify(that.faClearCardParmsVO),
                        async: false,
                        contentType: 'application/json;charset=utf-8',
                        success: function (res) {
                            if (res != null) {
                                // layer.alert(res.msg);
                                that.$Message.info({
                                    content: res.msg,
                                    duration: 3
                                })
                                //置空清理参数对象
                                that.faClearCardParmsVO ={};
                            }
                        },
                        error: function (res) {

                        }
                    })
                    // this.$Message.info('Clicked ok');
                    that.clearOneShow = false;
                    that.refresh();
                },
                onCancel: () => {
                    this.clearOneShow = false;
                }
            });

        },
        //删除清理
        deleteClearOne(){
            let includeChange = false;      //删除的数据包含变动生成的
            let ids =[];
            ids.push(this.faClearCardParmsVO.id);
            this.deleteCommon(ids,includeChange);
            this.clearOneShow = false;

        },
        //查看清理
        selectClearOne(){
            var _url = contextPath + "/finance/FixedAssets/InitialFixedAssets/index.html?type=info&id=" + this.faClearCardParmsVO.id;
            window.parent.activeEvent({ 'name': '卡片详情', 'url': _url });
        },
        treeBeforeClick(treeId, treeNode, clickFlag) {
            return !treeNode.isParent; //当单击父节点，返回false，不让选取
        },
        showTree (which, value) {
            console.log(value, this.showDepartment, 'this.showdepreciation');
            switch (which) {
                case 'showAssetType':
                    if (this.showAssetType === true) {
                        this.showAssetType = false;
                        return;
                    }
                    this.showAssetType = value;
                    break;
                case 'showUseState':
                    if (this.showUseState === true) {
                        this.showUseState = false;
                        return;
                    }
                    this.showUseState = value;
                    break;
                case 'showChangeMethod':
                    if (this.showChangeMethod === true) {
                        this.showChangeMethod = false;
                        return;
                    }
                    this.showChangeMethod = value;
                    break;
                case 'showDepartment':
                    if (this.showDepartment === true) {
                        this.showDepartment = false;
                        return;
                    }
                    this.showDepartment = value;
                    break;
                case 'showBatchUseMode':
                    if (this.showBatchUseMode === true) {
                        this.showBatchUseMode = false;
                        return;
                    }
                    this.showBatchUseMode = value;
                    break;
            }
            // if (this.showDepartment === true) {
            //     this.showDepartment = false;
            //     return;
            // }
            // this.showDepartment = value;
        },

        //清理情况下日期选择范围
        getDateScope() {
            let that = this;
            $.ajax({
                url: contextPath + '/facard/beginenddate',
                type: 'post',
                async: false,
                success: function (data) {
                    that.changeDateScope = data.data;
                }
            })
        },
        cancel () {
            this.clearOneShow = false;
        },
        changeMethodTreeClickCallBack(event, treeId, treeNode) {
            console.log(treeNode);
            // this.card.alterTypeId = treeNode.id;
            this.changeMethodName = treeNode.name;
            this.clearData.clearAlterTypeId = treeNode.id;
            this.showChangeMethod = false;
        },

        // 选择哪个弹框
        showDepartmentTree(value, which, index) {
            // this.idx = index;
            switch (which) {
                case 'showAssetType':
                    if (this.showAssetType === true) {
                        this.showAssetType = false;
                        return;
                    }
                    this.showAssetType = value;
                    break;
                case 'showUseDept':
                    if (this.showUseDept === true) {
                        this.showUseDept = false;
                        return;
                    }
                    this.showUseDept = value;
                    break;
                case 'showUseStateType':
                    if (this.showUseStateType === true) {
                        this.showUseStateType = false;
                        return;
                    }
                    this.showUseStateType = value;
                    break;
                case 'showChangeMethod':
                    if (this.showChangeMethod === true) {
                        this.showChangeMethod = false;
                        return;
                    }
                    this.showChangeMethod = value;
                    break;
            }
        },
        alterTypeCallBack (event, treeId, treeNode) {
            console.log("treeNode:" + treeNode);
            this.faClearCardParmsVO.alterTypeId = treeNode.id;
            this.faClearCardParmsVO.alterTypeName = treeNode.name;
            this.showUseMode = false;
        },
        //资产类别下拉
        assetsClassTreeClickCallBack(event, treeId, treeNode) {
            // console.log(treeNode,'资产类别');
            this.formData.withAssetTypeId = treeNode.id;
            this.assetsTypeName = treeNode.name;
            this.showAssetType = false;
        },
        treeBeforeClick(treeId, treeNode, clickFlag) {
            // console.log("treeNode",treeNode)
            return !treeNode.isParent;
        },
        //使用状态下拉
        useStateTreeClickCallBack(event, treeId, treeNode) {
            // console.log(treeNode,'使用状态');
            this.formData.withUseStateId = treeNode.id;
            this.useStateName = treeNode.name;
            this.showUseStateType = false;
        },
        //使用部门下拉
        useDepartmentTreeClickCallBack(event, treeId, treeNode) {
            // console.log(treeNode,'使用部门');
            this.formData.withUseDeptId = treeNode.id;
            this.useDepartmentName = treeNode.name;
            this.showUseDept = false;
        },
        //资产列表弹窗
        onAssets() {
            // if (this.showReceive || this.showUserInfo) {
            //     return;
            // }
            this.showAssetCode = true;
        },
        //关闭资产列表弹窗
        closeAssets() {
            // this.card.AssetsId = this.selectAssets.id;
            this.formData.withAssetCode = this.selectAssets.assetCode;
            this.showAssetCode = false;
            console.log("assetsName:" + this.selectAssets);
        },

        // 初始值
        initMethod() {
            this.delTable();
            this.setTableHeader();
        },
        clearOneFun () {
            let that = this;
            if (that.hasVoucher) {
                that.wrapAlert("当期凭证已过账！");
                return false;
            }
            //查询列表
            that.queryDataList();
            //校验勾选数据数量
            let flag = that.selectOneFun();
            if (!flag) return;
            // that.clearOneShow = true;
            //当选择的数据条数为1时 查询选择数据
            //校验数据
            that.verifyClearOneCard();
        },
        queryDataList () {
            let that = this;
            let url = contextPath + '/facard/listcard';
            let param = JSON.stringify(that.filter);
            console.log('filter:', that.filter);
            $.ajax({
                type: "POST",
                url: url,
                data: param,
                async: false,
                contentType: 'application/json;charset=utf-8',
                success: function (res) {
                    if (res.code === '100100' && res.data.length > 0) {
                        that.faCardVOList = res.data;
                    }
                },
                error: function (err) {
                },
            });

        },
        setTableHeader() {
            this.colNames = ['id', '资产编码', '资产名称', '规格', '类别', '入账日期', '到期年期'
                , '使用日期', '使用情况', '使用部门', '折旧方法', '数量'
                , '原值', '累计折旧', '净值', '减值准备', '净额', '预计净残值', '本期折旧额', '使用寿命', '剩余寿命'];
            this.colModel = [
                {name: 'id', width: 30, hidden: true},
                {name: 'assetCode', width: 80, align: "right"},
                {name: 'assetName', width: 100, align: "right"},
                {name: 'model', width: 80, align: "right"},
                {name: 'itemName', width: 100, align: "right"},
                {name: 'enterAccountDate', width: 100, align: "right"},
                {
                    name: 'maturityPeriod', width: 80, align: "right", formatter: function (value, options, rowData) {
                    return value ? (new Date(value)).format("yyyy-MM-dd") : '';
                }
                },
                {name: 'beginUsedate', width: 80, align: "right", formatter: function (value, options, rowData) {
                    return value ? (new Date(value)).format("yyyy-MM-dd") : '';
                }},
                {name: 'useStateStr', width: 50, align: "right"},
                {name: 'useDeptName', width: 50, align: "right"},
                {name: 'deprMethodStr', width: 50, align: "right"},
                {name: 'num', width: 50, align: "right"},
                {
                    name: 'totalVal', width: 80, align: "right", formatter: function (value, options, rowData) {
                    return value == 0 ? "" : accounting.formatNumber(value, 2, ",");
                }
                },
                {name: 'beginBalance', width: 100, align: "right"},
                {name: 'netVal', width: 100, align: "right"},
                {name: 'devalPreparation', width: 100, align: "right"},
                {name: 'netAmo', width: 100, align: "right"},
                {name: 'expectNetSalvage', width: 100, align: "right"},
                {name: 'thisPeriodDeprAmount', width: 100, align: "right"},
                {name: 'expectUsePeriods', width: 100, align: "right"},
                {name: 'residualServicelife', width: 100, align: "right"},
            ];
            this.tableHeaders = [];
            this.jqGridInit(this.colNames, this.colModel, this.tableHeaders);
            //jQuery("#grid").jqGrid('setFrozenColumns');
        },
        selectOneFun () {
            // this.selected = [1,2];
            if (!this.selected.length) {
                this.$Modal.info({
                    title: "提示信息",
                    content: "请勾选一条记录"
                });
                return false;
            }
            if (this.selected.length > 1) {
                this.$Modal.info({
                    title: "提示信息",
                    content: "此功能不允许一次处理多张卡片或变动"
                });
                return false;
            }
            return true;
        },
        delTable() {
            $("#grid").empty();// 清空表格内容
            var parent = $("#maturity_jQGrid_Wapper"); // 获得整个表格容器
            parent.empty();
            $(`<table id="grid"></table><div id="page"></div>`).appendTo(parent);
        },

        // 生成jqGrid
        jqGridInit(colNames, colModel, headers) {
            let _vm = this;
            let config = Object.assign({}, this.base_config, {
                colNames: colNames,
                colModel: colModel,
                postData: JSON.stringify(_vm.formData),
                loadComplete: function (ret) {

                    if (ret.code != '100100') {
                        let _msg = '系统异常!';
                        if (ret.hasOwnProperty("data")) {
                            _msg = ret.msg;
                        }
                        layer.alert(_msg);
                        return;
                    }
                    _vm.accountDateStr = _vm.formData.accountYear + "年" + _vm.formData.accountPeriod + "期";
                    _vm.dataList = ret.data || [];
                    jQuery("#grid").jqGrid('destroyGroupHeader');
                    jQuery("#grid").jqGrid('setGroupHeaders', {
                        useColSpanStyle: true,
                        groupHeaders: headers
                    });
                },
                gridComplete: function () {
                    //  var rows=$("#grid").jqGrid("getRowData");
                    //  $('#null').find("td").addClass("SelectBG");
                    var rows = jQuery("#grid").jqGrid('getRowData');
                    var allCountID = $("#grid").jqGrid('getDataIDs');
                    rows.push($("#grid").jqGrid('getRowData', allCountID[allCountID.length - 1]));
                    $("table[id='grid'] tr[id='-2'] td").addClass("alltotalClass");
                },
            });
            jQuery("#grid").jqGrid(config);
        },
        initPage() {
            var _vm = this;
            $.ajax({
                type: 'post',
                async: false,
                url: contextPath + '/assetslistcontroller/initPage',
                success: function (result) {
                    if (result.code != '100100') {
                        let _msg = '页面初始化失败';
                        if (result.hasOwnProperty("data")) {
                            _msg = result.msg;
                        }
                        layer.alert(_msg);
                        return;
                    }
                    var dataInfo = result.data;
                    _vm.accountYearList = dataInfo.yearList;
                    _vm.accountPeriodList = dataInfo.monthList;
                    _vm.orgName = layui.data('user').currentOrgName;
                    _vm.modelList = dataInfo.modelList;
                    $.each(_vm.accountYearList, function (idx, ele) {
                        if (ele.value == dataInfo.currentYear) {
                            _vm.formData.accountYear = ele.name;
                        }
                    });
                    $.each(_vm.accountPeriodList, function (idx, ele) {
                        if (ele.value == dataInfo.currentMonth) {
                            _vm.formData.accountPeriod = ele.name;
                        }
                    });
                }
            });
        },
        openFun() {
            this.filterVisible = true;
        },
        clearFun() {
            this.clearVisible = true;
        },
        //查询当前期间固定资产是否已生成凭证
        getHasVoucher () {
            var that = this;
            $.ajax({
                url: contextPath + '/financeCommon/faWhetherVourcher',
                type: 'post',
                success: function (data) {
                    that.hasVoucher = data.data;
                }
            });
        },
        clearOneFun () {
            let that = this;
            if (that.hasVoucher) {
                that.wrapAlert("当期凭证已过账！");
                return false;
            }
            //校验数据
            that.verifyClearOneCard();
        },
        _nullData(_t) {
            if (_t) {
                return _t;
            } else {
                return '';
            }
        },
        formartMoney(value) {
            return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
        },
        //清理 按钮操作
        clearActionFun: function (_type) {
            var _that = this;
            console.log("_that.formData--", _that.formData)
            switch (_type) {
                case 'save':
                    _that.$Modal.confirm({
                        title: '信息提示',
                        content: '<p>保存清理数据前必须生成一条变动记录，</p><p>确认要生成吗？</p>',
                        onOk: () => {
                            _that.$Message.info('操作成功');
                        }

                    });
                    break;
                case 'close':
                    this.cleanClearData();
                    _that.clearVisible = false;
                    break;
            }
            // this.cancelFun();
            // $('#grid').setGridParam({
            //     postData: JSON.stringify(_that.formData)
            // }).trigger("reloadGrid");
        },

        //点击确认
        saveFun: function () {
            this.initMethod();
            this.filterVisible = false;
        },
        //点击取消或者x
        cancelFun: function () {
            let _vm = this;
            _vm.$refs.modelRef.reset();
            // _vm.$refs.startDateRef.reset();
            // _vm.$refs.endDateRef.reset();
            _vm.formData.withStartEnterAccountDate = '';
            _vm.formData.withEndEnterAccountDate = '';
            _vm.formData.withAssetCode = '';
            _vm.assetsTypeName = '';
            _vm.useDepartmentName = '';
            _vm.useStateName = '';
            _vm.formData.withAssetTypeId = '';
            _vm.formData.withUseStateId = '';
            _vm.formData.withUseDeptId = '';
            _vm.showAssetType = false;
            _vm.showUseDept = false;
            _vm.showUseStateType = false;
            this.filterVisible = false;

        },
        //导出Excel表格  暂时不能用
        exportExcel() {
            var _that = this;
            var containsCleanedUp = _that.formData.containsCleanedUp ? 1 : 0;
            let _url = contextPath + "/webFinanceFaAttachDevice/exportExcel?fiscalPeriod=" + _that.formData.fiscalPeriod + "&accountYear=" + _that.formData.accountYear +
                "&containsCleanedUp=" + containsCleanedUp;
            window.open(_url);
        },
        //刷新
        refreshFun() {
            var _that = this;
            $('#grid').setGridParam({
                postData: JSON.stringify(_that.formData)
            }).trigger("reloadGrid");
        },
        //退出
        dropOut() {
            //退出,关闭当前页签
            var name = '固定资产附属设备明细表';
            window.parent.closeCurrentTab({name: name, openTime: this.openTime, exit: true})
        },
        //打印
        mimeograph() {
            let that = this;
            if (!that.dataList || !that.dataList.length) {
                that.$Message.info({
                    content: '无打印数据',
                    duration: 3
                });
                return;
            }
            var _info = {
                'title': '固定资产到期提示表',  // 标题
                'template': 1,  // 模板
                'totalRow': false, //false不显示合计
                'titleInfo': [       // title
                    {'name': '会计期间', 'val': that.formData.accountYear + '年' + that.formData.fiscalPeriod + '期'},
                ],
                'colNames': [       // 列名与对应字段名
                    {'name': '资产编码', 'col': 'assetCode'},
                    {'name': '资产名称', 'col': 'assetName'},
                    {'name': '规格', 'col': 'model'},
                    {'name': '类别', 'col': 'itemName'},
                    {'name': '入账日期', 'col': 'enterAccountDate'},
                    {'name': '到期年期', 'col': 'maturityPeriod'},
                    {'name': '使用日期', 'col': 'beginUsedate'},
                    {'name': '使用情况', 'col': 'useStateStr'},
                    {'name': '使用部门', 'col': 'useDeptName'},
                    {'name': '折旧方法', 'col': 'deprMethodStr'},
                    {'name': '数量', 'col': 'num'},
                    {'name': '原值', 'col': 'totalVal'},
                    {'name': '累计折旧', 'col': 'beginBalance'},
                    {'name': '净值', 'col': 'netVal'},
                    {'name': '减值准备', 'col': 'devalPreparation'},
                    {'name': '净额', 'col': 'netAmo'},
                    {'name': '预计净残值', 'col': 'expectNetSalvage'},
                    {'name': '本期折旧额', 'col': 'thisPeriodDeprAmount'},
                    {'name': '使用寿命', 'col': 'expectUsePeriods'},
                    {'name': '剩余寿命', 'col': 'residualServicelife'},
                ],
                'styleCss': '',   // 自定义样式 例：  thead{text-align: center;font-size: 14px;font-weight: 100;}
                'colMaxLenght': 9,  // 显示最大长度， 默认为7
                'data': that.dataList,  // 打印数据  list
            };
            // 弹窗选择列 模式
            that.printInfo = _info;
            that.printModalShow(true);
        },
        printModalShow(_t) {
            this.printModal = _t;
        },
        cleanClearData() {
            //清除 清单 按钮弹出框的所有内容
            let _vm = this;
            _vm.clearData.clearCodeAndName = '';
            _vm.clearData.clearOriginalNumber = '';
            _vm.clearData.clearFee = '';
            _vm.clearData.clearDate = '';
            _vm.clearData.clearNumber = '';
            _vm.clearData.clearSalvageIncome = '';
            _vm.clearData.clearRemark = '';
            _vm.clearData.clearAlterTypeId = '';
            _vm.changeMethodName = '';
        },
    }
})