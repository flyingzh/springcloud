/** 
 * 加法得到金额数据（保留精度问题） 
 * 调用例子：var total = Number(0.09999999).add(0.09999999); 
 * @param arg 
 * @returns {String} 
 */  
Number.prototype.add = function(arg){
    var r1,r2,m;     
    try{r1=this.toString().split('.')[1].length;}catch(e){r1=0;}     
    try{r2=arg.toString().split('.')[1].length;}catch(e){r2=0;}     
    m=Math.pow(10,Math.max(r1,r2));
    
    var val = (this*m+arg*m)/m;  
    var m = val.toString();  
    var num = m.split('.');  
    if(num.length>1){  
        var l = num[1];  
        if(l.length<2){  
            m = m + '0';  
        }  
    }  
    return m;  
};
