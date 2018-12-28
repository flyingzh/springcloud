Vue.component('my-img-upload', {
    props:['imgExample'],
    data(){
        return{
            itemPhoto: {
                imgUrl: this.imgExample.imgUrl,
                imgName: this.imgExample.imgName,
            },
            imgofurl: '',
            photoName: '',
            visible: false
        }
    },
    methods:{
        handleView (ph) {
            console.log("当前操作是：显示大图 " + ph.imgName);
            this.imgofurl = ph.imgUrl;
            this.photoName = ph.imgName;
            this.visible = true;
        },
        handlerRemove (data){
            //console.log("删除前:"+JSON.stringify(this.Lists));
            console.log("Ready to delelte:" + data.imgName);
            var i = this.Lists.findIndex(
                function(value, index, arr){return value.imgUrl == data.imgUrl;}
            );
            console.log("delete index :" + i );
            //console.log("delete 操作：",
            this.Lists.splice( i , 1 );
            this.$axios.post("http://localhost:2442/api/Handler1.ashx",
                {'urlName':data.imgUrl},
                {headers: {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
                    }}
            )
                .then(res=>{
                    console.log(res.data);
                });
            //console.log("删除后:"+JSON.stringify(this.Lists));
            //console.log(" index length:" + this.Lists.length );
            //this.Lists.splice(this.Lists.length);
            //console.log("刷新后:"+JSON.stringify(this.Lists));
            //i=i-1;
            //);
        },
        handleSuccess (res, file) {
            //console.log("name:" +  + "\nurl:" + res.toString());
            this.Lists.push({"imgUrl": "http://" + res.toString(), "imgName": file.name.toString()});
            var i = this.Lists.findIndex(
                function(value, index, arr){return value.imgName == file.name.toString();}
            );
            console.log("add index :" + i );
        }
    },
    created(){
        var a = 1;
        console.log("当前次数是：" + a++);
        this.$root.eventHub.$on('itemphoto',(data)=>this.handlerRemove(data));
    },

    mounted(){

    },
    template: `<div class="demo-upload">  
        <img :src="itemPhoto.imgUrl">  
        <div class="demo-upload-text">  
            <span class="demo-upload-text-span">{{itemPhoto.imgName}}</span>  
        </div>  
        <div class="demo-upload-list-cover">  
            <Icon type="ios-eye-outline" @click.native="handleView(itemPhoto)"></Icon>  
            <Icon type="ios-trash-outline" @click.native="handleRemove(itemPhoto)"></Icon>  
        </div>  
          
        <Modal :title="photoName" v-model="visible">  
            <img :src="imgofurl" v-if="visible" style="width: 100%">  
        </Modal>  
    </div> `
});
