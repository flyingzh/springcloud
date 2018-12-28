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
                documentType:'',
                documentCode:'',
                upstreamSourceCode:'',
                startTime:'',
                endTime:'',
                productTypeName:'',
                alreadyTest:2,
                hasCreateTestDocument:0,//是否已生成检验单_1、是.0、否
            },
            addBody: {
                documentCode:'',
                documentType:'',
                productTypeName:'',
                documentTime:'',
                sendTestTime:'',
                testTotalAmount:'',
            },
            data_config: {
                url: contextPath+"/documentController/list",
                colNames: ['送检编号', '单据类型','源单单号','商品类型','商品类型ID', '单据日期', '送检时间', '检验总数量'],
                colModel: [
                    {
                        name: 'documentCode', index: 'documentCode', width: 210, align: "left",
                    },
                    {name: 'documentType', index: 'documentType', width: 210, align: "left"},
                    {name: 'upstreamSourceCode', index: 'documentCode'+'upstreamSourceCode', width: 230, align: "left",
                        formatter: function (value, grid, rows, state) {
                            let cssClass =".detail" + value;
                            $(document).off('click',cssClass).on('click', cssClass, function () {
                                This.detailClick({value, grid, rows, state})
                            });
                            let myCode = `<a class="detail${value}">${value}</a>`;
                            return myCode;
                        }},
                    {name: 'productTypeName', index: 'productTypeName', width: 210, align: "left"},
                    {name: 'productTypeId', hidden:true},
                    {
                        name: 'documentTime', index: 'documentTime', align: "left", width: 210,
                        formatter: function (value, grid, rows, state) {
                            Date.prototype.Format = function (fmt) { //author: meizz
                                var o = {
                                    "M+": this.getMonth() + 1, //月份
                                    "d+": this.getDate(), //日
                                    "h+": this.getHours(), //小时
                                    "m+": this.getMinutes(), //分
                                    "s+": this.getSeconds(), //秒
                                    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                                    "S": this.getMilliseconds() //毫秒
                                };
                                if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
                                for (var k in o)
                                    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1,
                                        (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                                return fmt;
                            }
                            return  new Date(value).Format("yyyy-MM-dd");
                        }
                    },
                    {
                        name: 'sendTestTime', index: 'sendTestTime', align: "left", width: 210,
                        formatter: function (value, grid, rows, state) {
                            return  new Date(value).Format("yyyy-MM-dd hh:mm:ss");
                        }
                    },
                    {name: 'testTotalAmount', index: 'testTotalAmount', align: "right", width: 210},
                ],
            }
        }
    },
    methods: {
        changeDate(value){
            this.body.startTime=value[0].replace(/\//g, '-') + ' 00:00:00';
            this.body.endTime=value[1].replace(/\//g, '-') + ' 23:59:59';
        },
        search() {
            if(!this.body.documentType){
                this.body.documentType = '';
            }
            if(this.commodityCategoty.length>0){
                this.body.productTypeName=this.commodityCategoty[this.commodityCategoty.length-1];
            }else {
                this.body.productTypeName="";
            }
            this.reload = !this.reload;
        },
        //生成检验单
        insertTestDocument(){
            if (!ht.util.hasValue(this.selected, "array")) {
                this.$Modal.warning({
                    title:'提示信息',
                    content:'请先选择一条记录!'
                })
                return false;
            } else if (this.selected.length > 1) {
                this.$Modal.warning({
                    title:'提示信息',
                    content:'最多只能选择一条记录!'
                })
                return false;
            }
            let rowData = jQuery('#myTable').jqGrid('getRowData',this.selected[0]);
            //对单据编号做字符串分割处理
            window.parent.activeEvent({name: '新增检验单', url: contextPath+'/quality/test-document/test-document-add.html', params: {rowData:rowData,ger:'all'}});
        },
        clear() {
            this.commodityCategoty=[];
            this.$refs.dType.reset();
            this.$nextTick(function(){
                this.body.documentType='';
            });
            this.body={
                // documentType:'',
                documentCode:'',
                startTime:'',
                endTime:'',
                productTypeName:'',
                alreadyTest:2,
                hasCreateTestDocument:0,//未生成检验单
                upstreamSourceCode:'',
            }
            this.dataValue=[];
        },
        view() {
        },
        //根据源单单号查详情
        detailClick(data) {
            let code = data.rows.upstreamSourceCode;
            if (code) {
                let type = data.rows.documentType;
                let businessStatus = data.rows.businessStatus;
                let businessType = data.rows.businessType;
                if(type=="收货单"){
                    //跳转采购收货单页面
                    $.ajax({
                        type:"post",
                        url: contextPath + '/tpurchasecollectgoods/info?code='+code,
                        dataType:"json",
                        success:function (r) {
                            if(r.code == '100100'){
                                console.log(r.data);
                                window.parent.activeEvent({
                                    name: '采购收货单-查看',
                                    url: contextPath+'/purchase/purchase-collectgoods/purchase-collectgoods-add.html',
                                    params: r.data,type:4
                                });
                            }
                        },
                        error:function (r) {

                        }
                    });
                }
                if(type=="原料领用申请单"){
                    //跳转原料领用申请单页面
                    window.parent.activeEvent({
                        name: '查看原料领用申请单',
                        url: contextPath + '/warehouse/raw-application/raw-application-info.html',
                        params: {data: code, type: 'query'}
                    });
                }
                if(type=="客户订单"){
                    window.parent.activeEvent({
                        name: '客户订单-查看',
                        url: contextPath + '/sale/customer-order/customer-order-add.html',
                        params: {type: 'view', saleOrderNo: code}
                    });
                }
            }
        },
        reloadAgain() {
            this.clear();
            this.reload = !this.reload;
        },
        cancel() {
            window.parent.closeCurrentTab({name: '待质检列表', exit:true,openTime:this.openTime})
        },
        loadCodeType(){
            //获取单据类型（数据字典）
            let mark = "root_zj_jydydlx";
            this.docType = getCodeList(mark);
        },
        loadProductType(){
            //获取商品类型
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
                    That.$Modal.error({
                        title: "提示",
                        content: "服务器出错!"
                    });
                }
            })
        },
        initGoodCategory(type) {
            let result = [];

            type.forEach((item) => {
                let {
                    name: value,
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
        //获取单据类型（数据字典）
        this.loadCodeType();
        //获取商品类型
        this.loadProductType();
    }
})
