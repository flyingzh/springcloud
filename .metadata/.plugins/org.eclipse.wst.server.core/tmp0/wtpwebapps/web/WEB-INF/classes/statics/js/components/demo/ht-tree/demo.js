//html
window.home.componentHtml(`
	<ht-tree url="./ht-tree/data.json" :setting="treeSetting"></ht-tree>
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
		treeSetting: {
			callback: {
				onClick: function(event, treeId, treeNode){
					console.log(event, treeId, treeNode)
					/* event事件对象，treeId, treeNode=>数据 */
				}
			}
		}
	}
});

// });
// 依赖加载结束