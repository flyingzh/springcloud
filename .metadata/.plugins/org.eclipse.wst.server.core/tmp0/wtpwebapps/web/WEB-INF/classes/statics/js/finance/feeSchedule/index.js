let vm = new Vue({
    el: '#fee-schedule',
    data() {
        let This = this;
        return {
            openTime: '',
            formData: {
                for1: '',
                for2: '',
                for3: '',
                for4: '1',
                for5: '',
                for6: true,
                for7: true,
                for8: '',
            },
            feeScheduleVO: {
                accountPeriods:[],
                accountCode:'',
                accountShowFlag:1,
                showItemFlag:true,
                showSumAmountFlag:true,
                treeHeight:0,
                startYear:2018,
                endYear:2018,
                startPeriod:8,
                endPeriod:8
            },
            subjectList: [],
            formDataList: [],
            accountPeriods: [],
            visible: false,
            base_config: {
                // caption: '费用明细表',
                treeGrid: true,
                treeGridModel: 'adjacency', //treeGrid模式，跟json元数据有关 ,adjacency/nested>
                ExpandColumn: 'subjectCode', //折叠的列
                scroll: 'true',
                shrinkToFit:false,  // 控制水平滚动条
                mtype: 'POST',
                styleUI: 'Bootstrap',
                url: '',
                ajaxGridOptions: { contentType: 'application/json;charset=utf-8' },
                datatype: 'json',
                postData: JSON.stringify(This.feeScheduleVO),
                jsonReader: {
                    root: 'data',
                   // cell: "data",
                   // userdata: "userdata",
                    repeatitems: false
                },
                treeReader: {
                    level_field: 'level',
                    parent_id_field: 'parentId',
                    leaf_field: 'isLeaf',
                    expanded_field: 'expanded'
                },
                height:$(window).height() - 140,
                // expanded: false,
                //viewrecords: true,
                // rowNum: 10,
                // rowList: [10, 20, 30, 40],
            },
            colNames1: ['编码', '名称', '本年累计'],
            colModel: [
                {name: 'subjectCode', width: 160, sortable:false},
                {name: 'subjectName', width: 185, sortable:false},
                {name: 'total', width: 130, align: 'right', hidden: false,sortable:false},
            ],
            subjectVisable: false,
            option: {},
            echartsLegend: [],
            echartsDate: [],
            echartsSeries: [],
            printInfo:{},
            printModal:false,
            dataList: [],
            reload: false,
            openCharts: false,
            isFilterVisible: false,
        }

    },
    methods: {
        // 初始值
        initMethod() {
            this.delTable();
            this.initTable();
        },
        iconPopup() {
            this.subjectVisable = true;
        },
        getSubject(data) {
            this.formData.for3 = data.subjectCode;
            // console.log(data)
        },
        modelClick() {
            // console.log(111)
            this.$refs.filter.visible = true;
        },
        //查看会计科目
        showSubjectTree() {
            this.subjectVisable = true;
        },
        //关闭选择科目弹窗
        subjectClose() {
            this.subjectVisable = false;
        },
        //保存会计科目树
        subjectSave(val) {
            this.formData.for3 = val.subjectCode;
            this.feeScheduleVO.treeHeight =val.treeHeight;
            console.log(this.formData.for3,'~~~~~',this.feeScheduleVO.treeHeight);
        },
        setColum(beforeDate, afterDate) {
            if (!(beforeDate && afterDate)) return;
            let obj = {};
            let year = Number(beforeDate.slice(0, 4));
            let month = Number(beforeDate.slice(5, -1));
            obj = {
                name: beforeDate,
                width: 130,
                align: "right",
                sortable:false
            }
            this.colNames1.splice(this.colNames1.length - 1, 0, `${year}年${month}期`);
            this.colModel.splice(this.colModel.length - 1, 0, obj)
            this.echartsDate.push(beforeDate)
            this.accountPeriods.push(beforeDate);
            if (beforeDate !== afterDate) {
                beforeDate = year * 12 + month;
                this.setColum(`${parseInt(beforeDate / 12)}年${(beforeDate % 12) + 1}期`, afterDate)
            }
        },
        scheduleShow() {
            let that = this;
            let find1 = this.subjectList.find(row => {
                that.feeScheduleVO.startYear = row.accountingYear;
                that.feeScheduleVO.startPeriod = row.accountingPeriod;
                return row.accountYearPeriodStr === this.formData.for1;
            })
            let find2 = this.subjectList.find(row => {
                that.feeScheduleVO.endYear = row.accountingYear;
                that.feeScheduleVO.endPeriod = row.accountingPeriod;
                return row.accountYearPeriodStr === this.formData.for2;
            })
            if (find1 && find2) {
                if (find1 === find2) {
                    return find1.accountYearPeriodStr;
                }
                return find1.accountYearPeriodStr + ' 至 ' + find2.accountYearPeriodStr;
            }
        },
        initTable() {
            this.jqGridInit(this.colNames1, this.colModel, this);
        },
        delTable() {
            $("#my_report").empty();// 清空表格内容
            var parent = $(".jqGrid_wrapper"); // 获得整个表格容器
            parent.empty();
            $("<table id='my_report'></table>").appendTo(parent);
        },
        // 生成jqGrid
        jqGridInit(colNames1, colModel1, that) {
            let _vm = this;
            let config = Object.assign({}, this.base_config, {
                colNames: colNames1,
                colModel: colModel1,
                loadComplete(ret) { // 非表格数据
                    _vm.dataList = ret.data;
                    console.log(_vm.dataList,'打印');
                    let data = jQuery("#my_report").jqGrid('getGridParam', 'data');
                    that.echartsLegend = data.map(row => row.name);
                    data.forEach(row => {
                        let obj = {
                            name: row.name,
                            type: 'line',
                            stack: '总量',
                            data: that.echartsDate.map(item => row[item])
                        };
                        that.echartsSeries.push(obj);
                    });
                },
                gridComplete: function () {
                    that.option = that.getOption();
                    that.openCharts = true;
                },
            });
            jQuery("#my_report").jqGrid(config);
        },
        open(ev) {
        },
        save() {
            if(vm.formData.for3===''){
                  this.$Message.info("请选择科目");
                  return;
            }
            this.colNames1 = ['编码', '名称', '本年累计'];
            this.colModel = [
                {name: 'subjectCode', width: 160,sortable:false},
                {name: 'subjectName', width: 185,sortable:false},
                {name: 'total', width: 130, align: "right", hidden: false,sortable:false},
            ]
            this.echartsDate = [];
            this.echartsSeries = [];
            this.echartsLegend = [];
            this.accountPeriods = [];
            this.setColum(this.formData.for1, this.formData.for2);
            this.feeScheduleVO.accountPeriods = vm.accountPeriods;
            this.feeScheduleVO.accountCode = vm.formData.for3;
            this.feeScheduleVO.accountShowFlag = vm.formData.for4;
            this.feeScheduleVO.showItemFlag = vm.formData.for5;
            this.feeScheduleVO.showSumAmountFlag = vm.formData.for6;
            this.feeScheduleVO.expandedFlag = vm.formData.for7;
            this.base_config.url = contextPath+"/feeSchedule/getFeeSchedule";
            this.base_config.postData = JSON.stringify(vm.feeScheduleVO);

            let length = this.colModel.length;
            if (!this.formData.for6) {
                this.colModel[length - 1].hidden = true;
            } else {
                this.colModel[length - 1].hidden = false;
            }
            this.initMethod();
            this.cancel();
        },
        getOption() {
            return {
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: this.echartsLegend
                },
                toolbox: {
                    show: true,
                    feature: {
                        mark: {show: true},
                        dataView: {show: true, readOnly: false},
                        magicType: {show: true, type: ['line']},
                        saveAsImage: {show: true}
                    }
                },
                calculable: true,
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        data: this.echartsDate
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: this.echartsSeries,
            };
        },
        more() {
            this.visible = true;
        },
        nomore() {
            this.visible = false;
        },
        cancel() {
            this.$refs.filter.visible = false;
            this.isFilterVisible = false;
        },
        getReload() {
            this.reload = false;
            this.openCharts = false;
        },
        refresh(){  //刷新
            this.save();
        },
        getFinanceAccounting() {
            var url = contextPath+"/accounting/getFinanceAccounting";
            $.ajax({
                type: 'post',
                async: true,
                url: url,
                success: function (result) {
                    var  data = result.data;
                    if(data!=null){
                        console.log(data);
                        vm.subjectList = data;
                        vm.formData.for1 = vm.subjectList[0].accountYearPeriodStr;
                        vm.formData.for2 = vm.subjectList[0].accountYearPeriodStr;
                    }
                },
                error: function (e) {
                    console.log(e);
                }
            });
        },
        printV(){
            //费用明细表打印
            let that = this;
            if (!that.dataList || !that.dataList.length) {
                that.$Message.error({
                    content: '无打印数据!',
                    duration: 3
                });
                return;
            }
            var colNames = [
                { 'name': '编码', 'col': 'subjectCode' },
                { 'name': '名称', 'col': 'subjectName' }];
            var accountPeriods =that.feeScheduleVO.accountPeriods;

            for(var i = 0;i<accountPeriods.length;i++){
                colNames[2+i]= {'name':accountPeriods[i],'col':accountPeriods[i]};
            }
            if(that.feeScheduleVO.showSumAmountFlag){ colNames[accountPeriods.length+2] = {'name':'本年累计','col':'total'};}
            console.log(colNames,'数组');
            var _info = {
                'title': '费用明细表',  // 标题
                'template': 1,  // 模板
                'titleInfo': [],
                'colNames': colNames,
                'styleCss': '',   // 自定义样式 例：  thead{text-align: center;font-size: 14px;font-weight: 100;}
                'colMaxLenght': accountPeriods.length+3,  // 显示最大长度， 默认为7
                'data': that.dataList,  // 打印数据  list
                'totalRow':false
            }
            console.log("点击打印,查看that.dataList: ");
            console.log(that.dataList);
            // 弹窗选择列 模式
            that.printInfo = _info;
            that.printModalShow(true);

        },
        printModalShow (_t) {
            this.printModal = _t;
        },
        exportExcel(){
            window.open(rcContextPath+"/feeSchedule/exportExcel");
        },
        closeWindow(){ window.parent.closeCurrentTab({ name: '费用明细表', openTime: this.openTime, exit: true });},
    },
    watch: {
        'formData.for7'(value, old) {
            //处理是否展开所有层级
            vm.save();
        },
        'formData.for8'(value, old) {
            if (value) {
                this.option = this.getOption();
                this.reload = true;
            }
        }
    },
    computed: {
        showDetail() {
            return !!this.formData.for6;
        },
    },
    created: function () {
        this.getFinanceAccounting();
    },
    mounted() {
        let that = this;
        this.initMethod(this.colNames, this.colModel, that);
        this.openTime = window.parent.params && window.parent.params.openTime;
    }
});