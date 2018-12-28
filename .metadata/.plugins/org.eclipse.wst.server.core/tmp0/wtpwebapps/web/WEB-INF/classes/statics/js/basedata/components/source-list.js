Vue.component('source-list', {
    props: {
        config: {
            type: Object,
            require: false,
            default() {
                return false;
            }
        },
        showModal: {
            default() {
                return false;
            }
        }
    },
    data() {
        let This = this;
        return {
            selected: [],
            body: {
                code: '',
                date: ''
            },
            base_config:{
                colNames: ['操作','单据编号', '单据日期', '业务类型'],
                colModel: [
                    {
                        name: 'codes', index: 'invdate', width: 200, align: "center", formatter: function (value, grid, rows, state) {
                        $(document).on("click",".select"+rows.documentCode,function(){
                            This.doSelect(value, grid, rows, state)
                        });
                        let btns =`<a type="primary" class="select${rows.documentCode}">选取</a>`;
                        return btns
                        }
                    },
                    { name: 'documentCode', index: 'currencyName asc, invdate', width: 200, align: "center",sort:false },
                    { name: 'sendTestTime', index: 'currencyName asc, invdate', width: 200, align: "center",sort:false },
                    { name: 'businessType', index: 'exchangeRate', width: 200, align: "center" },
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
                pager: "#my_pager_id",
                url:contextPath+"/tbaseunit/list",
                //url: '/quality/js/quality/test-document/JSONData.json',
                onPaging(){

                },
            }

        }
    },
    methods: {
        doSelect(value, grid, rows, state){
            console.log(value, grid, rows, state)
            this.$emit('input', rows.documentCode)
            this.$emit('sure');
        },
        init(){
            let This = this;
            jQuery("#my_table_id").jqGrid(This.base_config);
        },
        clear(){
            this.body = {
                code: '',
                date: ''
            }
        },
        search(){
            let jqGrid = $("#my_table_id");
            let config = {
                postData: this.body
            };
            jqGrid.jqGrid('clearGridData');
            jqGrid.jqGrid('setGridParam',config).trigger("reloadGrid");
        },
        cancel(){
            this.$emit('cancel');
        }
    },
    mounted() {
        this.init();
    },
    template: `<div>
            <Modal
            @on-ok="doSelect"
            @on-cancel="cancel"
        class-name="source-list"
        v-model="showModal"
        title="选择部门">
        <div class="content clearfix">
           <div style="width: 800px;border: 1px solid #ccc;">
              <div>
                  <i-form :model="body" style="display:inline-block; margin-top: 10px;" :label-width="80">
                    <form-item label="单据编号">
                        <i-input v-model="body.code"></i-input>
                    </form-item>
                    <form-item label="单据日期">
                        <date-picker format="yyyy-MM-dd" v-model="body.date" :key="body.date" @on-change="body.date=$event"  type="datetime" placeholder="请选择时间" style="width: 200px"></date-picker>
                    </form-item>
                    <ht-btns @clear="clear" @search="search"></ht-btns>
                  </i-form>
                 
            </div>
            <div class="jqGrid_wrapper">
                <table id="my_table_id"></table> 
                <div id="my_pager_id"></div>
            </div>
            </div>
           
        </div>
    </Modal>
</div>`
});
