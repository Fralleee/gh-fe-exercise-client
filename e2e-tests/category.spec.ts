import { test, expect } from '@playwright/test'

test.describe('Category Page', () => {
	test('should display products filtered by category', async ({ page }) => {
		const categoryName = 'Oils'
		await page.goto(`/category/${encodeURIComponent(categoryName)}`)

		const categoryTitle = await page.textContent('[data-testid="category-title"]')
		expect(categoryTitle).toBe(categoryName)

		const productLinks = await page.$$('[data-testid^="product-link-"]')
		expect(productLinks.length).toBeGreaterThan(0)
	})
})
