let custList = new Vue({
    el:"#cust-add",
    data(){
        return {

            ruleValidate:{
                orderDate: [
                    { required: true}
                ],
                payAmount:[
                    { required: true}
                ],
                businessType:[
                    { required: true}
                ],
                goldColor:[
                    { required: true}
                ]
            },
            //所选的客户对象
            selectCustomerObj: null,
            //控制数据是否可修改
            sourceTemp:false,
            isHideSearch:true,
            isHideList:true,
            isShow:false,
            //控制金料成色
            goldTemp:true,
            orderId:[],
            selected:[],
            //业务员
            employees: "",
            //控制弹窗显示
            modalTrigger: false,
            modalType: '',
            //审批进度条
            stepList: [],
            approvalTableData: [],
            payOrder:{
                //单据编号
                custPayOrderNo: "",
                organizationId:"",
                //所属组织名称
                organName: "",
                //客户编号
                custNo: "",
                //客户ID
                custId: "",
                //客户名称
                custName: "",
                //单据状态
                status: 1,
                //下单日期
                orderDate: "",
                //业务类型(1、预付款；2、锁价)
                businessType: "",
                //业务员id
                saleMenId: "",
                //业务员名称
                saleMenName: "",
                //关联客户订单
                saleOrderNo: "",
                //来款金额
                payAmount: "",
                //金价
                goldPrice: "",
                //金料成色
                goldColor: "",
                //金重
                goldWeight: "",
                //审核人
                auditId: "",
                auditName: "",
                //审核日期
                auditTime: "",
                createName:"",
                createTime:"",
                updateName:"",
                updateTime:"",
                //是否删除（1：未删除；0：已删除）
                isDel: "",
                //版本号
                version: "",
                //是否生成财务数据
                financialDataFlag: "",
                //财务数据ID
                financialDataId: "",
                //备注
                remark:"",
                saveOrSubmit:"",
                page:"1",
                limit:"2"
            },
            businessTypeList:[
                {
                    value:1,
                    label:"预付款"
                },
                {
                    value:2,
                    label:"锁价"
                }
            ],
            goldType:[],
            tabId:"tabId",
            selected: [],
            reload:true,

            orderReload: true,
            orderId: "orderId",
            orderSelected: [],
            //客户配置
            data_user_list: {
                //列表页数据
                url: contextPath + '/deposit/findCustomerCode',
                colNames: ["选择", "客户编码", "客户名称"],
                colModel:
                    [
                        {
                            name: 'id',
                            index: 'invdate',
                            width: 80,
                            align: "center",
                            formatter: function (value, grid, rows, state) {
                                $(document).off("click", ".select" + rows.id).on("click", ".select" + rows.id, function () {
                                    custList.confirm(value, grid, rows, state)
                                });
                                let btns = `<a type="primary" class="select${rows.id}">选取</a>`;
                                return btns
                            }
                        },
                        {name: "code", index: "code", width: 300, align: "center"},
                        {name: "name", index: "name", width: 300, align: "center"}
                    ],
                multiselect: false,
            },
            data_order_list:{
                //列表页数据
                url: contextPath + '/saleCustPayOrder/findCustOrderNo',
                colNames: ["id","日期", "单据编码", "客户","商品类型"],
                colModel:
                    [
                        {
                            name: 'id',
                            index: 'invdate',
                            width: 80,
                            align: "center",
                            hidden:true
                        },
                        {name: "orderDate", index: "orderDate", width: 200, align: "center"},
                        {name: "saleOrderNo", index: "saleOrderNo", width: 200, align: "center"},
                        {name: "custName", index: "custName", width: 200, align: "center"},
                        {name: "goodsTypeName", index: "goodsTypeName", width: 200, align: "center"}
                    ],

            },

            customer: {
                //客户名称
                name: "",
                //客户订单单号
                code: ""
            },
            //客户订单弹窗
            saleOrderShow:false,
            //搜索条件 编号
            orderNum:"",
            //表格开关
            orderShow:false,
            saleGold:""
        }
    },
    methods:{
        //验证输入格式
        clearNum(item,type,floor){
            return htInputNumber(item,type,floor)
        },
        //计算价格
        act(){
            if(this.payOrder.goldPrice){
                //计算锁价金重   来料金额/当日金价
                let num = Number(this.payOrder.payAmount)/Number(this.payOrder.goldPrice);
                num = num.toFixed(3);
                console.log(num)
                this.payOrder.goldWeight = num;
            }

        },
        //客户
        closeCustomer() {
            if(this.selectCustomerObj){
                this.payOrder.custId = this.selectCustomerObj.id;
                this.payOrder.custNo = this.selectCustomerObj.code;
                this.payOrder.custName = this.selectCustomerObj.name;
            }
        },
        //关联客户返回
        returnOrder(){
            let This = this;
            //判断有没有获取到数据
            if(this.orderSelected.length<0){
                this.$Modal.warning({
                    title:"提示",
                    content:"请选择数据"
                })
                return
            }
            //判断是否选择多条数据
            if(this.orderSelected.length>1){
                this.$Modal.warning({
                    title:"提示",
                    content:"请选择一条数据"
                })
                return
            }
            //关联订单赋值
            let orderNum = this.orderSelected[0].saleOrderNo

            //判断是否已关联
            $.ajax({
                url:contextPath + '/saleCustPayOrder/checkCustNo',
                data:{
                    custNo:orderNum
                },
                dataType:"json",
                type:"post",
                success(res){
                    console.log(res)
                    if(res.code == 100100){
                        This.payOrder.saleOrderNo =orderNum
                        This.saleOrderShow = false
                        This.orderShow = false;
                        This.htTestChange();
                    }
                    if(res.code == -1){
                        This.$Modal.warning({
                            title:"提示",
                            content:"已关联订单"
                        })
                    }
                },
                error: function () {
                    console.log('服务器出错啦');
                }
            })
        },
        //退出
        exitOrder(){
            this.saleOrderShow = false;
            this.orderShow = false;
        },
        //搜索
        orderSearch(){
            //判断是否选择客户
            if(this.payOrder.custName =="" || this.payOrder.custName== null){
                this.$Modal.warning({
                    title:"提示",
                    content:"请选择客户"
                })
                return;
            }
            var This = this;
            this.orderShow=true;

            //根据订单单号请求数据
            let config = {
                postData: {
                    CustOrderNo:this.orderNum,
                    custName:this.payOrder.custName
                }
            }
            $("#" + this.orderId).jqGrid('setGridParam', config).trigger("reloadGrid");

        },
        //打开关联客户订单弹窗
        orderAction(){
            this.saleOrderShow = true;
        },
        //客户弹窗
        userAction() {
            let This = this;
            //判断是否已经选取了客户
            console.log(this.payOrder.custName)
            if(this.payOrder.custName !=""){
                //清空数据
                this.$Modal.confirm({
                    content:"将会取消关联订单",
                    onOk:function () {
                        //数据清空
                        This.payOrder.saleOrderNo = "";
                        This.payOrder.custName = "";
                        This.isShow = true;
                    },
                    onCancel:function () {

                    }
                })
                return;
            }
            this.isShow = true;
        },
        //客户搜索框
        searchCut() {

            let config = {
                postData:
                    {
                        customerName: this.customer.name,
                        customerNum: this.customer.code
                    }
            }
            //根据单号请求数据
            $("#" + this.tabId).jqGrid('setGridParam', config).trigger("reloadGrid");
        },
        //客户清空按钮
        searchClear() {

            //将搜索框数据清空
            this.customer = {
                name: "",
                code: ""
            }

            let info = {
                postData:
                    {
                        customerName: this.customer.name,
                        customerNum: this.customer.code
                    }
            }
            //表格重新加载
            $("#" + this.tabId).jqGrid('clearGridData')
            $("#" + this.tabId).jqGrid('setGridParam', info).trigger("reloadGrid");
        },
        //获取选择信息
        confirm(value, grid, rows, state) {
            //获取到客户名称 以及客户编码
            //客户编号
            var tabObj = rows
            this.payOrder.custName = tabObj.name;
            this.payOrder.custNo = tabObj.code;
            this.payOrder.custId = tabObj.id;
            this.isShow = false

        },
        //获取当前组织
        getEmployees() {
            var This = this;
            $.ajax({
                type: "post",
                url: contextPath + '/tpurchasecollectgoods/data',
                dataType: "json",
                success: function (r) {
                    This.payOrder.organizationId = r.data.orgId;//加载当前组织id
                    This.payOrder.organName = r.data.orgName; //加载当前组织姓名
                    This.employees = r.data.employees; //加载当前公司下面所有的员工
                    console.log(This.employees)
                },
                error: function () {
                    console.log('服务器出错啦');
                }
            })
        },
        // 审核
        approval(value) {
            let This = this;
            This.modalType = 'approve';
            This.modalTrigger = !This.modalTrigger;
        },
        // 驳回
        reject(value) {
            let This = this;
            This.modalType = 'reject';
            This.modalTrigger = !This.modalTrigger;
        },
        //Name或者驳回回调
        approvalOrRejectCallBack(res) {
            let This = this;
            if (res.result.code === '100100') {
                let data = res.result.data;
                This.payOrder.status = data.status;
                if (This.payOrder.status === 1) {
                    //驳回后信息可编辑
                   This.sourceTemp = false;
                }
                This.payOrder.auditTime = data.auditTime;
                This.payOrder.auditId = data.auditId;
                This.payOrder.auditName = data.auditName;
            } else if (res.result.code === '100515') {
                if (This.modalType === 'reject') {
                    // 修改订单状态为 1 todo
                } else {
                    // 修改订单状态为 4 todo
                }

            } else {
                this.$Modal.warning({
                    content: res.result.msg,
                    title: '警告'
                })
            }
        },
        saveOrSubmit(rec){
            var This = this;
            This.payOrder.saveOrSubmit=rec;

            //判断是否填写数据
            if(rec == 1){

                let temp = true;
                let isCustomerPass = false;

                //判断来款性质
                if(this.payOrder.businessType == "1"){
                    this.ruleValidate.goldColor[0].required = false;
                }
                this.$refs.formValidate.validate((valid) => {
                    if (valid == false) {
                        temp = false;
                    }
                })
                isCustomerPass = this.$refs.customerRef.submit();
                if(!temp || !isCustomerPass){
                    return;
                }
                // if(this.payOrder.orderDate == ""){
                //     this.$Modal.info({
                //         content:"请填写日期"
                //     })
                //     return;
                // }
                // if(this.payOrder.saleOrderNo == ""){
                //     this.$Modal.info({
                //         content:"请关联客户订单"
                //     })
                //     return;
                // }
                // if(this.payOrder.payAmount == ""){
                //     this.$Modal.info({
                //         content:"请填写来款金额"
                //     })
                //     return;
                // }
                // if(this.payOrder.businessType == ""){
                //     this.$Modal.info({
                //         content:"请填写来款性质"
                //     })
                //     return;
                // }
                // if(this.payOrder.businessType == 2 && this.payOrder.goldColor ==""){
                //     this.$Modal.info({
                //         content:"请填写金料成色"
                //     })
                //     return;
                // }
            }
            $.ajax({
                type: 'post',
                async: false,
                traditional: true,
                dataType: 'json',
                contentType: "application/json;charset=utf-8",
                data: JSON.stringify( This.payOrder),
                url: contextPath + '/saleCustPayOrder/saveOrSubmit',
                success: function (d) {
                    if(d.code=="100100"){
                        This.payOrder = d.data;
                        console.log(This.payOrder);

                        if(rec==1){
                            This.$Modal.success({
                                title: '提示信息',
                                content:"提交成功！"
                            });
                            This.sourceTemp = true;
                        }
                        if(rec==0){
                            This.$Modal.success({
                                title: '提示信息',
                                content:"保存成功！"
                            });
                        }
                        This.htHaveChange = false;
                    }else if(d.code=="-1"){
                        if(d.data.orderDate!=null){
                            This.$Modal.warning({
                                title: '提示信息',
                                content:"下单日期未选择！"
                            });
                        }
                        if(d.data.BusinessType!=null){
                            This.$Modal.warning({
                                title: '提示信息',
                                content:d.data.BusinessType
                            });
                        }
                        if(d.data.CustName!=null){
                            This.$Modal.warning({
                                title: '提示信息',
                                content:d.data.CustName
                            });
                        }
                        if(d.data.GoldColor!=null){
                            This.$Modal.warning({
                                title: '提示信息',
                                content:d.data.GoldColor
                            });
                        }
                        if(d.data.PayAmount!=null){
                            This.$Modal.warning({
                                title: '提示信息',
                                content:d.data.PayAmount
                            });
                        }


                    }else if(d.code=="-2"){
                        if(d.data!=null){
                            This.$Modal.warning({
                                title: '提示信息',
                                content:d.data
                            });
                        }

                    }
                },
                error: function (e) {
                    console.log(e);
                }
            });
        },


        view(parentParams) {
            var This = this;
            //查看
            if(parentParams.type == "query"){
                $.ajax({
                    type: 'post',
                    async: true,
                    traditional: true,
                    data: {id: parentParams.allInfo},
                    url: contextPath + '/saleCustPayOrder/findSaleCustPayOrderEntity',
                    dataType: 'json',
                    success: function (d) {
                        console.log(d)
                        This.payOrder = d.data;
                        //判断状态 暂存可改
                        if(This.payOrder.status == 1){
                            This.sourceTemp = false;
                            if(This.payOrder.businessType == 2){
                                This.goldTemp = false;
                            }

                        }else{
                            This.sourceTemp = true;
                        }
                        This.$refs.customerRef.loadCustomerList(This.payOrder.custName, This.payOrder.custId);
                    },
                    error: function (e) {
                        console.log(e);
                    }
                });
            }
            //修改
            if(parentParams.type == "modify"){
                $.ajax({
                    type: 'post',
                    async: true,
                    traditional: true,
                    data: {id: parentParams.allInfo},
                    url: contextPath + '/saleCustPayOrder/findSaleCustPayOrderEntity',
                    dataType: 'json',
                    success: function (d) {
                        console.log(d)
                        This.payOrder = d.data;
                        if(This.payOrder.status == 1){
                            This.sourceTemp = false;
                            if(This.payOrder.businessType == 2){
                                This.goldTemp = false;
                            }

                        }else{
                            This.sourceTemp = true;
                        }
                        This.$refs.customerRef.loadCustomerList(This.payOrder.custName, This.payOrder.custId);

                    },
                    error: function (e) {
                        console.log(e);
                    }
                });
            }
            if(parentParams.type == "add"){
                this.$refs.customerRef.loadCustomerList('', '');
            }
        },
        //来款性质
        enComeType(val){
            //清空数据
            this.payOrder.goldPrice = "";
            this.payOrder.goldColor = "";
            this.payOrder.goldWeight = "";
            //根据来款性质 控制金料成色
            if(val == "1"){
                this.goldTemp =true ;
                this.ruleValidate.goldColor[0].required = false;

            }else if(val == "2"){
                this.goldTemp = false;
                this.ruleValidate.goldColor[0].required = true;
            }
        },
        //业务员
        saleMan(...rest){
            console.log(rest)
            //业务员id
            this.payOrder.saleMenId = rest[0].value
            //业务员名称
            this.payOrder.saleMenName = rest[0].label

        },
        //金料价格
        goldMoney(val){
            console.log(this.saleGold)
            //根据金料成色获取当前金价
            for(var key in this.saleGold){
                if(key === val){
                    //获取到当日金价
                    this.payOrder.goldPrice = this.saleGold[key]
                    //计算锁价金重   来料金额/当日金价
                    let num = Number(this.payOrder.payAmount)/Number(this.payOrder.goldPrice)
                    num = num.toFixed(3);
                    this.payOrder.goldWeight = num

                }
            }
        },
        //获取销售今日金价
        initGoldPrice(type) {
            let that = this;
            $.ajax({
                type: "post",
                url: contextPath + '/tbasetodygoldprice/queryPrice',
                data: { "type": type },
                dataType: "json",
                success(data) {
                    that.saleGold = data.data;
                },
                error() {
                    that.$Message.warning('服务器报错')
                }

            })
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
            if ((!this.payOrder.status || this.payOrder.status == 1) && (this.htHaveChange || accessVm.htHaveChange)) {
                this.$nextTick(() => {
                    this.$refs.closeModalRef.showCloseModal();
                });

                return false;
            }

            return true;
        },
        closeModal(type) {
            if (type === 'yes') {//提交数据
                this.saveOrSubmit(0);
                this.exit(true);
            }else if(type === 'no'){//关闭页面
                this.exit(true);
            }
        },
        htTestChange(){
            this.htHaveChange = true;
            console.log(333)
        }
    },
    mounted(){
        //1 类型
        this.initGoldPrice(1)
        this.getEmployees()
        this.openTime = window.parent.params.openTime;
        this.openName = window.parent.params.name;
        this.goldType = layui.data('dict').base_Condition
        window.handlerClose = this.handlerClose;
        //金料成色
        let parentParams = window.parent.params.params;
        console.log(parentParams)
        this.view(parentParams);
    }
})