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
            categoryType:[],
            empList:[],
            documentStatusList:[],
            commodityCategoty:[],
            dateArr:[],
            //    审批相关
            //控制弹窗显示
            modalTrigger:false,
            modalType:'',
            //审批进度条
            steplist: [],
            applyOrder:{
                orderNo:"",
                orderStatus:"",
            },
            orderStatusMap:{
                "1":"暂存",
                "2":"待审核",
                "3":"审核中",
                "4":"已审核",
                "5":"驳回"

            },
            body: {
                goodsGroupPath:'',
                orderStatus:'',
                orderNo:'',
                startTime:'',
                endTime:''
            },
            data_config: {
                url: contextPath + '/tpurchaseapply/list',
                colNames: ['单据编号', '单据状态', '商品类型','日期', '申请人', '申请重量','申请数量', '预计采购金额','备注'],
                colModel: [
                    {name: 'orderNo', index: 'orderNo', width: 240, align: "left",
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
                    {name: 'orderStatus', index: 'orderStatus', align: "left", width: 180,formatter:function
                        (value, grid, rows, state) {
                            return purchaseOrderList.orderStatusMap[value];

                    }},
                    {name: 'goodsType', index: 'goodsType', align: "left", width: 180},
                    {name: 'createTime', index: 'createTime', align: "left", width: 180,  formatter :function (value, grid, rows, state) {
                        return new Date(value).format("yyyy-MM-dd");
                    }
                    },
                    {name: 'applyUserName', index: 'applyUserName', align: "left", width: 180},
                    {name: 'applyWeight', index: 'applyWeight', align: "right", width: 180},
                    {name: 'applyCount', index: 'applyCount', align: "right", width: 180},
                    {name: 'estimatePurchaseMoney', index: 'estimatePurchaseMoney', width: 180, align: "right"},
                    {name: 'remark', index: 'remark', width: 180, align: "center",align:"left"}

                ],
            },
        }
    },
    methods: {
        //搜索清空按钮
        search() {
            console.log(this.body);
            if(!this.body.orderStatus){
                this.body.orderStatus = '';
            }
            if(this.commodityCategoty.length > 0){
                this.body.goodsGroupPath=this.commodityCategoty[this.commodityCategoty.length-1];
            }else {
                this.body.goodsGroupPath='';
            }
            if (this.dateArr.length > 0 && this.dateArr[0] && this.dateArr[1]) {
                this.body.startTime = this.dateArr[0].format("yyyy-MM-dd")+" 00:00:00";
                this.body.endTime = this.dateArr[1].format("yyyy-MM-dd")+" 23:00:00";
            } else {
                this.body.startTime = '';
                this.body.endTime = '';
            }
            this.reload=!this.reload;
            this.selected=[];

        },
        //审批
        approval(value) {
            let This = this;
            if (!ht.util.hasValue(this.selected, "array")) {
                this.$Modal.info({
                    title: "提示",
                    content: "请先选择一条记录"
                });
                return false;
            }
            if (this.selected.length > 1) {
                this.$Modal.info({
                    title: "提示",
                    content: "最多只能选择一条记录"
                });
                return false;
            }
            var rowData = this.selected[0];
            This.applyOrder.orderNo = rowData.orderNo;
            This.applyOrder.orderStatus = rowData.orderStatus;
            This.modalType = 'approve';
            This.modalTrigger = !This.modalTrigger;
        },
        //驳回
        reject(value) {
            let This = this;
            if (!ht.util.hasValue(this.selected, "array")) {
                this.$Modal.info({
                    title: "提示",
                    content: "请先选择一条记录"
                });
                return false;
            } else if (this.selected.length > 1) {
                this.$Modal.info({
                    title: "提示",
                    content: "最多只能选择一条记录"
                });
                return false;
            }
            var rowData = this.selected[0];
            This.applyOrder.orderNo = rowData.orderNo;
            This.applyOrder.orderStatus = rowData.orderStatus;
            This.modalType = 'reject';
            This.modalTrigger = !This.modalTrigger;
        },
        //审核或者驳回回调
        approvalOrRejectCallBack(res){
            console.log(res)
            let This = this;
            if(res.result.code == '100100'){
                This.search();
            }else{

            }
        },
        //根据单据编号查详情
        testOrderDetailClick(data) {
            console.log(data);
            let code = data.rows.id;
            let basic = data.rows;
            if (code) {
                this.queryOrderByOrderNo(code, true, basic);
            }
        },
        queryOrderByOrderNo(code, isEdit, basic) {
            window.parent.activeEvent({
                name: '采购申请单详情',
                url: contextPath + '/purchase/purchase-requisition/purchase-requisition.html',
                params: {
                    code: code,
                    type: 'update',
                    basicInfo: basic
                }
            });
        },
        clear() {
            this.commodityCategoty = [];
            this.dateArr = [];
            this.body.goodsGroupPath='',
            this.body.orderStatus='',
            this.body.orderNo='',
            this.body.startTime='',
            this.body.endTime=''
        },
        //顶部菜单栏按钮
        refresh(){
            this.clear();
            this.reload = !this.reload;
        },
        add() {
            window.parent.activeEvent({name: '采购申请单详情', url: contextPath +'/purchase/purchase-requisition/purchase-requisition.html',params:{type:'add'}});
        },
        del() {
            let This = this;
            //获取所选数据ID

            if(this.selected.length < 1) {
                this.$Modal.warning({
                    title: '提示信息',
                    content: '<p>请先选择至少一条数据！</p>'
                });
                return;
            } else if(this.selected.length >=1) {
                let ids = [];
                this.selected.map(item=>{
                    ids.push(item.id);
                })
                this.$Modal.confirm({
                    title: '提示信息',
                    content: '<p>是否删除信息？</p>',
                    onOk: () =>{
                        console.log(JSON.stringify(this.selected));
                        $.ajax({
                            url: contextPath + '/tpurchaseapply/delete',
                            method: 'post',
                            dataType: "json",
                            //data: {'ids':ids},
                            data: JSON.stringify(ids),
                            contentType: 'application/json;charset=utf-8',
                            success: function (data) {
                                if(data.code === '100100') {
                                    setTimeout(() => {
                                        This.$Modal.success({
                                            title: '提示信息',
                                            okText:'确定',
                                            content: data.data
                                        });
                                        This.selected = [];
                                        This.refresh();
                                    }
                                    , 300);
                                } else {
                                    setTimeout(() => {
                                            This.$Modal.warning({
                                                title: '删除失败！',
                                                okText:'确定',
                                                content: data.msg
                                            });
                                        }
                                        , 300);
                                }
                            },
                            error: function (e) {
                                this.$Modal.error({
                                    title:'提示信息',
                                    content:"网络异常,请联系技术人员！",
                                })
                            }
                        })
                    },
                })

            }
        },
        //点击修改
        modify() {
            if(this.selected.length < 1) {
                this.$Modal.warning({
                    title: '提示信息',
                    content: '<p>请先选择至少一笔数据！</p>'
                });
                return;
            } else if(this.selected.length > 1) {
                this.$Modal.warning({
                    title: '提示信息',
                    content: '<p>只能选择一笔数据进行修改！</p>'
                });
                return;
            } else{
                let sourceData = this.selected;
                window.parent.activeEvent({
                    name: '采购订单详情',
                    url: contextPath +'/purchase/purchase-requisition/purchase-requisition.html',
                    params:{
                        code:sourceData[0].id,
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
                    if(res.code != "100100"){
                        this.$Modal.warning({
                            title:'提示信息',
                            content:res.msg,
                        })
                        return ;
                    }
                    That.categoryType = That.initGoodCategory(res.data.cateLists)
                },
                error: function (err) {
                    this.$Modal.warning({
                        title:'提示信息',
                        content:"网络异常,请联系技术人员！",
                    })
                },
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



    },
    created(){
        this.loadProductType();

    },
    watch: {
        'body.orderStatus':function(val){
            if(typeof val == 'undefined'){
                this.body.orderStatus = '';
            }
        },
    },
    mounted(){
        this.openTime = window.parent.params.openTime;
    },
})
