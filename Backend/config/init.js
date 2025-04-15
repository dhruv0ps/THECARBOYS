// services/adminService.js

const User = require("../config/models/userModel");
const CryptService = require("../services/crypt-service");
const cryptService = new CryptService(); 
const Lead = require("../config/models/leadModel");
const Counter = require("../config/models/counterModel")

async function createDefaultAdminUser() {
    const userCount = await User.countDocuments();

    if (userCount === 0) {
        let crypted_pass = await cryptService.cryptify("Z2x1c4v3#aws"); 
        await User.create({
            username: "Admin",
            email: "tanveer@thecarboys.ca",
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
async function clearAllCounters() {
    try {
        const result = await Counter.deleteMany({});
        console.log(`All counters deleted: ${result.deletedCount} counters removed`);
        return result;
    } catch (error) {
        console.error("Error clearing all counters:", error);
        throw error;
    }
}

async function _init_methods() {
    try {
        await createDefaultAdminUser();
        // await clearAllLeads();
        // await clearAllCounters();
    } catch (error) {
        console.log("Something went wrong", error);
    }
}

module.exports = _init_methods;
