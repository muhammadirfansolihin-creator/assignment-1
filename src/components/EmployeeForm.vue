<script setup>
import { ref, watch, computed } from 'vue'
import { errorMessages } from 'vue/compiler-sfc'

const props = defineProps({
  editingEmployee: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['save', 'cancel'])

const initialForm = () => ({
  empId: '',
  name: '',
  email: '',
  department: '',
  position: '',
  hireDate: '',
  salary: 1500,
  active: true
})

const form = ref(initialForm())
const errors = ref({})

watch(() => props.editingEmployee, (val) => {
    form.value = val? { ...val } : initialForm()
    errors.value = {}
}, { immediate: true })

const isEditing = computed(() => Boolean(props.editingEmployee))

const idRegex = /^[E][M][P][0-9][0-9][0-9]$/ 
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(){
  const err = {}

  if (!form.value.empId.trim()) {
    err.empId = 'Employee ID is explicitly mandatory.'
  } else if (!idRegex.test(form.value.empId.trim().toUpperCase())) {
    err.empId = 'ID formatting must mimic blueprint sequence: EMP followed by 3(e.g. EMP001).'
  }

  if (!form.value.name.trim() || form.value.name.trim().length < 3) {
    err.name = 'Name cannot be empty and cannot less than 3.'
  }

  if (!emailRegex.test(form.value.email.trim())) {
    err.email = 'Organisational email input required.'
  }

  if (!form.value.department) {
    err.department = 'Please pick a department.'
  }

  if (!form.value.position.trim()) {
    err.position = 'Operational position required.'
  }

  if (!form.value.hireDate) {
    err.hireDate = 'Employee registration date expected.'
  } else {
    const chosenDate = new Date(form.value.hireDate);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (chosenDate > today) {
      err.hireDate = 'System warning: Date entries cannot align with future chronological timelines.';
    }
  }

  if (form.value.salary === null || form.value.salary === undefined || String(form.value.salary).trim() === '') {
    err.salary = 'Monthly salary details required.'
  } else if (isNaN(form.value.salary)) {
    err.salary = 'Input require standard numbers.'
  } else if (form.value.salary < 1500 || form.value.salary > 50000) {
    err.salary = 'Salary must between RM 1,500 and RM 50,000 values.'
  }

  errors.value = err;
  return Object.keys(err).length === 0
}

function onSubmit(){
  if(!validate()) return
  emit('save', {
    ...form.value,
    empId:      form.value.empId.trim().toUpperCase(),
    name:         form.value.name.trim(),
    email:        form.value.email.trim(),
    department:   form.value.department.trim(),
    position:     form.value.position.trim(),
    hireDate:     form.value.hireDate,
    salary:       Number(form.value.salary)
  })
  if (!isEditing.value) form.value = initialForm()
}

function onCancel(){
  emit('cancel')
  form.value = initialForm()
  errors.value = {}
}
</script>

<template>
    <form @submit.prevent="onSubmit" class="employee-form">
      <h3>{{ isEditing? 'Edit Employee' : 'Add New Employee' }}</h3>

      <label>Employee ID
        <input v-model.trim="form.empId" placeholder="EMP***" />
        <span v-if="errors.empId" class="err">{{ errors.empId }}</span>
      </label>

      <label>Name
        <input v-model.trim="form.name" />
        <span v-if="errors.name" class="err">{{ errors.name }}</span>
      </label>

      <label>Email
        <input v-model.trim="form.email" type="email" placeholder="*****@vsorg.com"/>
        <span v-if="errors.email" class="err">{{ errors.email }}</span>
      </label>

      <label>Department
        <select v-model="form.department">
          <option value="">--- select ---</option>
          <option>IT</option>
          <option>Finance</option>
          <option>Marketing</option>
          <option>Operations</option>
          <option>HR</option>
        </select>
        <span v-if="errors.department" class="err">{{ errors.department }}</span>
      </label>

      <label>Position
        <input v-model.trim="form.position" />
        <span v-if="errors.position" class="err">{{ errors.position }}</span>
      </label>

      <label>Hire Date
        <input v-model="form.hireDate" type="date" />
        <span v-if="errors.hireDate" class="err">{{ errors.hireDate }}</span>
      </label>

      <label>Salary(RM)
        <input v-model.number="form.salary" type="number" />
        <span v-if="errors.salary" class="err">{{ errors.salary }}</span>
      </label>

      <label class="check">
        <input type="checkbox" v-model="form.active" /> Active Employee
      </label>

      <div class="action">
        <button type="submit">{{ isEditing ? 'Update' : 'Add' }}</button>
        <button v-if="isEditing" type="button" @click="onCancel">Cancel</button>
      </div>
    </form>
</template>