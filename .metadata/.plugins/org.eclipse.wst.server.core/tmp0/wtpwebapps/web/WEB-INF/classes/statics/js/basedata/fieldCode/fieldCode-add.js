let FileCodeVM = new Vue({
    el: "#orderNum",
    data() {
        return {
            //控制显示影藏
            temp: false,
            checkAllGroup: [],
            ruleList: [],
            selectIndex: "",
            documentNo: '',
            addEntity: {
                id: "",
                docName: "",//单据名称
                category: "",//单据分类
                tabName: "",
                tabField: "",
                docEntity: {
                    docName: "",
                    tabName: "",
                    fieldName: ""
                },
                ruleList: ""
            },
            //新增行
            rule: {
                type: "",//类型
                length: "",//长度
                value: "",//格式
                setNum: "",//设置值
                numStart: "",//开始值
                numStop: "",//结束值
                numStep: "",//步长
                splitSymbol: "-",//分隔符
                autoZeroFill: "",//补位符
                temp: 1//显示隐藏
            },
            //类型
            sourceType: [
                {
                    value: 1,
                    label: "常量"
                },
                {
                    value: 2,
                    label: "日期字段"
                },
                {
                    value: 3,
                    label: "流水号"
                }
            ],
            //格式
            dateType: [
                {
                    value: "yyyy/mm/dd",
                    label: "yyyy/mm/dd"
                },
                {
                    value: "mm/dd/yy",
                    label: "mm/dd/yy"
                },
                {
                    value: "yy/mm/dd",
                    label: "yy/mm/dd"
                },
                {
                    value: "yyyy-mm-dd",
                    label: "yyyy-mm-dd"
                },
                {
                    value: "mm-dd-yy",
                    label: "mm-dd-yy"
                },
                {
                    value: "yyyymmdd",
                    label: "yyyymmdd"
                },
                {
                    value: "yyyyMMdd",
                    label: "yyyyMMdd"
                }
            ],
            docListData: [],
            docCategory: [],
            pageHandleType: ''
        }
    },
    methods: {
        delNum(item, type, floor) {
            return htInputNumber(item, type, floor)
        },
        actStart(index) {
            let obj = this.ruleList[index];
            //判断开始 步长
            if (Number(obj.numStart) > Number(obj.numStop)) {
                this.$Modal.info({
                    content: "开始值不能大于结束值"
                })
                this.ruleList[index].numStart = ""
                return;
            }
        },
        actStep(index) {
            let obj = this.ruleList[index];
            //判断开始 步长
            if (Number(obj.numStep) > Number(obj.numStop)) {
                this.$Modal.info({
                    content: "步长不能大于结束值"
                });
                this.ruleList[index].numStep = ""
                return;
            }
            if (Number(obj.numStep) > 9) {
                this.$Modal.info({
                    content: "步长不能大于9"
                });
                this.ruleList[index].numStep = ""
                return;
            }
        },
        actStop(index) {
            let obj = this.ruleList[index];
            //判断开始 步长
            if (Number(obj.numStop) > 9999999999) {
                this.$Modal.info({
                    content: "结束值不能过长，请保持在11位下"
                });
                this.ruleList[index].numStop = ""
                return;
            }
        },
        addRow() {
            let info = Object.assign({}, this.rule);
            this.ruleList.push(info);
        },
        //选取类型
        changeEmp(index) {
            //找到对应行数据
            let rowVal = Object.assign({}, this.ruleList[index]);
            //将数据清空
            this.ruleList[index].length = "";
            this.ruleList[index].type = "";
            this.ruleList[index].numStart = "";
            this.ruleList[index].numStop = "";
            this.ruleList[index].numStep = "";
            this.ruleList[index].splitSymbol = "";
            this.ruleList[index].autoZeroFill = "";
            this.ruleList[index].value = "";
            //判断选取类型
            if (rowVal.type == "1") {
                //常量 长度 格式锁死
                this.ruleList[index].type = 1;
            } else if (rowVal.type == "2") {
                //日期 长度 设置值锁死
                this.ruleList[index].type = 2;
            } else if (rowVal.type == "3") {
                //日期 长度 设置值锁死
                this.ruleList[index].type = 3;
                this.ruleList[index].autoZeroFill = 1;
            }
        },
        //设置值
        numInput(index) {
            //找到对应行数据
            if (this.ruleList[index].type === '1') {
                let rowVal = this.ruleList[index];
                let len = rowVal.value.length;
                //赋值长度
                this.ruleList[index].length = len;
            } else if (this.ruleList[index].type === '3') {
                let rowVal = this.ruleList[index];
                let len = rowVal.numStart.length;
                //赋值长度
                this.ruleList[index].length = len;
            }

        },
        //只保留字母
        clearNum(index) {
            let obj = this.ruleList[index]
            obj.value = obj.value.toString().replace(/[^a-zA-Z]/g, "");  //清除字母以外的字符
            this.ruleList[index].value = obj.value

        },
        //只允许数字
        clearInput(index) {
            let obj = this.ruleList[index]
            obj.length = obj.length.toString().replace(/[^\d]/g, "");  //清除数字以外的字符
            this.ruleList[index].length = obj.length
        },
        //选中日期格式
        changeDate(index) {
            //找到对应行数据
            let rowVal = this.ruleList[index];
            let len = rowVal.value;
            //设置长度
            let numLen = ""
            //获取到长度
            this.dateType.map((item) => {
                if (item.value == len) {
                    numLen = item.label.length
                }
            });
            this.ruleList[index].length = numLen;
        },
        //保存
        saveInfo() {
            if (!this.checkRuleList()) {
                return;
            }
            var docEntity = null;
            if (this.pageHandleType === 'add') {
                docEntity = this.addEntity.docEntity.docName;
            } else {
                docEntity = this.addEntity.docEntity;
            }
            this.addEntity.docName = docEntity.docName;
            this.addEntity.tabName = docEntity.tabName;
            this.addEntity.tabField = docEntity.fieldName;
            this.addEntity.ruleList = this.ruleList;
            var id = this.addEntity.id;
            if ($.isEmptyObject(String(id))) {
                this.saveRequest(this.addEntity);
            } else {
                this.updateRequest(this.addEntity);
            }
        },
        //保存规则
        saveRequest(param) {
            $.ajax({
                type: 'post',
                url: contextPath + '/docAutoFieldCode/save',
                contentType: 'application/json',
                data: JSON.stringify(param),
                dataType: "json",
                success: function (res) {
                    if (res.code === "100100") {
                        FileCodeVM.$Modal.info({
                            title: "提示",
                            okText: "确定",
                            content: "操作成功!",
                            onOk: function () {

                            }
                        });
                        FileCodeVM.pageHandleType = 'update';
                    } else {
                        FileCodeVM.$Modal.warning({
                            title: "提示",
                            okText: "确定",
                            content: res.msg,
                            onOk: function () {

                            }
                        });
                    }
                }
            });
        },
        //修改
        updateRequest(param) {
            $.ajax({
                type: 'post',
                url: contextPath + '/docAutoFieldCode/update',
                contentType: 'application/json',
                data: JSON.stringify(param),
                dataType: "json",
                success: function (res) {
                    console.log(res)
                    if (res.code === "100100") {
                        FileCodeVM.$Modal.info({
                            title: "提示",
                            okText: "确定",
                            content: "操作成功!",
                            onOk: function () {

                            }
                        });
                    } else {
                        FileCodeVM.$Modal.warning({
                            title: "提示",
                            okText: "确定",
                            content: res.msg,
                            onOk: function () {

                            }
                        });
                    }
                }
            });
        },
        checkRuleList() {
            var ruleList = this.ruleList;
            if (ruleList != null && ruleList != undefined && ruleList.length > 0) {
                var concanst = 0;
                var dateRule = 0;
                var numRule = 0;
                for (var i = 0; i < ruleList.length; i++) {
                    var ruleEntity = ruleList[i];
                    if (ruleEntity.type === 1) {
                        concanst = concanst + 1;
                    }
                    if (ruleEntity.type === 2) {
                        dateRule = dateRule + 1;
                    }
                    if (ruleEntity.type === 3) {
                        numRule = numRule + 1;
                    }
                }
                if (concanst > 1) {
                    this.messageTip("warn", "只能定义一个常量规则");
                    return false;
                }
                if (dateRule > 1) {
                    this.messageTip("warn", "只能定义一个日期规则");
                    return false;
                }
                if (numRule > 1) {
                    this.messageTip("warn", "只能定义一个流水号规则");
                    return false;
                }
                if (concanst == 0 && numRule == 0 && dateRule == 0) {
                    this.messageTip("warn", "请添加编码规则信息");
                    return false;
                }
                if (concanst == 1 && dateRule == 0 && numRule == 0) {
                    this.messageTip("warn", "只有常量规则无法保证单据编码唯一,请定义日期、流水号规则");
                    return false;
                }
                if (concanst == 0 && numRule == 0 && dateRule == 1) {
                    this.messageTip("warn", "只有日期规则无法保证单据编码唯一,请定义常量、流水号规则");
                    return false;
                }
                if (concanst == 1 && dateRule == 1 && numRule == 0) {
                    this.messageTip("warn", "只有常量、日期规则无法保证单据编码唯一,请定义流水号规则");
                    return false;
                }
                return true;
            } else {
                this.messageTip("warn", "请添加编码规则信息");
                return false;
            }
        },
        messageTip(type, message) {
            if (type == 'warn') {
                FileCodeVM.$Modal.warning({
                    title: "提示",
                    okText: "确定",
                    content: message,
                    onOk: function () {

                    }
                });
            } else {
                FileCodeVM.$Modal.info({
                    title: "提示",
                    okText: "确定",
                    content: message,
                    onOk: function () {

                    }
                });
            }
        },
        //长度
        lenInput(index) {
            //判断值为0的时候
            //找到对应行数据
            let rowVal = this.ruleList[index];
            let lenNum = rowVal.length;
            if (lenNum < 1) {
                this.$Modal.info({
                    content: "请输入大于0的数"
                });
                this.ruleList[index].length = "";
                return;
            }
            if (rowVal.type == 3) {
                if (Number(lenNum) > 10) {
                    this.$Modal.info({
                        content: "流水号长度不能大于10,系统已自动处理为最大长度10"
                    });
                    this.ruleList[index].length = "10";
                    return;
                }
            }
            //赋值长度
            //取出最大值
            let num = "";
            for (var i = 0; i < lenNum; i++) {
                num += "9"
            }
            this.ruleList[index].numStop = num;
            this.ruleList[index].numStart = 1;
            this.ruleList[index].numStep = 1;


        },
        //获取内置单据
        getSysDocumentData() {
            $.ajax({
                type: "POST",
                url: contextPath + "/sysDocument/list",
                contentType: 'application/json',
                dataType: "json",
                success: function (res) {
                    if (res.code === '100100') {
                        FileCodeVM.docListData = res.data;
                    }
                }
            });
        },
        //获取单据分类字典数据
        getDocCategoryData() {
            this.docCategory = layui.data('dict')._document_sort;
            console.log(this.docCategory)
        },
        //获取规则详情
        getFieldCodeEntity(id) {
            $.ajax({
                type: "POST",
                url: contextPath + "/docAutoFieldCode/info/" + id,
                contentType: 'application/json',
                dataType: "json",
                success: function (res) {
                    if (res.code === '100100') {
                        var data = res.data;
                        FileCodeVM.addEntity.id = data.id;
                        FileCodeVM.addEntity.docEntity.docName = data.docName;
                        FileCodeVM.addEntity.docEntity.tabName = data.tabName;
                        FileCodeVM.addEntity.docEntity.fieldName = data.tabField;
                        FileCodeVM.addEntity.category = data.category;
                        FileCodeVM.ruleList = data.ruleList;
                    }
                }
            });
        },
        //获取点击下标
        getIndex(index) {
            if (this.selectedIndex != index || this.selectedIndex === "") {
                this.selectedIndex = index;
                //给相对应的tr添加背景颜色
                $(".tdInfo").eq(this.selectedIndex).addClass("tr-back").siblings().removeClass("tr-back");
            } else {
                //给相对应的tr去除背景颜色
                $(".tdInfo").eq(this.selectedIndex).removeClass("tr-back")
                this.selectedIndex = "";
            }

        },
        //删除行
        del() {
            if (this.selectedIndex === "") {
                this.$Modal.info({
                    content: "请选择需要删除的下标"
                })
            } else {
                //删除
                this.ruleList.splice(this.selectedIndex, 1);
                $(".tdInfo").removeClass("tr-back");
                this.delIndex = '';
            }
        },
        autoZeroFill(num, length) {
            var length = parseInt(length);
            var num = parseInt(num);
            return (Array(length).join(0) + num).slice(-length);
        }
    },
    mounted() {
        this.getSysDocumentData();
        this.getDocCategoryData();
        let param = window.parent.params.params;
        let type = param.type;
        if (type === 'add') {
            this.pageHandleType = 'add';
        }
        if (type === 'update') {
            this.pageHandleType = 'update';
            let id = param.id;
            this.getFieldCodeEntity(id);
        }
        if (type === "view") {
            let id = param.id;
            this.temp = true;
            this.getFieldCodeEntity(id);
        }
    },
    watch: {
        ruleList: {
            handler(oldRuleList, newRuleList) {
                var documentNo = "";
                if (newRuleList != null && newRuleList.length > 0) {
                    for (var i = 0; i < newRuleList.length; i++) {
                        var rule = newRuleList[i];
                        var type = rule.type;
                        var splitSymbol = rule.splitSymbol;
                        if (splitSymbol == null) {
                            splitSymbol = "";
                        }
                        if (type == 1) {
                            var value = rule.value;
                            if (value != null && value != '') {
                                documentNo = documentNo + value + splitSymbol;
                            }
                        }
                        if (type == 2) {
                            var value = rule.value;
                            if (value != null && value != '') {
                                documentNo = documentNo + new Date().format(value) + splitSymbol;
                            }
                        }
                        if (type == 3) {
                            var value = rule.numStart;
                            if (value != null && value != '') {
                                var length = rule.length;
                                value = FileCodeVM.autoZeroFill(value, length);
                                documentNo = documentNo + new Date().format(value);
                            }
                        }
                    }
                }
                FileCodeVM.documentNo = documentNo;
            },
            deep: true
        }
    }
});
