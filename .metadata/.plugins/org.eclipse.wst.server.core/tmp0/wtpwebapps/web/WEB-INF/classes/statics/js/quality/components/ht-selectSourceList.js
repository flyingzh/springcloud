Vue.component('ht-sourcelist', {
    props: {
        config: {
            type: Object,
            require: false,
            default() {
                return false;
            }
        },
        sourceType:{

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
            businessTypeArr:[],
            selected: [],
            body: {
                documentCode: '',
                documentTime: '',
                sourceType: '',
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
                    { name: 'documentCode', index: 'currencyName asc, invdate', width: 200, align: "left",sort:false },
                    { name: 'documentTime', index: 'currencyName asc, invdate', width: 200,sort:false,formatter:"date",formatoptions: {srcformat:'Y/m/d',newformat:'Y/m/d'},align:"left"},
                    { name: 'businessType', index: 'exchangeRate', width: 250, align: "left",
                        formatter: function (value, grid, rows, state) {
                               return This.formatterDocumentType(value);
                        }
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
                    sourceType:this.sourceType,
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
                url:'',
                onPaging(){

                },
            }

        }
    },
    methods: {
        formatterDocumentType(value){
            if(!value){
                return '';
            }else if(this.businessTypeArr.length < 1){
                return value;
            }
            return this.businessTypeArr[this.businessTypeArr.map(function(e) { return e.value; }).indexOf(value)]
                ? this.businessTypeArr[this.businessTypeArr.map(function(e) { return e.value; }).indexOf(value)].name
                : value;

        },
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
                documentCode: '',
                documentTime: '',
            }
        },
        search(){
            if(this.body.documentTime){
                this.body.documentTime = new Date(this.body.documentTime).format("yyyy-MM-dd");
            }
            let jqGrid = $("#my_table_id");
            let config = {
                postData: this.body,
                url: contextPath+"/tQcCorrectPreventDocument/querySourceDocByType"
        };
            jqGrid.jqGrid('clearGridData');
            jqGrid.jqGrid('setGridParam',config).trigger("reloadGrid");
        },
        closeModal(){
            this.$emit('cancel');
        }
    },
    mounted() {
        this.init();
        this.businessTypeArr=getCodeList('root_zj_jydywlx');
    },
    watch:{
        sourceType(){
            this.body.sourceType = this.sourceType;
            if(this.body.sourceType){
                this.search();
            }
        }
    },
    template: `<div>
            <Modal
            @on-ok="doSelect"
            @on-cancel="closeModal"
        class-name="source-list"
        width="900"
        v-model="showModal"
        title="选择源单">
        <div class="content clearfix">
           <div >
              <div>
                  <i-form :model="body" style="display:inline-block; margin-top: 10px;" :label-width="120">
                    <row class="mg-top-md">
                        <i-col span="8">
                            <form-item label="单据编号：">
                                <i-input v-model="body.documentCode" style="width: 200px"></i-input>
                            </form-item>
                        </i-col>
                        <i-col span="8">    
                            <form-item label="单据日期：" >
                                <date-picker format="yyyy/MM/dd" v-model="body.documentTime" type="datetime" placeholder="请选择时间" style="width: 200px"></date-picker>
                            </form-item>
                        </i-col>
                        <i-col span="8"> 
                            <form-item >    
                                <ht-btns @clear="clear" @search="search"></ht-btns>
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
        <div slot="footer"></div>
    </Modal>
</div>`
});
