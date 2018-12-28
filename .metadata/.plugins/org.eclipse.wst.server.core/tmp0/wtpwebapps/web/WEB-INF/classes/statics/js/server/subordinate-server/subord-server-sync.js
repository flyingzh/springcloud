let localServer = new Vue({
    el: "#async-server",
    data() {
        return {
            htHaveChange:false,
            //退出按钮
            openTime: '',
            timeShow: false,
            updateShow: false,
            serverList: [
                {}
            ],
            timeArray: [],
            timeObj: {
                hour: "00",
                min: "00",
                sec: "00",
            },
            oldTime: {},
            oldTime: {},
            checkIndex: ""
        }
    },
    methods: {
        //选中时刻
        actionShow(index) {
            if (this.timeShow === false) {
                this.checkIndex = index;
                $(".info").eq(this.checkIndex).addClass("br-back").siblings().removeClass("br-back")
            } else {
                this.$Modal.warning({
                    title: "提示信息",
                    content: "现在不能选择时刻,请关闭弹窗！"
                })
            }
        },
        //修改内容
        getIndex(val) {
            if (val == 1) {
                this.modifyInfo = 'h';
            } else if (val == 2) {
                this.modifyInfo = 'm';
            }
            this.htTestChange()
        },
        //增加时间
        addInfo() {

            //判断修改内容
            if (this.modifyInfo != "" || this.modifyInfo != null) {
                if (this.modifyInfo == "h") {
                    var num = parseFloat(this.timeObj.hour);
                    this.timeObj.hour = num + 1;
                    if (this.timeObj.hour === 24) {
                        this.timeObj.hour = 0;
                    }
                    this.timeObj.hour = "" + this.timeObj.hour;
                } else if (this.modifyInfo == "m") {
                    var num = parseFloat(this.timeObj.min);
                    this.timeObj.min = num + 1;
                    if (this.timeObj.min == 60) {
                        this.timeObj.min = 0;
                    }
                    this.timeObj.min = "" + this.timeObj.min;
                }
            } else {
                return;
            }
            this.htTestChange()
        },
        //减少时间
        reduceInfo() {
            //判断修改内容
            if (this.modifyInfo != "" || this.modifyInfo != null) {
                if (this.modifyInfo == "h") {
                    var num = parseFloat(this.timeObj.hour);
                    this.timeObj.hour = num - 1;
                    if (this.timeObj.hour == -1) {
                        this.timeObj.hour = 23;
                    }
                    this.timeObj.hour = "" + this.timeObj.hour;
                } else if (this.modifyInfo == "m") {
                    var num = parseFloat(this.timeObj.min);
                    this.timeObj.min = num - 1;
                    if (this.timeObj.min == -1) {
                        this.timeObj.min = 59;
                    }
                    this.timeObj.min = "" + this.timeObj.min;
                }
            } else {
                return;
            }
            this.htTestChange()
        },
        //增加时刻
        addTime() {
            this.timeShow = true
            this.updateShow = false;
            this.htTestChange()
        },
        //修改时刻
        modifyTime() {
            let That = this
            if (this.timeShow === true) {
                this.$Modal.warning({
                    title: "提示信息",
                    content: "现在不能此操作,请关闭弹窗！"
                })
                return
            }
            //判断是否选取
            if (this.checkIndex === "") {
                this.$Modal.warning({
                    title: "提示信息",
                    content: "请先选取时刻！"
                })

            } else {


                //获取到要显示的信息
                That.timeObj = Object.assign({}, this.timeArray[this.checkIndex]);
                That.updateShow = true;
                That.timeShow = true;
                That.oldTime = That.timeObj.hour + That.timeObj.min + That.timeObj.sec;

            }
            That.htTestChange()
        },
        //删除时刻
        delTime() {
            if (this.timeShow === true) {
                this.$Modal.warning({
                    title: "提示信息",
                    content: "现在不能此操作,请关闭弹窗！"
                })
                return
            }
            //判断是否选取
            if (this.checkIndex === "") {
                this.$Modal.warning({
                    title: "提示信息",
                    content: "请先选取时刻！"
                })

            } else {
                this.timeArray.splice(this.checkIndex, 1);
                $(".info").removeClass("br-back");
                this.checkIndex = "";
            }
            this.htTestChange()
        },
        //确认修改
        update() {
            //修改时刻
            if (this.timeObj.hour.length == 1) {
                this.timeObj.hour = "0" + this.timeObj.hour;
            }
            if (this.timeObj.min.length == 1) {
                this.timeObj.min = "0" + this.timeObj.min;
            }

            //进行时分秒判断 是否合法
            if (this.timeObj.hour >= 0 && this.timeObj.hour <= 23 && this.timeObj.hour.length == 2 &&
                this.timeObj.min >= 0 && this.timeObj.min <= 59 && this.timeObj.min.length == 2) {

                let info = Object.assign({}, this.timeObj)

                let message = true;
                let nowTime = info.hour + info.min;
                if (nowTime != this.oldTime) {
                    this.timeArray.map((item) => {

                        if (item.hour == info.hour && item.min == info.min) {
                            this.$Modal.warning({
                                title: "提示信息",
                                content: "请输入不同时刻！"
                            })

                            message = false;
                            this.clear();
                        }
                    })
                }

                if (message) {
                    this.timeArray.splice(this.checkIndex, 1, info)
                }
                this.timeShow = false;
                this.updateShow = false;
                this.modifyInfo = "";
                this.clear();

            } else {
                this.$Modal.warning({
                    title: "提示信息",
                    content: "请输入合法时刻！"
                })

                this.clear()
            }
            this.htTestChange()
        },
        //确定
        confirm() {
            this.timeShow = false
            if (this.timeObj.hour.length == 1) {
                this.timeObj.hour = "0" + this.timeObj.hour;
            }
            if (this.timeObj.min.length == 1) {
                this.timeObj.min = "0" + this.timeObj.min;
            }

            //进行时分秒判断 是否合法
            if (this.timeObj.hour >= 0 && this.timeObj.hour <= 23 && this.timeObj.hour.length == 2 &&
                this.timeObj.min >= 0 && this.timeObj.min <= 59 && this.timeObj.min.length == 2) {

                //判断是否有相同
                if (this.timeArray.length < 1) {
                    let obj = Object.assign({}, this.timeObj)
                    //将数据铺入
                    this.timeArray.push(obj)
                    this.clear()

                } else {
                    let temp = true;
                    this.timeArray.map((item) => {
                        if (item.hour == this.timeObj.hour && item.min == this.timeObj.min) {
                            this.$Modal.warning({
                                title: "提示信息",
                                content: "请输入不同时刻！"
                            })
                            temp = false
                            this.clear();
                        }
                    })
                    if (temp) {
                        let obj = Object.assign({}, this.timeObj)
                        //将数据铺入
                        this.timeArray.push(obj);
                        this.clear()
                    }
                }
            } else {
                this.$Modal.warning({
                    title: "提示信息",
                    content: "请输入合法时刻！"
                })

                this.clear()
            }
            this.htTestChange()

        },
        //取消
        cancel() {
            this.timeShow = false
            this.clear()
        },
        //清除数据
        clear() {
            this.timeObj = {
                hour: "00",
                min: "00",
                sec: "00",
            }
            this.modifyInfo = "";
        },
        //保存
        save(){
            let This = this;
            let syncDatas = [];
            if(this.timeArray.length < 1){
                This.$Modal.info({title:'提示信息',content:'请先设置同步时间！'});
                return;
            }
            this.timeArray.forEach((item) => {
                let syncTime = item.hour + ":" + item.min + ":" + item.sec
                syncDatas.push(syncTime);
            });
            $.ajax({
                url: contextPath + "/subordinateController/saveSyncTime",
                data: JSON.stringify(syncDatas),
                contentType: 'application/json;charset=utf-8',
                type: 'post',
                async:false,
                dataType: 'json',
                success: function (data) {
                    window.top.home.loading('hide');
                    This.htHaveChange = false;
                    if(data.code == '100100'){
                        This.$Modal.success({title:'提示信息',content:'同步时间设置成功！'})
                    }else {
                        This.$Modal.info({title:'提示信息',content:data.msg})
                    }
                }
            })
        },
        querySyncTime: function () {
            let This = this;
            $.ajax({
                url: contextPath + "/subordinateController/getSyncTime",
                type: 'post',
                dataType: 'json',
                success: function (data) {
                    if(data.data.length > 1){
                        data.data.forEach(item => {
                            let timeObj ={};
                            let syncTime = item.split(" ");
                            timeObj.hour = syncTime[2];
                            if(timeObj.hour.length == 1){
                                timeObj.hour = "0"+timeObj.hour;
                            }
                            timeObj.min = syncTime[1];
                            if(timeObj.min.length == 1){
                                timeObj.min = timeObj.min+"0";
                            }
                            timeObj.sec = syncTime[0];
                            This.timeArray.push(timeObj);
                        });
                    }
                }
            })
        },
        handlerClose(){
            if(this.htHaveChange){
                this.$nextTick(()=>{
                    this.$refs.closeModalRef.showCloseModal();
                });

                return false;
            }

            return true;
        },
        closeModal(type) {
            if (type === 'yes') {//提交数据
                this.save('save');
                this.exit(true)
            } else if (type === 'no') {//关闭页面
                this.exit(true);
            }
        },
        exit(close){

            if(close === true){
                window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
                return false;
            }
            if(this.handlerClose()){
                window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
            }
        },
        htTestChange(){
            this.htHaveChange = true;
        },
    },
    created(){
        window.handlerClose = this.handlerClose;
        this.openTime = window.parent.params.openTime;
    },
    mounted(){
        this.querySyncTime();
    }
})