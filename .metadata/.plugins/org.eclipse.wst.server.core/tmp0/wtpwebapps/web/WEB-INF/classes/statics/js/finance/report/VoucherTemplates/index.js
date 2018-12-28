var balance = new Vue({
    el: '#voucherTemplates',
    data () {
        return {
            openTime: '',   //用于控制退出按钮
            objectTypeId: 0,
            leftMenuList: [],
            deleteVisible: false,
            deleteLoading: true,
            currentRowData: {
                "id": 0, "objectType": "", "objectTypeId": 0,
                "templateNumber": "", "templateName": "", "isDefault": 1, "isSystem": 1,
                "voucherWordId": 0, "updateTime": "", "createTime": "",
                "createName": "", "createId": 0, "updateName": "", "updateId": 0
            },
            columnsDataList: [
                { title: '模板编号', key: 'templateNumber' },
                { title: '模板名称', key: 'templateName' },
                {
                    title: '更新时间', key: 'createTime', width: 180,
                    render: (h, params) => {
                        return h('div', (new Date(params.row.createTime)).format("yyyy-MM-dd"))
                    }
                },
                { title: '制单人', key: 'createName' },
                {
                    title: '默认',
                    key: 'isDefault',
                    render: (h, params) => {
                        return h('div', params.row.isDefault === 1 ? '否' : '是')
                    }
                },
                {
                    title: '系统', key: 'isSystem',
                    render: (h, params) => {
                        return h('div', params.row.isSystem === 1 ? '否' : '是')
                    }
                },
            ],
            dataList: [],
            operate:{"voucherWord":"","voucherWordId": 0},
            editTitle: '凭证模板',
            editVisable: false,
            detailCurrentSelectRow: -1,
            operates: [],
            formData: {
                "id": 0, "objectType": "", "objectTypeId": 0,
                "templateNumber": "", "templateName": "", "isDefault": 1, "isSystem": 1,
                "voucherWordId": 0, "updateTime": "", "createTime": "",
                "createName": "", "createId": 0, "updateName": "", "updateId": 0,"voucherWord":""
            },
            initlFormData: {
                "id": 0, "objectType": "", "objectTypeId": 0,
                "templateNumber": "", "templateName": "", "isDefault": 1, "isSystem": 1,
                "voucherWordId": 0, "updateTime": "", "createTime": "",
                "createName": "", "createId": 0, "updateName": "", "updateId": 0,"voucherWord":""
            },
            detailDataList: [],
            subjectSourceList: [],
            moneySourceList: [],
            lendingDirectionList: [],
            showRemarkVisable: false,
            showRemarkCurData: {},
            showRemarkCurDataIdx: -1,
            remarkList: ['[摘要]', '[单据号]', '[客户]', '[日期]', '[部门]', '[业务员]'],
            remarkTxt: '',
            subjectVisable: false

        }
    },
    filters: {
        filterLendingDirection (value) {
            switch (value) {
                case 1:
                    return '借';
                case 2:
                    return '贷';
                default:
                    break;
            }
        }
    },
    created: function () {
        this._ajaxGetData();


    },
    mounted: function () {
        this.openTime = window.parent.params && window.parent.params.openTime;
    },
    watch: {

    },
    methods: {
        // 查询table list值
        _queryTypeId: function (type) {
            var that = this;
            var _url = baseURL + 'VoucherTemplate/queryObjectType';
            let _formData = new FormData();
            _formData.append("objectTypeId", type);
            http.post(_url, _formData).then((json) => {

                if (json.code === '100100') {
                    that.dataList = json.data;
                    var _info = Object.assign({}, that.initlFormData);
                    that.currentRowData = _info;
                }else {
                }
            }, (json) => {
                //TODO 处理请求fail
            })
            // $.ajax({
            //     type: 'post',
            //     async: true,
            //     data: { "objectTypeId": 1 },
            //     url: _url,
            //     dataType: 'json',
            //     success: function (d) {
            //         var _txt = '';
            //         if (d.code === '100100') {
            //             _txt = d.msg;
            //         } else {
            //             _txt = d.msg;
            //         }
            //         that.$Message.info({
            //             content: _txt,
            //             duration: 3
            //         });
            //     }
            // })
        },
        //点击保存
        _save: function () {
            // console.log(item,"");//item为模板信息和模板详情的数据 模板对象和模板详情的集合
            var that = this;
            var _url = baseURL + 'VoucherTemplate/save';

            let _find = that.leftMenuList.find(row => {
                return row.id == that.objectTypeId;
            })

            that.formData.objectTypeId = that.objectTypeId;
            that.formData.objectType = _find.objectType;
            var parame = JSON.stringify({ "CTDEList": that.detailDataList, "voucherTemplateEntity": that.formData });

            // let _formData = new FormData();
            // _formData.append("CTDEList", that.detailDataList);
            // _formData.append("voucherTemplateEntity", that.formData);
            http.post(_url, parame).then((json) => {
                var _txt = '';
                if (json.code === '100100') {
                    _txt = json.msg;
                    that.editClose();
                    // that._queryTypeId(that.objectTypeId);
                } else {
                    _txt = json.msg;
                }
                that.$Message.info({
                    content: _txt,
                    duration: 3
                });

            }, (json) => { })
            // $.ajax({
            //     type: 'post',
            //     async: true,
            //     data: parame,//点击的模板的id
            //     url: _url,
            //     dataType: 'json',
            //     contentType: 'application/json;charset=utf-8',
            //     success: function (d) {
            //         var _txt = '';
            //         if (d.code === '100100') {
            //             _txt = d.msg;
            //         } else {
            //             _txt = d.msg;
            //         }
            //         that.$Message.info({
            //             content: _txt,
            //             duration: 3
            //         });
            //     }
            // })
        },
        //删除指定模板 deleteById
        _deleteById: function (item) {
            var that = this;
            var _url = baseURL + 'VoucherTemplate/deleteById';

            $.ajax({
                type: 'post',
                async: true,
                data: { 'id': item },//点击的模板的id
                url: _url,
                dataType: 'json',
                success: function (d) {
                    var _txt = '';
                    if (d.code === '100100') {
                        _txt = d.msg;
                    } else {
                        _txt = d.msg;
                    }
                    that.$Message.info({
                        content: _txt,
                        duration: 3
                    });
                }
            })
        },
        _queryId: function (item) {
            console.log(item, "_queryId的值为");
            var that = this;
            var _url = baseURL + 'VoucherTemplate/query';
            let _formData = new FormData();
            _formData.append("id", item.id);
            http.post(_url, _formData).then((json) => {
                if (json.code === '100100') {
                    that.editVisable = true;
                    that.detailDataList = json.data.cTDEList;
                    that._getFormData(json.data.voucherTemplateEntity);
                } else {
                    that.$Message.info({
                        content: json.msg,
                        duration: 3
                    });
                }

            }, (json) => {
                //TODO 处理请求fail
            })
            // $.ajax({
            //     type: 'post',
            //     async: true,
            //     data: { "id": 1 },//点击的模板的id
            //     url: _url,
            //     dataType: 'json',
            //     success: function (d) {
            //         if (d.code === '100100') {
            //             that.editVisable = true;
            //             that._getFormData(item);
            //         } else {
            //             that.$Message.info({
            //                 content: d.msg,
            //                 duration: 3
            //             });
            //         }

            //     }
            // })
        },
        //刷新
        renovate(){
            this._queryTypeId(this.objectTypeId);
        },
        quit: function () {
            //关闭当前页签
            var name = '凭证模版';
            window.parent.closeCurrentTab({ 'name': name, 'openTime': this.openTime, 'url': this.openTime, exit: true })
        },
        //_default 设置默认模板
        _default: function () {
            var that = this;
            var _url = baseURL + 'VoucherTemplate/setDefault';
            let _formData = new FormData();
            _formData.append("id", that.currentRowData.id);
            _formData.append("objectTypeId", that.objectTypeId);
            http.post(_url, _formData).then((json) => {
                var _txt = '';
                if (json.code === '100100') {
                    _txt = json.msg;
                    that._queryTypeId(that.objectTypeId);
                } else {
                    _txt = json.msg;
                }
                that.$Message.info({
                    content: _txt,
                    duration: 3
                });
            }, (json) => {
                //TODO 处理请求fail
            })

            // $.ajax({
            //     type: 'post',
            //     async: true,
            //     data: { "id": that.currentRowData.id, "objectTypeId": that.objectTypeId },//点击的模板的id ，事物类型id
            //     url: _url,
            //     dataType: 'json',
            //     success: function (d) {
            //         var _txt = '';
            //         if (d.code === '100100') {
            //             _txt = d.msg;
            //         } else {
            //             _txt = d.msg;
            //         }
            //         that.$Message.info({
            //             content: _txt,
            //             duration: 3
            //         });
            //     }
            // })
        },

        _ajaxGetData: function () { // 查询初始事物类型
            var that = this;
            var _url = baseURL + 'voucherMenu/getCategorys';
            http.post(_url, '').then((json) => {
                console.log(json, '==请求success');
                that.leftMenuList = json.data;
                that.objectTypeId = json.data[0].id || 1;
                that.$nextTick(function () {
                    that.$refs.leftMenu.updateActiveName();
                })
                that.menuChange(that.objectTypeId);
            }, (json) => {
                //TODO 处理请求fail
            })
        },
        _ajaxGetInitSelectData: function (type) {   // 获取下拉初始值
            var that = this;
            var _url = baseURL + 'voucherMenu/queryVoucherMenuById';
            let _formData = new FormData();
            _formData.append("id", type);
            http.post(_url, _formData).then((json) => {
                if (json.code === '100100') {
                    that.subjectSourceList = json.data.subjectSource;
                    that.moneySourceList = json.data.moneySource;
                    that.lendingDirectionList = json.data.lendingDirection;
                    that.operates = json.data.voucherWord;
                }
            }, (json) => {
                //TODO 处理请求fail
                console.log(json, '==处理请求fail');
            })

        },
        actionBtnMth: function (type) {
            var that = this;
            if (type === 'addNew') {
                this.editVisable = true;
                var _info = Object.assign({}, that.initlFormData);
                this.detailDataList = [];
                this._getFormData(_info);
            } else if (type === 'delete') {
                that.deleteVisible = true;
            } else if (type === 'edit') {
                this.editVisable = true;
                this._getFormData(this.currentRowData);
            } else if (type === 'default') {
                this._default();
            }
        },
        deleteOK () {
            var that = this;
            var _url = baseURL + 'VoucherTemplate/deleteById';
            let _formData = new FormData();
            _formData.append("id", this.currentRowData.id);
            http.post(_url, _formData).then((json) => {
                var _txt = '';
                if (json.code === '100100') {
                    // that.dataList = that.dataList.filter(function (item) {
                    //     return item.id !== that.currentRowData.id;
                    // });
                    that._queryTypeId(that.objectTypeId);
                    var _info = Object.assign({}, that.initlFormData);
                    that.currentRowData = _info;
                }
                _txt = json.msg;
                that.$Message.info({
                    content: _txt,
                    duration: 3
                });
                that.deleteVisible = false;
            }, (json) => {
                //TODO 处理请求fail
                that.deleteVisible = false;
            })


        },
        menuChange: function (type) {
            this.objectTypeId = type;
            // 根据事物类型id  查select 的初始值
            this._queryTypeId(type);
            this._ajaxGetInitSelectData(type);
        },
        tableDblclick: function (item) {
            this._queryId(item);

        },
        _getFormData (item) {
            // 模拟接口返回数据
            this.formData = item;
        },
        tableCurChange: function (currentRow, oldCurrentRow) {
            console.log(currentRow, oldCurrentRow);
            this.currentRowData = currentRow;
        },
        editClose () {
            this.renovate();
            this.editVisable = false;
        },
        detailClickTr (item, idx) {
            this.detailCurrentSelectRow = idx;
        },
        detailActionBtnMth (type, val) {
            var that = this;
            if (type === 'addRow') {
                if (that.detailDataList.length >= 3) return;
                var _info = {
                    'voucherTemplateId': 0,
                    'subjectSource': 0,
                    'subject': '',
                    voucherWord: '',
                    voucherWordId:0,
                    'subjectCode': '',
                    'subjectId': 0,
                    'lendingDirection': 0,
                    'sourceOfAmount': 0,
                    'remark': ''
                };

                // "id":0, //主键
                // "voucherTemplateId": 1529558224150, //凭证模板id
                // "subjectSource": 2, //科目来源
                // "subject": "", //科目
                // "subjectCode": "",//科目编码
                // "subjectId": 0,//科目id
                // "lendingDirection": 1,//借贷方向
                // "sourceOfAmount": 3,//金额来源
                // "remark": "[单据号]" //摘要
                that.detailDataList.push(_info);
            } else if (type === 'save') {
                console.log(that.detailDataList, that.formData, '==that.detailDataList');
                console.log(that.operates, "that.operates");
                if(that.formData.voucherWordId){
                that.operate = that.operates.find(x => x.voucherWordId == that.formData.voucherWordId);
                that.formData.voucherWord = that.operate.voucherWord;
                }
                var _bool = false, _msg = '请填写必填项。';
                if (!that.formData.templateNumber || !that.formData.templateName || !that.formData.voucherWordId) {
                    _bool = true;
                }


                if (that.detailDataList.length > 1) {
                    var _lendingDirection1 = false, _lendingDirection2 = false, _remark = false;
                    that.detailDataList.forEach(function (item) {
                        item.subjectSource === 0 && (_bool = true, _msg = '请选择科目来源。')
                        item.subject === '' && item.subjectSource === 1 && (_bool = true, _msg = '请选择科目。')
                        item.lendingDirection === 0 && (_bool = true)
                        item.sourceOfAmount === 0 && (_bool = true, _msg = '请选择金额来源。')
                        item.remark === '' && (_bool = true, _msg = '请填写摘要。')

                        item.lendingDirection === 1 && (_lendingDirection1 = true)
                        item.lendingDirection === 2 && (_lendingDirection2 = true)
                        !item.remark && (_remark = true)
                    });
                    if (!_lendingDirection1 || !_lendingDirection2) {
                        _bool = true;
                        _msg = '凭证模板借贷不平衡。';
                    }
                } else {
                    _bool = true;
                    _msg = '模板分录数据不能少于2条。';
                }

                if (_bool) {
                    that.$Message.info({
                        content: _msg,
                        duration: 3
                    });
                    return;
                }
                // 执行保存接口
                this._save();
            } else if (type === 'delete') {
                that.detailDataList = this.detailDataList.filter(function (item, idx) {
                    return idx !== that.detailCurrentSelectRow;
                });
                that.detailCurrentSelectRow = -1;
            } else if (type === 'changeNo') {
                var _url = baseURL + 'VoucherTemplate/changeNo';
                var parame = JSON.stringify({ "id": that.formData.id, "action": val });

                http.post(_url, parame).then((json) => {
                    var _txt = '';
                    if (json.code === '100100') {
                        _txt = json.msg;
                    } else {
                        _txt = json.msg;
                    }
                    that.$Message.info({
                        content: _txt,
                        duration: 3
                    });

                }, (json) => { })
            } else if (type === 'subjectVisable') {

                that.detailDataList[that.detailCurrentSelectRow].subjectSource === 1 && (that.subjectVisable = true)
            }
        },
        showRemark (item, idx) {
            console.log(item, '==showRemark');
            this.remarkTxt = item.remark || '';
            this.showRemarkCurData = item;
            this.showRemarkCurDataIdx = idx;
            this.showRemarkVisable = true;
        },
        remarkLiClick (item) {
            this.remarkTxt = this.remarkTxt + '' + item;
        },
        okRemarkVisable () {
            var that = this;
            that.detailDataList = that.detailDataList.filter(function (item, idx) {
                idx === that.showRemarkCurDataIdx && (item.remark = that.remarkTxt)
                return item;
            });
            this.cloaseRemarkVisable();
        },
        cloaseRemarkVisable () {
            this.showRemarkVisable = false
        },
        // 科目下拉框
        subjectClose () {
            this.subjectVisable = false;
        },
        subjectData (treeNode) {
            console.log(treeNode, '====treeNode');
            //vm.row.subjectLabel = treeNode.subjectName;
            var that = this;
            that.detailDataList[that.detailCurrentSelectRow].subject = treeNode.subjectName;
            that.detailDataList[that.detailCurrentSelectRow].subjectId = treeNode.id;
            that.detailDataList[that.detailCurrentSelectRow].subjectcode = treeNode.subjectCode;
            // vm.row.subjectValue = treeNode.subjectCode.replace(/\./g, '');
            // vm.row.subject = vm.row.subjectValue + ' ' + vm.row.subjectLabel;	
        }
    },
    computed: {
        deatilListDeleteRow () {
            return (this.detailCurrentSelectRow === -1 || this.formData.isSystem === 2);
        },
        deleteRow () {
            return (this.currentRowData.id === 0);
        },
        objectTypeIdComputed () {
            var that = this;
            let find = this.leftMenuList.find(row => {
                return row.id == that.objectTypeId;
            })
            if (find) {
                return find.objectType || '';
            } else {
                return '';
            }

        },
        isDefaultComputed () {
            return (this.formData.isSystem === 2);
        },

    }
})
