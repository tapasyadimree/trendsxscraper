# Twitter Trends Scraping Project

This project involves web scraping using Selenium and Express to log into a Twitter account, scrape the top 5 trends from the "What's happening" section of the home page, and store the data in a MongoDB database. The scraped trends, along with the date and time of the script run, a unique ID, and the IP address, are displayed on a simple HTML page.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Environment Variables](#environment-variables)
- [Common Issues](#common-issues)

## Prerequisites
- Node.js
- MongoDB
- ChromeDriver (installed and configured)
- Git
- Selenium

## Installation

1. **Clone the repository:**
    ```sh
    git clone https://github.com/tapasyadimree/trendsxscraper.git
    cd trendsxscraper
    ```

2. **Install dependencies:**
    ```sh
    npm install
    ```

3. **Set up environment variables:**
    Create a `.env` file in the root directory and add the following environment variables:
    ```sh
    MY_DATABASE_URI=your_mongodb_connection_string
    PORT=3000
    MY_X_USERNAME=your_twitter_username
    MY_X_PASSWORD=your_twitter_password
    ```

4. **Install ChromeDriver:**
    - Download and install ChromeDriver from the [official site](https://googlechromelabs.github.io/chrome-for-testing/).
    - Ensure ChromeDriver is added to your system's PATH.

## Usage

1. **Start the application:**
    ```sh
    npm run start
    ```

2. **Trigger the scraping script:**
    - Open the HTML page in your browser.
    - Click the button to run the Selenium script.
    - The top 5 Twitter trends will be scraped and displayed on the HTML page, and stored in the MongoDB database.

## Environment Variables
The following environment variables need to be configured:

- `MY_DATABASE_URI`: Your MongoDB connection string.
- `PORT`: Port number for the Express server (default: 3000).
- `MY_X_USERNAME`: Your Twitter username.
- `MY_X_PASSWORD`: Your Twitter password.

## Common Issues

### Chrome Errors
If you encounter errors related to Chrome such as `Chrome failed to start: exited normally`:
- Ensure ChromeDriver is properly installed and added to your system's PATH.

### MongoDB Authentication Issues
If you see authentication errors when connecting to MongoDB:
- Ensure that your connection string is correct and includes the username and password for your MongoDB Atlas account.
- Double-check your environment variables.

