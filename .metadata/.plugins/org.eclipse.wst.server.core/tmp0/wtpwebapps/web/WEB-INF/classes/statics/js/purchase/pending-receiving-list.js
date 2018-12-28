var purchaseOrderList = new Vue({
    el: '#pendingReceivingList',
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
            categoryType:[],
            empList:[],
            commodityCategoty:[],
            dateArr:[],
            body: {
                productTypeName:'',
                businessTypeId:'',
                supplierId:'',
                salesmanName:'',
                startDate:'',
                endDate:'',
                orderNo:'',
                startTime:'',
                endTime:''
            },
            data_config: {
                // url: "./list.json",
                url: contextPath+"/tbasecustomer/list",
                colNames: ['源单类型','单据编号','id','日期',  '供应商','采购员', '商品类型', '采购重量','已收货重量','待收货重量','采购数量','已收货数量','待收货数量'],
                colModel: [
                    {name: 'documentType', index: 'bussinessType', align: "left", width: 180,

                    },
                    {name: 'documentNo', index: 'documentCode', width: 180, align: "left",
                        formatter: function (value, grid, rows, state) {
                            $(document).off('click',".detail"+ value).on('click',".detail"+ value,function(){
                                console.log({value, grid, rows, state});
                            });
                            let myCode =  `<a class="detail${value}">${value}</a>`;
                            return  myCode;
                        },
                        unformat: function (value, grid, rows) {
                        return value.replace(/(<\/?a.*?>)/g, '');
                        }
                        },
                    {name: 'id', hidden:true},
                    {name: 'purchaseDate', index: 'purchaseDate', width: 180, align: "center",align:"left",
                        formatter :function (value, grid, rows, state) {
                            return new Date(value).format("yyyy/MM/dd");
                        }
                    },
                    {name: 'supplierName', index: 'supplierName', align: "left", width: 180,
                     
                    },
                    {name: 'chargePerson', index: 'chargePerson', align: "left", width: 180},
                    {name: 'productType', index: 'productType', align: "left", width: 180},

                    {name: 'weight', index: 'weight', width: 180, align: "left"},
                    {name: 'pendingWeight', index: 'weight', width: 180, align: "left"},
                    {name: 'receivedWeight', index: 'weight', width: 180, align: "left"},
                    {name: 'quantity', index: 'quantity', align: "left", width: 180},
                    {name: 'pendingQuantity', index: 'quantity', align: "left", width: 180},
                    {name: 'receivedQuantity', index: 'quantity', align: "left", width: 180},
                 
                ],
            },
        }
    },
    methods: {
        //转换搜索栏日期格式
        changeDate(value){
            this.body.startTime=value[0].replace(/\//g, '-') + ' 00:00:00';
            this.body.endTime=value[1].replace(/\//g, '-') + ' 23:59:59';
        },
        //搜索清空按钮
        search() {
            console.log(this.body);
            if(this.commodityCategoty.length>0){
                this.body.productTypeName=this.commodityCategoty[this.commodityCategoty.length-1];
            }else {
                this.body.productTypeName="";
            }
            if (this.dateArr.length > 0 && this.dateArr[0] && this.dateArr[1]) {
                this.body.startDate = this.dateArr[0].format("yyyy-MM-dd");
                this.body.endDate = this.dateArr[1].format("yyyy-MM-dd");
            } else {
                this.body.startDocDate = '';
                this.body.endDocDate = '';
            }
            this.reload = !this.reload;

        },
      
        clear() {
          
        },
        //顶部菜单栏按钮
        refresh(){

        },
        generateReport() {
        },
        cancel() {

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
        //加载业务员信息
        loadEmplist(){
            $.ajax({
                type: "post",
                // url: contextPath + '',
                url:'./empList.json',
                dataType: "json",
                success: function (data) {
                    purchaseOrderList.empList = data.data;
                },
                error: function () {
                    alert('服务器出错啦');
                }
            })
        },
        //加载单据状态
        // loadDocumentStatus(){
        //     $.ajax({
        //         type: "post",
        //         // url: contextPath + '',
        //         url:'./documentStatus.json',
        //         dataType: "json",
        //         success: function (data) {
        //             purchaseOrderList.documentStatusList = data.data;
        //         },
        //         error: function () {
        //             alert('服务器出错啦');
        //         }
        //     })
        // }

    },
    created(){
        this.loadProductType();
        this.loadEmplist();
        // this.loadDocumentStatus();
    },
    watch: {
    
    },
    mounted(){
    
    },
})
