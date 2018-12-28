let serverInit =new Vue({
    el:"#server-init-setting",
    data(){
        return{
            body:{
                name:"",
                sort:"",
                serveType:""
            },
            serverInfoEntity:{},
        }
    },
    methods:{
        addRow(){

        },
        delRow(){

        },
        saveGeneralServerSettings(){
            var This = this;
            $.ajax({
                type: 'post',
                async: false,
                traditional: true,
                dataType: 'json',
                contentType: "application/json;charset=utf-8",
                data:JSON.stringify(this.serverInfoEntity),
                url: contextPath + '/serverDataSyncConfig/saveGeneralServerSettings',
                success: function (r) {
                    if(r.code=="100100"){
                        This.$Modal.success({
                            content:"保存成功"
                        })
                    }else if(r.code=="-2"){
                        This.$Modal.warning({
                            title: '提示信息',
                            content: r.msg
                        });
                    }else {
                        This.$Modal.warning({
                            content: "系统出错，请联系相关技术人员"
                        })
                    }
                },
                error: function () {
                    console.log('服务器出错啦');
                }
            })
        },
        getData() {
            var This = this;
            $.ajax({
                type: "post",
                async:false,
                url: contextPath + '/serverDataSyncConfig/findGeneralServerInfo',
                dataType: "json",
                success: function (r) {
                    if(r.code=="100100"){
                        This.serverInfoEntity=r.data;
                    }else {
                        This.$Modal.warning({
                            content: "系统出错，请联系相关技术人员"
                        })
                    }
                },
                error: function () {
                    console.log('服务器出错啦');
                }
            })
        },
    },
    mounted() {
        this.getData();
    }
})