// services/adminService.js

const User = require("../config/models/userModel");
const CryptService = require("../services/crypt-service");
const cryptService = new CryptService(); 
const Lead = require("../config/models/leadModel");

async function createDefaultAdminUser() {
    const userCount = await User.countDocuments();

    if (userCount === 0) {
        let crypted_pass = await cryptService.cryptify("Admin5656"); // Fix typo and use instance method
        await User.create({
            username: "Admin",
            email: "admin@example.com",
            password: crypted_pass,
            role: "ADMIN",
        });
        console.log("Default admin user created");
    }
}
async function clearAllLeads() {
    try {
        const result = await Lead.deleteMany({});
        console.log(`All leads deleted: ${result.deletedCount} leads removed`);
        return result;
    } catch (error) {
        console.error("Error clearing all leads:", error);
        throw error;
    }
}
async function _init_methods() {
    try {
        await createDefaultAdminUser();
        // await clearAllLeads();
    } catch (error) {
        console.log("Something went wrong", error);
    }
}

module.exports = _init_methods;
