var vm = new Vue({
    el: "#app",
    data:{
        isShow: false,
        isEdit: false,
        isSearchHide: true,
        isTabulationHide: true,
        //条码号是否显示
        isBarCode:false,
        selectedData:[],
        selectedRow:[],
        treeSetting: {
            check: {
                enable: true,
                chkboxType:  { "Y": "", "N": "" }
            }
        },
        goodsTypeTreeSetting:{
            check: {
                enable: true
            },
            data:{
                simpleData:{
                    enable: true,
                    idKey: "id",
                    pIdKey: "parentId",
                    rootPId: 0
                },
                callback:{
                    onCheck:this.goodsTypezTree
                }
            }
        },
        categoryStyleTreeSetting:{
            check: {
                enable: true
            },
            data:{
                simpleData:{
                    enable: true,
                    idKey: "id",
                    pIdKey: "parentId",
                    rootPId: 0
                },
                key: {
                    name: "styleName"
                },
                callback:{
                    onCheck:this.categoryStylezTree
                }
            }
        },
        isHide: true,
        openTime:'',
        //查询组织弹框是否显示
        isSearchShow:false,
        //商品类型弹框是否显示
        isShowGoodsType:false,
        //控制款式类别弹框是否显示
        isCategoryStyle:false,
        warehouseList:[],
        reservoirPositionList:[],
        goodsMainType:'',
        productType:'',
        organization:'',
        productDetailModal: {
            showModal: false,
            ids: {
                goodsId: '',
                commodityId: '',
                documentType: 'W_STOCK_IN'
            }
        },
        body:{
            warehouseId:'',
            reservoirPositionId:'',
            goodsNo:'',
            goodsName:'',
            custStyleType:'',
            productTypeArr:[],
            styleCategoryArr:[],
        },
        productDetail: [],

    },
    methods: {
        //搜索
        search(){
            var organizationValue = encodeURIComponent(this.body.organization);
            var productTypeValue = this.body.productTypeArr.join(',');
            var goodsNoValue = encodeURIComponent(this.body.goodsNo);
            var goodsNameValue = encodeURIComponent(this.body.goodsName);
            var warehouseIdValue = encodeURIComponent(this.body.warehouseId) == true ? encodeURIComponent(this.body.warehouseId) : '';
            var reservoirPositionIdValue = encodeURIComponent(this.body.reservoirPositionId) == true ? encodeURIComponent(this.body.reservoirPositionId) : '';
            var custStyleTypeValue = this.body.styleCategoryArr.join(',');

            var postJson = {organization:organizationValue,productTypeArr:productTypeValue,
                goodsNo:goodsNoValue,goodsName:goodsNameValue,
                warehouseId:warehouseIdValue,reservoirPositionId:reservoirPositionIdValue,
                styleCategoryArr:custStyleTypeValue};

            //传入查询条件参数
            $("#list").jqGrid("setGridParam",{postData:postJson});
            //每次提出新的查询都转到第一页
            $("#list").jqGrid("setGridParam",{page:1});
            //提交post并刷新表格
            $("#list").jqGrid("setGridParam",{url:contextPath+"/sku/list"}).trigger("reloadGrid");

        },
        //清除
        clear() {
            this.body = {
                warehouseId: '',
                reservoirPositionId: '',
                goodsNo: '',
                goodsName: '',
                custStyleType: '',
                productTypeArr: [],
                styleCategoryArr: [],
            }
        },

        handleClearType(value){
            this.$refs[value].reset();
            this.$nextTick(() => {
                if (value === 'warehouseId'){
                    this.body.warehouseId = '';
                }
            });
        },
        //刷新
        refresh() {
            this.clear();
            this.search();
        },
        //退出
        exit() {
            window.parent.closeCurrentTab({openTime: this.openTime, exit: true,});
        },
        searchAction() {
            //功能暂且不做,注释
            //this.isSearchShow = true
        },
        goodsTypeAction() {
            this.isShowGoodsType = true;
        },

        categoryStyle() {
            this.isCategoryStyle = true;
        },
        pageInit() {
            let that = this;
            jQuery("#list").jqGrid(
                {
                    url: contextPath + "/sku/list",
                    // postData: { otherTypesDocuments: otherTypesDocument },
                    datatype: "json",
                    // multiselect: true,
                    colNames: ['id','commodityId','skuMark', '所属组织', '商品编码', '商品名称', '计数单位', '数量', "计重单位", '总重', '金重', '已分配', '可用库存', '仓库', '进货总成本', '销售总成本', '规格', '金料成色', '分段', '颜色', '净度', '条码号'],
                    colModel: [
                        {name: "id", width: "80", align: "left", hidden: true, fixed: "true"},
                        {name: "commodityId", width: "80", align: "left", hidden: true, fixed: "true"},
                        {name: "skuMark", width: "80", align: "left", hidden: true, fixed: "true"},
                        {name: "organizationName", width: "150", align: "left", fixed: "true"},
                        {name: "goodsNo", width: "150", align: "left", fixed: "true",
                            formatter: function (value, grid, rows, state) {
                                $(document).off('click',".detail"+ value).on('click',".detail"+ value,function(){
                                    vm.showGoodsInfo({value, grid, rows, state})
                                });
                                let myCode =  `<a class="detail${value}">${value}</a>`;
                                if(!value){
                                    return '';
                                }
                                return  myCode;
                            }},
                        {name: "goodsName", width: "150", align: "left", fixed: "true"},
                        {name: "countUnit", width: "80", align: "left", fixed: "true"},
                        {name: "totalNum", width: "80", align: "right", fixed: "true"},
                        {name: "weightUnit", width: "80", align: "left", fixed: "true"},
                        {name: "totalWeight", width: "80", align: "right", fixed: "true",
                            formatter: function (value, grid, rows, state) {
                                return Number(value).toFixed(3);
                            }
                        },
                        {name: "totalGoldWeight", width: "80", align: "right", fixed: "true",
                            formatter: function (value, grid, rows, state) {
                                return Number(value).toFixed(3);
                            }
                        },
                        {name: "assignedNum", width: "80", align: "right", fixed: "true"},
                        {name: "mayInventory", width: "210", align: "right", fixed: "true"},
                        {name: "warehouse", width: "120", align: "left", fixed: "true"},
                        {name: "totalPurchaseCost", width: "80", align: "right", fixed: "true",
                            formatter: function (value, grid, rows, state) {
                                return Number(value).toFixed(2);
                            }
                        },
                        {name: "totalPurPriceCost", width: "80", align: "right", fixed: "true",
                            formatter: function (value, grid, rows, state) {
                                return Number(value).toFixed(2);
                            }
                        },
                        {name: "goodsNorm", width: "80", align: "left", fixed: "true"},
                        {name: "goldColor", width: "80", align: "left", fixed: "true"},
                        {name: "stoneSection", width: "80", align: "left", fixed: "true"},
                        {name: "stoneColor", width: "80", align: "left", fixed: "true"},
                        {name: "stoneClarity", width: "80", align: "left", fixed: "true"},
                        {
                            name: "id", width: "80", align: "left", fixed: "true",
                            formatter: function (value, grid, rows, state) {
                                $(document).off('click', ".detail").on('click', ".detail" + value, function () {
                                    //vm.barCodeClick({value, grid, rows, state})
                                    vm.barCodeClick(rows.skuMark);
                                });
                                let myCode = `<a class="detail${value}">条码号</a>`;
                                return myCode;
                            }
                        },
                    ],
                    rowNum: 10,//一页显示多少条
                    rownumbers: true,
                    rowList: [10, 20, 30],//可供用户选择一页显示多少条
                    pager: '#pager',//表格页脚的占位符(一般是div)的id
                    // sortname: 'orderDate',//初始化的时候排序的字段
                    // sortorder: "desc",//排序方式,可选desc,asc
                    mtype: "post",//向后台请求数据的ajax的类型。可选post,get
                    multiselect: true,
                    jsonReader: {
                        root: "data.list",
                        total: "data.totalPage",
                        records: "data.totalCount",
                        cell: "list",
                    },
                    prmNames: {
                        page: "page",
                        rows: "limit",
                    },
                    sortable: false,
                    /*styleUI: 'Bootstrap',*/
                    // height: $(window).height() - 125,
                    viewrecords: true,
                    // caption: "其他收款单序时簿",//表格的标题名字
                    footerrow: false, //页脚
                    userDataOnFooter: false,
                    loadComplete: function () {
                        vm.completeMethod()
                    },
                    onSelectRow:function(rowid, status){
                        var selectRowAction = [];
                        var ids=$("#list").jqGrid('getGridParam','selarrrow');
                        for(let i = 0;i<ids.length;i++){
                            selectRowAction.push($("#list").jqGrid('getRowData',ids[i])) ;
                        }
                        that.selectedRow = selectRowAction;
                        console.log(that.selectedRow)
                    }
                })
        },
        completeMethod() {
            var sum_totalNum = $("#list").getCol('totalNum', false, 'sum');
            var sum_totalWeight = $("#list").getCol('totalWeight', false, 'sum');
            var sum_totalGoldWeight = $("#list").getCol('totalGoldWeight', false, 'sum');
            var sum_assignedNum = $("#list").getCol('assignedNum', false, 'sum');
            var sum_totalPurchaseCost = $("#list").getCol('totalPurchaseCost', false, 'sum');
            var sum_totalPurPriceCost = $("#list").getCol('totalPurPriceCost', false, 'sum');
            var sum_mayInventory = $("#list").getCol('mayInventory', false, 'sum');

            var reccount = $("#list").getGridParam("reccount");
            $("#list").jqGrid('addRowData', reccount + 1, {
                "organizationName": '合计',
                id: reccount + 1,
                totalNum: sum_totalNum,
                totalWeight: Number(sum_totalWeight).toFixed(3),
                totalGoldWeight: Number(sum_totalGoldWeight).toFixed(3),
                assignedNum: sum_assignedNum,
                mayInventory: Number(sum_mayInventory),
                totalPurchaseCost: Number(sum_totalPurchaseCost).toFixed(2),
                totalPurPriceCost:Number(sum_totalPurPriceCost).toFixed(2),
        })
            var aIsNone = $("#list>tbody>tr:last-child>td:last-child").css("display","none");
            var chechboxNone = $("#list>tbody>tr:last-child>td:nth-child(2)>input").css("display","none")
            // var cancelSelect = $( "#list" ).setSelection(`${reccount + 1}`,false);
            // var colorNone = $("#list>tbody>tr:last-child").removeClass("success")
        },
        // var rowData = jQuery('#List').jqGrid('getGridParam','selarrrow');
        needReload() {
            let This = this;
            this.selectedData = [];
            let config = {
                postData: this.$parent.body || this.$root.body
            };
            this.jqGridClearData();
            $("#list").jqGrid('setGridParam',config).trigger("reloadGrid");
        },
        getRowData(){
            $.each(config.colModel, function(idx, ele){

            })
        },
        //获取仓库组
        getWareHouseGroup() {
            let This = this;
            $.ajax({
                type: "post",
                url: contextPath + '/wareHouse/queryAll',
                //data: {"type": 4},
                dataType: "json",
                success: function (data) {
                    if (data.code === "100100") {
                        console.log("仓库组", data.data)
                        This.warehouseList = data.data;
                        //This.getRepertoryPositionGroup(1)
                    }
                },
                error: function () {
                    This.$Modal.warning({content:"服务器错误！",title:"提示信息"})
                }
            })
        },

        //商品类型
        goodsTypezTree(e, treeId, treeNode) {
            var treeObj = $.fn.zTree.getZTreeObj("tree-demo"),
                nodes = treeObj.getCheckedNodes(true);
            var arr = [];
            var obj = {}
            var names = nodes.filter(node => !node.children).map(item => item.name).join('/');
            var customCode = nodes.filter(node => !node.children).map(item => item.customCode);
            obj['names'] = names;
            obj['customCode'] = customCode;

            console.log(obj)
            return obj;
        },

        //款式类别
        categoryStylezTree(e, treeId, treeNode) {
            var treeObj = $.fn.zTree.getZTreeObj("tree-demo1"),
                nodes = treeObj.getCheckedNodes(true);
            var arr = [];
            var obj = {}
            var names = nodes.filter(node => !node.children).map(item => item.styleName).join('/');
            var customCode = nodes.filter(node => !node.children).map(item => item.customCode);
            obj['names'] = names;
            obj['customCode'] = customCode;

            console.log(obj)
            return obj;
        },

        //商品类型确定按钮回调
        goodsTypeClick() {
            this.body.productType = this.goodsTypezTree().names;
            this.body.productTypeArr = this.goodsTypezTree().customCode;
        },

        //款式类别确定按钮回调
        categoryStyleClick() {
            this.body.custStyleType = this.categoryStylezTree().names;
            this.body.styleCategoryArr = this.categoryStylezTree().customCode;
        },

        //查看条码点击事件
        queryBarCodeClick(){
            console.log(this.selectedRow);
            if(this.selectedRow.length < 1 ){
                this.$Modal.info({
                    title: '提示信息',
                    content: '请先选择一笔数据！'
                })
                return;
            }
            if(this.selectedRow.length > 1 ){
                this.$Modal.info({
                    title: '提示信息',
                    content: '只能选择一笔数据！'
                })
                return;
            }
            this.barCodeClick(this.selectedRow[0].skuMark)
            //this.selectedRow = [];
        },

        //点击条码号获取条码列表
        barCodeClick(value) {
            let This = this;
            $.ajax({
                type: "post",
                url: contextPath + '/goodsController/queryListBySkuMark',
                data: JSON.stringify({skuMark: value}),
                contentType: "application/json",
                dataType: "json",
                success: function (data) {
                    if (data.code === "100100") {
                        console.log("商品明细", data.data)
                        This.productDetail = [];
                        This.productDetail = data.data;
                        if (This.productDetail && This.productDetail.length <= 0){
                            This.$Modal.info({
                                title: '提示信息',
                                content: '该商品编码不存在条码！'
                            })
                            return false;
                        }
                        This.isBarCode = true;
                    }
                },
                error: function () {
                    This.$Modal.warning({content:"服务器出错啦！",title:"提示信息"})
                }
            })


        },

        //获取库位组
        getRepertoryPositionGroup(groupId) {
            let This = this;
            console.log(groupId,333344)
            $.ajax({
                type: "post",
                url: contextPath + '/tbaserepertoryposition/listbygroup/' + groupId,
                dataType: "json",
                success: function (data) {
                    if (data.code === "100100") {
                        console.log("库位组", data.data)
                        //This.$refs.reservoirPosition.reset();
                        console.log(This.reservoirPositionList, 33443)
                        This.reservoirPositionList = []
                        This.$forceUpdate();
                        This.reservoirPositionList = data.data;
                    }
                },
                error: function () {
                    This.$Modal.warning({content:"服务器出错啦！",title:"提示信息"})
                }
            })
        },

        //仓库onchange事件
        warehouseChange(value) {

            for (let data of this.warehouseList) {
                console.log(value,data.id,7799)
                if (value && value === data.id) {
                    console.log(value,data.id,22222)
                    this.repertoryPositionGroupId = data.groupId;
                    break;
                }
            }
            //this.getRepertoryPositionGroup(this.repertoryPositionGroupId);
            this.body.reservoirPositionId = ""
        },

        //获取组织id和组织name
        getOrgan(){
            /*this.body.organizationId = window.parent.userInfo.organId;
            this.body.organizationName = window.parent.userInfo.orgName;*/
            let This = this;
            $.ajax({
                type: "post",
                url: contextPath+'/entrustOut/getOrgName',
                dataType: "json",
                success: function (data) {
                    if (data.code === "100100") {
                        This.organization = data.data.name;
                    }
                },
                error: function () {
                    alert('服务器出错啦');
                }
            })
        },

        //点击商品明细
        showProductDetail(index) {
            let This = this;

            var ids = {
                goodsId: this.productDetail[index].id,
                commodityId: '',
                documentType: 'W_STOCK_IN'
            };
            This.goodsMainType = this.productDetail[index].goodsMainType;
            Object.assign(This.productDetailModal, {
                showModal: true,
                ids: ids
            });
            This.$nextTick(() => {
                This.$refs.modalRef.getProductDetail();
            });
            //固定结束
        },

        modalSure(e) {
            //this.productDetailModalClick(e);
        },

        modalCancel(e) {
            // this.productDetailModalClick(e);
        },

        productDetailModalClick(e){
            //商品详情点击确定跟取消的回调
            //写法固定
            if (this.outDetailEntity[this.selectedIndex].goodsMainType === 'attr_ranges_goods') {
                Object.assign(this.outDetailEntity[this.selectedIndex], {
                    tBaseBomEntity: e,
                    assistAttrs: null,
                    overEdit: true
                });
            } else {
                Object.assign(this.outDetailEntity[this.selectedIndex],{
                    assistAttrs: e,
                    tBaseBomEntity: null,
                    overEdit: true
                })
            }
        },

        //查看商品编码信息
        showGoodsInfo(value){
            window.parent.activeEvent({
                name: '商品',
                url: contextPath +'/base-data/commodity/commodity-info.html',
                params:{id: value.rows.commodityId, type: 'skip'}
            });
        },
    },

    created(){
        this.openTime = window.parent.params.openTime;
        this.getWareHouseGroup();
        this.getOrgan();
    },

    mounted(){
        this.pageInit();
    }
})