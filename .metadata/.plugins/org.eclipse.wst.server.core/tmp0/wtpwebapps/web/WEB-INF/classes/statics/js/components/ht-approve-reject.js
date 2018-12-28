Vue.component("ht-approve-reject",{
    props:{
        //触发审核弹窗流程
        trigger: Boolean,

        //modalType  approve:审核弹窗  reject:驳回弹窗
        modalType: String,

        //单据编号
        receiptId: String,

        //单据当前审核状态
        receiptStatus: String,

        //审核级别列表，给显示审核进度用的
        stepList: Array,

        //初始化审核弹窗内数据
        urlInitApprove: String,

        //检测权限,vc
        urlCheck: String,

        //改变当前节点以及审核记录 更新单据
        urlApprove: String,
        //单据状态 对应的映射map,默认是按照进销存 常量标准定义
        //key值关系：tmp_save-暂存 await_check-待审核 checking审核中 auditing-已审核 reject-驳回
        //如若以后有改动 也可以传自定义的关系。但是key值要与上述对应
        statusMap:{
            require: false,
            type: Object,
            default(){
                return {
                    'tmp_save':'1',
                    'await_check':'2',
                    'checking':'3',
                    'auditing':'4',
                    'reject':'5',
                };
            }
        },
        urlTableData:{
            require: false,
            type: String,
            default(){
                return '';
            }
        },
        tableData:{
            require: false,
            type: Array,
            default(){
                return [];
            }
        },
        canRejectWhenAudit:{
            require: false,
            type: Boolean,
            default(){
                return false;
            }
        }
    },
    data(){
        return {
            isVisible: false,
            dataInfo: {},
            currentStep: '',
            nextStep: '',
            stepsMap: {
                0: '开始',
                1: '一级审核',
                2: '二级审核',
                3: '三级审核',
                4: '四级审核',
                5: '五级审核',
                6: '六级审核',
                7: '结束'
            },
            showApprove:false,
            showReject:false,

        }
    },
    template:`<div v-clock>
    <modal
    title="审核"
    v-model="showApprove"
    :closable="false"
    @on-ok="getApproveInfo"
    @on-cancel="isVisible = false"
    >
        <div>
        <p class="mg-bm-md">
        <span>当前节点：{{currentStep}}</span>
        <span class="mg-lf-sbg">下级节点：{{nextStep}}</span>
        </p>
        <span>审核意见</span>
        <i-input type="textarea" :rows="4" v-model="dataInfo.approvalInfo" placeholder="请输入审核意见"></i-input>
        </div>
    </modal>
    <modal
    title="驳回"
    v-model="showReject"
    :closable="false"
    @on-ok="getRejectInfo"
    @on-cancel="isVisible = false">
        <div>
        <radio-group v-model="dataInfo.approvalResult" class="mg-bm-md" >
        <radio label="0">驳回上一级</radio>
        <radio label="-1" class="mg-lf-sbg">驳回到开始级次</radio>
        </radio-group>
        <p style="font-weight: 600" class="mg-bm-md">驳回意见</p>
        <i-input  type="textarea" :rows="4" v-model="dataInfo.approvalInfo" placeholder="请输入驳回意见"></i-input>
        </div>
    </modal>
    </div>`,
    methods:{
        //检测是否有权限
        checkRight() {
            let vm = this;

            console.log("receiptStatus:"+vm.receiptStatus)
            //首先检查单据状态
            let auditedStatus = vm.statusMap['auditing'];
            if(vm.receiptStatus == auditedStatus && vm.canRejectWhenAudit === false){
                vm.$Modal.warning({
                    title: '提示',
                    content: (vm.modalType == 'reject')?'已审核的单据不能驳回!':'单据已审核',
                });
                return false;
            }
            if(vm.receiptStatus == auditedStatus && vm.modalType == 'approve' &&
                vm.canRejectWhenAudit === true){
                vm.$Modal.warning({
                    title: '提示',
                    content:'单据已审核',
                });
                return false;
            }
            let tmpSaveStatus = vm.statusMap['tmp_save'];
            if( !vm.receiptId || vm.receiptStatus  == tmpSaveStatus){
                vm.$Modal.warning({
                    title: '提示',
                    content: '请先提交单据!',
                });
                return false;
            }
            $.ajax({
                type: "POST",
                url: vm.urlCheck,
                contentType: 'application/json',
                data: JSON.stringify({receiptsId: vm.receiptId}),
                dataType: "json",
                success: function(data) {
                    //根据modalType 做不同的处理
                    if(vm.modalType == 'approve')  vm.approvalHandler(data);
                    if(vm.modalType == 'reject')  vm.rejectHandler(data);
                },
                error: function(err){
                    vm.$Modal.error({
                        title: '提示',
                        content: '服务器出错'
                    });
                }
            })
        },
        rejectHandler(data){
            let vm = this;
            if (data.code === "100515") {
                //不走审核，直接通过
                vm.$emit('on-auto-approve', {
                    result: data
                });
            }
            if (data.code === "100514") {
                vm.isVisible = false;
                vm.$Modal.error({
                    title: '提示',
                    content: data.data === 0 ? "该单据已被驳回到申请人，待申请人提交!":"您没有【"+ vm.stepsMap[data.data] +"】的驳回权限"
                });
            }
            if (data.code === "100100") {
                vm.initApproval();
                vm.isVisible = true;
            }

            if (data.code === '-1') {
                vm.$Modal.error({
                    title: '出错',
                    content: data.msg
                });
            }
        },
        approvalHandler(data){
            let vm = this;
            if (data.code === "100515") {
                //不走审核，直接通过
                vm.$Modal.success({
                    title: '提示',
                    content: '审核成功'
                });
                vm.$emit('on-auto-approve', {
                    result: data
                });
            }
            if (data.code === "100514") {
                vm.isVisible = false;
                vm.$Modal.error({
                    title: '提示',
                    content: data.data === 0 ? "该单据已被驳回到申请人，待申请人提交!":"您没有【"+ vm.stepsMap[data.data] +"】的审核权限"
                });
            }
            if (data.code === "100100") {
                vm.initApproval();
                vm.isVisible = true;
            }

            if (data.code === '-1') {
                vm.$Modal.error({
                    title: '出错',
                    content: data.msg
                });
            }
        },
        initApproval(){
            let vm = this;
            let url = vm.urlInitApprove +'?receiptsId='+vm.receiptId;
            $.ajax({
                type: "post",
                url: url,
                data: JSON.stringify({receiptsId: vm.receiptId}),
                dataType: "json",
                contentType:'application/json',
                success: function (data) {
                    if ($.isEmptyObject(data.data)) {
                        return false;
                    }
                    var process = data.data.list;
                    var stepsMap = vm.stepsMap;
                    for (let i = 0; i < process.length; i++) {
                        var idx = process[i].processLevel;
                        process[i].processLevel = stepsMap[idx];
                    }
                    process.unshift({
                        processLevel:"开始"
                    });
                    process.push({
                        processLevel:"结束"
                    });

                    vm.stepList = process;
                    vm.$emit("update:stepList", process);
                    var curr = process[1].currentLevel;
                    var isLastStep = curr === data.data.levelLength;
                    var levelLength = data.data.levelLength;
                    if (isLastStep) {
                        for (let i = 0; i < process.length; i++) {
                            process[i].currentLevel = process.length - 1;
                        }
                        vm.$emit("update:stepList", process);
                    } else {
                        vm.currentStep = vm.stepsMap[curr+1];
                        if(curr + 1 == levelLength){
                            vm.nextStep = vm.stepsMap[7];
                        }else {
                            vm.nextStep = vm.stepsMap[curr + 2];
                        }
                    }
                },
                error: function () {
                    alert('服务器出错啦');
                }
            })
        },
        //审核点击确定
        getApproveInfo() {
            let vm = this;
            window.top.home.loading('show',{text:'审核中，请稍后!'});
            vm.dataInfo.receiptsId = vm.receiptId;
            vm.dataInfo.approvalResult = '1';
            $.ajax({
                type: "POST",
                //改变当前节点 以及审核记录 更新单据
                url: this.urlApprove,
                contentType: 'application/json',
                data: JSON.stringify(vm.dataInfo),
                dataType: "json",
                success: function (data) {
                    var msg = $.trim(data.msg) || '';
                    if (data.code === "100100") {
                        vm.$Modal.success({
                            title: "提示",
                            content: (msg != '') ? msg : "审核成功!"
                        });
                        setTimeout(()=>{ vm.initValue();},0);
                    } else {
                        vm.$Modal.warning({
                            title: "提示",
                            content: (msg != '') ? msg : "审核失败!"
                        });
                    }
                    window.top.home.loading('hide');
                    vm.isVisible = false;
                    vm.$emit('on-approve', {
                        action: 'approve',
                        result: data
                    });
                },
                error: function (err) {
                    window.top.home.loading('hide');
                    vm.$Modal.warning({
                        title: "提示",
                        content: "服务器出错!"
                    });
                }
            });
        },
        //驳回点击确定
        getRejectInfo() {
            let vm = this;
            window.top.home.loading('show',{text:'审核中，请稍后!'});
            vm.dataInfo.receiptsId = vm.receiptId;
            $.ajax({
                type: "POST",
                //改变当前节点 以及审核记录 更新单据
                url: this.urlApprove,
                contentType: 'application/json',
                data: JSON.stringify(vm.dataInfo),
                dataType: "json",
                success: function (data) {
                    var msg = $.trim(data.msg) || '';
                    if (data.code === "100100") {
                        vm.$Modal.success({
                            title: "提示",
                            content: (msg != '') ? msg : "驳回成功!"
                        });
                        setTimeout(()=>{ vm.initValue();},0);
                    } else {
                        vm.$Modal.warning({
                            title: "提示",
                            content: (msg != '') ? msg : "驳回失败!"
                        });
                    }
                    vm.isVisible = false;
                    vm.$emit('on-reject', {
                        action: 'reject',
                        result: data
                    });
                    window.top.home.loading('hide');
                },
                error: function (err) {
                    window.top.home.loading('hide');
                    vm.$Modal.warning({
                        title: "提示",
                        content: "服务器出错!"
                    });
                }
            });
        },
        loadTableData() {
            let vm = this;
            let stepsMap = vm.stepsMap;
            if(!vm.urlTableData){
                return false;
            }
            $.ajax({
                type: "POST",
                url: this.urlTableData,
                data: {receiptsId:vm.receiptId},
                dataType: "json",
                success: function (data) {
                    if (data.code === "100100" && data.data.length > 0) {
                        let _arr= data.data.map(item=>
                            Object.assign({},{
                            approvalResult:item.approvalResult === 1 ? "审核": "驳回",
                            currentLevel: stepsMap[item.currentLevel],
                            nextLevel:stepsMap[item.nextLevel],
                            createName:item.createName,
                            approvalInfo:item.approvalInfo,
                            createTime:item.createTime
                        })
                        );
                        vm.$emit("update:tableData", _arr);
                    }
                },
                error: function (err) {
                }
            })
        },
        initValue(){
            let vm = this;
            vm.initApproval();
            vm.loadTableData();
        },
        reloadApprovalData(){
            let vm = this;
            $.when(
                $.ajax({type: "POST", url: vm.urlTableData, data: {receiptsId:vm.receiptId}, dataType: "json",}),
                $.ajax({type: "POST",url: vm.urlInitApprove,data: JSON.stringify({receiptsId: vm.receiptId}), dataType: "json", contentType:'application/json'}))
                .done(function (res1,res2) {

                    if ($.isEmptyObject(res2.data)) {
                        return false;
                    }
                    var process = res2.data.list;
                    var stepsMap = vm.stepsMap;
                    for (let i = 0; i < process.length; i++) {
                        var idx = process[i].processLevel;
                        process[i].processLevel = stepsMap[idx];
                    }
                    process.unshift({
                        processLevel:"开始"
                    });
                    process.push({
                        processLevel:"结束"
                    });

                    vm.stepList = process;
                    vm.$emit("update:stepList", process);
                    vm.$parent.$forceUpdate();
                    var curr = process[1].currentLevel;
                    var isLastStep = curr === res2.data.levelLength;
                    var levelLength = res2.data.levelLength;
                    if (isLastStep) {
                        for (let i = 0; i < process.length; i++) {
                            process[i].currentLevel = process.length - 1;
                        }
                        vm.$emit("update:stepList", process);
                        vm.$parent.$forceUpdate();
                    } else {
                        vm.currentStep = vm.stepsMap[curr+1];
                        if(curr + 1 == levelLength){
                            vm.nextStep = vm.stepsMap[7];
                        }else {
                            vm.nextStep = vm.stepsMap[curr + 2];
                        }
                    }

                      //加载审核信息列表信息
                      if(res1.code == '100100' && res1.data.length > 0){
                          let _arr= res1.data.map(item=>
                              Object.assign({},{
                                  approvalResult:item.approvalResult === 1 ? "审核": "驳回",
                                  currentLevel: stepsMap[item.currentLevel],
                                  nextLevel:stepsMap[item.nextLevel],
                                  createName:item.createName,
                                  approvalInfo:item.approvalInfo,
                                  createTime:item.createTime
                              })
                          );
                          vm.$emit("update:tableData", _arr);
                          vm.$parent.$forceUpdate();
                      }
                });
        },

    },
    computed:{
    },
    watch:{
        trigger(){
            this.checkRight();
            if(this.modalType == 'approve'){
                this.dataInfo.approvalInfo = '';
            }
            if(this.modalType == 'reject'){
                this.dataInfo.approvalInfo = '';
                this.dataInfo.approvalResult ='0';
            }


        },
        isVisible(){
            if(this.modalType == 'approve'){
                this.showApprove = this.modalType == 'approve' && this.isVisible == true;
            }else {
                this.showApprove = false;
            }
            if(this.modalType == 'reject'){
                this.showReject = this.modalType == 'reject' && this.isVisible == true;
            }else {
                this.showReject = false;
            }
        },
        receiptId(){
            let _this = this;
            console.log(_this.receiptId , _this.receiptStatus)
            let isInit = _this.stepList.length == 0;
            let awaitCheckStatus = _this.statusMap['await_check'];
            let checkingStatus = _this.statusMap['checking'];
            let awaitingStatus = _this.statusMap['auditing'];
            let rejectStatus = _this.statusMap['reject'];
            let tmpSaveStatus = _this.statusMap['tmp_save'];
            if(_this.receiptId && _this.receiptStatus == awaitCheckStatus ){
                setTimeout(()=>{_this.initApproval();},1000);
                _this.loadTableData();
            }

            if(_this.receiptId
                &&(_this.receiptStatus == checkingStatus|| _this.receiptStatus == awaitingStatus || _this.receiptStatus == rejectStatus || _this.receiptStatus == tmpSaveStatus)
                && isInit){
                _this.initApproval();
                _this.loadTableData();
            }

        },
        receiptStatus(){
            let _this = this;
            console.log(_this.receiptId , _this.receiptStatus)

            let awaitCheckStatus = _this.statusMap['await_check'];

            if(_this.receiptId && _this.receiptStatus == awaitCheckStatus ){
                setTimeout(()=>{_this.initApproval();},1000);
                _this.loadTableData();
            }

        }

    },
    mounted(){
    }
})


//用法
/*
<ht-approve-reject
    :trigger="trigger"
	:modal-type="modalType"
	:receipt-id="somereceiptid"
	:receipt-status="receiptStatus"
    :step-list.sync="stepList"
    :table-data.sync="yourTblDataArray"
    :url-check="contextPath+'/testItemController/findUserOperation'"
	:url-init-approve="contextPath+'/testItemController/queryProcessByReceiptsId'"
	:url-approve="contextPath + '/saleBillController/submitApproval'"
	:url-table-data="ajaxPath/to/get/tableData"
	@on-auto-approve="onAutoApprove"
	@on-approve="onApprove"
    @on-reject="onReject">
</ht-approve-reject>
*/

//modalType  approve:审核弹窗  reject:驳回弹窗