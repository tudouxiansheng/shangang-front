let colors = [{
    type: "linear",
    x: 0,
    x2: 1,
    y: 0,
    y2: 0,
    colorStops: [{
        offset: 0,
        color: "#023EEC",
      },
      {
        offset: 0.5,
        color: "#023EEC",
      },
      {
        offset: 0.5,
        color: "#6002EC",
      },
      {
        offset: 1,
        color: "#6002EC",
      },
    ],
  },
  {
    type: "linear",
    x: 0,
    x2: 1,
    y: 0,
    y2: 0,
    colorStops: [{
        offset: 0,
        color: "#0BA5D2",
      },
      {
        offset: 0.5,
        color: "#023EEC",
      },
      {
        offset: 0.5,
        color: "#023EEC",
      },
      {
        offset: 1,
        color: "#023EEC",
      },
    ],
  },
  {
    type: "linear",
    x: 0,
    x2: 1,
    y: 0,
    y2: 0,
    colorStops: [{
        offset: 0,
        color: "#9F67F7",
      },
      {
        offset: 0.5,
        color: "#6D15F5",
      },
      {
        offset: 0.5,
        color: "#6D15F5",
      },
      {
        offset: 1,
        color: "#6D15F5",
      },
    ],
  },
];



/*巡逻计划图 */
let partrolOption = {
  legend: {
    right: 15,
    top:0,
    data: [{
      name: "未处理"
    }, {
      name: "已处理"
    }],
    textStyle: {
      fontWeight: "bold",
      color: "#ffffff"
    },
  },
  grid: {
    left: "20px",
      top:"40px",
      right:"50px",
    bottom: "10px",
    containLabel: true,
  },
  xAxis: {
    type: "category",
    name: '日期',
    nameGap:5,
    nameLocation: 'end',
    data: [],
    axisLabel: {
      textStyle: {
        color: "#ffffff",
      },
      interval: 0
    },
    nameTextStyle: {
      color: '#ffffff'
    },
    axisLine: {
      //y轴
      lineStyle: {
        color: "#878B8E",
      },
    },
  },
  yAxis: {
    type: "value",
    boundaryGap: [0, 0.01],
    axisLine: {
      //y轴
      show: false,
    },
    name: '数量/（个）',
    splitLine: {
      show: true,
      lineStyle: {
        type: "dashed",
        color: "#ffffff",
      },
    },
    axisLabel: {
      textStyle: {
        color: "#ffffff",
      },
    },
    nameTextStyle: {
      color: '#ffffff'
    },
  },
  series: [{
      name: "未处理",
      type: "bar",
      barGap: "14%",
      barWidth: 10,
      itemStyle: {
        normal: {
          color: colors[1],
          barBorderRadius: 0,
        },
      },

      data: [],
    },
    {
      name: "已处理",
      type: "bar",
      barGap: "14%",
      barWidth: 10,
      itemStyle: {
        normal: {
          color: colors[2],
          barBorderRadius: 0,
        },
      },
      data: [],
    },
  ],
};
let alarmOption = {
    tooltip: {
        trigger: "axis",
        axisPointer: {
            type: "shadow",
            textStyle: {
                color: "#fff"
            }

        },
    },
    legend: {
        itemWidth:18,
        itemHeight:10,
        right: '33%',
        top:30,
        data: [{
            name: "未处理"
        }, {
            name: "已处理"
        }],
        textStyle: {
            color: "#ffffff",
            fontSize:10
        },
    },
    grid: {
        left: "15px",
        top:"60",
        right:"15px",
        bottom: "10",
        containLabel: true,
    },
    xAxis: {
        // show:false,
        type: "category",
        nameGap:5,
        nameLocation: 'center',
        data: [],
        axisLabel: {
            textStyle: {
                color: "#ffffff",
                fontSize:11,
            },
            interval: 0
        },
        nameTextStyle: {
            color: '#ffffff'
        },
        axisLine: {
            //y轴
            lineStyle: {
                color: "#fff",
            },
        },
    },
    yAxis: {
        type: "value",
        // boundaryGap: [0, 0.01],
        axisLine: {
            //y轴
            show: false,
        },
        axisTick:{
            show:false,
            lineStyle:{
                color:'#ccc',
                fontSize:11,
            }
        },
        name: '数量/（个）',
        splitLine: {
            show: true,
            lineStyle: {
                type: "dashed",
                color: "#ffffff",
            },
        },
        axisLabel: {
            textStyle: {
                color: "#ffffff",
                fontSize:10,
            },
        },
        nameTextStyle: {
            color: '#ffffff',
            fontSize:10,
        },
    },
    series: [{
        name: "未处理",
        type: "bar",
        barGap: "14%",
        barWidth: 10,
        itemStyle: {
            normal: {
                color: colors[1],
                barBorderRadius: 0,
            },
        },

        data: [],
    },
        {
            name: "已处理",
            type: "bar",
            barGap: "14%",
            barWidth: 10,
            itemStyle: {
                normal: {
                    color: colors[2],
                    barBorderRadius: 0,
                },
            },
            data: [],
        },
    ],
};
let saveOption = {
  color: ["#9913FF"],
  radar: {
    name: {
      textStyle: {
        color: "#fff",
        fontSize: 14,
      },
    },
    indicator: [],
    center: ["50%", "50%"],
    splitArea: {
      // 坐标轴在 grid 区域中的分隔区域，默认不显示。
      show: true,
      areaStyle: {
        // 分隔区域的样式设置。
        color: ["rgba(255,255,255,0)", "rgba(255,255,255,0)"], // 分隔区域颜色。分隔区域会按数组中颜色的顺序依次循环设置颜色。默认是一个深浅的间隔色。
      },
    },
    axisLine: {
      //指向外圈文本的分隔线样式
      lineStyle: {
        color: "#5278A9",
      },
    },
    splitLine: {
      lineStyle: {
        color: "#5278A9", // 分隔线颜色
        width: 1, // 分隔线线宽
      },
    },
  },

  series: [{
    name: "安全态势值",
    type: "radar",
    data: [{
      value: [],
      name: "安全态势值",
    }, ],
    itemStyle: {
      normal: {
        lineStyle: {
          color: "#9913FF",
        },
        shadowColor: "#9913FF",
        shadowBlur: 10,
      },
    },
    areaStyle: {
      normal: {
        // 单项区域填充样式
        color: {
          type: "linear",
          x: 0, //右
          y: 0, //下
          x2: 1, //左
          y2: 1, //上
          colorStops: [{
              offset: 0,
              color: "#9913FF",
            },
            {
              offset: 0.5,
              color: "rgba(0,0,0,0)",
            },
            {
              offset: 1,
              color: "#9913FF",
            },
          ],
          globalCoord: false,
        },
        opacity: 1, // 区域透明度
      },
    },
  }, ],
};

let visitorOption = {
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow",
    },
  },

  color: ["#9D1EFF"],
  grid: {
    top: "10%",
    left: "2%",
    right: "4%",
    bottom: "10%",
    containLabel: true,
  },
  xAxis: {
    type: "category",
    data: ["7/16", "7/17", "7/18", "7/19", "7/20", "7/21", "7/22"],
    axisLabel: {
      textStyle: {
        color: "#ffffff",
      },
    },
    name: '日期',
    axisLine: {
      //y轴
      lineStyle: {
        color: "#878B8E",
      },
    },
  },
  yAxis: {
    type: "value",
    scale: true,
    max: 200,
    min: 0,
    splitNumber: 5,
    boundaryGap: [0.2, 0.2],
    axisLine: {
      //y轴
      show: false,
    },
    splitLine: {
      show: true,
      lineStyle: {
        type: "dashed",
        color: "#B2B2B2",
      },
    },
    axisLabel: {
      textStyle: {
        color: "#ffffff",
      },
      formatter: '{value}人'
    },
    formatter: '{value}人'
  },
  series: [{
    name: "统计人数",
    type: "line",
    smooth: true,
    data: [195, 238, 310, 121, 134, 117, 300],
  }, ],
}

let traffic = {
    backgroundColor: "#1A1835",

    tooltip: {
        trigger: "axis",
        axisPointer: {
            type: "shadow",
            textStyle: {
                color: "#fff"
            }

        },
    },
    grid: {
        borderWidth: 0,
        top: 20,
        bottom: 40,
        textStyle: {
            color: "#fff"
        }
    },
    legend: {
        x: '46%',
        top: '11%',
        textStyle: {
            color: '#90979c',
        },
        data: ['人员', '车辆']
    },


    calculable: true,
    xAxis: [{
        type: "category",
        axisLine: {
            lineStyle: {
                color: "rgba(204,187,225,0.5)",
            }
        },
        splitLine: {
            show: false
        },
        axisTick: {
            show: false
        },
        data: [],
    }],

    yAxis: [{
        type: "value",
        splitLine: {
            show: false
        },
        axisLine: {
            lineStyle: {
                color: "rgba(204,187,225,0.5)",
            }
        },

    }],
    dataZoom: [{
        show: true,
        height: 10,
        xAxisIndex: [0],
        bottom: 10,

        "start": 10,
        "end": 80,
        handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
        handleSize: '110%',
        handleStyle: {
            color: "#5B3AAE",
        },
        textStyle:{
            color:"rgba(204,187,225,0.5)",
        },
        fillerColor:"rgba(67,55,160,0.4)",
        borderColor: "rgba(204,187,225,0.5)",

    }, {
        type: "inside",
        show: true,
        height: 15,
        start: 1,
        end: 35
    }],
    series: [{
        name: "访问量",
        type: "line",
        symbolSize: 10,
        symbol: 'circle',
        itemStyle: {
            color: "#6f7de3",
        },
        markPoint: {
            label: {
                normal: {
                    textStyle: {
                        color: '#fff'
                    }
                }
            },
            data: [{
                type: 'max',
                name: '最大值',

            }, {
                type: 'min',
                name: '最小值'
            }]
        },
        data: [
            509, 917, 2455, 2610, 2719, 3033, 3044, 3085, 2708, 2809, 2117,2000,1455,1210,719,
            733,944,2285,2208,3372,3936,3693,2962,2810,3519,2455,2610,2719,2484,2078
        ],
    }, {
        name: "订单量",
        type: "line",
        symbolSize: 10,
        symbol: 'circle',
        itemStyle: {
            color: "#c257F6",
        },
        markPoint: {
            label: {
                normal: {
                    textStyle: {
                        color: '#fff'
                    }
                }
            },
            data: [{
                type: 'max',
                name: '最大值',

            }, {
                type: 'min',
                name: '最小值'
            }]
        },
        data: [
            2136,3693,2962,3810,3519,3484,3915,3823,3455,4310,4019,3433,3544,3885,4208,3372,
            3484,3915,3748,3675,4009,4433,3544,3285,4208,3372,3484,3915,3823,4265,4298
        ]
    }, ]
}
export {
  colors,
  partrolOption,
    alarmOption,
  saveOption,
  visitorOption,
    traffic
}
