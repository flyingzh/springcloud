var vm = new Vue({
    el: '#customer-info',
    data() {
        let This = this;
        return {
            //控制显示隐藏
            isSearchHide: true, //搜索栏
            isTabulationHide: true, // 列表
            isHide: true,
            showUpload: false,
            saveDisable: true,
            is_update: false,
            showModal: false,
            addBorder:false,//控制校验边框颜色
            selectOrginId: [],
            imgList: [],
            // 配置表头
            columns: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '组织名称',
                    key: 'orgName'
                }
            ],
            // 表格内数据,与表头对应
            colContent: [],
            openTime: "",
            isEdit: false,
            isView: false,
            is_lock: false,
            name: "",
            is_search: true,
            cpisEdit: false,
            reload: false,
            //列表选中数据
            selected: [],
            levels: [],
            currencys: [],
            wares: [],//仓库数组
            //开户行地址
            area: {},
            areaInit: {
                isInit: false,
                province: '',
                city: '',
                county: '',
                detail: '',
                disabled: false
            },
            clientType: [],
            //列表页面
            dataValue:[],
            body: {
                name: "",
                beforetime: "",
                aftertime: "",
                ids: [],
                status: -1
            },
            order: {
                startDate: "",
                endDate: ""
            },
            receiptName: "",
            showStoneList: false,
            //新增客户基本资料
            customer: {
                id: "",
                code: "",
                name: "",
                abbreviation: "",
                pricingMethod:"",
                level: "",
                nature: "",
                zipCode: "",
                payWay: "",
                settlementDays: "",
                prepaymentRatio: "",
                billingCurrency: "",
                billingMethod: "",
                companyFax: "",
                corporate: "",
                registratDate: "",
                businessNumber: "",
                taxNumber: "",
                taxCategory: "",
                vatrate: "",
                interestFreeDays: "",
                dailyRate: "",
                credits: "",
                wareHouse: "",
                status: 1,
                remark: "",
                stonePriceCode: "",
                sysFile: {
                    fileId: "",
                    fileType: "",
                    fileDetails: []
                },
                contacts: [],
                backCards: []
            },
            status: [
                // {
                //     label: '所有',
                //     value: -1
                // },
                {
                    label: '有效',
                    value: 1
                },
                {
                    label: '无效',
                    value: 0
                }
            ],
            // 付款方式
            payMethod: [],
            // 结算方式，多选
            billing: [],
            //税分类
            taxType: [],
            // 有效无效状态
            cusStatus: [
                {
                    label: '有效',
                    value: 1
                },
                {
                    label: '无效',
                    value: 0
                }
            ],
            pricingMethod: [
                {
                    label: '标签价折扣',
                    value: 1
                },
                {
                    label: '金工石计价',
                    value: 2
                }
            ],
            //数据列表jqgrid
            change_log: {
                colNames: ['变更信息', '变更前', '变更后', '变更日期', '变更人'],
                colModel: [
                    {name: 'changeInfo', index: '', width: 250, align: "center"},
                    {name: 'operationBefore', index: '', width: 250, align: "center"},
                    {name: 'operationAfter', index: '', width: 250, align: "center"},
                    {name: 'operationTime', index: '', width: 250, align: "center"},
                    {name: 'userName', index: '', width: 250, align: "center"},
                ],
            },
            logUrl: contextPath + "/tbasecustomer/changeLog?type=customer&id=-1",
            data_config: {
                url: contextPath + "/tbasecustomer/list?ktcStatus=0",
                colNames: ['客户编码', '客户名称', '等级', '地址', '默认联系人', '默认联系方式', '备注', '创建人', '创建时间'],
                colModel: [
                    {
                        name: 'code',
                        index: '',
                        width: 350,
                        align: "left",
                        formatter: function (value, grid, rows, state) {
                            var cssClass = ".detail" + value;
                            $(document).off('click', cssClass).on('click', cssClass, function () {
                                This.show(rows);
                            });
                            let myCode = `<a class="detail${value}">${value}</a>`;
                            return myCode;
                        }
                    },
                    {name: 'name', index: '', width: 350, align: "left"},
                    {
                        name: 'level ',
                        index: '',
                        width: 350,
                        align: "left",
                        formatter: function (ellvalue, options, rowObject) {
                            let vl = "";
                            for (var i = 0; i < vm.levels.length; i++) {
                                if (rowObject.level == vm.levels[i].id) {
                                    vl = vm.levels[i].name;
                                    break;
                                }
                            }
                            return vl;
                        }
                    },
                    {name: 'concreteAddress', index: 'address', width: 550, align: "left"},
                    {
                        name: 'contactName',
                        index: '',
                        width: 350,
                        align: "left",
                    },
                    {
                        name: 'contactPhone',
                        index: '',
                        width: 350,
                        align: "left",

                    },
                    {name: 'remark', width: 350, align: "left"},
                    {name: 'createName', width: 350, align: "left"},
                    {name: 'createTime', width: 600, align: "left"},
                ]
            },
            stoneNo:'',//石价表编码
            stoneName:'',//石价表名称
            stoneReload:true,
            tabId:"tabId",
            stoneSelected:[],
            stone_data_config:
                {
                    url: contextPath + "/saleStonePriceController/listByPage",
                    colNames:
                        ['选择', '石价表编号', '石价表名称', '创建日期', '创建人'],
                    colModel:
                        [
                            {name: 'id', index: 'id', hidden: false,width: 50, align: "left",
                                formatter: function (value, grid, rows, state) {
                                    let cssClass = ".detail" + value;
                                    $(document).off('click', cssClass).on('click', cssClass, function () {
                                        This.detailClick({value, grid, rows, state})
                                    });
                                    let myCode = `<a class="detail${value}">选择</a>`;
                                    return myCode;
                                }
                            },
                            {name: 'stonePriceNo', index: 'stonePriceNo', width: 250, align: "left",},
                            {name: 'name', index: 'name', width: 250, align: "left"},
                            {name: 'createTime', index: 'createTime', width: 250, align: "left",
                                formatter: function (value, grid, rows, state) {
                                    return new Date(value).format("yyyy-MM-dd");
                                }
                            },
                            {name: 'createName', index: 'createName', width: 250, align: "left"},
                        ],
                    multiselect: false,
                }
        }
    },
    created() {
        this.loadData();
    },
    methods: {
        detailClick({value, grid, rows, state}){
             this.customer.stonePriceCode = rows.stonePriceNo
             this.showStoneList = false;
             //this.customer = rows.id
        },
        //点击搜索按钮
        searchCut() {
            let config = {
                postData:
                    {
                        stonePriceNo: this.stoneNo,
                        name: this.stoneName
                    }
            }
            //根据单号请求数据
            $("#"+this.tabId).jqGrid('setGridParam', config).trigger("reloadGrid");
        },
        //点击清空按钮
        searchClear(){

            //将搜索框数据清空
            this.stoneNo = ""
            this.stoneName = ""

            let info = {
                postData:
                    {
                        stonePriceNo: this.stoneNo,
                        name: this.stoneName
                    }
            }
            //表格重新加载
            $("#" + this.tabId).jqGrid('clearGridData')
            $("#"+this.tabId).jqGrid('setGridParam', info).trigger("reloadGrid");
        },
        loadData() {
            let _this = this;
            _this.taxType = getCodeList("base_tax_type");
            _this.billing = getCodeList("base_billing_method");
            _this.payMethod = getCodeList("base_pay_method");
            _this.clientType = getCodeList("base_clientType");
            $.ajax({
                type: "POST",
                url: contextPath + "/tbasecustomer/data",
                contentType: 'application/json',
                dataType: "json",
                async: false,
                success: function (r) {
                    if (r.code === "100100") {
                        _this.levels = r.data.clientLevel;//加载等级
                        _this.currencys = r.data.currency;//加载币种
                        _this.wares = r.data.wareHouse;//加载代管仓
                        //_this.taxType = r.data.taxType;//加载税分类
                        //_this.billing = r.data.baseBillingMethod;//加载结算方式
                        //_this.payMethod = r.data.basePayMethod;//加载付款方式
                        //_this.clientType = r.data.baseClientTypes;//加载客户性质
                        //加载付款方式
                        let orgnArr = r.data.organList;
                        let organId = r.data.organId;
                        let index = -1;
                        for (let i = 0; i < orgnArr.length; i++) {
                            if (organId == orgnArr[i].id) {
                                index = i;
                                break;
                            }
                        }
                        orgnArr.splice(index, 1);
                        _this.colContent = orgnArr;
                    } else {
                        _this.$Modal.error({
                            content: "服务器异常，请联系技术人员"
                        });
                    }
                },
                error: function (err) {
                    _this.$Modal.error({
                        content: "服务器异常，请联系技术人员"
                    });
                },
            })
        },
          changeDate(value) {
            this.body.beforetime = value[0]=="" ? "" : (value[0].replace(/\//g, '-') + ' 00:00:00');
            this.body.aftertime = value[1]=="" ? "" : (value[1].replace(/\//g, '-') + ' 23:59:59');
        },
        search() {
            var _vm = this;
            var arr = [].concat(this.body.ids);
            this.body.ids = this.body.ids.length > 0 ? this.body.ids.join(",") : "";
            this.reload = !this.reload;
            setTimeout(function () {
                _vm.body.ids = arr;
            }, 10);
        },
        clearItem(name, ref){
            if(this.$refs[ref]){
                this.$refs[ref].reset();
            }
            this.$nextTick(()=>{
                this.body[name] = '';
            })
          },
        clearbody() {
            // this.$refs.start.date = '';
            // this.$refs.end.date = '';
            this.dataValue = [];
            vm.body = {
                name: "",
                beforetime: '',
                aftertime: '',
                ids: [],
                status: ''
            };
        },
        clear() {
            // this.$refs.startTime.date = '';
            this.customer = {
                id: "",
                code: "",
                name: "",
                abbreviation: "",
                level: "",
                nature: "",
                zipCode: "",
                payWay: "",
                settlementDays: "",
                prepaymentRatio: "",
                billingCurrency: "",
                billingMethod: "",
                companyFax: "",
                corporate: "",
                registratDate: "",
                businessNumber: "",
                taxNumber: "",
                taxCategory: "",
                vatrate: "",
                interestFreeDays: "",
                dailyRate: "",
                credits: "",
                wareHouse: 0,
                status: 1,
                remark: "",
                pricingMethod: "",
                stonePriceId: "",
                sysFile: {
                    fileId: "",
                    fileType: "",
                    fileDetails: []
                },
                contacts: [],
                backCards: []
            };
            //this.$refs.start.date = '';
            this.area = {};
            this.areaInit = {
                isInit: false,
                province: '',
                city: '',
                county: '',
                detail: '',
                disabled: false
            };
            this.logUrl = contextPath + "/tbasecustomer/changeLog?type=customer&id=-1";

        },
        show(rows) {
            var That = this;
            vm.logUrl = contextPath + "/tbasecustomer/changeLog?type=customer&id=" + rows.id + "&newDate=" + new Date();
            That.saveDisable = false;
            That.isEdit = true;
            That.isView = true;
            That.is_lock = true;
            $.ajax({
                type: "post",
                url: contextPath + "/tbasecustomer/info/" + rows.id,
                success: function (r) {
                    if (r.code == 100100) {
                        That.customer = r.data;
                        That.customer.registratDate = r.data.registratDate;
                        if(r.data.billingMethod){
                            let method =  JSON.parse(r.data.billingMethod);
                            That.customer.billingMethod = method;
                        }
                        // That.$refs.start.date = r.data.registratDate.substr(0,10);
                        //地址回显
                        if (r.data.province) {
                            That.areaInit = {
                                isInit: true,
                                province: r.data.province,
                                city: r.data.city,
                                county: r.data.county,
                                detail: r.data.detail,
                                disabled: true
                            }
                        }
                    }

                }
            })

        },
        //点击增加行时，显示增加页面
        addData() {
            this.isEdit = true;
            this.isView = false;
            this.is_lock = false;
            this.clear();
        },
        del() {
            var That = this;
            if (That.selected.length < 1) {
                That.$Modal.info({
                    content:"请选择要删除的数据"
                })
                return;
            } else {
                this.$Modal.confirm({
                    title:'提示信息',
                    content:'当前数据有可能被引用，会影响数据准确性，确认是否删除？',
                    onOk:() => {
                            $.ajax({
                                type: "post",
                                url: contextPath + "/tbasecustomer/delete",
                                data: JSON.stringify(That.selected),
                                contentType: 'application/json',
                                success: function (r) {
                                    That.selected = [];
                                    if (r.code == "100100") {
                                        setTimeout(function(){
                                            That.$Modal.success({
                                                content:"删除成功！"
                                            });
                                        },300)
                                        That.reload = !That.reload;
                                    } else {
                                        setTimeout(function(){
                                            vm.$Modal.info({
                                                content:'删除失败，请稍后再试！'
                                            })
                                        },300)
                                    }
                                }
                          });
                      }
                })
            }

            // layer.confirm(' 当前数据有可能被引用，会影响数据准确性，确认是否删除?', {
            //     btn: ['确定', '取消'], btn1: function (index) {
            //         if (That.selected.length > 0) {
            //             $.ajax({
            //                 type: "post",
            //                 url: contextPath + "/tbasecustomer/delete",
            //                 data: JSON.stringify(That.selected),
            //                 contentType: 'application/json',
            //                 success: function (r) {
            //                     That.selected = [];
            //                     if (r.code == "100100") {
            //                         That.$Modal.success({
            //                             content:"删除成功"
            //                         });
            //                         That.reload = !That.reload;
            //                     }
            //                 }
            //             });
            //         } else {
            //             That.$Modal.success({
            //                 content:"请选择一条数据"
            //             })
            //         }
            //         layer.close(index);
            //     },
            //     btn2: function (index) {
            //         layer.close(index);
            //     }
            // });
        },
        modify() {
            //先查询数据，再进行修改
            var That = this;
            That.is_update = true;
            if (this.selected.length == 1) {
                this.isEdit = true;
                this.isView = false;
                this.is_lock = false;
                $.ajax({
                    type: "post",
                    url: contextPath + "/tbasecustomer/info/" + vm.selected[0],
                    contentType: 'application/json',
                    success: function (r) {
                        if (r.code == "100100") {
                            That.customer = r.data;
                            if (r.data.registratDate) {
                                That.$refs.startTime.date = r.data.registratDate.substr(0, 10);
                            }
                            if(r.data.billingMethod){
                                let method =  JSON.parse(r.data.billingMethod);
                                That.customer.billingMethod = method;
                            }
                            //地址回显
                            if (r.data.province) {
                                That.areaInit = {
                                    isInit: true,
                                    province: r.data.province,
                                    city: r.data.city,
                                    county: r.data.county,
                                    detail: r.data.detail,
                                    disabled: false
                                }
                            }
                        }
                    }
                });
            } else {

                That.$Modal.info({
                    content:"请选择一条数据进行更新!"
                });
            }
        },
        view() {
            if (this.selected.length == 1) {
                let vl = {};
                vl.id = this.selected[0];
                this.show(vl);
            } else {
                this.$Modal.info({
                    content:"请选择一条数据!"
                });
            }

        },
        //点击保存时
        save() {
            var That = this;
            if (!That.saveDisable) {
                That.saveDisable = true;
                return;
            }

            var url = "";
            if (That.customer.id) {
                url = contextPath + "/tbasecustomer/update";
            } else {
                url = contextPath + "/tbasecustomer/save";
            }
            if (!That.customer.billingCurrency) {
                this.addBorder = true;
            }
            if ($('#customerForm').valid() == false) {
                return;
            }
            if (this.addBorder) {
                return;
            }
            if (!That.customer.billingCurrency) {
                this.addBorder = true;
                return;
            }
            if (!That.customer.name) {
                That.$Modal.info({
                    content:"请填写客户名称!"
                });
                return;
            }
            if (!That.customer.abbreviation) {
                That.$Modal.info({
                    content:"请填写客户简称!"
                });
                return;
            }
            if (!That.customer.level) {
                That.$Modal.info({
                    content:"请选择客户等级!"
                });
                return;
            }
            if (!That.customer.nature) {
                That.$Modal.info({
                    content:"请选择客户性质!"
                });
                return;
            }
            if (!That.customer.payWay) {
                That.$Modal.info({
                    content:"请选择付款方式!"
                });
                return;
            }
            if (!That.customer.pricingMethod) {
                That.$Modal.info({
                    content:"请选择计价方式!"
                });
                return;
            }
            if (!That.customer.billingCurrency) {
                That.$Modal.info({
                    content:"请选择结算币种!"
                });
                return;
            }
            if (!That.customer.billingCurrency) {
                That.$Modal.info({
                    content:"请选择结算方式!"
                });
                return;
            }
            if(That.customer.pricingMethod == 2){
                if(!That.customer.stonePriceCode){
                    That.$Modal.info({
                        content:"请选择石价表!"
                    });
                    return;
                }
            }
            if (That.customer.contacts.length > 0) {
                let contacts = That.customer.contacts;
                var flag = false;
                for (var i = 0; i < contacts.length; i++) {
                    if (contacts[i].isDefault == 1) {
                        flag = true;
                    }
                    if (!contacts[i].name) {
                        That.$Modal.info({
                            content:"请填写联系人姓名!"
                        });
                        return;
                    }
                    if (contacts[i].phone) {
                        var reg = /^1(3|4|5|7|8)\d{9}$/;
                        if (!reg.test(contacts[i].phone)) {
                            That.$Modal.info({
                                content:"请检查你的手机号是否正确!"
                            });
                            return;
                        }
                    } else {
                        That.$Modal.info({
                            content:"请填写联系人手机号!"
                        });
                        return;
                    }
                    if (contacts[i].email) {
                        var reg = /^[a-z0-9]+([._\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
                        if (!reg.test(contacts[i].email)) {
                            That.$Modal.info({
                                content:"请请检查你的邮箱是否正确!"
                            });
                            return;
                        }
                    } else {
                        That.$Modal.info({
                            content:"请填写联系人邮箱!"
                        });
                        return;
                    }
                }
                if (!flag) {
                    That.$Modal.info({
                        content:"请选择一个默认的联系人!"
                    });
                    return;
                }
            } else {
                That.$Modal.info({
                    content:"请至少填写一位联系人的信息!"
                });
                return;
            }
                if (That.customer.backCards && vm.customer.backCards.length > 0) {
                    for (var i = 0; i < vm.customer.backCards.length; i++) {
                        if (!That.customer.backCards[i].name) {
                            That.$Modal.info({
                                content:"请填写账户信息!"
                            });
                            return;
                        }
                        if (!That.customer.backCards[i].account) {
                            That.$Modal.info({
                                content:"请填写账户信息!"
                            });
                            return;
                        }
                        if (!That.customer.backCards[i].holder) {
                            That.$Modal.info({
                                content:"请填写开户人信息!"
                            });
                            return;
                        }
                    }

                }

            That.saveDisable = false;
            if ($('form').valid()) {
                //将area的值拷贝到add
                if (ht.util.hasValue(That.area, 'object')) {
                    Object.assign(That.customer, That.area);
                    //或 $.extend(true,this.supplier,this.area)
                }
                $.ajax({
                    type: "post",
                    url: url,
                    data: JSON.stringify(That.customer),
                    contentType: 'application/json',
                    success: function (r) {
                        if (r.code == "100100") {
                            That.$Modal.success({
                                content:r.data
                            });
                            That.saveDisable = true;
                            That.exit();
                            That.reload = !That.reload;
                        } else if (r.code == "100101") {
                            That.$Modal.info({
                                content:"保存失败,请检查你的参数是否重复!"
                            });
                            That.saveDisable = true;
                        }
                    },
                    error: function (err) {
                        That.$Modal.error({
                            content:"服务器出错,请联系技术人员!"
                        });
                        That.saveDisable = true;
                    },
                });
            }

        },
        hideSearch() {
            this.isSearchHide = !this.isSearchHide;
            $(".chevron").css("top", "")
        },

        openReceipt() {
            if(this.isView){
                return;
            }
            this.showStoneList = true;
        },
        ok1() {

        },
        cancel1() {

        },
        //点击退出时
        exit() {
            this.$refs.upload.clearFiles();
            this.saveDisable = true;
            this.is_update = false;
            this.isEdit = false;
            this.isView = false;
            this.is_lock = false;
            this.areaInit.disabled = false;
            $("form").validate().resetForm();
            this.clear();
            var $tabs = $('#tabs');
            var $tabsTitle = $tabs.find('.layui-tab-title > li');
            var $tabsContent = $tabs.find('.layui-tab-content .layui-tab-item');

            $.each($tabsTitle, function (idx, ele) {
                if (idx == 0) {
                    $(this).addClass('layui-this');
                    $tabsContent.eq(0).addClass('layui-show');
                } else {
                    $(this).removeClass('layui-this');
                    $tabsContent.eq(idx).removeClass('layui-show');
                }
            });
        },
        copy() {
            let That = this;
            if (That.selected.length == 1) {
                That.isEdit = true;
                That.isView = false;
                That.is_lock = false;
                $.ajax({
                    type: "post",
                    url: contextPath + "/tbasecustomer/info/" + That.selected[0],
                    success: function (r) {
                        if (r.code == 100100) {
                            That.customer = r.data;
                            That.customer.id = "";
                            That.customer.code = "";
                            That.customer.name = "";
                            That.customer.abbreviation = "";
                            That.customer.sysFile = {
                                fileId: "",
                                fileType: "",
                                fileDetails: []
                            };
                            if(r.data.billingMethod){
                                let method =  JSON.parse(r.data.billingMethod);
                                That.customer.billingMethod = method;
                            }
                            if (That.customer.fileId) {
                                That.customer.fileId = "";
                            }
                            if (r.data.registratDate) {
                                That.$refs.startTime.date = r.data.registratDate.substr(0, 10);
                            }

                            /* if(That.customer.sysFile){
                                 That.customer.sysFile.fileId = "";
                             }
                             if(That.customer.sysFile.fileDetails!=null && That.customer.sysFile.fileDetails.length>0){
                                 for(var i=0;i<That.customer.sysFile.fileDetails.length;i++){
                                     That.customer.sysFile.fileDetails[i].id="";
                                 }
                             }*/

                            //地址回显
                            if (r.data.province) {
                                That.areaInit = {
                                    isInit: true,
                                    province: r.data.province,
                                    city: r.data.city,
                                    county: r.data.county,
                                    detail: r.data.detail,
                                    disabled: false
                                }
                            }
                        }

                    },
                    error: function (err) {
                        That.$Modal.error({
                            content:"服务器出错,请联系技术人员!"
                        });
                    },
                })
            } else {
                That.$Modal.info({
                        content:"请选择一条数据进行复制!"
                    });
                    return;
            }
        },
        contactChecked(index) {
            $.each(this.customer.contacts, function (i, o) {
                if (index == i) {
                    o.isDefault = 1;
                } else {
                    o.isDefault = 0;
                }
            });
        },
        backCardChecked(index) {
            $.each(this.customer.backCards, function (i, o) {
                if (index == i) {
                    o.isDefault = 1;
                } else {
                    o.isDefault = 0;
                }
            });
        },
        //tab2修改联系人
        modifyContact() {
            //有数据的input由禁用改为启用
        },
        //tab2添加联系人
        addContact() {
            var contact = {
                id: '',
                name: '',
                phone: '',
                landline: '',
                wechat: '',
                isDefault: 0,
                email: '',
                isDel: '1',
            };
            /*   if(vm.customer.contacts.length>0){
                   for(var i = 0;i<vm.customer.contacts.length;i++){
                       if(vm.customer.contacts[i].name==""){
                           layer.alert("请填写联系人姓名");
                           return;
                       }
                       if(vm.customer.contacts[i].phone==""){
                           layer.alert("请填写联系人手机号");
                           return;
                       }
                       if(vm.customer.contacts[i].email!=""){
                           var reg = /^[a-z0-9]+([._\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
                           if (!reg.test(vm.customer.contacts[i].email)) {
                               layer.alert("请填写正确邮箱");
                           }
                       }
                   }
               }*/
            this.customer.contacts.push(contact);

        },
        //tab3添加银行卡信息
        addbackcard() {
            var backcard = {
                id: '',
                name: '',
                account: '',
                holder: '',
                isDefault: 0,
                isDel: '1'
            };
            /*  if(vm.customer.backCards && vm.customer.backCards.length>0){
                  for(var i = 0;i<vm.customer.backCards.length;i++){
                      if(vm.customer.backCards[i].name==null || vm.customer.backCards[i].name==''){
                              layer.alert("请填写银行信息")
                          v
                          return;
                      }
                      if(vm.customer.backCards[i].account==null || vm.customer.backCards[i].account==''){
                          layer.alert("请填写账户信息")
                          return;
                      }
                      if(vm.customer.backCards[i].holder==null || vm.customer.backCards[i].holder==''){
                          layer.alert("请填写开户人信息")
                          return;
                      }
                  }

              }*/
            vm.customer.backCards.push(backcard);

        },
        //tab2删除单个联系人
        delContact(i, event) {
            // layer.confirm('确认删除本条记录吗?', {
            //     btn: ['确定', '取消'], btn1: function (index) {
            //         vm.customer.contacts.splice(i, 1);
            //         layer.close(index);
            //     },
            //     btn2: function (index) {
            //         layer.close(index);
            //     }
            // });
            this.$Modal.confirm({
                title:'提示信息',
                content:'确认删除本条记录吗？',
                onOk: () => {
                    vm.customer.contacts.splice(i, 1);
                }
            })

        },
        delBackCard(i) {
            // layer.confirm('确认删除本条记录吗?', {
            //     btn: ['确定', '取消'], btn1: function (index) {
            //         vm.customer.backCards.splice(i, 1);
            //         layer.close(index);
            //     },
            //     btn2: function (index) {
            //         layer.close(index);
            //     }
            // })
            this.$Modal.confirm({
                title:'提示信息',
                content:'确认删除本条记录吗？',
                onOk: () => {
                    vm.customer.backCards.splice(i, 1);
                 }
            })

        },
        delfileDetails(i, id) {
            // let That = this;
            // layer.confirm('确认删除本条记录吗?', {
            //     btn: ['确定', '取消'], btn1: function (index) {
            //         //vm.customer.sysFile.fileDetails.splice(i,1);
            //         var sysFiles = That.customer.sysFile.fileDetails[i];
            //         sysFiles.del = true;
            //         layer.close(index);
            //     },
            //     btn2: function (index) {
            //         layer.close(index);
            //     }
            // })
            this.$Modal.confirm({
                title:'提示信息',
                content:'确认删除本条记录吗？',
                onOk: () => {
                    var sysFiles = this.customer.sysFile.fileDetails[i];
                    sysFiles.del = true;
                }
            })
        },
        findLevel() {
            $.ajax({
                type: "POST",
                url: contextPath + "/tclientlevel/listForApply?apply=0&ktcStatus=0",
                success: function (r) {
                    if (r.code === '100100') {
                        vm.levels = r.data.splice(0, 10);
                    }
                }
            });
        },
        showOrgin() {
            this.selectOrginId = [];
            if (this.selected.length == 0) {
                this.$Modal.warning({
                    content:"请选择行!"
                });
                return;
            }
            this.showModal = true;
        },
        okModel() {
            if (this.selectOrginId.length == 0) {
                this.$Modal.warning({
                    content:"请选择分配组织!"
                });
                return;
            }
            let param = {
                ids: {},
                orginIds: {}
            }
            param.ids = this.selected.join(',');
            param.orginIds = this.selectOrginId.join(',');
            this.cancelModel();
            let that = this;
            $.ajax({
                type: "POST",
                url: contextPath + '/tbasecustomer/allot',
                traditional: true,
                // contentType: 'application/json',
                datatype: "json",//请求数据返回的类型。可选json,xml,txt
                data: param,
                success: function (result) {
                    if (result.code === "100100") {
                        that.$Modal.success({
                            content:"分配成功!"
                        });
                        that.selectOrginId = [];
                    } else {
                        that.$Modal.info({
                            content:result.msg
                        });
                    }
                },
                error: function (err) {
                    that.$Modal.info({
                        content: "服务器出错,请联系技术人员"
                    });
                },
            });
        },
        cancelModel() {
            this.selectOrginId = [];
            this.$refs.test.selectAll(false);
            this.showModal = false;
        },
        changeselect(selection) {
            // 获取勾选的行数据
            for (let i = 0; i < selection.length; i++) {
                this.selectOrginId.push(selection[i].id);
            }
        },
        //上传文件弹出框
        uploadfile() {
            var This = this;
            layui.use('upload', function () {
                var upload = layui.upload;
                This.imgList = [];
                //执行实例
                var uploadInst = upload.render({
                    elem: '#uploadfile' //绑定元素
                    , url: contextPath + '/tbasecustomer/img' //上传接口
                    , accept: 'file'
                    , multiple: true
                    , auto: false
                    , choose: function (obj) {
                        obj.preview(function (i, file, result) {
                            //对上传失败的单个文件重新上传，一般在某个事件中使用
                            //obj.upload(index, file);
                            if (file.size > 2 * 1024 * 1024) {
                                This.$Modal.info({
                                    content: "请上传小于2M的文件"
                                });
                                layer.close(index);
                                return;
                            }
                            var flag = true;
                            /*var flag =  This.imgList.find(item =>{
                                   return item == file.name;
                              });
                             */
                            if (This.imgList.length > 0) {
                                for (var i = 0; i < This.imgList.length; i++) {
                                    if (This.imgList[i] == file.name) {
                                        flag = false;
                                    }
                                }
                            }
                            if (flag) {
                                This.imgList.push(file.name);
                            }

                        });

                    }
                    , done: function (res) {
                        if (res.code == 100100) {
                            //上传完毕回调
                            This.$Modal.info({
                                content: "上传成功"
                            });
                            if (res.data != null) {
                                let fileDetails = res.data;
                                if (!vm.customer.sysFile.fileDetails) {
                                    vm.customer.sysFile = {
                                        fileId: "",
                                        fileType: "",
                                        fileDetails: []
                                    }
                                }
                                This.customer.sysFile.fileDetails.push(fileDetails);
                                layer.close(index);
                            }
                        } else {
                            This.$Modal.error({
                                content: "上传失败，请联系人员"
                            });
                        }

                    }
                    , error: function () {
                        //请求异常回调
                        This.$Modal.error({
                            content: "上传失败，请检查文件的大小"
                        });
                    }
                });
                let index = layer.open({
                    title: '上传文件',
                    type: 1,
                    area: ['420px', '230px'],
                    btn: ['确认', '取消'],
                    yes: function () {
                        uploadInst.upload();
                    },
                    btn2: function () {
                    },
                    content: $('#uploadConfirm')
                });
            });
        },
        cancle() {
            window.parent.closeCurrentTab({exit: true, openTime: this.openTime})
        },
        validatephone(val) {
            if (val != "") {
                var reg = /^1(3|4|5|7|8)\d{9}$/;
                if (!reg.test(val)) {
                    this.$Modal.info({
                        content: "请填写正确手机号"
                    });
                }
            }
        },
        validatemail(val) {
            if (val != "") {
                var reg = /^[a-z0-9]+([._\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
                if (!reg.test(val)) {
                    this.$Modal.info({
                        content: "请填写正确的邮箱"
                    });
                }
            }
        },
        handleSuccess(res, file) {

            if (res.code == "100100") {
                let fileDetails = res.data;
                if (!vm.customer.sysFile.fileDetails) {
                    vm.customer.sysFile = {
                        fileId: "",
                        fileType: "",
                        fileDetails: []
                    }
                }
                vm.customer.sysFile.fileDetails.push(fileDetails);
            } else {
                this.$Modal.error({
                    content: "上传失败"
                });
            }
        },
        handleFormatError(file) {
            this.$Notice.warning({
                title: '提示',
                desc: '文件上传失败，请联系技术人员'
            });
        },
        handleMaxSize(file) {
            this.$Notice.warning({
                title: '提示',
                desc: '文件: ' + file.name + ' 的大小超过2M,请上传小于2M的文件'
            });
        },
        handleBeforeUpload() {
            // const check = this.uploadList.length < 5;
            // if (!check) {
            //     this.$Notice.warning({
            //         title: 'Up to five pictures can be uploaded.'
            //     });
            // }
            // return check;
        },
        modalOk() {
            this.showUpload = false;
        },
        modalCancel() {

        },
        initFormValidate() {
            var validateOptions = {
                onfocusout: function (element) {
                    $(element).valid();
                },
                onkeyup: false,
                rules: {
                    name: {
                        required: true,
                        remote: {
                            url: contextPath + "/tbasecustomer/findByName",  //后台处理程序
                            type: "post",  //数据发送方式
                            dataType: "json",  //接受数据格式
                            data: {  //要传递的数据
                                id: function () {
                                    return vm.customer.id;
                                }
                            },
                            dataFilter: function (data, type) {//判断控制器返回的内容
                                var res = JSON.parse(data);
                                if (res.code === "100100") {
                                    return false;
                                } else {
                                    return true;
                                }
                            }

                        }
                    },
                    abbreviation: {
                        required: true,
                        remote: {
                            url: contextPath + "/tbasecustomer/findByName",  //后台处理程序
                            type: "post",  //数据发送方式
                            dataType: "json",  //接受数据格式
                            data: {  //要传递的数据
                                id: function () {
                                    return vm.customer.id;
                                }
                            },
                            dataFilter: function (data, type) {//判断控制器返回的内容
                                var res = JSON.parse(data);
                                if (res.code === "100100") {
                                    return false;
                                } else {
                                    return true;
                                }
                            }

                        }
                    },
                    vatrate: {
                        //增值税率
                        maxlength: 50
                    },


                    credits: {
                        //信用额度
                        maxlength: 50
                    },
                    billingMethod: {
                        required: true,
                    },
                    remark: {
                        maxlength: 255
                    },
                },
                messages: {
                    name: {
                        required: "请填写名称!",
                        remote: "该名称已存在!"
                    },
                    abbreviation: {
                        required: "请填写简称!",
                        remote: "该简称已存在!"
                    },
                }
            };

            //validate start
            $.validator.addMethod("pattern", function (value, element, params) {

                if (!params.test(value)) {
                    return false;
                }
                return true;
            });
            $.validator.addMethod("isPositiveInteger", function (value, element) {
                var isPositiveInteger = /^([0-9]*[1-9][0-9]*)$/;
                return this.optional(element) || isPositiveInteger.test(value);
            }, "请输入正整数");
            $.validator.addMethod("isDecimal", function (value, element) {
                var isDecimal = /^(\d{1,2}(\.\d{1,2})?|100)$/;
                return this.optional(element) || isDecimal.test(value);
            }, "0-100之间的数据，支持2位小数!");
            $.validator.addMethod("onlyDecimal", function (value, element) {
                var onlyDecimal = /(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2}))$/;
                return this.optional(element) || onlyDecimal.test(value);
            }, "只能填写小数,不能超过2位小数!");
            $.validator.addMethod("isBlank", function (value, element) {
                var isBlank = /^\s+$/;
                return this.optional(element) || isBlank.test(value);
            }, "请输入正确的值，禁止全部空格!");
            $("#customerForm").validate(validateOptions);
        }
    },
    watch:{
        'customer.billingMethod':function(newValue,oldValue){
            if(!newValue || newValue.length === 0){
                this.addBorder = true;
            }else{
                this.addBorder = false;
            }
        }
    },
    mounted() {
        this.initFormValidate();
        this.openTime = window.parent.params.openTime;
    }
});