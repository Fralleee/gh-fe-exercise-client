import { GetStaticProps } from 'next'
import shopService, { Product } from '../services/shop'
import { getTopProductsPerCategory } from '~/lib/products'
import Link from 'next/link'
import { ProductLink } from '~/components/product/product-link'
import React from 'react'
import { ProductList } from '~/components/product/product-list'
import { Container } from '~/components/layout/container'
import { PageStatus } from '~/components/layout/page-status'
import { PageTitle } from '~/components/layout/page-title'

interface ProductsPageProps {
	products: Product[]
	error?: string
}

const PAGE_TITLE = 'Products'

export const getStaticProps: GetStaticProps = async () => {
	try {
		const products = await shopService.getProducts()
		const categories = await shopService.getCategories()

		return {
			props: {
				products: getTopProductsPerCategory(products, categories, 5),
			},
			revalidate: 60,
		}
	} catch (error) {
		console.error(error)
		return {
			props: {
				products: [],
				error: 'Failed to fetch products',
			},
			revalidate: 60,
		}
	}
}

const ProductsPage = ({ products, error }: ProductsPageProps) => {
	if (error) {
		return <PageStatus title={PAGE_TITLE} status="An error occurred" message={error} />
	}

	if (!products.length) {
		return (
			<PageStatus
				title={PAGE_TITLE}
				status="No products found"
				message={`Sorry, there are no products at the moment.`}
			/>
		)
	}

	return (
		<Container>
			<PageTitle title={PAGE_TITLE} />
			<h1 className="mb-4 text-3xl font-bold">Products</h1>

			<ProductList>
				{products.map((product, index, array) => {
					const isNewCategory = index === 0 || product.category.name !== array[index - 1].category.name

					return (
						<React.Fragment key={`product-${product.id}`}>
							{isNewCategory && (
								<div
									key={`category-${product.category.name}`}
									className="col-span-full mt-8 flex flex-col gap-1"
								>
									<h2 className="text-2xl font-bold">{product.category.name}</h2>
									<Link
										className="max-w-fit text-blue-500 hover:underline"
										href={`/category/${encodeURIComponent(product.category.name)}`}
									>
										View all {product.category.name}
									</Link>
								</div>
							)}
							<ProductLink product={product} />
						</React.Fragment>
					)
				})}
			</ProductList>
		</Container>
	)
}

export default ProductsPage
