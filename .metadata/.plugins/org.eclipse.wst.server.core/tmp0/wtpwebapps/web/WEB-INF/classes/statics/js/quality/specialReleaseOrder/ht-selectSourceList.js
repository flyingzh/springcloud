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
            selected: [],
            date: [],
            body: {
                documentCode: '',
                startTime: '',
                endTime: '',
                alreadyTest: 1,
                documentType: '',
            },
            base_config:{
        		colNames: ["操作", "源单编号",  "送检编号", "单据日期", "业务类型"],
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
                    {
    					name: "upstreamSourceCode",
    					index: "currencyName asc, invdate",
    					width: 200,
    					align: "center",
    					sort: !1
    				},
                    { name: 'documentCode', index: 'currencyName asc, invdate', width: 200, align: "center",sort:false },
                   
                    { name: 'documentTime', index: 'currencyName asc, invdate', width: 200, align: "center",sort:false },
                    { name: 'businessType', index: 'exchangeRate', width: 200, align: "center", sort:false},
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
                    alreadyTest: 1,
                    documentType:this.sourceType
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
                url:contextPath+"/specialReleaseDocument/list",
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
            Object.assign(This.base_config, {postData: this.body})
            jQuery("#my_table_id").jqGrid(This.base_config);
        },
        clear(){
            this.date = [];
            this.body = {
                documentCode: '',
                startTime: '',
                endTime: '',
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
        closeModal(){
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
        sourceType(){
            this.body.documentType = this.sourceType;
            setTimeout(()=>{
                this.search();
            },2000)
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
           <div style="width: 800px;border: 1px solid #ccc;">
              <div>
                  <i-form :model="body" style="display:inline-block; margin-top: 10px;" :label-width="80">
                    <form-item label="送检编号" style="display: inline-block">
                        <i-input v-model="body.documentCode"></i-input>
                    </form-item>
                    <form-item label="单据日期" style="display: inline-block">
                       <!-- <date-picker format="yyyy-MM-dd" v-model="date" :key="body.date" @on-change="body.date=$event"  type="datetime" placeholder="请选择时间" style="width: 200px"></date-picker>-->
                    <date-picker @on-change="changeDate" v-model="date" :clearable="false" format="yyyy/MM/dd" type="daterange" placement="bottom-end" placeholder="请选择时间" style="width: 200px"></date-picker>
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
        <div slot="footer"></div>
    </Modal>
</div>`
});