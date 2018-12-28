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
            name: 'url, nodeData',
            intro: `url 跟 nodeData 有且只有一个是必须的，<br />
                    详细配置看官方文档： http://www.treejs.cn/v3/api.php`,
            type: 'String',
            defaultVal: ''
        },
        {
            name: 'setting',
            intro: '',
            type: 'Object',
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