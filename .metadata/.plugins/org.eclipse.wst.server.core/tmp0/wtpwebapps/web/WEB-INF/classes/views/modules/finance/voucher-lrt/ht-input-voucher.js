Vue.component('ht-input-voucher',{
    data(){
        return{
			inputValue: '',
			valueId:'',
			show: false,
			newOptions: [],
			oldOptions: [],
			opts: [],
			optsVal: {},
			isOptValid: true
        }
    },
    methods:{
        operate_arr() {
            this.oldOptions = JSON.parse(this.options)
            this.oldOptions.forEach(row => {
                this.$set(row,'active',false);
                if(!this.showValue) return ;				
                //row.label = row.value + ' ' + row.label
            })
            this.newOptions = [].concat(this.oldOptions);
			//console.log(this.newOptions);
        },
        focus() {
			let $htSearch = $('.ht-input-voucher .extra-opt');
			if ($htSearch.is(':visible')) {
				vm.$Message.error({
					content:'亲，请处理完当前这一个先！',
					duration:3
				});
				return false;
			}
            this.show = true;
			
			// 鼠标聚焦到科目 input 时，引用当前行数据到父级 vm.row 中
			this.$emit('on-focus');
        },
        blur() {
            setTimeout(()=>{
				if (!$.isEmptyObject(this.opts)&&this.opts.length > 0) return;
                this.show = false;
            }, 150)
        },
        keyup(){
            var vm = this;
            if ($.trim(vm.value[vm.type]) == '') {
                vm.opts = [];
            }
        },
        input(event) {
            let value = event.target.value;
            //this.newOptions = this.query(value,this.oldOptions)
        },
        query(str, container){
            var newList = [];
            //新的列表
            var startChar = str.charAt(0);
            //开始字符
            var strLen = str.length;
            //查找符串的长度
            for (var i = 0; i < container.length; i++) {
                var obj = container[i];
                var isMatch = false;
                for (var p in obj) {
                    if ( typeof (obj[p]) == "function") {
                        obj[p]();
                    } else {
                        var curItem = "";
                        if(obj[p]!=null){
                            curItem = obj[p];
                        }
                        for (var j = 0; j < curItem.length; j++) {
                            if (curItem.charAt(j) == startChar)//如果匹配起始字符,开始查找
                            {
                                if (curItem.substring(j).substring(0, strLen) == str)//如果从j开始的字符与str匹配，那ok
                                {
                                    isMatch = true;
                                    break;
                                }
                            }
                        }
                    }
                }
                if (isMatch) {
                    newList.push(obj);
                }
            }
            return newList;
        },
        add() {
            this.$emit("add");
        },
		// 选中下拉菜单
        select_li(item) {
			let vm = this;
			let type = vm.type;
            vm.newOptions.forEach(row => {
                row.active = false;
            })
            //item.active = true;

			vm.value[type + 'Value'] = item.value;
			vm.value[type + 'Label'] = item.label;

			// vm.value[type] = ((vm.showValue == true) ? item.value + ' ' : '') + item.label;
            vm.value[type] =  item.value + item.label;
			// 将行数据回写到父级
			//vm.$emit('change',vm.value);		
			
			if (vm.type == 'subject') {
                vm.value[type+'Id']= item.id;
				// 用科目 id 请求获取其它辅助选项
				// vm.opts = item.opts;
                let id = item.id;
                $.ajax({
                    type: 'post',
                    url: '/finance/voucherController/getListBySubjectId',
                    data: {id: id},
                    success: function(result){
                        console.log(result)
                        if(!$.isEmptyObject(result.data.opts)){
                            vm.row.opts = (function(){
                                var obj = {};
                                $.each(result.data.opts, function(idx, ele){
                                    obj[ele] = '';
                                });
                                return obj;
                            })();
                            vm.opts = result.data.opts;
                            vm.show = true;
                        }
                        if(!$.isEmptyObject(result.data.unitId)){
                            vm.row.unitId = result.data.unitId;
                            vm.row.hasQuantity = true;
                        }
                        let currencyType = result.data.foreignCurrencyId || -2; // -2 无币别，-1 全币别，>0 某币别
                        let balanceDirection = result.data.balanceDirection; // 借贷方向 1-借 2-贷
                        var p = {'currencyType':currencyType,'balanceDirection':balanceDirection}
                        console.log(p)
                        vm.$emit('currency', p);
                    }
                });
			}
        },
		selectOpt(optsVal){
			let vm = this;
			var ret = true;			
			$.each(vm.value.opts, function(key, val){
				if ($.isEmptyObject(val)) {
					ret = false;
					vm.$Message.error({
						content:'亲，请做出您正确的选择先！',
						duration:3
					});
					return false;
				}
			});
			
			/* 行数据结构
				'abstract': '',
				abstractLabel: '',
				abstractValue: '',
				subject: '',
				subjectLabel: '',
				subjectValue: '',
				currency: 1,
				quantity: '',
				debitMomey: '',
				creditMoney: '',
				opts: {}
			*/
			
			/* 科目辅助选项数据结构
				subjectOpts: {
					item1: {
						label: '项目1',
						list: {
							111: '服装1',
							211: '配件1',
							311: '单费1'
						}
					}
				}
			*/
			
			if (ret == true) {
				var arrOpt = [];
				$.each(vm.value.opts, function(key, val){
					var optItem = vm.subjectOpts[key];
					arrOpt.push(val + ' ' + optItem.list[val]);
				});
				
				// 更新选中的科目标题 + 辅助选项选定的值和标题
				vm.value.subject = vm.value.subjectValue + ' ' + vm.value.subjectLabel + '_' + arrOpt.join('_');
				vm.show = false;
			}
			return ret;
		}
    },
    props:{
        options:{
            // type: Array,
            default(){
                return []
            }
        },
        oldValue:{},
        disabled:{
            default(){
                return false;
            }
        },
        // 列表中是否显示 为 value - label格式
        showValue:{
            default(){
                return false;
            }
        },
        title:{},
        // 返回值是否是value
        getValue:{
            default(){
                return true;
            } 
        },
        value: {
			default(){
                return {};
            }
		},
		subjectOpts: {
			default(){
                return {};
            }
		},
		row: {
			default(){
                return {};
            }
		},
		type: {
			default(){
                return 'subject';
            }
		}
    },
	watch:{
		options(){
			this.operate_arr();
		}		
	},
	created(){
		// 其它辅助选项选定的值			
	},
    mounted(){
        this.operate_arr();
		//this.opts = this.row.opts;			
    },
    template:  `
    <div class="ht-input-voucher">
        <input v-model="value[type]"
            class="ht-voucher-input form-control"
            placeholder=""
            @input="input"
            @blur="blur"
            @focus="focus"
            @keyup="keyup"></input> 
		<div v-if="opts.length && show" class="ht-search extra-opt form-horizontal pd10 panel panel-default">
			<div v-for="_opt in opts" class="form-group form-group-sm">

				<label class="col-sm-4 control-label text-left pl0">{{subjectOpts[_opt].label}}</label>
				<div class="col-sm-8 pr0">
				  <select v-model="value.opts[_opt]" class="form-control input-sm width-full">
					<option v-for="(text, val) in subjectOpts[_opt].list" :value="val">{{val + ' ' + text}}</option>
				  </select>
				</div>

			</div>
			<div class="text-center">
				<button type="button" @click="selectOpt(optsVal)" class="btn btn-sm">确定</button>
			</div>
		</div>
        <div class="ht-search panel panel-default" v-if="show && newOptions.length && opts.length == 0">
            <ul>
                <li v-for="item in newOptions" :key="item.value"
                    @click="select_li(item)"
                    :class="[item.active ? 'active' : '']">
                    {{((type == 'subject')? item.value + ' ' : '') + item.label}}
                </li>
            </ul>
            <p @click="add" class="pl10 hide"><i class="glyphicon glyphicon-plus"></i> 新增{{title}}</p>
        </div>
    </div>
    `
})