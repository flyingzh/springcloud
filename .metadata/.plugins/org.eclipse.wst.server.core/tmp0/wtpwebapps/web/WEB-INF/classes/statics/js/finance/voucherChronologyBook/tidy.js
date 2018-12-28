new Vue({
    el: '#tidy-voucher',
    data() {
        let This = this;
        return {
            isCur:1,
            tepsList:['快速预览','整理凭证','完成'],
            formData:{
                for1: "201802",
                for2: "1",
                for3: 1,
                for4: "1",
            },
            subjectList: [
                {name: '2018第2期', value: '201802'},
                {name: '2018第3期', value: '201803'},
                {name: '2018第4期', value: '201804'},
                {name: '2018第5期', value: '201805'},
                {name: '2018第6期', value: '201806'},
                {name: '2018第7期', value: '201807'},
                {name: '2018第11期', value: '201811'},
                {name: '2019第1期', value: '201901'},
            ],
            formDataList:[
                {label:'不限',value:''},
                {label:'贷',value:1},
                {label:'借',value:2},
            ],
            base_config:{
                mtype: "POST",
                styleUI: 'Bootstrap',
                url: './tidy.json',
                datatype: 'json',
                postData:JSON.stringify(This.formData),
                jsonReader: {
                    root: "data.items",
                    cell: "data.items",
                    userdata: "userdata",
                    repeatitems: false
                },
                colNames:['原有凭证号','补齐后凭证号'],
                colModel: [                                           
                    {name: 'oldNum', index :'oldNum', width: 80,title:false,align:"center"},
                    {name:"newNum", index :'newNum',width: 80,title:false,align:"center"}
                ],
                rowNum: 999,
                width:560,
            },
            btnShow:false,
        }
        
    },
    methods: {
        jqGridInit() {
            jQuery("#grid").jqGrid(this.base_config);
        },
        confirm(){
            this.jqGridInit();
            this.tableReload();
            this.btnShow = true;
        },
        tableReload() {
            $(`#grid`).jqGrid('clearGridData');
            $(`#grid`).jqGrid('setGridParam',this.base_config).trigger("reloadGrid");
        },
        begin(){
            var _this = this;
            this.$Modal.confirm({
                title: '整理凭证',
                okText:'确定',
                cancelText:'暂不处理',
                content: '<p>系统将自动对凭证号进行调整，已打印的凭证将需要重新打印！</p>',
                onOk: () => {
                    // this.del_data(data)
                    _this.isCur = 3;
                },
                onCancel: () => {
                    this.$Message.info('暂不处理');
                }
            });
        }
    },
    watch:{
    },
    computed:{
    },
    mounted() {
        // this.initMethod(this);
    }
});