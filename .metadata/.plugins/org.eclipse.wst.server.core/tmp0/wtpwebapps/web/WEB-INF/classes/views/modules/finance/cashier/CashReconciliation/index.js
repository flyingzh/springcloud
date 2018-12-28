new Vue({
    el: '#cash-book',
    data() {
        return {
            formData:{
                for1: '1001 库存现金',
                for2: '欧元',
                for3: '2017年5期至2017年7期',
                for4: '',
                for5: '',
                sobId: "",
                subjectId: "",
                currencyId: "",
                period: "1"
            },
            organisationList: [
                {label: "金大祥", value: 1},
                {label: "金大祥1", value: 2},
                {label: "金大祥2", value: 3},
            ],
            filterVisible: false,
            base_config: {
                // multiselect : true,
                mtype: 'POST',
                styleUI: 'Bootstrap',
                url: "./index.json",
                // ajaxGridOptions: { contentType: 'application/json;charset=utf-8' },
                datatype: 'json',
                colNames: ['id', '序号', '项目', '出纳管理系统', '总账系统', '差额', '日期', '实存金额'],
                colModel: [
                    {name: 'id', width: 30, hidden: true},
                    {name: 'tab1', width: 70},
                    {name: 'tab2', width: 120},
                    {name: 'tab3', width: 150, align: "right"},
                    {name: 'tab4', width: 150, align: "right"},
                    {name: 'tab5', width: 150, align: "right"},
                    {name: 'tab6', width: 120},
                    {name: 'tab7', width: 150, align: "right"}
                ],
                // postData: '',
                jsonReader: {
                    root: "list",
                    cell: "list",
                    repeatitems: false
                },
                height:$(window).height() - 140,
                viewrecords: true,
            },
            currencyList:[
                {label: "人民币", value: 1},
                {label: "美元", value: 2},
                {label: "欧元", value: 3},
            ]
        }
    },
    mounted() {
        this.jqGridInit();
    },
    methods:{
        // 生成jqGrid
        jqGridInit() {
            let config = Object.assign({}, this.base_config, {
                loadComplete: function () {
                },
                gridComplete: function () {
                },
            });
            jQuery("#grid").jqGrid(config);
        },
        open() {
            this.filterVisible = true;
        },
        refresh() {
            $("#grid").jqGrid('clearGridData');  //清空表格
            $("#grid").jqGrid('setGridParam',).trigger("reloadGrid");
        },
        save() {
            this.filterVisible = false;
            this.refresh();
        },
        cancel() {
            this.filterVisible = false;
        },
        
    },
    computed:{
        currencyName(){
            let find = this.currencyList.find(row=>{
                return row.value === this.formData.currencyId;
            })
            if(!find) return;
            return find.label;
        }
    }
})