Vue.component('customer-source-list', {
    props: {
        config: {
            type: Object,
            require: false,
            default() {
                return false;
            }
        },
        code:{
            default() {
                return '';
            }
        },
        showModal: {
            default() {
                return false;
            }
        },
        url:{
            default() {
                return '/tbasecustomer/list';
            }
        }
    },
    data() {
        let This = this;

        return {
            selected: [],
            customer: {
                name: '',
                code: ''
            },
            base_customer_config:{
                colNames: ['操作','客户名称', '客户编码'],
                colModel: [
                    {
                        name: 'id', index: 'invdate', width: 100, align: "center", formatter: function (value, grid, rows, state) {
                        $(document).off("click",".selectCustomer"+rows.id).on("click",".selectCustomer"+rows.id,function(){
                            This.doSelect(value, grid, rows, state)
                        });
                        let btns =`<a type="primary" class="selectCustomer${rows.id}">选取</a>`;
                        return btns
                        }
                    },
                    { name: 'name', index: 'name', width: 220, align: "center",sort:false ,},
                    { name: 'code', index: 'code', width: 220, align: "center",sort:false ,
                      },
                ],
                jsonReader:{
                    root:"data.list",
                    total: "data.totalPage",
                    records: "data.totalCount",
                    cell: "list",
                },
                prmNames: {
                    page: "page",
                    rows: "limit",
                },
                mtype : "POST",//向后台请求数据的ajax的类型。可选post,get
                contentType: 'application/json',
                datatype : "json",//请求数据返回的类型。可选json,xml,txt
                styleUI: 'Bootstrap',
                rownumbers: true,
                pagination: true,
                multiselectWidth: 50,
                viewrecords:true,
                rowNum : 10,
                rowList : [ 10, 30, 50],
                pager: "#customer_pager_id",
                onPaging(){

                }
            }

        }
    },
    methods: {
        doSelect(value, grid, rows, state){
            this.$emit('input', rows);
            this.$emit('sure');
        },
        init(){
            let This = this;
            jQuery("#customer_table_id").jqGrid(This.base_customer_config);
        },
        clear(){
            this.customer = {
                name:"",
                code:""
            }
            let config = {
                postData: Object.assign(this.customer)
            };
            jQuery("#customer_table_id").jqGrid('clearGridData');
            jQuery("#customer_table_id").jqGrid('setGridParam',config).trigger("reloadGrid");
        },
        search(){
            let jqGrid = $("#customer_table_id");
            let config = {
                postData: Object.assign(this.customer)
            };
            jqGrid.jqGrid('clearGridData');
            jqGrid.jqGrid('setGridParam',config).trigger("reloadGrid");
        },
        reInit(){
            this.base_customer_config.url = contextPath + this.url;
            var parent = $("#jqGrid_customer")
            parent.empty();
            let tableId="customer_table_id";
            let pageId ="customer_pager_id";
            $(`<table id=${tableId}></table>`).appendTo(parent);
            $(`<div id=${pageId}></div>`).appendTo(parent);
            this.init();
        },
        cancel(){

            this.clear()
            this.$emit('cancel');
        },
        changeDate(value){
            this.customer.startTime=value[0].replace(/\//g, '-') + ' 00:00:00';
            this.customer.endTime=value[1].replace(/\//g, '-') + ' 23:59:59';
        }
    },
    mounted() {
        this.base_customer_config.url = contextPath + this.url;
        this.init();
    },
    watch:{
        url:{
            handler(){
                this.reInit();
            }
        }
    },
    template: `<div>
            <Modal
            @on-ok="doSelect"
            @on-cancel="cancel"
        class-name="source-list"
        v-model="showModal"
        scrollable="false"
        width="700"
        title="选择源单信息">
        <div class="content clearfix">
           <div style="border: 1px solid #ccc;">
             <div>
                  <i-form :model="customer" style="display:inline-block; margin-top: 10px;" :label-width="80">
                    <form-item label="客户名称">
                        <i-input v-model="customer.name"></i-input>
                    </form-item>
                     <form-item label="客户编码">
                        <i-input v-model="customer.code"></i-input>
                    </form-item>
                    <ht-btns @clear="clear" @search="search"></ht-btns>
                  </i-form>
            </div>
            <div class="jqGrid_wrapper" id="jqGrid_customer">
                <table id="customer_table_id"></table> 
                <div id="customer_pager_id"></div>
            </div>
            </div>
        </div>
    </Modal>
</div>`
});
