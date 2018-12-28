function tip(type,msg,options) {
    let config = Object.assign({title:'提示信息',content:msg},options || {});
    switch (type){
        case 'info':
            vm.$Modal.info(config);
            break;
        case 'warning':
            vm.$Modal.warning(config);
            break;
        case 'success':
            vm.$Modal.success(config);
            break;
    }
}
var vm = new Vue({
    el: "#app",
    data: {
        isSearchHide: true,
        isTabulationHide: true,
        goodsList:[],
        inputBarCode:"",
        openType:'',
        pendingRecordGoodList:[],
        selectedIndex:'',
        productDetailModal: {
            showModal: false,
            ids: {
                goodsId: '',
                commodityId: '',
                documentType: 'W_STOCK_IN'
            }
        },
        planForm:{
            custStyleType: '',
            custStyleTypeName: '',
            dispalySkuWeight: '',
            displaySkuNum: '',
            documentName: '',
            documentNo: '',
            documentStatus: '',
            goodsTypeCode: '',
            goodsTypeName: '',
            id: '',
            inventoryType: '',
            invertoryTime: '',
            invertoryUserId: '',
            invertoryUserName: '',
            isDel: '',
            numDefault: '',
            organizationId: '',
            warehouseId: '',
            warehouseName: '',
            weightDefault: '',
        },
        toInventoryPlans:[],
    },
    methods:{
        //删除行
        delRow(){
           let _this = this;
           if(_this.selectedIndex === ''){
               tip('info','请先选中一条数据!');
               return false;
           }
           if(_this.goodsList[_this.selectedIndex].goodsMainType === 'attr_ranges_gold'){
               tip('info','金料不可删除!');
               return false;
           }
            _this.$Modal.confirm({
                title: '提示信息',
                content: '确定删除选中数据吗?',
                onOk    : function () {
                    _this.goodsList.splice(_this.selectedIndex,1);
                }
            });

        },
        //点击商品明细
        showProductDetail(index) {//点击商品明细
            let _this = this;
            _this.selectedIndex = index;
            if(_this.goodsList[index].goodsMainType === 'attr_ranges_gold'){
                return false;
            }
            //固定开始
            let ids = {
                goodsId: _this.goodsList[index].goodsId,
                commodityId: _this.goodsList[index].commodityId,
                documentType: 'W_STOCK_IN'
            };
            Object.assign(_this.productDetailModal, {
                showModal: true,
                ids: ids
            });
            _this.$nextTick(() => {
                _this.$refs.modalRef.getProductDetail();
            });
            //固定结束
        },
        //输入条码号回车事件
        enterHandle(){
            const  reg =/^\d{8}$/;
            if(!this.planForm.documentNo){
                tip('info','请先选择盘点方案!');
                return false;
            }
            if(!reg.test(this.inputBarCode)){
                tip('info','条码格式不正确!');
                this.resetInputBarCode();
                return false;
            }
            let existInCurrentGoodList = vm.goodsList.some(item=>item.goodsBarCode === this.inputBarCode);
            if(existInCurrentGoodList){
                tip('info','输入的条码重复!');
                this.resetInputBarCode();
                return false;
            }
            let pendingIdx = this.pendingRecordGoodList.findIndex(item=>item.goodsBarCode === this.inputBarCode);
            if(pendingIdx !== -1){
                this.goodsList.push(this.pendingRecordGoodList[pendingIdx]);
                this.resetInputBarCode();
            }else {
                this.extraGoodsHandle(this.inputBarCode);
            }

        },
        //在盘点范围内的在库状态条码列表中 没找到输入的条码号时的处理
        extraGoodsHandle(code){
            let _this = this;
            $.ajax({
                url:contextPath+'/inventorydata/queryOutBarCodeGoods?goodsBarCode='+code,
                method:'POST',
                dataType:'json',
                contentType:'application/json;charset=utf-8',
                data:JSON.stringify(_this.planForm),
                success:function (res) {
                    if (res.code === '100100' && res.data.length > 0 ){
                        let goods = res.data[0];
                        if(_this.planForm.weightDefault === 0){
                            goods.inventoryWeight = '';
                        }else if(_this.planForm.weightDefault === 1){
                            goods.inventoryWeight = goods.accountWeight;
                        }
                        if(_this.planForm.numDefault === 0){
                            goods.inventoryNum = '';
                        }else if(_this.planForm.numDefault === 1){
                            goods.inventoryNum = goods.accountNum;
                        }
                        _this.goodsList.push(goods);
                        _this.resetInputBarCode();
                    }else if(res.code === '100100' && res.data.length === 0){
                        tip('warning','输入的条码号不在盘点范围内!');
                        _this.resetInputBarCode();
                    }
                }
            });
        },
        //重置条码输入框
        resetInputBarCode(){
            this.inputBarCode = '';
            this.$refs.inputBarCode.focus();
        },
        //获取盘点范围内的金料
        getGoldGoods(){
            let _this = this;
          $.ajax({
              url:contextPath+'/inventorydata/queryGoldGoods',
              method:'POST',
              dataType:'json',
              contentType:'application/json;charset=utf-8',
              data:JSON.stringify(_this.planForm),
              success:function (res) {
                  if (res.code === '100100' ){
                      _this.goodsList = [];
                      (res.data || []).forEach((item)=>{
                          if(_this.planForm.weightDefault === 0){
                              item.inventoryWeight = '';
                          }else if(_this.planForm.weightDefault === 1){
                              item.inventoryWeight = item.accountWeight;
                          }
                          _this.goodsList.unshift(item);
                      });
                  }
              }
          });
        },
        //获取盘点范围内所有的处于在库状态的条码商品信息
        getPendingReordGoods(){
            let _this = this;
            $.ajax({
                url:contextPath+'/inventorydata/queryBarCodeGoods',
                method:'POST',
                dataType:'json',
                contentType:'application/json;charset=utf-8',
                data:JSON.stringify(_this.planForm),
                success:function (res) {
                    if (res.code === '100100'){
                        _this.pendingRecordGoodList = (res.data || []).map(item=>{
                            if(_this.planForm.weightDefault === 0){
                                item.inventoryWeight = '';
                            }else if(_this.planForm.weightDefault === 1){
                                item.inventoryWeight = item.accountWeight;
                            }
                            if(_this.planForm.numDefault === 0){
                                item.inventoryNum = '';
                            }else if(_this.planForm.numDefault === 1){
                                item.inventoryNum = item.accountNum;
                            }
                            return item;
                        });
                    }
                }
            });
        },
        //获取盘点范围内所有的处于在库状态的条码商品信息
        querySavedInventoryDatas(){
            let _this = this;
            $.ajax({
                url:contextPath+'/inventorydata/querySavedInventoryDatas',
                method:'POST',
                dataType:'json',
                data:{planId:_this.planForm.id},
                success:function (res) {
                    if (res.code === '100100'){
                        _this.goodsList = (res.data || []);
                    }
                }
            });
        },
        //获取所有的可以录入/查看盘点数据的盘点方案列表
        getToInventoryPlans(){
            let _this = this;
            $.ajax({
                url:contextPath+'/inventorydata/queryToInventoryPlan',
                method:'POST',
                dataType:'json',
                contentType:'application/json;charset=utf-8',
                data:{},
                success:function (res) {
                    if (res.code === '100100' && res.data.length > 0 ){
                        _this.toInventoryPlans = res.data;
                    }
                }
            });
        },
        //盘点方案下拉框 change事件
        changePlanNo(code){
            let _this=this;

            console.log(code,_this.toInventoryPlans.find(item=>item.documentNo === code));
            let _planForm = _this.toInventoryPlans.find(item=>item.documentNo === code);
            _this.planForm.custStyleType = _planForm.custStyleType;
            _this.planForm.custStyleTypeName = _planForm.custStyleTypeName;
            _this.planForm.dispalySkuWeight = _planForm.dispalySkuWeight;
            _this.planForm.displaySkuNum = _planForm.displaySkuNum;
            _this.planForm.documentName = _planForm.documentName;
            _this.planForm.documentNo = _planForm.documentNo;
            _this.planForm.documentStatus = _planForm.documentStatus;
            _this.planForm.goodsTypeCode = _planForm.goodsTypeCode;
            _this.planForm.goodsTypeName = _planForm.goodsTypeName;
            _this.planForm.id = _planForm.id;
            _this.planForm.inventoryType = _planForm.inventoryType;
            _this.planForm.invertoryTime = _planForm.invertoryTime;
            _this.planForm.invertoryUserId = _planForm.invertoryUserId;
            _this.planForm.invertoryUserName = _planForm.invertoryUserName;
            _this.planForm.isDel = _planForm.isDel;
            _this.planForm.numDefault = _planForm.numDefault;
            _this.planForm.organizationId = _planForm.organizationId;
            _this.planForm.warehouseId = _planForm.warehouseId;
            _this.planForm.warehouseName = _planForm.warehouseName;
            _this.planForm.weightDefault = _planForm.weightDefault;

            //保证 值赋上后 才去重新渲染 盘点数据列表
            _this.$nextTick(()=>{
                _this.pendingRecordGoodList = [];
                _this.goodsList = [];
                _this.renderDataHandle();
            });
        },
        //清空盘点数据
        clearInventoryData(){
            let _this = this;
            _this.$Modal.confirm({
                title: '提示信息',
                content: '确定清空盘点数据吗?',
                onOk    : function () {
                  _this.$nextTick(()=>{
                      _this.goodsList = _this.goodsList.filter(item=>item.goodsMainType === 'attr_ranges_gold');
                  });
                }
            });
        },
        //盘点重量/盘点数量输入 格式化处理
        formatInputNumber(item,type,floor){
            if(type === 'inventoryNum' && item[type] == 0){
                item['inventoryWeight'] = 0;
            }
            if((type === 'inventoryNum' && item[type] > 1)
               || (type === 'inventoryNum' && item[type] < 0) ){
                item[type] = 1;
            }
            return htInputNumber(item,type,floor);
        },
        //保存
        save(){
          let _this = this;
          if(_this.validateGoodsList()){
              console.log('没有通过校验');
              return false;
          }
          this.ajaxSave('save');
        },
        //提交
        submit(){
          let _this = this;
          if(_this.validateGoodsList()){
            console.log('没有通过校验');
            return false;
          }
          let _goodsList = _this.diffGoods('submit');
          let existDiff = _goodsList.some(item=>(item.diffMark === 1 || item.diffMark === 2));
          if(existDiff){
              _this.$Modal.confirm({
                  title: '提示信息',
                  content: '盘点数据与系统数据存在差异!确定提交吗?',
                  onOk    : function () {
                      _this.ajaxSave('submit');
                  }
              });
          }else {
              _this.ajaxSave('submit');
          }
        },
        ajaxSave(type){
           let _this = this;
           let params = {};
           let planEntity =  Object.assign({},_this.planForm);
           planEntity.documentStatus = (type === 'save' ? 3:4);
           params.planEntity = planEntity;
           params.inventoryDatas = _this.diffGoods(type);
           window.top.home.loading('show',{text:(type === 'save' ? '保存':'提交')+'中，请稍后!'});
            $.ajax({
                url:contextPath+'/inventorydata/save',
                method:'POST',
                dataType:'json',
                contentType:'application/json;charset=utf-8',
                data:JSON.stringify(params),
                success:function (res) {
                    if (res.code === '100100'){
                        tip('success',(type === 'save' ? '保存':'提交')+'成功!');
                        _this.planForm.documentStatus = res.data.planEntity.documentStatus;
                        window.top.home.loading('hide');
                    }else {
                        tip('warning',res.msg);
                        window.top.home.loading('hide');
                    }
                },
                error:function (e) {
                    window.top.home.loading('hide');
                }
            });
        },
        _compareTo(inventoryW,accountW){
            return math.compare(Number(inventoryW),Number(accountW));
        },
        //校验
        validate(){
            let _this = this;
            if(_this.validateGoodsList()){
                console.log('没有通过校验');
                return false;
            }
            let _goodsList = _this.diffGoods('validate');
            let existDiff = _goodsList.some(item=>(item.diffMark === 1 || item.diffMark === 2));
            if(existDiff){
                tip('info',`盘点数据与系统数据存在差异!`);
            }else{
                tip('info',`盘点数据与账面数据一致!`);
            }
        },
        //保存或提交时,校验录入的盘点数据
        validateGoodsList(){
            let _this = this;
            if(_this.goodsList.length === 0){
                tip('info',`请先输入盘点数据!`);
                return true;
            }
            return _this.goodsList.some((item,index)=>{
                if(item.goodsMainType === 'attr_ranges_gold'){
                    if(!item.inventoryWeight){
                        tip('info',`请输入盘点数据第${index+1}行的盘点重量!`);
                        return true;
                    }
                }else {
                    if(!item.inventoryWeight){
                        tip('info',`请输入盘点数据第${index+1}行的盘点重量!`);
                        return true;
                    }
                    if(!item.inventoryNum){
                        tip('info',`请输入盘点数据第${index+1}行的盘点数量!`);
                        return true;
                    }
                }
            });
        },
        diffGoods(type = 'save'){
            let _this = this;
            let _goodsList = _this.goodsList;
            let _pendingRecordGoodList=_this.pendingRecordGoodList;
            const DIFF_MAP={
                '1':1,
                '0':0,
                '-1':2,
            };
            let diffArr = [];
            if(type !== 'save' && _pendingRecordGoodList.length > 0){
                let notGoldGoodList = _goodsList.filter(item =>item.goodsMainType !== 'attr_ranges_gold');
                diffArr = _pendingRecordGoodList.filter((v)=> notGoldGoodList.findIndex((item)=>v.goodsBarCode === item.goodsBarCode) === -1).map((item)=>{
                   item.diffMark = DIFF_MAP['-1'];
                   if(item.goodsMainType !== 'attr_ranges_gold'){
                       item.inventoryNum = 0;
                   }
                   item.inventoryWeight = 0;
                  return item;
                });
            }

            return _goodsList.concat(diffArr).map((item)=>{
                if(item.goodsMainType === 'attr_ranges_gold'){
                    item.diffMark = DIFF_MAP[_this._compareTo(item.inventoryWeight,item.accountWeight)+''];
                }else{
                    if(_this._compareTo(item.inventoryNum,item.accountNum) === 0 &&
                        _this._compareTo(item.inventoryWeight,item.accountWeight) === 0
                    ){
                        //无差异
                        item.diffMark = DIFF_MAP['0'];
                    }else if(_this._compareTo(item.inventoryNum,item.accountNum) === 1){
                        //一般性盘盈
                        item.diffMark = DIFF_MAP['1'];
                    }else if(_this._compareTo(item.inventoryNum,item.accountNum) === 0 &&
                        _this._compareTo(item.inventoryWeight,item.accountWeight) === 1
                    ){
                        item.diffMark = DIFF_MAP['1'];
                    }else if(_this._compareTo(item.inventoryNum,item.accountNum) === -1){
                        item.diffMark = DIFF_MAP['-1'];
                    }else if(_this._compareTo(item.inventoryNum,item.accountNum) === 0  &&
                        _this._compareTo(item.inventoryWeight,item.accountWeight) === -1
                    ){
                        item.diffMark = DIFF_MAP['-1'];
                    }

                }
                return item;
            });
        },
        judgeExistRangeGoods(){
            let _this = this;
            $.ajax({
                url:contextPath+'/inventorydata/judgeExistGoods',
                method:'POST',
                dataType:'json',
                contentType:'application/json;charset=utf-8',
                data:JSON.stringify(_this.planForm),
                success:function (res) {
                    if (res.code === '100100' ){
                        _this.getGoldGoods();
                        _this.getPendingReordGoods();
                    }else if(res.code === '100822'){
                        tip('warning',res.msg);
                        _this.planForm.documentStatus = 999;
                    }
                }
            });
        },
        //ju
        renderDataHandle(){
            if(this.planForm.documentStatus === 2){
                this.judgeExistRangeGoods();
            }else if (this.planForm.documentStatus > 2){
                this.querySavedInventoryDatas();
                this.getPendingReordGoods();
            }
        },

    },
    mounted(){
        let params = window.parent.params.params;
        this.getToInventoryPlans();
        if(!$.isEmptyObject(params)){
            this.openType = params.type;
            console.log(params.data);
            if(this.openType === 'jump'){
                this.planForm = $.extend({},params.data);
                this.renderDataHandle();
            }
        }

    },
});