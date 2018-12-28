new Vue({
    el:'#supplier',
    data:{
        
    },
    methods:{
        save(){
            console.log('baocun');
            if ($('form').valid()) {
                console.log(this.$data);
            }
        },
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
       
    }
})