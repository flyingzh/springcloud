let supplierScoreAdd = new Vue({
    el:"#supplier-score-add",
    data(){
        return {
            //时间弹窗
            timeShow:false,
            timeObj:{
                hour:"00",
                min:"00",
                sec:'00',
                id:"",
               // operatingRage:"",
               // operatingValue:""
            },
            //选中时间
            selectIndex:"",
            openTime:"",
            updateShow:false,
            oldTime:"",
            //存放时刻的数组
            timeArray:[],
            basic:{
                //订单范围
                orderScope:"3",
                //预期天数
                timeCost:"",
                //允许输入天数
                timeTemp:true,

            }
        }
    },
    methods:{
        //禁止输入其他内容
        clearNum(item,type,floor){
            return htInputNumber(item,type,floor)
        },
        handlerClose(){
          //  if(!this.addBody.status || this.addBody.status == 1){
                this.$nextTick(()=>{
                    this.$refs.closeModalRef.showCloseModal();
                });

                return false;
           // }

          //  return true;
        },
        closeModal(type){
            if(type === 'yes'){//提交数据
                this.save();
                this.exit(true);
            }else if(type === 'no'){//关闭页面
                this.exit(true);
            }
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
            //弹框显示中，不能操作其他按钮
            if(this.timeShow === true){
                this.$Modal.warning({
                    title:"提示信息",
                    content:"现在不能此操作,请关闭弹窗！"
                })
                return
            }
            if (this.selectIndex === "") {
                this.timeShow = true
                this.updateShow = false
            } else {
                $(".info").removeClass("br-color")
                this.selectIndex = "";
                this.timeShow = true;
                this.updateShow = false;
            }
        },
        //修改时刻
        modifyTime(){
            //弹框显示中，不能操作其他按钮
            if(this.timeShow === true){
                this.$Modal.warning({
                    title:"提示信息",
                    content:"现在不能此操作,请关闭弹窗！"
                })
                return
            }
            //console.log(this.selectIndex)
            //判断是否选取时刻
            if(this.selectIndex !== ""){
                //获取到要显示的信息
                this.timeObj = Object.assign({},this.timeArray[this.selectIndex]);
                this.updateShow = true;
                this.timeShow = true;
                this.oldTime = this.timeObj.hour + this.timeObj.min + this.timeObj.sec;
            }else{
                this.$Modal.warning({
                    title:"提示信息",
                    content:"请选择时刻！"
                })
            }
        },
        //删除时刻
        delTime(){
            //弹框显示中，不能操作其他按钮
            if(this.timeShow === true){
                this.$Modal.warning({
                    title:"提示信息",
                    content:"现在不能此操作,请关闭弹窗！"
                })
                return
            }
            //判断是否选取
            if(this.selectIndex===""){
                this.$Modal.warning({
                    title:"提示信息",
                    content:"请先选取时刻！"
                })

            }else{
                if(this.timeArray.length==1){
                    this.$Modal.warning({
                        title:"提示信息",
                        content: "至少保留一条设置！"
                    })
                    return
                }
                this.timeArray.splice(this.selectIndex,1)
                $(".info").removeClass("br-color")
                this.selectIndex = ""

            }
        },
        //选中时间
        selectTime(index){
        /*    if(this.timeShow){
                return;
            }*/
            this.selectIndex = index
            //console.log(this.timeArray[this.selectIndex]);
            //this.basic.orderScope = this.timeArray[this.selectIndex].operatingRage
            //this.basic.timeCost = this.timeArray[this.selectIndex].operatingValue
            //添加背景色
            $(".info").removeClass("br-color").eq(index).addClass("br-color")
           // this.dateChange()
        },
        //确认修改
        update(){
            //修改时刻
            //对于输入的一位数字前面填充0
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
                let info = Object.assign({}, this.timeObj)

                let  message = true;
                let nowTime = info.hour + info.min + info.sec;
                if(nowTime!=this.oldTime) {
                    this.timeArray.map((item) => {
                        if (item.hour == info.hour && item.min == info.min && item.sec == info.sec) {
                            this.$Modal.warning({
                                title:"提示信息",
                                content: "请输入不同时刻！"
                            })
                            message = false
                            return
                        }
                    })}
                    if(message){
                        //计算范围赋值
                     //   info.operatingRage = this.basic.orderScope;
                        //若选择其他，天数必填
                /*        if(info.operatingRage=="0"){
                            info.operatingValue = this.basic.timeCost;
                            if(!info.operatingValue){
                                this.$Modal.info({
                                    content:"请输入天数！"
                                })
                                return;
                            }
                        }else {
                            info.operatingValue = ""
                        }*/
                        this.timeArray.splice(this.selectIndex, 1, info)
                    }

                this.timeShow = false
                this.updateShow = false
            }else{
                this.$Modal.warning({
                    title:"提示信息",
                    content:"请输入合法时刻！"
                })
            }
        },
        //确定选择
        confirm(){
            //对于输入的一位数字前面填充0
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
                //计算范围赋值
               // this.timeObj.operatingRage = this.basic.orderScope;
               //若选择其他，天数必填
/*                if(this.timeObj.operatingRage=="0"){
                    this.timeObj.operatingValue = this.basic.timeCost;
                    if(!this.timeObj.operatingValue){
                        this.$Modal.info({
                            content:"请输入天数！"
                        })
                        return;
                    }
                }else {
                    this.timeObj.operatingValue = ""
                }*/
                if(this.timeArray.length<1){
                    let obj = Object.assign({},this.timeObj)
                    this.timeArray.push(obj)
                }else{
                    let temp = true;
                    this.timeArray.map((item)=>{
                        if(item.hour==this.timeObj.hour&&item.min==this.timeObj.min&&item.sec==this.timeObj.sec){
                            this.$Modal.warning({
                                title:"提示信息",
                                content:"请输入不同时刻！"
                            })
                            temp = false
                            return
                        }
                    })
                    if(temp) {
                        let obj = Object.assign({}, this.timeObj)
                        this.timeArray.push(obj)
                    }
                }
                //关闭弹框
                this.timeShow = false
                this.clear()
            }else{
                this.$Modal.warning({
                    title:"提示信息",
                    content:"请输入合法时刻！"
                })
            }
        },
        //取消
        cancel(){
            this.timeShow = false
        },
        //退出
     /*   exit(){
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
        //刷新
        refresh(){
            window.location.reload();
        },
        //保存
        save(){
            if(this.basic.orderScope === "0"&&!this.basic.timeCost){
                this.$Modal.warning({
                    title:"提示信息",
                    content:"请输入天数！"
                })
                return;
            }
            let arr = []
            this.timeArray.map((item)=>{

                let supplierScoreSet = {}
                supplierScoreSet.id = item.id
                supplierScoreSet.operatingTime = item.hour + ":" +item.min + ":" + item.sec
                supplierScoreSet.operatingRage = this.basic.orderScope
                supplierScoreSet.operatingValue = this.basic.timeCost
                arr.push(supplierScoreSet)
            })
            //console.log(arr)
            $.ajax({
                type: 'POST',
                cache:false,
                async:false,
                contentType: 'application/json;charset=utf-8',
                dataType:'json',
                data:JSON.stringify(arr),
                url:contextPath + '/supplierScoreSet/save',
                success(data){
                    if(data.code == 100100) {
                        supplierScoreAdd.$Modal.success({
                            title:"提示信息",
                            content: "保存成功！",
                            okText: "确定",
                            onOk() {
                                supplierScoreAdd.refresh()
                            }
                        })
                    }else {
                        supplierScoreAdd.$Modal.error({
                            title:"提示信息",
                            content:"保存失败！"
                        })
                    }
                },
                error(){
                    supplierScoreAdd.$Modal.error({
                        title:"提示信息",
                        content:"保存失败！"
                    })
                }
            })
        },
        //计算
        count(){
            let obj={}
            obj.operatingRage = parseInt(this.basic.orderScope)
           if(this.basic.orderScope === "0"&&!this.basic.timeCost){
               this.$Modal.warning({
                   title:"提示信息",
                   content:"请输入天数！"
               })
               return;
           }
            if(!this.basic.timeCost){
                obj.operatingValue = 0
            }else {
            obj.operatingValue = parseInt(this.basic.timeCost)}
            let that = this
            $.ajax({
                type: 'POST',
                cache:false,
                contentType: 'application/json;charset=utf-8',
                dataType:'json',
                data:JSON.stringify(obj),
                url: contextPath + '/supplierScoreSet/count',
                success(data) {
                    if (data.code == 100100) {
                        supplierScoreAdd.$Modal.success({
                            title:"提示信息",
                            content: "计算成功！",
                            okText: "确定"
                            /* ,onOk() {
                                 supplierScoreAdd.refresh()
                             }*/
                        })
                    } else {
                        supplierScoreAdd.$Modal.error({
                            title:"提示信息",
                            content: "计算失败！"
                        })
                    }
                },
                    error(){
                        supplierScoreAdd.$Modal.error({
                            title:"提示信息",
                            content:"保存失败！"
                        })
                    }
            })

        },
        //改变选择的范围
        dateChange(){
            //console.log(this.basic.orderScope)
            if(this.basic.orderScope === "0"){
                //当选择为其他的时候  自己输入时刻
                this.basic.timeTemp = false;
            }else{
                this.basic.timeTemp = true;
                this.basic.timeCost = "";
            }
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
            url:contextPath + '/supplierScoreSet/list',
            success(data){
                if(data.data){
                    let arr = []
                    data.data.map((item)=>{
                        let obj = {}
                        obj.id = item.id
                        if(supplierScoreAdd.basic.orderScope == "3"&&item.operatingRage!=3){
                        supplierScoreAdd.basic.orderScope = ""+item.operatingRage
                        supplierScoreAdd.basic.timeCost = item.operatingValue}

                        let timeDate = item.operatingTime.split(":")
                        obj.hour= timeDate[0]
                        obj.min= timeDate[1]
                        obj.sec= timeDate[2]
                        arr.push(obj)
                    })
                    that.timeArray = that.timeArray.concat(arr)
                    supplierScoreAdd.dateChange();
                }

            }
        })

    //console.log(this.timeArray)
    },

})