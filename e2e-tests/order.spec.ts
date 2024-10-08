import { test, expect } from '@playwright/test'

test.describe('Order Functionality', () => {
	test('should add a product to the order', async ({ page }) => {
		const productId = 1

		await page.goto('/')
		await page.click('[data-testid="add-to-cart-button"]')

		await page.goto('/order')
		const cartItem = page.getByTestId(`cart-item-${productId}`)
		expect(cartItem).not.toBeNull()
	})
})
