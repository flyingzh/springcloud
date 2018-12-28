//html
window.home.componentHtml(`
	<area-select url="./area-select/data.json"></area-select>
`);

// 下面的这一行注释必须要有！！！
//js

// 注意：本文件中的单行注释会被自动删除！
// 如果需要注释，使用块状注释 /* */

// 如果有依赖其它自定义的组件，先加载
// htLoadJs(['path/js1.js', 'path/js2.js'], function(){

// 下面一行不要改动
window.vm[window.home.nameEn] = new Vue({
	el: '#app'
	/* 不需要写任何 Vue 方法 */
});

// });
// 依赖加载结束