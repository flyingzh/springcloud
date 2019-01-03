var stayRecycleList = new Vue({
    el: '#stayRecycle',
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
            processModes:[],
            customers: [],
            selectCustomerObj: null, //所选的客户对象
            categoryType: [],
            commodityCategoty: [],
            empList:[],
            suppliers:[],
            dateArr:[],
            id:'',
            body: {
                goodsType:'',//商品类型
                customerId: '',
                supperId: '',
                orderNo:'',//单据编号
                processingMode:'',//处理方式
                processingResults:'',//处理结果
                startTime:'',
                endTime:'',
                orderStatus:4,
                executeState:2,
            },
            data_config: {
                url:contextPath+"/oldmaterialRecycle/listSatyRecyclePage",
                colNames: ['源单类型','单据编号', 'id','日期', '客户', '处理厂家', '处理方式','处理结果', '物流方式', '商品类型', '数量' ,'总重'],
                colModel: [
                    {name: 'orderNo', index: 'sourceNo', width: 220, align: "left",
                        formatter: function (value, grid, rows, state){
                            return "旧料外发单";
                        }},
                    {name: 'orderNo', index: 'sourceNo', width: 220, align: "left",
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
                    {name: 'outputDate', index: 'outputDate', width: 150, align: "center",align:"left",
                        formatter :function (value, grid, rows, state) {
                            return new Date(value).format("yyyy-MM-dd");
                        }
                    },
                    {name: 'customerName', index: 'customerName', align: "left", width: 150},
                    {name: 'supperName', index: 'supperName', align: "left", width: 150},
                    {name: 'processingMode', index: 'processingMode', align: "left", width: 150,
                        formatter: function (value, grid, rows, state) {
                            let vl = "";
                            for (var i = 0; i < stayRecycleList.processModes.length; i++) {
                                if (value == stayRecycleList.processModes[i].value) {
                                    vl = stayRecycleList.processModes[i].name;
                                    break;
                                }
                            }
                            return vl;
                        }
                    },
                    {name: 'processingResults', index: 'processingResults', align: "left", width: 150,
                        formatter: function (value, grid, rows, state) {
                            if (value === 'store') {
                                return '存料';
                            }else if(value === 'discount'){
                                return '折现';
                            }else if(value === 'return'){
                                return '返料';
                            }else if(value === 'inner'){
                                return '旧料内部处理';
                            }else {
                                return '';
                            }
                        }
                    },
                    {name: 'logisticsMode', index: 'logisticsMode', align: "left", width: 150,
                        formatter: function (value, grid, rows, state) {
                            if (value === 'wlfs_zt') {
                                return '自提';
                            }else if(value === 'wlfs_js'){
                                return '寄送';
                            }else if(value === 'wlfs_shsm'){
                                return '送货上门';
                            }else {
                                return '';
                            }
                        }
                    },
                    {name: 'goodsType', index: 'goodsType', align: "left", width: 150},
                    {name: 'registerCount', index: 'registerCount', align: "right", width: 150},
                    {name: 'registerWeight', index: 'registerWeight', align: "right", width: 150}
                ],
                shrinkToFit:false,
            },
        }
    },
    methods: {
        search() {
            if (this.commodityCategoty.length > 0) {
                this.body.goodsTypePath = this.commodityCategoty[this.commodityCategoty.length - 1];
            } else {
                this.body.goodsTypePath = "";
            }
            if (this.dateArr.length > 0 && this.dateArr[0] && this.dateArr[1]) {
                this.body.startTime = this.dateArr[0].format("yyyy-MM-dd HH:mm:ss");
                this.body.endTime = this.dateArr[1].format("yyyy-MM-dd HH:mm:ss");
            } else {
                this.body.startTime = '';
                this.body.endTime = '';
            }
            this.reload = !this.reload;
        },
        closeSupplier(id, code, name){
            console.log(id, code, name);
            // this.supperName = name;
            this.body.supperId = id;
        },
        closeCustomer() {
            if(this.selectCustomerObj){
                this.body.customerId = this.selectCustomerObj.id;
                // this.customerName = this.selectCustomerObj.name;
            }
        },
        clearItem(name, ref){
            if(this.$refs[ref]){
                this.$refs[ref].reset();
            }
            this.$nextTick(()=>{
                this.body[name] = '';
            })
        },
        clearTime(){
            this.dateArr = [];
        },
        clear() {
            this.body = {
                goodsTypePath:'',
                processingResults: '',
                processingMode: '',
                certificateType:'',
                supperId:'',
                customerId:'',
                orderStatus:'',
                startTime:'',
                endTime:''
            }
            let config = {
                postData: {
                    goodsTypePath: '',
                    certificateType: '',
                    processingResults: '',
                    processingMode: '',
                    supperId:'',
                    customerId:'',
                    orderStatus: '',
                    startTime: '',
                    endTime: ''
                }
            };
            this.$refs.process.reset();
            this.$refs.result.reset();
            this.$refs.customerList.clear();
            this.$refs.supperList.clear();
            this.commodityCategoty = [];
            this.dateArr = [];
            jQuery("#myTable").jqGrid('clearGridData');
            jQuery("#myTable").jqGrid('setGridParam', config).trigger("reloadGrid");
        },
        //顶部菜单栏按/**/钮
        refresh(){
            this.body={
                goodsTypePath:'',
                certificateType:'',
                supperId:'',
                orderStatus:'',
                startTime:'',
                endTime:''
            };
            this.$refs.process.reset();
            this.$refs.result.reset();
            this.$refs.customerList.reset();
            this.$refs.supperList.reset();
            this.reload = !this.reload;
        },
        loadCustomers(){
            var That = this;
            $.ajax({
                type: "post",
                url: contextPath + '/tbasecustomer/list?page=1&limit=30',
                contentType: 'application/json',
                dataType: "json",
                success: function (res) {
                    if(res.code == 100100){
                        That.customers =  res.data.list;
                    }
                },
                error: function (err) {
                    That.$Modal.warning({
                        title: '提示信息',
                        scrollable:true,
                        content:"系统异常,请联系技术人员！",
                    })
                },
            })
        },
        generateReport() {
            if (this.selected.length < 1) {
                this.$Modal.info({
                    title: '提示信息',
                    content: '请先选择至少一条数据！'
                });
                return;
            }
            let obj =0;
            let flag = false;
            for (let v in this.selected) {
                if (this.selected[obj].goodsTypePath != this.selected[v].goodsTypePath) {
                    this.$Modal.info({
                        title: '提示信息',
                        content: '商品类型不一致，请重新选择！'
                    });
                    flag = true;
                    break;
                }
                if (this.selected[obj].supperId != this.selected[v].supperId) {
                    this.$Modal.info({
                        title: '提示信息',
                        content: '处理厂家不一致，请重新选择！'
                    });
                    flag = true;
                    break;
                }
                if (this.selected[obj].customerId != this.selected[v].customerId) {
                    this.$Modal.info({
                        title: '提示信息',
                        content: '客户不一致，请重新选择！'
                    });
                    flag = true;
                    break;
                }
                if (this.selected[obj].processingMode != this.selected[v].processingMode) {
                    this.$Modal.info({
                        title: '提示信息',
                        content: '处理方式不一致，请重新选择！'
                    });
                    flag = true;
                    break;
                }
                if (this.selected[obj].processingResults != this.selected[v].processingResults) {
                    this.$Modal.info({
                        title: '提示信息',
                        content: '处理结果不一致，请重新选择！'
                    });
                    flag = true;
                    break;
                }
            }
            if(flag){
                return false;
            }
            var ids = [];
            for (let index in this.selected) {
                ids.push(this.selected[index].id)
            }
            let This = this;
            $.ajax({
                type: "post",
                url: contextPath + '/oldmaterialRecycle/formatRecycleOrder',
                contentType: 'application/json',
                dataType: "json",
                data: JSON.stringify(ids),
                success: function (res) {
                    if (res.code !== '100100') {
                        This.errorTip(res.msg);
                        return;
                    }
                    window.parent.activeEvent({name: '新增旧料收回单', url: contextPath+'/oldmaterial/recycle/old-recycle-add.html',
                        params: {
                            type:'data',
                            data:res.data,
                        }
                    });
                },
                error: function () {
                    This.errorTip();
                }
            });

        },
        errorTip(msg) {
            this.$Modal.warning({
                title: '提示信息',
                scrollable: true,
                content: msg || "系统异常,请联系技术人员！",
            })
        },
        successTip(msg) {
            this.$Modal.success({
                title: '提示信息',
                scrollable: true,
                content: msg,
            })
        },
        testOrderDetailClick(data){
            window.parent.activeEvent({
                name:'旧料外发单--查看',
                url:contextPath +'/oldmaterial/output/output-add.html',
                params:{
                    type:'view',
                    queryInfo:data.rows.id
                }
            })
        },
        //删除
        del(){
            var ids = [];
            for(var i=0;i<this.selected.length;i++){
                ids.push(this.selected[i].id);
            }
            if(ids.length == 0){
                pendingList.$Modal.info({
                    title:'提示信息',
                    content:'<p>请选择</p>'
                });
                return false;
            }
            this.$Modal.confirm({
                title: '提示信息',
                content: '<p>是否删除信息？</p>',
                onOk: () =>{
                    $.ajax({
                        type: "post",
                        url: contextPath + '/certificateBackInfo/delete',
                        contentType: 'application/json',
                        data: JSON.stringify(ids),
                        dataType: "json",
                        success: function (res) {
                            if (res.code === '100100' && res.data === '' ) {
                                setTimeout(function(){
                                    pendingList.$Modal.success({
                                        title: '提示信息',
                                        content: '删除成功',
                                        onOk:function(){
                                            pendingList.reload = !pendingList.reload;
                                        }
                                    })
                                },300)

                            } else if(res.code === '100100' && res.data != '' ) {
                                setTimeout(function(){
                                    pendingList.$Modal.warning({
                                        title: '提示信息',
                                        content: res.data,
                                        onOk:function(){
                                            pendingList.reload = !pendingList.reload;
                                        }
                                    })
                                },300)
                            }else {
                                pendingList.$Modal.warning({
                                    title: '提示信息',
                                    content: '删除失败',
                                    onOk: () => {
                                        pendingList.reload = ! pendingList.reload
                                    }
                                })
                                pendingList.reload = ! pendingList.reload
                            }
                        },
                        error: function (err) {
                            pendingList.$Modal.warning({
                                title: '提示信息',
                                content: '服务器错误',
                                closable: true
                            })
                        },
                    })
                },
            })
        },
        //加载处理厂家
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
        update(){
            var That = this;
            if (That.selected.length > 1) {
                That.$Modal.info({
                    title:'提示信息',
                    content:'<p>请单选</p>'
                });
                return false;
            }
            if (That.selected.length == 0) {
                That.$Modal.info({
                    title:'提示信息',
                    content:'<p>请选择</p>'
                });
                return false;
            }
            window.parent.activeEvent({name: '修改证书商品收回单', url: contextPath+'/purchase/certificate-back-report/certificate-back-add.html',
                params:{
                    type:'update',
                    id:That.selected[0].id
                }
            });
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
        cancel() {
            window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
        },
    },
    created(){
        this.processModes = getCodeList("jxc_jxc_clfs");//处理方式
        this.loadProductType();
        this.loadCustomers();
        this.loadSuppliers();
    },
    mounted(){
        this.openTime = window.parent.params.openTime;
    },
});
