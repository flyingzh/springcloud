var vm = new Vue({
    el: "#employee_list",
    data: {
        isSearchHide: true,
        isTabulationHide: true,
        reload: false,
        selected: [],
        stationList: [],
        openTime: '',
        showDepartment: false,
        treeUrl: contextPath + '/documentAllController/getDeptInfoByCurrentUserOrgId',
        treetSetting: {},

        body: {
            empCode: '',
            empName: '',
            deptName: '',
            deptId: '',
        },
        data_config: {
            url: contextPath + "/employee/list",
            datatype: "json",
            colNames: ['id', '员工工号', '职员名称', '性别', '所属部门', '职务', '联系电话', '创建日期', "创建人",],
            colModel: [
                {name: "id", width: 210, align: "left", hidden: true},
                {name: "empCode", width: 210, align: "left",
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
                {name: "empName", width: 210, align: "left"},
                {name: "sex", width: 210, align: "left",
                    formatter: function (value, grid, rows, state) {
                        if (value == 0) {
                            return "男";
                        }
                        if (value == 1) {
                            return "女";
                        }
                        return '';
                    }
                },
                {name: "deptName", width: 210, align: "left"},
                {name: "station", width: 210, align: "left",
                    formatter: function (value, grid, rows, state) {
                        return vm.formatterStation(value);
                    }, unformat: function (cellvalue, options, rowObject) {
                    return vm.unformatterStation(cellvalue);
                }
                },
                {name: "phone", width: 210, align: "left"},
                {name: "createTime", width: 210, align: "left",
                    formatter: function (value, grid, rows, state) {
                        return value ? new Date(value).format("yyyy-MM-dd") : '';
                    }
                },
                {name: "createName", width: 210, align: "left"},

            ],
            rowNum: 5,//一页显示多少条
            rowList: [10, 20, 30],//可供用户选择一页显示多少条
            mtype: "post",//向后台请求数据的ajax的类型。可选post,get
            viewrecords: true
        },
        excelParam:'',

    },
    methods: {
        //引入
        importData() {
            this.$refs.upload.$refs.input.click();
        },
        //引出模板
        getExcelTemplate()  {
            location.href = contextPath +'/excle/getExcelModel?excelModelName=员工导入模板.xlsx';
        },
        //上传中方法
        handleProcessing(){
            window.top.home.loading('show',{text:'处理数据中，请稍等!'});
        },
        //上传excel成功时 数据处理
        handleSuccess(res, file) {
            let _this = this;
            if (res.code === '100100') {
                _this.$Modal.success({title:'提示信息!',content:'引入成功!'});
                window.top.home.loading('hide');
               _this.refresh();
            } else {
                window.top.home.loading('hide');
                _this.$Modal.info({
                    content:"<div style='height: 300px;overflow-y: scroll'>"+res.msg.replace(/;/g,"<br/>")+"</div>",
                    title:'提示信息',
                    scrollable:true,
                    height:"520px",
                });
            }
        },
        //当 上传的文件不符合excel格式的时候 执行的方法
        handleFormatError(file) {
            let _this = this;
            _this.$Modal.info({
                content:'请选择excel格式的文件!',
                title:'提示信息'
            });
        },
        //搜索
        search() {
            this.reload = !this.reload;
        },

        //清空
        clear() {
            this.body = {
                empCode: '',
                empName: '',
                deptName: '',
                deptId: '',
            }
        },

        //刷新
        refresh() {
            this.clear();
            this.reload = !this.reload;
        },

        // 点击退出(退出页面)
        exit() {
            window.parent.closeCurrentTab({openTime: this.openTime, exit: true,});
        },

        //部门树的显示隐藏
        showDepartmentTree(value) {
            // console.log(value,111)
            if (this.showDepartment === true) {
                this.showDepartment = false;
                return;
            }
            this.showDepartment = value;
        },

        //回调函数
        treeClickCallBack(event, treeId, treeNode) {
            this.body.deptId = treeNode.id;
            this.body.deptName = treeNode.name;
            console.log(this.body.deptId,this.body.deptName)
            this.showDepartment = false;
        },

        treeBeforeClick(treeId, treeNode, clickFlag) {
            return !treeNode.isParent; //当单击父节点，返回false，不让选取
        },

        getStationList() {
            this.stationList = getCodeList("sys_station");
        },

        formatterStation(value) {
            if (!value) {
                return '';
            } else if (this.stationList.length < 1) {
                return value;
            }
            return this.stationList[this.stationList.map(function (e) {
                return e.value;
            }).indexOf(value)]
                ? this.stationList[this.stationList.map(function (e) {
                    return e.value;
                }).indexOf(value)].name
                : value;
        },
        unformatterStation() {
            if (!value) {
                return '';
            } else if (this.stationList.length < 1) {
                return value;
            }
            return this.stationList[this.stationList.map(function (e) {
                return e.name;
            }).indexOf(value)]
                ? this.stationList[this.stationList.map(function (e) {
                    return e.name;
                }).indexOf(value)].value
                : name;
        },

        add() {
            window.parent.activeEvent({
                name: "人员 - 新增",
                url: contextPath + '/sysmanager/employee/employee_add.html',
                params: {activeType: "add"}
            });
        },

        update() {
            console.log(this.selected,233);
            if (this.selected.length < 1) {
                this.$Modal.info({
                    title: '提示信息',
                    content: '请先选择至少一笔数据！'
                });
                return;
            }
            if (this.selected.length > 1) {
                this.$Modal.info({
                    title: '提示信息',
                    content: '只能选择一笔数据！'
                });
                return;
            }

            //跳转至修改页面
            window.parent.activeEvent({
                name: "人员-修改",
                url: contextPath+'/sysmanager/employee/employee_add.html',
                params: {activeType: "update",id:this.selected[0].id}
            });
        },

        //点击员工编号查看详情
        detailClick(data){
            //携带id跳转至新增页
            window.parent.activeEvent({
                name: "人员-查看",
                url: contextPath+'/sysmanager/employee/employee_add.html',
                params: {activeType: "check",id:data.rows.id}
            });
        },

        //删除行
        deleteRow() {
            var This = this;
            var checkboxList = This.$refs.selectOneCheckbox;
            for (var i = 0; i < checkboxList.length; i++) {
                if (checkboxList[i].checked === false) {
                    This.$Modal.info({
                        title: "提示信息",
                        content: "请先选择一条数据!"
                    });
                    return false;
                } else {
                    This.recordList.splice(checkboxList[i], 1)
                }
            }
            console.log(This.$refs.selectOneCheckbox, "checkboxList")
        },
        del_click() {
            let This = this;
            let ids = This.selected
            if (!ht.util.hasValue(ids, "array")) {
                This.$Modal.warning({
                    content: '请先选择一条记录!'
                })
                return false;
            }

            this.$Modal.confirm({
                title: '系统提示',
                content: '<p>是否确认是否删除？</p>',
                okText: '确定',
                cancelText: '取消',
                onOk: () => {
                    This.deleteInfoTmp(ids)
                },
            })
        },
        deleteInfoTmp(ids) {
            let This = this
            let selectRowId = [];
            let len = 0;
            for(let j = 0,len=ids.length; j < len; j++) {
                selectRowId.push(ids[j]);
            }
            $.ajax({
                type: "POST",
                url: contextPath + "/employee/delBatch",
                contentType: 'application/json',
                data: JSON.stringify(selectRowId),
                dataType: "json",
                success: function (data) {
                    if (data.code == "100100") {
                        This.$Modal.success({
                            content: "删除成功",
                            title: "提示信息"
                        })
                        This.reload = !This.reload;
                        This.selected = []
                    } else {
                        This.$Modal.info({
                            content: "删除失败",
                            title: "提示信息"
                        })
                    }

                }
            })
        },
    },

    created() {
        this.openTime = window.parent.params.openTime;
        this.getStationList();
        this.treetSetting = {
            callback: {
                onClick: this.treeClickCallBack,
                beforeClick: this.treeBeforeClick
            }
        };
    }

})