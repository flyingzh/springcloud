var vm = new Vue({
    el: '#orderList',
    data() {
        let This = this;
        return {
            test: new Date(),
            openTime: '',
            isSearchHide: true, //搜索栏
            isTabulationHide: true, // 列表
            reload: false,
            selected: [],
            dateArr:[],
            selectCustomerObj:null,
            approvalTableData:[],
            modalTrigger:false,
            modalType:'',
            steplist: [],
            shipTypeList:[],
            revert:{
                orderNo:"",
                orderStatus:"",
            },
            body: {
                orderNo:'',
                customerId:'',
                startTime:'',
                endTime:''
            },
            data_config: {
                url: contextPath + '/toldmaterialrevert/listByPage',
                colNames: ['单据编号', 'id','日期', '单据状态', '客户', '业务员', '物流方式', '备注'],
                colModel: [
                    {name: 'orderNo', index: 'orderNo', width: 150, align: "left",
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
                    {name: 'revertDate', index: 'revertDate', width: 150, align: "center",align:"left",
                        formatter :function (value, grid, rows, state) {
                            return new Date(value).format("yyyy-MM-dd");
                        }
                    },
                    {name: 'orderStatus', index: 'orderStatus', align: "left", width: 150,
                        formatter:function (value, grid, rows, state) {
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
                    {name: 'customerName', index: 'customerName', align: "left", width: 150},
                    {name: 'salesmanName', index: 'salesmanName', align: "left", width: 150},
                    {name: 'logisticsMode', index: 'logisticsMode', align: "left", width: 150,
                            formatter:function (value, grid, rows, state) {
                                let base = "";
                                vm.shipTypeList.map((item)=>{
                                    if(item.value === value){
                                        base =  item.name
                                    }
                                })
                                return base
                            }
                        },
                    {name: 'remark', index: 'remark', align: "left", width: 150}
                ],
            },
        }
    },
    methods: {
        //加载客户
        loadCustomers(){
            let That = this;
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
                    That.$Modal.info({
                        scrollable:true,
                        content:"系统异常,请联系技术人员！",
                    })
                },
            })
        },
        //搜索清空按钮
        closeCustomer(){
            if(this.selectCustomerObj){
                this.body.customerId = this.selectCustomerObj.id;
            }
        },
        search() {
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
        clear() {
           // this.$refs.customerList.reset();
           this.$refs.customerRef.clear();
           this.dateArr = [];
           this.body = {
               orderNo:'',
               customerId:'',
               startTime:'',
               endTime:''
           };
           let config = {
               postData:{
                   orderNo:'',
                   customerId:'',
                   startTime:'',
                   endTime:''
               }
           };
            jQuery("#myTable").jqGrid('clearGridData');
            jQuery("#myTable").jqGrid('setGridParam', config).trigger("reloadGrid");
        },
        //顶部菜单栏按钮
        refresh() {
            this.clear();
            this.reload = !this.reload;
        },
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

            let  rowData = this.selected[0];

            This.revert.orderNo = rowData.orderNo;
            This.revert.orderStatus = rowData.orderStatus;
            This.modalType = 'approve';
            This.modalTrigger = !This.modalTrigger;
        },
        reject() {
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
            This.revert.orderNo = rowData.orderNo;
            This.revert.orderStatus = rowData.orderStatus;
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
                this.$Modal.info({
                    title: "提示",
                    content: "审核失败，请联系相关技术人员"
                });
            }
        },
        cancel() {
            window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
        },
        //根据单据编号查详情
        testOrderDetailClick(data) {
            console.log(data);
            // let code = data.rows.orderNo;
            let code = data.rows.id;
            let basic = data.rows;
            if (code) {
                this.queryOrderByOrderNo(code, true, basic);
            }
        },
        queryOrderByOrderNo(code, isEdit, basic) {
            window.parent.activeEvent({
                name: '旧料返料单详情',
                url: contextPath + '/oldmaterial/revert/revert-add.html',
                params: {
                    id: code,
                    type: 'query',
                    basicInfo: basic
                }
            });
        },
        ListSubmit(){
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

            let rowData = this.selected[0];
            console.log(rowData)



        },
        shanchu() {
            let This = this;
            //获取所选数据ID
            if(this.selected.length < 1) {
                this.$Modal.info({
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
                            url: contextPath + '/toldmaterialrevert/delete',
                            method: 'post',
                            dataType: "json",
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
                                            This.$Modal.error({
                                                title: '删除失败！',
                                                okText:'确定',
                                                content: data.msg
                                            });
                                        }
                                        , 300);
                                }
                            },
                            error: function (e) {
                                This.$Modal.error({
                                    content:"网络异常,请联系技术人员！",
                                })
                            }
                        })
                    },
                })

            }
        },

    },
    created(){
        this.loadCustomers();

    },
    watch: {
        'body.customerId':function(val){
           if(typeof val == 'undefined'){
               this.body.customerId = '';
           }
        },

    },
    mounted(){
        this.openTime = window.parent.params.openTime;
        this.shipTypeList = getCodeList("jxc_jxc_wlfs");
        this.$refs.customerRef.loadCustomerList('');
        console.log(this.shipTypeList);
    },
})
