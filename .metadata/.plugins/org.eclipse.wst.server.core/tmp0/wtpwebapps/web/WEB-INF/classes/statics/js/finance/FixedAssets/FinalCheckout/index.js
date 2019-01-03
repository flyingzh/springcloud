new Vue({
    el: '#final-checkout',
    data() {
        return {
            for1: 1,
            infoVisible:false,
            accountYearPeriod:'',
        }
    },
    created(){
        this.init();
    },
    mounted() {
        this.openTime = window.parent.params && window.parent.params.openTime;
    },
    methods:{
        init(){
            let that = this;
            $.ajax({
                url:contextPath+'/faInitEnableDisenable/init',
                type:'post',
                dateType:'json',
                success:function(res){
                    if(res.code == '100100'){
                        that.accountYearPeriod = res.data;
                    }
                },
                error(res){

                }
            })
        },
        outHtml(){
            window.parent.closeCurrentTab({ openTime: this.openTime, exit: true });
        },
        refresh() {
            window.location.reload();
        },

        cancel () {
            this.infoVisible = false;
        },
        open() {
            this.infoVisible = true;
        },
        save(){
            this.infoVisible = false;

            let title ='';
            let content = '';
            let that = this;
            let _url ='';
            if(this.for1===1){
                title = '固定资产结账结果';
                _url = rcContextPath +'/faInitEnableDisenable/settleAccount';
            } else {
                title = '固定资产反结账结果';
                _url = rcContextPath +'/faInitEnableDisenable/reverseAccount';
            }
            $.ajax({
                type: 'post',
                url: _url,
                data: '',
                // contentType: 'application/json;charset=utf-8',
                dataType: 'json',
                success: function (res) {
                    if (res.code == '100100') {
                        content = `<p>${res.msg}</p>`;
                        that.instance('success',title, content);
                    } else {
                        content = `<p>${res.msg}</p>`;
                        that.instance('error',title, content);
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
    },
    computed:{
    }
})