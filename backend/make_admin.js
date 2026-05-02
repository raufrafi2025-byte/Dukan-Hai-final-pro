const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const makeAdmin = async () => {
  const email = process.argv[2];

  if (!email) {
    console.log('Please provide an email: node make_admin.js your@email.com');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    const user = await User.findOne({ email });

    if (user) {
      user.role = 'admin';
      await user.save();
      console.log(`Success! ${email} is now an Admin.`);
    } else {
      console.log('User not found. Make sure you have registered first.');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

makeAdmin();
