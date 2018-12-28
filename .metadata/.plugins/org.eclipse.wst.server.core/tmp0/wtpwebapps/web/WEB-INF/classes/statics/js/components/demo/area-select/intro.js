window.home.guide = {
    props: [
        /*
        {   //属性、说明、类型、默认值
            name: '/',
            intro: '/',
            type: '/',
            defaultVal: '/'
        }
        */
        {
            name: 'url',
            intro: '（必填）请求全国各省市地区的 url',
            type: 'String',
            defaultVal: ''
        },
        {
            name: 'init',
            intro: `一个对象，包含该 isInit, province, city, county, detail, isInit 对应是否回显，
                    如果为是的话，province, city, county, detail 为真实的地址信息`,
            type: '',
            defaultVal: ''
        },
        {
            name: 'table_id',
            intro: '',
            type: '',
            defaultVal: ''
        },
        {
            name: 'pager_id',
            intro: '',
            type: '',
            defaultVal: ''
        }
    ],
    events: [
        /*
        {   //事件名、说明、返回值
            name: '/',
            intro: '/',
            returnVal: '/'
        }
        */
    ],
    methods: [
        /*
        {
            //方法名、参数、说明
            name: '/',
            param: '/',
            intro: '/'
        }
        */
    ],
	slots: [
	    /*
        {
            //名称、说明
            name: '/',
            intro: '/'
        }
        */
    ]
};