new Vue({
    el: '#cost-allot-and-vou',
    data() {
        return {
            openTime: '',   //用于控制退出按钮
            formData: {
                id: 0,
                sobId: window.parent.userInfo.userCurrentOrganId,  // 组织id
                // sobId: 1,
                wageCategoryId: 0, // 工资类别id
                costAllocatioName: '', // 分配名称
                voucherWordId: 0, // 凭证字id
                summary: '', //摘要
                allocationProportion: 0,//分配比例
            },
            tableList: [    // 获取列表列的所有数据
                {
                    show: false,
                    showChange: false,
                    tabel: {
                        id: 0,
                        planId: 0,
                        planName: '',
                        defaultPlanId: 0,
                        defaultPlanName: '',
                        expenseDistributionId: 0,
                        wageItemsId: 0,
                        wageItemsName: '',
                        exacctSubjectId: '',
                        exacctSubjectName: '',
                        wageSubjectsId: '',
                        wageSubjectsName: '',
                    },
                    employeeList: [],//职员list
                    itemRelateDetailEntityList1: [],
                    itemRelateDetailEntityList2: [],
                }
            ],
            employeeList: [],
            disjunctor: true,//控制获取url上的id次数
            organizationList: [],//组织集合
            orgName:'',
            // orgName: '测试',
            allShow: false,
            showDepType: "",
            showDepTree: '',
            depTreeSetting: {
                data: {
                    key: {
                        name: "title"
                    }
                },
                callback: {
                    onClick: this.depTreeClickCallBack,
                    beforeClick: this.treeBeforeClick
                }
            },

            wageCategoryName: '',//类别名称
            voucherWordList: [],//凭证字
            wmItemsList: [],//工资项目list

            detailProjectList: {},//核算项目集合
            optsVal: [],
            selectIndex: '',   // 操作的当前索引
            subjectVisable: false,
            setting: {
                callback: {
                    onClick: this.clickEvent
                }
            },
            projectVisible: false,  //点击科目展开科目树
            projectTableList: [],

            projectTpye: "",
        }
    },
    created() {
        this.orgName = window.parent.userInfo.orgName;
        console.log("this.orgName",this.orgName)
    },
    mounted() {
        this.inint();
        this.openTime = window.parent.params && window.parent.params.openTime;
    },
    methods: {
        inint() {
            var _that = this;
            var id = _that.formData.wageCategoryId;
            $.ajax({
                url: contextPath + "/wmCostAllot/initializeChildPages",
                type: "post",
                async: false,
                success: function (data) {
                    if (data.code == '100100') {
                        console.log("data", data)
                        //获取默认的类别名称和id
                        _that.formData.wageCategoryId = data.data.category.id;
                        _that.wageCategoryName = data.data.category.categoryName;
                        //获取凭证字
                        _that.voucherWordList = data.data.tvde;
                        //设置默认凭证字
                        _that.formData.voucherWordId = _that.voucherWordList[0].id;
                        //工资项目名称和id
                        _that.wmItemsList = data.data.wmItemsList;
                        _that.employeeList = data.data.employeeList;
                        // _that.tableList[0].employeeList = data.data.employeeList[0];
                        _that.detailProjectList = data.data.detailProjectList;
                        if (_that.disjunctor) {
                            _that.disjunctor = false;
                            var id = getUrlParam('id');
                            if (id) {
                                _that.formData.id = parseInt(getUrlParamDecodeURI('id'));
                                _that.queryById();
                            }
                        }
                    }
                    // _that.$Message.info({
                    //     content: _text,
                    //     duration: 3
                    // });
                }
            });
        },
        //点击保存
        saveData() {
            var that = this;
            var list = that.tableList
            console.log("list", list)
            var itemList = [];
            for (var i = 0, len = list.length; i < len; i++) {
                var itemRelateDetailEntityList = [];
                var arr = list[i].itemRelateDetailEntityList1 || [];
                if (arr.length) {
                    for (var j = 0, k = arr.length; j < k; j++) {
                        if (arr[j].itemId == 0) {
                            that.$Modal.error({
                                title: '错误',
                                content: '存在核算项目未录入,无法保存'
                            })
                            return;
                        }
                        itemRelateDetailEntityList.push(arr[j]);
                    }
                }

                arr = list[i].itemRelateDetailEntityList2 || [];
                if (arr.length) {
                    for (var j = 0, k = arr.length; j < k; j++) {
                        if (arr[j].itemId == 0) {
                            that.$Modal.error({
                                title: '错误',
                                content: '存在核算项目未录入,无法保存'
                            })
                            return;
                        }
                        itemRelateDetailEntityList.push(arr[j]);
                    }
                }
                var text = {
                    id: list[i].tabel.id,
                    planId: list[i].tabel.planId,
                    planName: list[i].tabel.planName,
                    defaultPlanId: list[i].tabel.defaultPlanId,
                    defaultPlanName: list[i].tabel.defaultPlanName,
                    wageItemsId: list[i].tabel.wageItemsId,
                    wageItemsName: list[i].tabel.wageItemsName,
                    exacctSubjectId: list[i].tabel.exacctSubjectId,
                    exacctSubjectName: list[i].tabel.exacctSubjectName,
                    wageSubjectsId: list[i].tabel.wageSubjectsId,
                    wageSubjectsName: list[i].tabel.wageSubjectsName,
                }
                itemList.push({
                    "wmCostAllotDetailEntity": text,
                    "itemRelateDetailEntityList": itemRelateDetailEntityList
                })
            }
            // that.tableList.itemRelateDetailEntityList = itemRelateDetailEntityList;
            // var param = {"expenseDistributionVO":{"wmCostAllotEntity": that.formData, "wmCostAllotDetailEntitList": itemList}};
            var param = {"wmCostAllotEntity": that.formData, "wmCostAllotDetailEntitList": itemList};
            console.log(param)
            // console.log(JSON.stringify(param), "param")
            $.ajax({
                type: 'post',
                url: contextPath + "/wmCostAllot/saveOrUpdate",
                data: JSON.stringify(param),
                contentType: 'application/json;charset=utf-8',
                dataType: 'json',
                success: function (result) {
                    if (result.code == '100100') {
                        that.$Modal.success({
                            title: '成功',
                            content: '操作成功'
                        })
                        that.formData.id = result.data.id;
                    } else {
                        that.$Modal.error({
                            title: '错误',
                            content: result == null || result.msg == null || result.msg == '' ? '数据请求异常' : result.msg
                        })
                    }
                },
                error: function (ret) {
                    that.$Modal.error({
                        title: '错误',
                        content: '系统异常，请退出重试'
                    })
                }
            })
        },
        //根据id查询费用分配明细
        queryById() {
            var that = this;
            var id = that.formData.id;
            if (id == null || id == 0) {
                return;
            }
            $.ajax({
                type: 'post',
                url: contextPath + "/wmCostAllot/queryById",
                data: JSON.stringify(that.formData),
                contentType: 'application/json;charset=utf-8',
                dataType: 'json',
                success: function (result) {
                    if (result.code == '100100') {
                        console.log("result", result)
                        that.formData = result.data.wmCostAllotEntity;
                        var list = result.data.wmCostAllotDetailEntitList;
                        console.log("list", list)
                        console.log("that.tableList[i]", that.tableList)
                        var tableList = [];
                        for (var i = 0, len = list.length; i < len; i++) {
                            var tabel = list[i].wmCostAllotDetailEntity;
                            if (!tabel.planId) {
                                tabel.planId = 0;
                            }
                            var employeeList = that.employeeList[tabel.planId];
                            var itemList = list[i].itemRelateDetailEntityList;
                            if (itemList.length) {
                                var itemRelateDetailEntityList1 = [], itemRelateDetailEntityList2 = [];
                                for (var j = 0, lens = itemList.length; j < lens; j++) {
                                    if (itemList[j].relateType == 7) {
                                        itemRelateDetailEntityList1.push(itemList[j]);
                                    } else {
                                        itemRelateDetailEntityList2.push(itemList[j]);
                                    }
                                }
                            }
                            tableList.push({
                                "show": false,
                                "showChange": false,
                                "tabel": tabel,
                                "employeeList": employeeList,//职员list
                                "itemRelateDetailEntityList1": itemRelateDetailEntityList1,
                                "itemRelateDetailEntityList2":itemRelateDetailEntityList2,
                            })
                        }
                        that.tableList = tableList;
                    } else {
                        that.$Modal.error({
                            title: '错误',
                            content: result == null || result.msg == null || result.msg == '' ? '数据请求异常' : result.msg
                        })
                    }
                },
                error: function (ret) {
                    that.$Modal.error({
                        title: '错误',
                        content: '系统异常，请退出重试'
                    })
                }
            })
        },
        click_all() {
            this.tableList.forEach(row => {
                row.show = !this.allShow;
            })

        },
        // 切换本行是否选中
        change_tr(row) {
            let count = 0;
            var _allShow = false;
            row.show = !row.show;
            this.tableList.forEach(row => {
                if (row.show) count++;
            })
            if (count === this.tableList.length) {
                _allShow = true;
            } else {
                _allShow = false;
            }
        },
        actionBtnMth(_type) {
            var that = this;
            // 插入行 是在 选择 上面插入一条数据， 复制行 是在选择下面 插入一条数据并复制选择的数据值。 插入和复制都是单条，删除为多条
            console.log("_type", _type)
            var _info = {
                show: false,
                showChange: false,
                tabel: {
                    id: 0,
                    planId: 0,
                    planName: '',
                    defaultPlanId: 0,
                    defaultPlanName: '',
                    expenseDistributionId: 0,
                    wageItemsId: 0,
                    wageItemsName: '',
                    exacctSubjectId: '',
                    exacctSubjectName: '',
                    wageSubjectsId: '',
                    wageSubjectsName: '',
                },
                employeeList: [],
                itemRelateDetailEntityList1: [],
                itemRelateDetailEntityList2: [],
            };
            var _list = that.tableList;

            if (_type === 'addNew') {
                _list.push(_info);
            } else {
                var _f = _list.filter(row => row.show)
                if (!_f.length) {
                    that.$Message.info({
                        content: '请选择一条数据',
                        duration: 3
                    });
                    return;
                }
                that.tableList = that.tableList.filter(row => !row.show)
            }
        },
        refresh() {
            jQuery("#list").trigger("reloadGrid");  //刷新
        },
        // 科目下拉框
        showSubjectVisable(type, index) {
            this.subjectVisable = true;
            this.subjectTpye = type;
            this.selectIndex = index;
        },
        subjectClose() {
            this.subjectVisable = false;
        },
        subjectData(treeNode) {
            switch (this.subjectTpye) {
                //费用科目
                case 1:
                    console.log(treeNode.id, treeNode.subjectName)
                    this.tableList[this.selectIndex].tabel.exacctSubjectId = treeNode.id;
                    this.tableList[this.selectIndex].tabel.exacctSubjectName = treeNode.subjectName;
                    this.tableList[this.selectIndex].itemRelateDetailEntityList1 = [];

                    break;
                //工资科目
                case 2:
                    this.tableList[this.selectIndex].tabel.wageSubjectsId = treeNode.id;
                    this.tableList[this.selectIndex].tabel.wageSubjectsName = treeNode.subjectName;
                    this.tableList[this.selectIndex].itemRelateDetailEntityList2 =  [];
                    break;

            }
            // console.log(treeNode, '====treeNode');
            // var that = this;
            // this.card.assetSubjectId = treeNode.id;
            // this.assetSubjectName = treeNode.subjectName;

            // that.openData.relateSubjectId = treeNode.id;
            // that.openData.subjectCode = treeNode.subjectCode;
            // that.openData.subjectName = treeNode.subjectName;

        },

        depTreeClickCallBack(event, treeId, treeNode) {
            var that = this;
            console.log(event, treeId, treeNode);
            if (treeNode.children != null && treeNode.children.length != 0) {
                return;
            }
            that.tableList[that.selectIndex].tabel.planId = treeNode.id;
            that.tableList[that.selectIndex].tabel.planName = treeNode.title;
            that.tableList[that.selectIndex].showChange = false;
            that.tableList[that.selectIndex].tabel.defaultPlanId = 0;
            //选择部门后重置职员列表
            console.log("that.employeeList[treeNode.id]",that.employeeList[treeNode.id],that.employeeList)
            that.tableList[that.selectIndex].employeeList = that.employeeList[treeNode.id] || [];
        },
        getStaffList() {
            var that = this;
            //当职员列表不为空时则不需要请求后台获取列表
            if (that.tableList[that.selectIndex].employeeList.length) {
                return;
            }
            console.log(that.tableList, "that.tableList", that.selectIndex)
            var planId = that.tableList[that.selectIndex].tabel.planId;
            var _url = contextPath + '/wmCostAllot/getStaffList';
            $.ajax({
                type: 'POST',
                data: {wageCategoryId: that.formData.wageCategoryId, planId: planId},
                url: _url,
                success: function (result) {
                    console.log('result', result)
                    if (result.code == '100100') {
                        that.tableList.employeeList = result.data;
                    } else {
                        that.tableList.employeeList = [];
                        that.$Modal.warning({
                            title: '警告',
                            content: result.msg,
                        })
                        // that.tableList[that.selectIndex].tabel.planId = 0;
                    }
                },
                error: function (code) {
                    console.log(code);
                }
            });
        },
        //判断部门名称为空时的操作 将员工置空 部门id置空
        show(value, which, index) {
            if(!this.tableList[index].tabel.planName){
                this.tableList[index].tabel.planId = 0;
                this.tableList[index].employeeList = [];
            }
        },
        showTrees(value, which, index) {
            switch (which) {
                case 'showDepTree':
                    this.selectIndex = index;
                    // this.tableList.map(row=>{
                    //     row.showChange = false;
                    // })
                    let row = this.tableList[this.selectIndex];
                    if (row.showChange === true) {
                        row.showChange = false;
                        return;
                    }
                    row.showChange = !row.showChange;
                    break;
            }
        },
        //当单击父节点，返回false，不让选取
        treeBeforeClick(treeId, treeNode, clickFlag) {
            return !treeNode.isParent;
        },
        accessToAccountItems(type, index) {
            var that = this;
            var subjectId = 0;
            if (type == 1) {
                subjectId = that.tableList[index].tabel.exacctSubjectId;
            } else {
                subjectId = that.tableList[index].tabel.wageSubjectsId;
            }
            console.log("subjectId", subjectId)
            if (subjectId != null && subjectId != 0) {
                var _url = contextPath + '/wmCostAllot/getListBySubjectId';
                $.ajax({
                    type: 'POST',
                    data: {subjectId: subjectId, type: type},
                    url: _url,
                    success: function (result) {
                        console.log('result', result)
                        if (result.code == '100100') {
                            var arr = result.data;
                            if (arr.length) {
                                that.projectTableList = arr;
                                that.projectVisible = true;
                            }
                        }
                    },
                    error: function (code) {
                        console.log(code);
                    }
                });
            }

        },
        getItemName(type) {
            var that = this;
            return that.detailProjectList[type].label;
        },
        showProjectVisable(type, index) {
            //type 等于 2/4时表示选择核算项目
            console.log("index", index)
            var list1 = this.tableList[index].itemRelateDetailEntityList1 || [];
            var list2 = this.tableList[index].itemRelateDetailEntityList2 || [];
            if ((type == 1 && !list1.length) || (type == 2 && !list2.length)) {
                this.accessToAccountItems(type, index);
            } else {
                if (type == 1) {
                    this.projectTableList = this.tableList[index].itemRelateDetailEntityList1 || [];
                } else {
                    this.projectTableList = this.tableList[index].itemRelateDetailEntityList2 || [];
                }
                this.projectVisible = true;
            }
            this.projectTpye = type;
            this.selectIndex = index;
        },
        itemRelateDetailEntity(type, index) {
            if (!this.tableList) {
                return '';
            }
            var itemList = [];
            if (type == 1) {
                itemList = this.tableList[index].itemRelateDetailEntityList1 || [];
            } else {
                itemList = this.tableList[index].itemRelateDetailEntityList2 || [];
            }
            if (!itemList.length) {
                return '';
            }
            var text = '';
            for (var i = 0, len = itemList.length; i < len; i++) {
                if (i != 0) {
                    text += '/';
                }
                text += this.detailProjectList[itemList[i].itemClassId].label + '-';
                var list = this.detailProjectList[itemList[i].itemClassId].list;
                text += list[itemList[i].itemId].name;
            }
            return text;
        },
        closeWindow: function () {
            //关闭当前页签
            var name = '费用分配与凭证';
            window.parent.closeCurrentTab({'name': name, 'openTime': this.openTime, 'url': this.openTime, exit: true})
        },
        saveFun() {
            if (this.projectTpye == 1) {
                this.tableList[this.selectIndex].itemRelateDetailEntityList1 = this.projectTableList || [];
            } else {
                this.tableList[this.selectIndex].itemRelateDetailEntityList2 = this.projectTableList || [];
            }
            console.log("this.tableList", this.tableList)
            this.cancelFun();
        },
        cancelFun() {
            this.projectVisible = false;
        },
    }
})