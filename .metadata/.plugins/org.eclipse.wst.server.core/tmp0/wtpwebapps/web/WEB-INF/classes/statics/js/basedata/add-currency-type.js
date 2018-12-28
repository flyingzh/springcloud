var currencyVm = new Vue({
    el:'#currency',
    data(){
        return {

            currency:{
                codes:"",
                currencyName:"",
                exchangeRate:"",
                precisions:4,
                status:"",
                remark:"",
                createrName:"hmy",
                createId:1
            }
        }
    },
    methods:{
        save(){
            let This = this;
            if ($('form').valid()) {
                console.log(JSON.stringify(This.currency));
                // console.log(This.currency.createId)
                $.ajax({
                    type: "POST",
                    url: contextPath+"/testCurrency/addCurrency",
                    contentType: 'application/json',
                    data: JSON.stringify(This.currency),
                    // data: {"id":This.currency.createId},
                    dataType: "json",
                    success: function(result) {
                        alert(result.msg)
                        console.log(result)
                    },
                    error: function(err){
                        // This.$Spin.hide();
                        alert(err);
                    },
                })
            }
        }
    },
    mounted(){
        $('form').validate();
    }
})
