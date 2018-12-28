var parvm = new Vue({
    el: '#paraLevel',
    data() {
        let This = this;
        return {
            isEdit: false,
            isView: false,
            reload: false,
            disabledFlag : false,
            typeNameFlag:true,
            subjectFlag: true,
            showSourceModal:true,
            cateFlag:false,
            buttonFlag:true,
            subjectSelected: [],
            childNodes: 1,
            openTime:"",
            isSearchHide: true, //搜索栏
            categoryFlag: false,
            codeFlag:false,
            showView: false,
            supplierReload: false,
            showModal: false,
            supplier_selected:[],
            organizationInfo:{
                id: ''
            },
            tmp:'',
            status: [
                {
                    value: 2,
                    label: '贷方'
                },
                {
                    value: 1,
                    label: '借方'
                }
            ],
            inputorder:{
                stocktCode:{
                    id:'',
                    name:''
                },
                saleRevenue:{
                    id:'',
                    name:''
                },
                saleCostCode:{
                    id:'',
                    name:''
                },
                costDiffCode:{
                    id:'',
                    name:''
                },
            },
            cashSelected: [],
            selected:[],
            banks: [],
            searchBody:{
                name: '',
                code: ''
            },
            subjectEntity:{
                id: '',
                subjectCode: '',
                subjectName: '',
                balanceDirection: '',
                subjectCategoryName:''
            },
            subjectSearchBody:{
                id: '',
                fullSubjectCode:'',
                treeHeight: '',
                subjectName: '',
                balanceDirection: ''
            },
            modalType:'',
            titleName:'',
            openAddCommodity:false,
            ruleCommodity:{name:[{required:true}]},
            treeName:'',
            nodeData: [
                // { id: 1, parentId: 0, name: "分类", open: true },//一级科目，默认展开
                // { id: 11, parentId: 1, name: "分类2" },
                // { id: 12, parentId: 1, name: "分类31" },
                // { id: 2, parentId: 0, name: "分类4", open: true },//一级科目
                // { id: 2221, parentId: 2, name: "分类5" },//二级科目
                // { id: 232, parentId: 2, name: "分类6" },//二级科目
            ],
            //setting:配置相关
            setting1: {
                //注意：如果使用如上简单Json数据，以下data.simpleData.enable必须设置为true。
                data: {
                    view:{
                        dblClickExpand:false
                    },
                    simpleData: {
                        enable: true,
                        idKey: "id",
                        pIdKey: "parentId",
                    },
                    key: {
                        name: 'name'
                    }
                },
                //callback内定义事件和回调函数，更多事件请参考官方文档。
                callback: {
                    onClick: this.clickEvent,
                }

            },
            treeUrl:contextPath+"/tbasecommoditycategory/list",
            subjectUrl:contextPath+"/tbaseAccountSubject/accountSubjectTree",
            subjectSetting: {
                //注意：如果使用如上简单Json数据，以下data.simpleData.enable必须设置为true。
                data: {
                    simpleData: {
                        enable: true,
                        idKey: "id",
                        pIdKey: "parentId"
                    },
                    key: {
                        name: 'subjectName'
                    }
                },
                callback: {
                    onClick: this.subjectClickEvent,
                }
            },
            setting: {
                data: {
                    simpleData: {
                        enable: true
                    }
                },
            },
            receiveDate: [],
            superiorCategory:[],
            body:{
                code: '',
                name: '',
                customCode:''
            },
            commodityInfo: {
                id: '',
                crategoryId: "",
                name: "",
                code: "",
                codingCodeRules: "",
                status: "1",
                minRatingDifference: "",
                maxRatingDifference: "",
                countGroupId: "",
                countUnitId: "",
                quantityAccuracy: "",
                weightAccuracy: "",
                stocktCodeId: "",
                saleRevenueId: "",
                saleCostCodeId: "",
                costDiffCodeId: "",
                customCode: "",
                isDel: "",
                weightGroupId: "",
                weightUnitId: "",
                organizationId: "",
                remark: "",
                pricingType: ""
            },
            parentCategory:{
                id: '',
                name: '',
                code:'',
                customCode: '',
                sort: '',
                parentId: '',
                organizationId: ''
            },
            unitWeightGroup:[],
            unitWeight:[],
            unitCountGroup:[],
            unitCount:[],

            data_config:{
                url: contextPath+'/tbasecommoditycategotyinfo/list',
                colNames : [ '类型编码', '类型名称', '上级类型', '有效状态', '描述','称差下限值', '称差上限值','分类名称'],
                colModel : [
                    {name : 'code',width : 200, align : "left",
                        formatter:function (value, grid, rows, state) {

                            console.log(rows)
                            $(document).off('click', ".detail" + rows.id).on('click',".detail"+ rows.id,
                                function(){
                                        This.detailClick({value, grid, rows, state})
                                    });
                            let myCode =  `<a class="detail${rows.id}">${value}</a>`;
                               return  myCode;
                        }},
                    {name : 'name',width : 200,align : "left"},
                    {name : 'superiorTypeName',width : 150,align : "left"},
                    {name : 'status',width : 150, align : "left",sortable : false,formatter:function (value) {
                        if(value == 1){
                            return "有效"
                        }
                        return "无效" ;
                    }},
                    {name : 'remark',width : 200,align : "left"},
                    {name : 'minRatingDifference',width : 130,align : "right"},
                    {name : 'maxRatingDifference',width : 130,sortable : false, align : "right"},
                    {name : 'crategoryId',width : 130,sortable : false, align : "left",hidden:true},
                ]
            },
            base_config: {
                colNames: ['操作', '科目代码', '科目名称', '科目类别', '余额方向'],
                colModel: [
                    {
                        name: 'codes', index: 'invdate', width: 50, align : "left",
                        formatter: function (value, grid, rows, state) {
                            $(document).on("click", ".select" + rows.id, function () {
                                This.doSelect(value, grid, rows, state)
                            });
                            let btns = `<a type="primary" class="select${rows.id}">选取</a>`;
                            return btns
                        }
                    },
                    { name: 'subjectCode', index: 'subjectCode', width: 100, align : "left" },
                    { name: 'subjectName', index: 'subjectName', width: 100, align : "left" },
                    { name: 'tBaseSubjectBalanceEntity.subjectCategory', index: 'subjectCategoryName', width: 80, align : "left" },
                    {
                        name: 'balanceDirection',
                        index: 'balanceDirection',
                        width: 80,
                        align : "left",
                        formatter: function (value, grid, rows, state) {
                            if (value == 1) {
                                return '借方';
                            } else if (value == 2) {
                                return '贷方'
                            }
                        }
                    }
                ],
                jsonReader: {
                    root: "data.list",
                    total: "data.totalPage",
                    records: "data.totalCount",
                    cell: "list",
                },
                prmNames: {
                    page: "page",
                    rows: "limit",
                    sort: "sidx",
                    order:"order"
                },
                mtype: "POST",//向后台请求数据的ajax的类型。可选post,get
                contentType: 'application/json',
                datatype: "json",//请求数据返回的类型。可选json,xml,txt
                styleUI: 'Bootstrap',
                rownumbers: true,
                pagination: true,
                multiselectWidth: 50,
                viewrecords: true,
                rowNum: 10,
                rowList: [10, 30, 50],
                pager: "#my_pager_id",
                //url: "./chenxiaotian.json",
                url: contextPath+"/tbaseAccountSubject/list",
                onPaging() {

                },
            }
        }
    },
    methods: {
        keyDown(){},
        hideSearch() {
            this.isSearchHide = !this.isSearchHide;
            $(".chevron").css("top","")
        },
        clickEvent(event,treeId,treeNode){
            console.log(treeId,treeNode);
            this.parentCategory.id = treeNode.id;
            this.body.customCode = treeNode.customCode;
            this.parentCategory.parentId = treeNode.parentId;
            this.parentCategory.customCode = treeNode.customCode;
            // this.parentCategory.code = treeNode.code;
            // this.parentCategory.name = treeNode.name;
            this.parentCategory.sort = treeNode.sort;
            if(treeNode.parentId == 0){
                this.commodityInfo.customCode = '';
            }
            this.treeName = treeNode.name;
            // this.childNodes = this.getChildNodes(treeNode)
            this.childNodes = this.findNodes(treeNode);

            this.reload = !this.reload;

        },


        findNodes(treeNode)
        {
            var count;
            /*判断是不是父节点,是的话找出子节点个数，加一是为了给新增节点*/
            if(treeNode.isParent) {
                count = treeNode.children.length + 1 ;
            } else {
                /*如果不是父节点,说明没有子节点,设置为1*/
                count = 1;
            }
            return count;
        },
        addCancel(){
            this.openAddCommodity = false;
            this.parentCategory.code = '';
            this.parentCategory.name = '';
        },
        addSure(){
            //校验
            let isFormPass,This = this;
            this.$refs['addCommodity'].validate((valid)=>{
                if(valid){
                    isFormPass = true;
                } else {
                    isFormPass = false;
                }
             })
            if(!isFormPass) {
                return;
            }
            if(this.modalType == 'add'){
                parvm.parentCategory.parentId = parvm.parentCategory.id;
                parvm.codeFlag = false;
            }
            let url = this.modalType == 'add'?'/tbasecommoditycategory/save':'/tbasecommoditycategory/update';
            $.ajax({
                type: "POST",
                url: contextPath+url,
                contentType: 'application/json',
                data: JSON.stringify(parvm.parentCategory),
                success: function (data) {
                    console.log(data);
                    if (data.code === "100100") {
                        This.$Modal.success({
                            content: This.modalType == 'add'?'新增成功！':'修改成功！',
                            onOk:() => {
                                This.buttonFlag = true;
                                //待定 刷新
                                location.reload();
                            }
                        });
                    }else{
                        This.$Modal.warning({
                            content:data.msg
                        })
                    }
                }
            })
        },
        showCategory(para){
            this.modalType = para;
            this.titleName = para == 'add'?'新增商品分类':'修改商品分类';
            this.openAddCommodity = true;
        },
        addCategoty() {
            let This = this;
            let ids = this.parentCategory.id

            console.log(ids)
            if (ids == '' || ids == 'undefined') {
                // layer.alert("请先选择一条商品分类!");
                this.$Modal.info({
                    content:"请先选择一条商品分类!"
                })
                return false;
            }
            This.buttonFlag = false
            // this.parentCategory.code = '';
            // this.parentCategory.name = '';
            this.categoryFlag = false;
            this.showCategory('add');
            /*
            let index = layer.open({
                type: 1,
                title: '新增商品分类',
                content: $("#addCategoty"),
                //content: '123',
                btn: ['保存', '取消'],
                area: '400px',
                btn1() {
                    console.log(JSON.stringify(parvm.parentCategory))
                    parvm.parentCategory.parentId = parvm.parentCategory.id
                    parvm.codeFlag = false
                    $.ajax({
                        type: "POST",
                        url: contextPath+"/tbasecommoditycategory/save",
                        contentType: 'application/json',
                        data: JSON.stringify(parvm.parentCategory),
                        success: function (data) {
                            console.log(data)
                            layer.close(index)
                            if (data.code === "100100") {
                                This.$Modal.success({
                                    content: "保存成功!",
                                });
                                This.buttonFlag = true
                                //待定 刷新
                                location.reload()

                            }else{
                                // layer.alert(data.msg);
                                This.$Modal.warning({
                                    content:data.msg
                                })
                            }
                        }
                    })

                },
                btn2: function(index, layero){
                    $("#category_from").validate().resetForm();
                    // parvm.categoryClear()
                    This.buttonFlag = true
                    layer.close(index)
                }
            })
            */
        },
        queryCategory(){
            $.ajax({
                type: 'POST',
                url: contextPath+'/tbasecommoditycategory/infoById',
                data: {id: this.parentCategory.id},
                success:function (result) {
                    console.log(result)
                    parvm.parentCategory.name = result.data.name
                    parvm.parentCategory.code = result.data.code
                }
            })
        },

        modifyCategoty() {
            console.log("进修改了。。。。。。")
            let This = this;
            let ids = this.parentCategory.id
            console.log(this.parentCategory.id)

            parvm.disabledFlag = false
            if (ids == '' || ids == 'undefined') {
                this.$Modal.info({
                    content:'请先选择一条商品分类!'
                })
                return false;
            }
            This.buttonFlag = false;
            this.queryCategory();
            this.categoryFlag = true;
            this.showCategory('modify');
            /*
            let index = layer.open({
                type: 1,
                title: '修改分类',
                content: $("#modifyCategoty"),
                btn: ['保存', '取消'],
                area: '400px',
                btn1() {
                    $.ajax({
                        type: "POST",
                        url: contextPath+"/tbasecommoditycategory/update",
                        contentType: 'application/json',
                        data: JSON.stringify(parvm.parentCategory),
                        success: function (data) {
                            if (data.code === "100100") {
                                console.log(data.msg);
                                This.$Modal.success({
                                    content:"修改成功！"
                                })
                                This.buttonFlag = true
                                layer.close(index)
                                // parvm.categoryClear()
                                //待定 刷新
                                location.reload()
                            }else{
                                This.$Modal.warning({
                                    content:data.msg
                                })
                            }
                        }
                    })

                },
                btn2: function(index, layero){
                    $("#category_from").validate().resetForm();
                    // parvm.categoryClear()
                    This.buttonFlag = true
                    layer.close(index)
                }
            })
            */
        },




        delCategory(){
            let This = this;
            console.log(parvm.parentCategory.id)
            if(!parvm.parentCategory.id){
                this.$Modal.info({
                    content:"请选择商品类别!"
                })
                return
            }
            let id = parvm.parentCategory.id

            this.$Modal.confirm({
                title: '系统提示',
                content: '<p>删除的摘要将不能恢复，请确认是否删除？</p>',
                okText: '确定',
                cancelText: '取消',
                onOk: () => {
                    This.deleteCategoryTmp(id)
                },
            })
        },
        deleteCategoryTmp(id){
            let This = this
            $.ajax({
                type: "POST",
                url: contextPath+"/tbasecommoditycategory/delete",
                data: {id: id},
                success: function (data) {
                    if(data.code == "100100"){
                        // layer.closeAll('dialog');  //加入这个信息点击确定 会关闭这个消息框
                        // layer.alert(data.msg);
                     setTimeout(function(){
                         This.$Modal.success({
                             content:"删除成功！",
                             onOk: () => {
                                location.reload();
                                parvm.parentCategory.id = ''
                            }
                         })
                     },300)
                    }else{
                      setTimeout(function(){
                          This.$Modal.warning({
                              content:data.msg
                          })
                      },300)
                    }
                },
                error: function (err) {
                    console.log("error");
                },

            })
        },
        add_click(){
            let that = this
            that.clear()
            parvm.codeFlag = false
            if(that.parentCategory.id == ''){
                // layer.alert("请先选择一条商品分类!");
                this.$Modal.info({
                    content:'请先选择一条商品分类!'
                })
                return false;
            }
            if(that.childNodes > 1){
                // layer.alert("该商品分类下存在下级分类，禁止添加商品分类明细！");
                this.$Modal.info({
                    content:'该商品分类下存在下级分类，禁止添加商品分类明细!'
                })
                return false;
            }
            console.log(this.isEdit)
            that.clear()
            that.subjectClear()
            that.commodityInfo.crategoryId = that.parentCategory.id
            parvm.disabledFlag = false
            this.isEdit = true;
            this.buttonFlag = true
        },
        copy(){
            console.log("进复制了。。。")
            this.buttonFlag = true
            var rowData = jQuery("#mytable").jqGrid('getRowData',this.selected[0]);
            console.log(rowData)
            parvm.treeName = rowData.superiorTypeName
            parvm.commodityInfo.crategoryId = rowData.crategoryId
            let that = this
            console.log(this.isEdit)
            this.commodityInfo.id = this.selected[0]
            parvm.codeFlag = false
            if(this.selected.length != 1){
                // layer.alert("请先勾选一行商品分类详情!");
                this.$Modal.info({
                    content:'请先勾选一行商品分类详情!'
                })
                return false;
            }

            that.commodityInfo.crategoryId = that.parentCategory.id
            parvm.disabledFlag = false
            that.queryCommodityInfo()
            that.commodityInfo.id = ''
            that.commodityInfo.code = ''
            that.commodityInfo.name = ''
            that.commodityInfo.codingCodeRules = ''
            this.isEdit = true;

        },


        del() {
            console.log("这是删除。。。")
            let This = this
            let orders = This.selected;
            var ids = []
            orders.forEach(item => {
                ids.push(item.id)
            })
            console.log(ids)
            this.$Modal.confirm({
                title: '系统提示',
                content: '<p>删除的摘要将不能恢复，请确认是否删除？</p>',
                okText: '确定',
                cancelText: '取消',
                onOk: () => {
                    This.deleteOrder(ids)
                },
            })
        },

        del_click(){
            let This = this;
            let ids = This.selected
            if (!ht.util.hasValue(ids, "array")) {
                This.$Modal.info({
                    content:'请先选择一条记录!'
                })
                return false;
            }

            this.$Modal.confirm({
                title: '系统提示',
                content: '<p>删除的摘要将不能恢复，请确认是否删除？</p>',
                okText: '确定',
                cancelText: '取消',
                onOk: () => {
                    This.deleteInfoTmp(ids);
                },
            })
        },
        deleteInfoTmp(ids){
            let This = this
            $.ajax({
                type: "POST",
                url: contextPath+"/tbasecommoditycategotyinfo/delete",
                contentType: 'application/json',
                data: JSON.stringify(ids),
                dataType: "json",
                success: function (data) {
                    if(data.code == "100100"){
                        setTimeout(function(){
                            This.$Modal.success({
                                content:data.data
                            })
                            This.reload = !This.reload;
                            This.selected = []
                        },300)
                    }else{
                        // layer.alert(data.msg)
                        This.$Modal.warning({
                            content:data.msg
                        })
                    }

                }
            })
        },

        getUnitWeightByGroupId(){
            let that = this
            $.ajax({
                type: 'POST',
                url: contextPath+'/tbaseunit/list',
                data:{groupId: that.commodityInfo.weightGroupId},
                success:function (result) {
                    console.log(result)
                    that.unitWeight = result.data;
                }
            })
        },
        getUnitCountByGroupId(){
            let that = this
            $.ajax({
                type: 'POST',
                url: contextPath+'/tbaseunit/list',
                data:{groupId: that.commodityInfo.countGroupId},
                success:function (result) {
                    console.log(result)
                    that.unitCount = result.data;
                }
            })
        },
        sure(){
            this.reload = !this.reload;
        },
        categoryClear(){
            this.parentCategory = {
                id: '',
                name: '',
                code:'',
                customCode: '',
                parentId: '',
                organizationId: ''
            }
        },
        clear(){
            this.commodityInfo = {
                id: '',
                crategoryId: "",
                name: "",
                code: "",
                codingCodeRules: "",
                status: "1",
                minRatingDifference: "",
                maxRatingDifference: "",
                countGroupId: "",
                countUnitId: "",
                quantityAccuracy: "",
                weightAccuracy: "",
                stocktCodeId: "",
                saleRevenueId: "",
                saleCostCodeId: "",
                costDiffCodeId: "",
                customCode: "",
                isDel: "",
                weightGroupId: "",
                weightUnitId: "",
                organizationId: "",
                remark: "",
                pricingType: ""
            },
                this.body={
                    code: '',
                    name: '',
                    customCode:parvm.body.customCode
                }
        },
        bodyClear(){
            this.body={
                code: '',
                name: '',
                customCode:parvm.body.customCode
            }
        },
        subjectClear(){
            this.inputorder={
                stocktCode:{
                    id:'',
                        name:''
                },
                saleRevenue:{
                    id:'',
                        name:''
                },
                saleCostCode:{
                    id:'',
                        name:''
                },
                costDiffCode:{
                    id:'',
                        name:''
                },
            }
        },
        modify(){
            let This = this;
            let ids = This.selected
            this.buttonFlag = true
            parvm.disabledFlag = false
            if (this.selected.length>1){
                // layer.msg('修改只能对单条数据进行操作！')
                This.$Modal.info({
                    content:'修改只能对单条数据进行操作！'
                })
                return false
            }
            if (!ht.util.hasValue(ids, "array")) {
                This.$Modal.info({
                    content:"请先选择一条记录!"
                })
                // layer.alert("请先选择一条记录!");
                return false;
            }else{
                parvm.codeFlag = true
                parvm.commodityInfo.id = this.selected[0];
                let $obj = $("#my_from #categoryCode")
                console.log($obj)
                $.ajax({
                    type: 'POST',
                    url: contextPath+'/tbasecommoditycategotyinfo/info',
                    data: {id: parvm.commodityInfo.id},
                    success:function (result) {
                        parvm.commodityInfo = result.data
                        console.log(result)
                        parvm.copySubject(result)
                    }
                })
                parvm.getUnitWeightByGroupId()
                parvm.getUnitCountByGroupId()
                this.isEdit = true;
            }
            //请求详情信息
        },

        copySubject(result){
            parvm.inputorder.stocktCode.id = result.data.stocktCodeId
            parvm.inputorder.saleRevenue.id = result.data.saleRevenueId
            parvm.inputorder.saleCostCode.id = result.data.saleCostCodeId
            parvm.inputorder.costDiffCode.id = result.data.costDiffCodeId

            parvm.inputorder.stocktCode.name = result.data.stocktCodeName
            parvm.inputorder.saleRevenue.name = result.data.saleRevenueName
            parvm.inputorder.saleCostCode.name = result.data.saleCostCodeName
            parvm.inputorder.costDiffCode.name = result.data.costDiffCodeName
        },

        doSelect(value, grid, rows, state) {
            console.log(rows)
            this.inputorder[this.tmp].name = rows.subjectName;
            this.inputorder[this.tmp].id = rows.id;
            this.showModal = false
            console.log(this.inputorder);
        },
        init() {
            let This = this;
            jQuery("#my_table_id").jqGrid(This.base_config);
        },
        subClear() {
            this.subjectSearchBody = {
                id: '',
                fullSubjectCode:'',
                treeHeight: '',
                subjectName: '',
                balanceDirection: ''
            }
        },
        search() {
            let jqGrid = $("#my_table_id");
            let config = {
                postData: this.subjectSearchBody
            };
            jqGrid.jqGrid('clearGridData');
            jqGrid.jqGrid('setGridParam', config).trigger("reloadGrid");
        },
        cancel() {
            this.buttonFlag = true
            this.subjectSearchBody = {
                id: '',
                fullSubjectCode:'',
                treeHeight: '',
                subjectName: '',
                balanceDirection: ''
            }
        },
        exit() {
            window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
        },
        test(order){
            this.tmp = order ;
            this.showModal = true;
        },
        subjectClickEvent(event,treeId,treeNode){

            console.log(treeNode)
            this.subjectSearchBody.fullSubjectCode = treeNode.fullSubjectCode
            this.subjectSearchBody.treeHeight = treeNode.treeHeight
            this.search()
        },

        view(){
            let This = this;
            let ids = This.selected
            if (!ht.util.hasValue(ids, "array")) {
                // layer.alert("请先选择一条记录!");
                This.$Modal.info({
                    content:"请先选择一条记录!"
                })
                return false;
            }else{
                this.commodityInfo.id = this.selected[0];
                this.isEdit = true;
            }
            parvm.codeFlag = true
            $.ajax({
                type: 'POST',
                url: contextPath+'/tbasecommoditycategotyinfo/info',
                data: {id: parvm.commodityInfo.id},
                success:function (result) {
                    parvm.commodityInfo = result.data
                    console.log(result)
                }
            })
            parvm.getUnitWeightByGroupId()
            parvm.getUnitCountByGroupId()
        },
        queryCommodityInfo(){
            $.ajax({
                type: 'POST',
                url: contextPath+'/tbasecommoditycategotyinfo/info',
                data: {id: parvm.commodityInfo.id},
                success:function (result) {
                    parvm.commodityInfo = result.data
                    parvm.commodityInfo.id = ''
                    parvm.commodityInfo.code = ''
                    parvm.commodityInfo.name = ''
                    parvm.commodityInfo.codingCodeRules = ''
                    console.log(result)
                    parvm.copySubject(result)
                }
            })
            parvm.getUnitWeightByGroupId()
            parvm.getUnitCountByGroupId()
        },
        save(){
            let This = this;
            This.commodityInfo.stocktCodeId = This.inputorder.stocktCode.id
            This.commodityInfo.saleCostCodeId = This.inputorder.saleCostCode.id
            This.commodityInfo.saleRevenueId = This.inputorder.saleRevenue.id
            This.commodityInfo.costDiffCodeId = This.inputorder.costDiffCode.id
            if ($('#my_from').valid()) {

                if (This.commodityInfo.id == '') {
                    This.commodityInfo.customCode = This.parentCategory.customCode
                    if (This.commodityInfo.pricingType == '' || This.commodityInfo.pricingType == 'undefined') {
                        // layer.alert("请勾选计价类型!");
                        This.$Modal.info({
                            content:"请勾选计价类型!"
                        })
                        return false;
                    }
                    This.buttonFlag = false

                    $.ajax({
                        type: "POST",
                        url: contextPath+"/tbasecommoditycategotyinfo/save",
                        contentType: 'application/json',
                        data: JSON.stringify(This.commodityInfo),
                        success: function (data) {
                            if (data.code === "100100") {
                                This.$Modal.success({
                                    content: "保存成功!",
                                });
                                parvm.clear()

                                This.isEdit = false
                                This.reload = !This.reload
                                parvm.subjectClear()

                            } else {
                                This.$Modal.warning({
                                    content: "系统出现异常,请联系管理人员!"
                                });
                            }

                        }
                    });

                } else {
                    $.ajax({
                        type: 'POST',
                        url: contextPath+'/tbasecommoditycategotyinfo/update',
                        contentType: 'application/json',
                        data: JSON.stringify(parvm.commodityInfo),
                        success: function (result) {
                            console.log(result)
                            if (result.code === "100100") {
                                This.$Modal.success({
                                    content: "更新成功!",
                                });
                                This.buttonFlag = true
                                This.isEdit = false
                                parvm.clear()
                                parvm.subjectClear()
                                This.reload = !This.reload

                            } else {
                                This.$Modal.warning({
                                    content: "系统出现异常,请联系管理人员!"
                                });

                            }
                        }
                    })
                }
                This.buttonFlag = true
            }
        },
        queryWeightUnitById(){
            $.ajax({
                type: 'POST',
                url: contextPath+'/tbaseunit/infoUnitById',
                data: {id: parvm.commodityInfo.weightUnitId},
                success:function (result) {
                    console.log(result)
                    parvm.commodityInfo.weightUnitId = result.data.name
                }
            })
        },
        queryCountUnitById(){
            $.ajax({
                type: 'POST',
                url: contextPath+'/tbaseunit/infoUnitById',
                data: {id: parvm.commodityInfo.countUnitId},
                success:function (result) {
                    console.log(result)
                    parvm.commodityInfo.countUnitId = result.data.name
                }
            })
        },
        initFormValidate(){
            var validateOptions = {
                rules: {
                    categoryCode: {
                        required: true,
                        remote:{
                            url: contextPath+"/tbasecommoditycategory/info",  //后台处理程序
                            type: "post",  //数据发送方式
                            dataType: "json",  //接受数据格式
                            data: {  //要传递的数据
                                code: function () {
                                    return parvm.parentCategory.code;
                                }
                            },
                            dataFilter: function (data, type) {//判断控制器返回的内容
                                var res = JSON.parse(data);
                                if (res.code === "100100") {
                                    return true;
                                }
                                else {
                                    // layer.alert(res.msg);//没有弹出对话框
                                    return false;
                                }
                            }
                        }
                    },
                    categoryName: {
                        required: true,
                        remote:{
                            url: contextPath+"/tbasecommoditycategory/info",  //后台处理程序
                                type: "post",  //数据发送方式
                                dataType: "json",  //接受数据格式
                                data: {  //要传递的数据
                                name: function () {
                                    return parvm.parentCategory.name;
                                }
                            },
                            dataFilter: function (data, type) {//判断控制器返回的内容
                                var res = JSON.parse(data);
                                if (res.code === "100100") {
                                    return true;
                                }
                                else {
                                    // layer.alert(res.msg);//没有弹出对话框
                                    return false;
                                }
                            }
                        }
                    },
                    infoCode:{
                        required: true,
                        remote:{
                            url: contextPath+"/tbasecommoditycategotyinfo/infoByCodeAndNameAndRule",  //后台处理程序
                            type: "post",  //数据发送方式
                            dataType: "json",  //接受数据格式
                            data: {  //要传递的数据
                                code: function () {
                                    return parvm.commodityInfo.code;
                                },
                                id: function () {
                                    // return parvm.commodityInfo.id;
                                    if(parvm.commodityInfo.id == 'undefined'){
                                        parvm.commodityInfo.id == ''
                                    }
                                    return parvm.commodityInfo.id;
                                }
                            },
                            dataFilter: function (data, type) {//判断控制器返回的内容
                                var res = JSON.parse(data);
                                if (res.code === "100100") {
                                    return true;
                                }
                                else {
                                    // layer.alert(res.msg);//没有弹出对话框
                                    return false;
                                }
                            }
                        }
                    },
                    infoName: {
                        required: true,
                        remote:{
                            url: contextPath+"/tbasecommoditycategotyinfo/infoByCodeAndNameAndRule",  //后台处理程序
                            type: "post",  //数据发送方式
                            dataType: "json",  //接受数据格式
                            data: {  //要传递的数据
                                name: function () {
                                    return parvm.commodityInfo.name;
                                },
                                id: function () {
                                    // return parvm.commodityInfo.id;
                                    console.log(parvm.commodityInfo.id)
                                    if(parvm.commodityInfo.id == 'undefined'){
                                        parvm.commodityInfo.id == ''
                                    }
                                    return parvm.commodityInfo.id;
                                }
                            },
                            dataFilter: function (data, type) {//判断控制器返回的内容
                                var res = JSON.parse(data);
                                if (res.code === "100100") {
                                    return true;
                                }
                                else {
                                    // layer.alert(res.msg);//没有弹出对话框
                                    return false;
                                }
                            }
                        }
                    },
                    infoCodingCodeRules: {
                        required: true,
                        // TEST: true,
                        validCode:true,

                        remote:{
                            url: contextPath+"/tbasecommoditycategotyinfo/infoByCodeAndNameAndRule",  //后台处理程序
                            type: "post",  //数据发送方式
                            dataType: "json",  //接受数据格式
                            data: {  //要传递的数据
                                codingCodeRules: function () {
                                    return parvm.commodityInfo.codingCodeRules;
                                },
                                parentId: function () {
                                    return parvm.parentCategory.id
                                },
                                id: function () {
                                    // return parvm.commodityInfo.id;
                                    if(parvm.commodityInfo.id == 'undefined'){
                                        parvm.commodityInfo.id == ''
                                    }
                                    return parvm.commodityInfo.id;
                                }
                            },
                            dataFilter: function (data, type) {//判断控制器返回的内容
                                var res = JSON.parse(data);
                                if (res.code === "100100") {
                                    return true;
                                }
                                else {
                                    // layer.alert(res.msg);//没有弹出对话框
                                    return false;
                                }
                            }
                        }
                    }, minRatingDifferenceName: {
                        required: false,
                        // TEST: true,
                        validMinRatingName:true,

                    }, maxRatingDifferenceName: {
                        required: false,
                        // TEST: true,
                        validMaxRatingName:true,

                    },
                    infoStocktCode: {
                        required: true,
                    },
                    infoSaleRevenue: {
                        required: true,
                    },
                    infoCaleCostCode:{
                        required: true,
                    },
                    infoCostDiffCode:{
                        required: true,
                    },

                },
                messages: {
                    categoryCode: {
                        required: "请填写编码!",
                        remote:"商品分类编码已存在!"
                    },
                    categoryName: {
                        required: "请填写名称!",
                        remote:"商品分类名称已存在!"
                    },
                    infoCode:{
                        required: "请填写编码!",
                        remote:"商品分类详情编码已存在!"
                    },
                    infoName: {
                        required: "请填写名称!",
                        remote:"商品分类详情名称已存在!"
                    },
                    infoCodingCodeRules: {
                        required: "请填写编码取码规则!",
                        remote:"商品分类详情编码已存在!"
                    },
                    infoStocktCode: {
                        required: "请填写存货科目代码!",
                    },
                    infoSaleRevenue: {
                        required: "请填写销售收入科目代码!",
                    },
                    infoCaleCostCode:{
                        required: "请填写销售成本科目代码!",
                    },
                    infoCostDiffCode:{
                        required: "请填写销售成本科目代码!",
                    },
                }
            };
            $("#category_from").validate(validateOptions);
            $("#my_from").validate(validateOptions);

        },
        cancel(){
            this.selected = []
            this.isEdit = false;
            parvm.categoryClear()
            parvm.clear()
            parvm.bodyClear()
            $("form").validate().resetForm();
            this.reload = !this.reload
        },
        closeCancel(){},

        getUser(){
            $.ajax({
                type: 'POST',
                url: contextPath+'/tbaseunit/findUser',
                success: function (result) {
                    console.log(result)
                    // parvm.unitInfo.createName = result.data.username
                    // parvm.unitInfo.createId = result.data.createId
                    parvm.commodityInfo.organizationId = result.data.organization.id
                    // parvm.organizationInfo.id = result.data.organization.id
                }
            })
        },
        detailClick(rows){
            console.log("金电极时间了。。。")
            let code = rows.value
            console.log(rows)
            parvm.codeFlag = true
            this.buttonFlag = false
            $.ajax({
                type: 'POST',
                url: contextPath+'/tbasecommoditycategotyinfo/info',
                data: {code: code},
                success:function (result) {
                    console.log(result)
                    parvm.commodityInfo = result.data
                    parvm.inputorder.stocktCode.name = result.data.stocktCodeName
                    parvm.inputorder.saleRevenue.name = result.data.saleRevenueName
                    parvm.inputorder.saleCostCode.name = result.data.saleCostCodeName
                    parvm.inputorder.costDiffCode.name = result.data.costDiffCodeName
                }

            })
            parvm.getUnitWeightByGroupId()
            parvm.getUnitCountByGroupId()
            // let { rows } = data;
            parvm.disabledFlag = true
            this.isEdit = true;
            // this.commodityInfo = rows;

        },
    },
    created(){
        //this.getUser()
    },
    watch:{
        'isEdit':function(value){
            if(value == true){
                $.ajax({
                    type: 'POST',
                    url: contextPath+'/tbaseunitgroup/list',
                    success:function (result) {
                        parvm.unitWeightGroup=result.data
                        parvm.unitCountGroup = result.data
                        console.log(result)
                    }
                })
            }

        }
    },
    mounted(){
        this.initFormValidate();

        this.init()
        jQuery.validator.addMethod("validCode", function (value, element) {
            // var chrnum = /[a-zA-Z0-9]^.$/;
            var chrnum = /^([a-zA-Z0-9]{1})$/;
            return chrnum.test(value);
        }, "只能输入一位数字和字母(字符A-Z, a-z, 0-9)")
 jQuery.validator.addMethod("validMinRatingName", function (value, element) {
            var chrnum =  /^((\-)\d+(\.\d+)? |0)$/;
            console.log(value);
            if( value > 0 || isNaN(value)){
                return false;
            }else{
                return true;
            }
            // return chrnum.test(value);
        }, "称差下限值只能输入负数或者0！") ,
     jQuery.validator.addMethod("validMaxRatingName", function (value, element) {
            var chrnum =  /^[1-9]\d*$/;
            console.log(value);
            if( value < 0 || isNaN(value)){
                return false;
            }else{
                return true;
            }
            // return chrnum.test(value);
        }, "称差上限值只能输入正数或者0！")

        this.openTime=window.parent.params.openTime;
    }
})