Vue.component('ht-employee-list', {
    props: {
        config: {
            type: Object,
            require: false,
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
        code: {
            default() {
                return '';
            }
        },
        showModal: {
            default() {
                return false;
            }
        },
        url: {
            default() {
                return '/employee/list   ';
            }
        },
        isCheck:{
            required:false,
            default(){
                return 'employeeModel'
            }
        }
    },
    data() {
        let This = this;

        return {
            // employeeModel: "",
            ruleValidate:{
                employeeModel:[
                    {required:true}
                ]
            },
            addBody: {
                employeeModel: ''
            },
            responseRaw: {},
            result:'',
            isLoading: false,
            isModal: false,
            selected: [],
            employeeList: [],
            employee: {
                empCode: '',
                empName: ''
            },
            base_customer_config: {
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
                colNames: ['操作', ' 员工工号', '员工姓名'],
                colModel: [
                    {
                        name: 'empCode', index: 'empCode', width: 130, align: "center", formatter: function (value, grid, rows, state) {
                        $(document).off("click", ".selectEmployee" + rows.empCode).on("click", ".selectEmployee" + rows.empCode, function () {
                            This.doSelect(value, grid, rows, state)
                        });
                        let btns = `<a type="primary" class="selectEmployee${rows.empCode}">选取</a>`;
                        return btns
                    }
                    },
                    { name: 'empName', index: 'empName', width: 250, align: "center", sort: false, },
                    {
                        name: 'empCode', index: 'empCode', width: 250, align: "center", sort: false,
                    },
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
                pager: "#employee_pager_id",
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
        doSelect(value, grid, rows, state) {
            this.$emit('input', rows);
            this.$emit('sure');
            this.$emit('on-change');
            this.showModal = false;
            this.addBody.employeeModel = rows.empName;
            this.submit();
            this.isModal = true;
            this.$nextTick(()=>{
                this.handleReset();
            })
        },
        init() {
            let This = this;
            jQuery("#employee_table_id").jqGrid(This.base_customer_config);
        },
        emitValue(e) {

            if (!e && !this.isModal) {
                this.$emit('input', {id: '', empName: ''});
                this.$emit('sure');
                this.$emit('on-change');
                return;
            }

            let selected = this.employeeList.filter(item => {
                return item.empName === e;
            });

            if(selected && selected.length > 0){
                this.$emit('input', selected[0]);
                this.$emit('sure');
                this.$emit('on-change');
            }
        },
        loadEmployeeList(value, id) {
            if(value === ""){//键盘删除数据为空时取消之前选中的
                this.$emit('input', {id: '', empName: ''});
                this.addBody.employeeModel = '';
            }
            let That = this;
            let obj = {
                limit: 30,
                page: 1,
                empName: value,
                code: ""
            };
            this.isLoading = true;
            $.ajax({
                type: "post",
                url: contextPath + That.url,
                data: obj,
                dataType: "json",
                success: function (r) {
                    That.isLoading = false;
                    if (r.code !== '100100') {
                        return;
                    }
                    That.employeeList = r.data.list;
                    if(value && id){
                        That.addBody.employeeModel = value;
                    }
                    if (That.isModal === true) {
                        That.$nextTick(() => {
                            That.addBody.employeeModel = value;
                        })
                    }
                    That.isModal = false;
                },
                error: function () {
                    That.isModal = false;
                    That.isLoading = false;
                }
            })
        },
        clear() {
            this.employee = {
                empName: "",
                empCode: ""
            };
            this.$refs.employeeRef.reset();
            let config = {
                postData: Object.assign(this.employee)
            };
            this.handleReset();
            jQuery("#employee_table_id").jqGrid('clearGridData');
            jQuery("#employee_table_id").jqGrid('setGridParam', config).trigger("reloadGrid");
        },
        search() {
            let jqGrid = $("#employee_table_id");
            let config = {
                postData: Object.assign(this.employee)
            };
            jqGrid.jqGrid('clearGridData');
            jqGrid.jqGrid('setGridParam', config).trigger("reloadGrid");
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
        reInit() {
            this.base_customer_config.url = contextPath + this.url;
            let parent = $("#jqGrid_customer")
            parent.empty();
            let tableId = "employee_table_id";
            let pageId = "employee_pager_id";
            $(`<table id=${tableId}></table>`).appendTo(parent);
            $(`<div id=${pageId}></div>`).appendTo(parent);
            this.init();
        },
        cancel() {
            this.$emit('cancel');
        },
        handlerShow() {
            if (this.disabled) {
                return;
            }
            this.showModal = true;
        },
        tip(){
            this.$emit('tip');
        }
    },
    mounted() {
        this.base_customer_config.url = contextPath + this.url;
        this.init();
    },
    watch: {
        url: {
            handler() {
                this.reInit();
            }
        }
    },
    template: `<div class="ht-supplier" style="display: inline-block" @click="tip">
    <i-form ref="formValidate" :model="addBody" :rules="ruleValidate" class="ht-hidden-label">
        <form-item :prop="isCheck">
            <Icon type="ios-search" @click="handlerShow"></Icon>
            <i-select 
                v-model="addBody.employeeModel" 
                ref="employeeRef"  
                class="ht-width-md" 
                icon="search" 
                :remote="true"
                :filterable="true"
                :loading="isLoading"
                loading-text="加载中"
                :remote-method="loadEmployeeList"
                @on-change="emitValue"
                :disabled="disabled"
                transfer
                >
                <i-option v-for="(item, index) in employeeList" :value="item.empName" :key="item.id">{{item.empName}}</i-option>
            </i-select>
        </form-item>
    </i-form>
    <Modal @on-ok="doSelect" @on-cancel="cancel" :mask-closable="false" class-name="source-list" v-model="showModal" scrollable="false"
        width="800" title="选择人员信息">
        <div class="content clearfix">
            <div style="border: 1px solid #ccc;">
                <div>
                    <i-form :model="employee" style=" margin-top: 10px;" label-width="80">
                          <form-item label="员工姓名" style="display:inline-block">
                                    <i-input v-model="employee.empName"></i-input>
                                </form-item>
                                   <form-item label="员工工号" style="display:inline-block">
                                    <i-input v-model="employee.empCode"></i-input>
                                </form-item>
                            <form-item style="display:inline-block">
                                    <i-button type="primary" @click="search">搜索</i-button>
                                    <i-button type="primary" @click="clear">清空</i-button>
                                </form-item>
                    </i-form>
                </div>
                <div class="jqGrid_wrapper" id="jqGrid_customer">
                    <table id="employee_table_id"></table>
                    <div id="employee_pager_id"></div>
                </div>
            </div>
        </div>
        <div slot="footer"></div>
    </Modal>
</div>`
});
