var vm = new Vue({
    el: '#purchasingList',
    data() {
        let This = this;
        return {
            newCustomCode: [],
            productType: [],
            openTime: '',
            isSearchHide: true, //搜索栏
            isTabulationHide: true, // 列表
            isShow: false,
            isHide:true,
            currentTab:'tab1',
            //业务员下拉数据
            buyerOptions:[],
            commodityCategoty:[],
            //选择供应商弹窗
            showSupplier:false,
            //详细弹窗
            showDetail:false,
            showPurcahseDetail:false,
            //所有供应商
            supplierNameMap:{},
            buyerMap:{},
            //查询条件---商品类型,供应商
            categoryType:[],
            suppliers:[],
            dateArr:[],
            colour:[],
            //搜索条件
            body:{
                goodsGroupPath:'',//商品类型
                custStyleCode:'',//款式类型
                supplierId:'',//供应商
                startTime:'',//日期
                endTime:'',//日期
                goldColor:'',//成色
                goodsName:'',//商品名称
                limit:10,//pagesize,默认初始显示10条/页
                page:1 //currentPage 默认初始显示第1页
            },
            //弹窗表格表头数据
            columnData:[
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '商品编码',
                    key: 'goodsCode',
                },
                {
                    title: '金料详情',
                    key: 'goldMessage',
                    width: 250,
                },
                {
                    title: '石料详情',
                    key: 'stoneMessage',
                    width: 250,
                },
                {
                    title: '备注',
                    key: 'remark',
                },
                {
                    title: '待采购数量',
                    key: 'totalNum',
                },
                {
                    title: '待采购重量',
                    key: 'totalWeight',
                }
            ],
            //供应商弹窗数据
            supplierData:[],
            //下单类型
            orderType:'',
            orderGenre:'',
            //待采购列表
            generalList:[],
            detailDataList:[],
            isCheckedAll:false,
            selectedIndex:'',
            outIndex:[],
            outData:[],
            tmpData:[],
            innerData:[{}],
            postData:[],//最终提交的下单数据
            selectedSupplier:'',
            selectedSupplierName:'',
            currentGeneral:null,
            totalGeneral:null,
            //受托加工列表
            generalList:[],
            isCheckall:false,
            oData:[],
            oIndex:[],
            iData:[{}],
            totalPurchase:null,
            currentPurchase:null,
        }
    },
    methods: {
        closeSupplier(id, code, name){
            // console.log(id, code, name);
            this.body.supplierId = id;
        },
        hideSearch() {
            this.isHide=!this.isHide;
            this.isSearchHide = !this.isSearchHide;
            $(".chevron").css("top","")
        },
        clearItem(name, ref){
            if(this.$refs[ref]){
                this.$refs[ref].reset();
            }
            this.$nextTick(()=>{
                this.body[name] = '';
            })
        },
        //外层复选框单选
        getOutData(type,index){
            // console.log(type,index);
            if (type === 'general') {
                if(this.outIndex.indexOf(index) > -1) {
                    let i = this.outIndex.indexOf(index);
                    this.outIndex.splice(i,1);
                    this.outData.splice(i,1);
                } else {
                    this.outIndex.push(index);
                    this.outData.push(this.generalList[index]);
                }
                if(this.outIndex.length === this.generalList.length) {
                    this.isCheckedAll = true;
                } else {
                    this.isCheckedAll = false;
                }
            } else if (type === 'purchase'){
                if(this.oIndex.indexOf(index) > -1) {
                    let i = this.oIndex.indexOf(index);
                    this.oIndex.splice(i,1);
                    this.oData.splice(i,1);
                } else {
                    this.oIndex.push(index);
                    this.oData.push(this.purchasingList[index]);
                }
                if(this.oIndex.length === this.purchasingList.length) {
                    this.isCheckall = true;
                } else {
                    this.isCheckall = false;
                }
            }
        },
        //外层复选框全选
        getAll(type){
          if(type === 'general') {
              if(!this.isCheckedAll) {
                  this.outIndex = [];
                  this.outData = [];
                  this.generalList.forEach( (el,i) => {
                      this.outIndex.push(i);
                  this.outData.push(el);
              })
              } else {
                  this.outIndex = [];
                  this.outData = [];
              }
              // console.log(this.outIndex,this.outData);
          }else if(type === 'purchase') {
              if(!this.isCheckall) {
                  this.outIndex = [];
                  this.outData = [];
                  this.purchasingList.forEach( (el,i) => {
                      this.oIndex.push(i);
                  this.oData.push(el);
              })
              } else {
                  this.oIndex = [];
                  this.oData = [];
              }
              // console.log(this.oIndex,this.oData);
          }
        },
        //内层复选框数据
        getOneRow(selection,row){
            // console.log(selection,row);
            this.tmpData = [];
            this.tmpData = JSON.parse(JSON.stringify(selection));
        },
        getAllRow(selection){
            // console.log(selection);
            this.tmpData = [];
            this.tmpData = JSON.parse(JSON.stringify(selection));
        },
        cancelOneRow(selection){
            // console.log(selection);
            this.tmpData = [];
            this.tmpData = JSON.parse(JSON.stringify(selection));
        },
        oneRow(selectContent,row){
            // console.log(selectContent,row);
            this.tmpData = [];
            this.tmpData = JSON.parse(JSON.stringify(selectContent));
        },
        allRow(selectContent){
            // console.log(selectContent);
            this.tmpData = [];
            this.tmpData = JSON.parse(JSON.stringify(selectContent));
        },
        changeRow(selectContent){
            // console.log(selectContent);
            this.tmpData = [];
            this.tmpData = JSON.parse(JSON.stringify(selectContent));
        },
        //分页
        changePages(page){
            // console.log(page);//第几页
            this.body.page = page;
            this.loadGeneralList();
        },
        changePageSize(pagesize){
            // console.log(pagesize);//一页几条
            this.body.limit = pagesize;
            this.loadGeneralList();
        },
        switchPages(current){
            this.body.page = current;
            this.loadPurchasingList();
        },
        switchPageSize(size){
            this.body.limit = size;
            this.loadPurchasingList();
        },
        //处理列表数据
        handleListData(array){
            let newList =  array;
            if(array){
                    newList.forEach((el) => {
                        let sum = 0;
                        let tot = 0;
                    //待采购数量合计
                    el.details.forEach((e) => {
                        if(e.totalNum) {
                            sum += parseFloat(e.totalNum);
                        }
                        if(e.totalWeight){
                            tot += parseFloat(e.totalWeight*100);
                        }
                    })
                    el['totalAmount'] = sum;
                    el['totalWeight'] = (tot/100).toFixed(2);
                    //处理供应商ID,供应商简称
                    el['supplierShortName'] = [];
                    el['supplierId'] = [];
                    // if(el.supplierId){
                    //     el.supplierId = JSON.parse(el.supplierId).map(Number);
                    //     el.supplierId.forEach( elem => {
                    //         if(vm.supplierNameMap[elem]){
                    //             el['supplierShortName'].push(vm.supplierNameMap[elem]);
                    //         }
                    //     })
                    // }
                    if(el.suppliersList) {
                        el.suppliersList.forEach( elem => {
                            el['supplierId'].push(elem.supplierId);
                        })
                        el['supplierId'].forEach( elem => {
                            if(vm.supplierNameMap[elem]){
                            el['supplierShortName'].push(vm.supplierNameMap[elem]);
                        }
                    })
                    }
                    //显示前三个供应商的简称
                    if(el['supplierShortName'].length >= 3 ) {
                        el['supplierShortName'] = el['supplierShortName'].slice(0,3);
                    }
                    el['supplierShortName'] = el['supplierShortName'].join("、");
                    //业务员
                    // el['buyerInfo'] = [];
                    this.$set(el,'buyerInfo',[]);
                    if(el.buyer){
                        el.buyer = JSON.parse(el.buyer).map(Number);//[80,83,85,105]
                        el.buyer.forEach( elem => {//elem,单个员工id
                            if(vm.buyerMap[elem]){
                               el['buyerInfo'].push({
                                   id:elem,
                                   emp_Name:vm.buyerMap[elem]
                               })
                            }
                        })
                        // console.log(el['buyerInfo']);
                    }
                })
            }
            // console.log(newList);
            return newList;
        },
        //加载待采购列表数据
        loadGeneralList (){
            let This = this;
            $.ajax({
                type: "post",
                url: contextPath + '/tpurchaselist/generalList ',
                // url: contextPath + '/tpurchaselist/purchaseList ',
                contentType: 'application/json',
                data:JSON.stringify(This.body),
                dataType: "json",
                success: function (res) {
                    // console.log("普通",res.data.list);
                    if(res.code != "100100"){
                        This.$Modal.warning({
                            title:'提示信息',
                            content:'服务器出错，请联系相关技术人员！'
                        })
                        return
                    }
                    This.generalList = This.handleListData(res.data.list);
                    This.totalGeneral = res.data.totalCount;
                    This.currentGeneral = res.data.currPage;
                },
                error: function (err) {
                    console.log("服务器出错");
                },
            })
        },
        //加载受托加工列表数据
        loadPurchasingList (){
            let This = this;
            $.ajax({
                type: "post",
                url: contextPath + '/tpurchaselist/purchaseList ',
                contentType: 'application/json',
                data:JSON.stringify(This.body),
                dataType: "json",
                success: function (res) {
                    // console.log("受托：",res.data.list);
                    if(res.code != "100100"){
                        This.$Modal.warning({
                            title:'提示信息',
                            content:'服务器出错，请联系相关技术人员！'
                        })
                        return
                    }
                    This.purchasingList = This.handleListData(res.data.list);
                    This.totalPurchase = res.data.totalCount;
                    This.currentPurchase = res.data.currPage;
                },
                error: function (err) {
                    console.log("服务器出错");
                },
            })
        },

        // 供应商信息
        getSupplierInfo(val) {
            for(var i=0; i<vm.suppliers.length; i++) {
                if(vm.suppliers[i].id === val) {                   
                        return [vm.suppliers[i].supplierName,vm.suppliers[i].supplierCode];                   
                }
            }
        },
        //点击详细
        showDetailList(type,index) {
            if(type === 'general') {
                this.showDetail = true;
                this.detailDataList = this.generalList[index].details;
                this.selectedIndex = index;
            } else if (type === 'purchase') {
                this.showPurcahseDetail = true;
                this.detailDataList = this.purchasingList[index].details;
                this.selectedIndex = index;
            }
        },
        //查询业务员
        // queryBuyer(ids,index) {
        //     let that = this;
        //     if(this.buyerOptions[index]){
        //         return;
        //     }
        //     var ids = [80];
        //     $.ajax({
        //         type: "post",
        //         contentType: 'application/json',
        //         data:JSON.stringify(ids),
        //         url: contextPath + '/tpurchaselist/queryEmployee',
        //         dataType: "json",
        //         success: function (data) {
        //             console.log(data.data);
        //             that.$set(that.buyerOptions,index,data.data);
        //
        //         },
        //         error: function () {
        //             layer.alert('服务器出错啦');
        //         }
        //     })
        // },
        loadBuyer(){
            let That = this;
            $.ajax({
                type: "post",
                url: contextPath + '/tpurchasecollectgoods/data' ,
                dataType: "json",
                success: function (r) {
                    r.data.employees.map( item => {
                        That.buyerMap[item.id] = item.empName;
                    })
                    // console.log(That.buyerMap);
                },
                error: function () {
                    That.$Modal.warning({
                        title:'提示信息',
                        content:'服务器出错，请稍后再试！'
                    })
                }
            })
        },
        //加载供应商
        loadSuppliers() {
            let That = this;
            $.ajax({
                type: "post",
                url: contextPath + '/tpurchasecollectgoods/findSupplierByOrgId',
                dataType: "json",
                success: function (r) {
                    That.suppliers =  r.data;
                    let data= r.data;
                    data.map( item => {
                        That.supplierNameMap[item.id] = item.siShortName;
                    })
                },
                error: function () {
                    // console.log('服务器出错啦');
                    That.$Modal.warning({
                        title:'提示信息',
                        content:'服务器出错，请稍后再试！'
                    })
                }
            })
        },
        //款式类型
        loadSytleCategory() {
            var That = this;
            $.ajax({
                url: contextPath + '/tbasestylecategory/listByAll?customCode=0.',
                type: 'POST',
                dataType: "json",
                success(r) {
                    That.productType = That.initGoodStyle(r.data.styles)
                },
                error() {
                    // layer.alert("网络异常，请重试！", {icon: 0});
                    That.$Modal.warning({
                        title:'提示信息',
                        content:'服务器出错，请稍后再试！'
                    })
                }
            });
        },
        initGoodStyle(type) {
            let result = [];
            type.forEach((item) => {//无条件放入result,children可能为undefined
                let {
                    customCode: value,
                    styleName: label,
                    styles: children
                } = item

                if (children) {
                    children = this.initGoodStyle(children)
                }

                result.push({
                    value,
                    label,
                    children
                })
            })

            result.forEach((item) => {//将children=undefined删除
                if (!item.children) {
                    delete item.children;
                }
            })

            return result

        },
        loadColour() {
            let This = this;
            $.ajax({
                type:"post",
                url: contextPath + '/tpurchaselist/queryColour',
                dataType : "json",
                success:function (data) {
                    console.log("成色:"+data.data)
                    This.colour = [];
                    for(let c of data.data){
                        This.colour.push(c)
                    }
                },
                error:function () {
                    // layer.alert('服务器出错啦');
                    This.$Modal.warning({
                        title:'提示信息',
                        content:'服务器出错，请稍后再试！'
                    })
                }
            })

        },
        //加载商品类型
        loadProductType() {
            var That = this;
            $.ajax({
                type: "post",
                url: contextPath + '/documentController/getCategory?parentId=0',
                contentType: 'application/json',
                dataType: "json",
                success: function (res) {
                    That.categoryType = That.initGoodCategory(res.data.cateLists)
                },
                error: function (err) {
                    // console.log("服务器出错");
                    That.$Modal.warning({
                        title:'提示信息',
                        content:'服务器出错，请稍后再试！'
                    })
                },
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


        //取交集
        intersect(arg){
            let result = [];
            let obj = {};
            for (let i = 0; i<arg.length; i++) {
                for (let j = 0; j<arg[i].length; j++) {
                    let str = arg[i][j];
                    if (!obj[str]) {
                        obj[str] = 1;
                    } else {
                        obj[str]++;
                        if(obj[str] == arg.length) {
                            result.push(str);
                        }
                    }
                }
            }
            return result;
        },
        isAllEqual(array){
            if(array.length>0) {
                return !array.some(function(value,index){
                    return value !== array[0];
                });
            } else {
                return true;
            }
        },
        getData(sid,sname,oType,genre){
            this.selectedSupplier = sid;
            this.selectedSupplierName = sname;
            console.log(oType,genre,this.selectedSupplier);
            this.showSupplier = false;
            if(oType === 'general') {
                if(genre === 'out') {
                    this.changeData(this.outData);
                    this.postData = this.outData;
                } else if(genre === 'inner') {
                    this.changeData(this.innerData);
                    this.postData = this.innerData;
                }
                console.log(this.postData);
                $.ajax({
                    type: "post",
                    contentType: 'application/json;charset=UTF-8',
                    data:JSON.stringify(vm.postData),
                    dataType: "json",
                    url: contextPath + '/tpurchaselist/submitPurchaseOrder?type=1',
                    success: function (data) {
                        console.log(data);
                        if(data.code === '100100'){
                            vm.$Modal.success({
                                content:"下单申请成功，请填写采购订单页面！",
                                onOk:()=>{
                                    window.location.reload(true);
                                }
                            });
                            // console.log(data.data)
                            window.parent.activeEvent({
                                name:'新增采购订单',
                                url:contextPath+'/purchase/purchase-order/purchase-order.html',
                                params:{
                                    basicInfo:data.data,
                                    type:'sAdd'}
                            })
                        } else {
                            vm.$Modal.info({
                                title: '提示信息',
                                content: '下单申请失败，请重新下单！',
                                onOk:()=>{
                                    window.location.reload(true);
                                }
                            });
                        }
                    },
                    error: function () {
                        layer.alert('服务器出错啦');
                    }
                })
            } else if(oType === 'purchase'){
                if(genre === 'out') {
                    this.changeData(this.oData);
                    this.postData = this.oData;
                } else if(genre === 'inner') {
                    this.changeData(this.iData);
                    this.postData = this.iData;
                }
                console.log(this.postData);
                $.ajax({
                    type: "post",
                    contentType: 'application/json;charset=UTF-8',
                    data:JSON.stringify(vm.postData),
                    dataType: "json",
                    url: contextPath + '/tpurchaselist/submitPurchaseOrder?type=0',
                    success: function (data) {
                        console.log(data);
                        if(data.code === '100100'){
                            vm.$Modal.success({
                                content:"采购下单成功！",
                                onOk:()=>{
                                    window.location.reload(true);
                                }
                            });
                            window.parent.activeEvent({
                                name:'新增采购订单',
                                url:contextPath+'/purchase/purchase-order/purchase-order.html',
                                params:{
                                    basicInfo:data.data,
                                    type:'sAdd'}
                            })
                        } else {
                            vm.$Modal.info({
                                title: '提示信息',
                                content: '采购下单失败，请重新下单',
                                onOk:()=>{
                                    window.location.reload(true);
                                }
                            });

                        }
                    },
                    error: function () {
                        // layer.alert('服务器出错啦');
                        vm.$Modal.warning({
                            title:'提示信息',
                            content:'服务器出错，请稍后再试！'
                        })
                    }
                })
            }
        },
        changeData(arr){
            console.log(arr);
           arr.forEach( elem => {
               elem.supplierId = this.selectedSupplier;//供应商ID
               elem.supplierName = this.selectedSupplierName;//供应商全称
               // elem.buyerName = elem.buyerInfo.label;//业务员名字
               // elem.buyer = elem.buyerInfo.value;//业务员Id
           })
            return arr;
        },
        //获取选中业务员名字，id
        getBuyerName(e,val){
            console.log(e,val);
            val.buyerName = e.label;
        },
        getSupplierId(arr) {
            let obj = [];
            arr.forEach( elem => {
                obj.push(elem.supplierId);
        })
            return obj;
        }, 
        handleOutData(array){
            if(array.length === 0) {
                this.$Modal.info({
                    title: '提示信息',
                    content: '您没有选择任何数据，不能下单，请重新选择！'
                });
                return;
            }
            let arr = array;
            console.log(arr);
            for(let i = 0;i<arr.length;i++) {
                if(!arr[i].buyer) {
                    this.$Modal.info({
                        content:"所选数据行业务员为必选项，请重新选择！"
                    });
                    return;
                }
            }
            //判断商品类型,业务员是否一致？不一致不能下单
            let pType = [], emp = [];;
            arr.forEach( elem => {
                pType.push(elem.goodsType);
                emp.push(elem.buyer);
            })
            if(!this.isAllEqual(pType)){
                this.$Modal.info({
                    title: '提示信息',
                    content: '商品类型不一致，请重新选择！'
                });
                return;
            }
            // console.log(emp);
            //数据不够，暂时取消这层判断 2018.11.16
            if(!this.isAllEqual(emp)){
                this.$Modal.info({
                    title: '提示信息',
                    content: '业务员必须是同一人，请重新选择！'
                });
                return;
            }
            // console.log(arr);//用户勾选的数据集合
            let obj =this.getSupplierId(arr);
            console.log(obj);//抽出的供应商id二维数组
            if(obj.length>1){//选了多条数据
                let res = this.intersect(obj);//取完交集后的供应商id集合
                if(res.length>0){
                    let tmp = [];//存放分数
                    let supplierArr = [];
                    console.log(res);
                    res.forEach( (elem,i) => {
                        tmp[i] = [];
                        arr.forEach( (e,j) => {
                            e.suppliersList.forEach( (m,k) => {
                                if(elem == m.supplierId) {
                                    tmp[i].push(m);
                                }
                            })
                        })    
                    })
                    for(let i = 0; i<res.length; i++) {
                        if(typeof(vm.getSupplierInfo(res[i])) !=='undefined'){
                            supplierArr.push({
                                supplierId:res[i],//供应商id
                                supplierName:vm.getSupplierInfo(res[i])[0],//名称
                                supplierCode:vm.getSupplierInfo(res[i])[1],//code
                            })
                        }
                     }
                    // console.log(supplierArr);
                    tmp.forEach( elem => {
                        let sum = 0;
                        elem.forEach( e => {
                            sum += e.totleScore;
                        })
                        supplierArr.forEach( s => {
                            if(s.supplierId == elem[0].supplierId) {
                                s['totleScore'] = (sum/elem.length).toFixed(1);
                            }
                        })
                    })
                    // console.log(supplierArr);
                    //按评分从高到低排序
                    supplierArr.sort(this.sortColumn('totleScore'));
                    this.supplierData = supplierArr;
                    this.showSupplier = true;
                } else {
                    this.$Modal.info({
                        title: '提示信息',
                        content: '供应商没有交集，请重新选择！'
                    });
                    return; 
                }
                // this.showModal(res);                
            } else {//只选了一条数据
                // this.showModal(obj[0]);
                this.supplierData = arr[0].suppliersList;
                this.showSupplier = true;
            }
        },
        sortColumn(propName){
            return function (a,b) {
                let val1 = a[propName];
                let val2 = b[propName];
                return val2 - val1;
            }
        },
        //选择供应商的弹窗
        // showModal(res) {
        //     console.log(res);
        //     let supplierArr = [];
        //     if (res.length>0) {
        //         for(let i = 0; i<res.length; i++) {
        //            if(typeof(vm.getSupplierInfo(res[i])) !=='undefined'){
        //                supplierArr.push({
        //                    supplierId:res[i],//供应商id
        //                    siShortName:vm.getSupplierInfo(res[i])[0],//名称
        //                    supplierCode:vm.getSupplierInfo(res[i])[1],//code
        //                })
        //            }
        //         }
        //         console.log(supplierArr);
        //         this.supplierData = supplierArr;
        //         this.showSupplier = true;

        //     } else {
        //         this.$Modal.warning({
        //             title: '提示信息',
        //             content: '供应商没有交集，请重新选择！'
        //         });
        //         return;
        //     }
        // },
        handleInnerData(list,array) {
            Object.assign(array[0],{
                //商品图片，商品类型（名称和路径），倒计时，商品编码，商品名称，供应商，采购员，需求交货日期
                pictureUrl:list[this.selectedIndex].pictureUrl,
                goodsType:list[this.selectedIndex].goodsType,
                goodsGroupPath:list[this.selectedIndex].goodsGroupPath,
                countdown:list[this.selectedIndex].countdown,
                goodsCode:list[this.selectedIndex].goodsCode,
                goodsName:list[this.selectedIndex].goodsName,
                // supplierId:list[this.selectedIndex].supplierId,
                suppliersList:list[this.selectedIndex].suppliersList,
                buyer:list[this.selectedIndex].buyer,
                buyerName:list[this.selectedIndex].buyerName,
                // buyerInfo:list[this.selectedIndex].buyerInfo,
                demandDate:list[this.selectedIndex].demandDate,
            })
            array[0]['details'] = this.tmpData;
            // console.log(array);
            if (this.tmpData.length <1){
                this.$Modal.info({
                    content:"请至少选择一条明细数据！"
                });
                return;
            }
            if(!array[0].buyer) {
                this.$Modal.info({
                    content:"所选数据行业务员为必选项，请重新选择！"
                });
                return;
            }
            // this.showModal(array[0].supplierId);
            this.supplierData = array[0].suppliersList;
            this.showSupplier = true;
        },
        //点击采购下单按钮
        order(type,genre){
            // console.log(type,genre);
            this.orderType = type;
            this.orderGenre = genre;
            //待采购列表+外层下单
            if(type === 'general' && genre === 'out') {
                this.handleOutData(this.outData);
                //待采购列表+内层下单
            } else if (type === 'general' && genre === 'inner') {
                this.handleInnerData(this.generalList, this.innerData);
            } else if (type === 'purchase' && genre === 'out') {
                this.handleOutData(this.oData);
            } else if (type === 'purchase' && genre === 'inner'){
                this.handleInnerData(this.purchasingList, this.iData);
            }
        },
        cancel(type){
            if(type === 'general') {
                this.$refs.selection.selectAll(false);
            } else {
                this.$refs.selectContent.selectAll(false);
            }
            
        },
        switchTab(){
            if(this.currentTab === 'tab1'){
                this.currentTab = 'tab2';
            }else{
                this.currentTab = 'tab1';
            }
        },
        search() {
            // console.log(this.body);
            if(this.commodityCategoty.length > 0){
                this.body.goodsGroupPath=this.commodityCategoty[this.commodityCategoty.length-1];
            }else {
                this.body.goodsGroupPath='';
            }
            if(this.newCustomCode.length > 0){
                this.body.custStyleCode=this.newCustomCode[this.newCustomCode.length-1];
            }else {
                this.body.custStyleCode='';
            }
            if (this.dateArr.length > 0 && this.dateArr[0] && this.dateArr[1]) {
                this.body.startTime = this.dateArr[0].format("yyyy-MM-dd")+" 00:00:00";
                this.body.endTime = this.dateArr[1].format("yyyy-MM-dd")+" 23:00:00";
            } else {
                this.body.startTime = '';
                this.body.endTime = '';
            }
            // console.log(this.currentTab === 'tab1')
            if(this.currentTab === 'tab1'){
                this.loadGeneralList();
            }else if(this.currentTab === 'tab2'){
                this.loadPurchasingList();
            }
        }, 
        clear() {
            // this.$refs.supplierName.reset();
            this.$refs.supplier.clear();
            this.$refs.pColor.reset();
            this.body.goodsGroupPath = '';
            this.body.custStyleCode = '';
            this.body.supplierId = '';
            this.dateArr = [];
            this.commodityCategoty = [];
            this.newCustomCode = [];
            this.body.startTime = '';
            this.body.endTime = '';
            this.body.goldColor = '';
            this.body.goodsName = '';
        },
        //刷新-退出
        refresh(){
           window.location.reload(true);
        },
        exit(){
            window.parent.closeCurrentTab({openTime:this.openTime, exit: true});
        },


 

       
      
    },
    watch: {
    
    },
    created(){
        this.loadBuyer();
        this.loadProductType();
        this.loadSuppliers();
        this.loadSytleCategory();
        this.loadGeneralList();
        this.loadColour();
        this.loadPurchasingList();
        // this.queryBuyer();
    },
    mounted(){
        this.openTime = window.parent.params.openTime;
    },
})
