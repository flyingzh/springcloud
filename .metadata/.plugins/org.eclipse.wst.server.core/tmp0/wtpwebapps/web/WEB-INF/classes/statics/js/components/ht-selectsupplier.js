Vue.component('ht-selectsupplier', {
    props: {
        config: {
            type: Object,
            require: false,
            default() {
                return false;
            }
        },
        showModal: {
            default() {
                return false;
            }
        },
        disabled: {
            require: false,
            default() {
                return false;
            }
        },
        title: {
            require: false,
            default() {
                return '供应商';
            }
        },
        isCheck:{
            required:false,
            default(){
                return 'supplier'
            }
        },
        ktcStatus:{// 进销存是1，基础资料是0
            require: false,
            type: Number,
            default(){
                return 1;
            }
        },
    },
    data() {
        let This = this;
        return {
            ruleValidate:{
                supplier:[
                    {required:true}
                ]
            },
            addBody:{
                supplier: '',
            },
            timer: null, //处理搜索节流
            testKctStatus: '',
            supplierList: [],
            myTitle: "",
            isFirstTime: true,
            isInit: true,//是否是初始化
            defaultSupplierList: [],
            mainProduct: [],
            isLoading: false,
            responseRaw: {},
            supplierLevel: [],
            result:'',
            isModal: false,//是否是通过弹窗的方式选取值的
            //供应商类别
            suppType: [
                {
                    name: '战略型',
                    code: '1'
                },
                {
                    name: '重点型',
                    value: '2'
                },
                {
                    name: '常规型',
                    code: '3'
                },
                {
                    name: '一般型',
                    code: '4'
                }
            ],
            selected: [],
            body: {
                supplierType: '',
                supplierLevel: '',
                mainProd: '',
                siShortName: ""
            },
            base_config: {
                ajaxGridOptions:{
                    complete(js , textStatus){
                        //判断数据类型
                        if(typeof js.responseText === "string"){
                            This.responseRaw = JSON.parse(js.responseText);
                        }else{
                            This.responseRaw = js.responseText;
                        }

                    }
                },
                colNames: ['操作', 'id', '供应商编码', '名称', '主营商品'],
                colModel: [
                    {
                        name: 'operation',
                        index: 'invdate',
                        width: 200,
                        align: "center",
                        formatter: function (value, grid, rows, state) {
                            $(document).off("click", ".select" + rows.id).on("click", ".select" + rows.id, function () {
                                // console.log(value, grid, rows, state);
                                This.doSelect(value, grid, rows, state)
                            });
                            let btns = `<a type="primary" class="select${rows.id}">选取</a>`;
                            return btns;
                        }
                    },
                    {name: 'id', index: 'id', width: 0, align: "left", hidden: true},
                    {name: 'supplierCode', index: 'supplierCode, invdate', width: 200, align: "left", sort: false},
                    {name: 'supplierName', index: 'supplierName', width: 200, sort: false, align: "left"},
                    {name: 'mainProd', index: 'mainProd', width: 250, align: "left"}
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
                pager: "#my_pager_id_supply",
                url: contextPath + "/tbasecommodity/findBySupplier" + (This.ktcStatus? '?ktcStatus=1' : '?ktcStatus=0'),
                onPaging() {

                },
                ondblClickRow(rowid,iRow,iCol,e){
                    if(This.responseRaw && This.responseRaw.code == '100100'){
                        This.doSelect(null, null, This.responseRaw.data.list[iRow -1], null);
                    }

                }
            }
        }
    },
    methods: {
        //选取按钮
        doSelect(value, grid, rows, state) {
            this.$emit('getinfo', rows.id, rows.supplierCode, rows.supplierName);
            this.$emit('sure');
            this.$emit('on-change');
            this.showModal = false;
            this.addBody.supplier = rows.supplierName;
            this.submit();
            this.isModal = true;
            this.$nextTick(()=>{
                this.handleReset();
            })

        },
        noInitValue() {
            let This = this;
            jQuery("#my_table_id_supply").jqGrid(This.base_config);
        },
        haveInitValue(name, id){
            let That = this;
            let obj = {
                limit: 30,
                page: 1,
                supplierType: '',
                supplierLevel: '',
                mainProd: '',
                siShortName: name
            };
            $.ajax({
                type: "post",
                url: contextPath + '/tbasecommodity/findBySupplier' + That.testKctStatus,
                data: obj,
                dataType: "json",
                success: function (r) {
                    That.supplierList = r.data.list;
                    That.addBody.supplier = name;
                },
                error: function () {
                    That.isModal === false;
                    That.isLoading = false;
                }
            })
        },
        clear() {
            this.body = {
                supplierType: '',
                supplierLevel: '',
                mainProd: '',
                siShortName: ''
            };
            this.addBody.supplier = '';
            this.$refs.type.reset();
            this.$refs.main.reset();
            this.$refs.level.reset();
            this.$refs.supplier.reset();
            this.handleReset();
        },
        search() {
            let jqGrid = $("#my_table_id_supply");
            let config = {
                postData: this.body
            };
            jqGrid.jqGrid('clearGridData');
            jqGrid.jqGrid('setGridParam', config).trigger("reloadGrid");
        },
        closeModal() {
            this.clear();
            this.$emit('cancel');
            this.showModal = false;
        },
        emitValue(e){
            if(!e){
                return ;
            }
            let selected = this.supplierList.filter(item =>{
                return item.supplierName === e;
            });

            this.$emit('getinfo', selected[0].id, selected[0].supplierCode, selected[0].supplierName);
            this.$emit('sure');
            this.$emit('on-change');
        },
        validateData(){
            this.$refs['formValidate'].validate((valid) => {
                if (valid) {
                    // 已选
                    this.result = true;
                } else {
                    // 未选
                    this.result = false;
                }
            })
        },
        handleReset () {
            this.$refs['formValidate'].resetFields();
        },
        submit(){
            this.validateData();
            return this.result;
        
        },
        //加载供应商基本信息
        loadSupplier() {
            let This = this;
            $.ajax({
                type: 'post',
                url: contextPath + '/tbasecommodity/data',
                dataType: 'json',
                contentType: 'application/json',
                success: function (res) {
                    This.mainProduct = res.data.mainProduct;
                    This.supplierLevel = res.data.supplierLevel;
                },
                error: function (code) {

                }
            });
        },
        //过滤搜索供应商
        loadSupplierList(value) {
            if(value === ""){
                this.$emit('getinfo', '', '', '');
                this.addBody.supplier = '';
            }
            let That = this;
            let obj = {
                limit: 30,
                page: 1,
                supplierType: '',
                supplierLevel: '',
                mainProd: '',
                siShortName: value
            };
            this.isLoading = true;
            $.ajax({
                type: "post",
                url: contextPath + '/tbasecommodity/findBySupplier' + That.testKctStatus,
                data: obj,
                dataType: "json",
                success: function (r) {
                    That.isLoading = false;
                    That.supplierList = r.data.list;
                    if (That.isFirstTime) {
                        That.defaultSupplierList = r.data.list;
                    }
                    if (That.isModal === true) {
                        That.$nextTick(() => {
                            That.addBody.supplier = value;
                            That.isModal = false;
                        })
                    }
                },
                error: function () {
                    That.isModal === false;
                    That.isLoading = false;
                }
            })
        },
        handlerShow() {
            if(this.disabled){
                return;
            }
            this.showModal = true;
        }
    },
    watch:{
    },
    created() {
        this.myTitle = "请选择" + (this.title? this.title : "供应商");
        this.testKctStatus = this.ktcStatus? '?ktcStatus=1' : '?ktcStatus=0';
        console.log(this.testKctStatus, 99999)
        this.loadSupplier();
        this.loadSupplierList('');
    },
    mounted() {
        this.noInitValue();
    },
    template: `
    <div class="ht-supplier" style="display: inline-block">
        <i-form ref="formValidate" :model="addBody" :rules="ruleValidate" class="ht-hidden-label" label-width="2">
            <form-item label="厂家" :prop="isCheck">
                <Icon type="ios-search" @click="handlerShow"></Icon>
                <i-select 
                    v-model="addBody.supplier" 
                    ref="supplier"  
                    class="ht-width-md" 
                    icon="search" 
                    :remote="true"
                    :filterable="true"
                    :loading="isLoading"
                    loading-text="加载中"
                    :remote-method="loadSupplierList"
                    @on-change="emitValue"
                    :disabled="disabled"
                    transfer
                    >
                    <i-option v-for="(item, index) in supplierList" :value="item.supplierName" :key="item.id">{{item.supplierName}}</i-option>
                </i-select>
            </form-item>
        </i-form>
        <modal @on-ok="doSelect" @on-cancel="closeModal" v-model="showModal" :title="myTitle" width="900" >
            <div>
                <i-form label-width="100">
                    <row>
                        <i-col span="12">
                            <form-item label="供应商类别">
                                <i-select v-model="body.supplierType" ref="type"  class="ht-width-md">
                                    <i-option v-for="item in suppType" :value="item.code" :key="item.code">{{item
                                        .name}}
                                    </i-option>
                                </i-select>
                            </form-item>
                            <form-item label="主营商品">
                                <i-select v-model="body.mainProd" ref="main"  class="ht-width-md">
                                    <i-option v-for="item in mainProduct" :value="item.id" :key="item.id">{{item.name}}</i-option>
                                </i-select>
                            </form-item>
                        </i-col>
                        <i-col span="12">
                            <form-item label="供应商等级">
                                <i-select v-model="body.supplierLevel" ref="level" class="ht-width-md">
                                    <i-option v-for="item in supplierLevel" :value="item.id" :key="item.id">{{item.name}}</i-option>
                                </i-select>
                            </form-item>
                            <form-item label="供应商简称">
                                <i-input v-model="body.siShortName"  class="ht-width-md"></i-input>
                            </form-item>
                            <form-item label="">
                                <i-button type="primary" @click="search">查询</i-button>
                                <i-button type="primary" style="margin-left: 20px" @click="clear">清空</i-button>
                            </form-item>
                        </i-col>
                    </row>
                </i-form>   
                <div class="jqGrid_wrapper">
                    <table id="my_table_id_supply"></table>
                    <div id="my_pager_id_supply"></div>
                </div>
            </div>
            <div slot="footer"></div>
        </modal>
    </div>
    `

});
