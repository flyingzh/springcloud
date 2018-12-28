Vue.component('source-list', {
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
        }
    },
    data() {
        let This = this;
        return {
            selected: [],
            body: {
                hasCreateTestDocument: 0,
                startTime: '',
                endTime: '',
                documentCode: '',
                upstreamSourceCode:'',
                date: ''
            },
            base_config:{
                colNames: ['操作','送检编号','源单单号', '单据日期', '业务类型','商品类型'],
                colModel: [
                    {
                        name: 'codes', index: 'invdate', width: 80, align: "center", formatter: function (value, grid, rows, state) {
                        $(document).on("click",".select"+rows.documentCode,function(){
                            This.doSelect(value, grid, rows, state)
                        });
                        let btns =`<a type="primary" class="select${rows.documentCode}">选取</a>`;
                        return btns
                        }
                    },
                    { name: 'documentCode', width: 180, align: "center",sort:false },
                    { name: 'upstreamSourceCode', width: 200, align: "center",sort:false },
                    { name: 'sendTestTime', width: 150, align: "center",sort:false },
                    { name: 'businessType',  width: 150, align: "center" },
                    {name: 'productTypeName', width: 150, align: "center" },
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
                url:contextPath+"/documentController/list/",
                onPaging(){

                },
            }

        }
    },
    methods: {
        doSelect(value, grid, rows, state){
            console.log(value, grid, rows, state)
            this.$emit('input', rows)
            this.$emit('sure');
        },
        init(){
            let This = this;
            jQuery("#my_table_id").jqGrid(This.base_config);
        },
        clear(){
            this.body = {
                // code: '',
                documentCode:'',
                date: '',
                startTime:'',
                upstreamSourceCode:'',
                endTime:''
            }
        },
        search(){
            let jqGrid = $("#my_table_id");
            let config = {
                postData: Object.assign({documentType: this.code}, this.body)
            };
            jqGrid.jqGrid('clearGridData');
            jqGrid.jqGrid('setGridParam',config).trigger("reloadGrid");
        },
        cancel(){
            this.$emit('cancel');
        },
        changeDate(value){
            this.body.startTime=value[0].replace(/\//g, '-') + ' 00:00:00';
            this.body.endTime=value[1].replace(/\//g, '-') + ' 23:59:59';
        }
    },
    mounted() {
        this.init();
    },
    watch:{
        code:{
            handler(){
                this.search();
            }
        }
    },
    template: `<div>
            <Modal
            @on-ok="doSelect"
            @on-cancel="cancel"
        class-name="source-list"
        v-model="showModal"
        width="95"
        title="选择源单信息">
        <div class="content clearfix">
            <div>
                <div>
                    <i-form :model="body" label-width="80">
                        <row>
                            <i-col span="8">
                                <form-item label="送检编号：">
                                    <i-input v-model="body.documentCode"></i-input>
                                </form-item>
                            </i-col>
                             <i-col span="8">
                                <form-item label="源单单号：">
                                    <i-input v-model="body.upstreamSourceCode"></i-input>
                                </form-item>
                            </i-col>
                            <i-col span="8">
                                <form-item label="单据日期：">                       
                                    <date-picker @on-change="changeDate" format="yyyy/MM/dd" v-model="body.date" type="daterange" placement="bottom-end" placeholder="Select date"></date-picker>
                                </form-item>
                                <form-item>
                                    <ht-btns @clear="clear" @search="search" ></ht-btns>
                                </form-item>
                            </i-col>
                            
                        </row>
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
