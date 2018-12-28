var ve = new Vue({
    el: '#asset-class', /*资产类别*/
    data () {
        return {
            tid: 'zTreeAssetClass',
            openTime: '',
            writeIsChange: true,
            parentNoNeeded: true,
            baseData: {
                sobId: 0,
                measurementsList: [],
            },
            addData: {
                id: 0,
                advancedMethod: '',
                className: '',
                durableYears: '',
                measureGroupId: '',
                measurementsId: '',
                fixedAssetsSubjectName: '',
                fixedAssetsSubject: '',
                impairmentPreparationSubjectName: '',
                impairmentPreparationSubject: '',
                classCode: '',
                parentId: 0,
                parentCode: '',
                netResidualRate: '',
                cumulativeDiscountSubjectName: '',
                cumulativeDiscountSubject: '',
                cardCodeRule: '',
                isDepreciate: 2,
                measurementsList: []
            },
            advancedMethodList: [],
            organizationList: [],
            nodesList: {},

            //左侧树形
            nodes: [],
            setting: {
                callback: {
                    onClick: this.clickEvent,
                }
            },
            isDisabled: true,
            selected: '',
            // selNode:[],
            showdepreciation: false,
            treeUrl: '',
            treeSetting: {
                callback: {
                    onClick: this.treeClickCallBack,
                    //当单击父节点，返回false，不让选取
                    //beforeClick: this.treeBeforeClick
                }
            },
            canAdd: false,
            canEdit: false,
            showAssetClass: false,
            subjectVisable: false,
            subjectTpye: ''
        }
    },
    methods: {
        // 科目下拉框
        showSubjectVisable (type) {
            this.subjectVisable = true;
            console.log("type", type)
            this.subjectTpye = type;
        },
        subjectClose () {
            this.subjectVisable = false;
        },
        subjectData (treeNode) {
            let _vm = this;
            console.log(treeNode, '====treeNode');

            if ($.isEmptyObject(treeNode) ) {
                _vm.$Message.warning({
                    content: '不能选择父级科目作为核算科目!',
                    duration: 3,
                    closable: true});
                return;
            }

            switch (this.subjectTpye) {
                case 1:
                    _vm.addData.fixedAssetsSubject = treeNode.id;
                    _vm.addData.fixedAssetsSubjectName = `${treeNode.subjectCode} ${treeNode.subjectName}`;
                    break;
                case 2:
                    _vm.addData.impairmentPreparationSubject = treeNode.id;
                    _vm.addData.impairmentPreparationSubjectName = `${treeNode.subjectCode} ${treeNode.subjectName}`;
                    break;
                case 3:
                    _vm.addData.cumulativeDiscountSubject = treeNode.id;
                    _vm.addData.cumulativeDiscountSubjectName = `${treeNode.subjectCode} ${treeNode.subjectName}`;
                    break;
                default:
                    break;
            }
            // that.openData.relateSubjectId = treeNode.id;
            // that.openData.subjectCode = treeNode.subjectCode;
            // that.openData.subjectName = treeNode.subjectName;

        },

        treeClickCallBack (event, treeId, treeNode) {
            let _vm = this;
            console.log(treeNode, '====treeClickCallBack');
            _vm.addData.parentCode = treeNode.code;
            _vm.addData.parentId = treeNode.id;
            _vm.showAssetClass = false;
            // this.loadTestEmp(treeNode.id)
        },
        treeBeforeClick (treeId, treeNode, clickFlag) {
            return !treeNode.isParent; //当单击父节点，返回false，不让选取
        },
        showAssetClassTree (value) {
            if (this.showAssetClass === true) {
                this.showAssetClass = false;
                return;
            }
            this.showAssetClass = value;
        },
        _nullData (_t) {
            if (_t) {
                return _t;
            } else {
                return '';
            }
        },
        formartMoney (value) {
            return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
        },
        modify (type) {
            var _vm = this;

            if (type === 'add') {
                //新增按钮
                _vm.clearAddData();
                _vm.writeIsChange = false;
            } else if (type === 'edit') {
                if (!_vm.addData.id) {
                    _vm.$Message.warning({
                        content: '请先选择一条数据.',
                        duration: 3
                    });
                    return;
                }
                _vm.writeIsChange = false;
            }
        },

        delFun () {
            //点击删除
            var _vm = this;
            if (!_vm.addData.id) {
                // layer.alert('请选择一条数据.');
                _vm.$Modal.info({
                    title: '提示信息',
                    content: '<p>请选择一条数据.</p >'
                });
                return;
            }
            console.log("删除前的id");
            console.log(_vm.addData.id);
            $.ajax({
                type: 'post',
                url: contextPath + "/assetsclassescontroller/deleteAC",
                data: { 'id': _vm.addData.id },
                success: function (result) {
                    if (result.code == '100100') {
                        _vm.$Message.success({
                            content: result.msg,
                            duration: 0.8,
                            closable: true
                        });
                        _vm.delayRefreshFun();
                    } else {
                        // layer.alert(result.msg);
                        _vm.$Modal.warning({
                            title: '提示信息',
                            content: '<p>' + result.msg + '</p >'
                        });
                    }
                }
            });
        },

        //点击保存
        saveFun: function () {
            let _vm = this;
            let data = _vm.addData;

            if (this.writeIsChange) {
                _vm.$Message.warning({
                    content: '请点新增或者修改.',
                    duration: 3
                });
                return;
            }

            /*fixedAssetsSubjectName: '',
                fixedAssetsSubject: '',
                impairmentPreparationSubjectName: '',
                impairmentPreparationSubject: '',
                classCode: '',
                parentId: 0,
                parentCode: '',
                netResidualRate: '',
                cumulativeDiscountSubjectName: '',
                cumulativeDiscountSubject: '',*/
            if (!data.fixedAssetsSubjectName){
                data.fixedAssetsSubject = '';
            }

            if (!data.impairmentPreparationSubjectName){
                data.impairmentPreparationSubject = '';
            }

            if (!data.cumulativeDiscountSubjectName){
                data.cumulativeDiscountSubject = '';
            }


            if (!data.className || !data.classCode) {
                // layer.alert("名称和编码为必填项!");
                _vm.$Modal.info({
                    title: '提示信息',
                    content: '<p>名称和编码为必填项!</p >'
                });
                return;
            }

            console.log("新增/修改时准备传回后台的参数 === ");
            console.log(data);
            $.ajax({
                type: 'post',
                url: contextPath + "/assetsclassescontroller/saveOrUpdate",
                data: JSON.stringify(data),
                contentType: 'application/json;charset=utf-8',
                dataType: 'json',
                success: function (result) {
                    if (result.code == '100100') {
                        _vm.writeIsChange = true;
                        _vm.addData.id = result.data.id;
                        console.log("保存/修改成功后返回的id值===" + _vm.addData.id);
                        _vm.$Message.success({
                            content: result.msg,
                            duration: 1,
                            closable: true
                        });
                        _vm.delayRefreshFun();
                    } else {
                        // layer.alert(result.msg);
                        _vm.$Modal.warning({
                            title: '提示信息',
                            content: '<p>' + result.msg + '</p >'
                        });
                    }
                }
            });
        },

        cancelFun: function () {
            //退出,关闭当前页签
            var name = '资产类别';
            window.parent.closeCurrentTab({ name: name, openTime: this.openTime, exit: true })

        },
        refreshFun () {
            console.log("刷新refreshFun()");
            window.location.reload();
            /*
            //刷新按钮
            var _vm = this;
            _vm.initAssetsClassesTree();
            _vm.showAssetClass = false;
            if (!_vm.addData.id){
                return ;
            }
            $.ajax({
                type: 'post',
                url: contextPath + "/assetsclassescontroller/getClassesById",
                data: {'id':_vm.addData.id},
                success: function (ret) {
                    console.log(ret);
                    if (ret.code == '100100') {
                        _vm.$Message.loading({
                            content: '查询中...',
                            duration: 0.5,
                            closable: true});
                        _vm.addData = ret.data;
                    } else {
                        layer.alert(ret.msg)
                    }
                }
            })
        */},
        init () {
            //初始化页面数据
            let _vm = this;
            _vm.advancedMethodList = getCodeList("fixedAssets_depreciation");
            if (_vm.advancedMethodList.length === 0) {
                // layer.alert('计量单位数据初始化失败!');
                _vm.$Modal.warning({
                    title: '提示信息',
                    content: '<p>计量单位数据初始化失败!</p >'
                });
                return;
            }
            //_vm.addData.advancedMethod = _vm.advancedMethodList[0].value;

            $.ajax({
                type: 'post',
                url: contextPath + "/assetsclassescontroller/initPage",
                data: null,
                success: function (ret) {
                    if (ret.code != '100100') {
                        let msg = '数据初始化失败!';
                        if (ret.hasOwnProperty("data")) {
                            msg = ret.msg;
                        }
                        // layer.alert(msg);
                        _vm.$Modal.warning({
                            title: '提示信息',
                            content: '<p>' + msg + '</p >'
                        });
                        return;
                    }

                    let initInfo = ret.data;
                    _vm.initAssetsClassesTree();
                    _vm.organizationList = initInfo.orgList;
                    _vm.baseData.measureGroupList = initInfo.measureGroupList;
                    // if (_vm.baseData.measureGroupList && _vm.baseData.measureGroupList.length !==0){
                    //     _vm.addData.measureGroupId = _vm.baseData.measureGroupList[0].id;
                    // }
                    //_vm.baseData.measurementsList = initInfo.measurementsList;
                    // if(_vm.baseData.measurementsList && _vm.baseData.measurementsList.length !==0){
                    //     _vm.addData.measurementsId = _vm.baseData.measurementsList[0].id;
                    // }
                    _vm.$nextTick(function () {
                        _vm.baseData.sobId = initInfo.sobId;
                    });
                }
            })
            setTimeout(function(){ _vm.selectNodes(); }, 200);
        },
        // onAsyncSuccess() {
        //     let _vm = this;
        //     var treeObj = $.fn.zTree.getZTreeObj(_vm.tid);//ztree树的ID
        //     var node = treeObj.getNodeByParam("id", _vm.selected);//根据ID找到该节点
        //     treeObj.selectNode(node);//根据该节点选中
        //     $.ajax({
        //         type: 'post',
        //         url: contextPath + "/assetsclassescontroller/getClassesById",
        //         data: {'id': _vm.selected},
        //         success: function (ret) {
        //             console.log(ret);
        //             if (ret.code == '100100') {
        //                 _vm.$Message.loading({
        //                     content: '查询中...',
        //                     duration: 0.5,
        //                     closable: true});
        //                _vm.addData = ret.data;
        //             } else {
        //                 layer.alert(ret.msg)
        //             }
        //         }
        //     })
        // },
        clickEvent (event, treeId, treeNode) {
            // console.log(event, treeId, treeNode)
            let _vm = this;
            // if (treeNode.children != undefined) {
            //     _vm.isDisabled = true;
            //     _vm.nodeSelected = false;
            // } else {
            _vm.isDisabled = false;
            let selnode = _vm.$ztree.getSelectedNodes();
            // console.log(selnode);
            _vm.selected = selnode[0].id;
            console.log(_vm.selected);
            // _vm.selNode = selnode;
            $.ajax({
                type: 'post',
                url: contextPath + "/assetsclassescontroller/getClassesById",
                data: { 'id': _vm.selected },
                success: function (ret) {
                    console.log(ret);
                    if (ret.code == '100100') {
                        _vm.$Message.loading({
                            content: '查询中...',
                            duration: 0.5,
                            closable: true
                        });
                        console.log("getClassesById准备赋值: ");
                        _vm.addData = ret.data;
                        _vm.addData.netResidualRate = floatObj.multiply(_vm.addData.netResidualRate, 100,2);
                        _vm.baseData.measurementsList = _vm.addData.measurementsList;
                    } else {
                        // layer.alert(ret.msg)
                        _vm.$Modal.warning({
                            title: '提示信息',
                            content: '<p>' + ret.msg + '</p >'
                        });
                    }
                }
            })
            //}
        },

        initAssetsClassesTree () {
            console.log("initAssetsClassesTree");
            let _vm = this;
            $.ajax({
                type: 'post',
                url: contextPath + "/assetsclassescontroller/assetsClassesList",
                data: null,
                success: function (ret) {
                    if (ret.code == '100100') {
                        _vm.nodes = ret.data;
                        // if (_vm.addData.id != null && _vm.addData.id != ''&& _vm.addData.id <=0) {
                        //     _vm.$nextTick(function () {
                        //         _vm.onAsyncSuccess();
                        //     })
                        // }
                    } else {
                        // layer.alert(ret.msg)
                        _vm.$Modal.warning({
                            title: '提示信息',
                            content: '<p>' + ret.msg + '</p >'
                        });
                    }
                }
            })
        },

        measureChange (item) {
            //切换计量单位组

            if (!item) {
                //如果计量单位组id为null或者为0
                return;
            }

            let _vm = this;
            $.ajax({
                type: 'post',
                url: contextPath + '/assetsclassescontroller/measureChange',
                data: { 'measureGroupId': item },
                success: function (result) {
                    if (result.code == '100100' && result.data != null) {
                        _vm.baseData.measurementsList = result.data;
                        _vm.$refs.addMeasurementsId.reset();
                        _vm.$nextTick(function () {
                            if (_vm.baseData.measurementsList && _vm.baseData.measurementsList.length !== 0) {
                                _vm.addData.measurementsId = _vm.baseData.measurementsList[0].id;
                            }
                        })
                    } else {
                        let _msg = '切换计量单位组异常!';
                        if (result.msg) {
                            _msg = result.msg;
                        }
                        _vm.$Message.error({
                            content: _msg,
                            duration: 3,
                            closable: true
                        });
                    }
                }
            });
        },

        clearAddData () {
            //清空数据
            let dt = this.addData;
            dt.id = 0;
            dt.className = '';
            dt.durableYears = '';
            dt.fixedAssetsSubjectName = '';
            dt.fixedAssetsSubject = '';
            dt.impairmentPreparationSubjectName = '';
            dt.impairmentPreparationSubject = '';
            dt.classCode = '';
            dt.parentId = '';
            dt.parentCode = '';
            dt.netResidualRate = '';
            dt.cumulativeDiscountSubjectName = '';
            dt.cumulativeDiscountSubject = '';
            dt.cardCodeRule = '';
            dt.isDepreciate = 2;
            dt.advancedMethod = '';
            dt.measureGroupId = '';
            dt.measurementsId = '';

        },

        delayRefreshFun () {
            var _vm = this;
            //延时刷新页面
            setTimeout(
                function () {
                    //调用刷新方法
                    _vm.refreshFun();
                }, 800);
        },

        classCodeChange: function () {
            let _vm = this;
            let classCode = _vm.addData.classCode;
            console.log(classCode);
            if (classCode == '01' || classCode == '02' || classCode == '03' || classCode == '04' || classCode == '05') {
                _vm.parentNoNeeded = true;
            } else {
                _vm.parentNoNeeded = false;
            }
        },
        // 默认选择节点
        selectNodes(){
            var treeObj = $.fn.zTree.getZTreeObj(this.tid);		    //获取节点
            var nodes = treeObj.getNodes();
            if (nodes.length>0){
                treeObj.selectNode(nodes[0]);  //默认选中第一个
                this.clickEvent(null,null,nodes[0]);
            }
        },
    },
    //获取会计科目列表
    mounted () {
        this.init();
        this.openTime = window.parent.params && window.parent.params.openTime;

        // this.pageInit();
        // this.openTime = window.parent.params && window.parent.params.openTime;
    },

    watch: {

        // 'addData.parentCode': function (val) {
        //     if (val==='01'||val==='02'||val==='03'||val==='04'||val==='05'){
        //         this.parentNoNeeded = true;
        //     }
        // },
    }
});