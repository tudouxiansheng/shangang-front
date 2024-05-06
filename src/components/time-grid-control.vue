<template>
  <!-- 网格时间选择控件 -->
  <div class="time-grid-control"></div>
</template>

<script>
/**
 * 页面引入该组件：
 * 标签：
 *   <time-grid-control ref="timeGridControl" id="time_grid_control"></time-grid-control>
 * 注：详情页引入标签id不同，写成time_grid_control1；添加修改引入为time_grid_control
 * script引入：
 *   const timeGridControl = () => import("@/components/time-grid-control.vue");
 *   components: {
 *     "time-grid-control": timeGridControl
 *   },
 * 引用方法使用：
 *   this.$refs.timeGridControl
 */
import i18n from '@/i18n/'
import '@/style/time-grid-control.scss'

var planType = 0 //周计划：0；日计划：1
var operation = 0 //添加：0；修改：2；详情：1

var box_id
var StartIndex = null
var EndIndex = null
var Selected = 'Selected'
var Start_x = null
var Start_y = null
//点击中表格的小时值
var hour
//点击选中的星期值
// var week
//1为这个格子在此次鼠标拖拽过程中被选中（不执行选中方法），0为没选中过
var td_state = 0
//生成星期数组
// var num = ['一', '二', '三', '四', '五', '六', '日']
//生成时间值数组
var arr_hour = get_hour_arr()

// 初始化时间
function time_switch(planType, timeSpanList) {
  var initIndex = '000000000000000000000000000000000000000000000000'
  var index,
    index0 = initIndex,
    index1 = initIndex,
    index2 = initIndex,
    index3 = initIndex,
    index4 = initIndex,
    index5 = initIndex,
    index6 = initIndex,
    index7 = initIndex
  // 初始时间
  for (let i = 0; i < timeSpanList.length; i++) {
    let item = timeSpanList[i]
    switch (item.dayType) {
      case 0:
        index0 = convert_binary([item.startTime, item.stopTime], index0)
        break
      case 1:
        index1 = convert_binary([item.startTime, item.stopTime], index1)
        break
      case 2:
        index2 = convert_binary([item.startTime, item.stopTime], index2)
        break
      case 3:
        index3 = convert_binary([item.startTime, item.stopTime], index3)
        break
      case 4:
        index4 = convert_binary([item.startTime, item.stopTime], index4)
        break
      case 5:
        index5 = convert_binary([item.startTime, item.stopTime], index5)
        break
      case 6:
        index6 = convert_binary([item.startTime, item.stopTime], index6)
        break
      default:
        index7 = convert_binary([item.startTime, item.stopTime], index7)
    }
  }
  if (planType == 0) {
    index = index1 + index2 + index3 + index4 + index5 + index6 + index7
  } else {
    index = index0
  }
  $('.default_time_val').val(index)
}
//按下鼠标左键拖动选中单元格
function SelectTD(StartIndex, EndIndex, Selected) {
  var MinX = null
  var MaxX = null
  var MinY = null
  var MaxY = null

  var coordinate = get_coordinate(StartIndex, EndIndex)

  MinX = coordinate[0]
  MaxX = coordinate[1]
  MinY = coordinate[2]
  MaxY = coordinate[3]

  for (let i = MinY; i <= MaxY; i++) {
    for (let j = MinX; j <= MaxX; j++) {
      var SelectTR = $('#' + box_id + ' table tbody tr ').eq(i)
      var td_class = $('td', SelectTR).eq(j).attr('class')
      td_state = $('td', SelectTR).eq(j).attr('td_state')

      //在同一次鼠标按下的过程中，选中过的表格不进行选中或取消操作
      if (!td_state) {
        if (td_class == Selected) {
          $('td', SelectTR).eq(j).removeClass(Selected)
        } else {
          //筛选掉标明为星期的表格
          $('td', SelectTR).eq(j).attr('class', Selected)
        }
        $('td', SelectTR).eq(j).attr('td_state', '1')
      }
    }
  }
  //改变二进制值
  get_time_val()
  //改变日期显示
  convert_date()
}

//点击选中或去掉选中整行、整列
function SelectTD_click(StartIndex, EndIndex, Selected) {
  var MinX = null
  var MaxX = null
  var MinY = null
  var MaxY = null
  var Selected_true = 0
  var Selected_false = 0

  var coordinate = get_coordinate(StartIndex, EndIndex)
  MinX = coordinate[0]
  MaxX = coordinate[1]
  MinY = coordinate[2]
  MaxY = coordinate[3]
  var SelectTR, td_class
  //列出此列当中的表格选中状态
  for (let i = MinY; i <= MaxY; i++) {
    for (let j = MinX; j <= MaxX; j++) {
      SelectTR = $('#' + box_id + ' table tbody tr ').eq(i)
      td_class = $('td', SelectTR).eq(j).attr('class')

      if (td_class == Selected) {
        //表格里存在已选中的元素
        Selected_true = 1
      } else {
        //表格里存在未选中的元素
        Selected_false = 1
      }
    }
  }

  //执行选中或去掉选中方法
  for (let i = MinY; i <= MaxY; i++) {
    for (let j = MinX; j <= MaxX; j++) {
      SelectTR = $('#' + box_id + ' table tbody tr ').eq(i)
      td_class = $('td', SelectTR).eq(j).attr('class')

      //一列当中存在已选中与未选中的表格处理:整列全部选中
      if (Selected_true == 1 && Selected_false == 1) {
        $('td', SelectTR).eq(j).attr('class', Selected)
      } else if (Selected_false == 1) {
        //一列当中只存在未选中的表格处理:整列全部选中
        $('td', SelectTR).eq(j).attr('class', Selected)
      } else {
        //一列当中只存在已选中的表格处理:整列全部去掉选中
        $('td', SelectTR).eq(j).removeClass(Selected)
      }
    }
  }

  //改变二进制值
  get_time_val()
  //改变日期显示
  convert_date()
}

//获取选中范围的开始与结束的坐标
function get_coordinate(StartIndex, EndIndex) {
  var MinX = null
  var MaxX = null
  var MinY = null
  var MaxY = null

  if (StartIndex.x < EndIndex.x) {
    MinX = StartIndex.x
    MaxX = EndIndex.x
  } else {
    MinX = EndIndex.x
    MaxX = StartIndex.x
  }
  if (StartIndex.y < EndIndex.y) {
    MinY = StartIndex.y
    MaxY = EndIndex.y
  } else {
    MinY = EndIndex.y
    MaxY = StartIndex.y
  }
  return [MinX, MaxX, MinY, MaxY]
}

//改变二进制值
function get_time_val() {
  var time_type = ''
  $('#' + box_id + ' table tbody')
    .find('td')
    .each(function () {
      var Selected_type = $(this).attr('class')
      var week = $(this).attr('week')

      if (Selected_type == Selected && !week) {
        time_type += '1'
      } else if (!week) {
        time_type += '0'
      }
    })
  $('#' + box_id + '_time_num').val(time_type)
  // convert_date();
}

// 日期转换二进制数 dateRange[startTime,endTime]
function convert_binary(dateRange, default_time_val) {
  // 截取时分
  dateRange[0] = dateRange[0].substring(0, dateRange[0].length - 3)
  dateRange[1] = dateRange[1].substring(0, dateRange[1].length - 3)
  // 算出开始时间的定位
  var startIndex, startHour, startMin
  startHour = dateRange[0].substring(0, dateRange[0].length - 3)
  startMin = dateRange[0].substring(3, dateRange[0].length)

  startIndex = parseInt(startHour) * 2 + parseInt(startMin) / 30 + 1
  var endIndex, endHour, endMin
  endHour = dateRange[1].substring(0, dateRange[1].length - 3)
  endMin = dateRange[1].substring(3, dateRange[1].length)
  endIndex = parseInt(endHour) * 2 + parseInt(endMin) / 30
  if (endMin == '59') {
    endIndex++
  }
  var replacetext = ''
  for (let i = startIndex; i <= endIndex; i++) {
    replacetext += '1'
  }

  default_time_val = replacePos(default_time_val, startIndex, replacetext)

  return default_time_val
}

// 目的: 组成新字符串
// 参数1: 源字符串
// 参数2: 起始位置
// 参数3: 目标字符串
// 返回值: 新字符串
function replacePos(strObj, pos, replacetext) {
  //var str = strObj.substr(0,pos-1) + replacetext + strObj.substring(pos,strObj.length);
  // 上一行可分成
  var str = strObj.substr(0, pos - 1) // 取左边到指定位置的字符串
  str += replacetext // 与目标字符串相连
  str += strObj.substring(pos + replacetext.length - 1, strObj.length) // 取指定位置到右边的字符串
  // 现在可以知道这三行的意思为: 在指定位置添加目标字符串
  return str // 返回新的字符串
}

//二进制数转换日期
function convert_date(external_binary) {
  //初始化周数数组
  var time_week_arr = []
  var binary
  if (!external_binary) {
    //内部调用，进行选中表格和输出时间操作。
    binary = $('#' + box_id + '_time_num').val()
  } else {
    //存在外部参入传入，此函数进行返回时间操作。
    var date_html = ''
    binary = external_binary
  }
  for (let y = 0; y < 7; y++) {
    //初始化小时数组
    var time_hour_arr = []
    var index
    for (let x = 0; x < 48; x++) {
      //获取当前点击元素的位置
      if (y == 0) {
        index = x
      } else {
        index = y * 48 + x
      }
      if (!binary) return
      //获取td对应的二进制值
      var Selected_val = binary.charAt(index)
      if (Selected_val == 1) {
        //组装保存进数组里
        if (time_hour_arr == []) {
          //表格的第一个位置的值
          time_hour_arr = arr_hour[x]
        } else if (binary.charAt(index - 1) == 1 && binary.charAt(index - 2) == 1) {
          //此位置（包含上一行）的前两个都为选中时

          if (x == 0 && binary.charAt(index + 1) == 0) {
            //选中行里第一个，后一个表格没选中，加逗号
            time_hour_arr[time_hour_arr.length] = arr_hour[x] + ', '
          } else if (x == 0 && binary.charAt(index + 1) == 1) {
            //选中行里第一个，后一个表格已选中，不加逗号
            time_hour_arr[time_hour_arr.length] = arr_hour[x]
          } else if (x == 1 && binary.charAt(index - 1) == 0) {
            //选中行里第二个，上一个表格没选中，加逗号
            time_hour_arr[time_hour_arr.length] = arr_hour[x] + ', '
          } else if (x == 1 && binary.charAt(index - 1) == 1) {
            //选中行里第二个，上一个表格已选中，前加-号，后加逗号
            time_hour_arr[time_hour_arr.length] = '-' + arr_hour[x + 1] + ', '
          } else {
            //选中行里除第一、二的表格以外，前一个表格已经选中，此元素前加- 后加逗号
            time_hour_arr[time_hour_arr.length - 1] = '-' + arr_hour[x + 1] + ', '
          }
        } else if (binary.charAt(index - 1) != 1 && binary.charAt(index + 1) != 1) {
          time_hour_arr[time_hour_arr.length] = arr_hour[x] + '-' + arr_hour[x + 1] + ', '
        } else if (binary.charAt(index - 1) == 1 && x > 0) {
          //选中的前一个已选中，且此次选中的不是行里第一个，此次选中的元素前加-后加逗号
          time_hour_arr[time_hour_arr.length] = '-' + arr_hour[x + 1] + ', '
        } else if (binary.charAt(index + 1) == 1 && x == 47) {
          // 选中最后一个
          time_hour_arr[time_hour_arr.length] = arr_hour[x] + '-23:59' + ', '
        } else if (binary.charAt(index + 1) == 0 && x == 0) {
          // 选中第一个
          time_hour_arr[time_hour_arr.length] = arr_hour[x] + '-0:30' + ', '
        } else {
          //选中的后一已选中，此次选中的元素不加逗号
          time_hour_arr[time_hour_arr.length] = arr_hour[x]
        }
      }
    }

    time_week_arr[y] = time_hour_arr
  }
  if (!external_binary) {
    $('#' + box_id + '_time_seled').html('')
  }

  //再次组装并输出数组
  var time_html = []
  if (planType == 0) {
    for (let y = 0; y < 7; y++) {
      for (let x = 0; x < time_week_arr[y].length; x++) {
        if (!time_html[y]) {
          time_html[y] = time_week_arr[y][x]
        } else {
          time_html[y] += time_week_arr[y][x]
        }
      }

      if (time_html[y]) {
        time_html[y] = time_html[y].substring(0, time_html[y].length - 2)
        let weekWeek = ''
        if (!external_binary) {
          if (y == 0) {
            weekWeek = i18n.t('videoRecord.monday')
          } else if (y == 1) {
            weekWeek = i18n.t('videoRecord.tuesday')
          } else if (y == 2) {
            weekWeek = i18n.t('videoRecord.wednesday')
          } else if (y == 3) {
            weekWeek = i18n.t('videoRecord.thursday')
          } else if (y == 4) {
            weekWeek = i18n.t('videoRecord.friday')
          } else if (y == 5) {
            weekWeek = i18n.t('videoRecord.saturday')
          } else if (y == 6) {
            weekWeek = i18n.t('videoRecord.sunday')
          }
          $('#' + box_id + '_time_seled').append('<div>' + weekWeek + ' (' + time_html[y] + ')' + '</div>')
        } else {
          date_html += weekWeek + ' (' + time_html[y] + ')' + ', '
        }
      }
    }
  } else {
    for (let x = 0; x < time_week_arr[0].length; x++) {
      if (!time_html[0]) {
        time_html[0] = time_week_arr[0][x]
      } else {
        time_html[0] += time_week_arr[0][x]
      }
    }

    if (time_html[0]) {
      time_html[0] = time_html[0].substring(0, time_html[0].length - 2)
      if (!external_binary) {
        // $("#" + box_id + "_time_seled").append(
        //   "<div>每日(" + time_html[0] + ")" + "</div>"
        // );
        $('#' + box_id + '_time_seled').append(
          '<div>' + i18n.t('videoRecord.everyDay') + ' (' + time_html[0] + ')' + '</div>'
        )
      } else {
        // date_html += "每日(" + time_html[0] + ")" + ", ";
        date_html += i18n.t('videoRecord.everyDay') + ' (' + time_html[0] + ')' + ', '
      }
    }
  }

  if (external_binary) {
    return date_html
  }
}

//生成时间值数组
function get_hour_arr() {
  var arr_hour = []
  var oDate = new Date('2016/07/01 00:00:00') //实例一个时间对象；
  var oDate_hour = oDate.getHours()
  var oDate_minute = oDate.getMinutes()
  for (let i = 0; i < 49; i++) {
    if (oDate_minute < 10) {
      oDate_minute = '0' + oDate_minute
    }
    if (i >= 1) {
      if (i == 48) {
        oDate.setMinutes(oDate.getMinutes() + 29)
        oDate_hour = oDate.getHours()
        oDate_minute = oDate.getMinutes()
      } else {
        oDate.setMinutes(oDate.getMinutes() + 30)
        oDate_hour = oDate.getHours()
        oDate_minute = oDate.getMinutes()
        if (oDate_minute < 10) {
          oDate_minute = '0' + oDate_minute
        }
      }
    }
    arr_hour[i] = oDate_hour + ':' + oDate_minute
  }
  return arr_hour
}

//更新操作
function renewal(id) {
  if (id) {
    box_id = id
  }
  //解绑鼠标移动监听事件
  $('#' + box_id + ' table tbody tr td').unbind('mouseover')
  //初始化表格的在此次选中状态
  $('#' + box_id + ' table tbody tr td').attr('td_state', '')
  //改变二进制值
  get_time_val()
  //改变日期显示
  convert_date()
}

//二进制数赋值选中表格
function binary_selected() {
  var default_time_val = $('.default_time_val').val()
  if (default_time_val) {
    for (let i = 0; i < 336; i++) {
      var td_selected = default_time_val.charAt(i)
      if (td_selected != 0) {
        $('#' + box_id + ' table tbody tr td')
          .eq(i)
          .attr('class', 'Selected')
        //更新操作，显示文字形日期
        renewal()
      }
    }
  }
}

//实例化程序
function load_time_table(id, type, timeSpanList) {
  $('.time-grid-control').empty()

  //包住table的元素id
  box_id = id
  var html
  html = `<input type="hidden" class="default_time_val" value />`
  html += `<div id="table_time_selected" class="table_time_selected">`
  html += `<table cellspacing="0" cellpadding="0" border="0" class="plug-timer-grid"  onselectstart="return false" onselect="document.selection.empty()">`
  html += '<thead>'
  html += '<tr>'
  html += '<th></th>'
  html += '<th colSpan="24">' + i18n.t('videoRecord.morning') + '</th>'
  html += '<th colSpan="24">' + i18n.t('videoRecord.afternoon') + '</th>'
  html += '</tr>'
  html += '<tr class="hour">'
  html += '<th></th>'
  html += '</tr>'
  html += '</thead>'
  html += '<tbody></tbody>'
  html += '</table>'
  html += '<input class="focus" style="opacity: 0;">'
  html += '<div id="' + box_id + '_time_seled"></div>'
  html +=
    '<input type="hidden" id="' +
    box_id +
    '_time_num" name="time" caption="每日投放时段" switchname="selectTime"  value="">'
  html += `</div>`
  // html += `<button type="button" class="btn clear">清除全部</button>`;
  if (operation == 1) {
    $('#time_grid_control1').append(html)
  } else {
    $('#time_grid_control').append(html)
  }

  var html_tbody_td = ''
  var html_thead_td = ''
  var week
  if (0 == type) {
    //创建表格
    for (let i = 0; i < 7; i++) {
      week = i + 1
      html_tbody_td += '<tr>'
      for (let j = 0; j < 49; j++) {
        let weekDay = ''
        if (i == 0) {
          weekDay = i18n.t('videoRecord.monday')
        } else if (i == 1) {
          weekDay = i18n.t('videoRecord.tuesday')
        } else if (i == 2) {
          weekDay = i18n.t('videoRecord.wednesday')
        } else if (i == 3) {
          weekDay = i18n.t('videoRecord.thursday')
        } else if (i == 4) {
          weekDay = i18n.t('videoRecord.friday')
        } else if (i == 5) {
          weekDay = i18n.t('videoRecord.saturday')
        } else if (i == 6) {
          weekDay = i18n.t('videoRecord.sunday')
        }
        if (j == 0) {
          html_tbody_td += '<th week="' + week + '">' + weekDay + '</th>'
        } else {
          html_tbody_td += '<td>' + '</td>'
        }
      }
      html_tbody_td += '</tr>'
    }
  } else {
    html_tbody_td += '<tr>'
    week = 1
    for (let j = 0; j < 49; j++) {
      if (j == 0) {
        // html_tbody_td += '<th week="' + week + '">每日</th>';
        html_tbody_td += '<th week="' + week + '">' + i18n.t('videoRecord.everyDay') + '</th>'
      } else {
        html_tbody_td += '<td>' + '</td>'
      }
    }
    html_tbody_td += '</tr>'
  }
  // $("#" + box_id + " table thead .hour").empty();
  // $("#" + box_id + " table thead .hour").append("<th></th>");
  //创建表格小时栏目
  for (let i = 0; i <= 23; i++) {
    html_thead_td += '<td colSpan="2" hour="' + i + '">' + i + '</td>'
  }
  $('#' + box_id + ' table thead .hour').append(html_thead_td)
  $('#' + box_id + ' table tbody').html(html_tbody_td)

  if (operation == 0) {
    var index = '000000000000000000000000000000000000000000000000'
    $('.default_time_val').val(index)
  } else {
    time_switch(planType, timeSpanList)
  }

  //检查是否有赋有二进制值，如有，将选中相应的表格
  binary_selected()

  //控制器，控制当前在哪个表格进行操作
  $('.plug-timer-grid').hover(function (e) {
    if (1 != e.which) {
      //判断是否为左击
      var id = $(this).parent().attr('id')
      box_id = id
    }
  })

  if (operation != 1) {
    //清除所有选中项
    $('.clear').click(function () {
      // $(this)
      //   .parent()
      //   .find("td")
      //   .removeClass(Selected);
      $('#table_time_selected').find('td').removeClass(Selected)
      // var id = $(this)
      //   .parent()
      //   .attr("id");
      var id = $('#table_time_selected').attr('id')

      renewal(id)
    })

    //点击小时选中或去掉整列处理块
    $('#' + box_id + ' table thead tr td').click(function () {
      hour = $(this).attr('hour')
      if (hour >= 0) {
        var rows = $('#' + box_id + ' table tbody tr').length
        Start_x = $(this).index() * 2 - 1
        Start_y = 0

        StartIndex = { x: Start_x, y: Start_y }

        var x = $(this).index() * 2 - 2
        var y = rows - 1 //为了配合for计算公式-1

        EndIndex = { x: x, y: y }
        //改变第一次按下鼠标时候的改变选中状态
        SelectTD_click(StartIndex, EndIndex, Selected)
      }
    })

    //点击星期选中或去掉整行处理块
    $('#' + box_id + ' table tbody tr th').click(function () {
      var week = $(this).attr('week')
      if (week >= 0) {
        var line = $('#' + box_id + ' table tbody tr td').length / $('#' + box_id + ' table tbody tr').length

        Start_x = 0
        Start_y = $(this).parent().index()

        StartIndex = { x: Start_x, y: Start_y }

        var y = $(this).parent().index()
        var x = line - 1 //为了配合for计算公式-1

        EndIndex = { x: x, y: y }

        //改变第一次按下鼠标时候的改变选中状态
        SelectTD_click(StartIndex, EndIndex, Selected)
      }
    })

    //监听鼠标按下事件(鼠标按下左键拖动选中处理块)
    $('#' + box_id + ' table tbody tr td')
      .unbind('mousedown')
      .bind('mousedown', function () {
        //记录刚开始点击的元素位置
        Start_x = $(this).index() - 1
        Start_y = $(this).parent().index()
        StartIndex = { x: Start_x, y: Start_y }

        var x = $(this).index() - 1
        var y = $(this).parent().index()
        EndIndex = { x: x, y: y }
        //改变第一次按下鼠标时候的改变选中状态
        SelectTD(StartIndex, EndIndex, Selected)

        StartIndex = { x: Start_x, y: Start_y }

        //监听鼠标移动事件，实现改变后续鼠标拖拽时候的表格选中状态
        $('#' + box_id + ' table tbody tr td').mouseover(function (e) {
          var x = $(this).index() - 1
          var y = $(this).parent().index()
          EndIndex = { x: x, y: y }
          if (1 != e.which) {
            //判断是否为左击
            $('#' + box_id + ' table tbody tr td').unbind('mouseover')
          }
          //去除停留在td上的光标
          $('#' + box_id + ' .focus').focus()
          SelectTD(StartIndex, EndIndex, Selected)
        })

        //放开鼠标左键时，初始化相关参数和解绑相关监听
        $('html')
          .unbind('mouseup')
          .bind('mouseup', function () {
            renewal()
          })
      })
  }
  return true
}

//解绑鼠标松开监听事件
// function unbundle_mouseover() {
//   $("html").unbind("mouseup");
// }

/*二进制获取转换后的时间*/
// function get_time_html(binary) {
//   return convert_date(binary);
// }

// 生成时间数组
var recordPlanSubInfoList = new Array()
function getRecordPlanSubInfoList() {
  recordPlanSubInfoList.splice(0, recordPlanSubInfoList.length)
  $('#table_time_selected_time_seled div').each(function () {
    var recordPlanSubStartStopStr = $(this)
      .html()
      .substring($(this).html().indexOf('(') + 1, $(this).html().indexOf(')'))

    var dayTypeStr = $(this).html().substring(0, $(this).html().indexOf('(')).trim()
    var dayType

    switch (dayTypeStr) {
      case i18n.t('videoRecord.everyDay'):
        dayType = 0
        break
      case i18n.t('videoRecord.monday'):
        dayType = 1
        break
      case i18n.t('videoRecord.tuesday'):
        dayType = 2
        break
      case i18n.t('videoRecord.wednesday'):
        dayType = 3
        break
      case i18n.t('videoRecord.thursday'):
        dayType = 4
        break
      case i18n.t('videoRecord.friday'):
        dayType = 5
        break
      case i18n.t('videoRecord.saturday'):
        dayType = 6
        break
      default:
        dayType = 7
    }
    var startStopsStr = new Array()
    if (-1 != recordPlanSubStartStopStr.indexOf(',')) {
      startStopsStr = recordPlanSubStartStopStr.split(',')
    } else {
      startStopsStr.push(recordPlanSubStartStopStr)
    }

    for (let i = 0; i < startStopsStr.length; i++) {
      var recordPlanSubInfo = {
        dayType: dayType,
        startTime: '',
        stopTime: '',
      }
      var startStopStr = new Array()
      if (-1 != startStopsStr[i].trim().indexOf('-')) {
        startStopStr = startStopsStr[i].split('-')
      } else {
        startStopStr.push(startStopsStr[i])
      }

      // 将时分塞入时间戳
      var date = new Date()
      date.setHours(startStopStr[0].trim().split(':')[0])
      date.setMinutes(startStopStr[0].trim().split(':')[1])
      date.setSeconds(0)
      recordPlanSubInfo.startTime = date.format('hh:mm:ss')
      if (startStopStr.length == 1) {
        recordPlanSubInfo.stopTime = date.format('hh:mm:ss')
      } else {
        date.setHours(startStopStr[1].trim().split(':')[0])
        date.setMinutes(startStopStr[1].trim().split(':')[1])
        if (59 == date.getMinutes()) {
          date.setSeconds(59)
        }
        recordPlanSubInfo.stopTime = date.format('hh:mm:ss')
      }

      recordPlanSubInfoList.push(recordPlanSubInfo)
    }
  })
}
// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
Date.prototype.format = function (fmt) {
  //author: meizz
  var o = {
    'M+': this.getMonth() + 1, //月份
    'd+': this.getDate(), //日
    'h+': this.getHours(), //小时
    'm+': this.getMinutes(), //分
    's+': this.getSeconds(), //秒
    'q+': Math.floor((this.getMonth() + 3) / 3), //季度
    S: this.getMilliseconds(), //毫秒
  }
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
  for (let k in o)
    if (new RegExp('(' + k + ')').test(fmt))
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
  return fmt
}

export default {
  data() {
    return {}
  },
  created() {
    // this.time_ready();
  },
  methods: {
    time_ready() {
      if (operation != 0) {
        time_switch(planType, $('input[name=dayType]'))
      } else {
        var index = '000000000000000000000000000000000000000000000000'
        $('.default_time_val').val(index)
      }
      load_time_table('table_time_selected', planType)
    },

    // 初始化控件
    time_initialize(planType1, operation1, timeSpanList) {
      // this.$nextTick(() => {
      planType = planType1
      operation = operation1
      load_time_table('table_time_selected', planType, timeSpanList)
      // });
    },

    // 选择周计划或日计划
    planTypeChange(val) {
      planType = val
      load_time_table('table_time_selected', val, $('input[name=dayType]'))
      $('td').removeClass(Selected)
      $('#table_time_selected_time_seled').empty()
    },

    // 清除全部
    clearAll() {
      $('#table_time_selected').find('td').removeClass(Selected)

      var id = $('#table_time_selected').attr('id')
      renewal(id)
    },

    // 组件关闭弹框
    closeControl() {
      // this.clearAll();
      planType = 0
      $('#table_time_selected').remove()
    },

    // 获取已选择时间
    getTimeSpanList() {
      getRecordPlanSubInfoList()
      return recordPlanSubInfoList
    },
  },
}
</script>

<style lang="scss"></style>
