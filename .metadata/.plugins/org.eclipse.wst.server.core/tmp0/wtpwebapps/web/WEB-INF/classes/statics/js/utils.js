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


/**
 * 取得url参数
 */
function getUrlParam (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); // 构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  // 匹配目标参数
    if (r != null) return unescape(r[2]); return null; // 返回参数值
}

function getUrlParamDecodeURI (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); // 构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  // 匹配目标参数
    if (r != null) return decodeURI(r[2]); return null; // 返回参数值
}

// 格式化数字
function formatNum (f, digit) {
    // f = value  digit= 比例
    var m = Math.pow(1000, digit);
    return parseInt(f * m, 10) / m;
}

// 生成连续数字的数组
/*
e.g: numbersArray(13)
[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]

e.g: numbersArray(12, 2, 2)
[2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24]
*/
function numbersArray (count, start, _step) {
    var start = start || 1;
    var step = _step ? _step - 1 : 1;
    //return Array(++count).join('0').split('').map(function(v,i){return ++i});
    return Array(++count)
        .join('0')
        .split('')
        .map(function (v, i) {
            return i = i + start + ((_step) ? step * i : 0);
        });
}

// 生成 guid
// 长度 32 位，例如：957102a255d6478c92d9b29a6cf07cac
// 注意：开头有可能是数字
function guid () {
    return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function htPrint (_info) {
    // window.print();
    _info ? HT_LODOP.print(_info) : window.print()
}
//獲取前端緩存的數據字典
function getCodeList (mark) {
    var dict = layui.data('dict');
    return dict[mark];
}
//獲取前端緩存的數據字典
function getCodeAll (mark) {
    let dict = layui.data('dict');
    let res = dict[mark]
    res = recursionDict(res);
    return res;
}
//递归转换字典
function recursionDict (arr) {
    let dict = layui.data('dict');
    if (arr && arr.length > 0) {
        arr.map(item => {
            let dict2 = dict[item.mark];
            if (dict2) {
                Object.assign(item, {
                    children: dict2
                });
            }
            recursionDict(dict2);
        })
    }
    return arr;
}
/*
功能：异步加载 js，全部加载完毕后执行 callback
@params:
	arr 为数组，元素为各 js 的 url
	callback 为回调，所有 js 加载后要执行的逻辑
*/
function htLoadJs (arr, callback) {
    if ($.type(arr) != 'array') return;

    var env = ($.type(callback) == 'string') ? 'dev' : '';
    var rdm = webInstance || '';

    var _arr = [];
    var _arrNew = [];
    var rootPath = contextPath || window.HT_ROOT || '/web';
    var namePathMap = htComponentMap || {};
    var callback = (typeof callback != 'function') ? null : callback;
    var ajaxGet = function (url) {
        return $.ajax({
            type: 'get',
            dataType: 'script',
            cache: false,
            url: url
        });
    };
    var appendScript = function (jsPath) {
        if (env == 'dev') {
            var script = document.createElement("script");
            script.setAttribute('src', jsPath + '?_=' + rdm);
            document.head.appendChild(script);
        }
    };

    if (typeof window.HT_ENV != 'undefined' && window.HT_ENV == 'prod') {
        env = 'prod';
    }

    $.each(arr, function (idx, ele) {
        var realPath = '';

        // 遍历 htComponentMap 将组件名转换为对应的 js 路径
        if ((/.js$/i).test(ele) == false) {
            if (typeof namePathMap[ele] != 'undefined') {
                realPath = namePathMap[ele];

                if (env == 'prod') {
                    realPath = '/dist' + realPath;
                }

                var jsPath = rootPath + realPath;

                // 删除之前加载的同名组件
                $('script[src$="' + ele + '.js"').remove();

                // 如果是开发环境，以 script 标签直接引入到 head
                appendScript(jsPath);

                _arr.push(jsPath);
            }
        } else {
            // 如果不是组件，必须是以 / 开头的绝对地址
            realPath = ele;

            if (env == 'prod') {
                realPath = realPath.replace(rootPath + '/js/', rootPath + '/dist/js/');
            }

            appendScript(realPath);
            _arr.push(realPath);
        }
    });

    if (env == 'dev') return;

    if (_arr.length > 0) {
        var len = _arr.length;
        $.each(_arr, function (idx, ele) {

            _arrNew.push(ajaxGet(ele));

            if (idx == len - 2) {
                if (callback == null) {
                    return false;
                }
            }
        });
        // 开始批量请求
        var when = $.when.apply(null, _arrNew);

        if (callback != null) {
            when.done(callback);
        } else {
            // 如果没有回调，自动将最后一个 js 以回调方式加载
            var lastEle = _arr[len - 1];
            when.done(function () {
                ajaxGet(lastEle);
            });
        }

        // 任何一个请求出错，返回错误信息
        when.fail(function (jqXHR, textStatus, errorThrown) {
            console.log(arguments);
        });
    }
}

function htHandlerProductDetail (list, bill, obj, dataSourceType, key) {
    //list: 分录行数据列表，数组形式，
    //bill: 整单单据，json对象形式
    //obj: 分录行字段对象
    //dataSourceType: 是否来自上游
    //key: 分录行数组对应的字段名字，默认是goodList
    let myAttr = { //组成属性
        applyOrganizationId: null,
        bomType: '',
        countingUnit: '',
        documentType: '',
        goldColor: null,
        goldLoss: null,
        commodityId: '',
        goodsCode: '',
        goodsId: '',
        id: '',
        inPrice: null,
        limit: null,
        name: '',
        num: '',
        partAttrs: [],
        price: null,
        pricingMethod: null,
        stoneClarity: null,
        stoneCoffeeColor: null,
        stoneColor: null,
        stoneCut: null,
        stoneFluorescent: null,
        stoneLoss: null,
        stoneMilkColor: null,
        stoneName: null,
        stoneNo: null,
        stoneSection: null,
        stoneShape: null,
        stoneWeight: null,
        weight: null,
        weightUnit: null
    };
    list.map((item, index) => {
        if (item.detailMark == 2) {
            if (!bill[key || 'goodList'][index]) {
                bill[key || 'goodList'][index] = JSON.parse(JSON.stringify(obj));
            }

            Object.assign(bill[key || 'goodList'][index], {
                stonesParts: item.stonesParts,
                goldParts: item.goldParts,
                partParts: item.partParts,
                materialParts: item.materialParts,
            });
            return;
        }
        if (!item.tBaseBomEntity && !item.assistAttrs && !dataSourceType) {
            //如果数据没变则提交空数组
            Object.assign(item, {
                stonesParts: [],
                goldParts: [],
                partParts: [],
                materialParts: [],
            });
            if (!bill[key || 'goodList'][index]) {
                bill[key || 'goodList'][index] = JSON.parse(JSON.stringify(obj));
            }
            bill[key || 'goodList'][index].goldParts = [];
            bill[key || 'goodList'][index].stonesParts = [];
            bill[key || 'goodList'][index].partParts = [];
            bill[key || 'goodList'][index].materialParts = [];
            return;
        }

        if (!item.tBaseBomEntity && !item.assistAttrs && dataSourceType) {
            //来自上游
            Object.assign(item, {
                stonesParts: item.stonesParts,
                goldParts: item.goldParts,
                partParts: item.partParts,
                materialParts: item.materialParts,
            });
            bill[key || 'goodList'][index].goldParts = item.goldParts;
            bill[key || 'goodList'][index].stonesParts = item.stonesParts;
            bill[key || 'goodList'][index].partParts = item.partParts;
            bill[key || 'goodList'][index].materialParts = item.materialParts;
            return;
        }

        if (item.goodsMainType === 'attr_ranges_goods') {//成品
            //石料金料组成部分数据处理开始
            item.tBaseBomEntity.goldBoms.map((attr, i) => {
                if (!attr.checked) {//金料只能提交一条。
                    return;
                }
                let attrTemp = JSON.parse(JSON.stringify(myAttr));

                Object.assign(attrTemp, {
                    bomType: 'BOM-GOLD',
                    weightUnit: attr.weightUnitName,
                    weightUnitId: attr.weightUnitId,
                    countingUnitId: attr.countUnitId,
                    countingUnit: attr.countUnitName,
                    weight: attr.weightReference,
                    commodityId: attr.commodityId,
                    goodsCode: attr.commodityCode,
                    name: attr.commodityName,
                    goldLoss: attr.lose,
                    goldColor: attr.condition
                    //不固定辅助属性
                });
                (attr.attr || []).map(list => {
                    if (Object.keys(list).length > 0) {
                        attrTemp.partAttrs.push({ attr: list.name || list.attr, attrValue: list.model || list.attrValue });
                    }
                });

                if (!bill[key || 'goodList'][index]) {
                    bill[key || 'goodList'][index] = JSON.parse(JSON.stringify(obj));
                }
                if (!bill[key || 'goodList'][index].goldParts) {
                    bill[key || 'goodList'][index].goldParts = [];
                }
                bill[key || 'goodList'][index].goldParts.push(attrTemp);
            });
            item.tBaseBomEntity.stonesBoms.map((attr, i) => {
                let attrTemp = JSON.parse(JSON.stringify(myAttr));
                Object.assign(attrTemp, {
                    bomType: 'BOM-STONE',
                    countingUnitId: attr.countUnitId,
                    countingUnit: attr.countUnitName,
                    weightUnit: attr.weightUnitName,
                    weightUnitId: attr.weightUnitId,
                    num: attr.count,
                    weight: attr.weightReference,
                    commodityId: attr.commodityId,
                    goodsCode: attr.commodityCode,
                    name: attr.commodityName,
                    stoneName: attr.partName,
                    stoneLoss: attr.lose
                });
                (attr.attr || []).map(list => {
                    if (Object.keys(list).length > 0) {
                        attrTemp.partAttrs.push({ attr: list.name || list.attr, attrValue: list.model || list.attrValue });
                    }
                });

                if (!bill[key || 'goodList'][index]) {
                    bill[key || 'goodList'][index] = JSON.parse(JSON.stringify(obj));
                }
                if (!bill[key || 'goodList'][index].stonesParts) {
                    bill[key || 'goodList'][index].stonesParts = [];
                }
                bill[key || 'goodList'][index].stonesParts.push(attrTemp);
            });
            item.tBaseBomEntity.partBoms.map((attr, i) => {
                let attrTemp = JSON.parse(JSON.stringify(myAttr));

                Object.assign(attrTemp, {
                    bomType: 'BOM-PART',
                    countingUnitId: attr.countUnitId,
                    countingUnit: attr.countUnitName,
                    weightUnit: attr.weightUnitName,
                    weightUnitId: attr.weightUnitId,
                    num: attr.count,
                    weight: attr.weightReference,
                    commodityId: attr.commodityId,
                    goodsCode: attr.commodityCode,
                    name: attr.commodityName
                });
                (attr.attr || []).map(list => {
                    if (Object.keys(list).length > 0) {
                        attrTemp.partAttrs.push({ attr: list.name || list.attr, attrValue: list.model || list.attrValue });
                    }
                });
                if (!bill[key || 'goodList'][index]) {
                    bill[key || 'goodList'][index] = JSON.parse(JSON.stringify(obj));
                }
                if (!bill[key || 'goodList'][index].partParts) {
                    bill[key || 'goodList'][index].partParts = [];
                }
                bill[key || 'goodList'][index].partParts.push(attrTemp);
            });
            Object.assign(item, {
                stonesParts: bill[key || 'goodList'][index].stonesParts,
                goldParts: bill[key || 'goodList'][index].goldParts,
                partParts: bill[key || 'goodList'][index].partParts,
            });

        } else { //原料
            let attrTemp = JSON.parse(JSON.stringify(myAttr));
            Object.assign(attrTemp, {
                bomType: 'BOM-MATERIAL'
            });

            //对辅助属性统一处理数据
            item.assistAttrs.assistAttrs.map(attr => {
                if (typeof attr.attr === 'string') {
                    attrTemp.partAttrs.push(attr);
                } else {
                    (attr.attr || []).map(list => {
                        if (Object.keys(list).length > 0) {
                            attrTemp.partAttrs.push({ attr: list.name, attrValue: list.model });
                        }
                    });
                }
            });
            if (!bill[key || 'goodList'][index]) {
                bill[key || 'goodList'][index] = JSON.parse(JSON.stringify(obj));
            }

            if (!bill[key || 'goodList'][index].materialParts) {
                bill[key || 'goodList'][index].materialParts = [];
            }
            bill[key || 'goodList'][index].materialParts.push(attrTemp);

            item.materialParts = bill[key || 'goodList'][index].materialParts;
        }
    });

    return list;
}

function htValidateRow (data, filed, show = true, vueRef) {
    //商品分录行验证必填
    //data: 分录行数组列表
    //filed:验证格式对象
    //vueRef，对象示例
    return data.some((item, index) => {
        for (let attr in filed) {
            if (filed.hasOwnProperty(attr)) {
                if (filed[attr].type === 'string' && (item[attr] === undefined || item[attr] === '' || item[attr] === null)) {
                    if (show) {
                        if(vueRef){
                            vueRef.$Modal.info({
                                title: "提示信息",
                                content: `分录行第${index + 1}行${filed[attr].name}必填`
                            })
                        }else {
                            layer.alert(`分录行第${index + 1}行${filed[attr].name}必填`);
                        }
                    }
                    return true;
                }
                if (filed[attr].type === 'number') {
                    if (!(item['goodsMainType'] === 'attr_ranges_gold' && filed[attr].empty === true)) {
                        let str = filed[attr].floor === 0 ? '^\\+?[1-9][0-9]*$' : '^[0-9]+(.[0-9]{0,' + filed[attr].floor + '})?$';
                        let reg = new RegExp(str);
                        if (!reg.test(item[attr])) {
                            if (show) {
                                if(vueRef){
                                    vueRef.$Modal.info({
                                        title: "提示信息",
                                        content: `分录行第${index + 1}行${filed[attr].name}不符合要求`
                                    })
                                }else {
                                    layer.alert(`分录行第${index + 1}行${filed[attr].name}不符合要求`);
                                }
                            }
                            return true;
                        }
                        if (filed[attr].plus && Number(item[attr]) === 0) {
                            if(vueRef){
                                vueRef.$Modal.info({
                                    title: "提示信息",
                                    content: `分录行第${index + 1}行${filed[attr].name}必须大于0`
                                })
                            }else {
                                layer.alert(`分录行第${index + 1}行${filed[attr].name}必须大于0`);
                            }

                            return true;
                        }
                    }
                }
            }
        }
    });
}

function repositionDropdownOnSroll (parentClassName, childClassName) {
    //parentClassName是最外面的容器 childClassName是放商品编码的td的class名称，如没有自己添加一个
    var obj = document.querySelector('.' + parentClassName);
    $('.' + parentClassName).scroll(function () {
        if ($('.' + childClassName).offset()) {
            var leftNum = $('.' + childClassName).offset().left;
            // console.log('leftNum', leftNum)
            $('.' + parentClassName + ' .ivu-select-dropdown').css({ left: leftNum + "px" })
        }
    })
    if ($('.' + childClassName).offset()) {
        // console.log($('.'+childClassName).length,"eeee")
        var leftNum = $('.' + childClassName).offset().left;
        // console.log('leftNum', leftNum)
        $('.' + parentClassName + ' .ivu-select-dropdown').css({ left: leftNum + "px" })
    }
}

function htInputNumber (item, type, floor) {//限制只能输入小数， floor为小数位数，0表示整数
    if (item[type] !== null && item[type] !== undefined) {
        item[type] = item[type].toString().replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符
        item[type] = item[type].toString().replace(/^\./g, "");  //验证第一个字符是数字而不是.
        item[type] = item[type].toString().replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的.
        item[type] = item[type].toString().replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
        let val = item[type].toString();
        let index = floor === 0 ? (val.indexOf('.') > -1 ? val.indexOf('.') : val.length + 1) :
            (val.indexOf('.') > -1 ? val.indexOf('.') + floor + 1 : val.length + 1);
        item[type] = val.substring(0, index);
    }
}

function inputNumberF (_that, data, name) {
    var that = _that;
    if (!name) {
        that[data] = that[data] ? parseFloat(that[data]).toFixed(2) : '0.00';
        return;
    }
    that[data][name] = that[data][name] ? parseFloat(that[data][name]).toFixed(2) : '0.00';
}

function htCalcTotal (list, keys, receive) {
    if (list && list.length > 0) {
        //需要计算总数的数据数组,list: 数组，keys:需要统计的字段,如果是一个字段则传字符串，如果是多个则传数组，如count或['count', 'money']
        // receive接收总数的对象,可通过receive.countTotal获取总数;
        if (typeof keys === 'string') {
            receive[keys + "Total"] = 0;
            list.map(item => {
                receive[keys + "Total"] += (Number(item[keys]) || 0) * 100;
            });
            receive[keys + "Total"] = Number((receive[keys + "Total"] / 100).toFixed(2));
        } else {
            keys.map(key => {
                receive[key + "Total"] = 0;
                list.map(item => {
                    receive[key + "Total"] += (Number(item[key]) || 0) * 100;
                });
                receive[key + "Total"] = Number((receive[key + "Total"] / 100).toFixed(2));
            });
        }
    }
    return receive
}
function htDifferent (register, test, keys, receive) {
    //两个对象某个字段差异对比，register, test：对比的对象
    //keys:对比的字段，
    //receive接收的对象
    if (typeof keys === 'string') {
        receive[keys + "Total"] = (((Number(test[keys]) || 0) * 100 - (Number(register[keys]) || 0) * 100) / 100).toFixed(2);
    } else {
        keys.map(key => {
            receive[key + "Total"] = (((Number(test[key]) || 0) * 100 - (Number(register[key]) || 0) * 100) / 100).toFixed(2);
        });
    }
}

/*财务 校验系统是否启用 */
function verifySystem (sysType) {
    $.ajax({
        type: 'post',
        async: false,
        data: '',
        url: rcContextPath + '/financeCommon/sysIsEnabled/' + sysType,
        dataType: 'json',
        success: function (res) {
            if (!res.data) {
                this.openTime = window.parent.params && window.parent.params.openTime;
                window.parent.closeCurrentTab({
                    name: name, openTime: window.parent.params && window.parent.params.openTime
                    , exit: true
                });
                alert("系统未启用,请先启用系统");
                return false;
            };
        }
    });
}