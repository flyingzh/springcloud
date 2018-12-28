window.ht = {};

if (typeof window.HT_ROOT == 'undefined') {
    window.HT_ROOT = '/' + location.pathname.split('/')[1];
}

(function(){

    // 生产环境下，重置 console.log 方法，不输出调试信息
    if (typeof window.HT_ENV != 'undefined' && window.HT_ENV == 'prod') {
        if (console) {
            console.log = function () {};
        }
    }

    // 在当前页的 html 根节点添加 CSS classes
    // e.g. <html class="module-name folder-name page-name" ...
    var arrPath = window.location.pathname.replace(window.HT_ROOT + '/', '').split('/');
    var len = arrPath.length;
    var arrNew = [];
    if (len >= 3) {
        for (var i = 0; i < len; i++) {
            var ele = arrPath[i];
            if (i == 0) arrNew.push('module-' + arrPath[i]);
            if (i == 1) arrNew.push('folder-' + arrPath[i]);
            if (arrPath[i].indexOf('.htm') > -1)
                arrNew.push('page-' + arrPath[i].split('.htm')[0]);
        }
        document.getElementsByTagName('html')[0].className = arrNew.join(' ');

        //$(document).ready(function(){
        //    $('html').addClass(arrNew.join(' '));
        //});
    }

    $(document).ready(function() {

        // 是否有顶部菜单
        var $topMenu = $('.btn-menu');
        if ($topMenu.length) {
            $('body').addClass('has-menu');
        }
    });
})();

var HT_IMG_ERROR = "this.src='images/error-img.gif'";

// login
ht.login = {
    success: function () {
        return 'index.html';
    }
};

// 全局字典
ht.dict = layui.data('dict');

// 前端缓存：登录后的全局配置
/*
 * cfg 结构
 * {
 *       username: '登录名'
 * }
 * */
ht.cfg = layui.data('cfg');

// 读取前端缓存：登录后当前用户的全局配置（以登录名为表名分别存储）
ht.user = layui.data(ht.cfg.username) || {};

ht.vue = function (obj) {
    var _obj = {
        el: '#rrapp',
        data: {
            q: {},
            pathName: pathName,
            multiAdd: false,
            multiAddNum: 1,
            showList: true,
            title: '',
            colKeyVal: {},
            colKeyValRaw: {}
        },
        methods: {
            query: function () {
                this.reload(1);
            },
            resetQuery: function () {
                var _vm = this;
                $.each(_vm.q, function (key, val) {
                    _vm.q[key] = '';
                });
                _vm.reload(1);
            },
            toggleSearch: function () {
                $('body').toggleClass('show-search');
            },

            // 添加数据空行
            addRow: function(){
                var _vm = this;
                htGridAddRow(window[_vm.gridEle], _vm.multiAddNum || 1);
            },

            // 进入添加页
            add: htVueAdd,

            // 进入修改页
            update: htVueUpdate,

            // 提交修改
            updatePost: htVueUpdatePost,

            // 删除数据行（可多行）
            del: htVueDel,

            // 重载父表数据
            reload: htVueReload,

            // 重载子表数据
            reloadChildGrid: htVueReloadChildGrid,

            // 获取主表信息
            getInfo: htVueGetInfo,

            // 初始化子表
            initChildGrid: htVueInitChildGrid,

            // 返回父列表
            back2main: function(){
                var _vm = this;
                _vm.showList = true;
                // 返回时，清空所有子表数据
                $.each(_vm.childTbl, function(key, val){
                    var $grid = $('#' + key + 'List');
                    $grid.jqGrid('clearGridData');
                });
            },

            // 初始化数据列表
            gridInit: function () {
                htGridInit.apply(null, [this, arguments[0]]);
            },

            // 生成数据列表操作列按钮：自定义按钮
            gridBtnAction: function () {
                return htGridBtnAction.call(null, this);
            },

            // 生成数据列表操作列按钮：增删改查
            gridBtnCrud: function () {
                htGridBtnCrud.apply(null, [this, arguments[0]]);
            },

            // 初始化 Select
            initSelect: htVueInitSelect,

            // 初始化级联下拉菜单
            cascadeSelect: htVueCascadeSelect
        },
        beforeCreate: function(){
            // 向所有的 img 标签添加 onerror 属性
            $('img').attr('onerror', HT_IMG_ERROR);
        },
        created: function(){
            // Todo: if any global configuration
        },
        updated: function(){
            //更新form表单中全部渲染
            layui.use('form', function () {
                layui.form.render();
            });
        },
        mounted: function () {
            // 初始化 layui 表单控件
            htLayuiInitDate(this);
            htLayuiInitForm(this);

            if (htUtilHasValue(this.childTbl, 'object')) {
                htLayuiInitElement(this);
            }

            // 初始化表单验证
            var validateRules = {};
            if (htUtilHasValue(obj.data) && htUtilHasValue(obj.data.validateRules, 'object')) {
                validateRules = obj.data.validateRules;
            }
            htInitValidate(this, validateRules);
        }
    };
    // END of _obj

    // 针对父子表模板的方法
    if (htUtilHasValue(obj.data) && obj.data.tplType === 'jump') {
        _obj.methods = $.extend(true, _obj.methods, {
            selectTabs:function (id) {
                if (this.primaryId !== '') {
                    this.reloadChildGrid(id);
                }
            },
            addJqGridRow:function (id) { //编辑时用的jqGrid新增行
                if ($('.ht-wrapper-grid:visible .ui-jqgrid-bdiv tr[id^="-"]').length > 0) {
                    alert('请处理（保存或取消）正在编辑的数据先');
                    return false;
                }
                $("#" + id).jqGrid('addRow', 'new');
            },
            delJqGridRow:function (id) {
                var ids = getSelectedRows(id);
                var len = ids.length;
                for (var i = 0; i < len; i++) {
                    $("#" + id).delRowData(ids[0]);
                }
            },
            saveOrUpdate: htVueChildSaveOrUpdate
        });
    }

    var className = obj.data.className;
    _obj.data[className] = {};

    // 抽出有级联关系的列，构建父子关系
    _obj.data['cascadeCol'] = htVueGetCascadeColumns(obj.data.columns);

    // 构造 data 的基本数据结构（注意：空数据节点默认不要赋值为 null 应赋值为 ''）
    if (htUtilHasValue(obj.data.columns, 'array')) {
        _obj.data = htVueBaseData(_obj, obj);
    }

    // 前置(fn_prepend)或后置(fn_append)合并同名方法，或覆盖(fn 同名)
    ht.util.mergeFn(_obj, obj);
    if (htUtilHasValue(obj.methods, 'object')) {
        ht.util.mergeFn(_obj.methods, obj.methods);
    }

    // 合并默认属性和自定义属性
    if (htUtilHasValue(obj, 'object')) {
        _obj = $.extend(true, _obj, obj);
    }

    // 初始化 Vue 实例，存到全局
    var _vm = new Vue(_obj);
    window['vm_' + className] = _vm;

    // 监听级联菜单数据
    if (htUtilHasValue(_obj.data['cascadeCol'], 'object')) {
        htVueGenWatch(_vm);
    }

    return _vm;
}

ht.ajax = function (obj) {

    // global opts if any
    return $.ajax(obj);
}

// 工具方法
ht.util = {
    // 前置扩展某方法
    prependFn: htUtilPrependFn,

    // 后置扩展某方法
    appendFn: htUtilAppendFn,

    // 以不同方式合并或替换两个对象中的同名方法
    mergeFn: htUtilMergeFn,

    // 判断是否有值，或同时判断数据类型和是否为空
    hasValue: htUtilHasValue,

    dict2Arr: htUtilDict2Arr,

    // 将字典某条目内的 key 转换成 value
    dictMapping: htUtilDictMapping,

    // 修正js浮点运算精度
    cal: htUtilCal()
};

// global methods for jqGrid
ht.grid = {
    // 初始化数据列表
    'init': htGridInit,

    // 读/写前端缓存：数据列表的列配置
    _colOrder: htGridColOrder,

    // 生成 jqGrid 的 colModel
    genColumns: htGridGenColumns,

    //对列进行格式化时设置的函数,将数据转化为对应数据字典的内容
    formatter: {
        dict: htGridFormatterDict
    },

    //在使用getRowData时将数据进行反格式化，获取原来的值
    unformat:{
        dict: htGridUnformatDict
    },
    editoptions: {
        //编辑状态下，单元格中自定义的元素内容
        custom_element: {
            select: htGridEditoptionsCustomElementSelect
        },
        custom_value: {
            select: htGridEditoptionsCustomValueSelect
        },
        dataEvents:{
            select: htGridEditoptionsDataEventsSelect
        }
    },

    // 生成操作列的按钮
    btnAction: htGridBtnAction,

    // 改查存消按钮：edit, view, save, cancel
    btnCrud: htGridBtnCrud,

    // 行内编辑模板下，添加空行
    addRow: htGridAddRow
};
// END of ht.grid

/**
 * 对Date的扩展，将 Date 转化为指定格式的String /u516d
 * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q) 可以用 1-2 个占位符
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 * eg:
 * (new Date()).format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
 * (new Date()).format("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04
 * (new Date()).format("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04
 * (new Date()).format("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04
 * (new Date()).format("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
 * Ref: http://blog.csdn.net/vbangle/article/details/5643091
 */
Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12,
        "H+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds() //毫秒
    };
    var week = {
        "0": "日",
        "1": "一",
        "2": "二",
        "3": "三",
        "4": "四",
        "5": "五",
        "6": "六"
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    if (/(E+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "星期" : "周") : "") + week[this.getDay() + ""]);
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
};

// ============================================================================
// Function: Vue
function htVueBaseData (_obj, obj) {
    var className = obj.data.className;

    $.each(obj.data.columns, function () {
        var _name = this.attrname;
        var _q = _obj.data.q;

        // “新增”和“编辑”对应的数据节点
        if (this.isFormShow == 'true') {
            _obj.data[className][_name] = '';
        }

        // 搜索表单对应的数据节点
        if (this.isQuery == 'true') {
            if (this.queryType == '2') {
                _q[_name + 'Start'] = '';
                _q[_name + 'End'] = '';
            } else {
                _q[_name] = '';
            }
        }

        // 如果有级联菜单，生成下级菜单的数据节点
        if (htUtilHasValue(this.childColumnName)) {
            var childColName = this.childColumnName;
            _obj.data[className][childColName] = '';
            _obj.data[childColName] = {
                mark: '',
                options: []
            }
        }

        // 如果来自字典
        if (this.isBindDict == 'true') {
            var hasDict = this.dict != '';
            _obj.data[_name] = {
                mark: (hasDict) ? this.dict : '',
                options: (hasDict) ? ht.util.dict2Arr(ht.dict[this.dict]) : []
            };
        } else if (htUtilHasValue(this.expandParam, 'object')) {

            // 如果来自扩展参数
            var arrOpt = [];
            $.each(this.expandParam, function(key, val){
                var objOpt = {
                    'key': key,
                    'text': val
                };
                arrOpt.push(objOpt);
            });
            _obj.data[_name] = {
                mark: '',
                options: arrOpt
            };
        }
    });
    // END of $.each()

    // 如果有子表
    if (htUtilHasValue(obj.data.childTbl)) {
        $.each(obj.data.childTbl, function (key, val) {
            _obj.data[key + 's'] = [];
            var childClassName = val.classname;

            // 循环每个子表的列
            $.each(val.col, function(idx, ele){
                if (ele.isBindDict == 'true') {
                    _obj.data[ele.attrname] = {
                        mark: ele.dict,
                        options: []
                    }
                }
                _obj.data[className][childClassName + 's'] = [];
            });

        });
    }
    return _obj.data;
}

function htVueGetCascadeColumns (_columns) {
    // 抽出级联菜单之间的关系
    /*
     * {
     *   grandpa: papa,
     *   papa: kid,
     *   kid: grandkid
     * }
     * */
    var ret = {};
    var columns = $.extend(true, {}, _columns);
    $.each(columns, function (idx, ele) {
        var attrName = this.attrname;
        var childName = this.childColumnName || '';
        if (childName != '') {
            ret[attrName] = childName;
        }
    });
    return ret;
}

function htVueGenWatch (_vm) {
    var className = _vm.className;
    var genWatch = function(){
        var attrName = this.attrname;
        var childColName = this.childColumnName || '';
        if (childColName != '') {
            if (attrName != childColName) {
                _vm.$watch('q.'+ attrName, function(){
                    _vm.cascadeSelect(attrName, childColName, 'q');
                });
                _vm.$watch(className + '.' + attrName, function (val, oldVal) {
                    //第一次初始化赋值时不需要监听
                    if (typeof(oldVal) != 'undefined') {
                        _vm.cascadeSelect(attrName, childColName, className);
                    }
                });
            }
        }
    };
    $.each(_vm.columns, genWatch);
}

function htVueAdd () {
    var _vm = this;
    var className = _vm.className;
    _vm.showList = false;
    _vm.title = "新增";
    $.each(_vm[className], function (key, val) {
        _vm[className][key] = '';
    });

    // 如果有子表
    if (htUtilHasValue(_vm.childTbl, 'object')) {
        _vm.editOrAdd = true;
        _vm.initChildGrid();
    }
}

function htVueUpdate () {
    var _vm = this;
    var rowId = getSelectedRowId('', _vm.pkAttrname);
    if (rowId == null){
        return;
    }
    _vm.showList = false;
    _vm.title = "修改";
    _vm.getInfo(rowId);
}

function htVueUpdatePost (event) {
    var _vm = this;
    var url = '../' +  _vm.pathName + '/updatePost';
    ht.ajax({
        type: 'POST',
        url: url,
        data: JSON.stringify(_vm[_vm.className]),
        success: function (r) {
            if (r.code == 0) {
                alert(r, function (index) {
                    _vm.reload();
                });
            } else {
                alert(r.msg);
            }
        }
    });
}

function htVueDel (sub) {
    var _vm = (htUtilHasValue(window['vm_' + sub])) ? window['vm_' + sub] : this;
    var className = _vm.className;
    var ids = getSelectedRows(_vm.gridEle);

    if (ids == null) {
        return;
    }
    confirm('确定要删除选中的记录？', function () {
        ht.ajax({
            type: 'POST',
            url: '../'+ className.toLowerCase() +'/delete',
            data: JSON.stringify(ids),
            success: function (r) {
                if (r.code == 0) {
                    alert(r, function (index) {
                        window[_vm.gridEle].trigger("reloadGrid");
                    });
                } else {
                    alert(r.msg);
                }
            }
        });
    });
} // END of htVueDel

function htVueReload (_param) {
    // 此方法在 query 和 resetQuery 中被调用
    var _vm = this;
    _vm.showList = true;
    var gridInst = window[_vm.gridEle];
    var page = (_param === 1) ? 1 : gridInst.jqGrid('getGridParam', 'page');
    var param = {};

    $.each(_vm.columns, function () {
        var attrName = this.attrname;
        var parentColName = this.parentColumnName;
        var childColName = this.childColumnName;

        // 初始化搜索中含有级联父节点的select下拉框
        if (htUtilHasValue(parentColName)) {
            //_vm.cascadeSelect(attrName, childColName, 'q');
        }

        if (this.isQuery == 'true') {

            // 如果是范围查询
            if (this.queryType == '2') {
                param[attrName + 'Start'] = _vm.q[attrName + 'Start'];
                param[attrName + 'End'] = _vm.q[attrName + 'End'];
            } else {
                param[attrName] = _vm.q[attrName];
            }
        }
    });

    if (htUtilHasValue(_param, 'object')) {
        param = $.extend(true, param, _param);
    }

    // 重载数据列表
    gridInst.jqGrid('setGridParam', {
        postData: param,
        page: page
    }).trigger('reloadGrid');
} // END of htVueReload

function htVueReloadChildGrid (grid) {
    var _vm = this;
    var childGrid = _vm.childTbl[grid] || {};
    //console.log(childGrid)

    if (htUtilHasValue(childTbl, 'object')) {
        var gridEle = childGrid.classname + 'List';
        var postData = {};
        //默认参数：主外键
        //var classId = _vm[_vm.className][_vm.pkAttrname];
        var classId = _vm.primaryId;
        postData[childGrid.foreignAttrname] = classId;

        var $grid = $('#' + gridEle);
        var page = $grid.jqGrid('getGridParam', 'page');

        // 如果之前已有初始化过的子表 jqGrid 实例，重载新数据
        if (page) {
            $grid.jqGrid('setGridParam', {
                postData: postData,
                page: page
            }).trigger("reloadGrid");
            return false;
        }

        // 如果没有子表的 jqGrid 实例，再初始化
        ht.vue({
            el: null,
            data: {
                tplType: 'inline',
                gridEle: gridEle,
                columns: childGrid.col || [],
                pkColumnName: childGrid.pkColumnName,
                className: childGrid.classname
            },
            created: function () {
                var _v = this;

                _v.gridInit({
                    hasPager: false,
                    postData: postData,
                    url: '../' + childGrid.pathName + '/list',
                    gridComplete: function () {
                        _v.gridBtnCrud({
                            save: {
                                param: {
                                    // click 中用到的变量
                                    //isReload: false,
                                    className: childGrid.classname,
                                    pathName: childGrid.pathName,
                                    classId: classId,
                                    parentVm: _vm
                                }
                            }
                        });
                    }
                });
            }
        });
    }
} // END of htVueReloadChildGrid

function htVueGetInfo (id) {
    var _vm = this;
    var className = _vm.className;
    var hasChildTbl = htUtilHasValue(_vm.childTbl, 'object');
    _vm.showList = false;

    $.get('../' + _vm.pathName + '/info/' + id, function (r) {
        if (r.code == 0) {
            _vm[className] = r[className];
            $.each(_vm.columns, function(){
                var attrName = this.attrname;
                var parentColumnName = this.parentColumnName || '';

                if (parentColumnName != '') {
                    //初始化含有级联父节点的select下拉框内容
                    _vm.initSelect(attrName, parentColumnName, _vm[className][parentColumnName]);
                }

                if (this.isBindDict == 'true') {
                    //将数据类型转换为string，方便和下拉框值对应
                    _vm[className][attrName] = r[className][attrName].toString();
                }
            });

            // 如果有子表
            if (hasChildTbl) {
                _vm.primaryId = id;
                _vm.editOrAdd = false;

                $.each(_vm.childTbl, function(key, val){
                    // 只加载当前选中 Tab 内的 jqGrid
                    if ($('#'+key).hasClass('layui-this')) {
                        _vm.reloadChildGrid(key);
                        return false;
                    }
                });
            }
        } else {
            alert(r.msg);
        }
    });
} // END of htVueGetInfo

function htVueInitChildGrid (opt){
    var _vm = this;
    var childTbl = _vm.childTbl;
    _vm.primaryId = '';
    if (htUtilHasValue(childTbl, 'object')) {
        $.each(childTbl, function(key, val){
            var gridEle = val.classname + 'sAdd'
            var $grid = $('#' + gridEle);
            var page = $grid.jqGrid('getGridParam', 'page');

            // 如果之前已有初始化过的子表，清空之前的数据
            if (page) {
                $grid.jqGrid('clearGridData');
            } else {
                ht.vue({
                    el: null,
                    data: {
                        gridEle: gridEle,
                        columns: val.col || [],
                        pkColumnName: val.pkColumnName,
                        className: val.classname
                    },
                    created: function () {
                        var _vm = this;
                        _vm.gridInit({
                            hasAction: false,
                            datatype: 'local',
                            // 不显示底部分页控件
                            hasPager: false
                        });
                    }
                });
            }
            // END if
        });
    }
} // END of htVueInitChildGrid

function htVueInitSelect (selectName, parentSelectName, parentSelectSelected) {
    var _vm = this;
    var dict = ht.dict;
    if (htUtilHasValue(parentSelectSelected)) {
        var val = dict[_vm[parentSelectName].mark + '_' + parentSelectSelected];
        _vm[selectName].options = ht.util.dict2Arr(val);
        _vm[selectName].mark = _vm[parentSelectName].mark + '_' + parentSelectSelected;
    } else {
        _vm[selectName].options = '';
    }
}

function htVueCascadeSelect (select1, select2, vmodel) {
    var _vm = this;
    var dict = ht.dict;
    var cascadeCol = _vm.cascadeCol;
    var _dataClass = $.extend({}, _vm[vmodel]);
    var _dataClassNew = {};

    // 递归方法：处理所有下级菜单
    var clearChildSelect = function (parentName) {

        // 如果有下级菜单
        if (parentName in cascadeCol) {
            var childCol = cascadeCol[parentName];

            // 更新下拉选项
            if (_vm[vmodel][select1] != '') {
                var select1Val = dict[_vm[select1].mark + '_' + _vm[vmodel][select1]];
                _vm[select2].options = ht.util.dict2Arr(select1Val);
                _vm[select2].mark = _vm[select1].mark + '_' + _vm[vmodel][select1];
            } else {
                _vm[select2].options = '';
            }

            // 等 DOM 更新完毕后，再赋值给下拉菜单，相当于使用 setTimeout（fn, 0)
            _vm.$nextTick(function(){

                // 清空当前下级菜单选中的值
                _vm[vmodel][select2] = '';

                // “新增”和“修改”必须使用 undefined 赋值，才能正确初始化（唔知点解！）
                _dataClassNew[childCol] = (vmodel == 'q') ? '' : undefined;

                // 递归处理下一级菜单
                clearChildSelect(childCol);
            });
        } else {

            // 更新完所有下级菜单的数据后，统一更新 vm 一次！
            _vm[vmodel] = $.extend({}, _dataClass, _dataClassNew);
            return false;
        }
    };

    // 清空下一级菜单
    clearChildSelect(select1);
}

function htVueChildSaveOrUpdate (event) {
    var _vm = this;
    var childClassNames = (function () {
        var ret = [];
        $.each(_vm.childTbl, function (key, val) {
            ret.push(key + 's');
        });
        return ret;
    })();
    var id = _vm[_vm.className][_vm.pkAttrname];

    // 验证表单先
    if ($('#' + _vm.pathName + 'Form').valid() == false) {
        return false;
    }

    if (htUtilHasValue(childClassNames, 'array')) {
        if (htUtilHasValue(id) == false) {
            var tableJson = [];
            var rowJson = {};
            for (var k = 0; k < childClassNames.length; k++) {
                //获取所有行id
                var ids = $("#" + childClassNames[k] + "Add").jqGrid('getDataIDs');
                //根据行id,获取每行每列的值
                for (var i = 0; i < ids.length; i++) {
                    //获取列字段
                    var colModels = $("#" + childClassNames[k] + "Add").jqGrid('getGridParam', 'colModel');
                    for (var j = 2; j < colModels.length; j++) { //从2开始,去除自带隐藏和id列
                        var editrules = colModels[j].editrules;
                        $("#" + ids[i] + "_" + colModels[j].name).focus();
                        var value = $("#" + ids[i] + "_" + colModels[j].name).val();
                        if (editrules != null && editrules.required == true && (value == null || value == "")) {
                            alert("" + colModels[j].label + ":为必填项!");
                            return false;
                        }
                        if (editrules.email == true) {
                            var reg = /^[a-z0-9]+([._\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
                            if (!reg.test(value)) {
                                alert("" + colModels[j].label + ":请输入正确的邮箱或邮箱格式!");
                                return false;
                            }
                        } else if (editrules.date == true) {
                            var reg = /^(([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))-02-29)/;
                            if (!reg.test(value)) {
                                alert("" + colModels[j].label + ":请输入正确的日期或日期格式!");
                                return false;
                            }
                        } else if (editrules.number == true) {
                            var reg = /^(\-|\+)?\d+(\.\d+)?$/;
                            if (!reg.test(value)) {
                                alert("" + colModels[j].label + ":请输入正确的数字或数字格式!");
                                return false;
                            }
                        } else if (editrules.integer == true) {
                            var reg = /^[1-9]\d*$/;
                            if (!reg.test(value)) {
                                alert("" + colModels[j].label + ":请输入正确的整数或整数格式!");
                                return false;
                            }
                        } else if (editrules.custom == true) {
                            if (!(/^(1[3-9])\d{9}$/.test(value))) {
                                alert("" + colModels[j].label + ":不是完整的11位手机号或者正确的手机号格式!");
                                return false;
                            }
                        }
                        rowJson[colModels[j].name] = $("#" + ids[i] + "_" + colModels[j].name).val();//获取编辑状态下的每行每个单元格的值
                    }
                    tableJson.push($.extend(true, {}, rowJson));
                    rowJson = {};
                }
                _vm[_vm.className][childClassNames[k]] = tableJson;
                tableJson = [];
            }
        }
    }
    var url = htUtilHasValue(id) ? '../' + _vm.pathName + '/update' : '../' + _vm.pathName + '/save';
    $.ajax({
        type: "POST",
        url: url,
        data: JSON.stringify(_vm[_vm.className]),
        success: function (r) {
            if (r.code == 0) {
                alert(r, function (index) {
                    _vm.reload();
                });
            } else {
                alert(r.msg);
            }
        }
    });
} // END of saveOrUpdate()

// ============================================================================
// Function: Util
function htUtilPrependFn (fn, prevfn) {
    return function () {
        prevfn.apply(this, arguments);
        return fn.apply(this, arguments);
    };
}

function htUtilAppendFn (fn, nextfn) {
    return function () {
        fn.apply(this, arguments);
        return nextfn.apply(this, arguments);
    };
}

function htUtilDict2Arr (str){
    var ret = [];
    if (htUtilHasValue(str)) {
        var arr = str.split(";");
        for (var i = 0; i < arr.length; i++) {
            var s = arr[i].split(":");
            ret.push({
                key: s[0],
                text: s[1]
            });
        }
    }
    return ret;
}

function htUtilDictMapping (dictKey, cellvalue) {
    var _arr = [];
    var dict = ht.dict;
    var arr = dict[dictKey].split(";");
    for (var i = 0; i < arr.length; i++) {
        var str = arr[i];
        _arr = str.split(":");
        var val = _arr[0];
        if (cellvalue == val) {
            return _arr[1];
        }
    }
    return '';
}

function htUtilCal () {
    var padding0 = function (p) {
        var z = '';
        while (p--) {
            z += '0';
        }
        return z;
    };
    /**
     * 解决小数精度问题
     * @param {*数字} a
     * @param {*数字} b
     * @param {*符号} sign
     * fixedFloat(0.3, 0.2, '-')
     */
    var fixedFloat = function (a, b, sign) {
        var handle = function (x) {
            var y = String(x)
            var p = y.lastIndexOf('.')
            if (p === -1) {
                return [y, 0]
            } else {
                return [y.replace('.', ''), y.length - p - 1]
            }
        }
        // v 操作数1, w 操作数2, s 操作符, t 精度
        var operate = function (v, w, s, t) {
            switch (s) {
                case '+': return (v + w) / t
                case '-': return (v - w) / t
                case '*': return (v * w) / (t * t)
                case '/': return (v / w)
            }
        }

        var c = handle(a)
        var d = handle(b)
        var k = 0

        if (c[1] === 0 && d[1] === 0) {
            return operate(+c[0], +d[0], sign, 1)
        } else {
            k = Math.pow(10, Math.max(c[1], d[1]))
            if (c[1] !== d[1]) {
                if (c[1] > d[1]) {
                    d[0] += padding0(c[1] - d[1])
                } else {
                    c[0] += padding0(d[1] - c[1])
                }
            }
            return operate(+c[0], +d[0], sign, k)
        }
    };

    return function (a, sign, b) {
        var operation = {
            '+': function (a, b) {
                return fixedFloat(a, b, '+')
            },
            '-': function (a, b) {
                return fixedFloat(a, b, '-')
            },
            '*': function (a, b) {
                return fixedFloat(a, b, '*')
            },
            '/': function (a, b) {
                return fixedFloat(a, b, '/')
            }
        }
        return operation[sign](a, b);
    };
}

function htUtilMergeFn (obj1, obj2) {
    var hasVal = htUtilHasValue;
    var prependFn = ht.util.prependFn;
    var appendFn = ht.util.appendFn;
    if (hasVal(obj1, 'object') && hasVal(obj2, 'object')) {
        $.each(obj1, function (key, val) {
            var keyPrepend = key + '_prepend';
            var keyAppend = key + '_append';

            if (hasVal(val, 'function') &&
                (hasVal(obj2[key], 'function') ||
                hasVal(obj2[keyPrepend], 'function') ||
                hasVal(obj2[keyAppend], 'function'))
            ) {

                var isPrepend = hasVal(obj2[keyPrepend], 'function');
                var isAppend = hasVal(obj2[keyAppend], 'function');

                if (isPrepend) {
                    // 前置合并
                    obj1[key] = prependFn(val, obj2[keyPrepend]);
                    delete obj2[keyPrepend];
                } else if (isAppend) {
                    // 后置合并
                    obj1[key] = appendFn(val, obj2[keyAppend]);
                    delete obj2[keyAppend];
                } else {
                    // 替换全部
                    var _obj = {};
                    _obj[key] = obj2[key];
                    $.extend(true, obj1, _obj);
                    delete obj2[key];
                }
            }
        });
        // END of $.each
    }
} // END of htUtilMergeFn

function htUtilHasValue (someVar, type) {
    // 笼统判断是否有“有效值/方法”，但不判断数据类型，也不判断对象、数组、字串是否为空
    var ret = typeof someVar != 'undefined' && !!someVar == true;

    // 判断数据类型，同时判断对象、数组、字串是否为空
    if ($.type(type) != 'undefined') {
        var objType = {
            'object': function () {
                return $.type(someVar) == 'object' && $.isEmptyObject(someVar) == false;
            },
            'array': function () {
                return $.type(someVar) == 'array' && someVar.length > 0;
            },
            'string': function () {
                return $.type(someVar) == 'string' && someVar.length > 0;
            },
            'number': function () {
                return $.type(someVar) == 'number';
            },
            'boolean': function () {
                return $.type(someVar) == 'boolean';
            },
            'function': function () {
                return $.type(someVar) == 'function';
            }
        }
        if (type in objType) {
            ret = objType[type]();
        }
    }
    return ret;
} // END of htUtilHasValue

// ============================================================================
// Function: Grid

// 点击 jqGrid 单元格时，获取相关信息
function htGridTdInfo(grid, args){
    // args: [rowid, iCol, cellcontent, e]
    var rowId = args[0];
    var $td = $(args[3].target);
    var aria = $td.attr('aria-describedby') || '';

    if (aria == '') return {};

    var firstDelimiter = aria.indexOf('_');
    var rowData = $(grid).getRowData(rowId);
    delete rowData.action;
    return {
        $dom: $td,
        colName: aria.substring(firstDelimiter + 1),
        rowData: rowData
    }
}

function htGridInit (_vm, obj) {
    var obj = htUtilHasValue(obj, 'object') ? obj : {};
    if ($.type(_vm.gridEle) == 'undefined') {
        //alert('请用 jQuery 选择器格式定义 jqGrid 的初始化对象');
        return false;
    }
    var gridEle = _vm.gridEle;

    // 替换默认的 uid 前缀 “jqg” 为 “-”
    $.jgrid.uidPref = '-';

    var $table = $('#' + gridEle);

    // 默认 grid 属性
    var _obj = {
        datatype: "json",
        url: '../'+ pathName +'/list',
        viewrecords: true,
        height: 'auto',
        rowNum: 10,
        rowList: [10, 30, 50],
        rownumbers: true,
        rownumWidth: 30,
        autowidth: true,
        shrinkToFit: false,
        multiselect: true,
        pager: '#' + gridEle + 'Pager',
        pagerpos: 'left',
        recordpos: 'left',
        colModel: ht.grid.genColumns(_vm, obj.colModel || {}),
        jsonReader: {
            root: "page.list",
            page: "page.currPage",
            total: "page.totalPage",
            records: "page.totalCount"
        },
        prmNames: {
            page: "page",
            rows: "limit",
            order: "order"
        },
        afterInsertRow: function(rowid, aData){

        },
        gridComplete: function () {
            _vm.gridBtnCrud();
        }
    };

    // $.each(_obj, function(key, val){
    //     if (htUtilHasValue(this, 'function')) {
    //         console.log(obj[key]);
    //     }
    // });

    // 移除不再使用的自定义属性，ht.grid.genColumns() 已使用过并重定义了 colModel
    delete obj.colModel;

    // 前置(fn_prepend)或后置(fn_append)合并同名方法，或覆盖(fn 同名)
    ht.util.mergeFn(_obj, obj);

    var pagerId = gridEle + 'Pager';

    // 获取显示列的顺序
    _obj.colOrder =  ht.grid._colOrder(pathName + '_' + gridEle);
    //console.log(_obj.colOrder);

    // 将 columns 转成 key-value 对象
    var objColRaw = (function () {
        var _objCol = {};
        $.each(_vm.columns, function (idx, ele) {
            _objCol[ele.attrname] = ele;
        });
        return _objCol;
    })();
    _vm.colKeyValRaw = $.extend({}, objColRaw);

    // 将 colModel 转成 key-value 对象
    var objCol = (function () {
        var _objCol = {};
        $.each(_obj.colModel, function (idx, ele) {
            _objCol[ele.name] = ele;
        });
        return _objCol;
    })();
    var _colModel = [];
    _vm.colKeyVal = $.extend({}, objCol);

    // 按自定义的顺序显示列
    if (htUtilHasValue(_obj.colOrder, 'array')) {
        $.each(_obj.colOrder, function (idx, ele) {
            if (ele in objCol) {
                // 显示原来隐藏的列
                objCol[ele]['hidden'] = false;
                _colModel.push(objCol[ele]);
                delete objCol[ele];
            }
            if (idx == _obj.colOrder.length - 1) {
                $.each(objCol, function (key, val) {
                    // 隐藏原来显示的列
                    val['hidden'] = true;
                    _colModel.push(val);
                });
                _obj.colModel = [].concat(_colModel);
            }
        });
        //console.log(_obj.colModel)
    }

    // 添加 Pager 的 DIV
    // 如果 hasPager == false 隐藏
    var cssHidePager = '';
    if (htUtilHasValue(obj.hasPager, 'boolean') && obj.hasPager == false) {
        cssHidePager = ' class="ht-grid-nofooter" ';
        obj.rowNum = 10000;
    }
    $table.after('<div id="' + pagerId + '"' + cssHidePager + '></div>');

    // 如果不需要“操作”列
    if ($.type(obj.hasAction) != 'undefined' && obj.hasAction == false) {
        $.each(_obj['colModel'], function (idx, ele) {
            if (ele.name == 'action') {
                _obj['colModel'].splice(idx, 1);
                return false;
            }
        });
    }

    // 合并初始化参数：覆盖同名的属性，合并同名的方法
    _obj = $.extend(true, _obj, obj);

    var inst = $table.jqGrid(_obj);

    // 左下角按钮
    inst.jqGrid('navGrid', '#' + pagerId, {
        refreshstate: 'current',
        refreshtext: '刷新',
        refreshicon: '',
        add: false,
        edit: false,
        del: false,
        search: false
    });
    $.extend(true, $.ui.multiselect, {
        locale: {
            addAll: '显示所有列',
            removeAll: '隐藏所有列',
            itemsCount: '显示的列'
        }
    });

    // 固定列
    inst.jqGrid('setFrozenColumns');

    // http://www.trirand.com/jqgridwiki/doku.php?id=wiki%3ajquery_ui_methods
    inst.jqGrid('navButtonAdd', '#' + pagerId, {
        caption: "设置列",
        //buttonicon: "glyphicon-list",
        buttonicon: '',
        title: "显示(隐藏)和排序列 ",
        onClickButton: function () {
            $(this).jqGrid('columnChooser',{
                //width: 550,
                //height: 550,
                msel_opts: {dividerLocation: 0.5},
                modal: true,
                dialog_opts: {
                    title: '设置列',
                    modal: true,
                    minWidth: 550,
                    height: 350,
                    //resizable: false,
                    //show: 'blind',
                    //hide: 'explode',
                    dividerLocation: 0.5,
                    create: function( event, ui ) {
                        // 移除“操作”列，不参与列排序
                        // Ref: http://api.jqueryui.com/dialog/#event-create
                        var dl = this;
                        setTimeout(function() {
                            $(dl).find('.connected-list .ui-element[title="操作"]').remove();
                        }, 0);
                    }
                },
                done : function (perm) {
                    //console.log(perm);
                    if (perm) {
                        // "OK" button are clicked
                        this.jqGrid("remapColumns", perm, true);
                        // the grid width is probably changed co we can get new width
                        // and adjust the width of other elements on the page
                        //var gwdth = this.jqGrid("getGridParam","width");
                        //this.jqGrid("setGridWidth",gwdth);

                        // 获取最新列顺序，缓存到前端
                        var colModel = this.jqGrid('getGridParam','colModel');
                        var _order = [];
                        $.each(colModel, function () {
                            // 获取可见列顺序，存入数组
                            if (this.hidden == false) {
                                _order.push(this.name);
                            }
                        });
                        // 将最新列顺序更新到前端存储中
                        ht.grid._colOrder(pathName + '_' + gridEle, _order);
                        // console.log(_order);
                    } else {
                        // we can do some action in case of "Cancel" button clicked
                    }
                }
            });
        }
    });

    window[gridEle] = inst;
    return inst;
} // End of htGridInit

function htGridColOrder (gridInst, val) {
    var user = ht.cfg.username;
    var col = layui.data(user).col || {};

    if (htUtilHasValue(val, 'array')) {
        col[gridInst] = val;
        layui.data(user, {key: 'col', value: $.extend({}, col)});
        //console.log(layui.data(user));
    } else {
        return col[gridInst] || [];
    }
}

function htGridGenColumns (_vm, opt) {
    /* (_vm, pkColumnName, opt)
     * opt 为自定义的列属性，数据结构为：
     * {
     *   // key 为 jqGrid 列属性中的 name 值
     *   key: {
     *       // 自定义的列属性，将与默认属性合并（覆盖同名属性）
     *   }
     * }
     * */
    var columns = _vm.columns;
    var pkColumnName = _vm.pkColumnName;
    var arr = [{
        label: "操作",
        name: 'action',
        index: 'action',
        width: 160,
        frozen: true,
        title: false,
        sortable: false
    }];
    var opt = htUtilHasValue(opt, 'object') ? opt : {};

    if (htUtilHasValue(columns, 'array') == false) {
        //alert('请定义数据表格的表头');
    } else {
        $.each(columns, function (idx, ele) {
            var defaultOpt = {
                label: ele.comments,
                name: ele.attrname,
                index: ele.columnName,
                editrules:{},
                editable: true,
                title: false
            };

            if(htUtilHasValue(ele.editrules)){
                if(ele.editrules == 'email'){
                    defaultOpt['editrules'].email = true;
                }else if(ele.editrules == 'date'){
                    defaultOpt['editrules'].date = true;
                }else if(ele.editrules == 'number'){
                    defaultOpt['editrules'].number = true;
                }else if(ele.editrules == 'integer'){
                    defaultOpt['editrules'].integer = true;
                }else if(ele.editrules == 'phone'){
                    defaultOpt['editrules'].custom = true;
                    defaultOpt['editrules'].custom_func = function(value, colNames){
                        if(!(/^(1[3-9])\d{9}$/.test(value))){
                            return [false, ""+colNames+":不是完整的11位手机号或者正确的手机号格式"];
                        }else{
                            return [true,""];
                        }
                    }
                }
            }
            if(ele.isRequired == 'true'){
                defaultOpt['editrules'].required = true;
            }
            //console.log(defaultOpt)
            var customOpt = {};

            // 判断列是否显示到表格中
            if ((htUtilHasValue(ele.isListShow) && ele.isListShow == 'true')
                || ele.columnName == pkColumnName || ele.isForeign == 'true') {

                if (ele.columnName == pkColumnName) {
                    customOpt = {
                        hidden: true,
                        editable: false,
                        key: true
                    }
                } else if(ele.isForeign == 'true'){
                    customOpt = {
                        hidden: true,
                        editable: false,
                        key: false
                    }
                } else {
                    // 是否有父子关系的列
                    if (htUtilHasValue(ele.childColumnName) || htUtilHasValue(ele.parentColumnName)) {
                        if (ele.type == 'select') {
                            customOpt = {
                                edittype: 'custom',
                                editoptions: {
                                    dict: ele.dict,
                                    custom_element: ht.grid.editoptions.custom_element.select,
                                    custom_value: ht.grid.editoptions.custom_value.select
                                },
                                dict: ele.dict,
                                formatter: ht.grid.formatter.dict,
                                unformat: ht.grid.unformat.dict
                            };

                            if (htUtilHasValue(ele.childColumnName)) {
                                $.extend(customOpt.editoptions, {
                                    dataEvents: ht.grid.editoptions.dataEvents.select(ele.dict, ele.columnName, ele.childColumnName)
                                });
                            }
                        }
                    } else {
                        // 普通的下拉框
                        if (ele.type == 'select') {
                            var _dict = ele.dict;
                            var editoptionsVal = '';

                            // 如果下拉选项来自字典
                            if (ele.isBindDict == 'true' && _dict != '') {
                                editoptionsVal = ht.dict[_dict];
                            } else if (htUtilHasValue(ele.expandParam, 'object')) {

                                // 如果下拉选项来自“扩展参数”
                                var _strVal = '', _arrVal = [];
                                $.each(ele.expandParam, function(key, val){
                                    _strVal = key + ':' + val;
                                    _arrVal.push(_strVal);
                                });
                                editoptionsVal = _arrVal.join(';');
                            }

                            customOpt = {
                                edittype: 'select',
                                editoptions: {value: editoptionsVal},
                                formatter: 'select'
                            };
                            // 日期控件
                        } else if (ele.type == 'date' || ele.type == 'datetime') {
                            customOpt = {
                                editoptions: {
                                    dataInit: function (e) {
                                        layui.use('laydate', function () {
                                            var laydate = layui.laydate;
                                            laydate.render({
                                                elem: e, //指定元素
                                                type: 'datetime',
                                                format: 'yyyy-MM-dd HH:mm:ss',
                                            });
                                        });
                                    }
                                }
                            };
                        }else if (ele.type == 'image') {
                            customOpt = {
                                formatter: function (cellvalue, options, rowdata) {
                                    return '<img class="ht-list-img" src="'+ cellvalue +'" onerror="'+ HT_IMG_ERROR +'" />';
                                }
                            }
                        } else if (ele.type == 'checkbox') {
                            // Todo
                        } else if (ele.type == 'radio') {
                            // Todo
                        }
                    }
                }
                customOpt = $.extend(true, {}, defaultOpt, customOpt);
                //console.log(customOpt)
                arr.push(customOpt);
            }
        });
        // end loop
    }
    // 合并自定义的列属性
    $.each(arr, function (idx, ele) {
        //if (ele.name == 'action'
        ////&& (!htUtilHasValue(opt.view) || (htUtilHasValue(opt.view) && !htUtilHasValue(opt.view.width)))
        //&& !htUtilHasValue(opt.view)
        //&& _vm.tplType == 'inline') {
        //ele.width = 120;
        //}
        if (ele.name in opt) {
            $.extend(true, ele, opt[ele.name]);
        }
    });
    return arr;
} // ENd of htGridGenColumns

function htGridFormatterDict (cellvalue, options, rowObject) {
    var dict = layui.data('dict');
    //解析替换掉数据字典key中的指定内容
    //如area_[province]_[city]替换为area_guangdong_guangzhou
    var dictKey = options.colModel.dict;
    var regExp = /\[.*?\]/g;
    var matches = dictKey.match(regExp);
    if (matches != null && matches.length > 0) {
        for (var index = 0; index < matches.length; index++) {
            var matchStr = matches[index];
            var colModelName = matchStr.replace("[", "").replace("]", "");
            var selectedValue = rowObject[colModelName];
            if (htUtilHasValue(selectedValue)) {
                dictKey = dictKey.replace(matchStr, selectedValue);
            } else {
                dictKey = "";
            }
        }
    }
    //根据具体的key查找数据字典内容
    if (dictKey != "" && htUtilHasValue(dict[dictKey])) {
        var arr = dict[dictKey].split(";");
        for (var i = 0; i < arr.length; i++) {
            var str = arr[i];
            var val = str.split(":")[0];
            if (cellvalue == val) {
                return str.split(":")[1];
            }
        }
    }
    return '';
} // END of htGridFormatterDict

function htGridUnformatDict (cellvalue, options, rowObject) {
    var rowId = options.rowId;
    var tableId = $("#"+rowId).closest("table").attr("id");
    //解析替换掉数据字典key中的指定内容
    //如area_[province]_[city]替换为area_guangdong_guangzhou
    var dict = layui.data('dict');
    var dictKey = options.colModel.dict;
    var regExp = /\[.*?\]/g;
    var matches = dictKey.match(regExp);
    if (matches != null && matches.length > 0) {
        for (var index = 0; index < matches.length; index++) {
            var matchStr = matches[index];
            var colModelName = matchStr.replace("[", "").replace("]", "");
            var selectedEleId = rowId + "_" + colModelName;
            var selectedValue = $("#" + selectedEleId).val();
            var colValue = $("#"+tableId).jqGrid("getCell",rowId,colModelName);
            //获取本行的其他单元格数据值时，单元格有可能是编辑状态或者未编辑状态
            if (htUtilHasValue(selectedValue)||htUtilHasValue(colValue)) {
                if(htUtilHasValue(selectedValue)){
                    dictKey = dictKey.replace(matchStr, selectedValue);
                }else if(htUtilHasValue(colValue)){
                    dictKey = dictKey.replace(matchStr, colValue);
                }
            } else {
                dictKey = "";
            }
        }
    }
    if (dictKey != "") {
        var arr = dict[dictKey].split(";");
        for (var i = 0; i < arr.length; i++) {
            var str = arr[i];
            var text = str.split(":")[1];
            if (cellvalue == text) {
                return str.split(":")[0];
            }
        }
    }
} // END of htGridUnformatDict

function htGridEditoptionsCustomElementSelect (value, options) {
    var rowId = options.rowId;
    var colName = options.name;
    var dictKey = options.dict;
    var dict = layui.data('dict');
    var eleId = rowId + "_" + colName;

    var tableId = $("#"+rowId).closest("table").attr("id");
    var el = document.createElement("select");
    el.setAttribute("id", eleId);
    el.setAttribute("class", "editable inline-edit-cell form-control");
    el.setAttribute("role", "select");

    var regExp = /\[.*?\]/g;
    var matches = dictKey.match(regExp);
    if (matches != null && matches.length > 0) {
        for (var index = 0; index < matches.length; index++) {
            var matchStr = matches[index];
            var colName = matchStr.replace("[", "").replace("]", "");
            var selectedEleId = rowId + "_" + colName;
            var selectedValue = $("#" + selectedEleId).val();
            //var colValue = $("#"+tableId).jqGrid("getCell",rowId,colName);
            var colValue = (Number(rowId) <= -1) ? null : $("#"+tableId).jqGrid("getCell",rowId,colName);
            //获取本行的其他单元格数据值时，单元格有可能是编辑状态或者未编辑状态
            if (htUtilHasValue(selectedValue)||htUtilHasValue(colValue)) {
                if(htUtilHasValue(selectedValue)){
                    dictKey = dictKey.replace(matchStr, selectedValue);
                }else if(htUtilHasValue(colValue)){
                    dictKey = dictKey.replace(matchStr, colValue);
                }
            } else {
                dictKey = "";
            }
            //console.log(colValue)
        }
    }

    // 如果下拉选项有匹配的字典
    //if (options.isBindDict == 'true' && dictKey != "") {
    if (options.dict && dictKey != "") {
        var arr = dict[dictKey].split(";");
        $("#" + options.id).empty();
        for (var i = 0; i < arr.length; i++) {
            var str = arr[i];
            var _arr = str.split(":");
            var isSelected = value == _arr[0];
            el.appendChild(new Option(_arr[1], _arr[0], false, isSelected));
        }
    } else if (htUtilHasValue(options.expandParam, 'object')) {
        // 如果下拉选项用自定义参数（JSON格式）
        $("#" + options.id).empty();
        $.each(options.expandParam, function(key, val){
            // Todo: 下行比对时，数据类型可能不一致
            var isSelected = value == key;
            el.appendChild(new Option(val, key, false, isSelected));
        });
    }
    return el;
} // END of htGridEditoptionsCustomElementSelect

function htGridEditoptionsDataEventsSelect (dictStr, column, childColumn) {
    var dict = layui.data('dict');
    var changeEvent = {};
    changeEvent.type = 'change';
    changeEvent.fn = function (e) {
        //防止数据污染，重新定义
        var dictKey = dictStr;
        var columnName = column;
        var childColumnName = childColumn;

        var selectEles = e.currentTarget.getElementsByTagName('select');
        var selectId = selectEles[0].getAttribute('id');
        var childSelectId = selectId.replace(columnName,childColumnName);
        var selectVal = $("#" + selectId).val();
        var childSelect = $("#" + childSelectId);
        childSelect.empty();
        var regExp = /\[.*?\]/g;
        var matches =dictKey.match(regExp);
        if (matches != null && matches.length > 0) {
            for (var index = 0; index < matches.length; index++) {
                var matchStr = matches[index];
                var colName = matchStr.replace("[", "").replace("]", "");
                var selectedEleId = selectId.replace(columnName, colName);
                var selectedValue = $("#" + selectedEleId).val();
                if (htUtilHasValue(selectedValue)) {
                    dictKey = dictKey.replace(matchStr, selectedValue);
                } else {
                    dictKey = "";
                }
            }
        }
        var arr = dict[dictKey + "_" + selectVal].split(";");
        for (var i = 0; i < arr.length; i++) {
            var str = arr[i];
            var val = str.split(":")[0];
            var text = str.split(":")[1];
            childSelect.append("<option value=\"" + val + "\">" + text + "</option>");
        }
        childSelect.change();
    }
    return [changeEvent];
} // End of htGridEditoptionsDataEventsSelect

function htGridEditoptionsCustomValueSelect (elem, operation, value) {
    if (operation === 'get') {
        return $(elem).val();
    }
}

function htGridBtnAction (_vm) {
    var arrBtnAction = [
        /*
         {
         name: 'name',
         text: '按钮名称',
         param: {}, // 额外参数
         click: function () {},
         callback: function () {}
         }
         */
    ];
    var gridInst = $('#' + _vm.gridEle);
    var girdId = gridInst.attr('id');
    var ids = gridInst.jqGrid('getDataIDs');
    var selectDatasMap = gridInst.data('selectDatasMap') || {};
    var ret = {};

    ret.concatBtn = function (arr) {
        arrBtnAction = [].concat(arrBtnAction, arr);
    };

    ret.renderBtn = function (isCrud) {
        var permission = htUtilHasValue(HTPERM, 'object') ? HTPERM : {};
        for (var i = 0; i < ids.length; i++) {
            var id = ids[i];
            var butHtml = "<div class='btn-group btn-group-xs ht-grid-action' data-id='" + id + "'>";
            var _renderBtn = function (btnName, btnText) {
                return "<button class='btn btn-default ht-btn-" + btnName + "' type='button'><span>" + btnText + "</span></button>";
            };

            $.each(arrBtnAction, function (idx, ele) {
                var _html = _renderBtn(ele.name, ele.text);
                // 如果是标准的增删改查操作）
                if (htUtilHasValue(isCrud) == true) {
                    // 权限过滤
                    //if (ele.name in permission) {
                    // 如果是新增
                    if (Number(id) <= -1) {
                        if (ele.name == 'save' || ele.name == 'cancel') {
                            butHtml += _html;
                        }
                    } else {
                        butHtml += _html;
                    }
                    //}
                } else {
                    // 如果是自定义的操作按钮（将跳过权限过滤）
                    butHtml += _html;
                }
            });

            butHtml += "</div>";
            gridInst.jqGrid('setRowData', ids[i], {action: butHtml});
        }

        gridInst.closest('.ht-wrapper-grid').off().on(
            'click',
            'td[aria-describedby=' + girdId + '_action] .btn-group button',
            function (e) {
                e.stopPropagation();
                var that = this;
                var $btn = $(this);
                var id = $btn.parent().attr('data-id');
                $.each(arrBtnAction, function (idx, ele) {
                    if ($btn.hasClass('ht-btn-' + ele.name)) {
                        ele.click.apply(that, [id, _vm, ele.param]);
                        return false;
                    }
                });
            });
    };
    return ret;
} // END of htGridBtnAction

function htGridBtnCrud (_vm, param) {
    /* gridDom, param
     * 参数 param 的结构：
     * {
     *   edit: {
     *       text: '',
     *       param: {
     *           // click 中用到的变量
     *           yourParam: '',
     *           callback: function(){
     *               // 下面 click 事件的回调
     *           }
     *       }
     *       click: function (id, vm, param) {
     *           // 默认传参：当前数据行的 id；与当前数据列表关联的 vm 实例；接收上面传过来的 param
     *       }
     *   },
     *   view: {...},
     *   save: {...},
     *   cancel: {...},
     *   // 在改查存消按钮“前”，增加其它按钮
     *   beforeCrud: [
     *       {
     *           name: 'activate',
     *           text: '激活',
     *           click: function (id, vm, param) {...}
     *       }
     *   ],
     *   // 在改查存消按钮“后”，增加其它按钮
     *   afterCrud: [
     *       {
     *           name: 'approve',
     *           text: '审核',
     *           click: function (id, vm, param) {...}
     *       }
     *   ]
     * }
     * */

    var gridInst = $('#' + _vm.gridEle);
    var gridParam = gridInst.jqGrid('getGridParam');
    var tplType = _vm.tplType || '';
    var girdId = gridInst.attr('id');
    var selectDatasMap = gridInst.data('selectDatasMap') || {};
    var ids = gridInst.jqGrid('getDataIDs');
    var param = htUtilHasValue(param, 'object') ? param : {};
    //取消时调用，解决自定义类型时取消失败问题
    var restoreParams = {
        afterrestorefunc: function (response) {
            if (selectDatasMap[response]) {
                gridInst.jqGrid("setRowData",response,selectDatasMap[response])
            }
        }
    };
    var arrAction = [
        {
            name: 'edit',
            text: '编辑',
            param: {
                editParams: {}
            },
            click: function (id, instVm, param) {
                //编辑时先获取RowData，保存起来，方便取消的时候调用
                if(!htUtilHasValue(selectDatasMap[id])){
                    selectDatasMap[id] = gridInst.jqGrid("getRowData",id);
                    gridInst.data('selectDatasMap',selectDatasMap);
                }
                gridInst.jqGrid('editRow', id, param.editParams);

                // 回调
                if (htUtilHasValue(param.callback, 'function')) {
                    param.callback(id, instVm, param);
                }
            }
        },
        {
            name: 'view',
            text: '查看',
            param: {},
            click: function (id, instVm, param) {
                instVm.getInfo(id);

                // 回调
                if (htUtilHasValue(param.callback, 'function')) {
                    param.callback(id, instVm, param);
                }
            }
        },
        {
            name: 'save',
            text: '保存',
            param: {
                pathName: pathName
            },
            click: function (id, instVm, param) {
                var hasValue = htUtilHasValue;
                var $btn = $(this);
                var rowId = $btn.closest('tr').attr('id');
                var isNew = Number(rowId) <= -1;
                var url = '';

                // 如果是新增
                if (isNew){
                    var primaryId = '';
                    // 如果有子表，通过父级 VM 动态引用主键的值
                    if (hasValue(param.parentVm) && hasValue(param.parentVm.primaryId)) {
                        primaryId = param.parentVm.primaryId;
                    } else if (hasValue(param.classId)) {
                        primaryId = param.classId;
                    }
                    url = "../" + param.pathName + "/save/" + (htUtilHasValue(primaryId) ? primaryId : '');
                } else {
                    url = "../" + param.pathName + "/update"
                }

                var parameter = {
                    url: url, //代替jqgrid中的editurl
                    mtype: "GET", //提交方式
                    successfunc: function (XHR) { //在成功请求后触发;事件参数为XHR对象，需要返回true/false;
                        console || console.log(XHR.responseJSON.msg);
                        if (selectDatasMap[id]) {
                            delete selectDatasMap[id];
                        }
                        if (XHR.responseJSON.code == "0") {

                            // 如果是新增
                            if (isNew) {
                                // 如果开启一次可新增多行，保存成功后不刷新
                                if (instVm.multiAdd == true) {
                                    param.isReload = false;
                                }
                                if (param.isReload != false) {
                                    if (htUtilHasValue(param.parentVm, 'object')) {
                                        //instVm.reload(param.postData);
                                        //instVm.reloadChildGrid();
                                        param.parentVm.reloadChildGrid(param.className);
                                    } else {
                                        instVm.reload();
                                    }
                                }
                            }
                            alert(XHR.responseJSON.msg);
                            return true; //返回false会使用修改前的数据填充,同时关闭编辑模式。
                        } else {
                            alert(XHR.responseJSON.msg);
                            return false; //返回true会使用修改后的数据填充当前行,同时关闭编辑模式。
                        }

                        // 回调
                        if (htUtilHasValue(param.callback, 'function')) {
                            param.callback(XHR, id, instVm, param);
                        }
                    }
                }
                gridInst.saveRow(id, parameter);
            }
        },
        {
            name: 'cancel',
            text: '取消',
            param: {
                restoreParams: restoreParams
            },
            click: function (id, instVm, param) {
                gridInst.jqGrid('restoreRow', id, param.restoreParams);

                // 回调
                if (htUtilHasValue(param.callback, 'function')) {
                    param.callback(id, instVm, param);
                }
            }
        }
    ];

    // 如果是行内编辑模板，删除“查看”按钮
    if (tplType == 'inline') {
        var idxView = (function(){
            var ret;
            $.each(arrAction, function (idx, ele) {
                if (ele.name == 'view') {
                    ret = idx;
                    return;
                }
            });
            return ret;
        })();
        arrAction.splice(idxView, 1);
    }

    // 合并 param
    var _arrAction = [];
    $.each(arrAction, function (idx, ele) {
        var _btnProp = param[ele.name];

        if (ele.name in param) {
            if (_btnProp != false) {
                _arrAction.push($.extend(true, ele, _btnProp));
            }
        } else {
            _arrAction.push(ele);
        }
    });

    // 在操作列内，生成按钮
    var instBtnAction = new htGridBtnAction(_vm);
    if (htUtilHasValue(param.beforeCrud, 'array')) {
        instBtnAction.concatBtn(param.beforeCrud);
    }
    instBtnAction.concatBtn(_arrAction);
    if (htUtilHasValue(param.afterCrud, 'array')) {
        instBtnAction.concatBtn(param.afterCrud);
    }
    instBtnAction.renderBtn('isCrud');
} // END of htGridBtnCrud

function htGridAddRow (gridInst, params) {
    var _params = {
        rowID: "-1", //默认
        initdata: {},
        position: "first", //jqGrid第一行
        useDefValues: false,
        useFormatter: false,
        //reloadAfterSubmit: false,
        //refresh:false,
        addRowParams: {extraparam: {}}
    };

    if (htUtilHasValue(params, 'number')) {
        if (params <= 0) return;
        for (var i = 0; i < params; i++){
            setTimeout(function(){
                gridInst.jqGrid('addRow', 'new');
            }, 500 * i);
        }
        return false;
    }

    if ($('.ht-wrapper-grid .ui-jqgrid-bdiv :input:visible:not(.cbox, button)').length > 0) {
        alert('请处理（保存或取消）正在编辑的数据先');
        return false;
    }

    if ($.type(params) == 'object') {
        _params = $.extend(true, _params, params);
    }

    // 判断如果没有未保存的新增行，则新增
    if (gridInst.find('tr[id=-1]').length == 0) {
        gridInst.jqGrid('addRow', _params);
    }
} // END of htGridAddRow


// ============================================================================
// Wrapping LayUI

function htLayuiInitElement (_vm) {
    //激活tab标签
    layui.use('element', function () {
        var element = layui.element;
        element.on('tab', function (data) {
            var id = $(this).attr("id");
            !!id && _vm.selectTabs(id);
        });
    });
}

function htLayuiInitDate (_vm) {
    var className = _vm.className;
    var columns = _vm.columns;
    var _opt = {
        type: 'datetime',
        theme: 'molv'
    }
    layui.use('laydate', function () {
        var laydate = layui.laydate;
        if (htUtilHasValue(columns, 'object') == false) return;
        $.each(columns, function () {
            var colType = this.type;
            var queryType = this.queryType;
            var attrName = this.attrName;
            var nameStart = attrName + 'Start';
            var nameEnd = attrName + 'End';

            if (colType == 'date') {
                _opt.format = 'yyyy-MM-dd';
            } else if (colType == 'datetime') {
                _opt.format = 'yyyy-MM-dd HH:mm:ss';
            }

            if (queryType == '2') {
                laydate.render($.extend(true, _opt, {
                    elem: '#' + nameStart,
                    done: function (value, date, endDate) {
                        _vm.q[nameStart] = value;
                    }
                }));
                laydate.render($.extend(true, _opt, {
                    elem: '#' + nameEnd,
                    done: function (value, date, endDate) {
                        _vm.q[nameEnd] = value;
                    }
                }));
            }
            laydate.render($.extend(true, _opt, {
                elem: '#' + attrName,
                done: function (value, date, endDate) {
                    _vm[className][attrName] = value;
                }
            }));
        });
    });
}

function htLayuiInitForm (_vm) {
    var className = _vm.className;
    layui.use('form', function() {
        var form = layui.form;
        form.render(); //更新全部
        $.each(_vm.columns, function(){
            var colType = this.type;
            var attrName = this.attrname;
            var isQuery = this.isQuery == 'true';
            var elements = [
                {
                    ele: 'select',
                    evt: 'select(query)',
                    cb: function (data) {
                        if (data.elem.name == attrName) {
                            if (isQuery) {
                                _vm.q[attrName] = data.elem.value;
                            }
                        }
                    }
                },
                {
                    ele: 'checkbox',
                    evt: 'checkbox(query)',
                    cb: function (data) {
                        if (data.elem.name == attrName) {
                            if (isQuery) {
                                _vm.q[attrName] = data.elem.checked;
                            }
                        }
                    }
                },
                {
                    ele: 'radio',
                    evt: 'radio(query)',
                    cb: function (data) {
                        if (data.elem.name == attrName) {
                            if (isQuery) {
                                _vm.q[attrName] = data.elem.value;
                            }
                        }
                    }
                },
                {
                    ele: 'select',
                    evt: 'select(saveOrUpdate)',
                    cb: function (data) {
                        if (data.elem.name == attrName) {
                            _vm[className][attrName] = data.elem.value;
                        }
                    }
                },
                {
                    ele: 'checkbox',
                    evt: 'checkbox(saveOrUpdate)',
                    cb: function (data) {
                        if (data.elem.name == attrName) {
                            _vm[className][attrName] = data.elem.checked;
                        }
                    }
                },
                {
                    ele: 'radio',
                    evt: 'radio(saveOrUpdate)',
                    cb: function (data) {
                        if (data.elem.name == attrName) {
                            _vm[className][attrName] = data.elem.value;
                        }
                    }
                }
            ];

            $.each(elements, function(){
                if (colType == this.ele) {
                    form.on(this.evt, this.cb);
                }
            });
        });
        // END of columns loop
    });
    // END of layui.use
}

// Form
function htInitValidate (vm, _rules) {
    var className = vm.className;
    var pathName = vm.pathName;
    var columns = vm.columns;
    var opt = {
        rules: {},
        messages: {}
    };

    if (htUtilHasValue(className)
        && htUtilHasValue(pathName)
        && htUtilHasValue(columns, 'array')) {

        $.each(columns, function(idx, ele){
            opt.rules[ele.attrname] = {};
            var rules = opt.rules[ele.attrname];
            opt.messages[ele.attrname] = {};
            var messages = opt.messages[ele.attrname];

            if (ele.isRequired == 'true') {
                rules['required'] = true;
                messages['required'] = (htUtilHasValue(ele.message)) ? ele.message : '请输入' + ele.comments;
            }

            if (ele.editrules == 'email') {
                rules['email'] = true;
            }

            if (ele.editrules == 'date') {
                rules['date'] = true;
            }

            if (ele.editrules == 'number') {
                rules['number'] = true;
            }

            if (ele.editrules == 'integer') {
                rules['digits'] = true;
            }

            var charLength = ele.characterLength;
            if (charLength > 0) {
                rules['maxlength'] = charLength;
                messages['maxlength'] = ele.comments + '长度不能超过' + charLength + '个字符'
            }
        });
    }

    var $form = $('#' + pathName + 'Form');
    if ($form.length > 0 && htUtilHasValue(opt.rules, 'object')) {
        if (htUtilHasValue(_rules, 'object')) {
            opt = $.extend(true, opt, _rules);
        }
        $form.validate(opt);
    }
} // END of htInitValidate

function htUtilValidDate(date){//console.log(date)
    //参数date可以格式化为xx-xx-xx或xxxx-xx-xx或用/分割
    if(typeof date=='undefined'){
        return false;
    }
    return (new Date(date).getDate()==date.substring(date.length-2));
}