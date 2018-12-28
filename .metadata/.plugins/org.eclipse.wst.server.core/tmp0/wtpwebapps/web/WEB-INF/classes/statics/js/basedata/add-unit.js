var unitVm = new Vue({
    el: '#unit',
    data(){
        return {
            body:{
                id: 2,
                code: '',
                name: '',
                conversionRate: '',
                createUid: 1,
                createName: '张三',
                groupId: 1,
                isDefault:''
            },
            ids: [
                {id: 1},
                {id: 2},
                {id: 3}
                ]
        }
    },
    methods:{
        save:function(){
            let This = this;
            if ($('form').valid()) {
                console.log(JSON.stringify(This.body));
                $.ajax({
                    type: "POST",
                    url: "../../tbaseunit/save",
                    // url: "http://localhost:8091/tbaseunit/save",
                    contentType: 'application/json',
                    data: JSON.stringify(This.body),
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
        infoById:function(id){
            if ($('form').valid()) {
                $.ajax({
                    type: "GET",
                    url: "../../tbaseunit/queryUnitById?id="+ id,
                    success: function(data) {
                        console.log(data)
                        if (data.code === 100100) {
                            alert('查看成功');
                        } else {
                            alert(data.msg);
                        }
                    },
                    error: function(err){
                        alert("服务器出错");
                    },


                });
            }
        },
        infoByCode:function(code){
            if ($('form').valid()) {
                $.ajax({
                    type: "GET",
                    url: "http://localhost:8071/tbaseunit/info?code="+ code,
                    success: function(data) {
                        console.log(data)
                        if (data.code === 100100) {
                            alert('查看成功');
                        } else {
                            alert(data.msg);
                        }
                    },
                    error: function(err){
                        alert("服务器出错");
                    },


                });
            }
        },
        infoByName:function(name){
            if ($('form').valid()) {
                event.preventDefault();
                $.ajax({
                    type: "GET",
                    url: "http://localhost:8071/tbaseunit/info?name="+ name,
                    success: function(data) {
                        console.log(data)
                        if (data.code === 100100) {
                            alert('查看成功');
                        } else {
                            alert(data.msg);
                        }
                    },
                    error: function(err){
                        alert("服务器出错");
                    },


                });
            }
        },

        updateUnit:function(){
            let This = this;
            if ($('form').valid()) {
                $.ajax({
                    type: "PATCH",
                    url: "http://localhost:8071/tbaseunit/update",
                    contentType: 'application/json',
                    data: JSON.stringify(This.ids),
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

        delBatch:function(){
            let This = this;
            if ($('form').valid()) {
                $.ajax({
                    type: "PATCH",
                    url: "http://localhost:8091/tbaseunit/delete",
                    // contentType: 'application/json',
                    // data: JSON.stringify(This.body.ids),
                    data: This.body.ids,
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