const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash('12345', 10);

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: 'admin1@gmail.com' }
        });

        if (existingUser) {
            console.log('Admin1 user already exists. Updating password...');
            await prisma.user.update({
                where: { email: 'admin1@gmail.com' },
                data: {
                    pass: hashedPassword,
                    isVerified: true
                }
            });
            console.log('✅ Admin1 user password updated successfully!');
        } else {
            // Create new admin user
            const user = await prisma.user.create({
                data: {
                    email: 'admin1@gmail.com',
                    pass: hashedPassword,
                    name: 'Admin One',
                    age: 30,
                    isVerified: true,
                    verificationToken: null,
                    verificationExpires: null
                }
            });
            console.log('✅ Admin1 user created successfully!');
            console.log('User ID:', user.id);
        }

        console.log('\nTest Credentials:');
        console.log('Email: admin1@gmail.com');
        console.log('Password: 12345');

    } catch (error) {
        console.error('Error creating admin1 user:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
