var vm = new Vue({
    el: "#app",
    data: {
        isShow: false,
        openTime: '',
        isEdit: false,
        reload: false,
        modalTrigger: false,
        modalType:'',
        documentNo: '',
        documentStatus: '',
        id: '',
        isSearchHide: true,
        isTabulationHide: true,
        docTypeCode:'W_MATERIAL_USED',
        stepList:[],
        dateArr:[],
        supplierList:[],
        documentStatusArr:[{value:1,name:'暂存'},
                           {value:2,name:'待审核'},
                           {value:3,name:'审核中'},
                           {value:4,name:'已审核'},
                           {value:5,name:'驳回'}],
        selectPickingUse:[
            {
                value:"W_MATERIAL_USED_01",
                label:"采购送料"
            },
            {
                value:"W_MATERIAL_USED_02",
                label:"采购料结"
            },
            {
                value:"W_MATERIAL_USED_03",
                label:"受托加工送料"
            },{
                value:"W_MATERIAL_USED_04",
                label:"受托加工退料"
            }
        ],
        //启用多级审核时单据上的操作——审核
        approveComment: false,
        //启用多级审核时单据上的操作—-驳回
        rejectComment: false,
        //审批进度条
        steplist: [],
        stepData: [],
        selected: [],
        currentStep: '',
        nextStep: '',
        body: {
            purpose:'',
            date:"",
            documentNo:"",
            supplierId:""
        },
        data_config: {
            url: contextPath+"/rawapplication/list",
            datatype:"json",
            colNames: ['id', '日期', '单据编号','单据状态','领料用途', '供应商', '客户', '申请部门',"申请人","备注"],
            colModel:[
                {name:"id",hidden:true},
                {name: "documentTime", width: 210, align: "left",
                    formatter: function (value, grid, rows, state) {
                        Date.prototype.Format = function (fmt) { //author: meizz
                            var o = {
                                "M+": this.getMonth() + 1, //月份
                                "d+": this.getDate(), //日
                                "h+": this.getHours(), //小时
                                "m+": this.getMinutes(), //分
                                "s+": this.getSeconds(), //秒
                                "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                                "S": this.getMilliseconds() //毫秒
                            };
                            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
                            for (var k in o)
                                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1,
                                    (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                            return fmt;
                        }
                        return  new Date(value).Format("yyyy-MM-dd");
                    }
                },
                {name: "documentNo", width: 350, align: "left",
                    formatter: function (value, grid, rows, state) {
                        $(document).off("click", ".detail" + value).on("click", ".detail" + value, function () {
                            vm.documentCodeClick(rows.documentNo);
                        });
                        let btns = `<a class="detail${value}">${value}</a>`;
                        return btns
                    },
                    unformat:function (val,grid,rows) {
                        return val.replace(/(<\/?a.*?>)/g, '');
                    }
                },
                {name: "documentStatus", width: 210, align: "left",
                    formatter: function (value, grid, rows, state) {
                        return vm.formatterDocumentStatus(value);
                    }, unformat: function (cellvalue, options, rowObject) {
                    return vm.unformatDocumentStatus(cellvalue);
                }
                },
                {name: "purpose", width: 210, align: "left",
                    formatter: function (value, grid, rows, state) {
                        return vm.formatterPurpose(value);
                    },unformat: function (cellvalue, options, rowObject) {
                        return vm.unformatterPurpose(cellvalue);
                    }},
                {name: "supplierName", align: "left", width: 210},
                {name: "custName", align: "left", width: 210},
                {name: "applicationDepartmentName", align: "left", width: 210},
                {name: "applicantName", align: ";left", width: 210},
                {name:"remark",align: ";left", width: 210}
            ],
            rowNum : 5,//一页显示多少条
            rowList : [ 10, 20, 30 ],//可供用户选择一页显示多少条
            mtype : "post",//向后台请求数据的ajax的类型。可选post,get
            viewrecords : true
        }
    },
    methods: {
        handleClearType(){
            this.$refs.purpose.reset();
            this.$nextTick(() => {
                this.body.purpose = '';
            });
        },
        closeSupplier(id,code,name){
            this.body.supplierId = id;
        },
        //审核或者驳回回调
        approvalOrRejectCallBack(res){
            let This = this;
            if(res.result.code === '100100'){
                This.reloadAgain();
            }
        },
        autoApproveOrReject(){
            let This = this;
            $.ajax({
                url:contextPath + '/rawapplication/submitapproval?submitType=1',
                method:'post',
                contentType:'application/json;charset=utf-8',
                data:JSON.stringify({
                    receiptsId:This.documentNo,
                    approvalResult:(This.modalType == 'reject'? 1 : 0),
                }),
                success:function (res) {
                    if(res.code === '100100'){
                        This.reloadAgain();
                    }else {
                        This.$Modal.warning({content:res.msg,title:"提示信息"});
                    }
                }
            });
        },
        add(){
            window.parent.activeEvent({
                name: '新增原料领用申请单',
                url: contextPath + '/warehouse/raw-application/raw-application-info.html',
                params:{openTime:this.openTime}
            });
        },
        documentCodeClick(code){
            window.parent.activeEvent({
                name: '查看原料领用申请单',
                url: contextPath + '/warehouse/raw-application/raw-application-info.html',
                params: {data: code, type: 'query'}
            });
        },
        update(){
            let This = this;
            let data = This.selected;
            if(data.length > 1){
                This.$Modal.info({
                    title: '提示信息',
                    content: '只能选择一条数据！',
                });
                return;
            }
            if(data.length < 1){
                This.$Modal.info({
                    title: '提示信息',
                    content: '请选择选择一条数据！',
                });
                return;
            }
            window.parent.activeEvent({
                name: '修改原料领用申请单',
                url: contextPath + '/warehouse/raw-application/raw-application-info.html',
                params: {data: data[0], type: 'update'}
            });
        },
        //删除ids
        del(){
            let This = this;
            let ids = this.selected;
            let unDels = [];
            let datas = This.getSelectedData(ids);
            console.log("选中的数据：",datas);
            if(datas.length > 1){
                datas.forEach(item =>{
                    if(item.documentStatus != 1){
                        unDels.push(item.documentNo);
                    }
                });
            }else if(datas.length === 1 && datas[0].documentStatus != 1){
                    This.$Modal.info({
                        title:'提示信息',
                        content:'单据'+datas[0].documentNo+'已启用审批流不能删除！'
                    });
                    return false;
            }
            if(unDels.length > 1){
                    This.$Modal.info({
                        title:'提示信息',
                        content:unDels.map((e) =>{ return '单据'+e; })+'已启用审批流不能删除！'
                    });
                return;
            }
            //TODO 判断组织
            if(ids.length > 0){
                console.log(ids);
                $.ajax({
                    type:'POST',
                    url:contextPath + '/rawapplication/delete',
                    data:JSON.stringify(ids),
                    contentType:'application/json',
                    success:function () {
                        This.$Modal.success({
                            title:'提示信息',
                            content:'删除成功！！'
                        });
                        This.reloadAgain();
                        This.selected = [];
                    }
                });
         }else {
                This.$Modal.info({
                    title:'提示信息',
                    content:'请至少选择一条数据！'
                });
            }
        },
        //修改单据状态
        updateStatus(id,documentStatus){
            let This = this;
            $.ajax({
                type: "post",
                url: contextPath + '/rawapplication/update',
                data: JSON.stringify({id: id,documentStatus:documentStatus}),
                contentType: 'application/json',
                dataType: "json",
                success: function (data) {
                    This.reloadAgain();
                }
            });
        },
        //审核
        approval() {
            //发送请求
            let $This = this;
            let This = this.selected;
            let obj = $('#myTable').jqGrid('getRowData',this.selected[0]);
            if (This.length > 1) {
                this.$Modal.info({
                    title:'提示信息',
                    content:'只能选择一条数据！'
                });
                return;
            }
            if (This.length < 1) {
                this.$Modal.info({
                    title:'提示信息',
                    content:'请至少选择一条数据！'
                });
                return;
            }
            $This.id = obj.id;
            $This.documentStatus = obj.documentStatus;
            $This.documentNo = obj.documentNo;
            $This.modalType = 'approve';
            $This.modalTrigger = !$This.modalTrigger;

        },
        //驳回
        reject() {
            let $This = this;
            let This = this.selected;
            let obj = $('#myTable').jqGrid('getRowData',this.selected[0]);
            if (This.length > 1) {
                this.$Modal.info({
                    title:'提示信息',
                    content:'请至少选择一条数据！'
                });
                return;
            }
            if (This.length < 1) {
                this.$Modal.info({
                    title:'提示信息',
                    content:'请至少选择一条数据！'
                });
                return;
            } else {
                if (obj.documentStatus === 2 ||
                    obj.documentStatus === 3 ||
                    obj.documentStatus === 5) {
                    let This = this;
                    This.id = obj.id;
                    This.documentStatus = obj.documentStatus;
                    This.documentNo = obj.documentNo;
                    This.modalType = 'reject';
                    This.modalTrigger = !This.modalTrigger;
                } else {
                    $This.$Modal.info({
                        title:'提示信息',
                        content:'该单状态不能驳回！'
                    });
                }
            }
        },
        getSppliers(){
            let This = this;
            $.ajax({
                type: 'post',
                url: contextPath + '/rawapplication/getSuppliers',
                dataType: "json",
                success: function (data) {
                    This.supplierList = data.data;
                }
            })
        },
        clear() {
                this.body.documentNo = '';
                this.body.startTime = "";
                this.body.endTime = "";
                this.body.supplierName = "";
              if (this.body.purpose) {
                this.$refs.purpose.reset();
                this.$nextTick(() => {
                    this.body.purpose = '';
                });
            }
              if(this.body.supplierId){
                  this.$refs.supplier.clear();
                  this.body.supplierId = '';
                }
            this.dateArr = [];
            this.selected = [];
        },
        formatterDocumentStatus(value){
            if(!value){
                return '';
            }else if(this.documentStatusArr.length < 1){
                return value;
            }
            return this.documentStatusArr[this.documentStatusArr.map(function(e) { return e.value; }).indexOf(value)]
                ? this.documentStatusArr[this.documentStatusArr.map(function(e) { return e.value; }).indexOf(value)].name
                : value;

        },
        formatterPurpose(value){
            if(!value){
                return '';
            }else if(this.selectPickingUse.length < 1){
                return value;
            }
            return this.selectPickingUse[this.selectPickingUse.map(function(e) { return e.value; }).indexOf(value)]
                ? this.selectPickingUse[this.selectPickingUse.map(function(e) { return e.value; }).indexOf(value)].label
                : value;

        },
        unformatDocumentStatus(value){
            if(!value){
                return '';
            }else if(this.documentStatusArr.length < 1){
                return value;
            }
            return this.documentStatusArr[this.documentStatusArr.map(function(e) { return e.name; }).indexOf(value)]
                ? this.documentStatusArr[this.documentStatusArr.map(function(e) { return e.name; }).indexOf(value)].value
                : value;
        },
        unformatterPurpose(value){
            if(!value){
                return '';
            }else if(this.selectPickingUse.length < 1){
                return value;
            }
            return this.selectPickingUse[this.selectPickingUse.map(function(e) { return e.label; }).indexOf(value)]
                ? this.selectPickingUse[this.selectPickingUse.map(function(e) { return e.label; }).indexOf(value)].value
                : value;
        },
        search(){
            if (this.dateArr.length > 0 && this.dateArr[0] && this.dateArr[1]) {
                this.body.startTime = this.dateArr[0].format("yyyy-MM-dd HH:mm:ss");
                this.body.endTime = this.dateArr[1].format("yyyy-MM-dd HH:mm:ss");
            } else {
                this.body.startTime = '';
                this.body.endTime = '';
            }
            console.log(this.body);
            this.reload = !this.reload;
        },
        submit(){
            let This = this;
            let rows = this.selected;
            let obj = $('#myTable').jqGrid('getRowData',this.selected[0]);
            if(rows.length > 1){
                this.$Modal.info({
                    title:'提示信息',
                    content:'只能选择一条数据！'
                });
                $('#myTable').jqGrid('resetSelection');
                rows = [];
                return;
            }
            if(rows.length < 1){
                this.$Modal.info({
                    title:'提示信息',
                    content:'至少选择一条数据！'
                });
                $('#myTable').jqGrid('resetSelection');
                rows = [];
                return;
            }
            if(obj.documentStatus != 1){
                this.$Modal.info({
                    title:'提示信息',
                    content:'该单的单据状态不能提交！'
                });
                return;
            }
            window.top.home.loading('show');
            $.ajax({
                type: "post",
                url: contextPath + '/rawapplication/submit',
                data: JSON.stringify({id:obj.id,documentNo:obj.documentNo}),
                contentType:'application/json;charset=utf-8',
                dataType: "json",
                success: function (data) {
                    if(data.code === "100100"){
                        This.$Modal.success({
                            content:data.msg,
                            title:"提示信息"
                        });
                        This.reloadAgain();
                    }else {
                       This.$Modal.info({content:data.msg,title:"提示信息"});
                       This.reloadAgain();
                    }
                    window.top.home.loading('hide');
                },
                error: function () {
                    window.top.home.loading('hide');
                }
            });
        },
        getSelectedData(selected){
           let list = [];
           for(let rowId of this.selected){
               list.push($('#myTable').jqGrid('getRowData',rowId));
           }
           return list;
        },
        //刷新
        reloadAgain() {
            this.clear();
            this.reload = !this.reload;
        },
        getSelectRowData(){
            let selectRowData=[];
            for(let rowId of this.selected){
                let row = $("#myTable").jqGrid('getRowData',rowId);
                selectRowData.push(row);
            }
            return selectRowData;
        },
        exit(){
            window.parent.closeCurrentTab({name: '原料领用申请单列表', openTime: this.openTime, exit: true});
        },
    },
    mounted(){
        this.openTime = window.parent.params.openTime;
        // this.getSppliers();
    },
})
