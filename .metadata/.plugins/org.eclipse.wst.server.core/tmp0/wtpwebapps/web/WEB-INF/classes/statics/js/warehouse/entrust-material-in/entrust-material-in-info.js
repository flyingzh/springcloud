var vm = new Vue({
    el: "#entrustMaterialInInfo",
    data: {
        ruleValidate: {
            documentTime: [
                { required: true}
            ],
            goodsTypeName: [
                { required: true}
            ],
            custId: [
                { required: true}
            ],
            goodsTypePath: [
                { required: true}
            ]
        },
        //表格验证
        openTime:'',
        params:{},
        isShow: false,
        reload: false,
        isSearchHide: true,
        isDisable: false,
        isEditTable: false,
        isTabulationHide: true,
        isEditInput: false,
        isEditDate: false,
        isEditRemark: false,
        isEditSalesman: false,
        isMenu: true,
        isUpdate:false,
        isStampShow:false,
        isEditNumber:false,
        businessType:"",
        productId:'',
        isClearable:true,
        isOpened:false,
        boeType: 'W_EMATERIAL_IN',
        categoryType:[],
        //默认客户代管仓
        defWareHouse:'',
        entrustMaterialInInfo:{
            createId:'',
            updateId: '',
            createName: '',
            updateName: '',
            remark: '',
            createTime: '',
            updateTime: '',
            organizationId: '',
            organizationName:'',
            id: '',
            idList:'',
            documentNo: '',
            documentTime: new Date(),
            salesmanId: '',
            salesmanName: '',
            customCode: '',
            goodsTypeName: '',
            groupPath: '',
            custId: '',
            custCode: '',
            custName: '',
            name: '',
            phone: '',
            email: '',
            postalcode: '',
            weChartNo: '',
            region: '',
            address: '',
            documentStatus: 1,
            examineVerifyId: '',
            examineVerifyName: '',
            examineVerifyTime: '',
            isDel:1,
            goodList:[]
        },
        goodsInfo:{
            goodsNo:'',
            goodsName:'',
            number:''
        },

        productDetailList: [],
        productDetailModal: {
            showModal: false,
            ids: {
                goodsId: '',
                commodityId: '',
                documentType: 'W_EMATERIAL_IN'
            }
        },

        barCodeDetailList: [],
        barCodeDetailModal: {
            showModal: false,
            ids: {
                goodsId: '',
                commodityId: '',
                documentType: 'W_STOCK_IN'
            }
        },
        barCodeSelectedIndex:null,
        isCustId:'',
        //业务员
        salesmanList:[],
        //客户
        custList:[],
        //仓库
        warehouseList:[],
        //库位
        reservoirPositionList:[],
        //计数单位
        countingUnitList:[],
        //计重单位
        weightUnitList:[],
        unitList:[],
        goodsDetails:[],
        certifiTypes:[],
        goodsIndex:'',
        selectedIndex: null,
        tabVal:'name1',
        ctrlMark: true,
        //控制商品明细属性显示隐藏
        showProductProperty: false,
        //控制弹窗显示
        modalTrigger:false,
        modalType:'',
        //审批进度条
        stepList: [],
        approvalTableData:[],

        showCustomer: false,
        selectCustomerObj: null, //所选的客户对象
        htHaveChange: false
    },
    methods: {
        selectCustomer() {//选择客户
            this.showCustomer = true;
        },
        htTestChange(){
            this.htHaveChange = true;
            console.log(333)
        },
        closeCustomer() {
            if(this.selectCustomerObj){
                this.entrustMaterialInInfo.custId = this.selectCustomerObj.id;
                this.entrustMaterialInInfo.custName = this.selectCustomerObj.name;
                this.entrustMaterialInInfo.custCode = this.selectCustomerObj.code;
            }
            this.showCustomer = false;
            this.$refs.formValidate.validateField('custId')
        },
        //表格模糊搜索下拉错位的问题
        getSelect(parent, child){
            return repositionDropdownOnSroll(parent,child);
        },
        modalSure(e) {
            this.productDetailModalClick(e);
            this.productDetailModal.showModal = false;
        },
        modalCancel(e) {
            this.productDetailModal.showModal = false;
        },
        barCodeModalSure(e) {
            this.barCodeDetailModalClick(e);
            this.barCodeDetailModal.showModal = false;
        },
        barCodeModalCancel(e) {
            this.barCodeDetailModal.showModal = false;
        },
        barCodeModalNo(e){
            this.barCodeDetailModal.showModal = false;
        },
        barCodeDetailModalClick(e){
            //商品详情点击确定跟取消的回调
            //写法固定

            if (this.productDetailList[this.selectedIndex].barCodeDetailList[this.barCodeSelectedIndex].goodsMainType === 'attr_ranges_goods') {
                Object.assign(this.productDetailList[this.selectedIndex].barCodeDetailList[this.barCodeSelectedIndex], {
                    tBaseBomEntity: e,
                    assistAttrs: null,
                    overEdit: true
                });
            } else {
                Object.assign(this.productDetailList[this.selectedIndex].barCodeDetailList[this.barCodeSelectedIndex],{
                    assistAttrs: e,
                    tBaseBomEntity: null,
                    overEdit: true
                })
            }
        },
        showBarCodeDetail(index) {//点击商品明细
            console.log("当前下标：",index);
            let This = this;
            this.barCodeSelectedIndex = index;
            console.log(This.barCodeDetailList)
            if(!This.productDetailList[This.selectedIndex].barCodeDetailList[index].commodityId){
                This.$Modal.info({
                    title: '提示信息',
                    content: '请先选择商品'
                });
                return false;
            }
            //固定开始
            let ids = {
                goodsId: This.productDetailList[This.selectedIndex].barCodeDetailList[index].id,
                commodityId: This.productDetailList[This.selectedIndex].barCodeDetailList[index].commodityId,
                documentType: 'W_STOCK_IN'
            };
            Object.assign(This.barCodeDetailModal, {
                showModal: true,
                ids: ids
            });
            this.$nextTick(() => {
                This.$refs.barCodeModalRef.getProductDetail();
            });
            //固定结束
        },
        //处理明细数据传给后台
        barCodeHandlerDataToPost: function () {
            let This = this;
            let obj = {
                id:'',
                goodsBarcode: '',
                goodsNo:'',
                goodsName: '',
                number: 1,
                commodityId:'',
                countingUnitId:'',
                countingUnitName:'',
                weightUnitId:'',
                weightUnitName:'',
                goodsMainType: '',
                totalWeight:'',
                certificateType:'',
                certificateNo:'',
                warehouseId:'',
                goodsNorm:'',
                batchNum:'',
                custStyleCode:'',
                custStyleType:'',
                detailMark:'',
                isDel:'',

                stonesParts: [],
                materialParts: [],
                partParts: [],
                goldParts: []
            }
            let data = This.entrustMaterialInInfo.goodList;
            console.log("处理前的数据结构:",data);
            console.log(This.barCodeDetailList);

            if(This.productDetailList){
                for (let i = 0; i < This.productDetailList.length; i++) {

                    if(This.productDetailList[i].barCodeDetailList){
                        for (let j = 0; j < This.productDetailList[i].barCodeDetailList.length; j++) {
                            data[i].goodList = [JSON.parse(JSON.stringify(obj))];
                            //商品明细数据处理
                            let list = htHandlerProductDetail(This.productDetailList[i].barCodeDetailList, data[i], obj);
                            console.log("经过处理后的数据结构为：", list);
                            This.productDetailList[i].barCodeDetailList.map((item, index) => {
                                //商品分录行赋值
                                if (!data[i].goodList[index]) {
                                    data[i].goodList[index] = {};
                                }
                                Object.assign(data[i].goodList[index], {
                                    id: item.id,
                                    goodsBarcode: item.goodsBarcode,
                                    goodsNo: item.goodsNo,
                                    goodsName: item.goodsName,
                                    number: 1,
                                    commodityId: item.commodityId,
                                    countingUnitId: item.countingUnitId,
                                    countingUnitName:item.countingUnitName,
                                    weightUnitId: item.weightUnitId,
                                    weightUnitName: item.weightUnitName,
                                    goodsMainType: item.goodsMainType,
                                    totalWeight: item.totalWeight,
                                    certificateType: item.certificateType,
                                    certificateNo: item.certificateNo,
                                    warehouseId:item.warehouseId,
                                    goodsNorm:item.goodsNorm,
                                    batchNum:item.batchNum,
                                    custStyleCode:item.custStyleCode,
                                    custStyleType:item.custStyleType,
                                    detailMark: item.detailMark,
                                    isDel: item.isDel
                                })
                            });
                        }
                    }
                }
                return data;
            }
        },
        productDetailModalClick(e){
            //商品详情点击确定跟取消的回调
            //写法固定
            if (this.productDetailList[this.selectedIndex].goodsMainType === 'attr_ranges_goods') {
                Object.assign(this.productDetailList[this.selectedIndex], {
                    tBaseBomEntity: e,
                    assistAttrs: null,
                    overEdit: true
                });
            } else {
                Object.assign(this.productDetailList[this.selectedIndex],{
                    assistAttrs: e,
                    tBaseBomEntity: null,
                    overEdit: true
                })
            }
        },
        showProductDetail(index) {//点击商品明细
            console.log("当前下标：",index);
            let This = this;
            this.selectedIndex = index;
            console.log(This.productDetailList)

            if(This.productDetailList[index].goodsMainType &&
                This.productDetailList[index].goodsMainType !== 'attr_ranges_gold'){
                This.$Modal.info({
                    title: '提示信息',
                    content: '请点击明细进入商品明细页签填写信息!'
                });
                return false;
            }
            if(!This.productDetailList[index].commodityId){
                This.$Modal.info({
                    title: '提示信息',
                    content: '请先选择商品'
                });
                return false;
            }
            //固定开始
            let ids = {
                goodsId: this.productDetailList[index].id,
                commodityId: this.productDetailList[index].commodityId,
                documentType: 'W_EMATERIAL_IN'
            };
            Object.assign(this.productDetailModal, {
                showModal: true,
                ids: ids
            });
            this.$nextTick(() => {
                This.$refs.modalRef.getProductDetail();
            });
            //固定结束
        },
        //处理明细数据传给后台
        handlerDataToPost: function () {
            let This = this;
            let obj = {
                id:'',
                goodsNo: '',
                collectGoodId: '',
                countingUnit: '',
                countingUnitName: '',
                pictureUrl: '',
                weight: '',
                commodityId: '',
                goodsNorm: '',
                number: '',
                batchNum:'',
                reservoirPositionId: '',
                warehouseId: '',
                goodsName: '',
                weightUnit: '',
                weightUnitName: '',
                goodList:[],
                isDel:'',
                sourceNo: '',
                sourceType: '',
                organizationId:'',
                custStyleCode: '',
                styleCategoryId: '',
                styleCustomCode: '',
                styleName: '',
                detailMark: '',
                stonesParts: [],
                materialParts: [],
                partParts: [],
                goldParts: [],
            }
            let data = This.entrustMaterialInInfo;
            console.log("处理前的数据结构:",data);
            console.log(This.productDetailList);
            if(ht.util.hasValue(This.productDetailList,'array')){
                data.goodList = [JSON.parse(JSON.stringify(obj))];
                //商品明细数据处理
                let list= htHandlerProductDetail(This.productDetailList, data, obj);
                console.log("经过处理后的数据结构为：",list);
                this.productDetailList.map((item, index)=>{
                    //商品分录行赋值
                    if(!data.goodList[index]){
                        data.goodList[index] = {};
                    }
                    Object.assign(data.goodList[index], {
                        goodsNo: item.goodsNo,
                        collectGoodId: item.collectGoodId,
                        countingUnit: item.countingUnit,
                        countingUnitName: item.countingUnitName,
                        pictureUrl: item.pictureUrl,
                        weight: item.weight,
                        commodityId: item.commodityId,
                        goodsNorm: item.goodsNorm,
                        number: item.number,
                        batchNum:item.batchNum,
                        reservoirPositionId: item.reservoirPositionId,
                        warehouseId: item.warehouseId,
                        goodsName: item.goodsName,
                        weightUnit: item.weightUnit,
                        weightUnitName: item.weightUnitName,
                        goodsMainType: item.goodsMainType,
                        custStyleCode: item.custStyleCode,
                        styleCategoryId: item.styleCategoryId,
                        styleCustomCode: item.styleCustomCode,
                        styleName: item.styleName,
                        detailMark: item.detailMark,
                        goodList: item.goodList,
                        id: item.id,
                        isDel:item.isDel,
                        organizationId:item.organazationId,
                        sourceNo:item.sourceNo,
                        sourceType: item.sourceType,
                        lineNo: index+1
                    })
                });
                return data;
            }
        },
        //新增行 删除行
        rowClick(type) {
            if(type === 'add'){
                if(!this.entrustMaterialInInfo.custId){
                    this.$Modal.info({
                        title:"提示信息",
                        content:"请选择客户"
                    });
                    return false;
                }
                if(!this.entrustMaterialInInfo.customCode){
                    this.$Modal.info({
                        title:"提示信息",
                        content:"请选择商品类型"
                    });
                    return false;
                }
                let addRowData = Object.assign({},{
                    id:'',
                    goodsNo: '',
                    countingUnit: '',
                    countingUnitName: '',
                    pictureUrl: '',
                    weight: '',
                    commodityId: '',
                    goodsNorm: '',
                    number: '',
                    batchNum:'',
                    reservoirPositionId: '',
                    warehouseId: this.defWareHouse,
                    goodsName: '',
                    weightUnit: '',
                    weightUnitName: '',
                    goodsMainType:'',
                    custStyleCode: '',
                    styleCategoryId: '',
                    styleCustomCode: '',
                    styleName: '',
                    goodList:[],
                    organizationId:'',
                    barCodeDetailList: [],
                    isDel:1
                });
                this.productDetailList.push(addRowData);
                this.$nextTick(()=>{
                    this.getSelect('table-responsive','goods');
                })
            }else if(type === 'copy') {
                if(this.selectedIndex === null){
                    this.$Modal.info({
                        title:"提示信息",
                        content:"请选择一条数据！",
                    })
                }else{
                    var copyRawList = Object.assign({}, this.productDetailList[this.selectedIndex]);
                    copyRawList['barCodeDetailList'] = []
                    console.log(copyRawList)
                    for(var key in copyRawList){
                        copyRawList.id = "";
                    }
                    copyRawList.barCodeDetailList.forEach(p => {
                        p.goodsBarcode = "";
                        p.id = "";
                    });
                    console.log(copyRawList)
                    console.log( this.productDetailList)
                    this.$nextTick(()=>{
                        this.productDetailList.push(copyRawList)
                    })
                    this.selectedIndex = null;
                }
                this.htTestChange()
                this.$nextTick(()=>{
                    this.getSelect('table-responsive','goods');
                })
            }
        },
        validateProduct(){//校验是否存在商品明细
            let flag = true;
            let This = this;
            let productInfo = This.productDetailList.filter(p => p.isDel === 1);
            $.each(productInfo, function (i, item) {
                /*if(item.number && item.number > 0){
                    return true;
                }*/
                if(item.id || item.detailMark === 2){
                    return true;
                }
                if(item.goodsMainType == 'attr_ranges_goods' || item.goodsMainType === 'attr_ranges_stone'){
                    return true;
                    /*if(!item.tBaseBomEntity){
                        flag = false;
                        This.$Modal.error({
                            content: '第'+(i+1)+'行商品明细未选择，请先选择商品明细！',
                        });
                        return false;
                    }*/
                }else{
                    if(!item.assistAttrs){
                        flag = false;
                        This.$Modal.info({
                            content: '第'+(i+1)+'行商品明细未选择，请先选择商品明细！',
                            title:"提示信息"
                        });
                        return false;
                    }
                }
            });
            return flag;

        },
        validateBarcodeProduct(){//校验是否存在商品明细
            let flag = true;
            let This = this;
            let productInfo = This.productDetailList
                .filter(p => p.isDel === 1);
            $.each(productInfo, function (i, item) {
                if(item.barCodeDetailList && flag){
                    $.each(item.barCodeDetailList,function (index,item1) {
                        if(item1.isDel === 1 && flag){
                            if(item1.id || item.detailMark === 2){
                                return true;
                            }
                            if(item1.goodsMainType == 'attr_ranges_goods'){
                                if(!item1.tBaseBomEntity){
                                    flag = false;
                                    This.$Modal.info({
                                        content: '第'+(i+1)+'行商品简述的'+'第'+(index+1)+'行商品明细未选择，请先选择商品明细！',
                                        title:"提示信息"
                                    });
                                    return false;
                                }
                            }else{
                                if(!item1.assistAttrs){
                                    flag = false;
                                    This.$Modal.info({
                                        content: '第'+(i+1)+'行商品简述的'+'第'+(index+1)+'行商品明细未选择，请先选择商品明细！',
                                        title:"提示信息"
                                    });
                                    return false;
                                }
                            }
                        }
                    })
                }
            });
            return flag;

        },
        checkBarcodeInfo(){
            let This = this;
            let flag = true;
            This.productDetailList
                .filter(p => p.isDel === 1)
                .forEach((a,index) => {
                if(a.barCodeDetailList){
                    a.barCodeDetailList
                        .filter(i => i.isDel === 1)
                        .forEach((o,index1) =>{
                            if(!o.totalWeight && flag){
                                flag = false;
                                This.$Modal.info({
                                    content: '第'+(index+1)+'行商品简述的'+'第'+(index1+1)+'行未填写完善，请填写信息！',
                                    title:"提示信息"
                                });
                                return false;
                            }
                        });
                }
            });
            return flag;
        },
        // 附件是编辑还是查看 传入Y表示编辑，传入N表示查看,页面初始化的时候就需要调用这个方法
        isEdit:function (isEdit, on) {
            eventHub.$emit('isEdit', isEdit);
        },
        // 保存附件 保存的时候调用
        saveAccess: function (id,type, on) {
            eventHub.$emit('saveFile', id,type);
        },
        // 查找附件 查看的时候调用
        getAccess: function (id,type, on) {
            eventHub.$emit('queryFile', id,type);
        },
        approval(value) {
            let This = this;
            This.modalType = 'approve';
            This.modalTrigger = !This.modalTrigger;
        },
        reject(value) {
            let This = this;
            This.modalType = 'reject';
            This.modalTrigger = !This.modalTrigger;
        },
        //审核或者驳回回调
        approvalOrRejectCallBack(res){
            let _this = this;
            if(res.result.code == '100100'){
                _this.entrustMaterialInInfo.documentStatus = parseInt(res.result.data);
                _this.getEntrustMaterialIn();
            }
        },
        autoSubmitOrReject(){
            let _this = this;
            $.ajax({
                url: contextPath + '/entrustMaterialInController/submitApproval?submitType=1',
                method:'post',
                contentType:'application/json;charset=utf-8',
                data:JSON.stringify({
                    receiptsId:_this.entrustMaterialInInfo.documentNo,
                    approvalResult:(_this.modalType === 'reject'? 1 : 0),
                }),
                success:function (res) {
                    if(res.code === '100100'){
                        _this.entrustMaterialInInfo.documentStatus = parseInt(res.data);
                    }else {
                        _this.$Modal.info({content:res.msg, title:"提示信息"});
                    }
                    _this.getEntrustMaterialIn();
                }
            });
        },
        updateStatus(id,documentStatus){
            let This = this;
            $.ajax({
                type: "post",
                url: contextPath+'/entrustMaterialInController/update',
                contentType: 'application/json;charset=utf-8',
                data: JSON.stringify({"id":id,"documentStatus":documentStatus,"documentNo":This.entrustMaterialInInfo.documentNo}),
                dataType: "json",
                success: function (data) {
                    if(data.code === "100100"){
                        This.entrustMaterialInInfo.documentStatus = documentStatus;
                        This.getEntrustMaterialIn();
                        console.log("修改成功");
                    }
                },
                error: function () {
                    This.$Modal.warning({content:'服务器出错啦', title:"提示信息"});
                }
            })
        },
        barCodeAction1(index){
            this.barCodeSelectedIndex = index;
        },
        action1(index){
            this.selectedIndex = index;
        },
        action2(){
            if(this.selectedIndex === null){
                this.$Modal.info({content:"请选择一条数据！",title:"提示信息"})
            }else{

                if(this.productDetailList[this.selectedIndex].id){
                    this.productDetailList[this.selectedIndex].isDel = 0;
                    let $barCodeDetailList = this.productDetailList[this.selectedIndex].barCodeDetailList;
                    if($barCodeDetailList){
                        $barCodeDetailList.forEach(p=>p.isDel = 0);
                        $barCodeDetailList = $barCodeDetailList.filter(p=>p.id);
                    }
                }else{
                    this.productDetailList.splice(this.selectedIndex,1);
                }

                this.$forceUpdate();
                this.selectedIndex = null;
            }
            this.htTestChange()
        },
        detailAction(item,index){
            let This = this;

            if(!item.goodsNo){
                This.$Modal.info({
                    title:"提示信息",
                    content:"请输入商品编码"
                });
                return false;
            }

            if(This.productDetailList[index].goodsMainType === 'attr_ranges_gold'){
                This.$Modal.info({
                    title:"提示信息",
                    content:"商品为金料，请选择商品简述中的商品明细填写"
                });
                return false;
            }

            if(!item.number || (item.number && Number(item.number) <= 0)){
                This.$Modal.info({
                    title:"提示信息",
                    content:"请输入数量"
                });
                return false;
            }
            This.goodsInfo.goodsNo = item.goodsNo;
            This.goodsInfo.goodsName = item.goodsName;
            This.goodsInfo.number = item.number;
            This.goodsIndex = index;


            let countingUnitName = This.unitList[item.countingUnit];
            let weightUnitName = This.unitList[item.weightUnit];

            if(item.sourceNo){
                countingUnitName = item.countingUnitName;
                weightUnitName = item.weightUnitName;
            }

            let news = $.extend(true,{},{
                id:'',
                goodsBarcode: '',
                goodsNo:item.goodsNo,
                goodsName: item.goodsName,
                number: 1,
                commodityId:item.commodityId,
                countingUnitId:Number(item.countingUnit),
                countingUnitName: countingUnitName,
                weightUnitId:Number(item.weightUnit),
                weightUnitName: weightUnitName,
                goodsMainType: item.goodsMainType,
                totalWeight:'',
                certificateType:'',
                certificateNo:'',
                warehouseId:item.warehouseId,
                goodsNorm:item.goodsNorm,
                batchNum:item.batchNum,
                custStyleCode:item.custStyleCode,
                custStyleType:item.styleName,
                detailMark: item.detailMark,
                goodList:[],
                isDel:1,
                certifiTypes:this.certifiTypes.map(p=>$.extend(true,{},{
                    name:p.name,
                    value:p.value
                }))
            });

            let $barCodeDetail = This.productDetailList[index];
            if(!$barCodeDetail['barCodeDetailList']){
                This.$set($barCodeDetail,'barCodeDetailList', []);
                //$barCodeDetail['barCodeDetailList'] = [];
            }
            $barCodeDetail['barCodeDetailList'].forEach((item1,index) => {
                if(item1.goodsNo !== item.goodsNo){
                    let id = $barCodeDetail['barCodeDetailList'][index]['id'];
                    console.log(id);
                    if(id){
                        item1.isDel = 0;
                        //item1 = $.extend(true,{},item1);
                    }else{
                        $.extend(true,item1,news);
                        This.$nextTick(()=>{
                            this.$refs['certificateType'+index][0].reset();
                        });
                    }
                }
            })

            let count = 0;
            $barCodeDetail['barCodeDetailList'].forEach((item2,index) => {
                if(item2.isDel === 0){
                    count++;
                }
            })
            if(($barCodeDetail['barCodeDetailList'] && $barCodeDetail['barCodeDetailList'].length == 0)){
                for (let i = 0; i < parseInt(item.number); i++) {
                    $barCodeDetail['barCodeDetailList'].push($.extend(true,{},news));
                    //this.$set($barCodeDetail['barCodeDetailList'],i, news);
                    This.$nextTick(()=>{
                        this.$refs['certificateType'+i][0].reset();
                    });
                }
            }
            if(Number(item.number) > $barCodeDetail['barCodeDetailList'].length-count){
                let $length = Number(item.number)-($barCodeDetail['barCodeDetailList'].length-count);
                let index = $barCodeDetail['barCodeDetailList'].length-count;
                for (let i = 0; i < $length; i++) {
                    $barCodeDetail['barCodeDetailList'].push($.extend(true,{},news));
                    This.$nextTick(()=>{
                        this.$refs['certificateType'+(i+index)][0].reset();
                    });
                }
            }
            if(Number(item.number) < $barCodeDetail['barCodeDetailList'].length-count){

                $barCodeDetail['barCodeDetailList']
                    .filter((p,index) => index >= Number(item.number))
                    .forEach(p1 => p1.isDel = 0);

                $barCodeDetail['barCodeDetailList'] = $barCodeDetail['barCodeDetailList']
                    .filter(p => p.goodsBarcode);

            }
            console.log($barCodeDetail['barCodeDetailList']);
            This.tabVal = "name2";
            This.$forceUpdate();
            // This.$nextTick(()=>{
            //     this.getSelect('table-responsive','goods-child');
            // })
        },
        tabsSwitch(tab){
            let This = this;
            This.tabVal = tab;
            if(tab === 'name1'){
                if(This.productDetailList[This.selectedIndex].goodsMainType !== 'attr_ranges_gold'){
                    let $weight = 0;
                    math.config({
                        number: 'BigNumber'
                    });
                    This.productDetailList[This.selectedIndex].barCodeDetailList.forEach((item) =>{
                        $weight = math.add($weight,Number(item.totalWeight));
                    })
                    This.productDetailList[This.selectedIndex].weight = $weight;
                }
            }

            this.$nextTick(()=>{
                this.getSelect('table-responsive','goods');
            })
        },
        countWeight(){

            let This = this;

            if(ht.util.hasValue(This.productDetailList, "array")){
                This.productDetailList
                    .filter(detail => detail.goodsMainType !== 'attr_ranges_gold')
                    .forEach(p => {
                        if(ht.util.hasValue(p.barCodeDetailList, "array")){
                            let $weight = 0;
                            math.config({
                                number: 'BigNumber'
                            });
                            p.barCodeDetailList.forEach((item) =>{
                                $weight = math.add($weight,Number(item.totalWeight));
                            })
                            p.weight = $weight;
                        }
                    });
            }

        },
        //获取商品类型
        loadProductType(){
            let This = this;
            $.ajax({
                type: "post",
                url: contextPath+'/entrustMaterialInController/queryStyleCategory',
                dataType: "json",
                success: function (data) {
                    This.categoryType = This.initGoodCategory(data.data.cateLists)
                },
                error: function () {
                    This.$Message.error({content:'服务器出错啦',title:"提示"});
                }
            })
        },
        //监听商品类型内容改变,根据商品分类id
        changeproductTypeName(selectedData,arr){
            this.htHaveChange = true
            let This = this;
            if(selectedData){
                //获取商品分类名称
                This.entrustMaterialInInfo.customCode = '0.'+selectedData.join(".")+'.';
                This.entrustMaterialInInfo.groupPath = '0.'+selectedData.join(".")+'.';
            }
            if(ht.util.hasValue(arr, "array")){
                This.entrustMaterialInInfo.goodsTypeName = arr[arr.length-1]['label'];
            }

            if(ht.util.hasValue(This.productId, "array")){

                This.$Modal.confirm({
                    content: '修改商品类型会清空商品简述和商品明细列表的所有数据，是否确定修改？',
                    onOk:function () {
                        if(ht.util.hasValue(This.productDetailList, "array")){
                            This.productDetailList.forEach((item,index) => {
                                item.isDel = 0;
                                if(item.barCodeDetailList){
                                    item.barCodeDetailList.forEach(item1 => {
                                        item1.isDel = 0;
                                    });
                                }
                            });
                            This.productDetailList = This.productDetailList
                                .filter(p => p.id)
                                .map(i => i.barCodeDetailList.filter(a => a.id));

                        }
                    }
                });
            }

        },
        initGoodCategory(type) {
            let result = [];
            type.forEach((item) => {
                let {
                    id: value,
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
        getSelectedItem(data, index) {//获取选中的那条数据
            let This = this;


            let res = data.data;

            res.countingUnit = This.unitList[res.countUnitId];
            res.weightUnit = This.unitList[res.weightUnitId];
            $.extend(true,This.productDetailList[index], {
                goodsNo: res.code,
                goodsName: res.name,
                commodityId: res.id,
                goodsNorm: res.specification,
                countingUnit: res.countUnitId,
                weightUnit: res.weightUnitId,
                goodsMainType: res.mainType,
                custStyleCode: res.styleCustomCode,
                styleCategoryId: res.styleCategoryId,
                styleName: res.styleName,
                styleCustomCode: res.styleCustomCode,
                detailMark: res.detailMark,
                barCodeDetailList:[],
                batchNum:null,
                number:null,
                weight:null
            });

            if(This.productDetailList[index].detailMark == 2) {
                //不存在辅助属性
                let myAttr = { //组成属性
                    commodityId: This.productDetailList[index].commodityId,
                    goodsCode: This.productDetailList[index].goodsNo,
                    name: This.productDetailList[index].goodsName,
                    partAttrs: []
                };
                Object.assign(This.productDetailList[index], {
                    stonesParts: [],
                    goldParts: [],
                    partParts: [],
                    materialParts: [myAttr],
                });
            }

            This.productDetailList[index].countingUnitName = res.countingUnit;
            This.productDetailList[index].weightUnitName = res.weightUnit;
            if(res.frontPic){
                This.productDetailList[index].pictureUrl = res.frontPic.fdUrl;
            }else{
                This.productDetailList[index].pictureUrl = null;
            }

            if (res.mainType === 'attr_ranges_gold') {
                //This.productDetailList[index].goldColor = res.certificateType;
                This.productDetailList[index].number = '';
                This.isEditNumber = true;
            }else {
                This.isEditNumber = false;
            }

            This.$forceUpdate();
        },
       /* getInputValue(value, index) {//获取商品编码输入框输入的值

            let This = this;
            let params = {
                categoryCustomCode: This.entrustMaterialInInfo.customCode,
                field: value, //value, A11  AABc009
                limit: ''
            };
            $.ajax({
                type: "post",
                url: contextPath + '/tbasecommodity/findByType',
                data: params,
                dataType: "json",
                success: function (data) {
                    Object.assign(This.productDetailList[index], {options: data.data});
                    This.$forceUpdate();
                },
                error: function () {
                    This.$Modal.error({content:'服务器出错啦',title:"提示"});
                }
            })
        },*/
        //获取客户
        /*getCust(){
            let This = this;
            $.ajax({
                type: "post",
                url: contextPath+'/entrustMaterialInController/queryAllCustomer',
                contentType: 'application/json',
                dataType: "json",
                success: function (data) {
                    console.log("客户",data)
                    This.custList = data.data;
                },
                error: function () {
                    This.$Modal.warning({content:'服务器出错啦',title:"提示信息"});
                }
            })
        },*/
        //获取业务员
        getSalesman(){
            let This = this;
            $.ajax({
                type: "post",
                url: contextPath+'/entrustMaterialInController/queryAllEmpByOrganId',
                contentType: 'application/json',
                dataType: "json",
                success: function (data) {
                    console.log("业务员",data)
                    This.salesmanList = data.data;
                },
                error: function () {
                    This.$Modal.warning({content:'服务器出错啦',title:"提示信息"});
                }
            })
        },

        //获取计数单位组和计重单位组
        getUnitGroup(){
            let This = this;
            $.ajax({
                type: "post",
                url: contextPath+'/tbaseunit/list',
                dataType: "json",
                success: function (data) {
                    if (data.code === "100100") {
                        let res =data.data;
                        res.map(item=>{
                            let keyStr = item.id;
                            let value = item.name;
                            This.unitList[keyStr] =value;
                        })
                    }
                },
                error: function () {
                    This.$Modal.warning({content:'服务器出错啦',title:"提示信息"});
                }
            })
        },
        //获取仓库组
        getWareHouseGroup(){
            let This = this;
            $.ajax({
                type: "post",
                url: contextPath+'/wareHouse/listByTypeAndOrganizationId',
                data:{"type":4},
                dataType: "json",
                success: function (data) {
                    if (data.code === "100100") {
                        console.log("仓库组",data.data)
                        This.warehouseList = data.data;
                        This.getRepertoryPositionGroup(1)
                    }
                },
                error: function () {
                    This.$Modal.warning({content:'服务器出错啦',title:"提示信息"});
                }
            })
        },
        //获取库位组
        getRepertoryPositionGroup(groupId){
            let This = this;
            $.ajax({
                type: "post",
                url: contextPath+'/tbaserepertoryposition/listbygroup/' + groupId,
                dataType: "json",
                success: function (data) {
                    if (data.code === "100100") {
                        console.log("库位组",data.data)
                        This.reservoirPositionList = data.data;
                    }
                },
                error: function () {
                    This.$Modal.warning({content:'服务器出错啦',title:"提示信息"});
                }
            })
        },
        getAttrToName(){
            //获取业务员name
            if(this.salesmanList){
                this.salesmanList.forEach((item) => {
                    if (item.id == this.entrustMaterialInInfo.salesmanId) {
                        this.entrustMaterialInInfo.salesmanName = item.empName;
                    }
                });
            }
        },
        getCustName(value){
            console.log(value);
            let This = this;
            $.ajax({
                type: "post",
                url: contextPath+'/entrustMaterialInController/info/'+value,
                contentType: 'application/json',
                dataType: "json",
                success: function (data) {
                    console.log("客户信息",data)
                    let $custInfo = data.data;
                    if($custInfo.wareHouse){
                        This.defWareHouse = $custInfo.wareHouse;
                        if(This.productDetailList){
                            This.productDetailList.forEach(p =>{
                                console.log($custInfo.wareHouse);
                                p.warehouseId = $custInfo.wareHouse;
                            });
                        }
                    }


                    if(!This.isCustId){
                        $custInfo.contacts.forEach((item) => {
                            if(item.isDefault === 1 && item.type === 1){
                                This.entrustMaterialInInfo.email = item.email;
                                This.entrustMaterialInInfo.name = item.name;
                                This.entrustMaterialInInfo.phone = item.phone;
                                This.entrustMaterialInInfo.weChartNo = item.wechat;
                            }
                        })

                        This.entrustMaterialInInfo.postalcode = $custInfo.zipCode;
                        This.entrustMaterialInInfo.address = $custInfo.concreteAddress;
                        This.entrustMaterialInInfo.region = This.getAreaName($custInfo.area);
                    }
                },
                error: function () {
                    This.$Modal.warning({content:'服务器出错啦',title:"提示信息"});
                }
            })
        },
        getAreaName(value){
            switch (value){
                case '1':return '东北';break;
                case '2':return '华北';break;
                case '3':return '华中';break;
                case '4':return '华东';break;
                case '5':return '华南';break;
                case '6':return '西北';break;
                case '7':return '西南';break;
                default:return '';
            }
        },
        add(){
            window.parent.activeEvent({name: ';', url: contextPath+'/warehouse/entrust-material-in/entrust-material-in-info.html',params: {type:0}});
        },
        save(){

            let This = this;

            if(!This.validateProduct()){
                return false;
            }

            if(!This.validateBarcodeProduct()){
                return false;
            }

            This.getAttrToName();
            This.countWeight();

            let pro = This.handlerDataToPost();
            console.log("要传入后台的数据结构：",pro);

            let barCode = This.barCodeHandlerDataToPost();
            console.log("要传入后台的条码数据结构：",barCode);


            if(This.entrustMaterialInInfo.documentStatus === 2 || This.entrustMaterialInInfo.documentStatus === 4 ||
                This.entrustMaterialInInfo.documentStatus === 3){
                This.$Modal.warning({
                    content: '受托加工材料入库单已提交!',
                    title:'提示信息'
                });
                return false;
            }

            let url = "";
            if(!This.entrustMaterialInInfo.documentNo){
                This.entrustMaterialInInfo.documentStatus = 1;
                url = contextPath+"/entrustMaterialInController/saveToExistCode";
            }else{
                url = contextPath+"/entrustMaterialInController/updateToExistCode";
            }
            window.top.home.loading('show')
            $.ajax({
                type: "POST",
                url: url,
                contentType: 'application/json;charset=utf-8',
                data: JSON.stringify(This.entrustMaterialInInfo),
                async: false,
                dataType: "json",
                success: function(data) {
                    window.top.home.loading('hide');
                    This.htHaveChange = false;
                    if(data.code === "100100") {
                        if(data.data){
                            This.entrustMaterialInInfo.documentNo = data.data.documentNo;
                            // 调用方法保存附件
                            This.saveAccess(data.data.documentNo,This.boeType);
                            This.getEntrustMaterialIn();
                            This.$Modal.success({
                                content: '保存成功!',
                                title:'提示信息'
                            });
                            return false;
                        }
                    }
                    This.$Modal.warning({
                        content: '保存失败!',
                        title:'提示信息'
                    });
                },
                error: function(err){
                    window.top.home.loading('hide');
                    This.$Modal.warning({content:'服务器出错啦',title:"提示信息"});
                }
            })
        },
        //表格内输入小数
        clearNoNumber(item,type,floor){
            console.log(item,type,floor)
            return htInputNumber(item,type,floor);
        },
        checkHasBarcodeInfo(){
            let This = this;
            let mark = true;
            This.productDetailList.forEach((item,index) =>{
                if(item.barCodeDetailList && item.barCodeDetailList.length === 0 && item.goodsMainType !== 'attr_ranges_gold'){
                    mark = false;
                    This.$Modal.info({
                        title:'提示信息',
                        content:'请填写第'+(index+1)+'行商品简述的商品条码明细页签信息!'
                    })

                    return false;
                }
            })
            return mark;
        },
        submit(name){
            let This = this;
            let isFormPass = '';
            this.$refs[name].validate((valid) => {
                if (valid) {
                    isFormPass = true;
                } else {
                    isFormPass = false;
                }
            })
            // let obj = {
            //     // "业务类型": this.entrustMaterialInInfo.businessType,
            //     // "商品类型": this.productId,
            //     "日期": this.entrustMaterialInInfo.documentTime,
            //     "客户": this.entrustMaterialInInfo.custId,
            //     "商品类型":this.entrustMaterialInInfo.goodsTypeName
            // };
            // if ($('form').valid() === false) {
            //     this.$Modal.warning({
            //         title: '提示信息',
            //         content: '<p>请填写必填项!</p >'
            //     });
            //     return;
            // } else {
            //     if (!this.checkForm(obj, true));
            // }
            if(!isFormPass){
                return false;
            }

            //校验是否添加商品简述信息
            if(!This.productDetailList || This.productDetailList.length === 0){
                This.$Modal.info({title:'提示信息',content:'请填写商品简述信息!'})
                return false;
            }

            This.countWeight();

            //校验商品简述信息是否填写完善
            if(This.tableValidate()){
                return false;
            }

            //检验商品简述页签的商品明细
            if(!This.validateProduct()){
                return false;
            }

            console.log(!This.checkHasBarcodeInfo());
            //校验是否生成了商品明细信息
            if(!This.checkHasBarcodeInfo()){
                return false;
            }

            //检验商品条码信息是否填写完整
            if(!This.checkBarcodeInfo()){
                return false;
            }

            //校验商品条码中的商品明细
            if(!This.validateBarcodeProduct()){
                return false;
            }

            This.getAttrToName();


            let pro = This.handlerDataToPost();
            console.log("要传入后台的数据结构：",pro);

            let barCode = This.barCodeHandlerDataToPost();
            console.log("要传入后台的条码数据结构：",barCode);

            if(This.entrustMaterialInInfo.documentStatus === 2 || This.entrustMaterialInInfo.documentStatus === 4 ||
                This.entrustMaterialInInfo.documentStatus === 3){
                This.$Modal.warning({
                    content: '受托加工材料入库单已提交!',
                    title:'提示信息'
                });
                return false;
            }

            window.top.home.loading('show');

            let idList = [];

            if(This.entrustMaterialInInfo.goodList){
                This.entrustMaterialInInfo.goodList
                    .filter(p=> p.collectGoodId)
                    .forEach(item => {
                        idList.push(item.collectGoodId);
                    });
            }

            if (ht.util.hasValue(idList, "array")) {
                var getResult = $.ajax({
                    type: "post",
                    url: contextPath + '/entrustMaterialInController/queryStorageStatus?sourceType='+This.productDetailList[0].sourceType,
                    data: JSON.stringify(idList),
                    contentType: 'application/json',
                    dataType: "json",
                    success:function () {
                        this.htHaveChange = false;
                        window.top.home.loading('hide');
                    },
                    error: function () {
                        This.$Modal.warning({content:'服务器出错啦',title:"提示信息"});
                    }
                })
                var getResult1 = getResult.then((getResult)=> {
                    if (getResult.code === "100100") {

                        if (getResult.data === 0) {
                            This.submitHandler();
                        }else{
                            This.$Modal.warning({
                                content: '商品已提交，请勿重复提交!',
                                title:'提示信息'
                            });
                        }
                    }
                });
                return false;
            }
            This.submitHandler();
        },


        // 校验表单必填项
        checkForm(obj, flag) {
            for (var key in obj) {
                if (!obj[key]) {
                    if (flag) {
                        this.$Modal.info({
                            title: "提示信息",
                            okText: "确定",
                            content: key + "不能为空"
                        });
                    }
                    return false;
                }
            }
            return true;
        },
        submitHandler(){
            let This = this;
            This.entrustMaterialInInfo.documentStatus = 2;
            let url = "";
            if(!This.entrustMaterialInInfo.documentNo){
                url = contextPath+"/entrustMaterialInController/saveToExistCode";
            }else{
                url = contextPath+"/entrustMaterialInController/updateToExistCode";
            }
            //发送请求
            $.ajax({
                type: "POST",
                url: url,
                contentType: 'application/json',
                data: JSON.stringify(This.entrustMaterialInInfo),
                dataType: "json",
                success: function(data) {
                    if(data.code === "100100") {
                        This.entrustMaterialInInfo.documentNo = data.data.documentNo;
                        This.saveAccess(data.data.documentNo,This.boeType);
                        This.getEntrustMaterialIn();
                        This.$Modal.success({
                            content: '提交成功!',
                            title:'提示信息'
                        });
                        window.top.home.loading('hide');
                        return false;
                    }
                    This.$Modal.warning({
                        content: '提交失败!',
                        title:'提示信息'
                    });
                    window.top.home.loading('hide');
                },
                error: function(err){
                    window.top.home.loading('hide');
                    This.$Modal.warning({content:'服务器出错啦',title:"提示信息"});
                }
            })
        },
        //获取组织id和组织name
        getOrgan() {
            let This = this;
            window.top.home.loading('show');
            $.ajax({
                type: "post",
                url: contextPath + '/entrustMaterialInController/getOrgName',
                dataType: "json",
                success: function (data) {
                    window.top.home.loading('hide');
                    if (data.code === "100100") {

                        This.entrustMaterialInInfo.organizationName = data.data.name;
                        This.entrustMaterialInInfo.organizationId = data.data.id;
                        This.$forceUpdate();

                    }else if ('-1' === data.code){
                        This.$Modal.warning({
                            title: '提示信息',
                            content: '服务器出错啦!',
                        });
                        return false;
                    }
                },
                error: function () {
                    window.top.home.loading('hide');
                    This.$Modal.warning({content:"服务器出错啦", title:"提示信息"});
                }
            })
        },
        getDetailToOldMaterial(data){
            let This = this;
            $.ajax({
                type: "POST",
                url: contextPath+"/entrustMaterialInController/queryOldMaterialGoodsByIds",
                contentType: 'application/json;charset=utf-8',
                data: JSON.stringify(data.goodsIds),
                dataType: "json",
                success: function(data) {
                    if(data.code === "100100") {
                        console.log(data.data);
                        if(data.data){
                            let $info = data.data[0];

                            let $entrustInfo = $.extend(true,This.entrustMaterialInInfo,{
                                customCode: $info.goodsTypePath,
                                goodsTypeName: $info.goodsTypeName,
                                //groupPath: $info.goodsTypePath,
                                custId: $info.customerId,
                                custCode: '',
                                custName: $info.customerName,
                                documentStatus: 1,
                                isDel:1,
                                goodList:data.data.map(function (item) {
                                    return $.extend(true,{},{
                                        collectGoodId:item.goodsId,
                                        sourceNo:item.orderNo,
                                        sourceType:'O_MATERIALS_RECYCLE',
                                        commodityId:item.commodityId,
                                        goodsNo:item.goodsNo,
                                        goodsMainType: item.goodsMainType,
                                        goodsName: item.goodsName,
                                        pictureUrl: item.pictureUrl,
                                        batchNum:item.batchNumber,
                                        countingUnitName: item.countingUnit,
                                        countingUnitId: item.countingUnitId,
                                        number:item.count/*(item.qualifiedNumber+item.releaseNumber)*/,
                                        weightUnitName: item.weightUnit,
                                        weightUnitId: item.weightUnitId,
                                        warehouseId:This.defWareHouse || '',
                                        goodsNorm:item.specification,
                                        custStyleCode:item.custStyleCode,
                                        goodList:[],
                                        isDel:1
                                    });
                                })
                            });
                            console.log($entrustInfo);
                            if($info.goodsTypePath){
                                This.entrustMaterialInInfo.groupPath = $info.goodsTypePath;
                                let productArr = $info.goodsTypePath.substr(2).replace(/.$/gi,"").split(".");
                                This.productId = productArr.map(p=>parseInt(p));
                            }

                            This.entrustMaterialInInfo = $entrustInfo;
                            This.$refs.customerRef.loadCustomerList(This.entrustMaterialInInfo.custName, This.entrustMaterialInInfo.custId);
                            if($entrustInfo.goodList){
                                This.productDetailList = $entrustInfo.goodList;
                                $entrustInfo.goodList.forEach((item,index)=>{
                                    This.productDetailList[index].barCodeDetailList = item.goodList
                                });
                            }else{
                                This.productDetailList = [];
                            }
                            This.isEditInput = true;
                            This.isClearable = false;
                            This.isMenu = false;
                            This.isUpdate = true;
                            This.isDisable = true;
                            This.isEditNumber = true;
                        }
                    }
                },
                error: function(err){
                    This.$Modal.warning({content:'服务器出错啦', title:"提示信息"});
                }
            })
        },
        getDetailBySourceNo(data){

            let This = this;
            $.ajax({
                type: "POST",
                url: contextPath+"/entrustMaterialInController/getPengdingGoods",
                contentType: 'application/json;charset=utf-8',
                data: JSON.stringify(data),
                dataType: "json",
                success: function(data) {
                    if(data.code === "100100") {
                        if(data.data){
                            //console.log(data.data);
                            let $info = data.data[0];
                            let collectGoods = [];
                            data.data.forEach((item) => {
                                item.collectGoods.forEach((item1) =>{
                                    item1.orderId = item.orderNo;
                                    collectGoods.push(item1);
                                })
                            })
                            console.log(collectGoods);

                            let $entrustInfo = $.extend(true,This.entrustMaterialInInfo,{
                                customCode: $info.goodsTypePath,
                                goodsTypeName: $info.goodsTypeName,
                                //groupPath: $info.goodsTypePath,
                                custId: $info.customerId,
                                custCode: '',
                                custName: $info.customerName,
                                documentStatus: 1,
                                isDel:1,
                                goodList:collectGoods.map(function (item) {
                                   return $.extend(true,{},{
                                       collectGoodId:item.goodsId,
                                       sourceNo:item.orderNo,
                                       sourceType:'P_RECEIPT',
                                       commodityId:item.commodityId,
                                       goodsNo:item.goodsCode,
                                       goodsMainType: item.goodsMainType,
                                       goodsName: item.goodsName,
                                       pictureUrl: item.pictureUrl,
                                       batchNum:item.batchNumber,
                                       countingUnitName: item.countingUnit,
                                       countingUnitId: item.countingUnitId,
                                       number:(item.qualifiedNumber+item.releaseNumber),
                                       weightUnitName: item.weightUnit,
                                       weightUnitId: item.weightUnitId,
                                       warehouseId:This.defWareHouse || '',
                                       goodsNorm:item.specification,
                                       custStyleCode:item.custStyleCode,
                                       goodList:[],
                                       isDel:1
                                   });
                                })
                            });
                            console.log($entrustInfo);
                            if($info.goodsTypePath){
                                This.entrustMaterialInInfo.groupPath = $info.goodsTypePath;
                                let productArr = $info.goodsTypePath.substr(2).replace(/.$/gi,"").split(".");
                                This.productId = productArr.map(p=>parseInt(p));
                            }

                            This.entrustMaterialInInfo = $entrustInfo;
                            This.$refs.customerRef.loadCustomerList(This.entrustMaterialInInfo.custName, This.entrustMaterialInInfo.custId);
                            if($entrustInfo.goodList){
                                This.productDetailList = $entrustInfo.goodList;
                                $entrustInfo.goodList.forEach((item,index)=>{
                                    This.productDetailList[index].barCodeDetailList = item.goodList
                                });
                            }else{
                                This.productDetailList = [];
                            }
                            This.isEditInput = true;
                            This.isClearable = false;
                            This.isMenu = false;
                            This.isUpdate = true;
                            This.isDisable = true;
                            This.isEditNumber = true;
                        }
                    }
                },
                error: function(err){
                    This.$Modal.warning({content:'服务器出错啦', title:"提示信息"});
                }
            })
        },
        getEntrustMaterialIn(){
            let This = this;

            let $param = This.params;
            let obj = {};
            if(!$.isEmptyObject($param)){
                if($param.params.type === 0){
                    if($param.params.type === 0 && This.entrustMaterialInInfo.documentNo){
                        obj = {"documentNo":This.entrustMaterialInInfo.documentNo};
                    }else{
                        This.getOrgan();
                        This.isEdit('Y');
                        This.$refs.customerRef.loadCustomerList('', '');
                        return false;
                    }
                }
                if($param.params.type === 1){

                    obj = {"id":$param.params.data};
                }
                if($param.params.type === 2){
                    obj = {"documentNo":$param.params.data};

                }
                if($param.params.type === 3 && !This.entrustMaterialInInfo.documentNo){
                    if($param.params.sourceType === 'S_CUST_MATERIAL'){
                        This.getDetailBySourceNo($param.params.data);
                    }
                    if($param.params.sourceType === 'O_MATERIALS_RECYCLE'){
                        This.getDetailToOldMaterial($param.params.data)
                    }
                    This.isEdit('Y');
                    This.getOrgan();
                    //This.$refs.customerRef.loadCustomerList(This.entrustMaterialInInfo.custName, This.entrustMaterialInInfo.custId);
                    return false;
                }
                if($param.params.type === 3 && This.entrustMaterialInInfo.documentNo){
                    obj = {"documentNo":This.entrustMaterialInInfo.documentNo};
                }

            }
            $.ajax({
                type: "POST",
                url: contextPath+"/entrustMaterialInController/getEntrustMaterialIn",
                contentType: 'application/json;charset=utf-8',
                data: JSON.stringify(obj),
                dataType: "json",
                success: function(data) {
                    if(data.code === "100100") {
                        if(!data.data.goodList){
                            data.data.goodList = [];
                        }
                        let len = data.data.goodList.length;
                        if(len > 0) {
                            data.data.goodList.forEach((item) => {
                                if (!item.goodList) {
                                    item.goodList = [];
                                }else{
                                    item.goodList.forEach((item) => item.number = 1);
                                }
                            });
                        }
                        This.entrustMaterialInInfo = data.data;
                        This.$refs.customerRef.loadCustomerList(This.entrustMaterialInInfo.custName, This.entrustMaterialInInfo.custId);
                        if(len > 0){

                            This.productDetailList = data.data.goodList;
                            data.data.goodList.forEach((item,index)=>{
                                This.productDetailList[index].barCodeDetailList = item.goodList
                            });
                        }else{
                            This.productDetailList = [];
                        }
                        This.getAccess(data.data.documentNo,This.boeType);
                        This.isEdit('Y');
                        This.isCustId = data.data.custId;
                        if(data.data.customCode){
                            let productArr = data.data.customCode.substr(2).replace(/.$/gi,"").split(".");
                            This.productId = productArr.map(p=>parseInt(p));
                        }
                        if(data.data.documentStatus === 1){
                            This.isEditInput = false;
                            This.isEditDate = false;
                            This.isOpened = false;
                            This.isClearable = true;
                            This.isEditRemark = false;
                            This.isEditSalesman = false;
                            This.isMenu = true;
                            This.isUpdate = false;
                            This.isEditTable = false;
                            This.isDisable = false;
                            This.isEditNumber = false;
                            This.isEdit('Y');
                            $(".is-disabled:gt(0):lt(2)").css("pointer-events","auto").css({"color":"#495060"});

                        }
                        if(data.data.documentStatus !== 1 || $param.params.type === 2){
                            This.isEditInput = true;
                            This.isEditDate = true;
                            This.isOpened = true;
                            This.isClearable = false;
                            This.isEditRemark = true;
                            This.isEditSalesman = true;
                            This.isMenu = false;
                            This.isUpdate = true;
                            This.isEditTable = true;
                            This.isDisable = true;
                            This.isEditNumber = true;
                            This.isEdit('N');
                            $(".is-disabled:gt(0):lt(2)").css("pointer-events","none").css({"color":"#bbbec4"});
                        }

                        if($param.params.type === 2){
                            $(".is-disabled").css("pointer-events","none").css({"color":"#bbbec4"});
                        }
                        if(data.data.documentStatus === 4){
                            This.isStampShow = true;
                        }else{
                            This.isStampShow = false;
                        }

                        if(data.data.goodList && data.data.goodList.length > 0 && data.data.goodList[0].sourceNo){
                            This.isEditInput = true;
                            This.isMenu = false;
                            This.isUpdate = true;
                            This.isDisable = true;
                            This.isEditNumber = true;
                        }
                        This.getOrgan();
                    }
                },
                error: function(err){
                    This.$Modal.warning({content:'服务器出错啦', title:"提示信息"});
                }
            })
        },
        list(){
            window.parent.activeEvent({name: '受托加工材料入库单-列表', url: contextPath+'/warehouse/entrust-material-in/entrust-material-in-list.html'});
        },
        handlerClose(){
            let _params = this.params;
            if(_params.params.type !== 2 && ((!this.entrustMaterialInInfo.documentStatus ||
                this.entrustMaterialInInfo.documentStatus === 1) && (this.htHaveChange || accessVm.htHaveChange))){
                this.$nextTick(()=>{
                    this.$refs.closeModalRef.showCloseModal();
                });
                return false;
            }
            return true;
        },
        closeModal(type){
            if(type === 'yes'){//提交数据
                this.save();
                this.exit(true);
            }else if(type === 'no'){//关闭页面
                this.exit(true);
            }
        },
        exit(close){

            if(close === true){
                window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
                return false;
            }
            if(this.handlerClose()){
                window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
            }
        },
        //验证表格内容是否为空
        tableValidate(){
            let This = this;
            let validate = {
                goodsNo:{
                    name: '商品编码',
                    type: 'string'
                },
                number:{
                    name: '数量',
                    type: 'number',
                    empty: true
                },
                weight:{
                    name: '总量',
                    type: 'number',
                    floor: 3
                },
                warehouseId:{
                    name: '仓库',
                    type: 'number'
                }/*,
                reservoirPositionId:{
                    name: '库位',
                    type: 'number'
                }*/
            };
            return htValidateRow(this.productDetailList, validate, true, this);
        }
    },
    mounted() {
        this.$nextTick(()=>{
            this.getSelect('table-responsive','goods')
            this.loadProductType();
            this.getSalesman();
            this.getWareHouseGroup();
            this.getUnitGroup();

            //this.getDetailBySourceNo();
            this.getEntrustMaterialIn();

            this.openTime = window.parent.params.openTime;
        });

        // $("form").validate();
    },
    created(){
        let This = this;
        let $param = window.parent.params;
        This.params = $param;
        window.handlerClose = this.handlerClose;
        // This.productDetailList[0].goodsNo = '';
        This.certifiTypes = getCodeList('base_certificate_type');
    },
    watch:{
        "entrustMaterialInInfo.custId":function () {
            console.log(this.entrustMaterialInInfo.custId,this.isCustId);
            if(this.entrustMaterialInInfo.custId){
                this.getCustName(this.entrustMaterialInInfo.custId);
            }
        }
    }
})