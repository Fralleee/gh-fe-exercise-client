import { test, expect } from '@playwright/test'

test.describe('Home Page', () => {
	test('should display a list of products', async ({ page }) => {
		await page.goto('/')
		const productLinks = await page.$$('[data-testid^="product-link-"]')
		expect(productLinks.length).toBeGreaterThan(0)
	})
})
