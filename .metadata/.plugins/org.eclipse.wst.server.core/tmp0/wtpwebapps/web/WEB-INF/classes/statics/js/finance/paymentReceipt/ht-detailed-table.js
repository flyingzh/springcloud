
Vue.component('ht-detailed-table', {
	props: ['detail_table', 'detail_table_columns'],
	data: function () {
		return {

			dataList: [],
			checkList: [],

		}
	},
	created: function () {
	},
	methods: {
		query () {
			console.log(this.detail_table, '===========');
		},
		rowDblclick (item) {
			var that = this;
			console.log(item, '==================');
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
											:columns="detail_table_columns" 
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
