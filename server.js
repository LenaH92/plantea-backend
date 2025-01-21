const app = require('./app')
//const withDB = require('./db')
const mongoose = require('mongoose')
const PORT = process.env.PORT || 5005
const withDB = require('./db')
// ℹ️ Sets the PORT for our app to have access to it. If no env has been set, we hard code it to 5005

withDB(() => {app.listen(PORT, ()=>{console.log(`server listening on http://localhost:${PORT}` )})})