Vue.component('ht-upload-exl', {
    props: ['upload_config'],
    data: function () {
        return {
			myData: [],
			file: null,
			loadingStatus: false,
			uploadType: 'cover',
			uploadLog: '',
            uploadFile: [] // 需要上传的文件List
        }
    },
    methods: {
		handleUpload (file) {
			this.file = file;
			// console.log(file, 'handleUpload file');
			// if(file.name.indexOf('.xlsx') !== -1 || file.name.indexOf('.xls') !== -1) {
			// 	return true;
			// }else {
			// 	this.$Message.info({
			// 		content: '只能上传Excal文件',
			// 		duration: 3
			// 	});
			// 	return false;
			// }
            //this.uploadFile.push(file);
            console.log(this.file);
			return false;
		},
		uploadSuccess (response) {
			console.log(response);
			var code = response.code;
			var msg = response.msg;
            if(code=='100100'){
                this.$Message.info(msg);
                this.closeM();
                this.$emit('reload');;
			}else{
                this.$Modal.error({
                    title: "导入凭证",
                    content:msg
                });
			}

		},
		uploadError (error, file, fileList) {
			console.log(error, file, fileList, 'uploadError :error, file, fileList');
		},
		upload () {
			//var that = this;
			this.loadingStatus = true;
			// setTimeout(() => {
			// 	this.file = null;
			// 	this.loadingStatus = false;
			// 	this.$Message.success('Success')
			// }, 1500);

            // for (let i = 0; i < this.uploadFile.length; i++) {
            //     let item = this.uploadFile[i];
            //     this.$refs.uploadRef.post(item);
            //     console.log("请求"+i);
            // }
            this.$refs.uploadRef.post(this.file);
            this.loadingStatus = false;

		},
		closeM () {
			this.$emit('close-modal',false);
		},
		downloadVoucherTemplate(){  //下载模板
            window.open(contextPath+"/voucherController/downloadVoucherTemplate");
		}

	},
    watch:{

    },
    mounted(){
       // this.myData = this.upload_config;
        //console.log(this.myData);
    },
	template: 	`<div>
					<ul style="margin: 15px 0px;">
					    <li style="color: blue;cursor:pointer;" @click="downloadVoucherTemplate">下载模板</li>
						<li>1. 引入文件只支持Excel格式(*.xls).</li>
						<li>2. 引入文件的格式必须和引出的格式相同.</li>
						<li>3. 请确定所选定的文件不在任何用户操作当中.</li>
					</ul>
					<template>
						<Upload  
			 				ref="uploadRef"
							:before-upload="handleUpload" 
							:on-success="uploadSuccess"
							:on-error="uploadError"
							:action="upload_config.url"
						>
							<i-button type="ghost" type="primary" icon="ios-cloud-upload-outline">请选择要导入的Excel文件</i-button>
						</Upload>
						<div v-if="file!=null">已选择Excel文件:  {{file.name}} </div>
						<!--<p v-for="item in uploadFile">{{item.name}}</p>-->
					</template>
 
					<div style="margin: 15px 0px;text-align: right;text-align: -webkit-right;">
						<i-button  @click="upload" type="primary" :loading="loadingStatus">{{ loadingStatus ? 'Uploading' : '引入' }}</i-button>
						<i-button  @click="closeM" type="primary" >退出</i-button>
					</div>
					
				</div>`
});
