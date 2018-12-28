Vue.component('ht-bs-import', {
	data () {
		return {
			show: this.value,
			dataList: [],
			subjectVisable: false,
			upload_config: {
				url: contextPath + '/bankstatementappcontroller/uploadBankStatementByExcel',
				uploadType: '父级文件导入'
			},
			formData: {
				'subjectId': '',
				'currencyId': '',
				'accountYear': '',
                'accountPeriod': '',
                'accountNumber':'',
                'exchangeRate':'',
                fileList:[],
            },
            currencyList:[],
        }
	},
	methods: {
		uploadSuccess (response) {

            console.log("查看点击上传之后的回调函数result: ");
            console.log(response);
            let that = this;
            that.formData.fileList = response.data;


		    if(response.code != '100100'){
                that.$Message.error({
                    content: response.msg,
                    duration: 3,
                    closable: true});
                this.$refs.uploadRef.clearFiles();
                return;
            }

            $("#list2").jqGrid('setGridParam',{data:that.formData.fileList}).trigger("reloadGrid");

            that.$Message.success({
                content: '文件上传成功!',
                duration: 3,
                closable: true});
		},
		uploadError (error, file, fileList) {
			console.log(error, file, fileList, 'uploadError :error, file, fileList');
		},
		editClick (data) {
			console.log(data);
		},
		closeModal () {
		    let _vm = this;
			this.$emit('close');
            _vm.formData.fileList = [];
            $("#list2").clearGridData();
            this.$refs.uploadRef.clearFiles();
			console.log(_vm.formData);
		},

		getColSumDetail (name) {
			let rs = $(`td[aria-describedby='list2_${name}']`);
			let sum = 0;
			if (rs.children("div.sumCol").length !== 0) {
				rs = $(`td[aria-describedby='list2_${name}']`).children("div.sumCol")
			} else {
				rs = $(`td[aria-describedby='list2_${name}']:not(:last)`)
			}
			rs.each((i, e) => {
				sum += accounting.unformat($(e).text()) * 1000
			})
			sum /= 1000;
			sum = accounting.formatMoney(sum, '', 2);
			return sum;
		},
		pageInitDetail () {
            let that = this;
			//var _url = rcContextPath + '/incomeCategory/queryListPage?r=' + new Date().getTime();
                jQuery("#list2").jqGrid(
				{
					// url: _url,
					// postData: JSON.stringify(that.formData),
					// ajaxGridOptions: { contentType: 'application/json;charset=utf-8' },
                    // datatype: "json",
                    datatype: "local",
                    data: that.formData.fileList,
					colNames: ['日期', '摘要', '借方金额', '贷方金额','备注'],
					height: '250',
					colModel: [
						{ name: 'dateTimeStr', width: 100, align: "center" },
						{ name: 'summary', width: 245, align: "center" },
						{ name: 'debitAmountFor', width: 150, align: "center",formatter: function (value, grid, rows, state) {
                            return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
                        }
                        },
						{ name: 'creditAmountFor', width: 150, align: "center",formatter: function (value, grid, rows, state) {
                            return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
                        }
                        },
						{ name: 'remark', width: 200, align: "center" },
					],
					rowNum: 999999999,//一页显示多少条
					sortorder: "desc",//排序方式,可选desc,asc
					// mtype: "post",//向后台请求数据的ajax的类型。可选post,get
					// jsonReader: {
					// 	root: "data.list",
					// 	total: "data.totalPage",
					// 	records: "data.totalCount",
					// 	cell: "list",
					// },
					sortable: false,
					styleUI: 'Bootstrap',
					height: '230',
					viewrecords: true,
					rownumbers: true,
					// footerrow: true,
					// userDataOnFooter: true,
					// gridComplete: that.completeMethodDetail,
					loadComplete: function (xhr) {
						console.log(xhr, '===========xhr=');
						that.lodoPList = xhr.data || [];
					},
					onCellSelect: function (rowid) {
						let rowData = jQuery("#list2").jqGrid('getRowData', rowid);

					},
					ondblClickRow: function (rowid) {

					}
				});
		},

		completeMethodDetail () {
			$("#list2").footerData('set', {
				"code": '合计',
				'subjectId': [0],
			});
			var sum_subjectId = this.getColSumDetail('subjectId');

			$("#list2").footerData('set', {
				"code": '合计',
				'subjectId': sum_subjectId,
			});

		},

        downloadf1(){
            //导入功能弹出框点击 下载引入格式
            this.$emit('downloadf1');
        },
        //导入功能弹出框的科目变化时.之前调用父js未成功,打算直接写在本js里面 this.$emit('importsc1',this.formData.subjectId);
        importSubjectChange(item){
            //引入按钮弹框界面的科目变化时
            let _vm = this;
            $.ajax({
                type: 'post',
                url: contextPath + '/cnbankdepositjournalappcontroller/subjectChange',
                data: {'subjectId': item},
                success: function (result) {
                    if (result.code === '100100') {
                        _vm.currencyList = result.data;
                        _vm.$refs.editCurrencyIdRef.reset();
                        _vm.$nextTick(function () {
                            if(_vm.currencyList.length >0){
                                _vm.formData.currencyId = _vm.currencyList[0].currencyId;
                            }
                        });
                        console.log("引入界面的科目发生变化时查看返回的币别list:result.data");
                        console.log(_vm.currencyList)
                    } else {
                        _vm.$Message.error({
                            content: '请求错误!',
                            duration: 3,
                            closable: true});
                    }
                }
            });
        },

        importsave1(){

            let _vm = this;
            //导入功能弹出框点击 引入
            let data = _vm.formData;
            //获取汇率
            $.each(_vm.currencyList, function (idx, ele) {
                if (data.currencyId === ele.currencyId) {
                    data.exchangeRate = ele.exchangeRate;
                } else {
                    data.exchangeRate = 1;
                }
            });


            $.each(_vm.subjectList, function (idx, ele) {
                if (data.subjectId === ele.accountId) {
                    data.accountNumber = ele.bankAccount;
                }
            });

            this.$emit('importsave1',this.formData);
            _vm.closeModal();
        },
	},
	mounted(){
	},
	watch: {
		value (val) {
			console.log(val);
			this.show = val;
			val && this.pageInitDetail()
		}
	},
	computed: {

	},
	filters: {
		filterMoney (value) {
			return accounting.formatMoney(value, "", 2)
		},
		filterOperate (value) {
			switch (value) {
				case '1':
					return '余额';
				case '2':
					return '借方余额';
				case '3':
					return '贷方余额';
				default:
					break;
			}

		}
	},
	props: ['value', 'organizationList','subjectList','periodYear','periodList','downloadf','importsave'],
	template: `
			<div>
					<Modal
							title='银行对账单引入'
							v-model="show"
							width="700"
							@on-cancel='closeModal'
							:mask-closable="false">
							<div>
								<Row class="pt10">
                    <i-col :span="12" class="ht-lineHeight30">
												<label class="w60 ht-star2">科目：</label>
												<i-select v-model="formData.subjectId" style="width:200px;" @on-change="importSubjectChange">
														<i-option v-for="item in subjectList"  :value="item.accountId" :key="item.accountId">
														 <slot>{{ item.accountCode }}|{{ item.bankName }}</slot></i-option>
												</i-select>
										</i-col>
                    <i-col :span="12" class="ht-lineHeight30">
												<label class="w60 ht-star2">币别：</label>
												<i-select v-model="formData.currencyId" name="editCurrencyIdRef" ref="editCurrencyIdRef" style="width:120px;">
														<i-option v-for="item in currencyList" :value="item.currencyId" :key="item.currencyId">
													<slot>{{ item.currencyName }}</slot>
													</i-option>
												</i-select>
										</i-col>
								</Row>		
								<Row class="pt10">
                    <i-col :span="12" class="ht-lineHeight30">
												<label class="w60 ht-star2">期间：</label>
												<i-select v-model="formData.accountYear" filterable style="width:100px;">
														<i-option v-for="item in periodYear" :value="item.value" :key="item.value">{{item.name}}</i-option>
												</i-select>
												年
												<i-select v-model="formData.accountPeriod" filterable style="width:80px;">
														<i-option v-for="item in periodList" :value="item.value" :key="item.value">{{item.name}}</i-option>
												</i-select>
												期
										</i-col>
										
								</Row>
								<Row class="pt10">
									<i-col :span="12" >
										<Upload  
							 				ref="uploadRef"
											:on-success="uploadSuccess"
											:on-error="uploadError"
											:action="upload_config.url"
										>
											<i-button type="ghost" icon="ios-cloud-upload-outline">上传文件</i-button>
										</Upload>
									</i-col>
									<i-button @click="downloadf1">下载引入格式</i-button>
								</Row>
								<div class="ht-receivableW-table mt10"> 
										<div class="jqGrid_wrapper2">
											<table id="list2"></table>
											<div id="pager2"></div>
									</div>
								</div>
									
							</div>
							<div slot="footer">
										<i-button type="primary" @click="importsave1">引入</i-button>
										<i-button @click="closeModal">取消</i-button>
								</div>
					</Modal>
			</div>
	`
})