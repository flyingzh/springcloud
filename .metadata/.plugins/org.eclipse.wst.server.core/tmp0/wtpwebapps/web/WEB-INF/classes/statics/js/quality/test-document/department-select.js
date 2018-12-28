Vue.component('department-select', {
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
        }
    },
    data() {
        let This = this;
        return {
            selected: [],
            body: {
                code: '',
                date: ''
            },
            nodeData:[
                { "id": 1, "pId": 0, "name": "1001 库存现金", "open": true }
            ],
            treeSetting: {
                callback: {
                    onClick: this.clickEvent,
                }
            },
            department_config:{
                colNames: ['操作','部门编码', '部门名称'],
                colModel: [
                    {
                        name: 'codes', index: 'invdate', width:140, align: "center", formatter: function (value, grid, rows, state) {
                        $(document).on("click",".select"+rows.documentCode,function(){
                            This.doSelect(value, grid, rows, state)
                        });
                        let btns =`<a type="primary" class="select${rows.documentCode}">选取</a>`;
                            return btns
                        }
                    },
                    { name: 'documentCode',  width: 140, align: "center",sort:false },
                    { name: 'sendTestTime',  width: 140, align: "center",sort:false }
                ],
                jsonReader:{
                    root:"data.list",
                    total: "data.totalPage",
                    records: "data.totalCount",
                    cell: "list",
                },
                prmNames: {
                    page: "page",
                    rows: "limit",
                },
                mtype : "POST",//向后台请求数据的ajax的类型。可选post,get
                contentType: 'application/json',
                datatype : "json",//请求数据返回的类型。可选json,xml,txt
                styleUI: 'Bootstrap',
                rownumbers: true,
                pagination: true,
                multiselectWidth: 50,
                viewrecords:true,
                rowNum : 10,
                rowList : [ 10, 30, 50],
                pager: "#department_pager_id",
                url:contextPath+"/testDocument/getCurrentUserDeptInfo",
                // url: contextPath+'/js/quality/test-document/JSONData.json',
                onPaging(){

                },
            }

        }
    },
    methods: {
        getTreeData(){
            let This = this;
            $.ajax({
                type: "POST",
                url:contextPath+"/testDocument/getCurrentUserDeptInfo",
                contentType: 'application/json',
                dataType: "json",
                success: function(res) {
                    This.nodeData = res.data;

                },
                error: function(err){
                    This.$Spin.hide();
                    console.log("服务器出错");
                },
            });
        },
        doSelect(value, grid, rows, state){
            console.log(value, grid, rows, state)
            this.$emit('input', rows.documentCode)
            this.$emit('sure');
        },
        init(){
            let This = this;
            jQuery("#department_table_id").jqGrid(This.department_config);
        },
        clear(){
            this.body = {
                code: '',
                date: ''
            }
        },
        search(){
            let jqGrid = $("#department_table_id");
            let config = {
                postData: this.body
            };
            jqGrid.jqGrid('clearGridData');
            jqGrid.jqGrid('setGridParam',config).trigger("reloadGrid");
        },
        clickEvent(event, treeId, treeNode) {
            console.log(event);
            console.log(treeId);
            console.log(treeNode);
        },
        cancel(){
            alert(333)
            this.$emit('sure');
        }
    },
    mounted() {
        this.getTreeData();
        this.init();
    },
    template: `<div>
            <Modal
            @on-ok="doSelect"
            @on-cancel="cancel"
        class-name="source-list"
        v-model="showModal"
        title="选择部门">
        <div>
        <div class="tree" style="display: inline-block; max-width:200px;">
            <ht-tree :node-data="nodeData" ref="my_tree" :setting="treeSetting"></ht-tree>
        </div>
        <div class="content clearfix" style="display: inline-block">
           <div style="width: 700px;border: 1px solid #ccc;">
              <div class="jqGrid_wrapper">
                <table id="department_table_id"></table> 
                <div id="department_pager_id"></div>
            </div>
            </div>
           
        </div>
</div>
    </Modal>
</div>`
});
