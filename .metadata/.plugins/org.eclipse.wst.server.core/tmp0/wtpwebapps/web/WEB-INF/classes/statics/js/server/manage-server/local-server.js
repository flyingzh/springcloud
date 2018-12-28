let localServer = new Vue({
    el: "#local-server",
    data() {
        return {
            //修改内容
            modifyInfo: "",
            timeShow: false,
            updateShow: false,
            //服务器弹窗
            serveTemp: false,
            serverList: [],
            //时刻数组
            timeArr:[],
            timeObj: {
                hour: "00",
                min: "00",
            },
            list: [],
            index:false,
            oneInfo: {
                temp: false,
                id: "",
                //目标服务器编号
                sourceServerNo: "",
                //目标服务器IP
                sourceServerIp: "",
                //目标服务器类型
                sourceServerType: "",
                //数据同步时间cron
                cronTime: "",
                cronTimeList:[],
                //同步结果
                noticeResult: "",
                //mac
                serverMac: ""
            },
            oldTime: {},
            checkIndex: ""
        }
    },
    methods: {
        //获取服务器IP
        getServer(index) {
            console.log(index)
            //打开弹窗
            this.serveTemp = true;
        },
        //弹框确定
        enteringBarCode() {
            //获取到选中的数据
            let arr = [];
            this.serverList.map((item) => {
                if (item.temp == true) {
                    arr.push(item);
                }
            })

            //将获取到的数据去重
            this.list.map((item) => {
                arr = arr.filter((info) => {
                    return item.sourceServerIp != info.sourceServerIp;
                })
            })

            //将arr的temp变为false
            arr.map((item) => {
                item.temp = false;
            })
            //将数据铺入
            arr = JSON.parse(JSON.stringify(arr));
            this.list = this.list.concat(arr);

            //清空空数据
            this.list = this.list.filter((info) => {
                console.log(info);
                return info.sourceServerIp != "";
            })


            //将选中状态取消

            this.serverList.map((item) => {
                item.temp = false;
            })

        },
        //新增行
        addRow() {
            let obj = Object.assign({}, this.oneInfo)
            this.list.push(obj)
        },
        //选中行
        checkStatus(index) {
            //判断是否重复点击
            if (this.list[index].temp == false) {
                //将时刻清空
                this.timeArr = [];
                this.index=false;
                return;
            } else {
                //取消其他行的选中状态
                this.list.map((item) => {
                    item.temp = false;
                })
                this.index=true;
                this.list[index].temp = true;
                //将时间赋值  cronTimeList
                if(this.list[index].cronTimeList!=null && this.list[index].cronTimeList.length>0){
                    //存放时刻数组
                    let arr = [];
                    this.list[index].cronTimeList.map((item)=>{
                        let obj = {};
                        obj['hour'] = item.split(":")[0];
                        obj['min'] = item.split(":")[1];
                        arr.push(obj);
                    })

                    //赋值
                    this.timeArr = arr;
                }else{
                    //赋值
                    this.timeArr = [];
                }

            }
        },
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
        //删除行
        delRow() {
            //遍历  查看选取状态
            let delIndex = "";
            $.each(this.list, (index, item) => {
                if (item.temp == true) {
                    //获取到删除下标
                    delIndex = index;
                    return;
                }
            })
            this.list.splice(delIndex, 1)

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
                That.timeObj = Object.assign({}, this.timeArr[this.checkIndex]);
                That.updateShow = true;
                That.timeShow = true;
                That.oldTime = That.timeObj.hour + That.timeObj.min;
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
                this.timeArr.splice(this.checkIndex, 1);

                //将数据放入对象
                this.list.map((item)=>{
                    if(item.temp == true && item.cronTimeList != null){
                        item.cronTimeList.splice(this.checkIndex, 1);
                    }
                })
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
                    this.timeArr.map((item) => {

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
                    this.timeArr.splice(this.checkIndex, 1, info)

                    //将数据放入对象
                    this.list.map((item)=>{
                        if(item.temp == true && item.cronTimeList != null){
                            let nr = info.hour+":"+info.min;
                            item.cronTimeList.splice(this.checkIndex, 1, nr);
                        }
                    })
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
                if (this.timeArr.length < 1) {

                    let obj = Object.assign({}, this.timeObj)
                    //将数据铺入
                    this.timeArr.push(obj)

                    //将数据放入对象
                    this.list.map((item)=>{
                        if(item.temp == true && item.cronTimeList != null){
                            let info = obj.hour+":"+obj.min;
                            item.cronTimeList.push(info);
                        }
                    })
                    this.clear()

                } else {
                    let temp = true;
                    this.timeArr.map((item) => {
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
                        this.timeArr.push(obj)
                        //将数据放入对象
                        this.list.map((item)=>{
                            if(item.temp == true && item.cronTimeList != null){
                                let info = obj.hour+":"+obj.min;
                                item.cronTimeList.push(info);
                            }
                        })
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

        /*保存 */
        saveNServerData() {
            if(this.list !=null &&  this.list.length >0){
                if(this.index){
                    $.ajax({
                        type: "post",
                        async: false,
                        traditional: true,
                        dataType: 'json',
                        contentType: "application/json;charset=utf-8",
                        data:JSON.stringify(this.list),
                        url: contextPath + '/serverDataSyncConfig/saveNServerData',
                        success: function (r) {
                            if (r.code == "100100") {
                                localServer.$Modal.success({
                                    content: "保存成功"
                                })
                            } else if (r.code == "-2") {
                                localServer.$Modal.warning({
                                    title: '提示信息',
                                    content: r.msg
                                });
                            } else {
                                localServer.$Modal.warning({
                                    content: "系统出错，请联系相关技术人员"
                                })
                            }
                        },
                        error: function () {
                            console.log('服务器出错啦');
                        }
                    })
                }else {
                    localServer.$Modal.info({
                        content: "请选择数据源服务器设置"
                    })
                }
            }else {
                localServer.$Modal.info({
                    content: "请先选择数据源,然后设置时间,再执行保存"
                })
            }
        },
        getData() {
            var This = this;
            $.ajax({
                type: "post",
                async: false,
                url: contextPath + '/serverDataSyncConfig/finIpData',
                dataType: "json",
                success: function (r) {
                    if (r.code == "100100") {
                        This.serverList = r.data;
                        This.serverList.map((item) => {
                            item['temp'] = false;

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