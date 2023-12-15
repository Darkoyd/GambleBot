import express from 'express';

import cmd from 'node-cmd'
import crypto from 'crypto'
import bodyParser from 'body-parser'

import { VerifyDiscordRequest } from "./src/discord/utils.js";

import router from './src/discord/bot.js'


const app = express();


app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));

app.use(express.static('public'));
app.use(bodyParser.json());

const onWebhook = (req, res) => {
  let hmac = crypto.createHmac('sha1', process.env.SECRET);
  let sig  = `sha1=${hmac.update(JSON.stringify(req.body)).digest('hex')}`;

  if (req.headers['x-github-event'] === 'push' && sig === req.headers['x-hub-signature']) {
    cmd.run('chmod 777 ./git.sh'); 
    
    cmd.get('./git.sh', (err, data) => {  
      if (data) {
        console.log(data);
      }
      if (err) {
        console.log(err);
      }
    })

    cmd.run('refresh');
  }

  return res.sendStatus(200);
}

app.post('/git', onWebhook);

app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.use('/', router)

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
