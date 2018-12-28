new Vue({
    el: '#cash-book',
    data() {
        return {
            formData:{
                for1: '1',
                for2: '',
                for3: '',
                for4: '',
                for5: '',
                for6: '',
                for7: '',
            },
            filterVisible: false,
         
        }
    },
    methods:{
        open() {
            layer.confirm('确定要开始期末结账吗？', {
                title: "信息提示",
                btn: ['确定','取消'] //按钮
              }, function(){ 
                //   确定
                console.log('确定')

              }, function(){
                //   取消
                console.log('取消')
              });
        },
        refresh() {
        },
        save() {
            this.filterVisible = false;
            this.refresh();
        },
        cancel() {
            this.filterVisible = false;
        },
        
    },
})