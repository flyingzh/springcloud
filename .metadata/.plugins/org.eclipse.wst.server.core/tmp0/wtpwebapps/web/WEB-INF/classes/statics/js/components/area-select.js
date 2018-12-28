Vue.component('area-select', {
    props:{
        url:{
            type:String,
            require: true,
        },
        init:{
            /*接收一个对线，{
            isInit: Boolean,
            province: String,
            city: String,
            county: String,
            detail: String}*/
            type : Object,
            require : false,
            default(){
                return {};
            }
        },
        areaTemp:{
            type:Boolean,
            require: false,
            default(){
                return false;
            }
        },
        isCheck:{
            tyep:Boolean,
            require:false,
            default(){
                return false
            }
        },
        areaTemp:Boolean
    },
    data() {
        return {
            areaBody:{
                area:"",
                province: '',
                city: '',
                detail: '',
                county: '',
            },
            // area:"",
            // province: '',
            // city: '',
            // county: '',
            areaOptions:[],
            provinceOptions: [],
            cityOptions: [],
            countyOptions: [],
            // detail: '',
            options: [],
            result:false,
            ruleValidate:{
                province:[{ required: true }],
                city:[{ required: true }],
                county:[{ required: true }],
                detail:[{ required: true }],
            }
        }
    },
    methods:{
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
        handleReset () {
            this.$refs['formValidate'].resetFields();
        },
        submit(){
            this.validateData();
            return this.result;

        },
        setValue(...rest){
            this.$emit('input',{
                area: this.areaBody.province ? this.provinceOptions[this.provinceOptions.map(function(e) { return e.value; }).indexOf(this.areaBody.province)]['pcode'] :'',
                province: this.areaBody.province,
                city: this.areaBody.city,
                county:  this.areaBody.county,
                detail: this.areaBody.detail,
                concreteAddress:[
                    this.areaBody.area ? this.provinceOptions[this.provinceOptions.map(function(e) { return e.value; }).indexOf(this.areaBody.province)]['pname'] : '',
                    this.areaBody.province ? this.provinceOptions[this.provinceOptions.map(function(e) { return e.value; }).indexOf(this.areaBody.province)]['name'] : '',
                    this.areaBody.city ? this.cityOptions[this.cityOptions.map(function(e) { return e.value; }).indexOf(this.areaBody.city)]['name'] : '',
                    this.areaBody.county ? this.countyOptions[this.countyOptions.map(function(e) { return e.value; }).indexOf(this.areaBody.county)]['name'] : '',
                    this.areaBody.detail,
                ].join("")
            })
        },
        detailChange(){
            this.setValue();
        },
        provinceChange(...rest) {
            this.areaBody.area = this.areaBody.province ? this.provinceOptions[this.provinceOptions.map(function(e) { return e.value; }).indexOf(this.areaBody.province)]['pcode'] :'',
            this.areaBody.city = '';
            this.areaBody.county = '';
            this.cityOptions = (this.areaBody.province === '' || this.areaBody.province === undefined)? [] : this.provinceOptions[this.provinceOptions.map(function(e) { return e.value; }).indexOf(this.areaBody.province)]['child'];
            this.countyOptions = [];
            this.areaBody.detail='';
            this.setValue();
        },
        cityChange() {
            this.areaBody.county = '';
            this.countyOptions = (this.areaBody.city === '' || this.areaBody.city === undefined)? [] : this.cityOptions[this.cityOptions.map(function(e) { return e.value; }).indexOf(this.areaBody.city)]['child'];
            this.areaBody.detail='';
            this.setValue();
        },
        countyChange(){
            this.setValue();
        },
        initData(){
            let isInit = this.init.isInit;
            if(this.provinceOptions.length > 0){
                if( isInit=== true){
                    this.areaBody.province = this.init.province;
                    this.areaBody.area = this.init.province ? this.provinceOptions[this.provinceOptions.map(function(e) { return e.value; }).indexOf(this.areaBody.province)]['pcode'] :'',
                    this.cityOptions = this.provinceOptions[this.provinceOptions.map(function(e) { return e.value; }).indexOf(this.areaBody.province)]['child'];
                    this.areaBody.city = this.init.city;
                    this.countyOptions = this.cityOptions[this.cityOptions.map(function(e) { return e.value; }).indexOf(this.areaBody.city)]['child'];
                    this.areaBody.county = this.init.county;
                    this.areaBody.detail = this.init.detail;
                    this.setValue();
                }else{
                    this.areaBody.province = '';
                    this.areaBody.city = '';
                    this.areaBody.county='';
                    this.areaBody.detail='';
                    this.areaBody.area = "";
                    this.setValue();
                }
            }
        }
    },
    created() {
        let That = this;
        if(That.url && That.provinceOptions.length == 0){
            $.ajax({
                type: "POST",
                url:That.url,
                contentType: 'application/json',
                dataType: "json",
                success: function(data) {
                    if(data.code === '100100'){
                        console.log(data);
                        //获得区域信息
                        data.data.map((item)=>{
                            let obj = {};
                            obj['pname'] = item.pname;
                            obj['pcode'] = item.pcode;

                            let temp = true;
                            $.each(That.areaOptions,(i,n)=>{
                                if(n.pcode == obj.pcode){
                                    temp = false;
                                    return false;
                                }
                            })
                            if(temp){
                                //将数据赋值
                                That.areaOptions.push(obj);
                            }

                        })

                        That.provinceOptions = data.data;
                        That.initData();
                    }

                },
                error: function(err){

                },
            });
        }

    },
    watch:{
        "init":{
            handler(){
                console.log("执行了")
                this.initData();
            },
            deep:true,

        }
    },
    mounted(){
        console.log(this.areaTemp)
        if(!this.isCheck){
            this.ruleValidate={
                province:[{ required: false }],
                city:[{ required: false }],
                county:[{ required: false }],
                detail:[{ required: false }],
            }
        }
    },
    template:`<i-form ref="formValidate" :model="areaBody" :rules="ruleValidate">
    <form-item class="inline-block">
        <i-select v-show="areaTemp" v-model="areaBody.area" :disabled="true" style="width:100px" placeholder="区域">
            <i-option v-for="(item, index) in areaOptions" :value="item.pcode" :key="item.pname">{{ item.pname }}</i-option>
        </i-select>
    </form-item>
    <form-item class="inline-block" prop="province">
        <i-select transfer="true" v-model="areaBody.province" @on-change="provinceChange" style="width:100px" placeholder="省份" v-bind:disabled="init.disabled">
            <i-option v-for="(item, index) in provinceOptions" :value="item.value" :key="item.name">{{ item.name }}</i-option>
        </i-select>
    </form-item>
    <form-item class="inline-block" prop="city">
        <i-select transfer="true" v-model="areaBody.city" @on-change="cityChange" v-bind:disabled="(areaBody.province === '' || areaBody.province === undefined)||init.disabled"
            style="width:100px" placeholder="城市">
            <i-option v-for="(item, index) in cityOptions" :value="item.value" :key="item.name">{{ item.name }}</i-option>
        </i-select>
    </form-item>
    <form-item class="inline-block" prop="county">
        <i-select transfer="true" v-model="areaBody.county" @on-change="countyChange" v-bind:disabled="(areaBody.province === '' || areaBody.city === '' || areaBody.province === undefined || areaBody.city === undefined)||init.disabled"
            placeholder="区县" style="width:100px">
            <i-option v-for="(item, index) in countyOptions" :value="item.value" :key="item.name">{{ item.name }}</i-option>
        </i-select>
    </form-item>
    <form-item class="inline-block detail-area" prop="detail">
        <i-input v-model="areaBody.detail" v-on:on-change="detailChange()" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="详细地址"
            style="max-width: 400px" v-bind:disabled="init.disabled"></i-input>
    </form-item>
</i-form>`
//     template: ` <div>
//          <i-select
//         v-show="areaTemp"
//         v-model="area"
//         :disabled="true"
//         style="width:100px"
//         placeholder="区域">
//        <i-option v-for="(item, index) in areaOptions" :value="item.pcode" :key="item.pname">{{ item.pname }}</i-option>
//     </i-select>
//      <i-select
//         transfer="true"
//         v-model="province"
//         @on-change="provinceChange"
//         style="width:100px"
//         placeholder="省份"
//         v-bind:disabled="init.disabled">
//        <i-option v-for="(item, index) in provinceOptions" :value="item.value"  :key="item.name">{{ item.name }}</i-option>
//     </i-select>
//      <i-select
//         transfer="true"
//         v-model="city"
//         @on-change="cityChange"
//         v-bind:disabled="(province === '' || province === undefined)||init.disabled"
//         style="width:100px"
//         placeholder="城市">
//        <i-option v-for="(item, index) in cityOptions" :value="item.value" :key="item.name">{{ item.name }}</i-option>
//     </i-select>
//      <i-select
//         transfer="true"
//         v-model="county"
//         @on-change="countyChange"
//         v-bind:disabled="(province === '' || city === '' || province === undefined || city === undefined)||init.disabled"
//         placeholder="区县"
//         style="width:100px">
//        <i-option v-for="(item, index) in countyOptions" :value="item.value"  :key="item.name">{{ item.name }}</i-option>
//     </i-select>
//     <i-input
//     v-model="detail"
//     v-on:on-change="detailChange()"
//     type="textarea"
//     :autosize="{minRows: 2,maxRows: 5}"
//     placeholder="详细地址"
//     style="max-width: 400px"
//     v-bind:disabled="init.disabled"></i-input>
// </div>`
})
;
