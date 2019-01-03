Vue.component('source-list', {
    props: {
        config: {
            type: Object,
            require: false,
            default() {
                return false;
            }
        },
        code: {
            default() {
                return '';
            }
        },
        showModal: {
            default() {
                return false;
            }
        }
    },
    data() {
        let This = this;
        return {
            responseRaw: [],
            selected: [],
            selectedRow: [],
            body: {
                hasCreateTestDocument: 0,
                startTime: '',
                endTime: '',
                documentCode: '',
                date: ''
            },
            //客户订单 搜索 过滤条件
            coustomer: {
                custName: '', //客户名称
                goodsTypeName: '',//商品类型名称
                startTime: '',  //开始时间
                endTime: '',    //结束时间
            },
            base_config: {
                multiboxonly: false,
                multiselect: true,
                colNames: ['单据编号', '单据日期', '业务类型', '商品类型'],
                colModel: [
                    {name: 'saleOrderNo', index: 'currencyName asc, invdate', width: 200, align: "center", sort: false},
                    {name: 'orderDate', index: 'currencyName asc, invdate', width: 200, align: "center", sort: false},
					{
						name: 'businessType', index: 'businessType', width: 200, align: "center",
						formatter: function (value, grid, rows, state) {
							if (value == 'S_CUST_ORDER_01') {
								return "普通销售";
							} else {
								return "受托加工销售";
							}
						}
					},
                    {name: 'goodsTypeName', index: 'goodsTypeName', width: 200, align: "center"},
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
                ajaxGridOptions: {
                    complete(js, textStatus) {
                        This.responseRaw = JSON.parse(js.responseText);
                    }
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
                pager: "#my_pager_id_source",
                url: contextPath + "/tsalecustorder/list/",
				postData: {"status":4},
                onSelectAll(data, status) {
                    This.handlerData(data, status);
                },
                onSelectRow(data, status) {
                    This.handlerData(data, status);
                },
            }

        }
    },
    methods: {
        handlerData(data, status) {
            if (typeof data === 'object' && status) {
                this.selected = data
            }
            if (typeof data === 'object' && !status) {
                this.selected = [];
            }
            if (typeof data === 'string') {
                if (status) {
                    (this.selected.indexOf(data.toString()) > -1) ? null : this.selected.push(data.toString());
                } else {
                    let index = this.selected.indexOf(data.toString());
                    index > -1 ? this.selected.splice(index, 1) : null;
                }
            }
            this.selectedRow = [];
            this.selected.map(item => {
                this.responseRaw.data.list.map(list => {
                    if (item == list.id) {
                        this.selectedRow.push(list);
                    }
                });
            })
        },
        modalOk() {

            if(!this.isAllEqual(this.selectedRow)){
              this.$Modal.info({
                  title:'提示信息',
                  content: '所选商品类型必须一致'
              });
                return ;
            }
            this.$emit('sure', JSON.parse(JSON.stringify(this.selectedRow)));
        },
        isAllEqual(array) { //判断所有的源单类型是否一致
            if (array.length > 0) {
                return !array.some(function (value, index) {
                    return value.goodsType !== array[0].goodsType;
                });
            } else {
                return true;
            }
        },
        init() {
            let This = this;
            jQuery("#my_table_id_source").jqGrid(This.base_config);
        },
        clear() {
            this.body = {
                // code: '',
                documentCode: '',
                date: '',
                startTime: '',
                endTime: ''
            }
        },
        search() {
            let jqGrid = $("#my_table_id_source");
            let config = {
                postData: Object.assign({documentType: this.code}, this.body)
            };
            jqGrid.jqGrid('clearGridData');
            jqGrid.jqGrid('setGridParam', config).trigger("reloadGrid");
        },
        modalCancel() {
            this.$emit('cancel');
        },
        changeDate(value) {
            this.body.startTime = value[0].replace(/\//g, '-') + ' 00:00:00';
            this.body.endTime = value[1].replace(/\//g, '-') + ' 23:59:59';
        }
    },
    mounted() {
        this.init();
    },
    watch: {
        code: {
            handler() {
                this.search();
            }
        }
    },
    template: `<div>
            <Modal
            @on-ok="modalOk"
            @on-cancel="modalCancel"
        class-name="source-list"
        v-model="showModal"
        title="选择源单信息">
        <div class="content clearfix">
           <div style="width: 900px;border: 1px solid #ccc;">
              <div>
                  <i-form :model="body" style="display:inline-block; margin-top: 10px;" :label-width="120">
                    <form-item label="客户名称">
                        <i-input v-model="coustomer.custName"></i-input>
                    </form-item>
                    <form-item label="单据日期">
                        <!--<date-picker format="yyyy-MM-dd" v-model="body.date" :key="body.date" @on-change="body.date=$event"  type="datetime" placeholder="请选择时间" style="width: 200px"></date-picker>-->
                    <date-picker @on-change="changeDate" format="yyyy/MM/dd" v-model="body.date" type="daterange" placement="bottom-end" placeholder="Select date" style="width: 200px"></date-picker>
                    </form-item>
                     <i-button type="primary" style="margin-left: 120px" @click="search">查询</i-button>
                  </i-form>

                 
            </div>
            <div class="jqGrid_wrapper">
                <table id="my_table_id_source"></table> 
                <div id="my_pager_id_source"></div>
            </div>
            </div>
           <div slot="footer">
                    <i-button type="text" size="large" @click="modalCancel">取消</i-button>
                    <i-button type="primary" size="large" @click="modalOk">确定</i-button>
                </div>
        </div>
    </Modal>
</div>`
});
