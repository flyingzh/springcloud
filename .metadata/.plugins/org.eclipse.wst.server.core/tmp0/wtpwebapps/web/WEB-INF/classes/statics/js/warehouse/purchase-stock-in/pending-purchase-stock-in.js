var vm = new Vue({
    el: "#app",
    data: {
        isShow: false,
        isEdit: false,
        reload: false,
        isSearchHide: true,
        isTabulationHide: true,
        selectBusinessType:[
            {
                value: "普通销售",
                label: "普通销售"
            },
            {
                value: "受托加工销售",
                label: "受托加工销售"
            }
        ],
        body: {
            ordereNo:'',
            qualityStatus:'',
            supplierId:'',
            businessStatus:2,
        },
        data_config: {
            url: contextPath+"/purchasestock/queryPendingStockList",
            datatype:"json",
            colNames: ['','','','','源单类型', '单据编号','质检状态', '商品类型', '日期', '供应商',"收料重量","收料数量","合格数量",'不合格数量',"特别放行数量","业务员"],
            colModel:[
                {name: "cId",width: 210, align: "left",hidden:true},
                {name: "supplierId",width: 210, align: "left",hidden:true},
                {name: "customerId",width: 210, align: "left",hidden:true},
                {name: "goodsTypePath",width: 210, align: "left",hidden:true},
                {name: "businessType",width: 210, align: "left",
                formatter(value){
                    switch (value){
                        case 'P_RECEIPT_01':return '收货单一客户送料';break;
                        case 'P_RECEIPT_02':return '收货单一标准采购收货';break;
                        case 'P_RECEIPT_03':return '收货单一受托加工收货';break;
                        case 'P_RECEIPT_04':return '收货单一供应商退料';break;
                        case 'P_RECEIPT_OLD_RECYCLE_DISCOUNT':return '旧料收回单-折现';break;
                        case 'P_RECEIPT_OLD_RECYCLE_INNER':return '旧料收回单-内部处理';break;
                        case 'P_RECEIPT_INNER_REPAIR':return '维修收回单-内部处理';break;
                        default:return '';
                    }
                },
                unformat(value){
                    switch (value){
                        case '收货单一客户送料':return 'P_RECEIPT_01';break;
                        case '收货单一标准采购收货':return 'P_RECEIPT_02';break;
                        case '收货单一受托加工收货':return 'P_RECEIPT_03';break;
                        case '收货单一供应商退料':return 'P_RECEIPT_04';break;
                        case '旧料收回单-折现':return 'P_RECEIPT_OLD_RECYCLE_DISCOUNT';break;
                        case '旧料收回单-内部处理':return 'P_RECEIPT_OLD_RECYCLE_INNER';break;
                        case '维修收回单-内部处理':return 'P_RECEIPT_INNER_REPAIR';break;
                        default:return '';
                    }
                }},
                {name: "orderNo",width: 210, align: "left",
                    formatter: function (value, grid, rows, state) {
                        $(document).off('click',".detail"+ value).on('click',".detail"+ value,function(e){
                            e.preventDefault();
                            vm.viewUpstreamDoc(rows);
                        });
                        let myCode =  `<a class="detail${value}">${value}</a>`;
                        return  myCode;
                    },
                    unformat: function (value, grid, rows) {
                        return value.replace(/(<\/?a.*?>)/g, '');
                    }
                },
                {name: "qualityStatus", width: 210, align: "left",formatter(value,grid,rows){
                    if(value == 5){
                        if(Number(rows['releaseQuantityCount']) > 0 ){
                            return '放行';
                        }else {
                            return '合格';
                        }
                    }else {
                        switch (value){
                            case 1:return '待质检';break;
                            case 2:return '不合格';break;
                            case 3:return '合格';break;
                            case 4:return '特别放行';break;
                            default:return '';
                        }
                    }
                }},
                {name: "categoryName",width: 210, align: "left"},
                {name: "receiptDate", align: "left", width: 210},
                {name: "supplierName", align: "left", width: 210},
                {name: "takeDeliveryWeight", align: "right", width: 210},
                {name: "takeDeliveryCount", align: "right", width: 210},
                {name: "qualifiedCount", align: "right", width: 210},
                {name: "unqualifiedCount",align: "right", width: 210},
                {name: "releaseQuantityCount",align: "right", width: 210},
                {name: "salesmanName",align: "left", width: 210}
                ],
            autoScroll: true,
            shrinkToFit:false
        },
        categoryType:[],
        goodsTypes:[],
        qualityStatusArr:[
            // {label:'待质检',value:1},
            // {label:'不合格',value:2},
            {label:'合格',value:3},
            {label:'特别放行',value:4},
        ],
        sourceDocTypeArr:[
            {label:'收货单一客户送料',value:'P_RECEIPT_01'},
            {label:'收货单一标准采购收货',value:'P_RECEIPT_02'},
            {label:'收货单一受托加工收货',value:'P_RECEIPT_03'},
            {label:'收货单一供应商退料',value:'P_RECEIPT_04'},
            {label:'旧料收回单-折现',value:'P_RECEIPT_OLD_RECYCLE_DISCOUNT'},
            {label:'旧料收回单-内部处理',value:'P_RECEIPT_OLD_RECYCLE_INNER'},
            {label:'维修收回单-内部处理',value:'P_RECEIPT_INNER_REPAIR'},
        ],
        supplierArr:[],
        selectDates:[],
        selected:[],
        openTime:'',
    },
    created(){

        this.loadCategories();
        this.loadSuppliers();
        this.openTime = window.parent.params.openTime;
    },
    methods: {
        closeSupplier(id,code,name){
            this.body.supplierId = id;
        },
        viewUpstreamDoc(row){
            let _this = this;
            if(row.businessType === 'P_RECEIPT_01'  ||
                row.businessType === 'P_RECEIPT_02' ||
                row.businessType === 'P_RECEIPT_03' ||
                row.businessType === 'P_RECEIPT_04'
            ){
                $.post(contextPath + '/tpurchasecollectgoods/info',{code:row.orderNo},(res)=>{
                    if(res.code === '100100' ){
                        _this.goCollectGoods(res.data,4);
                    }
                },'json');
            }else if(row.businessType === 'P_RECEIPT_INNER_REPAIR'){
                _this.goRepairGoods(row.orderNo);
            }else if(row.businessType === 'P_RECEIPT_OLD_RECYCLE_INNER' ||
                     row.businessType === 'P_RECEIPT_OLD_RECYCLE_DISCOUNT'
            ){
               _this.goOldMaterial(row.orderNo);
            }

        },
        goCollectGoods(data,type){
            window.parent.activeEvent({name: '采购收货单-查看',
                url: contextPath+'/purchase/purchase-collectgoods/purchase-collectgoods-add.html',
                params: data,type:type});
        },
        goRepairGoods(orderNo){
            window.parent.activeEvent({
                name: '维修收回单-查看',
                url: contextPath+'/repair/recovery/recovery-form.html',
                params: {inOrderNo:orderNo,type:'update'}
            });
        },
        goOldMaterial(orderNo){
            window.parent.activeEvent({
                name: '查看旧料回收单',
                url: contextPath + '/oldmaterial/recycle/old-recycle-add.html',
                params: {
                    type: 'viewByCode',
                    id: orderNo
                }
            });
        },
        exit(){
            window.parent.closeCurrentTab({name: '采购入库列表', openTime: this.openTime, exit: true});
        },
        generateStockDoc(){
            let _this = this;
            // console.log(_this.selected)
         //只生成一条数据 不做合并校验
            let _selectRowData = _this.selected;
         if(_selectRowData.length < 1){
             _this.$Modal.info({
                 content:'请先选择要生成的数据!',
                 title:"提示信息"
             });
             return false;
         }
         if(_selectRowData.length > 1){
             //1 先对选中的数据进行校验 业务类型 商品类型 供应商id 客户id
             let businessType = _selectRowData[0]['businessType'],
                 msg ='',
                 flag=true,
                 supplierId=_selectRowData[0]['supplierId'],
                 customerId=_selectRowData[0]['customerId'],
                 goodsTypePath=_selectRowData[0]['goodsTypePath'];
             _selectRowData.every((item)=>{
                 if(businessType != item['businessType']){
                     msg +='源单类型不同，';
                     flag=false;
                 }
                 if(goodsTypePath != item['goodsTypePath']){
                     msg +='商品类型不同，';
                     flag=false;
                 }
                 if(supplierId &&(supplierId != item['supplierId'])){
                     msg +='供应商不同，';
                     flag=false;
                 }
                 if(customerId && (customerId != item['customerId'])){
                     msg +='客户不同，';
                     flag=false;
                 }
                 return flag;
             });
             if(!flag){
                _this.$Modal.info({
                    content:'选中的单据不能合并生成，因为'+msg,
                    title:"提示信息"
                });
                return false;
             }else{
                 console.log(_selectRowData.map((item)=>Object.assign({},{
                     businessType:item.businessType,
                     goodsTypePath:item.goodsTypePath,
                     supplierId:item.supplierId,
                     customerId:item.customerId
                 })));
                 window.parent.activeEvent(
                     {name: '采购入库单-新增',
                         url: contextPath+'/warehouse/purchase-stock-in/purchase-stock-in-info.html',
                         params: {'type':'sAdd','ids':JSON.stringify(_selectRowData.map(e=>Object.assign({},{id:e.cId,businessType:e.businessType})))}
                     }
                 );
             }
         }
         window.parent.activeEvent(
                {name: '采购入库单-新增',
                    url: contextPath+'/warehouse/purchase-stock-in/purchase-stock-in-info.html',
                    params: {'type':'sAdd','ids':JSON.stringify(_selectRowData.map(e=>Object.assign({},{id:e.cId,businessType:e.businessType})))}
                }
          );

        },
        changeDate(value){
            if(value[0] && value[value.length-1] ){
                this.body.startTime=value[0].replace(/\//g, '-') + ' 00:00:00';
                this.body.endTime=value[1].replace(/\//g, '-') + ' 23:59:59';
            }else {
                this.body.startTime=null;
                this.body.endTime=null;
            }
        },
        search(){
            let _this = this;
            _this.reload = !_this.reload;
        },
        changeGoodsType(a,b){
            if(!a.length && !b.length){
                this.body.goodsTypePath = '';
            }else {
                this.body.goodsTypePath = '0.'+a.join('.')+'.';
            }

        },
        loadCategories(){
            let _this = this;
            $.ajax({
                type: "post",
                url: contextPath+'/purchasestock/queryCategories',
                data:{parentId:0},
                dataType: "json",
                success: function (data) {
                    if(data.code === '100100'){
                        _this.categoryType = _this.initGoodCategory(data.data.cateLists);
                    }
                },
                error: function () {

                }
            })
        },
        initGoodCategory(type) {
            let _this = this;
            let result = [];
            type.forEach((item) => {
                let {
                    id: value,
                    name: label,
                    cateLists: children
                } = item;
                if (children) {
                    children = _this.initGoodCategory(children)
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
        handleClearSelect(val){
            this.$refs[val].reset();
            this.$nextTick(()=>{
                this.body.businessType = '';
            });
        },
        clear() {
            let _this = this;
            _this.selectDates=[];
            _this.body.startTime='';
            _this.body.endTime = '';
            _this.body.orderNo = '';
            _this.goodsTypes=[];
            _this.body.goodsTypePath ='';
            // if(_this.body.qualityStatus){
            //    _this.$refs.qualityStatus.reset();
            //    _this.$nextTick(()=>{
            //        _this.body.qualityStatus='';
            //    });
            // }
            if(_this.body.businessType){
                _this.$refs.businessType.reset();
                _this.$nextTick(()=>{
                    _this.body.businessType = '';
                });
            }
            // if(_this.body.supplierId){
            //     _this.$refs.selectSupplier.clear();
            //     _this.body.supplierId = '';
            // }
        },
        refresh(){
            let _this = this;
            _this.clear();
            _this.reload = !_this.reload;
        },
        loadSuppliers(){
            let _this=this;
            $.ajax({
                url:contextPath+ '/purchasestock/querySuppliers',
                method:'POST',
                dataType:'json',
                data:{},
                success:function (data) {
                    _this.supplierArr = [];
                    if(data.code === '100100'&& data.data.length > 0 ){
                        data.data.forEach((item)=>{
                            _this.supplierArr.push(Object.assign({},{label:item.siShortName,value:item.id,code:item.supplierCode}));
                        });
                    }else{

                    }
                }
            });
        },
    }
})