const app = require('./app')
//const withDB = require('./db')
const mongoose = require('mongoose')
const PORT = process.env.PORT || 5005
const withDB = require('./db')
// ℹ️ Sets the PORT for our app to have access to it. If no env has been set, we hard code it to 5005
/*const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/restAPI'

// ℹ️ Connects to the database
const withDB = async serverListener => {
  try {
    const x = await mongoose.connect(MONGO_URI)
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
    if (typeof serverListener === 'function') {
      serverListener()
    }
  } catch (error) {
    console.error('Error connecting to mongo: ', err)
  }
}
*/
//module.exports = withDB
withDB(() => {app.listen(PORT, ()=>{console.log(`server listening on http://localhost:${PORT}` )})})