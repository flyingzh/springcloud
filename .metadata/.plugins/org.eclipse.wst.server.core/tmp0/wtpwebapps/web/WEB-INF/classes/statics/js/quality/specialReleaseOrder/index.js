Date.prototype.format = function (fmt) { // author: meizz
    var o = {
        "M+": this.getMonth() + 1, // 月份
        "d+": this.getDate(), // 日
        "h+": this.getHours(), // 小时
        "m+": this.getMinutes(), // 分
        "s+": this.getSeconds(), // 秒
        "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
        "S": this.getMilliseconds() // 毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

var releaseOrder = new Vue({
    el: '#releaseOrder',
    data () {
        return {
            // 弹窗
            // 启用多级审核时单据上的操作——审核
            approveComment: false,
            // 启用多级审核时单据上的操作—-驳回
            rejectComment: false,
            // 审批数据绑定
            approvement: {
                receiptsId: '',
                approvalResult: 1,
                approvalInfo: '',
                boeId:'',
            },
            // 驳回数据绑定
            rejectement: {
                receiptsId: '',
                approvalResult: '0',
                approvalInfo: '',
                boeId:'',
            },
            // 审核图标
            isStampShow: false,
            // 显示审核按钮
            showApproval: true,
            // 显示驳回按钮
            showReject: true,
            // 单据类型
            boeType: 'specialReleaseOrder',
            // 审批进度条
            steplist: [],
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
            currentStep: '', // 当前节点
            nextStep: '',   // 下级节点
            data_config_approval: {
                url: contextPath+'/specialReleaseDocument/queryReceiptsById',
                colNames: ['操作类型', '开始级次', '目的级次', '审批人', '审批意见', '审批时间'],
                colModel: [
                    {
                        name: 'approvalResult',
                        index: 'lotSize',
                        width: 215,
                        align: "center",
                        formatter: function (value, grid, rows, state) {
                            return value == 1 ? "审核" : "驳回";
                        }
                    },
                    {
                        name: 'currentLevel',
                        index: 'samplingRatio',
                        width: 215,
                        align: "center",
                        formatter: function (value, grid, rows, state) {
                            return value === 1 ? "一级审核" : value === 2 ?
                                "二级审核" : value === 3 ? "三级审核" : value === 4 ?
                                    "四级审核" : value === 5 ? "五级审核" : value === 6 ?
                                        "六级审核" : "";
                        }

                    },
                    {
                        name: 'nextLevel',
                        index: 'acceptance',
                        width: 210,
                        align: "center",
                        formatter: function (value, grid, rows, state) {
                            return value === "1" ? "一级审核" : value === "2" ?
                                "二级审核" : value === "3" ? "三级审核" : value === "4" ?
                                    "四级审核" : value === "5" ? "五级审核" : value === "6" ?
                                        "六级审核" : "结束";
                        }
                    },
                    { name: 'createName', index: 'rejected asc, invdate', width: 215, align: "center" },
                    { name: 'approvalInfo', index: 'rejected asc, invdate', width: 215, align: "center" },
                    { name: 'createTime', index: 'rejected asc, invdate', width: 215, align: "center" }
                ],
                jsonReader: {
                    root: "data.data"
                },
                multiselect: false,
            },


            applicationReasonsDisabled: false,
            ishttpOK: false,
            isSave: false,
            openTime: "",
            showDepartment: false,
            // 控制问题发布是否禁用
            releaseDisable: false,
            isConfirmer: false, // 是否最终审核人
            // 控制选择部门弹窗
            showDepartmentModal: false,
            department_selected: [],
            formDataInit: {},   // 初始化
            // 风险评估: 确认人、风险评估
            formData: {
                id: null, // 第一次点击保存 或者提交 传null
                code: '',       // 单据编号
                documentTime: (new Date()).format("yyyy/MM/dd") || '',  // 单据日期
                documentStatus: '暂存',  // 单据状态
                departmentName: '', // 申请部门
                departmentId: 0,   // 申请部门id
                applicantName: '',  // 申请人name
                documentType: '',   // 源单类型
                sourceDocumentCode: '', // 源单单号
                qcDocumentId:'',// 检验单id
                qcDocumentCode: '', // 检验单号
                supplierCustomerCode: '',   // 供应商/客户
                qcConclusion: '',     // 检验结论
                applyReason: '',   // 申请原因
                confirmer: '',  // 确认人
                riskEstimate: '',   // 风险评估
                createName: '', // 创建人name
                createTime: '', // 创建时间
                updateName: '', // 修改人name
                updateTime: '', // 修改时间
                examineVerifyId: 0,    // 审核人id
                examineVerifyName: '', // 审核人name
                examineVerifyDate: '', // 审核时间
                examineVerifyTime: '', // 审核时间
                step: 1,    // 单据流程_1、申请信息.2、风险评估.3、都不可编辑
                unqualifiedStyleVoList: [],     // 待放行商品款式明细
                ids: [],     // 删除的 待放行商品款式明细
            },
            ruleValidate:{
                documentTime: [{required: true}],
                departmentName: [{required: true}],
                applicantName: [{required: true}],
                documentType: [{required: true}],
                qcConclusion: [{required: true}],
                applyReason: [{required: true}]
            },
            submitValidate: false,
            uVoListSelectDelete: [],
            uDelete: [],
            documentStatusList: [],
            getDocumentTypeList: [],
            queryAllEmpByDeptIdList: [],    // 申请人ve
            documentTypeList: [
                { label: '暂存', value: 'temporary_save' },
                { label: '待审核', value: 'await_check' },
                { label: '审核中', value: 'checking' },
                { label: '放行通过', value: 'auditing' },
                { label: '驳回', value: 'bohui' },
            ],
            status: [
                {
                    label: '有效',
                    value: 1
                },
                {
                    label: '无效',
                    value: 0
                }
            ],
            /*
			 * data_config_approval: { url: '', colNames: ['操作类型', '开始级次',
			 * '目的级次', '审批人', '审批意见', '审批时间'], rowNum: 999999999,//一页显示多少条
			 * height: $(window).height() * 0.7, jsonReader: { root:
			 * "data.list", }, styleUI: 'Bootstrap', colModel: [ { name:
			 * 'approvalResult', index: 'approvalResult', width: 250, align:
			 * "center" }, { name: 'approvalResult', index: 'approvalResult',
			 * width: 250, align: "center" }, { name: 'currentLevel', index:
			 * 'currentLevel', width: 250, align: "center" }, { name:
			 * 'createName', index: 'createName', width: 250, align: "center" }, {
			 * name: 'approvalInfo', index: 'approvalInfo', width: 250, align:
			 * "center" }, { name: 'createTime', index: 'createTime', width:
			 * 250, align: "center" } ], multiselect: false },
			 */
            /*
			 * //商品款式id、商品编码、商品名称、商品类型id、不合格数、合格率、检验结果描述/建议、特别放行数量,申请原因
			 * data_config_release_detail: { url: '', colNames: ['商品款式id',
			 * '商品编码', '商品名称', '商品类型', '不合格数', '合格率/%', '检验结果描述/建议', '特别放行数量',
			 * '申请原因'], colModel: [ { name: 'productStyleId', index:
			 * 'productStyleId', hidden: true }, { name: 'productCode', index:
			 * 'productCode', width: 200, align: "center" }, { name:
			 * 'productName', index: 'productName', width: 100, align: "center" }, {
			 * name: 'productTypeName', index: 'productTypeName', width: 100,
			 * align: "center" }, { name: 'unqualifiedAmount', index:
			 * 'unqualifiedAmount', width: 120, align: "center" }, { name:
			 * 'qualifiedPercent', index: 'qualifiedPercent', width: 100, align:
			 * "center", formatter: function (value, grid, rows, state) { return
			 * value * 100 + "%" } }, { name: 'resultDescribeSuggest', index:
			 * 'resultDescribeSuggest', width: 200, align: "center" }, { name:
			 * 'releaseCount', index: 'releaseCount', width: 150, align:
			 * "center", formatter: function (value, grid, rows, state) { return '<input
			 * type="text" style="width:120px;"
			 * :disabled="applicationReasonsDisabled"></input>' } }, { name:
			 * 'applyReason', index: 'applyReason', width: 150, align: "center",
			 * formatter: function (value, grid, rows, state) { return '<input
			 * type="text" style="width:120px;"
			 * :disabled="applicationReasonsDisabled"></input>' } } ] },
			 */
            unqualifiedStyleVoListColumns: [
                { type: 'selection', width: 60, align: 'center'},
                { type: 'index',width:100,align: 'center' ,title:'序号'},
                { title: '商品编码', key: 'productCode' },
                { title: '商品名称', key: 'productName' },
                { title: '商品类型', key: 'productTypeName' },
                { title: '不合格数', key: 'unqualifiedAmount', className: 'ht-number-right'},
                { title: '合格率', key: 'qualifiedPercent', className: 'ht-number-right',
                    render: (h, params) => {
                        let qualifiedPercent1 = params.row.qualifiedPercent;
                        console.log(params.row.qualifiedPercent ,"=======params.row.qualifiedPercent")
                        return h('div', {
                            props: {
                            },
                        },`${qualifiedPercent1}%`)
                    }
                },
                // { title: '合格率', key: 'qualifiedPercent', className:
				// 'ht-number-right'},
                { title: '检验结果描述/建议', key: 'resultDescribeSuggest' },
                {
                    title: '特别放行数量', key: 'releaseCount', className: 'ht-number-right',
                    render: (h, params) => {
                        var count = releaseOrder.formData.unqualifiedStyleVoList[params.index].releaseCount;
                        var unCout = releaseOrder.formData.unqualifiedStyleVoList[params.index].unqualifiedAmount;
                        var _t = (count === 0 || count === '' || count === undefined ) ? unCout : count;
                        // var _t
						// =(releaseOrder.formData.unqualifiedStyleVoList[params.index].releaseCount
						// === 0 ||
						// releaseOrder.formData.unqualifiedStyleVoList[params.index].releaseCount
						// === '') ?
						// releaseOrder.formData.unqualifiedStyleVoList[params.index].unqualifiedAmount
						// :
						// releaseOrder.formData.unqualifiedStyleVoList[params.index].releaseCount;
                        console.log(count,'====_t');
                        console.log(unCout,'====_t');
                        console.log(_t,'====_t');
                        return h('div', [
                            h('i-input', {
                                props: {// 禁用i-table文本框
                                    type: 'text',
                                    disabled: releaseOrder.formData.documentStatus === '已审核' || releaseOrder.formData.documentStatus === '待审核' || releaseOrder.formData.documentStatus === '审核中',
                                    value: _t
                                },
                                on: {
                                    'on-blur': (event) => {
                                        releaseOrder.formData.unqualifiedStyleVoList[params.index].releaseCount = event.target.value;
                                    }
                                },
                            })
                        ]);
                    }
                },
                {
                    title: '申请原因', key: 'aReason',
                    render: (h, params) => {
                        return h('div', [
                            h('i-input', {
                                props: {
                                    type: 'text',
                                    disabled: releaseOrder.formData.documentStatus === '已审核' || releaseOrder.formData.documentStatus === '待审核' || releaseOrder.formData.documentStatus === '审核中',
                                    value: releaseOrder.formData.unqualifiedStyleVoList[params.index].aReason
                                },
                                on: {
                                    'on-blur': (event) => {
                                        releaseOrder.formData.unqualifiedStyleVoList[params.index].aReason = event.target.value;
                                    }
                                }
                            })
                        ]);
                    }
                }
            ],
            unqualifiedStyleVoList: [],
            currentSteps: 2,
            queryalldeptList: [],
            treeSetting: {
                callback: {
                    onClick: this.treeClickCallBack,
                    beforeClick: this.treeBeforeClick
                }
            },
            steplist: [],
            stepCur: 0,
            approvalValue1: '',
            approvalValue1L: '',
            approvalValue2: '',
            approval1: false,
            approval2: false,
            approvalRadio: '1',
            currentLevelTxt: '',
            currentLevelTxtNext: '',
            showSourceModal: false,
        }
    },
    methods: {
        showTypeCode () {
            this.showSourceModal = !this.showSourceModal;
        },
        closeSourceModal () {
            this.showSourceModal = false;
            this.htTestChange();
        },
        approvalIndex () {// 审核
            console.log("*************************************")
            // 发送请求
            let This = this;
            if (This.formData.code === "" || This.formData.documentStatus === "暂存") {
                layer.alert("请提交放行单!");
                return false;
            }
            This.initApproval();
            $.ajax({
                type: "POST",
                url: contextPath+"/specialReleaseDocument/findUserOperation",
                contentType: 'application/json',
                data: JSON.stringify({ receiptsId: This.formData.code, docTypeCode: "fxd" }),
                dataType: "json",
                success: function (data) {
                    console.log(data);
                    if (data.code === "100515") { // 未启用多级审核
                        layer.alert("审核成功");
                        This.formData.documentStatus = "已审核";
                        This.saveMethod(); // 修改单据状态
                    }
                    if (data.code === "100514") { // 没权限
                        let msg = data.data === 1 ? "【一级审核】" : data.data === 2 ?
                            "【二级审核】" : data.data === 3 ? "【三级审核】" : data.data === 4 ?
                                "【四级审核】" : data.data === 5 ? "【五级审核】" : data.data === 6 ?
                                    "【六级审核】" : data.msg;
                        layer.alert(data.data === 0 ? "该单据已被驳回到申请人，待申请人提交!" : "您没有" + msg + "的审核权限");
                    }
                    if (data.code === "100100") { // 操作成功
                        if (This.formData.documentStatus === "已审核") {
                            layer.alert("此单已审核");
                            return false;
                        }
                        This.approveComment = true;// 启用多级审核时弹窗，弹窗保存后才修改单据状态
                    }
                },
                error: function (err) {
                    layer.alert("服务器出错");
                }
            })
        },
        // 驳回
        reject () {
            let This = this;
            if (This.formData.code === "" || This.formData.documentStatus === "暂存") {
                layer.alert("请提交放行单!");
                return false;
            }
            if (This.formData.documentStatus == "已审核") {
                layer.alert(" 单据已经审核完成!");
                return false;
            }
            // 发送请求
            $.ajax({
                type: "POST",
                url: contextPath+"/specialReleaseDocument/findUserOperation",
                contentType: 'application/json',
                data: JSON.stringify({ receiptsId: This.formData.code, docTypeCode: "fxd" }),
                dataType: "json",
                success: function (data) {
                    if (data.code === "100100") {
                        This.rejectComment = true; // 显示驳回弹窗
                    }
                    if (data.code === "100514") {
                        let msg = data.data === 1 ? "【一级审核】" : data.data === 2 ?
                            "【二级审核】" : data.data === 3 ? "【三级审核】" : data.data === 4 ?
                                "【四级审核】" : data.data === 5 ? "【五级审核】" : data.data === 6 ?
                                    "【六级审核】" : data.msg;
                        layer.alert(data.data === 0 ? "该单据已被驳回到申请人，待申请人提交!" : "您没有" + msg + "的驳回权限");
                    }
                    if (data.code === "100515") {
                        layer.alert("驳回成功");
                        This.formData.documentStatus = "驳回";
                        This.saveMethod();
                    }
                },
                error: function (err) {
                    layer.alert("服务器出错");
                }
            })
        },
        // 审批意见点击确定
        getApproveInfo () {
            let This = this;
            This.approvement.receiptsId = This.formData.code;
            This.approvement.boeId=This.formData.id; // 审批和驳回时需要传入单据id
            $.ajax({
                type: "POST",
                url: contextPath+"/specialReleaseDocument/submitapproval",
                contentType: 'application/json',
                data: JSON.stringify(this.approvement),
                dataType: "json",
                success: function (data) {
                    if (data.code === "100100") {
                        layer.alert("审核成功");
                        if (data.data.approvalStatus === 0) {
                            /*
							 * if (This.formData.documentStatus === "审核中") {
							 * return false; }
							 */
                            This.formData.documentStatus = "审核中";
                        }
                        if (data.data.approvalStatus === 1) {
                            This.formData.documentStatus = "已审核";
                            This.isStampShow = true;// 已审核时显示图标
                            /*
							 * This.formData.examineVerifyName = "超级管理员";
							 * This.formData.examineVerifyDate = (new
							 * Date()).format("yyyy/MM/dd hh:mm:ss");
							 * This.saveEV(3); //保存审核人
							 * 
							 */                        
                           This.formData.examineVerifyName= data.data.examineVerifyName;
                     	   This.formData.examineVerifyTime= data.data.examineVerifyDate;
                     	   //This.saveEV( This.formData.examineVerifyId); // 保存审核人

                        }
                        This.saveMethod(); // 修改单据状态
                        This.initApproval(); // 获取节点信息
                        This._pageInit(This.approvement.receiptsId);       // 查审批信息

                        // console(This.formData.id,"ABCDEF");
                        // This_ajaxInitEcho (This.formData.id, 3); //更新数据
                        This.approvement = { receiptsId: '', approvalResult: 1, approvalInfo: '' ,boeId:''}; // 清空审核数据
                    } else {
                        layer.alert("审核失败");
                    }
                },
                error: function (err) {
                    layer.alert("服务器出错");
                }
            })
        },
        // 驳回点击确定
        getRejectInfo () {
            let This = this;
            This.rejectement.receiptsId = This.formData.code;
            This.rejectement.boeId=This.formData.id; // 审批和驳回时需要传入单据id
            $.ajax({
                type: "POST",
                url: contextPath+"/specialReleaseDocument/submitapproval",
                contentType: 'application/json',
                data: JSON.stringify(This.rejectement),
                dataType: "json",
                success: function (data) {
                    if (data.code === "100100") {
                        layer.alert("驳回成功");
                        if(data.data.approvalStatus === -2){
                            This.formData.documentStatus = '暂存';

                            This.releaseDisable = false;
                            This.applicationReasonsDisabled = false;
                            This.riskEstimateDisabled = true;
                        }else {
                            This.formData.documentStatus='驳回';
                        }
                        This.saveMethod(); // 修改单据状态

                        // 已审核再驳回时隐藏图标
                        This.isStampShow = false;
                    } else {
                        layer.alert("驳回失败");
                    }
                    This.initApproval(); // 获取节点信息
                    This._pageInit(This.approvement.receiptsId);       // 查审批信息
                    This.rejectement = { receiptsId: '', approvalResult: '0', approvalInfo: '' ,boeId:''}; // 清空驳回数据
                },
                error: function (err) {
                    layer.alert("服务器出错");
                }
            })
        },
        saveMethod () { // 改单据状态
            let This = this;
            let param = JSON.stringify({ "id": This.formData.id, "documentStatus": This.formData.documentStatus })
            console.log(JSON.stringify({ "id": This.formData.id, "documentStatus": This.formData.documentStatus }))
            $.ajax({
                type: "POST",
                url: contextPath+"/specialReleaseDocument/updateStatusByApproval",
                contentType: 'application/json',
                data: param,
                dataType: "json",
                success: function (data) {
                    console.log("修改成功");
                },
                error: function (err) {
                    layer.alert("服务器出错");
                }
            })
        },
        initApproval () { // 获取节点信息
            let This = this;
            $.ajax({
                type: "post",
                url: contextPath+'/specialReleaseDocument/queryProcessInfoByReceiptsId',
                data: JSON.stringify({ receiptsId: This.formData.code }),
                contentType: "application/json",
                dataType: "json",
                success: function (data) {

                    if ($.isEmptyObject(data.data)) { // 判断返回数据
                        console.log("没有流程");
                        /*
						 * if(This.formData.documentStatus === "驳回"){
						 * This.changeFrame = false; This.isbet = false;
						 * This.upperCommDiffDisable = false;
						 * This.upperLimitDisable = false;
						 * This.lowerCommDiffDisable = false; This.isQtfx =
						 * false; This.lowerLimitDisable = false; This.showMenu =
						 * true; }
						 */
                        return false;
                    }
                    var process = data.data.list; // 获取审批信息

                    for (let i = 0; i < process.length; i++) {
                        switch (process[i].processLevel) { // 获取当前节点信息
                            case 1:
                                process[i].processLevel = '一级审核';
                                break;
                            case 2:
                                process[i].processLevel = '二级审核';
                                break;
                            case 3:
                                process[i].processLevel = '三级审核';
                                break;
                            case 4:
                                process[i].processLevel = '四级审核';
                                break;
                            case 5:
                                process[i].processLevel = '五级审核';
                                break;
                            case 6:
                                process[i].processLevel = '六级审核';
                                break;
                        }
                    }
                    process.unshift(
                        {
                            processLevel: "开始"
                        }
                    );
                    process.push(
                        {
                            processLevel: "结束"
                        }
                    );

                    This.steplist = process; // 显示审批信息
                    if (process[1].currentLevel === data.data.levelLength) {
                        for (let i = 0; i < process.length; i++) {
                            process[i].currentLevel = process.length - 1;
                        }
                        return false;
                    }
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
                    alert('服务器出错啦');
                }
            })
        },

        treeClickCallBack (event, treeId, treeNode) {
            this.formData.departmentName = treeNode.name;
            this.formData.departmentId = treeNode.id;
            this.showDepartment = false;
            this.formData.applicantName = '';
            this._ajaxqueryAllEmpByDeptId(this.formData.departmentId);
            this.htTestChange();
        },
        treeBeforeClick (treeId, treeNode, clickFlag) {
            return !treeNode.isParent; // 当单击父节点，返回false，不让选取
        },
        showDepartmentTree (name) {
            if (this.showDepartment === name) {
                this.showDepartment = ''
                return;
            }
            this.showDepartment = name;
        },
        // type为3 时 修改状态 根据 id 请求初始化值
        _ajaxInitEcho (_id, _type) {
            var that = this;
            var _url = contextPath+'/specialReleaseDocument/echo?r=' + new Date().getTime();
            var _info = _type === '1' ? { 'qcDocumentCode': _id } : { 'id': _id }
            $.ajax({
                type: "post",
                url: _url,
                data: _info,
                dataType: "json",
                success: function (data) {
                    console.log(data);
                    if (data.code === '100100') {
                    	that.getAccess(data.data.id,that.boeType);// 附件信息
                    	    // 已审核时显示图标
                        if (data.data.documentStatus === "已审核") {
                            that.isStampShow = true;
                            that.formData.examineVerifyName= data.data.examineVerifyName;
                            that.formData.examineVerifyTime= data.data.examineVerifyDate;
                        }
                        if (_type === '1') {// 生成特别放行单
                            that.formDataInit.unqualifiedStyleVoList =  [...data.data.unqualifiedStyleVoList]; // 初始化信息
                            data.data.unqualifiedStyleVoList.map(function(item, index){
                                if(!item.releaseCount){
                                    item.releaseCount = item.unqualifiedAmount;
                                }
                            });
                            that.formData.unqualifiedStyleVoList = [...data.data.unqualifiedStyleVoList]; // 填充信息
                       

                            that.formData.qcDocumentId= data.data.qcDocumentId;
                            that.isEdit("Y");// 附件组件，可以编辑附件
                        } else {// 修改
                            /*
							 * let unList = data.data.unqualifiedStyleVoList;
							 * for (let i = 0; i < unList.length; i++) {
							 * console.log(unList[i].qualifiedPercent,"888888")
							 * console.log(unList[i].qualifiedPercent *
							 * 100,"88888888") unList[i].qualifiedPercent =
							 * (unList[i].qualifiedPercent * 100).toString() +
							 * "%" }
							 */

                            let unqualifiedStyleVoList = data.data.unqualifiedStyleVoList;

                            that.formDataInit.unqualifiedStyleVoList =  [...data.data.unqualifiedStyleVoList]; // 初始化信息
                            data.data.unqualifiedStyleVoList.map(function(item, index){
                                if(!item.releaseCount){
                                    item.releaseCount = item.unqualifiedAmount;
                                }
                            });

                            that.formData.unqualifiedStyleVoList = [...data.data.unqualifiedStyleVoList]; // 填充信息
                        
                            that.formDataInit = Object.assign({}, data.data); // 初始化
                            that.formData = Object.assign({}, data.data, {examineVerifyName:data.data.examineVerifyName, examineVerifyTime: data.data.examineVerifyDate});  // 填充数据
                            that.initApproval(); // 根据单据编号查询审批流程信息
                            that._pageInit(data.data.code);       // 查审批信息
                            that._ajaxqueryAllEmpByDeptId(that.formData.departmentId); // 12
																						// 申请人

                            that.formData.applicantName = data.data.applicantName;

                            if (that.formData.confirmer === '') {
                                if (that.formData.documentStatus === '待审核' || that.formData.documentStatus === '审核中') {
                                    that._ajaxqueryConfirmer();
                                }
                            }
                            if (that.formData.documentStatus === '驳回' ||that.formData.documentStatus === '待审核' || that.formData.documentStatus === '审核中' || that.formData.documentStatus === '已审核') {
                                that.releaseDisable = true;
                                that.applicationReasonsDisabled = true;
                            }
                            if (that.formData.documentStatus === '暂存' ) {
                            	that.isEdit("Y");// 附件组件，可以编辑附件
                            }
                            
                        }

                    }
                },
                error: function () {
                    alert('服务器出错啦');
                }
            });
        },
        // 14 确认人
        _ajaxqueryConfirmer () {
            var that = this;
            var _url = contextPath+'/specialReleaseDocument/getConfirmer?r=' + new Date().getTime();
            $.ajax({
                type: "post",
                url: _url,
                data: '',
                dataType: "json",
                success: function (data) {
                    console.log(data);
                    if (data.code === '100100') {
                        that.formData.confirmer = data.data;
                    }
                },
                error: function () {
                    alert('服务器出错啦');
                }
            });
        },
        // 14 审批信息（根据单据编号查询审批信息）
        /*
		 * _ajaxqueryReceiptsById (_id) { var that = this; var _url =
		 * contextPath+'/specialReleaseDocument/queryReceiptsById?r=' + new
		 * Date().getTime(); // var _data = { 'receiptsId': 'TSFX000001' } var
		 * _data = { 'receiptsId': _id } $.ajax({ type: "post", url: _url, data:
		 * JSON.stringify(_data), dataType: "json", success: function (data) {
		 * console.log(data); if (data.code === '100100') { } }, error: function () {
		 * alert('服务器出错啦'); } }); },
		 */
        _pageInit (info) {
            jQuery("#queryReceiptsByIdlist").jqGrid(
                {
                    url: contextPath+'/specialReleaseDocument/queryReceiptsById',
                    postData: { "receiptsId": info },
                    datatype: "json",
                    colNames: ['操作类型', '开始级次', '目的级次', '审批人', '审批意见', '审批时间'],
                    colModel: [
                        {
                            name: 'approvalResult',
                            index: 'lotSize',
                            width: 120,
                            align: "center",
                            formatter: function (value, grid, rows, state) {
                                return value == 1 ? "审核" : "驳回";
                            }
                        },
                        {
                            name: 'currentLevel',
                            index: 'samplingRatio',
                            width: 120,
                            align: "center",
                            formatter: function (value, grid, rows, state) {
                                return value === 1 ? "一级审核" : value === 2 ?
                                    "二级审核" : value === 3 ? "三级审核" : value === 4 ?
                                        "四级审核" : value === 5 ? "五级审核" : value === 6 ?
                                            "六级审核" : "";
                            }
                        },
                        {
                            name: 'nextLevel',
                            index: 'acceptance',
                            width: 210,
                            align: "center",
                            formatter: function (value, grid, rows, state) {
                                return value === "1" ? "一级审核" : value === "2" ?
                                    "二级审核" : value === "3" ? "三级审核" : value === "4" ?
                                        "四级审核" : value === "5" ? "五级审核" : value === "6" ?
                                            "六级审核" : "结束";
                            }
                        },
                        { name: 'createName', index: 'rejected asc, invdate', width: 215, align: "center" },
                        { name: 'approvalInfo', index: 'rejected asc, invdate', width: 215, align: "center" },
                        { name: 'createTime', index: 'rejected asc, invdate', width: 215, align: "center" }
                    ],
                    rowNum: 999999999,// 一页显示多少条
                    mtype: "post",// 向后台请求数据的ajax的类型。可选post,get
                    jsonReader: {
                        root: "data",
                    },
                    multiselect: false,
                    multiselectWidth: 0,
                    styleUI: 'Bootstrap',
                    height: $(window).height() * 0.7,
                    viewrecords: true,
                    gridComplete(){
                        console.log(5555)
                    }

                }).trigger("reloadGrid");
        },
        // 生成特别放行单回调 输入源单单号时 调的接口
        _ajaxqueryTestDocumentBySourceCode (_id, _type) {
            var that = this;
            var _url = contextPath+'/testDocument/queryTestDocumentBySourceCode?r=' + new Date().getTime();
            var _data = { 'code': _id }
            $.ajax({
                type: "post",
                url: _url,
                data: _data,
                dataType: "json",
                success: function (data) {
                    console.log(data);
                    var _rs = data.data.data[0];
                    if (data.code === '100100') {
                        that.formData.documentType = _rs.sourceDocumentType;
                        that.formData.sourceDocumentCode = _rs.sourceDocumentCode;
                        that.formData.qcDocumentId = _rs.qcDocumentId;
                        that.formData.qcDocumentCode = _rs.documentCode;
                        that.formData.supplierCustomerCode = _rs.supplierOrCustomerCode;
                        that.formData.qcConclusion = _rs.totalTestConclusion;
                        that._ajaxInitEcho(that.formData.qcDocumentCode, _type);
                        
                    }
                },
                error: function () {
                    alert('服务器出错啦');
                }
            });
        },
        // 7 分页并且条件查询源单（质检列表）
        _ajaxlistByPage (_id) {
            var that = this;
            var _url = contextPath+'/documentController/list?r=' + new Date().getTime();
            var _data = {
                'alreadyTest': 1,
                'page': 1,
                'limit': 10
            }
            $.ajax({
                type: "post",
                url: _url,
                data: _data,
                dataType: "json",
                success: function (data) {
                    console.log(data);
                    if (data.code === '100100') {

                    }
                },
                error: function () {
                    alert('服务器出错啦');
                }
            });
        },
        // 8. 单据编号 生成接口 返回的是单据编号
        _ajaxgetFieldCode () {
            var that = this;
            var _url = contextPath+'/specialReleaseDocument/getFieldCode?r=' + new Date().getTime();
            $.ajax({
                type: "post",
                url: _url,
                dataType: "json",
                success: function (data) {
                    console.log(data);
                    if (data.code === '100100') {
                        that.formData.code = data.data['t_qc_special_release_document-code'];
                        that.$nextTick(() => {
                            that.formData.documentStatus = '暂存';
                        })
                    }
                },
                error: function () {
                    alert('服务器出错啦');
                }
            });
        },
        // 9. 单据状态 生成接口 返回的是单据状态列表
        _ajaxgetDocumentStatus () {
        
            var that = this;
            var _url = contextPath+'/specialReleaseDocument/getDocumentStatus?r=' + new Date().getTime();
            $.ajax({
                type: "post",
                url: _url,
                dataType: "json",
                success: function (data) {
                    console.log(data);
                    if (data.code === '100100') {
                        that.documentStatusList = data.data;
                    }
                },
                error: function () {
                    alert('服务器出错啦');
                }
            });
        },
        // 10 源单类型 生成接口 返回的是源单类型列表
        _ajaxgetDocumentType () {
            var that = this;
            var _url = contextPath+'/specialReleaseDocument/getDocumentType?r=' + new Date().getTime();
            $.ajax({
                type: "post",
                url: _url,
                dataType: "json",
                success: function (data) {
                    console.log(data);
                    if (data.code === '100100') {
                        that.getDocumentTypeList = data.data;
                        console.log(data.data)
                    }
                },
                error: function () {
                    alert('服务器出错啦');
                }
            });
        },
        // 12 申请人
        _ajaxqueryAllEmpByDeptId (_id) {

            var that = this;
            var _url = contextPath+'/specialReleaseDocument/queryAllEmpByDeptId?r=' + new Date().getTime();
            var _data = { 'deptId': _id }
            $.ajax({
                type: "post",
                url: _url,
                data: _data,
                dataType: "json",
                success: function (data) {
                    console.log(data);
                    if (data.code === '100100') {
                        that.queryAllEmpByDeptIdList = data.data;
                    }
                },
                error: function () {
                    alert('服务器出错啦');
                }
            });
        },
        // 部门树形
        _ajaxqueryalldept () {
            var that = this;
            var _url = contextPath+'/specialReleaseDocument/queryalldept?r=' + new Date().getTime();
            $.ajax({
                type: "post",
                url: _url,
                dataType: "json",
                success: function (data) {
                    console.log(data);
                    if (data.code === '100100') {
                        var _l = [];
                        data.data.forEach(element => {
                            var _i = {
                                'id': element.id,
                                'name': element.depName,
                                'pId': element.parentId,
                            }
                            _l.push(_i);
                        });
                        that.queryalldeptList = _l;
                        that.$nextTick(()=>{
                            that.$refs.department.loadData();
                        })
                    }
                },
                error: function () {
                    alert('服务器出错啦');
                }
            });
        },
        // 查源单是否存在
        isSourceDocument(type, _t) {
            var that = this;
            $.ajax({
                type: "post",
                url:  contextPath+'/specialReleaseDocument/isSourceDocument',
                async: false,
                data:{ 'sourceDocumentCode': that.formData.sourceDocumentCode,'code': that.formData.code },
                dataType: "json",
                success: function (data) {
                    if(data.code == '100100'){
                        if(type === 'submit'){
                            that.submit();
                        }else {
                            that.save(_t);
                        }
                    }else {
                    	alert(data.msg);
                    }

                },
                error: function () {
                	
                }
            });
        },
        // 点击保存
        save (_t) {
            var that = this;

            that.ishttpOK = true;
            var _url = contextPath+'/specialReleaseDocument/update?r=' + new Date().getTime();
            that.uDelete = that.uDelete.filter(function (item) {
                var _find = that.formDataInit.unqualifiedStyleVoList.filter(function (item2) {
                    return (item2.productStyleId === item);
                });
                return _find.length;
            });

            // that.formData.ids = that.uDelete;
            if(that.formData.unqualifiedStyleVoList==undefined){
            	that.formData.unqualifiedStyleVoList=[];
            }
	            let detailApplyReasonList1 = that.formData.unqualifiedStyleVoList;
	            for(var i=0; i<detailApplyReasonList1.length;i++){
	                if(detailApplyReasonList1[i] && detailApplyReasonList1[i].qualifiedPercent && detailApplyReasonList1[i].qualifiedPercent.toString().indexOf("%") != -1){
	                    detailApplyReasonList1[i].qualifiedPercent = parseInt(detailApplyReasonList1[i].qualifiedPercent.replace(/%/g,''));
	                    detailApplyReasonList1[i].qualifiedPercent = detailApplyReasonList1[i].qualifiedPercent/100;
	                }
	            }
           
            var _info = {
                'tQcSpecialReleaseDocumentEntity': that.formData,
                'ids': that.uDelete,
                'detailApplyReasonList1': detailApplyReasonList1,
                'btn': _t
            }
            _info.detailApplyReasonList1 = that.formData.unqualifiedStyleVoList.filter(function (item) {
                item.aReason = item.aReason || '';
                item.releaseCount = Number.parseInt(item.releaseCount) || 0;
                return item;
            });
            console.log(_info, '===_info');
            $.ajax({
                type: "post",
                url: _url,
                data: JSON.stringify(_info),
                async: false,
                // data: that.formData,
                contentType: 'application/json;charset=utf-8',
                dataType: "json",
                success: function (data) {
                    that.htHaveChange = false;
                    if (data.code === '100100') {
                        layer.alert("保存成功!");
                        that.formData.id = data.data.id;
                        that.formData.createName = "超级管理员";
                        that.formData.createTime = (new Date()).format("yyyy/MM/dd hh:mm:ss");
                        that.formData.code=data.data.code;

                        // 调用方法保存附件
                          that.saveAccess(data.data.id,that.boeType);
                         
                        // that.formData.updateName = data.data.updateName;
                        // that.formData.updateTime = data.data.updateTime;
                    }else {
                        that.$Modal.warning({
                            scrollable: true,
                            content: data.msg,
                        })
                    }
                    setTimeout(function () {
                        that.ishttpOK = false;
                    }, 1000)
                },
                error: function () {
                    setTimeout(function () {
                        that.ishttpOK = false;
                    }, 1000)
                    alert('服务器出错啦');
                }
            });
        },
        // 保存审核人
        saveEV (_t) {
            var that = this;
            if (that.ishttpOK == true&&_t!=2) return;
            that.ishttpOK = true;
            var _url = contextPath+'/specialReleaseDocument/update?r=' + new Date().getTime();
            that.uDelete = that.uDelete.filter(function (item) {
                var _find = that.formDataInit.unqualifiedStyleVoList.filter(function (item2) {
                    return (item2.productStyleId === item);
                });
                return _find.length;
            });
            var _info = {
                'tQcSpecialReleaseDocumentEntity': that.formData,
                'btn': _t
            }
            _info.detailApplyReasonList1 = that.formData.unqualifiedStyleVoList.filter(function (item) {
                item.aReason = item.aReason || '';
                item.releaseCount = Number.parseInt(item.releaseCount) || 0;
                return item;
            });
            console.log(_info, '===_info');
            $.ajax({
                type: "post",
                url: _url,
                data: JSON.stringify(_info),
                // data: that.formData,
                contentType: 'application/json;charset=utf-8',
                dataType: "json",
                success: function (data) {
                	  if (data.code === '100100') {
                          layer.alert("提交成功!");
                	  }else{
                		   layer.alert("提交失败!");
                	  }
                }
            });
        },
        // 点击退出(退出页面)
        cancal (close) {
            if (close === true) {
                window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
                return;
            }
            if (this.handlerClose()) {
                window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
            }
        },
        add () {
// var _info = {
// id: null, // 第一次点击保存 或者提交 传null
// code: '', // 单据编号
// documentTime: (new Date()).format("yyyy/MM/dd") || '', // 单据日期
// documentStatus: '暂存', // 单据状态
// departmentName: '', // 申请部门
// departmentId: 0, // 申请部门id
// applicantName: '', // 申请人name
// documentType: '', // 源单类型
// sourceDocumentCode: '', // 源单单号
// qcDocumentCode: '', // 检验单号
// supplierCustomerCode: '', // 供应商/客户
// qcConclusion: '', // 检验结论
// applyReason: '', // 申请原因
// confirmer: '', // 确认人
// riskEstimate: '', // 风险评估
// createName: '', // 创建人name
// createTime: '', // 创建时间
// updateName: '', // 修改人name
// updateTime: '', // 修改时间
// examineVerifyId: 0, // 审核人id
// examineVerifyName: '', // 审核人name
// examineVerifyDate: '', // 审核时间
// step: 1, // 单据流程_1、申请信息.2、风险评估.3、都不可编辑
// unqualifiedStyleVoList: [], // 待放行商品款式明细
// ids: [], // 删除的 待放行商品款式明细
// }
// this.formDataInit = Object.assign(_info);
// this.formData = Object.assign(_info);
// // this._ajaxgetFieldCode();
        	   // 跳转页面
        	 window.parent.closeCurrentTab({ 'name': "生成特别放行单", 'openTime': this.openTime, 'exit': true });
            window.parent.activeEvent({
                name: '新增特别放行单',
                url:contextPath+ '/quality/quality/specialReleaseDocumentInfo.html?type=2'
            });
        },
        submit () {
            var that = this;
            var _bool = false, _msg = '请填写必填项。';
            this.validate();
            if(!this.submitValidate){
                return ;
            }
            if (that.formData.documentTime === '') {
                _bool = true;
                _msg = '请选择单据日期';
            } else if (that.formData.departmentName === '') {
                _bool = true;
                _msg = '请选择申请部门';
            } else if (that.formData.applicantName === '') {
                _bool = true;
                _msg = '请选择申请人';
            } else if (that.formData.documentType === '') {
                _bool = true;
                _msg = '请选择源单类型';
            } else if (that.formData.sourceDocumentCode === '') {
                _bool = true;
                _msg = '请选择源单单号';
            } else if (that.formData.qcDocumentCode === '') {
                _bool = true;
                _msg = '请选择检验单号';
            } else if (that.formData.applyReason === '') {
                _bool = true;
                _msg = '请填写申请原因';
            }
            if (that.formData.documentStatus === '驳回' ||that.formData.documentStatus === '待审核' || that.formData.documentStatus === '审核中' || that.formData.documentStatus === '已审核') {
                _bool = true;
                _msg = '单据已进入审批流,不可再提交!';
            }

            if (_bool) {
                that.$Message.info({
                    content: _msg,
                    duration: 3
                });
                return;
            }

            var _url = contextPath+'/specialReleaseDocument/save?r=' + new Date().getTime();
            if (that.ishttpOK == true) return;
            that.ishttpOK = true;
            that.uDelete = that.uDelete.filter(function (item) {
                var _find = that.formDataInit.unqualifiedStyleVoList.filter(function (item2) {
                    return (item2.productStyleId === item);
                });
                return _find.length;
            });
            let detailApplyReasonList1 = that.formData.unqualifiedStyleVoList;
            for(var i=0; i<detailApplyReasonList1.length;i++){
                if(detailApplyReasonList1[i] && detailApplyReasonList1[i].qualifiedPercent && detailApplyReasonList1[i].qualifiedPercent.toString().indexOf("%") != -1){
                    detailApplyReasonList1[i].qualifiedPercent = parseInt(detailApplyReasonList1[i].qualifiedPercent.replace(/%/g,''));
                    detailApplyReasonList1[i].qualifiedPercent = detailApplyReasonList1[i].qualifiedPercent/100;
                }
            }
            var _info = {
                'tQcSpecialReleaseDocumentEntity': that.formData,
                'ids': that.uDelete,
                'detailApplyReasonList1': []
            }
            _info.detailApplyReasonList1 = that.formData.unqualifiedStyleVoList.filter(function (item) {
                item.aReason = item.aReason || '';
                item.releaseCount = Number.parseInt(item.releaseCount) || 0;
                return item;
            });
            $.ajax({
                type: "post",
                url: _url,
                data: JSON.stringify(_info),
                contentType: 'application/json;charset=utf-8',
                dataType: "json",
                success: function (data) {
                    that.htHaveChange = false;
                    if (data.code === '100100') {
                        layer.alert("提交成功!");
                        that.releaseDisable = true;
                        that.applicationReasonsDisabled = true;
                        that.riskEstimate = false; // 启用风险评估

                        that.formData.id = data.data.id;
                        that.formData.code = data.data.code;
                        that.formData.documentStatus = "待审核";
                        that.formData.createName = "超级管理员";
                        that.formData.createTime = (new Date()).format("yyyy/MM/dd hh:mm:ss");
                        that.formData.updateName = "超级管理员";
                        that.formData.updateTime = (new Date()).format("yyyy/MM/dd hh:mm:ss");
                        // that.formData.createName = data.data.createName;
                        // that.formData.createTime = data.data.createTime;
                        // that.formData.updateName = data.data.updateName;
                        // that.formData.updateTime = data.data.updateTime;
                        that.saveMethod(); // 修改单据状态
                        // 调用方法保存附件
                         that.saveAccess(data.data.id,that.boeType);
                         
                         that.isEdit("N");
                        that.initApproval(); // 根据单据编号查询审批流程信息
                        that._pageInit(data.data.code);       // 查审批信息
                    
                    }else {
                        layer.alert("该源单单号已存在对应的特别放行单，请重新选择!");
                    }
                    /*
					 * that.$Message.info({ //页面提示语 content: data.msg, duration:
					 * 3 });
					 */
                    setTimeout(function () {
                        that.ishttpOK = false;
                    }, 1000)
                },
                error: function () {
                    setTimeout(function () {
                        that.ishttpOK = false;
                    }, 1000)
                    alert('服务器出错啦');
                }
            });
        },
        showlist () {
            // 跳转到列表页面
            window.parent.activeEvent({ name: '特别放行单', url: contextPath+'/quality/quality/specialReleaseDocument.html' });
        },
        DeleteOneRow () {
            var that = this;
            that.formData.unqualifiedStyleVoList = that.formData.unqualifiedStyleVoList.filter(function (item) {
                var _find = that.uVoListSelectDelete.filter(function (item2) {
                    return (item2.productStyleId === item.productStyleId);
                });
                _find.length && that.uDelete.push(_find[0].productStyleId)
                return !_find.length;
            });

        },
        setColumns () {

        },
        // 显示 申请部门
        showDepartmentVisable () {

        },
        callBackInfo (_data) {
            var that = this;
            that.formData.sourceDocumentCode = _data;
            var that = this;
            var _url = contextPath+'/specialReleaseDocument/echo?r=' + new Date().getTime();
            $.ajax({
                type: "post",
                // url: './echo.json',
                url: _url,
                data: { 'sourceDocumentCode': _data },
                dataType: "json",
                success: function (data) {
                    if (data.code === '100100') {
                        let unqualifiedStyleVoList = data.data.unqualifiedStyleVoList;

                        that.formDataInit.unqualifiedStyleVoList =  [...data.data.unqualifiedStyleVoList]; // 初始化信息
                        data.data.unqualifiedStyleVoList.map(function(item, index){
                            if(!item.releaseCount){
                                item.releaseCount = item.unqualifiedAmount;
                            }
                        });

                        that.formData.unqualifiedStyleVoList = [...data.data.unqualifiedStyleVoList]; // 填充信息

                        that.formData.qcDocumentCode = data.data.qcDocumentCode;
                        that.formData.qcDocumentId= data.data.qcDocumentId
                        that.formData.supplierCustomerCode = data.data.supplierCustomerCode;
                        that.formData.qcConclusion = data.data.qcConclusion;
                    }
                },
                error: function () {
                    alert('服务器出错啦');
                }
            });
        },
        validate(){
            this.$refs['formValidate'].validate((valid) => {
                if (valid) {//验证通过
                    this.submitValidate = true;
                } else {
                    this.submitValidate = false;
                }
            })
        },
        departmentOk () {
            this.showDepartmentModal = false;
        },
        showDepartment () {
            this.showDepartmentModal = true;
        },
        // table 全选取消
        uVSelectChange (selection) {
            console.log(selection, '===selection');
            this.uVoListSelectDelete = selection;
        },

        // 单击树形节点,获取节点ID
        clickEvent (event, treeId, treeNode) {
            let selnode = this.$ztree.getSelectedNodes();
            console.log(selnode);
            this.treeNodeId = selnode[0].id;
            console.log(this.treeNodeId);
        },
        // 审批驳回
        approval (_type) {
            var that = this;
            if (_type === 1) {
                that.approval1 = true;
            } else {
                that.approval2 = true;
            }

        },
        closeApproval (_type) {
            var that = this;
            if (_type === 1) {
                that.approval1 = false;
            } else {
                that.approval2 = false;
            }
        },
        approvalAction (_type) {
            var that = this;
            var _t = 0, _x = '';
            if (_type === 1) {
                _t = 1;
                _x = that.approvalValue1;
            } else {
                console.log(that.approvalRadio, that.approvalRadio === '1', that.approvalRadio === 1, '===that.approvalRadio');
                _t = that.approvalRadio === '1' ? 0 : -1;
                _x = that.approvalValue2;
            }

            var _url = contextPath+'/ApprovalController/submitApproval?r=' + new Date().getTime();
            var _data = {
                'testDocumentId': that.formData.code,
                // 'testDocumentId': '100001',
                'userId': 8,
                'approvalResult': _t,  // 1：通过 ，0：驳回上一级，-1：驳回到申请人',
                'approvalInfo': _x,
                'boeId': that.formData.id,
            }

            $.ajax({
                type: "post",
                // url: './echo.json',
                url: _url,
                data: _data,
                dataType: "json",
                success: function (data) {
                    console.log(data);
                    if (data.code === '100100') {

                    }

                    that.$Message.info({
                        content: data.msg,
                        duration: 3
                    });
                    if (_type === 1) {
                        that.approval1 = false;
                    } else {
                        that.approval2 = false;
                    }
                },
                error: function () {
                    alert('服务器出错啦');
                    if (_type === 1) {
                        that.approval1 = false;
                    } else {
                        that.approval2 = false;
                    }
                }
            });
        },
        // 此处三个方法是附件组件 只需要直接copy即可
        // 附件是编辑还是查看 传入Y表示编辑，传入N表示查看
        isEdit:function (isEdit, on) {
            eventHub.$emit('isEdit', isEdit);
        },
        // 保存附件
        saveAccess: function (id,type, on) {
            eventHub.$emit('saveFile', id,type);
        },
       // 查找附件
        getAccess: function (id,type, on) {
            eventHub.$emit('queryFile', id,type);
        },
        handlerClose() {
            if ((!this.formData.orderStatus || this.formData.orderStatus == 1) && (this.htHaveChange || accessVm.htHaveChange)) {
                this.$nextTick(() => {
                    this.$refs.closeModalRef.showCloseModal();
                });

                return false;
            }

            return true;
        },
        closeModal(type) {
            if (type === 'yes') {//提交数据
                this.isSourceDocument('save',1);
                this.cancal(true);
            } else if (type === 'no') {//关闭页面
                this.cancal(true);
            }
        },
        htTestChange(){
            this.htHaveChange = true;
        }
    },

    watch: {
        /*
		 * "formData.code":function () { console.log(this.formData.code)
		 * if(this.formData.code){
		 * $("#queryReceiptsByIdlist").jqGrid('clearGridData');
		 * $("#queryReceiptsByIdlist").jqGrid('setGridParam',{postData:{"receiptsId":this.formData.code}}).trigger("reloadGrid"); } }
		 */
    },
    mounted () {
        this.openTime = window.parent.params && window.parent.params.openTime;
    },
    created: function () {
        // this.dataList = Object.assign({}, this.color)
        // ?type=3&id=1-修改,?ype=2 -新增,?type=1&code=1 生成特别放行单回调，及新增特别放行单时 输入源单单号时
		// 调的接口
        var that = this;
        var _id = getUrlParam('id');
        var _type = getUrlParam('type');
        var _code = getUrlParam('code');

        this._ajaxgetDocumentStatus();
        this._ajaxgetDocumentType();
        this._ajaxqueryalldept();
        // this._ajaxqueryAllEmpByDeptId();

        if (_type === '1') {
          // this._ajaxgetFieldCode();
        	that.formData.code="保存或提交时自动生成";
            this._ajaxqueryTestDocumentBySourceCode(_code, _type);
            // that.initApproval (); //查节点
            // that._pageInit(that.formData.code); //查审批信息
        } else if (_type === '2') {
        	that.formData.code="保存或提交时自动生成";
        	
          // this._ajaxgetFieldCode();
            // that.initApproval (); //查节点
            // that._pageInit(that.formData.code); //查审批信息
        	
        	this.isEdit("Y");
        } else if (_type === '3') {
            // _id && (that._ajaxInitEcho(_id),
			// that._ajaxqueryReceiptsById(_id))
        	
            _id && (that._ajaxInitEcho(_id, _type))
        }
        window.handlerClose = this.handlerClose;
    },
    computed: {
        applicationReasonsDisabled () {	// 基础模块是否可用
            return (this.formData.documentStatus === '已审核' || this.formData.documentStatus === '待审核' || this.formData.documentStatus === '审核中')
        },
        applicantNameDisable () {	// 申请人 是否可用
            if (this.formData.departmentName === '' || this.formData.departmentId === '') {
                return true;
            } else if (this.formData.documentStatus === '已审核' || this.formData.documentStatus === '待审核' || this.formData.documentStatus === '审核中') {
                return true;
            }
            return false;
        },
        // 风险评估 是否可用： 多行文本框录入，最终的审核人打开时，此栏位是可编辑状态，否则是不可编辑状态
        riskEstimateDisabled () {
            return (this.formData.documentStatus === '暂存' || this.formData.documentStatus === '驳回' || this.formData.documentStatus === '已审核')
        },
        documentStatusDisabled () {
            return (this.formData.documentStatus === '已审核' || this.formData.documentStatus === '待审核' || this.formData.documentStatus === '审核中')
        },
        approvalDisabled () {
            return (this.formData.documentStatus === '暂存' || this.formData.documentStatus === '驳回' || this.formData.documentStatus === '已审核')
        },
    }

})