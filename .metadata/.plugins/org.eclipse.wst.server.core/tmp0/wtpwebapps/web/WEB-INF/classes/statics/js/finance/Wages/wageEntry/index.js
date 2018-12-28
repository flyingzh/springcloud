new Vue({
    el: '#wage-entry',
    data() {
        return {
            categoryLabel: '',
            formulaLabel: '',
            queryFormData: {
                categoryId: 34001,
                formulaId: 1,
                accountYear: 2018,
                accountPeriod: 10,
                employeeIdList: [],
                wmItemsEntity: {
                    status: 1,
                    itemIdList: []
                },
                wmTaxRateEntryFilterVo: {}
            },
            wmTaxRateEntryFilterVo: {
                depId: '',
                depName: '',
                idCard: '',
                empCode: '',
                empName: '',
                empRank: '',
                empEdu: '',
                empStatus: '',
                empStation: '',
                categoryId: 47001,
                stationLevel: '',
                entryStartDate: '',
                entryEndDate: ''
            },
            formData: {
                categoryName: '',
                formulaName: '',
                periodStr: '',
                accountYear: 2018,
                accountPeriod: 10,
                empRange : '1',
            },
            saveParams: {
                sobId: '',
                categoryId: '',
                accountYear: '',
                accountPeriod: '',
                employeeIdList: [],
                itemCodeList: [],
                wmEmployeeItemsEntityList: []
            },
            filterVisible: true,
            copyVisible: false,
            calcVisible: false,
            orgName: "",
            title: "",
            tableList: [],
            chooseId: '',
            operatorList: [
                {id:1,name:'+'},
                {id:2,name:'-'},
                {id:3,name:'*'},
                {id:4,name:'/'},
                {id:5,name:'='}
            ],
            currentOrg: {},
            showAssetType: false,
            checkAll: true,
            columns1: [
                {type: 'selection', width: 60, align: 'center'},
                {title: '项目名称', key: 'itemName', width: 102},
                {title: '序号', key: 'sortId', width: 70}
            ],
            checkList: [],
            itemTable: [],
            colNames: [],
            colModel: [],
            dataList: [],
            categoryList: [],
            formulaList: [],
            sobId: '',
            empStationList: [],
            empRankList: [],
            empLevelList: [],
            empEduList: [],
            showDepType: false,
            showDepTree: '',
            depTreeSetting: {
                callback: {
                    onClick: this.depTreeClickCallBack,
                    beforeClick: this.treeBeforeClick
                }
            },
            itemList: [],
            currentUser: {},
            openTime: '',
        }
    },
    created() {
    },
    mounted() {
        this.initData();
        this.openTime = window.parent.params && window.parent.params.openTime;
    },
    methods: {
        formatterFun(value, grid, rows, state) {
            let that = this;
            $(document).off("blur", ".wm_" + grid.colModel.name + "_" + rows.id).on("blur", ".wm_" + grid.colModel.name + "_" + rows.id, function (ev) {
                var val = ev.target.value;
                that.accountNum(val, rows, grid.colModel.name, "wm_");
            });
            var input = `<input value="${value}"  class="wm_${grid.colModel.name}_${rows.id} form-control text-right" />`;
            return input;
        },
        formatterCurrencyFun(value, grid, rows, state) {
            let that = this;
            $(document).off("blur", ".wm_" + grid.colModel.name + "_" + rows.id).on("blur", ".wm_" + grid.colModel.name + "_" + rows.id, function (ev) {
                let val = ev.target.value ? Number(ev.target.value).toFixed(2) : ''
                ev.target.value = val;
                that.accountNum(val, rows, grid.colModel.name, "wm_");
            });
            var input = `<input value="${value}"  class="wm_${grid.colModel.name}_${rows.id} form-control text-right" type="number" />`;
            return input;
        },
        accountNum(val, rows, attr, name) {
            this.dataList.forEach(item => {
                if(item.id == rows.id ){
                   item[attr] = val;
                 }
             });
        },
        saveBatch() {  //批量新增或修改
            let that = this;
            var empItemList = this.dataList;  //员工工资集合
            var checkItemList = this.itemList;  //项目设置信息
            //this.itemTable;  //选中项目集合
            var itemCodeList = [];
            var employeeIdList = [];
            if (checkItemList.length > 0 && empItemList.length > 0) {
                var e = 0;
                var k = 0;
                for (var j = 0; j < checkItemList.length; j++) {
                    var item = checkItemList[j];
                    var itemCode = item.itemCode;
                    if (item.itemAttribute == 0) {  //过滤员工属性
                        for (var i = 0; i < empItemList.length; i++) {
                            if (k < empItemList.length) {     //拿到所有员工id
                                employeeIdList [i] = empItemList[i].employeeId;
                            }
                            k++;
                            delete empItemList[i][itemCode];
                        }
                    } else {
                        if (itemCode != 'FAccumulationFund' && itemCode != 'FBasicWage' && itemCode != 'FSocialSecurity') {  //录职员的时附加的字段
                            itemCodeList[e] = item.itemCode;
                            e++;
                        }
                    }
                }
                var tempList = [];
                var v = 0;
                for (var a = 0; a < empItemList.length; a++) {
                    var empItem = empItemList[a];
                    for (let b in empItem) {
                        if (b != 'employeeId' && b != 'id' && b != 'FAccumulationFund' && b != 'FBasicWage' && b != 'FSocialSecurity') {
                            var temp = {};
                            temp.categoryId = that.queryFormData.categoryId;
                            temp.employeeId = empItem.employeeId;
                            temp.itemCode = b;
                            if (b == 'FPreparerID') {  //制表人
                                temp.itemValue = that.currentUser.username;
                            } else {
                                temp.itemValue = empItem[b];
                            }
                            temp.accountYear = that.formData.accountYear;
                            temp.accountPeriod = that.formData.accountPeriod;
                            temp.sobId = that.sobId;
                            temp.createId = that.currentUser.id;
                            temp.createName = that.currentUser.username;
                            tempList[v] = temp;
                            v++;
                        }
                    }
                }
                this.saveParams.accountYear = this.formData.accountYear;
                this.saveParams.accountPeriod = this.formData.accountPeriod;
                this.saveParams.categoryId = this.queryFormData.categoryId;
                this.saveParams.sobId = this.sobId;
                this.saveParams.wmEmployeeItemsEntityList = tempList;
                this.saveParams.employeeIdList = employeeIdList;
                this.saveParams.itemCodeList = itemCodeList;
                this.insert(this.saveParams);
            }
        },
        insert(data) {
            let that = this;
            $.ajax({
                type: 'post',
                dataType: 'json',
                async: false,
                data: JSON.stringify(data),
                url: contextPath + '/app/wmEmployeeItems/saveOrUpdateBatch',
                contentType: 'application/json;charset=utf-8',
                success: function (result) {
                    console.log(result);
                    that.refresh();  //刷新
                }
            });
        },
        depTreeClickCallBack(event, treeId, treeNode) {
            console.log(treeNode);
            if (treeNode.children != null && treeNode.children.length != 0) {
                return;
            }
            this.wmTaxRateEntryFilterVo.depId = treeNode.id;
            this.wmTaxRateEntryFilterVo.depName = treeNode.name;
            this.showDepType = false;
        },
        showTrees(value, which, index) {
            switch (which) {
                case 'showDepTree':
                    if (this.showDepType === true) {
                        this.showDepType = false;
                        return;
                    }
                    this.showDepType = value;
                    break;
            }
        },
        //当单击父节点，返回false，不让选取
        treeBeforeClick(treeId, treeNode, clickFlag) {
            return !treeNode.isParent;
        },
        initData() {
            let that = this;
            $.ajax({
                type: 'post',
                dataType: 'json',
                async: false,
                url: contextPath + '/app/wmEmployeeItems/initData',
                success: function (result) {
                    console.log("______________________________", result, "___________________________");
                    var data = result.data;
                    that.currentUser = data.currentUser;
                    that.currentOrg = data.currentUser.currentOrganization;  //组织对象
                    that.sobId = data.currentUser.userCurrentOrganId;
                    that.categoryList = data.categoryList; //类别list
                    if (that.categoryList.length > 0) {
                        var wmCategoryEntity = data.wmCategoryEntity;
                        that.queryFormData.categoryId = wmCategoryEntity.id;
                        var val = {};
                        val.label = wmCategoryEntity.categoryName;
                        val.value = wmCategoryEntity.id;
                        that.changeValue(val);
                    }
                    var wmCur = data.wmCur;
                    that.formData.accountYear = wmCur.curYear;
                    that.formData.accountPeriod = wmCur.curPeriod;
                    that.empStationList = getCodeList("sys_station", that.sobId);
                    that.empRankList = getCodeList("sys_rank", that.sobId);
                    that.empLevelList = getCodeList("sys_station_level", that.sobId);
                    that.empEduList = getCodeList("sys_education", that.sobId);
                }
            });
        },
        changeFormulaList(val) {
            this.formulaLabel = val.label;
        },
        changeValue(val) {
            this.categoryLabel = val.label;
            let that = this;
            $.ajax({
                type: 'post',
                dataType: 'json',
                async: false,
                data: {categoryId: that.queryFormData.categoryId},
                url: contextPath + '/app/wmEmployeeItems/changeValue',
                success: function (result) {
                    var data = result.data;
                    that.itemList = data.itemList;
                    var val = {};
                    var formulaId;
                    that.formulaList = data.formulaList[0].wmFormulaSettingList;
                    if (that.formulaList.length > 0) {
                        var firstData = that.formulaList[0];
                        formulaId = firstData.id;
                        val.label = firstData.formulaName;
                        val.value = firstData.id;
                    }
                    that.queryFormData.formulaId = formulaId;
                    that.changeFormulaList(val);
                }
            });
        },
        rowDblclick(item) {
            var that = this;
            console.log(item, '==================');
            // setTimeout(function () {
            //     that.checkList = [];
            // }, 1000);
        },
        selectionChange(item) {
            console.log(item, '==================');
            this.checkList = item;
        },
        getGridData() {
            let that = this;
            $.ajax({
                type: 'post',
                dataType: 'json',
                async: false,
                data: JSON.stringify(that.queryFormData),
                url: contextPath + '/app/wmEmployeeItems/list',
                contentType: 'application/json;charset=utf-8',
                success: function (result) {
                    var data = result.data;
                    that.colNames = data.colNames;
                    that.colModel = data.colModel;
                    that.dataList = data.dataList;
                    that.itemTable = data.list;
                    that.jqGridList();
                }
            });
        },
        jqGridList() {
            if (this.colModel != null) {
                for (var i = 0; i < this.colModel.length; i++) {
                    var formatter = this.colModel[i].formatter;
                    if (formatter == "wm_formatter") {
                        this.colModel[i].formatter = this.formatterFun;
                    }
                    if (formatter == "wm_formatter_currency") {
                        this.colModel[i].formatter = this.formatterCurrencyFun;
                    }
                }
            }
            let that = this;
            jQuery("#grid").jqGrid({
                datatype: "local",
                colNames: that.colNames,
                colModel: that.colModel,
                data: that.dataList,
                sortable: false,
                styleUI: 'Bootstrap',
                height: $(window).height() - 210,
                loadComplete: function (result) {
                    console.log(result);
                    var rows = result.rows;
                    var length = rows.length;
                    if(length > 0){
                        for(var i = 0; i<length; i++){
                            var data = rows[i];
                            var checkId = data['FCheckerID'];
                            if(checkId != 0 && checkId != '' && checkId != null){
                                $('#'+data['id']).find("td").addClass("auditClass");
                            }
                        }
                    }
                }
            });
            this.$Message.info("数据加载中...");
        },
        getIncomeTax() {  //所得税
            var url = contextPath + "/finance/Wages/incomeTaxCalc/index.html";
            window.parent.activeEvent({name: '所得税', url: url, params: this.wmTaxRateEntryFilterVo});
        },
        filterFun() {
            this.filterVisible = true;
        },
        copyFun() {
            this.copyVisible = true;
        },
        calcFun() {
            var length = this.itemTable.length;
            var obj = {};
            if(length>0){
                for (var i = 0;i<length;i++){
                     var dataType = this.itemTable.dataType;
                     if(dataType == 6 || dataType ==1 ){

                     }
                }
            }
            this.calcVisible = true;
            console.log(this.itemTable,'好的好好的');
        },
        query() {
            /**根据筛选条件查询**/
            this.filterVisible = false;
            this.formData.categoryName = this.categoryLabel;
            this.formData.formulaName = this.formulaLabel;
            this.formData.periodStr = this.formData.accountYear + '年' + this.formData.accountPeriod + '期';
            var arr = [0];
            var length = this.checkList.length;
            if (length > 0) {
                for (var i = 0; i < length; i++) {
                    arr[i] = this.checkList[i].id;
                }
            }
            this.queryFormData.accountYear = this.formData.accountYear;
            this.queryFormData.accountPeriod = this.formData.accountPeriod;
            this.queryFormData.wmItemsEntity.itemIdList = arr;
            this.queryFormData.wmTaxRateEntryFilterVo = this.wmTaxRateEntryFilterVo;
            this.refresh();
        },
        /**获取当前选择行数据**/
        getRowData() {
            var rowId = $('#grid').jqGrid('getGridParam', 'selrow');
            if (rowId == null) {
                return rowId;
            }
            var rowData = $("#grid").jqGrid('getRowData', rowId);
            return rowData;
        },

        /**审核 请求服务端**/
        auditPost(data) {
            let that = this;
            $.ajax({
                type: 'post',
                dataType: 'json',
                async: false,
                data: JSON.stringify(data),
                url: contextPath + '/app/wmEmployeeItems/audit',
                contentType: 'application/json;charset=utf-8',
                success: function (result) {
                    if (result.code == '100100') {
                         if(result.data){
                             that.refresh();
                         }else {
                             that.$Message.info('审核失败');
                         }
                    }else{
                        that.$Message.info(result.msg);
                    }
                }
            });
        },
        /**反审核 请求服务端**/
        resetAuditPost(data){
            let that = this;
            $.ajax({
                type: 'post',
                dataType: 'json',
                async: false,
                data: JSON.stringify(data),
                url: contextPath + '/app/wmEmployeeItems/resetAudit',
                contentType: 'application/json;charset=utf-8',
                success: function (result) {
                    if (result.code == '100100') {
                        if(result.data){
                            that.refresh();
                        }else {
                            that.$Message.info('反审核失败');
                        }
                    }else{
                        that.$Message.info(result.msg);
                    }
                }
            });
        },
        /**审核**/
        audit() {
            var rowData = this.getRowData();
            if (rowData == null) {
                this.$Message.info('请选择要进行操作的数据。');
            } else {
                var data = {};
                data.categoryId = this.queryFormData.categoryId;
                data.accountYear = this.formData.accountYear;
                data.accountPeriod = this.formData.accountPeriod;
                data.employeeId = rowData.employeeId;
                this.auditPost(data);
            }
        },
        /**反审核**/
        resetAudit() {
            var rowData = this.getRowData();
            if (rowData == null) {
                this.$Message.info('请选择要反审核的数据。');
            } else {
                var data = {};
                data.categoryId = this.queryFormData.categoryId;
                data.accountYear = this.formData.accountYear;
                data.accountPeriod = this.formData.accountPeriod;
                data.employeeId = rowData.employeeId;
                this.resetAuditPost(data);
            }
        },
        cancel() {
            this.filterVisible = false;
        },
        saveFun() {

            this.calcVisible = false;
        },
        cancelFun() {
            this.filterVisible = false;
        },
        refresh() {
            this.delTable();
            this.getGridData();  //刷新
        },
        delTable() {
            $("#grid").empty();// 清空表格内容
            var parent = $(".jqGrid_wrapper_parent"); // 获得整个表格容器
            parent.empty();
            $("<table id='grid'></table>").appendTo(parent);
        },
        exit() {  //退出
            window.parent.closeCurrentTab({name: "工资录入", openTime: this.openTime, exit: true});
        },

    }
})