import Dayjs from "dayjs";
import updateLocale from 'dayjs/plugin/updateLocale'
Dayjs.extend(updateLocale)
Dayjs.updateLocale('en', {
  weekStart:1
})
export default Dayjs
