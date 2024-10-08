import { GetStaticPaths, GetStaticProps } from 'next'
import shopService, { Product } from '../../services/shop'
import { ProductLink } from '~/components/product/product-link'
import Link from 'next/link'
import React from 'react'
import { ProductList } from '~/components/product/product-list'
import { ArrowLeft } from 'lucide-react'
import { Container } from '~/components/layout/container'
import { PageStatus } from '~/components/layout/page-status'
import { PageTitle } from '~/components/layout/page-title'

interface CategoryPageProps {
	categoryName: string
	products: Product[]
	error?: string
}

export const getStaticPaths: GetStaticPaths = async () => {
	const categories = await shopService.getCategories()

	const paths = categories.map((category) => ({
		params: { categoryName: category.name },
	}))

	return {
		paths,
		fallback: false,
	}
}

export const getStaticProps: GetStaticProps = async (context) => {
	const { params } = context
	const categoryName = params?.categoryName as string

	try {
		const products = await shopService.getProducts()
		const categories = await shopService.getCategories()

		if (!categories.find((category) => category.name.toLowerCase() === categoryName.toLowerCase())) {
			return {
				notFound: true,
			}
		}

		const filteredProducts = products.filter(
			(product) => product.category.name.toLowerCase() === categoryName.toLowerCase(),
		)

		return {
			props: {
				categoryName,
				products: filteredProducts,
			},
			revalidate: 60,
		}
	} catch {
		// Log error to logging service
		return {
			props: {
				categoryName,
				products: [],
				error: 'Failed to fetch products',
			},
			revalidate: 60,
		}
	}
}

const CategoryPage = ({ categoryName, products, error }: CategoryPageProps) => {
	if (error) return <PageStatus title={categoryName} status="An error occurred" message={error} isError />

	if (!products || !categoryName || !products.length)
		return (
			<PageStatus
				title={categoryName}
				status="No products found"
				message={`Sorry, there are no products in ${categoryName} at the moment.`}
			/>
		)

	return (
		<Container>
			<PageTitle title={categoryName} />
			<Link className="flex items-center gap-2 text-blue-500 hover:underline" href="/">
				<ArrowLeft className="h-4 w-4" /> Back to Products
			</Link>
			<h1 data-testid="category-title" className="mb-8 text-3xl font-bold">
				{categoryName}
			</h1>

			<ProductList>
				{products.map((product) => (
					<ProductLink key={product.id} product={product} />
				))}
			</ProductList>
		</Container>
	)
}

export default CategoryPage
