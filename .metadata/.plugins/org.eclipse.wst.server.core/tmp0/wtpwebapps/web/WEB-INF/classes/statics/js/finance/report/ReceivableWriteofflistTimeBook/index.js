new Vue({
    el: '#paymentReceiptTimeBook',
    data () {
        return {
            openTime: '',   //用于控制退出按钮
            curDate: (new Date()).format("yyyy-MM-dd"),
            initInfo: {
                pageType: 1,
                pageTitle: '核销单据序时簿'
            },
            isInit: true,
            showFilter: false,
            subjectVisable: false,
            visible_filter: false,
            deleteVisible: false,
            deleteLoading: true,
            viewReportTxt: '',
            voucherModelTxt: '',
            showVoucherVisible: false,
            viewReportVisible: false,
            // 保存主表id
            id: '',
            voucherId:0,
            sobId:0,
            //主表id集合
            ids: [],
            selected: [],
            auditStatus: '',
            curData: {},
            confirmConfig: {
                showConfirm: false,
                title: '提示',
                content: '这是内容',
                onlySure: true,
                success: true
            },
            filterBody: {
                timeStart: (new Date()).format("yyyy-MM-dd"),
                timeEnd: (new Date()).format("yyyy-MM-dd"),
                dateScore: '',
                auditStatus: '',
                isVoucher: '',
                documentNumber: '',
                sobId: 1
            },
            detailDate: [
                {
                    label: '今天',
                    value: 'today'
                },
                {
                    label: '昨天',
                    value: 'yesterday'
                },
                {
                    label: '近7天',
                    value: 'interval7'
                },
                {
                    label: '近30天',
                    value: 'interval30'
                },
                {
                    label: '本月',
                    value: 'thisMon'
                },
                {
                    label: '上月',
                    value: 'lastMon'
                },
                {
                    label: '本季度',
                    value: 'thisQuarter'
                },
                // {
                //     label: '上季度',
                //     value: 'lastQuarter'
                // },
                {
                    label: '本年',
                    value: 'thisYear'
                },
                {
                    label: '去年',
                    value: 'lastYear'
                }
            ],
            auditStatusList: [
                {
                    label: '未审核',
                    value: 1
                },
                {
                    label: '已审核',
                    value: 2
                }
            ],
            isVoucherList: [
                {
                    label: '未记账',
                    value: 1
                },
                {
                    label: '已记账',
                    value: 2
                }
            ],
            lodoPList: [],
            printModal: false,
            printInfo: {},
        }
    },
    methods: {
        //批量选中清空数组
        // beforeRequest : function(){
        //     that.selectListId = [];
        // },
        //获取应收应付系统当前会计期间的第一天和最后一天
        _getData(){
            var that = this;
            var _url = baseURL + 'verificationSheet/getData';
            http.post(_url, '').then((json) => {
                    if (json.code === '100100') {
                    that.filterBody.timeStart = json.data.startDate;
                    that.filterBody.timeEnd = json.data.endDate;
                    console.log(" that.filterBody", that.filterBody)
                    that.pageInit();
                }
            }, (json) => { })
        },
        sortData (value, grid, rows, state) {
            let str = "";
            value.map(function (val, index) {
                if (typeof val === "number") {
                    val = accounting.formatMoney(val, '', 2);
                }
                str += "<div class='sumCol'>" + val + "</div>"
            })
            return str;
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
            var _url = baseURL + 'verificationSheet/queryVerification?r=' + new Date().getTime();
            jQuery("#list").jqGrid(
                {
                    url: _url,
                    postData: JSON.stringify(that.filterBody),
                    multiselect: true,
                    ajaxGridOptions: { contentType: 'application/json;charset=utf-8' },
                    datatype: "json",
                    colNames: ['index','审核标志', '日期', '单据编号', '凭证字号', '核销类型', '客户', '转出客户', '转入客户',
                        '供应商', '转出供应商', '转入供应商', '核销金额（本位币）', '摘要', '制单人', '业务员', '审核人', '备注', 'sobId', 'createId', 'verificationType', 'voucherId', 'documentDate1','id'],
                    colModel: [
                        {name : 'index', hidden: true ,key : true},
                        {
                            name: 'auditStatus', width: 70,
                            formatter: function (value, grid, rows, state) {
                                if (value === '合计') {
                                    return value;
                                } else {
                                    return value === 2 ? "Y" : "N"
                                }
                            }
                        },
                        {
                            name: 'documentDate', index: 'orderDate', width: 90,
                            formatter: function (value, grid, rows, state) {
                                return value ? value.slice(0, 10) : ''
                            }
                        },
                        { name: 'billNumber', width: 80, align: "left" },
                        { name: 'voucherSize', width: 80, align: "right" },
                        { name: 'verificationTypeName', width: 80, align: "right" },
                        {
                            name: 'occurrenceObjectOne', width: 80, align: "right",
                            formatter: function (value, grid, rows, state) {
                                //console.log("value", value, grid, rows, state);
                                if (rows.verificationType === 1 || rows.verificationType === 2 || rows.verificationType === 4) {
                                    return value || '';
                                } else {
                                    return '';
                                }
                            }
                        },
                        {
                            name: 'occurrenceObjectOne', width: 80, align: "right",
                            formatter: function (value, grid, rows, state) {
                                if (rows.verificationType === 5) {
                                    return rows.occurrenceObjectOne || '';
                                } else {
                                    return '';
                                }
                                //return (rows.verificationType === 5 ? value || '' : '');
                            }
                        },
                        {
                            name: 'occurrenceObjectOne', width: 80, align: "right",
                            formatter: function (value, grid, rows, state) {
                                if (rows.verificationType === 5) {
                                    return rows.occurrenceObjectTwo || '';
                                } else {
                                    return '';
                                }
                                // return (rows.verificationType === 5 ? value || '' : '');
                            }
                        },
                        {
                            name: 'occurrenceObjectTwo', width: 80, align: "right",
                            formatter: function (value, grid, rows, state) {
                                if (rows.verificationType === 2 || rows.verificationType === 3 || rows.verificationType === 4) {
                                    return value || '';
                                } else {
                                    return '';
                                }
                            }
                        },
                        {
                            name: 'occurrenceObjectTwo', width: 80, align: "right",
                            formatter: function (value, grid, rows, state) {
                                if (rows.verificationType === 6) {
                                    return rows.occurrenceObjectOne || '';
                                } else {
                                    return '';
                                }
                                // return (rows.verificationType === 6 ? value || '' : '');
                            }
                        },
                        {
                            name: 'occurrenceObjectTwo', width: 80, align: "right",
                            formatter: function (value, grid, rows, state) {
                                if (rows.verificationType === 6) {
                                    return rows.occurrenceObjectTwo || '';
                                } else {
                                    return '';
                                }
                                return (rows.verificationType === 6 ? value || '' : '');
                            }
                        },
                        { name: 'thisTiemCancellation', width: 80, align: "right",formatter: function (value, grid, rows, state) {
                            return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
                        } },
                        { name: 'summary', width: 80, align: "right" },
                        { name: 'createName', width: 80, align: "right" },
                        { name: 'salesman', width: 80, align: "right" },
                        { name: 'auditorName', width: 80, align: "right" },
                        { name: 'remark', width: 80, align: "right" },
                        { name: 'sobId', hidden: true },
                        { name: 'createId', hidden: true },
                        { name: 'verificationType', hidden: true },
                        { name: 'voucherId', hidden: true },
                        { name: 'documentDate1', hidden: true },
                        { name: 'id', hidden: true },

                    ],
                    rowNum: 999999999,//一页显示多少条
                    // rowList : [ 10, 20, 30 ],//可供用户选择一页显示多少条
                    // pager : '#pager',//表格页脚的占位符(一般是div)的id
                    // sortname: 'orderDate',//初始化的时候排序的字段
                    sortorder: "desc",//排序方式,可选desc,asc
                    mtype: "post",//向后台请求数据的ajax的类型。可选post,get
                    jsonReader: {
                        root: "data",
                    },
                    sortable: false,
                    styleUI: 'Bootstrap',
                    height: $(window).height() * 0.7,
                    viewrecords: true,
                    // caption: that.initInfo.pageTitle,//表格的标题名字
                    footerrow: true,
                    userDataOnFooter: true,
                    gridComplete: that.completeMethod,

                    onSelectAll: function (data, status) { // 且点击头部的checkbox时才会触发此事件
                            that.handlerId(data, status);
                            that.getListId()
                            console.log(that.selected, "===")
                        // that.getListId(that.selected, that.selectedId, that.tableList)
                    },
                    onSelectRow: function (data, status) { // 当选择行时触发此事件
                        console.log("data---------", data, status);
                        if (!!data) {
                            that.handlerId(data, status);
                            console.log(that.selected,"===")
                            that.getListId()
                        }
                    },
                    loadComplete: function (xhr) {
                        console.log(xhr, '===========xhr=');
                        var _text = '';
                        if (xhr.code === '100100'){
                            _text = xhr.msg;
                        }else {
                            _text = xhr.msg;
                        }
                        that.$Message.info({
                            content: _text,
                            duration: 3
                        });

                        if (xhr.data !== null && xhr.data.length !== 0){
                            that.sobId = xhr.data[0].sobId;
                        }
                        that.lodoPList = xhr.data || [];


                    },
                    // onCellSelect: function (rowid) {
                    //     let rowData = jQuery("#list").jqGrid('getRowData', rowid);
                    //     console.log(rowData, "---------=>")
                    //     // 用于保存主表id 确保后续操作
                    //     that.id = rowid;
                    //     that.curData = rowData;
                    //     that.auditStatus = rowData['auditStatus'] || '';
                    // },
                    ondblClickRow: function (rowid) {
                        // 双击事件
                        // //console.log(7574777579757)
                        let rowData = jQuery("#list").jqGrid('getRowData', rowid);
                        // var _url = `${baseURLPage}ReceivableWriteofflist/index.html?id=${rowid}&sobId=${rowData.sobId}&action=query`;
                        console.log("rowid",rowid)
                        var _url = contextPath + '/finance/ReceivableWriteofflist/index.html?id=' + rowData.id + "&sobId=" + rowData.sobId + '&action=query';
                        // window.open(_url, '_blank')
                        window.parent.activeEvent({ 'name': '核销单', 'url': _url });
                    }
                })
        },
        //解析index 获取到id数组
        getListId(){
            var that = this;
            var ids = [];
            var voucherIds = [];
            // console.log(that.lodoPList,that.selected,"=====")
            //     that.selected.forEach(item2 => {
            //         that.lodoPList.forEach(item1 => {
            //        if(parseInt(item1.index) === parseInt(item2)){
            //            ids.push(item1.id);
            //            voucherIds.push(item1.voucherId);
            //            that.curData = item1;
            //         }
            //     });
            // });
            that.selected.forEach(item2 => {
                let _find = this.lodoPList.find(item1 => parseInt(item1.index) === parseInt(item2));
                    ids.push(_find.id);
                    that.voucherId = _find.voucherId;
                    that.curData = _find;
            });
            ids = Array.from(new Set(ids));
            that.ids = ids;
            if(that.ids.length > 0){
                that.id = ids[0];
            }
            console.log("that.curData",that.curData)
            console.log("ids====>>" ,that.ids,that.id);
        },
        handlerId(data, status){
            if(typeof data === 'object' && status){
                this.selected = data
            }
            if(typeof data === 'object' && !status){
                this.selected = [];
            }
            if(typeof data === 'string'){
                if(status){
                    (this.selected.indexOf(data.toString()) > -1) ? null : this.selected.push(data.toString());
                }else {
                    let index = this.selected.indexOf(data.toString());
                    index > -1 ? this.selected.splice(index, 1) : null;
                }
            }
            console.log("---",this.selected)
        },
        getVoucher () {
            //查看凭证
            var that = this;
            console.log("查看凭证前校验: 凭证id为: ===" + that.voucherId + ", 账套id为:===" + that.sobId);
            if (that.voucherId === 0 || that.voucherId === '') {
                that.$Message.info({
                    content: '请选择单据,或者该单据未生成凭证.',
                    duration: 3
                });
                return;
            }
            var _voucherId = that.voucherId;
            var _sobId = that.sobId ;
            //var _url = `${baseURLPage}voucher-lrt/index.html?voucherId=${_voucherId}&sobId=${_sobId}`;
            var _url = rcContextPath + '/finance/voucher-lrt/index.html?voucherId=' + _voucherId + "&sobId=" + _sobId;
            //window.parent.activeEvent({ 'name': '查看凭证', 'url': _url });

            //let url = 'voucher-lrt/index.html?voucherId='+rowData.voucherId+"&sobId="+rowData.sobId;
            window.parent.activeEvent({ name: '查看凭证', url: _url, params: null });
        },
        setVoucher () {
            //生成凭证
            var that = this;
            var _url = baseURL + 'verificationSheet/setVoucher';
            var _info = JSON.stringify({
                'id': that.id,
                'sobId': that.sobId || 1,
                'documentDate': that.curData.documentDate1,
                'userId': that.curData.createId
            });
            http.post(_url, _info).then((d) => {
                var _txt = '';
                if (d.code === '100100') {
                    //成功后执行一次刷新
                    // $('#list').setGridParam({ postData: JSON.stringify(this.filterBody) }).trigger("reloadGrid");
                    _txt = d.msg;
                    that.sure(true);
                } else {
                    _txt = d.msg;
                }
                that.$Message.info({
                    content: _txt,
                    duration: 3
                });
            }, (d) => {
                //TODO 处理请求fail
                //console.log(json, '==处理请求fail');
            })
        },
        completeMethod () {
            $("#list").footerData('set', {
                "auditStatus": '合计',
                'thisTiemCancellation': [0],
            });
            var sum_thisTiemCancellation = this.getColSum('thisTiemCancellation')

            $("#list").footerData('set', {
                "auditStatus": '合计',
                'thisTiemCancellation': sum_thisTiemCancellation,
            });

        },
        handleOpen () {
            this.visible_filter = true;
        },
        detailClick (data) {

        },
        iconPopup (type) {
            this.subjectVisable = true;
        },
        //关闭选择科目弹窗
        subjectClose () {
            this.subjectVisable = false;
        },
        conformCancel () {
            this.confirmConfig.showConfirm = false;
        },
        conformSure () {
            this.confirmConfig.showConfirm = false;
            this.confirmConfig.onlySure = !this.confirmConfig.onlySure;
        },
        //点击保存，获取所选科目id
        subjectDate (value) {
            // this.search.ieSubject = value;
            // //console.log(this.search.ieSubject);
        },
        sure (type) {
            //console.log(this.filterBody)
            if (type === false) {

            } else {
                id: '',
                    this.voucherId=0,
                    this.sobId=0,
                    //主表id集合
                    this.ids= [],
                    this.selected= [],
                    this.auditStatus= '',
                    this.curData= {},
                    $('#list').setGridParam({ postData: JSON.stringify(this.filterBody) }).trigger("reloadGrid");
            }
            this.visible_filter = false;
        },
        addRow () {
            // 打开页面方式 是新打开一个标签，待主体框架完善 TODO..  , 目前为模拟打开页面
            // window.open(`${baseURL}modules/ReceivableWriteofflist/index.html`, '_blank')
            //var _url = `${baseURLPage}/finance/ReceivableWriteofflist/index.html`;
            var _url = rcContextPath + '/finance/ReceivableWriteofflist/index.html';
            window.parent.activeEvent({ 'name': '核销单', 'url': _url });
        },
        delRow () {
            //console.log("del")
            if (this.id === '') {
                this.$Message.info({
                    content: '请选择要删除的数据',
                    duration: 3
                });
            } else {
                this.deleteVisible = true;
            }

        },
        // 删除 单据
        deleteOK: function () {
            var that = this;
            var _url = baseURL + 'verificationSheet/batchDeletion';
            var _info = {
                'receiptId': that.ids,
            }
            http.post(_url, JSON.stringify(_info)).then(() => {
                var _txt = '';
                if (d.code === '100100') {
                    that.voucherModelTxt = d.data.strBuffer;
                    that.ids = [];
                    // var _t = '报告内容：';
                    // d.data.log.forEach((_item) => {
                    //     _t += `${_item} , `;
                    // })
                    that.viewReportTxt = d.data.buffer;
                    that.showVoucher(true);
                    // $('#list').setGridParam({ postData: JSON.stringify(that.filterBody) }).trigger("reloadGrid");
                } else {
                    _txt = d.msg;
                    that.$Message.info({
                        content: _txt,
                        duration: 3
                    });
                }
                //是否确认删除提示框
                that.deleteVisible = false;
            }, (d) => {
                ////console.log(json, '==处理请求fail');
            })

        },
        copyRow () {
            //console.log("复制");
            if (this.id === '') {
                this.$Message.info({
                    content: '请选择一条数据',
                    duration: 3
                });
            } else {
                // 打开页面方式 是新打开一个标签，待主体框架完善 TODO..  , 目前为模拟打开页面
                // window.open(`${baseURL}modules/ReceivableWriteofflist/index.html?id=${this.id}&sobId=${this.curData.sobId}`, '_blank')
                // var _url = `${baseURLPage}/finance/ReceivableWriteofflist/index.html?id=${this.id}&sobId=${this.curData.sobId}`;
                var _url = rcContextPath + '/finance/ReceivableWriteofflist/index.html?id=' + this.id + "&sobId=" + this.curData.sobId;
                window.parent.activeEvent({ 'name': '核销单', 'url': _url });
            }

        },
        //审核/反审核
        reviewAction (type) {
            var that = this;
            var _bool = false, _msg = '';

            if (that.ids.length === 0) {
                _bool = true;
                _msg = '请选择一条数据';
            }
            //  else {
            //     type === 'review' && that.curData.auditStatus === 2 && (_bool = true, _msg = '该单据已审核')
            //     type === 'reReview' && that.curData.auditStatus === 1 && (_bool = true, _msg = '该单据未审核')
            // }
            if (_bool) {
                that.$Message.info({
                    content: _msg,
                    duration: 3
                });
                return;
            }
            var _url = '';
            if ('review' === type){
                _url = baseURL + 'verificationSheet/batchAudit';
            }else if('reReview' === type){
                _url = baseURL + 'verificationSheet/batchCounterAudit';
            }

            // let _formData = new FormData();
            // _formData.append('receiptId', that.ids);
            // _formData.append('sobId', that.curData.sobId || 1);
            // _formData.append("documentDate", that.curData.documentDate1);
            // _formData.append("userId", that.curData.createId);
            console.log("that.ids",that.ids);
            var _info = {
                'receiptId': that.ids,
            }
            console.log("_info",_info)
            http.post(_url, JSON.stringify(_info)).then((d) => {
                var _txt = '';
                if (d.code === '100100') {
                    if ('review' === type){
                        that.voucherModelTxt = d.data.strBuffer;
                    }else if('reReview' === type) {
                        that.voucherModelTxt = d.data.strBuffer;
                    }
                    that.ids = [];
                    //     var _t = '报告内容：';
                    //     d.data.log.forEach((_item) => {
                    //         _t += `${_item} , `;
                    //      })
                    that.viewReportTxt = d.data.buffer;

                    that.showVoucher(true);
                    // $('#list').setGridParam({ postData: JSON.stringify(that.filterBody) }).trigger("reloadGrid");

                } else {
                    _txt = d.msg;
                    that.$Message.info({
                        content: _txt,
                        duration: 3
                    });
                }

            }, (d) => {
                //TODO 处理请求fail
                ////console.log(json, '==处理请求fail');
            })
        },
        reReview () {
            //console.log("反审核")
        },
        derivation () {
            // var _that = this;
            // var _url =  baseURL + 'verificationSheet/exportExcel';
            // var parma = JSON.stringify(_that.filterBody);
            // console.log("parma------->",parma);
            // $.ajax({
            //         type: 'post',
            //         async: true,
            //         data: parma,
            //         url: _url,
            //         dataType: 'json',
            //         contentType: 'application/json;charset=utf-8',
            //         success: function (d) {
            //             var _txt = '';
            //             if (d.code === '100100') {
            //                 _txt = d.msg;
            //                 console.log("d=------------->",d)
            //                 //this.queryById(d.data.id);
            //             } else {
            //                 _txt = d.msg;
            //             }
            //             _that.$Message.info({
            //                 content: _txt,
            //                 duration: 3
            //             });
            //         }
            // })
            var _that = this;
            console.log("引出,导出excel...");
            var _data = '';
            // for (let key in this.filterBody) {
            //     _data += `${key}=${this.filterBody[key]}&`;
            // }
            var timeStart =  _that.filterBody.timeStart.format("yyyy-MM-dd");
            var timeEnd =  _that.filterBody.timeEnd.format("yyyy-MM-dd");
            _data = 'timeStart='+timeStart+'&timeEnd='+timeEnd+
            '&dateScore='+_that.filterBody.dateScore+
            '&auditStatus='+_that.filterBody.auditStatus+
            '&isVoucher='+_that.filterBody.isVoucher+
            '&documentNumber='+_that.filterBody.documentNumber+
            '&auditStatus='+_that.filterBody.sobId;
            // _data = _data.slice(0, _data.length - 1);
            console.log("data====>", _data)
            // window.open(`${contextPath}/verificationSheet/exportExcel?${_data}`);
            window.open(contextPath + '/verificationSheet/exportExcel?' + _data);
        },
        print () {
            var that = this;
            //console.log("打印")
            // window.print();
            // printJS('paymentReceiptTimeBook', 'html');
            console.log(that.lodoPList, '=========that.lodoPList');
            if (!that.lodoPList || !that.lodoPList.length) {
                that.$Message.info({
                    content: '无打印数据',
                    duration: 3
                });
                return;
            }
            that.lodoPList.forEach(item => {
                item.auditStatus = item.auditStatus === 2 ? "Y" : "N";
                item.thisTiemCancellation = accounting.formatNumber(item.thisTiemCancellation, 2, ",");
            });
            var _info = {
                'title': '核销单序时簿',  // 标题
                'template': 1,  // 模板
                // 'titleInfo': [       // title 
                //     { 'name': '日期', 'val': '2018-07-24' },
                //     { 'name': '单据编号', 'val': 'billNumber' },
                //     { 'name': '凭证字号', 'val': 'voucherSize' },
                //     { 'name': '核销类型', 'val': 'verificationTypeName' }
                // ],
                'colNames': [       // 列名与对应字段名
                    { 'name': '审核标志', 'col': 'auditStatus' },
                    { 'name': '日期', 'col': 'documentDate' },
                    { 'name': '单据编号', 'col': 'billNumber' },
                    { 'name': '凭证字号', 'col': 'voucherSize' },
                    { 'name': '核销类型', 'col': 'verificationTypeName' },
                    { 'name': '供应商', 'col': 'occurrenceObjectOne' },
                    { 'name': '转出供应商', 'col': 'occurrenceObjectTwo' },
                    { 'name': '核销金额（本位币）', 'col': 'thisTiemCancellation', 'sum': true },
                ],
                'styleCss': '',   // 自定义样式 例：  thead{text-align: center;font-size: 14px;font-weight: 100;}
                'colMaxLenght': 9,  // 显示最大长度， 默认为7
                'data': that.lodoPList,  // 打印数据  list
            }
            // 弹窗选择列 模式
            that.printInfo = _info;
            that.printModalShow(true);

            //不带值正常打印,带值高级打印
            // htPrint(_info);
            // htPrint();
        },
        printModalShow (_t) {
            this.printModal = _t;
        },
        voucher () {
            //console.log("凭证1111111")
        },
        closeWindow: function () {
            //关闭当前页签
            var name = '核销单据序时簿';
            window.parent.closeCurrentTab({ 'name': name, 'openTime': this.openTime, 'url': this.openTime, exit: true })
        },
        showViewReport () {
            this.viewReportVisible = !this.viewReportVisible;
        },
        accordingAction () {
            var that = this;
            that.showVoucher(false);
            that.showVoucherVisibleClose();
            that.sure(true);
        },
        showVoucher (_bool) {
            this.showVoucherVisible = _bool;
        },
        showVoucherVisibleClose () {
            $('#list').setGridParam({ postData: JSON.stringify(this.filterBody) }).trigger("reloadGrid");
            this.ids = [];
        },
    },
    computed: {

        selectRowDisabled () {
            return (this.id === '');
        },

    },
    mounted () {

        this._getData();
        this.openTime = window.parent.params && window.parent.params.openTime;
    }
})