import { fetchWithRetry } from '~/lib/api'

export interface Category {
	name: string
	order: number
}

export interface Product {
	id: number
	name: string
	description: string
	image: string
	price: number
	category: Category
}

export interface OrderProduct {
	id: number
	quantity: number
	product: Product
}

export interface Order {
	id: number
	createdAt: string
	status: 'CART' | 'PURCHASED'
	products: OrderProduct[]
}

export interface CreateOrderRequest {
	products: {
		id: number
		quantity: number
	}[]
}

export interface UpdateOrderRequest {
	action: 'update_quantity'
	productId: number
	quantity: number
}

const BASE_URL = process.env.NEXT_PUBLIC_SHOP_API_URL

const shopService = {
	async getProducts(): Promise<Product[]> {
		const result = await fetchWithRetry<Product[]>(`${BASE_URL}/products`, {
			next: { revalidate: 3600 },
		})
		return result
	},

	async getCategories(): Promise<Category[]> {
		const result = await fetchWithRetry<Category[]>(`${BASE_URL}/categories`, {
			next: { revalidate: 3600 },
		})
		return result
	},

	async getOrder(id: number): Promise<Order> {
		const result = await fetchWithRetry<Order>(`${BASE_URL}/orders/${id}`)
		return result
	},

	async createOrder(orderData: CreateOrderRequest, signal: AbortSignal): Promise<Order> {
		const result = await fetchWithRetry<Order>(`${BASE_URL}/orders`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(orderData),
			signal,
		})
		return result
	},

	async updateOrder(id: number, updateData: UpdateOrderRequest, signal: AbortSignal): Promise<void> {
		await fetchWithRetry(`${BASE_URL}/orders/${id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(updateData),
			signal,
		})
	},

	async buyOrder(id: number, signal: AbortSignal): Promise<void> {
		await fetchWithRetry(`${BASE_URL}/orders/${id}/buy`, {
			method: 'POST',
			signal,
		})
	},
}

export default shopService
