const crypto = require('crypto');
const key = Buffer.from("0123456789abcdef0123456789abcdef"); // 256-bit key
const iv = Buffer.from("I8zyA4lVhMCaJ5Kg");

// const key = crypto.randomBytes(32); // 256-bit key
// const iv = crypto.randomBytes(16);  // 128-bit IV

exports.encrypt = (datas) => {

    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(datas, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

exports.decrypt = (datas) => {
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(datas, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted;
}



