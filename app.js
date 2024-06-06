const express = require('express');
const { Builder, Browser, By, Key, until } = require('selenium-webdriver')
const chrome = require('selenium-webdriver/chrome'); 
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const { error } = require('console');
require('dotenv').config()

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

// Define a route to serve your HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const Schema = mongoose.Schema;
const trendingSchema = new Schema({
    _id: String, // Unique ID for script run
    nameOfTrend1: String,
    nameOfTrend2: String,
    nameOfTrend3: String,
    nameOfTrend4: String,
    nameOfTrend5: String,
    dateTime: Date,
    ipAddress: String
});
const Trending = mongoose.model('Trending', trendingSchema);

// Connect to MongoDB
(async () => {
  try {
    await mongoose.connect(process.env.MY_DATABASE_URI);
    console.log('Connected to Mongo DB');
    app.on("error", (error) =>{
      console.log("ERRRR: ", error);
      throw error;
    })
  } catch (error) {
    console.error("MONGODB CONNECTION ISSUE: ",error)
    throw error;
  }
})()

 
async function runSeleniumScript(ipAddress) {

  let driver = await new Builder().forBrowser('chrome').build();;
  let trendList = [];
  let scriptRunId;
  let currentDate;

  try {
      await driver.manage().setTimeouts({ implicit: 10000 });
      await driver.get('https://x.com/');

      let loginButton = await driver.wait(until.elementLocated(By.xpath('//*[@id="react-root"]/div/div/div[2]/main/div/div/div[1]/div[1]/div/div[3]/div[4]/a')), 10000);
      await driver.wait(until.elementIsVisible(loginButton), 10000);
      await driver.wait(until.elementIsEnabled(loginButton), 10000);

      // Scroll the login button into view and click it
      await driver.executeScript("arguments[0].scrollIntoView();", loginButton);
      await driver.executeScript("arguments[0].click();", loginButton);

      let usernameField = await driver.wait(until.elementLocated(By.xpath('//*[@id="layers"]/div[2]/div/div/div/div/div/div[2]/div[2]/div/div/div[2]/div[2]/div/div/div/div[4]/label/div/div[2]/div/input')), 10000);
      await driver.wait(until.elementIsVisible(usernameField), 10000);
      await driver.wait(until.elementIsEnabled(usernameField), 10000);

      // Scroll the username field into view
      await driver.executeScript("arguments[0].scrollIntoView();", usernameField);
      await usernameField.sendKeys(process.env.MY_X_USERNAME);

      // Wait until the next button is visible and interactable
      let nextButton = await driver.wait(until.elementLocated(By.xpath('//*[@id="layers"]/div/div/div/div/div/div/div[2]/div[2]/div/div/div[2]/div[2]/div/div/div/button[2]')), 10000);
      await driver.wait(until.elementIsVisible(nextButton), 10000);
      await driver.wait(until.elementIsEnabled(nextButton), 10000);

      // Click the next button
      await driver.executeScript("arguments[0].click();", nextButton);

      let passwordButton = await driver.wait(until.elementLocated(By.xpath('//*[@id="layers"]/div[2]/div/div/div/div/div/div[2]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div[3]/div/label/div/div[2]/div[1]/input')), 10000);
      await driver.wait(until.elementIsVisible(passwordButton), 10000);
      await driver.wait(until.elementIsEnabled(passwordButton), 10000);
      await driver.executeScript("arguments[0].scrollIntoView();", passwordButton);
      await passwordButton.sendKeys(process.env.MY_X_PASSWORD);
    
      let logIn = await driver.wait(until.elementLocated(By.xpath('//*[@id="layers"]/div[2]/div/div/div/div/div/div[2]/div[2]/div/div/div[2]/div[2]/div[2]/div/div[1]/div/div/button')), 10000);
      await driver.wait(until.elementIsVisible(logIn), 10000);
      await driver.wait(until.elementIsEnabled(logIn), 10000);
      await driver.executeScript("arguments[0].click();", logIn);

      for (let x = 3; x <= 7; x++) {
        
        let xpath1 = `//*[@id="react-root"]/div/div/div[2]/main/div/div/div/div[2]/div/div[2]/div/div/div/div[4]/div/section/div/div/div[${x}]/div/div/div/div/span`;
        let xpath2 = `//*[@id="react-root"]/div/div/div[2]/main/div/div/div/div[2]/div/div[2]/div/div/div/div[4]/div/section/div/div/div[${x}]/div/div/div/div/span/span`;
        let xpath3 = `//*[@id="react-root"]/div/div/div[2]/main/div/div/div/div[2]/div/div[2]/div/div/div/div[4]/div/section/div/div/div[${x}]/div/div/div/div[2]/div/span`;

        try {
          let element1 = await driver.findElement(By.xpath(xpath1));
          trendList.push(await element1.getText());
          console.log(`Trend ${x-2} found`);
        } catch (e) {
          try {
            let element2 = await driver.findElement(By.xpath(xpath2));
            trendList.push(await element2.getText());
            console.log(`Trend ${x-2} found`);
          } catch (e) {
            try {
              let element3 = await driver.findElement(By.xpath(xpath3));
              trendList.push(await element3.getText());
              console.log(`Trend ${x-2} found`);
            } catch (e) {
              console.log(`Trend ${x-2} not found`);
            }
          }
        }
      }

      console.log('Top 5 Trends:', trendList);

      // Generate unique ID for this script run
      scriptRunId = uuidv4();

      // Store trends and script run details in MongoDB
      currentDate = new Date();

      const trendingData = new Trending({
        _id: scriptRunId,
        nameOfTrend1: trendList[0] || '',
        nameOfTrend2: trendList[1] || '',
        nameOfTrend3: trendList[2] || '',
        nameOfTrend4: trendList[3] || '',
        nameOfTrend5: trendList[4] || '',
        dateTime: currentDate,
        ipAddress: ipAddress
      });
      await trendingData.save();

      // Log script run details
      console.log('Script Run ID:', scriptRunId);
      console.log('Date and Time:', currentDate);
      console.log('IP Address:', ipAddress);

      return {
        _id: scriptRunId,
        nameOfTrend1: trendList[0] || '',
        nameOfTrend2: trendList[1] || '',
        nameOfTrend3: trendList[2] || '',
        nameOfTrend4: trendList[3] || '',
        nameOfTrend5: trendList[4] || '',
        dateTime: currentDate,
        ipAddress: ipAddress
      };
  } finally {
    await driver.quit()
  }
}

// Define a route to handle task execution
app.post('/runtask', async (req, res) => {
  try {
      const ipAddress = req.ip;
      const result = await runSeleniumScript(ipAddress);
      res.json(result);
  } catch (error) {
      console.error('Error executing task:', error);
      res.status(500).send('Error executing task');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});