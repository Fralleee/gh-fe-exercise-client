import { PropsWithChildren } from 'react'

export const CartProductList = ({ children }: PropsWithChildren<unknown>) => (
	<ul className="flex flex-col gap-6">{children}</ul>
)
