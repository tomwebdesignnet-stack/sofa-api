import express from "express"
import cors from "cors"
import { chromium } from "playwright"

const app = express()

app.use(cors())

const PORT = process.env.PORT || 3000

let browser

async function getBrowser() {

  if (!browser) {

    browser = await chromium.launch({
      headless: true
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

    const url =
      `https://www.sofascore.com/api/v1/${endpoint}`

    const data = await page.evaluate(async (url) => {

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
        body: await response.text()
      }

    }, url)

    await page.close()

    res.setHeader(
      "Content-Type",
      "application/json"
    )

    res.send(data.body)

  } catch (err) {

    res.status(500).json({
      erro: err.message
    })
  }
})

app.listen(PORT, () => {

  console.log("Servidor online")
})
