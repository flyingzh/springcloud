let waitRepairReturn = new Vue({
    el: "#wait-goods",
    data() {
        return {
            isHideSearch: true,
            isHideList: true,
            reload: false,
            //客户信息
            selectCustomerObj:null,
            tabId: "tabList",
            selected: [],
            openTime:"",
            productTypeList:[],
            body: {
                searchGoodsType: '',
                searchRepairRegisterNo: "",
                searchCustName: "",
                searchCustNo: "",
                //开始时间
                startTime: "",
                //结束时间
                endTime: "",
            },
            dateArr: "",
            data_user_list: {
                //页表页数据
                url: contextPath + '/repairReturn/repairWaitReturnVoListPage',
                colNames:
                    ['源单类型', '单据编号', '日期', '质检结果',  '商品类型code','商品类型','商品主类型', '分类路径','客户id','客户code', '客户', '商品编码', '商品名称', '计重单位', '总重', '计数单位', '总数'],
                colModel:
                    [
                        {name: 'sourceType', index: 'sourceType', width: 220, align: "left",
                            formatter: function (value, grid, rows, state) {
                                return value = "维修登记单";
                            }
                        },
                        {
                            name: 'repairRegisterNo', index: 'repairRegisterNo', width: 220, align: "left",
                            formatter: function (value, grid, rows, state) {
                                $(document).off("click", ".updateDetail" + value).on("click", ".updateDetail" + value, function () {
                                    waitRepairReturn.updateDetail({value, grid, rows, state})
                                });
                                let btns = `<a class="updateDetail${value}">${value}</a>`;
                                return btns;
                            }
                        },
                        {name: 'createTime', index: 'createTime', width: 220, align: "left",
                            formatter :function (value, grid, rows, state) {
                                return new Date(value).format("yyyy-MM-dd");
                            }
                        },
                        {name: 'checkResult', index: 'checkResult', width: 220, align: "left",
                            formatter: function (value, grid, rows, state) {
                                if (value == 2) {
                                    return value = "检测结果不符";
                                }else {
                                    return value = "";
                                }
                            }
                        },
                        {name: 'goodsType', index: 'goodsType', width: 220, align: "center",hidden:true},
                        {name: 'goodsTypeName', index: 'goodsTypeName', width: 220, align: "left"},
                        {name: 'groupPath', index: 'groupPath', width: 220, align: "center",hidden:true},
                        {name: 'goodsMainType', index: 'goodsMainType', width: 220, align: "center",hidden:true},
                        {name: 'custId', index: 'custId', width: 220, align: "center",hidden:true},
                        {name: 'custNo', index: 'custNo', width: 220, align: "center",hidden:true},
                        {name: 'custName', index: 'custName', width: 220, align: "left"},
                        {name: 'goodsCode', index: 'goodsCode', width: 220, align: "left"},
                        {name: "goodsName", index: "goodsName", width: 220, align: "left"},
                        {name: "weightUnit", index: "weightUnit", width: 220, align: "left"},
                        {name: "totalWeight", index: "totalWeight", width: 200, align: "right"},
                        {name: "countingUnit", index: "countingUnit", width: 200, align: "center"},
                        {name: "goodsNum", index: "goodsNum", width: 200, align: "right"}
                    ]
            },
        }
    },
    methods: {
        // 选择商品类型
        changeProductType(e) {
            this.body.searchGoodsType = e.value;
            //this.body.goodsTypeName = e.label;
        },

        updateDetail(data){
            let repairRegisterNo = data.rows.repairRegisterNo;
            window.parent.activeEvent({
                name: '维修登记单',
                url: contextPath + '/repair/registration/registration-form.html',
                params: { type: 'view',repairRegisterNo:repairRegisterNo}
            });
        },

        //生成维修退货单
        produce() {
            let temp = true;
            if (this.selected.length < 0) {
                this.$Modal.info({
                    content: "请选择需要生成的单据"
                })
                return;
            }
            //判断是否满足条件  暂取第一个为参考条件
            if (this.selected.length > 1) {
                let obj = this.selected[0];
                this.selected.map((item) => {
                    if (item.customer != obj.customer || item.goodsType != obj.goodsType) {
                        this.$Modal.info({
                            content: "请选择客户和商品类型一致的单据"
                        })
                        temp = false;
                        return;
                    }
                })
            }

            //生成
            if(temp){
                //获取到需要生成的ID数组
                let arr = [];
                let arr1=[];
                let arr2=[];
                this.selected.map((item)=>{
                    arr1.push(item.id)
                })
                arr2.push(this.selected[0].goodsType)
                arr2.push(this.selected[0].goodsTypeName)
                arr2.push(this.selected[0].groupPath)
                arr2.push(this.selected[0].goodsMainType)
                arr2.push(this.selected[0].custId)
                arr2.push(this.selected[0].custName)
                arr2.push(this.selected[0].custNo)
                arr.push(1)
                arr.push(arr1);
                arr.push(arr2);

                $.ajax({
                    type: 'post',
                    async: true,
                    traditional: true,
                    data: {goodsIds: arr1},
                    url: contextPath + '/repairReturn/checkRepairGoods',
                    success: function (d) {
                        if(d.code=="100101"){
                            waitRepairReturn.$Modal.warning({
                                content:d.data+"登记单已生成，不能重复生成"
                            })

                        }else if(d.code=="100100"){
                            window.parent.activeEvent({
                                name: '维修退货单-新增',
                                url: contextPath + '/repair/repair-Return/repair-return-add.html',
                                params: {allInfo: arr, type: 'add'}
                            });
                        }else {
                            waitRepairReturn.$Modal.warning({
                                content:"系统异常"
                            })
                        }
                    },
                    error: function (e) {
                        console.log(e);
                    }
                });
            }
        },


        //刷新
        refresh() {
            waitRepairReturn.reload = !waitRepairReturn.reload;
        },
        //客户
        closeCustomer() {
            if(this.selectCustomerObj){
                this.body.searchCustName = this.selectCustomerObj.name;
            }
        },
        //退出
        exit() {
            window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
        },


        //改变日期
        changeDate(value) {
            this.body.startTime = value[0] == "" ? "" : (value[0].replace(/\//g, '-') + ' 00:00:00');
            this.body.endTime = value[1] == "" ? "" : (value[1].replace(/\//g, '-') + ' 23:59:59');
        },


        //搜索
        search() {
            let config = {
                postData: this.body,
            }
            //根据单号请求数据
            $("#" + this.tabId).jqGrid('setGridParam', config).trigger("reloadGrid");

        },

        //重置
        clean() {
            this.body = {
                searchGoodsType: '',
                searchRepairRegisterNo: "",
                searchCustName: "",
                searchCustNo: "",
                //开始时间
                startTime: "",
                //结束时间
                endTime: "",
            }
            this.dateArr=[];
            this.$refs.customerRef.clear();
            this.$refs.gtype.body.typeValue = '';
            this.reload = !this.reload;
        }
    },

    mounted() {
        //this.loadProductType()
        this.openTime = window.parent.params.openTime;
        this.$refs.customerRef.loadCustomerList('', '');
    }
})