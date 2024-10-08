import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import shopService, { Product } from '../services/shop'

export interface CartItem {
	id: number
	quantity: number
	product: Product
}
interface CartValues {
	items: CartItem[]
	orderId: number | null
	orderStatus: 'CART' | 'PURCHASED' | 'LOADING'
}

interface CartActions {
	addItem: (product: Product, quantity?: number) => Promise<void>
	updateItemQuantity: (productId: number, quantity: number) => Promise<void>
	purchaseOrder: () => Promise<void>
	resetOrder: () => void
	hydrateOrder: (orderId?: number | null) => Promise<void>
}

const defaultState: CartValues = {
	items: [],
	orderId: null,
	orderStatus: 'LOADING',
}

type CartState = CartValues & CartActions

export const useCartStore = create<CartState>()(
	persist(
		(set, get) => {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const withOrderModificationCheck = (action: (...args: any[]) => Promise<void>, actionName: string) => {
				let controller: AbortController | null = null
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				return async (...args: any[]) => {
					const { orderStatus } = get()
					if (orderStatus === 'PURCHASED') {
						get().resetOrder()
					}

					if (controller) {
						controller.abort()
					}

					controller = new AbortController()

					try {
						await action(...args, controller.signal)
					} catch (error: unknown) {
						if (error instanceof Error && error.name === 'AbortError') {
							return
						}
						console.error(`Error in ${actionName}:`, error)
						throw error
					} finally {
						controller = null
					}
				}
			}

			return {
				...defaultState,

				addItem: withOrderModificationCheck(async (product: Product, signal: AbortSignal) => {
					const { items, orderId } = get()
					const productId = product.id

					const existingItem = items.find((item) => item.product.id === productId)
					let updatedItems

					try {
						if (existingItem) {
							existingItem.quantity += 1
							updatedItems = [...items]
						} else {
							updatedItems = [...items, { id: productId, quantity: 1, product }]
						}

						if (!orderId) {
							const orderData = {
								products: updatedItems.map((item) => ({
									id: item.product.id,
									quantity: item.quantity,
								})),
							}
							const newOrder = await shopService.createOrder(orderData, signal)
							set({ items: updatedItems })
							set({ orderId: newOrder.id })
						} else {
							await shopService.updateOrder(
								orderId,
								{
									action: 'update_quantity',
									productId,
									quantity: existingItem ? existingItem.quantity : 1,
								},
								signal,
							)
							set({ items: updatedItems })
						}
					} catch {
						if (existingItem) {
							existingItem.quantity -= 1
						} else {
							updatedItems = items.filter((item) => item.product.id !== productId)
						}
						throw new Error('Error adding item')
					}
				}, 'addItem'),

				updateItemQuantity: withOrderModificationCheck(
					async (productId: number, quantity: number, signal: AbortSignal) => {
						const { items, orderId } = get()

						const item = items.find((item) => item.product.id === productId)
						if (!item || !orderId) return

						const previousQuantity = item.quantity
						try {
							item.quantity = quantity
							let updatedItems = [...items]
							if (quantity <= 0) {
								updatedItems = items.filter((item) => item.product.id !== productId)
							}

							await shopService.updateOrder(
								orderId,
								{
									action: 'update_quantity',
									productId,
									quantity,
								},
								signal,
							)
							set({ items: updatedItems })
						} catch {
							item.quantity = previousQuantity
							throw new Error('Error updating quantity')
						}
					},
					'updateItemQuantity',
				),

				purchaseOrder: withOrderModificationCheck(async (signal: AbortSignal) => {
					const { orderId } = get()
					if (!orderId) return

					await shopService.buyOrder(orderId, signal)
					set({ orderStatus: 'PURCHASED' })
				}, 'purchaseOrder'),

				resetOrder: () => {
					set({ orderId: null, orderStatus: 'CART', items: [] })
				},

				hydrateOrder: async (orderId?: number | null) => {
					console.log('Hydrating order:', orderId)
					if (orderId) {
						try {
							const order = await shopService.getOrder(orderId)
							console.log('Fetched order:', order)
							set({
								orderStatus: order.status,
								items: order.products.map((orderProduct) => ({
									id: orderProduct.product.id,
									quantity: orderProduct.quantity,
									product: orderProduct.product,
								})),
							})
						} catch (error) {
							console.error('Error fetching order during rehydration:', error)
							// We should probably handle this more gracefully, but for now we'll just reset the order
							get().resetOrder()
						}
					} else {
						set({ orderStatus: 'CART' })
					}
				},
			}
		},
		{
			name: 'cart-storage',
			partialize: (state) => ({ orderId: state.orderId }),
			onRehydrateStorage: () => async (state) => {
				await state?.hydrateOrder(state?.orderId)
			},
		},
	),
)
