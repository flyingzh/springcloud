let vm = Vue.component('test-tree',{
    props:["zsetting","tid"],
    data(){
        return {
             setting:{ 
                treeId: "",
                data: {},        
                callback:this.evalCallback(),
                zNodes:[]
            },
        }
    },
    methods:{
        loadData () {
            let aaa = $;
            $.ajax({
                type: "POST",
                url: "./treedata.json",
                contentType: 'application/json',
                dataType: "json",
                success: function (data) {
                    console.log(data.data);
                   var zTree = $.fn.zTree.init($("#"+vm.tid), vm.setting, vm.zNodes);            
                    vm.zNodes = data.data;
                    $.fn.zTree.init($("#"+vm.tid), vm.setting, vm.zNodes);
                },
                error: function (err) {
                    vm.$Spin.hide();
                    console.log("服务器出错");
                },
            });
                     
        },
        evalCallback (){
            var vm = this;
            var res ={};
            $.each(this.zsetting.callback,function(key,val){
                res[key] = vm.$parent[val];
            })
           return res;
        }
        
    },    
    mounted(){ 
        
        //如果没有传setting中的data选项下的simpledata，则自动设置
        if (this.zsetting.data.simpleData ===undefined){
            alert('目前生成节点使用的是简单json数据,需要设置setting.data.simpleData.enable =true，才能正确生成树形菜单');
            return            
        } else{
            this.setting.data = this.zsetting.data;
        }        
        this.zNodes=this.zdata;
        this.loadData();
        
    },
    created(){
        //组件挂载之前判断是否传入了id,
        if(this.tid===undefined) {
            this.tid ='ztree'+ Date.parse(new Date()).toString();
        }
    },
    template:`<ul :id="tid" class="ztree"></ul>`
})