import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

dotenv.config();

const migratePasswords = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const users = await User.find({});
        console.log(`Found ${users.length} users. Checking for unhashed passwords...`);

        let updatedCount = 0;

        for (const user of users) {
            // Check if password looks like a bcrypt hash (starts with $2a$ or $2b$ and 60 chars long)
            const isHashed = (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) && user.password.length === 60;

            if (!isHashed) {
                console.log(`Hashing password for user: ${user.email}`);
                // Since we added a pre-save hook in User model, simply saving the user will hash the password
                // However, we need to mark the password as modified if we were just setting it.
                // But since the pre-save hook checks `isModified('password')`, we need to trigger it.
                // Actually, re-assigning the same password MIGHT not trigger isModified if mongoose is smart.
                // Let's explicitly set it to trigger the hook.

                // Wait, if I just do user.save(), the pre-save hook will run.
                // The pre-save hook says: `if (!this.isModified('password')) { next(); }`
                // So if we don't change the password field, it won't hash it.
                // We need to "dirty" the password field.

                // A workaround is to manually hash it here or set it to itself and mark modified.
                // But the cleanest way given our pre-save hook is:
                // user.password = user.password; // this might not be enough for mongoose to detect change
                // user.markModified('password');
                // await user.save();

                // BUT, our pre-save hook does hashing. If we mark modified, it will hash the PLAIN text.
                // Which is exactly what we want!

                user.markModified('password');
                await user.save();
                updatedCount++;
            }
        }

        console.log(`Migration complete. Updated ${updatedCount} users.`);
        process.exit();
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

migratePasswords();
