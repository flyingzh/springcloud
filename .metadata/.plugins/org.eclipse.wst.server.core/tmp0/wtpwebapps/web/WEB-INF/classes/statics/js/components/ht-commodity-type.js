Vue.component('ht-commodity-type', {
    props: {
        disabled: {
            require: false,
            default() {
                return false;
            }
        },
        init: {
            require: false,
            default() {
                return '';
            }
        },
        showTip:{
            require:false,
            default(){
                return true;
            }
        }
    },
    data() {
        return {
            categoryType: [],
            // typeValue: '',
            isHint: true,
            body:{
                typeValue:''
            },
            ruleValidate:{
                typeValue:[
                    {required:true}
                ]
            },
            result:false
        }
    },
    methods: {
        changeCategory(index, selectedData) {
            if (index == this.body.typeValue) {
                return;
            }
            let e = selectedData[selectedData.length - 1];
            if (!e) {
                return;
            }
            let data = {
                name: e.value,
                value: e.label
            }
            this.$emit('input', data);
            this.$emit('change',e);
        },
        isHintShow(status) {
            if (status && this.body.typeValue && this.isHint && this.categoryType) {
                if(this.showTip){
                    this.$Modal.warning({
                        scrollable: true,
                        content: '温馨提示：改变商品类型将删除所有商品信息!',
                        onOk: () => {
                            this.isHint = false;
                        }
                    })
                }

            }
        },
        validateData(){
            this.$refs['formValidate'].validate((valid) => {
                if (valid) {
                    // 已选
                    this.result = true;
                } else {
                    // 未选
                    this.result = false;
                }
            })
        },
        submit(){
            this.validateData();
            return this.result;
        
        },
        //加载商品类型
        loadProductType() {
            var That = this;
            $.ajax({
                type: "post",
                url: contextPath + '/tbasecommoditycategory/listByAll?parentId=0',
                contentType: 'application/json',
                dataType: "json",
                success: function (res) {
                    That.categoryType = That.initGoodCategory(res.data.cateLists)
                    if(That.init){
                        let arr = [];
                        That.typeInit(That.categoryType, arr, That.init);
                        That.body.typeValue =  arr.reverse();
                    }
                },
                error: function (err) {
                    That.$Modal.error({
                        scrollable: true,
                        content: "系统出现异常,请联系管理人员"
                    });
                },
            })
        },
        initGoodCategory(type) {
            let result = [];
            type.forEach((item) => {
                let {
                    customCode: value,
                    name: label,
                    cateLists: children
                } = item;

                if (children) {
                    children = this.initGoodCategory(children)
                }
                result.push({
                    value,
                    label,
                    children
                })
            });
            result.forEach((item) => {
                if (!item.children) {
                    delete item.children;
                }
            });
            return result
        },
        typeInit(arr, res, val) {
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].value == val) {
                    res.push(arr[i].value);
                    return true;
                }
                if (arr[i].children && arr[i].children.length > 0) {
                    if (this.typeInit(arr[i].children, res, val)) {
                        res.push(arr[i].value);
                        return true;
                    }
                }
            }
        }
    },
    created() {
        this.loadProductType();
    },
    mounted() {

    },
    watch:{
        "init":{
            handler(){
                let arr = [];
                this.typeInit(this.categoryType, arr, this.init);
                this.body.typeValue =  arr.reverse();
            }

        }
    },

    template: ` 
    <i-form ref="formValidate" :model="body" :rules="ruleValidate" class="ht-hidden-label" label-width="10">
        <form-item label="ts" prop="typeValue">
            <cascader  
                transfer 
                trigger="hover" 
                class="ht-width-md inline-block" 
                @on-change="changeCategory" 
                :disabled="disabled" 
                @on-visible-change="isHintShow"
                :data="categoryType" 
                :clearable="false"
                v-model="body.typeValue" 
            >
            </cascader>
        </form-item>
    </i-form>`
})
;
