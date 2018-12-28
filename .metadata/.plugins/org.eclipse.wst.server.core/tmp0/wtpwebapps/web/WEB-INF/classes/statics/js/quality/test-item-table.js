Vue.component('test-item-table', {
    props:{
        data:{
          require: true,
            type: Object,
            default(){
                return [];
            }
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
        return {
            selected: [],
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
        initTable(){
            let This = this;
            $("#" + This.table_id).jqGrid({
                datatype:'local',
                styleUI: 'Bootstrap',
                rownumbers: true,
                multiselect: true,
                colNames : [ 'id','检验项目状态','附件id','检验项目编码', '检验项目名称'],
                colModel : [
                    {name:'id',index:'id',hidden:true},
                    {name:'testItemStatus',index:'testItemStatus',hidden:true},
                    {name:'sysFileId',index:'sysFileId',hidden:true},
                    {
                        name : 'code',
                        index : 'code',
                        width : 501,
                        align: "left",
                        formatter: function (value, grid, rows, state) {
                            $(document).off("click", ".updateDetail" + value).on("click", ".updateDetail" + value, function () {
                                This.updateDetail({value, grid, rows, state})
                            });
                            let btns = `<a class="updateDetail${value}">${value}</a>`;
                            return btns;
                        },
                        unformat:function (value, grid, rows) {
                            return value.replace(/(<\/?a.*?>)/g, '');
                        }
                    },
                    {name : 'name',index:'name', width : 501,align : "center"}

                ],
                pager: false,
                autoHeight:true,
                onSelectAll(data,status){
                    console.log(data, status)
                    This.handlerId(data,status);
                    This.$emit('input',This.selected);
                },
                onSelectRow(data, status){
                    console.log(data, status)
                    This.handlerId(data,status);
                    This.$emit('input',This.selected);
                },
            });

            if(This.data.length == 0 || !This.data){
                return;
            }


            for(let i=0;i<This.data.length;i++){
                $("#" + This.table_id).jqGrid('addRowData',i+1,This.data[i]);
            }
        },
        reInitTable(){
            this.selected = [];
            let This = this;
            $("#" + This.table_id).jqGrid('clearGridData');  //清空表格
            $("#" + This.table_id).jqGrid('setGridParam',{  // 重新加载数据
                data : This.data,   //  重新加载的数据
                datatype:'local',
            }).trigger("reloadGrid");
        },
        updateDetail(data){
            console.log(data.value);
            window.parent.activeEvent({name: '查看检验项目', url: contextPath+'/quality/quality/inspection-item.html',params: {id:data.rows.id,data:data.value,type:2}});
        }

    },
    watch:{
        data:{
            deep: true,
            handler(){
                this.reInitTable();
            }
        }
    },
    mounted(){
        this.initTable();
        console.log(this.data)
    },
    template: `<div class="jqGrid_wrapper">
        <table :id="table_id"></table> 
        <div :id="pager_id"></div>
        </div>`
});
