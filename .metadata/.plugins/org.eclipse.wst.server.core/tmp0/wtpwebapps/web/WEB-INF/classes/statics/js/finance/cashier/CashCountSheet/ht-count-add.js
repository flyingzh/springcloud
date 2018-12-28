Vue.component('ht-count-add', {
	data () {
		return {
			show: this.value,
			dataList: [],
			floatNumber: 2, // 小数点位数
			formData: {
				'id': '',
				'sobId': '',
				'datetime': '',
				'currencyId': '',
				'subjectName': '',
				'subjectCode': '',
				'subjectId': '',
				'remark': '',
				'totalAmount': ''
			},
			parValueStr: ['100元', '50元', '20元', '10元', '5元', '2元', '1元', '5角', '2角', '1角', '5分', '2分', '1分'],
			// dataList: [
			// 	{ 'id': '1', 'parValueStr': '100元', 'parValue': 100, 'hundreds': 0, 'twenty': 0, 'tails': 0, 'amount': 0 },
			// 	{ 'id': '2', 'parValueStr': '50元', 'parValue': 50, 'hundreds': 0, 'twenty': 0, 'tails': 0, 'amount': 0 },
			// 	{ 'id': '3', 'parValueStr': '20元', 'parValue': 20, 'hundreds': 0, 'twenty': 0, 'tails': 0, 'amount': 0 },
			// 	{ 'id': '4', 'parValueStr': '10元', 'parValue': 10, 'hundreds': 0, 'twenty': 0, 'tails': 0, 'amount': 0 },
			// 	{ 'id': '5', 'parValueStr': '5元', 'parValue': 5, 'hundreds': 0, 'twenty': 0, 'tails': 0, 'amount': 0 },
			// 	{ 'id': '6', 'parValueStr': '2元', 'parValue': 2, 'hundreds': 0, 'twenty': 0, 'tails': 0, 'amount': 0 },
			// 	{ 'id': '7', 'parValueStr': '1元', 'parValue': 1, 'hundreds': 0, 'twenty': 0, 'tails': 0, 'amount': 0 },
			// 	{ 'id': '8', 'parValueStr': '5角', 'parValue': 0.5, 'hundreds': 0, 'twenty': 0, 'tails': 0, 'amount': 0 },
			// 	{ 'id': '9', 'parValueStr': '2角', 'parValue': 0.2, 'hundreds': 0, 'twenty': 0, 'tails': 0, 'amount': 0 },
			// 	{ 'id': '10', 'parValueStr': '1角', 'parValue': 0.1, 'hundreds': 0, 'twenty': 0, 'tails': 0, 'amount': 0 },
			// 	{ 'id': '11', 'parValueStr': '5分', 'parValue': 0.05, 'hundreds': 0, 'twenty': 0, 'tails': 0, 'amount': 0 },
			// 	{ 'id': '12', 'parValueStr': '2分', 'parValue': 0.02, 'hundreds': 0, 'twenty': 0, 'tails': 0, 'amount': 0 },
			// 	{ 'id': '13', 'parValueStr': '1分', 'parValue': 0.01, 'hundreds': 0, 'twenty': 0, 'tails': 0, 'amount': 0 },
			// ],
		}
	},
	methods: {
		pageInitDetail () {
			/*if(this.organizationList!=null&&this.organizationList!=0){
                this.formData.sobId = this.organizationList[0].value;
			}
			if(this.currencyList!=null&&this.currencyList!=0){
                this.formData.currencyId = this.currencyList[0].id;
			}
			if(this.subjectList!=null&&this.subjectList!=0){
                this.formData.subjectId = this.subjectList[0].accountId;
                this.formData.subjectName = this.subjectList[0].accountName;
                this.formData.subjectCode = this.subjectList[0].accountCode;
			}
            if(this.periodDate!=null){
				console.log(this.periodDate.endDate)
                this.formData.datetime = new Date(this.periodDate.endDate).format("yyyy-MM-dd");
			}*/
			Object.assign(this.formData, this.formAdd)
		},
		editClick (data) {
			console.log(data);
		},
		closeModal () {
			this.$emit('close')
		},
		refresh () {
			this.$emit('close');
			// this.$emit('refresh');
			this.$emit('loadtree');
		},
		formatMoney (value) {
			return value == null || value == 0 ? '0.00' : accounting.formatNumber(value, 2, "");
		},
		// 格式化数字
		formatNum (f, digit) {
			// f = value  digit= 比例
			var m = Math.pow(1000, digit);
			return parseInt(f * m, 10) / m;
		},
		// 修改金额后触发其他币种
		blur_money (row, attr) {
			// if (!row[attr]) return;
			var that = this;
			// let num = this.formatNum(row[attr] * row['parValue'], 1)
			/*let _hold = this.formatMoney(row['hundreds'] * 100 * row['parValue']);
			let _card = this.formatMoney(row['twenty'] * 20 * row['parValue']);
			let _tn = this.formatMoney(row['tails'] * row['parValue']);
			row['amount'] = this.formatMoney(_hold + _card + _tn);*/
			let _hold = row['hundreds'] * 100 * row['parValue'];
			let _card = row['twenty'] * 20 * row['parValue'];
			let _tn = row['tails'] * row['parValue'];
			row['amount'] = this.formatMoney(_hold + _card + _tn);
		},
		getPreCheckList () {
			let _vm = this;
			let time = new Date(_vm.formData.datetime).format("yyyy-MM-dd")
			$.ajax({
				type: 'POST',
				url: contextPath + "/checklist/getPreCheckList",
				data: { 'time': time, 'currencyId': _vm.formData.currencyId },
				success: function (ret) {
					console.log(ret)
					if (ret.code == '100100') {
						_vm.dataList = ret.data.checkDetail;
						$.each(_vm.dataList, function (key, val) {
							let parValueStr = { 'parValueStr': _vm.parValueStr[val.sequence - 1] };
							val.amount = _vm.formatMoney(val.amount);
							Object.assign(val, parValueStr)
						});
					} else {
                        _vm.$Modal.error({
                            title:'错误',
                            content:'暂无数据'
                        })
					}
				},
				error: function (ret) {
					console.log(ret);
				}
			});
		},
		saveBooks () {
			let _vm = this;
			// this.formData.datetime = new Date(this.formData.datetime).format("yyyy-MM-dd")
			let total = 0;
			this.dataList.forEach(item => {
				total += item.amount;
			});

			total = accounting.formatNumber(total, _vm.floatNumber, "");

			_vm.formData.totalAmount = total;
			let params = { 'cashCheck': _vm.formData, 'checkDetail': _vm.dataList };
			console.log(params)
			$.ajax({
				type: 'POST',
				url: contextPath + "/checklist/saveOrUpdate",
				contentType: 'application/json;charset=utf-8',
				data: JSON.stringify(params),
				dataType: 'json',
				success: function (ret) {
					console.log(ret)
                    _vm.$Modal.info({
                        title:'提示',
                        content:ret==null||ret.msg==null||ret.msg == ''?'提示':ret.msg
                    })
					if (ret.code == '100100') {
						_vm.refresh();
					}
					// location.reload();
					/* if(ret.code == '100100'){
						 setTimeout(function(){
							 // window.location.href = contextPath + '/finance/voucher-lrt/index.html';
						 }, 500);
					 }*/
				},
				error: function (ret) {
					console.log(ret);
				}
			});
		}
	},
	watch: {
		value (val) {
			console.log(val);
			this.show = val;
			val && this.pageInitDetail()
		},
	},
	computed: {
		totalAmount () {
			let total = 0;
			this.dataList.forEach(item => {
				if (item != null && item.amount != '') {
					total += parseFloat(item.amount);
				}
			});
			total = accounting.formatNumber(total, this.floatNumber, "");
			return total ? total : '0.00';
		},
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
	props: ['value', 'title', 'organizationList', 'dataList', 'currencyList', 'subjectList', 'periodDate', 'formAdd'],
	template: `
			<div>
					<Modal
							:title='title'
							v-model="show"
							width="600"
							@on-cancel='closeModal'
							:mask-closable="false">
							<div>

								<Row class="pt10">
                    					<i-col :span="24" class="ht-lineHeight30">
												<label class="w85">所属组织：</label>
												<i-select v-model="formData.sobId" disabled style="width:450px;">
														<i-option v-for="item in organizationList" :value="item.value">{{item.label}}</i-option>
												</i-select>
										</i-col>
								</Row>	
								<Row class="pt10">
									<i-col :span="12" class="ht-lineHeight30">
											<label class="w85">科目：</label>
											<i-select v-model="formData.subjectId" style="width:187px;">
													<i-option v-for="item in subjectList" :value="item.accountId">{{item.accountName}}</i-option>
											</i-select>
									</i-col>
										
									<i-col :span="12" class="ht-lineHeight30">
											<label class="w85">币别：</label>
											<i-select v-model="formData.currencyId" style="width:166px;">
													<i-option v-for="item in currencyList" :value="item.id">{{item.currencyName}}</i-option>
											</i-select>
									</i-col>
								</Row>		
								<Row class="pt10">
                    			<i-col :span="12" class="ht-lineHeight30">
												<label class="w85">日期：</label>
												<date-picker v-model="formData.datetime" end="true" class="inline-block"></date-picker>
										</i-col>
										<i-col :span="12" class="ht-lineHeight30" style="text-align: right;padding-right: 30px;">
											<i-button @click="getPreCheckList">获取上次盘点数</i-button>
                    			</i-col>
								</Row>
						
									<div class="ht-receivableW-table mt5">
										<div class="ht-wrapper-tbl">
											<table class="table tablediv">
												<thead>
													<tr>
														<td class="wt100">票面</td>
														<td class="wt100">把(百张)</td>
														<td class="wt100">卡(二十张)</td>
														<td class="wt100">尾款数(个)</td>
														<td class="wt100">金额小计</td>
													</tr>
												</thead>
												<tbody>
													<tr v-for="item in dataList">
														<td class="wt100">{{item.parValueStr}}</td>
														<td class="wt100 ht-nopadding" style="background-color: #ffffff ">
															<InputNumber :min="0" class="form-control input-sm ht-input ht-commTxtContent" @on-change="blur_money(item,'hundreds')" v-model="item.hundreds" ></InputNumber>
														</td>
														<td class="wt100 ht-nopadding" style="background-color: #ffffff ">
															<InputNumber :min="0" class="form-control input-sm ht-input ht-commTxtContent" @on-change="blur_money(item,'twenty')" v-model="item.twenty" ></InputNumber>
														</td>
														<td class="wt100 ht-nopadding" style="background-color: #ffffff ">
															<InputNumber :min="0" class="form-control input-sm ht-input ht-commTxtContent" @on-change="blur_money(item,'tails')" v-model="item.tails" ></InputNumber>
														</td>
														<td class="wt100" style="background-color: #eee;">{{item.amount}}</td>
													</tr>
												</tbody>
												<tfoot>
														<tr>
															<td class="wt100">金额合计</td>
															<td class="wt100"></td>
															<td class="wt100"></td>
															<td class="wt100"></td>
															<td class="wt100">{{totalAmount}}</td>
														</tr>
													</tfoot>
											</table>
										</div>
									</div>
									<Row class="pt10">
                   						<i-col :span="24" class="ht-lineHeight30">
												<label class="w85">备注：</label>
												<i-input type="text" style="width:450px;"  v-model="formData.remark" ></i-input>
										</i-col>
								</Row>	
							</div>
							<div slot="footer">
										<i-button type="primary" @click="saveBooks">确定</i-button>
										<i-button @click="closeModal">取消</i-button>
								</div>
					</Modal>
			</div>
	`
})