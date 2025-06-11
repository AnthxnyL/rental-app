import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import router from './router.js'


const app = express()
const port = 3000


app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(router)

app.get('/', (req, res) => {
  res.send('Welcome to the Rental App API')
}
)



app.listen(port, () => {
  console.log(`Server is running on port 3000`)
})