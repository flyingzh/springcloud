new Vue({
    el: '#approval-flow',
    data() {
        return {
            tree_data: null,
            detail: {},
            levelList: [{userIds: []}],
            userList: [],
            levelMap: {
                0: '一级审批',
                1: '二级审批',
                2: '三级审批',
                3: '四级审批',
                4: '五级审批',
                5: '六级审批'
            },
            tree_setting: {
                data: {
                    view: {
                        dblClickExpand: false
                    },
                    simpleData: {
                        enable: false
                    },
                    key: {
                        name: 'name',
                        children: "children"
                    }
                },
                callback: {
                    onClick: this.treeClickEvent,
                    beforeClick: this.treeBeforeClick
                }
            }
        }
    },
    methods: {
        treeClickEvent(event, treeId, treeNode) {
            let This = this;
            $.ajax({
                type: "POST",
                url: contextPath + "/ApprovalController/getApprovalNodes",
                data: JSON.stringify({docTypeCode: treeNode.value}),
                contentType: 'application/json',
                success: function (res) {
                    if (res.code === "100100") {
                        if (res.data && res.data.nodes.length > 0) {
                            This.levelList = res.data.nodes;
                            This.detail = res.data;
                        } else {
                            This.levelList = [{userIds: []}];
                            This.detail = Object.assign({}, {docTypeCode: treeNode.value});
                        }
                    } else {
                        layer.alert(res.msg);
                    }
                }
            })
        },
        treeBeforeClick (treeId, treeNode, clickFlag) {
            return !treeNode.isParent; //当单击父节点，返回false，不让选取
        },
        add(){
            if(this.levelList.length < 6){
                this.levelList.push({userIds: []});
            }else {
                this.$Modal.warning({
                    content: '最多只能有六级审核'
                })
            }
        },
        del(index){
            if(this.levelList.length > 1){
                this.levelList.splice(index, 1);
            }else {
                this.$Modal.warning({
                    content: '最少需要有一级审核'
                })
            }
        },
        save(){
            let This = this;
            Object.assign(this.detail, {nodes: this.levelList});
            if(this.validate()){
                return;
            }
            $.ajax({
                type: "POST",
                url: contextPath + "/ApprovalController/saveOrUpdateNodes",
                contentType: 'application/json',
                data: JSON.stringify(this.detail),
                success: function (res) {
                    if (res.code === "100100") {
                        This.$Modal.success({
                            content: '保存成功'
                        })
                    } else {
                        layer.alert(res.msg);
                    }
                }
            })
        },
        validate(){
            if(!this.detail.docTypeCode){
                this.$Modal.warning({
                    content: '请先选择左侧树'
                });
                return true;
            }
            if(this.detail.status === undefined){
                this.$Modal.warning({
                    content: '请选择状态'
                });
                return true;
            }
            return this.levelList.some((item, index)=>{
                if(item.userIds.length === 0){
                    this.$Modal.warning({
                        content: this.levelMap[index] + '必选'
                    });
                    return true;
                }
            })
        }
    },
    created() {
        let This = this;
        this.tree_data = getCodeAll('sys_approval');
        $.ajax({
            type: "POST",
            url: contextPath + "/user/queryUsesByOrgin",
            contentType: 'application/json',
            success: function (res) {
                if (res.code === "100100") {
                    This.userList = res.data;
                } else {
                    layer.alert(res.msg);
                }
            }
        })
    },
    mounted() {

    }
});