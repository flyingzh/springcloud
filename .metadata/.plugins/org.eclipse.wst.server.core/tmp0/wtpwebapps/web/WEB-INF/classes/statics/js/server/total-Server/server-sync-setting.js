let localServer = new Vue({
    el: "#sync-server",
    data() {
        return {
            timeShow: false,
            updateShow: false,
            modifyInfo:"",
            timeArray: [],
            timeObj: {
                hour: "00",
                min: "00",
            },
            oldTime: {},
            checkIndex: "",
            //是否修改数据
            htChange:false
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
        },
        //修改内容
        getIndex(val) {
            if (val == 1) {
                this.modifyInfo = 'h';
            } else if (val == 2) {
                this.modifyInfo = 'm';
            }
        },
        //增加时间
        addInfo() {
            //判断修改内容
            if (this.modifyInfo != "" || this.modifyInfo != null) {
                if (this.modifyInfo == "h") {
                    var num = parseFloat(this.timeObj.hour);
                    this.timeObj.hour = num + 1;
                    if (this.timeObj.hour == 24) {
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
        },
        //增加时刻
        addTime() {
            this.timeShow = true
            this.updateShow = false
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
                That.oldTime = That.timeObj.hour + That.timeObj.min ;

            }
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
                //修改数据
                this.htChange = true;
                $(".info").removeClass("br-back");
                this.checkIndex = "";
            }
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
                    //修改数据
                    this.htChange = true;
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

                    //修改数据
                    this.htChange = true;
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
                        this.timeArray.push(obj)
                        //修改数据
                        this.htChange = true;
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
            }
            this.modifyInfo = "";
        },

        saveGeneralServerNServerData(){
            let This = this;
            //转化数据格式
            let hourInfo = [];
            this.timeArray.map((obj)=>{
                let info = obj.hour+":"+obj.min;
                hourInfo.push(info);
            })

            //判断数据是否修改
            if(!this.htChange){
                this.$Modal.info({
                    title: '提示信息',
                    content: '没有更改时间数据不需要保存'
                });
                return;
            }

            $.ajax({
                type: "post",
                async:false,
                traditional: true,
                data:{cronTime:hourInfo},
                url: contextPath + '/serverDataSyncConfig/saveGeneralServerNServerData',
                dataType: "json",
                success: function (r) {
                    if(r.code=="100100"){
                        localServer.$Modal.success({
                            content:"保存成功"
                        })
                    }else if(r.code=="-2"){
                        localServer.$Modal.warning({
                            title: '提示信息',
                            content: r.msg
                        });
                    }else {
                        localServer.$Modal.warning({
                            content: "系统出错，请联系相关技术人员"
                        })
                    }
                },
                error: function () {
                    console.log('服务器出错啦');
                }
            })
        },
        getData() {
            var This = this;
            $.ajax({
                type: "post",
                async: false,
                url: contextPath + '/serverDataSyncConfig/findGeneralServerSettings',
                dataType: "json",
                success: function (r) {
                    if (r.code == "100100") {
                        r.data.map((item)=>{
                              let obj = {};
                               obj['hour'] = item.split(":")[0];
                               obj['min'] = item.split(":")[1];
                            This.timeArray.push(obj);
                        })
                    }
                },
                error: function () {
                    console.log('服务器出错啦');
                }
            })
        },
    },
    mounted() {
        this.getData();
    }
})