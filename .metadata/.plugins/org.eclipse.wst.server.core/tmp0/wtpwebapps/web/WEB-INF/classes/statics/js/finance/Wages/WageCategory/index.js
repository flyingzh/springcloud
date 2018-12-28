let vm = new Vue({
    el: '#wage-category',
    data(){
        return {
            type: "",       //增删改查类型


            category: {
                id: "",
                categoryName: "",
                categoryNo: "系统自动生成",
            },

            formData: {
                accountYear: "",
                accountPeriod: 10,
                accountYear: 2018,
                audited: -1,
                cardIds: [],
                certificateStatus: -1,
                changeType: -1,
                sobId: 1,
            },
            addData: {
                accountYear: "",
                accountPeriod: 10,
                accountYear: 2018,
                audited: -1,
                cardIds: [],
                certificateStatus: -1,
                changeType: -1,
                sobId: 1,
            },
            editData: {
                accountYear: "",
                accountPeriod: 10,
                accountYear: 2018,
                audited: -1,
                cardIds: [],
                certificateStatus: -1,
                changeType: -1,
                sobId: 1,
            },
            filterVisible: false,
            orgName: "",
            title: "",
            tableList: [],
            chooseId: '',
        };
    },
    created() {
    },
    mounted() {
        this.pageInit();
        this.getOrgName();
        this.openTime = window.parent.params && window.parent.params.openTime;
    },
    methods:{
        openFun(type) {
            this.type = type;
            this.title = type+'工资类别';
            this.filterVisible = true;
        },
        add() {
            this.type = "add";
            this.title = '新增工资类别';
            this.filterVisible = true;
        },
        update() {
            let id = $("#grid").jqGrid('getGridParam', 'selrow');
            let that = this;
            if (id == null) {
                that.wrapAlert("请选择需要修改的工资类别！");
                return false;
            }
            let rowData = $("#grid").jqGrid('getRowData', id);
            this.type = "update";
            this.title = "修改工资类别";
            this.category.id = rowData.id;
            this.category.categoryName = rowData.categoryName;
            this.category.categoryNo = rowData.categoryNo;
            this.filterVisible = true;
        },
        delFun() {
            let id = $("#grid").jqGrid('getGridParam', 'selrow');
            let that = this;
            if (id == null) {
                that.wrapAlert("请选择需要删除的工资类别！");
                return false;
            }
            let rowData = $("#grid").jqGrid('getRowData',id);
            this.$Modal.confirm({
                title: '提示信息',
                content: '<p>确定要删除所选【'+rowData.categoryName+'】？</p>',
                loading: true,
                onOk: () => {
                    console.log("删除");
                    setTimeout(() => {
                        $.ajax({
                            url: contextPath + "/category/delete/" + id,
                            type: "post",
                            async: false,
                            success: function (data) {
                                if (data.data) {
                                    that.wrapAlert("删除成功！");
                                } else {
                                    that.wrapAlert("不能删除类别" + rowData.categoryName + "，该类别下有职员工资数据！");
                                }
                                jQuery("#grid").trigger("reloadGrid");
                            }

                        });
                        this.$Modal.remove();
                    }, 0);
                }
            });

        },
        chooseFun() {
            let id = $("#grid").jqGrid('getGridParam', 'selrow');
            let that = this;
            if (id == null) {
                that.wrapAlert("请选择工资类别！");
                return false;
            }
            let name = '';
            let find = this.tableList.find( row =>{
                return row.id == this.chooseId;
            })
            find&&(name = find.categoryName);
            let content = `<p>确定选择【${name}】为当前操作的工资类别？</p>`
            this.$Modal.confirm({
                title: '提示信息',
                content: content,
                loading: true,
                onOk: () => {
                    $.ajax({
                        url: contextPath + "/category/select/" + id,
                        type: "post",
                        success: function (data) {
                            if (data.data) {
                                that.wrapAlert("选择成功！");
                            } else {
                                that.wrapAlert("选择失败！");
                            }
                            jQuery("#grid").trigger("reloadGrid");
                        }

                    });
                    this.$Modal.remove();


                }
            });
        },
        pageInit() {
            let that = this;
            Object.assign(that.formData,that.addData)
            jQuery("#grid").jqGrid(
                {
                    datatype: "json",
                    mtype: 'POST',
                    postData:JSON.stringify(that.formData),
                    // multiselect : true,
                    url: contextPath+'/category/list',
                    ajaxGridOptions: { contentType: 'application/json;charset=utf-8' },
                    colNames : ['id', '类别编号', '类别名称', '是否被选择'],
                    colModel : [
                        {name: 'id',key:true,hidden:true},
                        {name : 'categoryNo',width :200, align : "center",sortable:false},
                        {name : 'categoryName',width : 200, align: "left",sortable:false
                            // formatter: function (value, grid, rows, state) {
                            //    $(document).off("click",".detaila"+rows.id).on("click",".detaila"+rows.id,function(){
                            //         that.detailClick(rows)
                            //     });
                            //     let div =`<a class="detaila${rows.id} ht-link">${rows.subjectCode}</a>`;
                            //     return div
                            // }
                        },
                        {name : 'sysDefault',width :200, align : "center",sortable:false,
                            formatter: function (value, grid, rows, state) {
                                if (value == 1) {
                                    return "是";
                                }
                                return "否";
                            }
                        },
                    ],
                    rowNum: 999999999,//一页显示多少条
                    jsonReader: {
                        root: "data",
                    },
                    styleUI: 'Bootstrap',
                    height: $(window).height() - 210,
                    onSelectRow: function (data, status) { // 当选择行时触发此事件
                        console.log("data---------", data, status);
                        that.chooseId = data;
                    },
                    loadComplete: function (ret) {
                        //获取表格所有行数据
                        if (ret.code === '100100') {
                            that.tableList = ret.data || [];
                        }
                        console.log('tableList', that.tableList)
                    },
                })
        },
        save(){
            let that = this;
            if (that.type == "add") {
                $.ajax({
                    url: contextPath + "/category/add",
                    type: "post",
                    contentType: "application/json",
                    data: JSON.stringify(that.category),
                    success: function (data) {
                        if (data.data) {
                            that.wrapAlert("新增成功！");
                        } else {
                            that.wrapAlert("新增失败！");
                        }
                        jQuery("#grid").trigger("reloadGrid");
                    }

                });

            } else if (that.type == "update") {
                $.ajax({
                    url: contextPath + "/category/update",
                    type: "post",
                    contentType: "application/json",
                    data: JSON.stringify(that.category),
                    success: function (data) {
                        if (data.data) {
                            that.wrapAlert("修改成功！");
                        } else {
                            that.wrapAlert("修改失败！");
                        }
                        jQuery("#grid").trigger("reloadGrid");
                    }

                });
            }

            that.filterVisible = false;
        //    // $("#list").jqGrid('clearGridData');  //清空表格
        //     this.formData.startDate = this.operateDate(this.formData.startDate);
        //     this.formData.endDate = this.operateDate(this.formData.endDate);
        //     $("#list").jqGrid('setGridParam',{  // 重新加载数据
        //         postData:this.formData
        //     }).trigger("reloadGrid");
        //     this.cancel()
        },
        cancel(){
            this.filterVisible = false;
        },
        refresh(){
            jQuery("#grid").trigger("reloadGrid");  //刷新
        },
        quit() {
            window.parent.closeCurrentTab({ openTime: this.openTime, exit: true });
        },
        //提示alert
        wrapAlert (msg) {
            this.$Message.info({
                content: msg,
                duration: 3
            });
        },
        getOrgName() {
            let that = this;
            $.ajax({
                url: contextPath + "/category/orgname",
                type: "post",
                success: function (data) {
                    that.orgName = data.data;
                }
            });
        }
    }
})