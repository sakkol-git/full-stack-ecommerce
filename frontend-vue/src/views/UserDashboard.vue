<script lang="ts" setup>
// 1. import
import { ref, onMounted } from 'vue'

// 2. define type
interface User {
  id: number
  name: string
  email: string
}

// 3. Reactive State
const users = ref<User[]>([])
const isLoading = ref(true)
const newUserName = ref<string>('')

// 4. Lifecycle Hook: fetch users on component mount
onMounted(async () => {
  // Run once when vue components load like useEffect without dependency array in React
  // can call trough api or local storage
  setTimeout(() => {
    users.value = [
      { id: 1, name: 'Alice', email: 'ALice@' },
      { id: 2, name: 'Bob', email: 'ALice@' },
      { id: 3, name: 'Charlie', email: 'ALice@' },
    ]
    isLoading.value = false
  }, 1000)
})

// 5. Method or Crud Operations
const addUser = () => {
  if (!newUserName.value) return
  // update ref
  users.value.push({
    id: Date.now(),
    name: newUserName.value,
    email: `${newUserName.value.toLocaleLowerCase()}@email.com`,
  })
  // clear input
  newUserName.value = ''
}
</script>

<template>
  <!-- In the template, you don't need .value to access refs. Vue unwraps them automatically. -->
  <main lass="max-w-3xl mx-auto p-8">
    <h1 class="text-3xl font-bold mb-6">User Dashboard</h1>

    <!-- form to create user -->
    <div class="flex gap-4 mb-8">
      <input
        v-model="newUserName"
        @keyup.enter="addUser"
        type="text"
        placeholder="Please Enter User Name!"
        class="border rounded px-4 py-2 flex-1"
      />
      <button @click="addUser" class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
        Add User
      </button>
    </div>

    <!-- CONDITIONAL RENDERING: v-if / v-else -->
    <div v-if="isLoading" class="text-gray-500 anime-pulse">Loading from server......</div>

    <!-- LIST RENDERING: v-for requires a unique :key -->
    <ul v-else>
      <li
        v-for="user in users"
        :key="user.id"
        class="bg-white p-4 rounded shadow flex justify-between items-center"
      >
        <span class="font-medium">{{ user.name }}</span>
        <span class="text-gray-50 text-sm">{{ user.email }}</span>
      </li>
    </ul>
  </main>
</template>

<style scoped></style>
