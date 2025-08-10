<script setup>
  import { ref, onMounted, watch, computed } from 'vue'
  import '../../assets/css/styles.css'
  import api from '../../services/api'

  const data = ref([])
  const columns = ref([])
  const loading = ref(true)
  const error = ref(null)

  const filterFields = ['date', 'date_close', 'warehouse_name']
  const filters = ref({
    date: '',
    date_close: '',
    warehouse_name: '',
  })

  const uniqueValues = ref({
    date: [],
    date_close: [],
    warehouse_name: [],
  })

  const page = ref(1)
  const limit = ref(20)
  const isLastPage = ref(false)

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
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
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
      const params = {
        dateFrom: '2024-07-01',
        dateTo: '2024-12-31',
        limit: limit.value,
        page: page.value,
      }

      const response = await api.get('/incomes', { params })
      const resData = response.data

      data.value = resData.data || []
      isLastPage.value = data.value.length < limit.value

      if (data.value.length && columns.value.length === 0) {
        columns.value = Object.keys(data.value[0])
        filterFields.forEach(field => {
          const set = new Set()
          data.value.forEach(item => {
            if (item[field]) set.add(item[field])
          })
          uniqueValues.value[field] = Array.from(set).sort()
        })
      }
    } catch (e) {
      error.value = e.message || 'Ошибка загрузки таблицы'
    } finally {
      loading.value = false
    }
  }

  const clientFilteredData = computed(() => {
    return data.value.filter(item =>
      filterFields.every(field => {
        if (!filters.value[field]) return true
        return item[field]?.toString() === filters.value[field]
      })
    )
  })

  watch(page, () => {
    fetchData()
  })

  const prevPage = () => {
    if (page.value > 1) {
      page.value--
    }
  }
  const nextPage = () => {
    if (!isLastPage.value) {
      page.value++
    }
  }

  onMounted(fetchData)
</script>

<template>
  <h2>Таблица с фильтрами</h2>
  <div v-if="loading">Загрузка таблицы...</div>
  <div v-else-if="error">Ошибка: {{ error }}</div>
  <div v-else>
    <div class="filters">
      <label v-for="field in filterFields" :key="field" class="filter-label">
        <span>{{ field }}:</span>
        <select v-model="filters[field]" class="filter-select">
          <option value="">Все</option>
          <option v-for="option in uniqueValues[field]" :key="option" :value="option.toString()">
            {{ option }}
          </option>
        </select>
      </label>
    </div>

    <div v-if="clientFilteredData.length > 0" class="table-wrapper">
      <table class="data-table">
        <thead>
          <tr>
            <th v-for="col in columns" :key="col">{{ col }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, idx) in clientFilteredData" :key="idx">
            <td v-for="col in columns" :key="col">{{ formatValue(item[col]) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="message">Нет данных, соответствующих фильтрам</div>

    <div class="pagination">
      <button :disabled="page === 1" @click="prevPage" class="pagination__button">Назад</button>
      <span class="pagination__page">Страница {{ page }}</span>
      <button :disabled="isLastPage" @click="nextPage" class="pagination__button">Вперед</button>
    </div>
  </div>
</template>