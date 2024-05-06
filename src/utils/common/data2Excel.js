import * as XLSX from 'xlsx'
import { getFormatDate2 } from './mutil'
// 对象，用于调用方法
var dataConversionUtil = {}

// 将数据转换成Excel，单个sheet保存
//fileName文件名,tableHeader表头,dataList表数据,cols单元格宽度,sheet="sheet1"工作表默认名字是sheet1
dataConversionUtil.dataToExcel = function (
  fileName,
  tableHeader,
  dataList,
  cols,
  sheet = 'sheet1'
) {
  dataList.forEach((row, index) => {
    row.forEach((cell, i) => {
      // CSV_FORMULA_PATTERN
      if (/^[@=\-+<>＠＝＼／－＋＜＞"'`＂＇\s].*$/.test(cell)) {
        dataList[index][i] = ' ' + cell
      }
    })
  })
  // excel的表头和数据
  let aoa = []
  // aoa的数据格式：[[],[],[],[]]   数组的第一个子数组可以指定为表头  根据情况而定
  aoa = tableHeader.concat(dataList)

  let workSheet = XLSX.utils.aoa_to_sheet(aoa)
  workSheet['!cols'] = cols
  let workBook = XLSX.utils.book_new()
  // 把数据写到工作簿中
  XLSX.utils.book_append_sheet(workBook, workSheet, sheet)
  //如果一个工作工作簿中有多个工作表，可以修改参数类型并遍历添加，期中workBook是同一个，workSheet和sheet根据自己的需求添加，
  //比如在此处添加第二个工作表叫‘第二张表’，把数据封装好后，数据格式同上,假如数据叫workSheet2，执行下面代码，工作簿就会多一张工作表叫‘第二张表’

  //保存
  XLSX.writeFile(workBook, fileName + '_' + getFormatDate2(new Date()) + '.xlsx')
}

function exportCsv(fileName, tableHeader, dataList) {
  let csv = ''
  for (let key in tableHeader) {
    csv += tableHeader[key] + ','
  }
  csv = csv.substring(0, csv.length - 1) + '\r\n'
  for (let i in dataList) {
    for (let key in tableHeader) {
      const value = /^[@=\-+<>＠＝＼／－＋＜＞"'`＂＇\s].*$/.test(dataList[i][key])
        ? ' ' + dataList[i][key]
        : dataList[i][key]
      csv += (value || '') + '\t,'
    }
    csv = csv.substring(0, csv.length - 1) + '\r\n'
  }
  //定义文件内容，类型必须为Blob 否则createObjectURL会报错
  let content = new Blob(['\uFEFF' + csv])
  //生成url对象
  let urlObject = window.URL || window.webkitURL || window
  let url = urlObject.createObjectURL(content)
  //生成<a></a>DOM元素
  let el = document.createElement('a')
  //链接赋值
  el.href = url
  el.download = `${fileName}_${getFormatDate2(new Date())}.csv`
  //必须点击否则不会下载
  el.click()
  //移除链接释放资源
  urlObject.revokeObjectURL(url)
}

// 用SSF模块转换日期格式单元格里的值
function parseExcelDate(n, isDate1904) {
  const parsed = XLSX.SSF.parse_date_code(n, { date1904: isDate1904 })
  return new Date(parsed.y, parsed.m - 1, parsed.d, parsed.H, parsed.M, parsed.S)
}

export { dataConversionUtil, exportCsv, parseExcelDate }
