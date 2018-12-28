window.vm = {};
window.home = {};

$.ajax({
    url: 'components.json',
    type: 'get',
    dataType: 'json',
    success (result) {
        initPage(result);
    }
});
var contextPath = '/web';
var rcContextPath = '/web';
var htComponentMap = {

    // 通用组件
    'area-select': '/js/components/area-select.js',
    'base-data-list': '/js/components/base-data-list.js',
    'date-select': '/js/components/date-select.js',
    'ht-btns': '/js/components/ht-btns.js',
    'ht-file-upload': '/js/components/ht-file-upload.js',
    'ht-img-magnifier': '/js/components/ht-img-magnifier.js',
    'ht-print-choose': '/js/components/ht-print-choose.js',
    'ht-review-steps': '/js/components/ht-review-steps.js',
    'ht-review-turndown': '/js/components/ht-review-turndown.js',
    'ht-select': '/js/components/ht-select.js',
    'ht-toggle': '/js/components/ht-toggle.js',
    'ht-tree': '/js/components/ht-tree.js',

    // 基础模块下的组件
    'basedata/search-select-more': '/js/basedata/components/search-select-more.js',
    'basedata/base-data-list': '/js/basedata/components/base-data-list.js',
    'basedata/ht-btns': '/js/basedata/components/ht-btns.js',
    'basedata/ht-add-del-btn': '/js/basedata/components/ht-add-del-btn.js',
    'basedata/area-select': '/js/basedata/components/area-select.js',
    'basedata/date-select': '/js/basedata/components/date-select.js',
    'basedata/ht-tree': '/js/basedata/components/ht-tree.js',
    'basedata/common-record-list': '/js/basedata/components/common-record-list.js'
}
function initPage (components) {
    window.home = new Vue({
        el: '#demo',
        data: {
            isCollapsed: false,
            nameEn: '',
            nameCn: '',
            jsCode: '',
            components: components,
            html: '',
            htmlRows: '',
            guide: {
                props: [
                    {   //属性、说明、类型、默认值
                        name: '/',
                        intro: '/',
                        type: '/',
                        defaultVal: '/'
                    }
                ],
                events: [
                    {   //事件名、说明、返回值
                        name: '/',
                        intro: '/',
                        returnVal: '/'
                    }
                ],
                methods: [
                    {
                        //方法名、参数、说明
                        name: '/',
                        param: '/',
                        intro: '/'
                    }
                ],
                slots: [
                    {
                        //名称、说明
                        name: '/',
                        intro: '/'
                    }
                ]
            }
        },
        computed: {},
        methods: {
            menuitemClasses: function () {
                return [
                    'menu-item',
                    this.isCollapsed ? 'collapsed-menu' : ''
                ]
            },
            componentHtml (html) {
                var html = $.trim(html);
                $('#app').html(html);
                this.html = html;
                this.htmlRows = html.split(/\r\n|\r|\n/g).length;
            },
            loadDemo (nameEn) {
                var vm = this;
                vm.nameEn = nameEn;
                vm.nameCn = vm.components[nameEn].name;

                // 已美化的代码区，去除 flag 以触发下一次美化
                $('.prettyprint').removeClass('prettyprinted');

                htLoadJs([
                    vm.components[nameEn].url,
                    nameEn + '/demo.js',
                    nameEn + '/intro.js'
                ], function (component, demo, intro) {
                    var jsCode = '';
                    var result = demo[0];
                    var regRemoveComments = /(?:^|\n|\r)\s*\/\/.*(?:\r|\n|$)/g;

                    jsCode = ((result.indexOf('//js') > -1) ? result.split('//js')[1] : result)
                        .replace('window.vm[window.home.nameEn]', 'var vm')
                        .replace(regRemoveComments, '');
                    vm.jsCode = $.trim(jsCode);

                    vm.$nextTick(function () {
                        PR.prettyPrint();
                    });
                });
            }
        },
        created () {

        },
        mounted () {
            this.loadDemo('base-data-list');
        }
    });
}