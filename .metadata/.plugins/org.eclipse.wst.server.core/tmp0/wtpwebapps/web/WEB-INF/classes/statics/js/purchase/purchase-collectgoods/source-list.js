Vue.component('source-list', {
    props: {
        config: {
            type: Object,
            require: false,
            default() {
                return false;
            }
        },
        code: {
            default() {
                return '';
            }
        },
        sourceType: {
            type: String,
            default() {
                return 'P_ORDER_01';
            }
        },
        showModal: {
            default() {
                return false;
            }
        },
        url: {
            default() {
                return '/tpurchaseorder/findByReceipt';
            }
        }
    },
    data() {
        let This = this;

        return {
            materialTypeMap: {
                "P_ORDER_01": "采购订单一标准采购",
                "P_ORDER_02": "采购订单一受托加工采购",
                "S_CUST_MATERIAL": "客户来料单",
                "P_APPLY_DELIVER": "采购送料单"
            },
            selected: [],
            selectedRows: [],
            alReadySelectedData: [], //之前已经选中的数据数组
            idKey: 'goodsLineNo',
            responseRaw: [],
            showDetailModal: false,
            body: {
                hasCreateTestDocument: 0,
                orderNo: '',
              /*  startTime: '',
                endTime: '',
                date: ''*/
            },
            base_config: {
                colNames: ['操作', '源单编号', '源单类型'],
                colModel: [
                    {
                        name: 'codes',
                        index: 'invdate',
                        width: 80,
                        align: "center",
                        formatter: function (value, grid, rows, state) {
                            $(document).off("click", ".select" + rows.id).on("click", ".select" + rows.id, function () {
                                This.doSelect(value, grid, rows, state)
                            });
                            let btns = `<a type="primary" class="select${rows.id}">选取</a>`;
                            return btns
                        }
                    },
                    {
                        name: 'orderNo', index: 'currencyName asc, invdate', width: 220, align: "center", sort: false,
                    },
                    {
                        name: 'orderType',
                        index: 'currencyName asc, invdate',
                        width: 220,
                        align: "center",
                        sort: false,
                        formatter: function (value, grid, rows, state) {
                            var cUrl = This.url.substring(0, This.url.lastIndexOf("?"));
                            if (cUrl == '/tpurchaseorder/findByReceipt') {//采购收货
                                return This.materialTypeMap[rows.businessTypeId];
                            } else if (cUrl == '/tsaleMaterialOrder/quarylist') {//客户来料
                                return "客户来料单";
                            } else if (cUrl == '/purchaseDeliverController/list') {
                                return "采购送料单"
                            } else {
                                return '';
                            }
                        }
                    },
                ],
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
                mtype: "POST",//向后台请求数据的ajax的类型。可选post,get
                contentType: 'application/json',
                datatype: "json",//请求数据返回的类型。可选json,xml,txt
                styleUI: 'Bootstrap',
                rownumbers: true,
                pagination: true,
                multiselectWidth: 50,
                viewrecords: true,
                rowNum: 10,
                rowList: [10, 30, 50],
                pager: "#my_pager_id",
            },
            base_config_detail: {
                ajaxGridOptions: {
                    complete(js, textStatus) {
                        This.responseRaw = js.responseText;
                    }
                },
                colNames: ['源单类型', "商品分录行", '源单编号', '商品图片', '商品类型', '商品编码', '商品名称', '数量', '总量', '供应商名称', '客户名称'],
                colModel: [
                    {
                        name: 'resourceType', index: 'goodsTypeName', width: 200, align: "center",
                        formatter: function (value, grid, rows, state) {
                            return This.materialTypeMap[value];
                        }
                    },
                    {name: 'goodsLineNo', index: 'goodsLineNo', width: 200, align: "center", key: true, hidden: true},
                    {name: 'resourceNumber', index: 'resourceNumber', width: 200, align: "center"},
                    {
                        name: 'pictureUrl', index: 'pictureUrl', width: 200, align: "center",
                        formatter: function (value, grid, rows, state) {
                            if(value){
                                return `<img width="60" src="${value}">`;
                            }else{
                                let noPicUrl = 'http://'+ window.location.host + contextPath+'/images/no_pic.png';
                                return `<img width="60" src="${noPicUrl}">`;
                            }

                        }
                    },
                    {name: 'goodsTypeName', index: 'goodsTypeName', width: 200, align: "center"},
                    {name: 'goodsCode', index: 'goodsCode', width: 200, align: "center"},
                    {name: 'goodsName', index: 'goodsName', width: 200, align: "center"},
                    {name: 'receivableCount', index: 'weightUnit', width: 200, align: "center"},
                    {name: 'receivableWeight', index: 'countingUnit', width: 200, align: "center"},
                    {name: 'supplierName', index: 'supplierName', width: 200, align: "center"},
                    {name: 'customerName', index: 'customerName', width: 200, align: "center"},

                ],
                jsonReader: {
                    root: "data.collectGoods",
                    cell: "collectGoods",
                },
                mtype: "POST",//向后台请求数据的ajax的类型。可选post,get
                contentType: 'application/json',
                datatype: "json",//请求数据返回的类型。可选json,xml,txt
                styleUI: 'Bootstrap',
                rownumbers: true,
                multiselect: true,
                pagination: true,
                multiselectWidth: 50,
                viewrecords: false,
                rowNum: 10,
                rowList: [10, 30, 50],
                pager: "#my_pager_id_detail",
                onSelectAll(data, status) {
                    This.handlerId(data, status);
                },
                onSelectRow(data, status) {
                    This.handlerId(data, status);
                }
            }
        }
    },
    methods: {
        doSelect(value, grid, rows, state) {
            this.showModal = false;
            this.showDetailModal = true;
            this.reInitDetail(rows);
            this.$emit('on-change');
        },
        init() {
            let This = this;
            jQuery("#my_table_id").jqGrid(This.base_config);
            this.initDetailTable();
        },
        initDetailTable() {
            let This = this;
            jQuery("#my_table_id_detail").jqGrid(This.base_config_detail);
        },
        clear() {
            this.body = {
                orderNo: '',
           /*     date: '',
                startTime: '',
                endTime: ''*/
            }
        },
        search() {
            let jqGrid = $("#my_table_id");
            let config = {
                postData: Object.assign(this.body)
            };
            jqGrid.jqGrid('clearGridData');
            jqGrid.jqGrid('setGridParam', config).trigger("reloadGrid");
        },
        reInit() {
            this.base_config.url = contextPath + this.url;
            var parent = $("#jqGrid_wrapper_source")
            parent.empty();
            let tableId = "my_table_id";
            let pageId = "my_pager_id";
            $(`<table id=${tableId}></table>`).appendTo(parent);
            $(`<div id=${pageId}></div>`).appendTo(parent);
            this.init();
        },
        reInitDetail(row) {
            this.base_config_detail.url = contextPath + '/tpurchasecollectgoods/findByTypeId?type=' + this.sourceType + '&id=' + row.id;
            var parent = $("#jqGrid_wrapper_source_detail")
            parent.empty();
            let tableId = "my_table_id_detail";
            let pageId = "my_pager_id_detail";
            $(`<table id=${tableId}></table>`).appendTo(parent);
            $(`<div id=${pageId}></div>`).appendTo(parent);
            this.initDetailTable();
        },
        cancel() {
            this.body.orderNo = "";
            this.showModal = false;
            this.showDetailModal = false;
            this.$emit('cancel');
            this.search();
        },
        changeDate(value) {
            this.body.startTime = value[0].replace(/\//g, '-') + ' 00:00:00';
            this.body.endTime = value[1].replace(/\//g, '-') + ' 23:59:59';
        },
        detailSelected() {
            if (!this.validate()) {
                return;
            }
            this.showModal = false;
            this.showDetailModal = false;
            this.$emit('sure', this.selectedRows);
            this.selected = [];
        },
        validate() {
            let testObj = this.alReadySelectedData.length > 0 ? this.alReadySelectedData[0] : this.selectedRows[0];
            let resourceType = testObj.resourceType;
            let goodsTypePath = testObj.goodsTypePath;
            let customerId = testObj.customerId;
            let supplierId = testObj.supplierId;
            let streamId = [];
            let flag = false;
            for (let k = 0, len = this.alReadySelectedData.length; k < len; k++) {
                streamId.push(this.alReadySelectedData[k].streamId)
            }

            for (let i = 0, length = this.selectedRows.length; i < length; i++) {
                if (this.selectedRows[i].resourceType != resourceType) {
                    this.$Modal.info({
                        scrollable:true,
                        content: "请选择相同的源单类型进行收货",
                    });
                    flag = true;
                    return false;
                }
                if (this.selectedRows[i].goodsTypePath != goodsTypePath) {
                    this.$Modal.info({
                        scrollable:true,
                        content: "请选择相同的商品类型进行收货",
                    });
                    flag = true;
                    return false;
                }
                if (this.selectedRows[i].resourceType == 'S_CUST_MATERIAL') {
                    if (customerId != this.selectedRows[i].customerId) {
                        this.$Modal.info({
                            scrollable:true,
                            content: "请选择相同的客户进行收料",
                        });
                        flag = true;
                        return false;
                    }
                } else {
                    if (supplierId != this.selectedRows[i].supplierId) {
                        this.$Modal.info({
                            scrollable:true,
                            content: "请选择相同的供应商进行收料"
                        });
                        flag = true;
                        return false;
                    }
                }
                if (streamId.indexOf(this.selectedRows[i].streamId) > -1) {
                    this.$Modal.info({
                        scrollable:true,
                        content: "请勿选择相同的商品进行收货！"
                    });
                    flag = true;
                    return false;
                }
                streamId.push(this.selectedRows[i].streamId);
            }
            if (!flag) {
                return true;
            }
        },
        detailCancel() {
            this.showModal = true;
            this.showDetailModal = false;
        },
        handlerId(data, status) {
            var vm = this;
            if (typeof data === 'object' && status) {
                this.selected = data
            }
            if (typeof data === 'object' && !status) {
                this.selected = [];
            }
            if (typeof data === 'string') {
                if (status) {
                    (this.selected.indexOf(data.toString()) > -1) ? null : this.selected.push(data.toString());
                } else {
                    let index = this.selected.indexOf(data.toString());
                    index > -1 ? this.selected.splice(index, 1) : null;
                }
            }

            // 返回选中行的整行 JSON 数据
            let myGrid = $("#my_table_id_detail");
            let arrSelectedRowsId = myGrid.jqGrid('getGridParam', 'selarrrow');

            if (arrSelectedRowsId.length > 0) {
                let _arr = [];
                let rawData = JSON.parse(this.responseRaw);

                $.each(rawData.data && rawData.data.collectGoods, function (idx, ele) {
                    var isSelected = false;
                    if ($.inArray(ele[vm.idKey].toString(), arrSelectedRowsId) > -1) {
                        isSelected = true;
                    }
                    if (isSelected) {
                        _arr.push(ele);
                    }
                });
                this.selectedRows = _arr;
            } else {
                this.selectedRows = [];
            }
        },
    },
    mounted() {
        this.base_config.url = contextPath + this.url;
        this.init();
    },
    watch: {
        url: {
            handler() {
                this.reInit();
            }
        }
    },
    template: `<div>
            <Modal
            @on-ok="doSelect"
            @on-cancel="cancel"
            width="60"
            scrollable="false"
        class-name="source-list"
        v-model="showModal"
        title="选择源单信息">
        <div class="content clearfix">
           <div style="border: 1px solid #ccc;">
              <div>
                  <i-form :model="body" style="display:inline-block; margin-top: 10px;" :label-width="80">
                    <form-item label="单据编号">
                        <i-input v-model="body.orderNo"></i-input>
                    </form-item>
                    <!--<form-item label="单据日期">
                        &lt;!&ndash;<date-picker format="yyyy-MM-dd" v-model="body.date" :key="body.date" @on-change="body.date=$event"  type="datetime" placeholder="请选择时间" style="width: 200px"></date-picker>&ndash;&gt;
                    <date-picker @on-change="changeDate" format="yyyy/MM/dd" v-model="body.date" type="daterange" placement="bottom-end" placeholder="Select date" style="width: 200px"></date-picker>-->
                    </form-item>
                    <i-button type="primary" @click="search">搜索</i-button>
                  </i-form>
            </div>
            <div class="jqGrid_wrapper" id="jqGrid_wrapper_source">
                <table id="my_table_id"></table> 
                <div id="my_pager_id"></div>
            </div>
            </div>
        </div>
        <div class="source-list-detail-wrap">
        <Modal
            @on-cancel="detailCancel"
            class-name="source-list-detail"
            width="80"
        v-model="showDetailModal"
        title="请选择单据">
        <div class="content clearfix">
           <div style="border: 1px solid #ccc;">
              <div>
            </div>
            <div class="jqGrid_wrapper" id="jqGrid_wrapper_source_detail">
                <table id="my_table_id_detail"></table> 
                <div id="my_pager_id_detail"></div>
            </div>
            </div>
        </div>
         <div slot="footer">
                    <i-button type="text" size="large" @click="detailCancel">取消</i-button>
                    <i-button type="primary" size="large" @click="detailSelected">确定</i-button>
                </div>
    </Modal>
</div>
        <div>
</div>
    </Modal>
</div>`
});
