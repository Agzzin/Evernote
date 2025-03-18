const mongoose =  require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/javascriptNote', {
    autoIndex: true
}).then(() => {
    console.log('Database connected');
}).catch((err) => {
    console.log('Error connecting to database: ', err);
})
