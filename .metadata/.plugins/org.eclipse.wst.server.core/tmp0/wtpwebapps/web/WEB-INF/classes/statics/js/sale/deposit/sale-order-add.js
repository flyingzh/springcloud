let vm = new Vue({
    el: '#sale-settlement',
    data() {
        return {
            htHaveChange : false,
            //表单验证
            ruleValidate:{
                depositDate: [
                    { required: true}
                ],
                payWay: [
                    { required: true,type: 'array'}
                ],
                totalReceDepositAmount: [
                    { required: true}
                ],
                // customerName: [
                //     { required: true}
                // ],
                totalPaidDepositAmount: [
                    { required: true}
                ]
            },
            //地址
            area:{},
            //所选的客户对象
            selectCustomerObj:null,
            areaInit: {
                isInit: false,
                province: '',
                city: '',
                county: '',
                detail: '',
                disabled: true
            },
            openTime: "",
            model10: [],
            list: [],
            viewShow: false,
            //审批信息显示隐藏
            flag: 0,
            info: "",
            customer: {
                name:"",
                Num:""
            },
            //控制客户按钮是否可以点击
            temp: true,
            //客户弹窗
            isShow: false,
            //订单弹窗
            orderShow: false,
            checked: [],
            isDisable: true,
            approveComment: "",
            isSearchHide: true,
            //审批
            modalTrigger: false,
            modalType: '',
            //审批进度条
            steplist: [],
            approvalTableData: [],
            isTabulationHide: true,
            documentNo: '',
            documentStatus: '',
            createTime:'',
            //基本信息表
            saleDeposit: {
                id: "",
                depositNo: "",
                saleOrderNo: "",
                organizationId: "",
                organizationName: "",
                customerId: "",
                customerNo: "",
                customerName:"",
                totalReceDepositAmount: 0,
                totalPaidDepositAmount: 0,
                payWay: [],
                status: 1,
                remark: "",
                del: "",
                createId: "",
                createName: "",
                createTime: "",
                depositDate:"",
                updateId: "",
                updateName: "",
                dateTime: "",
                auditId: "",
                auditName: "",
                auditTime: ""
            },
            payList: [
                {
                    value: '转账',
                    label: '转账'
                },
                {
                    value: '微信',
                    label: '微信'
                },
                {
                    value: '支付宝',
                    label: '支付宝'
                },
               /* {
                    value: '料结',
                    label: '料结'
                },*/
                {
                    value: '现金',
                    label: '现金'
                }
            ],
            //明细信息表
            saleDepositDetailList: [],
            //客户信息
            saleCustInfo: {
                custNo: "",
                detail: "",
                documentNo: "",
                documentType: "",
                email: "",
                id: "",
                name: "",
                organizationId: "",
                phone: "",
                area: "",  //区域编码
                province: "", //省份编码
                city: "",//城市编码
                county: "",//区级编码
                weChatNo: "",
                zipCode: ""
            },
            //新增信息
            addlist: {
                custOrderNo: "",//订单编号
              /*  incomeAmount: "",//来料金额*/
                paidDepositAmount: "",//实收定金
                receDepositAmount: "",//应收定金
                orderAmount: "",//订单金额
                alreadyReceivedDepaosit:"",//已收定金
                depaositFinishStatus:""//定金完成确认
            },
            //删除下标
            delIndex: "",
            //客户表名
            tabId: "customerTab",
            reload: true,
            selected: [],
            //客户列表
            data_user_list: {
                //列表页数据
                url: contextPath + '/deposit/findCustomerCode',
                colNames: ["操作","客户名称", "客户编码"],
                colModel:
                    [
                        {
                            name: 'id',
                            index: 'invdate',
                            width: 80,
                            align: "center",
                            formatter: function (value, grid, rows, state) {
                                $(document).off("click", ".select" + rows.id).on("click", ".select" + rows.id, function () {
                                    vm.confirm(value, grid, rows, state)
                                });
                                let btns = `<a type="primary" class="select${rows.id}">选取</a>`;
                                return btns
                            }
                        },
                        {name: "name", index: "name", width: 300, align: "center"},
                        {name: "code", index: "code", width: 300, align: "center"}
                    ],
                multiselect: false,
            },
            //订单列表
            data_order_list: {
                //列表页数据
                url: contextPath + '/deposit/findSaleCustOrderVoPage',
                colNames: ["单据编号", "日期", "业务状态", "客户",'客户编码', "订单金额", "应收定金","实收定金", "序号"],
                colModel:
                    [
                        {name: "orderNo", index: "orderNo", width: 280, align: "center"},
                        {name: "createTime", index: "createTime", width: 130, align: "center"},
                        {name: "businessStatus", index: "businessStatus", width: 130, align: "center",
                            formatter: function (value, grid, rows, state) {
                                if (value == 10) {
                                    return "待收定金";
                                }
                            }},
                        {name: 'custName', index: 'custName', width: 220, align: "center"},
                        {name: 'custNo', index: 'custNo', width: 220, align: "center",hidden:true},
                        {name: "totalRealSaleAmount", index: "totalRealSaleAmount", width: 130, align: "center",
                            formatter: function (value, grid, rows, state) {
                                if(value!=null){
                                    return value.toFixed(2);
                                }else {
                                    var a=0;
                                    return a.toFixed(2);
                                }
                            }},
                        {name: "receviableDeposit", index: "receviableDeposit", width: 130, align: "center",
                            formatter: function (value, grid, rows, state) {
                                if(value!=null){
                                    return value.toFixed(2);
                                }else {
                                    var a=0;
                                    return a.toFixed(2);
                                }
                            }},
                        {name:"paidDeposit",index:"paidDeposit",width:200,align:"center",
                            formatter: function (value, grid, rows, state) {
                                if(value!=null){
                                    return value.toFixed(2);
                                }else {
                                    var a=0;
                                    return a.toFixed(2);
                                }
                            }},
                        {name: "id", index: "id", width: 130, align: "center", hidden: "true"},
                    ],
            },
            orderReload: true,
            orderId: "orderId",
            orderSelected: [],
            //点击返回
            returnOrder: 0,
            //点击次数
            returnClick: 0,
            //常量信息
            Constant: {
                //单据类型-销售定金单
                docType: 'S_DEPOSIT'
            }
        }
    },
    created() {

    },
    methods: {
        clearNum(item,type,floor){
            return htInputNumber(item,type,floor)
        },
        isEdit: function (isEdit, on) {
            eventHub.$emit('isEdit', isEdit);
        },
        // 保存附件 保存的时候调用
        saveAccess: function (id, type, on) {
            eventHub.$emit('saveFile', id, type);
        },
        // 查找附件 查看的时候调用
        getAccess: function (id, type, on) {
            eventHub.$emit('queryFile', id, type);
        },
        closeCustomer() {
            if(this.selectCustomerObj){
                this.saleDeposit.customerId = this.selectCustomerObj.id;
                this.saleDeposit.customerName = this.selectCustomerObj.name;
                this.saleDeposit.customerNo = this.selectCustomerObj.code;

                console.log(this.saleDeposit.customerName)
            }

            //this.showCustomer = false;
        },

        /** 点击客户订单编号跳转至客户订单详情页*/
        goToCustOrder(custOrderNo) {
            if (custOrderNo != null) {
                window.parent.activeEvent({
                    name: '客户订单',
                    url: contextPath + '/sale/customer-order/customer-order-add.html',
                    params: {type: 'view', saleOrderNo:custOrderNo}
                });
            }
        },

        //退出弹框
        exitModal(){
            this.orderShow = false
        },
        //实收定金
        act(index) {
            var sum = 0;
            for (var i = 0; i < this.saleDepositDetailList.length; i++) {
                if(this.saleDepositDetailList[i].paidDepositAmount == undefined){
                    this.saleDepositDetailList[i].paidDepositAmount = 0

                }
                sum += Number(this.saleDepositDetailList[i].paidDepositAmount)
            }
            this.saleDeposit.totalPaidDepositAmount = sum.toFixed(2);
        },
        //计算应收总定金
        encomeMoney() {
            var sum = 0
            for (var i = 0; i < this.saleDepositDetailList.length; i++) {
                sum += Number(this.saleDepositDetailList[i].receDepositAmount)
            }

            this.saleDeposit.totalReceDepositAmount = sum.toFixed(2);
        },
        //保存订单信息
        saveinfo(re) {
            let This = this;
            let temp = true;
            let isCustomerPass = false;
            if(re==1){

                console.log(This.saleDeposit.payWay)
                this.$refs.formValidate.validate((valid) => {
                    if (valid == false) {
                        temp = false;
                    }
                })
                isCustomerPass = this.$refs.customerRef.submit();

                if(!temp || !isCustomerPass){
                    return;
                }
            }
            console.log("1111")

            //判断是否填写数据
            if(this.saleDepositDetailList.length<1){
                this.$Modal.warning({
                    title:"提示",
                    content:"请填写明细信息"
                })
                return;
            }


            //将空白行去掉
            this.saleDepositDetailList.map((item,index)=>{
                if(item.custOrderNo == ""){
                    this.saleDepositDetailList.splice(index,1)
                }
            })

            var obj = {
                saleDeposit: this.saleDeposit,
                saleDepositDetailList: this.saleDepositDetailList,
                saleCustInfo: this.saleCustInfo,
                showflag: "",
                saveOrSubmit: re
            };
            if (this.saleDeposit.status != "1" && re == 1) {
                this.$Modal.warning({
                    title: "提示",
                    content: "非暂存状态不允许提交!"
                });
                return false;
            }
            if (re == 0) {
                if (this.saleDeposit.payWay != null) {
                    this.saleDeposit.payWay = this.saleDeposit.payWay.toString();
                }
                $.ajax({
                    type: 'post',
                    async: false,
                    traditional: true,
                    dataType: 'json',
                    contentType: "application/json;charset=utf-8",
                    data: JSON.stringify(obj),
                    url: contextPath + '/deposit/save',
                    success: function (d) {
                        if(d.code== "-1"){
                            if(This.saleDeposit.payWay!=null || This.saleDeposit.payWay!=""){
                                //将支付方式转为数组
                                if(This.saleDeposit.payWay.indexOf(",") == -1){
                                    let arr = [];
                                    arr.push(""+This.saleDeposit.payWay);
                                    This.saleDeposit.payWay = arr;
                                }else{
                                    This.saleDeposit.payWay = This.saleDeposit.payWay.split(",")
                                }
                            }
                            This.$Modal.warning({
                                title: "提示",
                                content:"系统有误，请联系相关技术人员"
                            })
                            return;
                        }
                        if(d.code== "-2"){
                            if(This.saleDeposit.payWay!=null || This.saleDeposit.payWay!=""){
                                //将支付方式转为数组
                                if(This.saleDeposit.payWay.indexOf(",") == -1){
                                    let arr = [];
                                    arr.push(""+This.saleDeposit.payWay);
                                    This.saleDeposit.payWay = arr;
                                }else{
                                    This.saleDeposit.payWay = This.saleDeposit.payWay.split(",")
                                }
                            }
                            This.$Modal.warning({
                                title: "提示",
                                content:d.msg
                            })
                            return;
                        }
                        if (d.code == "100100"){
                            if(d.data.saleDeposit){
                                This.saleDeposit = d.data.saleDeposit;
                            }
                            if( d.data.saleDepositDetailList){
                                This.saleDepositDetailList = d.data.saleDepositDetailList;
                            }
                            if(This.saleDeposit.payWay!=null || This.saleDeposit.payWay!=""){
                                //将支付方式转为数组
                                if(This.saleDeposit.payWay.indexOf(",") == -1){
                                    let arr = [];
                                    arr.push(""+This.saleDeposit.payWay);
                                    This.saleDeposit.payWay = arr;
                                }else{
                                    This.saleDeposit.payWay = This.saleDeposit.payWay.split(",")
                                }
                            }
                            if (!$.isEmptyObject(This.saleDeposit.depositNo)) {
                                This.saveAccess(This.saleDeposit.depositNo, This.Constant.docType);
                            }
                            This.$Modal.success({
                                title: "提示",
                                content:"保存成功"
                            })
                            This.htHaveChange = false;
                        }
                        if (d.data.code == "-1") {
                            This.$Modal.warning({
                                title: "提示",
                                content: "系统出错，请联系相关技术人员"
                            })
                        }
                    },
                    error: function (e) {
                        console.log(e);
                    }
                });
            } else if (re == 1) {

                //判断是否填写明细数据
                if(this.saleDepositDetailList.length<1){
                    This.$Modal.warning({
                        title: "提示",
                        content:"请填写明细信息"
                    })
                    return;
                }
                //判断是否填写数据
                for(var i = 0;i<this.saleDepositDetailList.length;i++){
                    if (this.saleDepositDetailList[i].paidDepositAmount == "" || this.saleDepositDetailList[i].paidDepositAmount == null) {
                        this.$Modal.warning({
                            title: "提示信息",
                            content: `第${i + 1}行实收定金没填`
                        })
                        return false;
                    }
                    if (this.saleDepositDetailList[i].depaositFinishStatus == "" || this.saleDepositDetailList[i].depaositFinishStatus == null) {
                        this.$Modal.warning({
                            title: "提示信息",
                            content: `第${i + 1}行定金完成确认没填`
                        })
                        return false;
                    }
                }

                if (this.saleDeposit.payWay != null) {
                    this.saleDeposit.payWay = this.saleDeposit.payWay.toString();
                }

                console.log(this.saleDeposit.payWay)
                $.ajax({
                    type: 'post',
                    async: false,
                    dataType: 'json',
                    contentType: "application/json;charset=utf-8",
                    data: JSON.stringify(obj),
                    url: contextPath + '/deposit/saveSubmit',
                    success: function (d) {
                        if (d.code == "100100") {
                            if(d.data.saleDeposit){
                                This.saleDeposit = d.data.saleDeposit;
                            }
                            if( d.data.saleDepositDetailList){
                                This.saleDepositDetailList = d.data.saleDepositDetailList;
                            }
                            This.$Modal.success({
                                title: "提示",
                                content: "提交成功！"
                            })
                            This.htHaveChange = false;
                            if(This.saleDeposit.payWay!=null || This.saleDeposit.payWay!=""){
                                //将支付方式转为数组
                                if(This.saleDeposit.payWay.indexOf(",") == -1){
                                    let arr = [];
                                    arr.push(""+This.saleDeposit.payWay);
                                    This.saleDeposit.payWay = arr;
                                }else{
                                    This.saleDeposit.payWay = This.saleDeposit.payWay.split(",")
                                }
                            }
                            //将数据不可改
                            if(This.saleDeposit.status !=1){
                                //锁定
                                This.viewShow = true
                            }

                            //保存附件
                            if (!$.isEmptyObject(This.saleDeposit.depositNo)) {
                                This.saveAccess(This.saleDeposit.depositNo, This.Constant.docType);
                            }
                            //查找附件
                            This.isEdit(This.saleDeposit.status == 1 ? 'Y' : 'N');
                        } else if (d.code == "100101") {

                            if(This.saleDeposit.payWay!=null || This.saleDeposit.payWay!=""){
                                //将支付方式转为数组
                                if(This.saleDeposit.payWay.indexOf(",") == -1){
                                    let arr = [];
                                    arr.push(""+This.saleDeposit.payWay);
                                    This.saleDeposit.payWay = arr;
                                }else{
                                    This.saleDeposit.payWay = This.saleDeposit.payWay.split(",")
                                }
                            }
                            if(d.data.CustomerNo!= null){
                                This.$Modal.warning({
                                    title: "提示",
                                    content:d.data.CustomerNo
                                })
                                return;
                            }
                            if (d.data.PayWay != null) {
                                This.$Modal.warning({
                                    title: "提示",
                                    content:d.data.PayWay
                                })
                                return;
                            }
                            if (d.data.DepositDate != null) {
                                This.$Modal.warning({
                                    title: "提示",
                                    content:d.data.DepositDate
                                })
                                return;
                            }
                            if (d.data.DepaositFinishStatus != null) {
                                This.$Modal.warning({
                                    title: "提示",
                                    content:d.data.DepaositFinishStatus
                                })
                                return;
                            }
                            if (d.data.CompareTo != null) {
                                This.$Modal.warning({
                                    title: "提示",
                                    content:d.data.CompareTo
                                })
                                return;
                            }
                            if (d.data.TotalPaidDepositAmount != null) {
                                This.$Modal.warning({
                                    title: "提示",
                                    content:d.data.TotalPaidDepositAmount
                                })
                                return;
                            }
                        }else  if(d.code == "-1"){
                            if(This.saleDeposit.payWay!=null || This.saleDeposit.payWay!=""){
                                //将支付方式转为数组
                                if(This.saleDeposit.payWay.indexOf(",") == -1){
                                    let arr = [];
                                    arr.push(""+This.saleDeposit.payWay);
                                    This.saleDeposit.payWay = arr;
                                }else{
                                    This.saleDeposit.payWay = This.saleDeposit.payWay.split(",")
                                }
                            }
                            This.$Modal.warning({
                                title: "提示",
                                content:"提交失败，提交审批申请失败"
                            })
                            return;
                        }
                        if (d.code == "-2") {
                            if(This.saleDeposit.payWay!=null || This.saleDeposit.payWay!=""){
                                //将支付方式转为数组
                                if(This.saleDeposit.payWay.indexOf(",") == -1){
                                    let arr = [];
                                    arr.push(""+This.saleDeposit.payWay);
                                    This.saleDeposit.payWay = arr;
                                }else{
                                    This.saleDeposit.payWay = This.saleDeposit.payWay.split(",")
                                }
                            }
                            This.$Modal.warning({
                                title: "提示",
                                content: d.msg
                            })
                            return;
                        }
                    },
                    error: function (e) {
                        console.log(e);
                    }
                });
            }
        },

        OrderList() {
            window.parent.activeEvent({
                name: '定金列表',
                url: contextPath + '/sale/deposit/sale-order-list.html',
                params: {allInfo: null, type: 'query'}
            });
        },


        //点击客户按钮
        userInfo(){
            this.isShow = true

        },

        //新增行
        addRow() {
            //判断是否选择客户
            if (this.saleDeposit.customerName === ""){
                this.$Modal.warning({
                    title: "提示",
                    content: "请选择客户"
                })
            }else if(this.saleDepositDetailList.length>0&&this.saleDepositDetailList[this.saleDepositDetailList.length-1].custOrderNo === ""){
                this.$Modal.warning({
                    title: "提示",
                    content: "不能连续新增空数据"
                })
            }
            else{
                this.saleDepositDetailList.push(this.addlist)
            }
        },
        //删除行
        delRow() {
            if (this.delIndex === "") {
                this.$Modal.warning({
                    title: "提示",
                    content:"请选择需要删除行"
                })
            } else {
                this.saleDepositDetailList.splice(this.delIndex, 1)

                //给相对应的tr去除背景颜色
                $(".tdInfo").eq(this.delIndex).removeClass("tr-back")
                this.delIndex = ""

                //计算金额
                var sum = 0;
                for (var i = 0; i < this.saleDepositDetailList.length; i++) {
                    sum += Number(this.saleDepositDetailList[i].paidDepositAmount)
                }
                this.saleDeposit.totalPaidDepositAmount = sum.toFixed(2);
                this.htHaveChange = true;
                this.encomeMoney()
            }
        },
        //获取点击下标
        getIndex(index) {

            if (this.delIndex != index || this.delIndex === "") {
                this.delIndex = index

                //给相对应的tr添加背景颜色
                $(".tdInfo").eq(this.delIndex).addClass("tr-back").siblings().removeClass("tr-back")
            } else {
                //给相对应的tr去除背景颜色
                $(".tdInfo").eq(this.delIndex).removeClass("tr-back")

                this.delIndex = ""
            }

        },
        //获取客户点击信息
        confirm(value, grid, rows, state){

            //获取到客户名称 以及客户编码
            var tabObj = rows
            //获取到了客户编码
            this.saleDeposit.customerNo = tabObj.code
            this.saleDeposit.customerName = tabObj.name
            this.saleDeposit.customerId = tabObj.id
            this.isShow = false;
            this.reload = !this.reload

        },
        getGoodsList() {
            //判断是否选取客户
            if (this.saleDeposit.customerName) {
                //显示订单弹窗
                this.orderShow = true
                //根据订单单号请求数据
                let config = {
                    postData: {
                        //客户编码
                        searchCustNo: this.saleDeposit.customerNo
                    }
                }

                $("#" + this.orderId).jqGrid('setGridParam', config).trigger("reloadGrid");
            } else {
                this.$Modal.warning({
                    title: "提示",
                    content: "请先选择客户"
                })
            }

        },
        /**   let allInfo =[];
         *   数组第一位存放flag判断是从哪里进入并由此区分参数内容
         *   1、代表从待收列表进入 - 携带参数包含客户编码以及客户订单号数组 flag=1
         *   2、点击定金单据单号进入 - 携带参数包含单据id，flag=2只能查看，不能修改
         *   3、选择某条数据点击修改按钮进入 - 携带参数包含单据id  flag=3 能修改
         *   4、点击定金列表的新增按钮进入  -  携带 参数包含 flag=4 */

        view(parentParams) {
            let This = this;
            //从待收列表进入 客户按钮不可点击
            if (parentParams != null && parentParams.allInfo[0] == 1) {
                this.temp = false
                $.ajax({
                    type: 'post',
                    traditional: true,
                    data: {saleOrderNos: parentParams.allInfo[4], custNo: parentParams.allInfo[1]},
                    url: contextPath + '/deposit/view',
                    dataType: 'json',
                    success: function (d) {
                        console.log(d)
                        if (d.code == "100100") {
                            if(d.data.saleCustInfo){
                                This.saleCustInfo = d.data.saleCustInfo;
                            }
                            console.log(parentParams)
                            This.saleDepositDetailList = d.data.saleDepositDetailList;
                            This.saleDeposit.customerNo=parentParams.allInfo[1];
                            This.saleDeposit.customerName=parentParams.allInfo[2];
                            This.saleDeposit.customerId=parentParams.allInfo[3];
                            This.saleDeposit.depositDate=new Date();

                            if(d.data.saleCustInfo){
                                This.areaInit = {
                                    isInit: true,
                                    province: d.data.saleCustInfo.province || '',
                                    city: d.data.saleCustInfo.city || '',
                                    county: d.data.saleCustInfo.county,
                                    detail: d.data.saleCustInfo.detail,
                                    disabled:true
                                }
                            }

                            var sum = 0;
                            var sum1 =0;
                            This.saleDepositDetailList.forEach(function(value,i){
                                sum += Number(value.receDepositAmount)
                                sum1 += Number(value.paidDepositAmount)
                            })
                            This.saleDeposit.totalReceDepositAmount = sum.toFixed(2);
                            This.saleDeposit.totalPaidDepositAmount = sum1.toFixed(2);

                            if(This.saleDeposit.createTime!=null || This.saleDeposit.createTime!=""){
                                This.createTime = This.saleDeposit.createTime
                            }


                            //附件可上传
                            This.isEdit('Y');
                            if (!$.isEmptyObject(This.saleDeposit.depositNo) && This.saleDeposit.depositNo != undefined) {
                                This.getAccess(This.saleDeposit.depositNo, This.Constant.docType);
                            }

                            This.$refs.customerRef.loadCustomerList(parentParams.allInfo[2],parentParams.allInfo[3]);
                        }
                    },
                    error: function (e) {
                        console.log(e);
                    }
                });
            }

            //定金单列表点击单号进入
            if (parentParams != null && parentParams.allInfo[0] == 2) {

                //判断是否为暂存状态 --------- 1
                let num = parentParams.allInfo[2]
                console.log(num)
                if(num ==1){
                    This.viewShow = false

                    //附件可上传
                    This.isEdit('Y');
                }else{
                    //显示为不可修改
                    This.viewShow = true
                    This.isEdit('N');
                }

                $.ajax({
                    type: 'post',
                    async: true,
                    traditional: true,
                    data: {id: parentParams.allInfo[1]},
                    url: contextPath + '/deposit/view',
                    dataType: 'json',
                    success: function (d) {
                        if(d.data != null){
                            This.saleDeposit = d.data.saleDeposit;
                            if(d.data.saleCustInfo){
                                This.saleCustInfo = d.data.saleCustInfo;
                            }
                            This.saleDepositDetailList = d.data.saleDepositDetailList;
                            if(d.data.saleCustInfo){
                                This.areaInit = {
                                    isInit: true,
                                    province: d.data.saleCustInfo.province || '',
                                    city: d.data.saleCustInfo.city || '',
                                    county: d.data.saleCustInfo.county,
                                    detail: d.data.saleCustInfo.detail,
                                    disabled:true
                                }
                            }

                            var a = 0;
                            This.saleDepositDetailList.forEach(function(value,i){

                                if(This.saleDepositDetailList[i].orderAmount!=null){
                                    This.saleDepositDetailList[i].orderAmount=This.saleDepositDetailList[i].orderAmount.toFixed(2)
                                }else {
                                    This.saleDepositDetailList[i].orderAmount=a.toFixed(2)
                                }
                                if(This.saleDepositDetailList[i].paidDepositAmount!=null){
                                    This.saleDepositDetailList[i].paidDepositAmount= This.saleDepositDetailList[i].paidDepositAmount.toFixed(2)
                                }else {
                                    This.saleDepositDetailList[i].paidDepositAmount=a.toFixed(2)
                                }
                                if(This.saleDepositDetailList[i].receDepositAmount!=null){
                                    This.saleDepositDetailList[i].receDepositAmount= This.saleDepositDetailList[i].receDepositAmount.toFixed(2)
                                }else {
                                    This.saleDepositDetailList[i].receDepositAmount=a.toFixed(2)
                                }
                            })
                            if(This.saleDeposit.createTime!=null || This.saleDeposit.createTime!=""){

                                This.createTime = This.saleDeposit.createTime
                            }

                            //将支付方式转为数组
                            // if(This.saleDeposit.payWay){
                            //     This.saleDeposit.payWay = This.saleDeposit.payWay.split(",")
                            // }
                            if(This.saleDeposit.payWay!=null || This.saleDeposit.payWay!=""){
                                //将支付方式转为数组
                                if(This.saleDeposit.payWay.indexOf(",") == -1){
                                    let arr = [];
                                    arr.push(""+This.saleDeposit.payWay);
                                    This.saleDeposit.payWay = arr;
                                }else{
                                    This.saleDeposit.payWay = This.saleDeposit.payWay.split(",")
                                }
                                setTimeout(()=>{
                                    This.htHaveChange = false;
                                },200)
                            }
                            This.getAccess(This.saleDeposit.depositNo, This.Constant.docType);

                            This.$refs.customerRef.loadCustomerList(This.saleDeposit.customerName, This.saleDeposit.customerId);
                        }
                    },
                    error: function (e) {
                        console.log(e);
                    }
                });
            }

            //选择某条数据点击修改按钮进入 - 携带参数包含单据id  flag=3 能修改
            if (parentParams != null && parentParams.allInfo[0] == 3) {
                //判断是否为暂存状态 --------- 1
                let num = parentParams.allInfo[2]
                console.log(num)
                if(num === "暂存"){
                    This.viewShow = false

                    //附件可上传
                    This.isEdit('Y');
                }else{
                    //显示为不可修改
                    This.viewShow = true
                    This.isEdit('N');
                }
                $.ajax({
                    type: 'post',
                    async: true,
                    traditional: true,
                    data: {id: parentParams.allInfo[1]},
                    url: contextPath + '/deposit/view',
                    dataType: 'json',
                    success: function (d) {
                        This.saleDeposit = d.data.saleDeposit;
                        //this.saleCustInfo = d.data.saleCustInfo;
                        if(d.data.saleCustInfo){
                            This.saleCustInfo = d.data.saleCustInfo;
                        }
                        This.saleDepositDetailList = d.data.saleDepositDetailList;

                        if(d.data.saleCustInfo){
                            This.areaInit = {
                                isInit: true,
                                province: d.data.saleCustInfo.province || '',
                                city: d.data.saleCustInfo.city || '',
                                county: d.data.saleCustInfo.county,
                                detail: d.data.saleCustInfo.detail,
                                disabled:true
                            }
                        }

                        var a = 0;
                        This.saleDepositDetailList.forEach(function(value,i){

                            if(This.saleDepositDetailList[i].orderAmount!=null){
                                This.saleDepositDetailList[i].orderAmount=This.saleDepositDetailList[i].orderAmount.toFixed(2)
                            }else {
                                This.saleDepositDetailList[i].orderAmount=a.toFixed(2)
                            }
                            if(This.saleDepositDetailList[i].paidDepositAmount!=null){
                                This.saleDepositDetailList[i].paidDepositAmount= This.saleDepositDetailList[i].paidDepositAmount.toFixed(2)
                            }else {
                                This.saleDepositDetailList[i].paidDepositAmount=a.toFixed(2)
                            }
                            if(This.saleDepositDetailList[i].receDepositAmount!=null){
                                This.saleDepositDetailList[i].receDepositAmount= This.saleDepositDetailList[i].receDepositAmount.toFixed(2)
                            }else {
                                This.saleDepositDetailList[i].receDepositAmount=a.toFixed(2)
                            }
                        })

                        if(This.saleDeposit.createTime!=null || This.saleDeposit.createTime!=""){

                            This.createTime = This.saleDeposit.createTime
                        }
                        //将支付方式转为数组
                        // if(This.saleDeposit.payWay!=null || This.saleDeposit.payWay!=""){
                        //     This.saleDeposit.payWay = This.saleDeposit.payWay.split(",")
                        // }
                        if(This.saleDeposit.payWay!=null || This.saleDeposit.payWay!=""){
                            //将支付方式转为数组
                            if(This.saleDeposit.payWay.indexOf(",") == -1){
                                let arr = [];
                                arr.push(""+This.saleDeposit.payWay);
                                This.saleDeposit.payWay = arr;
                            }else{
                                This.saleDeposit.payWay = This.saleDeposit.payWay.split(",")
                            }
                            setTimeout(()=>{
                                This.htHaveChange = false;
                            },200)

                        }
                        //附件可上传
                        This.isEdit('Y');
                        if (!$.isEmptyObject(This.saleDeposit.depositNo) && This.saleDeposit.depositNo != undefined) {
                            This.getAccess(This.saleDeposit.depositNo, This.Constant.docType);
                        }

                        This.$refs.customerRef.loadCustomerList(This.saleDeposit.customerName, This.saleDeposit.customerId);
                    },
                    error: function (e) {
                        console.log(e);
                    }
                });
            }
            //点击定金列表的新增按钮进入  -  携带 参数包含 flag=4
            if (parentParams != null && parentParams.allInfo[0] == 4) {
                        //获取组织名
                This.saleDeposit.organizationName = window.parent.userInfo.orgName;
                This.saleDeposit.depositDate=new Date();
                        //附件可上传
                This.isEdit('Y');
                if (!$.isEmptyObject(This.saleDeposit.depositNo) && This.saleDeposit.depositNo != undefined) {
                    This.getAccess(This.saleDeposit.depositNo, This.Constant.docType);
                }

                This.$refs.customerRef.loadCustomerList('', '');
            }
        },


        //选中订单  返回按钮
        orderSave() {
            this.returnOrder = 1
            //判断选择的长度
            console.log(this.orderSelected)
            if (this.orderSelected.length > 0) {
                //获取到选择了的数据
                var arr = [];
                for (var i = 0; i < this.orderSelected.length; i++) {
                    let tabObj = $("#" + this.orderId).jqGrid('getRowData', this.orderSelected[i])
                    //将数据赋值

                    let info = Object.assign({}, this.addList)
                    info.custOrderNo = tabObj.orderNo
                    info.orderAmount = tabObj.totalRealSaleAmount
                    info.receDepositAmount = tabObj.receviableDeposit
                    info.alreadyReceivedDepaosit= tabObj.paidDeposit
                    info.id = tabObj.id
                    arr.push(info)
                }

                //关闭弹框
                this.orderShow = false;
                this.orderReload = !this.orderReload;
                this.orderSelected = [];
                //因为点击新增列表的时候  添加了空数据  需要剔除

                //判断是否是已插入数据
                console.log(this.saleDepositDetailList)
                this.saleDepositDetailList.map((item) => {
                    for (var i = 0; i < arr.length; i++) {
                        if (arr[i].custOrderNo == item.custOrderNo) {
                            //已插入的数据
                            arr.splice(i, 1)
                        }
                    }
                })

                arr.map((item) => {
                    let info = Object.assign({}, item)
                    this.saleDepositDetailList.push(info)
                })
                //将空白行去掉
                this.saleDepositDetailList.map((item,index)=>{
                    if(item.custOrderNo == ""){
                        this.saleDepositDetailList.splice(index,1)
                    }
                })
                //判断是否第一次点击
                if (this.returnOrder === 1) {
                    let This = this;
                    //选择客户订单之后查询客户资料
                    $.ajax({
                        type: 'post',
                        async: true,
                        traditional: true,
                        data: {
                            saleOrderNo: this.saleDepositDetailList[0].custOrderNo,
                            customerNo: this.saleDeposit.customerNo
                        },
                        url: contextPath + '/deposit/findSaleCustInfoEntity',
                        success: function (d) {
                            This.areaInit = {
                                isInit: true,
                                province: d.province || '',
                                city: d.city || '',
                                county: d.county,
                                detail: d.detail,
                                disabled:true
                            }
                            console.log(This.areaInit)
                            This.saleCustInfo = d;
                        },
                        error: function (e) {
                            console.log(e);
                        }
                    });
                }

                this.encomeMoney()
                this.htTestChange()
                //this.returnClick++
            } else {
                this.$Modal.warning({
                    title: "提示",
                    content: '请选择单据编号'
                });
            }
        },

        //审核或者驳回回调
        approvalOrRejectCallBack(res) {
            console.log(res)
            let _this = this;
            if (res.result.code == '100515') {
                if (_this.modalType == 'approve') _this.updateStatus(this.saleDeposit.id, this.saleDeposit.depositNo, 4);
                if (_this.modalType == 'reject') _this.updateStatus(this.saleDeposit.id, this.saleDeposit.depositNo, 1);
            }
            if (res.result.code == '100100') {
                let approvalStatus = res.result.data.approvalStatus;
                let docStatus = '';
                if (approvalStatus == 0) {
                    docStatus = 3;
                } else if (approvalStatus == 1) {
                    docStatus = 4;
                } else if (approvalStatus == -1) {
                    docStatus = 5;
                } else if (approvalStatus == -2) {
                    docStatus = 1;
                } else {
                    _this.$Modal.warning({
                        content: '审核异常!',
                        title: '警告'
                    });
                    return false;
                }
                if(docStatus==4){
                    _this.updataCustOrder(this.saleDeposit.id);
                    _this.saveFinancialData(this.saleDeposit.id);
                }
                _this.updateStatus(this.saleDeposit.id, this.saleDeposit.depositNo, docStatus);
            }
        },





        //修改单据状态
        updateStatus(id, depositNo, documentStatus) {
            //判断是否为暂存
            if(documentStatus == 1){
                this.saleDeposit.status = 1
                //数据可改
                this.viewShow = false

                //查找附件
                this.isEdit('Y');
            }else{
                this.isEdit('N');
            }
            let This = this;
            $.ajax({
                type: "post",
                url: contextPath + '/deposit/updateStatus',
                data: {id: id, deposit: depositNo, status: documentStatus},
                dataType: "json",
                success: function (d) {
                    //审核完成
                    if(d.data.status == 4){
                        This.saleDeposit.auditName=d.data.auditName;
                        This.saleDeposit.auditTime=d.data.auditTime;
                        This.saleDeposit.status=d.data.status;
                        console.log(This.saleDeposit)
                    }

                }
            });
        },

        updataCustOrder(id) {
            let This = this;
            $.ajax({
                type: "post",
                url: contextPath + '/deposit/updataCustOrder',
                data: {id: id},
                dataType: "json",
                success: function (data) {
                    if (data.code == "100100") {
                        This.reload = !This.reload;
                    }
                }
            });
        },

        saveFinancialData(id) {
            let This = this;
            $.ajax({
                type: "post",
                url: contextPath + '/deposit/saveFinancialData',
                data: {id: id},
                dataType: "json",
                success: function (data) {
                    if (data.code == "100100") {
                        This.reload = !This.reload;
                    }
                }
            });
        },


        /** 审核*/
        audit() {
            var depositNo = this.saleDeposit.depositNo;
            var status = this.saleDeposit.status;
            if (status === 2 ||
                status === 3 ||
                status === 5) {
                let This = this;
                This.id = this.saleDeposit.id;
                This.documentStatus = status;
                This.documentNo = depositNo;
                This.modalType = 'approve';
                This.modalTrigger = !This.modalTrigger;

            } else if (status === 1) {
                this.$Modal.warning({
                    title: '提示信息',
                    content: '请提交单据！'
                });
                return;
            } else if (status === 4) {
                this.$Modal.warning({
                    title: '提示信息',
                    content: '该单已审核,不能重复审核！'
                });
                return;
            }
        },
        //驳回
        reject() {
            var depositNo = this.saleDeposit.depositNo;
            var status = this.saleDeposit.status;
            if (status === 2 ||
                status === 3 ||
                status === 5 ||
                status === 1) {
                let This = this;
                This.id = this.saleDeposit.id;
                This.documentStatus = status;
                This.documentNo = depositNo;
                This.modalType = 'reject';
                This.modalTrigger = !This.modalTrigger;
            } else {
                this.$Modal.warning({
                    title: '提示信息',
                    content: '该单状态不能驳回！'
                });
            }
        },
        //点击搜索按钮
        searchCut() {
            let config = {
                postData:
                    {
                        customerName: this.customer.name,
                        customerNum: this.customer.Num
                    }
            }
            //根据单号请求数据
            $("#customerTab").jqGrid('setGridParam', config).trigger("reloadGrid");
        },
        //点击清空按钮
        searchClear(){

            //将搜索框数据清空
            this.customer= {
                name:"",
                Num:""
            }

            let info = {
                postData:
                    {
                        customerName: this.customer.name,
                        customerNum: this.customer.Num
                    }
            }
            //表格重新加载
            $("#" + this.tabId).jqGrid('clearGridData')
            $("#customerTab").jqGrid('setGridParam', info).trigger("reloadGrid");
        },
        //退出
        exit(close) {
            if (close === true) {
                window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
                return;
            }
            if (this.handlerClose()) {
                window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
            }
        },
        handlerClose() {
            if ((!this.saleDeposit.status || this.saleDeposit.status == 1) && (this.htHaveChange || accessVm.htHaveChange)) {
                this.$nextTick(() => {
                    this.$refs.closeModalRef.showCloseModal();
                });

                return false;
            }

            return true;
        },
        closeModal(type) {
            if (type === 'yes') {//提交数据
                this.saveinfo(0);
                this.exit(true);
            }else if(type === 'no'){//关闭页面
                this.exit(true);
            }
        },
        htTestChange(){
            this.htHaveChange = true;
            console.log(333)
        },
        //获取当前组织信息
        getData() {
            var This = this;
            $.ajax({
                type: "post",
                async:false,
                url: contextPath + '/tpurchasecollectgoods/data',
                dataType: "json",
                success: function (r) {
                    This.saleDeposit.organizationId = r.data.orgId;//加载当前组织id
                    This.saleDeposit.organizationName = r.data.orgName; //加载当前组织姓名
                },
                error: function () {
                    console.log('服务器出错啦');
                }
            })
        }
    },
    mounted() {
        this.openTime = window.parent.params.openTime;
        let parentParams = window.parent.params.params;
        window.handlerClose = this.handlerClose;
        this.view(parentParams);
        this.encomeMoney();
        this.getData();
    }
})