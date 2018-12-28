new Vue({
    el: '#bank-account-daily-report', //银行对账日报表
    data() {
        return {
            openData:{
                selectedDate: new Date(),
                isShowSubtotal:true,
                isShowDetail:true
            },
            filterVisible: false,
            base_config: {
                multiselect : true,
                mtype: 'POST',
                styleUI: 'Bootstrap',
                url: "",
                // ajaxGridOptions: { contentType: 'application/json;charset=utf-8' },
                datatype: 'json',
                // postData: JSON.stringify(This.feeScheduleVO),
                jsonReader: {
                    root: "list",
                    cell: "list",
                    // userdata: "data.userData",
                    repeatitems: false
                },

                viewrecords: true,
                rowNum: 99999,
            },
            colNames: [],
            colModel: [],
            tableHeaders:[],
            organisationList: [
                {label: "金大祥", value: 1},
                {label: "金大祥1", value: 2},
                {label: "金大祥2", value: 3},
            ],
            baseData:{
                standardCurrencyId: 1,
            },
            openTime:"",//用于控制退出按钮
            dataList: [],//用于封装每次查询的结果集
            printInfo:{},
            printModal: false,
        }
    },
    mounted() {
        this.pageInit();
        this.openTime = window.parent.params && window.parent.params.openTime;
    },
    methods:{

        printModalShow(_t) {
            this.printModal = _t;
        },

        pageInit () {
            let that = this;
            var _url = '';
            that.openData.selectedDate = (new Date(that.openData.selectedDate)).format("yyyy-MM-dd");
            jQuery("#grid").jqGrid(
                {
                    url: contextPath + '/bankstatementappcontroller/reportDetail',
                    postData: JSON.stringify(that.openData),
                    ajaxGridOptions: { contentType: 'application/json;charset=utf-8' },
                    datatype: "json",
                    colNames: ['科目代码', '科目名称', '币别', '银行名称', '银行账号','昨日余额', '今日借方', '今日贷方', '今日余额'],
                    colModel: [
                        {name: 'subjectCode', width: 80},
                        {name: 'subjectName', width: 100,},
                        {name: 'currencyName', width: 80,},
                        {name: 'bankName', width: 150,},
                        {name: 'bankAccount', width: 150,},
                        {name: 'yesterdayBalanceFor', width: 120,},
                        {name: 'debitAmountFor', width: 120,},
                        {name: 'creditAmountFor', width: 120,},
                        {name: 'todayBalanceFor', width: 120,},
                    ],
                    rowNum: 999999999,//一页显示多少条
                    mtype: "post",//向后台请求数据的ajax的类型。可选post,get
                    jsonReader: {
                        root: "data.bsrList",
                        total: "data.totalPage",
                        records: "data.totalCount",
                        cell: "list",
                    },
                    styleUI: 'Bootstrap',
                    height: $(window).height() - 100,
                    loadComplete: function (res) {
                        if(res.code != '100100'){
                            that.$Message.warning({
                                content: res.msg,
                                duration: 3,
                                closable: true});
                            return;
                        }
                        that.dataList = res.data.bsrList;
                    },
                })
        },
        open() {
            this.filterVisible = true;
        },
        refresh() {
            //刷新
            this.save();
        },
        save() {
            //打开弹出框点击 确定
            this.openData.selectedDate = (new Date(this.openData.selectedDate)).format("yyyy-MM-dd");
            let openData = this.openData;
            this.filterVisible = false;
            jQuery("#grid").setGridParam({ postData: JSON.stringify(openData) }).trigger('reloadGrid');
        },
        cancel() {
            this.filterVisible = false;
        },
        exportExcel(){
            //引出,导出
            let data = this.openData;
            let date = (new Date(data.selectedDate)).format("yyyy-MM-dd");
            let _url = contextPath+"/bankstatementappcontroller/reportExportExcel?selectedDateStr="+date+"&isShowDetail="+data.isShowDetail+"&isShowSubtotal="+data.isShowSubtotal;
            window.open(_url);
        },
        closeWindow(){
            //退出,关闭当前页签
            var name = '银行对账日报表';
            window.parent.closeCurrentTab({ name: name, openTime: this.openTime, exit: true })
        },
        printV(){
            //打印,支持用户自定义表头
            let that = this;
            if (!that.dataList || !that.dataList.length) {
                that.$Message.error({
                    content: '无打印数据!',
                    duration: 3
                });
                return;
            }
            console.log("点击打印,查看that.dataList: ");
            console.log(that.dataList);
            //单行表头
            var _info = {
                'title': '银行对账日报表',  // 标题
                'template': 1,  // 模板
                'titleInfo': [       // title
                    {'name': '公司名称', 'val': layui.data('user').currentOrgName},
                    {'name': '日期', 'val': that.openData.selectedDate},
                ],
                'colNames': [       // 列名与对应字段名
                    {'name': '科目代码', 'col': 'subjectCode'},
                    {'name': '科目名称', 'col': 'subjectName'},
                    {'name': '币别', 'col': 'currencyName'},
                    {'name': '银行名称  ', 'col': 'bankName'},
                    {'name': '银行账号', 'col': 'bankAccount'},
                    {'name': '昨日余额', 'col': 'yesterdayBalanceFor'},
                    {'name': '今日借方', 'col': 'debitAmountFor'},
                    {'name': '今日贷方', 'col': 'creditAmountFor'},
                    {'name': '今日余额', 'col': 'todayBalanceFor'},
                ],
                'styleCss': '',   // 自定义样式 例：  thead{text-align: center;font-size: 14px;font-weight: 100;}
                'colMaxLenght': 9,  // 显示最大长度， 默认为7
                'data': that.dataList,  // 打印数据  list
            };
            // 弹窗选择列 模式; 因为printModalShow这个组件里面封装了打印单表头的方法,所以不用再去调用htPrint()
            that.printInfo = _info;
            that.printModalShow(true);
        },
    },
});