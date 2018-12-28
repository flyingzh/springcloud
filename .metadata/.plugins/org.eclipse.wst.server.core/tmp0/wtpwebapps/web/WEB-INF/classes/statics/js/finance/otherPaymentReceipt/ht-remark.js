Vue.component('ht-remark',{
    data() {
        return{
            value: this.recmodal,
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
                    key: 'remark',
                    ellipsis:true
                }
            ],
        }
    },
    methods:{
        // 录入摘要
        addRemark(){ 
            // 判断录入的摘要是否为空
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
            for(let item of this.remarklist){
                if( this.remarkContent.trim() === item.remark) {
                    this.$Message.error({
                    content:'保存失败,摘要已存在，请重新设置摘要！',
                    duration:5
                })
                return;
                }
            }
            // 保存时判断新增或编辑,目前为demo，没有对数据库进行处理
            if( this.isHave === ''){
                this.remarklist.unshift({remark:this.remarkContent})
            }else{
                this.remarklist[this.isHave].remark = this.remarkContent
                this.isHave = ''
            }
            
            this.remarkContent = ''
            this.$Message.success({
                    content:'保存成功',
                    duration:5
                })
        },
        cancleRemark(){
            this.remarkContent = ''
        },
        // 编辑摘要
        editRemark(params){
            this.remarkContent = params.row.remark
            this.isHave = params.index
        },
        // 删除摘要
        delRemark(index){
            this.$Modal.confirm({
                title: '系统提示',
                content: '<p>删除的摘要将不能恢复，请确认是否删除？</p>',
                okText: '确定',
                cancelText: '取消',
                onOk: () => {
                    // 调用接口，目前为demo
                    this.remarklist.splice(index, 1)
                    this.$Message.success({
                        content:'删除成功',
                        duration:5
                    })
                },
            });
        },
        // 控制父组件属性
        closeModal(){
            this.$parent.isShow = false;
        }
    },
    watch:{
        recmodal(val){
            this.value = val
        }
    },
    props:['recmodal','remarklist'],
    template: `
    <Modal
        title="凭证摘要库"
        v-model="value"
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
            :data="remarklist">
        </Table>
        <span slot="footer"></span>
    </Modal>
    `
})