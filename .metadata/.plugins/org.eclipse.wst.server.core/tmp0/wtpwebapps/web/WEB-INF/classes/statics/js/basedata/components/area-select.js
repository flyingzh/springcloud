Vue.component('area-select', {
    props:{
        url:{
            type:String,
            require: true,
        },
        init:{
            type : Object,
            require : false
        }
    },
    data() {
        return {
            province: '',
            city: '',
            county: '',
            provinceOptions: [],
            cityOptions: [],
            countyOptions: [],
            detail: '',
            options: []
        }
    },
    methods:{
        setValue(){
            this.$emit('input',{
                area: this.province ? this.provinceOptions[this.provinceOptions.map(function(e) { return e.value; }).indexOf(this.province)]['pcode'] :'',
                province: this.province,
                city: this.city,
                county:  this.county,
                detail: this.detail,
                concreteAddress:[
                     this.province ? this.provinceOptions[this.provinceOptions.map(function(e) { return e.value; }).indexOf(this.province)]['name'] : '',
                     this.city ? this.cityOptions[this.cityOptions.map(function(e) { return e.value; }).indexOf(this.city)]['name'] : '',
                     this.county ? this.countyOptions[this.countyOptions.map(function(e) { return e.value; }).indexOf(this.county)]['name'] : '',
                     this.detail,
                ].join("")
            })
        },
        detailChange(){
            this.setValue();
        },
        provinceChange() {
            this.city = '';
            this.county = '';
            this.cityOptions = (this.province === '' || this.province === undefined)? [] : this.provinceOptions[this.provinceOptions.map(function(e) { return e.value; }).indexOf(this.province)]['child'];
            this.countyOptions = [];
            this.detail='';
            this.setValue();
        },
        cityChange() {
            this.county = '';
            this.countyOptions = (this.city === '' || this.city === undefined)? [] : this.cityOptions[this.cityOptions.map(function(e) { return e.value; }).indexOf(this.city)]['child'];
            this.detail='';
            this.setValue();
        },
        countyChange(){
            this.setValue();
        },
        initData(){
            let isInit = this.init.isInit;
            if(this.provinceOptions.length > 0){
                if( isInit=== true){
                    this.province = this.init.province;
                    this.cityOptions = this.provinceOptions[this.provinceOptions.map(function(e) { return e.value; }).indexOf(this.province)]['child'];
                    this.city = this.init.city;
                    this.countyOptions = this.cityOptions[this.cityOptions.map(function(e) { return e.value; }).indexOf(this.city)]['child'];
                    this.county = this.init.county;
                    this.detail = this.init.detail;
                    this.setValue();
                }else{
                    this.province = '';
                    this.city = '';
                    this.county='';
                    this.detail='';
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
                this.initData();
            },
            deep:true,

        }
    },
    mounted(){
        console.log(this.init)
    }
    ,
    template: ` <div>
     <i-select 
        transfer="true"
        v-model="province" 
        @on-change="provinceChange"
        style="width:100px" 
        placeholder="省份"
        v-bind:disabled="init.disabled">
       <i-option v-for="(item, index) in provinceOptions" :value="item.value"  :key="item.name">{{ item.name }}</i-option>
    </i-select>
     <i-select 
        transfer="true"
        v-model="city" 
        @on-change="cityChange"
        v-bind:disabled="(province === '' || province === undefined)||init.disabled" 
        style="width:100px" 
        placeholder="城市">
       <i-option v-for="(item, index) in cityOptions" :value="item.value" :key="item.name">{{ item.name }}</i-option>
    </i-select>
     <i-select 
        transfer="true"
        v-model="county" 
        @on-change="countyChange"
        v-bind:disabled="(province === '' || city === '' || province === undefined || city === undefined)||init.disabled" 
        placeholder="区县"
        style="width:100px">
       <i-option v-for="(item, index) in countyOptions" :value="item.value"  :key="item.name">{{ item.name }}</i-option>
    </i-select>
    <i-input 
    v-model="detail" 
    v-on:on-change="detailChange()" 
    type="textarea" 
    :autosize="{minRows: 2,maxRows: 5}" 
    placeholder="详细地址"
    style="max-width: 400px"
    v-bind:disabled="init.disabled"></i-input>
</div>`
})
;
