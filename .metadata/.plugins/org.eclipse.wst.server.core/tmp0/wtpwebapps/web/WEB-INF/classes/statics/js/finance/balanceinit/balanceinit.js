layui.use('upload', function(){
    var upload = layui.upload;

    //执行实例
    var uploadInst = upload.render({
        elem: '#importExcel' //绑定元素
        ,url: contextPath+'/balance/importExcel' //上传接口
        ,accept:"file"
        ,exts:"xls|xlsx"
        ,size:51200
        ,done: function(res){

            var _text = '';
            //上传完毕回调
            if(100100!=res.code){
                // alert("导入失败:"+res.msg)
                _text = "导入失败:"+res.msg;
            }else{
                // alert("导入成功")
                _text = "导入成功";
            }
            _vm.$Modal.warning({
                title: '提示信息',
                content: _text
            });
        }
        ,error: function(){
            //请求异常回调
            _vm.$Modal.warning({
                title: '提示信息',
                content: '导入异常'
            });
        }
    });
});
var _vm = new Vue({
    el: '#ledger-enter',
    data: {
        _index: false,
        openTime: '',   //用于控制退出按钮
        currencyId: 1,
        currAccountId: -1, //当前科目ID
        currencyArr: [],
        //itemAll: {}, //核算项目明细
        isFristPeriod: false, // 是否第一期
        tableData: [],
        isPlAccount: false,
        isNotToSave:false,//是否提示用户需要保存
        exchangeRate: 0,
        relateShow: false,
        subjectData: [],
        relateCols: [],
        isSynthesize: false, // 是否选择了综合本位币
        allShow: false,
        detailVisible: false,
        detailTitle:'',
        balanceVisible: false, //试算平衡
        isBalance:'',
        trialList:[],  // 试算平衡检查的数据
        deleteVisible:false,
        deleteLoading:false,
        defaultCurrency:"", //本位币
        iscCuccrency:"", //综合本位币
        selectId:'', //记录从哪个勾进入核算项目
        parentData:"", //弹出核算项目框设置父科目列表  id_code,id_code,
        isDelete:false,
        standardMoney : 0,
        oldCurrencyId:''
    },
    created: function(){
        var _this = this;
        var _url = contextPath+'/balance/currencyList';
        $.ajax({
            type: 'post',
            data: '',
            url: _url,
            dataType: 'json',
            success: function(res){
                let data = res.data;
                if(data && data.length>0){
                    _this.currencyArr = data;
                    _this.currencyId = _this.currencyArr[0].value;
                    _this.oldCurrencyId = _this.currencyArr[0].value;
                    _this.exchangeRate = _this.currencyArr[0].rate;
                    _this.defaultCurrency = _this.currencyArr[0].value;
                    _this.iscCuccrency = _this.currencyArr[_this.currencyArr.length-1].value;
                    _this.standardMoney = _this.currencyArr[0].value;
                }
            },
            error: function(code){
                console.log(code);
            }
        });
    },
    mounted: function () {
        this.ajaxTabel();
        this.openTime = window.parent.params && window.parent.params.openTime;
    },
    methods: {
        endInitialization(){
            window.top.home.loading('show');
            var _this = this;
            var _url = contextPath+'/balance/endInitialization';
            $.ajax({
                type: 'post',
                data: '',
                url: _url,
                dataType: 'json',
                success: function(res){
                    var _text = '';
                    if (res.code === '100100'){
                        _text = "初始化成功";
                        _this.reload();
                    }else {
                        _text = "初始化失败:"+res.msg;
                    }
                    _this.$Modal.warning({
                        title: '提示信息',
                        content: _text
                    });
                },
                error: function(code){
                    console.log(code);
                },
                complete: function () {
                    window.top.home.loading('hide');
                }
            });
        },
        inverseInitialization(){
            window.top.home.loading('show');
            var _this = this;
            var _url = contextPath+'/balance/inverseInitialization';
            $.ajax({
                type: 'post',
                data: '',
                url: _url,
                dataType: 'json',
                success: function(res){
                    var _text = '';
                    if (res.code === '100100'){
                        _text = "反初始化成功";
                        _this.reload();
                    }else {
                        _text = "反初始化失败:"+res.msg;

                    }
                    _this.$Modal.warning({
                        title: '提示信息',
                        content: _text
                    });
                },
                error: function(code){
                    console.log(code);
                },
                complete: function () {
                    window.top.home.loading('hide');
                }
            });
        },
        // 试算平衡
        is_balance(){
            var _this = this;
            _this.notToSave(1);
            console.log("_this.isNotToSave",_this.isNotToSave)
            if (_this.isNotToSave){
                return;
            }
            var _url = contextPath+'/balance/trialBalance?currencyId='+_this.currencyId;
            $.ajax({
                type: 'post',
                data: '',
                url: _url,
                dataType: 'json',
                success: function(res){
                    let data = res.data;
                    _this.isBalance = data.trialBalance;
                    _this.trialList = data.trialList;
                },
                error: function(code){
                    console.log(code);
                }
            });
            this.balanceVisible = true;
        },

        // 删除核算数据
        del_data(){
            //remove
            this.$Modal.confirm({
                title: '操作确认',
                content: '<p>确认要删除所选数据？</p>',
                onOk: () => {

                var delIds = "";
            var countIds = "";
            this.subjectData.filter(row=> row.show).forEach(item=>{
                if(item.id!=-1){
                if(delIds.length>0){
                    delIds = delIds+",";
                }
                delIds = delIds+item.id;
            }
        });
            if(this.parentData){
                var arr = this.parentData.split(",");
                arr.forEach(str=>{
                    if(countIds.length>0){
                    countIds = countIds+",";
                }
                countIds = countIds+str.split("_")[0];
            });
            }


            if(delIds.length>0 && countIds.length>0){
                if(this.updateing){
                    alter("正在修改数据!");
                    return false;
                }
                var _this = this;
                var _url = contextPath+'/balance/delBalanceForItem?delIds='+delIds+"&countIds="+countIds;
                $.ajax({
                    type: 'post',
                    data: '',
                    url: _url,
                    dataType: 'json',
                    success: function(res){
                        var _text = '';
                        if(100100==res.code){
                            _this.subjectData = _this.subjectData.filter(row=> !row.show);
                            _this.reCount();
                            _this.parentData = "";
                            _text = "删除失成功";
                        }else{
                            _text = "删除失败:"+res.msg;
                        }
                        _text.$Modal.warning({
                            title: '提示信息',
                            content: _text
                        });
                        _this.updateing = false;
                        _this.isDelete = true;

                    },
                    error: function(code){
                        console.log(code);
                    }
                });
            }else{
                this.subjectData = this.subjectData.filter(row=> !row.show);
                this.reCount();
                this.parentData = "";
            }
        },
        });
        },
        click_all(){
            this.allShow = !this.allShow;
            this.subjectData.forEach(row=>{
                row.show = this.allShow;
        })
        },
        // 切换本行是否选中
        change_tr(row){
            row.show = !row.show;
            let count = 0;
            this.subjectData.forEach(row=>{
                if(row.show) count++;
        })
            if(count===this.subjectData.length){
                this.allShow = true;
            } else {
                this.allShow = false;
            }
        },
        //
        select(value){
            console.log(value)
        },
        // 设置禁用
        input_disable(item){
            if (this._index){
                return true;
            }
            let relate = item.relateItem === 1 ? true : false;
            let isIsc = this.currencyId === this.iscCuccrency;
            return item.isCountLv || relate || this.isSynthesize ? true : false || isIsc;

        },
        // 切换币种
        change_currency(value) {
            var _that = this;
            this.notToSave(2);
            if (_that.isNotToSave){
                return;
            }
            // console.log("----",event)
            // let value = event.target.value;
            let find = this.currencyArr.find(x => {
                return x.value == value;
            })
            find && (this.exchangeRate = find.rate);
            this.ajaxTabel();
            if(value===this.iscCuccrency){
                this.isSynthesize = true;
            }else{
                this.isSynthesize = false;;
            }
        },
        // 设置是否有损益列
        click_tr(item) {
            this.isPlAccount = item.isPlAccount;
        },
        // 格式化数字
        formatNum(f, digit) {
            var m = Math.pow(1000, digit);
            return parseInt(f * m, 10) / m;
        },
        // 修改金额后触发其他币种
        blur_money(row, attr) {
            row[attr + 'For'] = (this.formatNum(row[attr + 'For'] * 1, 1)).toFixed(2);
            let num = this.formatNum(row[attr + 'For'] * this.exchangeRate, 1)
            this.currencyId !== this.defaultCurrency && (row[attr] = num.toFixed(2));
            row["isChange"] = true;
            // 失去焦点时候，父级的
            if (!row.parentCode) return;

            let childArr = this.tableData.filter((item) => {
                return item.parentCode === row.parentCode
            })
            let find = this.tableData.find((item) => {
                return item.accountId === row.parentCode;
        })
            let totalOld = 0,
                totalNew = 0;
            childArr.forEach(item => {
                totalOld += this.formatNum(item[attr + 'For'] * 1, 1)
            totalNew += this.formatNum(item[attr + 'For'] * this.exchangeRate, 1)
        })

            find&&(find[attr + 'For'] = totalOld.toFixed(2));
            this.currencyId !== this.defaultCurrency && (find&&(find[attr] = totalNew.toFixed(2)));
            find&&(find['isChange'] = true);
            if(find&&find.parentCode){
                this.blur_money(find, attr);
            }

        },
        // 阻止冒泡
        stop_buble() { },
        // 请求科目列表
        ajaxTabel(){
            var _this = this;
            var _url = contextPath+'/balance/list?currencyId='+_this.currencyId;
            $.ajax({
                type: 'post',
                data: '',
                url: _url,
                dataType: 'json',
                success: function(res){
                    let data = res.data;
                    console.log("data",data)
                    data.balanceList.map(row=>{
                        row.ytdCreditFor = (row.ytdCreditFor?row.ytdCreditFor : 0).toFixed(2);
                        row.beginBalance = (row.beginBalance?row.beginBalance:0).toFixed(2);
                        row.ytdDebit = (row.ytdDebit?row.ytdDebit:0).toFixed(2);
                        row.plAmount = (row.plAmount?row.plAmount:0).toFixed(2);
                        row.ytdCredit = (row.ytdCredit?row.ytdCredit:0).toFixed(2);
                        row.plAmountFor = (row.plAmountFor?row.plAmountFor:0).toFixed(2);
                        row.beginBalanceFor = (row.beginBalanceFor?row.beginBalanceFor:0).toFixed(2);
                        row.ytdDebitFor = (row.ytdDebitFor?row.ytdDebitFor:0).toFixed(2);
                    });
                    _this.tableData = data.balanceList;
                    // _this.currencyId = data.currencyId;
                    _this._index = data.index;
                    // _this.isFristPeriod = false;
                    _this.isFristPeriod = data.fristPeriod;
                    _this.isPlAccount = data.isPlAccount;
                },
                error: function(code){
                    console.log(code);
                }
            });
        },
        //是否存在需要保存的数据
        notToSave (type){
            var balanceList = new Array();
            var reg = 0;
            // console.log("_that.tableData",this.tableData)
            if(this.tableData && this.tableData.length>0) {
                for (var i = 0; i < this.tableData.length; i++) {
                    //金额有变化
                    if (this.tableData[i].isChange && this.tableData[i].isChange == true) {

                        balanceList[reg] = this.tableData[i];
                        reg++
                    }
                }
            }
            console.log(balanceList,"balanceList")
            if(balanceList.length>0){
                this.isNotToSave = true;
                console.log("save_balance(type);----",type);
                this.$Modal.confirm({
                    title: '系统提示',
                    content: '<p>是否要保存已修改的数据</p>',
                    onOk: () => {
                        console.log("save_balance(type);",type);
                        this.save_balance(type);
                    },
                    onCancel: () => {
                        this.currencyId = this.oldCurrencyId;
                        this.$Message.info('取消保存');
                    }
            });
            }
            

        },
        //保存科目余额信息
        save_balance(type){
            //综合本位币不能修改
            var _this = this;
            if(this.currencyId == this.iscCuccrency){
                // alert("综合本位币下数据无法修改");
                _this.$Modal.warning({
                    title: '提示信息',
                    content: '综合本位币下数据无法修改'
                });
                return;
            }
            var params = {};
            params.isFristPeriod = this.isFristPeriod;
            params.currencyId = this.currencyId;
            var balanceList = new Array();
            var reg = 0;
            if(this.tableData && this.tableData.length>0){
                for(var i=0; i<this.tableData.length; i++){
                    /*//有核算项目不能修改
                    if(parseInt(this.tableData[i].relateItem) == 1){
                        continue;
                    }
                    //汇总类型科目不能修改
                    if(this.tableData[i].isCountLv == true){
                        continue;
                    }*/
                    //金额有变化
                    if(this.tableData[i].isChange && this.tableData[i].isChange==true){
                        this.tableData[i].isChange = false;
                        balanceList[reg] = this.tableData[i];
                        reg++
                    }
                }
            }
            if(balanceList.length<=0){
                // alert("没有要修改的数据");
                _this.$Modal.warning({
                    title: '提示信息',
                    content: '没有要修改的数据'
                });
                return;
            }
            if(this.updateing){
                // alter("正在修改数据!");
                _this.$Modal.warning({
                    title: '提示信息',
                    content: '正在修改数据!'
                });
                return false;
            }
            console.log("defaultCurrency 本位币id",_this.defaultCurrency);
            console.log("currencyId 页面币别id",_this.currencyId)
            //当前选择为本位币时给原币和本位币赋值相同
            if (_this.defaultCurrency === _this.currencyId) {
                for (var i = 0; i < balanceList.length; i++) {
                    balanceList[i].beginBalance = balanceList[i].beginBalanceFor;
                    balanceList[i].ytdDebit = balanceList[i].ytdDebitFor;
                    balanceList[i].ytdCredit = balanceList[i].ytdCreditFor;
                }
            }
            params.balanceList = balanceList;
            console.log("params.balanceList====>",params.balanceList)

            var _url = contextPath+"/balance/updateList";
            $.ajax({
                type: 'post',
                data: JSON.stringify(params),
                url: _url,
                dataType: 'json',
                contentType : 'application/json;charset=utf-8',
                success: function(res) {
                    var _text = '';
                    if ("100100"==res.code) {
                        _this.ajaxTabel();
                        _this.isNotToSave = false;
                         // alert("保存成功:"+res.msg);

                        console.log("tyep",type,_this.isNotToSave)

                        if(type == 1){
                            _this.is_balance();
                        }else if(type == 2){
                            _this.change_currency(_this.currencyId);
                        }
                    }else{
                        _text = "修改失败:"+res.msg;
                    }
                    _this.$Modal.warning({
                        title: '提示信息',
                        content: _text
                    });

                },
                error: function(code){
                    console.log(code);
                }

            });
            this.updateing = false;
        },
        get_parent_data(parentCode){
            var parentData="";

            let find = this.tableData.find(item => {
                return item.accountId === parentCode;
        })
            if(find){
                parentData = find.id +"_"+find.accountId;
                if(find.parentCode){
                    var result = this.get_parent_data(find.parentCode)
                    if(result){
                        parentData = parentData+","+result;
                    }
                }
            }
            return parentData;
        },
        // 弹出核算框
        show_relate(row) {
            this.selectId = row.id;
            this.currAccountId  = row.accountId;
            this.currAccountCode = row.accountCode;
            this.detailTitle = `核算项目初始余额录入（科目：${row.accountCode} ${row.accountName}）`;
            var _this = this;
            var _url = contextPath+'/balance/itemList?currencyId='+_this.currencyId
                +'&accountId='+row.accountId;
            this.parentData = "";
            $.ajax({
                type: 'post',
                data: '',
                url: _url,
                dataType: 'json',
                success: function(res){
                    _this.parentData = row.id+"_"+row.accountId+","+_this.get_parent_data(row.parentCode);
                    let data = res.data;
                    _this.relateCols = data.itemClassList;
                    if(data&&!data.itemClassList) return;
                    data.itemBalanceList.forEach(item =>{
                        _this.$set(item, 'show', false)
                })
                    data.itemBalanceList.forEach(item =>{
                        item.itemDetail.forEach(itemDetail => {
                        itemDetail.init = itemDetail.itemClass+'._.'+itemDetail.itemId+'._.'+itemDetail.itemClassName+'._.'+itemDetail.itemCode+'._.'+itemDetail.itemName;
                    itemDetail.defaultInit = itemDetail.init;
                })
                })
                    _this.subjectData = data.itemBalanceList;

                },
                error: function(code){
                    console.log(code);
                }
            });
            _this.$nextTick(()=>{
                _this.detailVisible = true;
        })
        },
        select_item(event){
            //选择核算项目 校验重复
            console.log(event);
        },
        insert() {
            // 插入
            let arr = []
            this.relateCols.forEach(item=>{
                let it = {
                    id: -1,
                    itemId: "",
                    itemCode: "",
                    itemName: "",
                    itemClass: item.itemClass,
                    itemClassName: item.itemClassName,
                }
                arr.push(it)
        })
            let data = {
                itemDetail: arr,
                id: -1,
                beginBalanceFor: "",
                beginBalance: "",
                ytdDebitFor: "",
                ytdDebit: "",
                ytdCreditFor: "",
                ytdCredit: "",
                plAmountFor: "",
                plAmount: "",
                show:false,
            }
            this.subjectData.push(data);
        },
        del(){
            let arr = this.subjectData.filter(row=> row.show);
            if(!arr.length){
                this.$Message.info('请先选择要删除的数据！');
                return ;
            }
            this.del_data();
        },
        checkSubject(){
            //核算项目重复校验
            var result = true;
            var itemSet = new Set();
            this.subjectData .forEach(subject=>{
                let init = "";
            subject.itemDetail.forEach(item=>{
                init = init + "_" + item.init;
        });
            if(itemSet.has(init)){
                result = false;
                return;
            }
            itemSet.add(init);
        });
            return result;
        },
        reCount(){
            //重新计算统计行数金额
            if(!this.parentData){
                return;
            }

            var countObj = {
                beginBalanceFor:0,
                beginBalance:0,
                ytdDebitFor:0,
                ytdDebit:0,
                ytdCreditFor:0,
                ytdCredit:0,
                plAmountFor:0,
                plAmount:0,
            };

            //核算项目变更金额求和
            //过滤删除核算项目
            this.subjectData.forEach(item => {
                for(var key in countObj){
                countObj[key] = (parseFloat(countObj[key])+parseFloat(item[key])).toFixed(2);
            }
        });

            //匹配父层科目数据
            var dataList = [];
            var codeList = [];
            var codeArr = this.parentData.split(',')
            codeArr.forEach(code => {
                codeList.push(code.split("_")[1]);
        })

            codeList.forEach(code=>{
                let data = this.tableData.find(row=> {
                    return row.accountId == code;
        })
            dataList.push(data);
        });
            console.log("data",dataList)
            //金额统计到父层科目
        dataList.forEach(data=>{
                console.log("data",data,'=======',countObj)
                for(var key in countObj){
                data&&(data[key] = (parseFloat(countObj[key])).toFixed(2));
            }
        });
        //  var item = [];
        //  if(dataList.length){
        //     for(var i = 0;i<dataList.length;i++){
        //         if(dataList[i].isCountLv){
        //             dataList[i].beginBalanceFor = dataList[i].beginBalanceFor ? dataList[i].beginBalanceFor : 0;
        //             dataList[i].ytdCreditFor = dataList[i].ytdCreditFor ? dataList[i].ytdCreditFor : 0;
        //             dataList[i].ytdDebitFor = dataList[i].ytdDebitFor ? dataList[i].ytdDebitFor : 0;
        //             dataList[i].plAmountFor = dataList[i].plAmountFor ? dataList[i].plAmountFor : 0;
        //             dataList[i].beginBalance = dataList[i].beginBalanceFor;
        //             dataList[i].ytdCredit = dataList[i].ytdCreditFor;
        //             dataList[i].ytdDebit = dataList[i].ytdDebitFor;
        //             dataList[i].plAmount = dataList[i].plAmountFor;
        //         item.push(dataList[i]);
        //         }
        //     }
        //  }
        //     console.log("find",item);
        // if(item.length){
        //    // this.saveSubject(item);
        // }

        },
        // saveSubject(find){
        //     var _url = contextPath+"/balance/updateList";
        //     var params = {};
        //     params.isFristPeriod = this.isFristPeriod;
        //     params.currencyId = this.currencyId;
        //     params.balanceList = find;
        //     var data = [];
        //     console.log("find",params)
        //     $.ajax({
        //         type: 'post',
        //         data: JSON.stringify(params),
        //         url: _url,
        //         dataType: 'json',
        //         contentType : 'application/json;charset=utf-8',
        //         success: function(res){
        //             if(100100==res.code) {
        //
        //             }
        //         },
        //         error: function(code){
        //             console.log(code);
        //         }
        //     });
        // },
        save() {
            var _this = this;
            this.validate_data();
            // 提交数据，自己写数据去
            // 以下代码放在success中
            let data = {
                beginBalance: 0,
                beginBalanceFor: 0,
                plAmountFor: 0,
                plAmount: 0,
                ytdCreditFor:0,
                ytdCredit:0,
                ytdDebitFor:0,
                ytdDebit:0
            }

            var itemBalanceList = [];
            var checkData = true;
            this.subjectData.forEach(row=>{
                var isChange = false;
            var isItemChange = false;
            if (row.isChange && row.isChange == true) {
                isChange = true;
            }
            var itemBalance = {};
            itemBalance.id = row.id;
            for(key in data) {
                itemBalance[key] = row[key] ? this.formatNum(row[key] * 1, 1) : 0;
            }
            if (row.itemDetail) {
                var itemDetailList = [];
                row.itemDetail.forEach(rowtemp => {
                    if (rowtemp.id == -1 && !rowtemp.init) {
                    checkData = false;
                    return false;
                }
                if(rowtemp.defaultInit != rowtemp.init){
                    if(rowtemp.init){
                        isItemChange = true;
                    }
                    var itemDetail = {};
                    var arr = rowtemp.init.split("._.");
                    itemDetail.id = rowtemp.id;
                    itemDetail.itemClass = arr[0];
                    itemDetail.itemId = arr[1];
                    itemDetail.itemClassName = arr[2];
                    itemDetail.itemCode = arr[3];
                    itemDetail.itemName = arr[4];
                    itemDetailList.push(itemDetail);
                }
            });
                itemBalance.itemDetail = itemDetailList;
            }

            if(isChange || isItemChange){
                itemBalanceList.push(itemBalance);
            }
        })
            //itemBalance[key] = data[key].toFixed(2);
            if(!checkData){
                // alert("请选择具体的核算项目");
                _this.$Modal.warning({
                    title: '提示信息',
                    content: '请选择具体的核算项目'
                });
                return false;
            }
            if(itemBalanceList.length==0 && !this.isDelete){
                // alert("没有要修改的数据");
                _this.$Modal.warning({
                    title: '提示信息',
                    content: '没有要修改的数据'
                });
                return false;
            }
            if(!this.checkSubject()){
                // alert("存在重复的核算项目");
                _this.$Modal.warning({
                    title: '提示信息',
                    content: '存在重复的核算项目'
                });
                return false;
            }
            if(this.updateing){
                // alter("正在修改数据!");
                _this.$Modal.warning({
                    title: '提示信息',
                    content: '正在修改数据!'
                });
                return false;
            }
            var _url =  contextPath+"/balance/updateItemList?currencyId="
                +this.currencyId+"&accountId="
                +this.currAccountId+"&parentData="+this.parentData;

            console.log("itemBalanceList",itemBalanceList)
            $.ajax({
                type: 'post',
                data: JSON.stringify(itemBalanceList),
                url: _url,
                dataType: 'json',
                contentType : 'application/json;charset=utf-8',
                success: function(res){
                    if(100100==res.code) {
                        _this.reCount();
                        _this.parentData = "";
                        _this.detailVisible = false;
                        _this.reload();
                    }else{
                        // alert("保存失败:"+res.msg);
                        _this.$Modal.warning({
                            title: '提示信息',
                            content: "保存失败:"+res.msg
                        });
                    }
                    this.updateing = false;
                },
                error: function(code){
                    console.log(code);
                }
            });


            /*let find = this.tableData.find(row=> {
                return row.id == this.selectId;
            })
            Object.assign(find,data);*/
        },
        // 验证核算数据是否为空
        validate_data(){
            let arr =[];
            this.subjectData.forEach(row=>{
                let data = {};
            row.itemDetail.forEach(it=>{
                for(key in row){
                this.$set(data,key,row[key]);
            }
            // this.$set(data,key,it[key]);
        })

            arr.push(data)
        })
            // console.log(arr)
        },
        cancel(status) {
            switch(status){
                case 1:
                    this.detailVisible = false;
                    this.allShow = false;
                    break;
                case 2:
                    this.balanceVisible = false;
                    break;
                default:
                    break;
            }
        },
        exportExcel() {
            window.open(contextPath+"/balance/exportExcel?currencyId="+this.currencyId);
        },
        reload(){
            location.reload();
        },
        closeWindow: function () {
            //关闭当前页签
            var name = '总账期初应收数据';
            window.parent.closeCurrentTab({ 'name': name, 'openTime': this.openTime, 'url': this.openTime, exit: true })
        },
        // close(){
        //     var userAgent = navigator.userAgent;
        //     if (userAgent.indexOf("Firefox") != -1 || userAgent.indexOf("Chrome") !=-1) {
        //         window.location.href="about:blank";
        //         window.close();
        //     } else {
        //         window.opener = null;
        //         window.open("", "_self");
        //         window.close();
        //     }
        //  }
    },
    watch: {
        currencyId: function (val, oldVal) {
            this.oldCurrencyId = oldVal;
            // console.log('new: %s, old: %s', val, oldVal)
        },
    },
    computed: {
        currentTabComponent: function () {
            return 'tab-' + this.currentTab.toLowerCase()
        },
        // 表头设置
        colNumber() {
            return this.currencyId === this.defaultCurrency
            || this.currencyId === this.iscCuccrency ? 1 : 2;
        },
        // 表头设置
        colCurrency() {
            return this.currencyId === this.defaultCurrency
            || this.currencyId === this.iscCuccrency ? 2 : 3;
        },
        // 列表显示隐藏
        isShowCol() {
            return !(this.currencyId === this.defaultCurrency
                || this.currencyId === this.iscCuccrency)
        },

    },
    filters: {
        fiterDirection(value) {
            return value === 1 ? '借' : '贷'
        },
        filtersTableNumber: function (val) {
            return accounting.formatMoney(val, '', 2);
        },
        filterBalance(value) {
            return !!value ? '试算结果平衡！' : "试算结果不平衡！"
        }
    },

})