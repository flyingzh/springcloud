// 新增行操作
 function addRow(list,obj){
    console.log(list)
    list.push(Object.assign({},obj))
};

// 删除行
function delRow(list,checked){
    console.log(list)
    let arr = checked.sort().reverse();
    arr.map(el=>{
        list.splice(el,1)
    })
    checked.splice(0,checked.length)
};

// 复制行
function copyRow(list,checked){
    if( checked.length > 1) {
        this.popup_config={
            show:true,
            onlySure:false,
            title:'提示',
            content:'只能选择一条数据'
        }
        return;
    }
    if( checked.length === 0) {
        alert("请选择一条数据")
        return;
    }
    let tmp = list[checked[0]]
    list.push(Object.assign({},tmp))
};

// 复选框选中
function clickOne(checked,index){
    if (checked.indexOf(index) > -1) {
        let i = checked.indexOf(index)
        checked.splice(i, 1)
    } else {
        checked.push(index);
    }
    console.log(checked)
};
