Vue.component('ht-img-magnifier', {
    props: {
        url: {
            require: false,
            type: String,
            default() {
                return ''
            }
        }
    },
    data(){
        return {
            defaultUrl:''
        }
    },
    template: `<div>
    <poptip transfer trigger="hover"  placement="right" >
        <img style="width: 40px;height: 40px" :src="url || defaultUrl" alt="">
        <div slot="content">
            <img style="width: 260px;height: 260px" :src="url || defaultUrl" alt="">
        </div>
    </poptip>
</div>`,
mounted () {
    let host = window.location.host;
    this.defaultUrl = 'http://'+ host + contextPath+'/images/no_pic.png'
}
})
// 使用方法：
// <ht-img-magnifier :url="url"></ht-img-magnifier>