Vue.component('ht-modal-subject', {
    data () {
        return {
            show: this.value,
            cashSetting: {
                callback: {
                    onClick: this.clickTab,
                    onDblClick: this.dblClickTab
                }
            },
            id1: 1,
            tabs: {
                'zichan': '资产',
                'fuzhai': '负债',
                'gongtong': '共同',
                'quanyi': '权益',
                'chengben': '成本',
                'sunyi': '损益',
                'biaowai': '表外'
            },
            tabSelected: this.customTypes[0] || 'zichan',
            treeUrl: this.url,
            nodeSelected: '',
            nodeData: {}
        }
    },
    methods: {
        closeModal () {
            this.$emit('close')
        },
        updateRow () {

        },
        save () {
            this.$emit('save', this.nodeSelected);
            this.$emit('close');

            // 请求数据，返回

            /* var _this = this;
            var _url = './treedata.json';
            $.ajax({
                type: 'get',
                data: '',
                url: _url,
                dataType: 'json',
                success: function(res){
                    let data = res.data;
                    _this.$emit('save',_this.nodeSelected)
                    _this.$emit('close')
                },
                error: function(code){
                    console.log(code);
                }
            }); */
        },
        clickTab (event, treeId, treeNode) {
            this.nodeSelected = treeNode;
        },
        dblClickTab (event, treeId, treeNode) {
            this.nodeSelected = treeNode;
            this.save();
        },
        tabClick (name) {
            /* switch(name){
                case 'name1':
                    this.treeUrl = './treedata.json';
                    break;
                case 'name2':
                    this.treeUrl = './treedata2.json';
                    break;
                case 'name3':
                    this.treeUrl = './treedata.json';
                    break;
                default:
                    break;
            } */
        },
    },
    watch: {
        value (val) {
            this.show = val;
        }
    },
    created () {
        let vm = this;
        $.ajax({
            type: "POST",
            url: vm.url,
            dataType: "json",
            success: function (result) {
                var obj = {};
                if (vm.customTypes.length) {
                    $.each(result.data, function (key, val) {
                        if ($.inArray(key, vm.customTypes) > -1) {
                            obj[key] = result.data[key];
                        }
                    });
                } else {
                    obj = result.data;
                }

                if (vm.initid.length) {
                    var _sl = [];
                    vm.initid.forEach(function (_i) {
                        for (_variable in result.data) {
                            result.data[_variable].forEach(function (_item) {
                                if (_i.value === _item.id) {
                                    var _it = { 'id': _i.id, 'value': _item }
                                    _sl.push(_it);
                                }
                            });
                        }
                    });
                    vm.$emit('initidfn', _sl);
                }
                vm.nodeData = obj;
            }
        });
    },
    props: {
        value: {
            default () {
                return false;
            }
        },
        url: {
            default () {
                return contextPath + '/voucherController/getSubjectTree';
            }
        },
        row: {
            default () {
                return {};
            }
        },
        customTypes: {
            default () {
                return [];
            }
        },
        isParentClick: {
            default () {
                return false;
            }
        },
        initid: {
            require: false,
            type: Array,
            default () {
                return [];
            }
        },
    },
    template: `
        <Modal
        title="选择科目"
        v-model="show"
        
        @on-cancel='closeModal'
        :mask-closable="false">
        <tabs v-model="tabSelected" type="card" :animated="false" @on-click="tabClick">
            <tab-pane v-for="(label, key, idx) in tabs" v-if="key in nodeData" :label="label" :name="key" style="height:200px;overflow-y:auto;">
                <ht-tree v-if="!$.isEmptyObject(nodeData[key])"
                    :setting="cashSetting"
                    :isparentclick="isParentClick"
                    :tid="'ztree_' + key"
					:type="[key]"
					:tree-data="nodeData[key]"
                    v-show="tabSelected === key"></ht-tree>
				<span v-else>木有“{{label}}”的科目</span>
            </tab-pane>			
        </tabs>
        <div slot="footer">
            <i-button type="primary" @click="save">确定</i-button>
            <i-button @click="closeModal">取消</i-button>
        </div>
    </Modal>
    `
})