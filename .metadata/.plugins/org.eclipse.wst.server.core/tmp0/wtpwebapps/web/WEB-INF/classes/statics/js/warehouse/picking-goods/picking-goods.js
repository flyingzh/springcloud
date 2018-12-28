var vm = new Vue({
    el: "#app",
    data() {
        var vm = this;
        return {
            isShow: false,
            isEdit: false,
            typeValue:'',
            reload_unpicked: false,
            reload_picked: false,
            isSearchHide: true,
            frameTab: false,
            isStart: true,
            array: [],
            productTypeList: [],
            isTabulationHide: true,
            checkedAllData: false,
            godsCodes: null,
            openTime: '',
            dataValue: [],
            isHide: true,
            // 已拣货选中的行
            selectedPicked: [],
            // 未拣货选中的行
            selectedUnpicked: [],
            selectedRow: {},
            selectedRowNum: 0,
            checkData: [],
            // 条形码商品列表（ajax请求回来更新，弹窗中使用）
            barcodeProduct: [],
            selectType: [
                {
                    value: "客户订单",
                    label: "客户订单"
                },
                {
                    value: "原料领用申请单",
                    label: "原料领用申请单"
                }
            ],
            body: {
                goodsType: '',
                saleOrderNo: '',
                goodsCode: "",
                goodsName: "",
                startTime: '',
                endTime: '',
                commodityId:null,
                productTypeName: '',
                alreadyTest: 2,
                hasCreateTestDocument: 0,//是否已生成检验单_1、是.0、否
            },
            data: [
                {
                    value: 'shiliao',
                    label: '石料',
                    children: [
                        {
                            value: 'shiliaoyihao',
                            label: '石料一号'
                        },
                        {
                            value: 'shiliaoerhao',
                            label: '石料二号'
                        },
                        {
                            value: 'shiliaosanhao',
                            label: '石料三号'
                        }
                    ]
                },
                {
                    value: 'kjin',
                    label: 'k金'
                },
                {
                    value: 'suzhou',
                    label: '苏州'
                }
            ],

            // jqGrid: 未拣货
            data_config_unpicked: {
                url: contextPath + "/examineGoods/queryList",
                datatype: "json",
                colNames: ['客户订单编号', '商品类型', '商品图片', '商品编码', '商品名称', '计数单位', '订单数量', '订单入库数量', "拣货数量", "未拣货数量", "是否字印", "字印数量", "字印确认", "完成数量"],
                colModel: [
                    {name: "saleOrderNo", index: "saleOrderNo", width: 210, align: "left",
                        formatter: function (value, grid, rows, state) {
                            $(document).off('click', ".detail" + value).on('click', ".detail" + value, function () {
                                vm.detailClick({value, grid, rows, state})
                            });
                            let myCode = `<a class="detail${value}">${value}</a>`;
                            return myCode;
                        }
                    },
                    {name: "goodsTypeName", index: "goodsTypeName", width: 210, align: "left"},
                    {
                        name: "pictureUrl", index: "pictureUrl", width: 210, align: "center",
                        formatter: function (ellvalue, options, rowObject) {
                            $(document).on('mouseout', '.can', function () {
                                vm.hideMirror(rowObject.id)
                            });
                            $(document).on('mouseenter', '.select' + rowObject.id, function () {
                                vm.showMirror(rowObject.id)
                            })
                            let url = rowObject.pictureUrl;
                            if (url) {
                                return `<div class="select${rowObject.id} can">
                                    <img height="50px" width="50px" src="${url}"/>
                                    <div class="mirror"><img class="bigimg" src="${url}"></div>
                                </div>`;
                            } else {
                                return '<div class="select${rowObject.id}"></div>';
                            }
                        }
                    },
                    {name: "goodsCode", index: "goodsCode", width: 210, align: "left",
                        formatter: function (value, grid, rows, state) {
                            $(document).off('click', ".detail" + value).on('click', ".detail" + value, function () {
                                vm.gooidsId({value, grid, rows, state});
                            });
                            let myCode = `<a class="detail${value}">${value}</a>`;
                            return myCode;
                        }
                    },
                    {name: "goodsName", index: "goodsName", align: "left", width: 210},
                    {name: "countingUnit", index: "countingUnit", align: "left", width: 210},
                    {name: "goodsNum", index: "goodsNum", align: "right", width: 210},
                    {name: "totalPurchaseStorageNum", index: "totalPurchaseStorageNum", align: "right", width: 210},
                    {name: "totalPickNum", index: "totalPickNum", align: "right", width: 210},
                    {name: "noPickNum", index: "noPickNum", align: "right", width: 210},
                    {name: "printedContent", index: "printedContent", align: "left", width: 210},
                    {name: "printCompNum", index: "printCompNum", align: "right", width: 210},
                    {
                        name: "printStatus",
                        index: "printStatus",
                        align: ";left",
                        width: 210,
                        formatter: function (value) {
                            return value == 1 ? "是" : "";
                        }

                    },
                    {name: "sentQualiyNum", index: "sentQualiyNum", align: "right", width: 210}
                ],
                rowNum: 5,//一页显示多少条
                rowList: [10, 20, 30],//可供用户选择一页显示多少条
                mtype: "post",//向后台请求数据的ajax的类型。可选post,get
                viewrecords: true,
                postData: vm.body
            },

            // jqGrid: 已拣货
            data_config_picked: {
                url: contextPath + "/examineGoods/querySentList",
                datatype: "json",
                colNames: ['客户订单编号', '商品类型', '商品图片', '商品编码', '商品名称', '计数单位', '订单数量', '订单入库数量', "拣货数量", "未拣货数量", "是否字印", "字印数量", "字印确认", "完成数量"],
                colModel: [
                    {name: "saleOrderNo", index: "saleOrderNo", width: 210, align: "left",
                        formatter: function (value, grid, rows, state) {
                            $(document).off('click', ".detail" + value).on('click', ".detail" + value, function () {
                                vm.detailClick({value, grid, rows, state})
                            });
                            let myCode = `<a class="detail${value}">${value}</a>`;
                            return myCode;
                        }
                    },
                    {name: "goodsTypeName", index: "goodsTypeName", width: 210, align: "left"},
                    {
                        name: "pictureUrl", index: "pictureUrl", width: 210, align: "center",
                        formatter: function (ellvalue, options, rowObject) {
                            $(document).on('mouseout', '.can', function () {
                                vm.hideMirror(rowObject.id)
                            });
                            $(document).on('mouseenter', '.select' + rowObject.id, function () {
                                vm.showMirror(rowObject.id)
                            })
                            let url = rowObject.pictureUrl;
                            if (url) {
                                return `<div class="select${rowObject.id} can">
                                    <img height="50px" width="50px" src="${url}"/>
                                    <div class="mirror"><img class="bigimg" src="${url}"></div>
                                </div>`;
                            } else {
                                return `<div class="select${rowObject.id} can">
                                    <img height="50px" width="50px" src="http://218.17.157.182:8082/web/images/no_pic.png"/>
                                    <div class="mirror"><img class="bigimg" src="http://218.17.157.182:8082/web/images/no_pic.png"></div>
                                </div>`;

                            }
                        }
                    },
                    {name: "goodsCode", index: "goodsCode", width: 210, align: "left",
                        formatter: function (value, grid, rows, state) {
                            $(document).off('click', ".detail" + value).on('click', ".detail" + value, function () {
                                vm.gooidsId({value, grid, rows, state});
                            });
                            let myCode = `<a class="detail${value}">${value}</a>`;
                            return myCode;
                        }
                    },
                    {name: "goodsName", index: "goodsName", align: "left", width: 210},
                    {name: "countingUnit", index: "countingUnit", align: "left", width: 210},
                    {name: "goodsNum", index: "goodsNum", align: "right", width: 210},
                    {name: "totalPurchaseStorageNum", index: "totalPurchaseStorageNum", align: "right", width: 210},
                    {name: "totalPickNum", index: "totalPickNum", align: "right", width: 210},
                    {name: "noPickNum", index: "noPickNum", align: "right", width: 210},
                    {name: "printedContent", index: "printedContent", align: ";left", width: 210},
                    {name: "printCompNum", index: "printCompNum", align: "right", width: 210},
                    {
                        name: "printStatus",
                        index: "printStatus",
                        align: ";left",
                        width: 210,
                        formatter: function (value) {
                            return value == 1 ? '是' : '';
                        }

                    },
                    {name: "sentQualiyNum", index: "sentQualiyNum", align: "right", width: 210}
                ],
                rowNum: 5,//一页显示多少条
                rowList: [10, 20, 30],//可供用户选择一页显示多少条
                mtype: "post",//向后台请求数据的ajax的类型。可选post,get
                viewrecords: true,
                postData: vm.body,
                multiselect: false,//复选框
            }
        }
    },
    watch: { // 监视双向绑定的数据数组
        checkData: {
            handler() { // 数据数组有变化将触发此函数
                if (vm.checkData.length == 2) {
                    document.querySelector('#quan').checked = true;
                } else {
                    document.querySelector('#quan').checked = false;
                }
            },
            deep: true // 深度监视
        }
    },
    methods: {
        gooidsId(value){
            window.parent.activeEvent({
                  name: '商品',
                  url: contextPath +'/base-data/commodity/commodity-info.html',
                  params:{id:value.rows.commodityId, type: 'skip'}
            });
        },
        detailClick(data) {
            var saleOrderNo = data.rows.saleOrderNo;
            window.parent.activeEvent({
                name: '查询客户订单',
                url: contextPath + '/sale/customer-order/customer-order-add.html',
                params: {type: 'view', saleOrderNo: saleOrderNo}
            });
        },
        showMirror(name) {
            $(`.select${name} .mirror`).show()
        },
        hideMirror(name) {
            $(`.select${name} .mirror`).hide()
        },
        search() {
            vm.reload_picked = !vm.reload_picked;
            vm.reload_unpicked = !vm.reload_unpicked;
        },
        clear() {
            vm.body = {
                goodsType: '',
                saleOrderNo: '',
                goodsCode: '',
                startTime: '',
                endTime: '',
                productTypeName: '',
                goodsName: '',
                alreadyTest: 2,
                hasCreateTestDocument: 0 //未生成检验单
            }
            vm.dataValue = [];
            vm.$nextTick(() => {
                vm.typeValue = '';
            })
        

        },
        //退出
        close(){
            window.parent.closeCurrentTab({name:'销售拣货',openTime:vm.openTime,exit: true});
        },
        //拣货确认
        productPickConfirm() {
            if (vm.selectedUnpicked.length != 1) {
                vm.frameTab = false;
                vm.$Modal.info({
                    title: '提示信息',
                    content: '只能针对单个商品进行拣货!'
                });
                return false;
            }

            // 选取未拣货表格的 DOM 节点，缓存到变量中
            var $tblUnpicked = $('#tblUnpicked');

            // 获取选中行的行号（从 1 开始）
            var id = $tblUnpicked.jqGrid('getGridParam', 'selrow');

            // 获取选中行的数据（JSON 格式）
            var rowData = $tblUnpicked.jqGrid('getRowData', id);
            // 将选中行的行号和JSON数据更新到 vm
            vm.selectedRow = rowData;
            vm.selectedRowNum = id;
            vm.godsCodes = rowData.goodsCode
            window.top.home.loading('show');
            //校验订单入库数量是否为0或空
            var ajax1 = $.ajax({
                url: contextPath + "/examineGoods/totalPurchaseStorageNum",
                type: "post",
                data: JSON.stringify(vm.selectedUnpicked),
                dataType: "json"
            });

            var ajax2 = ajax1.then(function (data) {

                if (data.code == 100100) {
                    window.top.home.loading('hide');
                    if (data.data == null || data.data.length == 0) {
                        vm.frameTab = false;
                        vm.$Modal.info({
                            title: '提示信息',
                            content: '订单对应商品未入库，不能进行拣货!'
                        });
                        return null;
                    }
                }else if ('-1' === data.code){
                    window.top.home.loading('hide');
                    vm.$Modal.warning({
                        title: '提示信息',
                        content: '服务器出错啦!',
                    });
                    return null;
                }if (data.code === '100101'){
                    window.top.home.loading('hide');
                    vm.$Modal.info({
                        title: '提示信息',
                        content: data.msg
                    });
                    return null;
                }

                return $.ajax({
                    url: contextPath + "/examineGoods/queryQualityAffirmList",
                    type: "post",
                    data: {id: vm.selectedUnpicked[0]},
                    dataType: "json",
                });
            });
            ajax2.done(function (data) {
                window.top.home.loading('hide');
                if (data == null) {
                    return null;
                }

                if (data.code == 100100) {
                    vm.barcodeProduct = data.data;
                    vm.frameTab = true;
                }else if ('-1' === data.code){
                    vm.$Modal.warning({
                        title: '提示信息',
                        content: '服务器出错啦!',
                    });
                    return;
                } else if (data.code === '100101'){
                    vm.$Modal.info({
                        title: '提示信息',
                        content: data.msg
                    });
                }
            }).fail(function (error) {
                window.top.home.loading('hide');
                this.$Modal.warning({content:"服务器出错啦",title:"提示信息"})
            })

        },
        //字印
        print() {
            // 选取未拣货表格的 DOM 节点，缓存到变量中
            var $tblUnpicked = $('#tblUnpicked');

            // 获取选中行的行号（从 1 开始）
            var id = $tblUnpicked.jqGrid('getGridParam', 'selrow');

            // 获取选中行的数据（JSON 格式）
            var rowData = $tblUnpicked.jqGrid('getRowData', id);
            if (rowData.printedContent != '') {
                if ( rowData.printStatus == "是"){
                    vm.$Modal.success({
                        title: '提示信息',
                        content: '字印已完成!'
                    });
                    return;
                }
                if (rowData.totalPickNum == rowData.printCompNum) {
                    vm.$Modal.info({
                        title: '提示信息',
                        content: '请先拣货!'
                    });
                    return;
                }
            }

            if (vm.selectedUnpicked.length == 0) {
                vm.$Modal.info({
                    title: '提示信息',
                    content: '请选择商品进行字印!'
                });
                return false;
            }
            window.top.home.loading('show');
            //校验字印内容是否为空
            var ajax1 = $.ajax({
                cache: false,
                url: contextPath + "/examineGoods/goodsContent",
                type: "post",
                data: JSON.stringify(vm.selectedUnpicked),
                dataType: "json",
                contentType: 'application/json'
            });

            //校验商品是否已经字印
            var ajax2 = ajax1.then(function (ajax1) {
                if (ajax1.code == 100100) {
                    window.top.home.loading('hide');
                    var configId = ''
                    for (var i = 0; i < ajax1.data.length; i++) {
                        configId += ajax1.data[i].goods_code;
                        if (i!=ajax1.data.length-1){
                            configId += ",";
                        }
                    }
                    if (ajax1.data == null || ajax1.data.length != 0) {
                        vm.$Modal.info({
                            title: '提示信息',
                            content: '商品编码：（' + configId +'）该订单商品不需要字印!'
                        });
                        return null;
                    }
                }
                if ('-1' === ajax1.code){
                    window.top.home.loading('hide');
                    vm.$Modal.warning({
                        title: '提示信息',
                        content: '服务器出错啦!',
                    });
                    return null;
                }
                if (ajax1.code === '100101'){
                    window.top.home.loading('hide');
                    vm.$Modal.info({
                        title: '提示信息',
                        content: ajax1.msg
                    });
                    return null;
                }

                return $.ajax({
                    cache: false,
                    url: contextPath + "/examineGoods/printStatus",
                    type: "post",
                    data: JSON.stringify(vm.selectedUnpicked),
                    dataType: "json",
                    contentType: 'application/json'
                });
            });

            var ajax3 = ajax2.then(function (ajax2) {
                if (ajax2 == null) {
                    window.top.home.loading('hide');
                    return null;
                }
                if (ajax2.code == 100100) {
                    window.top.home.loading('hide');
                    var configId = ''
                    for (var i = 0; i < ajax2.data.length; i++) {
                        configId += ajax2.data[i].goods_code ;
                        if (i!=ajax2.data.length-1){
                            configId += ",";
                        }
                    }
                    if (ajax2.data.length != 0) {
                        vm.$Modal.warning({
                            title: '提示信息',
                            content: '商品编码：（' + configId +'）该订单商品已字印确认!'
                        });
                        return null;
                    }
                }
                if ('-1' === ajax2.code){
                    window.top.home.loading('hide');
                    vm.$Modal.warning({
                        title: '提示信息',
                        content: '服务器出错啦!',
                    });
                    return null;
                }
                if (ajax2.code === '100101') {
                    window.top.home.loading('hide');
                    vm.$Modal.info({
                        title: '提示信息',
                        content: ajax2.msg,
                    });
                    return null;
                }

                return $.ajax({
                    cache: false,
                    url: contextPath + "/examineGoods/printAffirm",
                    type: "post",
                    data: JSON.stringify(vm.selectedUnpicked),
                    dataType: "json",
                    contentType: 'application/json'
                });
            });

            ajax3.done(function (ajax3) {
                window.top.home.loading('hide');
                if (ajax3 == null) {
                    return null;
                }
                if (ajax3.code == 100100) {
                    vm.$Modal.success({
                        title: '提示信息',
                        content: '字印确认完成!'
                    });
                    vm.selectedUnpicked = [];
                    vm.search();
                }
                if ('-1' === ajax3.code){
                    vm.$Modal.warning({
                        title: '提示信息',
                        content: '服务器出错啦!',
                    });
                    return null;
                }
                if (ajax3.code === '100101') {
                    vm.$Modal.info({
                        title: '提示信息',
                        content: ajax3.msg
                    });
                }
            }).fail(function (error) {
                window.top.home.loading('hide');
                vm.$Modal.warning({
                    title: '提示信息',
                    content: '服务器出错啦!',
                });
            })
        },

        //完成送检
        entQuality() {
            if (vm.selectedUnpicked.length != 1) {
                vm.frameTab = false;
                vm.$Modal.info({
                    title: '提示信息',
                    content: '只能针对单个商品进行送检！'
                });
                return false;
            }

            // 选取未拣货表格的 DOM 节点，缓存到变量中
            var $tblUnpicked = $('#tblUnpicked');

            // 获取选中行的行号（从 1 开始）
            var id = $tblUnpicked.jqGrid('getGridParam', 'selrow');

            // 获取选中行的数据（JSON 格式）
            var rowData = $tblUnpicked.jqGrid('getRowData', id);

            if (rowData.printedContent != '') {
                if (rowData.totalPickNum != rowData.printCompNum) {
                    vm.$Modal.info({
                        title: '提示信息',
                        content: '请完成字印!'
                    });
                    return;
                }
            }
            if (rowData.totalPickNum == rowData.sentQualiyNum) {
                vm.$Modal.info({
                    title: '提示信息',
                    content: '没有送检单！请先拣货！'
                });
                return;
            }
            window.top.home.loading('show');
            //修改送检状态
            $.ajax({
                url: contextPath + "/examineGoods/accomplishSentQualiy",
                type: 'post',
                data: JSON.stringify(vm.selectedUnpicked),
                dataType: "json",
                contentType: 'application/json',
                success: function (data) {
                    window.top.home.loading('hide');
                    if (data.code == 100100) {
                        vm.$Modal.success({
                            title: '提示信息',
                            content: '送检完成!'
                        });
                        vm.selectedUnpicked = [];
                        vm.search();
                    }
                    if ('-1' === data.code){
                        vm.$Modal.warning({
                            title: '提示信息',
                            content: '服务器出错啦!',
                        });
                        return null;
                    }

                    if (data.code === '100101') {
                        vm.$Modal.info({
                            title: '提示信息',
                            content: data.msg
                        });
                    }
                },
                error: function (err) {
                    window.top.home.loading('hide');
                    vm.$Modal.warning({
                        title: '提示信息',
                        content: '服务器出错啦!',
                    });
                }
            });
        },
        checkedAll(e) { // 点击全选事件函数
            var checkObj = document.querySelectorAll('.checkItem');// 获取所有checkbox项
            //console.log(e.target)
            for (var i = 0; i < vm.barcodeProduct.length; i++) {
                if (!vm.barcodeProduct[i].disabledStatus){
                    vm.barcodeProduct[i].picked = e.target.checked;
                }
            }
            if (e.target.checked) { // 判定全选checkbox的勾选状态
                for (var i = 0; i < checkObj.length; i++) {
                    checkObj[i].checked = true;
                }
            } else { // 如果是去掉全选则清空checkbox选项绑定数组
                for (var i = 0; i < checkObj.length; i++) {
                    if (checkObj[i].disabled) {
                        checkObj[i].checked = true;
                    } else {
                        checkObj[i].checked = false;
                    }
                }

            }
        },
        // 级联商品类型
        changeProductType(value, selectedData) {
            if(value == vm.typeValue){
                return false;
            }
            //清空商品分录行
            let tempType = selectedData[selectedData.length - 1];
            vm.body.goodsType = tempType.value;
        },
        getProductType() {
            let that = this;
            $.ajax({
                type: "post",
                url: contextPath + '/tbasecommoditycategory/listByAll?parentId=0',
                dataType: "json",
                success: function (data) {
                    that.productTypeList = that.initGoodCategory(data.data.cateLists)
                },
                error: function () {
                    vm.$Modal.warning({
                        title: '提示信息',
                        content: '服务器出错啦!',
                    });
                }
            })
        },
        typeValue:function () {
            let temp = vm.addBody.goodsType;
            let arr =[];
            vm.typeInit(vm.productTypeList,arr,temp);
            return arr.reverse();
        },
        // 格式化商品类型数据
        initGoodCategory(type) {
            let result = [];

            type.forEach((item) => {
                let {
                    customCode: value,
                    name: label,
                    cateLists: children,
                    code: code
                } = item;
                if (children) {
                    children = vm.initGoodCategory(children)
                }
                result.push({
                    value,
                    label,
                    children,
                    code
                })
            });

            result.forEach((item) => {
                if (!item.children) {
                    delete item.children;
                }
            });

            return result
        },
        // 弹窗：拣货确认
        modalPickDone: function () {
            // 选取未拣货表格的 DOM 节点，缓存到变量中
            var $tblUnpicked = $('#tblUnpicked');

            // 获取选中行的行号（从 1 开始）
            var id = $tblUnpicked.jqGrid('getGridParam', 'selrow');

            // 获取选中行的数据（JSON 格式）
            var rowData = $tblUnpicked.jqGrid('getRowData', id);
            var che = $('#barcodeList').find('.checkItem:checked');
            // todo: ajax 提交拣货的条形码
            // 在 success 中更新 jqGrid 当前行的已拣货数量
            $('#tblUnpicked').jqGrid(
                'setRowData',
                vm.selectedRowNum,
                {'pickNumber': che.length}
            );
            var mycars = new Array()
            for (var i = 0; i < che.length; i++) {
                mycars[i] = che[i].value
            }
            window.top.home.loading('show');
            $.ajax({
                url: contextPath + "/examineGoods/updataAffirm",
                type: "post",
                data: JSON.stringify({goodsId: vm.selectedUnpicked[0], goodsBarcodes: mycars,totalPickNum:rowData.totalPickNum}),
                dataType: "json",
                contentType: 'application/json',
                success: function (data) {
                    window.top.home.loading('hide');
                    if (data.code == 100100) {
                        vm.$Modal.success({
                            title : '提示信息',
                            content :data.msg,
                        });
                        vm.selectedUnpicked = [];
                        vm.search();
                    }
                    if ('-1' === data.code){
                        vm.$Modal.warning({
                            title: '提示信息',
                            content: '服务器出错啦!',
                        });
                        return null;
                    }
                    if (data.code === '100101'){
                        vm.$Modal.info({
                            title: '提示信息',
                            content: data.msg
                        });
                    }
                },
                error: function (err) {
                    window.top.home.loading('hide');
                    this.$Modal.warning({content:"服务器出错啦！",title:"提示信息"})
                }
            });
        },
        // 弹窗：拣货取消
        modalPickCancel: function () {
        }
    },
    mounted(){
        this.openTime=window.parent.params.openTime;
        this.getProductType();
    }
});