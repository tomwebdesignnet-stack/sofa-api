import express from "express"
import cors from "cors"

import playwright from "playwright-extra"
import stealth from "puppeteer-extra-plugin-stealth"

playwright.use(stealth())

const app = express()

app.use(cors())

const PORT = process.env.PORT || 3000

let browser

async function getBrowser() {

  if (!browser) {

    browser = await playwright.chromium.launch({

      headless: true,

      args: [

        "--no-sandbox",

        "--disable-setuid-sandbox",

        "--disable-blink-features=AutomationControlled"
      ]
    })
  }

  return browser
}

app.get("*", async (req, res) => {

  try {

    const endpoint =
      req.path.replace(/^\/+/, "")

    if (!endpoint) {

      return res.status(400).json({
        erro: "endpoint vazio"
      })
    }

    const browser = await getBrowser()

    const page = await browser.newPage({

      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36"
    })

    await page.goto(
      "https://www.sofascore.com",
      {
        waitUntil: "domcontentloaded"
      }
    )

    const url =
      `https://www.sofascore.com/api/v1/${endpoint}`

    const result = await page.evaluate(async (url) => {

      const response = await fetch(url, {

        headers: {

          "Accept": "*/*",

          "Referer":
            "https://www.sofascore.com/",

          "Origin":
            "https://www.sofascore.com"
        }
      })

      return {

        status: response.status,

        text: await response.text()
      }

    }, url)

    await page.close()

    res.setHeader(
      "Content-Type",
      "application/json"
    )

    res.send(result.text)

  } catch (err) {

    res.status(500).json({
      erro: err.message
    })
  }
})

app.listen(PORT, () => {

  console.log("Servidor online")
})
