var currencyVm = new Vue({
    el: '#paraLevel',
    data() {
        let This = this;
        return {
            isSearchHide: true, //搜索栏
            isDisable: true,
            openTime: '',
            certificateType: [],//金料成色
            dataValue:[],
            body: {
                commodityCode: "",
                code: "",
                commodityId: "",
                createTimeEnd: "",
                createTimeStart: "",
                ktcStatus: 0,
            },
            goldTableHeader: [],
            goldBoms: [],
            goldAssistAttr: [],
            goldAssistAttrAll: [],
            goldItemList: [],

            stonesTableHeader: [],
            stonesBoms: [],
            stonesAssistAttr: [],
            stonesAssistAttrAll: [],
            stonesItemList: [],

            partTableHeader: [],
            partBoms: [],
            partAssistAttr: [],
            partAssistAttrAll: [],
            partItemList: [],


            weightUnit: [],

            isShow: false,
            isLock: false,
            isAdd: false,
            reload: false,
            selected: [],
            offices: [],//部门
            standBOM: [],
            //setting:配置相关
            setting1: {
                data: {
                    simpleData: {
                        enable: true,
                        idKey: "id",
                        pIdKey: "parentId",
                        rootPId: -1
                    },
                    key: {
                        name: "commodityCode"

                    },
                },
                //callback内定义事件和回调函数，更多事件请参考官方文档。
                callback: {
                    onClick: this.clickEvent,
                }
            },
            formType: [
                {
                    value: 1,
                    name: '主石'
                },
                {
                    value: 0,
                    name: '副石'
                }
            ],
            type: [
                {
                    value: 1,
                    label: '客户BOM'
                },
                {
                    value: 0,
                    label: '标准BOM'
                }
            ],
            weightWayArr: [
                {
                    value: 1,
                    name: '范围值'
                },
                {
                    value: 0,
                    name: '固定值'
                }
            ],
            checkStatus: [
                {
                    value: 1,
                    label: '已审核'
                },
                {
                    value: 2,
                    label: '审核中'
                },
                {
                    value: 0,
                    label: '待审核'
                }
            ],
            add: {},
            data_config: {
                url: contextPath + '/tbasebom/list',
                colNames: ['BOM编号', 'BOM类型', '父项商品编码', '父项商品名称', '状态', '创建日期', '审核日期'],
                // colNames: ['BOM编号', 'BOM类型', '所属组织', '父项商品编码','父项商品名称', '状态', '创建日期', '审核日期'],
                colModel: [
                    {
                        name: 'code', index: 'code', width: 90, align: "left",
                        formatter: function (value, grid, rows, state) {
                            $(document).off('click', ".detail" + value).on('click', ".detail" + value, function () {
                                This.detailClick({ value, grid, rows, state })
                            });
                            let myCode = `<a class="detail${value}">${value}</a>`;
                            return myCode;
                        }
                    },
                    {
                        name: 'type', index: '', width: 90, align: "left",
                        formatter: function (value, grid, rows, state) {
                            return value == 1 ? "客户BOM" : "标准BOM";
                        }
                    },
                    /*  {
                          name: 'organizationId', index: '', width: 80, align: "left",
                          formatter: function (value, grid, rows, state) {
                              let officeName ='金大祥';
                              currencyVm.offices.forEach(function(item,i,array){
                                  if(item.value == value){
                                      officeName = item.label;
                                      return false;
                                  }
                              })
                              return officeName;
                          }
                      },*/
                    { name: 'commodityCode', index: '', width: 80, align: "left" },
                    { name: 'commodityName', index: '', width: 80, align: "left" },
                    {
                        name: 'checkStatus', index: '', width: 80, align: "left",
                        formatter: function (value, grid, rows, state) {
                            let status = '';
                            currencyVm.checkStatus.forEach(function (item, i, array) {
                                if (item.value == value) {
                                    status = item.label;
                                    return false;
                                }
                            })
                            return status;
                        }
                    },
                    { name: 'createTime', index: '', width: 150, align: "left", sortable: false },
                    { name: 'updateTime', index: '', width: 150, align: "left", sortable: false }
                ]
            },
        }
    },
    methods: {
        hideSearch() {
            this.isSearchHide = !this.isSearchHide;
            $(".chevron").css("top", "")
        },
        init() {
            let that = this;
            that.certificateType = getCodeList("base_Condition");//加载金料成色
            //初始化单位
            $.ajax({
                type: 'POST',
                url: contextPath + '/tbaseunitgroup/listByNoPage',
                success: function (result) {
                    that.weightUnit = result.data;
                }
            });

            // 初始化表头
            $.ajax({
                url: contextPath + '/tBaseAssistAttr/queryAll?rangeUse=attr_ranges_gold',
                type: 'POST',
                dataType: "json",
                success(data) {
                    that.goldTableHeader = that.sortTabalHeader(data.data);
                },
                error() {
                    alert("服务器出错")
                }
            })
            $.ajax({
                url: contextPath + '/tBaseAssistAttr/queryAll?rangeUse=attr_ranges_stone',
                type: 'POST',
                dataType: "json",
                success(data) {
                    that.stonesTableHeader = that.sortTabalHeader(data.data);
                },
                error() {
                    alert("服务器出错")
                }
            })
            $.ajax({
                url: contextPath + '/tBaseAssistAttr/queryAll?rangeUse=attr_ranges_part',
                type: 'POST',
                dataType: "json",
                success(data) {
                    that.partTableHeader = that.sortTabalHeader(data.data);
                },
                error() {
                    alert("服务器出错")
                }
            })

        },
        // 动态列select的option值的生成
        initBom(bomdata, header, attrAll) {
            for (let i = 0; i < bomdata.length; i++) {
                let arr = bomdata[i].assistAttrList;
                let length = arr.length;
                attrAll.push(arr);
                for (let k = 0; k < header.length; k++) {
                    header[k].data[i] == [];
                    for (let j = 0; j < length; j++) {
                        if (arr[j].id === header[k].id) {
                            header[k].data.splice(i, 1, arr[j].tBaseAssistAttrValuess)
                        }
                    }
                }
            }
        },
        // 为动态表头数据添加属性，用于动态列值的对应
        sortTabalHeader(header) {
            header.map((item) => {
                item["data"] = [];
                item["isPush"] = false;
            })
            return header;
        },
        // 动态生成动态数据的select双向数据绑定list一行
        initTableData(header, attr) {
            let arr = [];
            for (let i = 0; i < header.length; i++) {
                arr.push({
                    attrValueIds: '',
                    id: header[i].id,
                    isPush: ''
                })
            }
            attr.push(arr);
        },
        // 所有的动态双向绑定
        allTable(header, attr, bom) {
            bom.map((el, i) => {
                this.initTableData(header, attr)
            })
        },
        // 双向数据绑定回显内容
        showSelectOption(bom, attr) {
            bom.map((el, i) => {
                el.assistAttrList.map((val, idx) => {
                    attr[i].map((value, index) => {
                        if (value.id === val.id) {
                            value.attrValueIds = val.attrValueIds;
                        }
                    })
                })
            })
        },
        // 生成list
        itemList(bom, list) {
            bom.map((el, i) => {
                let {
                    commodityCode: code,
                    commodityName: name,
                    commodityId: id
                } = el;
                list.push([{
                    code,
                    name,
                    id
                }])
            })
        },
        // 生成石料list
        itemStoneList(bom, list) {
            bom.map((el, i) => {
                let {
                    commodityCode: code,
                    commodityName: name,
                    commodityId: id
                } = el;
                list.push([{
                    code,
                    name,
                    id
                }])
            })
        },

        search() {
            this.reload = !this.reload;
        },
        add_click() {
            this.isShow = true;
            this.isAdd = true;
        },

        cancel() {
            // 初始化
            this.isShow = false;
            this.isLock = false;
            this.isAdd = false;
            this.initAddBody();
        },
        cancle_out() {
            window.parent.closeCurrentTab({ exit: true, openTime: this.openTime });
        },
        changeDate(value) {
            this.body.createTimeStart = value[0]=="" ? "" : (value[0].replace(/\//g, '-') + ' 00:00:00');
            this.body.createTimeEnd = value[1]=="" ? "" : (value[1].replace(/\//g, '-') + ' 23:59:59');
        },
        clear() {
            //清空树的选中
            let selectedNodes = $.fn.zTree.getZTreeObj("tree").getSelectedNodes();
            $.fn.zTree.getZTreeObj("tree").cancelSelectedNode(selectedNodes[0]);
            // this.$refs.start.date = '';
            // this.$refs.end.date = '';
            this.dataValue = [];
            this.body = {
                commodityCode: "",
                code: "",
                commodityId: "",
                createTimeEnd: "",
                createTimeStart: "",
                ktcStatus: 0,
            };
        },
        view() {
            if (this.selected.length !== 1) {
                layer.alert("查看只能对单条数据进行操作", { icon: 0 });
                return
            }
            let id = this.selected[0];
            if (id) {
                this.info(id, true);
            }
        },
        modify() {

        },
        del() {
            if (this.selected.length == 0) {
                layer.alert("请选择行!");
                return;
            }
            layer.confirm('当前数据有可能被引用，会影响数据准确性，确认是否删除？', {
                btn: ['确认', '取消'], btn1: function () {
                    $.ajax({
                        type: "POST",
                        url: contextPath + "/tbankaccount/delete",
                        contentType: 'application/json',
                        data: JSON.stringify(currencyVm.selected),
                        dataType: "json",
                        success: function (result) {
                            if (result.code == "100100") {
                                layer.alert('数据删除成功', { icon: 1 });
                            } else {
                                layer.alert('数据删除失败', { icon: 0 });
                            }
                        },
                        error: function (err) {
                            layer.alert('数据删除失败', { icon: 0 });
                        },
                    });
                }
            }
            );
        },
        detailClick(data) {
            console.log("=================")
            var id = data.rows.id;
            if (id) {
                this.info(id, true);
            }
            setTimeout(() => {
                let tableWidth = $($('.edit-table')[1]).width()
                console.log(tableWidth);
            }, 1000);
        },
        //树形点击回掉事件
        clickEvent(event, treeId, treeNode) {
            console.log(treeNode);
            this.body.commodityId = treeNode.commodityId;
            this.search();
        },
        selectGroup(group) {
            vm.groupId = group.id;
        },
        info(id, isLock) {
            if (id) {
                let that = this;
                that.goldItemList = [];
                that.goldBoms = [];

                that.stonesItemList = [];
                that.stonesBoms = [];

                that.partItemList = [];
                that.partBoms = [];

                $.ajax({
                    type: "POST",
                    url: contextPath + "/tbasebom/info/" + id,
                    contentType: 'application/json',
                    dataType: "json",
                    async: false,
                    success: function (data) {
                        if (data.code === "100100") {
                            console.log(data.data);
                            currencyVm.isShow = true;

                            that.add = data.data;
                            that.goldBoms = data.data.goldBoms
                            that.allTable(that.goldTableHeader, that.goldAssistAttr, that.goldBoms)
                            that.itemList(that.goldBoms, that.goldItemList)
                            that.showSelectOption(that.goldBoms, that.goldAssistAttr)
                            that.initBom(that.goldBoms, that.goldTableHeader, that.goldAssistAttrAll)

                            that.stonesBoms = data.data.stonesBoms
                            that.allTable(that.stonesTableHeader, that.stonesAssistAttr, that.stonesBoms)
                            that.itemStoneList(that.stonesBoms, that.stonesItemList)
                            that.showSelectOption(that.stonesBoms, that.stonesAssistAttr)
                            that.initBom(that.stonesBoms, that.stonesTableHeader, that.stonesAssistAttrAll)

                            that.partBoms = data.data.partBoms
                            that.allTable(that.partTableHeader, that.partAssistAttr, that.partBoms)
                            that.itemList(that.partBoms, that.partItemList)
                            that.showSelectOption(that.partBoms, that.partAssistAttr)
                            that.initBom(that.partBoms, that.partTableHeader, that.partAssistAttrAll)


                            console.log(that.goldAssistAttr);

                        } else {
                            console.log("服务器出错");
                        }
                    },
                    error: function (err) {
                        console.log("服务器出错");
                    },
                });
            }
        },
        initAddBody() {
            this.add = {

            }
        },
        initStandBom() {
            let _this = this;
            $.ajax({
                type: "POST",
                url: contextPath + "/tbasebom/listStandAll?ktcStatus=0",
                dataType: "json",
                async: false,
                success: function (data) {
                    console.log(data);
                    if (data.code === "100100") {
                        _this.standBOM = data.data;
                        if (_this.standBOM.length > 0) {
                            _this.$refs.my_tree.nodeData = data.data;
                            _this.$refs.my_tree.loadData();
                        }

                    } else {
                        console.log("服务器出错");
                    }
                },
                error: function (err) {
                    console.log("服务器出错");
                },
            })
        }
    },
    mounted() {

        this.initAddBody();//初始化body
        this.initStandBom();
        this.init();


        this.openTime = window.parent.params.openTime;


    }
})



