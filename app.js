const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const port = 3000;
process.env.SECRET_KEY = 'Teks160503T456t678*';
const app = express();

app.use(bodyParser.json({limit: '50mb'}));
app.use(cors());

const users = require('./routers/users');
app.use('/api/users', users);
const clientServers = require('./routers/clientServers');
app.use('/api/clientservers', clientServers);
const currentShiftEvents = require('./routers/currentShiftEvents');
app.use('/api/currentshiftevents', currentShiftEvents);

app.listen(port, () => {
   console.log('Server ' + port + ' port üzerinden başlatıldı');
});

