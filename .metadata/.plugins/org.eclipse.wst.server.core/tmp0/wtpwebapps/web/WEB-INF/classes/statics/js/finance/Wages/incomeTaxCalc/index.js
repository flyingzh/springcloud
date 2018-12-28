var vm = new Vue({
	el: '#wage-entry',
	data() {
		return {
			formData: {
				sobId: '',
				empCode: '',
				empName: '',
				idCard: '',
				depId: '',
				empStation: '',
				empStation: '',
				empRank: '',
				stationLevel: '',
				empEdu: '',
				entryStartDate: '',
				entryEndDate: '',
				empStatus: '',
				categoryId: '',
				initId: '',
				year: '',
				period: '',
			},
			filterVisible: false, // 过滤
			subjectVisible: false, // 所得项
			taxVisible: false, // 税率
			initVisible: false, //  初始
			categoryId: '',
			orgName: "",
			tableList: [],
			chooseId: '',
			organizationList: [],
			showDepType: false,
			showDepTree: '',
			depTreeSetting: {
				data: {
                    key: {
                        name: "title"
                    }
                },
				callback: {
					onClick: this.depTreeClickCallBack,
					beforeClick: this.treeBeforeClick
				}
			},
			subjectDataList: [{
				show: false,
				id: '',
				itemId: '',
				sequence: '',
				typeId: '',
				attr: ''
			}],
			rootSubjectDataList: [{
				show: false,
				id: '',
				itemId: '',
				sequence: '',
				typeId: '',
				attr: ''
			}],
			incomeData: {
				id: '',
				name: '',
				categoryId: '',
				sob_id: '',
			},
			rootTaxDataList: [{
				show: false,
				id: '',
				taxId: '',
				sequence: 0,
				floorAmount: '',
				upperAmount: '',
				taxRate: '',
				quickDeduction: ''
			}],
			taxDataList: [{
				show: false,
				id: '',
				taxId: '',
				sequence: 0,
				floorAmount: '',
				upperAmount: '',
				taxRate: '',
				quickDeduction: ''
			}, ],
			taxData: {
				id: '',
				name: '',
				categoryId: '',
				defRate: '',
				sob_id: '',
			},
			subjectActive: '', // 选中时样式
			taxActive: '',
			initActive: '',
			calcName: '',
			allShowSubject: '', // 所得项全选
			allShowtax: '',
			yearPeriod: '',
			categoryList: [], //工资类别
			empStationList: [], //员工岗位
			empRankList: [], //职级
			empLevelList: [], //岗位级别
			empEduList: [], //学历
			empStatusList: [{
					name: "在职",
					status: 1
				},
				{
					name: "离职",
					status: 0
				},
			], //员工状态
			taxRateList: [],
			taxinitList: [],
			calcList: [],
			attrList: [{
					name: "增项",
					attr: 1
				},
				{
					name: "减项",
					attr: 2
				}
			],
			currencyTypeList: [], //工资项目货币类型列表
			personalInitFormData: {
				id: '',
				name: '',
				taxItemId: '',
				taxTypeId: '',
				incomeId: '',
				incomePeriod: '',
				basicDeduction: '',
				otherDeduction: '',
				defaultSetting: 0
			},
			rootInitFormData: {
				id: '',
				name: '',
				taxItemId: '',
				taxTypeId: '',
				incomeId: '',
				incomePeriod: '',
				basicDeduction: '',
				otherDeduction: '',
				defaultSetting: 0
			},
			incomePeriodList: [
				1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12
			],
			//税率设置
			rateEditable: false,
			rateUpdateDisabled: false,
			rateDeleteDisabled: true,
			rateSaveDisabled: true,
			//个人所得项目
			subjectEditable: false,
			subjectUpdateDisabled: false,
			subjectDeleteDisabled: true,
			subjectSaveDisabled: true,
			//初始化设置
			initEditable: false,
			initUpdateDisabled: false,
			initDeleteDisabled: true,
			initSaveDisabled: true,
			openTime: '',
			okStatus: true,
		}
	},
	created() {},
	mounted() {
		this.openTime = window.parent.params && window.parent.params.openTime;
		this.initData();
	},
	watch:{
		'formData.categoryId':function(curV,oldV){
			console.log(curV,oldV)
			//查询货币类型
			//查询所的计算列表
			//查询税率列表
			//查询初始设置
			$.ajax({
				type: 'post',
				url: contextPath + '/incomeTax/initPage',
				data: {
					'categoryId': curV,
					'dataType': 6
				},
				success: function (result) {
					console.log(result)
					if (result.code != '100100') {
						vm.$Modal.error({
							title: '错误',
							content: '数据获取失败'
						});
						vm.categoryId = oldV;
						vm.formData.categoryId = oldV;
						vm.taxData.categoryId = oldV;
						vm.rootInitFormData.categoryId = oldV;
						vm.incomeData.categoryId = oldV;
					} else {
						vm.categoryId = curV;
						vm.formData.categoryId = curV;
						vm.taxData.categoryId = curV;
						vm.rootInitFormData.categoryId = curV;
						vm.incomeData.categoryId = curV;

						let dataInfo = result.data;
						vm.calcList = dataInfo.incomeItemList;
						vm.taxRateList = dataInfo.taxRateList;
						vm.taxinitList = dataInfo.taxinitList;
						vm.currencyTypeList = dataInfo.currencyTypeList;
						
						vm.$refs.importDepTree.loadData();
						vm.showDepType = false;

						// vm.pageInit();
						vm.getJqGridData();
					}
				}
			});
		}
	},
	methods: {
		initData() {
			$.ajax({
				type: 'post',
				url: contextPath + '/incomeTax/initPage',
				data: {
					'categoryId': 0,
					'dataType': 0
				},
				success: function (result) {
					console.log(result)
					if (result.code != '100100') {
						vm.$Modal.error({
							title: '错误',
							content: '页面初始化失败'
						});
					} else {
						let dataInfo = result.data;
						vm.formData.year = dataInfo.yearAndPeriod.curYear;
						vm.formData.period = dataInfo.yearAndPeriod.curPeriod;
						vm.yearPeriod =vm.formData.year + '年' + vm.formData.period + '期';
						vm.organizationList = dataInfo.org;
						vm.formData.sobId = vm.organizationList[0].value;
						vm.calcList = dataInfo.incomeItemList;
						vm.taxRateList = dataInfo.taxRateList;
						vm.taxinitList = dataInfo.taxinitList;
						vm.categoryList = dataInfo.categoryList;
						vm.currencyTypeList = dataInfo.currencyTypeList;
						vm.categoryId = dataInfo.defCategoryId;
						vm.formData.categoryId = vm.categoryId;
						vm.taxData.categoryId = vm.categoryId;
						vm.incomeData.categoryId = vm.categoryId;
						vm.rootInitFormData.categoryId = vm.categoryId;

						vm.empStationList = getCodeList("sys_station", vm.formData.sobId);
						vm.empRankList = getCodeList("sys_rank", vm.formData.sobId);
						vm.empLevelList = getCodeList("sys_station_level", vm.formData.sobId);
						vm.empEduList = getCodeList("sys_education", vm.formData.sobId);

						vm.pageInit();
					}
				}
			});
		},
		categoryChange(val) {
			
		},
		clickNameFun(item, type) {
			switch (type) {
				case 'subject': //所得项
					this.subjectActive = item.id;
					//获取所得项详情
					this.incomeData.id = item.id;
					this.incomeData.name = item.name;
					this.queryIncomeItemDetail(item.id);
					break;
				case 'tax': //税率
					this.taxData.id = item.id;
					this.taxData.name = item.name
					this.taxActive = item.id;
					//获取税率详情
					this.queryTaxRateDetail(item.id);
					break;
				case 'init': //初始设置
					this.initActive = item.id;
					this.personalInitFormData.name = item.name;
					this.personalInitFormData.id = item.id;
					//获取税率初始设置
					this.queryInitRateDetail(item.id);

					vm.okStatus = false;

					break;
			}

		},
		queryInitRateDetail(id) {
			$.ajax({
				type: 'post',
				url: contextPath + '/wmPersonalTaxInit/queryInitTax',
				contentType: 'application/json;charset=utf-8',
				data: JSON.stringify({
					'id': id,
					'categoryId': vm.categoryId
				}),
				dataType: 'json',
				success: function (result) {
					console.log(result)
					if (result.code == '100100') {
						vm.personalInitFormData = result.data;

						vm.personalInitFormData.incomePeriod = vm.formData.period;

						vm.initEditable = false;
						vm.initUpdateDisabled = false;
						vm.initDeleteDisabled = false;

					} else {
						vm.$Modal.error({
							title: '错误',
							content: '查询出错'
						})
					}
				}
			});
		},
		queryIncomeItemDetail(id) {
			$.ajax({
				type: 'post',
				url: contextPath + '/wmIncomeItem/queryIncomeItem',
				contentType: 'application/json;charset=utf-8',
				data: JSON.stringify({
					'id': id,
					'categoryId': vm.categoryId
				}),
				dataType: 'json',
				success: function (result) {
					console.log(result)
					if (result.code == '100100') {
						vm.subjectEditable = false;
						vm.subjectUpdateDisabled = false;
						vm.subjectDeleteDisabled = false;
						vm.subjectDataList = result.data.entryList;
					} else {
						vm.$Modal.error({
							title: '错误',
							content: '查询出错'
						})
					}
				}
			});
		},
		queryTaxRateDetail(id) {
			$.ajax({
				type: 'post',
				url: contextPath + '/wmTaxRate/queryTaxRate',
				contentType: 'application/json;charset=utf-8',
				data: JSON.stringify({
					'id': id,
					'categoryId': vm.categoryId
				}),
				dataType: 'json',
				success: function (result) {
					console.log(result)
					if (result.code == '100100') {
						vm.rateEditable = false;
						vm.rateUpdateDisabled = false;
						vm.rateDeleteDisabled = false;
						vm.taxDataList = result.data.itemList;
					} else {
						vm.$Modal.error({
							title: '错误',
							content: '查询出错'
						})
					}
				}
			});
		},
		alertAdd(type) { //新增
			switch (type) {
				case 'subject': //所得项
					vm.subjectDataList = [];
					$.extend(true, vm.subjectDataList, vm.rootSubjectDataList);
					vm.subjectEditable = true,
					vm.subjectUpdateDisabled = true,
					vm.subjectDeleteDisabled = false,
					vm.subjectSaveDisabled = false;
					vm.incomeData.id = '';
					vm.incomeData.name = '';
					break;
				case 'tax': //税率
					vm.taxDataList = [];
					$.extend(true, vm.taxDataList, vm.rootTaxDataList);
					vm.rateEditable = true;
					vm.rateUpdateDisabled = true;
					vm.rateDeleteDisabled = false;
					vm.rateSaveDisabled = false;
					vm.taxData.id = '';
					vm.taxData.name = '';
					break;
				case 'init': //初始设置
					vm.personalInitFormData = {};
					$.extend(true, vm.personalInitFormData, vm.rootInitFormData);
					vm.personalInitFormData.incomePeriod = vm.formData.period;
					vm.initEditable = true;
					vm.initUpdateDisabled = true;
					vm.initDeleteDisabled = false;
					vm.initSaveDisabled = false;

					vm.okStatus = true;


					break;
			}
		},
		alertUpdate(type) { //修改
			switch (type) {
				case 'subject': //所得项
					vm.subjectEditable = true;
					vm.subjectUpdateDisabled = true;
					vm.subjectSaveDisabled = false;
					break;
				case 'tax': //税率
					vm.rateEditable = true;
					vm.rateUpdateDisabled = true;
					vm.rateSaveDisabled = false;
					break;
				case 'init': //初始设置
					vm.initEditable = true;
					vm.initUpdateDisabled = true;
					vm.initSaveDisabled = false;
					break;
			}
		},
		alertDelete(type) { //删除
			let _url = '';
			switch (type) {
				case 'subject': //所得项
					if (this.subjectActive == null || this.subjectActive.length == 0) {
						vm.$Message.error("请选择一条所得项数据")
						return;
					}
					_url = contextPath + '/wmIncomeItem/deleteIncomeItem';
					this.deleteDetail(this.subjectActive, _url, type);
					break;
				case 'tax': //税率
					if (this.taxActive == null || this.taxActive.length == 0) {
						vm.$Message.error("请选择一条税率数据")
						return;
					}
					_url = contextPath + '/wmTaxRate/deleteTaxRate';
					this.deleteDetail(this.taxActive, _url, type);
					break;
				case 'init': //初始设置
					if (this.initActive == null || this.initActive.length == 0) {
						vm.$Message.error("请选择一条初始数据")
						return;
					}
					_url = contextPath + '/wmPersonalTaxInit/deleteInitTax';
					this.deleteDetail(this.initActive, _url, type);
					break;
			}
		},
		deleteDetail(id, _url, _type) {
			$.ajax({
				type: 'post',
				url: _url,
				contentType: 'application/json;charset=utf-8',
				data: JSON.stringify({
					'id': id,
					'categoryId': vm.categoryId
				}),
				dataType: 'json',
				success: function (result) {
					console.log(result)
					if (result.code == '100100') {
						// vm.$Modal.success({
						// 	title: '提示',
						// 	content: '操作成功'
						// })
						
						switch (_type) {
							case 'subject': //所得项
								vm.subjectActive = '';
								vm.calcList = [];
								vm.calcList = result.data;

								vm.subjectDataList = [];
								$.extend(true, vm.subjectDataList, vm.rootSubjectDataList);
								vm.incomeData.id = '';
								vm.incomeData.name = '';

								break;
							case 'tax': //税率
								vm.taxActive = '';
								vm.taxRateList = [];
								vm.taxRateList = result.data;

								vm.taxDataList = [];
								$.extend(true, vm.taxDataList, vm.rootTaxDataList);
								vm.taxData.id = '';
								vm.taxData.name = '';

								break;
							case 'init': //初始设置
								vm.initActive = '';
								vm.taxinitList = [];
								vm.taxinitList = result.data;

								vm.personalInitFormData = {};
								$.extend(true, vm.personalInitFormData, vm.rootInitFormData);
		
								vm.initEditable = false;
								vm.initUpdateDisabled = false;
								vm.initDeleteDisabled = false;

								break;
						}

					} else {
						vm.$Modal.error({
							title: '错误',
							content: '删除出错'
						})
					}
				}
			});
		},
		alertSave(type) { //保存
			switch (type) {
				case 'subject': //所得项
					this.saveIncomeItem();
					break;
				case 'tax': //税率
					this.saveTaxRate();
					break;
				case 'init': //初始设置
					this.savePersonalInit();
					break;
			}
		},
		savePersonalInit() {
			let dataInfo = this.personalInitFormData;
			if ($.isEmptyObject(dataInfo.name)) {
				this.$Message.error("初始设置名称不能为空");
				return;
			}
			if (dataInfo.taxItemId == null || dataInfo.taxItemId == '') {
				this.$Message.error("初始设置税率项目不能为空");
				return;
			}
			if (dataInfo.taxTypeId == null || dataInfo.taxTypeId == '') {
				this.$Message.error("初始设置税率类别不能为空");
				return;
			}
			if (dataInfo.incomeId == null || dataInfo.incomeId == '') {
				this.$Message.error("初始设置所得计算不能为空");
				return;
			}
			if (dataInfo.incomePeriod == null || dataInfo.incomePeriod == '') {
				this.$Message.error("初始设置所得期间不能为空");
				return;
			}
			$.ajax({
				type: 'post',
				url: contextPath + '/wmPersonalTaxInit/saveOrUpdate',
				contentType: 'application/json;charset=utf-8',
				data: JSON.stringify(dataInfo),
				dataType: 'json',
				success: function (result) {
					console.log(result)
					if (result.code == '100100') {
						vm.$Modal.success({
							title: '提示',
							content: '操作成功'
						})
						if (result.data != null) {
							vm.taxinitList = result.data;
						}

						vm.personalInitFormData = {};
						$.extend(true, vm.personalInitFormData, vm.rootInitFormData);

						vm.initEditable = false;
						vm.initUpdateDisabled = false;
						vm.initDeleteDisabled = false;


					} else {
						vm.$Modal.error({
							title: '错误',
							content: '操作失败'
						})
					}
				}
			});

		},
		saveIncomeItem() {
			let dataInfo = this.subjectDataList;
			if (this.incomeData.name == null || this.incomeData.name == '') {
				this.$Message.error("所得项目名称不能为空");
				return;
			}
			if (dataInfo == null || dataInfo.length == 0) {
				this.$Message.error("所得项目明细不能为空");
				return;
			}
			for (var i = 0; i < dataInfo.length; i++) {
				if (dataInfo[i].typeId == null || dataInfo[i].attr == null || dataInfo[i].typeId == '' || dataInfo[i].attr == '') {
					this.$Message.error("所得项目明细不完整");
					return;
				}
			}
			var _info = dataInfo.filter(function (item, idx) {
				if (!!dataInfo[idx].typeId && !!dataInfo[idx].attr) {
					return item;
				}
			});

			if (_info.length == 0) {
				this.$Message.error("所得项目明细不能为空");
				return;
			}
			_info.forEach((row, index) => {
				this.$set(row, 'sequence', index + 1);
			})
			vm.incomeData.entryList = _info;
			console.log(vm.incomeData);

			$.ajax({
				type: 'post',
				url: contextPath + '/wmIncomeItem/saveOrUpdate',
				contentType: 'application/json;charset=utf-8',
				data: JSON.stringify(vm.incomeData),
				dataType: 'json',
				success: function (result) {
					console.log(result)
					if (result.code == '100100') {
						vm.$Modal.success({
							title: '提示',
							content: '操作成功'
						})
						if (result.data != null) {
							vm.calcList = result.data;
						}

						vm.subjectEditable = false;
						vm.subjectUpdateDisabled = false;
						vm.subjectDeleteDisabled = false;

						vm.subjectDataList = [];
						$.extend(true, vm.subjectDataList, vm.rootSubjectDataList);
						vm.incomeData.id = '';
						vm.incomeData.name = '';

					} else {
						vm.$Modal.error({
							title: '错误',
							content: '操作失败'
						})
					}
				}
			});

		},
		saveTaxRate() {
			let tableInfo = this.taxDataList;
			if (this.taxData.name == null || this.taxData.name == '') {
				this.$Message.error("税率名称不能为空");
				return;
			}
			if (tableInfo == null || tableInfo.length == 0) {
				this.$Message.error("税率明细不能为空");
				return;
			}
			var _info = tableInfo.filter(function (item, idx) {
				if (!!tableInfo[idx].taxRate) {
					return item;
				}
			});

			if (_info.length == 0) {
				this.$Message.error("税率明细范围不能为空");
				return;
			}
			_info.forEach((row, index) => {
				this.$set(row, 'sequence', index + 1);
			})
			vm.taxData.itemList = _info;
			console.log(vm.taxData);
			$.ajax({
				type: 'post',
				url: contextPath + '/wmTaxRate/saveOrUpdate',
				contentType: 'application/json;charset=utf-8',
				data: JSON.stringify(vm.taxData),
				dataType: 'json',
				success: function (result) {
					console.log(result)
					if (result.code == '100100') {
						vm.$Modal.success({
							title: '提示',
							content: '操作成功'
						})
						if (result.data != null) {
							vm.taxRateList = result.data;
						}
						vm.rateEditable = false;
						vm.rateUpdateDisabled = false;
						vm.rateDeleteDisabled = false;

						vm.taxDataList = [];
						$.extend(true, vm.taxDataList, vm.rootTaxDataList);
						vm.taxData.id = '';
						vm.taxData.name = '';
					} else {
						vm.$Modal.error({
							title: '错误',
							content: result.msg
						})
					}
				}
			});

		},
		click_all(_name) {
			var that = this;
			var _list = [],
			_allShow = false;
			switch (_name) {
				case 'subjectDataList': //所得项
					_list = that.subjectDataList;
					_allShow = that.allShowSubject;
					break;
				case 'taxDataList': //税率
					_list = that.taxDataList;
					_allShow = that.allShowtax;
					break;
			}
			_allShow = !_allShow;
			_list.forEach(row => {
				row.show = _allShow;
			})

		},
		// 切换本行是否选中
		change_tr(row, _name) {
			var that = this;
			let count = 0;
			var _list = [],
				_allShow = false;
			switch (_name) {
				case 'subjectDataList': //所得项
					_list = that.subjectDataList;
					break;
				case 'taxDataList': //税率
					_list = that.taxDataList;
					break;
			}
			row.show = !row.show;
			_list.forEach(row => {
				if (row.show) count++;
			})
			if (count === _list.length) {
				_allShow = true;
			} else {
				_allShow = false;
			}
		},
		actionBtnMth(_type, _name) {
			var that = this;
			// 插入行 是在 选择 上面插入一条数据， 复制行 是在选择下面 插入一条数据并复制选择的数据值。 插入和复制都是单条，删除为多条

			var _info = {};
			var _list = [];
			if (_name === 'subjectDataList') {
				_list = that.subjectDataList;
				_info = Object.assign({}, {
					show: false,
					id: '',
					itemId: '',
					sequence: '',
					typeId: '',
					attr: ''
				})
			} else if (_name === 'taxDataList') {
				_list = that.taxDataList;
				_info = Object.assign({}, {
					show: false,
					id: '',
					taxId: '',
					sequence: 0,
					floorAmount: '',
					upperAmount: '',
					taxRate: '',
					quickDeduction: ''
				})

			}

			if (_type === 'addNew') {
				_list.push(_info);
			} else {
				console.log(_list)
				var _f = _list.filter(row => row.show)
				if (!_f.length) {
					that.$Message.info({
						content: '请选择一条数据',
						duration: 3
					});
					return;
				}
				let _i = Object.assign({}, _f[_f.length - 1])
				if (_name === 'subjectDataList') {
					that.subjectDataList = that.subjectDataList.filter(row => !row.show)
				} else if (_name === 'taxDataList') {
					that.taxDataList = that.taxDataList.filter(row => !row.show)
				}
			}
		},

		accountNum(val, rows, attr, name) {
			this.tableList.forEach(item => {
				if (item.id == rows.id) {
					item[attr] = val;
				}

			})
		},
		pageInit() {
			let that = this;
			Object.assign(that.formData, that.addData)
			if ($.jgrid) {
		        $.jgrid.defaults.onSortCol = function () {
		          // return 'stop'
		        };
			}
			jQuery("#grid").jqGrid({
				/* datatype: "json",
				mtype: 'POST',
				postData:JSON.stringify(that.formData),
				// multiselect : true,
				url: contextPath+'/incomeTax/listTaxRateEntry',
				ajaxGridOptions: { contentType: 'application/json;charset=utf-8' }, */
				datatype: 'local',
				rownumbers: true,
				colNames: ['id', 'categoryId', 'employeeId', 'personalTaxId', 'rateCal', 'sobId', 'wageCal',
					'纳税义务人', '身份证号码', '所得项目', '所得期间', '收入人民币', '减费用额',
					'应纳税所得额', '税率项目', '税率项目合计', '税率计算值',
					'税率', '速算扣除数', '扣缴所得税额'
				],
				colModel: [
					
					{
						name: 'id',
						width: 50,
						align: "center",
						sortable: false,
						key: true,
						hidden: true
					},
					{
						name: 'categoryId',
						width: 50,
						align: "center",
						sortable: false,
						hidden: true
					},
					{
						name: 'employeeId',
						width: 50,
						align: "center",
						sortable: false,
						hidden: true
					},
					{
						name: 'personalTaxId',
						width: 50,
						align: "center",
						sortable: false,
						hidden: true
					},
					{
						name: 'rateCal',
						width: 50,
						align: "center",
						sortable: false,
						hidden: true
					},
					{
						name: 'sobId',
						width: 50,
						align: "center",
						sortable: false,
						hidden: true
					},
					{
						name: 'wageCal',
						width: 50,
						align: "center",
						sortable: false,
						hidden: true
					},
					{
						name: 'empName',
						width: 80,
						align: "left",
						sortable: false
					},
					{
						name: 'idCard',
						width: 150,
						align: "center",
						sortable: false
					},
					{
						name: 'incomeName',
						width: 150,
						align: "center",
						sortable: false,
					},
					{
						name: 'incomePeriod',
						width: 80,
						align: "center",
						sortable: false,
					},
					{
						name: 'incomeRmb',
						width: 100,
						align: "right",
						sortable: true,
						sorttype: "number",
						formatter: function (value, grid, rows, state) {
							$(document).off("blur", ".prea" + rows.id).on("blur", ".prea" + rows.id, function (ev) {
								let val = ev.target.value ? Number(ev.target.value).toFixed(2) : ''
								ev.target.value = val;
								that.accountNum(val, rows, 'incomeRmb', "prea");
							});
							let btns = "";
							btns = `<input value="${rows.incomeRmb}"  border="none"  class="prea${rows.id} form-control text-right" type="number"/>`;
							return btns
						},
						cellattr: function (rowId, val, rawObject, cm, rdata) {
							return 'style="coler:black;background-color:white"';
						}
					},
					{
						name: 'costReduction',
						width: 100,
						align: "right",
						sortable: true,
						sorttype: "number",
						formatter: function (value, grid, rows, state) {
							$(document).off("blur", ".preaCost" + rows.id).on("blur", ".preaCost" + rows.id, function (ev) {
								let val = ev.target.value ? Number(ev.target.value).toFixed(2) : ''
								ev.target.value = val;
								that.accountNum(val, rows, 'costReduction', "preaCost");
							});
							let btns = "";
							btns = `<input value="${rows.costReduction}"  class="preaCost${rows.id} form-control text-right" type="number"/>`;
							return btns;
							// let div = `<input class="ivu-input" type="number">`
							// return div;
						},
						cellattr: function (rowId, val, rawObject, cm, rdata) {
							return 'style="coler:black;background-color:white"';
						}
					},
					{
						name: 'incomeTax',
						width: 100,
						align: "right",
						sortable: true,
						sorttype: "number",
						formatter: function (value, grid, rows, state) {
							return vm.formatMoney(value);
						},
					},
					{
						name: 'taxRateItems',
						width: 100,
						align: "right",
						sortable: true,
						sorttype: "number",
						formatter: function (value, grid, rows, state) {
							$(document).off("blur", ".preaTaxRate" + rows.id).on("blur", ".preaTaxRate" + rows.id, function (ev) {
								let val = ev.target.value ? Number(ev.target.value).toFixed(2) : ''
								ev.target.value = val;
								that.accountNum(val, rows, 'taxRateItems', "preaTaxRate");
							});
							let btns = "";
							btns = `<input value="${rows.taxRateItems}"  class="preaTaxRate${rows.id} form-control text-right" type="number"/>`;
							return btns;
						},
						cellattr: function (rowId, val, rawObject, cm, rdata) {
							return 'style="coler:black;background-color:white"';
						}
					},
					{
						name: 'totalTaxRateItems',
						width: 100,
						align: "right",
						sortable: true,
						sorttype: "number",
						formatter: function (value, grid, rows, state) {
							return vm.formatMoney(value);
						},
					},
					{
						name: 'taxRateCalcValue',
						width: 100,
						align: "right",
						sortable: true,
						sorttype: "number",
						formatter: function (value, grid, rows, state) {
							return vm.formatMoney(value);
						},
					},
					{
						name: 'taxRate',
						width: 80,
						align: "right",
						sortable: true,
						sorttype: "number",
						formatter: function (value, grid, rows, state) {
							return vm.formatMoney(value);
						},
					},
					{
						name: 'quickCalcDeduction',
						width: 100,
						align: "right",
						sortable: true,
						sorttype: "number",
						formatter: function (value, grid, rows, state) {
							return vm.formatMoney(value);
						},
					},
					{
						name: 'withholdingIncomeTax',
						width: 100,
						align: "right",
						sortable: true,
						sorttype: "number",
						formatter: function (value, grid, rows, state) {
							return vm.formatMoney(value);
						},
					},
				],
				rowNum: 999999999, //一页显示多少条
				// jsonReader: {
				// 	root: "data",
				// },
				styleUI: 'Bootstrap',
				height: $(window).height() - 210,
				onSelectRow: function (data, status) { // 当选择行时触发此事件
					console.log("data---------", data, status);
					that.chooseId = data;
				},
				loadComplete: function (ret) {
					$("table[id='grid']").addClass("alltotalClass");
					jQuery('#grid').jqGrid('setLabel','rn', '序号', {'text-align':'center','vertical-align':'middle'},'');
					//获取表格所有行数据
					if (ret.code === '100100') {
						that.tableList = ret.data || [];
					}
					console.log('tableList', that.tableList)
				},
			})
			this.getJqGridData();
		},
		getJqGridData() {
			$.ajax({
				type: 'post',
				url: contextPath + '/incomeTax/listTaxRateEntry',
				contentType: 'application/json;charset=utf-8',
				data: JSON.stringify(vm.formData),
				dataType: 'json',
				success: function (result) {
					console.log(result)
					if (result.code == '100100') {
						vm.tableList = result.data || [];
						// vm.$Modal.success({
						// 	title: '提示',
						// 	content: '操作成功'
						// })
						jQuery("#grid").jqGrid("clearGridData");
						// for (var i = 0; i <= vm.tableList.length; i++) {
						// 	jQuery("#grid").jqGrid('addRowData', i + 1, vm.tableList[i]);
						// }
						$("#grid").jqGrid('setGridParam', {
							data: result.data
						}).trigger("reloadGrid");
					} else {
						vm.$Modal.error({
							title: '错误',
							content: '操作失败'
						})
					}
				}
			});
		},
		openFun(type) {
			vm.subjectActive= ''; // 选中时样式
			vm.taxActive='';
			vm.initActive= '';
			vm.alertAdd(type); //新增


			vm.rateEditable= false
			vm.subjectEditable= false
			vm.initEditable= false

			/*
			switch (type) {
				case 'subject': //所得项
					//个人所得项目
					vm.subjectEditable = false;
					vm.subjectUpdateDisabled = false;
					vm.subjectDeleteDisabled = true;
					vm.subjectSaveDisabled = true;

					vm.incomeData.id = '';
					vm.incomeData.name = '';

					break;
				case 'tax': //税率
					//税率设置
					vm.rateEditable = false;
					vm.rateUpdateDisabled = false;
					vm.rateDeleteDisabled = true;
					vm.rateSaveDisabled = true;
					vm.taxData.id = '';
					vm.taxData.name = '';
					break;
				case 'init': //初始设置
					//初始化设置
					vm.initEditable = false;
					vm.initUpdateDisabled = false;
					vm.initDeleteDisabled = true;
					vm.initSaveDisabled = true;
					vm.personalInitFormData = {};
					$.extend(true, vm.personalInitFormData, vm.rootInitFormData);
					break;
			}*/
			
			this[type + 'Visible'] = true;
		},
		delFun() {
			this.$Modal.confirm({
				title: '提示信息',
				content: '<p>确定要删除所选</p>',
				loading: true,
				onOk: () => {
					console.log("删除");
					setTimeout(() => {
						this.$Modal.remove();
					}, 2000);
				}
			});
		},
		save() {
			// vm.pageInit();
			vm.getJqGridData();
			vm.filterVisible = false;
		},
		// reloadInit() {
		// 	$("#grid").jqGrid('setGridParam', { // 重新加载数据
		// 		postData: JSON.stringify(vm.formData)
		// 	}).trigger("reloadGrid");
		// },

		cancel() {
			this.filterVisible = false;
		},
		saveFun(type) {
			switch (type) {
				case 'subject': //所得项
					this[type + 'Visible'] = false;
					break;
				case 'tax': //税率
					this[type + 'Visible'] = false;
					break;
				case 'init': //初始设置

					this[type + 'Visible'] = false;
					if (!!vm.initActive) {
						this.$Modal.confirm({
							title: '提示',
							content: '<p>用选定的初始设置重新计算工资数据吗？</p >',
							loading: true,
							onOk: () => {
								this.$Modal.remove();
								setTimeout(() => {
									vm.$Modal.confirm({
										title: '提示',
										content: '<p>重新计算税率及纳税额吗？</p >',
										loading: true,
										closable: false,
										onOk: () => {
											vm.formData.initId = vm.initActive;
											vm.reloadAll(1, 1,'cli_all');
											setTimeout(() => {
												vm.$Modal.remove();
											}, 1500);
										},
										onCancel: () => {
											vm.formData.initId = vm.initActive;
											vm.reloadAll(1, 0,'cli_all');
											setTimeout(() => {
												vm.$Modal.remove();
											}, 1500);
										}
									});
								}, 300);
							},
						});
					}else{
						vm.$Modal.error({
							title:'错误',
							content:'请先选择税率初始设置条目'
						})
					}
					break;
			}
		},
		cliTaxRate() {
			if (vm.tableList == null || vm.tableList.length == 0) {
				vm.$Message.error("暂无数据");
				return;
			}
			vm.$Modal.confirm({
				title: '提示',
				content: '<p>重新计算税率及纳税额吗？</p >',
				loading: true,
				onOk: () => {
					vm.reloadAll(0, 1,'cli_rate');
					setTimeout(() => {
						vm.$Modal.remove();
					}, 1000);
				}
			});
		},
		reloadAll(wageCal, rateCal,_type) {
			if(_type == 'cli_all'){
				for (var i = 0; i < vm.tableList.length; i++) {
					vm.tableList[i].rateCal = rateCal;
					vm.tableList[i].wageCal = wageCal;
					vm.tableList[i].personalTaxId = vm.initActive;
				}
			}else{
				for (var i = 0; i < vm.tableList.length; i++) {
					vm.tableList[i].rateCal = rateCal;
					vm.tableList[i].wageCal = wageCal;
				}
			}
			

			/* $("#grid").jqGrid('setGridParam',{  // 重新加载数据
					postData:JSON.stringify(vm.tableList)
			}).trigger("reloadGrid"); */
			$.ajax({
				type: 'post',
				url: contextPath + '/incomeTax/cliTaxRate',
				contentType: 'application/json;charset=utf-8',
				data: JSON.stringify(vm.tableList),
				dataType: 'json',
				success: function (result) {
					console.log(result)
					if (result.code == '100100') {
						vm.$Modal.success({
							title: '提示',
							content: '操作成功'
						})
						jQuery("#grid").jqGrid("clearGridData");
						vm.tableList = result.data || [];
						// for (var i = 0; i <= vm.tableList.length; i++) {
						// 	jQuery("#grid").jqGrid('addRowData', i + 1, vm.tableList[i]);
						// }
						$("#grid").jqGrid('setGridParam', {
							data: result.data
						}).trigger("reloadGrid");
					} else {
						vm.$Modal.error({
							title: '错误',
							content: '操作失败'
						})
					}
				}
			});
		},
		saveCliTaxRate() {
			$.ajax({
				type: 'post',
				url: contextPath + '/incomeTax/saveCliTaxRate',
				contentType: 'application/json;charset=utf-8',
				data: JSON.stringify(vm.tableList),
				dataType: 'json',
				success: function (result) {
					console.log(result)
					if (result.code == '100100') {
						vm.$Modal.success({
							title: '提示',
							content: '操作成功'
						})
					} else {
						vm.$Modal.error({
							title: '错误',
							content: '操作失败'
						})
					}
				}
			});
		},
		cancelFun(type) {
			this[type + 'Visible'] = false;
		},
		refresh() {
			//    // $("#list").jqGrid('clearGridData');  //清空表格
			//     this.formData.startDate = this.operateDate(this.formData.startDate);
			//     this.formData.endDate = this.operateDate(this.formData.endDate);
			//     $("#list").jqGrid('setGridParam',{  // 重新加载数据
			//         postData:this.formData
			//     }).trigger("reloadGrid");
			//     this.cancel()
			// jQuery("#list").trigger("reloadGrid"); //刷新
			vm.getJqGridData();
		},
		depTreeClickCallBack(event, treeId, treeNode) {
			console.log(treeNode);
			if (treeNode.children != null && treeNode.children.length != 0) {
				return;
			}
			this.formData.depId = treeNode.id;
			this.formData.depName = treeNode.name;
			this.showDepType = false;
		},
		showTrees(value, which, index) {
			switch (which) {
				case 'showDepTree':
					if (this.showDepType === true) {
						this.showDepType = false;
						return;
					}
					this.showDepType = value;
					break;
			}
		},
		//当单击父节点，返回false，不让选取
		treeBeforeClick(treeId, treeNode, clickFlag) {
			return !treeNode.isParent;
		},
		exitHtml() {
			window.parent.closeCurrentTab({
				name: '税率计算',
				openTime: this.openTime,
				exit: true
			})
		},
		formatMoney(value) {
			return value == null || value == 0 ? '0.00' : accounting.formatNumber(value, 2, "");
		},
		exportExcel(){
			let data = vm.formData;
			let _url = contextPath+"/incomeTax/exportExcel?sobId="+data.sobId+
			"&empCode="+data.empCode+
			"&empName="+data.empName+
			"&idCard="+data.idCard+
			"&depId="+data.depId+
			"&empStation="+data.empStation+
			"&empRank="+data.empRank+
			"&stationLevel="+data.stationLevel+
			"&empEdu="+data.empEdu+
			"&entryStartDate="+data.entryStartDate+
			"&entryEndDate="+data.entryEndDate+
			"&empStatus="+data.empStatus+
			"&categoryId="+data.categoryId+
			"&initId="+data.initId+
			"&year="+data.year+
			"&period="+data.period
                
            console.log(_url)
            window.open(_url);
		}
	}
})