//html
window.home.componentHtml(`
<i-button @click="lodoPrint">打印</i-button>
<ht-print-choose v-model="printModal" :print-info="printInfo" @close="printModalShow(false)"> </ht-print-choose>
`);

// 下面的这一行注释必须要有！！！
//js

// <!-- 打印 lodop 组件 -->
htLoadJs([
	'../../../plugins/Lodop/LodopFuncs.js',
	'../../../plugins/Lodop/LodopCommFun.js'
])
// 注意：本文件中的单行注释会被自动删除！
// 如果需要注释，使用块状注释 /* */

// 如果有依赖其它自定义的组件，先加载
// htLoadJs(['path/js1.js', 'path/js2.js'], function(){

// 下面一行不要改动
window.vm[window.home.nameEn] = new Vue({
	el: '#app',
	data: {
		printModal: false,
		printInfo: {},
		lodoPList: [],
		coinStopId: true, // 模拟单表头与多表头
	},
	methods: {
		lodoPrint () {
			var that = this;
			var _info = {
				'title': '应付账款明细表',  // 标题
				'template': 1,  // 模板
				// 'titleInfo': [       // title 
				//     { 'name': '日期', 'val': '2018-07-24' },
				//     { 'name': '单据编号', 'val': 'billNumber' },
				//     { 'name': '凭证字号', 'val': 'voucherSize' },
				//     { 'name': '核销类型', 'val': 'verificationTypeName' }
				// ],
				'colNames': [       // 列名与对应字段名
					{ 'name': '日期', 'col': 'documentDate' },
					{ 'name': '客户名称', 'col': 'customerName' },
					{ 'name': '部门代码', 'col': 'departmentCode' },
					{ 'name': '部门名称', 'col': 'departmentName' },
					{ 'name': '业务员代码', 'col': 'employeeCode' },
					{ 'name': '业务员名称', 'col': 'employeeName' },
					{ 'name': '期初余额', 'col': 'beginBalance', 'sum': true },
					{ 'name': '预收金额', 'col': 'depositBalance', 'sum': true },
					{ 'name': '应收金额', 'col': 'receivableBalance', 'sum': true },
					{ 'name': '实收金额', 'col': 'officialBalance', 'sum': true },
					{ 'name': '期末余额', 'col': 'endBalance', 'sum': true },
				],
				'styleCss': '',   // 自定义样式 例：  thead{text-align: center;font-size: 14px;font-weight: 100;}
				'colMaxLenght': 9,  // 显示最大长度， 默认为7
				'data': that.lodoPList,  // 打印数据  list
			}
			// 弹窗选择列 模式
			that.printInfo = _info;
			that.printModalShow(true);

		},
		printModalShow (_t) {
			this.printModal = _t;
		},
		_nullData (_t) {
			if (_t) {
				return _t;
			} else {
				return '';
			}
		},
	},
	mounted () {
		var that = this;
		$.ajax({
			type: 'post',
			url: './ht-print-choose/data.json',
			dataType: 'json',
			data: null,
			success: function (d) {
				that.lodoPList = d.data;
			},
		});
	}
});

// });
// 依赖加载结束