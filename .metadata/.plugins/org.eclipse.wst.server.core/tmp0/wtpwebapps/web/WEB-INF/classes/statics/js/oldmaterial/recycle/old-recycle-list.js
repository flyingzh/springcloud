var oldRecycleList = new Vue({
    el: '#oldRecycle',
    data() {
        return {
            openTime: '',
            isSearchHide: true, //搜索栏
            isTabulationHide: true, // 列表
            isShow: false,
            isHide: true,
            isEdit: false,
            reload: false,
            selected: [],
            processModes: [],
            selectCustomerObj: null, //所选的客户对象
            customerModel: {},
            categoryType: [],
            commodityCategoty: [],
            customers: [],
            empList: [],
            suppliers: [],
            dateArr: [],
            id: '',
            body: {
                orderNo: '',
                startTime: '',
                endTime: '',
                customerId:'',
                supperId:'',
                processingMode: '',
                processingResults: '',
            },
            data_config: {
                url: contextPath + '/oldmaterialRecycle/list',
                colNames: ['id', '单据编号', '日期', '单据状态', '客户', '处理厂家', '处理方式', '处理结果', '业务员'],
                colModel: [
                    {name: 'id', hidden: true},
                    {
                        name: 'orderNo', index: 'orderNo', width: 180, align: "left",
                        formatter: function (value, grid, rows, state) {
                            $(document).off('click', ".detail" + value).on('click', ".detail" + value, function () {
                                oldRecycleList.id = rows.id;
                                oldRecycleList.view();
                            });
                            let myCode = `<a class="detail${value}">${value}</a>`;
                            return myCode;
                        },
                        unformat: function (value, grid, rows) {
                            return value.replace(/(<\/?a.*?>)/g, '');
                        }
                    },
                    {
                        name: 'recycleDate', index: 'recycleDate', width: 180, align: "left",
                        formatter: function (value, grid, rows, state) {
                            return new Date(value).format("yyyy-MM-dd");
                        }
                    },
                    {
                        name: 'orderStatus', index: 'orderStatus', width: 180, align: "center", align: "left",
                        formatter: function (value, grid, rows, state) {
                            if (value === 1) {
                                return '暂存';
                            }
                            if (value === 2) {
                                return '待审核';
                            }
                            if (value === 3) {
                                return '审核中';
                            }
                            if (value === 4) {
                                return '已审核';
                            }
                            if (value === 5) {
                                return '驳回';
                            }
                        },
                        unformat(value, grid, rows, state) {
                            if (value === '暂存') {
                                return 1;
                            }
                            if (value === '待审核') {
                                return 2;
                            }
                            if (value === '审核中') {
                                return 3;
                            }
                            if (value === '已审核') {
                                return 4;
                            }
                            if (value === '驳回') {
                                return 5;
                            }
                        }
                    },
                    {name: 'customerName', index: 'customerName', align: "left", width: 180},
                    {name: 'supperName', index: 'supperName', align: "left", width: 180},
                    {
                        name: 'processingMode', index: 'processingMode', align: "left", width: 180,
                        formatter: function (value, grid, rows, state) {
                            let vl = "";
                            for (var i = 0; i < oldRecycleList.processModes.length; i++) {
                                if (value == oldRecycleList.processModes[i].value) {
                                    vl = oldRecycleList.processModes[i].name;
                                    break;
                                }
                            }
                            return vl;
                        }
                    },
                    {
                        name: 'processingResults',
                        index: 'processingResults',
                        align: "left",
                        formatter: function (value, grid, rows, state) {
                            if (value === "store") {
                                return '存料';
                            }
                            if (value === "discount") {
                                return '折现';
                            }
                            if (value === "return") {
                                return '返料';
                            }
                            if (value === 'inner') {
                                return '旧料内部处理';
                            }
                            return '';
                        },
                        unformat(value, grid, rows, state) {
                            if (value === '存料') {
                                return "store";
                            }
                            if (value === '折现') {
                                return "discount";
                            }
                            if (value === '返料') {
                                return "return";
                            }
                        }
                    },
                    {name: 'salesmanName', index: 'salesmanName', align: "left", width: 180},
                ],
                shrinkToFit: false,
            },
        }
    },
    methods: {
        search() {
            if (this.dateArr.length > 0 && this.dateArr[0] && this.dateArr[1]) {
                this.body.startTime = this.dateArr[0].format("yyyy-MM-dd HH:mm:ss");
                this.body.endTime = this.dateArr[1].format("yyyy-MM-dd HH:mm:ss");
            } else {
                this.body.startTime = '';
                this.body.endTime = '';
            }
            this.body.customerName = this.customerModel.name;
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
        clear() {
            this.body = {
                orderNo: '',
                startTime: '',
                endTime: '',
                customerId:'',
                supperId:'',
                processingMode: '',
                processingResults: '',
            }
            let config = {
                postData: {
                    orderNo: '',
                    startTime: '',
                    endTime: '',
                    customerId: '',
                    supperId: '',
                    processingMode: '',
                    processingResults: '',
                }
            }
            this.$refs.process.reset();
            this.$refs.result.reset();
            this.$refs.supperList.clear();
            this.$refs.customerRef.clear();
            this.dateArr = [];
            jQuery("#myTable").jqGrid('clearGridData');
            jQuery("#myTable").jqGrid('setGridParam', config).trigger("reloadGrid");
        },
        //顶部菜单栏按/**/钮
        refresh() {
            this.body = {
                orderNo: '',
                startTime: '',
                endTime: '',
                customerName: '',
                supperName: '',
                processingMode: '',
                processingResults: '',
            };
            this.$refs.process.reset();
            this.$refs.result.reset();
            this.$refs.supperList.clear();
            this.$refs.customerRef.clear();
            this.reload = !this.reload;
        },
        //新增
        add() {
            window.parent.activeEvent({
                name: '新增旧料收回单', url: contextPath + '/oldmaterial/recycle/old-recycle-add.html',
                params: {
                    type: 'add'
                }
            });
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
        del() {
            var ids = [],flag = true;
            for (var i = 0; i < this.selected.length; i++) {
                ids.push(this.selected[i].id);
            }
            if (ids.length == 0) {
                oldRecycleList.$Modal.info({
                    title: '提示信息',
                    content: '<p>请选择至少一笔数据！</p>'
                });
                return false;
            }
            //过滤非暂存状态单据
            for(let sub of this.selected) {
                if(sub.orderStatus !== 1) {
                    this.$Modal.info({
                        title:'提示信息',
                        content:`编号为${sub.orderNo}的单据已进入审批流，不能删除！`
                    });
                    flag = false;
                    break;
                }
            }
            if(flag){
                this.$Modal.confirm({
                    title: '提示信息',
                    content: '<p>是否删除信息？</p>',
                    onOk: () => {
                        $.ajax({
                            type: "post",
                            url: contextPath + '/oldmaterialRecycle/delete',
                            contentType: 'application/json',
                            data: JSON.stringify(ids),
                            dataType: "json",
                            success: function (res) {
                                if (res.code === '100100' && res.data === '') {
                                    setTimeout(function () {
                                        oldRecycleList.$Modal.success({
                                            title: '提示信息',
                                            content: '删除成功',
                                            onOk: function () {
                                                oldRecycleList.reload = !oldRecycleList.reload;
                                            }
                                        })
                                    }, 300)
                                } else if (res.code === '100100' && res.data != '') {
                                    setTimeout(function () {
                                        oldRecycleList.$Modal.success({
                                            title: '提示信息',
                                            content: res.data,
                                            onOk: function () {
                                                oldRecycleList.reload = !oldRecycleList.reload;
                                            }
                                        })
                                    }, 300)
                                } else {
                                    oldRecycleList.$Modal.warning({
                                        title: '提示信息',
                                        content: '删除失败',
                                        onOk: () => {
                                        oldRecycleList.reload = !oldRecycleList.reload
                                }
                                })
                                    oldRecycleList.reload = !oldRecycleList.reload
                                }
                            },
                            error: function (err) {
                                oldRecycleList.$Modal.warning({
                                    title: '提示信息',
                                    content: '服务器错误',
                                    closable: true
                                })
                            },
                        })
                    },
                })
            }
        },
        update() {
            var That = this;
            if (That.selected.length > 1) {
                That.$Modal.info({
                    title: '提示信息',
                    content: '只能选择一笔数据，请重新选择！'
                });
                return false;
            }
            if (That.selected.length == 0) {
                That.$Modal.info({
                    title: '提示信息',
                    content: '请选择一条数据进行修改！'
                });
                return false;
            }
            window.parent.activeEvent({
                name: '修改旧料收回单', url: contextPath + '/oldmaterial/recycle/old-recycle-add.html',
                params: {
                    type: 'update',
                    id: That.selected[0].id
                }
            });
        },
        view() {
            var That = this;
            window.parent.activeEvent({
                name: '查看旧料回收单',
                url: contextPath + '/oldmaterial/recycle/old-recycle-add.html',
                params: {
                    type: 'update',
                    id: That.id
                }
            });
        },
        print() {

        },
        loadCustomers() {
            var That = this;
            $.ajax({
                type: "post",
                url: contextPath + '/tbasecustomer/list?page=1&limit=30',
                contentType: 'application/json',
                dataType: "json",
                success: function (res) {
                    if (res.code == 100100) {
                        That.customers = res.data.list;
                    }
                },
                error: function (err) {
                    That.$Modal.warning({
                        title: '提示信息',
                        scrollable: true,
                        content: "系统异常,请联系技术人员！",
                    })
                },
            })
        },
        annex() {

        },
        cancel() {
            window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
        },
        preView() {

        },

    },
    created() {
        this.processModes = getCodeList("jxc_jxc_clfs");//处理方式
        this.loadCustomers();
        this.loadSuppliers();
    },
    mounted() {
        this.openTime = window.parent.params.openTime;
        this.$refs.customerRef.loadCustomerList('');
    },
});
