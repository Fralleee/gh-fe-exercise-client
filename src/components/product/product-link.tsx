import Image from 'next/image'
import { Button } from '../ui/button'
import { useCartStore } from '~/store/cartStore'
import { useState } from 'react'
import { Product } from '~/services/shop'

export const ProductLink = ({ product }: { product: Product }) => {
	const addItem = useCartStore((state) => state.addItem)

	const [isPending, setIsPending] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const handleAddToCart = async () => {
		setIsPending(true)
		setError(null)
		try {
			await addItem(product)
		} catch (err) {
			console.error('Error adding to cart:', err)
			setError('Failed to add to cart')
		} finally {
			setIsPending(false)
		}
	}

	return (
		<li
			className="overflow-hidden rounded border"
			role="article"
			aria-label={`Product ${product.name}`}
			data-testid={`product-link-${product.id}`}
		>
			<Image
				loading="lazy"
				src={product.image}
				alt={product.name}
				width={400}
				height={400}
				className="h-48 w-full object-cover"
				style={{ aspectRatio: '400/400', objectFit: 'cover' }}
			/>
			<div className="p-4">
				<p className="text-muted-foreground">{product.category.name}</p>
				<h3 className="mb-2 text-lg font-semibold">{product.name}</h3>
				<div className="flex items-center justify-between">
					<span className="text-lg font-bold text-primary">${product.price}</span>
					<Button
						variant="outline"
						onClick={handleAddToCart}
						disabled={isPending}
						aria-label={`Add ${product.name} to cart`}
						data-testid="add-to-cart-button"
					>
						{isPending ? 'Adding...' : 'Add to Cart'}
					</Button>
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
