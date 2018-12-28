new Vue({
    el: '#more-rows-detail',
    data () {
        return {
            curDate: (new Date()).format("yyyy-MM-dd"),
            openTime: '',
            initInfo: {
                pageType: 1,
                pageTitle: '多栏式明细账'
            },
            isInit: true,
            projectStatus:false,
            subjectStatus:true,
            showFilter: false,
            subjectVisiable: false,
            visible_filter: false,
            deleteVisible: false,
            deleteLoading: true,
            // 保存主表id
            id: '',
            auditStatus: '',
            confirmConfig: {
                showConfirm: false,
                title: '提示',
                content: '这是内容',
                onlySure: true,
                success: true
            },
            filterBody: {
                currencyId: '',
                accountBeginYear: '',
                accountEndYear: '',
                accountBeginPeriod: '',
                accountEndPeriod: '',
                accountBeginCode: '',
                showDisable: false,
                showDetail: false,
                noShowAndHappen: false,
                noShowAndHappenZero: false,
                unBill: false,
                projectItemClassId:'',
                projectItemId:''
            },
            currencyList:[],
            subjectList: [
                {name: '第一期', value: 1},
                {name: '第二期', value: 2},
                {name: '第三期', value: 3},
                {name: '第四期', value: 4},
                {name: '第五期', value: 5},
                {name: '第六期', value: 6},
                {name: '第七期', value: 7},
                {name: '第八期', value: 8},
                {name: '第九期', value: 9},
                {name: '第十期', value: 10},
                {name: '第十一期', value: 11},
                {name: '第十二期', value: 12}
            ],
            projectList:{},
            projectCategoryList:[],
            years: [],
        }
    },
    methods: {
        handlerData(){//请求表头及表体数据
            let This = this;
            if(This.filterBody.accountBeginCode == null || This.filterBody.accountBeginCode == ''){
                This.$Message.info('请先选择科目,再查询多栏账数据!');
                return;
            }
            var _url = contextPath+'/multiColumnAccountController/multiColumnAccountDetail';
            $.ajax({
                type: "POST",
                url: _url,
                contentType: 'application/json;charset=utf-8',
                data: JSON.stringify(This.filterBody),
                dataType: "json",
                success: function(data) {
                    console.log(data)
                    if(data.data == null){
                        This.$Modal.error({
                            title:'错误',
                            content:data==null||data.msg==null||data.msg==''?'页面初始化失败':data.msg
                        })
                        return;
                    }
                    This.clearTable();
                    if(!$.isEmptyObject(data.data)){
                        let tableData = data.data;
                        if(tableData.header.colModel){
                            $.each(tableData.header.colModel, function(idx, item){
                                if(item.name == 'voucherNumber'){
                                    item.formatter = function(value,options,rowData){
                                        $(document).off('click', '.voucher' + rowData.voucherId).on('click', '.voucher' + rowData.voucherId, function () {
                                            This.voucherDetail(rowData);
                                        });
                                        let btn = `<a class="voucher${rowData.voucherId}">${value}</a>`;
                                        return value === undefined ? "" : btn;
                                    }
                                }else if(item.name == 'debitMoney'){
                                    item.formatter = function(value,options,rowData){
                                        // return value == 0 ? "" : value;
                                        return This.formartMoney(value);
                                    }
                                }else if(item.name == 'creditMoney'){
                                    item.formatter = function(value,options,rowData){
                                        return This.formartMoney(value);
                                    }
                                }else if(item.name == 'balance'){
                                    item.formatter = function(value,options,rowData){
                                        return This.formartMoney(value);
                                    }
                                }
                            });
                            /*tableData.header.colModel.map((item, index)=>{
                                if(item.name == 'voucherNumber'){
                                item.formatter = function(value,options,rowData){
                                    $(document).off('click', '.voucher' + rowData.voucherId).on('click', '.voucher' + rowData.voucherId, function () {
                                        This.voucherDetail(rowData);
                                    });
                                    let btn = `<a class="voucher${rowData.voucherId}">${value}</a>`;
                                    return value === undefined ? "" : btn;
                                };

                                if(item.name == 'debitMoney'){
                                    item.formatter = function(value,options,rowData){
                                        return '123123';
                                    }
                                }


                            });*/
                        }
                        This.reportInit(tableData);
                    }else{
                        This.$Message.error(data.msg)
                    }
                },
                error: function(err){
                    console.log("服务器出错");
                },
            });
        },
        formartMoney (value) {
            return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
        },
        voucherDetail(rowData){
            let url = contextPath + '/finance/voucher-lrt/index.html?voucherId='+rowData.voucherId+"&sobId="+rowData.sobId;
            console.log(url)
            window.parent.activeEvent({name: '查看凭证', url: url, params: null});
        },
        reportInit(data){//生成表格
            let This = this;
            let config = Object.assign({}, {
                pager: '#my_pager',
                // scroll: "true",
                styleUI: 'Bootstrap',
                dataType:'local',
                shrinkToFit:false,
                    autoScroll: true,
                    height: $(window).height() -120,
                // width: window.screen.availWidth - 20,
                // viewrecords: true,
                // caption: "多栏明细账",
                ...data.header,
                gridComplete() {
                if(This.isInit){
                    jQuery("#my_report").jqGrid('setGroupHeaders', {
                        useColSpanStyle: true,
                        groupHeaders: [
                            {startColumnName: data.header.startTitle, numberOfColumns: data.header.colNames.length, titleText: data.header.title}
                        ]
                    });
                }
                This.isInit = false;
                },
                loadComplete:function (ret) {
                    console.log(ret)
                    if(ret.subjectName){
                        $(this).jqGrid("setCaption","科目："+ret.subjectName);
                    }
                }
            });
            jQuery("#my_report").jqGrid(config);
            let length = data.list.length;
            for(let i=0; i < length;i++){
                $("#my_report").jqGrid('addRowData',i+1,data.list[i]);
            }
        },

        // 清除表格
        clearTable() {
            var parent = $(".jqGrid_wrapper")
            parent.empty();
            $("<table id=\"my_report\"></table>").appendTo(parent);
            $("<div id=\"my_pager\"></div>").appendTo(parent);
            this.isInit = true;
        },
        getFinanceYearPeriod(){
            let v = this;
            $.ajax({
                type: 'POST',
                data: null,
                url: contextPath+'/voucherController/getFinanceYearPeriod',
                dataType: 'json',
                success: function (res) {
                    console.log(res)
                    v.years = res.data;
                    //设置年度
                    v.filterBody.accountBeginYear = v.years[0].value;
                    v.filterBody.accountEndYear = v.years[0].value;
                    //设置期间

                }
            });
        },
        handleOpen () {
            this.visible_filter = true;
        },
        iconPopup () {
            this.subjectVisiable = true;
        },
        subjectClose () {
            this.subjectVisiable = false;
        },
        subjectDate (value) {
            console.log(value);
            let subjectCode = value.subjectCode;
            let  _v = this;
            $.ajax({
                type: 'POST',
                data: {'subjectCode':subjectCode},
                url: contextPath+'/multiColumnAccountController/checkAndGetProjectByCode',
                dataType: 'json',
                success: function (res) {
                    console.log(res)
                    if(res.code == '-1'){
                        _v.$Message.error(res.msg)
                    }else{
                        _v.filterBody.accountBeginCode = value.subjectCode;
                        if(res.data!=1){
                            //有核算项目
                            _v.projectCategoryList = res.data;
                            _v.filterBody.projectItemClassId = _v.projectCategoryList[0].id;
                            _v.projectStatus = true;
                            _v.subjectStatus = false;
                        }else{
                            //父节点，没有核算项目，清空数据
                            _v.filterBody.projectItemClassId='';
                            _v.filterBody.projectItemId='';
                            _v.projectStatus = false;
                            _v.subjectStatus = true;
                        }
                    }
                }
            });
        },
        sure (type) {
            if(!type){
                this.visible_filter = false;
            }else{
                //请求数据刷新页面
                if(this.filterBody.accountBeginCode != null && this.filterBody.accountBeginCode != ''){
                    this.handlerData();
                }
                this.visible_filter = false;
            }
        },
        getProjectList(){
            let _vm = this;
            $.ajax({
                type: 'POST',
                data: null,
                url: contextPath+'/multiColumnAccountController/getProjectList',
                dataType: 'json',
                success: function (res) {
                    console.log(res)
                    _vm.projectList = res.data;
                }
            });
        },
        refreshData(){
            this.handlerData();
        },
        showVoucher(){
            let rowid = jQuery("#my_report").jqGrid("getGridParam", "selrow");
            if(rowid == null){
                this.$Message.error('请选择一条明细')
                return false;
            }
            var rowData = jQuery("#my_report").getRowData(rowid);  //1.获取选中行的数据
            if(rowData.voucherId != null && rowData.voucherId != 0) {
                voucherDetail(rowData);
            }
        },
        exitDetail(){
            //关闭当前页签
            var name = '多栏账';
            window.parent.closeCurrentTab({ name: name, openTime: this.openTime, exit: true })
        },
        exportExcel(){
            let _vm = this.filterBody;
            let _url = contextPath+"/multiColumnAccountController/exportExcel?accountBeginYear="+_vm.accountBeginYear
            +"&accountBeginYear="+_vm.accountBeginYear+"&accountEndYear="+_vm.accountEndYear
            +"&accountBeginPeriod="+_vm.accountBeginPeriod+"&accountEndPeriod="+_vm.accountEndPeriod
            +"&accountBeginCode="+_vm.accountBeginCode+"&showDisable="+_vm.showDisable
            +"&showDetail="+_vm.showDetail+"&noShowAndHappen="+_vm.noShowAndHappen
            +"&noShowAndHappenZero="+_vm.noShowAndHappenZero+"&unBill="+_vm.unBill
            +"&projectItemClassId="+_vm.projectItemClassId+"&projectItemId="+_vm.projectItemId;
            console.log(_url)
            window.open(_url);
        },
        initMoreRows(){
            let that = this;
            $.ajax({
                type: 'POST',
                data: null,
                url: contextPath+'/multiColumnAccountController/init',
                dataType: 'json',
                success: function(ret){
                    if(ret.code == '100100'){
                        that.currencyList = ret.data.currencyList;
                        that.filterBody.currencyId = ret.data.currencyList[0].id;
                        that.projectList = ret.data.projectList;
                    }else{
                        that.$Modal.error({
                            title:'错误',
                            content:'页面初始化失败'
                        })
                    }
                }
            });
        },
    },
    mounted () {
        this.openTime = window.parent.params && window.parent.params.openTime;
        this.handlerData();
        this.getFinanceYearPeriod();
        this.initMoreRows();
        // this.getProjectList();
    }
})