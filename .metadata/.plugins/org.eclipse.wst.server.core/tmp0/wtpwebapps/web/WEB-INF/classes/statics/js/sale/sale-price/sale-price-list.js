var SALEPRICELISTVM = new Vue({
    el: '#sale-price-list',
    data() {
        let This = this;
        return {
            isHideSearch: true,
            isHideList: true,
            reload: false,
            selected: [],
            dataValue: '',
            openTime: '',
            body: {
                name: '',
                createName: '',
                startTime: '',
                endTime: '',
                isDel: 1,//是否删除1-未删除，0-已删除
            },
            data_config: {
                url: contextPath + "/saleStonePriceController/listByPage",
                colNames: ['id', '石价表编号', '石价表名称', '创建日期', '创建人'],
                colModel: [
                    {name: 'id', index: 'id', hidden: true},
                    {name: 'stonePriceNo', index: 'stonePriceNo', width: 250, align: "left",
                        formatter: function (value, grid, rows, state) {
                            let cssClass = ".detail" + value;
                            $(document).off('click', cssClass).on('click', cssClass, function () {
                                This.detailClick({value, grid, rows, state})
                            });
                            let myCode = `<a class="detail${value}">${value}</a>`;
                            return myCode;
                        }
                    },
                    {name: 'name', index: 'name', width: 250, align: "left"},
                    {name: 'createTime', index: 'createTime', width: 250, align: "left",
                        formatter: function (value, grid, rows, state) {
                            return new Date(value).format("yyyy-MM-dd");
                        }
                    },
                    {name: 'createName', index: 'createName', width: 250, align: "left"},
                ]
            }
        }
    },
    methods: {
        changeDate(value) {
            this.body.startTime = value[0]=="" ? "" : (value[0].replace(/\//g, '-') + ' 00:00:00');
            this.body.endTime = value[1]=="" ? "" : (value[1].replace(/\//g, '-') + ' 23:59:59');
        },
        search() {
            console.log("=================")
            this.reload = !this.reload;
        },
        clear() {
            this.body = {
                name: '',//石价表名称
                createName: '',//创建人
                startTime: '',
                endTime: '',
                isDel: 1,//是否删除1-未删除，0-已删除
            };
            this.dataValue = [];
            console.log(this.body)
        },
        //跳转详情页面
        detailClick(data) {
            let id = data.rows.id;
            window.parent.activeEvent({
                name: '普通销售石价表-查看',
                url: contextPath + '/sale/sale-price/sale-price-add.html',
                params: {id:id}
            });
        },
        refresh() {
            this.clear();
            this.reload = !this.reload;
        },
        add() {//新增-石价表
            window.parent.activeEvent({
                name: '普通销售石价表-新增',
                url: contextPath + '/sale/sale-price/sale-price-add.html',
                params: ''
            });
        },
        //删除
        deleteData() {
            let This = this;
            if (This.selected.length === 0) {
                this.$Modal.warning({
                    title: "提示",
                    content: "请至少选择一条记录进行删除"
                });
                return;
            }
            console.log(This.selected)
            this.$Modal.confirm({
                title: '提示信息',
                content: '<p>是否删除信息？</p>',
                onOk: () =>{
                    $.ajax({
                        type: "POST",
                        url: contextPath + "/saleStonePriceController/deleteBatch",
                        contentType: 'application/json',
                        data: JSON.stringify(This.selected),
                        dataType: "json",
                        success: function (data) {
                            if (data.code === "100100") {
                                setTimeout(()=>{
                                    This.$Modal.success({
                                        scrollable:true,
                                        title: "提示",
                                        content: "删除成功!",
                                        onOk(){
                                            This.refresh();
                                        }
                                    })
                                },300);
                            }else{
                                This.$Modal.error({
                                    title: "提示",
                                    content: "删除失败!"
                                });
                            }
                        },
                        error: function (err) {
                            This.$Modal.error({
                                title: "提示",
                                content: "服务器出错!"
                            });
                        }
                    })
                },
            })
        },
        //修改
        modify() {
            if (!ht.util.hasValue(this.selected, "array")) {
                this.$Modal.warning({
                    title: "提示",
                    content: "请先选择一条记录"
                });
                return false;
            } else if (this.selected.length > 1) {
                this.$Modal.warning({
                    title: "提示",
                    content: "最多只能选择一条记录"
                });
                return false;
            }
            var id = this.selected[0];
            if (!$.isEmptyObject(id)) {
                console.log(id)
                window.parent.activeEvent({
                    name: '普通销售石价表-修改',
                    url: contextPath + '/sale/sale-price/sale-price-add.html',
                    params: {id:id}
                });
            }
        },
        //退出
        cancel() {
            window.parent.closeCurrentTab({name: '普通销售石价表', exit: true, openTime: this.openTime})
        },
    },
    mounted: function () {
        this.openTime = window.parent.params.openTime;
    }
});