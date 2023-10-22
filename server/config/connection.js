const mongoose = require('mongoose');

let connectionString;

if (process.env.NODE_ENV === 'production') {
  connectionString = process.env.MONGODB_CONNECTION_STRING;
} else {
  connectionString = process.env.MONGODB_URI_LOCAL || 'mongodb://127.0.0.1:27017/deep-thoughts';
}


console.log('checking connection string: ', connectionString);
mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = mongoose.connection;
