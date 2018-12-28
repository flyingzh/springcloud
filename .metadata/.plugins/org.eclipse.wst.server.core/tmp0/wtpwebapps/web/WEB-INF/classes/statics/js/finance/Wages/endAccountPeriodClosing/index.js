new Vue({
    el: '#employee',
    data(){
        return {
            for1:'1',
            openTime:''
        }
    },
    created() {
    },
    mounted() {
        this.openTime = window.parent.params && window.parent.params.openTime;
    },
    methods:{
        beginFun() {
            let that = this;
            let _url='';
            let content = '';
            let title ='';
            if(this.for1==='1'){
                title = '工资结账结果';
                _url= contextPath+'/wmSettleAccount/settleAccount';
            } else {
                title = '工资反结账结果';
                _url= contextPath+'/wmSettleAccount/reverseAccount';
            }
            $.ajax({
                url:_url,
                type:'post',
                data:'',
                dataType:'json',
                contentType:'application/json;charset=utf-8',
                async:false,
                success:function(res){
                    if (res.code == '100100') {
                        content = `<p>${res.msg}</p>`;
                        that.instance('success', title, content);
                    } else {
                        content = `<p>${res.msg}</p>`;
                        that.instance('error', title, content);
                    }
                }
            })
        },
        instance (type, title, content) {
            switch (type) {
                case 'success':
                    this.$Modal.success({
                        title: title,
                        content: content
                    });
                    break;
                case 'error':
                    this.$Modal.error({
                        title: title,
                        content: content
                    });
                    break;
            }
        },
        refresh(){
            window.location.reload();
        },
        outHtml(){
            window.parent.closeCurrentTab({ openTime: this.openTime, exit: true });
        }
    }
})