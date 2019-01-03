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
                accountPeriod: 10
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
            calc:{
                itemCode : '',
                operatorId :'',
                cellValue : '',
                empRange : '1'
            },
            employeeId : '',
            calcDisabled : false,
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
            sobId: '',
            checkList: [],
            itemTable: [],
            colNames: [],
            colModel: [],
            dataList: [],
            categoryList: [],
            formulaList: [],
            formula : {},
            editList : [],
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
        getColModelName(colModel,id){
             this.employeeId = id;
             this.calc.itemCode = colModel.name;
             var  dataType = colModel.dataType;
             if(dataType != 4 && dataType != 5 && dataType != 6){   //4：整数，5：实数，6：货币
                 this.calc.operatorId = 5;    //默认选中 “=”
                 this.calcDisabled = true;   //禁用
             }else{
                 this.calcDisabled = false;   //启用
             }
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
            if(val == null){
                this.formulaLabel = '';
            }else {
                this.formulaLabel = val.label;
            }
            var length = this.formulaList.length;
            var item = {};
            if(length > 0){
                for(var i = 0;i<length;i++){
                     var data = this.formulaList[i];
                     if(val.value == data.id){
                         item = data;
                         break;
                     }
                }
            }
            this.formula = item;
            console.log(val,'------------change公式',item);
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
                        val.value = formulaId;
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
            that.calc.itemCode  = '';   //计算器选中code
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
        accountNum(val, rows, attr, name) {
            var calcMethod = this.formula.calcMethod.replace(/[\r\n]/g, "");  //去除回车换行
            calcMethod = calcMethod.substring(0, calcMethod.length - 1);
            var arr = calcMethod.split(';');
            //console.log(calcMethod,'----------',arr);

           this.dataList.forEach(item => {
                if(item.id == rows.id ){
                    item[attr] = val;
                    for (var i = 0; i < arr.length; i++) {
                        var str = arr[i].split('=');
                        var left = str[0];
                        var right = str[1];
                        var codes = right.split(/[\+\(\)\-\*\/]+/);
                        for (var j = 0; j < codes.length; j++) {
                            right = right.replace(codes[j], item[codes[j]]);
                        }
                        var value = eval(right);
                        item[left] = value;
                        var classId = ".wm_" + left + "_" + rows.id;
                        $(classId).attr("value", value);
                    }
                }
            });
        },
        formatterLogicFun(value, grid, rows, state) {//逻辑
            var id = rows.id;
            var name = grid.colModel.name;
            var classId = ".wm_" + name + "_" + id;
            let that = this;
            $(document).off("blur",classId).on("blur",classId, function (ev) {
                var val =  Number($(classId).prop('checked'));
                that.accountNum(val, rows,name, "wm_");
            });
            $(document).off("focus", classId).on("focus", classId, function (ev) {
                that.getColModelName(grid.colModel,rows.employeeId);
            });
            var checkId = rows['FCheckerID'];
            if(value == ''){
                value = 0;
                that.accountNum(value, rows,name, "wm_");
            }
            if (checkId != null && checkId != 0 && checkId != '') {  //审核
                if (value == 1) {
                    return `<input type='checkbox'checked="checked" disabled = "disabled" class="wm_${name}_${id} form-control text-right"/>`;
                } else {
                    return `<input type='checkbox'  disabled = "disabled" class="wm_${name}_${id} form-control text-right"/>`;
                }
            } else {  //未审核
                if (value == 1) {
                    return `<input type='checkbox'checked="checked" class="wm_${name}_${id} form-control text-right"/>`;
                } else {
                    return `<input type='checkbox' class="wm_${name}_${id} form-control text-right"/>`;
                }
            }
            return '';
        },
        formatterDateFun(value, grid, rows, state) { //日期
            var name = grid.colModel.name;
            var id = rows.id;
            var classId = ".wm_" + name + "_" + id;
            let that = this;
            $(document).off("blur",classId).on("blur", classId, function (ev) {
                var val = ev.target.value;
                that.accountNum(val, rows,name, "wm_");
            });
            $(document).off("focus", ".wm_" + name + "_" + id).on("focus", ".wm_" + name + "_" + id, function (ev) {
                that.getColModelName(grid.colModel,rows.employeeId);
            });
             var  date = `<input type="date" value="${value}" maxlength="${grid.colModel.dataLength}"  class="wm_${name}_${id} form-control text-right"/>`;
            //  var input = `<input value="${value}"  class="wm_${name}_${id} form-control text-right" />`;
             return date;
        },
        formatterIntegerFun(value, grid, rows, state){  //整数
            var id = rows.id;
            var name = grid.colModel.name;
            var classId = ".wm_" + name + "_" + id;
            let that = this;
            $(document).off("blur",classId).on("blur", classId, function (ev) {
                let val = ev.target.value ? Number(ev.target.value).toFixed(2) : ''
                ev.target.value = val;
                that.accountNum(val, rows,name, "wm_");
            });
            $(document).off("focus", ".wm_" + name + "_" + id).on("focus", ".wm_" + name + "_" + id, function (ev) {
                that.getColModelName(grid.colModel,rows.employeeId);
            });
            var input = `<input value="${value}"  class="wm_${name}_${id} form-control text-right" />`;
            return input;
        },
        formatterNumberFun(value, grid, rows, state){  //实数
            var name = grid.colModel.name;
            var id = rows.id;
            var classId = ".wm_" + name + "_" + id;
            var dataLength = grid.colModel.dataLength;
            var decimalDigit = grid.colModel.decimalDigit;
            let that = this;
            $(document).off("blur",classId).on("blur", classId, function (ev) {
                let val = ev.target.value ? Number(ev.target.value).toFixed(decimalDigit) : ''
                ev.target.value = val;
                that.accountNum(val, rows,name, "wm_");
            });
            $(document).off("focus", ".wm_" + name + "_" + id).on("focus", ".wm_" + name + "_" + id, function (ev) {
                that.getColModelName(grid.colModel,rows.employeeId);
            });
            var input = `<input value="${value}" type="number" oninput="if(value.length>${dataLength})value=value.slice(0,${dataLength})" class="wm_${name}_${id} form-control text-right" />`;
            return input;
        },
        formatterTextFun(value, grid, rows, state) {  //文本
            let that = this;
            $(document).off("blur", ".wm_" + grid.colModel.name + "_" + rows.id).on("blur", ".wm_" + grid.colModel.name + "_" + rows.id, function (ev) {
                var val = ev.target.value;
                that.accountNum(val, rows, grid.colModel.name, "wm_");
            });
            $(document).off("focus", ".wm_" + grid.colModel.name + "_" + rows.id).on("focus", ".wm_" + grid.colModel.name + "_" + rows.id, function (ev) {
                that.getColModelName(grid.colModel,rows.employeeId);
            });
            var input = `<input value="${value}" maxlength="${grid.colModel.dataLength}"   class="wm_${grid.colModel.name}_${rows.id} form-control text-right" />`;
            return input;
        },
        formatterCurrencyFun(value, grid, rows, state) {  //货币
            let that = this;
            var id = rows.id;
            var name = grid.colModel.name;
            var classId = ".wm_" + name + "_" + id;
            var dataLength = grid.colModel.dataLength;
            var decimalDigit = grid.colModel.decimalDigit;
            $(document).off("blur", classId).on("blur", classId, function (ev) {
                let val = ev.target.value ? Number(ev.target.value).toFixed(decimalDigit) : ''
                ev.target.value = val;
                that.accountNum(val, rows, name, "wm_");
            });
            $(document).off("focus", classId).on("focus", classId, function (ev) {
                that.getColModelName(grid.colModel, rows.employeeId);
            });

            var calcMethod = that.formula.calcMethod.replace(/[\r\n]/g, "");  //去除回车换行
            calcMethod = calcMethod.substring(0, calcMethod.length - 1);
            var arr = calcMethod.split(';');
            for (var i = 0; i < arr.length; i++) {
                var str = arr[i].split('=');
                var code = str[0];
                if(name == code){
                    return  `<input value="${value}" disabled="disabled" oninput="if(value.length>${dataLength})value=value.slice(0,${dataLength})"  class="wm_${grid.colModel.name}_${rows.id} form-control text-right" type="number" />`;
                }
            }
            return `<input value="${value}" oninput="if(value.length>${dataLength})value=value.slice(0,${dataLength})"  class="wm_${grid.colModel.name}_${rows.id} form-control text-right" type="number" />`;
        },
        jqGridList() {
            if (this.colModel != null) {
                for (var i = 0; i < this.colModel.length; i++) {
                    var formatter = this.colModel[i].formatter;
                    if(formatter == "wm_formatter_logic"){ //逻辑
                        this.colModel[i].formatter = this.formatterLogicFun;
                    }
                    if (formatter == "wm_formatter_date") { //日期
                        this.colModel[i].formatter = this.formatterDateFun;
                    }
                    if (formatter == "wm_formatter_text") { //文本
                        this.colModel[i].formatter = this.formatterTextFun;
                    }
                    if (formatter == "wm_formatter_integer") { //整数
                        this.colModel[i].formatter = this.formatterIntegerFun;
                    }
                    if (formatter == "wm_formatter_number") { //实数
                        this.colModel[i].formatter = this.formatterNumberFun;
                    }
                    if (formatter == "wm_formatter_currency") { //货币
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
                    var rows = result.rows;
                    var length = rows.length;
                    if (length > 0) {
                        for (var i = 0; i < length; i++) {
                            var data = rows[i];
                            var checkId = data['FCheckerID'];
                            if (checkId != 0 && checkId != '' && checkId != null) {
                                $('#' + data['id']).find("td").addClass("auditClass");
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
            var list = [];
            if(length>0){
                for (var i = 0;i<length;i++){
                     var data = this.itemTable[i];
                     if(data.signType == 1){
                         list.push(data);
                     }
                }
            }
            this.editList = list;
            this.calcVisible = true;
            console.log(list,'好的好好的');
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
        calcSw(itemValue,cellValue,index){
            switch (this.calc.operatorId){  //运算符  + - * .....
                case 1:
                    this.dataList[index][this.calc.itemCode ] = itemValue+cellValue;
                    break;
                case 2:
                    this.dataList[index][this.calc.itemCode ] = itemValue-cellValue;
                    break;
                case 3:
                    this.dataList[index][this.calc.itemCode ] = itemValue*cellValue;
                    break;
                case 4:
                    this.dataList[index][this.calc.itemCode ] = itemValue/cellValue;
                    break;
                case 5:
                    this.dataList[index][this.calc.itemCode ] = this.calc.cellValue;
                    break;
                default:
                    break;
            }
        },
        saveFun() {
            var length = this.dataList.length;
            if (length > 0) {
                for (var i = 0; i < length; i++) {
                    var data = this.dataList[i];
                    var itemValue =  Number(data[this.calc.itemCode ]);
                    var cellValue  = Number(this.calc.cellValue);
                    var auditState = data['FCheckerID'];
                    if(auditState == 0 || auditState == null ){
                        if(this.calc.empRange == 2 && this.employeeId == data.employeeId){
                            this.calcSw(itemValue,cellValue,i);
                            break;
                        }
                        if(this.calc.empRange == 1){
                            this.calcSw(itemValue,cellValue,i);
                        }
                    }
                }
            }
            this.delTable();
            this.jqGridList();
            this.clearCalc();
            this.calcVisible = false;
        },
        clearCalc(){
            this.calc.operatorId = '';
            this.calc.cellValue = '';
            this.calc.empRange = '1';
        },
        calcClose(){
            this.clearCalc();
            this.calcVisible = false;
        },
        itemCodeChange(val){
             console.log(val);
             for (var i = 0;i<this.editList.length;i++){
                     var data = this.editList[i];
                     if(data.itemCode == this.calc.itemCode){
                         if(data.dataType != 4 && data.dataType != 5 && data.dataType != 6){   //4：整数，5：实数，6：货币
                             this.calc.operatorId = 5;    //默认选中 “=”
                             this.calc.cellValue = '';
                             this.calcDisabled = true;   //禁用
                         }else{
                             this.calc.operatorId = '';
                             this.calc.cellValue = '';
                             this.calcDisabled = false;   //启用
                         }
                     }
             }
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