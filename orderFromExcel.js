/* Start of Part 1 */
require("dotenv").config();

const puppeteer = require("puppeteer-core");
const fs = require("fs");
const XLSX = require("xlsx");
// Load email from .env make sure to make an env file and make a gitignore file for the env file
const amazonEmail = process.env.AMAZON_EMAIL; 
// Load password from .env make sure to make an env file
const amazonPassword = process.env.AMAZON_PASSWORD; 
// Global variable for the browser
let browser; 
// Executable path to chrome 
async function launchBrowser() {
  console.log("Launching browser...");
  try {
    browser = await puppeteer.launch({
      executablePath:
        "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", 
      headless: false,
    });
    console.log("Browser launched.");
  } catch (err) {
    console.error("Error launching browser:", err);
  }
  return browser;
}

async function loadCookies(page) {
  let cookies = [];
  try {
    console.log("Trying to load cookies...");
    const cookiesString = fs.readFileSync("cookies.json");
    cookies = JSON.parse(cookiesString);
    if (cookies.length) {
      await page.setCookie(...cookies);
      console.log("Cookies loaded.");
    } else {
      console.log("No cookies found, proceeding without them.");
    }
  } catch (err) {
    console.error("Error loading cookies:", err);
    await captureScreenshot(page, "error_loading_cookies");
  }
}
// Place your signin link here replace this link with your own sign in link
async function signIn(page) {
  try {
    console.log("Navigating to Amazon sign-in page...");
    await page.goto(
      "www.amazon.com/signinlinkgoeshere/thisisaplaceholderlink" 
    console.log("Navigated to Amazon sign-in page.");
    // 2-second delay
    await new Promise((r) => setTimeout(r, 2000)); 

    console.log("Checking if email is pre-filled...");
    const emailFieldValue = await page.$eval(
      'input[name="email"]',
      (el) => el.value
    );
    if (!emailFieldValue) {
      console.log("Email field is empty, filling in the email...");
      await page.waitForSelector('input[name="email"]', {
        visible: true,
        timeout: 20000,
      });
      await page.type('input[name="email"]', amazonEmail);
      await page.waitForSelector("input#continue", {
        visible: true,
        timeout: 20000,
      });
      await page.click("input#continue");
    } else {
      console.log("Email is already filled. Proceeding to password entry.");
    }

    console.log("Waiting for password field...");
    await page.waitForSelector('input[name="password"]', {
      visible: true,
      timeout: 20000,
    });
    await page.type('input[name="password"]', amazonPassword, { delay: 100 });
    await page.waitForSelector("input#signInSubmit", {
      visible: true,
      timeout: 20000,
    });
    // Wait 15 seconds for manual OTP entry if you have it enabled 
    await page.click("input#signInSubmit");

    console.log("Waiting for OTP input...");
    await new Promise((r) => setTimeout(r, 15000)); 

    await saveCookies(page);
  } catch (err) {
    console.error("Error during sign-in:", err);
    await captureScreenshot(page, "error_signin");
  }
}

async function saveCookies(page) {
  try {
    console.log("Saving cookies...");
    const currentCookies = await page.cookies();
    fs.writeFileSync("cookies.json", JSON.stringify(currentCookies));
    console.log("Cookies saved.");
  } catch (err) {
    console.error("Error saving cookies:", err);
    await captureScreenshot(page, "error_saving_cookies");
  }
}
// Place your wishlist link here replace this link with your own
async function navigateToWishlist(page) {
  try {
    console.log("Navigating to wishlist URL...");
    await page.goto(
      "https://www.amazon.com/hz/placeyourwishlisthere" 
    );
    console.log("Navigated to wishlist URL.");
  } catch (err) {
    console.error("Error navigating to wishlist URL:", err);
    await captureScreenshot(page, "error_navigating_wishlist");
  }
}

async function addAllToCart(page) {
  try {
    console.log('Clicking "Add all to cart" button...');
    await page.waitForSelector("#add-all-to-cart-btn", {
      visible: true,
      timeout: 20000,
    });
    await page.click("#add-all-to-cart-btn");
    console.log('Clicked "Add all to cart" button.');
  } catch (err) {
    console.error('Error clicking "Add all to cart" button:', err);
    await captureScreenshot(page, "error_add_all_to_cart");
  }
}

async function proceedToCheckout(page) {
  try {
    console.log('Clicking "Proceed to checkout" button...');
    await page.waitForSelector('input[name="proceedToRetailCheckout"]', {
      visible: true,
      timeout: 20000,
    });
    await page.click('input[name="proceedToRetailCheckout"]');
    console.log('Clicked "Proceed to checkout" button.');
  } catch (err) {
    console.error('Error clicking "Proceed to checkout" button:', err);
    await captureScreenshot(page, "error_proceed_to_checkout");
  }
}

async function processOrder(page, name) {
  function delay(time) {
    return new Promise(function (resolve) {
      setTimeout(resolve, time);
    });
  }

  try {
    console.log(`Processing order for: ${name}...`);

    await page.waitForSelector("input#searchBox", {
      visible: true,
      timeout: 20000,
    });
    await page.type("input#searchBox", name, { delay: 100 });
    console.log(`Typed name: ${name}.`);

    console.log(
      "Waiting for 3 seconds before clicking 'Edit delivery preferences'..."
    );
    await delay(3000);
    console.log("Attempting to select 'Edit delivery preferences'...");
    await page
      .locator('div[data-testid="address-row-section"] span span:last-child a')
      .click();
    console.log("Clicked 'Edit delivery preferences'.");
    await page.screenshot({ path: "after_edit_delivery_click.png" });

    console.log("Waiting for 3 seconds before clicking 'Cancel' button...");
    await delay(3000);
    console.log("Waiting for 'Cancel' button and clicking it...");
    await page.waitForSelector(".a-popover-footer .a-button-input", {
      visible: true,
      timeout: 10000,
    });
    await page.click(".a-popover-footer .a-button-input");
    console.log("Clicked 'Cancel' button.");
    await page.screenshot({ path: "after_cancel_click.png" });

    console.log("Waiting for 3 seconds before clicking 'Use this address'...");
    await delay(3000);
    console.log('Clicking "Use this address" button...');
    await page.evaluate(() => {
      const button = document.querySelector(
        'input[data-testid="ab-select-address-continue-button-bottom"]'
      );
      if (button) {
        button.click();
      } else {
        console.error("Could not find the 'Use this address' button.");
      }
    });
    console.log('Clicked "Use this address" button.');

    console.log("Waiting for 3 seconds before clicking 'Place your order'...");
    await delay(3000);
    console.log('Clicking "Place your order" button...');
    // Comment out the actual order placement to allow for debugging comment back in when ready to place actual order 
    // await page.evaluate(() => {
    //   const orderButton = document.querySelector(
    //     'input[name="placeYourOrder1"]'
    //   );
    //   if (orderButton) {
    //     orderButton.click();
    //   } else {
    //     console.error("Could not find the 'Place your order' button.");
    //   }
    // });
    console.log('Clicked "Place your order" button.');

    console.log(`Order processed for: ${name}.`);
  } catch (err) {
    console.error(`Error processing order for ${name}:`, err);
    await captureScreenshot(page, `error_processing_order_${name}`);
  }
}

async function captureScreenshot(page, errorType) {
  const screenshotPath = `./${errorType}.png`;
  await page.screenshot({ path: screenshotPath });
  console.log(`Screenshot captured for ${errorType}: ${screenshotPath}`);
}
// Make sure you use the excel sheet Amazon business provides for bulk ordering after you bulk upload your addresses with the same excel make sure you name it what you have it named here 
async function run() {
  try {
    console.log("Loading Excel file...");
    const workbook = XLSX.readFile("names.xlsx"); 
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Correctly extract names starting from cell B16
    const names = [];
    for (let cell in worksheet) {
      if (
        cell.startsWith("B") &&
        cell !== "B1" &&
        parseInt(cell.substring(1)) >= 16
      ) {
        // Only include cells from B16 onwards
        names.push(worksheet[cell].v);
      }
    }

    console.log("Names read from Excel:", names);

    const browser = await launchBrowser();
    const page = await browser.newPage();

    await loadCookies(page);
    await signIn(page);
    // Log successful order
    const successfulOrders = [];

    for (const name of names) {
      await navigateToWishlist(page);
      await addAllToCart(page);
      await proceedToCheckout(page);
      await processOrder(page, name);
      successfulOrders.push(name); 
    }

    await browser.close();

    // Output successful orders to a text file and console
    fs.writeFileSync("successful_orders.txt", successfulOrders.join("\n"));
    console.log("Successful orders:", successfulOrders);
    // Ensure browser is closed in case of an error
  } catch (err) {
    console.error("Error in the run function:", err);
    if (browser) await browser.close(); 
  }
}

run();
