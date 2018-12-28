new Vue({
    el: '#trial-balance',
    data() {
        return {
            formData:{
                for1:'',
                for2:'',
                for3:'',
                for4:'',
                for5:'',
                for6:'',
                for7:'',
            },
            subjectList: [
                {name: '2018第一期', value: 1},
                {name: '2018第二期', value: 2}
            ],
            base_config:{
                treeGrid: true,
                treeGridModel: 'adjacency', //treeGrid模式，跟json元数据有关 ,adjacency/nested
                ExpandColumn: 'username',
                scroll: "true",
                styleUI: 'Bootstrap',
                url: './index.json',
                datatype: 'json',
                postData:{a:111},
                jsonReader: {
                    root: "data",
                    cell: "data",
                    userdata: "userdata",
                    repeatitems: false
                },
                treeReader: {
                    level_field: "level",
                    parent_id_field: "parent",
                    leaf_field: "isLeaf",
                    expanded_field: "expanded"
                },
                viewrecords: true,
                rowNum: 10,
                rowList: [10, 20, 30, 40],
                caption: "试算平衡表",
                mtype: "POST",
            },
            colNames:[],
            colModel: [],
            colunm_comfig: [
                {startColumnName: 'debit1', numberOfColumns: 2, titleText: '期初余额'},
                {startColumnName: 'debit2', numberOfColumns: 2, titleText: '本期发生额'},
                {startColumnName: 'debit3', numberOfColumns: 2, titleText: '本年累计发生额'},
                {startColumnName: 'debit4', numberOfColumns: 2, titleText: '期末余额'}
            ],
        }
    },
    methods: {
        // 初始值
        initMethod(){
            var that = this;
            this.delTable();
            this.colNames1 = ['科目编码', '科目名称', '借方', '贷方','借方', '贷方', '借方', '贷方', '借方', '贷方'],
            this.colModel = [
                {name: 'code', index: 'username', width: 110, sortable: false},
                {name: 'name', index: 'password', width: 80, sortable: false},
                {name: 'debit1', index: 'age', width: 80},
                {name: 'credit1', index: 'address', width: 80},
                {name: 'debit2', index: 'age', width: 80},
                {name: 'credit2', index: 'address', width: 80},
                {name: 'debit3', index: 'age', width: 80},
                {name: 'credit3', index: 'address', width: 80},
                {name: 'debit4', index: 'age', width: 80},
                {name: 'credit4', index: 'address', width: 80},
            ],
            this.jqGridInit(this.colNames1,this.colModel,this.colunm_comfig,that);
        },
        // 有核算维度编码
        showDetailMethod(){
            var that = this;
            this.delTable();
            this.colNames1 = ['科目编码', '科目名称', '核算维度编码', '核算维度名称', '借方', '贷方','借方', '贷方', '借方', '贷方', '借方', '贷方'],
            this.colModel = [
                {name: 'code', index: 'username', width: 110, sortable: false},
                {name: 'name', index: 'password', width: 80, sortable: false},
                {name: 'dimensionCode', index: 'age', width: 120},
                {name: 'dimensionName', index: 'age', width: 120},
                {name: 'debit1', index: 'age', width: 80},
                {name: 'credit1', index: 'address', width: 80},
                {name: 'debit2', index: 'age', width: 80},
                {name: 'credit2', index: 'address', width: 80},
                {name: 'debit3', index: 'age', width: 80},
                {name: 'credit3', index: 'address', width: 80},
                {name: 'debit4', index: 'age', width: 80},
                {name: 'credit4', index: 'address', width: 80},
            ],
            this.jqGridInit(this.colNames1,this.colModel,this.colunm_comfig,that);
        },
        
        // a2Click(){
        //     this.delTable();
        //     this.colNames1 = ['科目编码', '科目名称', '借方(原币)', '借方(本位币)', '贷方(原币)', '贷方(本位币)', '借方(原币)', '借方(本位币)', '贷方(原币)', '贷方(本位币)','借方(原币)', '借方(本位币)', '贷方(原币)', '贷方(本位币)','借方(原币)', '借方(本位币)', '贷方(原币)', '贷方(本位币)'];
        //     this.colModel = [
        //         {name: 'code', index: 'username', width: 110, sortable: false},
        //         {name: 'name', index: 'password', width: 80, sortable: false},
        //         {name: 'debit1', index: 'age', width: 80},
        //         {name: 'credit1', index: 'address', width: 80},
        //         {name: 'debit11', index: 'age', width: 80},
        //         {name: 'credit11', index: 'address', width: 80},
        //         {name: 'debit2', index: 'age', width: 80},
        //         {name: 'credit2', index: 'address', width: 80},
        //         {name: 'debit21', index: 'age', width: 80},
        //         {name: 'credit21', index: 'address', width: 80},
        //         {name: 'debit3', index: 'age', width: 80},
        //         {name: 'credit3', index: 'address', width: 80},
        //         {name: 'debit31', index: 'age', width: 80},
        //         {name: 'credit31', index: 'address', width: 80},
        //         {name: 'debit4', index: 'age', width: 80},
        //         {name: 'credit4', index: 'address', width: 80},
        //         {name: 'debit41', index: 'age', width: 80},
        //         {name: 'credit41', index: 'address', width: 80},
        //     ],
        //     this.colunm_comfig = [
        //         {startColumnName: 'debit1', numberOfColumns: 4, titleText: '期初余额'},
        //         {startColumnName: 'debit2', numberOfColumns: 4, titleText: '本期发生额'},
        //         {startColumnName: 'debit3', numberOfColumns: 4, titleText: '本年累计发生额'},
        //         {startColumnName: 'debit4', numberOfColumns: 4, titleText: '期末余额'}
        //     ]
        //     this.jqGridInit(this.colNames1,this.colModel,this.colunm_comfig);
        // },
        delTable(){
            $("#my_report").empty();// 清空表格内容
            var parent=$(".jqGrid_wrapper"); // 获得整个表格容器  
            parent.empty();  
            $("<table id='my_report'></table>").appendTo(parent); 
            $("<div id='my_pager'></div>").appendTo(parent);  // 再根据数据重新绘制表格
        },
        // 生成jqGrid
        jqGridInit(colNames1,colModel1,colunm_comfig,that) {
            let config = Object.assign({},this.base_config,{
                colNames:colNames1,
                colModel:colModel1,
                pager: '#my_pager',
                gridComplete() { // 多表头表格设置
                    jQuery("#my_report").jqGrid('setGroupHeaders', {
                        useColSpanStyle: true,
                        groupHeaders:colunm_comfig
                    });
                },
                loadComplete () { // 非表格数据
                    jQuery("#my_report").getGridParam('userData'); 
                    var userData=jQuery("#my_report").jqGrid('getGridParam', 'userData')
                    that.$set(that.formData,'for8',userData.accountantTime)
                    that.$set(that.formData,'for9',userData.currencyName)
                    that.$set(that.formData,'for10',userData.message)
                } 
            }); 
            jQuery("#my_report").jqGrid(config);
        },
        save(){
            this.base_config.url = "./index2.json"
            this.base_config.postData = {};
            if(this.showDetail){
                this.showDetailMethod();
            }else{
                this.initMethod();
            }
        },
        cancel(){
        },
        more(){},
    },
    computed:{
        showDetail(){
            return !!this.formData.for6;
        }
    },
    mounted() {
        let that = this;
        this.initMethod(this.colNames,this.colModel,this.colunm_comfig,that);
    }
});