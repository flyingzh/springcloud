var unitGroupVm = new Vue({
    el: '#unitGroup',
    data(){
        return {
                unitGroupName: '' ,
                unitGroupId: ''
        }
    },
    methods:{
        save:function(){
            let This = this;
            if ($('form').valid()) {
                console.log(JSON.stringify(This.body));
                $.ajax({
                    type: "POST",
                    url: "../../tbaseunitgroup/save",
                    contentType: 'application/json',

                    data: JSON.stringify(This.unitGroupName),
                    dataType: "json",
                    success: function(data) {
                        console.log(data)
                        if (data.code === 100100) {
                            alert('保存成功');
                        } else {
                            alert(data.msg);
                        }
                    },
                    error: function(err){
                        alert("服务器出错");
                    },}

                )


            }
        },
        updateUnitGroup:function(){
            let This = this;
            if ($('form').valid()) {
                $.ajax({
                    type: "PATCH",
                    url: "http://localhost:8071/tbaseunitgroup/update",
                    contentType: 'application/json',
                    data: {
                        id:This.unitGroupId,
                        name:This.unitGroupName
                    },
                    dataType: "json",
                    success: function(data) {
                        console.log(data)
                        if (data.code === 100100) {
                            alert('更新成功');
                        } else {
                            alert(data.msg);
                        }
                    },
                    error: function(err){
                        alert("服务器出错");
                    },}

                )


            }
        },

        deleteById:function(){
            let This = this;
            if ($('form').valid()) {
                $.ajax({
                    type: "PATCH",
                    url: "http://localhost:8071/tbaseunitgroup/delete",
                    contentType: 'application/json',
                    data: {
                        id: This.unitGroupId
                    },
                    dataType: "json",
                    success: function(data) {
                        console.log(data)
                        if (data.code === 100100) {
                            alert('批量删除成功');
                        } else {
                            alert(data.msg);
                        }
                    },
                    error: function(err){
                        alert("服务器出错");
                    },}

                )


            }
        },
        mounted(){
            alert(3333)
        }
    }
})