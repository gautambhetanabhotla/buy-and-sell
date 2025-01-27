import bcrypt from 'bcrypt';

const otp = 111111;
console.log(bcrypt.hashSync(otp.toString(), 15));
