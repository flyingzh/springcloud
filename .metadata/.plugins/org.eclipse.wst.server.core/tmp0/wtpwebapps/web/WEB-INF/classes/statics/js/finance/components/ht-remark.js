Vue.component('ht-remark',{
    data() {
        return{
            isModalOpen: this.recmodal,
			abstractList: this.remarkList,
            isHave:'',
            remarkContent:'',
            columns1: [
                {
                    title: '操作',
                    width:100,
                    key: 'operate',
                    render: (h, params) => {
                        return h('div', [
                            h('Icon', {
                                props: {
                                    type: 'edit'
                                },
                                style:{
                                    marginRight:'10px',
                                    padding:'5px'
                                },
                                on:{
                                    click:()=>{
                                        this.editRemark(params)
                                    }
                                }
                            }),
                            h('Icon', {
                                props: {
                                    type: 'close'
                                },
                                style:{
                                    padding:'5px'
                                },
                                on:{
                                    click:()=>{
                                        this.delRemark(params.index)
                                    }
                                }
                            })
                        ]);
                    }
                },
                {
                    title: '摘要内容',
                    key: 'content',
                    ellipsis:true
                }
            ],
        }
    },
    methods:{
        // 录入摘要
        addRemark(){ 
            // 判断录入的摘要是否为空
            let that = this;
            let reg = /(^\s*$)/
            let rs = reg.test( this.remarkContent )
            if(rs){
                this.$Message.error({
                    content:'请输入摘要内容',
                    duration:5
                })
                return;
            } 
            // 判断录入的摘要是否存在
            for(let item of this.remarkList){
                if( this.remarkContent.trim() === item.content) {
                    this.$Message.error({
                    content:'保存失败,摘要已存在，请重新设置摘要！',
                    duration:5
                })
                return;
                }
            }
            // 保存时判断新增或编辑
            let param;
            let url = '';
            if(that.isHave === ''){
                url = contextPath+'/voucherExpController/save';
                param = {'content': this.remarkContent};
            }else{
                url = contextPath+'/voucherExpController/update';
                param = {'id':that.remarkList[that.isHave].id,'content': this.remarkContent};
            }
            $.ajax({
                type: 'POST',
                url: url,
                data: JSON.stringify(param),
                contentType: 'application/json;charset=utf-8',
                dataType: 'json',
                success: function(result){
                    console.log(result)
                    if(result.data){
                        if( that.isHave === ''){
                            that.remarkList.unshift({content:that.remarkContent})
                        }else{
                            var remarkParent = that.remarkList[that.isHave];
                            if (remarkParent) {
                                that.remarkList[that.isHave].content = that.remarkContent;
                                that.remarkList[that.isHave].id = 0;
                            }
                            that.isHave = ''
                        }

                        that.remarkContent = ''
                        that.$Message.success({
                            content:'保存成功',
                            duration:5
                        })
                    }
                }
            });
        },
        cancleRemark(){
            this.remarkContent = ''
            this.closeModal();
        },
        // 编辑摘要
        editRemark(params){
            this.remarkContent = params.row.content
            this.isHave = params.index
        },
        // 删除摘要
        delRemark(index){
            var t_vm = this;
            this.$Modal.confirm({
                title: '系统提示',
                content: '<p>删除的摘要将不能恢复，请确认是否删除？</p>',
                okText: '确定',
                cancelText: '取消',
                onOk: () => {
                    let p = {'id':t_vm.remarkList[index].id};
                    console.log(p);
                    $.ajax({
                        type: 'POST',
                        url: contextPath+'/voucherExpController/delete',
                        data: p,
                        // contentType: 'application/json;charset=utf-8',
                        dataType: 'json',
                        success: function(result){
                            if(result.data){
                                t_vm.remarkList.splice(index, 1)
                                t_vm.$Message.success({
                                    content:'删除成功',
                                    duration:5
                                })
                            }
                        }
                    });
                },
            });
        },
        // 控制父组件属性
        closeModal(){
            this.isModalOpen = false;
        },
		dblClickRow(rowData, index){
			this.$emit('on-row-dblclick', rowData);
		}
    },
    watch:{
        recmodal(val){
            this.isModalOpen = val;
        },
		remarkList(val){
			this.abstractList = val;
		},
		isModalOpen(val){
			this.$emit('on-modal-change', val);
		},
		abstractList(val){
			this.$emit('on-list-change', val);
		}
    },
    props:{
		value: {},
		recmodal: {
			default(){
                return false;
            }
		},
		remarkList: {
			default(){
                return [];
            }
		}
	},
    template: `
    <Modal
        title="凭证摘要库"
        v-model="isModalOpen"
        @on-cancel='closeModal'
        :mask-closable="false">
        <p class="remark-title">摘要内容：</p>
        <Input type="textarea" v-model="remarkContent"></Input>
        <div class="mg10 text-right">
            <Button type="primary" @click="addRemark ">保存</Button>
            <Button type="ghost" @click="cancleRemark" class="">取消</Button>
        </div>
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