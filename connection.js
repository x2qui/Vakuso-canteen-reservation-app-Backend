
const mongoose = require('mongoose')

mongoose.connect("mongodb://127.0.0.1:27017/vakuso")
.then(()=> console.log('Server is running'))
.catch(err => console.log(err))
