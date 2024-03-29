const app = Vue.createApp({
  data() {
    return {
      employees: [],
      currentPage: 1,
      totalPages: 1,
      limit: 10
    }
  },
  mounted() {
    this.fetchEmployees()
  },
  methods: {
    async fetchEmployees() {
      try {
        const response = await fetch(`/api/employees?limit=${this.limit}&page=${this.currentPage}`)
        const data = await response.json()
        this.employees = data.data.map((item) => {
          return {
            id: item.id,
            name: item.name,
            type: item.type,
            type_text: item.type === 'monthly' ? 'Monthly Worker' : 'Daily Worker',
            salary: Number(item.salary).toLocaleString('en-US', { style: 'currency', currency: item.currency }),
            currency: item.currency.toString().toUpperCase(),
            date_start_work: item.date_start_work
          }
        })
        this.totalPages = data.total_page
      } catch (error) {
        console.error('Error fetching employees:', error)
      }
    },
    async nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
        await this.fetchEmployees()
      }
    },
    async prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--
        await this.fetchEmployees()
      }
    }
  }
})

app.mount('#app')
