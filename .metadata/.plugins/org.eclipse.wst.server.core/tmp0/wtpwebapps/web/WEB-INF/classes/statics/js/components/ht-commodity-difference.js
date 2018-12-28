Vue.component('ht-commodity-difference', {
    props: {
        base: {
            type: Object,
            require: true
        },
        beforeRepair: {
            type: Object,
            require: true
        },
        afterRepair: {
            type: Object,
            require: false,
            default() {
                return null;
            }
        },
        beforeDisable: {
            type: Boolean,
            require: false,
            default() {
                return false;
            }
        },
        afterDisable: {
            type: Boolean,
            require: false,
            default() {
                return false;
            }
        },
        isResource: {
            type: Boolean,
            require: false,
            default() {
                return true;
            }
        }
    },
    data() {
        return {
            goldColor: []
        }
    },
    methods: {
        sum(attr, num) {
            let res = 0;
            let base = this.base[attr] ? parseFloat(this.base[attr]) : 0;
            let before = this.beforeRepair[attr] ? parseFloat(this.beforeRepair[attr]) : 0;
            let after = 0;
            if (this.afterRepair) {
                after = this.afterRepair[attr] ? parseFloat(this.afterRepair[attr]) : 0;
                res = after - before;
            } else {
                res = before - base;
            }
            return res.toFixed(num);
        },
        checkNum(obj, key, floor) {
            if (isNaN(obj[key])) {
                if (isNaN(parseFloat(obj[key]))) {
                    obj[key] = '';
                } else {
                    obj[key] =parseFloat(obj[key])
                    
                }
                return obj[key];
            }else{
                let val = obj[key].toString();
                let index = floor === 0 ? (val.indexOf('.') > -1 ? val.indexOf('.') : val.length + 1) :
                    (val.indexOf('.') > -1 ? val.indexOf('.') + floor + 1 : val.length + 1);
                obj[key] = val.substring(0, index);
                return obj[key];
            }
        },
    },
    computed: {
        totalWeightDiff() {
            return this.sum('totalWeight', 3);
        },
        goldWeightDiff() {
            return this.sum('goldWeight', 3);
        },
        mainStoneWeightDiff() {
            return this.sum('mainStoneWeight', 3);
        },
        viceStoneWeightDiff() {
            return this.sum('viceStoneWeight', 3);
        },
        viceStoneNumDiff() {
            return this.sum('viceStoneNum', 0);
        },
        totalObject(){
            return {
                'font-color': this.totalWeightDiff<0
            }
        },
        goldObject(){
            return {
                'font-color': this.goldWeightDiff<0
            }
        },
        mainObject(){
            return {
                'font-color': this.mainStoneWeightDiff<0
            }
        },
        weightObject(){
            return {
                'font-color': this.viceStoneWeightDiff<0
            }
        },
        numObject(){
            return {
                'font-color': this.viceStoneNumDiff<0
            }
        }
    },
    mounted() {
        this.goldColor = getCodeList('base_Condition');
    },
    template: `
    <table class="edit-table">
        <thead>
            <tr>
                <th>核对明细</th>
                <th>商品编码</th>
                <th>商品名称</th>
                <th>成色</th>
                <th>总重</th>
                <th>金重</th>
                <th>主石名称</th>
                <th>主石重(ct)</th>
                <th>主石颜色</th>
                <th>主石净度</th>
                <th>副石名称</th>
                <th>副石石重(ct)</th>
                <th>副石粒数</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="text-center">登记信息</td>
                <td>{{base.goodsCode}}</td>
                <td>{{base.goodsName}}</td>
                <td>
                    <i-select v-model="base.goldColor" disabled>
                        <i-option v-for="(item,index) in goldColor" :value="item.value" :key="item.value">{{item.name}}</i-option>
                    </i-select>
                </td>
                <td>{{base.totalWeight}}</td>
                <td>{{base.goldWeight}}</td>
                <td>{{base.mainStoneName}}</td>
                <td>{{base.mainStoneWeight}}</td>
                <td>{{base.mainStoneColor}}</td>
                <td>{{base.mainStoneClarity}}</td>
                <td>{{base.viceStoneName}}</td>
                <td>{{base.viceStoneWeight}}</td>
                <td>{{base.viceStoneNum}}</td>
            </tr>
            <tr>
                <td class="text-center">维修前检验</td>
                <td>
                    <span v-show="isResource">{{beforeRepair.goodsCode}}</span>
                </td>
                <td>
                    <span  v-show="isResource">{{beforeRepair.goodsName}}</span>
                </td>
                <td>
                    <i-select  v-show="isResource" transfer v-model="beforeRepair.goldColor" :disabled="afterRepair || beforeDisable" >
                        <i-option v-for="(item,index) in goldColor" :value="item.value" :key="item.value">{{item.name}}</i-option>
                    </select>
                </td>
                <td>
                    <input class="ivu-input" v-show="isResource" type="text" v-model="beforeRepair.totalWeight" :disabled="afterRepair || beforeDisable" @input="checkNum(beforeRepair,'totalWeight',3)">
                </td>
                <td>
                    <input class="ivu-input"  v-show="isResource" type="text" v-model="beforeRepair.goldWeight" :disabled="afterRepair || beforeDisable" @input="checkNum(beforeRepair,'goldWeight',3)">
                </td>
                <td>
                    <input class="ivu-input" v-show="isResource" type="text" v-model="beforeRepair.mainStoneName" :disabled="afterRepair || beforeDisable">
                </td>
                <td>
                    <input class="ivu-input"  v-show="isResource" type="text" v-model="beforeRepair.mainStoneWeight" :disabled="afterRepair || beforeDisable" @input="checkNum(beforeRepair,'mainStoneWeight',3)">
                </td>
                <td>
                    <input class="ivu-input" v-show="isResource" type="text" v-model="beforeRepair.mainStoneColor" :disabled="afterRepair || beforeDisable">
                </td>
                <td>
                    <input class="ivu-input" v-show="isResource" type="text" v-model="beforeRepair.mainStoneClarity" :disabled="afterRepair || beforeDisable">
                </td>
                <td>
                    <input class="ivu-input" v-show="isResource" type="text" v-model="beforeRepair.viceStoneName" :disabled="afterRepair || beforeDisable">
                </td>
                <td>
                    <input class="ivu-input" v-show="isResource" type="text" v-model="beforeRepair.viceStoneWeight" :disabled="afterRepair || beforeDisable" @input="checkNum(beforeRepair,'viceStoneWeight',3)">
                </td>
                <td>
                    <input class="ivu-input" v-show="isResource" type="text" v-model="beforeRepair.viceStoneNum" :disabled="afterRepair || beforeDisable" @input="checkNum(beforeRepair,'viceStoneNum',0)">
                </td>
            </tr>
            <tr v-if="afterRepair">
                <td class="text-center">维修后检验</td>
                <td>
                    {{afterRepair.goodsCode}}
                </td>
                <td>
                    {{afterRepair.goodsName}}
                </td>
                <td>
                    <i-select v-model="afterRepair.goldColor" transfer>
                        <i-option v-for="(item,index) in goldColor" :value="item.value" :key="item.value">{{item.name}}</i-option>
                    </i-select>
                </td>
                <td>
                    <input class="ivu-input" type="text" v-model="afterRepair.totalWeight" :disabled="afterDisable" @input="checkNum(afterRepair,'totalWeight',3)">
                </td>
                <td>
                    <input class="ivu-input" type="text" v-model="afterRepair.goldWeight" :disabled="afterDisable" @input="checkNum(afterRepair,'goldWeight',3)">
                </td>
                <td>
                    <input class="ivu-input" type="text" v-model="afterRepair.mainStoneName" :disabled="afterDisable">
                </td>
                <td>
                    <input class="ivu-input" type="text" v-model="afterRepair.mainStoneWeight" :disabled="afterDisable" @input="checkNum(afterRepair,'mainStoneWeight',3)">
                </td>
                <td>
                    <input class="ivu-input" type="text" v-model="afterRepair.mainStoneColor" :disabled="afterDisable">
                </td>
                <td>
                    <input class="ivu-input" type="text" v-model="afterRepair.mainStoneClarity" :disabled="afterDisable">
                </td>
                <td>
                    <input class="ivu-input" type="text" v-model="afterRepair.viceStoneName" :disabled="afterDisable">
                </td>
                <td>
                    <input class="ivu-input" type="text" v-model="afterRepair.viceStoneWeight" :disabled="afterDisable" @input="checkNum(afterRepair,'viceStoneWeight',3)">
                </td>
                <td>
                    <input class="ivu-input" type="text" v-model="afterRepair.viceStoneNum" :disabled="afterDisable" @input="checkNum(afterRepair,'viceStoneNum')">
                </td>
            </tr>
        </tbody>
        <tfoot>
            <tr>
                <td class="text-center">差异值</td>
                <td></td>
                <td></td>
                <td></td>
                <td><span :class='totalObject'>{{totalWeightDiff}}</span></td>
                <td><span :class='goldObject'>{{goldWeightDiff}}</span></td>
                <td></td>
                <td><span :class='mainObject'>{{mainStoneWeightDiff}}</span></td>
                <td></td>
                <td></td>
                <td></td>
                <td><span :class='weightObject'>{{viceStoneWeightDiff}}</span></td>
                <td><span :class='numObject'>{{viceStoneNumDiff}}</span></td>
            </tr>
        </tfoot>
    </table>`
})

// 
