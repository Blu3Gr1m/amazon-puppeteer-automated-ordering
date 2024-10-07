Step-by-Step Guide:
1. Download the Amazon Bulk Upload Excel Template

    Log in to your Amazon Business account.
    Navigate to the Address Book section (found under Account Settings or Manage Address Book).
    Look for the Bulk Upload option and download the provided Excel template.

2. Fill Out the Amazon Bulk Upload Excel Sheet

    Open the Excel sheet you downloaded from Amazon.
    Populate the sheet with the recipient's addresses. Each column will have specific requirements such as:
        Recipient Name
        Street Address
        City
        State/Province
        Postal Code
        Country
        Phone Number
    Make sure to strictly follow Amazon's formatting guidelines (e.g., no special characters, correct data format for each field) to avoid upload errors.

3. Upload the Completed Excel Sheet

    Once the Excel sheet is filled out with all the recipients' information:
        Go back to the Amazon Business Address Book section.
        Click on the Bulk Upload option and choose your completed Excel file.
        Review and confirm the uploaded addresses. Ensure there are no errors or formatting issues.

4. Create a Wishlist on Amazon

    Go to your Amazon account and create a new Wishlist:
        Add all the items you plan to send to your recipients into the Wishlist.
        Organize the list with relevant items per recipient if needed.
        Note: You can either create a single list with all items or multiple lists per recipient.

5. Prepare the Puppeteer Script for Automation

    Puppeteer is a Node.js library that allows you to automate the browser.

    Set up a new project for Puppeteer by installing it via npm:

    bash

    npm init -y
    npm install puppeteer dotenv

6. Create an .env File for Your Login Information

    In the project root directory, create a file called .env. This file will store your Amazon login credentials:

    makefile

AMAZON_EMAIL=your_amazon_email@example.com
AMAZON_PASSWORD=your_amazon_password

Note: Make sure this .env file is listed in your .gitignore if you are using version control, to prevent sensitive information from being exposed.
