var eventHub = new Vue();//定义一个公共的vue用来接收vue之间的调用

var successNum = 0;
var accessVm = new Vue({
    el: '#acccess-info',
    data() {
        return {
            isSearchHide: true, //搜索栏
            isTabulationHide: true, // 列表
            isHide: true,
            showModal: false,
            selectOrginId: [],
            htHaveChange: false,
            // 配置表头
            columns: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '组织名称',
                    key: 'orgName'
                }
            ],
            // 表格内数据,与表头对应
            colContent: [],
            logUrl: '',
            codeEdit: false,
          
            //控制显示隐藏
            isEdit: false,
            isShow: true,
          
            reload: false,
            selected: [],
            //测试数据绑定
            regidate: "",
            sCode: "",
            sName: "",
            sAbb: "",
            sLevel: "",
            smPro: "",
            spType: "",
            sType: "",
            sPay: "",
            sCurrency: "",
            sbilling: "",
            isChecked: "",
            isSave: true,
            isInfo: true,
            access: {
                id: '',
                status: '1',
        
                sysFile: {
                    fileId: '',
                    fileType: 3,
                    boeType: '',
                    boeId: '',
                    fileDetails: []
                }
            },
            confirmConfig: {
                showConfirm: false,
                title: '提示',
                content: '这是内容',
                onlySure: true,
                success: true
            },
            const: {
                STATUS_YES: 1,
                STATUS_NO: 0,
                IS_DEL_YES: 0,
                IS_DEL_NO: 1,
                IS_DEFAULT_YES: 1,
                IS_DEFAULT_NO: 0,
                SUCCESS_CODE: '100100'
            },
            //以下数据均为模拟


            //菜单打开时间
            openTime: "",

            // 结算方式，多选
       

            isChecked: 1,
            //tab2联系人信息列表

            //tab4上传文件信息
            uploadedFiles: [
                {fileName: "银行卡复印件.jpg", fileSize: "34KB", uploader: "zhangsan", uploadTime: "2018-06-01"},
                {fileName: "身份证复印件.jpg", fileSize: "34KB", uploader: "zhangsan", uploadTime: "2018-06-01"}
            ],

            mainProdArr: [],
        
         
            //以上为模拟数据
       
            supplierLevel: '',
            supplierType: '',
            mainProd: '',
            prodType: '',
        
     
            option: [{label: 'aaaa', value: 'bbbb'}],
            areaInit: {
                isInit: false,
                province: '',
                city: '',
                county: '',
                detail: '',
                disabled: false,

            },
            //是否展示上传控件
            showUpload: false,

        }

    },
    created:  function (){
    	let that=this;
    	//判断附件是查看还是编辑
    	eventHub.$on('isEdit', function (isEdit) {
    		if(isEdit=='Y'){
    			that.isEdit=true;
    			that.isShow=false;
    		}else{
    			that.isEdit=false;
    			that.isShow=true;
    		}
        });
    	//调用附件列表查询方法
    	eventHub.$on('queryFile', function (data,boeType) {
            that.getAccess(data,boeType);
        });
    	//调用附件保存方法
    	eventHub.$on('saveFile', function (data,boeType) {
            that.saveAccess(data,boeType);
        });

    },
    methods: {
        validate() {},
        handleSuccess(res, file) {
            if (res.code == accessVm.const.SUCCESS_CODE) {
                accessVm.htHaveChange = true;
                accessVm.addAttachment(file, res.data[0]);
            } else {
                //layer.alert(res.msg);
                this.$Modal.warning({
                    content: res.msg
                });
            }
        },
        handleFormatError(file) {
            this.$Notice.warning({
                title: '文件格式异常!',
                desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
            });
        },
        handleMaxSize(file) {
            this.$Notice.warning({
                title: '文件大小超出限制!',
                desc: '【'+file.name + '】的大小超过2M'
            });
        },
        handleBeforeUpload() {
            // const check = this.uploadList.length < 5;
            // if (!check) {
            //     this.$Notice.warning({
            //         title: 'Up to five pictures can be uploaded.'
            //     });
            // }
            // return check;
        },
        modalOk() {
            this.showUpload = false;
        },
        modalCancel() {

        },
        initOrgin() {},
        hideSearch() {
            this.isHide = !this.isHide;
            this.isSearchHide = !this.isSearchHide;
            $(".chevron").css("top", "")
        },
        hidTabulation() {
            this.isHide = !this.isHide;
            this.isTabulationHide = !this.isTabulationHide;
            if (!this.isTabulationHide) {
                $(".chevron").css("top", "84%")
            } else {
                $(".chevron").css("top", "")
            }
        },
        showOrgin() {
            if (this.selected.length == 0) {
                //layer.alert("请选择行!");
                this.$Modal.warning({
                    content: "请选择行!"
                });
                return;
            }
            this.showModal = true;
        },
        okModel() {},
        cancelModel() {
            this.selectOrginId = [];
            this.$refs.test.selectAll(false);
            this.showModal = false;
        },
        changeselect(selection) {},
        search() {
            this.body.supplierLevel = this.supplierLevel == '' ? null : this.supplierLevel.join(',');
            this.body.supplierType = this.supplierType == '' ? null : this.supplierType.join(',');
            this.body.mainProd = this.mainProd == '' ? null : this.mainProd.join(',');
            this.reload = !this.reload;
        },
        clear() {
            //清空多选下拉框
            this.$refs.mainProd.selectMore = [];
            this.$refs.supplierLevel.selectMore = [];
            this.$refs.supplierType.selectMore = [];

            this.body = {
                supplierName: '',
                supplierCode: '',
                contact: '',
                status: '',
                supplierLevel: '',
                supplierType: '',
                mainProd: ''
            }
            this.supplierLevel = '';
            this.supplierType = '';
            this.mainProd = '',
                this.reload = !this.reload;
        },
        reload() {

        },
        loadSupplierLevels() {
            $.ajax({})
        },
        loadCurrency() {},
        loadMainProducts: function () {},


        //提示弹窗
        alertMsg(msg, onlySure) {
            this.confirmConfig = {
                showConfirm: true,
                title: '提示',
                content: msg,
                onlySure: onlySure,
                success: true
            }
        },
 
        //点击退出时
        exitTab() {
            //清空上传文件列表
            this.$refs.upload.clearFiles();

            this.isEdit = false;
            $("form").validate().resetForm();
        },
 
    
    

        //tab4删除单个文件信息
        delFile(item) {
            layer.confirm('是否要删除这条信息!', {

                    btn: ['确定', '取消']
                }, function () {
                    //这里先根据数据有没有id 来判断是原有的还是新增的
                    accessVm.htHaveChange = true;
                    item.del = true;
                    layer.closeAll('dialog');  //加入这个信息点击确定 会关闭这个消息框
                }
            );
        },
        addAttachment: function (file, res) {
            var attachment = {
                fdName: file.name,
                fdSize: (file.size / 1024).toFixed(2) + "kb",
                uploadTime: res.uploadTime,
                uploadUser: res.uploadUser,
                fdUrl: res.fdUrl,
                fdType: 2,
                del:false,
            };
            accessVm.access.sysFile.fileDetails.push(attachment);
        },
        //下载附件
        download(item) {

 
            if(!item.fdUrl){
                //layer.alert("文件地址为空!请先上传文件!");
                this.$Modal.warning({
                    content: "文件地址为空!请先上传文件!"
                })
                return false;
            }
            let paramsArray =[];
            Object.keys(item).forEach(key => paramsArray.push(key + '=' + item[key]));
            let url=contextPath+'/fileAccess/download?'+ paramsArray.join('&');
            location.href=encodeURI(url);
        },
        uploadfile() {
        	console.log("执行了");
            let _this = this;
            _this.showUpload = true;
            accessVm.showUpload= true;
        },
        goBack() {
            this.isInfo = false;
            //选项卡默认为选中第一个

            this.access = {
                contacts: [],

                bankCardInfos: [],
                supplierProds: [],
                status: '1',
                sysFile: {
                    fileId: '',
                    fileType: 3,
                    fileDetails: []
                }
            };
        },
        confirmSure() {
            console.log('点击了sure')
            this.confirmConfig.showConfirm = false;
        },
        confirmCancel() {
            console.log('点击了取消')
            this.confirmConfig.showConfirm = false;
        },
        pageGridInit(id) {
            this.logUrl = contextPath+"supplierlog/list?nd=" + new Date().getTime() + "&supplierId=" + id;
        },
        exit() {
            window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
        },
         
        //保存附件
        saveAccess(boeId,boeType){
        	let that=this;
        	let params = {
        			boeId: boeId,
        			boeType: boeType,
        			fileDetails:[]
        	}
           	params.fileDetails=accessVm.access.sysFile.fileDetails;
            $.ajax({
                url: contextPath+"/fileAccess/saveSysFile",
                dataType: 'json',
                async: false,
                data: JSON.stringify(params),
                contentType: 'application/json;charset=utf-8',
                method: 'post',
                success: function (res) {
                    // console.log(res)
                    accessVm.htHaveChange = false;
                    if (res.code === accessVm.const.SUCCESS_CODE) {
                        // alert(res.msg);
                    	if(res.data!=null&&res.data.fileDetails!=null){
                    		accessVm.access.sysFile=res.data;
                    	}
                 
                    } else {
                         // alert("附件保存失败");
                        that.$Modal.warning({
                            content: "附件保存失败"
                        })

                    }
                },
                error: function (e) {
                    console.log(e)
                }

            });
        },
        
        //查找附件
        getAccess(boeId,boeType){
           	let params = {
        			boeId: boeId,
        			boeType: boeType
        	}

            $.ajax({
                url: contextPath+"/fileAccess/getByBoe",
                dataType: 'json',
                async: false,
                data: JSON.stringify(params),
                contentType: 'application/json;charset=utf-8',
                method: 'post',
                success: function (res) {
                    // console.log(res)
                    if (res.code === accessVm.const.SUCCESS_CODE) {
                    	if(res.data!=null&&res.data.fileDetails!=null){
                    		accessVm.access.sysFile=res.data;
                    	}
                 
                    } else {
                          //alert("附件加载失败");
                        accessVm.$Modal.warning({
                            content: "附件加载失败"
                        })
                    }
                },
                error: function (e) {
                    console.log(e)
                }

            });
        },
    },

    watch() {

    },
   
})