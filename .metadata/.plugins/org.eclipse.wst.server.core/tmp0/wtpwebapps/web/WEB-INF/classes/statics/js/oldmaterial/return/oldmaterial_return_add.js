var retunRef = new Vue({
    el: '#return',
    data() {
        return {
            openTime: '',
            parentParams: null,
            isSearchHide: true, //搜索栏
            isTabulationHide: true, // 列表
            showCustomer: false,
            submitValidate: false,
            logisticsModes: [],
            selectCustomerObj: null, //所选的客户对象
            selectedRowIndex: 0,//选中行的索引
            employees: [], //业务员列表
            qualityResult: '质检不合格',
            total: {countTotal: 0},
            unitMap: {},//单位
            processModes: [],//处理方式
            certificateType: [],
            contrastValue: 'tab1',
			organizationName:'', //所属组织名称
            allData: [],//登记信息跟检验信息的所有数据
            testMess: {//差异信息

            },
            registerMess: {//登记信息

            },
            returnArray: [],
            testArray: [],
            returnEntity: {
                id: '',//主键
                orderNo: '', //单据编号
                orderStatus: '',//单据状态：1、暂存;2、待审核;3、审核中;4、已审核;5、驳回
                goodsTypeId: '', //商品类型id
                goodsType: '',//商品类型
                goodsTypePath: '', //商品类型路径
                returnDate: '',//登记日期
                customerId: '',//客户id
                customerName: '',//客户名称
                processingMode: '',//处理方式
                processingResults: '', //处理结果
                count: '',//数量
                weight: '',//重量
                salesmanId: '',//业务员id
                salesmanName: '',//业务员名称
                executeState: '',//执行状态：1、未执行  2、已执行  3、执行完成
                qualityResult: '',//质检结果：1、放行  2、检测结果不符
                logisticsMode: '',//物流方式
                logisticsStatus: '',//物流状态
                createTime: '',//创建时间
                createName: '',//创建人名称
                updateId: '',//更新人
                updateTime: '',//更新时间
                updateName: '',//更新人名称
                auditorId: '',//审核人id
                auditor: '',//审核人
                auditTime: '',//审核时间
                remark: '',//备注_备注
                organizationId: '',//组织id
                goodsList: []
            },
            ruleValidate: {
                logisticsMode: [{required: true}],
                salesmanId: [{required: true}]
            },
            totalObj: {//总计对象
                countTotal: 0,
                totalWeightTotal: 0,
                mainStoneWeightTotal: 0,
                viceStoneWeightTotal: 0,
                goldWeightTotal: 0
            },
            differentObj: {//差异对比对象
                totalWeightTotal: 0,
                mainStoneWeightTotal: 0,
                viceStoneCountTotal: 0
            },

			//审核控制弹窗显示
			modalTrigger: false,
			modalType: '',
			steplist: [],   //审批进度条
			approvalTableData:[],//查看审批信息

			isDisabled: false, //输入框值是否不可改变, 默认可以
			isDisabledApproval: true,//审核,驳回按钮是否可用, 默认不可以
        };
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
			if((!this.returnEntity.orderStatus || this.returnEntity.orderStatus == 1) && (this.htHaveChange || accessVm.htHaveChange)){
				this.$nextTick(()=>{
					this.$refs.closeModalRef.showCloseModal();
				});
				return false;
			}
			return true;
		},
		closeModal(type){
			if(type === 'yes'){//保存数据
				this.saveClick(1);
				this.exit(true)//保存后直接退出
			}else if(type === 'no'){//关闭页面
				this.exit(true);
			}
		},
        htTestChange(){
            this.htHaveChange = true;
        },
        //改变业务员重新赋值
        changeEmp(e) {
            this.returnEntity.salesmanId = e.value;
            this.returnEntity.salesmanName = e.label.substr(e.label.lastIndexOf("-") + 1, e.label.length);
        },
        validate(){
            this.$refs['formValidate'].validate((valid) => {
                if (valid) {//通过
                    this.submitValidate = true;
                } else {//不通过
                    this.submitValidate = false;
                }
            })
        },
        saveClick(type) {
			let that = this;
            if (type == 2){
                //提交，校验信息
                this.validate();
                if(!this.submitValidate){
                    return
                }
                if (that.returnEntity.salesmanId =='' || that.returnEntity.salesmanId==null){
					this.$Modal.info({
						content: '业务员不可为空!'
					});
                    return;
                }
				if (that.returnEntity.logisticsMode=='' || that.returnEntity.logisticsMode==null){
					this.$Modal.info({
						content: '物流方式不可为空!'
					});
					return;
				}
                that.returnEntity.orderStatus = 2;
            }else{
				that.returnEntity.orderStatus = 1;
            }

            let temp = JSON.parse(JSON.stringify(that.returnEntity));
            temp.goodsList = that.allData;
			//防止多次点击保存，出现不可点击的圈圈
			window.top.home.loading('show');
            $.ajax({
                type: "post",
                url: contextPath + '/oldmaterialReturn/saveOrUpdate',
                dataType: "json",
                contentType: 'application/json',
                data: JSON.stringify(temp),
				async: false,
				success: function (data) {
					//隐藏按钮圈圈
					window.top.home.loading('hide');
					that.htHaveChange = false;
					if (data.code === '100100') {
						//如果是保存，需要反写单据id和orderNo；如果是直接提交，需要反写单据状态orderStatus
						if ($.isPlainObject(data.data) == true) {//判断data是否为一个对象
							//或者直接全部回显： (代码省了，性能差一丢丢)
							that.returnEntity = data.data;
							console.log(that.returnEntity);
						}
						//如果是提交，且成功，就执行相关的置灰操作
						if (that.returnEntity.orderStatus == 2){
							that.isDisabled = true; //已提交，关闭保存，提交按钮，其它输入框也不可再编辑
							that.isDisabledApproval = false;  //开启审核按钮
							that.isEdit("N");//附件不可上传图片
						}
						//页面提示操作结果
						that.$Modal.success({
							content: data.msg
						});

						// 调用方法保存附件
                        that.saveAccess(that.returnEntity.id, "O_MATERIALS_RETURN");
                        that.isEdit(that.returnEntity.orderStatus == 1 ? "Y" : "N");
					} else {
					    //调用失败，可能是提交失败，需要回写单据状态为暂存。
						that.returnEntity.orderStatus == 1;
						that.$Modal.warning({
							content: data.msg
						});
					}

				},
                error: function () {
                    that.$Modal.error({
                        scrollable: true,
                        content: "系统异常,请联系技术人员！",
                    })
                }
            })
        },

        //=========== 以下是审核 ==============
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
				//alert("该单据类型没有配置审批流，请先配置审批流！")
				//这个是修改单据状态为已审核
				if (_this.modalType == 'approve') _this.updateOrderStatus(4,_this.returnEntity.id );
				//如果是驳回时，直接把单据状态改为暂存
				if (_this.modalType == 'reject') _this.updateOrderStatus(1,_this.returnEntity.id);
			}
			if (res.result.code == '100100') {
				let approvalStatus = res.result.data.approvalStatus;

				if (approvalStatus == 0) { //审核成功,状态改为 3审核中
					_this.returnEntity.orderStatus = 3;
				} else if (approvalStatus == 1) { //已审核
					_this.returnEntity.orderStatus = 4;
					_this.isDisabledApproval = true; //关闭审核按钮
					//回显审核人，审核时间
					_this.returnEntity.auditor = res.result.data.auditor;
					_this.returnEntity.auditTime = res.result.data.auditTime;

				} else if (approvalStatus == -1) { //已驳回
					_this.returnEntity.orderStatus = 5;
				} else if (approvalStatus == -2) { //驳回到初始状态，单据状态改为暂存  
					_this.returnEntity.orderStatus = 1;
					_this.isDisabled= false ; //可编辑，保存，提交按钮重新可用
					_this.isDisabledApproval = true; //关闭审核按钮
					_this.isEdit("Y");//附件可上传图片
				} else {
					_this.$Modal.warning({
						content: '审核异常!',
						title: '警告'
					});
					return false;
				}
				//后台已修改状态，前端无需再次同步
				// _this.updateOrderStatus(_this.returnEntity.orderStatus, _this.returnEntity.id);
			}
		},
		//=========== 审核 end==============

        selectCustomer() {//选择客户
            this.showCustomer = true;
        },
        closeCustomer() {
		    if(this.selectCustomerObj){
                this.returnEntity.customerId = this.selectCustomerObj.id;
                this.returnEntity.customerName = this.selectCustomerObj.name;
            }

			this.showCustomer = false;
        },
        selectOneRow(index) {
			this.selectedRowIndex = index;
        },
        contrast(item) {//点击差异对比
			this.contrastValue = 'tab2';
			this.registerMess =  item;

			let temp = this.allData.filter(list =>{
			    console.log(item.goodsId, list)
                return item.goodsId === list.relationId;
            });
			this.testMess = temp[0];
			this.different(['totalWeight','goldWeight','mainStoneWeight','viceStoneCount']);
        },
        different(key) {//差异对比求值
            htDifferent(this.registerMess, this.testMess, key, this.differentObj);
        },
        tabClick(name) {
			this.contrastValue = name;
        },
        calculateTotal(name) {
            let newValue = htCalcTotal(this.returnArray, name, this.total);//重新计算总数
            Object.assign(this.totalObj, newValue)
        },
        // 初始化商品单位
        initUnit() {
            let _that = this;
            $.ajax({
                type: "post",
                url: contextPath + "/tbaseunit/list",
                contentType: 'application/json',
                dataType: "json",
                async: false,
                success: function (r) {
                    if (r.code === "100100") {
                        let data = r.data;
                        data.map(item => {
                            let keyStr = item.id;
                            let value = item.name;
                            _that.unitMap[keyStr] = value;
                        });

                    } else {
                       _that.errorTip();
                    }
                },
                error: function (err) {
                    _that.$Modal.error({
                        scrollable: true,
                        content: "系统异常,请联系技术人员！",
                    })
                },
            });
        },
        loadEmployees() {
            let that = this;
            $.ajax({
                type: "post",
                url: contextPath + '/tpurchasecollectgoods/data',
                dataType: "json",
                success: function (r) {
                    that.employees = r.data.employees; //加载当前公司下面所有的员工
                },
                error: function () {
					that.$Modal.error({
						scrollable: true,
						content: "系统异常,请联系技术人员！",
					})
                }
            });
        },
        //附件
        isEdit(isEdit) {
            eventHub.$emit('isEdit', isEdit);
        },
        // 保存附件保存的时候调用
        saveAccess(id, type) {
            eventHub.$emit('saveFile', id, type);
        },
        // 查找附件查看的时候调用
        getAccess(id, type) {
            eventHub.$emit('queryFile', id, type);
        },
        getLogisticsModes() {
			this.logisticsModes = getCodeList("jxc_jxc_wlfs");
        },
		//更新单据状态
		updateOrderStatus(orderStatus, id) {
			let that = this;
			http.post(contextPath + '/oldmaterialReturn/updateOrderStatus', JSON.stringify({
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
		//没有配审批流时，新增的组件方法，用于专门处理没有配置审批流的时候，先留着备用
        //目前是采用前端调用后台修改单据状态的。
		// autoSubmitOrReject(result){
		// let _this = this;
		// $.ajax({
		// 	url:contextPath + '/purchasestock/submitapproval?submitType=1',
		// 	method:'post',
		// 	contentType:'application/json;charset=utf-8',
		// 	data:JSON.stringify({
		// 		receiptsId:_this.psiForm.stockNo,
		// 		approvalResult:(_this.modalType === 'reject'? 1 : 0),
		// 	}),
		// 	success:function (res) {
		// 		if(res.code === '100100'){
		// 			_this.psiForm.docStatus = parseInt(res.data);
		// 		}else {
		// 			_this.$Modal.warning({content:res.msg});
		// 		}
		// 	}
		// });
		// },

        //初始化加载的方法：
        getInitData() {
            let that = this;
            let postParams = window.parent.params.params; //拿到其他页面跳转过来的参数

            //获取当前用户
            let user =layui.data('user');
            this.returnEntity.organizationId = user.userCurrentOrganId;
            this.organizationName = user.currentOrganization.orgName;

            //从待外发列表过来
            if (postParams.type === 'undo') {

                let { data } = JSON.parse(JSON.stringify(postParams));
                $.ajax({
                    type: "post",
                    url: contextPath + "/oldMaterialRegister/findByGoodsIds",
                    dataType: "json",
                    data: JSON.stringify(data),
                    contentType:'application/json;charset=utf-8',
                    success: function (res) {
                        if(res.code !== '100100'){
                            that.errorTip(res.msg);
                            return
                        }
                        that.allData = res.data;
                        that.returnEntity.goodsList = res.data.filter(item =>{
                            return !item.relationId
                        })

                        let temp = that.returnEntity.goodsList[0];
                        Object.assign(that.returnEntity,{
                            orderStatus: 1,
                            goodsTypePath: temp.goodsTypePath,
                            returnDate: new Date().format("yyyy-MM-dd"),
                            customerName: temp.customerName,
                            customerId: temp.customerId,
                            organizationId: temp.organizationId,
                            goodsType:temp.goodsType
                        });
                        htCalcTotal(that.returnEntity.goodsList, ['count', 'totalWeight','goldWeight', 'mainStoneWeight', 'viceStoneWeight'], that.totalObj);//计算总数
                    },
                    error: function () {
                        that.errorTip();
                    }
                })
            } else {//通过id查询数据 /*that.postParams.type === 'id'*/
                let id = postParams.id;
                that.getAccess(id, "O_MATERIALS_RETURN");//获取附件
                $.ajax({
                    type: "post",
                    url: contextPath + '/oldmaterialReturn/getReturnAndGoodsById/' + id,
                    dataType: "json",
                    success: function (data) {
                        if(data.code !== '100100'){
                            that.errorTip(data.msg);
                            return
                        }
                        that.allData = data.data.goodsList;
                        that.returnEntity.goodsList = that.allData.filter(item =>{
                            return !item.relationId
                        });

                        delete data.data.goodsList;

                        Object.assign(that.returnEntity, data.data);
                        htCalcTotal(that.returnEntity.goodsList, ['count', 'totalWeight','goldWeight', 'mainStoneWeight', 'viceStoneWeight'], that.totalObj);//计算总数

                        //处理保存，提交，审核，驳回按钮可用逻辑
                        let status = that.returnEntity.orderStatus;
                        if (status != 1) {
                            that.isDisabled = true; //不可编辑
                            that.isEdit("N");//附件不可上传图片
                        }
                        if (status == 2 || status == 3 || status == 4 || status == 5) {
                            that.isDisabledApproval = false; //审核可用
                        }
                    },
                    error: function () {
                        that.errorTip();
                    }
                })
            }
        },
        errorTip(msg) {
			this.$Modal.error({
                scrollable: true,
                content: msg || "系统异常,请联系技术人员！",
            })
        },
        successTip(msg) {
			this.$Modal.success({
                scrollable: true,
                content: msg
            })
        }
    },
    computed: {},
    watch: {},
    created() {
		this.getLogisticsModes();
		this.loadEmployees();
		this.getInitData();

		window.handlerClose = this.handlerClose;//将事件注册到window下，页面x关闭页面时要使用
	},
    mounted() {
		this.openTime = window.parent.params.openTime;
		this.isEdit("Y");//附件可上传图片
    },
});