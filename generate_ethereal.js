const nodemailer = require('nodemailer');

async function main() {
    let testAccount = await nodemailer.createTestAccount();

    console.log('EMAIL_USER=' + testAccount.user);
    console.log('EMAIL_PASS=' + testAccount.pass);
}

main().catch(console.error);
