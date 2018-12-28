Vue.component('ht-close-modal', {
    props: {

    },
    data() {
        return {
            closeModal: false
        }
    },
    methods: {
        del(){

        },
        showCloseModal(){
            this.closeModal = true;
        },
        ok(type){
            this.closeModal = false;
            this.$emit('click', type);
        },
        cancel(){
            this.closeModal = false;
        }
    },
    watch:{

    },
    mounted(){

    },
    template: `<Modal v-model="closeModal" width="360" on-ok="ok" on-cancel="cancel">
        <p slot="header" style="color:#f60;text-align:center">
            <Icon type="information-circled"></Icon>
            <span>提示</span>
        </p>
        <div style="text-align:center">
            <p>当前单据未保存是否保存单据？</p>
        </div>
        <div slot="footer" style="text-align: center;">
            <i-button type="primary" size="small" @click="ok('yes')" style="width: 60px;">是</i-button>
            <i-button size="small" @click="ok('no')" style="width: 60px;">否</i-button>
            <i-button size="small" @click="ok('cancel')" style="width: 60px;">取消</i-button>
        </div>
    </Modal>`
});