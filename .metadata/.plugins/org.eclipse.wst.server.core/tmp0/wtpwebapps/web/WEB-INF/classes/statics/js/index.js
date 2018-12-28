window.home = new Vue({
    el: '#ht-index',
    data () {
        return {
            isLoading: false,
            isCollapsed: false,
            activeIndex: null, // 四级菜单的激活项
            activeLevelOne: '',
            activeLevelTwo: [],
            activeLevelTwoChild: '',
            activeName: '', // Activated tab on the right
            activatedMenuItem: '', // Activated menu item on the left
            orgArray: [],
            selectedOrg: '',
            selectedOrgObj: {
                id:'',
                username:'',
                organId:'',
                organizationEntityList:[]
            },
            data:{
                one:[]
            },
            menuMapByUrl: {}, // URL is key
            menuMapById: {}, // id is key
            menuMapByLevel: {}, // parent id is key
            menuMapCache: {}, // save each visited menu chain
            scrollPosition:{},
            two: [],
            three: [],
            contents: [],
            user:{}
        }
    },
    methods: {
        collapsedSider () {
            this.$refs.side.toggleCollapse();
        },
        levelClick(item, index){//一级菜单被点击
            if(item){
                this.activeLevelOne = item.name;
            }
            this.two = [];
            if(this.data.one[index] && this.data.one[index].childMenuList && this.data.one[index].childMenuList.length > 0){
                this.two = [];
                this.two = this.data.one[index].childMenuList;
                //console.log(this.two)
            }else {
                this.two = [];
                this.three = [];
            }

            // 重置各级菜单状态
            this.activeLevelTwo = []; // 二级菜单展开项
            this.$nextTick(function(){
                // 收起展开的二级菜单
                this.$refs.level2.updateOpened();
            });
            this.activatedMenuItem = ''; // 三级菜单选中项
            this.activeIndex = null; // 四级菜单选中项
        },
        initMenuData:function(){//初始化菜单数据
            let This = this;
            $.ajax({
                url:'sysShiroMenu/queryByMenuTree',
                type:'post',
                data:'',
                dataType: "json",
                success:function(rest){
                    This.data.one = rest.data;
                    This.levelClick(null, 0);
                    This.toggleClick(null, 0);
                    This.activeLevelOne = This.data.one[0].name;
                    This.activeLevelTwoChild = This.three &&  This.three[0] && This.three[0].url.toString();
                    This.activeLevelTwo = [This.two[0] && This.two[0].url.toString()];
                    This.activeName = 0;

                    // flatten menu items
                    var menuMapByUrl = {};
                    var menuMapById = {};
                    var menuMapByLevel = {};
                    var genMenuMapByUrl = function(arr){
                        $.each(arr, function(idx, ele){
                            menuMapById[ele.id] = ele;

                            if (typeof menuMapByLevel[ele.parentId] == 'undefined') {
                                menuMapByLevel[ele.parentId] = [];
                            }
                            menuMapByLevel[ele.parentId].push(ele.id);

                            if (ele.url != '') {
                                menuMapByUrl[ele.url] = ele;
                            }

                            if ($.type(ele.childMenuList) == 'array' && ele.childMenuList.length > 0) {
                                genMenuMapByUrl(ele.childMenuList);
                            }
                        });
                    };
                    genMenuMapByUrl(rest.data);
                    This.menuMapByUrl = menuMapByUrl;
                    This.menuMapById = menuMapById;
                    This.menuMapByLevel = menuMapByLevel;
                    This.hashTrigger();
                },
                error:function(a,b,c){
                    console.log(arguments)
                }
            });
        },
        toggleClick(item, index){
            if(item && item.childMenuList && item.childMenuList.length > 0){
                //console.log(item)
                this.three = [];
                this.three = item.childMenuList;
                this.activeIndex = null; // 重置第四级菜单选中项下标
            }else {
                this.three = [];
                this.activeEvent(item);
            }
        },
        activeEvent(menu, index){//打开一个页签
            var vm = this;
            this.$Message.config({top: 17});

            if(typeof index === 'number'){//四级菜单被点击时加class高亮
                this.activeIndex = index;
            }

            if(menu){
                let obj = Object.assign({}, menu);
                obj.openTime = new Date().getTime();
                obj.close = false;

                vm.updateHash(menu.url);

                if(this.findAlreadyMenu(obj)){//页签已打开

                }else {//打开一个新页签
                    // 避免相同 hash 重复触发
                    if (this.isLoading == true && menu.url == window.location.hash.replace('#', '')) {
                        this.isLoading = false;
                        return false;
                    }

                    this.$Message.destroy();
                    if (this.isLoading == true){
                        this.$Message.info({
                            closable: true,
                            content: '请慢点操作~',
                            onClose(){
                                vm.isLoading = false;
                            }
                        });
                        return;
                    }
                    this.isLoading = true;

                    this.maxMenu(obj);
                }
            }
        },
        openOneTab(obj){
            // 提前加载完页面，将提前销毁顶部提示消息
            let vm = this;
            this.$Message.info({
                duration: 6,
                closable: true,
                content: '加载中，请稍候~',
                onClose(){
                    vm.isLoading = false;
                }
            });
            this.contents.push(obj);
            this.activeName = this.contents.length - 1;
            window.parent.params = obj;
        },
        findAlreadyMenu(menu){//如果已打开此菜单则找到之前打开的新页签，并且激活它
            return this.contents.some((item, index) =>{
                if(menu.id && menu.id === item.id && !item.close){
                    this.activeName = index;
                    return menu.id && menu.id === item.id && !item.close;
                }
            })
        },
        closeCurrentTab(menu){//关闭当前页签
            if(menu){
                this.contents.some((item,index)=>{
                    if(menu.openTime===item.openTime && menu.exit){
                        window.top.home.loading('hide');
                        this.$Modal.remove()
                        this.contents[index].close = true;
                        this.findCloseIndex(index, menu.exit);

                        if(this.calculateLength() === 0){
                            window.location.hash = '';
                        }
                        return true;
                    }
                })
            }
        },

        handleTabRemove (name) { // name 是 tab 的下标，点击页签的X关闭
            let canClose = document.getElementById(name).contentWindow.handlerClose;

            if(!canClose || canClose()){
                this.contents[name].close = true;
                this.findCloseIndex(name, true);
            }else {
                this.activeName = name;
            }
        },

        findCloseIndex(index, exit){//点击退出时找到最近需要激活的页签
            var vm = this;
            if(index === this.activeName){
                if(index === 0){//退出第一个
                    this.contents.some((item, k)=>{
                        if(item.close === false){
                            this.activeName = k;
                        }
                        vm.$nextTick(function(){
                            vm.updateHash(item.url, exit);
                        });
                        return item.close === false;
                    })
                }
                else if(index === this.contents.length - 1 && exit){//退出最后一个
                    let length = this.contents.length;
                    let arr = [];
                    for(let i = 0; i< length; i++){
                        arr.push(Object.assign({},this.contents[i]));
                    }
                    arr.reverse().some((item, k)=>{
                        if(item.close === false){
                            this.activeName = (this.contents.length - k - 1);
                        }
                        vm.$nextTick(function(){
                            vm.updateHash(item.url, exit);
                        });
                        return item.close === false;
                    })
                }
                else {//处在中间位置
                    let haveFind = false;
                    for (let i = index, length = this.contents.length; i < length; i++){
                        if(this.contents[i].close === false){
                            this.activeName = i;
                            haveFind = true;
                            vm.$nextTick(function(){
                                vm.updateHash(vm.contents[i].url, exit);
                            });
                            break;
                        }
                    }
                    if(!haveFind){
                        for (let i = 0; i <= index; i++){
                            if(this.contents[index - i].close === false){
                                this.activeName = index - i;
                                vm.$nextTick(function(){
                                    vm.updateHash(vm.contents[index - i].url, exit);
                                });
                                break;
                            }
                        }
                    }
                }
            }
        },
        maxMenu(obj){//限制最多只能打开六个页签
            if(this.calculateLength() > 6){//打开页签的个数大于6
                this.contents.some((item,i) =>{
                    if(!item.close){
                        let canClose = document.getElementById(i).contentWindow.handlerClose;
                        if(!canClose || canClose()){//关闭第一个，打开新的一个tab
                            item.close = true;
                            this.$nextTick(()=>{
                                this.openOneTab(obj)
                            })
                        }else if(canClose && !canClose()){//如果需要保存则激活tab弹窗提示保存
                            this.activeName = i;
                        }

                        return true;
                    }
                });
            }else{
                this.openOneTab(obj)
            }
        },
        tabClick(name){
            console.log(name)
            var $iframe = $('iframe:visible');

            // 激活前的 Tab 内的 iframe
            var iframeUrl = $iframe.attr('src');

            // 激活后的 Tab 内的 iframe url
            var tabUrl = this.contents[name].url;

            // 存储激活前 iframe 内页面的位置
            this.scrollPosition[iframeUrl] = $iframe.contents().scrollTop();

            // 切换 Tab
            this.activeName = name;

            // 激活后的 Tab 内 iframe 的页面，滚动到之前的位置
            this.$nextTick(()=>{
                $('iframe[src="' + tabUrl + '"]').contents().scrollTop(this.scrollPosition[tabUrl] || 0);
            });

            // 切换 tab 时，更新 hash 以触发 hashTrigger 方法
            window.location.hash = tabUrl;
        },
        getUser: function(){//获取用户信息
            let This = this;
            $.getJSON("shiroUser/info?_"+$.now(), function(r){
                This.user= r;
                //console.log(This.user);
                This.selectedOrg = This.user.userCurrentOrganId;

                This.selectedOrgObj = This.user;
                This.orgArray.map(function (item) {
                    if(item.id === This.user.organId){
                        This.selectedOrgObj.orgName = item.orgName;
                    }
                });
                window.userInfo = This.selectedOrgObj;
                //console.log(window.userInfo);

                // 全局存储用户信息
                var htUser = layui.data('user');
                $.each(r, function(key, val){
                    layui.data('user', {key: key, value: val});
                });
                layui.data('user',{key:'currentOrgName',value:r.orgName});
            });
        },
        getCode:function(){
            $.ajax({
                url:'shiroCode/queryByBaseCodeAll',
                dataType:'json',
                type:'post',
                success:function(map){
                    for(var key in map){
                        var value = map[key];
                        if(value){
                            layui.data('dict',{
                                key:key,
                                value:value
                            });
                        }

                    }
                },
            });
        },

        getCodeList:function(mark) {
            var dict = layui.data('dict');
            //console.log(dict[mark]);
            return dict[mark];
            /*   for(var i;i<dict.length;i++){
             console.log(dict[i]);
             }
             var childsObj = [];
             var parentMark = mark.substring(0,mark.lastIndexOf("_"));
             var parent = dict[parentMark];
             if(parent != null && parent != ""){
             var childMarks = parent.childs.split(",");
             for (var child in childMarks){
             var childObj = dict[child];
             childsObj.push(childObj);
             }
             }
             return childObj;*/
        },

        fetchOrg() {
            let This = this;
            $.ajax({
                type: "POST",
                url: "public/getUserOragnList",
                data: '',
                dataType: "json",
                success: function (res) {
                    if (res.code === '100100') {
                        This.orgArray = res.data;
                    }
                }, error: function () {

                }
            });
        },
        orgChange(value){
            let This = this;
            $.ajax({
                type: "POST",
                url: "public/organChange",
                data: {id: value},
                dataType: "json",
                success: function (res) {
                    //返回成功标识
                    if (res.code === '100100') {
                        This.selectedOrgObj.organId = value;
                        $.each(res.data, function(key, val){
                            layui.data('user', {key: key, value: val});
                        });
                        This.orgArray.map(function (item) {
                            if(item.id === value){
                                This.selectedOrgObj.orgName = item.orgName;
                                layui.data('user',{key:'currentOrgName',value:item.orgName});

                            }
                        });
                        window.userInfo = This.selectedOrgObj;
                        //console.log(window.userInfo);
                        This.contents = [];
                    }

                }, error: function () {

                }
            });
        },
        logout(){
            $.ajax({
                url:'logout',
                type:'get',
                success:function(){
                    parent.location.href = 'logout';
                },
            });
        },
        loading (showHide, opt) {
            if (showHide == 'show') {
                var opt = $.extend({
                    iconClass: 'spin-icon-load',
                    iconType: 'load-c',
                    iconSize: 18,
                    text: '处理中，请稍候'
                }, opt || {});

                this.$Spin.show({
                    render: (h) => {
                        return h('div', [
                            h('Icon', {
                                'class': opt.iconClass,
                                props: {
                                    type: opt.iconType,
                                    size: opt.iconSize
                                }
                            }),
                            h('div', opt.text)
                        ]);
                    }
                });
            }

            if (showHide == 'hide') {
                this.$Spin.hide();
            }
        },
        updateHash(hash, exit=false){
            if(exit && !this.calculateLength()){//处理最后一个页签退出会打开一个页签问题
                return;
            }
            window.location.hash = hash;
        },
        calculateLength(){ //计算打开页签的个数
            return this.contents.reduce((total = 0, item)=>{
                if(!item.close){
                    return  total + 1;
                }else {
                    return total;
                }
            },0)
        },
        iframeLoaded(e){

            // 内页加载完毕，销毁顶部提示框
            this.$Message.destroy();

            // 内页加载完毕，修改加载状态
            this.isLoading = false;

            setTimeout(function () {
                $('iframe').contents().find('.foot_copyright').fadeIn();
            }, 1000);
        },
        hashTrigger(){
            var vm = this;
            var hash = window.location.hash || '';
            var rootName = window.location.pathname.split('/')[1];
            var regxUrl = new RegExp('^#\/' + rootName + '\/', 'i');
            var allLevels = [];
            var menuMapById = this.menuMapById;
            var menuMapByLevel = this.menuMapByLevel;

            // 递归找到所有父节点
            var findParents = function(id){

                // 如果之前访问过，无需再次递归查找所有父级节点，直接从缓存中获取
                if (id in vm.menuMapCache) {
                    allLevels = vm.menuMapCache[id];
                    return false;
                }

                var item = menuMapById[id];
                allLevels.push({
                    id: item.id,
                    name: item.name,
                    idx: menuMapByLevel[item.parentId].indexOf(item.id)
                });

                if (item.parentId > 0) {
                    findParents(item.parentId)
                } else {
                    return false;
                }
            };

            // 如果是有效的 hash
            if (regxUrl.test(hash)) {
                var key = hash.replace('#', '');

                // 如果 hash 在 menu map 中
                if (key in this.menuMapByUrl) {
                    var menuItem = this.menuMapByUrl[key];
                    this.activeEvent(menuItem);
                    $('title').text(menuItem.name + ' - 金大祥管理系统');
                    findParents(menuItem.id);

                    // 翻转父级节点，将顶级排在第一，然后缓存起来
                    if (typeof vm.menuMapCache[menuItem.id] == 'undefined') {
                        vm.menuMapCache[menuItem.id] = allLevels.reverse();
                    }
                    //console.log(allLevels);

                    // 选中对应的第一级菜单，更新第二级菜单
                    this.activeLevelOne = allLevels[0].name;
                    this.two = this.menuMapById[allLevels[0].id].childMenuList;

                    // 更新对应的第二/三级菜单，展开所在的二级节点
                    this.activeLevelTwo = [allLevels[1].idx];
                    this.$nextTick(function(){
                        this.$refs.level2.updateOpened();
                        this.activatedMenuItem = allLevels[2].name;
                    });

                    // 更新第四级菜单的内容（内容区上方的）
                    this.$nextTick(function(){
                        this.three = this.menuMapById[allLevels[2].id].childMenuList;

                        // 如果有四级菜单，更新选中项
                        if (typeof allLevels[3] != 'undefined') {
                            this.activeIndex = allLevels[3].idx;
                        }
                    });
                }
            }
        }
    },
    created(){
        let This = this;
        window.activeEvent = function (item) {
            return This.activeEvent(item);
        };
        window.closeCurrentTab = function (item) {
            return This.closeCurrentTab(item);
        };
    },
    mounted(){
        this.initMenuData();
        this.fetchOrg();
        this.getUser();
        this.getCode();
        //this.getCodeList('base_billing_method_xj');
        // 只有当 hash 变化时触发
        window.onhashchange = ()=>{ this.hashTrigger(); };
    }
});

function getCodeList(mark){
    var dict = layui.data('dict');
    return dict[mark];
}