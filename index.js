require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/about', (req, res) => {
    res.send('about page')
} )

app.get('/login', (req, res) => {
    res.send("you're loged in")
})
app.get('/home', (req, res) => {
    res.send(`this is my home: ${process.env.SOC}`)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
