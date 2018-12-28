Vue.component('base-data-list', {
    props:{
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
            selected: [],
            base_config:{
                jsonReader:{
                    root:"data.list",
                    total: "data.totalPage",
                    records: "data.totalCount",
                    cell: "list",
                },
                mtype : "POST",
                contentType: 'application/json',
                datatype : "json",
                styleUI: 'Bootstrap',
                rownumbers: true,
                multiselectWidth: 50,
                viewrecords:true,
                rowNum : 10,
                rowList : [ 10, 20, 30, 40 ],
                onSelectAll(data,status){

                    That.handlerId(data,status);
                    That.$emit('input',That.selected);
                },
                onSelectRow(data, status){

                    That.handlerId(data,status);
                    That.$emit('input',That.selected);
                },
                onPaging(){
                    // That.reload();
                },
                beforeSelectRow(){
                    if(That.data_config.singleSelect){
                        That.selected = [];
                        $("#" + That.table_id).jqGrid('resetSelection');
                    }
                },
                gridComplete(){
                    if(That.data_config.singleSelect){
                        var myGrid = $("#" + That.table_id);
                        $("#cb_"+myGrid[0].id).hide();
                    }
                }
            }
        }
    },
    methods: {
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
            let config = Object.assign(this.data_config,this.base_config,{
                multiselect:this.data_config.multiselect === false ? false : true,
                colNames: this.data_config.colNames,
                colModel : this.data_config.colModel.map(function(item){
                    return Object.assign(item, {sortable : false});
                }),
                caption: this.data_config.caption,
                postData: this.$parent.body,
                url :this.data_config.url,
                multiboxonly: this.data_config.multiboxonly ? true : false,
                pager: This.pager_id,
                prmNames: {
                    page: "page",
                    rows: "limit",
                    order: "order",
                    id: "remark",
                },
            });
            if(this.data_config.shrinkToFit === false){
                Object.assign(config, {shrinkToFit: false});
            }else {
                Object.assign(config, {width:"99%", autowidth:true});
            }
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
        this.jqGridInit();
    },
    template: `<div class="jqGrid_wrapper">
        <table :id="table_id"></table> 
        <div :id="pager_id"></div>
        </div>`
});
