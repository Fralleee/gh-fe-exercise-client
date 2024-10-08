import Image from 'next/image'
import { CartItem } from '~/store/cartStore'
import { QuantityInput } from '../product/quantity-input'
import { useState } from 'react'

interface Props {
	cartItem: CartItem
	updateQuantity: (productId: number, quantity: number) => void
}

export const CartProduct = ({ cartItem, updateQuantity }: Props) => {
	const [isPending, setIsPending] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const handleQuantityChange = async (value: number) => {
		setIsPending(true)
		setError(null)
		try {
			await updateQuantity(cartItem.product.id, value)
		} catch (err) {
			console.error('Error updating quantity:', err)
			setError('Failed to update quantity')
		} finally {
			setIsPending(false)
		}
	}

	return (
		<li
			className="flex flex-wrap justify-between gap-3 rounded border p-3 md:flex-nowrap"
			role="article"
			aria-label={`Product ${cartItem.product.name}`}
			data-testid={`cart-item-${cartItem.product.id}`}
		>
			<div className="flex items-center gap-3">
				<Image
					loading="lazy"
					src={cartItem.product.image}
					alt={cartItem.product.name}
					width={100}
					height={100}
					className="rounded-md object-cover"
					style={{ aspectRatio: '100/100', objectFit: 'cover' }}
				/>
				<div className="flex w-full flex-col gap-1">
					<p className="text-muted-foreground">{cartItem.product.category.name}</p>
					<h3 className="font-semibold">{cartItem.product.name}</h3>
					<p className="line-clamp-1 text-muted-foreground sm:line-clamp-2 sm:pr-3">
						{cartItem.product.description}
					</p>
				</div>
			</div>
			<div className="flex flex-col justify-center">
				<div className="flex items-center justify-between gap-6">
					<QuantityInput disabled={isPending} value={cartItem.quantity} onChange={handleQuantityChange} />
					<div className="min-w-[60px] text-xl font-bold">${cartItem.product.price * cartItem.quantity}</div>
				</div>
				{error && (
					<p className="font-semibold text-red-600" role="alert">
						{error}
					</p>
				)}
			</div>
		</li>
	)
}
