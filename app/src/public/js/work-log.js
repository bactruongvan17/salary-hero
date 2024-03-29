const app = Vue.createApp({
  data() {
    return {
      balance: '-',
      workLogs: [],
      employeeId: null,
      currentMonth: null,
      currentYear: null,
      daysInMonth: [],
      employee: null,
      standardWorkingDays: null,
      actualWorkingDays: null,
      baseSalary: null,
      employeeType: null,
    }
  },
  mounted() {
    const date = new Date()
    this.currentMonth = (date.getMonth() + 1).toString()
    this.currentYear = date.getFullYear().toString()

    this.getEmployeeId()
    this.fetchWorkLogs()
  },
  methods: {
    getDaysInMonth() {
      this.daysInMonth = []
      const date = moment(`${this.currentYear}-${this.currentMonth.toString().padStart(2, '0')}-01`)

      const startOfMonth = moment(date).startOf('month')
      const endOfMonth = moment(date).endOf('month')
      while (startOfMonth.isSameOrBefore(endOfMonth, 'day')) {
        this.daysInMonth.push(startOfMonth.format('YYYY-MM-DD'))
        startOfMonth.add(1, 'day')
      }
    },
    getEmployeeId() {
      const url = window.location.href
      const urlObject = new URL(url)
      const pathname = urlObject.pathname
      const parts = pathname.split('/')
      this.employeeId = parts[parts.length - 1]
    },
    async fetchWorkLogs() {
      this.workLogs = []
      this.getDaysInMonth()
      const month = `${this.currentYear}-${this.currentMonth.toString().padStart(2, '0')}-01`
      try {
        const response = await fetch(`/api/worklogs/${this.employeeId}?month=${month}`)
        const data = await response.json()
        this.balance = data.balance
        this.employee = data.employee
        this.standardWorkingDays = data.standard_working_days
        this.actualWorkingDays = data.actual_working_days
        this.baseSalary = data.base_salary
        this.employeeType = data.employee_type
        const workLogsTemp = new Map()
        for (const item of data.work_logs) {
          const date = moment(item.log_time).format('YYYY-MM-DD')
          workLogsTemp.set(date, item.work_duration === 'half_day' ? 0.5 : 1)
        }

        for (const date of this.daysInMonth) {
          const workDay = workLogsTemp.get(date)
          this.workLogs.push({
            date: date,
            workDay: workDay !== undefined ? workDay : '--'
          })
        }
      } catch (error) {
        console.error('Error fetching work logs:', error)
      }
    }
  },
  watch: {
    currentYear(newVal, oldVal) {
      if (newVal !== oldVal && oldVal !== null) {
        this.fetchWorkLogs()
      }
    },

    currentMonth(newVal, oldVal) {
      if (newVal !== oldVal && oldVal !== null) {
        this.fetchWorkLogs()
      }
    }
  }
})

app.mount('#app')
