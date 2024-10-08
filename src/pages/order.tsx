import { Button } from '~/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '~/components/ui/card'
import { Separator } from '~/components/ui/separator'
import { useCartStore } from '~/store/cartStore'
import { Container } from '~/components/layout/container'
import { PageStatus } from '~/components/layout/page-status'
import { PageTitle } from '~/components/layout/page-title'
import { CartProduct } from '~/components/order/cart-product'
import { useRouter } from 'next/router'
import { CartProductList } from '~/components/order/cart-product-list'

const PAGE_TITLE = 'Order'

const OrderPage = () => {
	const router = useRouter()

	const orderId = useCartStore((state) => state.orderId)
	const orderStatus = useCartStore((state) => state.orderStatus)
	const items = useCartStore((state) => state.items)

	const updateQuantity = useCartStore((state) => state.updateItemQuantity)
	const purchaseOrder = useCartStore((state) => state.purchaseOrder)
	const resetOrder = useCartStore((state) => state.resetOrder)

	const handleNewOrder = async () => {
		try {
			await resetOrder()
			router.push('/')
		} catch (error) {
			console.error('Error resetting order:', error)
		}
	}

	const handlePurchase = async () => {
		try {
			await purchaseOrder()
		} catch (error) {
			console.error('Error purchasing order:', error)
		}
	}

	if (orderStatus === 'LOADING') {
		return <PageStatus title={PAGE_TITLE} status="Fetching order" message="Still working on it ..." />
	}

	if (!orderId || !items?.length) {
		return (
			<PageStatus
				title={PAGE_TITLE}
				status="Your cart is empty"
				message="Add some items to your cart to proceed with the order."
			/>
		)
	}

	const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

	return (
		<Container className="sm:max-w-5xl">
			<PageTitle title={PAGE_TITLE} />
			<section className="flex flex-col gap-6">
				<header className="flex items-center gap-2 py-3">
					<div className="rounded-full bg-primary px-3 py-1 text-sm font-medium text-primary-foreground">
						{orderStatus === 'CART' ? 'Pending' : 'Completed'}
					</div>
					<h1 className="text-2xl font-bold">Order #{orderId}</h1>
				</header>

				<CartProductList>
					{items.map((item) => (
						<CartProduct key={item.id} cartItem={item} updateQuantity={updateQuantity} />
					))}
				</CartProductList>

				<Card className="mx-auto mt-8 w-full">
					<CardHeader>
						<CardTitle>Order Summary</CardTitle>
					</CardHeader>
					<CardContent className="grid gap-2">
						<div className="flex items-center justify-between">
							<span className="text-muted-foreground">Subtotal</span>
							<span>${subtotal.toFixed(2)}</span>
						</div>
						<Separator />
						<div className="flex items-center justify-between font-semibold">
							<span>Total</span>
							<span>${subtotal.toFixed(2)}</span>
						</div>
					</CardContent>
					<CardFooter className="flex justify-end gap-2">
						{orderStatus === 'PURCHASED' && (
							<Button variant="outline" onClick={handleNewOrder}>
								New Order
							</Button>
						)}
						<Button
							disabled={orderStatus === 'PURCHASED'}
							onClick={handlePurchase}
							aria-label={orderStatus === 'PURCHASED' ? 'Order Completed' : 'Purchase Order'}
						>
							{orderStatus === 'PURCHASED' ? 'Order Completed' : 'Purchase'}
						</Button>
					</CardFooter>
				</Card>
			</section>
		</Container>
	)
}

export default OrderPage
