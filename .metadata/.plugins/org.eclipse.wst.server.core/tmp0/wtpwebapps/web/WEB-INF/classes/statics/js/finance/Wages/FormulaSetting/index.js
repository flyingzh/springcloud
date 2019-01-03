var ve = new Vue({
    el: '#formulaSetting',
    data () {
        let This = this;
        return {
            tid: 'zTreeAssetStorageLocation',
            // treeUrl:contextPath + "/falocation/initTree",
            treeUrl: '',
            isDisabled: true,
            formData: {
                id: '',
                code: '',
                name: '',
                sobId: '',
                editable: '1',
                remark: '',
                pid: '',
                currentFormulaItemCode: '',
                currentFormulaItemName: ''
            },
            initialItems: [],
            currentFormulaItems: [],
            selectItemCode: '',
            initForm: {
                id: '',
                code: '',
                name: '',
                sobId: '',
                editable: '1',
                remark: '',
                pid: '',
            },
            organizationList: [],
            //收支类型树形
            nodes: [],
            setting: {
                callback: {
                    onClick: this.clickEvent,
                }
            },
            curEntity: {},
            selected: '',
            openTime: '',
            treeSetting: {
                callback: {
                    onClick: this.treeClickCallBack,
                    beforeClick: this.treeBeforeClick
                }
            },
            // 工资类别集合
            initialWageCategorys: [],
            // 当前工资类别
            currentWageCategoryNo: null,
            // 当前工资类别
            currentWageCategoryId: null,
            // 公式名称
            initialFormulaNames: [],
            // 当前公式id
            currentFormulaId: null,
            // 当前公式名称
            currentFormulaName: '',
            // 是否新增/修改
            isUpdate: false,
        }
    },
    methods: {
        itemSelect (type) {
            this.selectItemCode = type;
            console.log(type, '=========type==============');
            // 获取光标位置下标
            var _n = getPositionForTextArea(document.getElementById('zhangdanNum'));
            if (this.formData.currentFormulaItemCode == null) {
                this.formData.currentFormulaItemCode = "";
            }

            if (this.formData.currentFormulaItemName == null) {
                this.formData.currentFormulaItemName = "";
            }

            this.initialItems.forEach(_v => {
                if (_v.itemCode === type) {
                    // this.formData.currentFormulaItemCode += _v.itemCode;
                    // this.formData.currentFormulaItemName += _v.itemName;
                    // 根据获取的光标位置 往数据中插入选择的值
                    // this.formData.currentFormulaItemName = this.formData.currentFormulaItemName.htSplice(_n, 0, _v.itemName);
                    this.formData.currentFormulaItemName = this.htSplice2(this.formData.currentFormulaItemName, _n, 0, _v.itemName);
                    var _l = _n + _v.itemName.length;

                    this.$nextTick(() => {
                        // 设置光标位置
                        setCursorPosition(document.getElementById('zhangdanNum'), _l);
                    })
                }
            });
        },
        htSplice2 (tx, idx, rem, str) {
            return tx.slice(0, idx) + str + tx.slice(idx + Math.abs(rem));
        },
        actionMth (type) {
            console.log(type, '=========actionMthtype==============');
            this.formData.currentFormulaItemCode += type;
            this.formData.currentFormulaItemName += type;
        },
        initPage () {
            let _vm = this;
            _vm.isUpdate = false;

            $("#addOperation").prop("disabled", false);
            $("#modifyOperation").prop("disabled", false);
            $("#deleteOperation").prop("disabled", false);

            /**
             * 初始化清空
             */
            _vm.initialItems = [];
            _vm.currentWageCategoryNo = null;
            _vm.currentWageCategoryId = null;
            _vm.initialFormulaNames = [];
            _vm.currentFormulaId = null;
            _vm.currentFormulaName = '';
            _vm.formData.currentFormulaItemCode = '';
            _vm.formData.currentFormulaItemName = '';

            /**
             * 1.获取工资类别
             */
            $.ajax({
                type: 'post',
                url: contextPath + "/wmFormulaSetting/queryFormulaSetting",
                data: null,
                async: false,
                success: function (ret) {
                    if (ret.code == '100100') {
                        var wageCategorysObj = ret.data;

                        if (null != wageCategorysObj && wageCategorysObj != '' && typeof (wageCategorysObj) != "undefined") {
                            _vm.initialWageCategorys = wageCategorysObj;
                            var sysDefault = 0;

                            for (var i = 0; i < wageCategorysObj.length; i++) {
                                var wageCategoryObj = wageCategorysObj[i];

                                if (null != wageCategoryObj && wageCategoryObj != '' && typeof (wageCategoryObj) != "undefined") {
                                    sysDefault = wageCategoryObj.sysDefault;

                                    if (sysDefault == 1 || sysDefault == '1') {
                                        _vm.currentWageCategoryId = wageCategoryObj.id;
                                        _vm.currentWageCategoryNo = wageCategoryObj.categoryNo;
                                    }
                                }
                            }

                            if (sysDefault == 0) {
                                _vm.currentWageCategoryId = wageCategorysObj[0].id;
                                _vm.currentWageCategoryNo = wageCategorysObj[0].categoryNo;
                            }

                            var wmItemsEntity = {};
                            wmItemsEntity.categoryId = _vm.currentWageCategoryId;   // 当前工资类别id
                            wmItemsEntity.dataType = 6;                             // 1：逻辑，2：日期，3：文本，4：整数，5：实数，6：货币

                            /**
                             * 2.获取工资类别下的项目
                             */
                            $.ajax({
                                type: 'post',
                                contentType: 'application/json;charset=utf-8',
                                url: contextPath + "/app/wmItems/getWmItems",
                                data: JSON.stringify(wmItemsEntity),
                                async: false,
                                success: function (ret) {
                                    if (ret.code == '100100') {
                                        var initialItemsData = ret.data;

                                        for (var index = 0; index < initialItemsData.length; index++) {
                                            var item = initialItemsData[index];

                                            /**
                                             * 项目编码、项目名称
                                             */
                                            var itemObj = {
                                                itemCode: item.itemCode,
                                                itemName: item.itemName
                                            }

                                            _vm.initialItems.push(itemObj);
                                        }
                                    } else {
                                        _vm.$Modal.error({
                                            title: '错误',
                                            content: ret.msg
                                        })
                                    }
                                }
                            })

                            /**
                             * 3.获取公式信息
                             */
                            $.ajax({
                                type: 'post',
                                url: contextPath + "/wmFormulaSetting/queryFormulaSettingByCategory",
                                data: { categoryId: _vm.currentWageCategoryId },
                                async: false,
                                success: function (ret) {
                                    if (ret.code == '100100') {
                                        var currentWageCategoryObj = ret.data;

                                        if (null != currentWageCategoryObj && currentWageCategoryObj != '' && typeof (currentWageCategoryObj) != "undefined") {
                                            _vm.isUpdate = false;
                                            var selectedWageCategoryObj = currentWageCategoryObj[0];
                                            var wageFormulaSettingObj = selectedWageCategoryObj.wmFormulaSettingList;

                                            if (null != wageFormulaSettingObj && wageFormulaSettingObj != '' && typeof (wageFormulaSettingObj) != "undefined") {
                                                _vm.currentFormulaName = wageFormulaSettingObj[0].formulaName;
                                                _vm.initialFormulaNames = wageFormulaSettingObj;
                                                _vm.currentFormulaId = wageFormulaSettingObj[0].id;
                                                _vm.formData.currentFormulaItemCode = wageFormulaSettingObj[0].calcMethod;
                                                _vm.formData.currentFormulaItemName = _vm.getItemName(_vm.formData.currentFormulaItemCode);
                                            } else {
                                                _vm.isUpdate = true;
                                            }
                                        }
                                    } else {
                                        _vm.$Modal.error({
                                            title: '错误',
                                            content: ret.msg
                                        })
                                    }
                                }
                            })
                        }
                    } else {
                        _vm.$Modal.error({
                            title: '错误',
                            content: ret.msg
                        })
                    }
                }
            })
        },
        modify (type) {
            let that = this;

            /**
             * 新增/修改操作
             */
            that.isUpdate = true;

            if (type == 'add') {
                that.initialFormulaNames = [];
                that.currentFormulaId = null;
                that.currentFormulaName = '';
                that.formData.currentFormulaItemCode = '';
                that.formData.currentFormulaItemName = '';

                $("#modifyOperation").prop("disabled", true);
                $("#deleteOperation").prop("disabled", true);
            } else {
                $("#addOperation").prop("disabled", true);
                $("#deleteOperation").prop("disabled", true);
            }
        },
        saveFun () {
            let that = this;
            var formulaName = that.formData.currentFormulaItemName;

            if (that.currentFormulaName == null || that.currentFormulaName == '') {
                that.$Modal.error({
                    scrollable: true,
                    content: "公式名称不能为空!",
                    onOk: function () {
                        that.$nextTick(() => {
                            that.$refs.formulaNameObj.focus();
                        })
                    }
                });

                return;
            }

            if (that.formData.currentFormulaItemCode == null || that.formData.currentFormulaItemCode == '') {
                that.$Modal.error({
                    scrollable: true,
                    content: "计算方法不能为空!",
                    onOk: function () {
                        that.$nextTick(() => {
                            that.$refs.formulaObj.focus();
                        })
                    }
                });

                return;
            }

            if (formulaName != null) {
                if (formulaName.lastIndexOf(';') != formulaName.length - 1) {
                    that.$Modal.error({
                        title: '提示',
                        content: '计算公式最后必须是' + '\'' + ';' + '\'',
                        onOk: function () {
                            that.$nextTick(() => {
                                that.$refs.formulaObj.focus();
                            })
                        }
                    });

                    return false;
                }

                if (formulaName.indexOf(';;') != - 1) {
                    that.$Modal.error({
                        title: '提示',
                        content: '计算公式不能连续出现符号' + '\'' + ';' + '\'',
                        onOk: function () {
                            that.$nextTick(() => {
                                that.$refs.formulaObj.focus();
                            })
                        }
                    });

                    return false;
                }

                if (formulaName.indexOf('；') != - 1) {
                    _vm.$Modal.error({
                        title: '提示',
                        content: '计算公式符号' + '\'' + ';' + '\'必须是英文',
                        onOk: function () {
                            _vm.$nextTick(() => {
                                _vm.$refs.formulaObj.focus();
                            })
                        }
                    });

                    return false;
                }
            }

            var formulaArray = formulaName.split(';');

            if (null != formulaArray) {
                for (var i = 0; i < formulaArray.length; i++) {
                    var formulaObj = formulaArray[i];

                    if (null != formulaObj && formulaObj != '') {
                        var isFormatFormula = that.checkFormulaFormat(formulaObj);

                        if (!isFormatFormula) {
                            return;
                        }

                        var isCorrect = that.checkFormulaName(formulaObj);

                        if (!isCorrect) {
                            return;
                        }
                    }
                }
            }

            if (!isFormatFormula || !isCorrect) {
                that.$Modal.success({
                    title: '提示信息',
                    scrollable: true,
                    content: "公式不正确!",
                    onOk: function () {
                        that.$nextTick(() => {
                            that.$refs.formulaObj.focus();
                        })
                    }
                })

                return;
            }

            /**
             * 新增/修改公式信息
             */
            var wmFormulaSetting = {
                id: null,
                categoryId: null,
                formulaName: '',
                calcMethod: '',
            }

            /**
             * 新增
             */
            if (that.currentFormulaId == null || that.currentFormulaId == '') {
                wmFormulaSetting.categoryId = that.currentWageCategoryId;
                wmFormulaSetting.formulaName = that.currentFormulaName;
                wmFormulaSetting.calcMethod = that.getItemCode(that.formData.currentFormulaItemName);

                /**
                 * 新增公式信息
                 */
                $.ajax({
                    type: 'post',
                    contentType: 'application/json;charset=utf-8',
                    url: contextPath + "/wmFormulaSetting/saveWmFormulaSetting",
                    data: JSON.stringify(wmFormulaSetting),
                    async: false,
                    success: function (ret) {
                        if (ret.code == '100100') {
                            var result = ret.data;

                            if (result != null && result != '') {
                                if (result > 0) {
                                    that.$Modal.success({
                                        title: '提示信息',
                                        scrollable: true,
                                        content: "新增成功!",
                                    })

                                    that.$refs.formulaId.reset();

                                    that.$nextTick(() => {
                                        // 刷新页面
                                        that.initPage();
                                    })
                                }
                            }
                        } else {
                            that.$Modal.error({
                                title: '错误',
                                content: '页面初始化失败'
                            })
                        }
                    }
                })
                /**
                 * 修改
                 */
            } else {
                wmFormulaSetting.id = that.currentFormulaId;
                wmFormulaSetting.categoryId = that.currentWageCategoryId;
                wmFormulaSetting.formulaName = that.currentFormulaName;
                console.log("1:" + that.formData.currentFormulaItemName); console.log("2:" + that.getItemCode(that.formData.currentFormulaItemName));
                wmFormulaSetting.calcMethod = that.getItemCode(that.formData.currentFormulaItemName);

                /**
                 * 修改公式信息
                 */
                $.ajax({
                    type: 'post',
                    contentType: 'application/json;charset=utf-8',
                    url: contextPath + "/wmFormulaSetting/updateWmFormulaSetting",
                    data: JSON.stringify(wmFormulaSetting),
                    async: false,
                    success: function (ret) {
                        if (ret.code == '100100') {
                            var result = ret.data;

                            if (result != null && result != '') {
                                if (result > 0) {
                                    that.$Modal.success({
                                        title: '提示信息',
                                        scrollable: true,
                                        content: "更新成功!",
                                    })

                                    that.$refs.formulaId.reset();

                                    that.$nextTick(() => {
                                        // 刷新页面
                                        that.initPage();
                                    })
                                }
                            }
                        } else {
                            that.$Modal.error({
                                title: '错误',
                                content: '页面初始化失败'
                            })
                        }
                    }
                })
            }
        },
        delFun () {
            let _vm = this;

            if (_vm.currentFormulaId == null) {
                _vm.$Message.error('请选择要删除的公式!')
                return;
            }

            /**
             * 修改公式信息
             */
            $.ajax({
                type: 'post',
                url: contextPath + "/wmFormulaSetting/deleteWmFormulaSetting",
                data: { categoryId: _vm.currentWageCategoryId, id: _vm.currentFormulaId },
                dataType: 'json',
                async: false,
                success: function (ret) {
                    if (ret.code == '100100') {
                        var result = ret.data;

                        if (result != null && result != '') {
                            if (result > 0) {
                                _vm.$Modal.success({
                                    title: '提示信息',
                                    scrollable: true,
                                    content: "删除成功!",
                                })

                                // 刷新页面
                                _vm.initPage();
                            }
                        }
                    } else {
                        var message = "";

                        if (null != ret.msg && ret.msg != "" && typeof (ret.msg) != "undefined") {
                            message = ret.msg;
                        } else {
                            message = "删除失败!";
                        }

                        _vm.$Modal.error({
                            title: '错误',
                            content: message
                        })
                    }
                }
            })
        },
        changeWageCategory: function () {
            let _that = this;
            var changeWageCategoryObj = _that.currentWageCategoryId;
            var initialWageCategorys = _that.initialWageCategorys;

            if (null != initialWageCategorys && initialWageCategorys != '' && typeof (initialWageCategorys) != "undefined") {
                for (var index = 0; index < initialWageCategorys.length; index++) {
                    var wageCategory = initialWageCategorys[index];

                    if (null != wageCategory && wageCategory != '' && typeof (wageCategory) != "undefined") {
                        if (null != changeWageCategoryObj && changeWageCategoryObj != '' && typeof (changeWageCategoryObj) != "undefined") {
                            if (changeWageCategoryObj == wageCategory.id) {
                                _that.initialFormulaNames = wageCategory.wmFormulaSettingList;

                                if (null != _that.initialFormulaNames && _that.initialFormulaNames != '' && typeof (_that.initialFormulaNames) != "undefined") {
                                    _that.isUpdate = false;
                                    _that.currentFormulaId = _that.initialFormulaNames[0].id;
                                    /*
                                     * 更新公式信息
                                     */
                                    _that.changeFormula(_that.initialFormulaNames, _that.currentFormulaId);
                                } else {
                                    _that.isUpdate = true;
                                    _that.currentFormulaId = null;
                                    _that.currentFormulaName = null;
                                    _that.formData.currentFormulaItemCode = null;
                                    _that.formData.currentFormulaItemName = null;
                                }
                            }
                        }
                    }
                }
            }
        },
        changeFormula: function (initialFormulaNames, currentFormulaId) {
            let _that = this;
            var changeFormulaObj;
            var formulaNamesObj;

            if (initialFormulaNames == '' && currentFormulaId == '') {
                formulaNamesObj = _that.initialFormulaNames;
                changeFormulaObj = _that.currentFormulaId;
            } else {
                formulaNamesObj = initialFormulaNames;
                changeFormulaObj = currentFormulaId;
            }

            if (null != formulaNamesObj && formulaNamesObj != '' && typeof (formulaNamesObj) != "undefined") {
                for (var index = 0; index < formulaNamesObj.length; index++) {
                    var formula = formulaNamesObj[index];

                    if (null != formula && formula != '' && typeof (formula) != "undefined") {
                        if (null != changeFormulaObj && changeFormulaObj != '' && typeof (changeFormulaObj) != "undefined") {
                            if (changeFormulaObj == formula.id) {
                                _that.currentFormulaName = formula.formulaName;
                                _that.formData.currentFormulaItemCode = formula.calcMethod;
                                _that.formData.currentFormulaItemName = _that.getItemName(_that.formData.currentFormulaItemCode);
                            }
                        }
                    }
                }
            } else {

            }
        },
        getItemName: function (currentFormulaItemCode) {
            let _vm = this;
            var currentFormulaItemName = "";   // 用于显示计算方法

            if (null != currentFormulaItemCode && currentFormulaItemCode != '' && typeof (currentFormulaItemCode) != "undefined") {
                currentFormulaItemCode = currentFormulaItemCode.replace(new RegExp("\\+", "gm"), ",+,");
                currentFormulaItemCode = currentFormulaItemCode.replace(new RegExp("\\-", "gm"), ",-,");
                currentFormulaItemCode = currentFormulaItemCode.replace(new RegExp("\\*", "gm"), ",*,");
                currentFormulaItemCode = currentFormulaItemCode.replace(new RegExp("\\/", "gm"), ",/,");
                currentFormulaItemCode = currentFormulaItemCode.replace(new RegExp("\\=", "gm"), ",=,");
                currentFormulaItemCode = currentFormulaItemCode.replace(new RegExp("\\(", "gm"), "(,");
                currentFormulaItemCode = currentFormulaItemCode.replace(new RegExp("\\)", "gm"), ",)");
                currentFormulaItemCode = currentFormulaItemCode.replace(new RegExp("\\;", "gm"), ",;,");
                var currentFormulaItemCodeArray = currentFormulaItemCode.split(",");

                if (null != currentFormulaItemCodeArray && currentFormulaItemCodeArray != '' && typeof (currentFormulaItemCodeArray) != "undefined") {
                    if (null != _vm.initialItems && _vm.initialItems != '' && typeof (_vm.initialItems) != "undefined") {
                        for (var i = 0; i < currentFormulaItemCodeArray.length; i++) {
                            var currentFormulaItemObj = currentFormulaItemCodeArray[i];

                            // 剔除空白符
                            var formulaItemObj = currentFormulaItemObj.replace(/\s/g, '');

                            // 剔除换行符
                            formulaItemObj = currentFormulaItemObj.replace(/[\r\n]/g, "");

                            for (var j = 0; j < _vm.initialItems.length; j++) {
                                var itemObj = _vm.initialItems[j];

                                if (null != itemObj && itemObj != '' && typeof (itemObj) != "undefined") {
                                    var itemCode = itemObj.itemCode;
                                    var itemName = itemObj.itemName;

                                    // 当项目Code对应时，转换为项目名称
                                    if (formulaItemObj == itemCode) {
                                        // 将项目编码替换为项目名称
                                        currentFormulaItemCodeArray[i] = currentFormulaItemObj.replace(formulaItemObj, itemName);
                                    }
                                }
                            }
                        }
                    }
                }
            }

            if (null != currentFormulaItemCodeArray && currentFormulaItemCodeArray != '' && typeof (currentFormulaItemCodeArray) != "undefined") {
                currentFormulaItemName = currentFormulaItemCodeArray.join('');
            }

            return currentFormulaItemName;
        },
        getItemCode: function (currentFormulaItemName) {
            let _vm = this;
            var currentFormulaItemCode = "";   // 用于保存计算方法

            if (null != currentFormulaItemName && currentFormulaItemName != '' && typeof (currentFormulaItemName) != "undefined") {
                currentFormulaItemName = currentFormulaItemName.replace(new RegExp("\\+", "gm"), ",+,");
                currentFormulaItemName = currentFormulaItemName.replace(new RegExp("\\-", "gm"), ",-,");
                currentFormulaItemName = currentFormulaItemName.replace(new RegExp("\\*", "gm"), ",*,");
                currentFormulaItemName = currentFormulaItemName.replace(new RegExp("\\/", "gm"), ",/,");
                currentFormulaItemName = currentFormulaItemName.replace(new RegExp("\\=", "gm"), ",=,");
                currentFormulaItemName = currentFormulaItemName.replace(new RegExp("\\(", "gm"), "(,");
                currentFormulaItemName = currentFormulaItemName.replace(new RegExp("\\)", "gm"), ",)");
                currentFormulaItemName = currentFormulaItemName.replace(new RegExp("\\;", "gm"), ",;,");
                var currentFormulaItemNameArray = currentFormulaItemName.split(",");

                if (null != currentFormulaItemNameArray && currentFormulaItemNameArray != '' && typeof (currentFormulaItemNameArray) != "undefined") {
                    if (null != _vm.initialItems && _vm.initialItems != '' && typeof (_vm.initialItems) != "undefined") {
                        for (var i = 0; i < currentFormulaItemNameArray.length; i++) {
                            var currentFormulaItemObj = currentFormulaItemNameArray[i];

                            // 剔除空白符
                            var formulaItemObj = currentFormulaItemObj.replace(/\s/g, '');

                            // 剔除换行符
                            formulaItemObj = currentFormulaItemObj.replace(/[\r\n]/g, "");

                            for (var j = 0; j < _vm.initialItems.length; j++) {
                                var itemObj = _vm.initialItems[j];

                                if (null != itemObj && itemObj != '' && typeof (itemObj) != "undefined") {
                                    var itemCode = itemObj.itemCode;
                                    var itemName = itemObj.itemName;

                                    // 当项目Code对应时，转换为项目名称
                                    if (formulaItemObj == itemName) {
                                        // 将项目编码替换为项目名称
                                        currentFormulaItemNameArray[i] = currentFormulaItemObj.replace(formulaItemObj, itemCode);
                                    }
                                }
                            }
                        }
                    }
                }
            }

            if (null != currentFormulaItemNameArray && currentFormulaItemNameArray != '' && typeof (currentFormulaItemNameArray) != "undefined") {
                currentFormulaItemCode = currentFormulaItemNameArray.join('');
            }

            return currentFormulaItemCode;
        },
        checkFormulaFormat: function (string) {
            let _vm = this;

            // 剔除空白符
            string = string.replace(/\s/g, '');

            // 提出换行符
            string = string.replace(/[\r\n]/g, "");

            // 错误情况，空字符串
            if ("" === string) {
                _vm.$Modal.error({
                    title: '提示',
                    content: '计算方法为空!',
                    onOk: function () {
                        _vm.$nextTick(() => {
                            _vm.$refs.formulaObj.focus();
                        })
                    }
                });

                return false;
            }

            if (string.indexOf('=') == -1) {
                _vm.$Modal.error({
                    title: '提示',
                    content: '语法错误，要求有' + '\'' + '=' + '\'.',
                    onOk: function () {
                        _vm.$nextTick(() => {
                            _vm.$refs.formulaObj.focus();
                        })
                    }
                });

                return false;
            }

            if (string.indexOf('=') != string.lastIndexOf('=')) {
                _vm.$Modal.error({
                    title: '提示',
                    content: '语法错误，一个公式中，不能有多个' + '\'' + '=' + '\'.',
                    onOk: function () {
                        _vm.$nextTick(() => {
                            _vm.$refs.formulaObj.focus();
                        })
                    }
                })

                return false;
            }

            if (string.indexOf('+') != -1) {
                if (string.indexOf('=') > string.indexOf('+')) {
                    _vm.$Modal.error({
                        title: '提示',
                        content: '语法错误，' + '\'' + '=' + '\'' + '应该在' + '\'' + '+' + '\'之前.',
                        onOk: function () {
                            _vm.$nextTick(() => {
                                _vm.$refs.formulaObj.focus();
                            })
                        }
                    });

                    return false;
                }
            }

            if (string.indexOf('-') != -1) {
                if (string.indexOf('=') > string.indexOf('-')) {
                    _vm.$Modal.error({
                        title: '提示',
                        content: '语法错误，' + '\'' + '=' + '\'' + '应该在' + '\'' + '-' + '\'之前.',
                        onOk: function () {
                            _vm.$nextTick(() => {
                                _vm.$refs.formulaObj.focus();
                            })
                        }
                    });

                    return false;
                }
            }

            if (string.indexOf('*') != -1) {
                if (string.indexOf('=') > string.indexOf('*')) {
                    _vm.$Modal.error({
                        title: '提示',
                        content: '语法错误，' + '\'' + '=' + '\'' + '应该在' + '\'' + '*' + '\'之前.',
                        onOk: function () {
                            _vm.$nextTick(() => {
                                _vm.$refs.formulaObj.focus();
                            })
                        }
                    });

                    return false;
                }
            }

            if (string.indexOf('/') != -1) {
                if (string.indexOf('=') > string.indexOf('/')) {
                    _vm.$Modal.error({
                        title: '提示',
                        content: '语法错误，' + '\'' + '=' + '\'' + '应该在' + '\'' + '/' + '\'之前.',
                        onOk: function () {
                            _vm.$nextTick(() => {
                                _vm.$refs.formulaObj.focus();
                            })
                        }
                    });

                    return false;
                }
            }

            if (string.indexOf('(') != -1) {
                if (string.indexOf('=') > string.indexOf('(')) {
                    _vm.$Modal.error({
                        title: '提示',
                        content: '语法错误，' + '\'' + '=' + '\'' + '应该在' + '\'' + '(' + '\'之前.',
                        onOk: function () {
                            _vm.$nextTick(() => {
                                _vm.$refs.formulaObj.focus();
                            })
                        }
                    });

                    return false;
                }
            }

            if (string.indexOf(')') != -1) {
                if (string.indexOf('=') > string.indexOf(')')) {
                    _vm.$Modal.error({
                        title: '提示',
                        content: '语法错误，' + '\'' + '=' + '\'' + '应该在' + '\'' + ')' + '\'之前.',
                        onOk: function () {
                            _vm.$nextTick(() => {
                                _vm.$refs.formulaObj.focus();
                            })
                        }
                    });

                    return false;
                }
            }

            if (string.lastIndexOf('+') == string.length - 1) {
                _vm.$Modal.error({
                    title: '提示',
                    content: '语法错误，最后一个字符不能是' + '\'' + '+' + '\'.',
                    onOk: function () {
                        _vm.$nextTick(() => {
                            _vm.$refs.formulaObj.focus();
                        })
                    }
                });

                return false;
            }

            if (string.lastIndexOf('-') == string.length - 1) {
                _vm.$Modal.error({
                    title: '提示',
                    content: '语法错误，最后一个字符不能是' + '\'' + '-' + '\'.',
                    onOk: function () {
                        _vm.$nextTick(() => {
                            _vm.$refs.formulaObj.focus();
                        })
                    }
                });

                return false;
            }

            if (string.lastIndexOf('*') == string.length - 1) {
                _vm.$Modal.error({
                    title: '提示',
                    content: '语法错误，最后一个字符不能是' + '\'' + '*' + '\'.',
                    onOk: function () {
                        _vm.$nextTick(() => {
                            _vm.$refs.formulaObj.focus();
                        })
                    }
                });

                return false;
            }

            if (string.lastIndexOf('/') == string.length - 1) {
                _vm.$Modal.error({
                    title: '提示',
                    content: '语法错误，最后一个字符不能是' + '\'' + '/' + '\'.',
                    onOk: function () {
                        _vm.$nextTick(() => {
                            _vm.$refs.formulaObj.focus();
                        })
                    }
                });

                return false;
            }

            if (string.lastIndexOf('(') == string.length - 1) {
                _vm.$Modal.error({
                    title: '提示',
                    content: '语法错误，最后一个字符不能是' + '\'' + '(' + '\'.',
                    onOk: function () {
                        _vm.$nextTick(() => {
                            _vm.$refs.formulaObj.focus();
                        })
                    }
                });

                return false;
            }

            if (string.lastIndexOf('=') == string.length - 1) {
                _vm.$Modal.error({
                    title: '提示',
                    content: '语法错误，最后一个字符不能是' + '\'' + '=' + '\'.',
                    onOk: function () {
                        _vm.$nextTick(() => {
                            _vm.$refs.formulaObj.focus();
                        })
                    }
                });

                return false;
            }

            // 错误情况，运算符连续
            if (/[\+\-\*\/\;\=]{2,}/.test(string)) {
                _vm.$Modal.error({
                    title: '提示',
                    content: '语法错误，运算符不能连续',
                    onOk: function () {
                        _vm.$nextTick(() => {
                            _vm.$refs.formulaObj.focus();
                        })
                    }
                });

                return false;
            }

            // 空括号
            if (/\(\)/.test(string)) {
                _vm.$Modal.error({
                    title: '提示',
                    content: '语法错误，不能存在空括号',
                    onOk: function () {
                        _vm.$nextTick(() => {
                            _vm.$refs.formulaObj.focus();
                        })
                    }
                });

                return false;
            }

            // 错误情况，括号不配对
            var stack = [];

            for (var i = 0, item; i < string.length; i++) {
                item = string.charAt(i);

                if ('(' === item) {
                    stack.push('(');
                } else if (')' === item) {
                    if (stack.length > 0) {
                        stack.pop();
                    } else {
                        _vm.$Modal.error({
                            title: '提示',
                            content: '语法错误，括号不配对',
                            onOk: function () {
                                _vm.$nextTick(() => {
                                    _vm.$refs.formulaObj.focus();
                                })
                            }
                        });

                        return false;
                    }
                }
            }

            if (0 !== stack.length) {
                _vm.$Modal.error({
                    title: '提示',
                    content: '语法错误，括号不配对',
                    onOk: function () {
                        _vm.$nextTick(() => {
                            _vm.$refs.formulaObj.focus();
                        })
                    }
                });

                return false;
            }

            // 错误情况，(后面是运算符
            if (/\([\+\-\*\/]/.test(string)) {
                _vm.$Modal.error({
                    title: '提示',
                    content: '语法错误，(后面不能是运算符',
                    onOk: function () {
                        _vm.$nextTick(() => {
                            _vm.$refs.formulaObj.focus();
                        })
                    }
                });

                return false;
            }

            // 错误情况，)前面是运算符
            if (/[\+\-\*\/]\)/.test(string)) {
                _vm.$Modal.error({
                    title: '提示',
                    content: '语法错误，)前面不能是运算符',
                    onOk: function () {
                        _vm.$nextTick(() => {
                            _vm.$refs.formulaObj.focus();
                        })
                    }
                });

                return false;
            }

            // 错误情况，(前面不是运算符
            if (/[^\+\-\*\/]\(/.test(string)) {
                _vm.$Modal.error({
                    title: '提示',
                    content: '语法错误，(前面不是运算符',
                    onOk: function () {
                        _vm.$nextTick(() => {
                            _vm.$refs.formulaObj.focus();
                        })
                    }
                });

                return false;
            }

            // 错误情况，)后面不是运算符
            if (/\)[^\+\-\*\/]/.test(string)) {
                _vm.$Modal.error({
                    title: '提示',
                    content: '语法错误，)后面不是运算符',
                    onOk: function () {
                        _vm.$nextTick(() => {
                            _vm.$refs.formulaObj.focus();
                        })
                    }
                });

                return false;
            }

            return true;
        },
        checkFormulaName: function (formulaName) {
            let _vm = this;
            var isExists = false;

            // 剔除空白符
            formulaName = formulaName.replace(/\s/g, '');

            // 剔除换行符
            formulaName = formulaName.replace(/[\r\n]/g, "");

            if (null != formulaName && formulaName != '' && typeof (formulaName) != "undefined") {
                formulaName = formulaName.replace(new RegExp("\\+", "gm"), ",+,");
                formulaName = formulaName.replace(new RegExp("\\-", "gm"), ",-,");
                formulaName = formulaName.replace(new RegExp("\\*", "gm"), ",*,");
                formulaName = formulaName.replace(new RegExp("\\/", "gm"), ",/,");
                formulaName = formulaName.replace(new RegExp("\\=", "gm"), ",=,");
                formulaName = formulaName.replace(new RegExp("\\(", "gm"), "(,");
                formulaName = formulaName.replace(new RegExp("\\)", "gm"), ",)");
                formulaName = formulaName.replace(new RegExp("\\;", "gm"), ",;,");
                var formulaNameArray = formulaName.split(",");

                if (formulaNameArray != null && formulaNameArray.length > 0) {
                    for (var i = 0; i < formulaNameArray.length; i++) {
                        var formulaNameObj = formulaNameArray[i];
                        isExists = false;

                        if (null != formulaNameObj && formulaNameObj != '' && typeof (formulaNameObj) != "undefined") {
                            if (formulaNameObj != '+' && formulaNameObj != '-'
                                && formulaNameObj != '*' && formulaNameObj != '/'
                                && formulaNameObj != '(' && formulaNameObj != ')'
                                && formulaNameObj != '=' && formulaNameObj != ';') {
                                for (var j = 0; j < _vm.initialItems.length; j++) {
                                    var itemObj = _vm.initialItems[j];

                                    if (null != itemObj && itemObj != '' && typeof (itemObj) != "undefined") {
                                        var itemName = itemObj.itemName;

                                        // 当项目名称不对应时，提示用户项目名称未定义
                                        if (formulaNameObj == itemName) {
                                            isExists = true;
                                        }
                                    }
                                }

                                if (isExists == false) {
                                    _vm.$Modal.error({
                                        title: '提示',
                                        content: '工资项目或变量未定义<' + formulaNameObj + '>',
                                        onOk: function () {
                                            _vm.$nextTick(() => {
                                                _vm.$refs.formulaObj.focus();
                                            })
                                        }
                                    })

                                    return isExists;
                                }
                            }
                        }
                    }
                } else {
                    _vm.$Modal.error({
                        title: '提示',
                        content: '计算方法为空，请设置！',
                        onOk: function () {
                            _vm.$nextTick(() => {
                                _vm.$refs.formulaObj.focus();
                            })
                        }
                    })
                }
            } else {
                _vm.$Modal.error({
                    title: '提示',
                    content: '计算方法为空，请设置！',
                    onOk: function () {
                        _vm.$nextTick(() => {
                            _vm.$refs.formulaObj.focus();
                        })
                    }
                })
            }

            return isExists;
        },
        checkFormula () {
            let _vm = this;

            var formulaName = _vm.formData.currentFormulaItemName;

            // 剔除空白符
            formulaName = formulaName.replace(/\s/g, '');

            // 剔除换行符
            formulaName = formulaName.replace(/[\r\n]/g, "");

            if (formulaName != null) {
                if (formulaName.lastIndexOf(';') != formulaName.length - 1) {
                    _vm.$Modal.error({
                        title: '提示',
                        content: '计算公式最后必须是' + '\'' + ';' + '\'',
                        onOk: function () {
                            _vm.$nextTick(() => {
                                _vm.$refs.formulaObj.focus();
                            })
                        }
                    });

                    return false;
                }

                if (formulaName.indexOf(';;') != - 1) {
                    _vm.$Modal.error({
                        title: '提示',
                        content: '计算公式不能连续出现符号' + '\'' + ';' + '\'',
                        onOk: function () {
                            _vm.$nextTick(() => {
                                _vm.$refs.formulaObj.focus();
                            })
                        }
                    });

                    return false;
                }

                if (formulaName.indexOf('；') != - 1) {
                    _vm.$Modal.error({
                        title: '提示',
                        content: '计算公式符号' + '\'' + ';' + '\'必须是英文',
                        onOk: function () {
                            _vm.$nextTick(() => {
                                _vm.$refs.formulaObj.focus();
                            })
                        }
                    });

                    return false;
                }
            }

            var formulaArray = formulaName.split(';');

            if (null != formulaArray) {
                for (var i = 0; i < formulaArray.length; i++) {
                    var formulaObj = formulaArray[i];

                    if (null != formulaObj && formulaObj != '') {
                        var isFormatFormula = _vm.checkFormulaFormat(formulaObj);

                        if (!isFormatFormula) {
                            return;
                        }

                        var isCorrect = _vm.checkFormulaName(formulaObj);

                        if (!isCorrect) {
                            return;
                        }
                    }
                }
            }

            if (isFormatFormula && isCorrect) {
                _vm.$Modal.success({
                    title: '提示信息',
                    scrollable: true,
                    content: "公式正确!",
                })
            }
        },
        //退出
        cancelFun: function (close) {
            if (close === true) {
                window.parent.closeCurrentTab({ exit: true, openTime: this.openTime });
                return;
            }

            if (this.handlerClose()) {
                window.parent.closeCurrentTab({ exit: true, openTime: this.openTime });
            }
        },
        //刷新
        refreshWageCategory () {
            this.initPage();
        },
    },
    mounted () {
        this.initPage();
        this.openTime = window.parent.params && window.parent.params.openTime;
    },
})