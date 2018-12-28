new Vue({
    el: '#enable-fixed-asset-system',
    data() {
        return {
            for1: 1,
            openTime:''
        }
    },
    created:function () {
        //校验系统是否已经启用
        // verifySystem(4);
    },
    mounted() {
        this.openTime = window.parent.params && window.parent.params.openTime;
    },
    methods:{
        outHtml(){
            window.parent.closeCurrentTab({ openTime: this.openTime, exit: true });
        },
        refresh() {

        },
        open() {
            let title ='';
            let content = '';
            let that = this;
            if(this.for1===1){
                title = '结束初始化结果';
            } else {
                title = '反初始化结果';
            }
            let _url = contextPath+'/faInitEnableDisenable/startOrEndEnableFa/'+this.for1;
            $.ajax({
                type: 'post',
                url: _url,
                data: '',
                contentType: 'application/json;charset=utf-8',
                dataType: 'json',
                success: function (res) {
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
    },
    computed:{
    }
})