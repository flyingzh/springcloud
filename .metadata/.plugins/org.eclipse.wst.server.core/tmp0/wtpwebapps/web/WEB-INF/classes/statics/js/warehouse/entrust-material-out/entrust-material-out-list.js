var vm = new Vue({
    el: "#app",
    data: {
        isShow: false,
        isEdit: false,
        reload: false,
        isSearchHide: true,
        isTabulationHide: true,
        categoryType:[],
        selectRowData:[],
        goodsTypePath:'',
        dataValue:[],
        selected:[],
        goodsValue:'',
        openTime:'',
        documentNo:'',
        documentStatus:'',
        //审核
        modalTrigger:false,
        modalType:'',
        approvalTableData:[],
        stepList: [],
        selectType: [
            {
                value: "W_CMATERIAL_OUT_01",
                label: "受托加工送料"
            },
            {
                value: "W_CMATERIAL_OUT_02",
                label: "受托加工退料"
            }
        ],
        body: {
            documentNo: '',
            startTime: '',
            endTime: '',
            customCode: '',
            businessType:'',
        },
        data_config: {
            url: contextPath+"/entrustOut/queryList",
            datatype:"json",
            colNames: ['id','日期', '单据编号','单据状态','业务类型', '客户', '供应商', '业务员',"商品类型","物流方式","备注"],
            colModel:[
                {name: "id", width: 210, align: "left", hidden: true},
                {name: "documentTime", width: 210, align: "left",
                    formatter: function (value, grid, rows, state) {
                        return  new Date(value).format("yyyy-MM-dd");
                    }},
                {name: "documentNo", width: 210, align: "left",
                    formatter: function (value, grid, rows, state) {
                        $(document).off('click',".detail"+ value).on('click',".detail"+ value,function(){
                            vm.detailClick({value, grid, rows, state})
                        });
                        let myCode =  `<a class="detail${value}">${value}</a>`;
                        return  myCode;
                    },
                    unformat: function (value, grid, rows) {
                        return value.replace(/(<\/?a.*?>)/g, '');
                    }},
                {name: "documentStatus", width: 210, align: "left",
                    formatter: function (value, grid, rows, state) {
                        if(value === 1){
                            return '暂存';
                        }
                        if(value === 2){
                            return '待审核';
                        }
                        if(value === 3){
                            return '审核中';
                        }
                        if(value === 4){
                            return '已审核';
                        }
                        if(value === 5){
                            return '驳回';
                        }
                    },
                    unformat(value, grid, rows, state){
                        if(value === '暂存'){
                            return 1;
                        }
                        if(value === '待审核'){
                            return 2;
                        }
                        if(value === '审核中'){
                            return 3;
                        }
                        if(value === '已审核'){
                            return 4;
                        }
                        if(value === '驳回'){
                            return 5;
                        }
                    }},
                {name: "businessType", align: "left", width: 210,
                    formatter: function (value, grid, rows, state) {
                        if (value === "W_CMATERIAL_OUT_01"){
                            return "受托加工送料";
                        }
                        if (value === "W_CMATERIAL_OUT_02"){
                            return "受托加工退料";
                        }
                        return '';
                    }},
                {name: "custName", align: "left", width: 210},
                {name: "supplierName", align: ";left", width: 210},
                {name: "salesmanName", align: ";left", width: 210},
                {name: "goodsTypeName", align: ";left", width: 210},
                {name:"logisticsWay",align: ";left", width: 210,
                    formatter: function (value, grid, rows, state) {
                        if (value === "wlfs_zt"){
                            return "自提";
                        }
                        if (value === "wlfs_js"){
                            return "寄送";
                        }
                        if (value === "wlfs_shsm"){
                            return "送货上门";
                        }
                        return '';
                    }},
                {name:"remark",align: ";left", width: 210}
            ],
            rowNum : 10,//一页显示多少条
            rowList : [ 10, 20, 30 ],//可供用户选择一页显示多少条
            mtype : "post",//向后台请求数据的ajax的类型。可选post,get
            viewrecords : true
        }
    },
    methods: {
        //转换搜索栏日期格式
        changeDate(value){
            this.body.startTime=value[0].replace(/\//g, '-');
            this.body.endTime=value[1].replace(/\//g, '-');
        },
        //搜索
        search(){
            this.reload=!this.reload;
        },
        clear() {
            this.body = {
                documentNo: '',
                startTime: '',
                endTime: '',
                customCode: '',
                businessType:'',
            }
            this.$nextTick(function(){
                this.body.businessType = '';
                this.body.customCode = '';
                this.goodsValue = '';
            });
            this.dataValue = [];
        },

        handleClearType(value) {
            this.$refs[value].reset();
            this.$nextTick(() => {
                if (value === 'dType') {
                    this.body.businessType = '';
                }else if (value === 'dataValue') {
                    this.dataValue = [];
                }
            });
        },
        //刷新
        refresh(){
            this.clear();
            this.reload = !this.reload;
        },
        //获取商品类型
        loadProductType(){
            let This = this;
            $.ajax({
                type: "post",
                url: contextPath+'/entrustOut/queryStyleCategory?parentId=0',
                contentType: 'application/json',
                dataType: "json",
                success: function (data) {
                    console.log(data)
                    This.categoryType = This.initGoodCategory(data.data.cateLists)
                },
                error: function () {
                    This.$Modal.warning({content:"服务器出错啦",title:"提示信息"})
                }
            })
        },
        initGoodCategory(type) {
            let result = [];
            type.forEach((item) => {
                let {
                    customCode: value,
                    name: label,
                    cateLists: children
                } = item

                if (children) {
                    children = this.initGoodCategory(children)
                }
                result.push({
                    value,
                    label,
                    children
                })
            })
            result.forEach((item) => {
                if (!item.children) {
                    delete item.children;
                }
            })
            return result
        },
        //监听商品类型内容改变,根据商品分类id
        changeproductTypeName(selectedData,arr){
            console.log(selectedData,arr,3434)
            if (selectedData.length <= 0) {
                this.body.customCode = '';
            }else {
                //获取商品分类名称
                this.body.customCode = arr[arr.length - 1]['value'];
            }
        },
        //删除
        DeleteOneRow(){
            let This = this;
            console.log(This.selected,88990)
            if(This.selected.length < 1 ){
                //layer.alert("请至少选择一条数据");
                This.$Modal.info({
                    title: '提示信息',
                    content: '请先选择至少一笔数据！'
                })
                return;
            }
            let temp = '';
            for (let RowData of This.selected){
                if (RowData.documentStatus !== 1) {
                    temp += '单据[ '+RowData.documentNo + ' ]' + '<br>'
                }
            }
            if (temp) {
                This.$Modal.info({
                    title: '提示信息',
                    content: temp + ' 单据状态不为暂存，不能删除'
                })
                return;
            }

            let selectRowId = [];
            for (let rowId of This.selected){
                selectRowId.push(rowId.id);
            }

            this.$Modal.confirm({
                    title: '提示信息',
                    content: '是否删除？',
                    onOk: () => {
                $.ajax({
                    type:"POST",
                    url: contextPath+"/entrustOut/deleteBatch",
                    contentType: 'application/json',
                    data:JSON.stringify(selectRowId),
                    dataType:"json",
                    success: function(data) {
                        This.selected = '';
                        if (data.code == "100100") {
                            if($.isEmptyObject(data.data)){
                                This.$Modal.success({
                                    title: '提示信息',
                                    content: '删除成功！'
                                })
                            }
                            This.refresh();
                         }else {
                            This.$Modal.warning({
                                title: '提示信息',
                                content: '删除失败！'
                            })
                        }
                     },
                 });
            },
            onCancel: () => {
            },
            });
        },
        //点击单据编号查看详情
        detailClick(data){
            //携带documentNo跳转至新增页
            window.parent.activeEvent({
                name: "受托加工材料出库-查看",
                url: contextPath+'/warehouse/entrust-material-out/entrust-material-out-info.html',
                params: {activeType: "listQuery",documentNo:data.rows.documentNo}
            });
        },
        //新增
        add(){
            //跳转至新增页面
            window.parent.activeEvent({
                name: "受托加工材料出库-新增",
                url: contextPath+'/warehouse/entrust-material-out/entrust-material-out-info.html',
                params: {activeType: "handworkAdd"}
            });
        },
        //修改
        update(){
            if (this.selected.length < 1) {
                this.$Modal.info({
                    title: '提示信息',
                    content: '请先选择至少一笔数据！'
                });
                return;
            }
            if (this.selected.length > 1) {
                this.$Modal.info({
                    title: '提示信息',
                    content: '只能选择一笔数据！'
                });
                return;
            }
            console.log(this.selected,233);
            //跳转至修改页面
            window.parent.activeEvent({
                name: "受托加工材料出库-修改",
                url: contextPath+'/warehouse/entrust-material-out/entrust-material-out-info.html',
                params: {activeType: "listUpdate",documentNo:this.selected[0].documentNo}
            });
        },

        //提交
        submit(){
            let document = this.selected;
            console.log('document',document)
            if(document.length < 1){
                this.$Modal.info({content:"请至少选择一条数据",title:"提示信息"})
                return;
            }else if(document.length > 1){
                this.$Modal.info({content:"只能选择一条数据",title:"提示信息"})
                return;
            }else {
                let This = this;
                //提交之前进行校验

                if (document[0].documentStatus != 1){
                    This.$Modal.info({content:"单据状态不为暂存不能提交！",title:"提示信息"})

                    return;
                }
                $.ajax({
                    type: "POST",
                    url: contextPath+"/entrustOut/submit",
                    dataType: "json",
                    data:{"id":document[0].id},
                    success: function(data) {
                        console.log(data)
                        if (data.code === "100100"){
                            document[0].documentStatus = 2;

                            This.refresh();
                            This.$Modal.success({
                                title: '提示信息',
                                content: '提交成功！'
                            })
                        }else {
                            document[0].documentStatus = 1;
                            This.$Modal.info({
                                title: '提示信息',
                                content: data.msg
                            })
                        }
                    },
                    error: function(err){
                        This.$Spin.hide();
                        console.log("服务器出错");
                    },
                });
            }
        },

        // 点击退出(退出页面)
        exit(){
            window.parent.closeCurrentTab({openTime:this.openTime,exit: true,});
        },

        approval() {
            //发送请求
            let This = this;
            let datas = this.selected;
            if (datas.length > 1) {
                this.$Modal.info({
                    title:'提示信息',
                    content:'只能选择一条数据！'
                });
                return;
            }
            if (datas.length < 1) {
                this.$Modal.info({
                    title:'提示信息',
                    content:'请至少选择一条数据！'
                });
                return;
            }
            if (datas[0].documentStatus === 2 ||
                datas[0].documentStatus === 3 ||
                datas[0].documentStatus === 5) {
                This.id = datas[0].id;
                This.documentStatus = datas[0].documentStatus;
                This.documentNo = datas[0].documentNo;
                This.modalType = 'approve';
                This.modalTrigger = !This.modalTrigger;
                console.log(datas[0].documentStatus,datas[0].documentNo,77)
            } else if (datas[0].documentStatus === 1) {
                this.$Modal.info({
                    title:'提示信息',
                    content:'请提交单据！'
                });
                return;
            } else if (datas[0].documentStatus === 4) {
                this.$Modal.info({
                    title:'提示信息',
                    content:'该单已审核,不能重复审核！'
                });
                return;
            }

        },
        //驳回
        reject() {
            let This = this;
            let datas = this.selected;
            if (datas.length > 1) {
                This.$Modal.info({
                    title:'提示信息',
                    content:'请至少选择一条数据！'
                });
                return;
            }
            if (datas.length < 1) {
                This.$Modal.info({
                    title:'提示信息',
                    content:'请至少选择一条数据！'
                });
                return;
            } else {
                if (datas[0].documentStatus === 2 ||
                    datas[0].documentStatus === 3 ||
                    datas[0].documentStatus === 5) {
                    This.id = datas[0].id;
                    This.documentStatus = datas[0].documentStatus;
                    This.documentNo = datas[0].documentNo;
                    This.modalType = 'reject';
                    This.modalTrigger = !This.modalTrigger;
                } else {
                    This.$Modal.info({
                        title:'提示信息',
                        content:'该单状态不能驳回！'
                    });
                }
            }
        },

        //审核或者驳回回调
        approvalOrRejectCallBack(res){
            console.log(res,9988788)
            if(res.result.code === '100100') {
                this.refresh();
            }
        },

        autoSubmitOrReject(result){
            let This = this;
            $.ajax({
                url:contextPath + '/entrustOut/submitapproval?submitType=1',
                method:'post',
                contentType:'application/json;charset=utf-8',
                data:JSON.stringify({
                    receiptsId:This.documentCode,
                    approvalResult:(This.modalType == 'reject'? 1 : 0),
                }),
                success:function (res) {
                    if(res.code === '100100'){

                    }else {
                        This.$Modal.warning({content:res.msg,title:"提示信息"});
                    }
                }
            });
        },

        ajaxUpdateDocStatusById(id,docStatus){
            let This = this;

            $.ajax({
                url:contextPath+ '/entrustOut/updateDocumentStatusByid',
                method:'POST',
                dataType:'json',
                contentType: "application/json;charset=utf-8",
                data:JSON.stringify({id:id,documentStatus:docStatus}),
                success:function (data) {
                    if(data.code == '100100'){
                        This.body.documentStatus = docStatus;
                        This.refresh();
                    }
                }
            });
        },

    },

    mounted() {
        this.loadProductType();
        this.openTime = window.parent.params.openTime;
    }
})