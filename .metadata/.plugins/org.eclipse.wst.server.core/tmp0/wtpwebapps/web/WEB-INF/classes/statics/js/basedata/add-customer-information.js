new Vue({
    el:'#customerInfo',
    data:{
        
    },
    methods:{
        save(){
            if ($('form').valid()) {
                console.log(this.$data);
            }
        },
        //上传文件弹出框
        uploadfile(){ 
            layer.open({
                title: '上传文件',
                type:1,
                area:['420px','230px'],
                btn:['确认','取消'],
                yes:function(){
                    //[确认]按钮的回调函数
                    console.log('点击了确定');
                },
                btn2:function(){
                    //[取消]按钮的回调函数
                    console.log('点击了取消！')
                },
                content: $('#uploadConfirm')
              });  
        }
    },
    mounted(){
        $('form').validate();
        layui.use('laydate',function(){
            var laydate = layui.laydate;
            laydate.render({
                elem: '#regiDate'
            })
        })
       
    }
})