let customerStockList = new Vue({
    el:"#customer-stockMaterial",
    data(){
        return {
            saleGold:"",
            //所选的客户对象
            selectCustomerObj: null,
            isHideSearch: true,
            isHideList: true,
            openTime: "",
            openName: '',
            body:{
                //来料性质
                goodsType:"",
                //源单编号
                sourceOrder:"",
                //客户
                custName:"",
                //日期
                dateTime:""
            },
            CustomerStockMateriaQueryVo:{
                queryList:[],
            },
            dataValue: [],
            myTable:"myTable",
            data_user_list:{
                 url: contextPath + '/customerStockMaterial/selectLists',
                 colNames: ['commodityId','goodsId',"源单类型", "源单编号", "日期","客户","商品主类型","商品编码","商品名称","计重单位","重量","来料性质"],
                 colModel:
                     [
                         {name:"commodityId",width:"120",align:"left",fixed:"true",hidden: true},
                         {name:"goodsId",width:"120",align:"left",fixed:"true",hidden: true},
                         {name: "remark", index: "remark", width: 100, align: "center",
                             formatter: function (value, grid, rows, state) {
                                 if(value == '客户来料'){
                                     let btns = `<span type="primary" class="select${rows.id}">客户来料</span>`;
                                     return btns
                                 }else if(value == '旧料处理'){
                                     let btns = `<span type="primary" class="select${rows.id}">旧料处理</span>`;
                                     return btns
                                 }
                             }
                         },
                         {name: "materialOrderNo", index: "materialOrderNo", width: 150, align: "center",
                             formatter: function (value, grid, rows, state) {
                                 $(document).off("click", ".updateDetail" + value).on("click", ".updateDetail" + value, function () {
                                     customerStockList.updateDetailClick({value, grid, rows, state})
                                 });
                                 let btns = `<a class="updateDetail${value}">${value}</a>`;
                                 return btns;
                             }
                         },
                         {name: "inTime", index: "inTime", width: 100, align: "center",
                             formatter: function (value, grid, rows, state) {
                                 let time = value.split(" ")[0]
                                 return time
                             }
                         },
                         {name: "custName", index: "custName", width: 100, align: "center"},
                         {name: "goodsMainType", index: "goodsMainType", width: 90, align: "center",
                             formatter: function (value, grid, rows, state) {
                                 let infos = `<span type="primary" class="select${rows.id}">金料</span>`;
                                 return infos
                             }
                         },
                         {name: "goodsCode", index: "goodsCode", width: 90, align: "center",
                             formatter: function (value, grid, rows, state) {
                                 $(document).on('click',".detail"+ value,function(){
                                     customerStockList.showGoodsInfo({value, grid, rows, state})
                                 });
                                 let myCode =  `<a class="detail${value}">${value}</a>`;
                                 return  myCode;
                             }},
                         {name: "goodsName", index: "goodsName", width: 90, align: "center"},
                         {name: "weightUnit", index: "weightUnit", width: 60, align: "center"},
                         {name: "totalWeight", index: "totalWeight", width: 50, align: "center"},
                         {name: "processNature", index: "processNature", width: 65, align: "center",
                             formatter: function (value, grid, rows, state) {
                                 if(value == 1){
                                     let btns = `<span type="primary" class="select${rows.id}">锁价</span>`;
                                     return btns
                                 }else if(value == 2){
                                     let btns = `<span type="primary" class="select${rows.id}">预付款</span>`;
                                     return btns
                                 }else if(value == 0){
                                     return ""
                                 }

                             }
                         },
                     ],
                 multiselect: true,
            },
            reload:true,
            selected:[]
        }
    },
    methods:{
        custAdd(...rest){
            console.log(rest)
        },
        search(){
            this.reload = !this.reload
        },
        //查看商品信息
        showGoodsInfo(value){
            window.parent.activeEvent({
                name: '商品',
                url: contextPath +'/base-data/commodity/commodity-info.html',
                params:{id: value.rows.commodityId, type: 'skip'}
            });
        },
        //客户
        closeCustomer() {
            if(this.selectCustomerObj){
                this.body.custName = this.selectCustomerObj.name;
            }
            console.log(this.selectCustomerObj)
        },
        productOrder(){
            let This =this;
            //判断勾选的数据是否一致
            if(this.selected.length<1){
                this.$Modal.warning({
                    title: "提示信息",
                    content:"请选择需要生成的单据"
                })
            }
            if(this.selected.length>=1){
                //取一个数据作为基准
                let obj = this.selected[0]
                //循环判断
                for(var i = 0;i<this.selected.length;i++){
                    if(this.selected[i].custName != obj.custName){
                        this.$Modal.warning({
                            title: "提示信息",
                            content:"客户不一致"
                        })
                        return;
                    }
                    if(this.selected[i].processNature != obj.processNature){
                        this.$Modal.warning({
                            title: "提示信息",
                            content:"来料性质不一致"
                        })
                        return;
                    }
                }
                let temp =true;
                let This = this;
                console.log(this.selected)
                for (let i = 0; i < this.selected.length; i++) {
                    var obje = {};
                    obje.materialOrderNo = this.selected[i].materialOrderNo
                    obje.goodsId = this.selected[i].goodsId
                    this.CustomerStockMateriaQueryVo.queryList.push(obje);
                }
                console.log(obje)
                console.log(this.CustomerStockMateriaQueryVo)
                 $.ajax({
                    type: 'post',
                    url: contextPath + "/customerStockMaterial/quaryAllCustomerStockMateria",
                    contentType: 'application/json',
                    data: JSON.stringify(This.CustomerStockMateriaQueryVo),
                    dataType: "json",
                    success: function (data) {
                        if (data.code === "100100") {
                            console.log(data)
                            if(data.data.length>0){
                                //根据金料成色获取当前金价
                                for(var key in This.saleGold){
                                    for(var i = 0;i<data.data.length;i++){
                                        data.data[i].goodList.map((item)=>{
                                            if(key === item.goldColor){
                                                //获取到当日金价
                                                item["goldPrice"] = This.saleGold[key]
                                                item["goldAmount"] = This.saleGold[key] * item.totalWeight;
                                            }
                                        })
                                    }
                                }
                                window.parent.activeEvent({
                                    name: '存料结价单新增',
                                    url: contextPath + '/sale/customer-stockMaterial/customer-countAdd.html',
                                    params: {allInfo: data, type: 'addInfo'}
                                });
                            }else{
                                This.$Modal.error({
                                    title: "提示信息",
                                    content: "已有单据生成存料结价单了！请刷新页面重新选择！"
                                });
                            }
                        }
                    },
                    error: function (err) {
                        console.log("服务器出错啦");
                    },
                })
            }
        },
        //时间
        changeDate(value) {
            this.body.startTime = value[0] == "" ? "" : (value[0].replace(/\//g, '-') + ' 00:00:00');
            this.body.endTime = value[1] == "" ? "" : (value[1].replace(/\//g, '-') + ' 23:59:59');
        },
        //刷新列表数据
        refresh(){
            this.clear();
            this.reload = !this.reload;
            this.selected = [];
            this.CustomerStockMateriaQueryVo.queryList=[]
        },
        //清空搜索框
        clear(){
            this.$refs.mType.reset();
            this.$nextTick(function () {
                this.body.processNature = '';
            });
            this.body = {
                materialOrderNo: '',//单据编号
                custName: '',//客户
                startTime: '',
                endTime: '',//来料时间
                processNature: '',//来料性质
                isDel: 1,//是否删除1-未删除，0-已删除
            };
            this.dataValue = [];
            this.$refs.customerRef.clear();
            console.log(this.body)
        },
        //清空按钮
        clearType(){
            this.$refs.mType.reset();
            this.$nextTick(function () {
                this.body.processNature = '';
            });
        },
        //退出
        cancel() {
            console.log(1)
            window.parent.closeCurrentTab({name: this.openName, exit: true, openTime: customerStockList.openTime})
        },
        updateDetailClick(data) {
            let This = this;
            var materialOrderNo = data.value;
            console.log(materialOrderNo)
            console.log(data)
            console.log(data.grid.rowId)
            let remark=data.rows.remark;
            if(remark==='旧料处理'){
                var That = this;
                window.parent.activeEvent({
                    name: '查看旧料回收单',
                    url: contextPath + '/oldmaterial/recycle/old-recycle-add.html',
                    params: {
                        type: 'update',
                        id: data.grid.rowId
                    }
                });
            }
            if(remark==='客户来料'){
                $.ajax({
                    type: "POST",
                    url: contextPath + "/tsaleMaterialOrder/quaryAllInformation",
                    //dataType:"json",
                    data: {"materialOrderNo": materialOrderNo},
                    success: function (data) {
                        console.log(data)
                        window.parent.activeEvent({
                            name: '客户来料单-查看',
                            url: contextPath + '/sale/material-order/sale-material-add.html',
                            params: {allInfo: data, type: 'query'}
                        });
                    },
                    error() {
                        console.log("请求失败")
                    }
                })
            }
        },
        //获取销售今日金价
        initGoldPrice(type) {
            let that = this;
            $.ajax({
                type: "post",
                url: contextPath + '/tbasetodygoldprice/queryPrice',
                data: { "type": type },
                dataType: "json",
                success(data) {
                    that.saleGold = data.data;
                },
                error() {
                    that.$Message.warning('服务器报错')
                }

            })
        },
    },
    mounted(){
        this.initGoldPrice(1)
        this.refresh();
        this.openTime = window.parent.params.openTime;
        this.openName = window.parent.params.name;
        this.$refs.customerRef.loadCustomerList('', '');
    }
})