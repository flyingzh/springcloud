var _vm = new Vue({
    el: '#project-settings',
    data () {
        return {
            queryData: {
                categoryId: '' //工资类别id
            },
            wmItemsVo : {
                wmItemsEntity : {}
            },
            itemName: '',
            formData: {
                id: '',
                itemCode:'',
                itemName: '',
                dataType: '',
                dataLength: 2,
                decimalDigit: 2,
                itemAttribute: ''
            },
            addData: {
                for1: '',
                for2: '',
                for3: '',
                for4: '',
                for5: '',
                for6: '',
                for7: '',
                for8: '',
            },
            editData: {
                for1: '',
                for2: '',
                for3: '',
                for4: '',
                for5: '',
                for6: '',
                for7: '',
                for8: '',
            },
            modifyTitle: "",
            modifyVisible: false,
            sortVisible: false,
            showDepType: false,
            selected: [],  // 获取列表列的勾选数组的rowId
            modifySortId: '',
            selectTitle:'',
            tableList: [],  // 获取列表列的所有数据
            currentOrg : {},
            categoryList: [], // 工资类别数组
            dataTypeList: [
                { id: 1, name: "逻辑" },
                { id: 2, name: "日期" },
                { id: 3, name: "文本" },
                { id: 4, name: "整数" },
                { id: 5, name: "实数" },
                { id: 6, name: "货币" }
            ], //数据类型数组
            // 摘要列表
            remarkList: {
                id: '',
                val: '',
            },
        }
    },
    created () {
    },
    mounted () {
        this.setQueryValues();
        this.pageInit();
    },
    computed: {

    },
    methods: {
        add_option () {
            console.log("新增科目/摘要弹框")
        },
        // value 为双向绑定的当前行的数据
        change_option (value) {
            var that = this;
            console.log(value, '===========value, item, key, indx==============');
            that.remarkList = value;
            var list = this.tableList.selectList;
            var formData = {};
            if(value.id == ""){
                formData.dataLength = 20;
                formData.decimalDigit = 2;
                formData.itemName = value.val;
                formData.categoryId = this.queryData.categoryId;
            }
            for (var i = 0; i < list.length; i++) {
                if (list[i].id == value.id || list[i].itemName == value.val ) {
                    formData = list[i];
                    break;
                }
            }
            this.formData =  formData;
            console.log(that.formData);
            // if (key === 'explains') {
            //     if (indx === 0) return;
            //     if (value === '//') {
            //         item[key] = that.tableDatas[0][key];
            //     } else if (value === '..') {
            //         item[key] = that.tableDatas[indx - 1][key];
            //     }
            // }
            /*
            var arr = value.split(delimiter);
            var _value = arr[0];
            var _label = arr[1];
            item[key] = value.replace(delimiter, ' ');
            item[key+'Label'] = _label;
            item[key+'Value'] = _value;
            */
        },
        setQueryValues () {
            let that = this;
            $.ajax({
                type: 'post',
                async: false,
                url: contextPath + '/app/wmItems/setQueryValues',
                // data:{},
                success: function (result) {
                    console.log('~~~~~~~~~~~~~~', result, '~~~~~~~~~~~~~~~~~~~');
                    var data = result.data;
                    that.currentOrg = data.currentOrg;  //组织list
                    that.categoryList = data.categoryList; //类别list
                    if (that.categoryList != null) {
                        that.queryData.categoryId = data.categoryId;
                    }
                }
            });
        },
        changeCategoryType () {  //change工资类别
            $("#grid").jqGrid('setGridParam', { postData: this.queryData }).trigger("reloadGrid");
        },
        queryChange () {
            console.log(this.itemName);
            return this.itemName;
        },
        showTrees (value, which, index) {
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
        pageInit () {
            let that = this;
            jQuery("#grid").jqGrid(
                {
                    datatype: "json",
                    mtype: 'POST',
                    multiselect: false,
                    url: contextPath + '/app/wmItems/list',
                    postData: that.queryData,
                    ajaxGridOptions: { contentType: 'application/json;charset=utf-8' },
                    serializeGridData: function (postData) {
                        return JSON.stringify(postData);
                    },
                    sortable:false,
                    colNames: ['id','工资类别','code', '项目名称', '数据类型', '数据长度', '小数位数', '项目属性'],
                    colModel: [
                        { name: 'id', width: 50, align: "center", key: true, hidden: true },
                        { name: 'categoryId', width: 50, align: "center", hidden: true },
                        { name: 'itemCode', width: 50, align: "center", hidden: true },
                        { name: 'itemName', width: 200, align: "left"},
                        {
                            name: 'dataType', width: 160, align: "left",
                            formatter: function (value) {
                                switch (value) {
                                    case 1:
                                        return "逻辑";
                                    case 2:
                                        return "日期";
                                    case 3:
                                        return "文本";
                                    case 4:
                                        return "整数";
                                    case 5:
                                        return "实数";
                                    case 6:
                                        return "货币";
                                    default:
                                        return "-";
                                }
                            },
                            /*unformat : function (value) {
                                 switch (value) {
                                    case "逻辑":
                                        return 1;
                                    case "日期":
                                        return 2;
                                    case "文本":
                                        return 3;
                                    case "整数":
                                        return 4;
                                    case "实数":
                                        return 5;
                                    case "货币":
                                        return 6;
                                    default:
                                        return 0;
                                }
                            }*/
                        },
                        { name: 'dataLength', width: 80, align: "right"},
                        { name: 'decimalDigit', width: 80, align: "right"},
                        {
                            name: 'itemAttribute', width: 160, align: "left",
                            formatter: function (value) {
                                switch (value) {
                                    case 0:
                                        return "其他";
                                    case 1:
                                        return "固定项目";
                                    case 2:
                                        return "可变项目";
                                    default:
                                        return "-";
                                }
                            },
                            unformat : function (value) {
                                switch (value) {
                                    case "其他":
                                        return 0;
                                    case "固定项目":
                                        return 1;
                                    case "可变项目":
                                        return 2;
                                    default:
                                        return null;
                                }
                            }
                        }
                    ],
                    rowNum: 999999999,//一页显示多少条
                    jsonReader: {
                        root: "data.gridList",
                    },
                    styleUI: 'Bootstrap',
                    height: $(window).height() - 210,
                    /*onSelectAll: function (data, status) { // 且点击头部的checkbox时才会触发此事件
                        that.handlerId(data, status, "selected");
                        console.log(that.selected)
                    },
                    onSelectRow: function (data, status) { // 当选择行时触发此事件
                        if (!!data) {
                            that.handlerId(data, status, "selected");
                            console.log(that.selected)
                        }
                    },*/
                    loadComplete: function (ret) {
                        //获取表格所有行数据
                        if (ret.code === '100100') {
                            that.tableList = ret.data || [];
                            console.log(that.tableList.gridList.length)
                        }
                        console.log('tableList', that.tableList)
                    },
                })
        },
        modifyFun (type) {
            switch (type) {
                case 'add':
                    this.modifyTitle = "工资项目-新增";
                    // Object.assign(this.formData, this.addData);
                    break;
                case 'edit':
                    this.modifyTitle = "工资项目-修改";
                    // 请求接口，给editData赋值

                    // 合并赋值
                    // Object.assign(this.formData, this.editData);
                    break;
            }
            this.modifyVisible = true;
        },
        delFun () {
            var rowId = $('#grid').jqGrid('getGridParam','selrow');
            if(rowId == null){
                this.$Message.info("请选择要删除的数据。");
                return;
            }
            var rowData = $("#grid").jqGrid('getRowData',rowId);
            delete rowData["dataType"];
            console.log(rowData);
            this.wmItemsVo.wmItemsEntity = rowData;
            this.$Modal.confirm({
                title: '提示信息',
                content: '<p>确定要删除所选数据行？</p>',
                // loading: true,
                onOk: () => {
                    // setTimeout(() => {
                    let that = this;
                    $.ajax({
                        type: 'post',
                        async: false,
                        url: contextPath + '/app/wmItems/delRelation',
                        data: JSON.stringify(that.wmItemsVo),
                        contentType: 'application/json;charset=utf-8',
                        success: function (result) {
                            console.log('~~~~~~~~~~~~~~', result, '~~~~~~~~~~~~~~~~~~~');
                            var data = result.data;
                            if (data) {
                                that.refresh();
                            } else {
                                that.$Message.info('删除失败');
                            }
                        }
                    });
                    // }, 1000);
                }
            });
        },
        changeSort (item, index) {   //输入后排序
            let setIndex = item.sortId;
            let arr = this.tableList.gridList;
            this.modifySort(item.id);

            if (setIndex >= arr.length) {
                arr.splice(index, 1);
                arr.splice(arr.length, 0, item);
            } else {
                arr.splice(index, 1);
                arr.splice(setIndex - 1, 0, item);
            }

            this.againSort();
        },
        openSortFun () {
            this.sortVisible = true;
        },
        closeSortFun () {
            this.sortVisible = false;
        },
        modifySort (id) {
            this.modifySortId = id;
        },
        getIndex () {
            let index = this.tableList["gridList"].findIndex(row => {
                return row.id === this.modifySortId;
            })
            return index;
        },
        swapItems (arr, index1, index2) {
            arr[index1] = arr.splice(index2, 1, arr[index1])[0];
            return arr;
        },
        changeUp () {   // 上移
            let index = this.getIndex();
            let arr = this.tableList.gridList;
            if (index >= 1) {
                arr = this.swapItems(arr, index, index - 1);
            }
            this.againSort();
        },
        changeDown () {   // 下移
            let index = this.getIndex();
            let arr = this.tableList.gridList;
            if (index <= arr.length - 1) {
                arr = this.swapItems(arr, index, index + 1);
            }
            this.againSort();
        },
        againSort () {     // 重新拍序
            this.tableList.gridList.forEach((row, index) => {
                row.sortId = index + 1;
            });
        },
        handlerId (data, status, type) {
            let _vm = this;
            if (typeof data === 'object' && status) {
                _vm[type] = data.filter(row => {
                    if (row != 'null' && row != '0') {
                        return row;
                    }
                });
            }
            if (typeof data === 'object' && !status) {
                _vm[type] = [];
            }
            if (typeof data === 'string') {
                if (status) {
                    let flag = (data != 'null' && data != '0');
                    if (flag) {
                        (_vm[type].indexOf(data.toString()) > -1) ? null : _vm[type].push(data.toString());
                    }
                } else {
                    let index = _vm[type].indexOf(data.toString());
                    index > -1 ? _vm[type].splice(index, 1) : null;
                }
            }
        },
        sortFun () {
            let that = this;
            $.ajax({
                type: 'post',
                async: false,
                url: contextPath + '/app/wmItems/sortUpdate',
                data: JSON.stringify(that.tableList.gridList),
                contentType: 'application/json;charset=utf-8',
                success: function (result) {
                    console.log('~~~~~~~~~~~~~~', result, '~~~~~~~~~~~~~~~~~~~');
                    var data = result.data;
                    if (data) {
                        that.closeSortFun();
                        that.refresh();
                    } else {
                        that.$Message.info('排序失败，请重新再试');
                    }
                }
            });
        },
        saveFun () {
            let that = this;
            $.ajax({
                type: 'post',
                async:false,
                url: contextPath+'/app/wmItems/saveOrUpdate',
                data:JSON.stringify(that.formData),
                contentType: 'application/json;charset=utf-8',
                success: function(result){
                    var data = result.data;
                    if(data){
                        that.refresh();
                    }else{
                        that.Message.info("操作失败,请稍后再试。");
                    }
                }
            });
            this.modifyVisible = false;
        },
        cancelFun () {
            this.modifyVisible = false;
        },
        refresh () {
            jQuery("#grid").trigger("reloadGrid");  //刷新
        }
    }
})