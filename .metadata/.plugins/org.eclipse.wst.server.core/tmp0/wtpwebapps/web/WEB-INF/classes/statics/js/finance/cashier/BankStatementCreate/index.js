var ve = new Vue({
    el: '#bankStatementCreate',
    data () {
        let This = this;
        return {
            openTime: "",
            subjectVisable: false,
            curDate: (new Date()).format("yyyy-MM-dd"),
            formData: {
                'f1': '',
                'f2': '',
                'f3': '',
                'subjectName': '', 'subjectCode': '', 'subjectId': '',
            },
            allShow: false,
            dataList: [],
            organizationList: [
                { 'value': 1, 'label': '金大祥集团' },
                { 'value': 2, 'label': '航天集团' },
                { 'value': 3, 'label': '粮食集团' },
            ],
        }
    },
    methods: {
        // 科目下拉框
        showSubjectVisable () {
            this.subjectVisable = true;
        },
        subjectClose () {
            this.subjectVisable = false;
        },
        subjectData (treeNode) {
            console.log(treeNode, '====treeNode');
            this.formData.subjectId = treeNode.id;
            this.formData.subjectCode = treeNode.subjectCode;
            this.formData.subjectName = treeNode.subjectName;
            this.subjectClose();
        },
        actionBtnMth (_type) {
            var that = this;
            // 插入行 是在 选择 上面插入一条数据， 复制行 是在选择下面 插入一条数据并复制选择的数据值。 插入和复制都是单条，删除为多条

            var _info = {
                show: false,
                id: new Date().getTime(),
                t1: that.dataList.length + 1,
                t2: (new Date()).format("yyyy-MM-dd"),
                t3: new Date().getTime(),
                t4: '',
                t5: '',
                t6: '',
                t7: '',
                t8: '',
            }
            if (_type === 'addNew') {
                that.dataList.push(_info);
                // this.dataList.forEach(item => {
                //     _this.$set(item, 'show', false)
                // })
            } else {
                var _f = that.dataList.filter(row => row.show)
                if (!_f.length) {
                    that.$Message.info({
                        content: '请选择一条数据',
                        duration: 3
                    });
                    return;
                }
                let _i = Object.assign({}, _f[_f.length - 1])
                if (_type === 'import') {
                    if (_f.length > 1) {
                        that.$Message.info({
                            content: '只能选择一条',
                            duration: 3
                        });
                        return;
                    }
                    var _idx = 0;
                    that.dataList.forEach((row, idx) => {
                        row.id === _i.id && (_idx = idx)
                    })

                    that.dataList.splice(_idx, 0, _info);
                } else if (_type === 'copye') {
                    if (_f.length > 1) {
                        that.$Message.info({
                            content: '只能选择一条',
                            duration: 3
                        });
                        return;
                    }

                    var _idx = 0;
                    that.dataList.forEach((row, idx) => {
                        row.id === _i.id && (_idx = idx)
                    })
                    _i.id = new Date().getTime();
                    _i.show = false;
                    that.dataList.splice(_idx + 1, 0, _i);
                } else if (_type === 'delete') {
                    that.dataList = that.dataList.filter(row => !row.show)
                }
            }
        },
        clickTr (_item, _idx) {

        },
        click_all () {
            this.allShow = !this.allShow;
            this.dataList.forEach(row => {
                row.show = this.allShow;
            })
        },
        // 切换本行是否选中
        change_tr (row) {
            row.show = !row.show;
            let count = 0;
            this.dataList.forEach(row => {
                if (row.show) count++;
            })
            if (count === this.dataList.length) {
                this.allShow = true;
            } else {
                this.allShow = false;
            }
        },

    },
    mounted () {
        this.openTime = window.parent.params && window.parent.params.openTime;
    },
})