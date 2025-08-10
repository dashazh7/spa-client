<script setup>
  import { ref, onMounted, watch, computed } from 'vue'
  import '../../assets/css/styles.css'
  import api from '../../services/api'

  const data = ref([])
  const columns = ref([])
  const loading = ref(true)
  const error = ref(null)

  const filterFields = ['warehouse_name', 'subject', 'brand']

  const filters = ref({
    warehouse_name: '',
    subject: '',
    brand: '',
  })

  const uniqueValues = ref({
    warehouse_name: [],
    subject: [],
    brand: [],
  })

  const page = ref(1)
  const limit = ref(20)
  const isLastPage = ref(false)

  const formatDate = (date) => {
    const pad = (n) => n.toString().padStart(2, '0')
    const year = date.getFullYear()
    const month = pad(date.getMonth() + 1)
    const day = pad(date.getDate())
    return `${year}-${month}-${day}`
  }
  const getTodayDate = () => formatDate(new Date())
  const getDateOneYearLater = (dateStr) => {
    const date = new Date(dateStr)
    date.setFullYear(date.getFullYear() + 1)
    return formatDate(date)
  }

  const fetchData = async () => {
    loading.value = true
    error.value = null
    try {
      const dateFrom = getTodayDate()
      const dateTo = getDateOneYearLater(dateFrom)
      const params = {
        dateFrom,
        dateTo,
        limit: limit.value,
        page: page.value,
      }

      const response = await api.get('/stocks', { params })
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
        return item[field]?.toString().toLowerCase() === filters.value[field].toString().toLowerCase()
      })
    )
  })

  watch(page, () => fetchData())

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

  const formatValue = (val) => {
    if (val === null || val === undefined) return '—'
    return val.toString()
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