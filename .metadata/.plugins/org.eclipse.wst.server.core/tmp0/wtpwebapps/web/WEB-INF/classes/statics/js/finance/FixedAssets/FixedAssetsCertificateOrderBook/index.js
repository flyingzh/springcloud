let vm = new Vue({
    el: '#check-voucher',
    data() {
        return {
            formData:{
                startVoucherDate:'',
                endVoucherDate:'',
                voucherGroupId:'',
                voucherNumberStr:'',
                audited:'',
                posted:'',
                voucherStatus: false,
                startAmmount: '',
                endAmmount:'',
                preparerName: '',
                currencyId:'',
                subjectCode:'',
                itemClassId: '',
                itemId:'',
                explains:'',
                currencyName:'',
                onSelectRowValue:'',
                belongSystem:4
            },
            subjectList: [],
            formDataList:[
                {label:'（空）',value:''},
                {label:'客户',value:1},
                {label:'部门',value:2},
                {label:'职员',value:3},
                {label:'仓库',value:4},
                {label:'供应商',value:5},
            ],
            formAccountingTypeDataList:[
                {label:'（空）',value:''},
                {label:'客户',value:1},
                {label:'部门',value:2},
                {label:'职员',value:3},
                {label:'仓库',value:4},
                {label:'供应商',value:5},
            ],
            formAccountingTypeDataList2:[
                {id:'',name:'全部'}
            ],
            formVoucherDataList : [
                {id:'',name:'不限'}
            ],
            formStatusDataList:[
                {id:'',name:'不限'},
                {id:2,name:'未审核'},
                {id:1,name:'已审核'}
            ],
            formCurrencyDataList:[
                {id:'',currencyName:'所有币别'},
            ],
            visible:false,
            subjectVisable:false,
            url:"../voucher-lrt/tree-duli.json",
            option: {},
            reload:false,
            selected:[],
            insertVisible:false,
            insertOkDisabled:false,
            insertOkLoading:false,
            attachmentVisible:false,
            addAttachmentVis:false,
            htClipShow:false,
            addSearch:"",
            uploadExlVisible:false,
            viewReportVisible:false,
            isContinue:false,
            voucherModelTxt:'',
            viewReportTxt:'',
            showVoucherVisible: false,
            upload_config: {
                url: contextPath+'/voucherController/uploadVoucherByExcel',
                uploadType: '父级文件导入'
            },
            filterVisible: false,
        }
    },
    methods: {
        openFun(){
            this.filterVisible = true;
        },
        pageInit() {
            let That = this;
            var jqGridData = jQuery("#grid").jqGrid( {
                    multiselect : true,
                    url: contextPath+'/voucherController/queryMechanismCertificate',
                    ajaxGridOptions: { contentType: 'application/json;charset=utf-8' },
                    serializeGridData: function (postData) {
                        return JSON.stringify(postData);
                    },
                    datatype : "json",
                    postData: That.formData,
                    styleUI: 'Bootstrap',
                    width:"99%",
                    autowidth:true,
                    mtype: "POST",
                    jsonReader: {
                        root: "data.rows",
                        page: "data.page",
                        total: "data.total",
                        records: "data.records",
                        cell: "cell",
                        repeatitems: true
                    },
                    colNames:['审核','过账','日期','凭证字号','摘要','科目代码','科目名称','币别','汇率','原币金额','借方金额','贷方金额',/*'附件',*/'制单人','审核人','操作'/*,'审核状态','机制凭证'*/],
                    colModel: [
                        {name: 'audited', index :'audited', width: 60,sortable: false, title:false},
                        {name: 'posted', index :'posted', width: 60,sortable: false, title:false},
                        {name: 'date', index :'date', width: 120, title:false},
                        {name:"mark", index :'mark',width: 100,  title:false,
                            formatter: function (value, grid, rows, state) {
                                $(document).off("click",".mark"+grid.rowId)
                                    .on("click",".mark"+grid.rowId,function(){
                                        That.edit(grid.rowId);
                                        return;
                                    });
                                let a =`<a class="mark${grid.rowId}">${value}</a>`;
                                return a;
                            }
                        },
                        {name: 'summary', index :'summary', width: 120,sortable: false,title:false},
                        {name: 'subject', index :'subject', width: 120,sortable: false,title:false},
                        {name: 'subjectName', index :'subjectName', width: 220,sortable: false,title:false},
                        {name: 'currencyName', index :'currencyName', width: 100,align:'center', sortable: false,title:false},
                        {name: 'exchangeRate', index :'exchangeRate', width: 60,sortable: false,title:false},
                        {name: 'ammountFor', index :'ammountFor', width: 100,align:'right',sortable: false,title:false},
                        {name: 'debit', index :'debit', width: 100,align:'right',sortable: false,title:false},
                        {name: 'credit', index :'credit', width: 100,align:'right',sortable: false,title:false},
                        /*{name: 'evidId', index :'evidId', width: 50,sortable: false,align:'center',title:false,hidden:true,
                            formatter: function(value, grid, rows, state) {
                                $(document).off("click",".clip"+grid.rowId)
                                    .on("click",".clip"+grid.rowId,function(ev){
                                        That.htClipShow = true;
                                        That.uploadImg(rows,ev.clientX,ev.clientY)
                                });
                                 let icon = `<i class="ivu-icon ivu-icon-paperclip clip${grid.rowId}"></i>`
                                 return icon
                            }
                        },*/
                        {name: 'people', index :'people', width: 85,sortable: false,title:false},
                        {name: 'auditor', index :'auditor', width: 85,sortable: false,title:false},
                        {name: 'operate', index :'operate', width: 80,sortable: false,title:false,
                            formatter: function(value, grid, rows, state) {
                                $(document).off("click",".edit"+grid.rowId).on("click",".edit"+grid.rowId,function(){
                                    That.edit(grid.rowId);
                                });
                                $(document).off("click",".del"+grid.rowId).on("click",".del"+grid.rowId,function(){
                                    That.del(grid.rowId);//凭证ID，审核状态ID，凭证机制ID
                                });
                                $(document).off("click",".offset"+grid.rowId).on("click",".offset"+grid.rowId,function(){
                                    That.offset(grid.rowId);
                                });
                                // let btns = `<a class="edit${grid.rowId}">修改</a><br /><a class="del${grid.rowId}">删除</a><br /><a class="offset${grid.rowId}">冲销</a>`;
                                btns = `<br /><a class="del${grid.rowId}">删除</a><br />`;
                                return btns
                            }
                        }/*,
                     {name: 'audited', index :'audited', width: 85,sortable: false,title:false,hidden:true},
                     {name: 'systemId', index :'systemId', width: 85,sortable: false,title:false,hidden:true}*/
                    ],
                    rowNum : 100,
                    viewrecords : true,
                    rowList : [ 100, 200, 500],
                    pager : '#pager',
                    sortable:true,
                    sortorder:'asc',
                    height: $(window).height() - 180,
                    onSelectAll(data,status){
                        That.handlerId(data,status);
                    },
                    onSelectRow(data, status){
                        That.handlerId(data,status);
                        That.formData.onSelectRowValue = data;
                    },
                    ondblClickRow:function(rowid){
                        // 双击事件
                        var url = contextPath+'/finance/voucher-lrt/index.html?voucherId='+rowid+"&sobId="+1;
                        window.parent.activeEvent({name: '查看凭证', url: url, params: null});
                    }
                }
            );
            console.log(jqGridData,"jqGridData~~~~~~~~~~~~~~~~~");
        },
        // 显示附件的操作浮框
        uploadImg(rows, x, y){
            $(".ht-clip").css({
                "top": y+'px',
                "left": x +'px',
                "visible":true
            })

        },
        // 点击附件的操作浮框
        clipClick(e){
            var e = e || window.event;
            var target = e.target || e.srcElement;
            if(target.nodeName.toLowerCase() === 'li'){
                this.htClipShow = false;
                if(target.innerText === "本地上传"){
                    this.attachmentVisible = true;
                }else{
                    this.addAttachmentVis = true;
                }
            }
        },
        // 本地上传弹框上传
        attachment(){
            this.attachmentVisible = false;
        },
        // 图片库弹框上传
        addAttachment(){
            this.addAttachmentVis = false;
        },
        getVoucher() {
            var data = [];
            $.ajax({
                type: 'post',
                async: false,
                url: contextPath+'/voucherController/initQueryVoucherFormData',
                data: null,
                success: function (result) {
                    console.log(result);
                    if (result.data != null) {
                        data = result.data;
                    }
                }
            });
            //凭证字
            this.formVoucherDataList = data.voucherGroupName.data;
            this.formVoucherDataList.splice(0, 0, {"id": '', "name": "不限"});
            //币别
            this.formCurrencyDataList = data.currencyType.data;
            this.formCurrencyDataList.splice(0, 0, {"id": '', "currencyName": "所有币别"});
            this.formData.currencyName = "所有币别";
            //会计期间
            var currentAccountPeriod = data.currentAccountPeriod;
            var currentAccountYear = data.currentAccountYear;
            this.subjectList =  data.voucherDate;
            this.formData.startVoucherDate=currentAccountYear+"-"+currentAccountPeriod;
            this.formData.endVoucherDate=currentAccountYear+"-"+currentAccountPeriod;
        },
        accountingType(val){
            var result = [];
            $.ajax({
                type: 'post',
                data: {typeId:val},
                async :false,
                url: contextPath+'/voucherController/typeResult',
                dataType: 'json',
                success: function(res){
                    result = res.data;
                    console.log(result);
                },
                error: function(code){
                    console.log(code);
                }
            });
            this.formAccountingTypeDataList2 =  result;
            this.formAccountingTypeDataList2.splice(0,0,{ "id": '',  "name": "全部"});
        },
        edit(voucherId){
            //  console.log('edit')
            var url = contextPath+'/finance/voucher-lrt/index.html?voucherId='+voucherId+"&sobId="+1;
            window.parent.activeEvent({name: '记账凭证', url: url, params: null});
        },
        exportExcel(){
            window.open(contextPath+"/voucherController/exportExcelVoucher?startVoucherDate="+this.formData.startVoucherDate+"&endVoucherDate="+this.formData.endVoucherDate);
        },
        audit(ids){
            var length =  this.selected.length;
            if(!length) {
                this.$Message.info('请先选择要审核的数据');
            }else if (length>1){
                this.$Message.info('请选择一条审核的数据');
            }else{
                this.auditPost(ids,1,1);
            }
            // 请求接口
        },
        antiAudit(){  //反审核
            var length =  this.selected.length;
            var ids = this.formData.onSelectRowValue;
            if(!length) {
                this.$Message.info('请先选择要反审核的数据');
            }else if (length>1){
                this.$Message.info('请选择一条反审核的数据');
            }else{
                this.auditPost(ids,2,1);
            }
        },
        auditPost(ids,type,sobId){  //审核接口请求 ids：凭证ID，type 1：审核，2：反审核
            let that = this;
            $.ajax({
                type: 'post',
                data: {voucherId:ids,type:type,sobId:sobId},
                url: contextPath+'/voucherController/approval',
                dataType: 'json',
                success: function(res){
                    if(res.code=='100100'){
                        that.tableReload();
                        layer.alert("操作成功")
                    }else{
                        if(res == null){
                            layer.alert("操作失败，系统异常")
                        }else{
                            layer.alert(res.msg);
                        }
                    }
                },
                error: function(code){
                    alert("操作失败");
                }
            });
        },
        del(id){
            this.$Modal.confirm({
                title: '系统提示',
                content: '<p>确认要删除所选数据？该操作是物理删除，数据不可还原！</p>',
                onOk: () => {
                // if(type!=1){
                //   this.$Message.error("不允许删除机制凭证");
                //   return;
                // }
                // if(auditedStatus==1){
                // 　this.$Message.error("不允许删除已审核凭证");
                //   return;
                // }
                this.del_data(id);
        },
            onCancel: () => {
                this.$Message.info('取消删除');
            }
        });
        },
        // 批量审核/反审核
        batchAudit(ids,type){
            let _this = this;
            var _text = '';
            if (type === 1){
                _text = '请先选择要审核的数据';
            }else {
                _text = '请先选择要反审核的数据';
            }
            if(!ids.length) {
                _this.$Message.info(_text);
                return ;
            }
            $.ajax({
                type: 'post',
                data: {ids:ids,type:type},
                url: contextPath+"/voucherController/approvalBatch",
                dataType: 'json',
                success: function(res){
                    if (res.code === '100100'){
                        _this.showVoucher(true);
                        _this.voucherModelTxt = res.data.resultData;
                        _this.viewReportTxt = res.data.detailResult;
                        _this.tableReload();
                    }
                },
                error: function(code){
                    console.log(code);
                    _this.$Message.error("删除凭证失败");
                }
            });
        },
        deleteBatch(ids){
            if(!ids.length) {
                this.$Message.info('请先选择要删除的数据');
                return ;
            }
            this.$Modal.confirm({
                title: '系统提示',
                content: '<p>确认要删除所选数据？该操作是物理删除，数据不可还原！</p>',
                onOk: () => {
                this.delList(ids);
        },
            onCancel: () => {
                this.$Message.info('取消删除');
            }
        });
            // for (var i = 0;i<ids.length;i++){
            //     var rowData = $("#grid").jqGrid('getRowData',ids[i]);
            //     if(rowData.systemId==2||rowData.audited==1){
            //         console.log(rowData.mark);
            //     }
            // }

        },
        del_data(data){
            var _this = this;
            var _url = contextPath+'/voucherController/deleteMechanismVoucher';
            $.ajax({
                type: 'post',
                data: {sobId:1,voucherId:data},
                url: _url,
                dataType: 'json',
                success: function(res){
                    if(res.code=='100100'){
                        _this.$Message.info("删除成功！");
                        _this.tableReload();
                    }else{
                        _this.$Message.error("删除失败!");
                    }
                },
                error: function(code){
                    console.log(code);
                    _this.$Message.error("删除失败!");
                }
            });
        },
        delList(ids){
            let _this = this;
            $.ajax({
                type: 'post',
                data: {ids:ids},
                url: contextPath+"/voucherController/deleteMechanismVoucherBatch",
                dataType: 'json',
                success: function(res){
                    if (res.code === '100100'){
                        _this.showVoucher(true);
                        _this.voucherModelTxt = res.data.resultData;
                        _this.viewReportTxt = res.data.detailResult;
                        _this.tableReload();
                    }
                    // console.log(res);
                    // _this.$Message.info("共删除"+res.data+"张凭证,已审核凭证不可删除。");
                },
                error: function(code){
                    console.log(code);
                    _this.$Message.error("删除凭证失败");
                }
            });
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
        },
        iconPopup() {
            this.subjectVisable = true;
        },
        getSubject(data){
            this.formData.subjectCode = data.subjectCode;
            // console.log(data)
        },
        modelClick(){
            this.$refs.filter.visible = true;
        },
        //关闭选择科目弹窗
        subjectClose() {
            this.subjectVisable = false;
        },
        scheduleShow(){
            let startDate =  this.formData.startVoucherDate.split('-') ;
            let endDate =  this.formData.endVoucherDate.split('-') ;
            return startDate[0]+"年"+"第"+startDate[1]+"期"+' 至 '+endDate[0]+"年"+"第"+endDate[1]+"期";
            // let find1 = this.subjectList.find(row=>{
            //   //  alert(this.formData.for1);
            //     return row.value === this.formData.for1;
            // })
            // let find2 = this.subjectList.find(row=>{
            //     return row.value === this.formData.for2;
            // })
            // if(find1&&find2){
            //     if(find1===find2){
            //         return find1.name;
            //     }
            //     return find1.name +' 至 '+ find2.name;
            // }
        },
        save(){
            $("#grid").jqGrid('setGridParam',{postData:this.formData}).trigger("reloadGrid");
            this.cancel(1);
        },
        more(){
            this.visible = true;

        },
        nomore(){
            this.visible = false;
        },
        cancel(status){
            switch(status){
                case 1:
                    this.filterVisible = false;
                    break;
                case 2:
                    this.insertVisible = false;
                    break;
                default:
                    break;
            }

        },
        getReload(){
            this.reload = false;
        },

        /* insert(){  //插入
             if(!this.formData.for17){
                 this.$Message.error('请输入您要移动的凭证号！');
                 return ;
             }
             if(!this.formData.for18){
                 this.$Message.error('请输入您要移动的具体位置！');
                 return ;
             }
             var _this = this;
             var _url = './insert.json';
             $.ajax({
                 type: 'post',
                 data: '',
                 url: _url,
                 dataType: 'json',
                 success: function(res){
                     _this.$Modal.confirm({
                         title: '系统提示',
                         content: `<p>${res.data.msg}</p>`,
                         onCancel: () => {
                             // _this.$Message.info('取消插入');
                         },
                         onOk: () => {
                             $.ajax({
                                 type: 'post',
                                 data: '',
                                 url: _url,
                                 dataType: 'json',
                                 success: function(res){
                                     // _this.$Message.success(res.msg);
                                     _this.tableReload();
                                     _this.insertVisible = false;
                                 },
                                 error: function(code){
                                     console.log(code);
                                     _this.$Message.error(code.msg);
                                 }

                             })
                         }

                     });
                 },
                 error: function(code){
                     console.log(code);
                     _this.$Message.error(code.msg);
                 }
             });
         },*/

        // postAccount(voucherId){   //过账
        //     console.log(voucherId);
        //     var _this = this;
        //     var length = voucherId.length;
        //     if(!length) {
        //         _this.$Message.info('请先选择要过账的数据');
        //         return;
        //     }
        //     $.ajax({
        //         type: 'post',
        //         data: {"ids": voucherId},
        //         url: contextPath + '/voucherController/voucherPassBill',
        //         dataType: 'json',
        //         success: function (res) {
        //             var msg = res.msg;
        //             if (res.code == '100100') {
        //                 // alert(msg);
        //                 // _this.tableReload();  //刷新
        //                 _this.showVoucher(true);
        //                 _this.voucherModelTxt = res.data.resultData;
        //                 _this.viewReportTxt = res.data.detailResult;
        //                 _this.tableReload();
        //             } else {
        //                 alert(msg);
        //             }
        //         },
        //         error: function (code) {
        //             alert("操作失败");
        //         }
        //     });
        //
        // },
        uploadExlModal(type) {
            console.log(type);
            this.uploadExlVisible = type;
        },
        dropMore(name){
            switch(name){
                // 反审核
                case "antiAudit":
                    this.antiAudit();
                    break;
                // 整理
                case "arrangement":
                    //window.open("./tidy.htm");
                    this.sort();
                    break;
                //过账
                case "postAccount":
                    this.postAccount(this.selected);
                    break;
                // 插入
                case "insert":
                    this.insertVisible = true;
                    break;
                // 导入
                case "import":
                    this.uploadExlModal('true');
                    break;
                // 批量删除
                case "batchDel":
                    console.log(this.selected);
                    this.deleteBatch(this.selected);
                    break;
                // 批量审核
                case "batchAudit":
                    console.log(this.selected);
                    this.batchAudit(this.selected,1);
                    break;
                // 批量反审核
                case "batchCounterAudit":
                    console.log(this.selected);
                    this.batchAudit(this.selected,2);
                    break;
                // 列表打印
                case "listPrinting":
                    break;
                // 按导入模块格是导出
                case "againImport":
                    break;
                default:
                    break;
            }
        },
        //刷新页面
        showVoucherVisibleClose(){
            this.tableReload();
        },
        accordingAction() {
            var that = this;
            that.showVoucher(false);
            this.tableReload();
        },
        showVoucher(_bool) {
            this.showVoucherVisible = _bool;
        },
        showViewReport(_bool) {
            this.viewReportVisible = !this.viewReportVisible;
        },
        iconPopup() {
            this.subjectVisable = true;
            $(".v-transfer-dom .ivu-modal-wrap").css({
                "z-index":1070,
            })
        },
        tableReload() { //刷新
            this.selected = [];
            $("#grid").jqGrid('setGridParam',{postData:this.formData}).trigger("reloadGrid");

        },
    },
    watch:{
    },
    computed:{
    },
    created() {
        this.getVoucher();
    },
    mounted() {
        this.pageInit();
    }
});