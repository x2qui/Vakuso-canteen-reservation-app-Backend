
const mongoose = require('mongoose')

mongoose.connect("mongodb://***/vakuso")
.then(()=> console.log('Server is running'))
.catch(err => console.log(err))
