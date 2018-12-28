var registerRef = new Vue({
    el: '#registerList',
    data() {
        return {
            openTime: '',
            isSearchHide: true, //搜索栏
            isTabulationHide: true, // 列表
            isShow: false,
            isHide:true,
            isEdit: false,
            reload: false,
            selected: [],
            categoryType: [],
            commodityCategoty: [],
            selectCustomerObj: null,
            empList:[],
            customers:[],
            dateArr:[],
            processingModes:[],//处理方式集合
            id:'',
            body: {
                goodsTypePath:'',
                processingMode:'',
                orderNo:'',
                processingResults:'',
                customerId:'',
                startTime:'',
                endTime:''
            },
            data_config: {
                url: contextPath + '/oldMaterialRegister/list',
                colNames: ['id','单据编号','日期','单据状态', '业务状态', '客户', '商品类型','数量','总重', '业务员'],
                colModel: [
                    {name: 'id', hidden:true},
                    {name: 'orderNo', index: 'orderNo', width: 180, align: "left",
                        formatter: function (value, grid, rows, state) {
                            let row = rows;
                            $(document).off('click',".detail"+ value).on('click',".detail"+ value,function(){
                                registerRef.view(row.id);
                            });
                            let myCode =  `<a class="detail${value}">${value}</a>`;
                            return  myCode;
                        },
                        unformat: function (value, grid, rows) {
                            return value.replace(/(<\/?a.*?>)/g, '');
                        }
                    },
                    {name: 'registerDate', index: 'registerDate', width: 180, align: "left",
                        formatter:function(value,grid,rows,state){
                                if(value){
                                    return new Date(value).format("yyyy-MM-dd");
                                }else{
                                    return "";
                                }

                        }
                    },
                    {name: 'orderStatus', index: 'orderStatus', width: 180, align: "center",align:"left",
                        formatter:function(value, grid, rows, state){
                            if(rows.orderStatus == 1){
                                return '暂存';
                            }else if(rows.orderStatus == 2){
                                return '待审核';
                            }else if(rows.orderStatus == 3){
                                return '审核中';
                            }else if(rows.orderStatus == 4){
                                return '已审核';
                            }else if(rows.orderStatus == 5){
                                return '驳回';
                            }else{
                                return '';
                            }
                        }},
                    {name: 'businessStatus', index: 'businessStatus', align: "left", width: 180,
                        formatter:function(value, grid, rows, state){
                        if(value == 1){
                            return "待质检";
                        }else if(value == 2){
                            return "已质检";
                        }else{
                            return "";
                        }
                    }
                    },
                    {
                        name: 'customerName', index: 'customerName', align: "left", width: 180
                    },
                    {name: 'goodsType', index: 'orderStatus', width: 180, align: "left",

                    },
                    {name: 'count', index: 'goodsType', width: 180, align: "right"},
                    {name: 'weight', index: 'certificateNum', width: 180, align: "right"},
                    {name: 'salesmanName', index: 'certificateNum', width: 180, align: "left"}
                ],
                shrinkToFit:false,
            },
        }
    },
    created(){
        this.loadData();
        this.loadProductType();
        this.loadCustomers();
    },
    methods: {
        loadData(){
            this.processingModes = getCodeList("jxc_jxc_clfs");
        },
        closeCustomer() {
            if(this.selectCustomerObj){
                this.body.customerId = this.selectCustomerObj.id;
                // this.customerName = this.selectCustomerObj.name;
            }
        },
        search() {
            if (!this.body.goodsTypePath) {
                this.body.goodsTypePath = '';
            }
            if (!this.body.processingMode) {
                this.body.processingMode = '';
            }
            if(!this.body.processingResults){
                this.body.processingResults = '';
            }
            if (!this.body.customerId) {
                this.body.customerId = '';
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
                    That.$Modal.error({
                        scrollable:true,
                        content:"系统异常,请联系技术人员！",
                    })
                },
            })
        },
        clear() {
            this.$nextTick(function(){
                this.body =  {
                    goodsTypePath:'',
                    processingMode:'',
                    orderNo:'',
                    processingResults:'',
                    customerId:"",
                    startTime:'',
                    endTime:''
                };
            });
            this.$nextTick(function(){
                this.body.customerId='';
            });
            this.commodityCategoty = [];
            this.dateArr = [];
            this.$refs.customerRef.clear();
        },

        //顶部菜单栏按/**/钮
        refresh(){
          this.clear();
          this.search();
        },
        changeCategory(e){
                this.body.goodsTypePath = e[e.length-1];
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
                    That.$Modal.error({
                        scrollable:true,
                        content:"系统异常,请联系技术人员！",
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
                } = item;

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
        //新增
        add() {
           this.goOldMaterialRegister('',1);
        },
        //删除
        del(){
            var That = this;
            if(That.selected.length>0){
                var flag = false;
                var arr = [];
                That.selected.forEach(v =>{
                    arr.push(v.id);
                });
                this.$Modal.confirm({
                    scrollable:true,
                    content:"你确定要删除选中的数据？",
                    okText:"确定",
                    cancelText:"取消",
                    onOk(){
                        That.deleteMany(arr);
                    }
                })
            }else{
                this.$Modal.confirm({
                    scrollable:true,
                    content: "请选择一条数据进行删除！",
                })
            }
        },
        deleteMany(arr){
            var That = this;
            $.ajax({
                type:"post",
                url: contextPath + '/oldMaterialRegister/delete',
                data:JSON.stringify(arr),
                dataType:"json",
                contentType: 'application/json',
                success:function (r) {
                    console.log(r);
                    if(r.code == '100100'){
                        setTimeout(()=>{
                            That.$Modal.info({
                                scrollable:true,
                                content:r.data,
                                onOk(){
                                    That.reload = !That.reload;
                                }
                            })
                        },300);
                    };
                },
                error:function (r) {
                    That.$Modal.error({
                        scrollable:true,
                        content:"系统异常,请联系技术人员！",
                    })
                }
            });
        },
        update(){
            var That = this;
            if(That.selected.length == 1){
                if(That.selected[0].orderStatus > 1){
                    //如果单据状态不为1 那个就不让修改 给出提示
                    this.$Modal.confirm({
                        scrollable:true,
                        content: "只能对暂存的数据进行修改！",
                    })
                    return;
                }

                $.ajax({
                    type:"post",
                    url: contextPath + '/oldMaterialRegister/info',
                    data:{"id":That.selected[0].id},
                    dataType:"json",
                    success:function (r) {
                        if(r.code == '100100'){
                            That.goOldMaterialRegister(r.data,3);
                        };
                    },
                    error:function (r) {
                        That.$Modal.error({
                            scrollable:true,
                            content:"系统异常,请联系技术人员！",
                        })
                    }
                });
            }else{
                this.$Modal.confirm({
                    scrollable:true,
                    content: "请选择一条数据进行修改！",
                })
            }

        },
        goOldMaterialRegister(data,type){
            var That = this;
            window.parent.activeEvent({
                name: '旧料登记单新增',
                url: contextPath+'/oldmaterial/register/oldmaterial-register-add.html',
                params: data,
                type:type
            });
        },
        view(id) {
                var That = this;
                $.ajax({
                    type:"post",
                    url: contextPath + '/oldMaterialRegister/info',
                    data:{"id":id},
                    dataType:"json",
                    success:function (r) {
                        if(r.code == '100100'){
                            That.goOldMaterialRegister(r.data,2);
                        };
                    },
                    error:function (r) {
                        That.$Modal.error({
                            scrollable:true,
                            content:"系统异常,请联系技术人员！",
                        })
                    }
                });
        },
        print(){

        },
        annex(){

        },
        cancel() {
            window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
        },
        preView(){

        },

    },
    mounted(){
        this.openTime = window.parent.params.openTime;
        this.$refs.customerRef.loadCustomerList('');
    },
});
