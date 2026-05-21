<script setup>
import { ref, onMounted } from 'vue'
import EmployeeForm from './components/EmployeeForm.vue'
import EmployeeList from './components/EmployeeList.vue'
import {
  getEmployees, createEmployee, updateEmployee, deleteEmployee} from './api/employeeApi.js'

// Reactive App States
const employees = ref([])
const editingEmployee = ref(null)
const isLoading = ref(false)
const errMsg = ref('')

async function load() {
  isLoading.value = true
  errMsg.value = ''
  try{
    const { data } = await getEmployees()
    employees.value = data
  } catch (e) {
    errMsg.value = 'Failed to load data. Is API runnng on :3001?'
  } finally {
    isLoading.value = false
  }
}

async function handleSave(payload) {
  try {
    if (editingEmployee.value){
      await updateEmployee(editingEmployee.value.id, payload)
      editingEmployee.value = null
    } else {
      await createEmployee(payload)
    }
    await load()
  } catch(e) {
    errMsg.value = 'Save failed. Check console.'
  }
}

function handleEdit(s) { editingEmployee.value = { ...s } } 
function handleCancel() { editingEmployee.value = null }

async function handleDelete(id) {
  if(!confirm('Delete this employee? Action cannot be undone.')) return
  try {
    await deleteEmployee(id)
    await load()
  } catch {
    errMsg.value = 'Delete failed.'
  }
}

onMounted(load)
</script>

<template>
  <header>
    <h1>Employee Directory</h1>
    <p class="subtitle">Vue 3 · Axios · Express · MySQL</p>
  </header>

  <main>
    <p v-if="isLoading" class="loading">Loading…</p> 
    <p v-if="errMsg" class="error">{{ errMsg }}</p>
    
    <EmployeeForm
      :editingEmployee="editingEmployee" 
      @save="handleSave" 
      @cancel="handleCancel" 
    />
    
    <EmployeeList
      :employees="employees" 
      @edit="handleEdit" 
      @delete="handleDelete" 
    /> 
  </main>
</template>