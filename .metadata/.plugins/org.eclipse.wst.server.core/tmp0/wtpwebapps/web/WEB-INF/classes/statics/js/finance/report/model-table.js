Vue.component('model-list', {
    props: ['data_config','needReload'],
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
                pager : '#ht-my-pager',
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

            jQuery("#ht-my-table").jqGrid(config);

            // jQuery("#ht-my-table").jqGrid('navGrid', '#ht-my-pager', {edit : false,add : false,del : false});
        },
        jqGridClearData(){
            $("#ht-my-table").jqGrid('clearGridData')
        },
        reload() {
            let config = {
                postData: this.$parent.body
            };
            this.jqGridClearData();
            $("#ht-my-table").jqGrid('setGridParam',config).trigger("reloadGrid");
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
    template: `<div class="jqGrid_wrapper ht-set-table">
            <table id="ht-my-table"></table> 
            <div id="ht-my-pager"></div>
        </div>`
});
