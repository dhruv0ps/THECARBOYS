// services/adminService.js

const User = require("../config/models/userModel");
const CryptService = require("../services/crypt-service");
const cryptService = new CryptService(); 

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

async function _init_methods() {
    try {
        await createDefaultAdminUser();
    } catch (error) {
        console.log("Something went wrong", error);
    }
}

module.exports = _init_methods;
