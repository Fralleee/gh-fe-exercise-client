import type { Category, Product } from '~/services/shop'

export function getTopProductsPerCategory(
	products: Product[],
	categories: Category[],
	numberOfProducts: number = 5,
): Product[] {
	const productsByCategory = products.reduce(
		(acc, product) => {
			const categoryName = product.category.name
			acc[categoryName] = acc[categoryName] || []
			acc[categoryName].push(product)
			return acc
		},
		{} as { [categoryName: string]: Product[] },
	)

	const result = categories.flatMap((category) => {
		const categoryProducts = productsByCategory[category.name] || []
		return categoryProducts.slice(0, numberOfProducts)
	})

	return result
}
