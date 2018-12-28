// 基础域名
let _lphost = window.location.host
let _lpport = window.location.port
// if (port) { //端口号不是80处理
//   window.location.href = '//' + window.location.hostname + window.location.pathname
// }



// var LODOP = getLodop(document.getElementById('LODOP_OB'), document.getElementById('LODOP_EM'));
// 当页面不添加以上代码时，getLodop过程会动态建立它们，语句简化如下(推荐)：
// var LODOP=getLodop();


// console.log(rcContextPath, '====_test======${rc.contextPath}')


// var _info = {
//     'title': '核销单',
//     'colNames': [
//         { 'name': '作者', 'col': 'auditorName' },
//         { 'name': '币别', 'col': 'coinStop' },
//         { 'name': '客户', 'col': 'occurrenceObjectOne' },
//         { 'name': '供应商', 'col': 'occurrenceObjectTwo' },
//         { 'name': '日期', 'col': 'documentDate' },
//         { 'name': '创建者', 'col': 'createdTime' },
//         { 'name': '编号', 'col': 'billNumber' },
//         { 'name': '科目', 'col': 'directorId' },
//     ],
//     'styleCss': '',
//     'colMaxLenght': 7,
//     'data': _data.data,
//     'url': window.location.href,
// }

var HT_LODOP = {};


HT_LODOP._conf = {
    'iRadioValue': 1,
    'defaultCss': 'thead{text-align:center;font-size:14px;font-weight:100}thead td{font-weight:100}tbody{font-size:12px;font-weight:100}td{border:1px solid #ccc}.thCs{background-color:#f2f2f2;text-align:center}.align-left{text-align:left}.align-right{text-align:right}.align-center{text-align:center}caption p{font-size:20px;font-weight:bold;line-height:35px;height:35px;margin:0}caption div{font-size:14px;width:33.33%;float:left;line-height:26px;height:26px}tbody td{text-align:right;padding:5px}tbody td:first-child,tbody td:nth-child(2){text-align:left}.ht-foot{font-size:12px}.title1{text-align:left;padding-left:15px;}'
}


HT_LODOP.print = function (_info) {
    var _t = _info.template || 1;
    switch (_t) {
        case 1:
            HT_LODOP.printFinanceTemplate1(_info);
            break;
        case 2:
            HT_LODOP.printFinanceTemplate2(_info);
            break;
        case 12:
            HT_LODOP.printFinanceTemplate12(_info);
            break;
        case 4:
            HT_LODOP.printFinanceTemplate1(_info);
            break;

        default:

            break;
    }

}
function _formartMoney (value) {
    return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
}
// 单表头循环获取数据
HT_LODOP._getData1 = function (_conf) {
    var _d = _conf.data;
    var _thead = '', _tbody = '', _tfoot = '';
    var _theadTitle = `<tr><th colspan="${_conf.colMaxLenght}" align="right">
                        第<font tdata="PageNO" color="blue">##</font>页</span>/共<font tdata="PageCount" color="blue">##</font></span>页
                        </th></tr>`;
    _d.forEach(el1 => {
        var _thTr = '', _tbTr = '', _tfTr = '';
        if (_conf.colNames && _conf.colNames.length) {

            _conf.colNames.forEach((el2, idx2) => {
                var _o1 = el2.name || '';
                var _o2 = el1[el2.col] || '';
                var _txt = _o2;
                var _txtTA = el2.textAlign || 'right';
                el2.formatNub === true && (_txt = _formartMoney(_o2));
                (_conf.colMaxLenght >= (idx2 + 1)) && (_thTr = `${_thTr}<td>${_o1}</td>`, _tbTr = `${_tbTr}<td style="text-align:${_txtTA}">${_txt}</td>`)
            });
        } else { }
        _thead = `<tr class='thCs'>${_thTr}</tr>`; _tbody = `${_tbody}<tr>${_tbTr}</tr>`;
        //  _tfoot = `${_tfoot}<tr>${_tfTr}</tr>`;
    });

    // 是否展示合计
    if (_conf.totalRow) {
        _conf.colNames.forEach((el2, idx2) => {
            if (idx2 === 0) {
                _tfoot = `${_tfoot}<td>合计：</td>`
            } else {
                var _txt = el2.sum ? `<td tdata="SubSum" format="#,##0.00" align="right">###</td>` : `<td ></td>`;
                (_conf.colMaxLenght >= (idx2 + 1)) && (_tfoot = `${_tfoot}${_txt}`)
            }
        });
    }


    return `<thead>${_theadTitle}${_thead}</thead><tbody>${_tbody}</tbody><tfoot ><tr class="ht-foot">${_tfoot}</tr></tfoot></table>`;
    // _ht = `${_ht}<thead>${_thead}</thead><tbody>${_tbody}</tbody><tfoot>${_tfoot}</tfoot>`;

}
// 头部详细信息
HT_LODOP._getTitleInfo = function (_info) {
    var _ti = '';
    if (_info.titleInfo) {
        _info.titleInfo.forEach((el2, idx2) => {
            var _class = '';
            switch (idx2) {
                case 0:
                case 3:
                case 6:
                case 9:
                    _class = 'align-left';
                    break;
                case 1:
                case 4:
                case 7:
                case 10:
                    _class = 'align-center';
                    break;
                case 2:
                case 5:
                case 8:
                case 11:
                    _class = 'align-right';
                    break;
                default:
                    break;
            }
            var _n = el2.name ? el2.name + '：' : '';
            _ti = `${_ti}<div class="${_class}">${_n}${el2.val}</div>`;
        });
    }
    return _ti;
}
// 初始化对象
HT_LODOP._getInitConf = function (_info) {
    var _t = {
        'title': _info.title || '数据显示', // 标题
        'template': _info.template || 1,  // 模板
        'titleInfo': _info.titleInfo || [],
        'colNames': _info.colNames || [],
        'styleCss': `<style>${HT_LODOP._conf.defaultCss}${_info.styleCss}</style>`,   // 自定义样式 例：  thead{text-align: center;font-size: 14px;font-weight: 100;}
        'colMaxLenght': _info.colMaxLenght || 7,  // 显示最大长度， 默认为7
        'data': _info.data || [], // 打印数据  list
        'tbodyInfo': _info.tbodyInfo || {}, // 打印数据  list
        'setPageSize': _info.setPage || 0, // 打印格式，1 纵向，2 横向
        'totalRow': _info.totalRow === undefined ? true : _info.totalRow, // 是否显示合计
    }
    return _t;
}
// 财务 模板1 ： 通用单表头，title  
HT_LODOP.printFinanceTemplate1 = function (_info) {

    try {
        var _LODOP = getLodop();
        if (_LODOP.VERSION) {
            if (_LODOP.CVERSION)
                console.log("当前有C-_LODOP云打印可用!\n C-_LODOP版本:" + _LODOP.CVERSION + "(内含_LODOP" + _LODOP.VERSION + ")");
            else
                console.log("本机已成功安装了_LODOP控件！\n 版本号:" + _LODOP.VERSION);
        };
        var _conf = HT_LODOP._getInitConf(_info);
        var _txt = HT_LODOP._getTitleInfo(_conf);
        var _ht = `<table border='1' width='100%' style='border:solid 1px #ccc;border-collapse:collapse'>
                    <caption style='border:1px solid #ccc;border-bottom: none;'><p class='title1'>${_conf.title}</p>${_txt} </caption>`;
        // 数据模式 （无数据就执行 url 请求）
        if (_conf.data) {
            var _t = HT_LODOP._getData1(_conf);
            _ht = `${_ht}${_t}`;
        } else {
            // console.log(_conf.url);
        }

        _ht = `${_conf.styleCss}${_ht}`;
        // console.log(_ht);
        _LODOP.PRINT_INIT(_conf.title);
        _LODOP.SET_PRINT_PAGESIZE(_conf.setPageSize);
        _LODOP.ADD_PRINT_TABLE("2%", "2%", "96%", "85%", _ht);
        LODOP.SET_PRINT_STYLEA(0, "TableHeightScope", HT_LODOP._conf.iRadioValue);
        _LODOP.PREVIEW();

        // var strStyleCSS = `<link href='${window.location.origin}${rcContextPath}/plugins/jqgrid/ui.jqgrid-bootstrap.css' type='text/css' rel='stylesheet'><link rel='stylesheet' type='text/css' href='${window.location.origin}${rcContextPath}/css/bootstrap.min.css'><link rel='stylesheet' type='text/css' href='${window.location.origin}${rcContextPath}/plugins/layui/css/layui.css'><link rel='stylesheet' type='text/css' href='${window.location.origin}${rcContextPath}/plugins/iview/styles/iview.css'><link rel='stylesheet' type='text/css' href='${window.location.origin}${rcContextPath}/css/finance/report/ReceivableWriteofflist/index.css'>`;
        // var strStyleCSS = `<link rel='stylesheet' type='text/css' href='${window.location.origin}${rcContextPath}/css/finance/report/ReceivableWriteofflist/index.css'>`;
        // var strFormHtml = '<head>' + strStyleCSS + '</head><body>' + document.getElementById(_info.id).innerHTML + '</body>';

        // var strBodyStyle = "<style>" + document.getElementById("receivableWriteoffliststyle1").innerHTML + "</style>";
        // var strFormHtml = strBodyStyle + "<body>" + document.getElementById(_info.id).innerHTML + "</body>";

        // _LODOP.PRINT_INIT(_info.title);
        // _LODOP.SET_PRINT_STYLE("FontSize", 18);
        // _LODOP.SET_PRINT_STYLE("Bold", 1);
        // _LODOP.ADD_PRINT_TEXT(50, 231, 260, 39, "打印页面部分内容");
        // _LODOP.ADD_PRINT_HTM(20, 40, 700, 900, strFormHtml);
        // _LODOP.ADD_PRINT_TABLE(100, 5, 500, 280, _info.data);
        // _LODOP.PREVIEW();
    } catch (err) {
    }
}


// 模板2 ：title   ，
HT_LODOP.printFinanceTemplate2 = function (_info) {
    try {
        var _LODOP = getLodop();
        var _conf = HT_LODOP._getInitConf(_info);
        var _txt = HT_LODOP._getTitleInfo(_conf);
        var _ht = `<table border='1' width='100%' style='border:solid 1px #ccc;border-collapse:collapse'>
                    <caption><p class='align-center'>${_conf.title}</p>${_txt}
                    </caption>`;
        // 数据模式 （无数据就执行 url 请求）
        if (_conf.data) {
            var _t = HT_LODOP._getData1(_conf);
            _ht = `${_ht}${_t}`;
        } else {
            // console.log(_conf.url);
        }
        _ht = `${_conf.styleCss}${_ht}`;
        // console.log(_ht);
        _LODOP.PRINT_INIT(_conf.title);
        _LODOP.SET_PRINT_PAGESIZE(_conf.setPageSize);
        _LODOP.ADD_PRINT_TABLE("2%", "2%", "96%", "85%", _ht);
        LODOP.SET_PRINT_STYLEA(0, "TableHeightScope", HT_LODOP._conf.iRadioValue);
        _LODOP.PREVIEW();
    } catch (err) {
    }
}

// 模板12 ：title   ，科目余额表
HT_LODOP.printFinanceTemplate12 = function (_info) {

    try {
        var _LODOP = getLodop();
        var _conf = HT_LODOP._getInitConf(_info);
        var _ti = HT_LODOP._getTitleInfo(_conf);
        var _ht = `<table border='1' width='100%' style='border:solid 1px #ccc;border-collapse:collapse'>
                    <caption ><p>${_info.title}</p> ${_ti}</caption>`;
        // 数据模式 （无数据就执行 url 请求）
        if (_conf.data) {
            var _d = _conf.data;
            var _thead = '', _tbody = '', _tfoot = '';
            var _theadTitle = `<tr><th colspan="${_conf.colMaxLenght}" align="right">第<font tdata="PageNO" color="blue">##</font>页</span>/共<font tdata="PageCount" color="blue">##</font></span>页</th></tr>`;

            // _thead = `
            //     <tr class='thCs'>
            //         <th rowspan="2" style="width: 10%">科目编码</th>
            //         <th rowspan="2" style="width: 18%">科目名称</th>
            //         <th colspan="2">初期余额</th>
            //         <th colspan="2">本期发生额</th>
            //         <th colspan="2">本年累计发生额</th>
            //         <th colspan="2">期末余额</th>
            //     </tr>
            //     <tr class='thCs'>
            //         <th style="width: 9%">借方</th>
            //         <th style="width: 9%">贷方</th>
            //         <th style="width: 9%">借方</th>
            //         <th style="width: 9%">贷方</th>
            //         <th style="width: 9%">借方</th>
            //         <th style="width: 9%">贷方</th>
            //         <th style="width: 9%">借方</th>
            //         <th style="width: 9%">贷方</th>
            //     </tr>
            // `;

            // _d.forEach(row => {
            //     _tbody += `
            //         <tr>
            //             <td>${row.hCode}</td>
            //             <td>${row.hName}</td>
            //             <td>${row.direction === 2 ? '' : row.beginBalanceFor}</td>
            //             <td>${row.direction === 2 ? row.beginBalanceFor : ''}</td>
            //             <td>${row.debitFor}</td>
            //             <td>${row.creditFor}</td>
            //             <td>${row.ytdDebitFor}</td>
            //             <td>${row.ytdCreditFor}</td>
            //             <td>${row.direction === 2 ? '' : row.endBalanceFor}</td>
            //             <td>${row.direction === 2 ? row.endBalanceFor : ''}</td>
            //         </tr>
            //     `;
            // });

            // if (_d.length === 0) {
            //     _tfoot = `
            //         <tr class="ht-foot">
            //             <td>合计：</td>
            //             <td></td>
            //             <td></td>
            //             <td></td>
            //             <td></td>
            //             <td></td>
            //             <td></td>
            //             <td></td>
            //             <td></td>
            //             <td></td>
            //         </tr>
            //         `
            // } else {
            //     _tfoot = `
            //         <tr class="ht-foot">
            //             <td>合计：</td>
            //             <td></td>
            //             <td tdata="SubSum" format="#,##0.00" align="right">###</td>
            //             <td tdata="SubSum" format="#,##0.00" align="right">###</td>
            //             <td tdata="SubSum" format="#,##0.00" align="right">###</td>
            //             <td tdata="SubSum" format="#,##0.00" align="right">###</td>
            //             <td tdata="SubSum" format="#,##0.00" align="right">###</td>
            //             <td tdata="SubSum" format="#,##0.00" align="right">###</td>
            //             <td tdata="SubSum" format="#,##0.00" align="right">###</td>
            //             <td tdata="SubSum" format="#,##0.00" align="right">###</td>
            //         </tr>
            //         `
            // }
            _ht = `${_ht}<thead>${_theadTitle}${_conf.tbodyInfo.theadTX}</thead><tbody>${_conf.tbodyInfo.tbodyTX}</tbody><tfoot>${_conf.tbodyInfo.tfootTX}</tfoot></table>`;
        } else {
            // console.log(_conf.url);
        }
        _ht = `${_conf.styleCss}${_ht}`;
        // console.log(_ht);
        _LODOP.PRINT_INIT(_conf.title);
        _LODOP.SET_PRINT_PAGESIZE(_conf.setPageSize);
        _LODOP.ADD_PRINT_TABLE("2%", "2%", "96%", "85%", _ht);
        LODOP.SET_PRINT_STYLEA(0, "TableHeightScope", HT_LODOP._conf.iRadioValue);
        _LODOP.PREVIEW();
    } catch (err) {
    }
}

HT_LODOP.printUrl = function (_info) {

    try {
        var _LODOP = getLodop();
        if (_LODOP.VERSION) {
            if (_LODOP.CVERSION)
                console.log("当前有C-_LODOP云打印可用!\n C-_LODOP版本:" + _LODOP.CVERSION + "(内含_LODOP" + _LODOP.VERSION + ")");
            else
                console.log("本机已成功安装了_LODOP控件！\n 版本号:" + _LODOP.VERSION);

        };
        _LODOP.PRINT_INIT("打印控件功能演示_Lodop功能_打印Iframe");
        _LODOP.ADD_PRINT_URL("2%", "2%", "96%", "96%", _info.url);
        LODOP.SET_PRINT_STYLEA(0, "TableHeightScope", iRadioValue);
        _LODOP.PREVIEW();

    } catch (err) {
    }
}