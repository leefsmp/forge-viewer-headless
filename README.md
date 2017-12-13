# About that sample

Forge Viewer Headless Test: This runs Forge Viewer in Chrome headless mode using [Puppeteer](https://github.com/GoogleChrome/puppeteer).
Illustrates how to take a valid screenshot of a Forge Model.

![thumbnail](puppet.jpeg)

## setup

 * npm install
 * URN=your-model-URN... [IMGPATH=screenshot-path...] FORGE_CLIENT_ID=xxxx FORGE_CLIENT_SECRET=xxxx npm run bin/run.js


## code

```
import puppeteer from 'puppeteer'
import Forge from 'forge-apis'
import 'babel-polyfill'
import path from 'path'

// Fetch Forge token
const getToken = () => {

  const scope = [
    'viewables:read'
  ]

  const oAuth2TwoLegged = new Forge.AuthClientTwoLegged(
    process.env.FORGE_CLIENT_ID,
    process.env.FORGE_CLIENT_SECRET,
    scope)

  return oAuth2TwoLegged.authenticate()
}

// Runs the test
(async () => {

  // Using the workaround to run chrome with
  // WebGL enabled
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      '--hide-scrollbars',
      '--mute-audio',
      '--headless'
    ]
  })

  try {

    // assumes files are in ./test relative directory
    // chrome doesn't support relative path
    const filename = path.resolve(__dirname, './test/viewer.html')

    const token = await getToken()

    // assumes URN is defined in ENV var
    const urn = process.env.URN

    const url = `file://${filename}?accessToken=${token.access_token}&urn=${urn}`

    const page = await browser.newPage()

    await page.goto(url)

    // waits for .geometry-loaded class being added
    await page.mainFrame().waitForSelector(
      '.geometry-loaded', {
        timeout: 30000
      })

    // saves screenshot in process.env.IMGPATH
    // or defaults to test.png
    await page.screenshot({
      path: process.env.IMGPATH || 'test.png'
    })

    console.log('Test sucessful :)')

  } catch (ex) {

    console.log('Test failed :(')
    console.log(ex)

  } finally {

    await browser.close()
  }
})()
```