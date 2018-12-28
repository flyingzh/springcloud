Vue.component('edit-detail', {
    data () {
        return {
            show: this.value,
            dataList: [],
            operates: [{ label: '借', value: 1 }],
            formData: {
                'templateNo': 0, 'templateName': '', 'voucher': 0, 'singlePerson': '',
                'default': '', 'system': ''
            }
        }
    },
    methods: {
        editClick (data) {
            console.log(data);
        },
        closeModal () {
            this.$emit('close')
        },

    },
    watch: {

    },
    computed: {

    },
    filters: {
        filterMoney (value) {
            return accounting.formatMoney(value, "", 2)
        },
        filterOperate (value) {
            switch (value) {
                case '1':
                    return '余额';
                case '2':
                    return '借方余额';
                case '3':
                    return '贷方余额';
                default:
                    break;
            }

        }
    },
    props: ['title', 'value'],
    template: `
        <div>
            <Modal
                :title='title'
                v-model="show"
                width="800"
                @on-cancel='closeModal'
                :mask-closable="false">
                <div>
                    <div class="ht-">
                        <i-button type="text" @click="actionBtnMth('addNew')">新增</i-button>
                        <i-button type="text" @click="actionBtnMth('edit')">修改</i-button>
                        <i-button type="text" @click="actionBtnMth('delete')">删除</i-button>
                    </div>
                    <label>模板编号：</label>
                    <i-input  v-model="formData.templateNo"  type="text" >
                    <label class="pl10">模板名称：</label>
                    <i-input  v-model="formData.templateName"  type="text" >
                    <label class="pl10">凭证字：</label>
                    <i-select v-model="formData.voucher" class="wt125 ">
                        <i-option v-for="item in operates" :value="item.value" :key="item.value">{{item.label}}</i-option>
                    </i-select>
                    <i-button @click="add">添加</i-button>
                    <div class="ht-receivableW-table mt10"> 
                        <div class="ht-wrapper-tbl">
                            <table class="table tablediv">
                                <thead>
                                <tr>
                                    <td class="wt200">项目</td>
                                    <td class="wt100">运算方式</td>
                                    <td class="wt100">取数规则</td>
                                    <td class="wt125">期末数</td>
                                    <td class="wt100">年初数</td>
                                    <td class="wt80">操作</td>
                                </tr>
                                </thead>
                                <tbody >
                                <tr lay-size="sm" v-for="(item,idx) in dataList" @click="clickTr(item,idx)"  :class="{success: currentSelectRow === idx}" >     
                                    <td class="wt200">{{item.accont}}</td>
                                    <td class="wt100">{{item.computeType}}</td>
                                    <td class="wt100">{{item.valueRule | filterOperate}}</td>
                                    <td class="wt125">{{item.endVal | filterMoney}}</td>
                                    <td class="wt100">{{item.beganVal | filterMoney}}</td>
                                    <td class="wt80">
                                        <Icon type="close-round" @click="del(item)"></Icon>
                                    </td>
                                </tr>
                                </tbody>
                                <tfoot>
                                <tr>
                                    <td class="wt200">合计</td>
                                    <td class="wt100"></td>
                                    <td class="wt100"></td>
                                    <td class="wt125">{{endVal}}</td>
                                    <td class="wt100">{{beganVal}}</td>
                                    <td class="wt80"></td>    
                                </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
                
            </Modal>
            <subject-tree v-model="subjectVisable" @close="subjectClose" @save="subjectDate"></subject-tree>
        </div>
    `
})