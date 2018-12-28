var unSourceDocument = new Vue({
    el: '#unSourceDocument',
    data() {
        let This = this;
        return {
            isShow: false,
            isEdit: false,
            reload: false,
            isSearchHide: true,
            showSupplierModal: false, //控制供应商弹窗
            openTime:"",
            isTabulationHide: true,
            isHide:true,
            selected: [],
            commodityCategoty:[],
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
			commodityCategoty:[], //商品类型层级

            body: {
                goodsTypePath:'',  //商品类型路径
                supplier:'',   //供应的名称
                supplierId:'', //供应的id
                businessType:'',//业务类型
                startTime:'',  //开始时间
                endTime:'',    //结束时间
                orderStatus:'',//供应商名称
                orderNo:'',     //单据编号
            },

            data_config: {
                url: contextPath+"/certificateOutbreaks/findListByTypePage",
                colNames: [ '日期','单据编号','单据状态','供应商','商品类型', '业务类型', '证书类型','证书数量','发货重量'],
                colModel: [
                    {
                        name: 'deliveryDate', index: 'deliveryDate', align: "left", width: 320,
						formatter: function (value, grid, rows, state) {
                            if (value==null && value==''){
                                return '';
                            }
							return value.substr(0,10);
						}
                    },
                    {name: 'orderNo', index: 'orderNo', width: 360, align: "left",
                        formatter: function (value, grid, rows, state) {
                            $(document).off('click', ".detail" + value).on('click', ".detail" + value, function () {
                                This.detailClick({value, grid, rows, state})
                            });
                            let myCode = `<a class="detail${value}">${value}</a>`;
                            return myCode;
                        }
                    },
                    {
                        name: 'orderStatus', index: 'orderStatus', width: 310, align: "left",
                        formatter: function (value, grid, rows, state) {
                            if (value == 1 ){
                                return "暂存";
                            }else if(value == 2 ){
                                return "待审批";
                            }else if(value == 3 ){
                                return "审批中";
                            }else if(value == 4 ){
                                return "已审批";
                            }else {
                                return "驳回";
                            }
                        }
                    },
                    {
                        name: 'supplier', index: 'supplier', width: 310, align: "left",
                    },
                    {name: 'goodsTypeName', index: 'goodsTypeName', width: 310, align: "left"},
                    {
                        name: 'businessType',index: 'businessType', width: 310, align: "left",
                        formatter: function (value, grid, rows, state) {
                            if (value == 'P_CREDENTIAL_OUT_01'){
                                return "标配证书";
                            }else{
                                return "特种证书";
                            }
                        }
                    },
                    {
                        name: 'certificateType',index: 'certificateType', width: 310, align: "left",
                    },
                    {name: 'certificateNumber', index: 'certificateNumber', width: 310, align: "right" },
                    // {name: 'deliverGoodsNumber', index: 'deliverGoodsNumber', width: 310, align: "left" },
                    {name: 'deliverWeight',index: 'deliverWeight', width: 310, align: "right"}
                    
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
        handleClear(){
            this.body.startTime=null;
            this.body.endTime=null;
        },
        search() {
            if(!this.body.businessType){
                this.body.businessType = '';
            }
            if(!this.body.orderStatus){
                this.body.orderStatus = '';
            }
            this.reload = !this.reload;
        },
        detailClick(data) {
            var id = data.rows.id;
            window.parent.activeEvent({
                name: '外发证书单详情',
                url: contextPath+'/purchase/certificateOutbreaks/certificate-add.html', 
                params: {
                    type: 'id', 
                    id: id
                }
            });
        
        },

        clear() {
            this.commodityCategoty = [];
            this.body = {
					goodsTypePath:'',  //商品类型路径
					supplier:'',   //供应的名称
					supplierId:'', //供应的id
					businessType:null,//业务类型
					startTime:'',  //开始时间
					endTime:'',    //结束时间
					orderStatus:null,//供应商名称
					orderNo:'',     //单据编号
			},

            this.dataValue=[];
            this.commodityCategoty=[];
            this.$refs.supperList.clear(); //新修改的供应商组件的清空方式。
        },
        //弹出查询供应商
        selectSupplier() {
            this.showSupplierModal = !this.showSupplierModal;
        },
        closeSupplierModal() {

        },
        // 退出页面
		closeTab(){
            window.parent.closeCurrentTab({openTime: this.openTime, exit: true});
        },
        view() {
        },
        reloadAgain() {
            this.clear();
            this.reload = !this.reload;
        },

        loadProductType(){
            //获取商品类型
            let That = this;
            $.ajax({
                type: "post",
                url: contextPath+'/documentController/getCategory?parentId=0',
                dataType: "json",
                success: function (data) {
                    if(data.code == '100100'){
                        That.categoryType = That.initGoodCategory(data.data.cateLists)
                    }
                },
                error: function () {
					That.$Modal.error({
						content:'服务器出错啦！'
					})
                }
            })
        },
        initGoodCategory(type) {
            let result = [];
            type.forEach((item) => {
                let {
                    customCode: value,
                    name: label,
                    cateLists: children,
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
        hideSearch() {
            this.isHide=!this.isHide;
            this.isSearchHide = !this.isSearchHide;
            $(".chevron").css("top","")
        },
        hidTabulation() {
            this.isHide=!this.isHide;
            this.isTabulationHide = !this.isTabulationHide;
            if(!this.isTabulationHide){
                $(".chevron").css("top","90%")
            }else{
                $(".chevron").css("top","")
            }
        },
        //接收供应商信息
        rcv(id, scode, sname) {
            console.log(id, scode, sname);
            this.body.supplierId = id;
            this.body.supplier = sname;
        },
        //新增
        add(){
            window.parent.activeEvent({
                name: '新增证书外发单', 
                url: contextPath+'/purchase/certificateOutbreaks/certificate-add.html', 
                params: {type: 'add'}
            });
        },
        //批量 删除
        deleteList (){
            let This = this;
            // var f = confirm("确定要删除吗");
            if(This.selected.length<1){
                This.$Modal.info({
                    content:'请至少选择一条数据！'
                })
                return;
            }else{
                This.$Modal.confirm({
                    content:'您要删除该单据吗？',
                    onOk:()=>{
                    var b = true;
                    var ids = [];
                    $.each( this.selected, function(i, item){
                        if (item.orderStatus !=1 ){
                            b = false;
                            // alert("单据编号为"+ item.orderNo +"的单据已提交或审核不可以删除！")
                            setTimeout(function(){
                                This.$Modal.info({
                                    content: '单据编号为'+ item.orderNo +'的单据已提交或审核不可以删除！',
                                })
                            },300)
                            return;
                        }
                        ids.push(item.id);
                    });
                    if (b){
                        $.ajax({
                            type: "post",
                            url: contextPath+'/certificateOutbreaks/deleteList',
                            contentType : "application/json",
                            data:  JSON.stringify(ids),
                            success: function (data) {
                                console.log(data)
                                if (data.code === '100100'){
                                    // alert('删除成功！');
                                    setTimeout(function(){
                                        This.$Modal.success({
                                            content:data.msg,
                                            onOk:()=>{
                                                This.reloadAgain();//删除后，重新加载页面。
											}
                                    });

                                    },300)
                                }else{
                                    setTimeout(function(){
                                        This.$Modal.warning({
                                            content:data.msg
                                        })
                                    },300)
                                }
                            },
                            error: function () {
                                // alert('系统错误，请重试！');
                                This.$Modal.error({
                                    content:'系统错误，请重试！'
                                })
                            }
                        })
                    }
                }
            })
         }

      },
        // update (){
		//
        // }

    },
    /*watch:{
        'body.documentType': function(val) {
            if (typeof val == 'undefined') {
                this.body.documentType = '';
            }
        }
    },*/
    mounted: function() {
        this.openTime = window.parent.params.openTime;
        //获取商品类型
        this.loadProductType();
    }

})
