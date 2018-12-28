Vue.component('ht-select', {
    props: {
        goodsGroupPath: {
            type: String,
            default() {
                return '';
            }
        },
        mainType: {
            type: String,
            default() {
                return '';
            }
        },
        initModel: {
            type: String
        },
        isDisabled: {
            type: Boolean
        },
        codesUsed: {
            type: Object,
            'default': {}
        },
        url: {// 弹窗的url
            default() {
                return '/tbasecommodity/findByNewType';
            }
        },
        selectUrl:{//下拉的url
            require: false,
            type: String,
            default(){
                return '/tbasecommodity/findByType';
            }
        },
        ktcStatus:{// 进销存是1，基础资料是0
            require: false,
            type: Number,
            default(){
                return 1;
            }
        },
        itemUrl: { //获取选中的那条数据
            type: String,
            default(){
                return '/tbasecommodity/getBriefById/'
            }
        }
    },
    data() {
        let This = this;
        return {
            optionData: [],
            responseRaw: {},
            showModal: false,
            productType: [],
            styleCodeModel: [],
            select: {
                code: '',
                name: '',
                styleCode: '',
                field: '',
                categoryCustomCode: this.goodsGroupPath,
                mainType: this.mainType
            },
            isShow: false,
            code: '',
            base_commodity_config: {
                ajaxGridOptions: {
                    complete(js, textStatus) {
                        //判断数据类型
                        if (typeof js.responseText === "string") {
                            This.responseRaw = JSON.parse(js.responseText);
                        } else {
                            This.responseRaw = js.responseText;
                        }

                    }
                },
                colNames: ['操作', '商品名称', '商品编码', '款式类别'],
                colModel: [
                    {
                        name: 'id',
                        index: 'invdate',
                        width: 100,
                        align: "center",
                        formatter: function (value, grid, rows, state) {
                            $(document).off("click", ".selectCustomer" + rows.id).on("click", ".selectCustomer" + rows.id, function () {
                                This.doSelect(value, grid, rows, state)
                            });
                            let btns = `<a type="primary" class="selectCustomer${rows.id}">选取</a>`;
                            return btns
                        }
                    },
                    { name: 'name', width: 200, align: "center", sort: false, },
                    {
                        name: 'code', width: 140, align: "center", sort: false,
                    },
                    { name: 'styleName', width: 220, align: "center", sort: false, }
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
                pager: "#commodity_pager_id",
                onPaging() {

                },
                ondblClickRow(rowid, iRow, iCol, e) {
                    if (This.responseRaw && This.responseRaw.code == '100100') {
                        This.doSelect(null, null, This.responseRaw.data.list[iRow - 1], null);
                    }

                }
            },
            tableId: 't_' + guid(),
            pagerId: 'p_' + guid(),
        }
    },
    created() {
        this.base_commodity_config = Object.assign({}, this.base_commodity_config, { pager: ('#' + this.pagerId) })
    },
    methods: {
        doSelect(value, grid, rows, state) {//弹窗选个一条
            if (rows && rows.code) {
                this.chooseOne(rows);
                this.$emit('input', rows.code);
                this.$emit('on-change');
            }
            this.showModal = false;
        },
        chooseOne(item) {//下拉选择一条
            this.code = item.code;
            this.$emit('input', item.code);
            this.isShow = false;
            this.showModal = false;
            this.getSelectedItem(item);
        },
        change() {
            this.isShow = true;
            this.getInputValue();
        },
        inInput() {
            this.isShow = true;
        },
        leave() {
            setTimeout(() => {
                this.isShow = false;
            }, 300)
        },
        init() {
            let This = this;
            This.base_commodity_config.postData = this.select;
            jQuery(("#" + This.tableId)).jqGrid(This.base_commodity_config);
        },
        getInputValue() {//获取商品编码输入框输入的值
            let This = this;
            let params = {
                categoryCustomCode: this.goodsGroupPath,
                mainType: this.mainType,
                field: this.code || '',
                limit: ''
            };
            $.ajax({
                type: "post",
                url: contextPath + This.selectUrl + (This.ktcStatus? '?ktcStatus=1' : '?ktcStatus=0'),
                data: params,
                dataType: "json",
                success: function (data) {
                    if (data.code != "100100") {
                        this.$Modal.error({
                            content: data.msg,
                        });
                        return;
                    }
                    This.optionData = data.data;
                    This.$forceUpdate();
                },
                error: function () {
                    This.$Modal.error({
                        content: "网络异常,请联系技术人员！",
                    })
                }
            })
        },
        getSelectedItem(params) {//获取选中的那条数据
            let This = this;
            $.ajax({
                type: "post",
                url: contextPath + this.itemUrl + params.id + (This.ktcStatus? '?ktcStatus=1' : '?ktcStatus=0'),
                dataType: "json",
                success: function (data) {
                    if (data.code != "100100") {
                        This.$Modal.error({
                            content: data.msg,
                        });
                        return;
                    }
                    This.$emit('getitem', data);
                    This.$emit('on-change');

                },
                error: function () {
                    This.$Modal.error({
                        content: "网络异常,请联系技术人员！",
                    })
                }
            })
        },
        showSelectModal() {
            if (this.isDisabled) {
                return;
            }
            this.showModal = true;
        },
        cancel() {
            this.clear();
            this.$emit('cancel');
            this.showModal = false;
        },
        clear() {
            this.styleCodeModel = [];
            this.select.name = '';
            this.select.code = '';
            this.select.styleCode = '';
            let config = {
                postData: Object.assign(this.select)
            };
            jQuery(("#" + this.tableId)).jqGrid('clearGridData');
            jQuery(("#" + this.tableId)).jqGrid('setGridParam', config).trigger("reloadGrid");
        },
        search() {
            this.select.styleCode = this.styleCodeModel[this.styleCodeModel.length - 1];
            let jqGrid = $(("#" + this.tableId));
            let config = {
                postData: Object.assign(this.select)
            };
            jqGrid.jqGrid('clearGridData');
            jqGrid.jqGrid('setGridParam', config).trigger("reloadGrid");
        }
    },
    watch: {
        initModel() {
            this.code = this.initModel;
        },
        goodsGroupPath() {
            this.select.categoryCustomCode = this.goodsGroupPath;
        }
    },
    mounted() {
        this.code = this.initModel;
        this.base_commodity_config.url = contextPath + this.url + (this.ktcStatus? '?ktcStatus=1' : '?ktcStatus=0');
        this.init();
        this.getInputValue();
        var vm = this;
        $(this.$el)
            .off('.ivu-input-icon-clear')
            .on('click', '.ivu-input-icon-clear', function () {
                vm.isShow = false;
            });
    },
    template: `<div class="ht-select">
        <i-input 
            :disabled="isDisabled" 
            class="ht-width-md" 
            @on-change="change" 
            @on-blur="leave" 
            @on-focus="inInput" 
            v-model="code" 
            icon="search"
            @on-click="showSelectModal"
        ></i-input>
        <div class="ivu-select-dropdown" v-show="isShow" >
            <ul style="width:auto;min-width:200px;">
                <li v-if="optionData.length == 0" style="width:200px">暂无数据</li>
                <li v-if="!(item.code in codesUsed)" v-for="(item,index) in optionData" :key="index" @click="chooseOne(item)">{{item.code}}&nbsp;|&nbsp;{{item.name}}</li>
            </ul>
        </div>
        <Modal @on-ok="doSelect" @on-cancel="cancel" :mask-closable="false" class-name="source-list" v-model="showModal" scrollable="false"
        width="700" title="选择商品">
        <div class="content clearfix">
            <div style="border: 1px solid #ccc;">
                <div>
                    <i-form :model="select" style=" margin-top: 10px;" label-width="80">
                        <row>
                            <i-col span="12">
                                <form-item label="商品名称">
                                    <i-input v-model="select.name" class="ht-width-input"></i-input>
                                </form-item>
                                <form-item label="款式类别">
                                    <cascader v-model="styleCodeModel" :data="productType"
                                              trigger="hover" class="ht-width-md" change-on-select></cascader>
                                </form-item>

                            </i-col>
                           
                            <i-col span="12">
                                <form-item label="商品编码">
                                    <i-input v-model="select.code" class="ht-width-input"></i-input>
                                </form-item>
                                <form-item>
                                    <i-button type="primary" @click="search">搜索</i-button>
                                    <i-button type="primary" @click="clear">清空</i-button>
                                </form-item>
                            </i-col>
                        </row>
                    </i-form>
                </div>
                <div class="jqGrid_wrapper small" id="jqGrid_select">
                    <table :id="tableId"></table>
                    <div :id="pagerId"></div>
                </div>
            </div>
        </div>
        <div slot="footer"></div>
    </Modal>
    </div>`
});