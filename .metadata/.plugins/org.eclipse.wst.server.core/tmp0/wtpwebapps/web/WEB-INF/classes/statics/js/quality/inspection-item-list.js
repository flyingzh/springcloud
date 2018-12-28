var inspectionlistVm = new Vue({
    el: '#inspection-itemlist',
    data() {
        return {

            //页面加载时，默认显示所有类别的检验项目列表
            openTime:"",
            isSearchHide: true, //搜索栏
            isTabulationHide: true, // 列表
            isHide:true,
            //控制弹窗显示
            modalTrigger:false,
            modalType:'',
            //审批进度条
            stepList: [],
            approvalTableData:[],
            checkbox: [
            ],
            data:[],
            itemstatusList:[],
            inspectionItem:{
                id:0,
                code:'',
                name:'',
                idList:'',
                testItemStatus:''
            },
            inspectionItemInfo:{
                id:0,
                code:'',
                testItemStatus:''
            },
            dataModel:[],
            checkList: [],
            reload: false,
            //保存礼品所选下标
            checkPresent: [],
            isDxfx: false,
            isQtfx: false,
            isbet: false,
            upperLimitDisable: false,
            lowerLimitDisable: false,
            upperCommDiffDisable: false,
            lowerCommDiffDisable: false,
            productList: [{tableId:'',pid: '', name: '',selected:[], data: []}],
            /*stepData: [
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
            nextStep: '',*/
            statusMap:{
                tmp_save: "zc", await_check: "dsh", checking: "jyshz", auditing: "jyysh", reject: "bh"
            },
            canRejectWhenAudit: true
        }
    },
    methods: {

        approval(value) {
            let This = this;

            let $selected = this.getSelectedRows();

            if (!ht.util.hasValue($selected, "array")) {

                This.$Message.warning("请先选择一条记录!");
                return false;
            } else if ($selected.length > 1) {

                This.$Message.warning("只能选择一条记录!");
                return false;
            }

            This.inspectionItemInfo.id = $selected[0].id;
            This.inspectionItemInfo.code = $selected[0].code;
            This.inspectionItemInfo.testItemStatus = $selected[0].testItemStatus;

            This.modalType = 'approve';
            This.modalTrigger = !This.modalTrigger;
        },
        reject(value) {
            let This = this;

            let $selected = this.getSelectedRows();

            if (!ht.util.hasValue($selected, "array")) {

                This.$Message.warning("请先选择一条记录!");
                return false;
            } else if ($selected.length > 1) {

                This.$Message.warning("只能选择一条记录!");
                return false;
            }

            This.inspectionItemInfo.id = $selected[0].id;
            This.inspectionItemInfo.code = $selected[0].code;
            This.inspectionItemInfo.testItemStatus = $selected[0].testItemStatus;

            This.modalType = 'reject';
            This.modalTrigger = !This.modalTrigger;
        },
        //审核或者驳回回调
        approvalOrRejectCallBack(res){
            let _this = this;
            if(res.result.code == '100100'){
                _this.inspectionItemInfo.testItemStatus = parseInt(res.result.data);
                this.refresh();
            }
        },
        autoSubmitOrReject(){
            let _this = this;
            $.ajax({
                url: contextPath + '/testItemController/submitApproval?submitType=1',
                method:'post',
                contentType:'application/json;charset=utf-8',
                data:JSON.stringify({
                    receiptsId:_this.inspectionItemInfo.code,
                    approvalResult:(_this.modalType === 'reject'? 1 : 0),
                }),
                success:function (res) {
                    if(res.code === '100100'){
                        _this.inspectionItemInfo.testItemStatus = parseInt(res.data);
                    }else {
                        _this.$Modal.info({content:res.msg});
                    }
                    this.refresh();
                }
            });
        },

        hideSearch() {
            this.isHide=!this.isHide;
            this.isSearchHide = !this.isSearchHide;
            console.log(this.isTabulationHide);
            $(".chevron").css("top","")
        },
        hidTabulation() {
            this.isHide=!this.isHide;
            this.isTabulationHide = !this.isTabulationHide;
            if(!this.isTabulationHide){
                $(".chevron").css("top","97%")
            }else{
                $(".chevron").css("top","")
            }
        },
       
        //控制四个商品类型的显示隐藏
        productShow(val) {

            console.log(val);//打印出来的是一个数组
            let This = this;
            This.checkbox = val;
            console.log(This.checkbox);

        },

        //菜单栏方法
        //刷新
        refresh() {
           // this.reload = !this.reload;
            this.checkbox = [];
            this.inspectionItem = {};
            let $idList = this.getCheckedIds();
            let obj = {"idList":$idList};
            this.loadTestItemData(obj);
        },
        //新增
        addItem() {
            this.isEdit = true;
            window.parent.activeEvent({name: '新增检验项目', url: contextPath+'/quality/quality/inspection-item.html',params: {data:"zc",type:0}});
        },
        //复制
        copyData() {
            let $selected = this.getSelectedRows();

            if (!ht.util.hasValue($selected, "array")) {
                this.$Modal.info({
                    title:'提示信息',
                    content:'请先选择一条记录！'
                })
                // layer.alert("请先选择一条记录!");
                return false;
            } else if ($selected.length > 1) {
                this.$Modal.info({
                    title:'提示信息',
                    content:'只能选择一条记录！'
                })
                // layer.alert("只能选择一条记录!");
                return false;
            }

            window.parent.activeEvent({name: '新增检验项目', url: contextPath+'/quality/quality/inspection-item.html',params: {data:$selected[0].id,sysFileId:$selected[0].sysFileId,prop:"copy",type:0}});
        },
        //提交
        submit() {

            let This = this;

            let $selected = this.getSelectedRows();

            if (!ht.util.hasValue($selected, "array")) {
                this.$Modal.info({
                    title:'提示信息',
                    content:'请先选择一条记录！'
                })
                // layer.alert("请先选择一条记录!");
                return false;
            } else if ($selected.length > 1) {
                this.$Modal.info({
                    title:'提示信息',
                    content:'只能选择一条记录！'
                })
                // layer.alert("只能选择一条记录!");
                return false;
            }
            $.ajax({
                type: "POST",
                url: contextPath+"/testItemController/getTestItem",
                data: JSON.stringify({"id":$selected[0].id}),
                contentType: 'application/json',
                dataType: "json",
                success: function(data) {
                    if(data.data.name === "" || data.data.productId === 0 ||
                        data.data.bugRankId === 0 || data.data.analyseMethod === "" ||
                        data.data.qualityStandardStatus === "" || data.data.goalValue === "" ||
                        data.data.sampleType === ""){
                        // layer.alert("请输入必填项!");
                        This.$Modal.info({
                            title:'提示信息',
                            content:'请输入必填项！'
                        })
                        return false;
                    }
                    if($selected[0].testItemStatus !== "zc"){
                        // layer.alert("检验项目已提交!");
                        This.$Modal.info({
                            title:'提示信息',
                            content:'检验项目已提交！'
                        })
                        return false;
                    }

                    This.inspectionItem.id = $selected[0].id;
                    This.inspectionItem.testItemStatus = "dsh";
                    This.inspectionItem.code = $selected[0].code;
                    This.saveMethod();
                    // layer.alert("提交成功!");
                    This.$Modal.success({
                        title:'提示信息',
                        content:'提交成功！'
                    })
                }
            })
            //window.parent.activeEvent({name: '修改检验项目', url: 'quality/inspection-item.html',params: {data:$selected[0].id,type:1}});
        },
        //修改     
        modifyData() {


            let $selected = this.getSelectedRows();

            if (!ht.util.hasValue($selected, "array")) {
                this.$Modal.info({
                    title:'提示信息',
                    content:'请先选择一条记录！'
                })
                // layer.alert("请先选择一条记录!");
                return false;
            } else if ($selected.length > 1) {
                this.$Modal.info({
                    title:'提示信息',
                    content:'只能选择一条记录！'
                })
                // layer.alert("只能选择一条记录!");
                return false;
            }

            window.parent.activeEvent({name: '修改检验项目', url: contextPath+'/quality/quality/inspection-item.html',params: {id:$selected[0].id,sysFileId:$selected[0].sysFileId,data:$selected[0].id,prop:"bh",type:1}});
        },
        //删除
        deleteData() {

            let This = this;

            let $selected = this.getSelectedRows();

            if (!ht.util.hasValue($selected, "array")) {
                this.$Modal.warning({
                    title:'提示信息',
                    content:'请先选择一条记录！'
                })
                // layer.alert("请先选择一条记录!");
                return false;
            }

            $.ajax({
                type: "POST",
                url: contextPath+'/testItemController/deleteByOneOrBatch',
                data:JSON.stringify($selected),
                dataType: "json",
                contentType:'application/json; charset=utf-8',
                success: function (data) {
                    console.log(data.data);
                    if(data.code === "100100"){
                        console.log(data.data.delete.length);
                        if(!$.isEmptyObject(data.data)){

                            //删除失败
                            let noDeleteMsg = "单据";
                            if(data.data.notDelete.length === 0){
                                noDeleteMsg = "";
                            }else{
                                for (let i = 0; i < data.data.notDelete.length; i++) {
                                    noDeleteMsg += "["+data.data.notDelete[i].code+"]、"
                                }
                                noDeleteMsg = noDeleteMsg.substring(0,noDeleteMsg.length-1);
                                noDeleteMsg+="删除失败（单据已启用审批流，无法删除！）";
                            }

                            //删除成功
                            let deleteMsg = "单据";
                            if(data.data.delete.length === 0){
                                deleteMsg = "";
                            }else {
                                for (let i = 0; i < data.data.delete.length; i++) {
                                    deleteMsg += "["+data.data.delete[i].code+"]、"

                                }
                                deleteMsg = deleteMsg.substring(0,deleteMsg.length-1);
                                deleteMsg+="删除成功。";
                            }

                            let msg = noDeleteMsg+"<br>"+deleteMsg;
                            This.$Modal.info({
                                title:'提示信息',
                                content:msg
                            })
                            // layer.alert(msg);
                            This.refresh();
                        }

                        return false;
                    }
                    // layer.alert("删除失败");
                    This.$Modal.info({
                        title:'提示信息',
                        content:'删除失败!'
                    })
                    This.refresh();
                },
                error: function(err){
                    // layer.alert("服务器出错");
                    This.$Modal.info({
                        title:'提示信息',
                        content:'服务器出错，请稍后再试!'
                    })
                }
            })
        },
        getSelectedRows() {
            let This = this;
            let $selected = [];
            let selectRowArr=[];
            for (let i = 0; i < This.productList.length; i++) {
                if(!$.isEmptyObject(This.productList[i].selected)){
                    let $selectArr = This.productList[i].selected;
                    for (let j = 0; j < $selectArr.length; j++) {
                        let selectRow=$("#" + This.productList[i].tableId).jqGrid('getRowData',$selectArr[j]);
                        selectRowArr.push(selectRow);
                        $selected.push($selectArr[j]);
                    }
                }
            }

            console.log(selectRowArr);
            return selectRowArr;
        },
        /*//审核
        approval() {
            //发送请求
            let This = this;
            let $selected = this.getSelectedRows();

            if (!ht.util.hasValue($selected, "array")) {

                layer.alert("请先选择一条记录!");
                return false;
            } else if ($selected.length > 1) {

                layer.alert("只能选择一条记录!");
                return false;
            }
            if($selected[0].testItemStatus === "zc"){
                layer.alert("请提交检验项目!");
                return false;
            }
            console.log($selected[0].code);

            This.initApproval($selected[0].code);

            This.inspectionItem.code = $selected[0].code;
            This.inspectionItem.id = $selected[0].id;
            $.ajax({
                type: "POST",
                url: contextPath+"/testItemController/findUserOperation",
                contentType: 'application/json',
                data: JSON.stringify({receiptsId:$selected[0].code,docTypeCode:"dj5"}),
                dataType: "json",
                success: function(data) {
                    console.log(data);
                    if(data.code === "100515"){
                        layer.alert("审核成功");
                        This.inspectionItem.testItemStatus = "jyysh";
                        This.saveMethod();
                    }
                    if(data.code === "100514"){
                        let msg = data.data === 1 ? "【一级审核】":data.data === 2 ?
                            "【二级审核】":data.data === 3 ? "【三级审核】":data.data === 4 ?
                                "【四级审核】":data.data === 5 ? "【五级审核】":data.data === 6 ?
                                    "【六级审核】":data.msg;
                        layer.alert(data.data === 0 ? "该单据已被驳回到申请人，待申请人提交!":"您没有"+msg+"的审核权限");
                    }
                    if(data.code === "100100"){
                        if($selected[0].testItemStatus === "jyysh"){
                            layer.alert("检验项目已审核");
                            return false;
                        }
                        This.approveComment = true;
                    }
                    /!*if(data.code === "100516"){
                        layer.alert(data.msg);
                    }*!/
                },
                error: function(err){
                    layer.alert("服务器出错");
                }
            })
        },
        //驳回
        reject() {
            let This = this;
            let $selected = this.getSelectedRows();

            if (!ht.util.hasValue($selected, "array")) {

                layer.alert("请先选择一条记录!");
                return false;
            } else if ($selected.length > 1) {

                layer.alert("只能选择一条记录!");
                return false;
            }

            if($selected[0].testItemStatus === "zc"){
                layer.alert("请提交检验项目!");
                return false;
            }

            This.inspectionItem.id = $selected[0].id;

            //发送请求
            $.ajax({
                type: "POST",
                url: contextPath+"/testItemController/findUserOperation",
                contentType: 'application/json',
                data: JSON.stringify({receiptsId:$selected[0].code,docTypeCode:"dj5"}),
                dataType: "json",
                success: function(data) {
                    console.log(data);
                    if(data.code === "100100"){
                        This.initApproval($selected[0].code);
                        This.rejectComment = true;
                    }
                    if(data.code === "100514"){
                        let msg = data.data === 1 ? "【一级审核】":data.data === 2 ?
                            "【二级审核】":data.data === 3 ? "【三级审核】":data.data === 4 ?
                                "【四级审核】":data.data === 5 ? "【五级审核】":data.data === 6 ?
                                    "【六级审核】":data.msg;
                        layer.alert(data.data === 0 ? "该单据已被驳回到申请人，待申请人提交!":"您没有"+msg+"的驳回权限");
                    }
                    if(data.code === "100515"){
                        This.inspectionItem.testItemStatus = "zc";
                        layer.alert("驳回成功");

                        This.saveMethod();
                    }
                    /!*if(data.code === "100516"){
                        layer.alert(data.msg);
                    }*!/
                },
                error: function(err){
                    layer.alert("服务器出错");
                }
            })
        },
        //审批意见点击确定
        getApproveInfo() {

            let $selected = this.getSelectedRows();

            let This = this;
            This.approvement.receiptsId = $selected[0].code;
            This.inspectionItem.id = $selected[0].id;
            $.ajax({
                type: "POST",
                url: contextPath+"/testItemController/submitapproval",
                contentType: 'application/json',
                data: JSON.stringify(this.approvement),
                dataType: "json",
                success: function(data) {
                    console.log(data.data);
                    if(data.code === "100100") {
                        layer.alert("审核成功");
                        if(data.data.approvalStatus === 0){
                            This.inspectionItem.testItemStatus = "jyshz";
                        }
                        if(data.data.approvalStatus === 1){
                            This.inspectionItem.testItemStatus = "jyysh";
                        }
                        This.saveMethod();
                    }else {
                        layer.alert("审核失败");
                    }
                    This.approvement = {receiptsId:'',approvalResult:1,approvalInfo:''};
                    This.refresh();
                },
                error: function(err){
                    layer.alert("服务器出错");
                }
            })
        },
        //驳回点击确定
        getRejectInfo() {

            let $selected = this.getSelectedRows();

            let This = this;
            This.rejectement.receiptsId = $selected[0].code;
            $.ajax({
                type: "POST",
                url: contextPath+"/testItemController/submitapproval",
                contentType: 'application/json',
                data: JSON.stringify(This.rejectement),
                dataType: "json",
                success: function(data) {
                    console.log(data.data);
                    if(data.code === "100100") {
                        layer.alert("驳回成功");
                        This.inspectionItem.testItemStatus = "bh";
                        if(data.data.approvalStatus === -2){
                            This.inspectionItem.testItemStatus = "zc";
                        }
                        This.saveMethod();
                    }else {
                        layer.alert("驳回失败");
                    }
                    This.rejectement = {receiptsId:'',approvalResult:'0',approvalInfo:''};
                    This.refresh();
                },
                error: function(err){
                    layer.alert("服务器出错");
                }
            })
        },*/
        saveMethod(){
            let This = this;
            $.ajax({
                type: "POST",
                url: contextPath+"/testItemController/update",
                contentType: 'application/json',
                data: JSON.stringify(This.inspectionItem),
                dataType: "json",
                success: function(data) {
                    This.refresh();
                    //This.initApproval(This.inspectionItem.code);
                    console.log("修改成功");

                },
                error: function(err){
                    // layer.alert("服务器出错");
                    This.$Modal.info({
                        title:'提示信息',
                        content:'服务器出错，请稍后再试!'
                    })
                }
            })
        },
        /*initApproval(code){
            let This = this;
            $.ajax({
                type: "post",
                url: contextPath+'/testItemController/queryProcessByReceiptsId',
                data:{receiptsId:code},
                dataType: "json",
                success: function (data) {
                    if($.isEmptyObject(data.data)) {
                        console.log("没有流程");
                        return false;
                    }
                    var process = data.data.list;

                    if(process[1].currentLevel === data.data.levelLength){
                        for (let i = 0; i < process.length; i++) {
                            process[i].currentLevel = process.length - 1;
                        }
                        return false;
                    }
                    var curr = process[1].currentLevel;
                    for (let i = 0; i < This.stepData.length; i++) {
                        if (curr === This.stepData[i].currentLevel) {
                            This.currentStep = This.stepData[i+1].subtitle;
                            if(This.stepData[i+1].currentLevel === data.data.levelLength){
                                This.nextStep = This.stepData[This.stepData.length-1].subtitle;
                            } else{
                                This.nextStep = This.stepData[i+2].subtitle;
                            }

                        }
                    }

                },
                error: function () {
                    alert('服务器出错啦');
                }
            })
        },*/
        //设置列
        setColumn() {

        },
        //退出
        exit() {
            window.parent.closeCurrentTab({name:'检验项目',exit: true, openTime:this.openTime});
        },


        search() {
            let This = this;
            let $idList = "";
            console.log(This.checkbox);
            for (var i = 0; i < this.checkbox.length; i++) {
                $idList += this.checkbox[i] + ",";
            }

            $idList = $idList.substring(0,$idList.length-1);
            This.inspectionItem.idList = $idList;

            this.loadTestItemData(This.inspectionItem);

        },
        loadTestItemData(obj){
            let This = this;
            //This.productList.length = 0;
            $.ajax({
                type: "post",
                url: contextPath+'/testItemController/list',
                data:obj,
                dataType: "json",
                success: function (res) {
                    if($.isEmptyObject(res.data)){
                        // layer.alert("搜索结果：无数据");
                        This.$Modal.info({
                            title:'提示信息',
                            content:'搜索结果：无数据!'
                        })
                    }
                    This.productList = [];
                    for (var i = 0; i < This.checkList.length; i++) {
                        for (let attr in res.data){

                            if(('tab' + This.checkList[i].pid) === attr){
                                let obj = Object.assign({},{tableId:'testItem'+i,data: res.data[attr],name: This.checkList[i].name,pid: This.checkList[i].pid});
                                This.productList.push(obj);
                                 console.log(This.productList);
                            }
                        }
                    }


                },
                error: function () {
                    // layer.alert('服务器出错啦');
                    This.$Modal.info({
                        title:'提示信息',
                        content:'服务器出错，请稍后再试!'
                    })
                }
            })
        },
        clear() {
            this.refresh();
        },
        // 
        //加载检验项目页面所有商品类别,并默认全选
        loadProductType() {
            let This = this;
            $.ajax({
                type: "post",
                url: contextPath+'/testItemController/getProcessType',
                data:{"parentId":1,"isDel":1},
                dataType: "json",
                success: function (data) {
                    let res = data.data;
                    This.productList.length = 0
                    This.checkList = [];
                    for (var i = 0; i < res.length; i++) {
                       This.checkList.push({
                           name: res[i].name,
                           pid: res[i].id
                       });
                    }

                },
                error: function () {
                    // layer.alert('服务器出错啦');
                    This.$Modal.info({
                        title:'提示信息',
                        content:'服务器出错，请稍后再试!'
                    })
                }
            })
        },
        getCheckedIds(){
            let This = this;
            let $idList = "";
            for (var i = 0; i < This.checkList.length; i++) {

                $idList += This.checkList[i].pid + ",";
            }
            $idList = $idList.substring(0,$idList.length-1);

            return $idList;
        }
    },
    mounted() {

        this.openTime = window.parent.params.openTime;

        //请求商品类型数据
        this.loadProductType();

        let $idList = this.getCheckedIds();
        let obj = {"idList":$idList};
        this.loadTestItemData(obj);

        //this.refresh();
        //请求检验项目列表
        //this.loadInspectionItemDetail();

        //检验项目状态
        this.itemstatusList = getCodeList("root_zj_jyxm_jyxmzt");

        /*$.ajax({
            type: "GET",
            url: contextPath+"/testItemController/getChildNodesByMark?mark=root_zj_jyxm_jyxmzt",
            contentType: 'application/json',
            dataType: "json",
            success: function(data) {
                inspectionlistVm.itemstatusList = data.data;
            },
            error: function(err){
                layer.alert("服务器出错");
            }
        })*/
    },


})