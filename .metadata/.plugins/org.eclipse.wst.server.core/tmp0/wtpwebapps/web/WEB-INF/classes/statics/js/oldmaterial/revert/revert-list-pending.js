var returnPendingList = new Vue({
    el: '#returnPendingList',
    data() {
        let This = this;
        return {
            openTime: '',
            isSearchHide: true, //搜索栏
            isTabulationHide: true, // 列表
            reload: false,
            selected: [],
            dateArr:[],
            selectCustomerObj:null,
            body: {
                orderNo:'',
                customerId:'',
                startTime:'',
                endTime:''
            },
            processResult:{
                "return":"返料"
            },
            data_config: {
                url: contextPath + '/toldmaterialrevert/recycleListPage',
                colNames: ['源单类型','源单编号', 'id','日期', '处理结果', '客户'],
                colModel: [
                    {name:'orderType',index:'orderType',width: 150, align: "left",
                        formatter :function (value, grid, rows, state) {
                            return '旧料收回单';
                        }
                    },
                    {name: 'orderNo', index: 'orderNo', width: 150, align: "left",
                        formatter: function (value, grid, rows, state) {
                            // console.log(value, grid, rows, state);
                            $(document).off('click', ".detail" + value).on('click', ".detail" + value, function () {
                                This.testOrderDetailClick({value, grid, rows, state})
                            });
                            let myCode = `<a class="detail${value}">${value}</a>`;
                            return myCode;
                        },
                        unformat: function (value, grid, rows) {
                            return value.replace(/(<\/?a.*?>)/g, '');
                        }
                    },
                    {name: 'id', hidden:true},
                    {name: 'recycleDate', index: 'recycleDate', width: 150, align: "center",align:"left",
                        formatter :function (value, grid, rows, state) {
                            return new Date(value).format("yyyy-MM-dd");
                        }
                    },
                    {name: 'processingResults', index: 'processingResults', align: "left", width: 150,
                        formatter: function (value, grid, rows, state) {
                        return returnPendingList.processResult[value]
                        }
                    },
                    {name: 'customerName', index: 'customerName', align: "left", width: 150}
                ],
            },
        }
    },
    methods: {
        //加载客户
        loadCustomers(){
            var That = this;
            $.ajax({
                type: "post",
                url: contextPath + '/tbasecustomer/list?page=1&limit=30',
                contentType: 'application/json',
                dataType: "json",
                success: function (res) {
                    if(res.code == 100100){
                        That.customers =  res.data.list;
                    }
                },
                error: function (err) {
                    That.$Modal.info({
                        scrollable:true,
                        content:"系统异常,请联系技术人员！",
                    })
                },
            })
        },
      testOrderDetailClick(data){
            console.log(data.rows.id);
            window.parent.activeEvent({
                name: '查看旧料回收单详情',
                url: contextPath + '/oldmaterial/recycle/old-recycle-add.html',
                params: {
                    type: 'query',
                    id: data.rows.id
                }
            });
        },
        closeCustomer(){
            if(this.selectCustomerObj){
                this.body.customerId = this.selectCustomerObj.id;
            }
        },
        //搜索清空按钮
        search() {
            if (this.dateArr.length > 0 && this.dateArr[0] && this.dateArr[1]) {
                this.body.startTime = this.dateArr[0].format("yyyy-MM-dd")+" 00:00:00";
                this.body.endTime = this.dateArr[1].format("yyyy-MM-dd")+" 23:59:59";
            } else {
                this.body.startTime = '';
                this.body.endTime = '';
            }
            this.reload=!this.reload;

        },
        clear() {
           // this.$refs.customerList.reset();
           this.dateArr = [];
           this.$refs.customerRef.clear();
           this.body = {
                orderNo:'',
                customerId:'',
                startTime:'',
                endTime:''
            };
           let config = {
               postData:{
                   orderNo:'',
                   customerId:'',
                   startTime:'',
                   endTime:''
               }
           };
            jQuery("#myTable").jqGrid('clearGridData');
            jQuery("#myTable").jqGrid('setGridParam', config).trigger("reloadGrid");

        },
        //顶部菜单栏按钮
        refresh(){
            this.clear();
            this.reload = !this.reload;
        },
        //生成舊料返料單
        produceDocument() {
            let flag = true;
            if(!ht.util.hasValue(this.selected, "array")){
                this.$Modal.info({
                    title: "提示信息",
                    content: "至少选择一条记录"
                });
                return false;
            } else {
                outLoop:
                    for (let a in this.selected) {
                        for (let b in this.selected) {
                            if (this.selected[a].customerId != this.selected[b].customerId) {
                                this.$Modal.info({
                                    title: '提示信息',
                                    content: '客户不一致，请重新选择！'
                                });
                                flag = false;
                                break outLoop;
                            }
                    }
                }
            }
            var params ={
                ids:{},
                organizationId:{}
            };
            let ids = [];
            for(let num in this.selected){
                ids.push(this.selected[num].id)
            }
            //********************
            params.ids = ids.join(',')
            params.organizationId = layui.data('user').organizationId
            console.log(JSON.stringify(ids));
            //********************

            if(flag){
                window.parent.activeEvent({
                    name: '生成旧料返料单',
                    url: contextPath + '/oldmaterial/revert/revert-add.html',
                    params: {type: 'produceDocument', basicInfo: params}
                });

                //************************************
                // $.ajax({
                //     url: contextPath + '/toldmaterialrevert/produceDocument',
                //     method: 'post',
                //     dataType: "json",
                //     data: params,
                //     success: function (data) {
                //         if (data.code === '100100') {
                //             window.parent.activeEvent({
                //                 name: '生成旧料返料单',
                //                 url: contextPath + '/oldmaterial/revert/revert-add.html',
                //                 params: {type: 'produceDocument', basicInfo: data.data.data}
                //             });
                //         } else {
                //             layer.alert(data.msg, {icon: 0});
                //         }
                //     },
                //     error: function (e) {
                //         layer.alert('生成旧料返料单失败！', {icon: 0});
                //     }
                // });
                //************************************
            }

        },
        cancel() {
            window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
        }



    },
    created(){
        this.loadCustomers();

    },
    watch: {
        'body.customerId':function(val){
           if(typeof val == 'undefined'){
               this.body.customerId = '';
           }
        },

    },
    mounted(){
        this.$refs.customerRef.loadCustomerList('');
        this.openTime = window.parent.params.openTime;
    },
})
