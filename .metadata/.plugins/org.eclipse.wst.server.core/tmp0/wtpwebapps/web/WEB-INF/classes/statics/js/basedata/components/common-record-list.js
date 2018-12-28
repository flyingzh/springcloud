Vue.component('common-record-list', {
    props:{
        record_config:{
            type: Object,
            require: true
        },
        url:{
            type: String,
            require: true
        },
        table_id:{
            require: false,
            type: String,
            default(){
                return ('list' + Math.random()*100000000).substring(0,8);
            }
        },
        pager_id:{
            require: false,
            type: String,
            default(){
                return ('list' + Math.random()*100000000).substring(0,8);
            }
        },
    },
    data(){
        let That = this;
        return {
            base_config:{
                multiselect: false,
                jsonReader:{
                    root:"data.list",
                    total: "data.totalPage",
                    records: "data.totalCount",
                    cell: "list",
                },
                mtype : "POST",
                contentType: 'application/json',
                datatype : "json",//请求数据返回的类型。可选json,xml,txt
                styleUI: 'Bootstrap',
                rownumbers: true,
                pagination: true,
                viewrecords:true,
                rowNum : 10,
                width: "99%",
                autowidth: true,
                rowList : [ 10, 20, 30 ],
            }
        }
    },
    methods: {
        jqGridInit(){
            let This = this;
            let config = Object.assign(this.record_config,this.base_config,{
                colNames: this.record_config.colNames,
                colModel : this.record_config.colModel,
                caption: this.record_config.caption,
                url: this.url,
                pager: this.pager_id,
                prmNames: {
                    page: "page",
                    rows: "limit",
                    order: "order"
                },
            });
            jQuery(("#" + This.table_id)).jqGrid(config);

        },
        jqGridClearData(){
            let This = this;
            $("#" + This.table_id).jqGrid('clearGridData')
        },
        reload() {
            let This = this;
            this.jqGridClearData();
            $("#" + This.table_id).jqGrid('setGridParam',{url: this.url}).trigger("reloadGrid");
        },
    },
    watch:{
        url(){
            this.reload();
        }
    },
    mounted(){
            this.jqGridInit();
    },
    template: `<div class="jqGrid_wrapper">
        <table :id="table_id"></table> 
        <div :id="pager_id"></div>
        </div>`
});
