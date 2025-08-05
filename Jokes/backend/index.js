const express = require('express')
const app = express()
const port = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/api/jokes', (req, res) => {
    const jokes = [
        {
            id: 1,
            type: "jokes",
            content: "this is jokes"
        },
        {
            id: 2,
            type: "jokes",
            content: "this is second jokes"
        },
        {
            id: 3,
            type: "jokes",
            content: "this is another jokes"
        },
        {
            id: 4,
            type: "jokes",
            content: "this is fourth jokes"
        }
    ]
    res.send(jokes)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})