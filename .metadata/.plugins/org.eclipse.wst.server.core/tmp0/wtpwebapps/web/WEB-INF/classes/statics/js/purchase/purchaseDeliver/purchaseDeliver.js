var purchaseDeliver = new Vue({
    el: '#purchaseDeliver',
    data() {
        let This = this;
        return {
            isMyTable2:false,
            deliveryName:'',
            goodlist : [] ,
            categoryType:[],
            commodityCategoty:[],
            suppliers:[],
            configList:[{documentNo:""}],
            
            //采购送料单列表单据状态
            cityList3: [

                {
                    value: '1',
                    label: '暂存'
                },
                {
                    value: '2',
                    label: '待审核'
                },
                {
                    value: '3',
                    label: '审核中'
                },
                {
                    value: '4',
                    label: '已审核'
                },
                {
                    value: '5',
                    label: '驳回'
                },
            ],


            selected:[],
            selected2:[],
            openTime: '',
            isSearchHide: true, //搜索栏
            isTabulationHide: true, // 列表
            isFirstData: false, //搜索栏
            isLastData: false, //搜索栏
            isHide:true,
            orgName:"",
            selected: [],

            needReload :false,   
            //启用多级审核时单据上的操作——审核
            approveComment: false,
            //启用多级审核时单据上的操作—-驳回
            rejectComment: false,
            //审批数据绑定
            approvement: {
                receiptsId: '',
                approvalResult: '1',
                approvalInfo: '',
            },
            //驳回数据绑定
            rejectement: {
                receiptsId: '',
                approvalResult: '0',
                approvalInfo: '',
            },

            //按钮控制
            isEditDisable:false,

            //测试
            isShow: false,
            isEdit: false,
            docType:[],
            dataValue:[],
            categoryType: [],
            commodityCategoty:[],
            reload: false,

            testBusinessType:null,
            testSupplierId:null,
            testGoodsTypeId:null,


            confirmConfig: {
                showConfirm: false,
                title: '提示',
                content: '请点击确认',
                onlySure: true,
                success: true
            },

            body: {

                //first
                goodsTypeId:null,
                documentNo:'',
                goodsTypeName:'',
                
                //last
                goodsType:'',
                supplierId:null,
                supplierName:'',
                startTime:null,
                endTime:null,
                orderStatus:null,
                orderNo:'',
            },


            //加载采购待送料列表
            data_config1:{
                url: "/web/purchaseDeliverController/firstlist?organizationId="+window.parent.userInfo.organId,
                colNames: ['源单类型', '日期', '单据编号','供应商', '商品类型', '送料重量', '送料数量'],
                colModel: [
                    {name: 'businessType', index: 'businessType', align: "left", width: 330,
                        formatter: function (value) {
                           return "调拨单-"+"采购送料";
                        }
                    },
                    {name: 'transferTime', index: 'transferTime', width: 280, align: "left",
                        formatter: function (value) {
                            var date = new Date(value);
                            return (date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate());
                        }
                    },
                    {name: 'documentNo', index: 'documentNo', align: "left", width: 280},
                    {name: 'supplierName', index: 'supplierName', align: "left", width: 320},
                    {name: 'goodsTypeId', index: 'goodsTypeId', width: 280, align: "left",
                        formatter: function (value) {
                            if(value == 1){return "金料";}
                            if(value == 2){return "石料";}
                            if(value == 3){return "配件";}
                            return "";
                        }
                    },
                    {name: 'totalTransferWeigh', index: 'totalTransferWeigh', width: 280, align: "left"},
                    {name: 'totalTransferNum', index: 'totalTransferNum', width: 280, align: "left"},
                ],
            },

            //加载采购送料单列表
            data_config3:{
                url: "/web/purchaseDeliverController/list?organizationId="+window.parent.userInfo.organId,
                colNames: ['单据编号', '日期', '供应商','单据状态', '商品类型', '送料重量', '送料数量'],
                colModel: [
                    /*{name: 'orderNo', index: 'orderNo', align: "left", width: 280},*/
                    {name: 'orderNo', index: 'orderNo', width: 300, align: "left",
                        formatter: function (value, grid, rows, state) {
                            // console.log(value, grid, rows, state);
                            $(document).off('click', ".detail" + value).on('click', ".detail" + value, function () {
                                purchaseDeliver.testOrderDetailClick({value, grid, rows, state})
                            });
                            let myCode = `<a class="detail${value}">${value}</a>`;
                            return myCode;
                        },
                        unformat: function (value, grid, rows) {
                            return value.replace(/(<\/?a.*?>)/g, '');
                        }
                    },
                    {name: 'deliveryDate', index: 'deliveryDate', width: 230, align: "left",
                        formatter: function (value) {
                            var date = new Date(value);
                            return (date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate());
                        }
                    },
                    {name: 'supplierName', index: 'supplierName', align: "left", width: 320},
                    {name: 'orderStatus', index: 'orderStatus', width: 280, align: "left",
                        formatter: function (value) {
                            if(value == 1){return "暂存";}
                            if(value == 2){return "待审核";}
                            if(value == 3){return "审核中";}
                            if(value == 4){return "已审核";}
                            if(value == 5){return "驳回";}
                            return "";
                        }
                    },
                    {name: 'goodsTypeName', index: 'goodsTypeName', align: "left", width: 280, },
                    {name: 'deliverWeight', index: 'deliverWeight', width: 280, align: "left"},
                    {name: 'deliverCount', index: 'deliverCount', width: 280, align: "left"},
                ],
            },

            //审批信息
            data_config_approval:{
                url: '',
                colNames : [ '操作类型', '开始级次','目的级次','审批人','审批意见','审批时间'],
                colModel : [
                    {name : 'approvalResult',width : 200, align : "left",
                            formatter: function (value, grid, rows, state) {
                                return value == 1 ? "审核": "驳回";
                            }},
                    {name : 'currentLevel',width : 200, align : "left",
                            formatter: function (value, grid, rows, state) {
                                return value === 0 ? "开始" :value === 1 ? "一级审核": value === 2 ?
                                    "二级审核":value === 3 ? "三级审核":value === 4 ?
                                        "四级审核":value === 5 ? "五级审核":value === 6 ?
                                            "六级审核":"结束";
                            }},
                    {name : 'nextLevel',width : 200, align : "left",
                        formatter: function (value, grid, rows, state) {
                            if(rows.approvalResult === -1 || (rows.approvalResult === 0 && rows.nextLevel === undefined)){
                                return "开始";
                            }
                            return value === "0" ? "开始" : value === "1" ? "一级审核": value === "2" ?
                                "二级审核":value === "3" ? "三级审核":value === "4" ?
                                    "四级审核":value === "5" ? "五级审核":value === "6" ?
                                        "六级审核":"结束";
                        }},
                    {name : 'createName',width : 200, align : "left"},
                    {name : 'approvalInfo',width : 220, align : "left"},
                    {name : 'createTime',width : 250, align : "left"}
                ] ,
                jsonReader:{
                    root:"data.data"
                },
                multiselect: false
            },
            //审批进度条
            steplist: [],
            stepData: [
                {
                    currentLevel:0,
                    subtitle:'开始'
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
        
        }
    },

    methods: {

        //根据单据编号查详情
        testOrderDetailClick(data) {
            console.log(data);
            let code = data.rows.id;
            let basic = data.rows;
            if (code) {
                this.queryOrderByOrderNo(code, true, basic);
            }
        },

        queryOrderByOrderNo(code, isEdit, basic) {

            let parms = {"id":code,"orderNo": basic.orderNo,"isRead":true};
            let rowData =parms;
            window.parent.activeEvent({name: '查看采购送料单详情', url: contextPath+'/purchase/purchaseDeliver/purchaseDeliver.html', params: rowData});

           /* window.parent.activeEvent({
                name: '采购送料单详情',
                url: contextPath + '/purchase/purchaseDeliver/purchaseDeliver.html',
                params: {
                    code: code,
                    type: 'update',
                    basicInfo: basic
                }
            });*/
        },


        //此处三个方法是附件组件 只需要直接copy即可
        //附件是编辑还是查看 传入Y表示编辑，传入N表示查看
       /* isEdit1(isEdit){
            eventHub.$emit('isEdit', isEdit);
        },*/
        isEdit2(isEdit) {
            eventHub.$emit('isEdit', isEdit);
        },
        //保存附件
        saveAccess(id,type) {
            debugger;
            eventHub.$emit('saveFile', id,type);
        },
        //查找附件
        getAccess (id,type) {
            debugger;
            eventHub.$emit('queryFile', id,type);
        },


        //生成采购送料单
        build(){
            let requisitionGoodsEntity =[];
            if (purchaseDeliver.selected.length < 1) {
                layer.alert("请先选择一条记录!");
                return false;
            }if (purchaseDeliver.selected.length >= 1) {
                let arr = [];
                for(let i = 0;i<purchaseDeliver.selected.length;i++){
                    var a = jQuery('#myTable1').jqGrid('getRowData',purchaseDeliver.selected[i]);

                    let obj = {}
                    obj.documentNo = a.documentNo;
                    requisitionGoodsEntity.push(obj);
                    testBusinessType=jQuery('#myTable1').jqGrid('getRowData',this.selected[0]).businessType;
                    testSupplierId=jQuery('#myTable1').jqGrid('getRowData',this.selected[0]).supplierId;
                    testGoodsTypeId=jQuery('#myTable1').jqGrid('getRowData',this.selected[0]).goodsTypeId;
                }

                for(let j = 0;j<this.selected.length;j++){
                    var a = jQuery('#myTable1').jqGrid('getRowData',this.selected[j]);
                   if(testBusinessType!=a.businessType )
                    {
                        layer.alert("源单类型不一致，不能多选生成采购送料单!!");
                        return false;
                    }
                    if(testSupplierId!=a.supplierId)

                    {
                        layer.alert("供应商不一致，不能多选生成采购送料单!!");
                        return false;
                    }
                    if(testGoodsTypeId!=a.goodsTypeId)
                    {
                        layer.alert("商品类型不一致，不能多选生成采购送料单!!");
                        return false;
                    }
                }
                this.configList = arr;
            }
            this.isMyTable2 = true;
            //跳转到采购送料单商品信息页面
            let rowData =requisitionGoodsEntity;
            window.parent.activeEvent({
                name: '采购送料单',
                url: contextPath+'/purchase/purchaseDeliver/purchaseDeliver.html',
                params: rowData
            });
            console.log(this.isMyTable2);
        },

        //点击刷新
        refresh(){
            window.location.reload();
        },

        //待送料列表点击搜索按钮
        search(){
            if(this.commodityCategoty.length > 0){
                this.body.goodsTypeName=this.commodityCategoty[this.commodityCategoty.length-1];
            }else {
                this.body.goodsTypeName='';
            }
            console.log(this.body);
            //发送请求，查询数据
            this.reload = !this.reload;

        },

        //待送料列表点击清空按钮
        clear(){
            this.commodityCategoty = [];
            this.dataValue = [];
            this.body = Object.assign({},{
                goodsTypeId:null,
                documentNo:'',
                goodsTypeName : '',
                goodsType:'',
                supplierId:null,
                supplierName:null,
                startTime:'',
                endTime:'',
                orderStatus:null,
                orderNo:'',
                dataValue : null
            })

        },

        //送料单列表点击搜索按钮
        search3(){
            console.log(this.body);
            debugger;
            //发送请求，查询数据
            this.reload = !this.reload;
            console.log(this.body);
         //   purchaseDeliver.body.reload = !purchaseDeliver.body.reload;
        },


        //送料单列表点击清空按钮
        clear3(){
            console.log(this.body);
            this.body = {
                goodsType:'',
                supplierId:null,
                startTime:'',
                endTime:'',
                orderStatus:null,
                orderNo:''
            }
            console.log(this.body);
            /* this.reload = !this.reload;
             this.search();*/
        },

        //送料单列表点击删除行时
        deleteData(){
            if(purchaseDeliver.selected2.length < 1 ){
                layer.alert('请至少选择一条数据！');

            }
            if(purchaseDeliver.selected2.length >= 1 ){
                let selectId= purchaseDeliver.selected2;
                for(let i =0;i<selectId.length;i++){
                    var a = jQuery('#myTable3').jqGrid('getRowData',selectId[i]);
                    if(a.orderStatus!="暂存"){
                        layer.alert('您选择的'+'第'+(i+1)+'行的单据状态不是暂存，不能删除！');
                        return;
                    }
                }
            }
                this.$Modal.confirm({
                    title: '提示信息',
                    content: '<p>是否要删除信息？</p>',
                    onOk: () => {
                        //this.$Message.info('点击了确定');
                        console.log(JSON.stringify(purchaseDeliver.selected2));
                        var a = jQuery('#myTable3').jqGrid('getRowData',purchaseDeliver.selected2);
                        $.ajax({
                            type:"POST",
                            url: "/web/purchaseDeliverController/delete",
                            contentType: 'application/json',
                            data:JSON.stringify(purchaseDeliver.selected2),
                            dataType:"json",
                            success: function(result) {
                                if (result.code == "100100") {
                                    layer.alert('删除数据成功', {icon: 1});
                                    purchaseDeliver.selected2.length=0;
                                    window.location.reload();
                                } else {
                                    layer.alert('删除数据失败', {icon: 0});
                                }

                            },
                            error: function(err){
                                layer.alert(err);
                            },
                        })
                    },
                    onCancel: () => {
                        // this.$Message.info('点击了取消');
                    }
                });

        },


        //待送料列表日期控件
        changeDate(value){
            this.body.startTime=value[0].replace(/\//g, '-') + ' 00:00:00';
            this.body.endTime=value[1].replace(/\//g, '-') + ' 23:59:59';
        },
        //采购送料单列表日期控件
        changeDeliveryDate(value){
            this.body.startTime=value[0].replace(/\//g, '-') + ' 00:00:00';
            this.body.endTime=value[1].replace(/\//g, '-') + ' 23:59:59';
        },

        //隐藏和打开列表
        hideSearch() {
            this.isHide=!this.isHide;
            this.isSearchHide = !this.isSearchHide;           
            $(".chevron").css("top","")
        },
        //隐藏和打开列表
        hidTabulation() {
            this.isHide=!this.isHide;
            this.isTabulationHide = !this.isTabulationHide;
            if(!this.isTabulationHide){
                $(".chevron").css("top","83%")
            }else{
                $(".chevron").css("top","")
            }
        },

        //审批流
        initApproval(value){
            let This = this;
            $.ajax({
                type: "post",
               // url: './processlevel.json',
                data:{},
                dataType: "json",
                success: function (data) {
                    var process = data.data.list;
                    for (let i = 0; i < process.length; i++) {
                        switch (process[i].processLevel) {
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
                            processLevel:"开始"
                        }
                    );
                    process.push(
                        {
                            processLevel:"结束"
                        }
                    );
                    This.steplist = process;
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
               /* error: function () {
                    debugger;
                   layer.alert('服务器出错啦');
                }*/
            })
        },
        //采购送料单列表页面点击新增
        add3() {
            //跳转到采购送料单新增页面
            let isAddPurchaseDeliver =true;
            window.parent.activeEvent({name: '采购送料单', url: contextPath+'/purchase/purchaseDeliver/purchaseDeliver-add.html', params: isAddPurchaseDeliver});
        },

        //采购送料单列表页面点击修改
        update3(){

            if(purchaseDeliver.selected2.length == 0 ) {
                layer.alert('请先选择一条数据！');
                return;
            }

            if(purchaseDeliver.selected2.length != 1 ) {
                layer.alert('只能选择一条数据！');
                return;
            }

            var a = jQuery('#myTable3').jqGrid('getRowData',purchaseDeliver.selected2);
            if( a.orderStatus == "已审核" ){
                layer.alert('该条数据状态为已审核,不能修改');
                return;
            }

                //跳转到采购送料单修改页面
                let flag =0;
                let purchaseGoodsList =[];
                var a = jQuery('#myTable3').jqGrid('getRowData',purchaseDeliver.selected2);
                let orderNo = a.orderNo;
                let dataSource = null ;
                let purchaseDeliverEntity = {"orderNo":orderNo};
                //查询采购送料单
                if(flag == 0){
                $.ajax({
                    type: "POST",
                    /* url: contextPath+"/purchaseDeliverController/build?id="+id,*/
                    url: "/web/purchaseDeliverController/queryByOrderNo",
                    contentType: 'application/json',
                    data: JSON.stringify(orderNo),
                    // dataType:"json",
                    success: function (result) {
                        dataSource = result.data.data.dataSource;
                        flag = 1;
                        if(flag == 1){
                            //手动新增
                            if(dataSource==1){
                                // let rowData =a.orderNo;
                                let parms = {"id":purchaseDeliver.selected2[0],"orderNo": a.orderNo};
                                let rowData =parms;
                                window.parent.activeEvent({
                                    name: '采购送料单',
                                    url: contextPath+'/purchase/purchaseDeliver/purchaseDeliver.html',
                                    params: rowData
                                });
                            }
                            else{
                                //上游生成
                                let parms = {"id":purchaseDeliver.selected2[0],"orderNo": a.orderNo};
                                let rowData =parms;
                                window.parent.activeEvent({
                                    name: '采购送料单',
                                    url: contextPath+'/purchase/purchaseDeliver/purchaseDeliver.html',
                                    params: rowData
                                });
                            }
                        }
                    },
                    error: function (err) {
                        alert(err);
                    },
                })

                }
        },

        //保存'提交
        saveClick(param) {
            console.log(param);
        },
        //审核
        approval() {
        
        },
        //驳回
        reject() {
     
        },

        //加载商品类型
        loadProductType() {
            var That = this;
            $.ajax({
                type: "post",
                url: contextPath + '/documentController/getCategory?parentId=0',
                contentType: 'application/json',
                dataType: "json",
                success: function (res) {
                    That.categoryType = That.initGoodCategory(res.data.cateLists)
                },
                error: function (err) {
                    console.log("服务器出错");
                },
            })
        },
        //加载商品类型
        initGoodCategory(type) {
            let result = [];
            type.forEach((item) => {
                let {
                    name: value,
                    name: label,
                    cateLists: children
                } = item

                if (children) {
                    children = this.initGoodCategory(children)
                }
                result.push({
                    value,
                    label,
                    children
                })
            })
            result.forEach((item) => {
                if (!item.children) {
                    delete item.children;
                }
            })
            return result
        },

        //加载供应商
        loadSuppliers(){
            var That = this;
            $.ajax({
                type: "post",
                url: contextPath + '/tpurchasecollectgoods/findSupplierByOrgId',
                dataType: "json",
                success: function (r) {
                    That.suppliers =  r.data;
                },
                error: function () {
                    console.log('服务器出错啦');
                }
            })
        },

        //退出
        exit1() {
            window.parent.closeCurrentTab({name: '采购待送料列表',exit:true, openTime:this.openTime})
        },
        exit2() {
            window.parent.closeCurrentTab({name: '采购送料单',exit:true, openTime:this.openTime})
        },
        exit3() {
            window.parent.closeCurrentTab({name: '采购送料单列表',exit:true, openTime:this.openTime})
        },
        //审批意见点击确定
        getApproveInfo() {
         
        },
        //驳回点击确定
        getRejectInfo() {
        
        },
    },
    watch: {
    
    },

    created() {
        //加载商品类型
        this.loadProductType();
        //加载审核
        this.initApproval();
        //加载页面供应商
        this.loadSuppliers();
    },

    mounted(){
        //退出使用
        this.openTime=window.parent.params.openTime;
        //获取组织名称
        this.orgName = window.parent.userInfo.organization.orgName;
    },

})
