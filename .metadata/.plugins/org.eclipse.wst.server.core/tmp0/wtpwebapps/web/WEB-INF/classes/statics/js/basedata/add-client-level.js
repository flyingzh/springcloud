var m =new Vue({
    el:'#supplierLevel',
    data:{
        d :{
            id:"",
            code:"",
            apply:0,
            status:1,
            remark:"",
            updateName:"",
            updateTime:"",
            createName:"",
            createTime:"",
        },
        isAdd:true
    },
    methods:{
        save(){
            if ($('form').valid()) {
                console.log(this.$data);
            }
            var url ="";
            if(m._data.d.id ==""){
                url= "http://localhost:8091/tclientlevel/save";
            }else{
                url= "http://localhost:8091/tclientlevel/update";
            }

            $.ajax({
                type:"POST",
                dataType:"json",
                contentType:"application/json",
                url:url,
                data:JSON.stringify(m._data.d),
                success:function (res) {
                    console.log(res);
                    if(res.code == 100100){
                        alert("保存成功")
                    }else{
                        alert("服务器异常，请重试！")
                    }
                },
                error:function (){
                    alert("系统错误")
                }


            })



        }
      
    },
    mounted(){
       //新增

        //修改
        //get(1);
    }
})

function  get(id) {
    $.ajax({
        type:"GET",
        dataType:"json",
        url :"http://localhost:8091/tclientlevel/info/"+id,
        success:function (res){
            console.log(res);
            if(res.code == 100100){
                console.log(m)

                console.log(m._data)
                //console.log(v[data])
                m._data.d = res.data;
                console.log(m._data.d)
            }
        },
        error : function () {
            alert("系统异常")
        }
    })
}