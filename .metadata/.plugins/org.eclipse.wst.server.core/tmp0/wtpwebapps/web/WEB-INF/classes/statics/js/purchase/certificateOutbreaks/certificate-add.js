var returnReport = new Vue({
    el: '#returnReport',
    data() {
        return {
            showSupplierModal: false, //控制供应商弹窗
            showSourceModal: false, //源单编号弹窗
            openTime: '',
            isSearchHide: true, //搜索栏
            isTabulationHide: true, // 列表
            selectedIndex: 0,
            isHide: true,
            dataValue: [],
            categoryType: [], //商品类型
            employees: {},  //业务员数据
            logisticsModes:[],//物流方式
			organizationName:'',//当前公司名称
			boeType: 'P_CREDENTIAL_OUT', //单据类型

            //控制弹窗显示
            modalTrigger: false,
            modalType: '',
            steplist: [],   //审批进度条
            approvalTableData:[],//查看审批信息
            
            isDisabled: false, //输入框值是否不可改变, 默认可以
            isDisabledApproval: true,//审核按钮是否可用, 默认不可以
            isDisabledReject: true,  //驳货按钮是否可用, 默认不可以
            isDisabledAddRow: true,//新增行，默认不可用
            isDisabledDelRow: true,//删除行，默认不可用
            isDisabledSourceNo: true,//源单编号点击事件是否可用，默认可以
            isDisabledBusinessType:true, //业务类型是否可选，默认不可以。只有手动新增的可以选
            isDisabledGoodsType:true,  //禁用商品类型
            isDisabledCerOutNumber:true,  //禁用证书数量

            cerOutEntity: {
                id: null,
                orderNo: '', //单据编号
                orderStatus: '', //单据状态：1、暂存;2、待审核;3、审核中;4、已审核;
                dataSource: '',  //数据来源：1、手动新增;2、采购下单
                supplie:'', //供应商名称
                supplierId: '', //供应商Id
                goodsTypeName: '', //商品类型
                goodsTypePath: '', //商品类型路径
                goodsMainType: '', //商品主类型
                businessType: '', //业务类型：1、标配证书；2、特殊证书
                certificateType: '',//证书类型
                certificateNumber: null,//证书数量
                certificateCost: null, //证书费用
                deliverGoodsNumber: null,//发货数量
                deliverWeight: null, //发货重量
				deliveryDate:null,//下单时间
                logisticsMode: '', //物流方式
                salesmanName: '', //业务员姓名
                salesmanId:'', //业务员id
                organizationId:'',//当前组织id
                createName:'',  //创建人姓名
                createTime:'',  //创建时间
                updateName:'',  //更新人
                updateTime:'',  //更新时间
                auditorName:'', //审核人
                auditTime :'',  //审核时间
                remark: '' //备注
            },
            ruleValidate: {
                businessType: [{required: true}],
                logisticsMode: [{required: true}],
                certificateType: [{required: true}],
                salesmanId: [{required: true}],
                deliveryDate: [{required: true}],
            },
            //外发单对应的明细集合 --用于明细回显
            detEntityList: [
                // {
                //     id:null,
                //     orderId:'', //单据id
                //     orderNo:'', //单据编号（就是主表的单据编号）
                //     sourceNumber:'', //源单编号
                //     sourceType:'',//源单类型（取收货单的业务类型businessType）"P_RECEIPT_02"收货单一标准采购收货；P_RECEIPT_03收货单一受托加工
                //     certificateType:'', //证书类型
                //     certificateCount:null,//证书数量
                //     deliverCount:null, //发货数量
                //     deliverWeight:null, //发货重量
                //     deliverDate:'', //发货日期
                //     expectedArrivalDate:'', //预计到货日期
                //     certificateCost:null, //证书费用
                //     warehouseId:null, //仓库id
                //     reservoirPositionId:null, //仓位id
                //     organizationId:null, //所属组织id
                //     remark:'' //备注
                // }
            ],
            checkListData: {
                certificateCount:{
                    name: '证书数量',
                    type: 'number',
                    floor: 0
                },
                certificateCost: {
                    name: '证书费用',
                    type: 'number',
                    floor: 2,
                    plus: true //是否大于0
                }
            },
            errorMsg:{
                businessType: '业务类型必选',
                organizationId: '所属组织必选',
                supplier: '供应商必选',
                logisticsMode: '物流方式必选',
                salesmanId: '业务员必选',
                certificateType: '证书类型必选',
                deliveryDate: '下单日期必填',
            },
            totalMsg:{
                certificateNumber: '证书数量总数必须大于0',
               /* deliverGoodsNumber: '发货数量总数必须大于0',*/
                deliverWeight: '发货重量总数必须大于0',
                certificateCost: '证书费用总数必须大于0'
            }
        }
    },
    methods: {
		exit(close) {
			if(close === true){
				window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
				return;
			}
			if(this.handlerClose()){
				window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
			}
		},
		handlerClose(){
			if((!this.cerOutEntity.orderStatus || this.cerOutEntity.orderStatus == 1) && (this.htHaveChange || accessVm.htHaveChange)){
				this.$nextTick(()=>{
					this.$refs.closeModalRef.showCloseModal();
				});
				return false;
			}
			return true;
		},
		closeModal(type){
			if(type === 'yes'){//保存数据
				this.saveClick();
				this.exit(true)//保存后直接退出
			}else if(type === 'no'){//关闭页面
				this.exit(true);
			}
		},
        htTestChange(){
            this.htHaveChange = true;
        },

        changeDate(value) {
            var startTime = value[0].replace(/\//g, '-');
            var endTime = value[1].replace(/\//g, '-');
            if (startTime != null && startTime != '' && endTime != null && endTime != '') {
                this.coustomer.startTime = startTime + ' 00:00:00';
                this.coustomer.endTime = endTime + ' 23:59:59';
            }
        },
        //点击日期的X后情况之前选择的日期值。
        handleClear() {
            this.coustomer.startTime = null;
            this.coustomer.endTime = null;
        },
        //跳转到外发证书列表
        // toList (){
        //     window.parent.activeEvent({
        //         name: '外发证书列表',
        //         url: contextPath+'/purchase/certificateOutbreaks/certificate-list.html'
        //     });
        // },
        hideSearch() {
            this.isHide = !this.isHide;
            this.isSearchHide = !this.isSearchHide;
            $(".chevron").css("top", "")
        },
        hidTabulation() {
            this.isHide = !this.isHide;
            this.isTabulationHide = !this.isTabulationHide;
            if (!this.isTabulationHide) {
                $(".chevron").css("top", "83%")
            } else {
                $(".chevron").css("top", "")
            }
        },
        //获取业务员
        changeEmp(e) {
        	if (e != null){
				this.cerOutEntity.salesmanId = e.value;
				this.cerOutEntity.salesmanName = e.label.substr(e.label.lastIndexOf("-") + 1, e.label.length);
				this.htTestChange();
			}
        },
        //初始化业务员
        loadData() {
            var That = this;
            $.ajax({
                type: "post",
                url: contextPath + '/tpurchasecollectgoods/data',
                dataType: "json",
                success: function (r) {
                    That.employees = r.data.employees;
                },
                error: function () {
                    console.log('服务器出错啦');
					That.$Modal.error({
						content: "初始化业务员失败!"
					});
                }
            })
        },
        //获取物流方式
        getLogisticsModes(){
            this.logisticsModes = getCodeList("jxc_jxc_wlfs");
        },
		//获取商品类型
        loadProductType() {
            let That = this;
            $.ajax({
                type: "post",
                url: contextPath + '/documentController/getCategory?parentId=0',
                dataType: "json",
                success: function (data) {
                    That.categoryType = That.initGoodCategory(data.data.cateLists)
                },
                error: function () {
					That.$Modal.error({
						content: "初始化商品类型失败!"
					});
                }
            })
        },
        initGoodCategory(type) {
            let result = [];
            type.forEach((item) => {
                let {
                    customCode: value,
                    name: label,
                    cateLists: children,
                    code: code
                } = item;

                if (children) {
                    children = this.initGoodCategory(children)
                }
                result.push({
                    value,
                    label,
                    children,
                    code
                })
            });
            result.forEach((item) => {
                if (!item.children) {
                    delete item.children;
                }
            });
            return result;
        },

        // 级联商品类型
        changeProductType(value, selectedData) {
            let tempType = selectedData[selectedData.length - 1];
            this.cerOutEntity.goodsTypeName = tempType.label;
            this.cerOutEntity.goodsTypePath = tempType.value;
            this.htTestChange();
        },

        calculateTotal(item, type, floor) {//统计
            if(item[type] === undefined){
                item[type] = 0;
            }
            htInputNumber(item, type, floor);
            this.$nextTick(()=>{
                let obj = {
                    certificateCount: 'certificateNumber',
                    deliverCount: 'deliverGoodsNumber',
                    deliverWeight: 'deliverWeight',
                    certificateCost: 'certificateCost'
                };
                this.cerOutEntity[obj[type]] = 0;
                this.detEntityList.map(item => {
                    console.log((Number(item[type])*1000 || 0), item[type]);
                    this.cerOutEntity[obj[type]] += (Number(item[type])*1000 || 0);
                });
                this.cerOutEntity[obj[type]] = this.cerOutEntity[obj[type]]/1000;
                this.$forceUpdate();
            })
        },

        errorMsgTip(){
          for (let attr in this.errorMsg){
              if(!this.cerOutEntity[attr]){
                  this.$Modal.info({
                      content: this.errorMsg[attr]
                  });
                  return true;
                  break;
              }
          }
        },
        totalTip(){//总数大于0验证
            if(this.detEntityList.length === 0){
                this.$Modal.info({
                    content: '至少需要有一条分录行!'
                });
                return true;
            }
            for (let attr in this.totalMsg){
                if(!this.cerOutEntity[attr]){
                    this.$Modal.info({
                        content: this.totalMsg[attr]
                    });
                    return true;
                    continue;
                }
            }
        },
        validate() {
            this.$refs['formValidate'].validate((valid) => {
                if (valid) {//验证通过
                    this.submitValidate = true;
                } else {
                    this.submitValidate = false;
                }
            })
        },
        //保存
        saveClick() {
            if (this.cerOutEntity.orderStatus>1){
                this.$Modal.info({
					content: "该单据已经提交，不能更新！"
				});
            }else{
                this.cerOutEntity.orderStatus = 1;
                this.saveOrUpdate();
            }
           
        },
        // 提交
        submit() {

            let sup = this.$refs.supplier.submit()
            this.validate();
            if (!this.submitValidate || !sup) {
                return;
            }

            if(this.errorMsgTip() === true){//上半部分信息验证
                return
            }
            if(this.typeValue.length === 0){//善品类型必选验证
                this.$Modal.info({
                    content: '商品类型必选!'
                });
                return;
            }
            if(htValidateRow(this.detEntityList, this.checkListData)){//驗證分錄行必填項
                return;
            }
            if(this.totalTip() === true){//计算总数验证
                return;
            }
            
            if (this.cerOutEntity.orderStatus>1){
				this.$Modal.info({
					content: '该单据已经提交！不能再重复提交!'
				});
            }else{
                //需求变更为可以直接 提交； 具有保存或更新的功能
                this.cerOutEntity.orderStatus = 2;//提交就是更改单据状态为2
                this.saveOrUpdate();
            }
        },
        saveOrUpdate() {
            let that = this;
            let param = {"cerOutEntity": this.cerOutEntity, "detEntityList": this.detEntityList};
			//防止多次点击保存，出现不可点击的圈圈
            window.top.home.loading('show');
            $.ajax({
                type: "post",
                url: contextPath + '/certificateOutbreaks/saveOrUpdate',
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(param),
				async: false,
                success: function (data) {
                    //隐藏按钮圈圈
					window.top.home.loading('hide');
                    that.htHaveChange = false;
                    if (data.code === '100100') {
                        //如果是保存，需要反写单据id；如果是直接提交，需要反写单据状态orderStatus
                            //说明是新增(可能是是点击了保存，也可能是点击了提交)，就需要反写id和orderNo
                       //if (data.data!=null&&data.data!=[]&&data.data!={}&&data.data!=''&&data.data!='undefined'){ //因为后台的逻辑更新数据是不需要返回数据的，再更新前所需要的数据已经存在页面了。
                       if ($.isPlainObject(data.data) == true) {//判断data是否为一个对象
                            if (that.cerOutEntity.id == null){
                                //是新增，回显id和orderNo，创建人，创建人id
								var cerOut = data.data.cerOutEntity;
                                that.cerOutEntity.id = cerOut.id;
                                that.cerOutEntity.orderNo = cerOut.orderNo;
                                that.cerOutEntity.createName = cerOut.createName;
                                that.cerOutEntity.createTime = cerOut.createTime;
                                that.detEntityList = data.data.detEntityList;
                            }else{
                                //说明是更新的回显(装填为暂时时点击保存或提交)，只需要回显更新人和时间
                                that.cerOutEntity.updateName = data.data.updateName;
                                that.cerOutEntity.updateTime = data.data.updateTime;
                            }

                            //that.cerOutEntity = data.data;
                            console.log(that.cerOutEntity);
                        }
                        //如果是提交，且成功，就执行相关的置灰操作
                        if (that.cerOutEntity.orderStatus == 2){
                            that.isDisabled = true; //已提交，关闭保存，提交按钮，其它输入框也不可再编辑
                            that.isDisabledBusinessType = true; //业务类型不可选
                            that.isDisabledGoodsType = true; //商品类型不可选
                            that.isDisabledApproval = false; //开启审核按钮
                            that.isDisabledReject = false; //开启驳回按钮
                            //that.isDisabledAddOrDel = true;  //关闭新增删除行
                            that.isDisabledAddRow = true; //新增行，默认不可用
                            that.isDisabledDelRow = true; //删除行，默认不可用
                            that.isDisabledCerOutNumber = true; //证书数量不可改
							that.isEdit("N");//附件不可上传图片
                        }

                        //页面提示操作结果，显示三秒钟
                        that.$Modal.success({
                            content: data.msg
                        });

						// 调用方法保存附件
						that.saveAccess(that.cerOutEntity.id, that.boeType);
						that.isEdit(that.cerOutEntity.orderStatus == 1 ? "Y" : "N");
                    } else {
						that.cerOutEntity.orderStatus = 1;
                        //页面提示操作结果，显示三秒钟
                        that.$Modal.warning({
                            content: data.msg
                        });
                    }

                },
                error: function () {
					that.cerOutEntity.orderStatus = 1;
					//隐藏按钮圈圈
					window.top.home.loading('hide');
                    that.$Modal.error({
                        content: '服务器出错，请联系技术人员！'
                    });
                }
            })
        },
        //审核
        approval(value) {
            let This = this;
            This.modalType = 'approve';
            This.modalTrigger = !This.modalTrigger;
        },
        //驳回
        reject(value) {
            let This = this;
            This.modalType = 'reject';
            This.modalTrigger = !This.modalTrigger;
        },
        //审核或者驳回回调
        approvalOrRejectCallBack(res) {
               let _this = this;
               if (res.result.code == '100515') { //没有启用审核流程的返回状态码
                   //这个是修改单据状态为已审核
                   if (_this.modalType == 'approve') _this.updateOrderStatus(4,_this.cerOutEntity.id );
                   //如果是驳回时，直接把单据状态改为暂存
                   if (_this.modalType == 'reject') _this.updateOrderStatus(1,_this.cerOutEntity.id);
               }
               if (res.result.code == '100100') {
                   let approvalStatus = res.result.data.approvalStatus;

                   if (approvalStatus == 0) { //审核成功,状态改为 3审核中
                       _this.cerOutEntity.orderStatus = 3;
                       //_this.isDisabledReject = false; //开启驳回按钮 (提交时已经开启)
                       
                   } else if (approvalStatus == 1) { //已审核
                       _this.cerOutEntity.orderStatus = 4;
                       _this.isDisabledApproval = true; //关闭审核按钮
                       _this.isDisabledReject = true; //关闭驳回按钮
                       //回显审核人，审核时间
                       _this.cerOutEntity.auditorName = res.result.data.auditorName;
                       _this.cerOutEntity.auditTime = res.result.data.auditTime;

                   } else if (approvalStatus == -1) { //已驳回
                       _this.cerOutEntity.orderStatus = 5;
                       
                   } else if (approvalStatus == -2) { //驳回到初始状态，单据状态改为暂存  
                       _this.cerOutEntity.orderStatus = 1;
                       _this.isDisabled= false ; //可编辑，保存，提交按钮重新可用
                       _this.isDisabledApproval = true; //关闭审核按钮
                       _this.isDisabledReject = true; //关闭驳回按钮
					   _this.isEdit("Y");//附件可上传图片
					   if (_this.cerOutEntity.dataSource == 1){
                           if (_this.cerOutEntity.sourceType == null){
                               _this.isDisabledAddRow = false; //启用新增行
                           }
                           _this.isDisabledDelRow = false; //启用删除行

                           _this.isDisabledBusinessType = false;//启用业务类型选择
                           _this.isDisabledGoodsType = false;//启用商品类型选择
                           _this.isDisabledCerOutNumber = false;//启用证书数量填写
                       }else{
					       if (_this.detEntityList.length>1){
							   _this.isDisabledDelRow = false; //启用删除行
                           }
                       }

                   } else {
                       _this.$Modal.error({
                           content: '审核异常!',
                           title: '警告'
                       });
                       return false;
                   }
				  //后台已修改状态，前端无需再次同步
                  // _this.updateOrderStatus(_this.cerOutEntity.orderStatus, _this.cerOutEntity.id);
               }
        },
        //更新单据状态
        updateOrderStatus(orderStatus, id) {
            let that = this;
            http.post(contextPath + '/certificateOutbreaks/updateOrderStatus', JSON.stringify({
                "orderStatus": orderStatus,
                "id": id
            })).then((data) => {
                //判断生成凭证是否成功
                if (data.code === '100100') {
                    //页面提示操作结果，显示三秒钟
                    that.$Message.info({
                        content: json.msg,
                        duration: 3
                    });
                } else {
                    //页面提示操作结果，显示三秒钟
                    that.$Message.warning({
                        content: '更新单据状态失败，请重试！',
                        duration: 3
                    });
                }
            }, (json) => { });
        },

        selectedOne(index) {
            this.selectedIndex = index;
        },

        addOrDel(type) {//新增删除行
			if (type === 'add') {
				if (this.cerOutEntity.dataSource==1 && this.cerOutEntity.orderStatus==1) {
					this.detEntityList.push({});
					//只有手动新增了行，就不可以再从源单编号中拉取数据
					this.isDisabledSourceNo = true; //禁用源单编号。
					this.isDisabledDelRow = false;  //只要新增了行,就开启删除行
				} else{
					//只有手动新增的单据，且状态是暂存才可以新增行
					this.$Modal.info({
						content: '只有手动新增的单据，且状态是“暂存”才可以新增行!'
					});
				}
			} else {
				//如果删除的是最后一行,且是上游携带的数据
				if (this.detEntityList.length==1 && this.cerOutEntity.dataSource == 2){
					this.$Modal.info({
						content: '上游携带的数据，至少要保留一行!'
					});
					return;
				}
				this.detEntityList.splice(this.selectedIndex, 1);
				//如果删除的是最后一行,明细被清空
				if (this.detEntityList.length==0){
					if (this.cerOutEntity.dataSource==1){
						this.isDisabledSourceNo = false; //重新启用源单编号的点击事件
						this.isDisabledDelRow = true; //没有了明细就 -- 禁用删除行
						this.isDisabledAddRow = false; //重新启用新增行
					}
				}
				//执行删除后，如果只剩下一行，并且是上游数据，置灰删除行按钮
				if (this.detEntityList.length==1 && this.cerOutEntity.dataSource == 2){
						this.isDisabledDelRow = true; //禁用删除行
				}
				//重新校验，统计证书数量，费用总数
				if (this.detEntityList.length == 0){
					this.cerOutEntity.certificateNumber = 0;
					this.cerOutEntity.deliverGoodsNumber = 0;
					this.cerOutEntity.deliverWeight = 0;
					this.cerOutEntity.certificateCost = 0;
				}else {
					this.detEntityList.map(item => {
						//校验，统计证书数量，费用总数
						this.calculateTotal(item, 'certificateCount', 0);
						this.calculateTotal(item, 'deliverCount', 2);
						this.calculateTotal(item, 'deliverWeight', 2);
						this.calculateTotal(item, 'certificateCost', 2);
					});
				}

			}

        },

        handlerUnDeliverData() { //转换字段
            this.detEntityList.map(item => {
                Object.assign(item, {
                    sourceType: "P_RECEIPT",
                    sourceNumber: item.orderNo,
                    certificateCount: item.qualifiedCount,
                    deliverCount: item.qualifiedCount,
                    deliverWeight: item.takeDeliveryWeight
                });
                this.calculateTotal(item, 'certificateCount', 0);
                this.calculateTotal(item, 'deliverCount', 2);
                this.calculateTotal(item, 'deliverWeight',2);
                this.calculateTotal(item, 'certificateCost',2);
            });
            return this.detEntityList;
        },

        closeSupplierModal() {

        },
        //接收供应商信息
        rcv(id, scode, sname) {
            console.log(id, scode, sname);
            this.cerOutEntity.supplierId = id;
            this.cerOutEntity.supplier = sname;
        },
        //弹出查询供应商
        selectSupplier() {
            if (!this.isDisabled){
                this.showSupplierModal = !this.showSupplierModal;
            }
        },

        closeSourceModal(e, type) { //e为所有选中的源单列表
            if(!type){
                this.showSourceModal = false;
                return
            }
            this.cerOutEntity.dataSource = 1; //设置数据来源为1上游新增，目的是为了区分数据为手动新增还是客户订单选取，从而判定是否可以增删行。
            this.detEntityList = e;
            this.detEntityList.map(item => {
                Object.assign(item, {
                    sourceType: 'S_CUST_ORDER',
                    sourceNumber: item.saleOrderNo,
                    certificateCount: item.goodsNum,
                    deliverCount: item.goodsNum,
                    deliverWeight: item.totalWeight
                });
                this.calculateTotal(item, 'certificateCount', 0);
                this.calculateTotal(item, 'deliverCount', 2);
                this.calculateTotal(item, 'deliverWeight', 2);
                this.calculateTotal(item, 'certificateCost', 2);
            });
            //校验，统计证书数量，费用总数
            this.showSourceModal = false;
            this.isDisabledAddRow = true; //禁用新增行
            this.isDisabledDelRow = false; //只要新增了行,就开启删除行
        },

        doSelectSource() {
            if (!this.isDisabledSourceNo){
                this.showSourceModal = true;
            }
        },

        // 新增
        // add(){
        //     window.parent.activeEvent({
        //         name: '新增证书外发单',
        //         url: contextPath+'/purchase/certificateOutbreaks/certificate-add.html',
        //         params: {type: 'add'}
        //     });
        // },

        //此处三个方法是附件组件 只需要直接copy即可
        //附件是编辑还是查看 传入Y表示编辑，传入N表示查看
        /* isEdit1(isEdit){
             eventHub.$emit('isEdit', isEdit);
         },*/
        isEdit(isEdit) {
            eventHub.$emit('isEdit', isEdit);
        },
        //保存附件
        saveAccess(id,type) {
            eventHub.$emit('saveFile', id,type);
        },
        //查找附件
        getAccess (id,type) {
            eventHub.$emit('queryFile', id,type);
        },

		/* 获取当前时间 */
		getTime(){
			var now = new Date();
			var year = now.getFullYear(); //得到年份
			var month = now.getMonth();//得到月份
			var date = now.getDate();//得到日期
			month = month + 1;
			if (month < 10) month = "0" + month;
			if (date < 10) date = "0" + date;
			var time = "";
			time = year + "-" + month + "-" + date;
			return time;
			//当前日期赋值给当前日期输入框中（jQuery easyUI）
			//this.cerOutEntity.deliveryDate = time;
		},

        //初始化加载的方法：
        getInitData() {
            let This = this;
            //两个不同的页面，跳转时他们共同在一个大的父级 ifame中，所以传取值需要放到父级框架中才能互相通用。
            //现在需要将携带过来的参数，回显到页面中。
            var postParams = window.parent.params.params; //拿到其他页面跳转过来的参数

            //从待外发列表过来
            if (postParams.type === 'undo') {
                This.detEntityList = JSON.parse(JSON.stringify(postParams.data));
                if (This.detEntityList.length>1){
                    This.isDisabledDelRow = false; //开启删除行
                }
                This.cerOutEntity.dataSource = 2;
                This.cerOutEntity.orderStatus = 1;
                This.cerOutEntity.businessType = 'P_CREDENTIAL_OUT_01'; //业务类型：默认为标配证书。
				This.cerOutEntity.goodsTypePath = this.detEntityList[0].goodsTypePath;
				This.cerOutEntity.goodsTypeName = this.detEntityList[0].goodsTypeName;
				// this.cerOutEntity.deliveryDate = this.getTime(); //自由拼接时间字符串
				//this.cerOutEntity.deliveryDate = new Date().toLocaleString(); //获取当前具体时间 2019/9/29 下午 4:23
				this.cerOutEntity.deliveryDate = new Date().toLocaleDateString();//获取当前时间，不含时分秒 2019/9/29
				//转换字段
                This.handlerUnDeliverData();

			} else if (postParams.type === 'id') {//通过id查询数据 /*this.postParams.type === 'id'*/
                let id = postParams.id;
                $.ajax({
                    type: "post",
                    url: contextPath + '/certificateOutbreaks/getCerAndDetById/' + id,
                    dataType: "json",
                    success: function (data) {
                        Object.assign(This.cerOutEntity, {...data.data.cerOutEntity});
                        This.detEntityList = data.data.detEntityList || [];

                        //处理保存，提交，审核，驳回按钮可用逻辑
                        var status = This.cerOutEntity.orderStatus;
                        if (status != 1){
                            This.isDisabled=true; //不可编辑
							This.isEdit("N");//附件不可上传图片
						}
                        if (status == 2 || status == 3|| status == 5){
                            This.isDisabledApproval=false; //审核可用
                            This.isDisabledReject=false; //驳回可用
                        }
                        //如果是手动新增的，且是暂存状态，可以新增删除行
                        if (status == 1 && This.cerOutEntity.dataSource == 1){
                            if (This.detEntityList.length > 0){
								This.isDisabledDelRow = false; //启用删除行
								if (This.detEntityList[0].sourceType == null){
									This.isDisabledAddRow = false; //启用新增行（手动新增选择的是客户订单，不可以新增行）
								}
                            }
                            if (This.detEntityList.length == 0){
								This.isDisabledAddRow = false; //启用新增行（手动新增选择的是客户订单，不可以新增行）
								This.isDisabledSourceNo = false; //启用源单类型
							}

                            This.isDisabledBusinessType = false; //启用业务类型选择
							This.isDisabledGoodsType = false;//启用商品类型选择
							This.isDisabledCerOutNumber = false; //证书数量可填
							This.isEdit("Y");//附件可上传图片
						}
                        //如果是上游携带的，且是暂存状态，只能删除行
                        if (This.cerOutEntity.dataSource == 2 && status == 1 && This.detEntityList.length>1){
                            This.isDisabledDelRow = false; //只能删除行
                        }

						//供应商组件回显需要:
						This.$refs.supplier.haveInitValue(This.cerOutEntity.supplier,This.cerOutEntity.supplierId);

                    },
                    error: function () {
						this.$Modal.error({
							content: "服务器出错啦!"
						});
                    }
                })

            } else {//手动新增
                this.cerOutEntity.dataSource = 1;
                this.cerOutEntity.orderStatus = 1;
                // this.cerOutEntity.deliveryDate = this.getTime();
				this.cerOutEntity.deliveryDate = new Date().toLocaleDateString();//获取当前时间，不含时分秒

                //开启新增，删除行
                this.isDisabledAddRow = false; //重新启用新增行
                this.isDisabledBusinessType = false; //业务类型可选
				this.isDisabledGoodsType = false;//启用商品类型选择
				this.isDisabledSourceNo = false; //启用源单类型
				this.isDisabledCerOutNumber = false; //证书数量可填

				//新增的时候掉这个方式 供应商组件需要:
				//this.$refs.supplier.noInitValue();
            }

            //获取当前用户
            var user =layui.data('user');
            this.cerOutEntity.organizationId = user.userCurrentOrganId;
            this.organizationName = user.currentOrganization.orgName;
            console.log("当前用户组织id是:===="+user.userCurrentOrganId)

        },
        typeInit(arr,res,val){
            for(let i=0;i<arr.length;i++){
                if(arr[i].value == val){
                    res.push(arr[i].value);
                    return true;
                }
                if(arr[i].children && arr[i].children.length >0){
                    if(this.typeInit(arr[i].children,res,val)){
                        res.push(arr[i].value);
                        return true;
                    }
                }
            }
        },
    },
    computed: {
        typeValue:function () {
            let temp = this.cerOutEntity.goodsTypePath;
            let arr =[];
            this.typeInit(this.categoryType,arr,temp);
            return arr.reverse();
        }
    },
    watch: {},
    created() {
        this.getInitData();
        this.loadData(); //初始化获取业务员
        this.loadProductType();//初始化获取商品类型
        this.getLogisticsModes();//初始化获取物流方式

		window.handlerClose = this.handlerClose;//将事件注册到window下，页面x关闭页面时要使用
    },
    mounted() {
        this.openTime = window.parent.params.openTime;
		//附件是否可上传图片
		this.isEdit(this.cerOutEntity.orderStatus == 1 ? "Y" : "N");

	},
});
