var vm = new Vue({
    el: "#app",
    data: {
        openTime:'',
        isShow: false,
        isEdit: false,
        reload: false,
        isSearchHide: true,
        isTabulationHide: true,
        customerModel:{},
        selectType: [
            {
                value: "S_OUT_STOCK",
                label: "销售出库单"
            },
            {
                value: "P_APPLY_DELIVER",
                label: "采购送料单"
            },
            {
                value: "P_RETURN_STOCK",
                label: "采购退库单"
            },
            {
                value: "W_EMATERIAL_OUT",
                label: "受托加工材料出库单"
            },
            {
                value: "REPAIR_OUTPUT",
                label: "维修商品发出单"
            },
            {
                value: "REPAIR_SHIP",
                label: "维修商品发货单"
            },
            {
                value: "REPAIR_RETURN",
                label: "维修商品退货单"
            },
            {
                value: "O_MATERIALS_OUTPUT",
                label: "旧料外发单"
            },
            {
                value: "O_MATERIALS_RETURN",
                label: "旧料退料单"
            },
            {
                value: "O_MATERIALS_REVERT",
                label: "旧料返料单"
            },
            {
                value: "P_CREDENTIAL_OUT",
                label: "证书商品发出单"
            }
        ],
        body: {
            docCode: '',
            docNo: '',
            custId:"",
            supplierId:""
        },
        customerList:[],
        supplierList:[],
        data_config: {
            url: contextPath+"/logisticsdispatching/pendingList",
            datatype:"json",
            colNames: ['源单类型','源单Code', '源单编号','下单日期','物流方式','客户id', '客户', '供应商id','供应商','业务类型','源单id'],
            colModel:[
                {name: "docName",width: 210, align: "left"},
                {name: "docCode", hidden:true, width: 210, align: "left"},
                {name: "docNo",width: 210, align: "left",
                    formatter: function (value, grid, rows, state) {
                        $(document).off("click", ".detail" + value).on("click", ".detail" + value, function (e) {
                            e.preventDefault()
                            vm.documentCodeClick(rows);
                        });
                        let btns = `<a class="detail${value}">${value}</a>`;
                        return btns
                    },
                    unformat:function (val,grid,rows) {
                        return val.replace(/(<\/?a.*?>)/g, '');
                    }
                    },
                {name: "docTime", width: 210, align: "left",
                    formatter: function (value, grid, rows, state) {
                        return new Date(value).format("yyyy-MM-dd");
                     }
                },
                {name: "logisticsMode",width: 210, align: "left",
                    formatter: function (value, grid, rows, state) {
                        switch (value){
                            case 'wlfs_js':return '寄送'
                            break;
                            case 'wlfs_shsm':return '送货上门'
                            break;
                        }
                    }
                },
                {name: "custId", hidden:true, align: "left", width: 210},
                {name: "custName", align: "left", width: 210},
                {name: "supplierId", hidden: true, align: "left", width: 210},
                {name: "supplierName", align: "left", width: 210},
                {name: "businessType",hidden:true},
                {name: "sourceDocumentId",hidden:true}
            ],
            rowNum : 5,//一页显示多少条
            rowList : [ 10, 20, 30 ],//可供用户选择一页显示多少条
            mtype : "post",//向后台请求数据的ajax的类型。可选post,get
            viewrecords : true
        },
        selected:[],
    },
    methods: {
        handleClearType(){
            this.$refs.docCode.reset();
            this.$nextTick(() => {
                this.body.docCode = '';
            });
        },
        documentCodeClick(rows){
            if(rows.docCode == 'S_OUT_STOCK'){
                window.parent.activeEvent({
                    name: '查看销售出库单',
                    url: contextPath + '/sale/saleoutstock/saleoutstock-add.html',
                    params: {
                        type: 'other',
                        data: rows.docNo
                    }
                });
            }
            if(rows.docCode == 'P_APPLY_DELIVER'){
                $.ajax({
                    url:contextPath + '/purchaseDeliverController/queryByOrderInfo/'+rows.sourceDocumentId,
                    method:'post',
                    dataType:'json',
                    success:function(data){
                        if(data.code == '100100'){
                            window.parent.activeEvent({
                                name: '采购送料单-详情',
                                url: contextPath + '/purchase/purchase-deliver/deliver-add.html',
                                params: {type: 'detail',goodsData:data.data,activeType:'detail'}
                            });
                        }else{
                            // layer.alert(, {icon: 0});
                            this.$Modal.info({content:data.msg,title:"提示信息"})
                        }
                    },
                    error:function(){
                        // layer.alert('', {});
                        this.$Modal.warning({content:"服务器异常，请稍后再试！",title:"提示信息"})
                    }
                });
            }
            if(rows.docCode == 'W_EMATERIAL_OUT'){
                window.parent.activeEvent({
                    name: '查看受托加工材料出库单',
                    url: contextPath + '/warehouse/entrust-material-out/entrust-material-out-info.html',
                    params: {activeType: "listQuery",documentNo:rows.docNo}
                });
            }
            if(rows.docCode == 'P_CREDENTIAL_OUT'){
                window.parent.activeEvent({
                    name: '查看外发证书单详情',
                    url: contextPath+'/purchase/certificateOutbreaks/certificate-add.html',
                    params: {
                        type: 'id',
                        id: rows.sourceDocumentId
                    }
                });
            }
            if(rows.docCode == 'P_RETURN_STOCK'){
                $.ajax({
                    url:contextPath + '/rurchaseReturnGoods/queryByOrderInfo/'+rows.sourceDocumentId+"/"+rows.businessType,
                    method:'post',
                    dataType:'json',
                    success:function(data){
                        if(data.code == '100100'){
                            window.parent.activeEvent({
                                name: '采购退库单详情',
                                url: contextPath + '/purchase/returngoods/returngoods-add.html',
                                params: {type: 'detail',goodsData:data.data,activeType:'detail'}
                            });
                        }else{
                            // layer.alert(, {icon: 0});
                            this.$Modal.info({content:data.msg,title:"提示信息"})
                        }
                    },
                    error:function(){
                        this.$Modal.warning({content:"服务器异常，请稍后再试！",title:"提示信息"})
                    }
                });
            }
            if(rows.docCode == "O_MATERIALS_OUTPUT"){
                window.parent.activeEvent({
                    name:'旧料外发单--查看',
                    url:contextPath +'/oldmaterial/output/output-add.html',
                    params:{
                        type:'view',
                        queryInfo:rows.sourceDocumentId
                    }
                })
            }
            if(rows.docCode == "O_MATERIALS_RETURN"){
                window.parent.activeEvent({
                    name: '旧料退料单详情',
                    url: contextPath+'/oldmaterial/return/oldmaterial_return_add.html',
                    params: {
                        type: 'id',
                        id: rows.sourceDocumentId
                    }
                });
            }
            if(rows.docCode == "O_MATERIALS_REVERT"){
                window.parent.activeEvent({
                    name: '旧料返料单详情',
                    url: contextPath + '/oldmaterial/revert/revert-add.html',
                    params: {
                        id: rows.sourceDocumentId,
                        type: 'query',
                    }
                });
            }
            //查看维修退货详情
            if(rows.docCode == "REPAIR_RETURN"){
                let data = [];
                data.push(2);
                data.push(rows.docNo);
                data.push(4);
                window.parent.activeEvent({
                    name: '维修退货单详情',
                    url: contextPath + '/repair/repair-Return/repair-return-add.html',
                    params: {
                        allInfo: data,
                        type: 'query'
                    }
                });
            }
            //维修发出
            if(rows.docCode == "REPAIR_OUTPUT"){
                window.parent.activeEvent({
                    name: '维修发出单-查看',
                    url: contextPath+'/repair/sendout/sendout-form.html',
                    params: {outOrderNo:rows.docNo,type:'update'}
                });
            }
            //维修发货
            if(rows.docCode == "REPAIR_SHIP"){
                let This = this;
                $.ajax({
                    type: "POST",
                    async: false,
                    url: contextPath + "/repairShipOrder/queryAllShipOrderEntity",
                    dataType: "json",
                    data: {"shipOrderNo": rows.docNo},
                    success: function (res) {
                        if(res.code==="100100"){
                            window.parent.activeEvent({
                                name: '维修发货-查看',
                                url: contextPath + '/repair/repair-delivery/repair-delivery-add.html',
                                params: {allInfo:res.data , type: 'query'}
                            });
                        }else{
                            this.$Modal.warning({
                                title: "提示信息",
                                content: "数据异常!"
                            });
                        }
                    }
                })
            }
        },
        clear() {
            this.body.docNo = '';
            this.$refs.cust.clear();
            this.customerModel = {};
            if(this.body.supplierId){
                this.$refs.supplier.clear();
                this.body.supplierId = '';
            }
            if (this.body.docCode) {
                this.$refs.docCode.reset();
                this.$nextTick(() => {
                    this.body.docCode = '';
                });
            }

        },
        search() {
            this.body.custId = this.customerModel.id ? this.customerModel.id : "";
            this.reload = !this.reload;
        },
        //刷新
        reloadAgain() {
            this.clear();
            this.reload = !this.reload;
        },
        generateLogistics() {
            let This = this;
            let logistics = This.selected;
            if (logistics.length < 1) {
                This.$Modal.info({
                    title: '提示信息',
                    content: '至少选择一条数据！'
                });
                return;
            }else if(logistics.length === 1){
                //将logistics带去物流新增
                console.log("选取的源单信息",logistics);
                window.parent.activeEvent({
                    name: '新增物流配送单',
                    url: contextPath + '/warehouse/logistics-dispatch/logistics-dispatch-info.html',
                    params: {data:logistics,type:"generater"}
                });
            }else {
                let logDocCode = logistics[0].docCode;
                let logLogisticsMode = logistics[0].logisticsMode;
                let logCustId = logistics[0].custId;
                let logSupplierId = logistics[0].supplierId;
                for(let i = 1 ;i < logistics.length; i++){
                    if(logistics[i].docCode === logDocCode){
                        if(logistics[i].logisticsMode === logLogisticsMode){
                            if(logistics[i].custId === logCustId){
                                if(logistics[i].supplierId === logSupplierId){
                                    console.log("选取的源单信息",logistics);
                                    //将logistics带去物流新增
                                    if(i == logistics.length-1){
                                        window.parent.activeEvent({
                                            name: '新增物流配送单',
                                            url: contextPath + '/warehouse/logistics-dispatch/logistics-dispatch-info.html',
                                            params: {data:logistics,type:"generater"}
                                        });
                                    }
                                }
                                else {
                                    This.$Modal.info({
                                        title: '提示信息',
                                        content: '单据供应商不一样不能一起生成！'
                                    });
                                    return;
                                }
                            }else {
                                This.$Modal.info({
                                    title: '提示信息',
                                    content: '单据客户不一样不能一起生成！'
                                });
                                return;
                            }
                        }else {
                            This.$Modal.info({
                                title: '提示信息',
                                content: '单据物流方式不一样不能一起生成！'
                            });
                            return;
                        }
                    }else {
                        This.$Modal.info({
                            title: '提示信息',
                            content: '源单类型不一样不能一起生成！'
                        });
                        return;
                    }
                }
            }

        },
        exit(){
            window.parent.closeCurrentTab({name: '待发物流列表', openTime: this.openTime, exit: true});
        },
        //获取客户
        getCustomers(){
            let This = this;
            $.ajax({
                type: 'post',
                url: contextPath + '/rawapplication/queryAllCustomer',
                dataType: "json",
                success: function (data) {
                    This.customerList = data.data;
                }
            })
        },
        //获取供应商
       /* getSppliers(){
            let This = this;
            $.ajax({
                type: 'post',
                url: contextPath + '/rawapplication/getSuppliers',
                dataType: "json",
                success: function (data) {
                    This.supplierList = data.data;
                }
            })
        },*/
       closeSupplier(id,code,name){
           this.body.supplierId = id;
       }

    },
    mounted(){
        this.openTime = window.parent.params.openTime;
        this.$refs.cust.loadCustomerList('','');
        // this.getCustomers();
        // this.getSppliers();
    }
})