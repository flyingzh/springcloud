var ve = new Vue({
    el: '#use_state',
    data () {
        let This = this;
        return {
            tid: 'zTreeAssetUseState',
            // treeUrl:contextPath + "/falocation/initTree",
            treeUrl: '',
            formData: {
                id: '',
                code: '',
                name: '',
                sobId: '',
                editable: '1',
                remark: '',
                pid: '',
                depType: '1',
            },
            initForm: {
                id: '',
                code: '',
                name: '',
                sobId: '',
                editable: '1',
                remark: '',
                pid: '',
                depType: '1',
            },
            organizationList: [],
            //收支类型树形
            nodes: [],
            setting: {
                callback: {
                    onClick: this.clickEvent,
                }
            },
            curEntity: {},
            selected: '',
            openTime: '',
            treeSetting: {
                callback: {
                    onClick: this.treeClickCallBack,
                    beforeClick: this.treeBeforeClick
                }
            },
            isDisabled: true,
        }
    },
    methods: {
        initTree () {
            let _vm = this;
            $.ajax({
                type: 'post',
                url: contextPath + "/useState/initTree",
                data: null,
                success: function (ret) {
                    if (ret.code == '100100') {
                        let dataList = ret.data;
                        /*for(var i = 0;i<dataList.length;i++){
                            dataList[i].pId = dataList[i].pid;
                            dataList[i].open = true;
                        }*/
                        _vm.nodes = dataList;
                    }
                }
            })
        },
        clickEvent (event, treeId, treeNode) {
            let _vm = this;
            /* let selnode = _vm.$ztree.getSelectedNodes();
             _vm.selected = selnode[0].id;*/
            _vm.selected = treeNode.id;
            $.ajax({
                type: 'post',
                url: contextPath + "/useState/info",
                data: { 'id': _vm.selected },
                success: function (ret) {
                    console.log(ret)
                    if (ret.code == '100100') {
                        _vm.curEntity = ret.data;
                        _vm.formData.code = ret.data.code;
                        _vm.formData.name = ret.data.name;
                        _vm.formData.id = ret.data.id;
                        _vm.isDisabled = true;
                    } else {
                        _vm.$Modal.warning({
                            title: '提示信息',
                            content: '<p>' + ret.msg + '</p >'
                        });
                    }
                }
            })
        },
        initPage () {
            let _vm = this;
            $.ajax({
                type: 'post',
                url: contextPath + "/falocation/initPage",
                data: null,
                success: function (ret) {
                    if (ret.code == '100100') {
                        _vm.organizationList = ret.data.org;
                        _vm.formData.sobId = ret.data.org[0].value
                        _vm.initForm.sobId = ret.data.org[0].value
                        _vm.curEntity = {};
                        _vm.selected = '';
                        _vm.isDisabled = true;
                        _vm.initTree();
                    } else {
                        _vm.$Modal.warning({
                            title: '提示信息',
                            content: '<p>页面初始化失败</p >'
                        });
                    }
                }
            })
            setTimeout(function(){ _vm.selectNodes(); }, 200);
        },
        modify (type) {
            let that = this;
            if (type == 'add') {
                $.extend(true, that.formData, that.initForm)
                if (!$.isEmptyObject(that.curEntity)) {
                    that.formData.code = that.curEntity.code + ".";
                }
                that.curEntity = {};
                that.isDisabled = false;
            } else if (type == 'edit') {
                if ($.isEmptyObject(that.curEntity)) {
                    that.$Modal.warning({
                        title: '提示',
                        content: '请选择要修改的使用状态'
                    })
                    return;
                }
                that.isDisabled = false;
                $.extend(true, that.formData, that.curEntity)
                that.curEntity = {};
            }
        },
        saveFun () {
            let that = this;
            let formData = that.formData;
            if (formData.code == null || formData.code == '') {
                that.$Message.error('编码不能为空')
                return;
            }
            if (formData.name == null || formData.name == '') {
                that.$Message.error('名称不能为空')
                return;
            }
            let check = that.codeCheck(formData.code);
            if (!check) {
                that.$Message.error('编码只能由[0-9]的数字和小数点组成')
                return;
            }
            $.ajax({
                type: 'post',
                url: contextPath + "/useState/saveOrUpdate",
                data: JSON.stringify(that.formData),
                contentType: 'application/json;charset=utf-8',
                dataType: 'json',
                success: function (ret) {
                    console.log(ret)
                    if (ret.code == '100100') {
                        that.$Modal.success({
                            title: '提示',
                            content: '操作成功'
                        })
                        that.refreshLocation();
                    } else {
                        that.$Modal.error({
                            title: '提示',
                            content: '操作失败：' + ret.msg
                        })
                    }
                }
            })
        },
        chk (val) {
            // var patrn =/^[1-9]\d*\.\d*|[1-9]\d*$/;
            var patrn = /^\d+(\.\d+)*$/;
            //var patrn = /^\d+(\.\d+)*\s[_\u4e00-\u9fa5]+$/;
            var result = true;
            if (!patrn.exec(val)) {
                result = false;
                return result;
            }
            var newV = val.replace(/\./g, '');
            newV = newV.replace(/ /g, '');
            console.log(newV)
            var regu = /^[1-9]\d*$/;
            if (!regu.exec(newV)) {
                result = false;
            }
            return result;
        },
        codeCheck (value) {
            let newData = value.replace(/\./g, ".");
            if (!isNaN(newData)) {
                return true;
            }
            return false;
        },
        delFun () {
            let _vm = this;
            if (_vm.selected == null || _vm.selected == '') {
                _vm.$Message.error('请选择要删除的使用状态')
                return;
            }
            $.ajax({
                type: 'post',
                url: contextPath + "/useState/delete",
                data: { 'id': _vm.selected },
                success: function (ret) {
                    console.log(ret)
                    if (ret.code == '100100') {
                        _vm.$Modal.success({
                            title: "提示",
                            content: "删除成功"
                        });
                        _vm.refreshLocation();
                    } else {
                        _vm.$Modal.error({
                            title: "提示",
                            content: "删除失败：" + ret.msg
                        });
                    }
                }
            })
        },
        //退出
        cancelFun: function () {
            window.parent.closeCurrentTab({ name: '基础资料-使用状态', openTime: this.openTime, exit: true })
        },
        //刷新
        refreshLocation () {
            this.initPage();
        },
        // 默认选择节点
        selectNodes(){
            var treeObj = $.fn.zTree.getZTreeObj(this.tid);		    //获取节点
            var nodes = treeObj.getNodes();
            if (nodes.length>0){
                treeObj.selectNode(nodes[0]);  //默认选中第一个
                this.clickEvent(null,null,nodes[0]);
            }
        },
    },
    mounted () {
        this.initPage();
        this.openTime = window.parent.params && window.parent.params.openTime;
    },
})