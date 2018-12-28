var vm = new Vue({
    el: "#app",
    data: {
        isShow: false,
        isEdit: false,
        reload: false,
        isSearchHide: true,
        isTabulationHide: true,
        isHide: true,
        selected:[],
		stepList: [],
		approvalTableData:[],
		 //审核
        modalTrigger:false,
		openTime:'',
		modalType:'',
		documentNo:'',
		documentStatus:'',
        selectBusinessType: [
            {
                value: "W_REQUISITION_01",
                label: "销售出仓"
            },
            {
                value: "W_REQUISITION_02",
                label: "采购送料"
            }
            ,
            {
                value: "W_REQUISITION_03",
                label: "采购退库"
            },
            {
                value: "W_REQUISITION_04",
                label: "受托加工送料"
            },
            {
                value: "W_REQUISITION_05",
                label: "受托加工退料"
            },
            {
                value: "W_REQUISITION_06",
                label: "采购料结"
            }
        ],
        body: {
            documentNo: '',
			startTime: '',
            endTime: '',
            salesmanName:"",
            businessType:""
        },
        data_config: {
            url: contextPath+"/requisition/list",
            datatype:"json",
            colNames: ['id','日期', '单据编号','单据状态','业务类型', '员工', '备注',"商品类型","调拨总数量","调拨总重量"],
            colModel:[
				{name: "id", width: 210, align: "left", hidden: true},
                {name: "transferTime",width: 210, align: "left",
                    formatter: function (value, grid, rows, state) {
						if(value != null){
							return  new Date(value).format("yyyy-MM-dd");
						}
                        return '';
                    }},
                {name: "documentNo", width: 210, align: "left",
                    formatter: function (value, grid, rows, state) {
                        $(document).on('click',".detail"+ value,function(){
                            vm.detailClick({value, grid, rows, state})
                        });
                        let myCode =  `<a class="detail${value}">${value}</a>`;
                        return  myCode;
                    },
                    unformat: function (value, grid, rows) {
                        return value.replace(/(<\/?a.*?>)/g, '');
                    }},
                {name: "documentStatus",width: 210, align: "left",
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
                {name: "businessType",width: 210, align: "left",
                    formatter: function (value, grid, rows, state) {
                        if (value === "W_REQUISITION_01"){
                            return "销售出仓";
                        }
                        else if (value === "W_REQUISITION_02"){
                            return "采购送料";
                        }
						else if (value === "W_REQUISITION_03"){
                            return "采购退库";
                        }
						else if (value === "W_REQUISITION_04"){
                            return "受托加工送料";
                        }
						else if (value === "W_REQUISITION_05"){
                            return "受托加工退料";
                        }
						else if (value === "W_REQUISITION_06"){
                            return "采购料结";
                        }else{
							return '';
						}
                    }},
                {name: "salesmanName", align: "left", width: 210},
                {name: "remark", align: ";left", width: 210},
                {name: "goodsTypeName", align: ";left", width: 210},
                {name: "totalTransferNum", align: ";left", width: 210,
                    formatter: function (value, grid, rows, state) {
						if(value==null){
							return 0;
						}else{
							return value;
						}
					}},
                {name:"totalTransferWeigh",align: ";left", width: 210,
                    formatter: function (value, grid, rows, state) {
						if(value==null){
							return 0;
						}else{
							return value;
						}
					}}
            ],
            rowNum : 5,//一页显示多少条
            rowList : [ 10, 20, 30 ],//可供用户选择一页显示多少条
            mtype : "post",//向后台请求数据的ajax的类型。可选post,get
            viewrecords : true
        }
    },
    methods: {
        clear() {
            this.body = {
				documentNo: '',
                startTime: '',
                endTime: '',
                salesmanName: '',
				businessType:""	
            }
            this.dataValue = [];
        },
        //转换搜索栏日期格式
        changeDate(value){
            this.body.startTime=value[0].replace(/\//g, '-') + ' 00:00:00';
            this.body.endTime=value[1].replace(/\//g, '-') + ' 23:59:59';
        },
        //搜索
        search(){
            this.reload=!this.reload;
        },
        //刷新
        refresh(){
            this.clear();
            this.reload = !this.reload;
        },
		// 点击退出(退出页面)
        exit(){
            window.parent.closeCurrentTab({openTime:this.openTime,exit: true,});
        },
        //删除
        DeleteOneRow(){
            let This = this;
            if(This.selected.length < 1 ){
                //layer.alert("请至少选择一条数据");
                This.$Modal.info({
                    title: '提示信息',
                    content: '请先选择至少一笔数据！'
                })
                return;
            }
            This.selectRowData = [];
            for (let rowId of This.selected){
                let selectRow=$("#myTable").jqGrid('getRowData',rowId);
                This.selectRowData.push(selectRow);
            }
            let temp = '';
            for (let RowData of This.selectRowData){
                if (RowData.documentStatus !== 1) {
                    temp += '单据[ '+RowData.documentNo + ' ]' + '<br>'
                    console.log(temp,RowData.documentStatus,RowData.documentNo)
                }
            }
            if (temp) {
                This.$Modal.info({
                    title: '提示信息',
                    content: temp + ' 单据状态不为暂存，不能删除'
                })
                return;
            }
            this.$Modal.confirm({
                title: '提示信息',
                content: '是否要删除这条信息？',
                onOk: () => {
                    $.ajax({
                        type:"POST",
                        url: contextPath+"/requisition/deleteBatch",
                        contentType: 'application/json',
                        data:JSON.stringify(This.selected),
                        dataType:"json",
                        success: function(data) {
                            This.selected = '';
                            if (data.code == "100100") {
                                This.refresh();
                                if($.isEmptyObject(data.data)){
                                    This.$Modal.success({
                                        title: '提示信息',
                                        content: '删除成功！'
                                    })
                                }
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
            console.log(data);
            console.log("detailClick------data.rows.id",data.rows.documentNo);
            //携带id跳转至新增页
            window.parent.activeEvent({
                name: "调拨单-查看",
                url: contextPath+'/warehouse/requisition/requisition-info.html',
                params: {activeType: "listQuery",documentNo:data.rows.documentNo}
            });
        },
        //新增
        add(){
            console.log("add")
            //跳转至新增页面
            window.parent.activeEvent({
                name: "调拨单-新增",
                url: contextPath+'/warehouse/requisition/requisition-info.html',
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
            console.log(this.selected[0],233);
			if (this.selected.length > 1) {
                this.$Modal.info({
                    title: '提示信息',
                    content: '只能选择一笔数据！'
                });
                return;
            }
            console.log(this.selected[0].id,233);
            //跳转至修改页面
            window.parent.activeEvent({
                name: "调拨单-修改",
                url: contextPath+'/warehouse/requisition/requisition-info.html',
                params: {activeType: "listUpdate",documentNo:this.selected[0].documentNo}
            });
        },
		        //删除
        DeleteOneRow(){
            let This = this;
            console.log("DeleteOneRow---This.selected",This.selected)
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
                    url: contextPath+"/requisition/delete",
                    contentType: 'application/json',
                    data:JSON.stringify(selectRowId),
                    dataType:"json",
                    success: function(data) {
                        This.selected = '';
                        if (data.code == "100100") {
                            This.refresh();
                            if($.isEmptyObject(data.data)){
                                This.$Modal.success({
                                    title: '提示信息',
                                    content: '删除成功！'
                                })
                            }
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

        //提交
        submit(){
            let document = this.selected;
            console.log('document',document)
            if(document.length < 1){
                // layer.alert("请至少选择一条数据");
                this.$Modal.info({content:"请至少选择一条数据！",title:"提示信息"});
                return;
            }else if(document.length > 1){
                // layer.alert("");
                this.$Modal.info({content:"只能选择一条数据！",title:"提示信息"});
                return;
            }else {
                let This = this;
                //提交之前进行校验

                if (document[0].documentStatus !== 1){
                    // layer.alert("！");
                    this.$Modal.info({content:"单据状态不为暂存不能提交！",title:"提示信息"});
                    return;
                }
                $.ajax({
                    type: "POST",
                    url: contextPath+"/requisition/submit",
                    dataType: "json",
                    data:{"id":document[0].id,"organizationId":document[0].organizationId},
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
		approval() {
            //发送请求
            let This = this;
            let datas = this.selected;
            console.log(datas,4958934)
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
                this.$Modal.warning({
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
                url:contextPath + '/requisition/submitapproval?submitType=1',
                method:'post',
                contentType:'application/json;charset=utf-8',
                data:JSON.stringify({
                    receiptsId:This.documentCode,
                    approvalResult:(This.modalType == 'reject'? 1 : 0),
                }),
                success:function (res) {
                    if(res.code === '100100'){

                    }else {
                        This.$Modal.warning({content:res.msg});
                    }
                }
            });
        },

        ajaxUpdateDocStatusById(id,docStatus){
            let This = this;

            $.ajax({
                url:contextPath+ '/requisition/updateDocumentStatusByid',
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
        this.openTime = window.parent.params.openTime;
    }
})