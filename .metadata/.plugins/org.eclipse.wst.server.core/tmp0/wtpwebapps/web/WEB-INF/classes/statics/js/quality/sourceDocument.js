var sourceDocument = new Vue({
    el: '#sourceDocument',
    data() {
        let This = this;
        return {
            isShow: false,
            isEdit: false,
            reload: false,
            openTime: "",
            isSearchHide: true,
            isTabulationHide: true,
            isHide: true,
            selected: [],
            confirmConfig: {
                showConfirm: false,
                title: '提示',
                content: '请点击确认',
                onlySure: true,
                success: true
            },
            docType: [],
            shopType: [],
            dataValue: [],
            categoryType: [],
            commodityCategoty: [],
            inspectorNameList: [],
            body: {
                documentType: '',
                documentCode: '',
                startTime: '',
                endTime: '',
                alreadyTest: '1',
                productTypeName: '',
                inspectorName: '',
                qcDocumentCode: '',
                upstreamSourceCode:''
            },
            addBody: {
                documentCode: '',
                documentType: '',
                documentTime: '',
                inspectorName: '',
                qcDocumentCode: '',
                productTypeName: '',
                sendTestTime: '',
                qcFinishTime: '',
                testTotalAmount: '',
                qualifiedAmount: '',
                unqualifiedAmount: '',
                qualifiedPercent: '',
                testResult: ''
            },
            data_config: {
                url: contextPath + "/documentController/list",
                colNames: ['业务状态','业务类型', '送检编号', '单据类型', '单据日期', '源单单号', '质检员', '检验单号', '商品类型', '送检时间', '质检完成时间', '检验总数量', '合格数', '不合格数', '合格率(%)', '检验结果'],
                colModel: [
                    {name: 'businessStatus ', hidden: true},
                    {name: 'businessType ', hidden: true},
                    {
                        name: 'documentCode', index: 'documentCode', width: 200, align: "left",
                    },
                    {name: 'documentType', index: 'documentType', width: 100, align: "left"},
                    {
                        name: 'documentTime', index: 'documentTime', align: "left", width: 120,
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
                            return new Date(value).Format("yyyy-MM-dd");
                        }
                    },
                    {
                        name: 'upstreamSourceCode',
                        index: 'documentCode' + 'upstreamSourceCode',
                        width: 200,
                        align: "left",
                        formatter: function (value, grid, rows, state) {
                            let cssClass = ".detail" + value;
                            $(document).off('click', cssClass).on('click', cssClass, function () {
                                This.detailClick({value, grid, rows, state})
                            });
                            let myCode = `<a class="detail${value}">${value}</a>`;
                            return myCode;
                        }
                    },
                    {
                        name: 'inspectorName', index: 'inspectorName', align: "left", width: 100,
                        formatter: function (value, grid, rows, state) {
                            let val = "";
                            if (value) {
                                val = value;
                            }
                            return val;
                        }
                    },
                    {
                        name: 'qcDocumentCode', index: 'qcDocumentCode', align: "left", width: 150,
                        formatter: function (value, grid, rows, state) {
                            let myCode = "";
                            if (value) {
                                let cssClass = ".detail" + value;
                                $(document).off('click', cssClass).on('click', cssClass, function () {
                                    This.testDocumentDetailClick({value, grid, rows, state})
                                });
                                myCode = `<a class="detail${value}">${value}</a>`;
                            }
                            return myCode;
                        }
                    },
                    {name: 'productTypeName', index: 'productTypeName', align: "left", width: 100},
                    {
                        name: 'sendTestTime', index: 'sendTestTime', align: "left", width: 150,
                        formatter: function (value, grid, rows, state) {

                            return new Date(value).Format("yyyy-MM-dd hh:mm:ss");
                        }
                    },
                    {
                        name: 'qcFinishTime', index: 'qcFinishTime', width: 150, align: "left",
                        formatter: function (value, grid, rows, state) {
                            if (value) {
                                return new Date(value).Format("yyyy-MM-dd hh:mm:ss");
                            }
                            return "";
                        }
                    },
                    {
                        name: 'testTotalAmount', index: 'testTotalAmount', align: "right", width: 100,
                        formatter: function (value, grid, rows, state) {
                            let val = 0;
                            if (value) {
                                val = value;
                            }
                            return val;
                        }
                    },
                    {
                        name: 'qualifiedAmount', index: 'qualifiedAmount', align: "right", width: 100,
                        formatter: function (value, grid, rows, state) {
                            let val = 0;
                            if (value) {
                                val = value;
                            }
                            return val;
                        }
                    },
                    {
                        name: 'unqualifiedAmount', index: 'unqualifiedAmount', align: "right", width: 100,
                        formatter: function (value, grid, rows, state) {
                            let val = 0;
                            if (value) {
                                val = value;
                            }
                            return val;
                        }
                    },
                    {
                        name: 'qualifiedPercent', index: 'qualifiedPercent', align: "right", width: 100,
                        formatter: function (value, grid, rows, state) {
                            let val = "0.00%";
                            if (value) {
                                // val = (value*100).toFixed(2)+"%";
                                val = value.toFixed(2) + "%";
                            }
                            return val;
                        }
                    },
                    {
                        name: 'testResult', index: 'testResult', align: "left", width: 100,
                        formatter: function (value, grid, rows, state) {
                            let val = "";
                            if (value) {
                                val = value;
                            }
                            return val;
                        }
                    }
                ],
                multiselect: false,
                shrinkToFit:false
            },
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
            if(!this.body.inspectorName){
                this.body.inspectorName = '';
            }

            if(this.commodityCategoty.length>0){
                this.body.productTypeName=this.commodityCategoty[this.commodityCategoty.length-1];
            }else {
                this.body.productTypeName="";
            }
            this.reload = !this.reload;
        },
        clear() {
            this.commodityCategoty=[];
            this.$refs.inspect.reset();
            this.$refs.dType.reset();
            this.$nextTick(function(){
                this.body.inspectorName='';
                this.body.documentType='';
            });
            this.body={
                documentType:'',
                documentCode:'',
                startTime:'',
                endTime:'',
                alreadyTest:'1',
                productTypeName:'',
                inspectorName:'',
                qcDocumentCode:'',
                upstreamSourceCode:'',
            };
            this.dataValue=[];
            console.log(this.body)
        },
        //根据源单单号查详情
        detailClick(data) {
            let This = this;
            let code = data.rows.upstreamSourceCode;
            if (code) {
                let type = data.rows.documentType;
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
                            This.$Modal.error({
                                title: "提示",
                                content: "服务器出错!"
                            });
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
        //根据检验单号查详情
        testDocumentDetailClick(data){
            if (data.rows.qcDocumentCode) {
                this.queryTestDocumentByQcDocumentCode(data);
            }
        },
        queryTestDocumentByQcDocumentCode(data){
            let type = data.rows.documentType
            let bussinessStatus = data.rows.businessStatus;
            let code = data.rows.qcDocumentCode,scode = data.rows.upstreamSourceCode;
            if(type=="收货单"){
                //跳转来料检验单页面
                window.parent.activeEvent({name: '来料检验单', url: contextPath+'/quality/test-document/test-document.html', params: {code:code,scode:scode,type:1}});
            }
            if(type=="原料领用申请单"){
                //跳转调拨检验单页面
                window.parent.activeEvent({name: '调拨检验单', url: contextPath+'/quality/test-document/test-document.html', params:{code:code,scode:scode,type:1}});
            }
            if(type=="客户订单"){
                if (bussinessStatus=="代发货检验"){
                    //跳转发货检验单页面
                    window.parent.activeEvent({name: '发货检验单', url: contextPath+'/quality/test-document/test-document.html', params: {code:code,scode:scode,type:1}});
                }else {
                    //跳转调拨检验单页面
                    window.parent.activeEvent({name: '调拨检验单', url: contextPath+'/quality/test-document/test-document.html', params: {code:code,scode:scode,type:1}});
                }

            }
        },
        reloadAgain() {
            this.clear();
            this.reload = !this.reload;
        },
        //退出
        cancel() {
            window.parent.closeCurrentTab({name: '已质检列表',exit:true, openTime:this.openTime})
        },
        //获取单据类型（数据字典）
        loadCodeType(){
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
                    // alert('服务器出错啦');
                    That.$Modal.error({
                        content:'服务器出错，请稍后再试！'
                    })
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
        //获取组织下所有员工
        loadInspectorName(){
            //获取当前组织id
            let organId = window.parent.userInfo.organId;
            $.ajax({
                type: "post",
                url: contextPath+'/documentController/queryAllEmpByOrganId',
                data:{"organId":organId},
                dataType: "json",
                success: function (data) {
                    sourceDocument.inspectorNameList=data.data;
                },
                error: function () {
                    // alert('服务器出错啦');
                    sourceDocument.$Modal.info({
                        content:'服务器出错，请稍后再试！'
                    })
                }
            })
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
    mounted: function() {
        this.openTime=window.parent.params.openTime;
        this.loadProductType();
        this.loadCodeType();
        this.loadInspectorName();
    }
})
