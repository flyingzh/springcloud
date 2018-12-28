

var setting = {
    data: {
        simpleData: {
            enable: true,
            idKey: "id",
            pIdKey: "parentId",
            rootPId: -1,
        },
        key: {
            url:"nourl"
        }
    },
    check:{
        // enable:true,
        nocheckInherit:true
    },
    callback: {
        onClick: zTreeOnClick
    }
};

function zTreeOnClick(event, treeId, treeNode) {
    $("#codeValue").attr("readonly","readonly");
    var url=contextPath+"/codeController/info?id="+treeNode.id;
    $.get(url,function (result) {
        vm.organ=result.data;
        vm.showInfo=true;
        vm.title='修改字典';
    })
};
var ztree;

/**
 * 初始化菜单
 */
function initTree() {
    //加载菜单树
    $.get(contextPath+"/codeController/query", function(r){
        ztree = $.fn.zTree.init($("#allorganTree"), setting, r.data);
        //展开所有节点
        // ztree.expandAll(true);
    });
}

var vm = new Vue({
    el:'#rrapp',
    data:{
        showInfo: false,
        title: null,
        organ:{
            parentName:null,
            parentId:0,
            sort:'0',
            value:"",
            mark:"",
            remark:"",
            type:"1",
            open:"true",
            name:"",
            id:"",
            searchContent:"",
        },
    },
    created:function(){
        initTree();
    },
    methods: {
        //搜索
        search:function () {
            $.get(contextPath+"/codeController/search?ktcStatus=0&name="+vm.organ.searchContent, function(r){
                ztree = $.fn.zTree.init($("#allorganTree"), setting, r.data);
                //展开所有节点
                // ztree.expandAll(true);
            });
        },
        add: function(){
            $("#codeValue").removeAttr("readonly");
            var nodes=ztree.getSelectedNodes();
            if(nodes.length<=0){
                layer.alert("请选择父级菜单");
                return
            }
            vm.showInfo = true;
            vm.title = "新增字典";
            vm.organ.parentId=nodes[0].id;
            vm.organ.name="";
            vm.organ.value="";
            vm.organ.sort="";
            vm.organ.mark="";
            vm.organ.remark="";
            vm.organ.type="1",
			vm.organ.parentName=nodes[0].name;
            vm.organ.id = "";
            vm.organ.searchContent = "";
        },
        del: function (event) {
            var nodes=ztree.getSelectedNodes();

            if(nodes.length<=0){
                layer.alert("请选择要删除的组织");
            }
            if( !$.isEmptyObject(nodes[0].children)&&nodes[0].children.length>0){
                alert("存在子节点，无法删除")
                return;
            }

            confirm('确定要删除【'+nodes[0].name+'】节点吗？', function(){
                var url=contextPath+"/codeController/delete?id="+nodes[0].id;
                //var childs=nodes[0].id;
                //childs=getAllNodes(nodes[0],childs);
                $.post(url,function (r) {
                    if(r.code == 100100){
                        toast(r.msg,function(){
                            ztree.removeNode(nodes[0]);
                        });
                    }else{
                        alert(r.msg);
                    }
                });
            });
        },
        saveOrUpdate: function (event) {

            if(vm.organ.sort < 0){
                alert("请传入有效的序号")
                return;
            }

            if($.isEmptyObject(vm.organ.value)){
                alert("请填写码值")
                return;
            }

            if($.isEmptyObject(vm.organ.name)){
                alert("请填写码值名")
                return;
            }

            if($.isEmptyObject(vm.organ.value)){
                alert("请填写码值")
                return;
            }

            if($.isEmptyObject(vm.organ.sort)){
                alert("请填写序号")
                return;
            }

            var pattern = /^[\u4E00-\u9FA5]{1,6}$/;
            if(pattern.test(vm.organ.value)){
                alert("跟你说过不要写中文了！")
                return;
            }

            var url = $.isEmptyObject(vm.organ.id) ? contextPath+"/codeController/save" : contextPath+"/codeController/update";
            $.ajax({
                type: "POST",
                url: url,
                data: JSON.stringify(vm.organ),
                contentType: 'application/json',
                // contentType: 'application/json;charset=utf-8',
                success: function(r){
                    if(r.code == 100100){
                        var organInfo=r.data;
                        var nodes = ztree.getSelectedNodes();
                        var icon = "";

                        if(vm.organ.id==null || vm.organ.id==''){
                            toast(r.msg,function(){
                                ztree.addNodes(nodes[0],{id:organInfo.id,parentId:organInfo.parentId,name:organInfo.name,icon:icon});
                            });
                        }else{
                            toast(r.msg,function(){
                                nodes[0].name=organInfo.name;
                                nodes[0].icon=icon;
                                ztree.updateNode(nodes[0]);
                            });
                        }
                        vm.showInfo=false;
                    }else{
                        layer.alert(r.msg);
                    }
                }
            });
        },
        reload: function (event) {
            $("#organFrom")[0].reset();
        }
    }
});