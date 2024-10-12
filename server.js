const app = require('./app');
const dotEnv = require('dotenv');
const mongoose = require('mongoose');
dotEnv.config({ path: './config.env' });

const PORT = process.env.PORT || 4000;
const DB = process.env.DB.replace('<password>', process.env.DB_PASSWORD);

mongoose.connect(DB).then(conn => {
  console.log('Connected to DB');
});
app.listen(PORT, () => {
  console.log('Server started ', PORT);
});
