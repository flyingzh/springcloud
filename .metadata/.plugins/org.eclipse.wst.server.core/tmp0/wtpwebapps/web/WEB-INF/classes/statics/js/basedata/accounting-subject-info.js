var vm = new Vue({
    el: '#accounting-info',
    data() {
        let This = this;
        return {
            isSearchHide: true, //搜索栏
            isTabulationHide: true, // 列表
            isHide: true,
            saveDisable: true,//保存按钮禁用
            saveSubjectDisabled: false,// 默认可用
            reload: false,
            excelShow: false,
            subjectShow: false,
            showModalTow: false,
            showSubjectTree: false,
            openCashPopup: false,//弹框
            popType: '',
            subjectCodeList: [],
            load: true,
            nodeData: [],
            //excel
            excelShowModal: false,
            //科目代码的临时值
            subjectCodeTemp: '',
            //是否有子科目
            isHaveChildren: true,
            excelTreeNote: [],
            selected: [],
            cashSelected: [],
            isDisable: false,
            isChecked: false,
            excelNameType: '',
            isShow: false,
            updateDisAble: false,
            isFinalRemit: false,
            showView: false,
            selectedNodes: [],
            // Project
            isShowModalProject: false,
            isAuxiliaryAccount: false,
            projectSelected: [],
            projectSelecting: [],
            mainProjectContent: '',
            cluProjectContent: '',
            formData: {
                id: '',
                subjectCode: '',
                subjectName: '',
                subjectCategoryId: '',
                balanceDirection: '',
                isFinalRemit: '',
                isCashSubject: '',
                isBankSubject: '',
                isDayoutNote: '',
                isAuxiliaryAccount: '',
                measureGroupId: '',
                measureId: '',
                isCashEquivalent: '',
                mainProjectId: '',
                clusterProjectId: '',
                accountProjectList: []
            },
            cashBody: {
                id: 0,
                code: '',
                status: -1,
                grade: 0,
                fullname: '',
                parentId: 0,
                createName: '',
                createTime: '',
                createId: 0,
                updateId: 0,
                updateUser: '',
                updateTime: ''
            },
            addBody: {
                id: 0,
                parentId: 0,
                grade: 0,
                name: '',
                code: '',
                parentCode: '',
                fullname: '',
                status: '1',
                createTime: '21232',
                createName: 'tom'
            },
            colProject: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '代码',
                    key: 'projectAccountCode'
                },
                {
                    title: '名称',
                    key: 'projectAccountName'
                }
            ],
            dataProject: [],
            body: {
                subjectCode: '',
                subjectName: '',
                balanceDirection: '',
                treeHeight: '',
                fullSubjectCode: '',
                type: '',
                id: 0,
                parentId: 0,
                grade: 0,
                name: '',
                code: '',
                parentCode: '',
                fullname: '',
                status: '1',
                createTime: '21232',
                createName: 'tom'
            },
            subjectList: [],
            currencyType: [
                { id: -1, currencyName: "所有币别" },
                { id: -2, currencyName: "不核算" },
            ],
            unitGroup: [],
            defaultUint: [],
            initDefaultUint: [],
            banks: [],
            direction: [
                {
                    balanceDirection: 1,
                    label: '借方'
                },
                {
                    balanceDirection: 2,
                    label: '贷方'
                }
            ],
            balanceDirectionDisabled: false,
            noteData: [],
            subjectNodeData: [],
            //setting:配置相关
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
            cashSetting: {
                //注意：如果使用如上简单Json数据，以下data.simpleData.enable必须设置为true。
                data: {
                    simpleData: {
                        enable: true,
                        idKey: "id",
                        pIdKey: "parentId"
                    }
                },
                callback: {
                    onClick: this.cashClickEvent,
                }
            },
            excelSetting: {
                data: {
                    simpleData: {
                        enable: true,
                        idKey: "id",
                        pIdKey: "parentId"
                    },
                    key: {
                        name: 'subjectName'
                    }
                }
            },
            colData: [],
            colHeader: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '科目代码',
                    key: 'subjectCode'
                },
                {
                    title: '科目名称',
                    key: 'subjectName'
                }
            ],
            tmpSubject: '',
            jgid: 'accountinginfo',
            data_config: {
                url: contextPath + '/tbaseAccountSubject/list',
                singleSelect: true,
                multiselect: true,
                multiboxonly: true,
                colNames: ['操作', '科目', '科目代码', '科目名称', '科目类别', '余额方向', '外币核算', '全名', '期末调汇', '数量金额辅助核算', '计量单位', '现金科目', '银行科目'],
                colModel: [
                    {
                        name: 'id', index: 'id', width: 200, align: "right",
                        hidden: true
                    },
                    {
                        name: 'selectedSubjectCode', width: 100, hidden: true, formatter: function (value, grid, rows, state) {
                            return rows.subjectCode;
                        },
                    },
                    {
                        name: 'subjectCode', index: 'subjectCode', width: 100, align: "left",
                        formatter: function (value, grid, rows, state) {
                            let formatVal = '';
                            if (value.indexOf('.') != -1) {
                                formatVal = value.replace(/\./g, '_');
                            } else {
                                formatVal = value;
                            }
                            $(document).on("click", "#detail" + formatVal, function () {
                                vm.selected = [];
                                vm.selected = [rows.id];
                                vm.view();
                            });
                            let btns = '<a id=detail' + formatVal + '>' + value + '</a>';
                            return btns;
                        }
                    },
                    { name: 'subjectName', index: 'subjectName', width: 100, align: "left" },
                    {
                        name: 'tBaseSubjectBalanceEntity.subjectCategory',
                        index: 'tBaseSubjectBalanceEntity.subjectCategory',
                        width: 100,
                        align: "left"
                    },
                    {
                        name: 'balanceDirection',
                        index: 'balanceDirection',
                        width: 100,
                        align: "left",
                        formatter: function (value, grid, rows, state) {
                            if (value == 1) {
                                return '借方';
                            } else if (value == 2) {
                                return '贷方';
                            } else {
                                return '';
                            }
                        }
                    },
                    {
                        name: 'foreignCurrencyId', index: 'foreignCurrencyId', width: 100, align: "left",
                        formatter: function (value, grid, rows, state) {
                            let name = '';
                            for (let i = 0; i < vm.currencyType.length; i++) {
                                if (value == vm.currencyType[i].id) {
                                    name = vm.currencyType[i].currencyName;
                                }
                            }
                            return name;
                        }
                    },
                    { name: 'fullName', index: 'fullName', width: 100, align: "left" },
                    {
                        name: 'isFinalRemit', index: 'isFinalRemit', width: 100, align: "left",
                        formatter: function (value, grid, rows, state) {
                            if (value == 0) {
                                return '否';
                            } else if (value == 1) {
                                return '是';
                            } else {
                                return '';
                            }
                        }
                    },
                    {
                        name: 'isAuxiliaryAccount', index: 'isAuxiliaryAccount', width: 100, align: "left",
                        formatter: function (value, grid, rows, state) {
                            if (value == 0) {
                                return '否';
                            } else if (value == 1) {
                                return '是';
                            } else {
                                return '';
                            }
                        }
                    },
                    {
                        name: 'tBaseUnitGroupEntity.name',
                        index: 'tBaseUnitGroupEntity.name',
                        width: 100,
                        align: "left",
                        formatter: function (value, grid, rows, state) {
                            if (rows.tBaseUnitEntity) {
                                if (value != null && value != NaN) {
                                    return value + "-" + rows.tBaseUnitEntity.name;
                                } else {
                                    return +"-" + rows.tBaseUnitEntity.name;
                                }
                            } else {
                                if (value) {
                                    return value;
                                } else {
                                    return "";
                                }
                            }
                        }
                    },
                    {
                        name: 'isCashSubject', index: 'isCashSubject', width: 100, align: "left",
                        formatter: function (value, grid, rows, state) {
                            if (value == 0) {
                                return '否';
                            } else if (value == 1) {
                                return '是'
                            } else {
                                return '';
                            }
                        }
                    },
                    {
                        name: 'isBankSubject', index: 'isBankSubject', width: 100, align: "left",
                        formatter: function (value, grid, rows, state) {
                            if (value == 0) {
                                return '否';
                            } else if (value == 1) {
                                return '是'
                            } else {
                                return '';
                            }
                        }
                    }]
            },
            state: [
                {
                    value: '1',
                    label: '有效'
                },
                {
                    value: '0',
                    label: '无效'
                },
                {
                    value: '',
                    label: '所有'
                }
            ],
            cashdata_config: {
                url: contextPath + '/tbasecashflow/list',
                singleSelect: true,
                multiboxonly: true,
                colNames: ['操作', '代码', '名称', '全名'],
                colModel: [
                    {
                        name: 'id', index: 'id', width: 100, align: "right", hidden: true
                    },
                    { name: 'code', index: 'invdate', width: 100, align: "left" },
                    { name: 'name', index: 'name asc, invdate', width: 300, align: "left" },
                    { name: 'fullname', index: 'fullname', width: 300, align: "left" },
                ]
            },

            status: [
                {
                    value: '1',
                    label: '有效'
                },
                {
                    value: '0',
                    label: '无效'
                }
            ]
        }
    },
    created() {
        this.loadAccountSubjectList();
        this.loadCurrencyList();
        this.loadAccountProjectList();
        this.loadUnitGroupList();
        this.loadUnitList();
    },
    methods: {
        //记载单位组
        loadUnitGroupList() {
            $.ajax({
                type: 'POST',
                url: contextPath + '/tbaseunitgroup/list',
                success: function (data) {
                    if (data.code === '100100') {
                        for (let subject of data.data) {
                            vm.unitGroup.push({ id: subject.id, name: subject.name });
                        }
                    }
                }
            })
        },
        //加载单位
        loadUnitList() {
            $.ajax({
                type: 'POST',
                url: contextPath + '/tbaseunit/list',
                success: function (data) {
                    if (data.code === '100100') {
                        for (let subject of data.data) {
                            vm.initDefaultUint.push({ id: subject.id, name: subject.name, groupId: subject.groupId });
                        }
                    }
                }
            })
        },
        //加载核算项目类别
        loadAccountProjectList() {
            $.ajax({
                type: 'POST',
                url: contextPath + '/tbaseAccountProject/getList',
                data: {},
                success: function (data) {
                    if (data.code === '100100' && data.data.length > 0) {
                        vm.dataProject = [];
                        for (let subject of data.data) {
                            vm.dataProject.push({
                                id: subject.id,
                                projectAccountCode: subject.projectAccountCode,
                                projectAccountName: subject.projectAccountName
                            });
                        }
                    }
                }
            })
        },
        //获取所有的币种
        loadCurrencyList() {
            $.ajax({
                type: 'POST',
                url: contextPath + '/currency/queryAll',
                data: {},
                success: function (data) {
                    if (data.code === '100100' && data.data.length > 0) {
                        let list = [];
                        list = data.data;
                        for (let i = 0; i < list.length; i++) {
                            vm.currencyType.push({ id: list[i].id, currencyName: list[i].currencyName });
                        }
                    }
                }
            })
        },
        loadAccountSubjectList() {
            $.ajax({
                type: 'POST',
                url: contextPath + '/tbaseAccountSubject/getSubjectBalanceList',
                data: {},
                success: function (data) {
                    if (data.code === '100100' && data.data.length > 0) {
                        let list = [];
                        list = data.data;
                        for (let i = 0; i < list.length; i++) {
                            vm.subjectList.push({
                                id: list[i].id,
                                subjectCategory: list[i].subjectCategory,
                                balanceDirection: list[i].balanceDirection
                            });
                        }
                    }
                }
            })
        },
        cashClickEvent(event, treeId, treeNode) {
            vm.body.subjectCode = '',
                vm.body.subjectName = '',
                vm.body.balanceDirection = '',
                vm.body.treeHeight = '',
                vm.body.fullSubjectCode = '',
                vm.body.code = treeNode.code;
            vm.selectedNodes = $.fn.zTree.getZTreeObj("swgfss1212").getSelectedNodes();
            if (vm.selectedNodes.length > 0) {
                if (vm.selectedNodes[0].grade == 1) {
                    vm.body.code = '';
                }
            }
            this.cashSearch();
        },
        selectIsAuxiliaryAccount() {
            if (vm.formData.isAuxiliaryAccount == false) {
                vm.formData.measureGroupId = '';
                vm.formData.measureId = '';
            }
        },
        selectUnitGroup() {
            vm.defaultUint = [];
            for (let i = 0; i < vm.initDefaultUint.length; i++) {
                if (vm.formData.measureGroupId == vm.initDefaultUint[i].groupId) {
                    vm.defaultUint.push({ id: vm.initDefaultUint[i].id, name: vm.initDefaultUint[i].name })
                }
            }
        },
        addSubject() {
            this.isEdit = true;
            let index = layer.open({
                type: 1,
                title: '新增会计科目',
                btn: ['保存', '取消'],
                content: $('#addSubject'),
                area: '400px',
                btn1() {
                    layer.close(index);
                }
            })
        },
        modifySubject() {
            let index = layer.open({
                type: 1,
                area: '400px',
                content: $('#modifySubject'),
                titel: '修改会计科目',
                btn: ['保存', '修改'],
                btn1() {
                    layer.close(index);
                }
            })
        },
        subjectClickEvent(event, treeId, treeNode) {
            //可以调用ztree原生方法，更多方法请参考官方文档。
            var fullSubjectCode = treeNode.fullSubjectCode;
            var treeHeight = treeNode.treeHeight;
            if ((!fullSubjectCode) || (!treeHeight && treeHeight !== 0)) {
                return false;
            }
            this.body = {
                subjectCode: '',
                subjectName: '',
                balanceDirection: '',
                treeHeight: Number(treeHeight),
                fullSubjectCode: fullSubjectCode + ""
            }
            this.reload = !this.reload;
        },
        cashSearch() {
            this.reload = !this.reload;
        },
        search() {
            this.body.fullSubjectCode = '';
            this.body.treeHeight = '';
            this.reload = !this.reload;
        },
        clearItem(name, ref) {
            if (this.$refs[ref]) {
                this.$refs[ref].reset();
            }
            this.$nextTick(() => {
                this.body[name] = '';
            })
        },
        cashClear() {
            //清空地址绑定
            this.body.code = '';
            this.body.fullname = '';
            this.body.status = '';
            this.cashSelected = [];
            this.reload = !this.reload;
        },
        clear() {
            this.body = {
                subjectCode: '',
                subjectName: '',
                balanceDirection: '',
                treeHeight: '',
                fullSubjectCode: ''
            }
            this.reload = !this.reload;
        },
        selectSubject(event) {
            let subjectId = vm.formData.subjectCategoryId;
            for (let i = 0; i < vm.subjectList.length; i++) {
                if (subjectId === vm.subjectList[i].id) {
                    vm.formData.balanceDirection = vm.subjectList[i].balanceDirection;
                    vm.balanceDirectionDisabled = true;
                    vm.$nextTick(function () {
                        $('#subjectForm').validate().element("#directionId");
                    });
                    break;
                }
            }
        },
        selectCurrency(event) {
            let noAccount = -2;
            if (vm.formData.foreignCurrencyId == noAccount) {
                vm.isFinalRemit = true;
            } else {
                vm.isFinalRemit = false;
            }
        },
        // openMainDetail() {
        //     if (vm.showView == true) {
        //         return false;
        //     }
        //     var main = layer.open({
        //         type: 1,
        //         area: ['1000px', '500px'],
        //         title: false,
        //         content: $('#popup'),
        //         btn: ['确定', '取消'],
        //         btn1() {
        //             let id = vm.cashSelected;
        //             if (vm.cashSelected.length == 0) {
        //                 // vm.$Modal.info({
        //                 //     title:'提示信息',
        //                 //     content:'请选择！'
        //                 // });
        //                 layer.alert("请选择!", { icon: 0 });
        //                 return false;
        //             }
        //             if (vm.cashSelected.length > 1) {
        //                 // vm.$Modal.info({
        //                 //     title:'提示信息',
        //                 //     content:'请单选！'
        //                 // });
        //                 layer.alert("请单选", { icon: 0 });
        //                 return false;
        //             }
        //             $.ajax({
        //                 type: "POST",
        //                 url: contextPath + "/tbasecashflow/info/" + id,
        //                 contentType: 'application/json',
        //                 dataType: "json",
        //                 async: false,
        //                 success: function (data) {
        //                     if (data.code === '100100' && data.data.id) {
        //                         vm.formData.mainProjectId = data.data.id;
        //                         vm.mainProjectContent = data.data.code + "-" + data.data.name;
        //                         layer.close(main);
        //                     }
        //                 },
        //                 error: function (err) {
        //                     // vm.$Modal.warning({
        //                     //     content: '服务器出错！',
        //                     //     closable: true
        //                     // })
        //                     layer.alert("服务器出错", { icon: 0 });
        //                 },
        //             });
        //         },
        //         btn2() {
        //         }
        //     })
        // },
        openMainDetail(type) {
            if ((vm.showView == true) || (vm.formData.isCashSubject || vm.formData.isBankSubject  || vm.formData.isCashEquivalent)  ) {
                return ;
            }
            this.popType = type;
            this.openCashPopup = true;
        },
        getCashItem() {
            let id = vm.cashSelected;
            if (vm.cashSelected.length == 0) {
                vm.$Modal.info({
                    title: '提示信息',
                    content: '请选择！'
                });
                return false;
            }
            if (vm.cashSelected.length > 1) {
                vm.$Modal.info({
                    title: '提示信息',
                    content: '请单选！'
                });
                return false;
            }
            $.ajax({
                type: "POST",
                url: contextPath + "/tbasecashflow/info/" + id,
                contentType: 'application/json',
                dataType: "json",
                async: false,
                success: function (data) {
                    if (data.code === '100100' && data.data.id) {
                        if (vm.popType === 1) {
                            vm.formData.mainProjectId = data.data.id;
                            vm.mainProjectContent = data.data.code + "-" + data.data.name;
                        } else if (vm.popType === 2) {
                            vm.formData.clusterProjectId = data.data.id;
                            vm.cluProjectContent = data.data.code + "-" + data.data.name;
                        }
                        vm.openCashPopup = false;
                        vm.body.fullname = '';
                        vm.body.code = '';
                        vm.reload = !vm.reload;
                    }
                },
                error: function (err) {
                    vm.$Modal.warning({
                        content: '服务器出错！',
                        closable: true
                    })
                },
            });
        },
        cancelCashItem() {
            this.openCashPopup = false;
            this.body.fullname = '';
            this.body.code = '';
            this.reload = !this.reload;
        },
        // openCluDetail() {
        //     if (vm.showView == true) {
        //         return false;
        //     }
        //     var clu = layer.open({
        //         type: 1,
        //         area: '1000px',
        //         title: false,
        //         content: $('#popup'),
        //         btn: ['确定', '取消'],
        //         btn1() {
        //             let id = vm.cashSelected;
        //             if (vm.cashSelected.length == 0) {
        //                 // vm.$Modal.info({
        //                 //     title:'提示信息',
        //                 //     content:'请选择！'
        //                 // });
        //                 layer.alert("请选择", { icon: 0 });
        //                 return false;
        //             }
        //             if (vm.cashSelected.length > 1) {
        //                 // vm.$Modal.info({
        //                 //     title:'提示信息',
        //                 //     content:'请单选！'
        //                 // });
        //                 layer.alert("请单选", { icon: 0 });
        //                 return false;
        //             }
        //             $.ajax({
        //                 type: "POST",
        //                 url: contextPath + "/tbasecashflow/info/" + id,
        //                 contentType: 'application/json',
        //                 dataType: "json",
        //                 async: false,
        //                 success: function (data) {
        //                     if (data.code === '100100' && data.data.id) {
        //                         vm.formData.clusterProjectId = data.data.id;
        //                         vm.cluProjectContent = data.data.code + "-" + data.data.name;
        //                         layer.close(clu);
        //                     }
        //                 },
        //                 error: function (err) {
        //                     // vm.$Modal.warning({
        //                     //     title:'提示信息',
        //                     //     content:'服务器出错！'
        //                     // })
        //                     layer.alert("服务器出错", { icon: 0 });
        //                 },
        //             });
        //         },
        //         btn2() {
        //         }
        //     })
        // },
        mouseBlur() {
            if (this.formData.subjectCode.toString().indexOf('.') > -1) {
                let subjectCode = this.formData.subjectCode;
                $.ajax({
                    type: 'POST',
                    url: contextPath + '/tbaseAccountSubject/getSubjectBalanceByCode',
                    data: { 'subjectCode': subjectCode },
                    success: function (data) {
                        if (data.code === '100100' && data.data.id) {
                            vm.subjectList = [];
                            vm.subjectList.push({ id: data.data.id, subjectCategory: data.data.subjectCategory });
                            vm.formData.balanceDirection = data.data.balanceDirection;
                            vm.formData.subjectCategoryId = data.data.id;
                            vm.balanceDirectionDisabled = true;
                        }
                    }
                })
            } else {
                $.ajax({
                    type: 'POST',
                    url: contextPath + '/tbaseAccountSubject/getSubjectBalanceList',
                    data: {},
                    success: function (data) {
                        if (data.code === '100100' && data.data.length > 0) {
                            vm.subjectList = [];
                            for (let subject of data.data) {
                                vm.subjectList.push({
                                    id: subject.id,
                                    subjectCategory: subject.subjectCategory,
                                    balanceDirection: subject.balanceDirection
                                });
                            }
                        }
                    }
                })
            }

            this.getSubjectInfo();
        },
        save() {
            let url = contextPath + "/tbaseAccountSubject/save";
            vm.formData.accountProjectList = vm.projectSelected;
            let This = this;
            if ($('#subjectForm').valid()) {
                if ('' == vm.formData.subjectCode.trim() || '' == vm.formData.subjectName.trim() || '' == vm.formData.subjectCategoryId || '' == vm.formData.balanceDirection || '' == vm.formData.foreignCurrencyId) {
                    vm.$Modal.info({
                        title: '提示信息',
                        content: '必填项未填,请点击科目设置！'
                    });
                    // layer.alert("必填项未填,请点击科目设置", {icon: 0});
                    return false;
                }
                //禁用保存按钮
                if (!vm.saveDisable) {
                    return false;
                }
                vm.saveDisable = false;
                if (vm.formData.id === '') {
                    $.ajax({
                        type: "POST",
                        url: url,
                        contentType: 'application/json',
                        data: JSON.stringify(This.formData),
                        dataType: "json",
                        success: function (result) {
                            if (result.code === "100100" && result.data == 101) {
                                vm.$Modal.warning({
                                    title: '提示信息',
                                    content: '该会计科目已存在！'
                                });
                                // layer.alert("该会计科目已存在", {icon: 0});
                                vm.saveDisable = true;
                            } else if (result.code === "100100" && result.data == 100) {
                                vm.$Modal.warning({
                                    title: '提示信息',
                                    content: '上级科目不存在！'
                                });
                                // layer.alert("上级科目不存在", {icon: 0});
                                vm.saveDisable = true;
                            } else if (result.code === "100100" && result.data == 1) {
                                /*
                                layer.alert("保存成功", {
                                    icon: 1
                                    , end: function () {
                                        vm.saveDisable = true;
                                        vm.cancel();
                                        vm.reload = !vm.reload;
                                    }
                                })
                                */
                                vm.$Modal.success({
                                    title: '提示信息',
                                    content: '保存成功！'
                                });
                                vm.saveDisable = true;
                                vm.cancel();
                                vm.reload = !vm.reload;
                            } else {
                                vm.$Modal.warning({
                                    title: '提示信息',
                                    content: '保存失败！'
                                });
                                // layer.alert("保存失败", {icon: 0});
                                vm.saveDisable = true;
                            }
                        },
                        error: function (err) {
                            vm.$Modal.warning({
                                title: '提示信息',
                                content: '服务器出错！'
                            });
                            // layer.alert("服务器出错", {icon: 0});
                            vm.saveDisable = true;
                        },
                    });
                } else {
                    let url = contextPath + "/tbaseAccountSubject/updatePost";
                    $.ajax({
                        type: "POST",
                        url: url,
                        contentType: 'application/json',
                        data: JSON.stringify(this.formData),
                        dataType: "json",
                        success: function (result) {
                            if (result.code === "100100" && result.data == 100) {
                                vm.$Modal.warning({
                                    title: '提示信息',
                                    content: '不能改变科目级别或上级科目！'
                                });
                                // layer.alert("不能改变科目级别或上级科目", {icon: 0});
                                vm.saveDisable = true;
                            } else if (result.code === "100100" && result.data == 101) {
                                vm.$Modal.warning({
                                    title: '提示信息',
                                    content: '该会计科目已存在！'
                                });
                                // layer.alert("该会计科目已存在", {icon: 0});
                                vm.saveDisable = true;
                            } else if (result.code === "100100" && result.data == 1) {
                                /*
                                layer.alert("保存成功", {
                                    icon: 1
                                    , end: function () {
                                        vm.saveDisable = true;
                                        vm.cancel();
                                        vm.reload = !vm.reload;
                                    }
                                })
                                */
                                vm.$Modal.success({
                                    title: '提示信息',
                                    content: '保存成功！'
                                });
                                vm.saveDisable = true;
                                vm.cancel();
                                vm.reload = !vm.reload;
                            } else {
                                vm.$Modal.warning({
                                    title: '提示信息',
                                    content: '保存失败！'
                                });
                                // layer.alert("保存失败", {icon: 0});
                                vm.saveDisable = true;
                            }
                        },
                        error: function (err) {
                            vm.$Modal.warning({
                                title: '提示信息',
                                content: '服务器出错！'
                            });
                            // layer.alert("服务器出错", {icon: 0});
                            vm.saveDisable = true;
                        },
                    });
                }
                vm.saveDisable = true;
            }
        },

        add() {
            vm.formData.foreignCurrencyId = -2;
            this.isShow = true;
            this.subjectShow = true;
            vm.projectSelecting = [];
            vm.projectSelected = [];

            this.getSubjectInfo();
        },
        del() {
            let This = this;
            let id = This.selected;
            if (!ht.util.hasValue(id, "array")) {
                vm.$Modal.info({
                    title: '提示信息',
                    content: '请先选择一条记录！'
                });

                // layer.alert("请先选择一条记录!");
                return false;
            }

            this.$Modal.confirm({
                title:'提示信息',
                content:'当前数据有可能被引用，会影响数据准确性，确认是否删除？',
                onOk: () => {
                    $.ajax({
                        type: "POST",
                        url: contextPath + "/tbaseAccountSubject/delete",
                        data: { id: id[0] },
                        dataType: "json",
                        success: function (data) {
                            //// -1:组织不同 -2:有子节点 >0:被引用 -5:删除成功 -4:删除失败
                            if (-1 == data) {
                                setTimeout(function(){
                                    vm.$Modal.warning({
                                        title:'提示信息',
                                        content:'组织不同,删除失败！'
                                    });
                                },300)
                                return false;
                            } else if (data == -2) {
                                setTimeout(function(){
                                    vm.$Modal.warning({
                                        title:'提示信息',
                                        content:'该会计科目有明细科目！'
                                    });
                                },300)
                                return false;
                            } else if (data > 0) {
                                setTimeout(function(){
                                    vm.$Modal.warning({
                                        title:'提示信息',
                                        content:'该会计科目被引用！'
                                    });
                                },300)
                                return false;
                            } else if (data == -5) {
                                setTimeout(function(){
                                    vm.$Modal.success({
                                        title:'提示信息',
                                        content:'删除成功！'
                                    })
                                    vm.selected = [];
                                    vm.reload = !vm.reload;
                                },300)
                            } else {
                                setTimeout(function(){
                                    vm.$Modal.warning({
                                        title:'提示信息',
                                        content:'删除失败！'
                                    });
                                },300)
                                return false;
                            }
                        },
                        error: function (err) {
                            vm.$Modal.warning({
                                title:'提示信息',
                                content:'服务器出错，请稍后再试！'
                            });

                        },
                    })
                }
            })
            /*
            layer.confirm('当前数据有可能被引用，会影响数据准确性，确认是否删除？', {
                btn: ['确定', '取消']
            }, function (index, layero) {
                $.ajax({
                    type: "POST",
                    url: contextPath + "/tbaseAccountSubject/delete",
                    // contentType: 'application/json',
                    data: { id: id[0] },
                    dataType: "json",
                    success: function (data) {
                        //// -1:组织不同 -2:有子节点 >0:被引用 -5:删除成功 -4:删除失败
                        if (-1 == data) {
                            // vm.$Modal.warning({
                            //     title:'提示信息',
                            //     content:'组织不同,删除失败！'
                            // });
                            layer.alert("组织不同,删除失败", { icon: 0 });
                            return false;
                        } else if (data == -2) {
                            // vm.$Modal.warning({
                            //     title:'提示信息',
                            //     content:'该会计科目有明细科目！'
                            // });
                            layer.alert("该会计科目有明细科目", { icon: 0 });
                            return false;
                        } else if (data > 0) {
                            // vm.$Modal.warning({
                            //     title:'提示信息',
                            //     content:'该会计科目被引用！'
                            // });
                            layer.alert("该会计科目被引用", { icon: 0 });
                            return false;
                        } else if (data == -5) {
                            layer.alert("删除成功", {
                                icon: 1
                                , end: function () {
                                    vm.selected = [];
                                    vm.reload = !vm.reload;
                                }
                            })
                        } else {
                            // vm.$Modal.warning({
                            //     title:'提示信息',
                            //     content:'删除失败！'
                            // });
                            layer.alert("删除失败", { icon: 0 });
                            return false;
                        }
                    },
                    error: function (err) {
                        // vm.$Modal.warning({
                        //     title:'提示信息',
                        //     content:'服务器出错！'
                        // });
                        layer.alert("服务器出错", { icon: 0 });
                    },
                })
            }
            )
            */
        },
        initFormValidate() {
            let This = this;
            var validateOptions = {
                rules: {
                    subjectCode: {
                        isWellSubjectCode: true,
                        required: true,
                        maxlength: 40
                    },
                    subjectName: {
                        required: true,
                        maxlength: 50
                    }
                },
                messages: {
                    subjectCode: {
                        required: "请填写编码!",
                        maxlength: "编码最大长度为30！"
                    },
                    subjectName: {
                        required: "请填写科目名称!",
                        maxlength: "编码最大长度为30"
                    }
                }
            };
            $("#subjectForm").validate(validateOptions);
        },

        initCashFormValidate() {
            var validateOptions = {
                onfocusout: function (element) {
                    $(element).valid();
                },
                onkeyup: false,
                rules: {
                    code: {
                        isChar: true,
                        required: true,
                        maxlength: 100,
                        remote: {
                            url: contextPath + "/tbasecashflow/queryForValidate",  //后台处理程序
                            type: "post",  //数据发送方式
                            dataType: "json",  //接受数据格式
                            data: {  //要传递的数据
                                id: function () {
                                    return vm.addBody.id;
                                },
                                parentCode: function () {
                                    return vm.addBody.parentCode;
                                }
                            },
                            dataFilter: function (data, type) {//判断控制器返回的内容
                                var res = JSON.parse(data);
                                if (res.code === "100100") {
                                    return true;
                                } else {
                                    return false;
                                }
                            }
                        }
                    },
                    fullname: {
                        required: true,
                        maxlength: 100,
                        remote: {
                            url: contextPath + "/tbasecashflow/queryForValidate",  //后台处理程序
                            type: "post",  //数据发送方式
                            dataType: "json",  //接受数据格式
                            data: {  //要传递的数据
                                id: function () {
                                    return vm.addBody.id;
                                }
                            },
                            dataFilter: function (data, type) {//判断控制器返回的内容
                                var res = JSON.parse(data);
                                if (res.code === "100100") {
                                    return true;
                                } else {
                                    return false;
                                }
                            }
                        }
                    },
                },
                messages: {
                    code: {
                        required: "请填写编码!",
                        remote: "该编码已存在!",
                        maxlength: "编码最大长度为100！",
                    },
                    fullname: {
                        required: "请填写名称!",
                        remote: "该全名已存在!",
                    },
                }
            };
            $("#addForm").validate(validateOptions);
        },

        //现金科目
        selectIsCashSubject() {
            if (vm.formData.isCashSubject == false) {
                vm.formData.isBankSubject = false;
                vm.formData.isCashEquivalent = false;
                vm.formData.isDayoutNote = true;
                vm.mainProjectContent = '';
                vm.formData.mainProjectId = '';
                vm.cluProjectContent = '';
                vm.formData.clusterProjectId = '';
            }
        },
        //银行科目
        selectIsBankSubject() {
            if (vm.formData.isBankSubject == false) {
                vm.formData.isCashSubject = false;
                vm.formData.isCashEquivalent = false;
                vm.formData.isDayoutNote = true;
                vm.mainProjectContent = '';
                vm.formData.mainProjectId = '';
                vm.cluProjectContent = '';
                vm.formData.clusterProjectId = '';
            }
        },
        //现金等价物
        selectIsCashEquivalent() {
            if (vm.formData.isCashEquivalent == false) {
                vm.formData.isBankSubject = false;
                vm.formData.isCashSubject = false;
                vm.mainProjectContent = '';
                vm.formData.mainProjectId = '';
                vm.cluProjectContent = '';
                vm.formData.clusterProjectId = '';
            }
        },
        modify() {
            if (this.selected.length == 0) {
                vm.$Modal.info({
                    title: '提示信息',
                    content: '请选中要修改的条目！'
                });
                // layer.alert("请选中要修改的条目", {icon: 0});
                return false;
            }
            if (this.selected.length > 1) {
                vm.$Modal.info({
                    title: '提示信息',
                    content: '请单选！'
                });
                // layer.alert("请单选", {icon: 0});
                return false;
            }
            $.ajax({
                type: "POST",
                url: contextPath + "/tbaseAccountSubject/isByReference",
                data: { id: vm.selected[0] },
                dataType: "json",
                success: function (data) {
                    //// -1:组织不同  >0:被引用
                    if (-1 == data) {
                        vm.$Modal.warning({
                            title: '提示信息',
                            content: '组织不同,更新失败！'
                        });
                        // layer.alert("组织不同,更新失败", {icon: 0});
                        return false;
                    } else if (data > 0) {
                        vm.isReferenceShow();
                        vm.updateDisAble = true;
                        vm.saveSubjectDisabled = true;
                        return false;
                    } else {
                        vm.isReferenceShow();
                        return false;
                    }
                },
                error: function (err) {
                    vm.$Modal.warning({
                        title: '提示信息',
                        content: '服务器出错，请稍后再试！'
                    });
                    // layer.alert("服务器出错", {icon: 0});
                },
            })
        },
        getChildByCode() {
            let temp = vm.formData.id;
            $.ajax({
                type: "POST",
                url: contextPath + "/tbaseAccountSubject/hasChildSubject",
                data: { 'id': temp },
                success: function (data) {
                    if (true == data) {
                        vm.isHaveChildren = false;
                    } else if (false == data) {
                        vm.isHaveChildren = true;
                    } else {
                        vm.isHaveChildren = true;
                    }
                },
                error: function (err) {
                    vm.$Modal.warning({
                        title: '提示信息',
                        content: '服务器出错，请稍后再试！'
                    })
                    // layer.alert("服务器出错", {icon: 0});
                },
            })
        },
        isReferenceShow() {
            $.ajax({
                type: 'POST',
                url: contextPath + '/tbaseAccountSubject/info/' + vm.selected[0],
                data: {},
                success: function (data) {
                    if (data.code === '100100' && data.data.id) {
                        vm.formData.id = data.data.id;
                        vm.formData.subjectCode = data.data.subjectCode;
                        vm.subjectCodeTemp = data.data.subjectCode;
                        vm.formData.subjectName = data.data.subjectName;
                        vm.formData.foreignCurrencyId = data.data.foreignCurrencyId;
                        if (data.data.tBaseSubjectBalanceEntity) {
                            vm.formData.subjectCategoryId = data.data.tBaseSubjectBalanceEntity.id;
                        }
                        vm.formData.balanceDirection = data.data.balanceDirection;
                        vm.formData.isFinalRemit = (data.data.isFinalRemit == 1) ? true : false;
                        vm.formData.isCashSubject = (data.data.isCashSubject == 1) ? true : false;
                        vm.formData.isBankSubject = (data.data.isBankSubject == 1) ? true : false;
                        vm.formData.isDayoutNote = (data.data.isDayoutNote == 1) ? true : false;
                        vm.formData.isAuxiliaryAccount = (data.data.isAuxiliaryAccount == 1) ? true : false;
                        if (data.data.tBaseUnitGroupEntity) {
                            vm.formData.measureGroupId = data.data.tBaseUnitGroupEntity.id;
                        }
                        vm.defaultUint = vm.initDefaultUint;
                        if (data.data.tBaseUnitEntity) {
                            vm.formData.measureId = data.data.tBaseUnitEntity.id;
                        }
                        vm.formData.isCashEquivalent = (data.data.isCashEquivalent == 1) ? true : false;
                        if (data.data.mainCashflowEntity) {
                            vm.formData.mainProjectId = data.data.mainCashflowEntity.id;
                            vm.mainProjectContent = data.data.mainCashflowEntity.code + "-" + data.data.mainCashflowEntity.name;
                        }
                        if (data.data.clusCashflowEntity) {
                            vm.formData.clusterProjectId = data.data.clusCashflowEntity.id;
                            vm.cluProjectContent = data.data.clusCashflowEntity.code + "-" + data.data.clusCashflowEntity.name;
                        }
                        vm.projectSelected = data.data.accountProjectList;
                        vm.getChildByCode();
                        vm.isShow = true;
                        vm.subjectShow = true;

                    }
                }
            })
        },
        view() {
            if (this.selected.length == 0) {
                vm.$Modal.info({
                    title: '提示信息',
                    content: '请选中要查看的科目！'
                });
                // layer.alert("请选中要查看的科目", {icon: 0});
                return false;
            }
            if (this.selected.length > 1) {
                vm.$Modal.info({
                    title: '提示信息',
                    content: '请单选！'
                });
                // layer.alert("请单选", {icon: 0});
                return false;
            }
            vm.saveDisable = false;
            $.ajax({
                type: 'POST',
                url: contextPath + '/tbaseAccountSubject/info/' + vm.selected[0],
                data: {},
                success: function (data) {
                    if (data.code === '100100' && data.data.id) {
                        vm.showView = true;
                        vm.formData.id = data.data.id;
                        vm.formData.subjectCode = data.data.subjectCode;
                        vm.formData.subjectName = data.data.subjectName;
                        vm.formData.foreignCurrencyId = data.data.foreignCurrencyId;
                        if (data.data.tBaseSubjectBalanceEntity) {
                            vm.formData.subjectCategoryId = data.data.tBaseSubjectBalanceEntity.id;
                        }
                        vm.formData.balanceDirection = data.data.balanceDirection;
                        vm.formData.isFinalRemit = (data.data.isFinalRemit == 1) ? true : false;
                        vm.formData.isCashSubject = (data.data.isCashSubject == 1) ? true : false;

                        vm.formData.isBankSubject = (data.data.isBankSubject == 1) ? true : false;

                        vm.formData.isDayoutNote = (data.data.isDayoutNote == 1) ? true : false;

                        vm.formData.isAuxiliaryAccount = (data.data.isAuxiliaryAccount == 1) ? true : false;
                        if (data.data.tBaseUnitGroupEntity) {
                            vm.formData.measureGroupId = data.data.tBaseUnitGroupEntity.id;
                        }
                        vm.defaultUint = vm.initDefaultUint;
                        if (data.data.tBaseUnitEntity) {
                            vm.formData.measureId = data.data.tBaseUnitEntity.id;
                        }
                        vm.formData.isCashEquivalent = (data.data.isCashEquivalent == 1) ? true : false;
                        if (data.data.mainCashflowEntity) {
                            vm.formData.mainProjectId = data.data.mainCashflowEntity.id;
                            vm.mainProjectContent = data.data.mainCashflowEntity.code + "-" + data.data.mainCashflowEntity.name;
                        }
                        if (data.data.clusCashflowEntity) {
                            vm.formData.clusterProjectId = data.data.clusCashflowEntity.id;
                            vm.formData.cluProjectContent = data.data.clusCashflowEntity.code + "-" + data.data.clusCashflowEntity.name;
                        }
                        vm.projectSelected = data.data.accountProjectList;
                        vm.getChildByCode();
                        vm.isShow = true;
                        vm.showView = true;
                        vm.subjectShow = true;
                    }
                }
            })
        },
        cancel() {
            vm.isHaveChildren = true;
            vm.subjectCodeTemp = '';
            this.isShow = false;
            this.subjectShow = false;
            vm.showView = false;
            vm.balanceDirectionDisabled = false;
            vm.updateDisAble = false;
            vm.selected = [];
            vm.selectedSubjectCode = [];
            vm.colData = [];
            vm.saveDisable = true;
            vm.formData.id = '';
            vm.formData.subjectCode = '';
            vm.formData.subjectName = '';
            vm.formData.subjectCategoryId = '';
            vm.formData.balanceDirection = '';
            vm.formData.isFinalRemit = '';
            vm.formData.isCashSubject = '';
            vm.formData.isBankSubject = '';
            vm.formData.isDayoutNote = '';
            vm.formData.isAuxiliaryAccount = '';
            vm.formData.measureGroupId = '';
            vm.formData.measureId = '';
            vm.formData.isCashEquivalent = '';
            vm.formData.mainProjectId = '';
            vm.mainProjectContent = '';
            vm.cluProjectContent = '';
            vm.formData.clusterProjectId = '';
            vm.formData.accountProjectList = [];
            vm.formData.foreignCurrencyId = '';
            vm.excelNameType = '';
            vm.saveSubjectDisabled = false;
            this.reload = !this.reload;
        },
        addAccountProject() {
            if (vm.showView == true) {
                return false;
            }
            if (vm.updateDisAble == true) {
                return false;
            }
            this.isShowModalProject = true;
        },
        delAccountProject() {
            if (vm.showView == true) {
                return false;
            }
            if (vm.updateDisAble == true) {
                return false;
            }
            if (vm.selected[0]) {
                if (vm.projectSelecting.length > 1) {
                    vm.$Modal.info({
                        title: '提示信息',
                        content: '请单选！'
                    });
                    // layer.alert("请单选", {icon: 0});
                    return false;
                } else if (vm.projectSelecting.length < 0) {
                    vm.$Modal.info({
                        title: '提示信息',
                        content: '请选择至少一条数据！'
                    });
                    // layer.alert("请选择", {icon: 0});
                    return false;
                } else {
                    let projectList = [];
                    for (let i = 0; i < vm.projectSelected.length; i++) {
                        if (vm.projectSelecting[0].id != vm.projectSelected[i].id) {
                            projectList.push({
                                id: vm.projectSelected[i].id,
                                projectAccountName: vm.projectSelected[i].projectAccountName,
                                projectAccountCode: vm.projectSelected[i].projectAccountCode
                            })
                        }
                    }
                    vm.projectSelected = [];
                    vm.projectSelecting = [];
                    vm.projectSelected = projectList;
                }
            } else {
                if (vm.projectSelecting.length > 1) {
                    vm.$Modal.info({
                        title: '提示信息',
                        content: '请单选！'
                    });
                    // layer.alert("请单选", {icon: 0});
                    return false;
                } else if (vm.projectSelecting.length < 0) {
                    vm.$Modal.info({
                        title: '提示信息',
                        content: '请选择至少一条数据！'
                    });
                    // layer.alert("请选择", {icon: 0});
                    return false;
                }
                let projectList = [];
                for (let i = 0; i < vm.projectSelected.length; i++) {
                    if (vm.projectSelecting[0].id != vm.projectSelected[i].id) {
                        projectList.push({
                            id: vm.projectSelected[i].id,
                            projectAccountName: vm.projectSelected[i].projectAccountName,
                            projectAccountCode: vm.projectSelected[i].projectAccountCode
                        })
                    }
                }
                vm.projectSelected = [];
                vm.projectSelected = projectList;
            }
        },
        selectProjectOK() {
            this.isShowModalProject = false;
            var projectList = [];
            if (vm.projectSelecting.length > 0) {
                if (vm.projectSelected.length > 0) {
                    for (let i = 0; i < vm.projectSelecting.length; i++) {
                        for (let j = 0; j < vm.projectSelected.length; j++) {
                            if (vm.projectSelecting[i].id == vm.projectSelected[j].id) {
                                break;
                            }
                            if (j == vm.projectSelected.length - 1) {
                                projectList.push({
                                    id: vm.projectSelecting[i].id,
                                    projectAccountName: vm.projectSelecting[i].projectAccountName,
                                    projectAccountCode: vm.projectSelecting[i].projectAccountCode
                                })
                            }
                        }
                    }
                    for (let i = 0; i < projectList.length; i++) {
                        vm.projectSelected.push({
                            id: projectList[i].id,
                            projectAccountName: projectList[i].projectAccountName,
                            projectAccountCode: projectList[i].projectAccountCode
                        });
                    }
                } else {
                    for (let i = 0; i < this.projectSelecting.length; i++) {
                        vm.projectSelected.push({
                            id: this.projectSelecting[i].id,
                            projectAccountName: this.projectSelecting[i].projectAccountName,
                            projectAccountCode: this.projectSelecting[i].projectAccountCode
                        })
                    }
                }
            }
            this.projectSelecting = [];
            this.clearProjectSelected();
        },
        onSelectProject(selection, row) {
            this.projectSelecting = [];
            for (let i = 0; i < selection.length; i++) {
                vm.projectSelecting.push({
                    id: selection[i].id,
                    projectAccountName: selection[i].projectAccountName,
                    projectAccountCode: selection[i].projectAccountCode
                });
            }
        },
        onSelectedProject(selection, row) {
            this.projectSelecting = [];
            for (let i = 0; i < selection.length; i++) {
                vm.projectSelecting.push({
                    id: selection[i].id,
                    projectAccountName: selection[i].projectAccountName,
                    projectAccountCode: selection[i].projectAccountCode
                });
            }
        },
        selectProjectClose() {
            this.isShowModalProject = false;
            this.clearProjectSelected();
        },
        clearProjectSelected() {
            $.each(this.$refs.tblProject.objData, function (idx, ele) {
                ele._isChecked = false;
            });
        },
        focusMainContent(e) {
            $(e.target).select();
        },
        focusCluContent(e) {
            $(e.target).select();
        },
        hideSearch() {
            this.isSearchHide = !this.isSearchHide;
            $(".chevron").css("top", "")
        },
        ImportTemplate() {
            vm.excelShowModal = true;
        },
        myImport() {
            vm.isShow = true;
            vm.subjectShow = false;
            vm.excelShow = true;
            layui.use('upload', function () {
                var upload = layui.upload;
                //执行上传
                var uploadInst = upload.render({
                    elem: '#upload' //绑定元素
                    , url: contextPath + '/tbaseAccountSubject/import' //上传接口
                    , method: 'POST'
                    , accept: 'file'
                    , size: 5000
                    , before: function (obj) {
                        layer.load();
                    }
                    , done: function (res) {//上传完毕回调
                        layer.alert(res.msg)
                        layer.closeAll('loading');
                        var result = '';
                        for (var i = 0; i < res.length; i++) {
                            result = result + res[i].nsrsbh + "=" + res[i].container + "\n";
                        }
                        $("#result").html(result);
                    }
                    , error: function () {//请求异常回调
                        layer.closeAll('loading');
                        layer.msg('网络异常，请稍后重试！');
                    }
                });
            });
        },
        signOut() {
            vm.excelShow = false;
            vm.isShow = false;
            this.reload = !this.reload;
        },
        excelPullIn() {
            vm.colData = [];
            if (!this.excelNameType) {
                vm.$Modal.info({
                    title: '提示信息',
                    content: '请选择查看模版！'
                });
                // layer.alert("请选择查看模版", {icon: 0});
                return false;
            }
            this.excelShowModal = true;
            this.showSubjectTree = false;
            this.showModalTow = true;
            $.ajax({
                type: 'POST',
                url: contextPath + '/tbaseAccountSubject/getExcelContentByName',
                data: { type: vm.excelNameType, treeHeight: 4 },
                success: function (data) {
                    if (data.code === '100100' && data.data.length > 0) {
                        vm.colData = data.data;
                    }
                }
            })
        },
        excelCancel() {
            this.excelShowModal = false;
            this.showSubjectTree = false;
            this.excelNameType = "";
        },
        excelSelected(selection) {
            vm.subjectCodeList = [];
            for (let i = 0; i < selection.length; i++) {
                vm.subjectCodeList.push(selection[i].subjectCode);
            }
        },
        submit() {
            if (vm.subjectCodeList.length == 0) {
                vm.$Modal.info({
                    title: '提示信息',
                    content: '请选择导入数据！'
                });
                // layer.alert("请选择导入数据", {icon: 0});
                return false;
            }
            let param = {
                subjectCodeList: {},
                type: vm.excelNameType
            }
            param.subjectCodeList = vm.subjectCodeList.join(',');
            $.ajax({
                type: 'POST',
                url: contextPath + '/tbaseAccountSubject/isRepeat',
                datatype: "json",//请求数据返回的类型。可选json,xml,txt
                data: param,
                success: function (data) {
                    if (data.code === '100100' && data.data == -1) {
                        // vm.excelShowModal = false;
                        // vm.excelNameType = ''
                        var con = layer.confirm("是否覆盖?", {
                            btn: ['是', '否'],
                            btn1: function (index, layerro) {
                                $.ajax({
                                    type: 'POST',
                                    url: contextPath + '/tbaseAccountSubject/saveExcel',
                                    datatype: "json",//请求数据返回的类型。可选json,xml,txt
                                    data: param,
                                    success: function (data) {
                                        if (data.code === '100100' && data.data > 0) {
                                            layer.alert("导入成功", {
                                                icon: 1
                                                , end: function () {
                                                    vm.excelNameType = '';
                                                    vm.subjectCodeList = [];
                                                    vm.excelShowModal = false;
                                                    vm.reload = !vm.reload;
                                                }
                                            });
                                        } else {
                                            vm.excelNameType = '';
                                            vm.subjectCodeList = [];
                                            // vm.$Modal.warning({
                                            //     content:'导入失败！'
                                            // });
                                            layer.alert("导入失败", { icon: 0 });
                                            vm.excelShowModal = true;
                                        }
                                    }
                                })
                            },
                            btn2: function (index, layerro) {
                                vm.excelNameType = '';
                                vm.subjectCodeList = [];
                                layer.close(con);
                                return false;
                            }
                        })
                    } else if (data.code === '100100' && data.data == -2) {
                        vm.excelNameType = '';
                        vm.subjectCodeList = [];
                        vm.$Modal.warning({
                            content: '导入失败！'
                        });
                        // layer.alert("导入失败", {icon: 0});
                    } else if (data.code === '100100' && data.data > 0) {
                        layer.alert("导入成功", {
                            icon: 1
                            , end: function () {
                                vm.excelNameType = '';
                                vm.subjectCodeList = [];
                                vm.excelShowModal = false;
                                vm.reload = !vm.reload;
                            }
                        });
                    } else {
                        vm.excelNameType = '';
                        vm.subjectCodeList = [];
                        vm.$Modal.warning({
                            content: '服务器出错！'
                        });
                        // layer.alert("服务器出错", {icon: 0});
                    }
                }
            })
        },
        //查看excel表格的信息
        showSubject() {
            if (!vm.excelNameType) {
                vm.$Modal.infp({
                    content: '请选择查看模版！'
                });
                // layer.alert("请选择查看模版", {icon: 0});
                return false;
            }
            vm.showSubjectTree = true;
            $.ajax({
                type: 'POST',
                url: contextPath + '/tbaseAccountSubject/getExcelContentByName',
                data: { type: vm.excelNameType },
                success: function (data) {
                    if (data.code === '100100' && data.data.length > 0) {
                        vm.excelTreeNote = [];
                        vm.excelTreeNote = data.data;
                        vm.$refs.my_excel_tree.nodeData = vm.excelTreeNote;
                        vm.$refs.my_excel_tree.loadData();
                    }
                }
            })
        },
        getSubjectInfo() {
            /**
             * 选择的树节点科目长编码
             */
            var selectedFullSubjectCode = vm.body.fullSubjectCode;

            /**
             * 选择的明细科目编码
             */
            var selectedSubjectCode = $("#accountinginfo").jqGrid('getRowData', vm.selected).selectedSubjectCode;

            var subjectCode = "";   // 用户选择的科目编码

            /**
             * 选择的详细科目，直接获取科目编码
             */
            if (null != selectedSubjectCode && typeof (selectedSubjectCode) != "undefined") {
                subjectCode = selectedSubjectCode;
            } else {
                if (vm.formData.subjectCode.toString().indexOf('.') > -1) {
                    subjectCode = vm.formData.subjectCode.toString().substring(0, vm.formData.subjectCode.toString().lastIndexOf("."));
                } else {
                    subjectCode = vm.formData.subjectCode;
                }
            }

            if (null != subjectCode && subjectCode != "" && typeof (subjectCode) != "undefined") {
                /**
                 * 根据科目编码，获取科目的相关信息，并在新增下级科目时，数据自动显示在新增的下级科目中
                 */
                $.ajax({
                    type: "POST",
                    url: contextPath + "/tbaseAccountSubject/getSubjectCodeListByCode",
                    data: { 'subjectCode': subjectCode },
                    dataType: "json",
                    success: function (result) {
                        if (null != result && null != result.data) {
                            if (null != selectedSubjectCode && typeof (selectedSubjectCode) != "undefined") {
                                vm.formData.subjectCode = result.data.subjectCode;
                            }

                            if (result.data.tBaseSubjectBalanceEntity) {
                                vm.formData.subjectCategoryId = result.data.tBaseSubjectBalanceEntity.id;
                            }

                            vm.formData.balanceDirection = result.data.balanceDirection;
                            vm.formData.foreignCurrencyId = result.data.foreignCurrencyId;
                            vm.formData.isFinalRemit = (result.data.isFinalRemit == 1) ? true : false;
                            vm.formData.isCashSubject = (result.data.isCashSubject == 1) ? true : false;
                            vm.formData.isBankSubject = (result.data.isBankSubject == 1) ? true : false;
                            vm.formData.isDayoutNote = (result.data.isDayoutNote == 1) ? true : false;
                            vm.formData.isAuxiliaryAccount = (result.data.isAuxiliaryAccount == 1) ? true : false;

                            if (result.data.tBaseUnitGroupEntity) {
                                vm.formData.measureGroupId = result.data.tBaseUnitGroupEntity.id;
                            }
                            vm.defaultUint = vm.initDefaultUint;
                            if (result.data.tBaseUnitEntity) {
                                vm.formData.measureId = result.data.tBaseUnitEntity.id;
                            }

                            vm.formData.isCashEquivalent = (result.data.isCashEquivalent == 1) ? true : false;

                            if (result.data.mainCashflowEntity) {
                                vm.formData.mainProjectId = result.data.mainCashflowEntity.id;
                                vm.mainProjectContent = result.data.mainCashflowEntity.code + "-" + result.data.mainCashflowEntity.name;
                            }

                            if (result.data.clusCashflowEntity) {
                                vm.formData.clusterProjectId = result.data.clusCashflowEntity.id;
                                vm.cluProjectContent = result.data.clusCashflowEntity.code + "-" + result.data.clusCashflowEntity.name;
                            }
                        }
                    },
                    error: function (err) {
                        vm.$Modal.warning({
                            content: '服务器出错！'
                        });
                        // layer.alert("服务器出错", {icon: 0});
                    },
                })
            }
        }
    },
    watch: {
        mainProjectContent(val) {
            if (val == "") {
                this.formData.mainProjectId = '';
            }
        },
        cluProjectContent(val) {
            if (val == "") {
                this.formData.clusterProjectId = '';
            }
        }
    },
    mounted() {
        $('#subjectForm').validate();
        this.initFormValidate();
        jQuery.validator.addMethod("isWellSubjectCode", function (value, element) {
            var chrnum = /[0-9][^.]$/;
            return chrnum.test(value);
        }, "非法数据!");
        layui.use('element', function () {
            var element = layui.element;
        });
        let _this = this;
        $.ajax({
            url: contextPath + "/tbasecashflow/listAll",
            type: "POST",
            datatype: "json",
            success: function (data) {
                var arr = data.data;
                var datas = [];
                var y = 0;
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i].grade < 4) {
                        datas[y] = arr[i];
                        y++;
                    }
                }
                vm.banks = datas;
                // _this.nodeData = vm.banks;
                // // vm.$refs.my_tree.nodeData = vm.banks;
                // vm.$refs.my_tree.loadData();
            }
        })
        this.initCashFormValidate();
        jQuery.validator.addMethod("isChar", function (value, element) {
            var chrnum = /^([a-zA-Z0-9]+)$/;
            return chrnum.test(value);
        }, "编码格式错误!");
    }
})