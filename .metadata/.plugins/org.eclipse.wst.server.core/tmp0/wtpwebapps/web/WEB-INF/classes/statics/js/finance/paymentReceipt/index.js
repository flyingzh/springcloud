

new Vue({
  el: '#receivableWriteofflist',
  data: {
    initInfo: {
      pageType: 1,
      pageTitle: '收款单据',
      intId: -1
    },
    ishttpOK: false,
    isSaveAdd: false,
    writeIsChange: true,
    floatNumber: 2, // 小数点位数
    deleteVisible: false,
    deleteLoading: true,
    openTime: "",   //用于控制退出按钮
    whichSubject: 0,
    formData: {  //主表
      id: 0,//主键!!
      documentType: 1,	// 单据类型_1 收款单据，2 付款单据',!!
      occurrenceObjectId: 0,//业务发生对象1客户,2供应商的code码

      idForPrepayment: 0, //预收款单/预付款单数据存到源单表中的id!!
      auditMark: 1,	// 1 未审核，2已审核!!
      isVoucher: 1,	// 1未生成凭证，2已生成凭证!!
      voucherId: 0,//凭证id_生成凭证后返回具体的id
      typePaymentReceived: 0,//类型!!
      orderDate: '',//单据日期!!
      documentNumber: '',//订单编号!!
      occurrenceObject: '',//业务发生对象1!!
      occurrentObjectRealId: 0, //具体到每一个业务对象的唯一id,取自于基础资料!!
      coinStop: '',//币别!!
      coinStopId: 0,//币别id!!
      exchangeRate: 1,	//汇率!!
      clearanceAccount: '',	//结算账户!!
      clearanceAccountId: 0,	//结算账户id_收款科目的来源，调用基础资料收款科目!!
      watchPaymentFor: 0,	//表头收付款金额!!
      reducedAmountFor: 0,	//折后金额!!
      bulkDiscount: 100.000000,	//整单折扣!!
      watchPayment: 0,	//表头收/付款金额本位币!!
      reducedAmount: 0,	//折后金额(本位币)!!
      discountSubject: '',	//折扣科目!!
      discountSubjectCode: '',	//折扣科目id!!
      discountSubjectId: 0,	//折扣科目id!!
      summary: '',//摘要!!
      voucherSize: '', //凭证字号_凭证字+凭证号
      director: '',//主管!!
      directorId: 0,//主管id!!
      department: '',//部门!!
      departmentId: 0,//部门id!!
      salesman: '',//业务员!!
      salesmanId: 0,//业务员id!!
      singlePerson: '',//制单人!!
      singlePersonId: 0,//制单人id!!
      auditorName: '',//审核人!!
      auditorNameId: 0,//审核人id!!
      auditDate: '',//审核日期 之前的Key: auditorDate
      printingTimes: 0, //打印次数
      occurrenceCode: 0, //类别代码，主要用于凭证模板的使用
      sobId: 0,//账套id
      // accountYear: 1,//会计年度
      // accountPeriod: 1 //会计期间
    },
    formDataInit: {

      'paymentType': [],	//付款
      'receiptType': [],	//收款
      'client': [],	//客户
      'supplier': [],	//供应商
      'listCS': [],	//币别
      'clearanceAccount': [],	//结算账户
      'vo': {},	// 默认值
      'typePaymentReceived': [],
      'coinStop': [],
      'director': [],
      'department': [],
      'salesman': [],
      'summary': []
    },

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
    detailVisible: false,
    detailTitle: '源单',
    detailTable1: [], // 源单 table 值
    detailTableColumns: [],   // 源单 table 列名
    tableDate: {},
    category1: '',
    category2: '',
    exchangeRate: 1, // 汇率
    //objectId1:'',//业务发生对象1 Id
    //objectId1:''//业务发生对象2 id
    subjectVisable: false
  },
  filters: {
    filtersTableDate: function (val) {
      return (new Date(val)).format("yyyy-MM-dd")
    },

    numFilter: function (val) {
      let realVal = Number(val).toFixed(2);
      return realVal;
    }
  },
  created: function () {
    //                this.dataList = Object.assign({}, this.color)
    // 请求获取币别 字段名请参考 index.json 修改

  },
  mounted: function () {
    var that = this;
    var _type = getUrlParam('type');
    var _id = getUrlParam('id');
    var _action = getUrlParam('action');
    this.initInfo.pageType = _type;
    this.initInfo.intId = _id || -1;
    this.formData.documentType = _type;
    this.openTime = window.parent.params && window.parent.params.openTime;
    if (_type === '1') {
      this.initInfo.pageTitle = '收款单据';
      this.formData.typePaymentReceived = 1;
    } else if (_type === '2') {
      this.initInfo.pageTitle = '付款单据';
      this.formData.typePaymentReceived = 2;
    }

    this._ajaxGetFormData(_id, _action);
    // if (_id) {
    //   setTimeout(function () {
    //     that._ajaxDoCopyById(_id, _action);
    //   }, 1000);
    // }
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
      this.$refs.occurrentObjectRealId.reset();
      this.$refs.typePaymentReceived.reset();
      this.$refs.coinStopId.reset();
      this.$refs.directorId.reset();
      this.$refs.departmentId.reset();
      this.$refs.salesmanId.reset();
    },
    beforeOrLast: function (nextOrLast) {
      var that = this;
      if (that.ishttpOK == true) return;
      that.ishttpOK = true;
      console.log(this.formData.id);
      var _url = baseURL + 'paymentreceiptController/lastNext';
      //1 加,2减
      // var parame = { "documentType": that.initInfo.pageType, "id": that.formData.id, "symbol": nextOrLast };
      let _formData = new FormData();
      _formData.append('documentType', that.initInfo.pageType);
      _formData.append('id', that.formData.id);
      _formData.append('symbol', nextOrLast);

      http.post(_url, _formData).then((d) => {
        var _txt = '';
        if (d.code === '100100') {
          that._selectReset();
          _txt = d.msg;
          //后台返回数据处理
          that.$nextTick(() => {
            that.formData = d.data.paymentReceiptEntity;
            var _type = d.data.paymentReceiptEntity.typePaymentReceived || 1;
            // var _dateList = [];
            // d.data.financeSourceSingleDataEntities.forEach(function (val,idx) {
            //     _dateList .push(that._getDataListByType(val,_type));
            // });
            that.table1DataList = d.data.financeSourceSingleDataEntities;
          })
        } else {
          _txt = d.msg;
        }
        that.$Message.info({
          content: _txt,
          duration: 3
        });
        setTimeout(function () {
          that.ishttpOK = false;
        }, 1000)
      }, (d) => {
        //TODO 处理请求fail
        setTimeout(function () {
          that.ishttpOK = false;
        }, 1000)
      })

    },
    createVoucher: function () {
      //生成凭证
      var that = this;
      var _txt = '';
      var _url = baseURL + 'paymentreceiptController/createVoucher';
      let _formData = new FormData();
      _formData.append('id', that.formData.id);
      http.post(_url, _formData).then((d) => {
        if (d.code === '100100') {
          that.formData.voucherId = d.data;
          _txt = d.msg;
        } else {
          _txt = d.msg;
        }
        that.$Message.info({
          content: _txt,
          duration: 3
        });
      }, (d) => {
        //TODO 处理请求fail
        //console.log(json, '==处理请求fail');
      })

      //     http.post(_url, _formData).then((d) => {
      //         var _txt = '';
      //     if (d.code === '100100') {
      //         _txt = d.msg;
      //     } else {
      //         _txt = d.msg;
      //     }
      //     that.$Message.info({
      //         content: _txt,
      //         duration: 3
      //     });
      // }, (d) => {
      //         //TODO 处理请求fail
      //         //console.log(json, '==处理请求fail');
      //     })
    },
    checkVoucher: function () {
      //查看凭证
      var that = this;
      console.log("查看凭证前校验: 凭证id为: ===" + that.formData.voucherId + ", 账套id为:===" + that.formData.sobId);
      var _txt = '';
      var _voucherId = that.formData.voucherId;
      var _sobId = that.formData.sobId;
      if (_voucherId === '0' || _voucherId === '' || _voucherId === 0) {
        _txt = '该单据未生成凭证.请先生成凭证';
        that.$Message.info({
          content: _txt,
          duration: 3
        });
        return;
      }
      let _url = contextPath + '/finance/voucher-lrt/index.html?voucherId=' + _voucherId + "&sobId=" + _sobId;
      window.parent.activeEvent({ name: '查看凭证', url: _url, params: null });
    },
    closeWindow: function () {
      //关闭当前页签
      var that = this;
      var name = '付款单';
      var _type = getUrlParam('type');
      if (_type === '1') {
        name = '收款单';
      }
      window.parent.closeCurrentTab({ name: name, openTime: this.openTime, exit: true })
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

      var _bool = false, _msg = '请填写必填项。';

      if ($.isEmptyObject(that.formData.occurrentObjectRealId) || that.formData.occurrentObjectRealId === 0) {
        _bool = true;
        _msg = `请选择${that.initInfo.pageType === '1' ? '客户' : '供应商'}`;
      } else if ($.isEmptyObject(that.formData.orderDate)) {
        _bool = true;
        _msg = '请选择单据日期';
      } else if ($.isEmptyObject(that.formData.documentNumber)) {
        _bool = true;
        _msg = '请选择订单编号';
      } else if ($.isEmptyObject(that.formData.clearanceAccountId) || that.formData.clearanceAccountId === 0) {
        _bool = true;
        _msg = '请选择结算账户';
      } else if ($.isEmptyObject(that.formData.watchPaymentFor) || that.formData.watchPaymentFor === 0) {
        _bool = true;
        _msg = `表头${that.initInfo.pageType === '1' ? '收款' : '付款'}金额不能为空或零`;
      } else if (that.formData.bulkDiscount != 100) {
        if (!that.formData.discountSubjectId) {
          _bool = true;
          _msg = '单据有整单折扣,请填写折扣科目';
        }
      }
      if (_bool) {
        that.$Message.info({
          content: _msg,
          duration: 3
        });
        return;
      }

      var _url = baseURL + 'paymentreceiptController/save';

      // 给主表下拉文本赋值
      let _find = {};
      if (that.initInfo.pageType === '1') {
        _find = that.formDataInit.client.find(x => {
          return x.id == that.formData.occurrentObjectRealId;
        });
      } else if (that.initInfo.pageType === '2') {
        _find = that.formDataInit.supplier.find(x => {
          return x.id == that.formData.occurrentObjectRealId;
        })
      }
      let _findClearanceAccountId = that.formDataInit.clearanceAccount.find(x => {
        return x.id == that.formData.clearanceAccountId;
      })
      console.log(that.formDataInit.supplier, that.formData.occurrentObjectRealId); console.log(_findClearanceAccountId.name);
      that.formData.occurrenceObject = _find.name;
      that.formData.occurrenceObjectId = _find.code;
      that.formData.clearanceAccount = _findClearanceAccountId.name;
      //var parame = { "data": { "financeSourceSingleDataEntities": that.table1DataList, "PaymentReceiptEntity": that.formData } };
      var parame = JSON.stringify({ 'financeSourceSingleDataEntities': that.table1DataList, 'PaymentReceiptEntity': that.formData });
      console.log('save()--------that.table1DataList', that.table1DataList);
      console.log('save()--------that.formData', that.formData);
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
            that.formData.id = d.data.id;
            that.formData.sobId = d.data.sobId;
            console.log("保存成功!返回的id值:" + that.formData.id + ",sobId=" + that.formData.sobId);

            _txt = d.msg;
            that.writeIsChange = false;
            //this.queryById(d.data.id);
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
    _ajaxGetFormData: function (_id, _action) {
      var that = this;
      that.ishttpOK = true;
      var _url = baseURL + 'paymentreceiptController/create';
      let _formData = new FormData();
      _formData.append('documentType', that.initInfo.pageType);
      http.post(_url, _formData).then((d) => {
        if (d.code === '100100') {
          that.$nextTick(() => {
            var _res = d.data;
            that.formDataInit = _res;
            that.formData.orderDate = _res.vo.orderDate;//单据时间
            that.formData.documentNumber = _res.vo.documentNumber;//单据编号
            that.formData.coinStopId = _res.listCS[0].id || 0;//币别
            that.formData.singlePerson = _res.vo.singlePerson;//制单人
            that.formData.sobId = _res.vo.sobId; //账套id
            if ('query' === _action) {
              if (_id) {
                setTimeout(function () {
                  that._ajaxDoCopyById(_id, _action);
                }, 1000);
              }
            } else {
              setTimeout(function () {
                that.ishttpOK = false;
              }, 1000)
            }
          })
        }

      }, (d) => {

        //TODO 处理请求fail
        //console.log(json, '==处理请求fail');
      })

    },
    _ajaxDoCopyById: function (_id, type) {
      var that = this;
      var _url = baseURL + 'paymentreceiptController/queryBillById';
      let _formData = new FormData();
      //_formData.append('documentType', that.initInfo.pageType);
      _formData.append('id', _id);
      http.post(_url, _formData).then((d) => {
        if (d.code === '100100') {
          //后台返回数据处理
          that.$nextTick(() => {
            that.formData = d.data.paymentReceiptEntity;
            if (type === 'query') {

            } else {
              that.formData.auditMark = 1;
              that.formData.id = 0;
            }
            that.table1DataList = d.data.financeSourceSingleDataEntities;
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
      var that = this;

      var _bool = false, _msg = '';
      if (type === 'addNew') {	// 新增
        that.clearFormData();
        that._selectReset();
        that._ajaxGetFormData();

      } else if (type === 'edit') {

        this.writeIsChange = true;
      } else if (type === 'deleteRow') {  // 删除行
        that.table1DataList = that.table1DataList.filter(function (item) {
          return item.sourceSourceId !== that.table1CurrentSelectRow;
        });
        that.table1CurrentSelectRow = '';
      } else if (type === 'delete') { // 删除单据
        that.deleteVisible = true;
      } else if (type === 'examine' || type === 'noexamine') {	// 审核和反审核
        var _url = '', _parame = {};
        if (type === 'examine') {
          _url = baseURL + 'paymentreceiptController/audit';
        } else if (type === 'noexamine') {
          _url = baseURL + 'paymentreceiptController/counterAudit';
        }

        let _formData = new FormData();
        _formData.append('id', that.formData.id);
        http.post(_url, _formData).then((d) => {
          var _txt = '';
          if (d.code === '100100') {
            _txt = d.msg;
            that.$nextTick(() => {
              that.formData = d.data;
            })
          } else {
            _txt = d.msg;
          }
          that.$Message.info({
            content: _txt,
            duration: 3
          });
        }, (d) => {
          //TODO 处理请求fail
          //console.log(json, '==处理请求fail');
        })

      } else if (type === 'source') {
        if ($.isEmptyObject(that.formData.occurrentObjectRealId) || that.formData.occurrentObjectRealId === 0) {
          that.$Message.warning({
            content: `请选择${that.initInfo.pageType === '1' ? '客户' : '供应商'}`,
            duration: 3
          });
        } else {

          // 打开源单
          var arr = [];
          if (that.table1DataList) {
            for (var i = 0; i < that.table1DataList.length; i++) {
              if (that.formData.typePaymentReceived === 1 || that.formData.typePaymentReceived === 2) {
                arr.push(that.table1DataList[i].sourceSourceId);
              } else if (that.formData.typePaymentReceived === 5 || that.formData.typePaymentReceived === 6) {
                arr.push(that.table1DataList[i].refundSourceId);
              } else if (that.formData.typePaymentReceived === 3 || that.formData.typePaymentReceived === 4) {
                arr.push(that.table1DataList[i].sourceSourceId);
              }
            }
          }
          var _url = baseURL + 'paymentreceiptController/getSourceList';
          var parame = {
            'occurrenceObjectId': that.formData.occurrentObjectRealId,
            'category': that.formData.typePaymentReceived,
            'listId': arr,
            'sobId': that.formData.sobId
          };

          that.detailTableColumns = that._getDataListCol();
          http.post(_url, JSON.stringify(parame)).then((d) => {
            that.detailTable1 = d.data;
            that.detailTableModal(true);
          }, (d) => {
            //TODO 处理请求fail
          })

        }

      }
    },
    voucherAction: function (type) {	// 查看凭证和生成凭证
      var that = this;
      var _url = '', _parame = {};
      if (type === 'showVoucher') {
        that.checkVoucher();
        // _url = baseURL + 'paymentreceiptController/get_voucher';
        // _parame = { "verificationSheetEntity": this.formData };
      } else if (type === 'addVoucher') {
        that.createVoucher();
        // _url = baseURL + 'paymentreceiptController/set_voucher';
        // _parame = { "verificationSheetEntity": this.formData };
      }

      // $.ajax({
      //   type: 'post',
      //   async: true,
      //   data: JSON.stringify(_parame),
      //   url: _url,
      //   dataType: 'json',
      //   success: function (d) {
      //     var _txt = '';
      //     if (d.code === '100100') {
      //       _txt = d.msg;
      //       //this.queryById(d.data.id);
      //     } else {
      //       _txt = d.msg;
      //     }
      //     that.$Message.info({
      //       content: _txt,
      //       duration: 3
      //     });
      //   }
      // })
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
      let num = this.formatNum(row[attr + 'For'] * row['surfaceExchangeRate'], 1);
      row[attr] = num;
      row[attr + 'For'] = parseFloat(row[attr + 'For']).toFixed(2);

      // if (!row[attr + 'For']) return;
      // var that = this;
      // row[attr + 'For'] = (this.formatNum(row[attr + 'For'] * 1, 1));
      // let num = this.formatNum(row[attr + 'For'] * row['surfaceExchangeRate'], 1);
      // row[attr] = num;
      //                    row[attr + 'For'] = accounting.formatNumber(row[attr + 'For'], this.floatNumber, ",");
      //                    let num = accounting.formatNumber(row[attr + 'For'], this.floatNumber, ",") * this.exchangeRate;
      //                    row[attr] = accounting.formatNumber(num, this.floatNumber, ",");
    },
    // 删除 单据
    deleteOK: function () {
      var that = this;
      var _url = baseURL + 'paymentreceiptController/delete';
      let _formData = new FormData();
      _formData.append('id', that.formData.id);
      http.post(_url, _formData).then((d) => {
        var _txt = '';
        if (d.code === '100100') {
          _txt = d.msg;
          that.clearFormData();
          that._selectReset();
          that._ajaxGetFormData();
        } else {
          _txt = d.msg;
        }
        that.deleteVisible = false;
        that.$Message.info({
          content: _txt,
          duration: 3
        });
      }, (d) => {
        //TODO 处理请求fail
        //console.log(json, '==处理请求fail');
      })
      // $.ajax({
      //   type: 'post',
      //   async: true,
      //   data: JSON.stringify(parame),
      //   url: _url,
      //   dataType: 'json',
      //   contentType: 'application/json;charset=utf-8',
      //   success: function (d) {
      //     var _txt = '';
      //     if (d.code === '100100') {
      //       _txt = d.msg;
      //       //this.queryById(d.data.id);
      //     } else {
      //       _txt = d.msg;
      //     }
      //     that.$Message.info({
      //       content: _txt,
      //       duration: 3
      //     });
      //     that.deleteVisible = false;
      //     that.clearFormData();
      //   }
      // })
    },
    occurrenceObjectOne: function (val) {
      var that = this;
      that.formData.occurrentObjectRealId = val;
    },
    cancellationType: function (val) {
      var that = this;

      if (!that.ishttpOK) {
        // that.clearFormData();
        that.table1DataList = [];
      }

    },
    // 币别 change 事件 ，触发改变汇率
    currencyType: function (val) {

      var that = this;
      let _find = this.formDataInit.listCS.find(x => {
        return x.id == val;
      })
      _find && (this.formData.exchangeRate = _find.exchangeRate);
    },

    //上表的点击事件
    table1ChickTr: function (item) {
      this.table1CurrentSelectRow = item.sourceSourceId;
    },
    // 显示源单弹窗
    detailTableModal: function (type) {
      this.detailVisible = type;
    },
    _getDataListCol: function () {
      var that = this;
      var _info = [];
      var columns1 = [
        { type: 'selection', width: 60, align: 'center' },
        { title: '单据类型', key: 'documentType', width: 100 },
        { title: that.initInfo.pageType === '1' ? '采购方式' : '销售方式', key: 'transactionType', width: 100 },
        { title: '单据编号', key: 'documentNumber', width: 100 },
        { title: that.initInfo.pageType === '1' ? '客户' : '供应商', key: 'occurrenceObject', width: 100 },
        {
          title: '日期', key: 'documentDate', width: 120,
          render: (h, params) => {
            return h('div', (new Date(params.row.documentDate)).format("yyyy-MM-dd"))
          }
        },
        { title: '摘要', key: 'summary', width: 100 },
        { title: '币别', key: 'coinStop', width: 100 },
        { title: '汇率', key: 'surfaceExchangeRate', width: 100 },
        { title: '单据金额', key: 'documentaryAmountFor', width: 150 },
        { title: '单据金额（本位币）', key: 'documentaryAmount', width: 180 },
        { title: '已核销金额', key: 'cancellationAmountFor', width: 180 },
        { title: '未核销金额', key: 'notCancellationAmountFor', width: 180 },
        { title: '部门', key: 'department', width: 100 },
        { title: '业务员', key: 'salesman', width: 100 }
      ];

      var columns2 = [
        { type: 'selection', width: 60, align: 'center' },
        { title: that.initInfo.pageType === '1' ? '客户' : '供应商', key: 'occurrenceObject', width: 100 },
        { title: '单据类型', key: 'documentType', width: 100 },
        { title: that.initInfo.pageType === '1' ? '收款单号' : '付款单号', key: 'documentNumber', width: 100 },
        {
          title: '日期', key: 'orderDate', width: 120,
          render: (h, params) => {
            return h('div', (new Date(params.row.orderDate)).format("yyyy-MM-dd"))
          }
        },
        { title: '源单编号', key: 'sourceListNumber', width: 100 },
        { title: '源单类型', key: 'sourceType', width: 100 },
        { title: '币别', key: 'coinStop', width: 100 },
        { title: '汇率', key: 'exchangeRate', width: 100 },
        { title: '单据金额', key: 'watchPaymentFor', width: 150 },
        { title: '单据金额（本位币）', key: 'watchPayment', width: 180 },
        { title: that.initInfo.pageType === '1' ? '收款金额' : '付款金额', key: 'receiptPaymentAmount', width: 180 },
        { title: '已核销金额', key: 'cancellationAmount', width: 180 },
        { title: '未核销金额', key: 'notCancellationAmount', width: 180 },
        { title: '摘要', key: 'summary', width: 100 },
        { title: '部门', key: 'department', width: 100 },
        { title: '业务员', key: 'salesman', width: 100 }
      ];

      var columns3 = [
        { type: 'selection', width: 60, align: 'center' },
        { title: '单据类型', key: 'documentType', width: 100 },
        /*{ title: that.initInfo.pageType === '1' ? '采购方式' : '销售方式', key: 'transactionType', width: 100 },*/
        { title: '单据编号', key: 'documentNumber', width: 100 },
        { title: that.initInfo.pageType === '1' ? '客户' : '供应商', key: 'occurrenceObject', width: 100 },
        {
          title: '日期', key: 'documentDate', width: 120,
          render: (h, params) => {
            return h('div', (new Date(params.row.documentDate)).format("yyyy-MM-dd"))
          }
        },
        { title: '摘要', key: 'summary', width: 100 },
        { title: '币别', key: 'coinStop', width: 100 },
        { title: '汇率', key: 'surfaceExchangeRate', width: 100 },
        { title: '单据金额', key: 'documentaryAmountFor', width: 150 },
        { title: '单据金额（本位币）', key: 'documentaryAmount', width: 180 },
        { title: '已核销金额', key: 'cancellationAmountFor', width: 180 },
        { title: '未核销金额', key: 'notCancellationAmountFor', width: 180 },
        { title: '部门', key: 'department', width: 100 },
        { title: '业务员', key: 'salesman', width: 100 }
      ];

      if (that.formData.typePaymentReceived === 1 || that.formData.typePaymentReceived === 2) {
        _info = columns1;
      } else if (that.formData.typePaymentReceived === 5 || that.formData.typePaymentReceived === 6) {
        _info = columns2;
      } else if (that.formData.typePaymentReceived === 3 || that.formData.typePaymentReceived === 4) {
        _info = columns3;
      }
      return _info;
    },
    _getDataListByType: function (item, _type) {
      var _info = {};
      /*      var _sourceList1 = {//自定义源单表对象
                //status: item.status,//状态
                //id: item.id, //不要从源源单表获取id来赋值,但是需要从源单表中数据回显id
                //paymentReceiptId: item.category,//单据类别,1收款单,2付款单
                //summary: item.summary, //备注
                //coinStopId: item.coinStopId,
                //paymentReceiptId: this.formData.id || item.paymentReceiptId, //---帮我获取到主表id,然后绑定到此值------
                //cancellationAmount: item.cancellationAmount, 收款退款源单的已核销金额字段
                //notCancellationAmount: item.notCancellationAmount,收款退款源单的未核销金额字段
                //departmentId: item.departmentId,
                //department: item.department,
                //salesmanId: item.salesmanId,//业务员id
                //salesman: item.salesman,
                //accountYear: item.accountYear,//会计年度
                //accountYeriod: item.accountYeriod,//会计期间
                //sourceListId: item.id, //源单中间表id
                /!*-----------下面才是有效字段---------------*!/
              refundSourceId: (_type === 5 || _type === 6) ? item.id : "", //收付款单审核之后,往退款源单入库,入库之后获取id存到此字段
              transactionType: (_type === 1 || _type === 2) ? item.transactionType : item.sourceType,//交易类型
              sourceSourceId: (_type === 1 || _type === 2) ? item.id : item.sourceSourceId,//源单表id存到源源单表id
              paymentReceiptNumber: item.paymentReceiptNumber || this.formData.documentNumber,  //主表单据号,如果单据为5,6,此字段会有值(从5,6的选源单中获取)
              receiptPaymentAmount: item.receiptPaymentAmount, //收款金额,如果单据为5,6,此字段会有值(从5,6的选源单中获取)
              documentType: item.documentType,//单据类型_1 收款单据，2 付款单据
              sourceListNumber: (_type === 1 || _type === 2) ? item.documentNumber : item.sourceListNumber,//源单编号
              occurrenceObject: item.occurrenceObject, //具体的 供应商/客户 的中文名
              occurrenceObjectId: item.category,//1收款客户,2付款为供应商
              occurrentObjectRealId: item.occurrentObjectRealId,//业务发生对象(供应商/客户)的真实id,取自基础资料
              documentDate: (_type === 1 || _type === 2) ? item.documentDate || '' : item.orderDate, //单据日期
              remark: item.summary, //备注
              invoiceCoinType: item.coinStop,//发票币别
              coinStopId: item.coinStopId,  //发票币别id
              surfaceExchangeRate: (_type === 1 || _type === 2) ? item.surfaceExchangeRate : item.exchangeRate,//表体汇率
              documentaryAmount: (_type === 1 || _type === 2) ? item.documentaryAmount : item.watchPayment,//单据金额
              documentaryAmountFor: (_type === 1 || _type === 2) ? item.documentaryAmountFor : item.watchPaymentFor,//单据金额原币
              cancellationAmount: (_type === 1 || _type === 2) ? item.cancellationAmountFor : item.cancellationAmount,//已核销金额原币
              notCancellationAmount: (_type === 1 || _type === 2) ? item.notCancellationAmountFor : item.notCancellationAmount,//未核销金额原币
              thisTiemCancellationFor: (_type === 1 || _type === 2) ? item.notCancellationAmountFor : item.notCancellationAmount,//本次核销金额
              thisTiemCancellation: ((_type === 1 || _type === 2) ? item.notCancellationAmountFor : item.notCancellationAmount) * ((_type === 1 || _type === 2) ? item.surfaceExchangeRate : item.exchangeRate), //本次核销金额本位币
              sobId: item.sobId,//账套应该是在后台赋值
              documentNumber: item.documentNumber,
              orderDate: item.orderDate,
              watchPaymentFor: item.watchPaymentFor,
              watchPayment: item.watchPayment,
              accountPeriod: item.accountPeriod,
              accountYear: item.accountYear,
              exchangeRate: item.exchangeRate
            };*/

      var _sourceList1 = {
        //收付款类型: 1_收款单;2_付款单;
        refundSourceId: "", //收付款单审核之后,往退款源单入库,入库之后获取id存到此字段
        transactionType: item.transactionType,//交易类型
        sourceSourceId: item.id,//源单表id存到源源单表id
        paymentReceiptNumber: this.formData.documentNumber,  //主表单据号,如果单据为5,6,此字段会有值(从5,6的选源单中获取)
        receiptPaymentAmount: "", //收款金额,如果单据为5,6,此字段会有值(从5,6的选源单中获取)
        documentType: item.documentType,//单据类型_1 收款单据，2 付款单据
        sourceListNumber: item.documentNumber,//源单编号
        occurrenceObject: item.occurrenceObject, //具体的 供应商/客户 的中文名
        occurrenceObjectId: item.category,//1收款客户,2付款为供应商
        occurrentObjectRealId: item.occurrentObjectRealId,//业务发生对象(供应商/客户)的真实id,取自基础资料
        documentDate: item.documentDate, //单据日期
        remark: item.summary, //备注
        invoiceCoinType: item.coinStop,//发票币别
        coinStopId: item.coinStopId,  //发票币别id
        surfaceExchangeRate: item.surfaceExchangeRate,//表体汇率
        documentaryAmount: item.documentaryAmount,//单据金额
        documentaryAmountFor: item.documentaryAmountFor,//单据金额原币
        cancellationAmount: item.cancellationAmountFor,//已核销金额原币
        notCancellationAmount: item.notCancellationAmountFor,//未核销金额原币
        thisTiemCancellationFor: item.notCancellationAmountFor,//本次核销金额
        thisTiemCancellation: item.notCancellationAmountFor * item.surfaceExchangeRate, //本次核销金额本位币
        sobId: item.sobId,//账套应该是在后台赋值
        documentNumber: item.documentNumber,
        orderDate: item.orderDate,
        watchPaymentFor: item.watchPaymentFor,
        watchPayment: item.watchPayment,
        accountPeriod: item.accountPeriod,
        accountYear: item.accountYear,
        exchangeRate: item.exchangeRate
      };

      var _sourceList2 = {
        //收付款单类型: 5_收款退款单; 6_付款退款单;
        refundSourceId: item.id, //收付款单审核之后,往退款源单入库,入库之后获取id存到此字段
        transactionType: item.sourceType,//交易类型
        sourceSourceId: item.sourceSourceId,//源单表id存到源源单表id
        paymentReceiptNumber: item.paymentReceiptNumber,  //主表单据号,如果单据为5,6,此字段会有值(从5,6的选源单中获取)
        receiptPaymentAmount: item.receiptPaymentAmount, //收款金额,如果单据为5,6,此字段会有值(从5,6的选源单中获取)
        documentType: item.documentType,//单据类型_1 收款单据，2 付款单据
        sourceListNumber: item.sourceListNumber,//源单编号
        occurrenceObject: item.occurrenceObject, //具体的 供应商/客户 的中文名
        occurrenceObjectId: item.category,//1收款客户,2付款为供应商
        occurrentObjectRealId: item.occurrentObjectRealId,//业务发生对象(供应商/客户)的真实id,取自基础资料
        documentDate: item.orderDate, //单据日期
        remark: item.summary, //备注
        invoiceCoinType: item.coinStop,//发票币别
        coinStopId: item.coinStopId,  //发票币别id
        surfaceExchangeRate: item.exchangeRate,//表体汇率
        documentaryAmount: item.watchPayment,//单据金额
        documentaryAmountFor: item.watchPaymentFor,//单据金额原币
        cancellationAmount: item.cancellationAmount,//已核销金额原币
        notCancellationAmount: item.notCancellationAmount,//未核销金额原币
        thisTiemCancellationFor: item.notCancellationAmount,//本次核销金额
        thisTiemCancellation: item.notCancellationAmount * item.exchangeRate, //本次核销金额本位币
        sobId: item.sobId,//账套应该是在后台赋值
        documentNumber: item.documentNumber,
        orderDate: item.orderDate,
        watchPaymentFor: item.watchPaymentFor,
        watchPayment: item.watchPayment,
        accountPeriod: item.accountPeriod,
        accountYear: item.accountYear,
        exchangeRate: item.exchangeRate
      };

      var _sourceList3 = {
        //收付款单类型: 3_预收款单; 4_预付款单
        //收付款类型: 1_收款单;2_付款单;
        refundSourceId: "", //收付款单审核之后,往退款源单入库,入库之后获取id存到此字段
        transactionType: "",//交易类型
        sourceSourceId: item.id,//源单表id存到源源单表id
        paymentReceiptNumber: "",  //主表单据号,如果单据为5,6,此字段会有值(从5,6的选源单中获取)
        receiptPaymentAmount: "", //收款金额,如果单据为5,6,此字段会有值(从5,6的选源单中获取)
        documentType: item.documentType,//单据类型_1 收款单据，2 付款单据
        sourceListNumber: item.documentNumber,//源单编号
        occurrenceObject: item.occurrenceObject, //具体的 供应商/客户 的中文名
        occurrenceObjectId: item.category,//1收款客户,2付款为供应商
        occurrentObjectRealId: item.occurrenceObjectId,//业务发生对象(供应商/客户)的真实id,取自基础资料
        documentDate: item.documentDate, //单据日期
        remark: item.summary, //备注
        invoiceCoinType: item.coinStop,//发票币别
        coinStopId: item.coinStopId,  //发票币别id
        surfaceExchangeRate: item.surfaceExchangeRate,//表体汇率
        documentaryAmount: item.documentaryAmount,//单据金额
        documentaryAmountFor: item.documentaryAmountFor,//单据金额原币
        cancellationAmount: item.cancellationAmountFor,//已核销金额原币
        notCancellationAmount: item.notCancellationAmountFor,//未核销金额原币
        thisTiemCancellationFor: item.notCancellationAmountFor,//本次核销金额
        thisTiemCancellation: item.notCancellationAmountFor * item.surfaceExchangeRate, //本次核销金额本位币
        sobId: item.sobId,//账套应该是在后台赋值
        documentNumber: item.documentNumber,
        orderDate: "",
        watchPaymentFor: "",
        watchPayment: "",
        accountPeriod: item.accountPeriod,
        accountYear: item.accountYear,
        exchangeRate: ""
      };
      if (_type === 1 || _type === 2) {
        _info = _sourceList1;
      } else if (_type === 5 || _type === 6) {
        _info = _sourceList2;
      } else if (_type === 3 || _type === 4) {
        _info = _sourceList3;
      }
      return _info;
    },
    // 源单 table 双击回调事件
    callBackInfo: function (_list) {
      var that = this;
      console.log(_list, '==item==');
      var _l = [];
      _list.forEach((item) => {
        var _i = that._getDataListByType(item, that.formData.typePaymentReceived);
        _l.push(_i);
      });
      that.table1DataList = [...that.table1DataList, ..._l];

    },
    watchPaymentForChange: function (val) {
      this.formData.watchPayment = val * this.formData.exchangeRate;
      this.formData.reducedAmountFor = this.getParseFloat(val * (this.formData.bulkDiscount / 100));
      this.formData.reducedAmount = val * this.formData.bulkDiscount * this.formData.exchangeRate / 100;
    },
    bulkDiscountChange: function (val) {
      //当整单折扣发生变化时执行此方法
    },
    reducedAmountForChange: function (val) {
      this.formData.reducedAmount = val * this.formData.exchangeRate;
      this.formData.watchPaymentFor = val / this.formData.bulkDiscount * 100;
      this.formData.watchPayment = val / this.formData.bulkDiscount * this.formData.exchangeRate * 100;
      if (this.formData.watchPaymentFor > 0) {
        this.formData.bulkDiscount = this.getParseFloat((val / this.formData.watchPaymentFor) * 100);
      }
      // this.formData.bulkDiscount = val ;
    },
    // 保留 2位小数点，并返回float 类型
    getParseFloat: function (val) {
      return parseFloat(val.toFixed(2));
    },
    clearFormData: function () {	// 清空数据

      this.table1DataList = [];
      this.writeIsChange = true;

      this.formData.id = 0;
      this.formData.auditMark = 1,	// 1 未审核，2已审核
        this.formData.isVoucher = 1,	// 1未生成凭证，2已生成凭证
        this.formData.typePaymentReceived = this.initInfo.pageType === '1' ? 1 : 2,//类型
        this.formData.occurrenceObject = '',//业务发生对象1
        this.formData.occurrentObjectRealId = 0,//业务发生对象1id
        //					this.formData.coinStop= '',//币别
        this.formData.coinStopId = this.formDataInit.listCS[0].id,//币别id
        //					this.formData.exchangeRate = 1,	//汇率
        this.formData.clearanceAccount = 0,	//结算账户
        this.formData.watchPaymentFor = 0,	//表头收付款金额
        this.formData.clearanceAccountId = 0;
      this.formData.reducedAmountFor = 0,	//折后金额
        this.formData.bulkDiscount = 100,	//整单折扣
        this.formData.watchPayment = 0,	//表头收/付款金额本位币
        this.formData.reducedAmount = 0,	//折后金额(本位币)
        this.formData.discountSubject = '',	//折扣科目
        this.formData.discountSubjectId = 0,	//折扣科目ID
        this.formData.discountSubjectCode = '',	//折扣科目code
        this.formData.summary = '',//摘要
        this.formData.director = '',//主管
        this.formData.directorId = 0,//主管id
        this.formData.department = '',//部门
        this.formData.departmentId = 0,//部门id
        this.formData.salesman = '',//业务员
        this.formData.salesmanId = 0,//业务员id
        this.formData.singlePerson = '',//制单人
        this.formData.auditorName = '',//审核人
        this.formData.auditorNameId = 0,//审核人id
        this.formData.auditDate = ''//审核日期
    },
    print: function () {
      htPrint();
      console.log("准备打印,单据id为: " + this.formData.id);
      // printJS('paymentReceiptTimeBook', 'html');
      var that = this;
      var _url = baseURL + 'paymentreceiptController/addPrintTimes';
      let _formData = new FormData();
      _formData.append('id', that.formData.id);
      http.post(_url, _formData).then((d) => {
        //console.log(json, '成功==处理请求');
      }, (d) => {
        //console.log(json, '失败==处理请求');
      })
    },
    totalToTHEAD: function () {
      //合计功能
      console.log("this ===", this);
      var totalAmount = this.totalThisTiemCancellationNo;
      this.formData.watchPaymentFor = totalAmount / this.formData.exchangeRate;
      this.formData.watchPayment = totalAmount;
      this.formData.reducedAmountFor = totalAmount / this.formData.exchangeRate * this.formData.bulkDiscount / 100;
      this.formData.reducedAmount = totalAmount * this.formData.bulkDiscount / 100;
    },
    divideToTBODY: function () {
      //分摊功能
      var that = this;

      if (that.formData.watchPayment <= 0) {
        that.$Message.info({
          content: '输入的表头金额必须大于零',
          duration: 3
        });
        return;
      } else if (that.table1DataList.length <= 0) {
        that.$Message.info({
          content: '源单列表不能为空',
          duration: 3
        });
        return;
      }
      var _n = that.formData.watchPayment;
      that.table1DataList.forEach(item => {
        console.log(item, '====item');
        var _n2 = 0, _nc = item.notCancellationAmount;
        if (_n !== 0) {
          if (_n <= _nc) {
            _n2 = _n, _n = 0;
          } else {
            _n2 = _nc, _n = _n - _nc;
          }
        }
        item.thisTiemCancellationFor = _n2;
        item.thisTiemCancellation = _n2 * item.surfaceExchangeRate;

      });
      if (_n !== 0) {
        that.$Message.info({
          content: `付款金额还余下 ${_n} 未被分摊完,请调整付款金额或者添加付款发票`,
          duration: 3
        });
      }


    },
    // 科目下拉框
    showSubjectVisable (_type) {
      this.whichSubject = _type;
      this.subjectVisable = true;
    },
    subjectClose () {
      this.subjectVisable = false;
    },
    subjectData (treeNode) {
      if (this.whichSubject === 1) {
        //给结算账户赋值
        this.formData.clearanceAccount = treeNode.subjectName;
        this.formData.clearanceAccountId = treeNode.id;
      } else if (this.whichSubject === 2) {
        //给折扣科目赋值
        this.formData.discountSubjectId = treeNode.id;
        this.formData.discountSubject = treeNode.subjectName;
        //this.formData.discountSubjectCode = treeNode.subjectCode;
      }

      // vm.row.subjectLabel = treeNode.subjectName;
      // vm.row.subjectValue = treeNode.subjectCode.replace(/\./g, '');
      // vm.row.subject = vm.row.subjectValue + ' ' + vm.row.subjectLabel;
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
    totalReceiptPaymentAmount () {
      let total = 0;
      this.table1DataList.forEach(item => {
        total += item.receiptPaymentAmount;
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
        total += item.notCancellationAmount;
      });
      total = accounting.formatNumber(total, this.floatNumber, ",");
      return total ? total : '0';
    },
    totalThisTiemCancellationFor () {
      let total = 0;
      // console.log(this.table1DataList, '====this.table1DataList==');
      this.table1DataList.forEach(item => {
        let _num = this.formatNum(item.thisTiemCancellationFor, 2);
        total += _num;
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
    totalThisTiemCancellationNo () {
      let total = 0;
      this.table1DataList.forEach(item => {
        total += item.thisTiemCancellation;
      });
      //total = accounting.formatNumber(total, this.floatNumber, ","); 不需要把金额转成带有(,)的字符串金额
      return total ? total : '0';
    },
    isDisabled () {	// 保存 是否可用
      let _bool = false;
      if (!this.writeIsChange || this.formData.auditMark === 2) {
        _bool = true;
      }
      return _bool;
    },
    deleteisDisabled () {	// delete 是否可用
      return (this.formData.isVoucher === 2 || this.formData.auditMark === 2);
    },
    editisDisabled () {	// 修改 是否可用
      return (this.formData.isVoucher === 2 && this.formData.auditMark === 2);
    },
    deleteisRowDisabled () {	// 修改行 是否可用
      return (this.table1CurrentSelectRow === '' || this.formData.auditMark === 2);
    },
    voucherisDisabled () {	// 生成凭证 是否可用
      return (this.formData.id === 0 || this.formData.auditMark === 0 || this.formData.auditMark === 1);
    },
    showVoucherDisabled () {	// 查看凭证 是否可用
      return (this.formData.id === 0 || this.formData.isVoucher !== 2);
    },
    examineisDisabled () {	// 审核 是否可用 auditMark
      return (this.formData.id === 0 || this.formData.auditMark === 0 || this.formData.auditMark === 2);
    },
    noexamineisDisabled () {	// 反审核 是否可用
      return (this.formData.id === 0 || this.formData.auditMark === 0 || this.formData.auditMark === 1);
    },
    sourceDisabled () {	// 源单 是否可用: 已审核的单据 选源单 按钮不可选
      return (this.formData.auditMark === 0 || this.formData.auditMark === 2);
    }
  }
})
