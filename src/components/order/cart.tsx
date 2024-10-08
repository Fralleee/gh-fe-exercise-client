import { BadgeCheck, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useCartStore } from '~/store/cartStore'

export const Cart = () => {
	const router = useRouter()

	const isOrderPath = router.pathname === '/order'

	const count = useCartStore((state) => state.items.reduce((acc, item) => acc + item.quantity, 0))
	const isPurchased = useCartStore((state) => state.orderStatus === 'PURCHASED')

	if (isOrderPath) {
		return (
			<Link
				href="/"
				className="fixed bottom-3 right-3 z-50 rounded-full bg-primary p-2 text-primary-foreground shadow-lg hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:bottom-auto sm:top-3"
				prefetch={false}
				aria-label="Shop more products"
			>
				Shop more
			</Link>
		)
	}

	return (
		<Link
			href="/order"
			className="fixed bottom-3 right-3 z-50 rounded-full bg-primary p-2 text-primary-foreground shadow-lg hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:bottom-auto sm:top-3"
			aria-label="View your cart"
		>
			{isPurchased ? (
				<BadgeCheck className="h-6 w-6" aria-hidden="true" />
			) : (
				<ShoppingCart className="h-6 w-6" aria-hidden="true" />
			)}
			{!isPurchased && count > 0 && (
				<div
					key={count}
					className="absolute -right-2 -top-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs text-white animate-in fade-in zoom-in"
					aria-label={`${count} items in cart`}
				>
					{count}
				</div>
			)}
		</Link>
	)
}
