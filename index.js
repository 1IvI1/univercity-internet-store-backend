const express = require("express")
const PORT = 4000

const app = express()

app.get("/", async (req, res) => {
    res.json({message: "hello"})
})

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`)
})