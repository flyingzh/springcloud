new Vue({
    el:'#certificate-fee-list',
data () {
    let This = this;
    return {
        openName:'',
        openTime:'',
        showUpload:false,
        file:'',
        uploadDataList:{},
        saleCertificateFeeVo:{
            id:'',
            isDel:1,
            remark:'',
            certificateType:'',
            certificateName:'',
            organizationId:'',
            saleCertificateDetailList:[
                /*{
                id:'',
                certificateId:'',
                stoneSection:'',
                stoneSectionName:'',
                certificatePrice:'',
                }*/
            ]
        }
    }
},
methods:{
    //检测数字不能为负数
    clearNum(item, type, floor) {
        return htInputNumber(item, type, floor);
    },
    //引入
    importExcel(){
        this.showUpload=!this.showUpload;
    },
    //确认方法
    modalOk(){
        this.saleCertificateFeeVo.saleCertificateDetailList=this.uploadDataList;
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
                content: data.data+"上传失败!"
            });
            this.uploadDataList = this.saleCertificateFeeVo.saleCertificateDetailList;
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
        let excelModelName ="证书费模板.xlsx";
        let url=contextPath + "/excle/getExcelModel?excelModelName="+excelModelName;
        window.location.href= url;
    },
    //保存
    save(){
        let This = this;
        this.saleCertificateFeeVo.id='';
        if(this.saleCertificateFeeVo.saleCertificateDetailList!==null&&this.saleCertificateFeeVo.saleCertificateDetailList.length>0){
            this.saleCertificateFeeVo.saleCertificateDetailList.forEach(function (item) {
                item.id='';
                item.certificateId='';
            });
        }
        $.ajax({
            type: "POST",
            url: contextPath + "/saleCertificateFeeController/save",
            contentType: 'application/json;charset=utf-8',
            data: JSON.stringify(This.saleCertificateFeeVo),
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
    //获取证书费用数据
    getCertificateFeeData(){
        let This = this;
        $.ajax({
            type: "POST",
            url: contextPath + "/saleCertificateFeeController/list",
            contentType: 'application/json;charset=utf-8',
            dataType: "json",
            success: function (data) {
                console.log(data.data);
                //初始化页面
                if(data.data!==null){
                    This.saleCertificateFeeVo=data.data;
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
},
mounted: function () {
    this.openTime = window.parent.params.openTime;
    this.openName = window.parent.params.openName;
    //获取证书费用数据
    this.getCertificateFeeData();
}
})