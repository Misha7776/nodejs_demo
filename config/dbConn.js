const { ca } = require('date-fns/locale');
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI)
  } catch (error) {
    console.log(error.message);
  }
}

module.exports = connectDB;