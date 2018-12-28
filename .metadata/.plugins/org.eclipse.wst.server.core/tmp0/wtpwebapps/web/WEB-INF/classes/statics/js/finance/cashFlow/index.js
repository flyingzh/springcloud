new Vue({
    el: '#profit-statement',
    data () {
        var that = this;
        return {
            btn: '',
            isEdit: false,
            optionList: [
                { label: '月报', value: 1 },
                { label: '季报', value: 2 },
            ],
            reload: false,
            formData: '',
            selected: [],
            dateList: [],
            editTitle: '',
            fatherid: 0,
            rowNums: 0,
            headline: '',
            printModal:false,
            printInfo: {},
            editVisable: false,
            tableList: [],
            printTableList:{},
            newTableList:[],
            base_config: {
                treeGridModel: 'adjacency', //treeGrid模式，跟json元数据有关 ,adjacency/nested>
                ExpandColumn: 'username',
                scroll: "true",
                mtype: "POST",
                styleUI: 'Bootstrap',
                url: './index.json',
                datatype: 'json',
                colNames: ['项目', '行次', '本月数', '本年数', 'computeType', 'isCompute', 'parentLine', 'id', 'rowNum','name','rowPosition','formula'],
                jsonReader: {
                    root: "data",
                    cell: "data",
                    repeatitems: false
                },
                sortable: false,
                height: $(window).height() - 140,
                viewrecords: true,
                rowNum: 999,
                pager: `#my_pager`,
            },
            colModel: [],
        }
    },
    mounted () {
    },
    methods: {
        // 初始值
        initMethod () {
            this.delTable();
            this.initTable();
        },
        initTable () {
            this.jqGridInit(this);
        },
        delTable () {
            $("#my_table").empty();// 清空表格内容
            var parent = $(".jqGrid_wrapper"); // 获得整个表格容器  
            parent.empty();
            $("<table id='my_table'></table><div id='my_pager'></div>").appendTo(parent);
        },
        // 生成jqGrid
        jqGridInit (that) {
            var _that = this;
            let config = Object.assign({}, this.base_config, {
                colModel: this.colModel,
                loadError (xhr, status, error) {
                    console.log("xhr,status,error", xhr, status, error);
                },
                loadComplete (item) {
                    console.log("item", item);
                    _that.printTableList = item.data || [];
                    if (item.code === "-1"){
                        // _that.$Message.info({
                        //     content: item.msg+",请重新刷新页面获取数据",
                        //     duration: 3
                        // });
                        _that.$Modal.error({
                            title:'错误',
                            content:item.msg+",请重新刷新页面获取数据"
                        })
                    };
                    //获取表格所有行数据
                    let rows = jQuery("#my_table").jqGrid('getRowData');
                    var allCountID = $("#my_table").jqGrid('getDataIDs');
                    rows.push($("#my_table").jqGrid('getRowData', allCountID[allCountID.length - 1]));
                    if (!that.isEdit) return;

                    //整理编辑页数据
                    rows.forEach(item => {
                        if (item.amount1.indexOf('form-control') > -1) {
                            let arr = item.amount1.split(" ");
                            arr.forEach(it => {
                                if (it.indexOf('value') < 0) return;
                                let val = it.substring(7, it.length - 1);
                                item.amount1 = val ? Number(val).toFixed(2) : '';
                            })
                        }
                        if (item.amount2.indexOf('form-control') > -1) {
                            let arr2 = item.amount2.split(" ");
                            arr2.forEach(it => {
                                if (it.indexOf('value') < 0) return;
                                let val = it.substring(7, it.length - 1);
                                item.amount2 = val ? Number(val).toFixed(2) : '';
                            })
                        }
                        // if(item.fieldName.indexOf('detail')>-1){
                        //     let index = item.fieldName.indexOf('>');
                        //     if(index<0) return;
                        //     item.fieldName = item.fieldName.substring(index+1,item.fieldName.length-6);

                        // }
                    })
                    that.tableList = rows;
                },
                gridComplete: function () {

                },
            });
            jQuery("#my_table").jqGrid(config);
        },
        editTable () {
            this.newTableList=[];
            let that = this;
            this.isEdit = true;
            var arr = that.formData.split('_');
            this.base_config.url = `${baseURL}report/getInit?accountYear=${arr[0]}&accountPeriod=${arr[1]}`,

                this.colModel = [
                    { name: 'fieldName', index: 'fieldName', width: 400, align: "left" },
                    {
                        name: 'lineNum', index: 'lineNum', width: 200, align: "center",
                        formatter: function (value, grid, rows, state) {
                            let line = rows.lineNum
                            if (line !== -1) {
                                return line;
                            }
                            return ""
                        }
                    },
                    {
                        name: 'amount1', index: 'amount1', width: 150, align: "center",
                        formatter: function (value, grid, rows, state) {
                            $(document).off("blur", ".pre" + rows.id).on("blur", ".pre" + rows.id, function (ev) {
                                let val = ev.target.value ? Number(ev.target.value).toFixed(2) : ''
                                ev.target.value = val;
                                that.accountNum(val, rows, 'amount1', "pre");
                                // console.log("rows",rows,val)

                                if(rows.isCompute !== 3){
                                    var _f = that.newTableList.filter(item=> item.rowNum===rows.rowNum);
                                    console.log("_f",_f)
                                    rows.amount1 = val;
                                    if (_f.length){
                                        _f = rows;
                                    }else {
                                        that.newTableList.push(rows);
                                    }
                                }
                                console.log("that.newTableList",that.newTableList,rows)
                            })
                            let btns = "";
                            if (rows.isCompute !== 1) {
                                btns = `<input value="${rows.amount1}" disabled class="pre${rows.id} form-control text-right" type="number"/>`;
                            } else {
                                btns = `<input value="${rows.amount1}" class="pre${rows.id} form-control text-right" type="number"/>`;
                            }
                            return btns;
                        }
                    },
                    {
                        name: 'amount2', index: 'amount2', width: 150, align: "center", hidden: true,
                        formatter: function (value, grid, rows, state) {
                            $(document).off("blur", ".prea" + rows.id).on("blur", ".prea" + rows.id, function (ev) {
                                let val = ev.target.value ? Number(ev.target.value).toFixed(2) : ''
                                ev.target.value = val;
                                that.accountNum(val, rows, 'amount2', "prea");
                            });
                            let btns = "";
                            if (rows.isCompute !== 1) {
                                btns = `<input value="${rows.amount2}" disabled class="prea${rows.id} form-control text-right" type="number"/>`;
                            } else {
                                btns = `<input value="${rows.amount2}" class="prea${rows.id} form-control text-right" type="number"/>`;
                            }
                            return btns
                        }
                    },
                    { name: 'computeType', index: 'computeType', hidden: true },
                    { name: 'isCompute', index: 'isCompute', hidden: true },
                    { name: 'parentLine', index: 'parentLine', hidden: true },
                    { name: 'id', index: 'id', hidden: true },
                    { name: 'rowNum', index: 'rowNum', hidden: true },
                    { name: 'name', index: 'name', hidden: true },
                    { name: 'rowPosition', index: 'rowPosition', hidden: true },
                    { name: 'formula', index: 'formula', hidden: true }
                ]
                    // ['项目', '行次', '本月数', '本年数', 'computeType', 'isCompute', 'parentLine', 'id', 'rowNum','name','rowPosition','formula'],
            this.delTable();
            this.initTable();
        },
        accountNum (val, rows, attr, name) {
            // console.log(val,rows,attr,name)
            let parents = rows.parentLine.split(",");

            parents.forEach(outer => {
                let sum = [];
                let flag = true;
                this.tableList.forEach(item => {
                    if (item.id == rows.id) {
                        item[attr] = val;
                    }
                    let obj = Object.assign({}, item)
                    let itParents = obj.parentLine.split(",");
                    itParents.forEach((p, i) => {
                        // console.log(p,i)
                        if (p === outer && flag) {
                            this.$set(obj, 'computeIndex', i);
                            this.$set(obj, 'computeSum', Number(p));
                            sum.push(obj)
                        }
                    });
                })
                let totalRow = 0;
                var rowNumber = 0;
                sum.forEach(item => {
                    let itCompute = item.computeType.split(",");
                    totalRow += Number(itCompute[item["computeIndex"]] + this.formatNum(item[attr] * 1, 1));
                    rowNumber = item.computeSum;
                })
                let changeData = this.tableList.find(it => {
                    return it.lineNum == rowNumber
                })
                if (changeData) {
                    let totalVal = totalRow ? totalRow.toFixed(2) : '';
                    console.log("totalVal",totalVal,$(`.${name}${changeData.id}`));
                    changeData[attr] = totalVal;

                    $(`.${name}${changeData.id}`)[0].value = totalVal;
                    let totalParents = changeData.parentLine.split(",");
                    // console.log(totalParents)
                    if (totalParents.length === 1 && !totalParents[0]) {
                        return;
                    }
                    this.accountNum(totalVal, changeData, attr, name)
                    // console.log(totalVal,changeData,attr,name)
                }
                // console.log(sum)
            });
        },
        // 格式化数字
        formatNum (f, digit) {
            // f = value  digit= 比例
            var m = Math.pow(1000, digit);
            return parseInt(f * m, 10) / m;
        },
        detailClick (row) {

            this.editTitle = `编辑公式 - ${row.fieldName}`;
            this.fatherid = row.id;
            this.rowNums = row.rowNum;
            this.headline
            console.log(this.fatherid, "-----------==========-------------", row);
            this.editVisable = true;
        },
        editClose () {
            this.refresh();
            this.editVisable = false;
        },
        save () {
            var params = JSON.parse(JSON.stringify(this.newTableList));
            console.log(params)
            // params = params.map(row => {
            //     delete row.computeType;
            //     delete row.isCompute;
            //     row.lineNum = row.lineNum ? row.lineNum : -1;
            //     return row;
            // });
            // console.log(params)

            var _this = this;
            if (!_this.newTableList.length){
                _this.$Message.info({
                    content: '没有要更新的数据',
                    duration: 3
                });
                return;
            }else {
                var _text = '<p>第';
                _this.newTableList.forEach(item => {
                    _text = _text + item.rowNum +'行,';
                });
                _text = _text+'数据将被修改,且修改后将不做公式计算操作</p>'
                _this.$Modal.confirm({
                title: '系统提示',
                content: _text,
                onOk: () => {
                    //请求接口
                    var arr = _this.formData.split('_');
                    var _url = contextPath + '/report/saveReport';
                    var _info = {
                        'accountYear': arr[0],
                        'accountPeriod': arr[1],
                        'reportContentEntities': _this.newTableList,
                    }
                    $.ajax({
                        type: 'post',
                        data: JSON.stringify(_info),
                        url: _url,
                        dataType: 'json',
                        contentType: 'application/json;charset=utf-8',
                        success: function (res) {
                            console.log(res);
                            var _txt = '';
                            var _title = '';
                            if (res.code === '100100'){
                                _txt = res.msg;
                                _title = '成功';
                            }else {
                                _txt = res.msg;
                                _title = '警告';
                            }
                            _this.$Modal.warning({
                                title: _title,
                                content: _txt
                            });
                        },
                        error: function (code) {
                            _this.$Modal.error({
                                title:'错误',
                                content:'请求异常,请联系管理员'
                            })
                        }
                    });
                    },
                onCancel: () => {
                    _this.$Message.info('取消保存');
                }
                });
            }
        },
        clear () {
            //清空重算
            this.editTable();
        },
        deleteOrve () {
            //清空所有数据重算   路径 report/deleteOrve
            // 参数会计期间Integer accountPeriod
            //  会计年度 Integer accountYear
            var _this = this;
            _this.toBack(2);
        },
        _ajaxDateList () {
            var _this = this;
            // url
            var _url = './index.json';
            // var _url = '';
            $.ajax({
                type: 'get',
                data: '',
                url: _url,
                dataType: 'json',
                success: function (res) {
                    var _txt = '';
                    var _title = '';
                    if (res.code === '100100'){
                        let data = res.data;
                        _this.dateList = data.list;
                        _txt = res.msg;
                        _title = '成功';
                    }else {
                        _txt = res.msg;
                        _title = '警告';
                    }
                    _this.$Modal.warning({
                        title: _title,
                        content: _txt
                    });
                },
                error: function (code) {
                    _this.$Modal.error({
                        title:'错误',
                        content:'请求异常,请联系管理员'
                    })
                }
            });
        },
        toBack1(){
            this.toBack();
        },
        toBack (_type) {
            _type = _type || 1
            this.isEdit = false;
            var arr = this.formData.split('_');
            console.log("_type=====>>>",_type);
            console.log("arr", arr);
            if (_type === 1) {
                this.base_config.url = `${baseURL}report/getInit?accountYear=${arr[0]}&accountPeriod=${arr[1]}`;
            } else {
                this.base_config.url = `${baseURL}report/deleteOrve?accountYear=${arr[0]}&accountPeriod=${arr[1]}`;
            }

            let that = this;
            this.colModel = [
                {
                    name: 'fieldName', index: 'fieldName', width: 400, align: "left",
                    formatter: function (value, grid, rows, state) {
                        $(document).off("click", ".detail" + rows.id)
                            .on("click", ".detail" + rows.id, function () {
                            that.detailClick(rows)
                        });
                        let div = '';
                        if (rows.isCompute === 1) {
                            //可点击
                            div = `<div class="detail${rows.id} fieldName">${rows.fieldName}</div>`;
                        } else {
                            //不能点击
                            div = `<div>${rows.fieldName}</div>`;
                        }

                        return div;
                    }
                },
                {
                    name: 'lineNum', index: 'lineNum', width: 200, align: "center",
                    formatter: function (value, grid, rows, state) {
                        let line = rows.lineNum
                        if (line !== -1) {
                            return line;
                        }
                        return ""
                    }
                },
                { name: 'amount1', index: 'amount1', width: 150, align: "center" },
                // { name: 'amount2', index: 'amount2', width: 150, align: "center" },
                { name: 'amount2', index: 'amount2', width: 150, align: "center", hidden: true },
                { name: 'computeType', index: 'computeType', hidden: true },
                { name: 'isCompute', index: 'isCompute', hidden: true },
                { name: 'parentLine', index: 'parentLine', hidden: true },
                { name: 'id', index: 'id', hidden: true },
                { name: 'rowNum', index: 'rowNum', hidden: true },
                { name: 'name', index: 'name', hidden: true },
                { name: 'rowPosition', index: 'rowPosition', hidden: true },
                { name: 'formula', index: 'formula', hidden: true }
            ]
            this.delTable();
            this.initTable();
        },
        refresh () {
            //刷新事件
            this.reload = true;
            this.toBack();
        },
        dateChange () {
            var arr = this.formData.split('_');
            console.log("arr====>", arr);
            var _url = `${baseURL}report/getInit?accountYear=${arr[0]}&accountPeriod=${arr[1]}`;
            $("#my_table").jqGrid('setGridParam', { url: _url }).trigger("reloadGrid");
        },
        exportExcel () {
            var arr = this.formData.split('_');
            window.open(`${baseURL}report/derivedTable?accountYear=${arr[0]}&accountPeriod=${arr[1]}`);
        },
        printModalShow (_t) {
            this.printModal = _t;
        },
        print(){
            var _that = this;
            console.log(_that.printTableList, '=========that.printTableList');
            if (!_that.printTableList || !_that.printTableList.length) {
                // _that.$Message.info({
                //     content: '无打印数据',
                //     duration: 3
                // });
                _that.$Modal.warning({
                    title: 警告,
                    content: '无打印数据'
                });
                return;
            }
            console.log("that.printTableList",_that.printTableList)
                // 但表头选择打印
                var _info = {
                    'title': '现金流量表',  // 标题
                    'template': 1,  // 模板
                    'titleInfo': [],      // title
                    'colNames': [       // 列名与对应字段名
                        { 'name': '项目', 'col': 'fieldName' },
                        { 'name': '行次', 'col': 'lineNum' },
                        { 'name': '本月数', 'col': 'amount1' ,'formatNub':true},
                    ],
                    'styleCss': '',   // 自定义样式 例：  thead{text-align: center;font-size: 14px;font-weight: 100;}
                    'colMaxLenght': 9,  // 显示最大长度， 默认为7

                    'data': _that.printTableList,  // 打印数据  list

                }
                // 弹窗选择列 模式
                _that.printInfo = _info;
                _that.printModalShow(true);
        }
    },

    mounted () {
        var _this = this;
        var _url = contextPath + '/report/accountPeriodList'; //获取总帐会计期间列表
        $.ajax({
            type: 'post',
            data: '',
            url: _url,
            dataType: 'json',
            analysis: false,
            success: function (res) {
                console.log(res, "获取总帐会计期间列表");
                _this.dateList = res.data;
                if (res.data && res.data.length) {
                    _this.formData = _this.dateList[0].value;
                }
                _this.$nextTick(() => {
                    _this.toBack();
                })
            },
            error: function (code) {
                _this.$Modal.error({
                    title:'错误',
                    content:'请求异常,请联系管理员'
                })
            }
        });

    },
    computed: {
        _test () {
            var arr = this.formData.split('_');
            return arr != null ? `${arr[0]}年${arr[1]}月` : '';
        }
    }
})