Vue.component('department-select', {
    props:{
      config:{
          type: Object,
          require: false,
          default(){
              return false;
          }
      }
    },
    data(){
        return {
            showModal: true,
            isAll: false,
            selectedList: [],
            selected: [],
            body:{
                name: '',
                code:''
            },
            treeSetting: {
                callback: {
                    onClick: this.clickEvent,
                }
            },
            options: [],
            temp: [
                {name: '部门1ddd1', value: 11, checked: false},
                {name: '部门2s1', value: 21, checked: false},
                {name: '部门3s1', value: 13, checked: false},
                {name: '部门4d2', value: 24, checked: false},
                {name: '部门2s5', value: 53, checked: false},
                {name: '部门6d1', value: 61, checked: false}
            ]
        }
    },
    methods: {
        sure(){
          this.selectedList.map((item)=>{
              this.selected.push(item.value);
          });
          this.$emit('input',this.selected)
        },
        cancel(){

        },
        clickEvent(event, treeId, treeNode) {
            console.log(event);
            console.log(treeId);
            console.log(treeNode);
        },
        doAll(){
            if(this.isAll){
               this.options.map((item) =>{
                   item.checked = true;
                });
                this.selectedList = [];
                this.selectedList = this.selectedList.concat(this.options);
            }else {
                this.options.forEach((item) =>{
                    item.checked = false;
                });
                this.selectedList = [];
            }
        },
        del(item, index){
            this.selectedList.splice(index, 1);
            let i = this.options.indexOf(item);
            this.options[i]['checked'] = false;
            this.isAll = false;

        },
        doSelect(item, index){
            if(item.checked){
                this.selectedList.push(this.options[index]);
            }else {
                let i = this.selectedList.indexOf(item);
                this.selectedList.splice(i, 1);
                this.isAll = false;
            }
        },
        filter(type){
            this.options = this.temp.filter((item)=>{
                return (item.name.toString().indexOf(this.body.name) > -1 && item.value.toString().indexOf(this.body.code) > -1);
            });

            this.options.some((item)=>{
                if(!item.checked){
                    this.isAll = false;
                    return true;
                }
            });
        }
    },
    mounted(){
        this.options = this.temp;
    },
    template: `<div>
            <Modal
         class-name="department-select"
        v-model="showModal"
        title="选择部门"
        @on-ok="sure"
        @on-cancel="cancel">
        <div class="content clearfix">
           <div style="width: 150px; float: left">
             <ht-tree url="www.my1.com" :setting="treeSetting" tid='modal_department'></ht-tree>
            </div>
           <div style="width: 550px; float: left; border: 1px solid #ccc;">
              <div>
              <i-form :model="body" :label-width="80">
                <form-item label="部门名称" style="width: 200px">
                    <i-input v-model="body.name" @on-change="filter()"></i-input>
                </form-item>
                <form-item label="部门编码" style="width: 200px">
                    <i-input v-model="body.code" @on-change="filter()"></i-input>
                </form-item>
                </i-form>
            </div>
              <div class="item"><span class="my-checkbox"><Checkbox v-model="isAll" @on-change="doAll"></Checkbox></span><span class="code">部门编码</span><span class="name">部门名称</span></div>
              <div class="item" v-for="(item, index) in options"><span><Checkbox v-model="item.checked" class="my-checkbox" @on-change="doSelect(item,index)"></Checkbox></span><span class="name">{{item.name}}</span><span class="code">{{item.value}}</span></div>
            </div>
            <div style="float: left">
              <p>选中列表</p>
              <p v-for="(item, index) in selectedList">{{item.name + '--' + item.value}} <i class="ivu-icon ivu-icon-close" @click="del(item, index)"></i></p>
            </div>
        </div>
         <div slot="footer">
            <Button @click="sure">确定</Button>
            <Button @click="cancel">取消</Button>
        </div>
    </Modal>
</div>`
});
