// 后附数据格式
Vue.component('ht-tree', {
    props:{
        type:{
            type: Array,
            require: true,
			default(){
				return [
					'zichan', 
					'fuzhai', 
					'gongtong', 
					'quanyi',
					'chengben',
					'sunyi',
					'biaowai'
				];
			}
        },
        url:{
            type: String,
            require: true
        },
        setting:{
            require: false,
            type: Object
        },
        treeData:{
            require: false,
            type: Array,
			default(){ return []; }
        },
        tid:{
            require: false,
            type: String,
            default(){
                return 'ztree' + Math.random()*(Date.parse(new Date()));
            }
        }
    },
    data() {
        return {
            defaultSetting: {
                data: {
					key: {
						name: 'subjectName'
					},
                    simpleData: {
                        enable: true,
						pIdKey: 'parentId'
                    }
                },
				callback: {
					beforeClick(treeId, treeNode, clickFlag) {
						return !treeNode.isParent; //当是父节点，返回false，不让选取
					}
				}
            }            
        }
    },
    methods: {
        loadData() {
            let vm = this;
            //let config = $.extend(true, {},{callback: this.evalCallback}, this.defaultSetting, this.setting);
            let config = $.extend(true, {}, this.defaultSetting, this.setting);
			
			// 如果有定义请求的 URL
            if (!$.isEmptyObject(vm.url)) {
				$.ajax({
					type: "POST",
					url: vm.url,
					contentType: 'application/json',
					dataType: "json",
					success: function(result) {
						let arr = [];
						$.each(result.data || {}, function(key, val){
							if ($.inArray(key, vm.type) > -1 && !$.isEmptyObject(val)) {
								arr = [].concat(arr, val);
							}
						});
						let zTree = $.fn.zTree.init($("#" + vm.tid), config, arr);
						vm.$parent.$ztree = zTree;
					},
					error: function(err){
						console.log(err)
					}
				});
			
			// 如果有定义的树数据			
			} else if (!$.isEmptyObject(vm.treeData)) {
				let zTree = $.fn.zTree.init($("#" + vm.tid), config, vm.treeData);
				vm.$parent.$ztree = zTree;
			}
        },
        evalCallback() {
            let vm = this;
            let res = {};
            $.each(this.setting.callback, function (key, val) {
                //console.log(key, val)
                res[key] = vm.$parent[val];
            });
            return res;
        }
    },
    mounted() {
        this.loadData();
    },
    template: `  <div>           
       <ul :id="tid" class="ztree"></ul>
   </div>`
});

/*
{
    "code": "100100",
    "data": {
        "biaowai": [], // 表外
        "quanyi": [], // 权益
        "sunyi": [], // 损益
        "zichan": [ // 资产
            {
                "foreignCurrencyId": 2,
                "fullSubjectCode": "0.11.102.1002",
                "id": 7,
                "parentId": 4,
                "subjectCode": "1002",
                "subjectName": "短期借款",
                "tBaseSubjectBalanceEntity": {
                    "balanceDirection": 1,
                    "id": 1,
                    "subjectCategory": "流动资产"
                }
            }
        ],
        "gongtong": [], // 共同
        "fuzhai": [ // 负债
            {
                "foreignCurrencyId": 1,
                "fullSubjectCode": "0.12.101.1001",
                "id": 6,
                "parentId": 4,
                "subjectCode": "1001",
                "subjectName": "库存现金",
                "tBaseSubjectBalanceEntity": {
                    "balanceDirection": 1,
                    "id": 1,
                    "subjectCategory": "流动资产"
                }
            },
            {
                "foreignCurrencyId": 1,
                "fullSubjectCode": "0.12.101.1001.01",
                "id": 8,
                "parentId": 6,
                "subjectCode": "1001.01",
                "subjectName": "银行存款",
                "tBaseSubjectBalanceEntity": {
                    "balanceDirection": 1,
                    "id": 1,
                    "subjectCategory": "流动资产"
                }
            },
            {
                "foreignCurrencyId": 1,
                "fullSubjectCode": "0.12.101.1002.01",
                "id": 9,
                "parentId": 7,
                "subjectCode": "1001.02",
                "subjectName": "长期股权投资",
                "tBaseSubjectBalanceEntity": {
                    "balanceDirection": 1,
                    "id": 1,
                    "subjectCategory": "流动资产"
                }
            },
            {
                "fullSubjectCode": "0.12.101.1001.01.02",
                "id": 15,
                "parentId": 8,
                "subjectCode": "1001.01.02",
                "subjectName": "我是谁"
            },
            {
                "fullSubjectCode": "0.12.101.1002.02.03",
                "id": 16,
                "parentId": 9,
                "subjectCode": "1002.02.03",
                "subjectName": "我是"
            }
        ],
        "chengben": [] // 成本
    },
    "msg": "操作成功"
}
*/
