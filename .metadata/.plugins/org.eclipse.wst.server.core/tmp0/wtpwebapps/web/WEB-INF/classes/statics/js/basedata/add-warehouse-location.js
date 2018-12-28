new Vue({
    el:'#warehouseLocation',
    data:{
        
    },
    methods:{
        save(){
            if ($('form').valid()) {
                console.log(this.$data);
            }
        }
      
    },
    mounted(){
        $('form').validate();
       
    }
})