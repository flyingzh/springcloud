let supplierScoreList = new Vue({
    el:"#supplier_score",
    data(){
        return {
            isHideSearch: true,
            isHideList: true,
            suppliers:[],
            body:{
                //供应商编码
                supplierCode:"",
                //供应商名称
                supplierName:"",
                //商品编码
                goodsCode:"",
                //商品名称
                goodsName:"",
                openTime:""
            },
            data_user_list:{
                url: contextPath + '/supplierScore/list',
                colNames: ['供应商编码','供应商名称',"商品编码", "商品名称","款式类别", "供货周期(天)","质量合格率(%)","工费率(%)","损耗率(%)","其他(%)","评分","商品id","供应商id"],
                colModel:
                    [
                        {name: "supplierCode", index: "supplierCode", width: 100, align: "center",
                            formatter: function (value, grid, rows, state) {
                                var cssClass = ".detail" + value;
                                $(document).off('click', cssClass).on('click', cssClass, function () {
                                    supplierScoreList.supplierClick({value, grid, rows, state});
                                });
                                let myCode = `<a class="detail${value}">${value}</a>`;
                                return myCode;
                            }
                        },
                        {name: "supplierName", index: "supplierName", width: 100, align: "center"},
                        {name: "goodsCode", index: "goodsCode", width: 100, align: "center",
                            formatter: function (value, grid, rows, state) {
                                var cssClass = ".detail" + value;
                                $(document).off('click', cssClass).on('click', cssClass, function () {
                                    supplierScoreList.goodsClick({value, grid, rows, state});
                                });
                                let myCode = `<a class="detail${value}">${value}</a>`;
                                return myCode;
                            }
                        },
                        {name: "goodsName", index: "goodsName", width: 100, align: "center"},
                        {name: "styleName", index: "styleName", width: 100, align: "center"},
                        {name: "supplierDay", index: "supplierDay", width: 100, align: "center"},
                        {name: "passRate", index: "passRate", width: 100, align: "center"},
                        {name: "laborChargesRate", index: "laborChargesRate", width: 90, align: "center"},
                        {name: "lossRate", index: "lossRate", width: 90, align: "center"},
                        {name: "otherRate", index: "otherRate", width: 90, align: "center"},
                        {name: "totleScore", index: "totleScore", width: 90, align: "center"},
                        {name:"commodityId",index:"commodityId",width: 10, align: "center",hidden:true},
                        {name:"supplierId",index:"supplierId",width: 10, align: "center",hidden:true}
                    ],
                multiselect: false,
            },
            reload:true,
            selected:[]
        }


    },
    methods:{
        search(){
            this.reload = !this.reload
        },
        closeSupplier(id,code,name) {
            this.body.supplierName = name;
        },
        //查看商品信息
        goodsClick(data) {
            var commodityId = data.rows.commodityId;
            window.parent.activeEvent({
                name: '商品',
                url: contextPath + '/base-data/commodity/commodity-info.html',
                params: {type: 'skip', id: commodityId}
            });

        },
        //查看供应商信息
        supplierClick(data){
            var supplierId = data.rows.supplierId;
            window.parent.activeEvent({
                name: '供应商 - 查看',
                url: contextPath + '/base-data/supplier/supplier-list.html',
                params: {type: 'query', id: supplierId}
            });
        },

        //加载供应商 tpurchasecollectgoods
        loadSuppliers(){
            var That = this;
            $.ajax({
                type: "post",
                url: contextPath + '/supplierScore/findSupplierByOrgId',
                dataType: "json",
                success: function (r) {
                    That.suppliers =  r.data;
                },
                error: function () {
                    console.log('服务器出错啦');
                }
            })
        },
        //退出
        cancel(){
            window.parent.closeCurrentTab({name: '供应商评分', exit: true, openTime: supplierScoreList.openTime})

        },
        refresh(){
            this.clear();
            this.reload = !this.reload
        },
        clear(){
            this.body = {
                supplierCode: '',//供应商编号
                supplierName: '',//供应商名称
                goodsCode: '',//商品编码
                goodsName: '',//商品名称
                isDel: 1,//是否删除1-未删除，0-已删除
            };
            this.$refs.customerRef.clear();
        },
    },
    mounted() {
        this.openTime = window.parent.params.openTime;
        this.loadSuppliers();

    }






})