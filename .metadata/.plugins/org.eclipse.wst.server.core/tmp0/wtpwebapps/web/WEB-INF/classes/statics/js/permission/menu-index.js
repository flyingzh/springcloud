var ztree;
var setting = {
    data: {
        simpleData: {
            enable: true,
            idKey: "id",
            pIdKey: "parentId",
            rootPId: 0,
            type: "type"
        },
        key: {
            url: "nourl"
        }
    },
    check: {
        //enable: true
        nocheckInherit: true
    },
    view: {
        fontCss: {
            'color': 'blue',
            'font-family': '微软雅黑',
            "font-size": "16px"
        }
    },
    callback: {
        onClick: onClick
    }
};

function onClick(e, treeId, treeNode) {
    var zTree = $.fn.zTree.getZTreeObj("treeDemo"),
        nodes = zTree.getSelectedNodes(),
        v = "";
    nodes.sort(function compare(a, b) {
        return a.id - b.id;
    });
    for (var i = 0, l = nodes.length; i < l; i++) {
        v += nodes[i].name + ",";
    }
    if (v.length > 0) v = v.substring(0, v.length - 1);
    MenuVM.addBody.parentId = $.fn.zTree.getZTreeObj("treeDemo").getSelectedNodes()[0].id;
    MenuVM.treeNameInfo = v;
    console.log(MenuVM)

    hideMenu();

}

function showMenu() {
    var cityObj = $("#info");
    var cityOffset = $("#info").offset();
    $("#menuContent").css({
        left: 15 + "px",
        top: 26 + "px"
    }).slideDown("fast");

    $("body").bind("mousedown", onBodyDown);

}

function hideMenu() {
    $("#menuContent").fadeOut("fast");
    $("body").unbind("mousedown", onBodyDown);


}

function onBodyDown(event) {

    if (!(event.target.id == "menuBtn" || event.target.id == "menuContent" || $(event.target).parents("#menuContent").length > 0)) {

        hideMenu();
    }

}


/*$(document).ready(function () {
    $.fn.zTree.init($("#treeDemo"), setting, zNodes);
});*/
var MenuVM = new Vue({
        el: "#menu-info",
        data() {
            let This = this;
            return {
                //控制菜单类型
                menuTemp:false,
                //获取点击到的id
                clickId: "",
                //获取点击到的name
                clickName: "",
                // 获取点击的父id
                clickParentId:"",
                clickParentName:"",
                treeNameInfo: "",
                //是否是父节点  ---- true代表是
                treeFlag: false,
                setting: {
                    view: {
                        showLine: false,
                        addDiyDom: this.addDiyDom,
                    },
                    data: {
                        simpleData: {
                            enable: true
                        }
                    },
                    callback: {
                        onClick: this.zTreeOnClick
                    }
                },
                isUpdate: false,
                isShow: false,
                isEdit: false,
                isLook: false,
                ishides: true,
                saveStaus: '',
                buttonListShow: false,
                parentSpan: false,
                parentRequired: false,
                urlDisabled: true,
                urlSpan: false,
                urlRequired: false,
                permissionDisabled: true,
                permissionSpan: false,
                permissionRequired: false,
                isMenuTreeShow: false,
                reload: false,
                parentRequired: false,
                selected: [],
                selectedView: [],
                Constant: {
                    SUCCESS_CODE: '100100'
                },
                confirmConfig: {
                    showConfirm: false,
                    title: '提示',
                    content: '请点击确认',
                    onlySure: true,
                    success: true
                },
                status: [
                    {
                        label: '有效',
                        value: 1
                    },
                    {
                        label: '无效',
                        value: 0
                    }
                ],
                menuType: [
                    {
                        value: 0,
                        name: '目录'
                    }, {
                        value: 1,
                        name: '菜单'
                    }
                ],
                body: {
                    name: '',
                    whetherDisable: ''
                },
                addBody: {
                    id: '',
                    name: '',
                    url: '',
                    icon: '',
                    permission: '',
                    remark: '',
                    parentId: '',
                    sysButtonList: '',
                    type: '0'
                },
                zNodes: [],
                parent: [],
                buttonListLeft: [],
                buttonListRight: [],
                buttonIds: [],
                data_config: {
                    url: contextPath + '/menu/menuListPage',
                    colNames: ['序号', '菜单名称', '权限标识', '类型', '菜单图标', 'url地址', '状态'],
                    colModel: [
                        {name: 'id', index: 'id', width: 100, align: "center"},
                        {name: 'name', index: 'name', width: 200, align: "center"},
                        {name: 'permission', index: 'permission', width: 200, align: "center"},
                        {
                            name: 'type',
                            index: 'type',
                            width: 100,
                            align: "center",
                            formatter: function (value, grid, rows, state) {
                                return value == 0 ? "目录" : "菜单";
                            }
                        },
                        {name: 'icon', index: 'icon', width: 200, align: "center"},
                        {name: 'url', index: 'url', width: 400, align: "left"},
                        {
                            name: 'status', index: 'status', width: 80, align: "center",
                            formatter: function (value, grid, rows, state) {
                                return value == 0 ? "正常" : "禁用";
                            }
                        }
                    ]
                },
            }
        },
        methods: {
            refresh() {
                this.clickId = "";
                this.clickParentId = "";
                this.treeNameInfo = "";
                this.treeFlag = false;
                this.isLook = false;
                this.product()
            },
            //单击行
            zTreeOnClick(...rest) {
                let info = rest[2]


                var treeObj = $.fn.zTree.getZTreeObj("dataTree");
                var nodes = treeObj.getSelectedNodes();

                //判断选中的是否为目录
                //若为目录flag = true
                if (nodes.length > 0) {
                    this.treeFlag = nodes[0].type === 0 ? true : false;
                }
                //获取到点击的ID
                this.clickId = info.id;
                this.clickName = info.name;
                let parentNode = treeObj.getNodeByParam("id", info.parentId, null);
                if(parentNode){
                    this.clickParentId = parentNode.id;
                    this.clickParentName = parentNode.name;
                }else{
                    this.clickParentId = "";
                    this.clickParentName = "";
                }

            },
            addDiyDom(treeId, treeNode) {
                var spaceWidth = 15;
                var liObj = $("#" + treeNode.tId);
                var aObj = $("#" + treeNode.tId + "_a");
                var switchObj = $("#" + treeNode.tId + "_switch");
                var icoObj = $("#" + treeNode.tId + "_ico");
                var spanObj = $("#" + treeNode.tId + "_span");
                aObj.attr('title', '');
                aObj.removeAttr('href');
                aObj.append('<div class="divTd swich fnt" style="width:20%"></div>');
                var div = $(liObj).find('div').eq(0);
                //从默认的位置移除
                switchObj.remove();
                spanObj.remove();
                icoObj.remove();
                //在指定的div中添加
                div.append(switchObj);
                div.append(spanObj);
                //隐藏了层次的span
                var spaceStr = "<span style='height:1px;display: inline-block;width:" + (spaceWidth * treeNode.level) + "px'></span>";
                switchObj.before(spaceStr);
                //图标垂直居中
                icoObj.css("margin-top", "9px");
                switchObj.after(icoObj);
                var editStr = '';
                //宽度需要和表头保持一致
                editStr += '<div class="divTd" style="width:5%">' + (treeNode.id == undefined ? "" : treeNode.id) + '</div>';
                editStr += '<div class="divTd" style="width:15%">' + (treeNode.permission == undefined ? "" : treeNode.permission) + '</div>';
                editStr += '<div class="divTd" style="width:10%">' + (treeNode.type == 0 ? "目录" : '菜单') + '</div>';
                editStr += '<div class="divTd" style="width:10%">' + (treeNode.icon == undefined ? "" : treeNode.icon) + '</div>';
                editStr += '<div class="divTd" style="width:30%">' + (treeNode.url == undefined ? "" : treeNode.url) + '</div>';
                editStr += '<div class="divTd" style="width:10%">' + (treeNode.status == 0 ? "正常" : "异常") + '</div>';

                aObj.append(editStr);
            },

            //初始化列表
            queryHandler(zTreeNodes) {
                //初始化树
                $.fn.zTree.init($("#dataTree"), this.setting, zTreeNodes);
                //添加表头
                var li_head = ' <li class="head"><span><div class="divTd" style="width:20%">菜单名称</div><div class="divTd" style="width:5%">序号</div>' +
                    '<div class="divTd" style="width:15%">权限标识</div><div class="divTd" style="width:10%">类型</div><div class="divTd" style="width:10%">菜单图标</div>' +
                    '<div class="divTd" style="width:30%">url地址</div><div class="divTd" style="width:10%">状态</div></span></li>';
                var rows = $("#dataTree").find('li');
                if (rows.length > 0) {
                    rows.eq(0).before(li_head)
                } else {
                    $("#dataTree").append(li_head);
                    $("#dataTree").append('<li ><div style="text-align: center;line-height: 30px;" >无符合条件数据</div></li>')
                }
            },

            search() {
                this.reload = !this.reload;
            }
            ,
            clear() {
                this.body = {
                    name: '',
                    status: ''
                }
            }
            ,
            view() {//点击'查看'
                // if (!ht.util.hasValue(this.selected, "array")) {
                //     layer.alert("请先选择一条记录!");
                //     return false;
                // } else if (this.selected.length > 1) {
                //     layer.alert("最多只能选择一条记录!");
                //     return false;
                // }
                // var id = String(this.selected[0]);
                // if (!$.isEmptyObject(id) && id != undefined) {
                //     MenuVM.queryAllButton();
                //     this.viewInfo(id);
                // }
                //判断是否选择选择数据

                if (!this.clickId) {
                    this.$Modal.info({
                        content: "请选中需要修改的行"
                    })
                    return;
                }
                var id = this.clickId
                console.log(id)
                if (id != null && id != undefined) {
                    this.isLook = true;
                    MenuVM.queryAllButton();
                    this.viewInfo(id);
                    MenuVM.saveStaus = 'view'
                }

            }
            ,
            viewInfo(id) {
                this.modifyInfo(id);
            }
            ,
            add() {//点击'新增'
                this.isShow = true;
                var _this = this;
                this.queryParentMenu();
                this.queryAllButton();
                //菜单类型默认选择'目录'
                this.typeChangeCatalog();

                //判断选中的是否为目录
                if (this.treeFlag && this.clickId !== '') {
                    //获取到父节点Id
                    MenuVM.addBody.parentId = this.clickId;
                    this.treeNameInfo = this.clickName
                    // 选中的为菜单时获取选中的父目录（父目录id不为空）
                }else if (this.clickParentId !== '' ){
                    MenuVM.addBody.parentId = this.clickParentId;
                    this.treeNameInfo = this.clickParentName;
                }
            }
            ,
            queryParentMenu() {//查询菜单目录
                var that = this;
                $.ajax({
                    url: contextPath + '/menu/queryParentMenu',
                    method: 'post',
                    dataType: "json",
                    data: {},
                    success: function (res) {
                        ztree = $.fn.zTree.init($("#treeDemo"), setting, res.data);
                        MenuVM.parent = res.data;
                        res.data.map((item) => {
                            var obj = {};
                            obj.name = item.name;
                            that.zNodes.push(obj)
                        });

                        for (var i = 0; i < that.zNodes.length; i++) {
                            that.zNodes[i].id = i;
                            that.zNodes[i].pId = i
                        }

                    },
                    error: function (res) {

                    }
                });
            }
            ,
            queryAllButton() {//查询所有按钮
                $.ajax({
                    url: contextPath + '/button/queryAllButton',
                    type: 'post',
                    dataType: "json",
                    data: null,
                    success: function (res) {
                        if (res.code == '100100') {

                            // for (var i = 0; i < res.data.length - 1; i++) {//外层循环控制排序趟数
                            //     for (var j = 0; j < res.data.length - 1 - i; j++) {//内层循环控制每一趟排序多少次
                            //         if (res.data[j].permission.length > res.data[j + 1].permission.length) {
                            //             var temp = res.data[j];
                            //             res.data[j] = res.data[j + 1];
                            //             res.data[j + 1] = temp;
                            //         }
                            //     }
                            // }

                            MenuVM.buttonListLeft = [].concat(res.data)

                            // for (var j = num; j < res.data.length; j++) {
                            //     MenuVM.buttonListRight.push(res.data[j])
                            // }

                        }
                    },
                    error: function (res) {

                    }
                });
            }
            ,
            save() {//点击'保存'
                if (MenuVM.saveStaus === 'view') {
                    layer.alert("查看不能修改页面数据");
                    return;
                }
                if ($('form').valid()) {
                    var params = this.addBody;
                    if ($.isEmptyObject(String(params.id))) {
                        this.insertMenuButton(params);
                    } else {
                        this.updateMenuButton(params);
                    }
                }
            }
            ,
            modify() {

                //判断是否选择选择数据
                if (!this.clickId) {
                    this.$Modal.info({
                        content: "请选中需要修改的行"
                    });
                    return;
                }
                //判断是否选中的是父节点
                /*if (this.treeFlag) {
                    this.$Modal.info({
                        content: "不可修改目录"
                    })
                    return;
                }*/
                var id = this.clickId;
                if (id != null && id != undefined){
                    MenuVM.queryAllButton();
                    this.modifyInfo(id);
                }
            },
            modifyInfo(id) {//修改获取菜单信息
                console.log(id)
                $.ajax({
                    type: "POST",
                    url: contextPath + '/menu/menuInfo/' + id,
                    dataType: "json",
                    success: function (res) {
                        if (res.code === MenuVM.Constant.SUCCESS_CODE) {
                            var menu = res.data;
                            var type = menu.type;
                            if (type === 0) {//目录
                                MenuVM.typeChangeCatalog();
                            } else {//菜单
                                MenuVM.typeChangeMenu();
                                var buttonList = menu.menuButtonList;
                                MenuVM.selectedButtonProcess(buttonList, menu);
                            }
                            MenuVM.addBody = {
                                id: menu.id,
                                name: menu.name,
                                url: menu.url,
                                sort:menu.sort,
                                icon: menu.icon,
                                permission: menu.permission,
                                remark: menu.remark,
                                parentId: menu.parentId,
                                sysButtonList: '',
                                type: menu.type
                            };
                            let id = menu.parentId;
                            var treeObj = $.fn.zTree.getZTreeObj("dataTree");
                            var nodes = treeObj.getNodesByParam("id", id, null);
                            if(nodes!=null){
                                if( nodes[0]!=null){
                                    MenuVM.treeNameInfo =nodes[0].name;
                                }
                            }
                            MenuVM.isShow = true;
                            MenuVM.buttonListShow = true;
                            MenuVM.queryParentMenu();

                            //禁止修改菜单类型
                            MenuVM.menuTemp = true;
                            //MenuVM.initTree();
                        }
                    }, error: function () {
                        console.log(1)
                    }
                });
            }
            ,
            treeBackShow(id, pid) {
                var zTree = $.fn.zTree.getZTreeObj("treeDemo");//treeDemo界面中加载ztree的div
                console.log("zTree===>" + zTree);
                var node = zTree.getNodeByParam(id, pid);
                zTree.cancelSelectedNode();//先取消所有的选中状态
                zTree.selectNode(node, true);//将指定ID的节点选中
                //zTree.expandNode(node, true, false);//将指定ID节点展开
            }
            ,
            selectedButtonProcess(list, menu) {//修改页面初始化时,选中按钮处理
                for (var i in list) {
                    var object = list[i];
                    var status = object.status;
                    if (status === 0) {
                        var id = object.buttonId;
                        MenuVM.buttonIds.push(id);
                        var button = {};
                        button.id = id;
                        button.menuId = menu.id;
                        button.permission = object.permission;
                        button.status = object.status;
                        MenuVM.selectedView.push(button);
                    }
                }
            }
            ,
            updateMenuButton(param) {
                var menuButtonList = this.updateParamProcess();
                param.menuButtonList = menuButtonList;
                $.ajax({
                    type: "POST",
                    url: contextPath + '/menu/updateMenu',
                    data: JSON.stringify(param),
                    dataType: "json",
                    contentType: "application/json;charset=utf-8",
                    success: function (result) {
                        if (result.code === "100100") {
                            layer.alert("修改成功");
                            MenuVM.isShow = false;
                            MenuVM.menuTemp = false;
                            MenuVM.refresh();
                        } else {
                            layer.alert(result.msg);
                        }
                    },
                    error: function (err) {
                        console.log("服务器出错");
                    },
                });
            }
            ,
            updateParamProcess() {//按钮参数处理
                var buttonList = [];
                var allButtonList = MenuVM.buttonList;
                var allButtonMap = new Map();
                for (var i  in allButtonList) {
                    var object = allButtonList[i];
                    allButtonMap.set(object.id, object);
                }
                var viewButtonList = MenuVM.selectedView;
                var viewButtonMap = new Map();
                for (var i in viewButtonList) {
                    var object = viewButtonList[i];
                    viewButtonMap.set(object.id, object);
                }
                var buttonList = new Array();
                var buttonIds = MenuVM.buttonIds;
                for (var i in buttonIds) {//选中的按钮
                    var id = buttonIds[i];
                    if (viewButtonMap.has(id)) {
                        var object = {};
                        var oldObject = viewButtonMap.get(id);
                        object.buttonId = oldObject.id;
                        object.menuId = oldObject.menuId;
                        object.status = oldObject.status;
                        object.permission = oldObject.permission;
                        buttonList.push(object);
                    }
                    if (allButtonMap.has(id) && !viewButtonMap.has(id)) {
                        var object = {};
                        var oldObject = allButtonMap.get(id);
                        object.buttonId = oldObject.id;
                        object.menuId = '';
                        object.status = 0;
                        object.permission = oldObject.permission;
                        buttonList.push(object);
                    }
                }
                var buttonMap = new Map();
                for (var i in buttonList) {
                    var object = buttonList[i];
                    buttonMap.set(object.buttonId, object);
                }
                for (var i in viewButtonList) {
                    var object = viewButtonList[i];
                    if (!buttonMap.has(object.id)) {
                        var oldObject = viewButtonMap.get(object.id);
                        var object = {};
                        object.buttonId = oldObject.id;
                        object.menuId = oldObject.menuId;
                        object.status = 1;
                        object.permission = oldObject.permission;
                        buttonList.push(object);
                    }
                }
                return buttonList;
            }
            ,
            insertMenuButton(param) {
                //选中的按钮ID数组
                var buttonIds = this.buttonIds;
                var buttonList = new Array();
                for (var index in buttonIds) {//选中的按钮
                    var button = new Object();
                    var id = buttonIds[index];
                    for (var i in MenuVM.buttonList) {//所有按钮
                        if (id === MenuVM.buttonList[i].id) {
                            button.permission = MenuVM.buttonList[i].permission;
                        }
                    }
                    button.id = id;
                    buttonList.push(button);
                }
                param.buttonList = buttonList;
                $.ajax({
                    type: "POST",
                    url: contextPath + '/menu/insertSysMenu',
                    data: JSON.stringify(param),
                    dataType: "json",
                    contentType: "application/json;charset=utf-8",
                    success: function (res) {
                        if (res.code === MenuVM.Constant.SUCCESS_CODE) {
                            layer.alert("添加菜单成功");
                            //添加成功后初始化,清空输入内容
                            MenuVM.cancel();
                            MenuVM.refresh();
                            MenuVM.menuTemp = false;
                        } else {
                            layer.alert(res.msg);
                        }
                    },
                    error: function (err) {
                        console.log("服务器出错");
                    },
                });
            }
            ,
            del() {//点击删除时
                //判断是否选择选择数据
                if (!this.clickId) {
                    this.$Modal.info({
                        content: "请选中需要删除的行"
                    })
                    return;
                }
                //判断是否选中的是父节点
                if (this.treeFlag) {
                    this.$Modal.info({
                        content: "不可删除父节点"
                    })
                    return;
                }
                let id = this.clickId;
                $.ajax({
                    type: "POST",
                    url: contextPath + '/menu/delMenuById/' + id,
                    data: '',
                    dataType: "json",
                    success: function (result) {
                        if (result.code === "100100") {
                            layer.alert("删除成功");
                            MenuVM.refresh();
                        } else {
                            console.log(result.msg);
                        }
                    },
                    error: function (err) {
                        console.log("服务器出错");
                    },
                });
            }
            ,
            cancel() {
                this.clearAddBody();
                this.isShow = false;
                this.isEdit = false;
                this.isLook = false;
                this.menuTemp = false;
                this.saveStaus = "";
                this.selected = [];
            }
            ,
            clearAddBody() {
                this.addBody = {
                    id: '',
                    name: '',
                    url: '',
                    icon: '',
                    permission: '',
                    remark: '',
                    parentId: [],
                    status: '',
                    type: '0'
                }
            }
            ,
            typeChange(event) {
                var type = MenuVM.addBody.type;
                if (type === '0') {//菜单类型选择'目录'
                    this.typeChangeCatalog();
                } else {//菜单类型选择'菜单'
                    this.typeChangeMenu();
                }
            }
            ,
            typeChangeCatalog() {//选择目录
                MenuVM.buttonListShow = false;
                MenuVM.urlDisabled = true;
                MenuVM.urlSpan = false;
                MenuVM.urlRequired = false;
                MenuVM.addBody.url = '';
                MenuVM.permissionDisabled = true;
                MenuVM.permissionSpan = false;
                MenuVM.permissionRequired = false;
                MenuVM.addBody.permission = '';
                MenuVM.parentSpan = false;
                MenuVM.parentRequired = false;

            }
            ,
            typeChangeMenu() {//选择菜单
                MenuVM.buttonListShow = true;
                MenuVM.urlDisabled = false;
                MenuVM.urlSpan = true;
                MenuVM.urlRequired = true;
                MenuVM.addBody.url = '';
                MenuVM.permissionDisabled = false;
                MenuVM.permissionSpan = true;
                MenuVM.permissionRequired = true;
                MenuVM.addBody.permission = '';
                MenuVM.parentSpan = true;
                MenuVM.parentRequired = true;
            }
            ,
            showMenu() {

                showMenu()
               /* this.initTree();*/
            }
            ,
            initTree() {
                //初始化菜单树

                $.get(contextPath + "/menu/parentMenuTree", function (r) {
                    console.log(r.data)
                    ztree = $.fn.zTree.init($("#treeDemo"), setting, r.data);
                });

            },
            product() {
                let that = this
                $.ajax({
                    url: contextPath + '/menu/queryAllMenu',
                    type: 'post',
                    dataType: "json",
                    success: function (res) {
                        let dataInfo = res.data

                        //将parentId处理
                        dataInfo.map((item) => {
                            item.pId = item.parentId
                        })


                        that.queryHandler(dataInfo);
                    },
                    error: function () {
                        console.log(123123)
                    }
                })
            },
            sideHandleSuccess(result) {
                if (result.code === "100100") {
                    this.addBody.icon = result.data.fdUrl;
                }

            },
            handleFormatError(file) {
                this.$Modal.error({
                    content: '文件格式不正确,请重新选择',
                });
            },
            handleMaxSize(file) {
                this.$Modal.error({
                    content: '文件过大,请重新选择',
                });
            },
            delFile(type, fileArr) {
                this.addBody.icon = null;
            }
        },
        created() {
            //this.queryAllButton();
        }
        ,
        mounted() {
            this.product()
        }
    })
;