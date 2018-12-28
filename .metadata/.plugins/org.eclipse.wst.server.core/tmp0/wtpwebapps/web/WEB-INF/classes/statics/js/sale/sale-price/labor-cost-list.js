new Vue({
    el:'#labor-cost-list',
    data () {
        let This = this;
        return {
            openName:'',
            openTime:'',
            showUpload:false,
            file:'',
            uploadDataList:{},
            saleLaborVo:{
                id:'',
                isDel:1,
                remark:'',
                organizationId:'',
                saleLaborDetailList:[
                /*{
                    id:'',
                    laborId:'',
                    batchFlower:'',
                    category:'',
                    cncBatchFlower:'',
                    difficulty:'',
                    isDel:'',
                    kingFenColor:'',
                    kingLaborCost:'',
                    kingLoss:'',
                    nailSand:'',
                    ptLaborCost:'',
                    ptLoss:'',
                    sandBlast:'',
                    }*/
                ]
            }
        }
    },
    methods:{
        // url: contextPath + "/saleLaborController/importExcel",
        //引入
        importExcel(){
            this.showUpload=!this.showUpload;
        },
        //确认方法
        modalOk(){
            this.saleLaborVo.saleLaborDetailList=this.uploadDataList;
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
                this.uploadDataList = this.saleLaborVo.saleLaborDetailList;
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
            let excelModelName ="工费表模板.xlsx";
            let url=contextPath + "/excle/getExcelModel?excelModelName="+excelModelName;
            window.location.href= url;
        },
        //保存
        save(){
            let This = this;
            this.saleLaborVo.id='';
            if(this.saleLaborVo.saleLaborDetailList!==null&&this.saleLaborVo.saleLaborDetailList.length>0){
                this.saleLaborVo.saleLaborDetailList.forEach(function (item) {
                    item.id='';
                    item.laborId='';
                });
            }
            // allInfo = JSON.parse(JSON.stringify(this.saleLaborVo));
            if(this.saleLaborVo.saleLaborDetailList!==null&&this.saleLaborVo.saleLaborDetailList.length>0){
                this.saleLaborVo.saleLaborDetailList.forEach(function (item) {
                    item.difficulty = item.difficulty.replace("<","&lt;").replace(">","&gt;");
                });
            }
            console.log(This.saleLaborVo);
            let allInfo = {};
            allInfo = this.saleLaborVo;
            $.ajax({
                type: "POST",
                url: contextPath + "/saleLaborController/saveBatch",
                contentType: 'application/json;charset=utf-8',
                data: JSON.stringify(allInfo),
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
        //获取工费表数据
        getLaborData(){
            let This = this;
            $.ajax({
                type: "POST",
                url: contextPath + "/saleLaborController/list",
                contentType: 'application/json;charset=utf-8',
                data:JSON.stringify(This.saleLaborVo),
                dataType: "json",
                success: function (data) {
                    console.log(data.data);
                    //初始化页面
                    if(data.data!==null){
                        This.saleLaborVo=data.data;
                        if(This.saleLaborVo.saleLaborDetailList!==null&&This.saleLaborVo.saleLaborDetailList.length>0){
                            This.saleLaborVo.saleLaborDetailList.forEach(function (item) {
                                item.difficulty=item.difficulty.replace("&lt;","<").replace("&gt;",">");
                            });
                        }
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
        quit() {
            window.parent.closeCurrentTab({name: this.openName, exit: true, openTime: this.openTime})
        },
    },
    mounted: function () {
        this.openTime = window.parent.params.openTime;
        this.openName = window.parent.params.openName;
        //获取工费表数据
        this.getLaborData();
    }
})