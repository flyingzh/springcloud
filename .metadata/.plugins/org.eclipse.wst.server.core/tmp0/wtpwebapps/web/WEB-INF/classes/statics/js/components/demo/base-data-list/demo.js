//html
window.home.componentHtml(`
	<base-data-list :data_config="baseDataListConfig"></base-data-list>
`);

// 下面的这一行注释必须要有！！！
//js

// 注意：本文件中的单行注释会被自动删除！
// 如果需要注释，使用块状注释 /* */

// 如果有依赖其它自定义的组件，先加载
// htLoadJs(['path/js1.js', 'path/js2.js'], function(){

// 下面一行不要改动
window.vm[window.home.nameEn] = new Vue({
    el: '#app',
    data: {        
		baseDataListConfig:{
			url: window.home.nameEn +'/data.json',
			colNames : [ '名称', '汇率', '更新时间','更新人'],
			colModel : [
				{name : 'currencyName',index : 'remark',width : 80, align: "center",
					formatter: function (value, grid, rows, state) {
						return 222;
					}},
				{name : 'exchangeRate ',width : 80,align : "center"},
				{name : 'updateTime',width : 80,align : "center"},
				{name : 'updateName',width : 80,align : "center", key: true}
			]
		}
    }
});

// });
// 依赖加载结束