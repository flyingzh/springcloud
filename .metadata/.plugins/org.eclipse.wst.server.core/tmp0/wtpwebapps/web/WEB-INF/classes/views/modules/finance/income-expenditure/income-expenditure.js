var ve=new Vue({
    el: '#income-expenditure',
    data() {
        let This = this;
        return {
            //显示新增弹出框
            addModal:false,
            reload: false,
            searchModal:false,
            subjectVisiable:false,
            nodeSelected:false,
            isDisabled:true,
            subjectEnd: false,
            selected:[],
            reload: false,
            subjectcode:'',
            modifyIsDisabled:false,
            isSaveOrUpdata:false,//false 为保存，true为updata
            //科目列表模拟数据
            subjectList:[],

            //收支类别弹窗内表单数据绑定
            body:{
                id:'',
                code:'',
                incomeCategory:'1',
                name:'',
                fullName:'',
                subjectId:'',
                subjectCode:'',
                subjectName:''//收入类别，支出类别节点ID
            },
            //收支类型树形
            nodes:[
                { "id": 3, "pId": 0, "name": "收支类别", "open": true },
                { "id": 1, "pId": 3, "name": "收入类别"},
                { "id": 2, "pId": 3, "name": "支出类别"}
            ],
           setting: {
                callback: {
                    onClick: this.clickEvent,
                }
            },
            //数据列表渲染
            data_config:{
                url: '/finance/incomeCategory/queryListPage',
                colNames : [ '代码', '名称', '全名', '科目'],
                colModel : [
                    {name : 'code',index : 'code',width : 200, align : "center"},
                    {name : 'name',index : 'name asc, invdate',width : 200, align : "center"},
                    {name : 'fullName',index : 'fullName',width : 200,align : "center"},
                    {name : 'subjectName',index : 'subjectName',width : 200,align : "center"}
                ],
            },
        }
    },
    methods: {
        //弹框绑定数据初始化
        iesubjectInit:function(){
            Object.assign(this.body, {
                id:'',
                code:'',
                name:'',
                fullName:'',
                subjectId:'',
                subjectCode:'',
                subjectName:''//收入类别，支出类别节点ID
            })
        },
        //点击修改
        modify(){
            console.log(this.selected);
            if(this.selected.length !== 1 ){
                alert('修改只能对单条数据进行操作');
            }else{
                console.log(this.body);
                //获取所选数据ID
                let id = this.selected[0];
                //请求对应数据
                $.ajax({
                    type: 'post',
                    async: true,
                    data: {id:id},
                    url: '/finance/incomeCategory/queryListPage',
                    dataType: 'json',
                    success: function (d) {
                        var updataobj=d.data.list;
                       for(var i in updataobj){
                            ve.body={
                                id:updataobj[i].id,
                                code:updataobj[i].code,
                                incomeCategory:updataobj[i].incomeCategory,
                                name:updataobj[i].name,
                                fullName:updataobj[i].fullName,
                                subjectId:updataobj[i].subjectId,
                                subjectCode:updataobj[i].subjectCode,
                                subjectName:updataobj[i].subjectName
                            }
                            ve.isSaveOrUpdata=true;
                        }
                    },
                    error: function (e) {
                        console.log(e);
                    }
                });
                //存值(fake data)
                // 显示弹框
                console.log(this.body);
                this.addModal = true;
            }
        },

        //批量删除
        deleteBatch1:function(){
            //获取所选数据ID
            let ids = this.selected;
            $.ajax({
                url: '/finance/incomeCategory/deleteBatch',
                method: 'post',
                dataType: "json",
                data: JSON.stringify(ids),
                contentType: 'application/json;charset=utf-8',
                success: function (data) {
                    alert(data.msg);
                    //重新加载
                    ve.reload = !ve.reload;
                },
                error: function (e) {
                    console.log(e);
                }
            });
        },
        //点击保存
        saveData:function(){
            console.log(this.body);
            //发送请求，增添数据,刷新页面
            //新增
            this.body.fullName= this.body.name;
            for(let subj of ve.subjectList){
                if(subj.value==ve.body.subjectId){
                    var  arr=(subj.label).split(",");
                    this.body.subjectCode= arr[0];
                    this.body.subjectName= arr[1];
                }
            }
            if(ve.isSaveOrUpdata){
                $.ajax({
                    type: 'POST',
                    async: false,
                    contentType: 'application/text',
                    data:JSON.stringify(this.body),
                    url: '/finance/incomeCategory/update',
                    dataType:'text',
                    success:function (d) {
                        var data= eval('(' + d + ')');
                        if("codeNo" ==  data.data){
                            alert("code已经存在，请重新填写。")
                        }else if("nameNo" ==  data.data){
                            alert("同级目录不允许名字相同，请重新填写")
                        }else{
                            ve.iesubjectInit();
                            ve.reload = !ve.reload;
                        }
                    },
                    error: function (e) {
                        console.log(e);
                    }
                });
            }else{
                //新增
                var Category;
                $.ajax({
                    type: 'Post',
                    async: true,
                    contentType: 'application/text',
                    data:JSON.stringify(this.body),
                    url: '/finance/incomeCategory/save',
                    dataType: 'text',
                    success: function (d) {
                        var data= eval('(' + d + ')');
                        if("codeNo" ==  data.data){
                            alert("code已经存在，请重新填写。")
                        }else if("nameNo" ==  data.data){
                            alert("同级目录不允许名字相同，请重新填写")
                        }else{
                            ve.reload = !ve.reload;
                            ve.iesubjectInit();

                        }
                    },
                    error: function (e) {
                        console.log(e);
                    }
                });
            }
        },
        //点击取消或者x
        canceldata:function(){
            this.iesubjectInit();
        },
        //单击收入，支出节点
        clickEvent(event, treeId, treeNode){
            if(treeNode.children != undefined){
                this.isDisabled = true;
                this.nodeSelected = false;
            }else{
                this.isDisabled = false;
                let selnode = this.$ztree.getSelectedNodes();
                console.log(selnode);
                this.body.ietypeNode = selnode[0].id;
                //获取收支类型id
                console.log(this.body.ietypeNode);
                //赋值给收支类别字段incomeCategory
                this.body.incomeCategory =this.body.ietypeNode;
                //重新加载数据刷新表格
                this.reload = !this.reload;
                this.nodeSelected = true;
            }

        },
        //显示选择科目弹窗
        searchSubject:function(){
            this.subjectVisiable = true;
        },
        //关闭选择科目弹窗
        subjectClose:function(){
            this.subjectVisiable = false;
        },
        //点击保存，获取所选科目id
        subjectDate:function(res) {
            console.log(res);
            this.body.subjectName = res.name;
            this.body.subjectId = res.value;

        },

    },
    //获取会计科目列表
    mounted(){
        let This = this;
        $.ajax({
            type: 'post',
            async: true,
            data: '',
            url: '/finance/incomeCategory/getAccountSubjectList',
            dataType: 'json',
            success: function (d) {
                var list=d.data;
                var datas= [];
                for(var i=0; i<list.length; i++){
                    datas.push({
                        label:""+list[i].subjectCode+","+list[i].subjectName+"",
                        value:list[i].id
                    });
                }
                var obj=JSON.stringify(datas);
                ve.subjectList=datas;
            },
            error: function (e) {
                console.log(e);
            }
        });
    },
})