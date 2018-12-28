var vm = new Vue({
    el: "#app",
    data: {
        isShow: false,
        isEdit: false,
        reload: false,
        isSearchHide: true,
        isTabulationHide: true,
        isHide: true,
		categoryType:[],
        goodsTypePath:'',
        goodsValue:'',
        selected:'',
        selectType: [

            {
                value: "S_CUST_ORDER",
                label: "客户订单"
            },
            {
                value: "W_MATERIAL_USED",
                label: "原料领用申请单"
            }
        ],
        selectBusinessType:[
        ],
        body: {
            sourceType:'',
            documentNo:'',
            businessType:'',
            goodsTypePath:'',
        },
		allTransferNum:'',
        data_config: {
            url: contextPath + "/requisition/readyList",
            datatype:"json",
            colNames: ['goodsId','源单类型', '源单编号','业务类型','质检状态', '商品类型', '图片', '商品编码',"商品名称","计数单位","数量","待调拨数量","检验合格数量","特殊放行数量","调拨中数量","已调拨数量"],
            colModel:[
				{name: "goodsId", width: 210, align: "left", hidden: true},
                {name: "sourceType", width: 210, align: "left",
                    formatter: function (value, grid, rows, state) {
						if (value === "S_CUST_ORDER"){
                            return "客户订单";
                        }
                        else if(value === "W_MATERIAL_USED"){
                            return "原料领用申请单";
                        }
                    }
                },
                {name: "documentNo",width: 210, align: "left",
                    formatter: function (value, grid, rows, state) {
                        $(document).off('click', ".detail" + value).on('click', ".detail" + value, function () {
                            vm.detailClick({value, grid, rows, state})
                        });
                        let myCode = `<a class="detail${value}">${value}</a>`;
                        return myCode;
                    }
                },
                {name: "businessType", width: 210, align: "left",
                    formatter: function (value, grid, rows, state) {
                        if (value === "S_CUST_ORDER_01"){
                            return "销售出仓";
                        }
                        else if (value === "S_CUST_ORDER_02"){
                            return "受托加工销售";
                        }
						else if (value === "W_MATERIAL_USED_01"){
                            return "采购送料";
                        }
                        else if (value === "W_MATERIAL_USED_02"){
                            return "采购料结";
                        }
						else if (value === "W_MATERIAL_USED_03"){
                            return "受托加工送料";
                        }
                        else if (value === "W_MATERIAL_USED_04"){
                            return "受托加工退料";
                        }
                    }},
                {name: "transferCheckStatus",width: 210, align: "left",
						formatter: function (value, grid, rows, state) {
                        return "放行";
                    }
				},
                {name: "goodsTypeName", align: "left", width: 210},
                {name: "pictureUrl", align: "left", width: 210,
                    formatter: function (ellvalue, options, rowObject) {
                        console.log(rowObject)
                        let random = guid();
                        $(document).on('mouseout', '.can', function () {
                            vm.hideMirror(random)
                        });
                        $(document).on('mouseenter', '.select' + random, function () {
                            vm.showMirror(random)
                        })
                        let url = rowObject.pictureUrl;
                        console.log(url)

                        if (url) {
                            return `<div class="select${random} can">
                                    <img height="50px" width="50px" src="${url}"/>
                                    <div class="mirror"><img class="bigimg" src="${url}"></div>
                                </div>`;
                        } else {
                            return `<div class="select${random} can">
                                    <img height="50px" width="50px" src="http://218.17.157.182:8082/web/images/no_pic.png"/>
                                    <div class="mirror"><img class="bigimg" src="http://218.17.157.182:8082/web/images/no_pic.png"></div>
                                </div>`;
                        }
                    }
                  },
                {name: "goodsCode", align: ";left", width: 210,
                    formatter: function (value, grid, rows, state) {
                        $(document).off('click', ".detail" + value).on('click', ".detail" + value, function () {
                            vm.gooidsId({value, grid, rows, state});
                        });
                        let myCode = `<a class="detail${value}">${value}</a>`;
                        return myCode;
                    }
                },
                {name: "goodsName", align: ";left", width: 210},
                {name: "countingUnit", align: ";left", width: 210},
                {name:"num",align: ";left", width: 210},
                {name:"allTransferNum",align: ";left", width: 210,
                    formatter: function (ellvalue, options, rowObject) {
                     return   Number(rowObject.transferQualifiedNum) + Number(rowObject.transferCheckReleaseNum)-Number(rowObject.totalTransferNum)
                    }},
                {name:"transferQualifiedNum",align: ";left", width: 210},
                {name:"transferCheckReleaseNum",align: ";left", width: 210},
                {name:"transferMiddleNum",align: ";left", width: 210},
                {name:"totalTransferNum",align: ";left", width: 210,
                    formatter: function (value, grid, rows, state) {
						if(value==null){
							return 0;
						}else{
							return value;
						}
					}},
            ],
            rowNum : 5,//一页显示多少条
            rowList : [ 10, 20, 30 ],//可供用户选择一页显示多少条
            mtype : "post",//向后台请求数据的ajax的类型。可选post,get
            viewrecords : true
        }
    },
    methods: {
        //商品编码
        gooidsId(value){
            window.parent.activeEvent({
                name: '商品',
                url: contextPath +'/base-data/commodity/commodity-info.html',
                params:{id:value.rows.commodityId, type: 'skip'}
            });
        },
        //根据原单跳转
        detailClick(value){
            if(value.rows.sourceType === 'W_MATERIAL_USED'){
                window.parent.activeEvent({
                    name: '查看原料领用申请单',
                    url: contextPath + '/warehouse/raw-application/raw-application-info.html',
                    params: {data: value.value, type: 'query'}
                });
            }else {
                var saleOrderNo = value.rows.documentNo;
                window.parent.activeEvent({
                    name: '查询客户订单',
                    url: contextPath + '/sale/customer-order/customer-order-add.html',
                    params: {type: 'view', saleOrderNo: saleOrderNo}
                });
            }
        },
		//刷新
        refresh(){
            this.clear();
            this.reload = !this.reload;
        },
		search(){
            this.reload=!this.reload;
        },
        clear() {
            this.body = {
				sourceType: '',
				documentNo: '',
				businessType:"",
				goodsTypePath:'',
            }
            this.$nextTick(function(){
			this.selectBusinessType="",
            this.body.sourceType= '',
            this.body.documentNo= '',
            this.body.businessType="",
            this.body.goodsTypePath=''
			this.goodsValue = '';
            });
        },
        showMirror(name) {
		    console.log(name)
            $(`.select${name} .mirror`).show()
        },
        hideMirror(name) {
            $(`.select${name} .mirror`).hide()
        },
		 //获取商品类型
        loadProductType(){
            let That = this;
            $.ajax({
                type: "post",
                url: contextPath+'/requisition/queryStyleCategory?parentId=0',
                contentType: 'application/json',
                dataType: "json",
                success: function (data) {
                    console.log(data)
                    That.categoryType = That.initGoodCategory(data.data.cateLists)
                },
                error: function () {
                    // alert('服务器出错啦');
                    this.$Modal.warning({content:"服务器出错啦",title:"提示信息"});
                }
            })
        },
        //监听商品类型内容改变,根据商品分类id
        changeproductTypeName(selectedData,arr){
            console.log(selectedData,arr)
            //获取商品分类名称
            this.body.goodsTypePath = arr[arr.length-1]['value'];
            console.log("changeproductTypeName---goodsTypePath",this.body.goodsTypePath)
        },
        initGoodCategory(type) {
            let result = [];
            type.forEach((item) => {
                let {
                    customCode: value,
                    name: label,
                    cateLists: children
                } = item

                if (children) {
                    children = this.initGoodCategory(children)
                }
                result.push({
                    value,
                    label,
                    children
                })
            })
            result.forEach((item) => {
                if (!item.children) {
                    delete item.children;
                }
            })
            return result
        },
		add(){
            console.log("add----",this.selected);
			console.log("add----length",this.selected.length);
            if(this.selected.length < 1){
                //当没有勾选源单时为手工新增
                this.$Modal.info({
                    title:'提示信息',
                    content:'请至少选择一条数据！'
                });
                return;
            }else {

                let documentNoArr = []
                for (var i = 0; i < this.selected.length; i++) {
                    for (var j = this.selected.length - 1; j > i - 1; j--) {
                        if (this.selected[i].businessType !== this.selected[j].businessType) {
                            // layer.alert("业务类型不相同，不能合并")
                            this.$Modal.info({content:"业务类型不相同，不能合并",title:"提示信息"});
                            console.log(this.selected[i].businessType, this.selected[j].businessType)
                            return;
                        }
                        if (this.selected[i].goodsTypeName !== this.selected[j].goodsTypeName) {
                            // layer.alert("商品类型不相同，不能合并")
                            this.$Modal.info({content:"商品类型不相同，不能合并",title:"提示信息"});
                            console.log(this.selected[i].goodsTypeName, this.selected[j].goodsTypeName)
                            return;
                        }
                    }
                    documentNoArr.push({sourceNo:this.selected[i].documentNo,id:this.selected[i].goodsId,
									sourceType:this.selected[i].sourceType,allTransferNum:this.selected[i].transferQualifiedNum+this.selected[i].transferCheckReleaseNum});
                }
                console.log('add---documentNoArr',documentNoArr)
                window.parent.activeEvent({
                    name: "调拨单-新增",
					url: contextPath+'/warehouse/requisition/requisition-info.html',
                    params: {activeType: "sourceAdd",documentNoArr:documentNoArr}
                });
            }
        },
		// 点击退出(退出页面)
        exit(){
            window.parent.closeCurrentTab({openTime:this.openTime,exit: true,});
        },
		askToSelectType(){
			 console.log("askToSelectType----sourceType",this.body.sourceType);
			if(!this.body.sourceType){
				this.$Modal.info({content:"请先选择源单类型！",title:"提示信息"});
			}   
		},
		setBusinessType(){
			console.log("setBusinessType----sourceType",this.body.sourceType);
			if(this.body.sourceType=='S_CUST_ORDER'){
			this.selectBusinessType=[
					{
						value: "S_CUST_ORDER_01",
						label: "销售出仓"
					},
					{
						value: "S_CUST_ORDER_02",
						label: "受托加工销售"
					}
				]
			}else if(this.body.sourceType=='W_MATERIAL_USED'){
					this.selectBusinessType=[
					{
						value: "W_MATERIAL_USED_01",
						label: "采购送料"
					},
					{
						value: "W_MATERIAL_USED_02",
						label: "采购料结"
					},
					{
						value: "W_MATERIAL_USED_03",
						label: "受托加工送料"
					},
					{
						value: "W_MATERIAL_USED_04",
						label: "受托加工退料"
					}
				]
			}else{
				return;
			}
		}
    },
	mounted() {
        this.loadProductType();
		this.openTime = window.parent.params.openTime;
    }
})