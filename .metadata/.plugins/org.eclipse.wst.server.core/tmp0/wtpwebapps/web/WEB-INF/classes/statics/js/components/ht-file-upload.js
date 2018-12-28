Vue.component("ht-file-upload",{
    props:{
        isShow:Boolean,
        fileDetails:{
            default: []
        },
        changeLog:Object,
        logAddress:String,
        showUpload:Boolean
    },
    template:`<div>
                        <div v-if="!isShow">
                            <i-button type="primary" @click="startUp">上传文件</i-button>
                            <table class="edit-table">
                                <thead>
                                <tr>
                                    <th class="width-xs text-center">序号</th>
                                    <th>文件名</th>
                                    <th>文件大小</th>
                                    <th>上传人</th>
                                    <th>上传时间</th>
                                    <th>操作</th>
                                </tr>
                                </thead>
                                <tbody >
                                <tr v-show="item.del==false" v-for="(item,index) in fileDetails">
                                    <td class="width-xs text-center">{{index+1}}</td>
                                    <td><input type="text" :value="item.fd_id" hidden>
                                        {{item.fdName}}
                                    </td>
                                    <td>
                                        {{item.fdSize}}
                                    </td>
                                    <td>{{item.uploadUser}}</td>
                                    <td class="text-center">{{item.uploadTime}}</td>
                                    <td class="text-center">
                                       <a :href="'${contextPath}/tbasecustomer/download?url='+item.fdUrl+'&name='+item.fdName"
                                           >下载</a>
                                     <a href="javascript:void(0)" @click.prevent="delfileDetails(index,item.fd_id)">删除</a>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        <div v-show="isShow">
                            <common-record-list :record_config="changeLog"
                                                :url="logAddress"></common-record-list>
                        </div>
                         <Modal
                            v-model="showUpload"
                            title="上传文件"
                            @on-ok="modalOk"
                            @on-cancel="modalCancel">
                            <Upload
                                    ref="upload"
                                    :on-success="handleSuccess"
                                    :max-size="2048"
                                    :on-format-error="handleFormatError"
                                    :on-exceeded-size="handleMaxSize"
                                    multiple
                                    
                                    action="${contextPath}/tbasecustomer/img">
                                <i-button type="ghost" icon="ios-cloud-upload-outline">开始上传</i-button>
                                <span>文件上传大小限制为2M以内</span>
                            </Upload>
                        </Modal>
                </div>`,
    methods:{
        startUp(){
            this.showUpload = true
            this.$emit("update:showUpload",this.showUpload)
        },
        modalOk(){
            this.showUpload = false
            this.$emit("update:showUpload",this.showUpload)
        },
        delfileDetails(i,id){
            //this.$parent.delfileDetails(i,id)
            var that = this
            layer.confirm('确认删除本条记录吗?', {
                btn: ['确定', '取消'],
                btn1: function (index) {
                    console.log(this)
                    //vm.customer.sysFile.fileDetails.splice(i,1);
                    var sysFiles = that.fileDetails[i];

                    sysFiles.del = true;

                    that.$emit("update:fileDetails",that.fileDetails)
                    layer.close(index);
                },
                btn2: function (index) {
                    layer.close(index);
                }
            })
        },
        modalCancel(){

        },
        handleSuccess (res, file) {

            if (res.code == "100100") {
                let fileDetails = res.data;
                var parVm = this.$parent;
                if(!parVm.customer.sysFile.fileDetails){
                    parVm.customer.sysFile = {
                        fileId:"",
                        fileType:"",
                        fileDetails:[]
                    }
                }
                parVm.customer.sysFile.fileDetails.push(fileDetails);

            } else {
                layer.alert("上传失败");
            }
        },
        handleFormatError (file) {
            this.$Notice.warning({
                title: '提示',
                desc: '文件上传失败，请联系技术人员'
            });
        },
        handleMaxSize (file) {
            this.$Notice.warning({
                title: '提示',
                desc: "文件大小超过2M,请上传小于2M的文件"
            });
        },

    }
})