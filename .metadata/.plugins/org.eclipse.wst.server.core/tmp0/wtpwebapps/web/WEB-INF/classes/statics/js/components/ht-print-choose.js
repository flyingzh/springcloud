Vue.component('ht-print-choose', {
	data () {
		return {
			show: this.value,
			printInfo: [],
			subjectVisable: false,
			indeterminate: false,
			checkAll: true,
			checkAllGroup: [],
			selectCol: [],
			setPage: '0', 	// 1纵版 2横版 
		}
	},
	methods: {
		initDateAll () {
			var that = this;
			var _l = [], _s = [];
			that.printInfo.colNames.forEach(element => {
				_l.push(element.col); _s.push(element);

			});
			this.checkAll = true;
			this.checkAllGroup = _l;
			this.selectCol = _s;
		},
		closeModal () {
			this.checkAllGroup = [];
			this.selectCol = [];
			this.$emit('close', false)
			// this.show = false;
		},

		printSave () {
			var that = this;
			var _info = Object.assign({}, this.printInfo);
			_info.colNames = this.selectCol;
			_info.colMaxLenght = this.selectCol.length;
			_info.setPage = parseInt(this.setPage);
			htPrint(_info);
			setTimeout(function () {
				that.closeModal();
			}, 500);

		},
		handleCheckAll () {
			if (this.indeterminate) {
				this.checkAll = false;
			} else {
				this.checkAll = !this.checkAll;
			}
			this.indeterminate = false;

			if (this.checkAll) {

				var _l = [], _s = [];

				this.printInfo.colNames.forEach(element => {
					_l.push(element.col);
					_s.push(element)
				});
				this.checkAllGroup = _l;
				this.selectCol = _s;
			} else {
				this.checkAllGroup = [];
				this.selectCol = [];
			}
		},
		checkAllGroupChange (data) {
			console.log(data);
			var that = this;
			if (data.length === this.printInfo.colNames.length) {
				this.indeterminate = false;
				this.checkAll = true;
			} else if (data.length > 0) {
				this.indeterminate = true;
				this.checkAll = false;
			} else {
				this.indeterminate = false;
				this.checkAll = false;
			}

			var _l = [], _s = [];

			that.printInfo.colNames.forEach(element => {
				var _f = data.find(item => element.col === item);
				_f && (_l.push(_f), _s.push(element))

			});
			this.checkAllGroup = _l;
			this.selectCol = _s;

		},


	},
	watch: {
		value (val) {
			console.log(val);
			this.show = val;
			val && this.initDateAll()
		}
	},
	computed: {

	},
	filters: {


	},
	props: ['value', 'printInfo'],
	template: `
			<div>
					<Modal
							title='选择'
							v-model="show"
							width="700"
							@on-cancel='closeModal'
							:mask-closable="false">
							<div>
									<label style="color: #ed3f14;">请根据纸张大小选择打印字段列数</label>
									
									<Row class="mt5">
											<label class="w60">页面设置：</label>
											<RadioGroup v-model="setPage">
													<Radio label="0">默认</Radio>
													<Radio label="1">纵版</Radio>
													<Radio label="2">横版</Radio>
											</RadioGroup>
									</Row>
									<template>
										<div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;">
												<Checkbox
														:indeterminate="indeterminate"
														:value="checkAll"
														@click.prevent.native="handleCheckAll">全选</Checkbox>
										</div>
										<CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
												<Checkbox v-for="item in printInfo.colNames" :label="item.col" :key="item.col">{{item.name}}</Checkbox>
										</CheckboxGroup>
								</template>

							</div>
							<div slot="footer">
										<i-button type="primary" @click="printSave">确定</i-button>
								</div>
					</Modal>
			</div>
	`
})