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
        // true 时返回选中行的整行 JSON 数据
        returnRowData: {
            require: false,
            type: Boolean,
            default: false
        },
        jdxCode:{
            require: false,
            type: Boolean,
            default(){
                return false;
            }
        }
    },
    data(){
        let That = this;
        return {
            selected: [],
            idKey: '',
            responseRaw: [],
            base_config:{
                ajaxGridOptions:{
                    complete(js , textStatus){
                        //判断数据类型
                        if(typeof js.responseText === "string"){
                            That.responseRaw = JSON.parse(js.responseText);
                        }else{
                            That.responseRaw = js.responseText;
                        }

                    }
                },
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
                },
            }
        }
    },
    methods: {
        handlerId(data, status){
            var vm = this;
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

            // 返回选中行的整行 JSON 数据
            if (this.returnRowData == true) {
                var myGrid = $("#" + this.table_id);
                var arrSelectedRowsId = myGrid.jqGrid('getGridParam','selarrrow');
                //console.log(arrSelectedRowsId);
                //console.log(this.responseRaw)

                if (arrSelectedRowsId.length > 0) {
                    var _arr = [];
                    var rawData = this.responseRaw;
                    var arrSelectedRowsIdNum = arrSelectedRowsId.map(function(item){
                        return Number(item.toString());
                    })

                    if(rawData.data && rawData.data.list[0].hasOwnProperty('id') && !vm.idKey){
                        vm.idKey = 'id';
                    }

                    $.each(rawData.data && rawData.data.list, function (idx, ele) {
                        var isSelected = false;
                        if (vm.idKey != '') {
                            if ($.inArray(ele[vm.idKey].toString(), arrSelectedRowsId) > -1) {
                                isSelected = true;
                            }
                        }else {
                            //console.log(arrSelectedRowsIdNum)
                            //var currRowData = myGrid.jqGrid('getRowData', ele);
                            if ($.inArray(idx+1, arrSelectedRowsIdNum) > -1) {
                                isSelected = true;
                            }
                        }
                        if (isSelected) {
                            _arr.push(ele);
                        }
                    });

                    this.selected = _arr;
                }else {
                    this.selected = [];
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
                postData: this.$parent.body || this.$root.body,
                url :this.data_config.url || './baseDataList.json',
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

            // 获取 id 的 key
            $.each(config.colModel, function(idx, ele){
                if (ele.name == 'id') {
                    This.idKey = ele.name;
                    return false;
                }
            });
            // 如果有定义 key：true 的列，优先使用第一个含 key 属性的列为主键列！
            $.each(config.colModel, function(idx, ele){
                if (typeof ele.key != 'undefined' && ele.key == true) {
                    This.idKey = ele.name;
                    return false;
                }
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
                postData: this.$parent.body || this.$root.body
            };
            console.log(config)
            this.jqGridClearData();
            $("#" + This.table_id).jqGrid('setGridParam',config).trigger("reloadGrid");
            this.$emit('input',[]);
            console.log("组件内部")
        }
    },
    watch:{
        needReload(){
            this.reload();
        },
    },
    mounted(){
        this.jqGridInit();
    },
    template: `<div class="jqGrid_wrapper">
        <table :id="table_id"></table> 
        <div :id="pager_id"></div>
        </div>`
});
