Vue.component('base-data-list', {
    props: ['data_config','needReload',"pageName","tableName",'totalData'],
    data(){
      let That = this;
      return {
          selected: [],
          base_config:{
                multiselect : false,
                jsonReader:{
                    root:"data",
                    cell: "data",
                },
                mtype : "POST",//向后台请求数据的ajax的类型。可选post,get

                contentType: 'application/json',
                datatype : "json",//请求数据返回的类型。可选json,xml,txt
                styleUI: 'Bootstrap',
                rownumbers: false,
                multiselectWidth: 50,
                viewrecords:true,
                pager : `#${this.pageName}`,
                onSelectAll(data,status){
                    That.handlerId(data,status);
                    That.$emit('input',That.selected);
                },
                onSelectRow(data, status){
                    That.handlerId(data,status);
                    That.$emit('input',That.selected);
                },
        }
      }
    },
    methods: {
        completeMethods(){
            $(`#${this.tableName}`).footerData('set',{
                fieldName: "合计",
                lineNum: 1,
                amount1: 101,
                amount2: 102,
                id: 1,
                parentLine: 10,
                computeType: ""
            });
            
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
            let config = Object.assign(this.data_config,this.base_config,{
                colNames: this.data_config.colNames,
                colModel : this.data_config.colModel,
                caption: this.data_config.caption,
                postData: this.$parent.body,
                url :this.data_config.url || './JSONData.json',
                prmNames: {
                    page: "",
                    pagerpos:'',
                    rows: "limit",
                    order: "order"
                },
            });
            jQuery(`#${this.tableName}`).jqGrid(config);
        },
        jqGridClearData(){
            $(`#${this.tableName}`).jqGrid('clearGridData')
        },
        reload() {
            let config = {
                postData: this.$parent.body
            };
            this.jqGridClearData();
            $(`#${this.tableName}`).jqGrid('setGridParam',config).trigger("reloadGrid");
        },
    },
    computed:{
        sum_amount1:{
            get(){
                return $(`#${this.tableName}`).getCol('amount1',false,'sum');
            },
            set(value){
                $(`#${this.tableName}`).footerData('set',{
                    fieldName: "合计",
                    lineNum: 1,
                    amount1: value,
                    amount2: 102,
                    id: 1,
                    parentLine: 10,
                    computeType: ""
                });
            }
            
        }
    },
    watch:{
        needReload(){
            this.reload();
        }
    },
    mounted(){
        this.jqGridInit();
        this.completeMethods();
    },
    template: `<div class="jqGrid_wrapper ht-set-table mt10">
            <table :id="tableName"></table> 
            <div :id="pageName"></div>
        </div>`
});
