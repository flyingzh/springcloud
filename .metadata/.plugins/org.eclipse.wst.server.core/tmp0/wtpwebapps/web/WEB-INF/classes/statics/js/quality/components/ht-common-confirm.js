Vue.component('ht-common-confirm', {
    props: {
        config: {
            require: false,
        },
    },
    methods: {
        sure(){
            this.$emit('sure');
        },
        cancel(){
            this.$emit('cancel');
        }
    },
    template: `<div class="ht-common-confirm-wrap">
        <div class="ht-common-confirm-container">
            <div class="ht-common-confirm">
                <div class="confirm-head"><i class="ivu-icon" :class="{'ivu-icon-alert':config.success, 'ivu-icon-checkmark':  !config.success}"></i>{{config.title || '提示'}}</div>
                <div class="confirm-content">{{config.content || '内容'}}</div>
                <div class="confirm-btns">
                    <div class="button sure" @click="sure" :class="{onlySure: config.onlySure}">{{config.sureText || '确定'}}</div>
                    <div class="button cancel" v-if="!config.onlySure" @click="cancel">取消</div>
                </div>
            </div>
        </div>
</div>`
});
