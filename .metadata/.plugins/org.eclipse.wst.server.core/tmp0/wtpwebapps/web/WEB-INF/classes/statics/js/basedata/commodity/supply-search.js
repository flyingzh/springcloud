Vue.component('supply-search', {
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
                mtype : "POST",//向后台请求数据的ajax的类型。可选post,get
                contentType: 'application/json',
                datatype : "json",//请求数据返回的类型。可选json,xml,txt
                styleUI: 'Bootstrap',
                rownumbers: true,
                multiselectWidth: 50,
                viewrecords:true,
                forceFit:true,
                rowNum : 10,
                width:"99%",
                autowidth:true,
                rowList : [ 10, 20, 30, 40 ],
                onSelectAll(data,status){//  所有的id
                    var obj = ($("#" + That.table_id).jqGrid("getRowData")); //获取整行数据
                    That.handlerId(obj,status);
                    That.$emit('input',That.selected);
                },
                onSelectRow(rowid, status){
                    var obj = ($("#" + That.table_id).jqGrid("getRowData",rowid)); //获取整行数据
                    That.handlerId(obj,status);
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
            var This = this;
            if ($.type(data) === 'array'){
                This.selected = (status) ? data : [];
            }else if($.type(data) === 'object'){
                if(status){
                    This.selected.push(JSON.stringify(data));
                }else {
                    let index = This.selected.indexOf(JSON.stringify(data));
                    index > -1 ? This.selected.splice(index, 1) : null;
                }
            }
        },
        jqGridInit(){
            let This = this;
            let config = Object.assign(this.data_config,this.base_config,{
                multiselect:this.data_config.multiselect === false ? false : true,
                colNames: this.data_config.colNames,
                colModel : this.data_config.colModel,
                caption: this.data_config.caption,
                postData: this.$parent.$parent.supplySearch,
                url :this.data_config.url || './../JSONData.json',
                multiboxonly: this.data_config.multiboxonly ? true : false,
                pager: This.pager_id,
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
            let config = {
                postData: This.$parent.$parent.supplySearch
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
