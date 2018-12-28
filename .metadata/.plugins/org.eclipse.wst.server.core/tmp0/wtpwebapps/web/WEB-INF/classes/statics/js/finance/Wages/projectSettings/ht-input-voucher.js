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
            this.oldOptions = this.options;
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
            this.show = true;
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
            let vm = this;
            let value = event.target.value;
            // console.log(value, '===value');
            vm.value.val = value;
            vm.value.id = '';
            this.$emit('change', vm.value);


            if (value) {
                this.newOptions = this.query(value, this.oldOptions);
            } else {
                this.newOptions = this.oldOptions;
            }
            // console.log(this.newOptions, '===this.newOptions');
            if (this.newOptions.length) {
                this.show = true;
            }
        },
        query (str, container) {
            var newList = [];
            //新的列表
            var startChar = str.charAt(0);
            //开始字符
            var strLen = str.length;

            //查找符串的长度
            for (var i = 0; i < container.length; i++) {
                var _item = container[i];
                var obj = container[i].itemName;
                var isMatch = false;

                for (var j = 0; j < obj.length; j++) {
                    if (obj.charAt(j) == startChar)//如果匹配起始字符,开始查找
                    {
                        if (obj.substring(j).substring(0, strLen) == str)//如果从j开始的字符与str匹配，那ok
                        {
                            isMatch = true;
                            break;
                        }
                    }
                }
                if (isMatch) {
                    newList.push(_item);
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

            vm.value.val = item.itemName;
            vm.value.id = item.id;

            // 将行数据回写到父级
            vm.$emit('change', vm.value);

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
            // console.log(newV)
            var regu = /^[1-9]\d*$/;
            if (!regu.exec(newV)) {
                result = false;
            }
            return result;
        },
        subjectInput (item, e) {
            var vm = this;
            var type = vm.type;
            var value = vm.value.val;
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
                    vm.value = objVal[key];
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
            // console.log(code, '============code================');
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
                            title: '错误',
                            content: result == null || result.msg == null || result.msg == '' ? '操作失败' : result.msg
                        })
                        // layer.alert(result.msg);
                        return;
                    }
                    // console.log(result)
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
                    // console.log(p)
                    that.$emit('currency', p);
                    let type = that.type;
                    that.value[type + 'Value'] = subjectEntity.value;
                    that.value[type + 'Label'] = subjectEntity.fullName;
                    that.value = subjectEntity.value + ' ' + subjectEntity.fullName;
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
            var value = vm.value.val;
            if (value == '') return true;
            return (val.itemName + val.id).indexOf(value) > -1;
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
        <input v-model="value.val"
            class="ht-voucher-input form-control tableDatasExplains"
            placeholder=""
            @input="input"
            @blur="blur"
            @focus="focus"
            @keyup="keyup"
            @keydown="subjectInput(value, $event)"
            ></input> 
		
        <div class="ht-search panel panel-default ht-inputproject" v-if="show && newOptions.length">
            <ul>
                <li v-for="item in newOptions" v-show="hasVal(item)" :key="item.id"
                    @click="select_li(item)"
                    :class="[item.active ? 'active' : '']">
                    {{ item.itemName}}
                </li>
            </ul>
            <p @click="add" class="pl10 hide"><i class="glyphicon glyphicon-plus"></i> 新增{{title}}</p>
        </div>
    </div>
    `
})