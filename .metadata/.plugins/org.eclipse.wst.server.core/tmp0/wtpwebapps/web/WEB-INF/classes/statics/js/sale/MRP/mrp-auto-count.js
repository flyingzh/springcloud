let mrpauto = new Vue({
    el:"#mrp-auto",
    data(){
        return {
            single:'',
            reload:false,
            selected:[],
            timeShow:false,
            openTime: '',
            oldTime:{},
            config:{
                //页表页数据
                url: contextPath + '/MRPCountSet/warehouseInfoList',
                colNames:
                    ['仓库代码', '仓库名称','id'],
                colModel:
                    [
                        {name: 'codes', index: 'codes', width: 130, align: "center"},
                        {name: 'name', index: 'name', width: 150, align: "center"},
                        {name: 'id', index: 'id', width: 130, align: "center",hidden:true},
                    ],
                multiselect:true
            },
            reload:false,
            tabId:"tabId",
            timeObj:{
                hour:"00",
                min:"00",
                sec:"00",
                id:"",
                storeId:[]
            },
            timeArray:[],
            delIndex:"",
            updateShow:false
        }
    },
    methods:{
        handlerClose(){
            if(this.htHaveChange){
                this.$nextTick(()=>{
                    this.$refs.closeModalRef.showCloseModal();
                });
                return false;
            }
            return true;
        },
        closeModal(type){
            if(type === 'yes'){//提交数据
                this.saveInfo();
                this.exit(true);
            }else if(type === 'no'){//关闭页面
                this.exit(true);
            }
        },
        htTestChange(){
            this.htHaveChange = true;
            console.log(333)
        },
        //清除数据
        clear(){
            this.timeObj = {
                hour:"00",
                min:"00",
                sec:"00"
            }
        },
       //增加时刻
        addTime(){
            if(this.timeShow === true){
                this.$Modal.warning({
                    title:"提示信息",
                    content:"现在不能此操作,请关闭弹窗！"
                })
               return
            }
                if (this.delIndex === "") {
                    this.timeShow = true
                    this.updateShow = false
                } else {
                    /*  this.$Modal.warning({
                          content:"新增不需要选择时刻"
                      })*/

                    $(".info").removeClass("br-back")
                    this.reload = !this.reload
                    // 取消所有选择行
                    //jQuery("#tabId").jqGrid('resetSelection')
                    this.selected = ""
                    this.delIndex = ""
                    this.timeShow = true
                    this.updateShow = false
                }
        },

        //修改时刻
        modifyTime(){
            let That = this
            if(this.timeShow === true){
                this.$Modal.warning({
                    title:"提示信息",
                    content:"现在不能此操作,请关闭弹窗！"
                })
                return
            }
            //判断是否选取
            if(this.delIndex===""){
                this.$Modal.warning({
                    title:"提示信息",
                    content:"请先选取时刻！"
                })

            }else{
                //表格重新加载
                this.reload = !this.reload;

                //获取到要显示的信息
                That.timeObj = Object.assign({},this.timeArray[this.delIndex]);
                That.selected = [];
                That.updateShow = true;
                That.timeShow = true;
                That.oldTime = That.timeObj.hour + That.timeObj.min + That.timeObj.sec;

            }
        },

        //删除时刻
        delTime(){
            if(this.timeShow === true){
                this.$Modal.warning({
                    title:"提示信息",
                    content:"现在不能此操作,请关闭弹窗！"
                })
                return
            }
            //判断是否选取
            if(this.delIndex===""){
                this.$Modal.warning({
                    title:"提示信息",
                    content:"请先选取时刻！"
                })

            }else{
                this.timeArray.splice(this.delIndex,1)
                $(".info").removeClass("br-back")
                //表格重新加载
                 this.reload = !this.reload
                //取消所有选择行
               // jQuery("#tabId").jqGrid('resetSelection')
                this.selected = ""
                this.delIndex = ""
                this.htHaveChange = true;

            }
        },
        //确定
        confirm(){
            this.timeShow = false
            if(this.timeObj.hour.length == 1){
                this.timeObj.hour = "0"+this.timeObj.hour;
            }
            if(this.timeObj.min.length == 1){
                this.timeObj.min = "0"+this.timeObj.min;
            }
            if(this.timeObj.sec.length == 1){
                this.timeObj.sec = "0"+this.timeObj.sec;
            }

            //进行时分秒判断 是否合法
            if(this.timeObj.hour>=0&&this.timeObj.hour<=23&&this.timeObj.hour.length==2&&
                this.timeObj.min>=0&&this.timeObj.min<=59&&this.timeObj.min.length==2&&
                this.timeObj.sec>=0&&this.timeObj.sec<=59&&this.timeObj.sec.length==2){

                //判断是否有相同
                if(this.timeArray.length<1){

                    if(this.selected.length>0){

                        let arr = []
                        //console.log(this.selected)
                        for(var i = 0;i<this.selected.length;i++){
                            let info = $("#"+this.tabId).jqGrid('getRowData',this.selected[i])
                            arr.push(info.id)
                        }

                        this.timeObj.storeId = arr

                        let obj = Object.assign({},this.timeObj)
                        //将数据铺入
                        this.timeArray.push(obj)
                        this.clear()
                    }else{
                        this.$Modal.warning({
                            title:"提示信息",
                            content:"请选择仓库ID！"
                        })
                    }

                }else{
                    let temp = true;
                    this.timeArray.map((item)=>{
                        if(item.hour==this.timeObj.hour&&item.min==this.timeObj.min&&item.sec==this.timeObj.sec){
                            this.$Modal.warning({
                                title:"提示信息",
                                content:"请输入不同时刻！"
                            })
                            temp = false
                            this.clear();
                        }
                    })

                    if(temp){
                        //判断是否获取仓库ID
                        if(this.selected.length>0){

                            let arr = []
                            // console.log(this.selected)
                            for(var i = 0;i<this.selected.length;i++){
                                let info = $("#"+this.tabId).jqGrid('getRowData',this.selected[i])

                                arr.push(info.id)
                            }

                            this.timeObj. storeId = arr
                            let obj = Object.assign({},this.timeObj)
                            //将数据铺入
                            this.timeArray.push(obj)
                            this.htHaveChange = true;
                            this.clear()
                        }else{

                            this.$Modal.warning({
                                title:"提示信息",
                                content:"请选择仓库ID！"
                            })
                        }
                    }
                }
            }else{
                this.$Modal.warning({
                    title:"提示信息",
                    content:"请输入合法时刻！"
                })

            this.clear()
            }

        },
        //取消
        cancel(){
            this.timeShow = false
            this.clear()
        },
       //退出
      /*  exit() {
            window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
        },*/
        exit(close) {
            if(close === true){
                window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
                return;
            }
            if(this.handlerClose()){
                window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
            }
        },
        //选取时刻
        actionShow(index) {
            if(this.timeShow === false){
                this.delIndex = index;

                //取消所有选择行
                jQuery("#tabId").jqGrid('resetSelection')
                this.timeArray[this.delIndex].storeId.map((item)=>{
                    jQuery("#tabId").jqGrid('setSelection',item);

                })
                this.selected = [].concat(this.timeArray[this.delIndex].storeId)
                $(".info").eq(this.delIndex).addClass("br-back").siblings().removeClass("br-back")
            }else{
                this.$Modal.warning({
                    title:"提示信息",
                    content:"现在不能选择时刻,请关闭弹窗！"
                })
            }
        },
        //显示
        show(){

        },
        //刷新
        refresh(){
            window.location.reload();
        },
        //确认修改
        update(){
            //修改时刻
            if(this.timeObj.hour.length == 1){
                this.timeObj.hour = "0"+this.timeObj.hour;
            }
            if(this.timeObj.min.length == 1){
                this.timeObj.min = "0"+this.timeObj.min;
            }
            if(this.timeObj.sec.length == 1){
                this.timeObj.sec = "0"+this.timeObj.sec;
            }
            //进行时分秒判断 是否合法
            if(this.timeObj.hour>=0&&this.timeObj.hour<=23&&this.timeObj.hour.length==2&&
                this.timeObj.min>=0&&this.timeObj.min<=59&&this.timeObj.min.length==2&&
                this.timeObj.sec>=0&&this.timeObj.sec<=59&&this.timeObj.sec.length==2) {

                console.log(this.selected)
                //判断是否获取仓库ID
                if (this.selected.length > 0) {
                    let arr = []
                    for (var i = 0; i < this.selected.length; i++) {
                        let info = $("#" + this.tabId).jqGrid('getRowData', this.selected[i])
                        arr.push(info.id)
                    }
                    this.timeObj.storeId = arr
                    let info = Object.assign({}, this.timeObj)

                    let  message = true;
                    let nowTime = info.hour + info.min + info.sec;
                    if(nowTime!=this.oldTime){
                        this.timeArray.map((item) => {

                            if (item.hour == info.hour && item.min == info.min && item.sec == info.sec) {
                                this.$Modal.warning({
                                    title:"提示信息",
                                    content: "请输入不同时刻！"
                                })

                                message = false
                                this.clear();
                            }
                        })
                    }

                    if(message){
                        this.timeArray.splice(this.delIndex, 1, info)
                    }
                    this.timeShow = false
                    this.updateShow = false
                    this.htHaveChange = true;
                  //$(".info").removeClass("br-back")
                  //  this.delIndex = ""
                  //  this.clear()
                } else {
                    this.$Modal.warning({
                        title:"提示信息",
                        content: "请选择仓库ID！"
                    })
                }
            }else{
                this.$Modal.warning({
                    title:"提示信息",
                    content:"请输入合法时刻！"
                })

                this.clear()
            }
        },
        saveInfo(){
           // console.log(this.timeArray)
            let arr = [];
            let This = this;
            let status = this.single === true ?1:0;
            this.timeArray.map((item)=>{

                let mrpCountSet = {}
                mrpCountSet.id = item.id
                mrpCountSet.countSetTime = item.hour + ":" +item.min + ":" + item.sec
                mrpCountSet.warehouseId = item.storeId.join(",")
                mrpCountSet.isEnable = status
                arr.push(mrpCountSet)
            })
            //console.log(arr)
            $.ajax({
                    type: 'POST',
                    cache:false,
                    async:false,
                    contentType: 'application/json;charset=utf-8',
                    dataType:'json',
                    data:JSON.stringify(arr),
                    url:contextPath + '/MRPCountSet/save',
                    success(data){
                        if(data.code == 100100) {
                            mrpauto.$Modal.success({
                                content: "保存成功！",
                                okText: "确定",
                                onOk() {
                                    mrpauto.refresh()
                                }
                            })
                            This.htHaveChange = false;
                        }else {
                            mrpauto.$Modal.error({
                                content:"保存失败！"
                            })
                        }
                    },
                    error(){
                        mrpauto.$Modal.error({
                            content:"服务器异常！"
                        })
                    }
            })
/*            let status = this.single === true ?1:0;

            $.ajax({
                type: 'POST',
                cache: false,
                async:false,
                data:{
                    enabledState:status
                },
                url: contextPath + '/MRPCountSet/saveSetStatus',
                success(data){
                   // console.log(data)
                }
            })*/
        }
    },
    watch:{
        selected(){
           console.log(this.selected)
        }
    },
    mounted(){
        window.handlerClose = this.handlerClose;
        this.openTime = window.parent.params.openTime
        // console.log(this.openTime)
        let that = this
        $.ajax({
            type: 'POST',
            cache:false,
            url:contextPath + '/MRPCountSet/list',
            success(data){

                let arr = []
                data.data.map((item)=>{

                    let obj = {}
                    obj.id = item.id

                    let timeDate = item.countSetTime.split(":")
                    obj.hour= timeDate[0]
                    obj.min= timeDate[1]
                    obj.sec= timeDate[2]
                    obj.storeId = item.warehouseId.split(",")
                    arr.push(obj)
                })
                that.timeArray = that.timeArray.concat(arr)
            },
            error(){
                mrpauto.$Modal.error({
                    content:"服务器异常！"
                })
            }
        }),

        $.ajax({
            type: 'POST',
            cache: false,
            url: contextPath + '/MRPCountSet/getSetStatus',
            success(data){
                mrpauto.single = data.data === 0 ? false : true;
               // console.log(mrpauto.single)
            }
        })

    }
})