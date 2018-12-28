var vm = new Vue({
    el: "#app",
    data: {
        isShow: false,
        isEdit: false,
        reload: false,
        isSearchHide: true,
        isTabulationHide: true,
        isHide: true,
        categoryType:[],
        goodsTypePath:'',
        goodsValue:'',
        selected:'',
        openTime:'',
        selectType: [

            {
                value: "W_REQUISITION_04",
                label: "受托加工送料"
            },
            {
                value: "W_REQUISITION_05",
                label: "受托加工退料"
            }
        ],
        body: {
            documentNo: '',
            goodsNo:'',
            goodsTypePath: '',
            businessType:'',
        },
        data_config: {
            url: contextPath + "/entrustOut/queryRequisitionList",
            datatype: "json",
            colNames: ['id','goodsTypePath', 'custId','supplierId','源单类型', '源单编号', "日期", '业务类型', '商品类型', '图片', '商品编码','商品名称','计数单位','数量','计重单位','重量'],
            colModel: [
                {name: "id", width: 210, align: "left", hidden: true},
                {name: "goodsTypePath", width: 210, align: "left", hidden: true},
                {name: "custId", width: 210, align: "left", hidden: true},
                {name: "supplierId", width: 210, align: "left", hidden: true},
                {name: "sourceType", width: 210, align: "left",
                    formatter: function (value, grid, rows, state) {
                        return "调拨单";
                    }
                },
                {name: "documentNo", width: 210, align: "left",
                    formatter: function (value, grid, rows, state) {
                        $(document).off('click',".detail"+ value).on('click',".detail"+ value,function(){
                            vm.detailClick({value, grid, rows, state})
                        });
                        let myCode =  `<a class="detail${value}">${value}</a>`;
                        return  myCode;
                    },
                    unformat: function (value, grid, rows) {
                        return value.replace(/(<\/?a.*?>)/g, '');
                    }},
                {name: "transferTime", width: 210, align: "left",
                    formatter: function (value, grid, rows, state) {
                        return  new Date(value).format("yyyy-MM-dd");
                    }
                },
                {name: "businessType", width: 210, align: "left",
                    formatter: function (value, grid, rows, state) {
                        if (value === "W_REQUISITION_04"){
                            return "受托加工送料";
                        }
                        if (value === "W_REQUISITION_05"){
                            return "受托加工退料";
                        }
                        return '';
                    }},
                {name: "goodsTypeName", align: "left", width: 210},
                {name: "pictureUrl", index: "pictureUrl", width: 80, align: "center",fixed: "true",
                    formatter: function (ellvalue, options, rowObject) {
                        let random = guid();
                        $(document).on('mouseout', '.can', function () {
                            vm.hideMirror(rowObject.id)
                        });
                        $(document).on('mouseenter', '.select' + rowObject.id, function () {
                            vm.showMirror(rowObject.id)
                        })
                        let url = rowObject.pictureUrl;
                        // let url = 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=774882013,660132957&fm=27&gp=0.jpg';
                        if (url) {
                            return `<div class="select${rowObject.id} can">
                                    <img height="50px" width="50px" src="${url}"/>
                                    <div class="mirror"><img class="bigimg" src="${url}"></div>
                                </div>`;
                        } else {
                            return '<div class="select${rowObject.id}"></div>';
                        }
                    }
                },
                {name: "goodsNo", align: "left", width: 210},
                {name: "goodsName", align: "left", width: 210},
                {name: "countingUnit", align: "left", width: 210},
                {name: "baileeNum", align: "right", width: 210},
                {name: "weightUnit", align: "left", width: 210},
                {name: "totalWeight", align: "right", width: 210},
            ],
            rowNum: 10,//一页显示多少条
            rowList: [10, 20, 30],//可供用户选择一页显示多少条
            mtype: "post",//向后台请求数据的ajax的类型。可选post,get
            viewrecords: true
        }
    },
    methods: {

        //刷新
        refresh(){
            this.clear();
            this.reload = !this.reload;
        },
        //搜索
        search(){
            this.reload=!this.reload;
        },
        clear() {
            this.body = {
                documentNo: '',
                goodsNo:'',
                goodsTypePath: '',
                businessType:'',
            }
            this.$nextTick(function(){
                this.body.businessType = '';
                this.body.goodsTypePath = '';
                this.goodsValue = '';
            });
        },

        handleClearType(value){
            this.$refs[value].reset();
            this.$nextTick(() => {
                if(value === 'dType'){
                    this.body.businessType = '';
                }
            });
        },
        //获取商品类型
        loadProductType(){
            let This = this;
            $.ajax({
                type: "post",
                url: contextPath+'/entrustOut/queryStyleCategory?parentId=0',
                contentType: 'application/json',
                dataType: "json",
                success: function (data) {
                    console.log(data)
                    This.categoryType = This.initGoodCategory(data.data.cateLists)
                },
                error: function () {
                    This.$Modal.warning({content:"服务器出错啦",title:"提示信息"})
                }
            })
        },
        //监听商品类型内容改变,根据商品分类id
        changeproductTypeName(selectedData,arr){
            if (selectedData.length <= 0){
                this.body.goodsTypePath = '';
            }else {
                //获取商品分类名称
                this.body.goodsTypePath = arr[arr.length-1]['value'];
            }
        },
        initGoodCategory(type) {
            let result = [];
            type.forEach((item) => {
                let {
                    customCode: value,
                    name: label,
                    cateLists: children
                } = item

                if (children) {
                    children = this.initGoodCategory(children)
                }
                result.push({
                    value,
                    label,
                    children
                })
            })
            result.forEach((item) => {
                if (!item.children) {
                    delete item.children;
                }
            })
            return result
        },
        add(){
            console.log(this.selected,33431)
            if(this.selected.length < 1){
                this.$Modal.info({
                    title:'提示信息',
                    content:'请至少选择一条数据！'
                });
                return;
            }
            let documentNoArr = []

            let businessType = this.selected[0].businessType;
            let goodsTypePath = this.selected[0].goodsTypePath;
            let custId = this.selected[0].custId;
            let supplierId = this.selected[0].supplierId;
            for (var i = 0; i < this.selected.length; i++) {
                if (this.selected[i].businessType !== businessType) {
                    // layer.alert("")
                    This.$Modal.info({content:"业务类型不相同，不能合并",title:"提示信息"})
                    console.log(this.selected[i].businessType)
                    return;
                }
                if (this.selected[i].goodsTypePath !== goodsTypePath) {
                    This.$Modal.info({content:"商品类型不相同，不能合并",title:"提示信息"})
                    console.log(this.selected[i].goodsTypePath,goodsTypePath)
                    return;
                }
                if (this.selected[i].custId && custId && this.selected[i].custId !== custId) {
                    This.$Modal.info({content:"客户不相同，不能合并",title:"提示信息"})
                    console.log(this.selected[i].custId,custId)
                    return;
                }
                if (this.selected[i].supplierId && supplierId && this.selected[i].supplierId !== supplierId) {
                    This.$Modal.info({content:"供应商不相同，不能合并",title:"提示信息"})
                    console.log(this.selected[i].supplierId, supplierId)
                    return;
                }
                documentNoArr.push({documentNo:this.selected[i].documentNo,id:this.selected[i].id})
            }
            window.parent.activeEvent({
                name: "受托加工材料出库-新增",
                url: contextPath+'/warehouse/entrust-material-out/entrust-material-out-info.html',
                params: {activeType: "sourceAdd",documentNoArr:documentNoArr}
            });
        },

        // 点击退出(退出页面)
        exit(){
            window.parent.closeCurrentTab({openTime:this.openTime,exit: true,});
        },

        showMirror(name) {
            $(`.select${name} .mirror`).show()
        },
        hideMirror(name) {
            $(`.select${name} .mirror`).hide()
        },

        //点击源单编号查看详情
        detailClick(value){
            //携带documentNo跳转至新增页
            window.parent.activeEvent({
                name: "调拨单-查看",
                url: contextPath+'/warehouse/requisition/requisition-info.html',
                params: {activeType: "listQuery",id:value.rows.documentNo}
            });
        },

    },

    mounted() {
        this.loadProductType();
        this.openTime = window.parent.params.openTime;
    }
})