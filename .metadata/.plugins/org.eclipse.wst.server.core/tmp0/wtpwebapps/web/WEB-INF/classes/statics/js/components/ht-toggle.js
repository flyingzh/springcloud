Vue.component("ht-toggle",{
    props:["isSearchHide","isTabulationHide"],
    data(){
        return{
            isHide:true
        }
    },
    template:`<div>
        <div class="clearfix"></div>
        <div style="height: 25px;" >
            <span class="chevron">
                <span v-show="isTabulationHide">
                    <Icon type="chevron-up" @click="hideSearch" v-show="isSearchHide"></Icon>
                    <Icon type="chevron-down" @click="hideSearch" v-show="!isSearchHide" ></Icon>
                </span>
                <!--<span v-show="isHide" style="padding-right: 5px;">|</span>-->
                <!--<span v-show="isSearchHide">-->
                    <!--<Icon type="chevron-up" @click="hidTabulation" v-show="!isTabulationHide"></Icon>-->
                    <!--<Icon type="chevron-down" @click="hidTabulation" v-show="isTabulationHide" ></Icon>-->
                <!--</span>-->
            </span>
        </div></div>`,
    methods:{
        hideSearch(){
            this.isHide=!this.isHide;
            this.$emit('update:isSearchHide', !this.isSearchHide);
            $(".chevron").css("top","");
        },
        hidTabulation(){
            this.isHide=!this.isHide;
            this.$emit('update:isTabulationHide', !this.isTabulationHide);
            if(this.isTabulationHide){
                $(".chevron").css("top","90%");
            }else{
                $(".chevron").css("top","")
            }
        }
    }
})