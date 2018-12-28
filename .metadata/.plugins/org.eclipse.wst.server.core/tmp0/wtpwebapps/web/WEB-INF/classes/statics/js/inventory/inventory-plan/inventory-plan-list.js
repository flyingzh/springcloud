var vm = new Vue({
    el: "#app",
    data: {
        openTime:"",
        isShow: false,
        isEdit: false,
        reload: false,
        selected:[],
        isSearchHide: true,
        isTabulationHide: true,
        reload_inventory_list: false,
        dateAttr:[],
        body:{
            documentNo:"",
            documentName:"",
            inventoryType:"",
            documentStatus:"",
            startTime:"",
            endTime:"",
        },
        inventoryTypeList:[],
        documentStatusList: [
            {
                value: 1,
                name: "暂存"
            },
            {
                value: 2,
                name: "已提交"
            },
            {
                value: 3,
                name: "盘点中"
            },
            {
                value: 6,
                name: '已生成调整单据'
            },
            {
                value: 4,
                name: "已盘点"
            },
            {
                value: 5,
                name: "已结束"
            }
        ],
        data_config_inventory_list: {
            url: contextPath + "/inventoryplan/list",
            datatype:"json",
            colNames: ['id','盘点方案编号', '盘点方案名称','盘点类型','状态','仓库或柜台','仓库和柜台id', '创建人', '创建时间','商品类型code','商品类型name','款式类别code','款式类别name'],
            colModel:[
                {name: "id", index:"a", hidden:true, width: 210, align: "left"},
                {name: "documentNo", index:"b", width: 300, align: "left",
                    formatter: function (value, grid, rows, state) {
                        $(document).off("click", ".detail" + value).on("click", ".detail" + value, function () {
                            vm.documentCodeClick(rows.documentNo);
                        });
                        let btns = `<a class="detail${value}">${value}</a>`;
                        return btns
                    },
                    unformat:function (val,grid,rows) {
                        return val.replace(/(<\/?a.*?>)/g, '');
                    }
                },
                {name: "documentName", index: "c", width: 210, align: "left"},
                {name: "inventoryType", index: "c", width: 210, align: "left",
                    formatter: function (value, grid, rows, state) {
                        return vm.formatterInventoryType(value);
                    }, unformat: function (cellvalue, options, rowObject) {
                        return vm.unformatterInventoryType(cellvalue);
                    }},
                {name: "documentStatus", width: 210, align: "left",
                    formatter: function (value, grid, rows, state) {
                        return vm.formatterDocumentStatus(value);
                    }, unformat: function (cellvalue, options, rowObject) {
                        return vm.unformatDocumentStatus(cellvalue);
                    }
                },
                {name: "warehouseName", index: "e", align: "left", width: 210},
                {name: "warehouseId", hidden:true, index: "e", align: "left", width: 210},
                { name: "createName", index: "f", align: "left", width: 210},
                { name: "createTime", index: "f", align: "left", width: 210,
                    formatter: function (value, grid, rows, state) {
                        Date.prototype.Format = function (fmt) { //author: meizz
                            var o = {
                                "M+": this.getMonth() + 1, //月份
                                "d+": this.getDate(), //日
                                "h+": this.getHours(), //小时
                                "m+": this.getMinutes(), //分
                                "s+": this.getSeconds(), //秒
                                "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                                "S": this.getMilliseconds() //毫秒
                            };
                            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
                            for (var k in o)
                                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1,
                                    (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                            return fmt;
                        }
                        return  new Date(value).Format("yyyy-MM-dd");
                    }
                },
                { name: "goodsTypeCode", hidden:true, index: "f", align: "left", width: 210},
                { name: "goodsTypeName", hidden:true, index: "f", align: "left", width: 210},
                { name: "custStyleType", hidden:true, index: "f", align: "left", width: 210},
                { name: "custStyleTypeName", hidden:true, index: "f", align: "left", width: 210},
            ],
            rowNum : 5,//一页显示多少条
            rowList : [ 10, 20, 30 ],//可供用户选择一页显示多少条
            mtype : "post",//向后台请求数据的ajax的类型。可选post,get
            viewrecords : true
        },

    },
    methods:{
        handleClearType(value){
            this.$refs[value].reset();
            this.$nextTick(() => {
                if(value === 'inventType'){
                    this.body.inventoryType = '';
                }
                if (value === 'docStatus'){
                    this.body.documentStatus = '';
                }
            });
        },
        search(){
            if (this.dateAttr.length > 0 && this.dateAttr[0] && this.dateAttr[1]) {
                this.body.startTime = this.dateAttr[0].format("yyyy-MM-dd HH:mm:ss");
                this.body.endTime = this.dateAttr[1].format("yyyy-MM-dd HH:mm:ss");
            } else {
                this.body.startTime = '';
                this.body.endTime = '';
            }
            this.reload = !this.reload;
        },
        clear(){
            this.body.documentNo = '';
            this.body.documentName = '';
            this.body.startTime = "";
            this.body.endTime = "";
            if (this.body.inventoryType) {
                this.$refs.inventType.reset();
                this.$nextTick(() => {
                    this.body.inventoryType = '';
                });
            }
            if(this.body.documentStatus){
                this.$refs.docStatus.reset();
                this.$nextTick(() => {
                    this.body.documentStatus = '';
                });
            }
            this.dateAttr = [];
        },
        add(){
            window.parent.activeEvent({
                name: '新增盘点方案',
                url: contextPath + '/inventory/inventory-plan/add-inventory-plan.html',
                params:{openTime: this.openTime, type: "add"}
            });
        },
        update(){
            let This = this;
            if(This.selected.length > 1){
                This.$Modal.info({
                    title:'提示信息',
                    content: '只能选择一条数据！',
                });
                return;
            }
            if(This.selected.length < 1){
                This.$Modal.info({
                    title:'提示信息',
                    content: '请选择一条数据！',
                });
                return;
            }
            if(This.selected[0].documentStatus != 1){
                This.$Modal.info({
                    title:'提示信息',
                    content: '单据状态不为暂存，不能修改！',
                });
                return;
            }
            window.parent.activeEvent({
                name: '修改盘点方案',
                url: contextPath + '/inventory/inventory-plan/add-inventory-plan.html',
                params: {data:This.selected[0].id, type: 'update'}
            });
        },
        submit(){
            let This = this;
            if(This.selected.length > 1){
                This.$Modal.info({
                    title:'提示信息',
                    content: '只能选择一条数据！',
                });
                return;
            }
            if(This.selected.length < 1){
                This.$Modal.info({
                    title:'提示信息',
                    content: '请选择一条数据！',
                });
                return;
            }
            if(This.selected[0].documentStatus != 1){
                This.$Modal.info({
                    title:'提示信息',
                    content: '单据状态不为暂存，不能提交！',
                });
                return;
            }
            if(!(This.selected[0].documentName && This.selected[0].inventoryType && This.selected[0].warehouseId)){
                This.$Modal.info({
                    title: '提示信息',
                    content: '该条数据不完整请将数据输入完整之后再提交！'
                });
                return;
            }
            $.ajax({
               type: "post",
               url: contextPath + '/inventoryplan/update',
               data: JSON.stringify({id:This.selected[0].id,documentStatus:2}),
               contentType: 'application/json',
               success: function (data) {
                   if(data.code == '100100'){
                       This.$Modal.success({
                           title: '提示信息',
                           content: '提交成功！'
                       });
                       This.reloadAgain();
                   }else {
                       This.$Modal.warning({
                           title: '提示信息',
                           content: '提交失败！'
                       });
                   }
               }
            });
        },
        del(){
           let This = this;
           let ids = This.selected.map((e) => {
               return e.id;
           });
           if(ids.length < 1){
               This.$Modal.info({
                   title: '提示信息',
                   content: '请至少选择选择一条数据！',
               });
               return
           };
           let unDel = [];
           This.selected.forEach((e) => {
               if(e.documentStatus != 1){
                   unDel.push(e.documentNo);
               }
           });
           if(unDel.length > 0){
               This.$Modal.info({
                   title: '提示信息',
                   content: unDel.map((e) => {return '单据'+ e}) + '非暂存状态不能删除！',
               });
               return;
           }
           $.ajax({
               type: 'post',
               url: contextPath + '/inventoryplan/delete',
               data: JSON.stringify(ids),
               contentType:'application/json',
               success: function (data) {
                   if(data.code === '100100'){
                       This.$Modal.success({
                           title: '提示信息',
                           content: '删除成功！'
                       });
                       This.selected = [];
                       This.reloadAgain();
                   }else {
                       This.$Modal.warning({
                           title: '提示信息',
                           content: '删除失败！'
                       })
                   }
               }
           })
        },
        entryData(){
            let This = this;
            if(This.selected.length < 1){
                This.$Modal.info({
                    title: '提示信息',
                    content: '请选择一条数据！'
                });
                return;
            };
            if(This.selected.length > 1){
                This.$Modal.info({
                    title: '提示信息',
                    content: '只能选择一条数据！'
                });
                return;
            }
            if(This.selected[0].documentStatus == 2 || This.selected[0].documentStatus == 3){
                window.parent.activeEvent({
                    name: '录入盘点数据',
                    url: contextPath + '/inventory/record-inventory/record-inventory.html',
                    params: {data: This.selected[0],type:'jump'}
                });
            }else {
                This.$Modal.info({
                    title: '提示信息',
                    content: "只有状态为'已提交'和'盘点中'的盘点方案才能录入盘点数据！"
                });
                return;
            }
        },
        reloadAgain(){
            this.clear();
            this.reload = !this.reload;
        },
        documentCodeClick(code){
            window.parent.activeEvent({
                name: '查看盘点方案',
                url: contextPath + '/inventory/inventory-plan/add-inventory-plan.html',
                params: {data: code, type: 'query'}
            });
        },
        formatterInventoryType(value){
            if(!value){
                return '';
            }else if(this.inventoryTypeList.length < 1){
                return value;
            }
            return this.inventoryTypeList[this.inventoryTypeList.map(function(e) { return e.value; }).indexOf(value)]
                ? this.inventoryTypeList[this.inventoryTypeList.map(function(e) { return e.value; }).indexOf(value)].name
                : value;
        },
        unformatterInventoryType(){
            if(!value){
                return '';
            }else if(this.inventoryTypeList.length < 1){
                return value;
            }
            return this.inventoryTypeList[this.inventoryTypeList.map(function(e) { return e.name; }).indexOf(value)]
                ? this.inventoryTypeList[this.inventoryTypeList.map(function(e) { return e.name; }).indexOf(value)].value
                : name;
        },
        exit(){
            window.parent.closeCurrentTab({name: '盘点方案列表', openTime: this.openTime, exit: true});
        },
        getInventoryType(){
           this.inventoryTypeList = getCodeList("inventory_inventoryType")
        },
        formatterDocumentStatus(value){
            if(!value){
                return '';
            }else if(this.documentStatusList.length < 1){
                return value;
            }
            return this.documentStatusList[this.documentStatusList.map(function(e) { return e.value; }).indexOf(value)]
                ? this.documentStatusList[this.documentStatusList.map(function(e) { return e.value; }).indexOf(value)].name
                : value;

        },
        unformatDocumentStatus(value){
            if(!value){
                return '';
            }else if(this.documentStatusList.length < 1){
                return value;
            }
            return this.documentStatusList[this.documentStatusList.map(function(e) { return e.name; }).indexOf(value)]
                ? this.documentStatusList[this.documentStatusList.map(function(e) { return e.name; }).indexOf(value)].value
                : value;
        },
    },
    mounted(){
        this.openTime = window.parent.params.openTime;
        this.getInventoryType();
    }
})