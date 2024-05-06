import * as xlsx from 'xlsx'
const { utils, writeFile } = xlsx
const DEF_FILE_NAME = 'excel-list.xlsx'

/**
 * @param data source data
 * @param worksheet worksheet object
 * @param min min width
 */
function setColumnWidth(data, worksheet, min = 3) {
  const obj = {}
  worksheet['!cols'] = []
  data.forEach(item => {
    Object.keys(item).forEach(key => {
      const cur = item[key]
      const length = cur?.length ?? min
      obj[key] = Math.max(length, obj[key] ?? min)
    })
  })
  Object.keys(obj).forEach(key => {
    worksheet['!cols'].push({
      wch: obj[key]
    })
  })
}

export function jsonToSheetXlsx({
  data,
  header,
  filename = DEF_FILE_NAME,
  json2sheetOpts = {},
  write2excelOpts = { bookType: 'xlsx' }
}) {
  const arrData = [...data]
  if (header) {
    arrData.unshift(header)
    json2sheetOpts.skipHeader = true
  }
  const worksheet = utils.json_to_sheet(arrData, json2sheetOpts)
  setColumnWidth(arrData, worksheet)
  const workbook = {
    SheetNames: ['Sheet1'],
    Sheets: {
      ['Sheet1']: worksheet
    }
  }
  writeFile(workbook, filename, write2excelOpts)
}

export function aoaToSheetXlsx({
  data,
  header,
  filename = DEF_FILE_NAME,
  write2excelOpts = { bookType: 'xlsx' }
}) {
  const arrData = [...data]
  if (header) {
    arrData.unshift(header)
  }
  const worksheet = utils.aoa_to_sheet(arrData)
  const workbook = {
    SheetNames: ['Sheet1'],
    Sheets: {
      ['Sheet1']: worksheet
    }
  }
  writeFile(workbook, filename, write2excelOpts)
}
