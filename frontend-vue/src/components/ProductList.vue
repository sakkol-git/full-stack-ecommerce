<script setup lang="ts">
import type { Product } from '@/types/Product.type'
defineProps<{
  products: Product[]
  isLoading: boolean
}>()
</script>

<template>
  <div class="mt-6">
    <!-- TODO: Show this div ONLY if isLoading is true -->
    <div v-if="isLoading" class="flex justify-center p-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <!-- TODO: Show this div if NOT loading, and products array is empty -->
    <div
      v-if="!isLoading && products?.length == 0"
      class="text-center p-12 text-gray-500 bg-gray-50 rounded-lg"
    >
      No products found.
    </div>

    <!-- TODO: Show this grid if NOT loading and we have products -->
    <div
      v-if="!isLoading && products?.length > 0"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <!-- TODO: Loop over products here -->
      <div
        v-for="product in products"
        :key="product.id"
        class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
      >
        <img
          :src="product.image || 'https://placehold.co/600x400?text=No+Image'"
          class="w-full h-48 object-cover"
        />
        <div class="p-5">
          <div class="flex justify-between items-start mb-2">
            <h3 class="text-lg font-semibold text-gray-900">{{ product.name }}</h3>
            <span class="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded"
              >${{ product.price }}</span
            >
          </div>
          <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ product.description }}</p>
          <div class="flex gap-2">
            <!-- We will wire these buttons up with Emits in the next phase! -->
            <button class="text-sm font-medium text-blue-600 hover:text-blue-800">Edit</button>
            <button class="text-sm font-medium text-red-600 hover:text-red-800">Delete</button>
          </div>
        </div>
      </div>
      <!-- End of loop -->
    </div>
  </div>
</template>
