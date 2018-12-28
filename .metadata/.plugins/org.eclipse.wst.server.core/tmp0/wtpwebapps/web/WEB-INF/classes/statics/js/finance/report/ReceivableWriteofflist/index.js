// var _href =  baseURL ||'../../../finance/';
var _href = baseURL;
var vm = new Vue({
  el: '#receivableWriteofflist',
  data: {
    openTime: '',   //用于控制退出按钮
    ishttpOK: false,
    isSaveAdd: false,
    writeIsChange: true,
    floatNumber: 2, // 小数点位数
    deleteVisible: false,
    deleteLoading: true,
    for3Title: '客户',
    for4Title: '供应商',
    formData: {
      id: 0,
      // 核销类型_分为六种，预付冲应付、预收冲应收、应付冲应收、应收冲应付、应收转应收、应付转应付
      verificationType: 0,
      // 单据日期_自动显示当前日期，用户可以手动修改
      documentDate: '',
      // 单据编号_可以手动录入，也可以自动生成（基础模块中设置）
      billNumber: '',
      // 业务发生对象1_不同的核销类型判断是否能输入以及是客户或者供应商
      occurrenceObjectOneId: 0,
      // 业务发生类别代码_根据不同的单据类型获取基础资料中的核算项目类别代码主要用于凭证模板的使用
      occurrenceCodeOne: '',
      occurrenceObjectOne: '',
      // 业务发生对象2_不同的核销类型判断是否能输入以及是客户或者供应商
      occurrenceObjectTwoId: 0,
      occurrenceObjectTwo: '',
      // 业务发生类别代码_根据不同的单据类型获取基础资料中的核算项目类别代码主要用于凭证模板的使用
      occurrenceCodeTwo: '',
      // 币别id
      coinStopId: 0,
      // 币别_当前核销单使用的币别
      coinStop: '',
      // 摘要
      summary: '',
      // 主管id_调用基础模块
      directorId: 0,
      // 主管
      director: '',
      // 部门id_调用基础模块
      departmentId: 0,
      // 部门
      department: '',
      // 业务员id_调用基础模块
      salesmanId: 0,
      // 业务员
      salesman: '',
      // 凭证字号_凭证字+凭证号
      voucherSize: '',
      // 凭证id_生成凭证后返回具体的id
      voucherId: 0,
      // 是否有凭证_默认1为没有，2为有凭证
      isVoucher: 1,
      // 审核人_用户名称
      auditorName: '',
      // 审核人id
      auditorId: 0,
      // 审核日期
      auditorDate: '',
      // 审核标志_审核状态 默认1未审核，2审核
      auditStatus: 1,
      // 创建时间
      createdTime: '',
      // 更新时间
      updateTime: '',
      // 创建人_用户姓名
      createName: '',
      // 创建人id
      createId: 0,
      // 更新人_用户姓名
      updateName: '',
      // 更新人id
      updateId: 0,
      // 账套id
      sobId: 0,
      // 会计年度
      accountYear: 0,
      // 会计期间
      accountPeriod: 0
    },
    formDataInit: {
      'verificationType': [],
      'coinStop': [],
      'client': [],
      'supplier': [],
      'director': [],
      'department': [],
      'salesman': [],
      'summary': []
    },
    tb1Title: '预收单据:',
    tb2Title: '应收单据:',
    table1DataList: [],
    table1DataListTotal: {
      documentaryAmountFor: '0.00',
      documentaryAmount: '0.00',
      cancellationAmount: '0.00',
      notCancellationAmount: '0.00',
      thisTiemCancellationFor: '0.00',
      thisTiemCancellation: '0.00'
    },
    table1CurrentSelectRow: '',
    table2DataList: [],
    table2DataListTotal: {
      documentaryAmountFor: '0.00',
      documentaryAmount: '0.00',
      cancellationAmount: '0.00',
      notCancellationAmount: '0.00',
      thisTiemCancellationFor: '0.00',
      thisTiemCancellation: '0.00'
    },
    table2CurrentSelectRow: '',
    detailVisible: false,
    detailTitle: '源单',
    detailTable1: [],
    curTable: '',
    tableDate: {},
    category1: '',
    category2: '',
    exchangeRate: 1, // 汇率
    //objectId1:'',//业务发生对象1 Id
    //objectId1:''//业务发生对象2 id
    printModal: false,
    printInfo: {},


  },
  filters: {
    filtersTableDate: function (val) {
      return (new Date(val)).format("yyyy-MM-dd")
    },
    filtersTableNumber: function (val) {
          return accounting.formatMoney(val, '', 2);
    },
  },
  created: function () {
    //                this.dataList = Object.assign({}, this.color)
    // 请求获取币别 字段名请参考 index.json 修改
    var that = this;
    var _id = getUrlParam('id');
    var _action = getUrlParam('action');
    var _sobId = getUrlParam('sobId');

    this._ajaxGetFormData(_id, _sobId, _action);
  },
  watch: {

  },
  methods: {
    //get_source_list
    //根据id查询数据
    queryById: function (id) {
      var that = this;
      var _url = '';
      var parame = { 'id': id };
      $.ajax({
        type: 'post',
        async: true,
        data: parame,
        url: _url,
        dataType: 'json',
        success: function (d) {
          if (d.code === 100100) {
            that.formData = d.data.verificationSheetEntity;
          } else {

          }
        }
      })
    },
    _selectReset () {
      this.$refs.verificationType.reset();
      this.$refs.occurrenceObjectOneId.reset();
      this.$refs.occurrenceObjectTwoId.reset();
      this.$refs.coinStopId.reset();
      this.$refs.directorId.reset();
      this.$refs.departmentId.reset();
      this.$refs.salesmanId.reset();

    },
    beforeOrLast: function (nextOrLast) {
      var that = this;
      if (that.ishttpOK == true) return;
      that.ishttpOK = true;
      that._selectReset();
      var verificationType = this.formData.verificationType;
      var _url = _href + 'verificationSheet/query';
      var parame = { "id": that.formData.id, "nextOrLast": nextOrLast };
      // console.log(parame,"parame=====");

      $.ajax({
        type: 'post',
        data: parame,
        url: _url,
        dataType: 'json',
        success: function (res) {
          var _txt = '';
          if (res.code === '100100') {
            _txt = res.msg;
            //后台返回数据处理
            that.$nextTick(() => {
              that.formData = res.data.verificationSheetEntity;
              that.table1DataList = res.data.wOEList1;
              that.table2DataList = res.data.wOEList2;
              that.writeIsChange = false;
            })

            //d.data.w
          } else if (res.code === '100010') {
            _txt = '暂无其它单据';
          } else {
            _txt = res.msg;
          }
          that.$Message.info({
            content: _txt,
            duration: 3
          });
          setTimeout(function () {
            that.ishttpOK = false;
          }, 1000)
        },
        error: function (code) {
          // console.log(code);
          setTimeout(function () {
            that.ishttpOK = false;
          }, 1000)
        }
      })
    },
    //点击保存
    preserve: function () {
      if (!this.writeIsChange) {
        that.$Message.info({
          content: '请点击修改。',
          duration: 3
        });
        return;
      }
      var that = this;

      if (that.formData.verificationType === 1 || that.formData.verificationType === 2 || that.formData.verificationType === 3 || that.formData.verificationType === 4) {
        if (that.totalThisTiemCancellationFor !== that.total2ThisTiemCancellationFor) {
          that.$Message.info({
            content: '两张表的核销金额不一致。',
            duration: 3
          });
          return;
        } else if (!that.table1DataList.length || !that.table2DataList.length) {
          that.$Message.info({
            content: '源单单据不能为空',
            duration: 3
          });
          return;
        }
      } else {
        if (!that.table1DataList.length) {
          that.$Message.info({
            content: '源单单据不能为空',
            duration: 3
          });
          return;
        }
      }
      var _bool = false, _msg = '请填写必填项。';
      if (that.formData.verificationType === undefined || that.formData.verificationType === 0
        || that.formData.coinStopId === undefined || that.formData.coinStopId === 0
        || !that.formData.documentDate || !this.formData.billNumber
      ) {
        _bool = true;
      }

      if (that.formData.verificationType === 1 || that.formData.verificationType === 3) {	//客户不能为空
        if (that.formData.occurrenceObjectOneId === undefined || that.formData.occurrenceObjectOneId === 0) {
          _bool = true;
          _msg = '请选择客户';
        }
      } else if (that.formData.verificationType === 2 || that.formData.verificationType === 4) {	//供应商不能为空
        if (that.formData.occurrenceObjectTwoId === undefined || that.formData.occurrenceObjectTwoId === 0) {
          _bool = true;
          _msg = '请选择供应商';
        }
      } else if (that.formData.verificationType === 5) {	//转出客户不能为空
        if (that.formData.occurrenceObjectOneId === undefined || that.formData.occurrenceObjectOneId === 0) {
          _bool = true;
          _msg = '请选择转出客户';
        } else if (that.formData.occurrenceObjectTwoId === that.formData.occurrenceObjectOneId) {
          _bool = true;
          _msg = '转出转入客户不能相同';
        }
      } else if (that.formData.verificationType === 6) {	//转出供应商不能为空
        if (that.formData.occurrenceObjectOneId === undefined || that.formData.occurrenceObjectOneId === 0) {
          _bool = true;
          _msg = '请选择转出供应商';
        } else if (that.formData.occurrenceObjectTwoId === that.formData.occurrenceObjectOneId) {
          _bool = true;
          _msg = '转出转入供应商不能相同';
        }
      }
      if (_bool) {
        that.$Message.info({
          content: _msg,
          duration: 3
        });
        return;
      }
      var _url = _href + 'verificationSheet/save';

      // 给主表下拉文本赋值
      let _findOccOne = {}, _occOneList = [], _findOccTwo = {}, _occTwoList = [],
        _findCs = '', _findDirector = '', _findDepartment = '', _findSalesman = '';
      that.formData.verificationType === 6 ? _occOneList = that.formDataInit.supplier : _occOneList = that.formDataInit.client;
      that.formData.verificationType === 5 ? _occTwoList = that.formDataInit.client : _occTwoList = that.formDataInit.supplier;

      _findOccOne = _occOneList.find(x => x.id == that.formData.occurrenceObjectOneId);
      _findOccTwo = _occTwoList.find(x => x.id == that.formData.occurrenceObjectTwoId);
      _findCs = that.formDataInit.coinStop.find(x => x.id == that.formData.coinStopId);
      _findDirector = that.formDataInit.director.find(x => x.id == that.formData.directorId);
      _findDepartment = that.formDataInit.department.find(x => x.id == that.formData.departmentId);
      _findSalesman = that.formDataInit.salesman.find(x => x.id == that.formData.salesmanId);
      console.log("_findOccOne",_findOccOne,_findOccTwo);
      _findOccOne && (that.formData.occurrenceObjectOne = _findOccOne.name, that.formData.occurrenceCodeOne = _findOccOne.exchangeRate);
      _findOccTwo && (that.formData.occurrenceObjectTwo = _findOccTwo.name, that.formData.occurrenceCodeTwo = _findOccTwo.exchangeRate)

      // 币别 ， 主管 ，部门 ，业务员
      _findCs && (that.formData.coinStop = _findCs.name)
      _findDirector && (that.formData.director = _findDirector.name)
      _findDepartment && (that.formData.department = _findDepartment.name)
      _findSalesman && (that.formData.salesman = _findSalesman.name)

      var parame = JSON.stringify({ 'WOEList1': that.table1DataList, 'WOEList2': that.table2DataList, 'verificationSheetEntity': that.formData });

      if (that.ishttpOK == true) return;
      that.ishttpOK = true;
      $.ajax({
        type: 'post',
        async: true,
        data: parame,
        url: _url,
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        success: function (d) {
          var _txt = '';
          if (d.code === '100100') {
            _txt = d.msg;
            that.writeIsChange = false;
            // this.queryById(d.data);
            that.$nextTick(() => {
              that.formData = d.data;
              console.log(that.formData);
            })
          } else {
            _txt = d.msg;
          }
          that.$Message.info({
            content: _txt,
            duration: 3
          });
          // 保存后自动新增
          if (that.isSaveAdd) {
            that.clearFormData();
            that._selectReset();
            that.table1DataList = [];
            that.table2DataList = [];
            that._ajaxgetBillNumber();
          }
          setTimeout(function () {
            that.ishttpOK = false;
          }, 1000)
        },
        error: function (code) {
          // console.log(code);
          setTimeout(function () {
            that.ishttpOK = false;
          }, 1000)
        }
      })
    },
    _ajaxGetFormData: function (_id, _sobId, _action) {
      var that = this;
      that.ishttpOK = true;
      var _url = _href + 'verificationSheet/initialise';
      $.ajax({
        type: 'post',
        async: true,
        data: '',
        url: _url,
        dataType: 'json',
        success: function (d) {
          if (d.code === '100100') {
            that.$nextTick(() => {
              that.formDataInit = d.data;
              console.log(d,"=====>>>")
              that.formData.verificationType = d.data.info.verificationType;//单据类型
              that.formData.documentDate = d.data.info.documentDate;//单据时间
              that.formData.billNumber = d.data.info.billNumber;//单据编号
              that.formData.coinStopId = d.data.info.coinStopId;//币别
              that.formData.createName = d.data.info.createName;//制单人
              that._ajaxgetBillNumber();
              if (_id) {
                setTimeout(function () {
                  that._ajaxDoCopyById(_id, _sobId, _action);
                }, 1000);
              } else {
                setTimeout(function () {
                  that.ishttpOK = false;
                }, 1000)
              }
            })
          }
        },
        error: function (e) {
          setTimeout(function () {
            that.ishttpOK = false;
          }, 1000)
        }
      });
    },
    // 获取 单据编号 
    _ajaxgetBillNumber: function () {
      var that = this;
      var _url = _href + 'verificationSheet/getBillNumber';
      $.ajax({
        type: 'get',
        async: true,
        data: '',
        url: _url,
        dataType: 'json',
        success: function (d) {
          that.$nextTick(function () {
              that.formData.billNumber = d.data.billNumber;
              that.formData.documentDate = d.data.documentDate;
              console.log("that.formDataInit.coinStopId[0].id",that.formDataInit,that.formData.coinStopId)
              that.formData.coinStopId = that.formDataInit.coinStop[0].id;
          })
        },
        error: function (e) {
          // console.log(e);
        }
      });
    },
    _ajaxGetDataList: function () {
      var that = this;
      var _url = './index3.json';
      $.ajax({
        type: 'get',
        async: true,
        data: '',
        url: _url,
        dataType: 'json',
        success: function (d) {
          that.table1DataList = d.data;
        },
        error: function (e) {
          // console.log(e);
        }
      });
    },
    _ajaxDoCopyById: function (id, sobId, type) {
      var that = this;
      var _url = baseURL + 'verificationSheet/queryById';

      http.post(_url, JSON.stringify({ 'id': id, 'sobId': sobId })).then((d) => {

        if (d.code === '100100') {
          //后台返回数据处理

          that.$nextTick(() => {

            that.formData = d.data.verificationSheetEntity;
            that.table1DataList = d.data.wOEList1;
            that.table2DataList = d.data.wOEList2;
            if (type === 'query') {

            } else {
              that.formData.auditStatus = 1;
              that.formData.id = 0;
            }
          })

        } else {
          that.$Message.info({
            content: d.msg,
            duration: 3
          });
        }
        setTimeout(function () {
          that.ishttpOK = false;
        }, 1000)
      }, (d) => {
        setTimeout(function () {
          that.ishttpOK = false;
        }, 1000)
      })
    },
    actionBtnMth: function (type) {
      // console.log(type,'==actionBtnMth');
      var that = this;

      var _bool = false, _msg = '';
      if (type === 'addNew') {	// 新增
        that.clearFormData();
        that._selectReset();
        that.table1DataList = [];
        that.table2DataList = [];
        that._ajaxgetBillNumber();
        that.formData.documentDate = (new Date()).format("yyyy-MM-dd");
        that.cancellationType(that.formDataInit.verificationType[0].id);
      } else if (type === 'edit') {

        var _url = _href + 'verificationSheet/update';
        $.ajax({
          type: 'post',
          async: true,
          data: JSON.stringify({ "id": that.formData.id, "userId": that.formData.createId, "sobId": that.formData.sobId }),
          url: _url,
          dataType: 'json',
          contentType: 'application/json;charset=utf-8',
          success: function (d) {
            var _txt = '';
            if (d.code === '100100') {
              _txt = d.msg;
              that.writeIsChange = true;
              //this.queryById(d.data.id);
            } else {
              _txt = d.msg;
            }
            that.$Message.info({
              content: _txt,
              duration: 3
            });
          }
        })



      } else if (type === 'delete') {
        that.deleteVisible = true;
      } else if (type === 'deleteRow') {// 删除行
        if (this.curTable === '1') {
          that.table1DataList = that.table1DataList.filter(function (item) {
            console.log("item.sourceListId", item.sourceListId);
            console.log("that.table1CurrentSelectRow", that.table1CurrentSelectRow);
            return item.sourceListId !== that.table1CurrentSelectRow;
          });

        } else if (this.curTable === '2') {
          that.table2DataList = that.table2DataList.filter(function (item) {
            return item.sourceListId !== that.table2CurrentSelectRow;
          });
        }
        that.table1CurrentSelectRow = '';
      } else if (type === 'examine' || type === 'noexamine') {	// 审核和反审核
        var _url = type === 'examine' ? _href + 'verificationSheet/auditing' : _href + 'verificationSheet/counterAudit';

        $.ajax({
          type: 'post',
          async: true,
          data: JSON.stringify({ "id": that.formData.id, "userId": that.formData.createId, "sobId": that.formData.sobId, "documentDate": that.formData.documentDate }),
          url: _url,
          dataType: 'json',
          contentType: 'application/json;charset=utf-8',
          success: function (d) {
            var _txt = '';
            if (d.code === '100100') {
              _txt = d.msg;
              that.formData = d.data;
              //this.queryById(d.data.id);
            } else {
              _txt = d.msg;
            }
            that.$Message.info({
              content: _txt,
              duration: 3
            });
          }
        })
      } else if (type === 'source') {
        // console.log(that.formData.verificationType,'=that.that.formData.verificationType==',that.formData.occurrenceObjectOneId,that.formData.occurrenceObjectTwoId,'=========');
        if (that.formData.verificationType === 1 || that.formData.verificationType === 3 || that.formData.verificationType === 4) {	//客户不能为空
          if (that.formData.occurrenceObjectOneId === undefined || that.formData.occurrenceObjectOneId === 0) {
            _bool = true;
            _msg = '请选择客户';
          }
        } else if (that.formData.verificationType === 2 || that.formData.verificationType === 3 || that.formData.verificationType === 4) {	//供应商不能为空
          if (that.formData.occurrenceObjectTwoId === undefined || that.formData.occurrenceObjectTwoId === 0) {
            _bool = true;
            _msg = '请选择供应商';
          }
        } else if (that.formData.verificationType === 5) {	//转出客户不能为空
          if (that.formData.occurrenceObjectOneId === undefined || that.formData.occurrenceObjectOneId === 0) {
            _bool = true;
            _msg = '请选择转出客户';
          }
        } else if (that.formData.verificationType === 6) {	//转出供应商不能为空
          if (that.formData.occurrenceObjectOneId === undefined || that.formData.occurrenceObjectOneId === 0) {
            _bool = true;
            _msg = '请选择转出供应商';
          }
        }

        if (!that.curTable) {
          _bool = true;
          _msg = '请选择表格';
        }
        if (_bool) {
          that.$Message.info({
            content: _msg,
            duration: 3
          });
        } else {

          // 打开源单
          var _url = _href + 'verificationSheet/getSourceList';
          var arr = [];
          var occurrenceObjectId = '';
          var category = '';
          var type1 = that.formData.verificationType;
          if (this.curTable === '1') {//上表时的赋值
            for (var i = 0; i < that.table1DataList.length; i++) {
              arr.push(that.table1DataList[i].sourceListId);
            }
            category = that.category1;
            //当type为1,2,5时上表对应为业务发生对象1
            if (type1 === 1 || type1 === 3 || type1 === 5 || type1 === 6) {
              occurrenceObjectId = that.formData.occurrenceObjectOneId;
            }
            if (type1 === 2 || type1 === 4) {
              occurrenceObjectId = that.formData.occurrenceObjectTwoId;
            }
          } else if (this.curTable === '2') {
            category = that.category2;
            for (var i = 0; i < that.table2DataList.length; i++) {
              arr.push(that.table2DataList[i].sourceListId);
            }
            if (type1 === 2 || type1 === 3) {
              occurrenceObjectId = that.formData.occurrenceObjectTwoId;
            }
            if (type1 === 1 || type1 === 4) {
              occurrenceObjectId = that.formData.occurrenceObjectOneId;
            }
          }

          var parame = { 'occurrenceObjectId': occurrenceObjectId, 'category': category, 'listId': arr, 'coinStopId': that.formData.coinStopId };
          // console.log(parame,"parame-get_source_list-打开源参数")
          $.ajax({
            type: 'post',
            async: true,
            data: JSON.stringify(parame),
            url: _url,
            dataType: 'json',
            contentType: 'application/json;charset=utf-8',
            success: function (d) {
              if (d.code === '100100') {
                console.log("d.data",d.data)
                that.detailTable1 = d.data;
                that.detailTableModal(true);
              } else {
                var _txt = d.msg;
                that.$Message.info({
                  content: _txt,
                  duration: 3
                });
              }

            },
            error: function (e) {
              // console.log(e);
            },
          });

        }

      }
    },
    voucherAction: function (type) {	// 查看凭证和生成凭证
      var that = this;
      if (type === 'showVoucher') {
        // `${contextPath}/voucher-lrt/index.html?voucherId=${that.formData.voucherId}&sobId=${that.formData.sobId}`;
        console.log("contextPath=====================>>>>>", contextPath, rcContextPath);
        var _h = rcContextPath + '/finance/voucher-lrt/index.html?voucherId=' + that.formData.voucherId + "&sobId=" + that.formData.sobId;
        var _p = {
          'name': '查看凭证',
          'url': _h
        }
        window.parent.activeEvent(_p);
      } else {
        var _url = _href + 'verificationSheet/setVoucher';
        var _info = {
          "id": that.formData.id,
          "userId": that.formData.auditorId,
          "documentDate": that.formData.documentDate,
          "sobId": that.formData.sobId,
          "isVoucher": that.formData.isVoucher,
          "auditStatus": that.formData.auditStatus
        }
        $.ajax({
          type: 'post',
          async: true,
          data: JSON.stringify(_info),
          url: _url,
          dataType: 'json',
          contentType: 'application/json;charset=utf-8',
          success: function (d) {
            var _txt = '';
            if (d.code === '100100') {
              _txt = d.msg;
              //this.queryById(d.data.id);
              that.formData.voucherId = d.data.voucherId;
              that.formData.isVoucher = d.data.isVoucher;
            } else {
              _txt = d.msg;
            }
            that.$Message.info({
              content: _txt,
              duration: 3
            });
          }
        })
      }

    },
    optionAction: function (type) {
      if (type === 'saveAdd') {
        this.isSaveAdd = !this.isSaveAdd;
      }
    },
    // 格式化数字
    formatNum (f, digit) {
      // f = value  digit= 比例
      var m = Math.pow(1000, digit);
      return parseInt(f * m, 10) / m;
    },
    // 修改金额后触发其他币种
    blur_money (row, attr) {
      if (!row[attr + 'For']) return;
      var that = this;
      if (row[attr + 'For'] >= row['notCancellationAmountFor']) {
        row[attr + 'For'] = (this.formatNum(row['notCancellationAmountFor'] * 1, 1));
        let num = this.formatNum(row['notCancellationAmountFor'] * row['surfaceExchangeRate'], 1)
        row[attr] = num;
      } else {
        row[attr + 'For'] = (this.formatNum(row[attr + 'For'] * 1, 1));
        let num = this.formatNum(row[attr + 'For'] * row['surfaceExchangeRate'], 1)
        row[attr] = num;
      }

      //                    row[attr + 'For'] = accounting.formatNumber(row[attr + 'For'], this.floatNumber, ",");
      //                    let num = accounting.formatNumber(row[attr + 'For'], this.floatNumber, ",") * this.exchangeRate;
      //                    row[attr] = accounting.formatNumber(num, this.floatNumber, ",");
    },
    deleteOK: function () {
      var that = this;
      var _url = _href + 'verificationSheet/delete';
      $.ajax({
        type: 'post',
        async: true,
        data: JSON.stringify({
          "id": that.formData.id,
          'sobId': that.formData.sobId,
          'documentDate': that.formData.documentDate,
          "userId": that.formData.createId,
          "auditStatus": that.formData.auditStatus
        }),
        url: _url,
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        success: function (d) {
          var _txt = '';
          if (d.code === '100100') {
            _txt = d.msg;
            //this.queryById(d.data.id);
          } else {
            _txt = d.msg;
          }
          that.$Message.info({
            content: _txt,
            duration: 3
          });
          that.deleteVisible = false;
          that.clearFormData();
          that._selectReset();
        }
      })
    },
    occurrenceObjectOne: function (val) {
      var that = this;
      // console.log(val,"=======业务发生对象1的值====");
      // that.formData.occurrenceObjectOneId = val;
    },
    occurrenceObjectTwo: function (val) {
      var that = this;
      // console.log(val);
      // that.formData.occurrenceObjectTwoId = val;
    },
    cancellationType: function (val) {
      console.log(val, '==cancellationType');
      var that = this;
      var _for3Title = '客户', _for4Title = '供应商';
      switch (val) {
        case 1:
          that.tb1Title = '预收单据:';
          that.tb2Title = '应收单据:';
          that.category1 = 3;
          that.category2 = 1;
          break;
        case 2:
          that.tb1Title = '预付单据:';
          that.tb2Title = '应付单据:';
          that.category1 = 4;
          that.category2 = 2;
          break;
        case 3:
          that.tb1Title = '应收单据:';
          that.tb2Title = '应付单据:';
          that.category1 = 1;
          that.category2 = 2;
          break;
        case 4:
          that.tb1Title = '应付单据:';
          that.tb2Title = '应收单据:';
          that.category1 = 2;
          that.category2 = 1;
          break;
        case 5:
          that.tb1Title = '应收单据:';
          that.tb2Title = '';
          _for3Title = '转出客户';
          _for4Title = '转入客户';
          that.category1 = 1;

          break;
        case 6:
          that.tb1Title = '应付单据:';
          that.tb2Title = '';
          _for3Title = '转出供应商';
          _for4Title = '转入供应商';
          that.category1 = 2;

          break;
        default:
          that.tb1Title = '预收单据:';
          that.tb2Title = '应收单据:';
          that.category1 = 3;
          that.category2 = 1;
          break;
      }
      that.for3Title = _for3Title;
      that.for4Title = _for4Title;
      if (!that.ishttpOK) {
        that.clearFormData();
        // that._selectReset();
      }

      // 请求列表数据
      //that._ajaxGetDataList();
    },

    currencyType: function (val) {

      var that = this;
      let _find = this.formDataInit.coinStop.find(x => {
        return x.id == val;
      })
      _find && (this.exchangeRate = _find.exchangeRate);
      that.table1DataList = [];
      that.table2DataList = [];
    },
    table1ChickTr1: function (id) {
      this.curTable = id;
    },
    //上表的点击事件
    table1ChickTr: function (item) {
      this.table1CurrentSelectRow = item.id;
      this.curTable = '1';
    },
    table2ChickTr2: function (id) {
      this.curTable = id;
      // console.log(this.curTable,'==this.curTable===');
    },
    //下表的点击事件
    table2ChickTr: function (item) {
      this.table2CurrentSelectRow = item.id;
      this.curTable = '2';
    },
    //
    detailTableModal: function (type) {
      this.detailVisible = type;
    },
    callBackInfo: function (_list) {
      if (!_list.length) return;
      // console.log(this.table1CurrentSelectRow, this.table1DataList, '==this.table1CurrentSelectRow==');
      // console.log(this.table2CurrentSelectRow, '==this.table2CurrentSelectRow==');
      if (this.table1CurrentSelectRow !== 0 || this.table2CurrentSelectRow !== 0) {

      }
      var _l = [];
      _list.forEach((item) => {
        var _i = {//自定义源单表对象
          category: item.category,//单据类别
          status: item.status,//状态
          transactionType: item.transactionType,//交易类型
          sourceSingleType: item.documentType,//
          sourceListNumber: item.documentNumber,//单据编号
          occurrenceObject_id: item.occurrenceObject_id,//业务发生对象id
          occurrenceObject: item.occurrenceObject,
          documentDate: item.documentDate,
          remark: item.summary,
          coinStopId: item.coinStopId,
          coinStop: item.coinStop,
          surfaceExchangeRate: item.surfaceExchangeRate,
          documentaryAmount: item.documentaryAmount,
          documentaryAmountFor: item.documentaryAmountFor,
          cancellationAmountFor: item.cancellationAmountFor,
          notCancellationAmountFor: item.notCancellationAmountFor,
          thisTiemCancellationFor: item.notCancellationAmountFor,
          departmentId: item.departmentId,
          department: item.department,
          salesmanId: item.salesmanId,//业务员id
          salesman: item.salesman,
          sobId: item.sobId,//账套
          accountYear: item.accountYear,//会计年度
          accountYeriodf: item.accountYeriod,//会计期间
          sourceListId: item.id, //源单中间表id
          id: item.id, //源单中间表id
          thisTiemCancellation: 0
        };
        _l.push(_i);
      });
      console.log(_list, '=====_list');
      if (this.curTable === '1') {
        this.table1DataList = [...this.table1DataList, ..._l];
      } else if (this.curTable === '2') {
        this.table2DataList = [...this.table2DataList, ..._l];
      }
    },
    autoWriteoff: function () {		//自动核销
      var that = this;
      if (that.formData.verificationType === 1 || that.formData.verificationType === 2 || that.formData.verificationType === 3 || that.formData.verificationType === 4) {
        if (that.table1DataList.length === 1 && that.table2DataList.length === 1) {

          var _list = [that.table1DataList[0].notCancellationAmountFor, that.table2DataList[0].notCancellationAmountFor, that.table1DataList[0].thisTiemCancellationFor, that.table2DataList[0].thisTiemCancellationFor];
          _list = _list.filter(function (item) {
            return (item !== 0 && item !== '');
          });
          var _min = Math.min.apply(null, _list);
          that.table1DataList[0].thisTiemCancellationFor = _min || 0;
          that.table2DataList[0].thisTiemCancellationFor = _min || 0;
        } else if (that.table1DataList.length === 1 && that.table2DataList.length > 1) {

          let _total = 0, _total2 = 0;
          that.table1DataList.forEach(item => {
            _total += item.thisTiemCancellationFor;
          });

          that.table2DataList.forEach(item => {
            _total2 += item.thisTiemCancellationFor;
          });
          if (_total === _total2) return;
          if (_total > _total2) {
            that.table1DataList[0].thisTiemCancellationFor = _total2;
            that.table1DataList[0].thisTiemCancellation = _total2 * that.table1DataList[0].surfaceExchangeRate;
          } else {
            var _n = _total;
            that.table2DataList.forEach(item => {
              var _n2 = 0, _nc = item.notCancellationAmountFor;
              if (_n !== 0) {
                if (_n <= _nc) {
                  _n2 = _n, _n = 0;
                } else {
                  _n2 = _nc, _n = _n - _nc;
                }
              }
              console.log(_n2, '===_n2===', _n, '===_n===');
              item.thisTiemCancellationFor = _n2;
              item.thisTiemCancellation = _n2 * item.surfaceExchangeRate;

            });
            if (_n !== 0) {
              that.$Message.info({
                content: `金额还余下 ${_n} 未被分摊完,请调整金额或者添加源单`,
                duration: 3
              });
            }
          }


        } else if (that.table1DataList.length > 1 && that.table2DataList.length === 1) {

          let _total = 0, _total2 = 0;
          that.table1DataList.forEach(item => {
            _total += item.thisTiemCancellationFor;
          });

          that.table2DataList.forEach(item => {
            _total2 += item.thisTiemCancellationFor;
          });
          if (_total === _total2) return;
          if (_total < _total2) {
            that.table2DataList[0].thisTiemCancellationFor = _total;
            that.table2DataList[0].thisTiemCancellation = _total * that.table2DataList[0].surfaceExchangeRate;
          } else {
            var _n = _total2;
            that.table1DataList.forEach(item => {
              var _n2 = 0, _nc = item.notCancellationAmountFor;
              if (_n !== 0) {
                if (_n <= _nc) {
                  _n2 = _n, _n = 0;
                } else {
                  _n2 = _nc, _n = _n - _nc;
                }
              }
              console.log(_n2, '===_n2===', _n, '===_n===');
              item.thisTiemCancellationFor = _n2;
              item.thisTiemCancellation = _n2 * item.surfaceExchangeRate;

            });
            if (_n !== 0) {
              that.$Message.info({
                content: `金额还余下 ${_n} 未被分摊完,请调整金额或者添加源单`,
                duration: 3
              });
            }
          }

        }

      }
    },
    clearFormData: function () {	// 清空数据

      this.formData.id = 0;
      // 核销类型_分为六种，预付冲应付、预收冲应收、应付冲应收、应收冲应付、应收转应收、应付转应付
      //this.formData.verificationType = this.formDataInit.verificationType[0].id || 1;
      // 单据日期_自动显示当前日期，用户可以手动修改
      //					this.formData.documentDate= (new Date()).format("yyyy-MM-dd") ;
      // 单据编号_可以手动录入，也可以自动生成（基础模块中设置）
      //					this.formData.billNumber= '' ;
      // 业务发生对象1_不同的核销类型判断是否能输入以及是客户或者供应商
      this.formData.occurrenceObjectOneId = 0;
      // 业务发生类别代码_根据不同的单据类型获取基础资料中的核算项目类别代码主要用于凭证模板的使用
      this.formData.occurrenceCodeOne = '';
      this.formData.occurrenceObjectOne = '';
      // 业务发生对象2_不同的核销类型判断是否能输入以及是客户或者供应商
      this.formData.occurrenceObjectTwoId = '';
      this.formData.occurrenceObjectTwo = '';
      // 业务发生类别代码_根据不同的单据类型获取基础资料中的核算项目类别代码主要用于凭证模板的使用
      this.formData.occurrenceCodeTwo = '';
      // 币别id
      // this.formData.coinStopId = this.formDataInit.coinStop[0].id || 1;
      // 币别_当前核销单使用的币别
      // this.formData.coinStop = '';
      // 摘要
      this.formData.summary = '';
      // 主管id_调用基础模块
      this.formData.directorId = 0;
      // 主管
      this.formData.director = '';
      // 部门id_调用基础模块
      this.formData.departmentId = 0;
      // 部门
      this.formData.department = '';
      // 业务员id_调用基础模块
      this.formData.salesmanId = 0;
      // 业务员
      this.formData.salesman = '';
      // 凭证字号_凭证字+凭证号
      this.formData.voucherSize = '';
      // 凭证id_生成凭证后返回具体的id
      this.formData.voucherId = 0;
      // 是否有凭证_默认1为没有，2为有凭证
      this.formData.isVoucher = 1;
      // 审核人_用户名称
      this.formData.auditorName = '';
      // 审核人id
      this.formData.auditorId = 0;
      // 审核日期
      this.formData.auditorDate = '';
      // 审核标志_审核状态 默认1未审核，2审核
      this.formData.auditStatus = 1;
      // 创建时间
      this.formData.createdTime = '';
      // 更新时间
      this.formData.updateTime = '';
      // 更新人_用户姓名
      this.formData.updateName = '';
      // 更新人id
      this.formData.updateId = 0;
      // 账套id
      this.formData.sobId = 0;
      // 会计年度
      this.formData.accountYear = 0;
      // 会计期间
      this.formData.accountPeriod = 0

      //					this.formData.occurrenceObjectOneId = 0;
      //					this.formData.occurrenceObjectTwoId = 0;
      //					this.formData.summary = '';
      //                    this.formData.coinStopId = 0;
      //                    this.formData.directorId = 0;
      //					this.formData.directorId = 0;
      //					this.formData.salesmanId = 0;
      this.table1DataList = [];
      this.table2DataList = [];
      //                    this.formData.id = 0;
      this.writeIsChange = true;
    },
    closeWindow: function () {
      //关闭当前页签
      var name = '核销单';
      window.parent.closeCurrentTab({ 'name': name, 'openTime': this.openTime, 'url': this.openTime, exit: true })
    },
    // 打印
    logopAction () {
      console.log(layui.data('user'));

      var _data = {
        "code": "100100",
        "data": [
          {
            "accountPeriod": 10,
            "accountYear": 2018,
            "auditStatus": 2,
            "auditorDate": "2018-07-06 19:07:00",
            "auditorId": 27,
            "auditorName": "超级管理员",
            "billNumber": "HXDJ-20180706-127",
            "coinStop": "人民币",
            "coinStopId": 1,
            "createId": 27,
            "createName": "超级管理员",
            "createdTime": "2018-07-06 19:06:56",
            "department": "",
            "departmentId": 0,
            "director": "",
            "directorId": 0,
            "documentDate": "2018-10-31 00:00:00",
            "id": 55,
            "isVoucher": 1,
            "occurrenceCodeOne": null,
            "occurrenceCodeTwo": null,
            "occurrenceObjectOne": "123",
            "occurrenceObjectOneId": 1,
            "occurrenceObjectTwo": "光芒四射",
            "occurrenceObjectTwoId": 36,
            "salesman": "",
            "salesmanId": 0,
            "sobId": 1,
            "summary": "",
            "thisTiemCancellation": 50.000000,
            "updateId": 27,
            "updateName": "超级管理员",
            "updateTime": "2018-07-06 20:19:04",
            "verificationType": 3,
            "voucherId": 31,
            "voucherSize": ""
          },
          {
            "accountPeriod": 10,
            "accountYear": 2018,
            "auditStatus": 2,
            "auditorDate": "2018-07-06 19:09:14",
            "auditorId": 27,
            "auditorName": "超级管理员",
            "billNumber": "HXDJ-20180706-128",
            "coinStop": "人民币",
            "coinStopId": 1,
            "createId": 27,
            "createName": "超级管理员",
            "createdTime": "2018-07-06 19:09:13",
            "department": "",
            "departmentId": 0,
            "director": "",
            "directorId": 0,
            "documentDate": "2018-10-31 00:00:00",
            "id": 56,
            "isVoucher": 1,
            "occurrenceCodeOne": null,
            "occurrenceCodeTwo": null,
            "occurrenceObjectOne": "1231",
            "occurrenceObjectOneId": 2,
            "occurrenceObjectTwo": "光芒四射",
            "occurrenceObjectTwoId": 36,
            "salesman": "",
            "salesmanId": 0,
            "sobId": 1,
            "summary": "",
            "thisTiemCancellation": 50.000000,
            "updateId": 27,
            "updateName": "超级管理员",
            "updateTime": "2018-07-06 20:38:28",
            "verificationType": 3,
            "voucherId": 36,
            "voucherSize": ""
          },
          {
            "accountPeriod": 10,
            "accountYear": 2018,
            "auditStatus": 2,
            "auditorDate": "2018-07-06 19:43:18",
            "auditorId": 27,
            "auditorName": "超级管理员",
            "billNumber": "HXDJ-20180706-131",
            "coinStop": "人民币",
            "coinStopId": 1,
            "createId": 27,
            "createName": "超级管理员",
            "createdTime": "2018-07-06 19:42:42",
            "department": "营销部",
            "departmentId": 3,
            "director": "朱十七",
            "directorId": 87,
            "documentDate": "2018-10-31 00:00:00",
            "id": 57,
            "isVoucher": 1,
            "occurrenceCodeOne": null,
            "occurrenceCodeTwo": null,
            "occurrenceObjectOne": "123",
            "occurrenceObjectOneId": 1,
            "occurrenceObjectTwo": "1231",
            "occurrenceObjectTwoId": 2,
            "salesman": "吴六",
            "salesmanId": 76,
            "sobId": 1,
            "summary": "",
            "thisTiemCancellation": 1000.000000,
            "updateId": 27,
            "updateName": "超级管理员",
            "updateTime": "2018-07-06 19:43:18",
            "verificationType": 5,
            "voucherId": 0,
            "voucherSize": ""
          },
          {
            "accountPeriod": 10,
            "accountYear": 2018,
            "auditStatus": 2,
            "auditorDate": "2018-07-06 19:44:45",
            "auditorId": 27,
            "auditorName": "超级管理员",
            "billNumber": "HXDJ-20180706-132",
            "coinStop": "人民币",
            "coinStopId": 1,
            "createId": 27,
            "createName": "超级管理员",
            "createdTime": "2018-07-06 19:44:35",
            "department": "",
            "departmentId": null,
            "director": "",
            "directorId": null,
            "documentDate": "2018-10-31 00:00:00",
            "id": 58,
            "isVoucher": 2,
            "occurrenceCodeOne": null,
            "occurrenceCodeTwo": "",
            "occurrenceObjectOne": "1231",
            "occurrenceObjectOneId": 2,
            "occurrenceObjectTwo": "",
            "occurrenceObjectTwoId": null,
            "salesman": "",
            "salesmanId": null,
            "sobId": 1,
            "summary": "",
            "thisTiemCancellation": 1000.000000,
            "updateId": 27,
            "updateName": "超级管理员",
            "updateTime": "2018-07-07 14:18:55",
            "verificationType": 1,
            "voucherId": 47,
            "voucherSize": ""
          },
          {
            "accountPeriod": 10,
            "accountYear": 2018,
            "auditStatus": 2,
            "auditorDate": "2018-07-06 20:17:22",
            "auditorId": 27,
            "auditorName": "超级管理员",
            "billNumber": "HXDJ-20180706-138",
            "coinStop": "人民币",
            "coinStopId": 1,
            "createId": 27,
            "createName": "超级管理员",
            "createdTime": "2018-07-06 20:17:20",
            "department": "研发部",
            "departmentId": 5,
            "director": "周五",
            "directorId": 75,
            "documentDate": "2018-10-31 00:00:00",
            "id": 59,
            "isVoucher": 1,
            "occurrenceCodeOne": null,
            "occurrenceCodeTwo": null,
            "occurrenceObjectOne": "123",
            "occurrenceObjectOneId": 1,
            "occurrenceObjectTwo": "光芒四射",
            "occurrenceObjectTwoId": 36,
            "salesman": "孙三",
            "salesmanId": 73,
            "sobId": 1,
            "summary": "",
            "thisTiemCancellation": 23.000000,
            "updateId": 27,
            "updateName": "超级管理员",
            "updateTime": "2018-07-06 20:38:27",
            "verificationType": 3,
            "voucherId": 35,
            "voucherSize": ""
          },
          {
            "accountPeriod": 10,
            "accountYear": 2018,
            "auditStatus": 2,
            "auditorDate": "2018-07-06 08:47:15",
            "auditorId": 27,
            "auditorName": "超级管理员",
            "billNumber": "HXDJ-20180706-34",
            "coinStop": "人民币",
            "coinStopId": 1,
            "createId": 27,
            "createName": "超级管理员",
            "createdTime": "2018-07-06 08:47:13",
            "department": "人事部",
            "departmentId": 2,
            "director": "冯九",
            "directorId": 79,
            "documentDate": "2018-10-19 00:00:00",
            "id": 52,
            "isVoucher": 2,
            "occurrenceCodeOne": null,
            "occurrenceCodeTwo": "",
            "occurrenceObjectOne": "123",
            "occurrenceObjectOneId": 1,
            "occurrenceObjectTwo": "",
            "occurrenceObjectTwoId": null,
            "salesman": "吴六",
            "salesmanId": 76,
            "sobId": 1,
            "summary": "",
            "thisTiemCancellation": 3000.000000,
            "updateId": 27,
            "updateName": "超级管理员",
            "updateTime": "2018-07-07 14:18:56",
            "verificationType": 1,
            "voucherId": 48,
            "voucherSize": ""
          },
          {
            "accountPeriod": 10,
            "accountYear": 2018,
            "auditStatus": 2,
            "auditorDate": "2018-07-06 08:51:35",
            "auditorId": 27,
            "auditorName": "超级管理员",
            "billNumber": "HXDJ-20180706-35",
            "coinStop": "人民币",
            "coinStopId": 1,
            "createId": 27,
            "createName": "超级管理员",
            "createdTime": "2018-07-06 08:51:25",
            "department": "采购部",
            "departmentId": 4,
            "director": "冯九",
            "directorId": 79,
            "documentDate": "2018-10-12 00:00:00",
            "id": 53,
            "isVoucher": 2,
            "occurrenceCodeOne": null,
            "occurrenceCodeTwo": "",
            "occurrenceObjectOne": "123",
            "occurrenceObjectOneId": 1,
            "occurrenceObjectTwo": "",
            "occurrenceObjectTwoId": null,
            "salesman": "郑七",
            "salesmanId": 77,
            "sobId": 1,
            "summary": "",
            "thisTiemCancellation": 199.000000,
            "updateId": 27,
            "updateName": "超级管理员",
            "updateTime": "2018-07-07 16:26:52",
            "verificationType": 1,
            "voucherId": 49,
            "voucherSize": ""
          }
        ],
        "msg": "操作成功"
      };
      var _info = {
        'title': '核销单',  // 标题
        'template': 1,  // 模板
        // 'titleInfo': [       // title 
        //   { 'name': '日期', 'val': '2018-07-24' },
        //   { 'name': '单据编号', 'val': 'billNumber' },
        //   { 'name': '凭证字号', 'val': 'voucherSize' },
        //   { 'name': '核销类型', 'val': 'verificationTypeName' }
        // ],
        'colNames': [       // 列名与对应字段名
          { 'name': '作者', 'col': 'auditorName' },
          { 'name': '币别', 'col': 'coinStop' },
          { 'name': '客户', 'col': 'occurrenceObjectOne' },
          { 'name': '供应商', 'col': 'occurrenceObjectTwo' },
          { 'name': '日期', 'col': 'documentDate' },
          { 'name': '创建者', 'col': 'createdTime' },
          { 'name': '编号', 'col': 'billNumber' },
          { 'name': '科目', 'col': 'directorId' },
        ],
        'styleCss': '',   // 自定义样式 例：  thead{text-align: center;font-size: 14px;font-weight: 100;}
        'colMaxLenght': 7,  // 显示最大长度， 默认为7
        'data': _data.data,  // 打印数据  list
      }
      this.printInfo = _info;
      this.printModalShow(true);
      // htPrint(_info);
      // HT_LODOP.printUrl(_info);
    },
    printModalShow (_t) {
      this.printModal = _t;
    }
  },
  computed: {
    totalDocumentaryAmountFort () {
      let total = 0;
      this.table1DataList.forEach(item => {
        total += item.documentaryAmountFor;
      });
      total = accounting.formatNumber(total, this.floatNumber, ",");
      return total ? total : '';
    },
    totalDocumentaryAmount () {
      let total = 0;
      this.table1DataList.forEach(item => {
        total += item.documentaryAmount;
      });
      total = accounting.formatNumber(total, this.floatNumber, ",");
      return total ? total : '';
    },
    totalCancellationAmount () {
      let total = 0;
      this.table1DataList.forEach(item => {
        total += item.cancellationAmountFor;
      });
      total = accounting.formatNumber(total, this.floatNumber, ",");
      return total ? total : '0';
    },
    totalNotCancellationAmount () {
      let total = 0;
      this.table1DataList.forEach(item => {
        total += item.notCancellationAmountFor;
      });
      total = accounting.formatNumber(total, this.floatNumber, ",");
      return total ? total : '0';
    },
    totalThisTiemCancellationFor () {
      let total = 0;
      this.table1DataList.forEach(item => {
        total += item.thisTiemCancellationFor;
      });
      total = accounting.formatNumber(total, this.floatNumber, ",");
      return total ? total : '';
    },
    totalThisTiemCancellation () {
      let total = 0;
      this.table1DataList.forEach(item => {
        total += item.thisTiemCancellation;
      });
      total = accounting.formatNumber(total, this.floatNumber, ",");
      return total ? total : '0';
    },
    total2DocumentaryAmountFort () {
      let total = 0;
      this.table2DataList.forEach(item => {
        total += item.documentaryAmountFor;
      });
      total = accounting.formatNumber(total, this.floatNumber, ",");
      return total ? total : '';
    },
    total2DocumentaryAmount () {
      let total = 0;
      this.table2DataList.forEach(item => {
        total += item.documentaryAmount;
      });
      total = accounting.formatNumber(total, this.floatNumber, ",");
      return total ? total : '0';
    },
    total2CancellationAmount () {
      let total = 0;
      this.table2DataList.forEach(item => {
        total += item.cancellationAmountFor;
      });
      total = accounting.formatNumber(total, this.floatNumber, ",");
      return total ? total : '0';
    },
    total2NotCancellationAmount () {
      let total = 0;
      this.table2DataList.forEach(item => {
        total += item.notCancellationAmountFor;
      });
      total = accounting.formatNumber(total, this.floatNumber, ",");
      return total ? total : '0';
    },
    total2ThisTiemCancellationFor () {
      let total = 0;
      this.table2DataList.forEach(item => {
        total += item.thisTiemCancellationFor;
      });
      total = accounting.formatNumber(total, this.floatNumber, ",");
      return total ? total : '0';
    },
    total2ThisTiemCancellation () {
      let total = 0;
      this.table2DataList.forEach(item => {
        total += item.thisTiemCancellation;
      });
      total = accounting.formatNumber(total, this.floatNumber, ",");
      return total ? total : '0';
    },
    isDisabled () {	// 保存 是否可用
      let _bool = false;
      if (!this.writeIsChange || this.formData.auditStatus === 2) {
        _bool = true;
      }
      return _bool;
    },
    deleteisDisabled () {	// delete 是否可用
      return (this.formData.isVoucher === 2 || this.formData.auditStatus === 2);
    },
    editisDisabled () {	// 修改 是否可用
      return (this.formData.isVoucher === 2 && this.formData.auditStatus === 2);
    },
    voucherisDisabled () {	// 生成凭证 是否可用
      return (this.formData.id === 0 || this.formData.auditStatus === 0 || this.formData.auditStatus === 1 || this.formData.isVoucher === 0 || this.formData.isVoucher === 2);
    },
    showVoucherDisabled () {	// 查看凭证 是否可用 isVoucher 1 未生成凭证  2 已生成凭证
      return (this.formData.id === 0 || this.formData.auditStatus === 0 || this.formData.isVoucher === 0 || this.formData.isVoucher === 1);
    },
    examineisDisabled () {	// 审核 是否可用
      return (this.formData.id === 0 || this.formData.auditStatus === 0 || this.formData.auditStatus === 2);
    },
    noexamineisDisabled () {	// 反审核 是否可用
      return (this.formData.id === 0 || this.formData.auditStatus === 0 || this.formData.auditStatus === 1);
    }
  },
  mounted () {
    this.openTime = window.parent.params && window.parent.params.openTime;
  }
})
