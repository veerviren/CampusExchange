const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash('12345', 10);

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: 'admin@gmail.com' }
        });

        if (existingUser) {
            console.log('Admin user already exists. Updating password...');
            await prisma.user.update({
                where: { email: 'admin@gmail.com' },
                data: {
                    pass: hashedPassword,
                    isVerified: true
                }
            });
            console.log('✅ Admin user password updated successfully!');
        } else {
            // Create new admin user
            const user = await prisma.user.create({
                data: {
                    email: 'admin@gmail.com',
                    pass: hashedPassword,
                    name: 'Admin User',
                    age: 25,
                    isVerified: true,
                    verificationToken: null,
                    verificationExpires: null
                }
            });
            console.log('✅ Admin user created successfully!');
            console.log('User ID:', user.id);
        }

        console.log('\nTest Credentials:');
        console.log('Email: admin@gmail.com');
        console.log('Password: 12345');

    } catch (error) {
        console.error('Error creating admin user:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
