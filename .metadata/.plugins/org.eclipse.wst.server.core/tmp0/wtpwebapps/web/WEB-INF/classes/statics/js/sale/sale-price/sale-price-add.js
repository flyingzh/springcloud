var PriceAddVM = new Vue({
    el: '#sale-price-add',
    data() {
        return {
            isDisable: true,
            timeIsDisable: true,
            openName: '',
            openTime: '',
            showUpload: false,
            file: '',
            uploadDataList: {},
            ruleValidate: {
                'stonePriceEntity.name': [
                    { required: true }
                ]
            },
            organ: {
                currentOrganization: {
                    orgName: ''
                },
                userCurrentOrganId: ''
            },
            addBody: {
                "stonePriceEntity": {
                    id: '',
                    "createId": null,
                    "createName": null,
                    "organizationId": null,
                    organizationName: '',
                    "id": null,
                    "name": null,
                    "stonePriceNo": "",
                    "isDel": null,
                    "stonePriceDetailEntityList": null
                },
                "stonePriceList": [
                    {
                        "A01": [
                            {
                                "id": 1,
                                "normalStonePriceId": null,
                                "stonePriceNo": "",
                                "stoneSectionName": "厘石（0.001-0.029ct）",
                                "stoneSection": "A01",
                                "stoneClarity": "IF",
                                "h": null,
                                "smallN": null,
                                "white": null,
                                "dAndE": null,
                                "fAndG": null,
                                "iAndJ": null,
                                "kAndL": null,
                                "mAndN": null
                            },
                            {
                                "id": 2,
                                "normalStonePriceId": null,
                                "stonePriceNo": "",
                                "stoneSectionName": "厘石（0.001-0.029ct）",
                                "stoneSection": "A01",
                                "stoneClarity": "VVS",
                                "h": null,
                                "smallN": null,
                                "white": null,
                                "dAndE": null,
                                "fAndG": null,
                                "iAndJ": null,
                                "kAndL": null,
                                "mAndN": null
                            },
                            {
                                "id": 3,
                                "normalStonePriceId": null,
                                "stonePriceNo": "",
                                "stoneSectionName": "厘石（0.001-0.029ct）",
                                "stoneSection": "A01",
                                "stoneClarity": "VS",
                                "h": null,
                                "smallN": null,
                                "white": null,
                                "dAndE": null,
                                "fAndG": null,
                                "iAndJ": null,
                                "kAndL": null,
                                "mAndN": null
                            },
                            {
                                "id": 4,
                                "normalStonePriceId": null,
                                "stonePriceNo": "",
                                "stoneSectionName": "厘石（0.001-0.029ct）",
                                "stoneSection": "A01",
                                "stoneClarity": "SI",
                                "h": null,
                                "smallN": null,
                                "white": null,
                                "dAndE": null,
                                "fAndG": null,
                                "iAndJ": null,
                                "kAndL": null,
                                "mAndN": null
                            },
                            {
                                "id": 5,
                                "normalStonePriceId": null,
                                "stonePriceNo": "",
                                "stoneSectionName": "厘石（0.001-0.029ct）",
                                "stoneSection": "A01",
                                "stoneClarity": "P",
                                "h": null,
                                "smallN": null,
                                "white": null,
                                "dAndE": null,
                                "fAndG": null,
                                "iAndJ": null,
                                "kAndL": null,
                                "mAndN": null
                            }
                        ]
                    },
                    {
                        "A02": [
                            {
                                "id": 1,
                                "normalStonePriceId": null,
                                "stonePriceNo": "",
                                "stoneSectionName": "3-7分（0.03-0.0.079ct）",
                                "stoneSection": "A02",
                                "stoneClarity": "IF",
                                "h": null,
                                "smallN": null,
                                "white": null,
                                "dAndE": null,
                                "fAndG": null,
                                "iAndJ": null,
                                "kAndL": null,
                                "mAndN": null
                            },
                            {
                                "id": 2,
                                "normalStonePriceId": null,
                                "stonePriceNo": "",
                                "stoneSectionName": "3-7分（0.03-0.0.079ct）",
                                "stoneSection": "A02",
                                "stoneClarity": "VVS",
                                "h": null,
                                "smallN": null,
                                "white": null,
                                "dAndE": null,
                                "fAndG": null,
                                "iAndJ": null,
                                "kAndL": null,
                                "mAndN": null
                            },
                            {
                                "id": 3,
                                "normalStonePriceId": null,
                                "stonePriceNo": "",
                                "stoneSectionName": "3-7分（0.03-0.0.079ct）",
                                "stoneSection": "A02",
                                "stoneClarity": "VS",
                                "h": null,
                                "smallN": null,
                                "white": null,
                                "dAndE": null,
                                "fAndG": null,
                                "iAndJ": null,
                                "kAndL": null,
                                "mAndN": null
                            },
                            {
                                "id": 4,
                                "normalStonePriceId": null,
                                "stonePriceNo": "",
                                "stoneSectionName": "3-7分（0.03-0.0.079ct）",
                                "stoneSection": "A02",
                                "stoneClarity": "SI",
                                "h": null,
                                "smallN": null,
                                "white": null,
                                "dAndE": null,
                                "fAndG": null,
                                "iAndJ": null,
                                "kAndL": null,
                                "mAndN": null
                            },
                            {
                                "id": 5,
                                "normalStonePriceId": null,
                                "stonePriceNo": "",
                                "stoneSectionName": "3-7分（0.03-0.0.079ct）",
                                "stoneSection": "A02",
                                "stoneClarity": "P",
                                "h": null,
                                "smallN": null,
                                "white": null,
                                "dAndE": null,
                                "fAndG": null,
                                "iAndJ": null,
                                "kAndL": null,
                                "mAndN": null
                            }
                        ]
                    },
                    {
                        "A03": [
                            {
                                "id": 1,
                                "normalStonePriceId": null,
                                "stonePriceNo": "",
                                "stoneSectionName": "10分（0.08-0.129ct）",
                                "stoneSection": "A03",
                                "stoneClarity": "IF",
                                "h": null,
                                "smallN": null,
                                "white": null,
                                "dAndE": null,
                                "fAndG": null,
                                "iAndJ": null,
                                "kAndL": null,
                                "mAndN": null
                            },
                            {
                                "id": 2,
                                "normalStonePriceId": null,
                                "stonePriceNo": "",
                                "stoneSectionName": "10分（0.08-0.129ct）",
                                "stoneSection": "A03",
                                "stoneClarity": "VVS",
                                "h": null,
                                "smallN": null,
                                "white": null,
                                "dAndE": null,
                                "fAndG": null,
                                "iAndJ": null,
                                "kAndL": null,
                                "mAndN": null
                            },
                            {
                                "id": 3,
                                "normalStonePriceId": null,
                                "stonePriceNo": "",
                                "stoneSectionName": "10分（0.08-0.129ct）",
                                "stoneSection": "A03",
                                "stoneClarity": "VS",
                                "h": null,
                                "smallN": null,
                                "white": null,
                                "dAndE": null,
                                "fAndG": null,
                                "iAndJ": null,
                                "kAndL": null,
                                "mAndN": null
                            },
                            {
                                "id": 4,
                                "normalStonePriceId": null,
                                "stonePriceNo": "",
                                "stoneSectionName": "10分（0.08-0.129ct）",
                                "stoneSection": "A03",
                                "stoneClarity": "SI",
                                "h": null,
                                "smallN": null,
                                "white": null,
                                "dAndE": null,
                                "fAndG": null,
                                "iAndJ": null,
                                "kAndL": null,
                                "mAndN": null
                            },
                            {
                                "id": 5,
                                "normalStonePriceId": null,
                                "stonePriceNo": "",
                                "stoneSectionName": "10分（0.08-0.129ct）",
                                "stoneSection": "A03",
                                "stoneClarity": "P",
                                "h": null,
                                "smallN": null,
                                "white": null,
                                "dAndE": null,
                                "fAndG": null,
                                "iAndJ": null,
                                "kAndL": null,
                                "mAndN": null
                            }
                        ]
                    },
                    {
                        "A04": [
                            {
                                "id": 1,
                                "normalStonePriceId": null,
                                "stonePriceNo": "",
                                "stoneSectionName": "15分（0.13-0.179ct）",
                                "stoneSection": "A04",
                                "stoneClarity": "IF",
                                "h": null,
                                "smallN": null,
                                "white": null,
                                "dAndE": null,
                                "fAndG": null,
                                "iAndJ": null,
                                "kAndL": null,
                                "mAndN": null
                            },
                            {
                                "id": 2,
                                "normalStonePriceId": null,
                                "stonePriceNo": "",
                                "stoneSectionName": "15分（0.13-0.179ct）",
                                "stoneSection": "A04",
                                "stoneClarity": "VVS",
                                "h": null,
                                "smallN": null,
                                "white": null,
                                "dAndE": null,
                                "fAndG": null,
                                "iAndJ": null,
                                "kAndL": null,
                                "mAndN": null
                            },
                            {
                                "id": 3,
                                "normalStonePriceId": null,
                                "stonePriceNo": "",
                                "stoneSectionName": "15分（0.13-0.179ct）",
                                "stoneSection": "A04",
                                "stoneClarity": "VS",
                                "h": null,
                                "smallN": null,
                                "white": null,
                                "dAndE": null,
                                "fAndG": null,
                                "iAndJ": null,
                                "kAndL": null,
                                "mAndN": null
                            },
                            {
                                "id": 4,
                                "normalStonePriceId": null,
                                "stonePriceNo": "",
                                "stoneSectionName": "15分（0.13-0.179ct）",
                                "stoneSection": "A04",
                                "stoneClarity": "SI",
                                "h": null,
                                "smallN": null,
                                "white": null,
                                "dAndE": null,
                                "fAndG": null,
                                "iAndJ": null,
                                "kAndL": null,
                                "mAndN": null
                            },
                            {
                                "id": 5,
                                "normalStonePriceId": null,
                                "stonePriceNo": "",
                                "stoneSectionName": "15分（0.13-0.179ct）",
                                "stoneSection": "A04",
                                "stoneClarity": "P",
                                "h": null,
                                "smallN": null,
                                "white": null,
                                "dAndE": null,
                                "fAndG": null,
                                "iAndJ": null,
                                "kAndL": null,
                                "mAndN": null
                            }
                        ]
                    },
                    {
                        "A05": [
                            {
                                "id": 1,
                                "normalStonePriceId": null,
                                "stonePriceNo": "",
                                "stoneSectionName": "20分（0.18-0.229ct）",
                                "stoneSection": "A05",
                                "stoneClarity": "IF",
                                "h": null,
                                "smallN": null,
                                "white": null,
                                "dAndE": null,
                                "fAndG": null,
                                "iAndJ": null,
                                "kAndL": null,
                                "mAndN": null
                            },
                            {
                                "id": 2,
                                "normalStonePriceId": null,
                                "stonePriceNo": "",
                                "stoneSectionName": "20分（0.18-0.229ct）",
                                "stoneSection": "A05",
                                "stoneClarity": "VVS",
                                "h": null,
                                "smallN": null,
                                "white": null,
                                "dAndE": null,
                                "fAndG": null,
                                "iAndJ": null,
                                "kAndL": null,
                                "mAndN": null
                            },
                            {
                                "id": 3,
                                "normalStonePriceId": null,
                                "stonePriceNo": "",
                                "stoneSectionName": "20分（0.18-0.229ct）",
                                "stoneSection": "A05",
                                "stoneClarity": "VS",
                                "h": null,
                                "smallN": null,
                                "white": null,
                                "dAndE": null,
                                "fAndG": null,
                                "iAndJ": null,
                                "kAndL": null,
                                "mAndN": null
                            },
                            {
                                "id": 4,
                                "normalStonePriceId": null,
                                "stonePriceNo": "",
                                "stoneSectionName": "20分（0.18-0.229ct）",
                                "stoneSection": "A05",
                                "stoneClarity": "SI",
                                "h": null,
                                "smallN": null,
                                "white": null,
                                "dAndE": null,
                                "fAndG": null,
                                "iAndJ": null,
                                "kAndL": null,
                                "mAndN": null
                            },
                            {
                                "id": 5,
                                "normalStonePriceId": null,
                                "stonePriceNo": "",
                                "stoneSectionName": "20分（0.18-0.229ct）",
                                "stoneSection": "A05",
                                "stoneClarity": "P",
                                "h": null,
                                "smallN": null,
                                "white": null,
                                "dAndE": null,
                                "fAndG": null,
                                "iAndJ": null,
                                "kAndL": null,
                                "mAndN": null
                            }
                        ]
                    },
                    {
                        "A06": [
                            {
                                "id": 1,
                                "normalStonePriceId": null,
                                "stonePriceNo": "",
                                "stoneSectionName": "25分（0.23-0.299ct）",
                                "stoneSection": "A06",
                                "stoneClarity": "IF",
                                "h": null,
                                "smallN": null,
                                "white": null,
                                "dAndE": null,
                                "fAndG": null,
                                "iAndJ": null,
                                "kAndL": null,
                                "mAndN": null
                            },
                            {
                                "id": 2,
                                "normalStonePriceId": null,
                                "stonePriceNo": "",
                                "stoneSectionName": "25分（0.23-0.299ct）",
                                "stoneSection": "A06",
                                "stoneClarity": "VVS",
                                "h": null,
                                "smallN": null,
                                "white": null,
                                "dAndE": null,
                                "fAndG": null,
                                "iAndJ": null,
                                "kAndL": null,
                                "mAndN": null
                            },
                            {
                                "id": 3,
                                "normalStonePriceId": null,
                                "stonePriceNo": "",
                                "stoneSectionName": "25分（0.23-0.299ct）",
                                "stoneSection": "A06",
                                "stoneClarity": "VS",
                                "h": null,
                                "smallN": null,
                                "white": null,
                                "dAndE": null,
                                "fAndG": null,
                                "iAndJ": null,
                                "kAndL": null,
                                "mAndN": null
                            },
                            {
                                "id": 4,
                                "normalStonePriceId": null,
                                "stonePriceNo": "",
                                "stoneSectionName": "25分（0.23-0.299ct）",
                                "stoneSection": "A06",
                                "stoneClarity": "SI",
                                "h": null,
                                "smallN": null,
                                "white": null,
                                "dAndE": null,
                                "fAndG": null,
                                "iAndJ": null,
                                "kAndL": null,
                                "mAndN": null
                            },
                            {
                                "id": 5,
                                "normalStonePriceId": null,
                                "stonePriceNo": "",
                                "stoneSectionName": "25分（0.23-0.299ct）",
                                "stoneSection": "A06",
                                "stoneClarity": "P",
                                "h": null,
                                "smallN": null,
                                "white": null,
                                "dAndE": null,
                                "fAndG": null,
                                "iAndJ": null,
                                "kAndL": null,
                                "mAndN": null
                            }
                        ]
                    },
                    {
                        "A07": [
                            {
                                "id": 1,
                                "normalStonePriceId": null,
                                "stonePriceNo": "",
                                "stoneSectionName": "30分（0.30-0.399ct）",
                                "stoneSection": "A07",
                                "stoneClarity": "IF",
                                "h": null,
                                "smallN": null,
                                "white": null,
                                "dAndE": null,
                                "fAndG": null,
                                "iAndJ": null,
                                "kAndL": null,
                                "mAndN": null
                            },
                            {
                                "id": 2,
                                "normalStonePriceId": null,
                                "stonePriceNo": "",
                                "stoneSectionName": "30分（0.30-0.399ct）",
                                "stoneSection": "A07",
                                "stoneClarity": "VVS",
                                "h": null,
                                "smallN": null,
                                "white": null,
                                "dAndE": null,
                                "fAndG": null,
                                "iAndJ": null,
                                "kAndL": null,
                                "mAndN": null
                            },
                            {
                                "id": 3,
                                "normalStonePriceId": null,
                                "stonePriceNo": "",
                                "stoneSectionName": "30分（0.30-0.399ct）",
                                "stoneSection": "A07",
                                "stoneClarity": "VS",
                                "h": null,
                                "smallN": null,
                                "white": null,
                                "dAndE": null,
                                "fAndG": null,
                                "iAndJ": null,
                                "kAndL": null,
                                "mAndN": null
                            },
                            {
                                "id": 4,
                                "normalStonePriceId": null,
                                "stonePriceNo": "",
                                "stoneSectionName": "30分（0.30-0.399ct）",
                                "stoneSection": "A07",
                                "stoneClarity": "SI",
                                "h": null,
                                "smallN": null,
                                "white": null,
                                "dAndE": null,
                                "fAndG": null,
                                "iAndJ": null,
                                "kAndL": null,
                                "mAndN": null
                            },
                            {
                                "id": 5,
                                "normalStonePriceId": null,
                                "stonePriceNo": "",
                                "stoneSectionName": "30分（0.30-0.399ct）",
                                "stoneSection": "A07",
                                "stoneClarity": "P",
                                "h": null,
                                "smallN": null,
                                "white": null,
                                "dAndE": null,
                                "fAndG": null,
                                "iAndJ": null,
                                "kAndL": null,
                                "mAndN": null
                            }
                        ]
                    },
                    {
                        "A08": [
                            {
                                "id": 1,
                                "normalStonePriceId": null,
                                "stonePriceNo": "",
                                "stoneSectionName": "40分（0.40-0.499ct）",
                                "stoneSection": "A08",
                                "stoneClarity": "IF",
                                "h": null,
                                "smallN": null,
                                "white": null,
                                "dAndE": null,
                                "fAndG": null,
                                "iAndJ": null,
                                "kAndL": null,
                                "mAndN": null
                            },
                            {
                                "id": 2,
                                "normalStonePriceId": null,
                                "stonePriceNo": "",
                                "stoneSectionName": "40分（0.40-0.499ct）",
                                "stoneSection": "A08",
                                "stoneClarity": "VVS",
                                "h": null,
                                "smallN": null,
                                "white": null,
                                "dAndE": null,
                                "fAndG": null,
                                "iAndJ": null,
                                "kAndL": null,
                                "mAndN": null
                            },
                            {
                                "id": 3,
                                "normalStonePriceId": null,
                                "stonePriceNo": "",
                                "stoneSectionName": "40分（0.40-0.499ct）",
                                "stoneSection": "A08",
                                "stoneClarity": "VS",
                                "h": null,
                                "smallN": null,
                                "white": null,
                                "dAndE": null,
                                "fAndG": null,
                                "iAndJ": null,
                                "kAndL": null,
                                "mAndN": null
                            },
                            {
                                "id": 4,
                                "normalStonePriceId": null,
                                "stonePriceNo": "",
                                "stoneSectionName": "40分（0.40-0.499ct）",
                                "stoneSection": "A08",
                                "stoneClarity": "SI",
                                "h": null,
                                "smallN": null,
                                "white": null,
                                "dAndE": null,
                                "fAndG": null,
                                "iAndJ": null,
                                "kAndL": null,
                                "mAndN": null
                            },
                            {
                                "id": 5,
                                "normalStonePriceId": null,
                                "stonePriceNo": "",
                                "stoneSectionName": "40分（0.40-0.499ct）",
                                "stoneSection": "A08",
                                "stoneClarity": "P",
                                "h": null,
                                "smallN": null,
                                "white": null,
                                "dAndE": null,
                                "fAndG": null,
                                "iAndJ": null,
                                "kAndL": null,
                                "mAndN": null
                            }
                        ]
                    },
                    {
                        "A09": [
                            {
                                "id": 1,
                                "normalStonePriceId": null,
                                "stonePriceNo": "",
                                "stoneSectionName": "50分（0.50-0.599ct）",
                                "stoneSection": "A09",
                                "stoneClarity": "IF",
                                "h": null,
                                "smallN": null,
                                "white": null,
                                "dAndE": null,
                                "fAndG": null,
                                "iAndJ": null,
                                "kAndL": null,
                                "mAndN": null
                            },
                            {
                                "id": 2,
                                "normalStonePriceId": null,
                                "stonePriceNo": "",
                                "stoneSectionName": "50分（0.50-0.599ct）",
                                "stoneSection": "A09",
                                "stoneClarity": "VVS",
                                "h": null,
                                "smallN": null,
                                "white": null,
                                "dAndE": null,
                                "fAndG": null,
                                "iAndJ": null,
                                "kAndL": null,
                                "mAndN": null
                            },
                            {
                                "id": 3,
                                "normalStonePriceId": null,
                                "stonePriceNo": "",
                                "stoneSectionName": "50分（0.50-0.599ct）",
                                "stoneSection": "A09",
                                "stoneClarity": "VS",
                                "h": null,
                                "smallN": null,
                                "white": null,
                                "dAndE": null,
                                "fAndG": null,
                                "iAndJ": null,
                                "kAndL": null,
                                "mAndN": null
                            },
                            {
                                "id": 4,
                                "normalStonePriceId": null,
                                "stonePriceNo": "",
                                "stoneSectionName": "50分（0.50-0.599ct）",
                                "stoneSection": "A09",
                                "stoneClarity": "SI",
                                "h": null,
                                "smallN": null,
                                "white": null,
                                "dAndE": null,
                                "fAndG": null,
                                "iAndJ": null,
                                "kAndL": null,
                                "mAndN": null
                            },
                            {
                                "id": 5,
                                "normalStonePriceId": null,
                                "stonePriceNo": "",
                                "stoneSectionName": "50分（0.50-0.599ct）",
                                "stoneSection": "A09",
                                "stoneClarity": "P",
                                "h": null,
                                "smallN": null,
                                "white": null,
                                "dAndE": null,
                                "fAndG": null,
                                "iAndJ": null,
                                "kAndL": null,
                                "mAndN": null
                            }
                        ]
                    },
                    {
                        "A10": [
                            {
                                "id": 1,
                                "normalStonePriceId": null,
                                "stonePriceNo": "",
                                "stoneSectionName": "60分（0.60-0.699ct）",
                                "stoneSection": "A10",
                                "stoneClarity": "IF",
                                "h": null,
                                "smallN": null,
                                "white": null,
                                "dAndE": null,
                                "fAndG": null,
                                "iAndJ": null,
                                "kAndL": null,
                                "mAndN": null
                            },
                            {
                                "id": 2,
                                "normalStonePriceId": null,
                                "stonePriceNo": "",
                                "stoneSectionName": "60分（0.60-0.699ct）",
                                "stoneSection": "A10",
                                "stoneClarity": "VVS",
                                "h": null,
                                "smallN": null,
                                "white": null,
                                "dAndE": null,
                                "fAndG": null,
                                "iAndJ": null,
                                "kAndL": null,
                                "mAndN": null
                            },
                            {
                                "id": 3,
                                "normalStonePriceId": null,
                                "stonePriceNo": "",
                                "stoneSectionName": "60分（0.60-0.699ct）",
                                "stoneSection": "A10",
                                "stoneClarity": "VS",
                                "h": null,
                                "smallN": null,
                                "white": null,
                                "dAndE": null,
                                "fAndG": null,
                                "iAndJ": null,
                                "kAndL": null,
                                "mAndN": null
                            },
                            {
                                "id": 4,
                                "normalStonePriceId": null,
                                "stonePriceNo": "",
                                "stoneSectionName": "60分（0.60-0.699ct）",
                                "stoneSection": "A10",
                                "stoneClarity": "SI",
                                "h": null,
                                "smallN": null,
                                "white": null,
                                "dAndE": null,
                                "fAndG": null,
                                "iAndJ": null,
                                "kAndL": null,
                                "mAndN": null
                            },
                            {
                                "id": 5,
                                "normalStonePriceId": null,
                                "stonePriceNo": "",
                                "stoneSectionName": "60分（0.60-0.699ct）",
                                "stoneSection": "A10",
                                "stoneClarity": "P",
                                "h": null,
                                "smallN": null,
                                "white": null,
                                "dAndE": null,
                                "fAndG": null,
                                "iAndJ": null,
                                "kAndL": null,
                                "mAndN": null
                            }
                        ]
                    },
                    {
                        "A11": [
                            {
                                "id": 1,
                                "normalStonePriceId": null,
                                "stonePriceNo": "",
                                "stoneSectionName": "70分（0.70-0.799ct）",
                                "stoneSection": "A11",
                                "stoneClarity": "IF",
                                "h": null,
                                "smallN": null,
                                "white": null,
                                "dAndE": null,
                                "fAndG": null,
                                "iAndJ": null,
                                "kAndL": null,
                                "mAndN": null
                            },
                            {
                                "id": 2,
                                "normalStonePriceId": null,
                                "stonePriceNo": "",
                                "stoneSectionName": "70分（0.70-0.799ct）",
                                "stoneSection": "A11",
                                "stoneClarity": "VVS",
                                "h": null,
                                "smallN": null,
                                "white": null,
                                "dAndE": null,
                                "fAndG": null,
                                "iAndJ": null,
                                "kAndL": null,
                                "mAndN": null
                            },
                            {
                                "id": 3,
                                "normalStonePriceId": null,
                                "stonePriceNo": "",
                                "stoneSectionName": "70分（0.70-0.799ct）",
                                "stoneSection": "A11",
                                "stoneClarity": "VS",
                                "h": null,
                                "smallN": null,
                                "white": null,
                                "dAndE": null,
                                "fAndG": null,
                                "iAndJ": null,
                                "kAndL": null,
                                "mAndN": null
                            },
                            {
                                "id": 4,
                                "normalStonePriceId": null,
                                "stonePriceNo": "",
                                "stoneSectionName": "70分（0.70-0.799ct）",
                                "stoneSection": "A11",
                                "stoneClarity": "SI",
                                "h": null,
                                "smallN": null,
                                "white": null,
                                "dAndE": null,
                                "fAndG": null,
                                "iAndJ": null,
                                "kAndL": null,
                                "mAndN": null
                            },
                            {
                                "id": 5,
                                "normalStonePriceId": null,
                                "stonePriceNo": "",
                                "stoneSectionName": "70分（0.70-0.799ct）",
                                "stoneSection": "A11",
                                "stoneClarity": "P",
                                "h": null,
                                "smallN": null,
                                "white": null,
                                "dAndE": null,
                                "fAndG": null,
                                "iAndJ": null,
                                "kAndL": null,
                                "mAndN": null
                            }
                        ]
                    },
                    {
                        "A12": [
                            {
                                "id": 1,
                                "normalStonePriceId": null,
                                "stonePriceNo": "",
                                "stoneSectionName": "80分（0.80-0.899ct）",
                                "stoneSection": "A12",
                                "stoneClarity": "IF",
                                "h": null,
                                "smallN": null,
                                "white": null,
                                "dAndE": null,
                                "fAndG": null,
                                "iAndJ": null,
                                "kAndL": null,
                                "mAndN": null
                            },
                            {
                                "id": 2,
                                "normalStonePriceId": null,
                                "stonePriceNo": "",
                                "stoneSectionName": "80分（0.80-0.899ct）",
                                "stoneSection": "A12",
                                "stoneClarity": "VVS",
                                "h": null,
                                "smallN": null,
                                "white": null,
                                "dAndE": null,
                                "fAndG": null,
                                "iAndJ": null,
                                "kAndL": null,
                                "mAndN": null
                            },
                            {
                                "id": 3,
                                "normalStonePriceId": null,
                                "stonePriceNo": "",
                                "stoneSectionName": "80分（0.80-0.899ct）",
                                "stoneSection": "A12",
                                "stoneClarity": "VS",
                                "h": null,
                                "smallN": null,
                                "white": null,
                                "dAndE": null,
                                "fAndG": null,
                                "iAndJ": null,
                                "kAndL": null,
                                "mAndN": null
                            },
                            {
                                "id": 4,
                                "normalStonePriceId": null,
                                "stonePriceNo": "",
                                "stoneSectionName": "80分（0.80-0.899ct）",
                                "stoneSection": "A12",
                                "stoneClarity": "SI",
                                "h": null,
                                "smallN": null,
                                "white": null,
                                "dAndE": null,
                                "fAndG": null,
                                "iAndJ": null,
                                "kAndL": null,
                                "mAndN": null
                            },
                            {
                                "id": 5,
                                "normalStonePriceId": null,
                                "stonePriceNo": "",
                                "stoneSectionName": "80分（0.80-0.899ct）",
                                "stoneSection": "A12",
                                "stoneClarity": "P",
                                "h": null,
                                "smallN": null,
                                "white": null,
                                "dAndE": null,
                                "fAndG": null,
                                "iAndJ": null,
                                "kAndL": null,
                                "mAndN": null
                            }
                        ]
                    },
                    {
                        "A13": [
                            {
                                "id": 1,
                                "normalStonePriceId": null,
                                "stonePriceNo": "",
                                "stoneSectionName": "90分（0.90-0.999ct）",
                                "stoneSection": "A13",
                                "stoneClarity": "IF",
                                "h": null,
                                "smallN": null,
                                "white": null,
                                "dAndE": null,
                                "fAndG": null,
                                "iAndJ": null,
                                "kAndL": null,
                                "mAndN": null
                            },
                            {
                                "id": 2,
                                "normalStonePriceId": null,
                                "stonePriceNo": "",
                                "stoneSectionName": "90分（0.90-0.999ct）",
                                "stoneSection": "A13",
                                "stoneClarity": "VVS",
                                "h": null,
                                "smallN": null,
                                "white": null,
                                "dAndE": null,
                                "fAndG": null,
                                "iAndJ": null,
                                "kAndL": null,
                                "mAndN": null
                            },
                            {
                                "id": 3,
                                "normalStonePriceId": null,
                                "stonePriceNo": "",
                                "stoneSectionName": "90分（0.90-0.999ct）",
                                "stoneSection": "A13",
                                "stoneClarity": "VS",
                                "h": null,
                                "smallN": null,
                                "white": null,
                                "dAndE": null,
                                "fAndG": null,
                                "iAndJ": null,
                                "kAndL": null,
                                "mAndN": null
                            },
                            {
                                "id": 4,
                                "normalStonePriceId": null,
                                "stonePriceNo": "",
                                "stoneSectionName": "90分（0.90-0.999ct）",
                                "stoneSection": "A13",
                                "stoneClarity": "SI",
                                "h": null,
                                "smallN": null,
                                "white": null,
                                "dAndE": null,
                                "fAndG": null,
                                "iAndJ": null,
                                "kAndL": null,
                                "mAndN": null
                            },
                            {
                                "id": 5,
                                "normalStonePriceId": null,
                                "stonePriceNo": "",
                                "stoneSectionName": "90分（0.90-0.999ct）",
                                "stoneSection": "A13",
                                "stoneClarity": "P",
                                "h": null,
                                "smallN": null,
                                "white": null,
                                "dAndE": null,
                                "fAndG": null,
                                "iAndJ": null,
                                "kAndL": null,
                                "mAndN": null
                            }
                        ]
                    },
                    {
                        "A14": [
                            {
                                "id": 1,
                                "normalStonePriceId": null,
                                "stonePriceNo": "",
                                "stoneSectionName": "1ct（1.00-1.499ct）",
                                "stoneSection": "A14",
                                "stoneClarity": "IF",
                                "h": null,
                                "smallN": null,
                                "white": null,
                                "dAndE": null,
                                "fAndG": null,
                                "iAndJ": null,
                                "kAndL": null,
                                "mAndN": null
                            },
                            {
                                "id": 2,
                                "normalStonePriceId": null,
                                "stonePriceNo": "",
                                "stoneSectionName": "1ct（1.00-1.499ct）",
                                "stoneSection": "A14",
                                "stoneClarity": "VVS",
                                "h": null,
                                "smallN": null,
                                "white": null,
                                "dAndE": null,
                                "fAndG": null,
                                "iAndJ": null,
                                "kAndL": null,
                                "mAndN": null
                            },
                            {
                                "id": 3,
                                "normalStonePriceId": null,
                                "stonePriceNo": "",
                                "stoneSectionName": "1ct（1.00-1.499ct）",
                                "stoneSection": "A14",
                                "stoneClarity": "VS",
                                "h": null,
                                "smallN": null,
                                "white": null,
                                "dAndE": null,
                                "fAndG": null,
                                "iAndJ": null,
                                "kAndL": null,
                                "mAndN": null
                            },
                            {
                                "id": 4,
                                "normalStonePriceId": null,
                                "stonePriceNo": "",
                                "stoneSectionName": "1ct（1.00-1.499ct）",
                                "stoneSection": "A14",
                                "stoneClarity": "SI",
                                "h": null,
                                "smallN": null,
                                "white": null,
                                "dAndE": null,
                                "fAndG": null,
                                "iAndJ": null,
                                "kAndL": null,
                                "mAndN": null
                            },
                            {
                                "id": 5,
                                "normalStonePriceId": null,
                                "stonePriceNo": "",
                                "stoneSectionName": "1ct（1.00-1.499ct）",
                                "stoneSection": "A14",
                                "stoneClarity": "P",
                                "h": null,
                                "smallN": null,
                                "white": null,
                                "dAndE": null,
                                "fAndG": null,
                                "iAndJ": null,
                                "kAndL": null,
                                "mAndN": null
                            }
                        ]
                    },
                    {
                        "A15": [
                            {
                                "id": 1,
                                "normalStonePriceId": null,
                                "stonePriceNo": "",
                                "stoneSectionName": "1.5ct（1.50-1.999ct）",
                                "stoneSection": "A15",
                                "stoneClarity": "IF",
                                "h": null,
                                "smallN": null,
                                "white": null,
                                "dAndE": null,
                                "fAndG": null,
                                "iAndJ": null,
                                "kAndL": null,
                                "mAndN": null
                            },
                            {
                                "id": 2,
                                "normalStonePriceId": null,
                                "stonePriceNo": "",
                                "stoneSectionName": "1.5ct（1.50-1.999ct）",
                                "stoneSection": "A15",
                                "stoneClarity": "VVS",
                                "h": null,
                                "smallN": null,
                                "white": null,
                                "dAndE": null,
                                "fAndG": null,
                                "iAndJ": null,
                                "kAndL": null,
                                "mAndN": null
                            },
                            {
                                "id": 3,
                                "normalStonePriceId": null,
                                "stonePriceNo": "",
                                "stoneSectionName": "1.5ct（1.50-1.999ct）",
                                "stoneSection": "A15",
                                "stoneClarity": "VS",
                                "h": null,
                                "smallN": null,
                                "white": null,
                                "dAndE": null,
                                "fAndG": null,
                                "iAndJ": null,
                                "kAndL": null,
                                "mAndN": null
                            },
                            {
                                "id": 4,
                                "normalStonePriceId": null,
                                "stonePriceNo": "",
                                "stoneSectionName": "1.5ct（1.50-1.999ct）",
                                "stoneSection": "A15",
                                "stoneClarity": "SI",
                                "h": null,
                                "smallN": null,
                                "white": null,
                                "dAndE": null,
                                "fAndG": null,
                                "iAndJ": null,
                                "kAndL": null,
                                "mAndN": null
                            },
                            {
                                "id": 5,
                                "normalStonePriceId": null,
                                "stonePriceNo": "",
                                "stoneSectionName": "1.5ct（1.50-1.999ct）",
                                "stoneSection": "A15",
                                "stoneClarity": "P",
                                "h": null,
                                "smallN": null,
                                "white": null,
                                "dAndE": null,
                                "fAndG": null,
                                "iAndJ": null,
                                "kAndL": null,
                                "mAndN": null
                            }
                        ]
                    },
                    {
                        "A16": [
                            {
                                "id": 1,
                                "normalStonePriceId": null,
                                "stonePriceNo": "",
                                "stoneSectionName": "2ct（2.00-2.999ct）",
                                "stoneSection": "A16",
                                "stoneClarity": "IF",
                                "h": null,
                                "smallN": null,
                                "white": null,
                                "dAndE": null,
                                "fAndG": null,
                                "iAndJ": null,
                                "kAndL": null,
                                "mAndN": null
                            },
                            {
                                "id": 2,
                                "normalStonePriceId": null,
                                "stonePriceNo": "",
                                "stoneSectionName": "2ct（2.00-2.999ct）",
                                "stoneSection": "A16",
                                "stoneClarity": "VVS",
                                "h": null,
                                "smallN": null,
                                "white": null,
                                "dAndE": null,
                                "fAndG": null,
                                "iAndJ": null,
                                "kAndL": null,
                                "mAndN": null
                            },
                            {
                                "id": 3,
                                "normalStonePriceId": null,
                                "stonePriceNo": "",
                                "stoneSectionName": "2ct（2.00-2.999ct）",
                                "stoneSection": "A16",
                                "stoneClarity": "VS",
                                "h": null,
                                "smallN": null,
                                "white": null,
                                "dAndE": null,
                                "fAndG": null,
                                "iAndJ": null,
                                "kAndL": null,
                                "mAndN": null
                            },
                            {
                                "id": 4,
                                "normalStonePriceId": null,
                                "stonePriceNo": "",
                                "stoneSectionName": "2ct（2.00-2.999ct）",
                                "stoneSection": "A16",
                                "stoneClarity": "SI",
                                "h": null,
                                "smallN": null,
                                "white": null,
                                "dAndE": null,
                                "fAndG": null,
                                "iAndJ": null,
                                "kAndL": null,
                                "mAndN": null
                            },
                            {
                                "id": 5,
                                "normalStonePriceId": null,
                                "stonePriceNo": "",
                                "stoneSectionName": "2ct（2.00-2.999ct）",
                                "stoneSection": "A16",
                                "stoneClarity": "P",
                                "h": null,
                                "smallN": null,
                                "white": null,
                                "dAndE": null,
                                "fAndG": null,
                                "iAndJ": null,
                                "kAndL": null,
                                "mAndN": null
                            }
                        ]
                    },
                ]
            }
        }
    },
    methods: {
        //检测数字不能为负数
        clearNum(item, type, floor) {
            return htInputNumber(item, type, floor)
        },
        //引入
        importExcel() {
            this.showUpload = !this.showUpload;
        },
        //确认方法
        modalOk() {
            this.addBody.stonePriceList = this.uploadDataList;
        },
        //取消方法
        modalCancel() {

        },
        handleSuccess(res, file) {//上传成功之后的方法
            if (res.code == "100100") {
                this.$Modal.success({
                    title: "提示",
                    content: "上传成功!"
                });
                console.log(res);
                this.uploadDataList = res.data;

            } else {
                this.$Modal.error({
                    title: "提示",
                    content: "上传失败!"
                });
                this.uploadDataList = this.addBody.stonePriceList;
            }
        },
        handleFormatError(file) {//上传错误回调
            this.$Modal.warning({
                title: '提示',
                content: '文件格式错误，请选择.xlsx文件'
            });
        },
        handleMaxSize(file) { //上传大小出现错误回调
            this.$Modal.warning({
                title: '提示',
                content: '文件过大，请选择小于5M文件'
            });
        },
        handleBeforeUpload() {

        },
        //引出模板
        exportTemplate() {
            let excelModelName = "石价表模板.xlsx";
            let url = contextPath + "/excle/getExcelModel?excelModelName=" + excelModelName;
            window.location.href = url;
        },
        //保存
        save() {
            let This = this;
            console.log(this.addBody);
            //数据校验
            let formPass = '';
            this.$refs.formValidate.validate((valid) => {
                if (valid) {
                    formPass = true;
                } else {
                    formPass = false;
                }
            })
            if(!formPass) return;
            // if (!($('form').valid())) {
            //     this.$Modal.warning({
            //         title: "提示",
            //         content: "请输入必填项"
            //     });
            //     return false;
            // }
            //石价表名称
            if (this.addBody.stonePriceEntity.name.length > 30) {
                this.$Modal.warning({
                    title: "提示",
                    content: "石价表名称过长,不能超过30个字符!"
                });
                return false;
            }
            if (this.addBody.stonePriceEntity.id) {
                //修改
                $.ajax({
                    type: "POST",
                    url: contextPath + "/saleStonePriceController/update",
                    contentType: 'application/json;charset=utf-8',
                    data: JSON.stringify(This.addBody),
                    dataType: "json",
                    success: function (data) {
                        if (data.code === "100100") {
                            This.$Modal.success({
                                title: "提示",
                                content: "保存成功!"
                            });
                        } else {
                            This.$Modal.error({
                                title: "提示",
                                content: "保存失败!"
                            });
                        }
                    },
                    error: function (err) {
                        This.$Modal.error({
                            title: "提示",
                            content: "服务器出错!"
                        });
                    }
                })
            } else {
                //新增
                $.ajax({
                    type: "POST",
                    url: contextPath + "/saleStonePriceController/save",
                    contentType: 'application/json;charset=utf-8',
                    data: JSON.stringify(This.addBody),
                    dataType: "json",
                    success: function (data) {
                        if (data.code === "100100") {
                            This.$Modal.success({
                                title: "提示",
                                content: "保存成功!"
                            });
                            This.addBody.stonePriceEntity.id = data.data;
                        } else {
                            This.$Modal.error({
                                title: "提示",
                                content: "保存失败!"
                            });
                        }
                    },
                    error: function (err) {
                        This.$Modal.error({
                            title: "提示",
                            content: "服务器出错!"
                        });
                    }
                })
            }
        },
        //跳转列表
        toForm() {
            window.parent.activeEvent({
                name: '普通销售石价表',
                url: contextPath + '/sale/sale-price/sale-price-list.html',
                params: ''
            });
        },
        //获取自动生成编码
        getFieldCode() {
            let This = this;
            $.ajax({
                type: "POST",
                url: contextPath + "/saleStonePriceController/getFieldCode",
                contentType: 'application/json',
                dataType: "json",
                success: function (data) {
                    console.log(data.data);
                    if (data.code === "100100") {
                        This.addBody.stonePriceEntity.stonePriceNo = data.data;
                    }
                },
                error: function (err) {
                    This.$Modal.error({
                        title: "提示",
                        content: "服务器出错!"
                    });
                }
            })
        },
        //获取并设置当前组织
        getOrganization() {
            let This = this;
            $.ajax({
                type: "POST",
                async: false,
                url: contextPath + "/saleBillController/getOrganization",
                contentType: 'application/json',
                dataType: "json",
                success: function (data) {
                    if (data.code === "100100") {
                        This.organ = data.data;
                        console.log(This.organ)
                    } else {
                        This.$Modal.error({
                            title: "提示",
                            content: "获取组织信息异常,请联系管理员!"
                        });
                    }
                },
                error: function (err) {
                    This.$Modal.error({
                        title: "提示",
                        content: "服务器出错!"
                    });
                }
            });
        },
        //获取石价表信息
        getStonePriceInfo(id) {
            let This = this;
            $.ajax({
                type: "POST",
                url: contextPath + "/saleStonePriceController/getStonePriceInfo",
                contentType: 'application/json',
                data: JSON.stringify({ "id": id }),
                dataType: "json",
                success: function (data) {
                    console.log(data.data);
                    if (data.data !== null) {
                        //初始化页面
                        This.initData(data.data);
                    } else {
                        This.$Modal.error({
                            title: "提示",
                            content: "系统繁忙,请稍后再试!"
                        });
                    }
                },
                error: function (err) {
                    This.$Modal.error({
                        title: "提示",
                        content: "服务器出错!"
                    });
                }
            })
        },
        //初始化页面
        initData(data) {
            this.addBody.stonePriceEntity = data.stonePriceEntity;
            /*if(data.stonePriceEntity.organizationId === window.parent.userInfo.organId){
                this.addBody.stonePriceEntity.organizationId = window.parent.userInfo.organId;
                this.addBody.stonePriceEntity.organizationName = window.parent.userInfo.orgName;
            }*/
            //设置当前组织
            this.addBody.stonePriceEntity.organizationName = this.organ.currentOrganization.orgName;
            this.addBody.stonePriceEntity.organizationId = this.organ.userCurrentOrganId;
            console.log(data.stonePriceList);
            this.addBody.stonePriceList[0]['A01'] = data.stonePriceList[2]['A01'];
            this.addBody.stonePriceList[1]['A02'] = data.stonePriceList[4]['A02'];
            this.addBody.stonePriceList[2]['A03'] = data.stonePriceList[6]['A03'];
            this.addBody.stonePriceList[3]['A04'] = data.stonePriceList[8]['A04'];
            this.addBody.stonePriceList[4]['A05'] = data.stonePriceList[10]['A05'];
            this.addBody.stonePriceList[5]['A06'] = data.stonePriceList[12]['A06'];
            this.addBody.stonePriceList[6]['A07'] = data.stonePriceList[13]['A07'];
            this.addBody.stonePriceList[7]['A08'] = data.stonePriceList[14]['A08'];
            this.addBody.stonePriceList[8]['A09'] = data.stonePriceList[15]['A09'];
            this.addBody.stonePriceList[9]['A10'] = data.stonePriceList[0]['A10'];
            this.addBody.stonePriceList[10]['A11'] = data.stonePriceList[1]['A11'];
            this.addBody.stonePriceList[11]['A12'] = data.stonePriceList[3]['A12'];
            this.addBody.stonePriceList[12]['A13'] = data.stonePriceList[5]['A13'];
            this.addBody.stonePriceList[13]['A14'] = data.stonePriceList[7]['A14'];
            this.addBody.stonePriceList[14]['A15'] = data.stonePriceList[9]['A15'];
            this.addBody.stonePriceList[15]['A16'] = data.stonePriceList[11]['A16'];
        },
        //退出
        cancel() {
            window.parent.closeCurrentTab({ name: this.openName, exit: true, openTime: this.openTime })
        },
    },
    created() {

    },
    mounted: function () {
        //获取组织
        this.getOrganization();
        this.openTime = window.parent.params.openTime;
        this.openName = window.parent.params.openName;
        let params = window.parent.params.params;
        //判断新增还是修改
        if (params.id != undefined) {
            //获取石价表信息
            this.getStonePriceInfo(params.id);
        } else {
            //获取自动生成编码
            this.getFieldCode();
            //设置当前组织
            this.addBody.stonePriceEntity.organizationName = this.organ.currentOrganization.orgName;
            this.addBody.stonePriceEntity.organizationId = this.organ.userCurrentOrganId;
            //创建日期设置
            this.addBody.stonePriceEntity.createTime = new Date().format("yyyy-MM-dd HH:mm:ss");
            this.timeIsDisable = false;
        }
    }
});