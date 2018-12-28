new Vue({
    el:'#diamond-price-list',
    data(){
        let This = this;
        return {
            openName:'',
            openTime:'',
            showUpload:false,
            file:'',
            uploadDataList:{},
            diamondList:[]
        }
    },
    methods:{
        //引入
        importExcel(){
            this.showUpload=!this.showUpload;
        },
        //确认方法
        modalOk(){
            this.diamondList=this.uploadDataList;
        },
        //取消方法
        modalCancel(){

        },
        handleSuccess (res, file) {//上传成功之后的方法
            if (res.code == "100100") {
                this.$Modal.success({
                    title: "提示",
                    content: "上传成功!"
                });
                this.uploadDataList=res.data;
            } else {
                this.$Modal.error({
                    title: "提示",
                    content: "上传失败!",
                });
                this.uploadDataList = this.diamondList;
            }
        },
        handleFormatError (file) {//上传错误回调
            this.$Modal.error({
                title: '提示',
                content: '文件格式错误，请选择.xlsx文件'
            });
        },
        handleMaxSize (file) { //上传大小出现错误回调
            this.$Modal.error({
                title: '提示',
                content: '文件过大，请选择小于5M文件'
            });
        },
        handleBeforeUpload () {

        },
        //引出模板
        exportTemplate(){
            let excelModelName ="国际钻石价目表模板.xlsx";
            let url=contextPath + "/excle/getExcelModel?excelModelName="+excelModelName;
            window.location.href= url;
        },
        //保存
        save() {
            let This = this;
            if(This.diamondList.length===0){
                This.$Modal.warning({
                    title: "提示",
                    content: "请先引入数据在进行保存!"
                });
                return false;
            }
            $.ajax({
                type: "POST",
                url: contextPath + "/saleWorldDiamondPriceController/saveBatch",
                contentType: 'application/json;charset=utf-8',
                data: JSON.stringify(This.diamondList),
                dataType: "json",
                success: function (data) {
                    console.log(data)
                    if (data.code === "100100") {
                        This.$Modal.success({
                            title: "提示",
                            content: "保存成功!"
                        });
                    }else{
                        This.$Modal.error({
                            title: "提示",
                            content: "保存失败!"
                        });
                    }
                },
                error: function (err) {
                    This.$Modal.error({
                        title: "提示",
                        content: "服务器出错!"
                    });
                }
            })
        },
        //退出
        cancel() {
            window.parent.closeCurrentTab({name: this.openName, exit: true, openTime: this.openTime})
        },
        getData(){
            let This = this;
            $.ajax({
                type: "POST",
                url: contextPath + "/saleWorldDiamondPriceController/list",
                contentType: 'application/json;charset=utf-8',
                dataType: "json",
                success: function (data) {
                    console.log(data);
                    This.diamondList=data.data;
                },
                error: function (err) {
                    This.$Modal.error({
                        title: "提示",
                        content: "服务器出错!"
                    });
                }
            })
        }
    },
    mounted: function () {
        this.openTime = window.parent.params.openTime;
        this.openName = window.parent.params.openName;
        //获取数据
        this.getData();
    }
})