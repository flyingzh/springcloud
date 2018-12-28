
Vue.component('ht-detailed-table', {
	props: ['detail_table'],
	data: function () {
		return {
			columns1: [
				{ type: 'selection', width: 60, align: 'center' },
				{ title: '单据类型', key: 'documentType', width: 100 },
				{ title: '单据编号', key: 'documentNumber', width: 100 },
				{ title: '客户', key: 'occurrenceObject', width: 100 },
				{ title: '日期', key: 'documentDate', width: 100,
					render: (h, params) => {
						return h('div',(new Date(params.row.documentDate)).format("yyyy-MM-dd"));
    				}
    			},
				{ title: '摘要', key: 'summary', width: 100 },
				{ title: '币别', key: 'coinStop', width: 100 },
				{ title: '汇率', key: 'surfaceExchangeRate', width: 100 ,
                    render: (h, params) => {
						return h('div',(accounting.formatMoney(params.row.surfaceExchangeRate, '', 2)));
					}
				},
				{ title: '单据金额', key: 'documentaryAmountFor', width: 150 ,
                    render: (h, params) => {
                    	return h('div',(accounting.formatMoney(params.row.documentaryAmountFor, '', 2)));
                	}
				},
				{ title: '单据金额（本位币）', key: 'documentaryAmount', width: 180 ,
                    render: (h, params) => {
                    	return h('div',(accounting.formatMoney(params.row.documentaryAmount, '', 2)));
                	}
				},
				{ title: '已核销金额', key: 'cancellationAmountFor', width: 180 ,
                    render: (h, params) => {
						return h('div',(accounting.formatMoney(params.row.cancellationAmountFor, '', 2)));
					}
				},
				{ title: '未核销金额', key: 'notCancellationAmountFor', width: 180 ,
                    render: (h, params) => {
						return h('div',(accounting.formatMoney(params.row.notCancellationAmountFor, '', 2)));
					}
				},
				{ title: '部门', key: 'department', width: 100 },
				{ title: '业务员', key: 'salesman', width: 100 }
			],
			dataList: [],
			checkList: [],

		}
	},
	created: function () {
	},
	methods: {
		query () {
			//console.log(this.detail_table,'===========');
		},
		rowDblclick (item) {
			var that = this;
			console.log(item,'==================');
			this.$emit('callback-info', [item]);
			this.$emit('close-modal', false);
			setTimeout(function () {
				that.checkList = [];
			}, 1000);
		},
		selectionChange (item) {
			console.log(item, '==================');
			this.checkList = item;
		},
		okCall () {
			var that = this;
			console.log(this.checkList, '======this.checkList===========');
			this.$emit('callback-info', this.checkList);
			this.$emit('close-modal', false);
			setTimeout(function () {
				that.checkList = [];
			}, 1000);
		},
		closeM () {
			this.checkList = [];
			this.$emit('close-modal', false);
		}
	},
	watch: {

	},
	mounted () {
		// this.myData = this.upload_config;
	},
	template: `<div>
									<div style="margin-top: -15px; background-color: #eee;">
										<!--<i-button type="text" @click="query">保存</i-button>-->
										<!--<i-button type="text" @click="">刷新</i-button>-->
										<!--<i-button type="text" @click="">引出列表</i-button>-->
										<!--<i-button type="text" @click="">引入</i-button>-->
										<!--<i-button type="text" @click="closeM">退出</i-button>-->
									</div>
									<div style="margin-top: 10px;">
										<i-table 
											width="760" 
											height="220" 
											size="small" 
											border 
											:columns="columns1" 
											:data="detail_table" 
											lay-size="sm" 
											highlight-row
											@on-row-dblclick="rowDblclick"
											@on-selection-change="selectionChange"
										>
										</i-table>
									</div>
									<div class="ht-commTxtRight">
                    <i-button @click="okCall" style="margin-top: 20px;">确定</i-button>
                    <i-button @click="closeM" style="margin-top: 20px;">取消</i-button>
                </div>
						</div>`
});
