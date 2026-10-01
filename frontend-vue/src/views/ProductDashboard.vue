<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Product } from '@/types/Product.type'

// TODO: Import ProductService and ProductList component
import { getAllProducts } from '@/services/ProductService'
import ProductList from '@/components/ProductList.vue'

// TODO: Create your refs and onMounted logic here
const products = ref<Product[]>([] as Product[])
const isLoading = ref(true)

onMounted(async () => {
  try {
    const productResponse = await getAllProducts()
    console.log('API Response: ', productResponse)
    products.value = productResponse ?? []
  } catch (err) {
    products.value = []
    console.error(err instanceof Error ? err.message : 'Failed to fetch products')
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="sm:flex sm:items-center sm:justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Product Catalog</h1>
        <p class="mt-2 text-sm text-gray-700">Manage your store's inventory and pricing.</p>
      </div>
      <div class="mt-4 sm:mt-0">
        <button
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium shadow-sm"
        >
          Add New Product
        </button>
      </div>
    </div>

    <!-- TODO: Render ProductList component here and pass the props! -->
    <ProductList :products="products" :is-loading="isLoading" />
  </div>
</template>
