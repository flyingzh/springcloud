var vm = new Vue({
    el: '#ht-voucher',
    data: {
        updateType:false,
        openTime: '',
        year_period: '',
        sobId: '',
        oldVoucherDate: '',
        voucherId: '',
        standardCurrencyId: '',
        status: '', // 是否已审核等状态。已审核：audited
        addV: '',// 是否显示新增按钮。显示：add
        saveV: '',// 是否显示保存按钮。显示：save
        printV: '',// 是否显示打印按钮。显示：print
        approvalV: '',// 是否显示审核按钮。显示：approval
        approvalVR: '',// 是否显示反审核按钮。显示：approval
        copyV: '',// 是否显示复制按钮。显示：copy
        deleteV: '',// 是否显示删除按钮。显示：delete
        //机制凭证单据id列表
        receiptId: [],
        sys: '',
        monetaryUnit: [
            "亿", "千", "百", "十", "万", "千", "百", "十", "元", "角", "分"
        ],
        tableDatas: [
            {
                id: '',
                voucherId: '',
                //币别ID
                currencyId: '',
                //币别名称
                currencyName: '',
                // 摘要
                // abstract: '',
                //摘要内容
                explains: '',
                //本方科目ID
                accountId: '',
                //对方科目ID
                relativeAccountId: '',
                //金额方向_1 借方,2贷方
                direction: '',
                //序号_凭证中排序位置
                sequence: 1,
                //单价
                unitPrice: '',
                //数量
                quantity: '',
                //汇率
                exchangeRate: '',
                //原币金额
                ammountFor: '',
                //本位币金额
                ammount: '',
                //账套id
                sobId: '',
                subjectId: '',
                accountCode: '',
                // 科目内容
                subject: '',
                // 借方金额
                debitMoney: '',
                // 贷方金额
                creditMoney: '',
                subjectLabel: '',
                subjectValue: '',
                explainsValue: '',
                subjectDetail: {},
                currencyList: {},
                // 其它选项
                opts: {},
                unitId: '',
                hasQuantity: false,
                hasCurrency: false
            },
            {
                id: '',
                voucherId: '',
                //币别ID
                currencyId: '',
                //币别名称
                currencyName: '',
                //汇率
                exchangeRate: '',
                // 摘要
                // abstract: '',
                //摘要内容
                explains: '',
                //本方科目ID
                accountId: '',
                accountCode: '',
                //对方科目ID
                relativeAccountId: '',
                //金额方向_1 借方,2贷方
                direction: '',
                //序号_凭证中排序位置
                sequence: 2,
                //单价
                unitPrice: '',
                //数量
                quantity: '',
                //原币金额
                ammountFor: '',
                //本位币金额
                ammount: '',
                //账套id
                sobId: '',
                subjectId: '',
                //TODO:
                // 科目内容
                subject: '',
                // 借方金额
                debitMoney: '',
                // 贷方金额
                creditMoney: '',
                subjectLabel: '',
                subjectValue: '',
                explainsValue: '',
                subjectDetail: {},
                currencyList: {},
                // 其它选项
                opts: {},
                unitId: '',
                hasQuantity: false,
                hasCurrency: false
            }
        ],

        // 科目下拉菜单数据
        subjects: [],
        // 科目复数核算项目
        subjectOpts: {},
        // 货币列表
        currencyList: {},
        //单位列表
        unitList: {},
        currencyShow: true,
        quantityShow: false,
        value1: '',
        selectTitle: '科目',
        selectdMore: [],
        formData: {
            id: '',
            voucherGroupId: '',
            voucherGroupName: '',
            voucherNumber: '',
            accountingYear: '',
            accountingPeriod: '',
            voucherDate: '', // 左上日期控件
            attachmentsCount: 0,
            preparerName: '',
            preparerId: '',
            sobId: '',
            belongSystem: '1',
            createTime: '',
            jump: {
                year: 2018,
                period: 1,
                voucherGroupId: '',
                num: 1
            }
        },
        // 凭证字
        typeList: [],
        remarkVisable: false,

        // 摘要列表
        remarklist: [],
        subjectVisable: false,
        row: {},
        rowIdx: 0,
        printOrgName: '',
    },
    filters: {
        redDigits (val) {
            var ret = Number((val < 0) ? val / -1 : val).toFixed(2).toString().replace('.', '');

            if (/^0$/g.test(Number(ret))) {
                ret = '';
            }
            return ret;
        },
        redDigits2 (val) {
            var ret = Number((val < 0) ? val / -1 : val).toFixed(2).toString();

            if (/^0$/g.test(Number(ret))) {
                ret = '';
            }
            return ret;
        },

    },
    methods: {
        getCurrencyLable (_id, _list) {

            if (_id && _list) {
                var _f = _list[_id];
                return _f.label;
            } else {
                return '';
            }

        },
        inputVouvherFocus (item, idx) {
            var that = this;
            that.row = item;
            if (idx === 0) return;
            var _f = {}, _i = 0, _isOK = false;
            that.tableDatas.forEach((_it, _idx) => {
                if (_isOK) return;
                if (_it.subject) {
                    if (!_it.debitMoney && !_it.creditMoney) {
                        _isOK = true, _f = _it, _i = _idx;
                    }
                } else {
                    _isOK = true, _f = _it, _i = _idx;
                }
            })
            if (idx === _i) return;
            var $inputList = $('.ht-voucher-table tbody').find('tr');
            if (_isOK) {
                vm.$Message.error({
                    content: '亲，请处理完上一条先！',
                    duration: 3
                });
                var _$tr = $($inputList[_i]);
                if (_f.subject) {
                    $(_$tr).find('td input.debit').focus();
                } else {
                    $(_$tr).find('td.itemSubjects input.ht-voucher-input').focus();
                }
            }
        },
        moneyFocus (e, item) {

            if (item.subject) {
                $(e.target).closest('td').addClass('focus');
            } else {
                setTimeout(function () {
                    var $input = $(e.target);
                    var $inputList = $('.ht-voucher-table tbody').find('input:visible, select:visible, button:visible');
                    var currIdx = $inputList.index($input);
                    var $nextInput = $inputList.get(currIdx - 1);
                    if (typeof target != 'undefined') {
                        target.focus();
                        return false;
                    }
                    if ($nextInput) {
                        $nextInput.focus();
                    }
                });
            }
        },
        moneyBlur (item, e, type) {
            var vm = this;
            var $target = $(e.target);
            $target.closest('td').removeClass('focus');

            // 如果失去焦点时为空值，不计算
            if ($.trim($target.val()) == '') return false;

            var money = item[(item.direction == 1) ? 'debitMoney' : 'creditMoney'];
            var exchangeRate = function () {
                if (isNaN(item.exchangeRate) || item.exchangeRate == '') {
                    item.exchangeRate = 1;
                }
                return item.exchangeRate;
            };
            var quantity = function () {
                if (isNaN(item.quantity) || item.quantity == '') {
                    // 如果无关联“数量”，数量设为 0
                    item.quantity = (item.hasQuantity) ? 1 : 0;
                }
                return item.quantity;
            };

            vm.moneyProcess(item, e, type);

            var newAmountFor = money / exchangeRate();
            item.ammountFor = newAmountFor.toFixed(2);
            // 如果无关联“数量”，单价设为 0
            item.unitPrice = (item.hasQuantity) ? (newAmountFor / quantity()).toFixed(4) : 0;
            item.unitPrice = Math.abs(item.unitPrice);
            item.quantity = Math.abs(item.quantity);

            // 如果原币总额为负数，数量为负，单价为正
            if (money < 0) {
                item.quantity = Math.abs(item.quantity) / -1;
            }
        },

        // Ctrl+s 保存
        keyboardSave (item, e, type) {
            e.preventDefault()
            var that = this;
            console.log('save');
            this.saveOrUpdateVoucher(type);
        },

        //enter
        testenter (item, e, type) {
            e.preventDefault()
            var that = this;
            console.log('testenter');

        },
        // 点击空格键，互换借贷金额
        swopDebitCredit (item, e, type) {
            var vm = this;
            var $target = $(e.target);
            var newDirection = (type == 'debit') ? 2 : 1;
            var newType = (newDirection == 2) ? 'credit' : 'debit';
            var $newTarget = $target.closest('tr').find('.' + newType);
            vm.moneyProcess(item, e, type);
            if (e.keyCode == 32) {
                // 键盘空格
                //item.direction = newDirection;
                console.log('32');
                item[newType + 'Money'] = item[type + 'Money'];
                item[type + 'Money'] = 0;
                setTimeout(function () {
                    $target.val('');
                    $newTarget.focus();
                }, 0);
                setTimeout(function () { $newTarget.blur(); }, 0);
                setTimeout(function () { $newTarget.focus(); }, 0);
                //setTimeout(function(){ vm.moneyProcess(item, $newTarget, newType);}, 50);
            } else if (e.keyCode == 13 || e.keyCode == 108) {    // 键盘 enter  确认按钮
                //item.direction = newDirection;
                if (type === 'debit') {
                    if (item.debitMoney) {
                        // 换行，如果最后一行则添加一行数据

                        var $_t = $target.closest('tr').next().find('.tableDatasExplains');
                        // $_t = $($_t[0]);
                        // setTimeout(function () { $_t.blur(); }, 0);
                        // setTimeout(function () { $_t.focus(); }, 0);
                        if ($_t.length === 0) {
                            var $add = $target.closest('tr').find('.ht-operate-wrap .add-btn');
                            $add.click();
                        } else {
                            $_t = $($_t[0]);

                            setTimeout(function () { $_t.blur(); }, 0);
                            setTimeout(function () { $_t.focus(); }, 0);
                        }
                    } else {
                        setTimeout(function () {
                            $target.val('');
                            $newTarget.focus();
                        }, 0);
                        setTimeout(function () { $newTarget.blur(); }, 0);
                        setTimeout(function () { $newTarget.focus(); }, 0);
                    }
                } else if (type === 'credit') {
                    if (item.creditMoney) {
                        // 换行，如果最后一行则添加一行数据
                        var $_t = $target.closest('tr').next().find('.tableDatasExplains');
                        if ($_t.length === 0) {
                            var $add = $target.closest('tr').find('.ht-operate-wrap .add-btn');
                            $add.click();
                        } else {
                            $_t = $($_t[0]);
                            setTimeout(function () { $_t.blur(); }, 0);
                            setTimeout(function () { $_t.focus(); }, 0);
                        }
                    }
                }
            } else if (e.keyCode == 187 || e.keyCode == 229) {      // 键盘 =
                console.log('187,键盘 =');
                let totaldebitMoney = 0;
                let totalcreditMoney = 0;
                vm.tableDatas.forEach(row => {
                    totaldebitMoney = Number(Number(totaldebitMoney).add(row.debitMoney));
                    totalcreditMoney = Number(Number(totalcreditMoney).add(row.creditMoney))
                })

                if (type === 'debit') {
                    totaldebitMoney = totaldebitMoney - Number(item[type + 'Money']);
                    var _v = 0;
                    if (totaldebitMoney !== totalcreditMoney) {
                        _v = totalcreditMoney - totaldebitMoney;
                    }
                    setTimeout(function () {
                        item[type + 'Money'] = _v;
                        $target.val(_v);
                        $newTarget.focus();
                    }, 0);
                    setTimeout(function () { $newTarget.blur(); }, 0);
                    setTimeout(function () { $newTarget.focus(); }, 0);
                } else if (type === 'credit') {
                    totalcreditMoney = totalcreditMoney - Number(item[type + 'Money']);
                    var _v = 0;
                    if (totaldebitMoney !== totalcreditMoney) {
                        _v = totaldebitMoney - totalcreditMoney;
                    }
                    setTimeout(function () {
                        item[type + 'Money'] = _v;
                        $target.val(_v);
                        $newTarget.focus();
                    }, 0);
                    setTimeout(function () { $newTarget.blur(); }, 0);
                    setTimeout(function () { $newTarget.focus(); }, 0);
                }



            }
        },
        fixFloat (num, len) {
            var len = len || 3;
            if (num.toString().indexOf('.') > -1) {
                num = parseFloat(accounting.toFixed(num, len));
            }
            return num;
        },
        calTotal (item, type) {
            var vm = this;
            var isQuantity = type == 'quantity';
            var isUnitPrice = type == 'unitPrice';
            var isAmmountFor = type == 'ammountFor';
            var isExchangeRate = type == 'exchangeRate';
            var isCurrencySelect = type == 'currencySelect';

            var quantity = function () { return (isNaN(item.quantity) || item.quantity == '') ? 0 : item.quantity };
            var unitPrice = function () { return (isNaN(item.unitPrice) || item.unitPrice == '') ? 0 : item.unitPrice };
            var ammountFor = function () { return (isNaN(item.ammountFor) || item.ammountFor == '') ? 0 : item.ammountFor };
            var exchangeRate = function () { return (isNaN(item.exchangeRate) || item.exchangeRate == '') ? 1 : item.exchangeRate };
            var debitMoney = function () { return (isNaN(item.debitMoney) || item.debitMoney == '') ? 0 : item.debitMoney };
            var creditMoney = function () { return (isNaN(item.creditMoney) || item.creditMoney) ? 0 : item.creditMoney };

            var calMoney = function () {
                // 计算当前行借方或贷方总额
                item[(item.direction == 1) ? 'debitMoney' : 'creditMoney'] = vm.fixFloat(exchangeRate() * ammountFor());
                // 清空另一方
                item[(item.direction == 1) ? 'creditMoney' : 'debitMoney'] = '';
            };

            // 切换币别 & 更新汇率时
            if (isCurrencySelect || isExchangeRate) {
                if (isCurrencySelect) {
                    item.exchangeRate = this.currencyList[item.currencyId].rate;
                    item.currencyName = this.currencyList[item.currencyId].label;
                }
                calMoney();
            }

            // 更改数量和单价时
            if (isQuantity || isUnitPrice) {
                item.ammountFor = vm.fixFloat(quantity() * unitPrice());
                calMoney();
            }

            // 更改原币总额时
            if (isAmmountFor) {
                item.unitPrice = vm.fixFloat(ammountFor() / quantity());
                item.unitPrice = Math.abs(item.unitPrice);
                item.quantity = Math.abs(item.quantity);

                // 如果原币总额为负数，数量为负，单价为正
                if (ammountFor() < 0) {
                    item.quantity = Math.abs(item.quantity) / -1;
                }
                calMoney();
            }
        },

        voucherDateSelect (val) {
            let currentDate = (new Date(val)).format("yyyy-MM-dd")
            let pDate = { 'currentDate': currentDate, 'sobId': this.formData.sobId };
            $.ajax({
                type: 'post',
                url: contextPath + '/voucherController/judgmentPeriod',
                data: pDate,
                success: function (result) {
                    console.log(result)
                    if (result.code == '100100' && result.data != null && result.data.allowable != null && result.data.allowable == 1) {
                        vm.year_period = result.data.accountYear + '年第' + result.data.accountPeriod + '期';
                        vm.formData.accountingYear = result.data.accountYear;
                        vm.formData.accountingPeriod = result.data.accountPeriod;
                        vm.oldVoucherDate = vm.formData.voucherDate;
                    } else {
                        vm.$Modal.warning({
                            title:'警告',
                            content:'当前时间不允许录入凭证'
                        })
                        // vm.$Message.error("当前时间不允许录入凭证")
                        vm.formData.voucherDate = vm.oldVoucherDate;
                    }
                }
            });
        },
        voucherWordOpt (item) {
            this.updateType = false;
            //                if($.isEmptyObject(this.voucherId)){
            //                if(!$.isEmptyObject(this.formData.voucherGroupId)){
            /*let pNum = {'voucherGroupId':this.formData.voucherGroupId,'sobId':this.formData.sobId};
            $.ajax({
                type: 'post',
                url: contextPath+'/voucherController/getSerialNum',
                data: pNum,
                success: function(result){
                    console.log(result)
                    if(!$.isEmptyObject(result.data)){
                        vm.formData.voucherNumber = result.data;
                        vm.formData.voucherGroupName = item.label;
                    }
                }
            });*/
            //                }
        },

        onDblclickRemarkRow (remark) {
            let vm = this;
            //				vm.row.abstract = remark.content;
            vm.row.explains = remark.content;
            vm.row.explainsLabel = remark.content;
            vm.row.explainsValue = remark.id || '';
            vm.remarkVisable = false;
        },
        onRemarkModalChange (val) {
            this.remarkVisable = val;
        },
        onRemarkListChange (val) {
            this.remarklist = val;
        },
        jumpOk () {
            let _vm = this;
            let _jump = _vm.formData.jump;
            let param = { 'accountingYear': _jump.year, 'accountingPeriod': _jump.period, 'voucherGroupId': _jump.voucherGroupId, 'voucherNumber': _jump.num };
            $.ajax({
                type: 'POST',
                url: contextPath + '/voucherController/jumpVoucher', // 跳转 URL
                data: JSON.stringify(param),
                contentType: 'application/json;charset=utf-8',
                dataType: 'json',
                success: function (ret) {
                    if (ret.code == '100100' && ret.data) {
                        _vm.loadInfoData(ret)
                    } else {
                        _vm.$Modal.error({
                            title:'错误',
                            content:ret==null||ret.msg==null||ret.msg==''?'数据异常':ret.msg
                        })
                        // _vm.$Message.error(ret.msg);
                        // alert(ret.msg)
                    }
                }
            });
        },
        more (value) {
            console.log(value)
        },
        // value 为双向绑定的当前行的数据
        change_option (value, item, key, indx) {
            var that = this;
            console.log(value, item, key, indx, '===========value, item, key, indx==============');
            console.log(that.tableDatas, '===========tableDatas==============');

            if (key === 'explains') {
                if (indx === 0) return;
                if (value === '//') {
                    item[key] = that.tableDatas[0][key];
                } else if (value === '..') {
                    item[key] = that.tableDatas[indx - 1][key];
                }
            }
            /*
            var arr = value.split(delimiter);
            var _value = arr[0];
            var _label = arr[1];
            item[key] = value.replace(delimiter, ' ');
            item[key+'Label'] = _label;
            item[key+'Value'] = _value;
            */
        },
        // 新增科目/摘要弹框
        add_option () {
            console.log("新增科目/摘要弹框")
        },
        change_select (value) {
            this.value1 = value;
        },
        init () {

        },
        // 在当前行上方，添加空行
        add (index) {
            let data = {
                'id': '',
                'voucherId': '',
                //币别ID
                'currencyId': '',
                //币别名称
                'currencyName': '',
                //汇率
                'exchangeRate': '',
                //摘要内容
                'explains': '',
                //本方科目ID
                'accountId': '',
                //对方科目ID
                'relativeAccountId': '',
                //金额方向_1 借方,2贷方
                'direction': '',
                //序号_凭证中排序位置
                'sequence': 1,
                //单价
                'unitPrice': '',
                //数量
                'quantity': '',
                //原币金额
                'ammountFor': '',
                //本位币金额
                'ammount': '',
                //账套id
                'sobId': '',
                'subjectId': '',
                //TODO:
                // 科目内容
                'subject': '',
                // 借方金额
                'debitMoney': '',
                // 贷方金额
                'creditMoney': '',
                'subjectLabel': '',
                'subjectValue': '',
                'explainsValue': '',
                'subjectDetail': {},
                'currencyList': {},
                // 其它选项
                'opts': {},
                'unitId': '',
                'hasQuantity': false,
                'hasCurrency': false
            };
            let len = this.tableDatas.length;
            if (index == len - 1) {
                this.tableDatas.push(data);
            } else {
                this.tableDatas.splice(index + 1, 0, data);
            }
            console.log(index)

        },
        del (index) {
            this.tableDatas.splice(index, 1);
        },
        // 文摘弹窗
        clickDigest (row) {
            //console.log("点击了文摘")
            //this.currencyShow = !this.currencyShow;
            this.row = row;
            this.remarkVisable = true;
        },
        // 科目弹窗
        clickSubject (row, i) {
            row['rowIdx'] = i;
            this.row = row;
            this.subjectVisable = true;
        },
        // 科目下拉框
        subjectClose () {
            this.subjectVisable = false;
        },
        setForeignCurrencyShow (p) {
            let currencyType = p.foreignCurrencyId;
            let vm = this;
            let currencyStd = vm.currencyList[vm.standardCurrencyId]; // 本位币
            if (currencyType < 0) { // 无币别（隐藏下拉菜单，默认使用本位币）
                if (currencyType == -2) {
                    vm.row.hasCurrency = false;
                }
                if (currencyType == -1) {
                    vm.row.hasCurrency = true;
                }
                vm.row.currencyList = $.extend(true, {}, vm.currencyList);
                vm.$nextTick(function () {
                    vm.row.currencyId = 1;
                });
                vm.row.currencyName = currencyStd.label;
                vm.row.exchangeRate = currencyStd.rate;

            } else if (currencyType > 0) {
                let curr = vm.currencyList[currencyType + ""];
                if (curr == null || curr == 'undefined') {
                    vm.$Modal.warning({
                        title:'警告',
                        content:"币别数据异常，数据录入可能不正常"
                    })
                    return;
                }
                vm.row.hasCurrency = true;
                vm.row.currencyList[currencyType + ""] = curr;
                vm.row.currencyId = currencyType;
                vm.row.currencyName = curr.label;
                vm.row.exchangeRate = curr.rate;
            }
            // 借贷方向
            vm.row.direction = p.balanceDirection;
        },
        subjectData (treeNode) {
            console.log(treeNode)
            let vm = this;
            let rowIdx = vm.row.rowIdx;
            let instInputVoucher = vm.$refs['subject' + rowIdx][0];
            console.log(instInputVoucher)
            let p = { 'foreignCurrencyId': treeNode.foreignCurrencyId || -2, 'balanceDirection': treeNode.balanceDirection }
            console.log(p)
            vm.setForeignCurrencyShow(p);

            /*let currencyType = treeNode.foreignCurrencyId || -2; // -2 无币别，-1 全币别，>0 某币别
            let currencyStd = vm.currencyList[1]; // 本位币

            if (currencyType < 0) { // 无币别（隐藏下拉菜单，默认使用本位币）
                if (currencyType == -2) {
                    vm.row.hasCurrency = false;
                }
                if (currencyType == -1) {
                    vm.row.hasCurrency = true;
                }
                vm.row.currencyList = $.extend(true, {}, vm.currencyList);
                vm.$nextTick(function(){
                    vm.row.currencyId = 1;
                });
                vm.row.currencyName = currencyStd.label;
                vm.row.exchangeRate = currencyStd.rate;

            } else if (currencyType > 0) {
                let curr = vm.currencyList[currencyType+""];
                vm.row.hasCurrency = true;
                vm.row.currencyList[currencyType+""] = curr;
                vm.row.currencyId = currencyType;
                vm.row.currencyName = curr.label;
                vm.row.exchangeRate = curr.rate;
            }
*/


            vm.row.subjectDetail = treeNode;
            vm.row.subjectLabel = treeNode.fullName;
            vm.row.subjectValue = treeNode.subjectCode;
            // vm.row.subjectValue = treeNode.subjectCode.replace(/\./g, '');
            vm.row.subject = vm.row.subjectValue + ' ' + vm.row.subjectLabel;
            vm.row.subjectId = treeNode.id;

            var _this = this;
            let _id = treeNode.id;
            var _url = contextPath + '/voucherController/getListBySubjectId';
            $.ajax({
                type: 'POST',
                data: { id: _id },
                url: _url,
                success: function (result) {
                    console.log(result)
                    if ($.isEmptyObject(result.data.opts)) {
                        instInputVoucher.show = false; // 不显示下拉菜单
                    } else {
                        instInputVoucher.show = true; // 显示下拉菜单
                    }
                    instInputVoucher.opts = result.data.opts; // 下拉菜单内的核算项目
                    vm.row.opts = {};
                    vm.row.hasQuantity = false;
                    if (result.data.unitId != null && result.data.unitId != '') {
                        vm.row.unitId = result.data.unitId; // 科目挂数量核算单位id
                        vm.row.hasQuantity = true;
                    }
                },
                error: function (code) {
                    console.log(code);
                }
            });
        },
        // 处理可以金额的单元格
        filterMoney (key) {
            switch (key) {
                case 'debitMoney':
                    return true;
                case 'creditMoney':
                    return true;
                default:
                    return false;
            }
        },
        // 格式化数字
        formatNum (f, digit) {
            var m = Math.pow(1000, digit);
            return parseInt(f * m, 10) / m;
        },
        // 保留2位小数，清空邻居，key: 'debit' or 'credit'
        moneyProcess (item, e, _key) {
            var key = _key + 'Money';
            let other = ""
            switch (key) {
                case 'debitMoney':
                    other = 'creditMoney';
                    break;
                case 'creditMoney':
                    other = 'debitMoney';
                    break;
                default:
                    break;

            }
            let _v = Number(e.target.value);
            let newValue = _v ? parseFloat(_v.toFixed(2)) : '';

            if (newValue >= 1000000000000) {
                item[key] = 999999999999.99;
                return;
            }
            item[key] = newValue;
            newValue && (item[other] = '');

            // 切换借贷方向
            var direction = (_key == 'debit') ? 1 : 2;
            var val = $.trim($(e.target).val()).replace('/ /g', '');
            console.log(val);
            if (val != '' && isNaN(val) == false) {
                item.direction = direction;
            }
        },

        // 处理是否显示红色
        numberStyle (value) {
            if (Number(value) < 0) {
                return true;
            }
            return false;
        },
        // 转大写数字
        digitUppercase (n) {
            var fraction = ['角', '分'];
            var digit = [
                '零', '壹', '贰', '叁', '肆',
                '伍', '陆', '柒', '捌', '玖'
            ];
            var unit = [
                ['元', '万', '亿'],
                ['', '拾', '佰', '仟']
            ];
            var head = n < 0 ? '负' : '';
            n = Math.abs(n);
            var s = '';
            for (var i = 0; i < fraction.length; i++) {
                s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
            }
            s = s || '整';
            n = Math.floor(n);
            for (var i = 0; i < unit[0].length && n > 0; i++) {
                var p = '';
                for (var j = 0; j < unit[1].length && n > 0; j++) {
                    p = digit[n % 10] + unit[1][j] + p;
                    n = Math.floor(n / 10);
                }
                s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
            }
            return head + s.replace(/(零.)*零元/, '元')
                .replace(/(零.)+/g, '零')
                .replace(/^整$/, '零元整');
        },
        watchTblData () {
            let vm = this;
            let tblData = vm.tableDatas;
            let arr = [];
            let showColQuantity = false;
            let showColCurrency = false;

            if (!$.isEmptyObject(tblData)) {
                $.each(tblData, function (idx, ele) {
                    // 重排序号
                    ele.sequence = idx + 1;
                    if (ele.hasQuantity == true) {
                        showColQuantity = true;
                    }
                    if (ele.hasCurrency == true) {
                        showColCurrency = true;
                    }

                    // 如果科目清空，隐藏数量和币别选项
                    if (ele.subject == '') {
                        ele.hasCurrency = false;
                        ele.hasQuantity = false;
                    }
                });
                vm.quantityShow = showColQuantity;
                vm.currencyShow = showColCurrency;
            }
        },
        saveOrUpdateVoucher12 () {
            console.log('in');
        },
        saveOrUpdateVoucher (saveType) {
            let tableInfo = vm.tableDatas;
						for(var i = 0;i<tableInfo.length;i++){
							if ((tableInfo[i].subject==null||tableInfo[i].subject=='')&&(!$.isEmptyObject(tableInfo[i].ammount)||!$.isEmptyObject(tableInfo[i].ammountFor))) {
									vm.$Message.error('凭证分录不完整');
									return;
							}
						}
            var _info = tableInfo.filter(function (item, idx) {
                if (!$.isEmptyObject(tableInfo[idx].subject)) {
                    return item;
                }
            });
            //_info为空提交
            if ($.isEmptyObject(_info)) {
                vm.$Message.error('请输入凭证明细');
                // alert("请输入凭证明细")
                return;
            }
            var _j = [];
            $.each(_info, function (index, sub) {
                //校验科目不为空的情况下，其它参数是否填写完整
                //TODO:
                //校验摘要
                sub.accountId = sub.subjectId;
                sub.accountCode = sub.subjectValue;
                //金额方向_1 借方,2贷方
                if (!$.isEmptyObject(sub.debitMoney)) {
                    sub.direction = 1;
                    sub.ammount = sub.debitMoney;
                } else if (!$.isEmptyObject(sub.creditMoney)) {
                    sub.direction = 2;
                    sub.ammount = sub.creditMoney;
                }
                _j.push({ 'voucher': sub, 'opts': sub.opts });
            });

            let json1 = JSON.stringify({ 'entity': vm.formData, 'entryVoList': _j, 'receiptId': vm.receiptId });
            console.log(json1)
            var _url = contextPath + '/voucherController/saveVoucher';
            $.ajax({
                type: 'POST',
                url: _url,
                contentType: 'application/json;charset=utf-8',
                data: json1,
                dataType: 'json',
                success: function (ret) {
                    console.log(ret);
                    if (ret == null || ret.code != '100100') {
                        vm.$Modal.confirm({
                            title: '提示',
                            content: ret.msg
                        });
                        return;
                    }
                    if (ret.data != null && vm.receiptId != null && vm.receiptId.length != 0) {
                        //机制凭证需要返回单据id
                        vm.exitVoucher();
                        /* var p = { 'id': ret.data.id, 'receiptId': vm.receiptId };
                         let _purl = '';
                         if (vm.sys == 21) {
                             _purl = contextPath + '/verificationSheet/voucherUpdates';
                         } else if (vm.sys == 22) {
                             _purl = contextPath + '/paymentreceiptController/voucherUpdates';
                         } else if (vm.sys == 23) {
                             _purl = contextPath + '/OtherPaymentReceiptController/voucherUpdates';
                         } else if (vm.sys == 31) {
                             //现金日记账
                             _purl = contextPath + '/cashier/voucherUpdates';
                         } else if (vm.sys == 32) {
                             _purl = contextPath + '/cnbankdepositjournalappcontroller/voucherUpdates';
                         }
                         $.ajax({
                             type: 'POST',
                             url: _purl,
                             contentType: 'application/json;charset=utf-8',
                             data: JSON.stringify(p),
                             dataType: 'json',
                             success: function (ret) {
                                 console.log(ret)
                                 vm.exitVoucher();
                                 /!* vm.$Modal.confirm({
                                      title: '提示',
                                      content: ret.msg
                                  });*!/
                                 /!*if (ret.code == '100100') {
                                     setTimeout(function () {
                                         window.location.href = contextPath + '/finance/voucher-lrt/index.html';
                                     }, 500);
                                 }*!/
                             },
                         });*/
                    } else {
                        // alert(ret.msg)
                        // vm.$Message.info(ret.msg);
                        let cont = '';
                        if (ret == null) {
                            cont = '系统异常';
                        } else {
                            cont = ret.msg;
                        }
                        vm.$Modal.confirm({
                            title: '提示',
                            content: cont
                        });
                        if (ret.code == '100100' && saveType == 1) {
                            window.location.href = contextPath + '/finance/voucher-lrt/index.html';
                        } else if (ret.code == '100100' && saveType == 2) {
                            vm.formData.id = ret.data.id;
                            vm.formData.voucherNumber = ret.data.voucherNumber;
                            vm.voucherId = ret.data.id;
                        }
                    }
                },
                error: function (ret) {
                    console.log(ret);
                }
            });
        },
        approvalVoucher (i) {
            let t = this;
            $.ajax({
                type: 'POST',
                url: contextPath + '/voucherController/approval',
                data: { 'sobId': vm.sobId, 'voucherId': vm.voucherId, 'type': i },
                dataType: 'json',
                success: function (result) {
                    console.log(result)
                    if (result.data) {
                        if (i == 1) {
                            //审核操作成功
                            vm.status = 'audited';
                            vm.add = 'false',
                                vm.save = 'false',
                                vm.printV = 'print',// 是否显示打印按钮。显示：print
                                vm.approvalV = 'false',// 是否显示审核按钮。显示：approval
                                vm.approvalVR = 'approval',// 是否显示反审核按钮。显示：approval
                                vm.copyV = 'copy',// 是否显示复制按钮。显示：copy
                                vm.deleteV = 'false'// 是否显示删除按钮。显示：delete
                        } else {
                            //反审核操作成功
                            vm.status = 'false';
                            vm.add = 'false',
                                vm.save = 'save',
                                vm.printV = 'print',// 是否显示打印按钮。显示：print
                                vm.approvalV = 'approval',// 是否显示审核按钮。显示：approval
                                vm.approvalVR = 'false',// 是否显示反审核按钮。显示：approval
                                vm.copyV = 'copy',// 是否显示复制按钮。显示：copy
                                vm.deleteV = 'delete'// 是否显示删除按钮。显示：delete
                        }
                    } else {
                        vm.status = '-1';
                    }
                }
            });
        },
        copyVoucher () {
            let t = this;
            if ($.isEmptyObject(vm.voucherId)) {
                // alert("暂未保存，无法删除")
                t.$Message.error('暂未保存，无法删除');
                return;
            }
            $.ajax({
                type: 'POST',
                url: contextPath + '/voucherController/copyVoucher',
                data: { 'sobId': vm.sobId, 'voucherId': vm.voucherId },
                dataType: 'json',
                success: function (result) {
                    console.log(result)
                    if (result.data) {
                        t.loadInfoData(result)
                        t.$Modal.success({
                            title:'成功',
                            content:'操作成功'
                        })
                        // t.$Message.info('操作成功');
                        // alert('操作成功')
                    } else {
                        t.$Modal.error({
                            title:'错误',
                            content:'操作失败'
                        })
                        // t.$Message.error('操作失败');
                        // alert('操作失败')
                    }
                }
            });
        },
        loadInfoData (result) {
            console.log(result)
            let _vm = vm;
            //上方tab栏按钮的显示状态
            let updateInfo = result.data.entity;
            console.log("updateInfo", updateInfo)
            let entryList = result.data.entryVoList;
            _vm.voucherId = updateInfo.id || '';
            if (updateInfo.belongSystem == 2) {
                _vm.deleteV = 'false';
                _vm.status = 'editVoucher';
                if (!$.isEmptyObject(result.data.receiptId)) {
                    //设置可编辑
                    _vm.status = 'false';
                }
            } else {
                if (updateInfo.audited == 2 && updateInfo.posted == 2) {
                    //没有审核，没有过账
                    _vm.status = 'false';
                    _vm.deleteV = 'delete';
                    _vm.approvalV = 'approval';
                    _vm.approvalVR = 'false';
                    _vm.addV = 'false';
                    _vm.saveV = 'save';
                } else if (updateInfo.audited == 1 && updateInfo.posted == 2) {
                    //审核，没有过账
                    _vm.status = 'audited';
                    _vm.deleteV = 'false';
                    _vm.approvalV = 'false';
                    _vm.approvalVR = 'approval';
                    _vm.addV = 'false';
                    _vm.saveV = 'false';
                } else if (updateInfo.audited == 1 && updateInfo.posted == 1) {
                    //审核，过账
                    //审核，没有过账
                    _vm.status = 'audited';
                    _vm.deleteV = 'false';
                    _vm.approvalV = 'false';
                    _vm.approvalVR = 'false';
                    _vm.addV = 'false';
                    _vm.saveV = 'false';
                }
            }
            //回显参数
            _vm.formData.id = updateInfo.id;
            _vm.formData.voucherGroupId = updateInfo.voucherGroupId;
            _vm.formData.voucherNumber = updateInfo.voucherNumber;
            _vm.formData.voucherGroupName = updateInfo.voucherGroupName;
            _vm.formData.voucherDate = updateInfo.voucherDate;
            _vm.formData.attachmentsCount = updateInfo.attachmentsCount;
            _vm.year_period = updateInfo.accountingYear + '年第' + updateInfo.accountingPeriod + '期';
            _vm.formData.preparerName = updateInfo.preparerName;
            _vm.formData.preparerId = updateInfo.preparerId;
            _vm.formData.belongSystem = updateInfo.belongSystem;
            _vm.formData.createTime = updateInfo.createTime;

            var tab = [];
            $.each(entryList, function (idx2, entity) {
                var par = new Object();
                par.id = entity.voucher.id;
                par.voucherId = entity.voucher.voucherId;
                par.explains = entity.voucher.explains;
                par.accountId = entity.voucher.accountId;
                par.relativeAccountId = entity.voucher.relativeAccountId;
                par.direction = entity.voucher.direction;
                par.sequence = entity.voucher.sequence;
                par.ammountFor = entity.voucher.ammountFor;
                par.ammount = entity.voucher.ammount;
                par.sobId = entity.voucher.sobId;

                if (entity.voucher.direction == 1) {
                    par.debitMoney = entity.voucher.ammount + "";
                    par.creditMoney = "";
                } else {
                    par.creditMoney = entity.voucher.ammount + "";
                    par.debitMoney = "";
                }
                if ($.isEmptyObject(entity.voucher.accountCode) || $.isEmptyObject(entity.voucher.accountId)) {
                    par.accountCode = '';
                    par.subjectId = '';
                    par.subjectValue = '';
                    par.subjectLabel = '';
                    par.subject = '';
                } else {
                    par.accountCode = entity.voucher.accountCode;
                    par.subjectId = entity.voucher.accountId;

                    par.subjectValue = entity.voucher.accountCode;
                    $.each(_vm.subjects, function (i, s) {
                        if (entity.voucher.accountCode == s.value) {
                            // par.subjectLabel = s.label;
                            par.subjectLabel = s.fullName;
                            return false;
                        }
                    });
                    par.subject = par.subjectValue + ' ' + par.subjectLabel;
                    if (!$.isEmptyObject(entity.opts)) {
                        /*let subValue = '';
                        Object.keys(entity.opts).forEach(function (key) {

                            par.subject = par.subject + '_' + key + ' ' + _vm.subjectOpts[key].list[entity.opts[key]];
                        });
                        par.subject = par.subject + subValue;*/
                        let subValue = '';
                        let arr =Object.keys(entity.opts);
                        arr.forEach(function (_key) {
                            let pro = _vm.subjectOpts[_key].list[entity.opts[_key]];
                            /*for(let i = 0;i<proList.length;i++){
                                if(proList[i].id == key){
                                    code = proList[i].
                                }
                            }*/
                            console.log(pro,entity,"------")
                            par.subject = par.subject + '_' + pro.code+ ' ' + pro.name;
                            // par.subject = par.subject + '_' + key + ' ' + _vm.subjectOpts[key].list[entity.opts[key]];
                        });
                        par.subject = par.subject + subValue;
                    }
                }

                par.opts = entity.opts;
                if (entity.voucher.hasQuantityShow) {
                    par.hasQuantity = true;
                    par.unitPrice = entity.voucher.unitPrice;
                    par.quantity = entity.voucher.quantity;
                    par.unitId = entity.voucher.unitId;
                } else {
                    par.hasQuantity = false;
                }
                /*if(!$.isEmptyObject(entity.voucher.unitPrice)||!$.isEmptyObject(entity.voucher.quantity)){
                    par.hasQuantity = true;
                    par.unitPrice = entity.voucher.unitPrice;
                    par.quantity = entity.voucher.quantity;
                }else{
                    par.hasQuantity = false;
                }*/
                if (entity.voucher.hasCurrencyShow) {
                    par.currencyList = _vm.currencyList;
                    par.hasCurrency = true;
                    par.currencyId = entity.voucher.currencyId;
                    par.exchangeRate = entity.voucher.exchangeRate;
                    par.currencyName = entity.voucher.currencyName;
                } else {
                    par.hasCurrency = false;
                }

                /*if(!$.isEmptyObject(entity.voucher.currencyId)||!$.isEmptyObject(entity.voucher.currencyName)||!$.isEmptyObject(entity.voucher.exchangeRate)){
                    par.hasCurrency=true;
                    par.currencyId = entity.voucher.currencyId;
                    par.exchangeRate = entity.voucher.exchangeRate;
                    par.currencyName = entity.voucher.currencyName;
                    par.unitId = entity.voucher.currencyId;
                }else{
                    par.hasCurrency=false;
                }*/

                tab.push(par);
                /*
                    explainsValue: '',
                    subjectDetail: {},
                    unitId:''*/

            });
            _vm.tableDatas = tab;
            console.log(tab.length)
            _vm.add(tab.length)
        },
        //删除凭证
        deleteVoucherConform () {
            let that = this;
            $.ajax({
                type: 'POST',
                url: contextPath + '/voucherController/delete',
                data: { 'sobId': vm.sobId, 'voucherId': vm.voucherId },
                dataType: 'json',
                success: function (result) {
                    console.log(result)
                    if (result.code == '100100') {
                        that.exitVoucher();
                    } else {
                        let cont = '';
                        if (result == null) {
                            cont = '删除失败';
                        } else {
                            cont = result.msg;
                        }
                        that.$Modal.error({
                            title: '提示',
                            content: cont
                        });
                    }
                }
            });
        },
        deleteVoucher () {
            let t = this;
            t.$Modal.confirm({
                title: '系统提示',
                content: '<p>确认要删除所选数据？该操作是物理删除，数据不可还原！</p>',
                onOk: () => {
                    t.deleteVoucherConform();
                },
                onCancel: () => {
                    /*this.$Message.info('取消删除');*/
                }
            });
        },
        //红字冲销
        redVoucher () {
            console.log('红字冲销')
            let that = this;
            if(vm.voucherId == null || vm.voucherId  == '' || vm.voucherId == 0){
                vm.$Message.error("暂无凭证");
                return;
            }
            let redVoucherParam = { 'sobId': vm.sobId, 'voucherId': vm.voucherId };
            $.ajax({
                type: 'POST',
                url: contextPath + '/voucherController/writeOff',
                data: redVoucherParam,
                dataType: 'json',
                success: function (result) {
                    let cont = '';
                    if (result == null) {
                        cont = '操作失败';
                    } else {
                        cont = result.msg;
                    }
                    that.$Modal.confirm({
                        title: '提示',
                        content: cont
                    });
                }
            });
        },
        switchVoucher (type) {
            let _v = this;
            $.ajax({
                type: 'POST',
                url: contextPath + '/voucherController/switchVoucher',
                data: { 'sobId': _v.sobId, 'voucherId': _v.voucherId, 'type': type },
                dataType: 'json',
                success: function (result) {
                    console.log(result)
                    if (result.code == '100100') {
                        _v.loadInfoData(result)
                    } else {
                        _v.$Modal.error({
                            title:'提示',
                            content:result==null||result.msg==null?'操作失败':result.msg
                        })
                    }
                }
            });
        },
        exitVoucher () {
            var name = '记账凭证';
            window.parent.closeCurrentTab({ name: name, openTime: this.openTime, exit: true })
        },
        printV () {
            // alert("print")
        }
    },
    watch: {
        // 监听行数据
        tableDatas: {
            handler () {
                this.watchTblData();
            },
            deep: true
        },
        'formData.voucherDate': function (curVal, oldVal) {
            // console.log(curVal,oldVal)
        },
        'formData.voucherGroupId': function (curVal, oldVal) {
            if(this.updateType){
                return;
            }
            let pNum = { 'voucherGroupId': curVal, 'sobId': this.formData.sobId, 'accountingYear': this.formData.accountingYear, 'accountingPeriod': this.formData.accountingPeriod };
            $.ajax({
                type: 'post',
                url: contextPath + '/voucherController/getSerialNum',
                data: pNum,
                success: function (result) {
                    // console.log(result)
                    if (!$.isEmptyObject(result.data)) {
                        vm.formData.voucherNumber = result.data;
                        // console.log(vm.typeList[curVal])
                        vm.typeList.forEach(row => {
                            if (row.id == curVal) {
                                vm.formData.voucherGroupName = row.name
                                return false;
                            }
                        });
                        // vm.formData.voucherGroupName = vm.typeList[curVal].name;
                        // vm.formData.voucherGroupName = item.label;
                    }
                }
            });
        },

    },
    computed: {
        _getDateformat () {
            return (new Date(this.formData.voucherDate)).format("yyyy-MM-dd")
        },
        _getcreateTimeDateformat () {
            var _d = this.formData.createTime || new Date();
            return (new Date(_d)).format("yyyy-MM-dd")
        },
        _getvoucherNumber () {
            var that = this;
            if (!that.formData.voucherGroupId) return;
            var _f = '';
            that.typeList.forEach(row => {
                if (row.id === that.formData.voucherGroupId) {
                    _f = row.name;
                }
            });
            // var _f = that.typeList.find(item => item.id === that.formData.voucherGroupId);
            return `${_f} - ${that.formData.voucherNumber}`
        },
        // 摘要下拉菜单数据
        abstracts () {
            return this.remarklist.map(function (e) {
                return {
                    label: e.content,
                    value: e.id || '000',
                    opts: {}
                }
            })
        },
        totalDebit () {
            let total = 0;
            this.tableDatas.forEach(row => {
                total = Number(Number(total).add(row.debitMoney))
            })
            return total ? total : '';
        },

        totalCredit () {
            let total = 0;
            this.tableDatas.forEach(row => {
                total = Number(Number(total).add(row.creditMoney))
            })
            return total ? total : '';
        },
        showBg () {
            if (Number(this.totalCredit) >= 1000000000 || Number(this.totalDebit) >= 1000000000) {
                return false;
            } else {
                return true;
            }
        },
        // 根据“数量”和“币别”列是否显示，确定跨列数
        totalCol () {
            let currency = this.currencyShow ? 1 : 0;
            let quantity = this.quantityShow ? 1 : 0;
            return 2 + currency + quantity;
        },
        // 如果借贷平衡，显示总计
        totalMoney () {
            if (this.totalDebit === this.totalCredit) {
                return this.digitUppercase(this.totalDebit);
            }
            return ''
        }

    },
    created: function () {
        var _vm = this;
        _vm.openTime = window.parent.params && window.parent.params.openTime;
        this.watchTblData();
        let flag = false;
        // 获取科目下拉菜单数据
        $.ajax({
            type: 'post',
            url: contextPath + '/voucherController/initVoucher', // 跳转 URL
            dataType: 'json',
            success: function (result) {
                console.log(result)
                if (result.code != '100100') {
                    _vm.$Modal.error({
                        title:'错误',
                        content:result==null||result.msg==null||result.msg==''?'初始化数据失败':result.msg
                    })
                    // _vm.$Message.info(result.msg);
                    // alert(result.msg);
                    return;
                }
                _vm.add(2);
                let dataInfo = result.data;
                _vm.remarklist = dataInfo.voucherExpList;
                _vm.typeList = dataInfo.voucherDataList;
                _vm.formData.voucherGroupId = _vm.typeList[0].id;
                _vm.formData.jump.voucherGroupId = _vm.typeList[0].id;
                _vm.sobId = dataInfo.sobId;
                _vm.standardCurrencyId = dataInfo.standardCurrencyId;
                _vm.formData.sobId = dataInfo.sobId;
                //                    _vm.formData.voucherNumber=dataInfo.serialNum;
                _vm.formData.voucherNumber = '';
                _vm.formData.voucherDate = dataInfo.periodDate;
                _vm.oldVoucherDate = dataInfo.periodDate;
                _vm.year_period = dataInfo.currentAccountYear + '年第' + dataInfo.currentAccountPeriod + '期';
                _vm.formData.accountingYear = dataInfo.currentAccountYear;
                _vm.formData.accountingPeriod = dataInfo.currentAccountPeriod;
                let accountSubjectList = dataInfo.accountSubjectList;
                var subjectList = accountSubjectList.filter(function (item, idx) {
                    if (!$.isEmptyObject(accountSubjectList[idx].value)) {
                        return item;
                    }
                });
                _vm.subjects = subjectList;
                _vm.subjectOpts = dataInfo.projectEntity;
                _vm.currencyList = dataInfo.currencyList
                _vm.unitList = dataInfo.unitList

                _vm.formData.preparerName = dataInfo.user.username;
                _vm.formData.preparerId = dataInfo.user.id;

                let status = dataInfo.status;
                if (status == 1) {
                    //新增页面  显示新增，保存，
                    _vm.addV = 'add';
                    _vm.saveV = 'save';
                }

                let voucherId = getUrlParam("voucherId");
                let sobId = getUrlParam("sobId");
                _vm.voucherId = voucherId;
                _vm.formData.id = voucherId;
                //查询凭证信息
                if (voucherId != null) {
                    _vm.del(2)
                    $.ajax({
                        type: 'POST',
                        url: contextPath + '/voucherController/infoVoucher',
                        data: { 'sobId': sobId, 'voucherId': voucherId },
                        dataType: 'json',
                        success: function (result) {
                            console.log(result)
                            if(result.code != '100100'){
                                _vm.$Modal.error({
                                    title:'错误',
                                    content:'获取凭证异常'
                                })
                                return;
                            }
                            _vm.updateType = true;
                            _vm.loadInfoData(result)
                        }
                    });
                }

                //应收应付显示凭证并存储
                let type = getUrlParam("type");
                if (type != null) {
                    let key = getUrlParam("key");
                    let sys = getUrlParam("sys");
                    _vm.sys = sys;
                    $.ajax({
                        type: 'POST',
                        url: contextPath + '/voucherController/receiptManager',
                        data: { 'key': key },
                        dataType: 'json',
                        success: function (ret) {
                            var obj = JSON.parse(ret);
                            console.log("receiptManager=========================")
                            console.log(obj)
                            _vm.receiptId = obj.data.receiptId;
                            _vm.loadInfoData(obj)
                        },
                        error: function (ret) {
                            console.log(ret);
                        }
                    });
                }
            }
        });
    },
    mounted () {
        switchEnterEvent('on');
        var that = this;
        that.init();
        hotkeys('ctrl+s,f12++', function (event, handler) {
            event.preventDefault()
            switch (handler.key) {
                case "ctrl+s":
                    //保存
                    that.saveOrUpdateVoucher(2); break;
            }
        });
        window.parent.home.$Message.destroy();
        that.printOrgName = JSON.parse(localStorage.user).currentOrgName;
    }
});

function enterToNext (event, target) {
    //console.log(target);
    if (event.which == 13) {
        setTimeout(function () {

            // 如果有特定的 target，直接跳过去（target 为 jQuery selector）
            if (typeof target != 'undefined') {
                target.focus();
                return false;
            }

            var $input = $(event.target);
            var $inputList = $('.ht-voucher-table tbody').find('input:visible, select:visible, button:visible');
            var currIdx = $inputList.index($input);
            var $nextInput = $inputList.get(currIdx + 1);
            var $tr = null;
            var $iselect = null;
            var ioption = null;
            var objVal = {};

            // 如果有科目关联的项目（i-select）
            if ($input.closest('.ivu-select').length) {
                $iselect = $input.closest('.ivu-select');

                if (typeof $iselect.attr('id') != 'undefined') {
                    ioption = $iselect.attr('id').replace('iselect', 'ioption');

                    $.each($('li.' + ioption), function (idx, ele) {
                        var newVal = $(this).text();
                        var index = newVal.indexOf($input.val());
                        if (index > -1) {
                            objVal[Number(index)] = ele;
                        }
                    });

                    // 找到从开头最匹配的
                    var key = Object.keys(objVal).map(function (item) {
                        return Number(item);
                    }).sort(function (x, y) {
                        return x - y;
                    }).shift();

                    // 触发选择 option 事件
                    if (key in objVal) {
                        $(objVal[key]).click();
                    }

                    // 等到上面的 click 事件完成，跳到下一个焦点
                    setTimeout(function () {
                        if ($nextInput) {
                            $nextInput.focus();
                        }
                    });
                    return false;
                }
            }

            // 如果在借贷方金额的 input 内
            if ($input.hasClass('ht-money')) {
                $tr = $input.closest('tr');
                var $moneyInput = $tr.find('.ht-money');

                // 如果当前 focus 在贷方 input
                if ($($moneyInput.get(1)).is($input)) {

                    // 如果借贷方都为空
                    if ($($moneyInput.get(0)).val() == '' && $($moneyInput.get(1)).val() == '') {
                        // vm.$Message.warning('请填写借方或贷方金额');
                        vm.$Modal.warning({
                            title:'警告',
                            content:'请填写借方或贷方金额'
                        })
                        return false;
                    }
                }
            }

            // 跳到默认的下一个焦点
            if ($nextInput) {
                $nextInput.focus();
            }
        });
    }
}

function switchEnterEvent (onOrOff) {
    var func = null;
    if (onOrOff == 'on') {
        func = enterToNext;
    }
    $(document).on('keydown', func);
}