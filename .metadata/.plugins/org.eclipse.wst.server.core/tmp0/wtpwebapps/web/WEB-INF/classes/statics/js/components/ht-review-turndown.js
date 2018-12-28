Vue.component("ht-review-turndown",{
    props:{

        modalType:Number,//modalType  1:审核弹窗  2:驳回弹窗
        selected:Array, //数据绑定
        tabId:String,//改变当前节点 以及审批记录 更新单据
        url:String, //审核 驳回  权限接口
        approvalUrl:String,//审核 驳回  确定接口
        startBase:String,//初始化接口
        updateUrl:String, //更新单据数据接口
        colId:Number,
        colStatus:String, //列名状态
        colNum:String,//编号
        auditParams:Object //审核接口提交数据
    },
    data(){
        return {
            approve:false,
            reject:false,
            stepData: [
                {
                    currentLevel: 0,
                    subtitle: '开始'
                },
                {
                    currentLevel: 1,
                    subtitle: '一级审批'
                },
                {
                    currentLevel: 2,
                    subtitle: '二级审批'
                },
                {
                    currentLevel: 3,
                    subtitle: '三级审批'
                },
                {
                    currentLevel: 4,
                    subtitle: '四级审批'
                },
                {
                    currentLevel: 5,
                    subtitle: '五级审批'
                },
                {
                    currentLevel: 6,
                    subtitle: '六级审批'
                },
                {
                    currentLevel: 7,
                    subtitle: '结束'
                },
            ],
            currentStep: '',
            nextStep: '',
            dataInfo:{
                receiptsId: '',
                approvalResult: '',
                approvalInfo: '',
            }
        }
    },
    template:`<div v-clock>
    <modal
    title="审核"
    v-model="approve"
    :closable="false"
    @on-ok="getApproveInfo">
        <div>
        <p class="mg-bm-md">
        <span>当前节点：{{currentStep}}</span>
        <span class="mg-lf-sbg">下级节点：{{nextStep}}</span>
        </p>
        <span>审核意见</span>
        <i-input type="textarea" :rows="4" v-model="auditParams.approvalInfo" placeholder="请输入审批意见"></i-input>
        </div>
    </modal>
    <modal
        title="驳回"
        v-model="reject"
    :closable="false"
    @on-ok="getRejectInfo">
        <div>
        <radio-group v-model="dataInfo.approvalResult" class="mg-bm-md" >
        <radio label="0">驳回上一级</radio>
        <radio label="-1" class="mg-lf-sbg">驳回到开始级次</radio>
        </radio-group>
        <p style="font-weight: 600" class="mg-bm-md">驳回意见</p>
        <i-input  type="textarea" :rows="4" v-model="auditParams.approvalInfo" placeholder="请输入驳回意见"></i-input>
        </div>
    </modal>
    </div>`,
    methods:{
        //审核
        approval() {
            let This = this;
            if (!ht.util.hasValue(this.selected, "array")) {
                this.$Modal.warning({
                    title: "提示",
                    content: "请先选择一条记录"
                });
                return false;
            } else if (this.selected.length > 1) {
                this.$Modal.warning({
                    title: "提示",
                    content: "最多只能选择一条记录"
                });
                return false;
            }
            var rowData = $("#"+this.tabId).jqGrid("getRowData", this.selected);
            if (rowData[this.colStatus] === "已审核") {
                this.$Modal.warning({
                    title: "提示",
                    content: "该单据已审核通过!"
                });
                return false;
            }
            if (rowData[this.colStatus] === "暂存") {
                This.$Modal.warning({
                    title: "提示",
                    content: "请先提交!"
                });
                return false;
            }
            var arr = rowData[this.colNum].split('>');
            rowData[this.colNum] = arr[1].split('<')[0];
            This.initApproval(this.auditParams);
            $.ajax({
                type: "POST",
                url: This.approvalUrl,
                contentType: "application/json;charset=utf-8",
                data: JSON.stringify(this.auditParams),
                dataType: "json",
                success: function (data) {
                    console.log(data);
                    if (data.code === "100515") {
                        //没有启用审批流
                        rowData[This.colStatus] = 4;
                        //更新数据
                        This.updateData("审核成功!");
                    }
                    if (data.code === "100514") {
                        //没有权限
                        let msg = data.data === 1 ? "【一级审核】" : data.data === 2 ?
                            "【二级审核】" : data.data === 3 ? "【三级审核】" : data.data === 4 ?
                                "【四级审核】" : data.data === 5 ? "【五级审核】" : data.data === 6 ?
                                    "【六级审核】" : data.msg;
                        // layer.alert(data.data === 0 ? "该单据已被驳回到申请人，待申请人提交!":"您没有"+msg+"的审核权限");
                        This.$Modal.warning({
                            title: "提示",
                            content: data.data === 0 ? "该单据已被驳回到申请人，待申请人提交!" : "您没有" + msg + "的审核权限"
                        });
                    }
                    if (data.code === "100100") {
                        //走审核流程
                        //This.approveComment = true;
                        This.approve=true;
                        This.modalType = 1
                    }
                },
                error: function (err) {
                    This.$Modal.warning({
                        title: "提示",
                        content: "服务器出错!"
                    });
                }
            })

        },
        //驳回
        rejectAact() {

            let This = this;
            if (!ht.util.hasValue(this.selected, "array")) {
                this.$Modal.warning({
                    title: "提示",
                    content: "请先选择一条记录"
                });
                return false;
            } else if (this.selected.length > 1) {
                this.$Modal.warning({
                    title: "提示",
                    content: "最多只能选择一条记录"
                });
                return false;
            }
            var rowData = $("#"+this.tabId).jqGrid("getRowData", this.selected);
            if (rowData[this.colStatus] === "已审核") {
                this.$Modal.warning({
                    title: "提示",
                    content: "该单据已审核通过,不能驳回"
                });
                return false;
            }
            if (rowData[this.colStatus] === "暂存") {
                this.$Modal.warning({
                    title: "提示",
                    content: "请先提交该销售结算单!"
                });
                return false;
            }
            var arr = rowData[this.colNum].split('>');
            rowData[this.colNum] = arr[1].split('<')[0];
            This.initApproval(rowData[this.colNum]);
            $.ajax({
                type: "POST",
                url: This.approvalUrl,
                contentType: "application/json;charset=utf-8",
                data: JSON.stringify(this.auditParams),
                dataType: "json",
                success: function (data) {
                    console.log(data);
                    if (data.code === "100515") {
                        //没有启用审批流
                        rowData[This.colStatus] =1;
                        This.updateData( "驳回成功!");
                    }
                    if (data.code === "100514") {
                        //没有权限
                        let msg = data.data === 1 ? "【一级审核】" : data.data === 2 ?
                            "【二级审核】" : data.data === 3 ? "【三级审核】" : data.data === 4 ?
                                "【四级审核】" : data.data === 5 ? "【五级审核】" : data.data === 6 ?
                                    "【六级审核】" : data.msg;
                        // layer.alert(data.data === 0 ? "该单据已被驳回到申请人，待申请人提交!":"您没有"+msg+"的审核权限");
                        This.$Modal.warning({
                            title: "提示",
                            content: data.data === 0 ? "该单据已被驳回到申请人，待申请人提交!" : "您没有" + msg + "的审核权限"
                        });
                    }
                    if (data.code === "100100") {
                        //走审核流程
                        This.initApproval(rowData.colNum);
                        This.modalType = 2;
                    }
                },
                error: function (err) {
                    This.$Modal.warning({
                        title: "提示",
                        content: "服务器出错"
                    });
                }
            })


        },
        //初始化审批弹框
        initApproval(code) {
            console.log(code);
            let This = this;
            $.ajax({
                type: "post",
                //查询节点
                url: This.startBase,
                contentType: "application/json;charset=utf-8",
                data: JSON.stringify(code),
                dataType: "json",
                success: function (data) {
                    if ($.isEmptyObject(data.data)) {
                        console.log("没有流程");
                        return false;
                    }
                    var process = data.data.list;
                    var curr = process[1].currentLevel;
                    for (let i = 0; i < This.stepData.length; i++) {
                        if (curr === This.stepData[i].currentLevel) {
                            This.currentStep = This.stepData[i + 1].subtitle;
                            if (This.stepData[i + 1].currentLevel === data.data.levelLength) {
                                This.nextStep = This.stepData[This.stepData.length - 1].subtitle;
                            } else {
                                This.nextStep = This.stepData[i + 2].subtitle;
                            }
                        }
                    }
                },
                error: function () {
                    This.$Modal.warning({
                        title: "提示",
                        content: "服务器出错"
                    });
                }
            })
        },
        //审核点击确定
        getApproveInfo() {
            let This = this;
            var rowData = $("#"+this.tabId).jqGrid("getRowData", this.selected);
            var arr = rowData[this.colNum].split('>');
            rowData[this.colNum] = arr[1].split('<')[0];
            This.dataInfo.receiptsId = rowData[this.colNum];
            This.dataInfo.approvalResult = '1';
            $.ajax({
                type: "POST",
                //改变当前节点 以及审批记录 更新单据
                url: This.url,
                contentType: "application/json;charset=utf-8",
                data:JSON.stringify(this.auditParams),
                dataType: "json",
                success: function (data) {
                    if (data.code === "100100") {
                        //没有启用审批流
                        rowData[This.colStatus] = 4;
                        //更新数据
                        This.updateData("审核成功!");

                    } else {
                        This.$Modal.warning({
                            title: "提示",
                            content: "审核失败!"
                        });
                    }
                    This.dataInfo = {receiptsId: '', approvalResult: 1, approvalInfo: ''};
                    //This.$emit("update:modalType","")
                    This.modalType = '';
                    This.$parent.refresh();
                },
                error: function (err) {
                    This.$Modal.warning({
                        title: "提示",
                        content: "服务器出错!"
                    });
                }
            })
        },
        //驳回点击确定
        getRejectInfo() {
            let This = this;
            var rowData = $("#"+this.tabId).jqGrid("getRowData", this.selected);
            var arr = rowData[this.colNum].split('>');
            rowData[this.colNum] = arr[1].split('<')[0];
            This.dataInfo.receiptsId = rowData[this.colNum];
            $.ajax({
                type: "POST",
                //改变当前节点 以及审批记录 更新单据
                url: This.url,
                contentType: "application/json;charset=utf-8",
                data:JSON.stringify(this.auditParams),
                dataType: "json",
                success: function (data) {
                    console.log(data.data);
                    if (data.code === "100100") {
                        This.$Modal.success({
                            title: "提示",
                            content: "驳回成功!"
                        });
                    } else {
                        This.$Modal.warning({
                            title: "提示",
                            content: "驳回失败!"
                        });
                    }
                    This.dataInfo = {receiptsId: '', approvalResult: '0', approvalInfo: ''};
                    This.modalType = '';
                    This.$parent.refresh();
                },
                error: function (err) {
                    This.$Modal.warning({
                        title: "提示",
                        content: "服务器出错!"
                    });
                }
            })
        },
        //更新单据数据
        updateData(msg) {
            let This = this;
            $.ajax({
                type: "POST",
                url: This.updateUrl,
                contentType:"application/json",
                data:{id:Number(this.colId[0]),deposit:this.auditParams.receiptsId,status:4},
                dataType: "json",
                success: function (d) {
                    if(d.code=="100100"){
                        This.$parent.refresh();
                        This.$Modal.success({
                            title: "提示",
                            content: msg
                        });
                    }
                },
                error: function (err) {
                    This.$Modal.warning({
                        title: "提示",
                        content: "服务器出错"
                    });
                }
            })
        },
    },
    watch:{
        modalType(){
            if(this.modalType == 1){
                this.approve = true
            }else if(this.modalType == 2){
                this.reject = true
            }else{
                this.approve = false;
                this.reject = false
            }
        }
    },
    mounted(){

    }
})


//用法
// <ht-review-turndown :modal-type.sync="modalType" :selected="selected":tab-id="tabId" :url="contextPath + '/saleBillController/submitApproval'"
// :approval-url="contextPath+'/saleBillController/findUserOperation'":start-base="contextPath+'/saleBillController/queryProcessByReceiptsId'" :update-url="contextPath+'/saleBillController/update'"
// :col-status="documentStatus" :col-Num="documentNo"></ht-review-turndown>

//modalType  1:审核弹窗  2:驳回弹窗

//初始化审批接口   contextPath + '/saleBillController/queryProcessByReceiptsId'

//更新单据数据     contextPath + "/saleBillController/update",

//:tab-id="tabId" :url="contextPath + '/saleBillController/submitApproval'"></ht-review-turndown>