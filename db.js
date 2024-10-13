const mongoose = require('mongoose');

const dbUri = `mongodb+srv://sangeethakamaraj6:lKuhLxlMrKccdhTt@cluster0.kvq1y.mongodb.net/`

const connectDb = async () => {
    if (mongoose.connection.readyState === 1) return;
    await mongoose.connect(dbUri);
    console.log(mongoose.connection.readyState);
}

module.exports = { connectDb, mongoose };