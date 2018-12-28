Vue.component('correct-prevent-list', {
    props:{
        openTime : '',
        data_config:{
            type: String,
            require: true
        },
        needReload:{
            require: false,
            type: Object
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
            selectRowData:[],
            selected: [],
            base_config:{
                jsonReader:{
                    root:"data.list",
                    total: "data.totalPage",
                    records: "data.totalCount",
                    cell: "list",
                },
                mtype : "POST",//向后台请求数据的ajax的类型。可选post,get

                contentType: 'application/json',
                datatype : "json",//请求数据返回的类型。可选json,xml,txt
                styleUI: 'Bootstrap',
                rownumbers: true,
                multiselectWidth: 50,
                viewrecords:true,
                rowNum : 10,
                rowList : [ 10, 20, 30, 40 ],
                onSelectAll(data,status){
                    That.handlerId(data,status);
                    That.handleSelectRow();
                    That.$emit('input',That.selectRowData);
                },
                onSelectRow(data, status){

                    That.handlerId(data,status);
                    That.handleSelectRow();
                    That.$emit('input',That.selectRowData);
                },
                onPaging(){
                    //That.reload();
                }
            }
        }
    },
    methods: {

        handleSelectRow(){
            if(this.selected.length < 1){

            }else {
                this.selectRowData=[];
                for (let rowId of this.selected){
                    let selectRow=$("#" + this.table_id).jqGrid('getRowData',rowId);
                    this.selectRowData.push(selectRow);
                }
            }
        },
        handlerId(data, status){
            if(typeof data === 'object' && status){
                this.selected = data
            }
            if(typeof data === 'object' && !status){
                this.selected = [];
            }
            if(typeof data === 'string'){
                if(status){
                    (this.selected.indexOf(data.toString()) > -1) ? null : this.selected.push(data.toString());
                }else {
                    let index = this.selected.indexOf(data.toString());
                    index > -1 ? this.selected.splice(index, 1) : null;
                }
            }
        },
        jqGridInit(){
            let This = this;
            let config = Object.assign(this.base_config,this.data_config,{
                multiselect:this.data_config.multiselect === false ? false : true,
                colNames: this.data_config.colNames,
                colModel : this.data_config.colModel,
                caption: this.data_config.caption,
                postData: this.$parent.body ,//? Object.assign({}, ...this.$parent.body, {code : This.data_config.code}) : Object.assign({},{code : This.data_config.code}),
                url :this.data_config.url || './../JSONData.json',
                pager: This.pager_id,
                jsonReader:this.data_config.jsonReader || this.base_config.jsonReader,
                prmNames: {
                    page: "page",
                    rows: "limit",
                    order: "order",
                    id: "remark",
                },
            });

            jQuery(("#" + This.table_id)).jqGrid(config);

            jQuery(("#" + This.table_id)).jqGrid('navGrid', "#" + This.table_id, {edit : false,add : false,del : false});
        },
        jqGridClearData(){
            let This = this;
            $("#" + This.table_id).jqGrid('clearGridData')
        },
        reload() {
            let This = this;
            this.selected = [];
            this.$emit('input',this.selected);
            let config = {
                postData: this.$parent.body
            };
            this.jqGridClearData();
            $("#" + This.table_id).jqGrid('setGridParam',config).trigger("reloadGrid");
        },
    },
    watch:{
        needReload(){
            this.reload();
        }
    },
    mounted(){
        this.openTime = window.parent.params.openTime;
        this.jqGridInit();
    },
    template: `<div class="jqGrid_wrapper">
        <table :id="table_id"></table> 
        <div :id="pager_id"></div>
        </div>`
});
