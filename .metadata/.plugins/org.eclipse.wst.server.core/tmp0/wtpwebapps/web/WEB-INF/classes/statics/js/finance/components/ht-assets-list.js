Vue.component('ht-assets-list', {
    props: {
        config: {
            type: Object,
            require: false,
            default () {
                return false;
            }
        },
        code: {
            default () {
                return '';
            }
        },
        showModal: {
            default () {
                return false;
            }
        },
        url: {
            default () {
                return '/facard/getFixedAssetsList';
            }
        }
    },
    data () {
        let This = this;
        return {
            selected: [],
            supplier: {
                escuage: true,
                clean: true
            },
            base_supplier_config: {
                colNames: ['操作', '固定资产编码', '固定资产名称', '资产类别编码', '资产类别名称'],
                colModel: [
                    {
                        name: 'id', index: 'invdate', width: 100, align: "center", formatter: function (value, grid, rows, state) {
                            $(document).off("click", ".selectSupplier" + rows.assetCode).on("click", ".selectSupplier" + rows.assetCode, function () {
                                This.doSelect(value, grid, rows, state)
                            });
                            let btns = `<a type="primary" class="selectSupplier${rows.assetCode}">选取</a>`;
                            return btns
                        }
                    },
                    { name: 'assetCode', width: 200, align: "center", sort: false, },
                    {
                        name: 'assetName', width: 200, align: "center", sort: false,
                    },
                    {
                        name: 'classCode', width: 200, align: "center", sort: false,
                    },
                    {
                        name: 'className', width: 200, align: "center", sort: false,
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
                    rows: "rows",
                },
                mtype: "POST",//向后台请求数据的ajax的类型。可选post,get
                contentType: 'application/json',
                datatype: "json",//请求数据返回的类型。可选json,xml,txt
                styleUI: 'Bootstrap',
                rownumbers: true,
                pagination: true,
                multiselectWidth: 100,
                viewrecords: true,
                rowNum: 10,
                rowList: [10, 30, 50],
                pager: "#supplier_pager_id",
                onPaging () {

                }
            }

        }
    },
    methods: {
        doSelect (value, grid, rows, state) {
            this.$emit('input', rows);
            this.$emit('sure');
        },
        init () {
            let This = this;
            let config = Object.assign({
                postData: this.supplier
            }, This.base_supplier_config)
            jQuery("#supplier_table_id").jqGrid(config);
        },
        clear () {
            this.supplier = {
                escuage: true,
                clean: true,
                page: 0,
                rwos: 0
            }
            let config = {
                postData: this.supplier
            };
            jQuery("#supplier_table_id").jqGrid('clearGridData');
            jQuery("#supplier_table_id").jqGrid('setGridParam', config).trigger("reloadGrid");
        },
        search () {
            console.log(this.supplier);
            let jqGrid = $("#supplier_table_id");
            let config = {
                postData: Object.assign(this.supplier)
            };
            jqGrid.jqGrid('clearGridData');
            jqGrid.jqGrid('setGridParam', config).trigger("reloadGrid");
        },
        reInit () {
            this.base_supplier_config.url = contextPath + this.url;
            var parent = $("#jqGrid_supplier")
            parent.empty();
            let tableId = "supplier_table_id";
            let pageId = "supplier_pager_id";
            $(`<table id=${tableId}></table>`).appendTo(parent);
            $(`<div id=${pageId}></div>`).appendTo(parent);
            this.init();
        },
        cancel () {
            this.clear();
            this.$emit('cancel');
        },
        openFun () {

        }
    },
    mounted () {
        this.base_supplier_config.url = contextPath + this.url;
        this.init();
    },
    watch: {
        url: {
            handler () {
                this.reInit();
            }
        }
    },
    template: `<div>
            <Modal
            width="680"
            @on-ok="doSelect"
            @on-cancel="cancel"
            scrollable="false"
        class-name="source-list"
        scrollable="false"
        v-model="showModal"
        title="固定资产列表">
        <div class="content clearfix">
           <div>
             <div style="margin-bottom: 10px;">
                <row>
                    <label>
                        <input type="checkbox" v-model="supplier.escuage"> 在册固定资产
                    </label>
                    <label class="ml20">
                        <input type="checkbox" v-model="supplier.clean"> 退役固定资产
                    </label>
                    <i-button @click="search" class="ht-btn ml20">查询</i-button>
                </row>
            </div>
            <div class="jqGrid_wrapper" id="jqGrid_supplier" >
                <table id="supplier_table_id"></table> 
                <div id="supplier_pager_id"></div>
            </div>
            </div>
        </div>
        <div slot="footer"></div>
    </Modal>
</div>`
});
