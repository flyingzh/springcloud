Vue.component('ht-input-voucher', {
    data () {
        return {
            inputValue: '',
            valueId: '',
            show: false,
            newOptions: [],
            oldOptions: [],
            opts: [],
            optsVal: {},
            isOptValid: true
        }
    },
    methods: {
        operate_arr () {
            this.oldOptions = JSON.parse(this.options)
            this.oldOptions.forEach(row => {
                this.$set(row, 'active', false);
                if (!this.showValue) return;
                //row.label = row.value + ' ' + row.label
            })
            this.newOptions = [].concat(this.oldOptions);
            //console.log(this.newOptions);
        },
        focus () {
            let $htSearch = $('.ht-input-voucher .extra-opt');
            if ($htSearch.is(':visible')) {
                vm.$Message.error({
                    content: '亲，请处理完当前这一个先！',
                    duration: 3
                });
                return false;
            }

            // 科目下拉菜单只显示核算项目
            if (this.type == 'subject' && this.opts.length == 0) {
                this.show = false;
            } else {
                this.show = true;
            }

            // 鼠标聚焦到科目 input 时，引用当前行数据到父级 vm.row 中
            this.$emit('on-focus');
        },
        blur () {
            setTimeout(() => {
                if (!$.isEmptyObject(this.opts) && this.opts.length > 0) return;
                this.show = false;
            }, 150)
        },
        keyup () {
            var vm = this;
            if ($.trim(vm.value[vm.type]) == '') {
                vm.opts = [];
            }
        },
        input (event) {
            let value = event.target.value;
            // console.log(value, '===value');
            this.$emit('change', value);
            //this.newOptions = this.query(value,this.oldOptions)
        },
        query (str, container) {
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
                    if (typeof (obj[p]) == "function") {
                        obj[p]();
                    } else {
                        var curItem = "";
                        if (obj[p] != null) {
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
        add () {
            this.$emit("add");
        },
        // 选中下拉菜单
        select_li (item) {
            let vm = this;
            let type = vm.type;
            vm.newOptions.forEach(row => {
                row.active = false;
            })
            //item.active = true;

            vm.value[type + 'Value'] = item.value;
            vm.value[type + 'Label'] = item.label;

            // vm.value[type] = ((vm.showValue == true) ? item.value + ' ' : '') + item.label;
            if (vm.type == 'explains') {
                vm.value[type] = item.label;
            } else {
                vm.value[type] = item.value + item.label;
            }

            // 将行数据回写到父级
            //vm.$emit('change',vm.value);		

            if (vm.type == 'subject') {
                vm.value[type + 'Id'] = item.id;
                // 用科目 id 请求获取其它辅助选项
                // vm.opts = item.opts;
                let id = item.id;
                $.ajax({
                    type: 'post',
                    url: contextPath + '/voucherController/getListBySubjectId',
                    data: { id: id },
                    success: function (result) {
                        console.log(result)
                        vm.row.opts = {};
                        if (!$.isEmptyObject(result.data.opts)) {
                            vm.row.opts = (function () {
                                var obj = {};
                                $.each(result.data.opts, function (idx, ele) {
                                    obj[ele] = '';
                                });
                                return obj;
                            })();
                            vm.opts = result.data.opts;
                            vm.show = true;
                        }
												vm.row.hasQuantity = false;
                        if (!$.isEmptyObject(result.data.unitId)) {
                            vm.row.unitId = result.data.unitId;
                            vm.row.hasQuantity = true;
                        }
                        let currencyType = result.data.foreignCurrencyId || -2; // -2 无币别，-1 全币别，>0 某币别
                        let balanceDirection = result.data.balanceDirection; // 借贷方向 1-借 2-贷
                        var p = { 'foreignCurrencyId': currencyType, 'balanceDirection': balanceDirection }
                        console.log(p)
                        vm.$emit('currency', p);
                    }
                });
            }
        },
        selectOpt (optsVal, e) {
            let vm = this;
            var ret = true;
            $.each(vm.value.opts, function (key, val) {
                if ($.isEmptyObject(val)) {
                    ret = false;
                    e.stopImmediatePropagation();
                    vm.$Message.error({
                        content: '亲，请做出您正确的选择先！',
                        duration: 3
                    });
                    return false;
                }
            });

            if (ret == true) {
                var arrOpt = [];
                $.each(vm.value.opts, function (key, val) {
                    let pro = vm.subjectOpts[key].list[vm.value.opts[key]];
                    arrOpt.push(pro.code + ' ' + pro.name);
                    /*var optItem = vm.subjectOpts[key];
                    arrOpt.push(val + ' ' + optItem.list[val]);*/
                });

                // 更新选中的科目标题 + 辅助选项选定的值和标题
                vm.value.subject = vm.value.subjectValue + ' ' + vm.value.subjectLabel + '_' + arrOpt.join('_');

                // LRT: 按回车键时，等到光标跳转到下一个 input 后，再隐藏
                setTimeout(function () {
                    vm.show = false;
                }, 0);
            }
            return ret;
        },
        chk (val) {
            // var patrn =/^[1-9]\d*\.\d*|[1-9]\d*$/;
            var patrn = /^\d+(\.\d+)*$/;
            //var patrn = /^\d+(\.\d+)*\s[_\u4e00-\u9fa5]+$/;
            var result = true;
            if (!patrn.exec(val)) {
                result = false;
                return result;
            }
            var newV = val.replace(/\./g, '');
            newV = newV.replace(/ /g, '');
            console.log(newV)
            var regu = /^[1-9]\d*$/;
            if (!regu.exec(newV)) {
                result = false;
            }
            return result;
        },
        subjectInput (item, e) {
            var vm = this;
            var type = vm.type;
            var value = vm.value[type];
            var newOptions = vm.newOptions;


            // LRT: 回车自动输入摘要
            if (type == 'explains' && value != '') {
                var objVal = {};
                $.each(newOptions, function (idx, ele) {
                    var newVal = ele.label;
                    var index = newVal.indexOf(value);
                    if (index > -1) {
                        objVal[Number(index)] = newVal;
                    }
                });

                // 从开头最匹配的
                var key = Object.keys(objVal).map(function (item) {
                    return Number(item);
                }).sort(function (x, y) {
                    return x - y;
                }).shift();

                if (key in objVal) {
                    vm.value[type] = objVal[key];
                }
            }

            // var $target = $(e.target);
            if (this.isEnter && e.keyCode == 13 || e.keyCode == 108) {
                // console.log(item, '=========item========')
                // vm.$emit('subjectcodeenter', item);

                if (type == 'subject') vm.enterGetSubject(item, e);
            }
        },
        enterGetSubject (code, e) {
            console.log(code, '============code================');
            let that = this;
            let bool = that.chk(code);
            if (!code && !bool) {
                // LRT: 阻止按回车时向后跳
                e.stopImmediatePropagation();
                that.$Message.error("请输入正确的科目编码，科目编码只能为[0-9]和' . '组成");
                return;
            }
            let subjectEntity = {};
            for (let i = 0; i < that.subjects.length; i++) {
                if (that.subjects[i].value == code.match(/^\d+(\.\d+)*/g)[0]) {
                    subjectEntity = that.subjects[i];
                    break;
                }
            }
            /*$.each(that.subjects, function (key, val) {
                if (val.value == code) {
                    subjectEntity = val;
                }
            });*/
            if ($.isEmptyObject(subjectEntity)) {
                e.stopImmediatePropagation();
                that.$Message.error("科目不存在或查找科目编码为父级科目");
                return;
            }
            // var _url = contextPath + '/cashier/getSubjectInfoByCode';
            var _url = contextPath + '/voucherController/getListBySubjectId';
            $.ajax({
                type: 'POST',
                data: { 'id': subjectEntity.id },
                url: _url,
                success: function (result) {
                    if (result.code != '100100') {
                        that.$Modal.error({
                            title:'错误',
                            content:result==null||result.msg==null||result.msg==''?'操作失败':result.msg
                        })
                        // layer.alert(result.msg);
                        return;
                    }
                    console.log(result)
                    that.row.opts = {};
                    if (!$.isEmptyObject(result.data.opts)) {
                        that.row.opts = (function () {
                            var obj = {};
                            $.each(result.data.opts, function (idx, ele) {
                                obj[ele] = '';
                            });
                            return obj;
                        })();
                        that.opts = result.data.opts;
                        that.show = true;
                    }
                    that.row.hasQuantity = false;
                    if (!$.isEmptyObject(result.data.unitId)) {
                        that.row.unitId = result.data.unitId;
                        that.row.hasQuantity = true;
                    }
                    let currencyType = result.data.foreignCurrencyId || -2; // -2 无币别，-1 全币别，>0 某币别
                    let balanceDirection = result.data.balanceDirection; // 借贷方向 1-借 2-贷
                    var p = { 'foreignCurrencyId': currencyType, 'balanceDirection': balanceDirection }
                    console.log(p)
                    that.$emit('currency', p);
                    let type = that.type;
                    that.value[type + 'Value'] = subjectEntity.value;
                    that.value[type + 'Label'] = subjectEntity.fullName;
                    that.value[type] = subjectEntity.value + ' ' +subjectEntity.fullName;
                    that.value[type + 'Id'] = subjectEntity.id;

                    // LRT: 触发回车跳转 focus 到下一个元素
                    that.$nextTick(function () {
                        if (typeof enterToNext == 'function') {
                            enterToNext(e);
                        }
                    });

                    /*
                    let rowIdx = that.row.rowIdx;
                    let instInputVoucher = that.$refs['subject' + rowIdx][0];

                    // let currencyType = result.data.foreignCurrencyId || -2; // -2 无币别，-1 全币别，>0 某币别
                    // let balanceDirection = result.data.balanceDirection; // 借贷方向 1-借 2-贷

                    let p = { 'foreignCurrencyId': ret.foreignCurrencyId || -2, 'balanceDirection': ret.balanceDirection }

                    that.setForeignCurrencyShow(p);

                    that.row.subjectLabel = subjectEntity.label;
                    that.row.subjectValue = subjectEntity.value;
                    that.row.subject = vm.row.subjectValue + ' ' + vm.row.subjectLabel;
                    that.row.subjectId = subjectEntity.id;


                    if ($.isEmptyObject(ret.data.opts)) {
                        instInputVoucher.show = false; // 不显示下拉菜单
                    } else {
                        instInputVoucher.show = true; // 显示下拉菜单
                    }
                    instInputVoucher.opts = ret.data.opts; // 下拉菜单内的核算项目
                    that.row.opts = {};
                    if (ret.data.unitId != null && ret.data.unitId != '') {
                        that.row.unitId = ret.data.unitId; // 科目挂数量核算单位id
                        that.row.hasQuantity = true;
                    }*/
                },
                error: function (code) {
                    console.log(code);
                }
            });
        },
        hasVal (val) {
            var vm = this;
            var value = vm.value[vm.type];
            if (value == '') return true;
            return (val.value + val.label).indexOf(value) > -1;
        }
    },
    props: {
        isEnter: {
            default () {
                return true;
            }
        },
        options: {
            // type: Array,
            default () {
                return []
            }
        },
        oldValue: {},
        disabled: {
            default () {
                return false;
            }
        },
        // 列表中是否显示 为 value - label格式
        showValue: {
            default () {
                return false;
            }
        },
        title: {},
        // 返回值是否是value
        getValue: {
            default () {
                return true;
            }
        },
        value: {
            default () {
                return {};
            }
        },
        subjectOpts: {
            default () {
                return {};
            }
        },
        row: {
            default () {
                return {};
            }
        },
        type: {
            default () {
                return 'subject';
            }
        },
        subjects: [],
    },
    watch: {
        options () {
            this.operate_arr();
        }
    },
    created () {
        // 其它辅助选项选定的值			
    },
    mounted () {
        this.operate_arr();
        //this.opts = this.row.opts;			
    },
    template: `
    <div class="ht-input-voucher">
        <input v-model="value[type]"
            class="ht-voucher-input form-control tableDatasExplains"
            placeholder=""
            @input="input"
            @blur="blur"
            @focus="focus"
            @keyup="keyup"
            @keydown="subjectInput(value[type], $event)"
            ></input> 
		<div v-if="opts.length && show" class="ht-search extra-opt form-horizontal pd10 panel panel-default">
			<div v-for="(_opt, idx) in opts" class="form-group form-group-sm">

				<label class="col-sm-4 control-label text-left pl0">{{subjectOpts[_opt].label}}</label>
				<div class="col-sm-8 pr0">
				  <i-select filterable v-model="value.opts[_opt]" :transfer="true" :id="'iselect-' + _uid + '-' + idx">
					<i-option v-for="(text, val) in subjectOpts[_opt].list" :class="'ioption-' + _uid + '-' + idx" :value="val" :key="val+'_'+text">{{text.code + ' ' + text.name}}</i-option>
				  </i-select>
				</div>

			</div>
			<div class="text-center">
				<input type="button" @click="selectOpt(optsVal, $event)" class="btn btn-sm" value="确定" />
			</div>
		</div>
        <div class="ht-search panel panel-default" v-if="show && newOptions.length && opts.length == 0">
            <ul>
                <li v-for="item in newOptions" v-show="hasVal(item)" :key="item.value"
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