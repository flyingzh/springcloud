var unSourceDocument = new Vue({
    el: '#unSourceDocument',
    data() {
        let This = this;
        return {
            isShow: false,
            isEdit: false,
            reload: false,
            isSearchHide: true,
            openTime:"",
            isTabulationHide: true,
            isHide:true,
            selected: [],
            confirmConfig: {
                showConfirm: false,
                title: '提示',
                content: '请点击确认',
                onlySure: true,
                success: true
            },
            docType:[],
            dataValue:[],
            categoryType: [],
            commodityCategoty:[],
            body: {
				businessType:'', //源单类型(相对于证书待发列表，其实是收货单的业务类型)
                goodsTypePath:'',  //商品类型路径
                startTime:'',  //开始时间
                endTime:'',    //结束时间
                // supplierName:'',//供应商名称
                orderNo:'',     //单据编号
            },

            data_config: {
                url: contextPath+"/certificateOutbreaks/findOutGoingList",
               
                colNames: ['源单类型', '日期','单据编号','商品类型', '业务类型', '证书数量','发货重量'],
                colModel: [
                    {
                        name: 'businessType', index: 'businessType', width: 310, align: "left",
                        formatter: function (value, grid, rows, state) {
                            if (value == 'P_RECEIPT_02'){
                                return "收货单－标准采购"
                            }else if(value == 'P_RECEIPT_03'){
                                return "收货单－受托加工"
                            }
                        }
                    },
                    {
                        name: 'createTime', index: 'createTime', align: "left", width: 310,
                    },
                    {name: 'orderNo', index: 'sourceNo', width: 360, align: "left"},
                    {name: 'goodsTypeName', index: 'goodsTypeName', width: 310, align: "left"},
                    {
                        name: 'businessType',index: 'businessType', width: 310, align: "left",
                        formatter: function (value, grid, rows, state) {
                            return "标配证书"
                        }
                    },
                    {name: 'qualifiedCount', index: 'qualifiedCount', width: 310, align: "right" },
                    // {name: 'qualifiedCount', index: 'qualifiedCount', width: 310, align: "left" },
                    {name: 'takeDeliveryWeight',index: 'takeDeliveryWeight', width: 310, align: "right"},
                    
                ],
                //_info._completeMethod = that.count
            }
        }
    },
    methods: {

        changeDate(value){
            var startTime = value[0].replace(/\//g, '-') ;
            var endTime = value[1].replace(/\//g, '-') ;
            if (startTime!=null &&startTime !=''&&endTime!=null &&endTime !=''){
                this.body.startTime = startTime+ ' 00:00:00';
                this.body.endTime = endTime+ ' 23:59:59';
            }
        },

        //点击日期的X后清空之前选择的日期值。
        handleClear(){
            this.body.startTime = null;
            this.body.endTime = null;
        },
        hideSearch() {
            this.isHide=!this.isHide;
            this.isSearchHide = !this.isSearchHide;
            $(".chevron").css("top","")
        },
        search() {
            if(!this.body.businessType){
                this.body.businessType = '';
            }
            this.reload = !this.reload;
        },
        reloadAgain() {
            this.clear();
            this.reload = !this.reload;
        },

        //生成证书外发单
        insertCertificate(){
            var that = this;
            var items = that.selected;
            var boolean = true;
            console.log(items)
            if (!ht.util.hasValue(items, "array")) {
                // layer.alert("请先选择一条记录!");
				that.$Modal.info({
                    title:'提示信息',
					content: "请先选择一条记录!"
				});
                return ;
            } else if (items.length > 1) {
                //所有的行的头信息必须相同，才可以合成一张单
                $.each(items, function(i, item){
                    if(i <= items.length -2){
                        if(items[i]['goodsTypeName']!=items[i+1]['goodsTypeName']){
							that.$Message.info({
                                title:'提示信息',
								content: '所有行的商品类型必须一致才能合成一张单！！',
							});
                            boolean = false;
                            return ;
                        }
                    }
                });
            }
            // 校验通过以后就要把所有选择的行的数据携带过去，跳转到新增证书外发单页面。
            if (boolean){
                window.parent.activeEvent({
                    name: '新增证书外发单', 
                    url: contextPath+'/purchase/certificateOutbreaks/certificate-add.html', 
                    params: {
                        type: 'undo',
                        data: items
                    }
                });
            }
        },
        //取消证书外发
		cancelCertificate(){
            var that = this;
            var items = that.selected;
            var boolean = true;
            console.log(items)
            if (!ht.util.hasValue(items, "array")) {
                //layer.alert("请先选择一条记录!");
				that.$Modal.info({
                    title:'提示信息',
					content: "请先选择一条记录!"
				});
                return ;
            }

			this.$Modal.confirm({
                title:'提示信息',
				content: '选中单据中的所有商品都不需要制作证书，单据将跳过证书流程，是否确定？',
				onOk: () => {
                    //提取勾选数据的id
					var ids = [];
					for (var i in items){
						ids.push(items[i].id);
					}
					$.ajax({
						type: "post",
						url: contextPath + '/certificateOutbreaks/cancelCertificateByIds',
						dataType: "json",
						contentType: "application/json",
						data: JSON.stringify(ids),
						success: function (data) {
							//隐藏按钮圈圈
							window.top.home.loading('hide');
							if (data.code === '100100') {
								that.search(); //刷新界面
								//页面提示操作结果，显示三秒钟
								that.$Modal.success({
                                    title:'提示信息',
									content: data.msg
								});
							} else {
								that.$Modal.warning({
                                    title:'提示信息',
									content: data.msg
								});
							}
						},
						error: function () {
							that.$Modal.warning({
                                title:'提示信息',
								content: '服务器出错，请联系技术人员！'
							});
						}
					})
				}
			});

		},

        clear() {
            this.body={
				businessType:null, //源单类型(相对于证书待发列表，其实是收货单的业务类型)
                goodsTypePath:'',  //商品类型路径
                startTime:'',  //开始时间
                endTime:'',    //结束时间
                orderNo:'',     //单据编号
            };
            this.dataValue=[];
            this.commodityCategoty = [];

        },
        view() {
        },
        outGoing() {
           window.parent.closeCurrentTab({openTime: this.openTime, exit: true});
        },
        loadCodeType(){
            //获取单据类型（数据字典）
            let mark = "root_zj_jydydlx";
            this.docType = getCodeList(mark);
        },
         //获取商品类型
        loadProductType(){
            let That = this;
            $.ajax({
                type: "post",
                url: contextPath+'/documentController/getCategory?parentId=0',
                dataType: "json",
                success: function (data) {
                    console.log(data)
                    That.categoryType = That.initGoodCategory(data.data.cateLists)
                },
                error: function () {
					That.$Modal.warning({
                        title:'提示信息',
						content: "初始化商品类型失败!"
					});
                }
            })
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

        //获取商品类型的code，code为多个层级的id拼接字符串。 0.1.2的形式，而勾选后的值是一个数组[成品,素金类,999千足金]
        changeGoodsTypePath(e){
            console.log(e)
            this.body.goodsTypePath = e[e.length-1];
            console.log(this.body.goodsTypePath)
        },

    },
    /*watch:{
        'body.documentType': function(val) {
            if (typeof val == 'undefined') {
                this.body.documentType = '';
            }
        }
    },*/
    mounted: function() {
        this.openTime=window.parent.params.openTime;
        //获取商品类型
        this.loadProductType();
        // 分页获取待外发列表数据
        //this.getInitData();
    }

})
