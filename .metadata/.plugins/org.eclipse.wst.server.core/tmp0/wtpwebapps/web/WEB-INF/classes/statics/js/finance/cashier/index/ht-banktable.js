Vue.component('ht-banktable', {
    data () {
        return {
            isModalOpen: this.recmodal,
            abstractList: this.remarkList,
            isHave: '',
            remarkContent: '',
            columns1: [
                {
                    title: '银行账号',
                    key: 'bankId',
                    ellipsis: true
                },
                {
                    title: '名字',
                    key: 'bankName',
                    ellipsis: true
                }
            ],
        }
    },
    methods: {
        // 录入银行
        addRemark () {
            // 判断录入的银行是否为空
            let that = this;
            let reg = /(^\s*$)/
            let rs = reg.test(this.remarkContent)
            if (rs) {
                this.$Message.error({
                    content: '请输入银行内容',
                    duration: 5
                })
                return;
            }
            // 判断录入的银行是否存在
            for (let item of this.remarkList) {
                if (this.remarkContent.trim() === item.content) {
                    this.$Message.error({
                        content: '保存失败,银行已存在，请重新设置银行！',
                        duration: 5
                    })
                    return;
                }
            }
            // 保存时判断新增或编辑
            let param;
            let url = '';
            if (that.isHave === '') {
                url = contextPath + '/voucherExpController/save';
                param = { 'content': this.remarkContent };
            } else {
                url = contextPath + '/voucherExpController/update';
                param = { 'id': that.remarkList[that.isHave].id, 'content': this.remarkContent };
            }
            $.ajax({
                type: 'POST',
                url: url,
                data: JSON.stringify(param),
                contentType: 'application/json;charset=utf-8',
                dataType: 'json',
                success: function (result) {
                    console.log(result)
                    if (result.data) {
                        if (that.isHave === '') {
                            that.remarkList.unshift({ content: that.remarkContent })
                        } else {
                            var remarkParent = that.remarkList[that.isHave];
                            if (remarkParent) {
                                that.remarkList[that.isHave].content = that.remarkContent;
                                that.remarkList[that.isHave].id = 0;
                            }
                            that.isHave = ''
                        }

                        that.$Message.success({
                            content: '保存成功',
                            duration: 5
                        })
                    }
                }
            });
        },
        cancleRemark () {
            this.closeModal();
        },

        // 控制父组件属性
        closeModal () {
            this.isModalOpen = false;
        },
        dblClickRow (rowData, index) {
            this.$emit('on-row-dblclick', rowData);
        }
    },
    watch: {
        recmodal (val) {
            this.isModalOpen = val;
        },
        remarkList (val) {
            this.abstractList = val;
        },
        isModalOpen (val) {
            this.$emit('on-modal-change', val);
        },
        abstractList (val) {
            this.$emit('on-list-change', val);
        }
    },
    props: {
        value: {},
        recmodal: {
            default () {
                return false;
            }
        },
        remarkList: {
            default () {
                return [];
            }
        }
    },
    template: `
    <Modal
        title="银行账号"
        v-model="isModalOpen"
        @on-cancel='closeModal'
        :mask-closable="false">
        <p class="remark-title">银行内容：</p>
        <Table 
            border
            stripe
            highlight-row 
            class="clear"
            height="200" 
            size="small"
            :columns="columns1" 
            :data="remarkList"
			@on-row-dblclick="dblClickRow"
			>
        </Table>
        <span slot="footer"></span>
    </Modal>
    `
})