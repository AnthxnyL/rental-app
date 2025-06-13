import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cron from 'node-cron';
import router from './router.js'
import { generateQuittancesForAllTenants } from './services/pdfService.js';


const app = express()
const port = 3000


app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(router)

cron.schedule('0 2 1 * *', async () => {
  console.log('Génération automatique des quittances (toutes les 5 minutes)...');
  try {
    await generateQuittancesForAllTenants();
    console.log('Toutes les quittances ont été générées.');
  } catch (error) {
    console.error('Erreur lors de la génération automatique des quittances :', error);
  }
});

app.get('/', (req, res) => {
  res.send('Welcome to the Rental App API')
}
)



app.listen(port, () => {
  console.log(`Server is running on port 3000`)
})