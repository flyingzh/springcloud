Vue.component('ht-upload-exl', {
    props: ['upload_config','uploadData'],
    data: function () {
        return {
			myData: [],
			file: null,
			loadingStatus: false,
			uploadType: 'cover',
			uploadLog: '',

        }
    },
    methods: {
		handleUpload (file) {

            console.log(this.uploadData);
			this.file = file;
			// accept=".xls,.xlsx" 
			console.log(file, 'handleUpload file');
			/*if(file.name.indexOf('.xlsx') !== -1 || file.name.indexOf('.xls') !== -1) {
				return true;
			}else {
				this.$Message.info({
					content: '只能上传Excal文件',
					duration: 3
				});
				return false;
			}*/
			return false;
		},
		uploadSuccess (response, file, fileList) {
            this.$Message.info(response.msg);
			console.log(response, file, fileList, 'uploadSuccess :response, file, fileList');
			this.closeM();
		},
		uploadError (error, file, fileList) {
            this.$Message.error(error.msg);
			console.log(error, file, fileList, 'uploadError :error, file, fileList');
		},
		upload () {
			this.loadingStatus = true;
			/*setTimeout(() => {
				this.file = null;
				this.loadingStatus = false;
				this.$Message.success('Success')
			}, 1500);*/

			this.$refs.uploadRef.post(this.file);

            this.loadingStatus = false;
		},
		closeM () {
			this.$emit('close-modal',false);
		}
	},
    watch:{

    },
    mounted(){
        this.myData = this.upload_config;
    },
	template: 	`<div>
					<ul style="margin: 15px 0px;">
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
							:data="uploadData"
							:action="upload_config.url"
						>
							<i-button type="ghost" icon="ios-cloud-upload-outline">Upload files</i-button>
						</Upload>
						<div v-if="file !== null">Upload file: {{ file.name }} </div>
					</template>

					<RadioGroup v-model="uploadType" style="margin: 15px 0px;">
						<Radio label="cover">
							<span>覆盖模式</span>
						</Radio>
						<!--<Radio label="append">
							<span>追加模式</span>
						</Radio>-->
					</RadioGroup>
					
					<!-- 
						<div style="margin: 15px 0px;">
							<p>引入日志</p>
							<i-input v-model="uploadLog" type="textarea" :rows="4" placeholder=""></i-input>
						</div>  
					-->
					<div style="margin: 15px 0px;text-align: right;text-align: -webkit-right;">
						<i-button  @click="upload" :loading="loadingStatus">{{ loadingStatus ? 'Uploading' : '引入' }}</i-button>
						<i-button  @click="closeM" >退出</i-button>
					</div>
					
				</div>`
});
