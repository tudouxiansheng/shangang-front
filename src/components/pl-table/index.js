import Table from './components/table.vue'
import Column from './components/column.vue'
export const componentPligin = {
  install(app) {
    app.component('pl-table', Table)
    app.component('pl-table-column', Column)
  }
}
