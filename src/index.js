const express = require("express")
const PORT = 4000
const databaseConnector = require("./database/DatabaseConnector")
const jwtRequests = require("./requests/jwt/JwtTokenRequests")
const bodyParser = require("body-parser")

// databaseConnector()
const app = express()

app.use(bodyParser.json())

app.get("/", async (req, res) => {
    res.json({message: "hello"})
})

app.use("/login", jwtRequests)

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`)
})