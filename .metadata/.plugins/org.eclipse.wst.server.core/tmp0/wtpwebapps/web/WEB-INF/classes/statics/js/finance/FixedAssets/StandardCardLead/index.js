new Vue({
    el: '#standard-card-lead',
    data() {
        return {
            documentTypeList: [],
            formData: {
                for1: '',
                for2: '',
                for3: '',
                for4: '',
                for5: '',
                for6: '',
                for7: '',
                for8: '',
                for9: '',
                for10: '',
            }
        }
    },
    mounted() {
    },
    methods:{
        refresh() {

        },
        checkCard() {
            let title ='卡片检查结果';
            let content = '';
            let that = this;

            $.ajax({
                type: 'post',
                url: 'index.json',
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
        beginExport() {
            let title ='卡片引出结果';
            let content = '';
            let that = this;

            $.ajax({
                type: 'post',
                url: 'index.json',
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