const { expect } = require('@playwright/test');

/**
 * Page Object for the Desk Buddy application.
 * Encapsulates locators and interaction methods for the Project/Task Tracker.
 */
class DeskBuddyPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
        
        // --- Locators (Targeting by accessible role/text where possible) ---
        this.searchBar = page.getByPlaceholder('Search...');
        this.projectNameInput = page.getByPlaceholder('Project Name');
        this.taskDescriptionInput = page.getByPlaceholder('Task Description');
        this.timeInput = page.getByPlaceholder('Time (e.g. 2.5h)');
        this.addButton = page.getByRole('button', { name: 'Add' }); 
        
        // Locators for asserting data state
        this.totalTasksText = page.getByText(/Total Tasks:\s*\d+/); // Regex to match "Total Tasks: 0"
        this.firstTaskRow = page.locator('tbody tr').first(); 
    }

    /**
     * Navigates to the base URL and verifies the main component is visible.
     */
    async navigateAndVerifyLoad() {
        await this.page.goto('/');
        // Ensure the key input element is visible before proceeding
        await expect(this.projectNameInput).toBeVisible({ timeout: 10000 }); 
    }

    /**
     * Adds a new project/task entry.
     */
    async addTask(project, task, time) {
        await this.projectNameInput.fill(project);
        await this.taskDescriptionInput.fill(task);
        await this.timeInput.fill(time);
        await this.addButton.click();
    }
}

module.exports = { DeskBuddyPage };