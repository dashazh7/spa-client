<script setup>
  import '../../assets/css/styles.css'
  import { ref, onMounted } from 'vue'
  import api from '../../services/api'

  const data = ref([])
  const columns = ref([])
  const loading = ref(true)
  const error = ref(null)

  const isDateString = (value) => {
    if (typeof value !== 'string') return false
    const date = new Date(value)
    return !isNaN(date.getTime())
  }

  const formatDateTime = (isoDate) => {
    if (!isoDate) return '—'
    const date = new Date(isoDate)
    if (isNaN(date)) return '—'

    const pad = (n) => n.toString().padStart(2, '0')

    const year = date.getFullYear()
    const month = pad(date.getMonth() + 1)
    const day = pad(date.getDate())
    const hours = pad(date.getHours())
    const minutes = pad(date.getMinutes())
    const seconds = pad(date.getSeconds())

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  }

  const formatValue = (val) => {
    if (val === null || val === undefined) return '—'
    if (isDateString(val)) return formatDateTime(val)
    return val.toString()
  }

  const fetchData = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await api.get('/incomes', {
        params: {
          dateFrom: '2024-07-01',
          dateTo: '2024-12-31',
          limit: 10,
          page: 1,
        }
      })
      data.value = response.data.data || []
      if (data.value.length) {
        columns.value = Object.keys(data.value[0])
      }
    } catch (e) {
      error.value = e.message || 'Ошибка загрузки таблицы'
    } finally {
      loading.value = false
    }
  }

  onMounted(fetchData)
</script>

<template>
  <h2>Таблица</h2>
  <div v-if="loading">Загрузка таблицы...</div>
  <div v-else-if="error">Ошибка: {{ error }}</div>
  <div v-else>
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th v-for="col in columns" :key="col">{{ col }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in data" :key="index">
            <td v-for="col in columns" :key="col">
              {{ formatValue(item[col]) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>