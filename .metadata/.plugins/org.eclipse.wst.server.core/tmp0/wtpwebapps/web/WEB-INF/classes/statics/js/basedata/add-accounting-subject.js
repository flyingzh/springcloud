new Vue({
    el:'#rrapp',
    data:{
        isDisable:false,
        isCheckedCash:false,
        isChecked:false,
        isCheckedBand:false,
        isShow:false,
        isSelected:"",
        subjectList:[
            // 借方:1  贷方：0
            {
                subjectType:'流动资产',
                DCRecord:1
            },
            {
                subjectType:'非流动资产',
                DCRecord:1
            },
            {
                subjectType:'流动负债',
                DCRecord:0
            },
            {
                subjectType:'非流动负债',
                DCRecord:0
            },
            {
                subjectType:'共同',
                DCRecord:1
            },
            {
                subjectType:'所有者权益',
                DCRecord:0
            },
            {
                subjectType:'成本',
                DCRecord:1
            },
            {
                subjectType:'营业收入',
                DCRecord:0
            },
            {
                subjectType:'营业成本及税金',
                DCRecord:1
            },
            {
                subjectType:'期间费用',
                DCRecord:1
            },
            {
                subjectType:'其他收入',
                DCRecord:0
            },
            {
                subjectType:'其他损失',
                DCRecord:1
            },
            {
                subjectType:'以前年度损益调整',
                DCRecord:0
            },
            {
                subjectType:'所得税',
                DCRecord:1
            },
            {
                subjectType:'表外科目',
                DCRecord:0
            }
        ],
        currencyType:[
            {
                type:'不核算',
                value:1
            },
            {
                type:'所有币别',
                value:2
            },
            {
                type:'澳元',
                value:3
            },
            {
                type:'加元',
                value:4
            },
            {
                type:'港元',
                value:5
            }
        ]
    },
    methods:{
        selectSubject(event){
            if( parseInt(event.target.value) === 1 ){
                this.isSelected = "1"
            }else if ( parseInt(event.target.value) === 0 ) {
                this.isSelected = "0"
            }
        },
        selectCurrency(event){
            if( parseInt(event.target.value)  === 1 ){
                this.isDisable = true;
            }else {
                this.isDisable = false;
            }
        },
        openDetail(){
            layer.open({
                type: 1, 
                title:false,
                content: $('#popup')
              })
        },
        submit(){
            console.log($("form").valid())
            
        }
    },
    updated(){
        $('form').validate();
    },
    mounted(){
        layui.use('element', function(){
            var element = layui.element;    
        });

    }
})
