import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cron from 'node-cron';
import router from './router.js'
import { sendQuittanceMailToAll } from './services/mailerService.js';


const app = express()
const port = 3000


app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(router)

cron.schedule('0 2 28-31 * *', async () => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  // Si demain est le 1er, alors aujourd'hui est le dernier jour du mois
  if (tomorrow.getDate() === 1) {
    try {
      await sendQuittanceMailToAll();
      console.log('Mails envoyés le dernier jour du mois');
    } catch (error) {
      console.error('Erreur lors de l\'envoi des mails :', error);
    }
  }
});

app.get('/', (req, res) => {
  res.send('Welcome to the Rental App API')
}
)



app.listen(port, () => {
  console.log(`Server is running on port 3000`)
})