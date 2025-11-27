const { test, expect } = require('@playwright/test');
const { DeskBuddyPage } = require('../pages/DeskBuddyPage'); 

test.describe('Desk Buddy Task Tracker Functionality', () => {
    
    test('should allow user to add a new task and verify its presence', async ({ page }) => {
        const deskBuddyPage = new DeskBuddyPage(page);
        const projectName = `New Project ${Date.now()}`;
        const taskDescription = 'Automate the task tracker test.';

        await test.step('1. Navigate to the app and verify load', async () => {
            await deskBuddyPage.navigateAndVerifyLoad();
            // Assert that initially, no tasks are present (if applicable)
            await expect(deskBuddyPage.totalTasksText).toContainText('Total Tasks: 0');
        });

        await test.step('2. Add a new task', async () => {
            await deskBuddyPage.addTask(projectName, taskDescription, '1.5');
        });
        
        await test.step('3. Verify the task count increased', async () => {
            // Check that the total count changed from 0
            await expect(deskBuddyPage.totalTasksText).toContainText('Total Tasks: 1'); 
        });

        await test.step('4. Verify the task details appear in the table', async () => {
            // Check the text content of the first row
            await expect(deskBuddyPage.firstTaskRow).toContainText(projectName);
            await expect(deskBuddyPage.firstTaskRow).toContainText(taskDescription);
        });

        await test.step('5. Test the search/filter functionality', async () => {
            // Search for the specific project name
            await deskBuddyPage.searchBar.fill(projectName);
            // Verify that the task is still visible after filtering
            await expect(deskBuddyPage.firstTaskRow).toContainText(projectName);
            
            // Search for something that doesn't exist
            await deskBuddyPage.searchBar.fill('nonexistent-task-xyz');
            // Verify that the task is now hidden or a "No results" message appears
            await expect(deskBuddyPage.firstTaskRow).not.toBeVisible();
        });
    });
});