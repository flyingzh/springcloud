var purchaseOrderList = new Vue({
    el: '#purchaseOrderList',
    data() {
        let This = this;
        return {
            openTime: '',
            isSearchHide: true, //搜索栏
            isTabulationHide: true, // 列表
            isShow: false,
            isHide:true,
            isEdit: false,
            reload: false,
            selected: [],
            suppliers:[],
            categoryType:[],
            empList:[],
            documentStatusList:[],
            commodityCategoty:[],
            dateArr:'',
            //当前组织下所有的员工
            employees:[],
            body: {
                goodsTypeName:'',
                supplierId:'',
                supplierName:'',
                orderStatus:'',
                salesmanName:'',
                salesmanId:'',
                orderNo:'',
                businessTypeId:'',
                startTime:'',
                endTime:''
            },
            data_config: {
                url: contextPath + '/tpurchaseorder/list',
                colNames: ['单据编号', 'id','日期', '业务类型', '供应商','单据状态', '商品类型', '采购员', '采购重量','采购数量'],
                colModel: [
                    {name: 'orderNo', index: 'orderNo', width: 220, align: "left",
                        formatter: function (value, grid, rows, state) {
                            // console.log(value, grid, rows, state);
                            $(document).off('click', ".detail" + value).on('click', ".detail" + value, function () {
                                This.testOrderDetailClick({value, grid, rows, state})
                            });
                            let myCode = `<a class="detail${value}">${value}</a>`;
                            return myCode;
                        },
                        unformat: function (value, grid, rows) {
                            return value.replace(/(<\/?a.*?>)/g, '');
                        }
                    },
                    {name: 'id', hidden:true},
                    {name: 'purchaseDate', index: 'purchaseDate', width: 150, align: "center",align:"left",
                        formatter :function (value, grid, rows, state) {
                            return new Date(value).format("yyyy-MM-dd");
                        }
                    },
                    {name: 'businessTypeId', index: 'businessTypeId', align: "left", width: 150,
                        formatter:function (value, grid, rows, state) {
                            if(value === 'P_ORDER_01' ){
                                return '标准采购';
                            }else if(value === 'P_ORDER_02'){
                                return '受托加工采购';
                            }else{
                                return '';
                            }
                        }    
                    },
                    {name: 'supplierName', index: 'supplierName', align: "left", width: 150},
                    {name: 'orderStatus', index: 'orderStatus', align: "left", width: 150,
                        formatter: function (value, grid, rows, state) {
                            if (value === 1) {
                                return '暂存';
                            }else if(value === 2){
                                return '待审核';
                            }else if(value === 3){
                                return '审核中';
                            }else if(value === 4){
                                return '已审核';
                            }else if(value === 5){
                                return '驳回';
                            }
                        }
                    },
                    {name: 'goodsTypeName', index: 'goodsTypeName', align: "left", width: 150},
                    {name: 'salesmanName', index: 'salesmanName', align: "left", width: 150},
                    {name: 'purchaseWeight', index: 'purchaseWeight', align: "right",width: 150},
                    {name: 'purchaseCount', index: 'purchaseCount', align: "right", width: 150},
                ],
            },
        }
    },
    methods: {
        closeSupplier(id, code, name){
            console.log(id, code, name);
            this.body.supplierId = id;
        },
        changeDate(value) {
            this.body.startTime = value[0].replace(/\//g, '-') + ' 00:00:00';
            this.body.endTime = value[1].replace(/\//g, '-') + ' 23:59:59';
        },

        clearItem(name, ref){
            if(this.$refs[ref]){
                this.$refs[ref].reset();
            }
            this.$nextTick(()=>{
                this.body[name] = '';
            })
        },

        //加载供应商
        loadSuppliers(){
            var That = this;
            $.ajax({
                type: "post",
                url: contextPath + '/tpurchasecollectgoods/findSupplierByOrgId',
                dataType: "json",
                success: function (r) {
                    That.suppliers =  r.data;
                },
                error: function () {
                    console.log('服务器出错啦');
                }
            })
        },
        //搜索清空按钮
        search() {
            console.log(this.body);
            if(this.body.startTime == ' 00:00:00'){
                this.body.startTime = '';
                this.body.endTime = '';
            }
            if(this.commodityCategoty.length > 0){
                this.body.goodsTypeName=this.commodityCategoty[this.commodityCategoty.length-1];
            }else {
                this.body.goodsTypeName='';
            }
            this.reload=!this.reload;
        },
        //根据单据编号查详情
        testOrderDetailClick(data) {
            console.log(data);
            let code = data.rows.orderNo;
            let basic = data.rows;
            if (code) {
                this.queryOrderByOrderNo(code, true, basic);
            }
        },
        queryOrderByOrderNo(code, isEdit, basic) {
            window.parent.activeEvent({
                name: '查看采购订单',
                url: contextPath + '/purchase/purchase-order/purchase-order.html',
                params: {
                    docCode: code,
                    type: 'query',
                    basicInfo: basic
                }
            });
        },
        clear() {
           // this.$refs.supplier.reset();
           this.$refs.supplier.clear();
           this.$refs.saleName.reset();
           this.body.goodsTypeName = '';
           this.body.supplierId = '';
           this.body.orderStatus = '';
           this.body.salesmanName = '';
           this.body.orderNo = '';
           this.body.businessTypeId = '';
           this.body.startTime = '';
           this.body.endTime = '';
           this.dateArr = [];
           this.commodityCategoty = [];
            console.log(this.body);
        },
        loadData() {
            var That = this;
            $.ajax({
                type: "post",
                url: contextPath + '/tpurchasecollectgoods/data',
                dataType: "json",
                success: function (r) {
                    That.employees =r.data.employees; //加载当前公司下面所有的员工
                },
                error: function () {
                    console.log('服务器出错啦');
                }
            })
        },
        //顶部菜单栏按钮
        refresh(){
            this.clear();
            this.reload = !this.reload;
        },
        add() {
            window.parent.activeEvent({name: '新增采购订单', url: contextPath +'/purchase/purchase-order/purchase-order.html',params:{type:'add'}});
        },
        del() {
            let This = this,flag = true;
            if(this.selected.length < 1) {
                this.$Modal.warning({
                    title: '提示信息',
                    content: '请先选择至少一条数据！'
                });
                return;
            } else  {
              //判断所选数据行是否都为暂存状态，只有暂存才能删除，并且来自源单的数据不能删除
               let rowData = this.selected;
               for(var i = 0; i<rowData.length; i++){
                   if(rowData[i].orderStatus !== 1){
                       this.$Modal.warning({
                           title: '提示信息',
                           content: `单据编号为${rowData[i].orderNo}'的单据已进入审批流，不能删除！`
                       });
                       flag = false;
                       break;
                   }
                   /*if(rowData[i].dataSources === 2){
                       this.$Modal.warning({
                           title: '提示信息',
                           content: '单据编号为' + rowData[i].orderNo +'的单据数据源自采购下单，不能删除！'
                       });
                       flag = false;
                       break;
                   }*/
               }
               if(flag){
                   let ids = [];
                   for(var i = 0; i<rowData.length; i++) {
                       ids.push(rowData[i].id);
                   }
                   console.log(ids);
                   this.$Modal.confirm({
                       title: '提示信息',
                       content: '是否删除信息？',
                       onOk: () =>{
                            console.log(JSON.stringify(this.selected));
                            $.ajax({
                                url: contextPath + '/tpurchaseorder/deleteOrder',
                                method: 'post',
                                dataType: "json",
                                data: JSON.stringify(ids),
                                contentType: 'application/json;charset=utf-8',
                                success: function (data) {
                                    if(data.code === '100100') {
                                        setTimeout(function(){
                                            This.$Modal.success({
                                                title:'提示信息',
                                                content:'删除成功！'
                                            })
                                        },300)
                                        This.refresh();
                                    } else {
                                        setTimeout(function(){
                                            This.$Modal.warning({
                                                title:'提示信息',
                                                content:'删除失败，请稍后再试！'
                                            })
                                        },300)
                                    }
                                },
                                error: function (e) {
                                    console.log(e);
                                }
                            })
                        },
                   })
               }
            }
        },
        //点击修改
        modify() {
            if(this.selected.length < 1) {
                this.$Modal.info({
                    title: '提示信息',
                    content: '请先选择至少一笔数据！'
                });
                return;
            } else if(this.selected.length > 1) {
                this.$Modal.info({
                    title: '提示信息',
                    content: '只能选择一笔数据进行修改！'
                });
                return;
            } else{
                let sourceData = this.selected;
                if(sourceData[0].orderStatus !== 1){
                    this.$Modal.info({
                        title: '提示信息',
                        content: '只有暂存状态下才能修改数据，请重新选择！'
                    });
                    return;
                }
                window.parent.activeEvent({
                    name: '修改采购订单',
                    url: contextPath +'/purchase/purchase-order/purchase-order.html',
                    params:{
                        basicInfo:sourceData[0],
                        type:'update'}
                });
            }

        },
        cancel() {
            window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
        },
        //加载商品类型
        loadProductType() {
            var That = this;
            $.ajax({
                type: "post",
                url: contextPath + '/documentController/getCategory?parentId=0',
                contentType: 'application/json',
                dataType: "json",
                success: function (res) {
                    That.categoryType = That.initGoodCategory(res.data.cateLists)
                },
                error: function (err) {
                    console.log("服务器出错");
                },
            })
        },
        initGoodCategory(type) {
            let result = [];
            type.forEach((item) => {
                let {
                    name: value,
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
    },
    created(){
        this.loadProductType();
        this.loadSuppliers();
        this.loadData();//业务员
    },
    watch: {
        'body.businessTypeId':function(val){
           if(typeof val == 'undefined'){
               this.body.businessTypeId = '';
           }
        },
        'body.orderStatus':function(val){
            if(typeof val == 'undefined'){
                this.body.orderStatus = '';
            }
        },
        'body.salesmanName':function(val){
            if(typeof val == 'undefined'){
                this.body.salesmanName = '';
            }
        },
        'body.supplierId':function(val){
            if(typeof val == 'undefined'){
                this.body.supplierId = '';
            }
        }
    },
    mounted(){
        this.openTime = window.parent.params.openTime;
    },
})
