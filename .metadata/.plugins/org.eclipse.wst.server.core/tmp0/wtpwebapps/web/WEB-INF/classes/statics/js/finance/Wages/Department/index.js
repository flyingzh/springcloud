var ve = new Vue({
    el: '#department',
    data() {
        let This = this;
        return {
            categoryList: [],
            category: null,
            tid: 'zTreeAssetStorageLocation',
            // treeUrl:contextPath + "/falocation/initTree",
            treeUrl: '',
            isDisabled: true,
            formData: {
                id: '',
                code: '',
                name: '',
                sobId: '',
                editable: '1',
                remark: '',
                pid: '',
                computingTxt: '',
            },
            leftMenuList: [
                {'objectType': '应付合计', 'id': '001'},
                {'objectType': '基本工资', 'id': '002'},
                {'objectType': '提成', 'id': '003'}
            ],
            objectTypeId: '',
            data2: [
                {
                    title: 'parent 1',
                    expand: true,
                    children: [
                        {
                            title: 'parent 1-1',
                            expand: true,
                            children: [
                                {
                                    title: 'leaf 1-1-1'
                                },
                                {
                                    title: 'leaf 1-1-2'
                                }
                            ]
                        },
                        {
                            title: 'parent 1-2',
                            expand: true,
                            children: [
                                {
                                    title: 'leaf 1-2-1'
                                },
                                {
                                    title: 'leaf 1-2-1'
                                }
                            ]
                        }
                    ]
                }
            ],
            data3: [
                {
                    title: 'parent 1',
                    expand: true,
                    children: [
                        {
                            title: 'parent 1-1',
                            expand: true,
                            children: [
                                {
                                    title: 'leaf 1-1-1'
                                },
                                {
                                    title: 'leaf 1-1-2'
                                }
                            ]
                        },
                        {
                            title: 'parent 1-2',
                            expand: true,
                            children: [
                                {
                                    title: 'leaf 1-2-1'
                                },
                                {
                                    title: 'leaf 1-2-1'
                                }
                            ]
                        }
                    ]
                }
            ],
            tranChcekList: [],
            tranChcekList2: [],
            initForm: {
                id: '',
                code: '',
                name: '',
                sobId: '',
                editable: '1',
                remark: '',
                pid: '',
            },
            organizationList: [],
            //收支类型树形
            nodes: [],
            setting: {
                callback: {
                    onClick: this.clickEvent,
                }
            },
            curEntity: {},
            selected: '',
            openTime: '',
            treeSetting: {
                callback: {
                    onClick: this.treeClickCallBack,
                    beforeClick: this.treeBeforeClick
                }
            },
        }
    },
    methods: {


        //获取整条数据链
        getParent(array, childs, ids) {
            var that = this;
            for (let i = 0; i < array.length; i++) {
                let item = array[i];
                if (Number(item.id) === Number(ids)) {
                    childs.push(item);
                    return childs;
                }
                if (item.children && item.children.length > 0) {
                    childs.push(item);
                    let rs = that.getParent(item.children, childs, ids);
                    if (rs) {
                        return rs;
                    }
                    else {
                        childs.remove(item);
                    }
                }
            }
            return false;
        },


        //arr1去重 es6的set方法
        dedupe(array) {
            return Array.from(new Set(array));
        },


        listCategory() {
            let that = this;
            $.ajax({
                url: contextPath + '/category/list',
                type: "post",
                success: function (data) {
                    that.categoryList = data.data;
                }
            })
        },
        getSelectedCategoryId() {
            let that = this;
            $.ajax({
                url: contextPath + '/category/selectedid',
                type: "post",
                success: function (data) {
                    that.categoryId = data.data;
                }
            })
        },
        getSelectedCategory() {
            let that = this;
            $.ajax({
                url: contextPath + '/category/selected',
                type: "post",
                success: function (data) {
                    that.category = data.data;
                }
            })
        },
        imports() {
            let that = this;
            if (that.category == null) {
                that.wrapAlert("请先维护并选择工资类别！");
                return false;
            }
            this.$Modal.confirm({
                title: '提示信息',
                content: '<p>确定将勾选的数据导入到类别【'+that.category.categoryName+'】下？</p>',
                loading: true,
                onOk: () => {
                    var params = that.$refs.vtree1.getCheckedNodes();
                    console.log(params);

                    //获取所有选中节点
                    // let params = that.$refs.tree.getCheckedNodes();
                    //所有数据
                    //             let allData = ['所有数据'];
                    //循环执行所有选中的节点链，放到selectedNodes数组里
                    let selectedNodes = [];
                    for (let i = 0; i < params.length; i++) {
                        //单条数据链
                        let aData = that.getParent(that.data2, [], params[i].id);//方法入口在这里
                        for (let y = 0; y < aData.length; y++) {
                            //拆分成单个json数组放到selectedNodes里
                            selectedNodes.push(aData[y]);
                        }
                    }
                    selectedNodes = that.dedupe(selectedNodes);
                    console.log(selectedNodes, "==selectedNodes-----------------------------");
                    if (selectedNodes.length == 0) {
                        return false;
                    }
                    let ids = [];
                    selectedNodes.forEach(item => {
                        ids.push(item.id);
                    })
                    $.ajax({
                        url: contextPath + "/dept/import",
                        type: "post",
                        contentType: "application/json",
                        data: JSON.stringify(ids),
                        success: function (data) {
                            if (data.data) {
                                that.wrapAlert("导入成功！");
                                that.initPage();
                            }
                        }
                    });
                    this.$Modal.remove();
                }
            });
        },
        exports() {
            let that = this;

            var params = that.$refs.vtree2.getCheckedNodes();
            console.log(params);

            if (params.length == 0) {
                that.wrapAlert("请从已导入的部门数据里勾选需要移除的部门!");
                return false;
            }

            this.$Modal.confirm({
                title: '提示信息',
                content: '<p>确定要讲勾选的数据从当前类别【'+that.category.categoryName+'】下移除吗？</p>',
                loading: true,
                onOk: () => {
                    let ids = [];
                    params.forEach(item => {
                        ids.push(item.id);
                    });
                    console.log(ids, "ids------------------------");
                    $.ajax({
                        url: contextPath + "/dept/delete",
                        type: "post",
                        contentType: "application/json",
                        data: JSON.stringify(ids),
                        success: function (data) {
                            if (data.data) {
                                that.wrapAlert("删除成功！");
                                that.initPage();
                            } else {
                                that.wrapAlert("选择删除的部门下已有职员数据，不能删除！");
                            }
                        }
                    });
                    this.$Modal.remove();
                }
            });



        },

        //提示alert
        wrapAlert (msg) {
            this.$Message.info({
                content: msg,
                duration: 3
            });
        },


        actionFun(_ty) {
            console.log(_ty, '=========_ty============');
        },
        transferCheckMth(_ty) {
            console.log(_ty, '=========transferCheckMth============');
            this.tranChcekList = _ty;
        },
        transferCheckMth2(_ty) {
            console.log(_ty, '=========transferCheckMth2============');
            this.tranChcekList2 = _ty;
        },

        initTree() {
            let _vm = this;
            $.ajax({
                type: 'post',
                url: contextPath + "/falocation/initTree",
                data: null,
                success: function (ret) {
                    if (ret.code == '100100') {
                        let dataList = ret.data;
                        /*for(var i = 0;i<dataList.length;i++){
                            dataList[i].pId = dataList[i].pid;
                            dataList[i].open = true;
                        }*/
                        _vm.nodes = dataList;
                    } else {
                        _vm.$Modal.error({
                            title: '错误',
                            content: '操作失败：' + ret.msg
                        })
                    }
                }
            })
        },

        initPage() {
            var that = this;
            $.ajax({
                url: contextPath + "/dept/notimported",
                type: "post",
                success: function (data) {
                    that.data2 = data.data;
                }
            });
            $.ajax({
                url: contextPath + "/dept/imported",
                type: "post",
                success: function (data) {
                    that.data3 = data.data;
                }
            });
            // var _data = [
            //     {
            //         title: 'parent 1',
            //         expand: true,
            //         children: [
            //             {
            //                 title: 'parent 1-1',
            //                 expand: true,
            //                 children: [
            //                     {
            //                         title: 'leaf 1-1-1'
            //                     },
            //                     {
            //                         title: 'leaf 1-1-2'
            //                     }
            //                 ]
            //             },
            //             {
            //                 title: 'parent 1-2',
            //                 expand: true,
            //                 children: [
            //                     {
            //                         title: 'leaf 1-2-1'
            //                     },
            //                     {
            //                         title: 'leaf 1-2-1'
            //                     }
            //                 ]
            //             }
            //         ]
            //     }
            // ];
        },
        _initDataList(_allList) {

        },
        codeCheck(value) {
            let newData = value.replace(/\./g, ".");
            if (!isNaN(newData)) {
                return true;
            }
            return false;
        },

        //退出
        cancelFun: function () {
            window.parent.closeCurrentTab({ openTime: this.openTime, exit: true });
            // window.parent.closeCurrentTab({ name: '基础资料-存放地点', openTime: this.openTime, exit: true })
        },
        //刷新
        refreshLocation() {
            this.listCategory();
            this.getSelectedCategory();
            this.initPage();
        },
        // 默认选择节点
        selectNodes() {
            var treeObj = $.fn.zTree.getZTreeObj(this.tid);		    //获取节点
            var nodes = treeObj.getNodes();
            if (nodes.length > 0) {
                treeObj.selectNode(nodes[0]);  //默认选中第一个
                this.clickEvent(null, null, nodes[0]);
            }
        },
    },
    watch: {
        'category.id'(val, oldVal) {
            let that = this;
            $.ajax({
                url: contextPath + "/category/select/" + val,
                type: "post",
                async: false,
                success: function (data) {
                    // if (data.data) {
                    //     alert("选择成功！");
                    // } else {
                    //     alert("选择失败！");
                    // }
                    that.initPage();
                }

            });
        }
    },
    mounted() {
        this.initPage();
        this.listCategory();
        this.getSelectedCategory();
        this.openTime = window.parent.params && window.parent.params.openTime;
    },
});