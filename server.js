import express from "express"
import cors from "cors"

const app = express()

app.use(cors())

const PORT = process.env.PORT || 3000

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36"

app.get("*", async (req, res) => {

  try {

    const endpoint =
      req.path.replace(/^\/+/, "")

    const url =
      `https://www.sofascore.com/api/v1/${endpoint}`

    const response = await fetch(url, {

      headers: {

        "User-Agent": USER_AGENT,

        "Accept": "*/*",

        "Accept-Language":
          "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",

        "Referer":
          "https://www.sofascore.com/",

        "Origin":
          "https://www.sofascore.com"
      }
    })

    const data = await response.text()

    res.setHeader(
      "Content-Type",
      response.headers.get("content-type") ||
      "application/json"
    )

    res.send(data)

  } catch (err) {

    res.status(500).json({
      erro: err.message
    })
  }
})

app.listen(PORT, () => {
  console.log("Servidor online")
})