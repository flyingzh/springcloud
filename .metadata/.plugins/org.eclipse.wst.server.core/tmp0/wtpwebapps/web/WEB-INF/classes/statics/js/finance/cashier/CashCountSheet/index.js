var ve = new Vue({
    el: '#cashCountSheet',
    data () {
        let This = this;
        return {
            tid:'zTreeCashCountSheet',
            //显示新增弹出框
            addModal: false,
            filterModal: false,
            reload: false,
            searchModal: false,
            subjectVisiable: false,
            nodeSelected: false,
            isDisabled: true,
            subjectEnd: false,
            selected: '',
            selNode:[],
            subjectcode: '',
            modifyIsDisabled: false,
            isSaveOrUpdata: false,//false 为保存，true为updata
            //科目列表模拟数据
            subjectList: [],
            openTime: "",
            lodoPList: [],
            addTitle: '',
            leftType: 'ltData',  // 左边选择树形类别  默认  ltData ： 期间 
            filterBody: {
                sobId: 0,
                timeStart: '',
                timeEnd: '',
                type:1
            },
            showDataForm: {
                timeStart: '',
                timeEnd: '',
            },
            organizationList: [
                { 'value': 1, 'label': '金大祥集团' },
                { 'value': 2, 'label': '航天集团' },
                { 'value': 3, 'label': '粮食集团' },
            ],
            currencyList: [],
            periodDate:{},
            rightForm: {
                createName: '',
                subjectName: '',
                currencyName: '',
                dateTime: '',
                remark: '',
                sheetMoney: '',
                cashMoney: '',
                profitMoney: '',
            },
            //收支类别弹窗内表单数据绑定
            body: {
                id: '',
                code: '',
                incomeCategory: '1',
                name: '',
                fullName: '',
                subjectId: '',
                subjectCode: '',
                subjectName: ''//收入类别，支出类别节点ID
            },
            formInitData: {
                id:'',
                sobId: '',
                datetime: '',
                currencyId:'',
                subjectName: '',
                subjectCode: '',
                subjectId: '',
                remark:'',
                totalAmount:''
            },
            formAdd: {
                id:'',
                sobId: '',
                datetime: '',
                currencyId:'',
                subjectName: '',
                subjectCode: '',
                subjectId: '',
                remark:'',
                totalAmount:''
            },
            nodesList:{},
            //收支类型树形
            nodes: [],
            parValueStr:['100元','50元','20元','10元','5元','2元','1元','5角','2角','1角','5分','2分','1分'],
            setting: {
                callback: {
                    onClick: this.clickEvent,
                }
            },
            //数据列表渲染
            data_config: {
                // url: rcContextPath + '/incomeCategory/queryListPage',
                colNames: ['代码', '名称', '全名', '科目'],
                height: '230',
                colModel: [
                    { name: 'code', index: 'code', width: 200, align: "center" },
                    { name: 'name', index: 'name asc, invdate', width: 200, align: "center" },
                    { name: 'fullName', index: 'fullName', width: 200, align: "center" },
                    { name: 'subjectName', index: 'subjectName', width: 200, align: "center" }
                ],
            },
            dataList: [
                { 'id':'','cashCheckId':'', 'sequence': '1',  'parValueStr': '100元', 'parValue': 100, 'hundreds': 0, 'twenty': 0, 'tails': 0, 'amount': '0.00' },
                { 'id':'','cashCheckId':'', 'sequence': '2',  'parValueStr': '50元', 'parValue': 50, 'hundreds': 0, 'twenty': 0, 'tails': 0, 'amount': '0.00' },
                { 'id':'','cashCheckId':'', 'sequence': '3',  'parValueStr': '20元', 'parValue': 20, 'hundreds': 0, 'twenty': 0, 'tails': 0, 'amount': '0.00' },
                { 'id':'','cashCheckId':'', 'sequence': '4',  'parValueStr': '10元', 'parValue': 10, 'hundreds': 0, 'twenty': 0, 'tails': 0, 'amount': '0.00' },
                { 'id':'','cashCheckId':'', 'sequence': '5',  'parValueStr': '5元', 'parValue': 5, 'hundreds': 0, 'twenty': 0, 'tails': 0, 'amount': '0.00' },
                { 'id':'','cashCheckId':'', 'sequence': '6',  'parValueStr': '2元', 'parValue': 2, 'hundreds': 0, 'twenty': 0, 'tails': 0, 'amount': '0.00' },
                { 'id':'','cashCheckId':'', 'sequence': '7',  'parValueStr': '1元', 'parValue': 1, 'hundreds': 0, 'twenty': 0, 'tails': 0, 'amount': '0.00' },
                { 'id':'','cashCheckId':'', 'sequence': '8',  'parValueStr': '5角', 'parValue': 0.5, 'hundreds': 0, 'twenty': 0, 'tails': 0, 'amount': '0.00' },
                { 'id':'','cashCheckId':'', 'sequence': '9',  'parValueStr': '2角', 'parValue': 0.2, 'hundreds': 0, 'twenty': 0, 'tails': 0, 'amount': '0.00' },
                { 'id':'','cashCheckId':'', 'sequence': '10', 'parValueStr': '1角', 'parValue': 0.1, 'hundreds': 0, 'twenty': 0, 'tails': 0, 'amount': '0.00' },
                { 'id':'','cashCheckId':'', 'sequence': '11', 'parValueStr': '5分', 'parValue': 0.05, 'hundreds': 0, 'twenty': 0, 'tails': 0, 'amount': '0.00' },
                { 'id':'','cashCheckId':'', 'sequence': '12', 'parValueStr': '2分', 'parValue': 0.02, 'hundreds': 0, 'twenty': 0, 'tails': 0, 'amount': '0.00' },
                { 'id':'','cashCheckId':'', 'sequence': '13', 'parValueStr': '1分', 'parValue': 0.01, 'hundreds': 0, 'twenty': 0, 'tails': 0, 'amount': '0.00' },
            ],
            dataListInit: [
                { 'id':'','cashCheckId':'','sequence': '1',  'parValueStr': '100元', 'parValue': 100, 'hundreds': 0, 'twenty': 0, 'tails': 0, 'amount': '0.00' },
                { 'id':'','cashCheckId':'','sequence': '2',  'parValueStr': '50元', 'parValue': 50, 'hundreds': 0, 'twenty': 0, 'tails': 0, 'amount': '0.00' },
                { 'id':'','cashCheckId':'','sequence': '3',  'parValueStr': '20元', 'parValue': 20, 'hundreds': 0, 'twenty': 0, 'tails': 0, 'amount': '0.00' },
                { 'id':'','cashCheckId':'','sequence': '4',  'parValueStr': '10元', 'parValue': 10, 'hundreds': 0, 'twenty': 0, 'tails': 0, 'amount': '0.00' },
                { 'id':'','cashCheckId':'','sequence': '5',  'parValueStr': '5元', 'parValue': 5, 'hundreds': 0, 'twenty': 0, 'tails': 0, 'amount': '0.00' },
                { 'id':'','cashCheckId':'','sequence': '6',  'parValueStr': '2元', 'parValue': 2, 'hundreds': 0, 'twenty': 0, 'tails': 0, 'amount': '0.00' },
                { 'id':'','cashCheckId':'','sequence': '7',  'parValueStr': '1元', 'parValue': 1, 'hundreds': 0, 'twenty': 0, 'tails': 0, 'amount': '0.00' },
                { 'id':'','cashCheckId':'','sequence': '8',  'parValueStr': '5角', 'parValue': 0.5, 'hundreds': 0, 'twenty': 0, 'tails': 0, 'amount': '0.00' },
                { 'id':'','cashCheckId':'','sequence': '9',  'parValueStr': '2角', 'parValue': 0.2, 'hundreds': 0, 'twenty': 0, 'tails': 0, 'amount': '0.00' },
                { 'id':'','cashCheckId':'','sequence': '10', 'parValueStr': '1角', 'parValue': 0.1, 'hundreds': 0, 'twenty': 0, 'tails': 0, 'amount': '0.00' },
                { 'id':'','cashCheckId':'','sequence': '11', 'parValueStr': '5分', 'parValue': 0.05, 'hundreds': 0, 'twenty': 0, 'tails': 0, 'amount': '0.00' },
                { 'id':'','cashCheckId':'','sequence': '12', 'parValueStr': '2分', 'parValue': 0.02, 'hundreds': 0, 'twenty': 0, 'tails': 0, 'amount': '0.00' },
                { 'id':'','cashCheckId':'','sequence': '13', 'parValueStr': '1分', 'parValue': 0.01, 'hundreds': 0, 'twenty': 0, 'tails': 0, 'amount': '0.00' },
            ],
        }
    },
    methods: {

        openFilter () {
            this.filterModal = true;
        },
        outHtml () {
            window.parent.closeCurrentTab({ name: '现金盘点单', openTime: this.openTime, exit: true })
        },
        printV(){
            let that = this;
            console.log(that.dataList, '=========that.lodoPList');
            if (!that.dataList || !that.dataList.length) {
                that.$Message.info({
                    content: '无打印数据',
                    duration: 3
                });
                return;
            }
            // 多表头固定打印
            var _d = that.dataList;
            var _thead = '', _tbody = '', _tfoot = '';

            _thead = `
                    <tr class='thCs'>
                        <th rowspan="2" style="width: 6%">票面</th>
                        <th rowspan="2" style="width: 6%">把(百张)</th>
                        <th rowspan="2" style="width: 6%">卡(二十张)</th>
                        <th rowspan="2" style="width: 6%">尾款数(个)</th>
                        <th rowspan="2" style="width: 6%">金额小计</th>
                    </tr>
                `;

            _d.forEach(row => {
                _tbody += `
                        <tr>
                            <td>${row.parValueStr}</td>
                            <td>${that._nullData(row.hundreds)}</td>
                            <td>${that._nullData(row.twenty)}</td>
                            <td>${that._nullData(row.tails)}</td>
                            <td>${that.formartMoney(row.amount)}</td>
                        </tr>
                    `;
            });

            if (_d.length === 0) {
                _tfoot = `
                        <tr class="ht-foot">
                            <td>合计：</td>
                            ${'<td>/td>'.repeat(11)}
                        </tr>
                        `;
            } else {
                let total = 0;
                _d.forEach(item => {
                    total += item.amount;
                });
                // total = accounting.formatNumber(total, that.floatNumber, ",");

                _tfoot = `
                        <tr class="ht-foot">
                            <td>合计：</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>${that.formartMoney(total)}</td>
                        </tr>
                        `;
            }

            let data = {
                title: "现金盘点单",
                template: 12,
                'titleInfo': [       // title
                    { 'name': '科目', 'val': that.rightForm.subjectName },
                    { 'name': '币别', 'val': that.rightForm.currencyName },
                    { 'name': '盘点日期', 'val': that.rightForm.dateTime },
                ],
                'data': [],
                'colMaxLenght': 10,
                'tbodyInfo': {
                    'theadTX': _thead,
                    'tbodyTX': _tbody,
                    'tfootTX': _tfoot
                }

            }
            htPrint(data);
        },
        _nullData (_t) {
            if (_t) {
                return _t;
            } else {
                return '';
            }
        },
        formartMoney(value){
            return value == null || value == 0 ? '0.00' : accounting.formatNumber(value, 2, "");
        },
        onAsyncSuccess() {
            let _vm = this;
            var treeObj = $.fn.zTree.getZTreeObj(_vm.tid);//ztree树的ID
            var node = treeObj.getNodeByParam("id", _vm.selected);//根据ID找到该节点
            treeObj.selectNode(node);//根据该节点选中
            $.ajax({
                type: 'post',
                url: contextPath+"/checklist/info",
                data: {'id':_vm.selected,'type':1},
                success: function (ret) {
                    console.log(ret)
                    if (ret.code == '100100') {
                        console.log('查看数据')
                        _vm._loadTableData(ret);
                    } else {
                        _vm.$Modal.error({
                            title:'错误',
                            content:ret==null||ret.msg==null||ret.msg == ''?'系统异常':ret.msg
                        })
                    }
                }
            })
        },
        //点击修改
        modify (_type) {
            var that = this;
            if (_type === 'add') {
                that.addTitle = '现金盘点表-新增';
                // Object.assign(that.formAdd,that.formInitData);
                that.formAdd = that.formInitData
                $.extend(true,that.dataList,that.dataListInit)
                // Object.assign(that.dataListInit,that.dataList);
                that.addModal = true;
            } else if (_type === 'update') {
                if (this.selected === '') {
                    that.$Message.error('修改只能对单条数据进行操作');
                    return;
                }
                //获取所选数据ID
                let id = this.selected;
                that.addTitle = '现金盘点表-修改';
                $.ajax({
                    type: 'post',
                    url: contextPath+"/checklist/info",
                    data: {'id':id,'type':2},
                    success: function (ret) {
                        console.log(ret)
                        if (ret.code == '100100') {
                            console.log('修改数据')
                            that.dataList = ret.data.checkDetail;
                            $.each(that.dataList, function (key, val) {
                                let parValueStr = {'parValueStr': that.parValueStr[val.sequence-1]};
                                val.amount = that.formartMoney(val.amount);
                                Object.assign(val,parValueStr)
                            });
                           let data = ret.data.cashCheck;
                           that.formAdd.id = data.id;
                           that.formAdd.sobId = data.sobId;
                           that.formAdd.datetime = data.datetime;
                           that.formAdd.currencyId = data.currencyId;
                           that.formAdd.subjectName = data.subjectName;
                           that.formAdd.subjectCode = data.subjectCode;
                           that.formAdd.subjectId = data.subjectId;
                           that.formAdd.remark = data.remark;
                           that.formAdd.totalAmount = data.totalAmount;
                           that.addModal = true;
                        } else {
                            _vm.$Modal.error({
                                title:'错误',
                                content:ret==null||ret.msg==null||ret.msg == ''?'数据异常':ret.msg
                            })
                        }
                    }
                })
            }
        },
        addClose () {
            this.addModal = false;
        },
        _loadTableData(ret){
            let _vm = this;
            _vm.dataList = ret.data.checkDetail;
            let data = ret.data.cashCheck;
            _vm.rightForm.createName = data.createName;
            _vm.rightForm.subjectName = _vm.formInitData.subjectName
            $.each(_vm.currencyList, function (key, val) {
                if(val.id == data.currencyId){
                    _vm.rightForm.currencyName = val.currencyName;
                }
            });
            _vm.rightForm.dateTime = (new Date(data.datetime)).format('yyyy-MM-dd');
            if($.isEmptyObject(data.remark)){
                _vm.rightForm.remark = '（无）';
            }else{
                _vm.rightForm.remark = data.remark;
            }
            _vm.rightForm.sheetMoney = _vm.formartMoney(data.totalAmount);
            _vm.rightForm.cashMoney = _vm.formartMoney(ret.data.cashMoney);
            _vm.rightForm.profitMoney = _vm.formartMoney(data.totalAmount-ret.data.cashMoney);

            //重新加载数据刷新表格 parValueStr
            $.each(_vm.dataList, function (key, val) {
                let parValueStr = {'parValueStr': _vm.parValueStr[val.sequence-1]};
                val.amount = _vm.formartMoney(val.amount);
                Object.assign(val,parValueStr)
            });

            $("#list").jqGrid('setGridParam',{data:_vm.dataList}).trigger("reloadGrid");
            _vm.reload = !_vm.reload;
            _vm.nodeSelected = true;
        },
        //
        clickEvent (event, treeId, treeNode) {
            let _vm = this;
            if (treeNode.children != undefined) {
                _vm.isDisabled = true;
                _vm.nodeSelected = false;
            } else {
                _vm.isDisabled = false;
                let selnode = _vm.$ztree.getSelectedNodes();
                console.log(selnode);
                _vm.selected = selnode[0].id;
                _vm.selNode = selnode;
                $.ajax({
                    type: 'post',
                    url: contextPath+"/checklist/info",
                    data: {'id':_vm.selected,'type':1},
                    success: function (ret) {
                        console.log(ret)
                        if (ret.code == '100100') {
                            console.log('查看数据')
                            _vm._loadTableData(ret);
                        } else {
                            _vm.$Modal.error({
                                title:'错误',
                                content:ret==null||ret.msg==null||ret.msg == ''?'数据异常':ret.msg
                            })
                        }
                    }
                })
            }
        },
        //点击删除
        deleteBatch () {
            let _vm = this;
            console.log(_vm.selNode);
            $.ajax({
                type: 'post',
                url: contextPath+"/checklist/deleteCheckList",
                data: {'id':_vm.selected},
                success: function (ret) {
                    console.log(ret)
                    if (ret.code == '100100') {
                        _vm.$Modal.success({
                            title:'成功',
                            content:'删除成功'
                        })
                        _vm.initCashCheckTree();
                    } else {
                        _vm.$Modal.error({
                            title:'错误',
                            content:ret==null||ret.msg==null||ret.msg == ''?'系统异常':ret.msg
                        })
                    }
                }
            })
        },
        //点击保存
        saveData: function () {
            /*that.showDataForm.timeStart = (new Date(that.filterBody.timeStart)).format("yyyy-MM-dd");
            that.showDataForm.timeEnd = (new Date(that.filterBody.timeEnd)).format("yyyy-MM-dd");*/
            let _vm = this;
            let startDate = Date.parse(_vm.filterBody.timeStart)/1000;
            let endDate = Date.parse(_vm.filterBody.timeEnd)/1000;
            if(startDate>endDate){
                this.$Message.error('开始日期不能大于结束日期')
                return;
            }
            _vm.initCashCheckTree();
        },
        //点击取消或者x
        cancelData: function () {
            var that = this;
            /*that.filterBody.timeStart = (that.showDataForm.timeStart).format("yyyy-MM-dd");
            that.filterBody.timeEnd = (that.showDataForm.timeEnd).format("yyyy-MM-dd");*/
        },
        refreshData(){
            let that = this;
            that.init();
            that.pageInit();
            $.extend(true,that.dataList,that.dataListInit);

            //重新加载数据刷新表格 parValueStr
            $.each(this.dataList, function (key, val) {
                let parValueStr = {'parValueStr': that.parValueStr[val.sequence-1]};
                Object.assign(val,parValueStr)
            });
            $("#list").jqGrid('setGridParam',{data:that.dataList}).trigger("reloadGrid");
            that.reload = !that.reload;
            that.nodeSelected = false;
        },

        getColSum (name) {
            let rs = $(`td[aria-describedby='list_${name}']`);
            let sum = 0;
            if (rs.children("div.sumCol").length !== 0) {
                rs = $(`td[aria-describedby='list_${name}']`).children("div.sumCol")
            } else {
                rs = $(`td[aria-describedby='list_${name}']:not(:last)`)
            }
            rs.each((i, e) => {
                sum += accounting.unformat($(e).text()) * 1000
            })
            sum /= 1000;
            sum = accounting.formatMoney(sum, '', 2);
            return sum;
        },
        pageInit () {
            let that = this;
            // var _url = rcContextPath + '/incomeCategory/queryListPage?r=' + new Date().getTime();
            jQuery("#list").jqGrid(
                {
                    // url: _url,
                    // postData: JSON.stringify(that.filterBody),
                    // ajaxGridOptions: { contentType: 'application/json;charset=utf-8' },
                    datatype: "local",
                    data: that.dataList,
                    colNames: ['票面', '把(百张)', '卡(二十张)', '尾款数(个)', '金额小计'],
                    height: '250',
                    colModel: [
                        { name: 'parValueStr', index: 'parValueStr', width: 100, align: "center" },
                        { name: 'hundreds', index: 'hundreds', width: 100, align: "center" },
                        { name: 'twenty', index: 'twenty', width: 100, align: "center" },
                        { name: 'tails', index: 'tails', width: 100, align: "center" },
                        { name: 'amount', index: 'amount', width: 100, align: "center" }
                    ],
                    rowNum: 999999999,//一页显示多少条
                    sortorder: "desc",//排序方式,可选desc,asc
                    // mtype: "post",//向后台请求数据的ajax的类型。可选post,get
                    // jsonReader: {
                    //     root: "data.list",
                    //     total: "data.totalPage",
                    //     records: "data.totalCount",
                    //     cell: "list",
                    // },
                    sortable: false,
                    styleUI: 'Bootstrap',
                    height: '230',
                    viewrecords: true,
                    footerrow: true,
                    userDataOnFooter: true,
                    gridComplete: that.completeMethod,
                    loadComplete: function (xhr) {
                        console.log(xhr, '===========xhr=');
                        // that.lodoPList = xhr.data || [];
                    },
                    onCellSelect: function (rowid) {
                        let rowData = jQuery("#list").jqGrid('getRowData', rowid);
                        console.log(rowData, "---------=>")

                    },
                    ondblClickRow: function (rowid) {

                    }
                })
        },

        completeMethod () {
            $("#list").footerData('set', {
                "parValueStr": '合计',
                'amount': [0],
            });
            var sum_subjectId = this.getColSum('amount')

            $("#list").footerData('set', {
                "parValueStr": '合计',
                'amount': sum_subjectId,
            });

        },

        init () {
            let _vm = this;
            $.ajax({
                type: 'post',
                url: contextPath + "/checklist/init",
                data: null,
                success: function (ret) {
                    if (ret.code == '100100') {
                        _vm.currencyList = ret.data.currencyList;
                        _vm.subjectList = ret.data.subjectList;
                        _vm.organizationList = ret.data.org;
                        _vm.periodDate = ret.data.periodDate;
                        _vm.filterBody.sobId = ret.data.org[0].value;
                        _vm.filterBody.timeStart = ret.data.periodDate.startDate;
                        _vm.filterBody.timeEnd = ret.data.periodDate.endDate;
                        _vm.showDataForm.timeStart=(new Date(ret.data.periodDate.startDate)).format("yyyy-MM-dd");
                        _vm.showDataForm.timeEnd= (new Date(ret.data.periodDate.endDate)).format("yyyy-MM-dd");

                        _vm.formInitData.id = '';
                        _vm.formInitData.sobId = ret.data.org[0].value;
                        _vm.formInitData.datetime = ret.data.periodDate.endDate;
                        _vm.formInitData.currencyId = ret.data.currencyList[0].id;
                        _vm.formInitData.subjectName = ret.data.subjectList[0].accountName;
                        _vm.formInitData.subjectCode = ret.data.subjectList[0].accountCode;
                        _vm.formInitData.subjectId = ret.data.subjectList[0].accountId;
                        _vm.formInitData.remark = '';
                        _vm.formInitData.totalAmount = '';

                        _vm.initCashCheckTree();
                    } else {
                        _vm.$Modal.error({
                            title:'错误',
                            content:'页面初始化失败'
                        })
                    }
                }
            })
        },
        onTreeChange(val){
            if(val == 'ltData'){
                this.nodes = this.nodesList.dateTree;
            }else{
                this.nodes = this.nodesList.subjectTree;
            }
        },
        initCashCheckTree(){
            let _vm = this;
            /*let startDate = Date.parse(_vm.filterBody.timeStart)/1000;
            let endDate = Date.parse(_vm.filterBody.timeEnd)/1000;
            if(startDate>endDate){
                this.$Message.error('开始日期不能大于结束日期')
                return;
            }*/
            let id = this.selected;
            _vm.filterBody.timeStart = (new Date(_vm.filterBody.timeStart)).format('yyyy-MM-dd')
            _vm.filterBody.timeEnd = (new Date(_vm.filterBody.timeEnd)).format('yyyy-MM-dd')
            $.ajax({
                type: 'post',
                url: contextPath+"/checklist/cashCheckList",
                data: _vm.filterBody,
                success: function (ret) {
                    console.log(ret)
                    if (ret.code == '100100') {
                        _vm.nodesList = ret.data
                        if(_vm.leftType == 'ltData'){
                            _vm.nodes = ret.data.dateTree;
                        }else{
                            _vm.nodes = ret.data.subjectTree;
                        }
                        if(id != null && id != ''){
                            _vm.$nextTick(function () {
                                _vm.onAsyncSuccess();
                            })
                        }
                    } else {
                        _vm.$Modal.error({
                            title:'错误',
                            content:ret==null||ret.msg==null||ret.msg == ''?'系统异常':ret.msg
                        })
                    }
                }
            })
        },
    },
    mounted () {
        this.init();
        this.pageInit();
        this.openTime = window.parent.params && window.parent.params.openTime;
    },
})