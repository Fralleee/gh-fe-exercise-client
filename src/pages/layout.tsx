import { Inter } from 'next/font/google'
import { Cart } from '../components/order/cart'
import { PropsWithChildren } from 'react'
import { cn } from '~/lib/utils'

const fontHeading = Inter({
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-heading',
})

const fontBody = Inter({
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-body',
})

export default function Layout({ children }: PropsWithChildren<unknown>) {
	return (
		<div className={cn('antialiased', fontHeading.variable, fontBody.variable)}>
			<Cart />
			{children}
		</div>
	)
}
