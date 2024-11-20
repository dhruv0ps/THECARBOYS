const userServices = require('../services/UserService');

const createUser = async (req, res) => {
    try {
        const user = await userServices.createUser(req.body);
        return res.json({ status: true, data: user, err: {} });
    } catch (error) {
        console.log(error)
        return res.json({ status: false, data: {}, err: error.message });
    }
};
const getAllUsers = async (req, res) => {
    try {
        const user = await userServices.get_all_users();
        if (user) {
            return res.json({ status: true, data: user, err: {} });
        } else {
            return res.json({ status: false, data: {}, err: 'no user found' });
        }
    } catch (error) {
        return res.json({ status: false, data: {}, err: error.message });
    }
};

const getUser = async (req, res) => {
    try {
        const user = await userServices.getUserById(req.params.id);
        if (user) {
            return res.json({ status: true, data: user, err: {} });
        } else {
            return res.json({ status: false, data: {}, err: 'User not found' });
        }
    } catch (error) {
        return res.json({ status: false, data: {}, err: error.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const user = await userServices.updateUser(req.params.id, req.body);
        if (user) {
            return res.json({ status: true, data: user, err: {} });
        } else {
            return res.json({ status: false, data: {}, err: 'User not found' });
        }
    } catch (error) {
        return res.json({ status: false, data: {}, err: error.message });
    }
};
const getCurrentUser = async (req, res) => {
    try {
        // console.log(req.user)
        const userId = req.user._id;
        const user = await userServices.getCurrentUser(userId);
        if (user) {
            return res.status(200).json({ status: true, data: user, err: {} });
        } else {
            return res.status(401).json({ status: false, data: {}, err: 'User not found' });
        }
    } catch (error) {
        return res.json({ status: false, data: {}, err: error.message });
    }
};

const logoutUser = async (req, res) => {
    try {
        return res.json({ status: true, message: 'Logged out successfully', err: {} });
    } catch (error) {
        return res.json({ status: false, data: {}, err: error.message });
    }
};

const loginUser = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ status: false, data: {}, err: "Incomplete arguments received." })
    }
    try {
        let info = await userServices.login_user_by_email(email, password)
        if (info)
            return res.status(200).json({ status: true, data: info, err: {} })
        else
            throw new Error("Something Went Wrong.")
    } catch (error) {
        return res.status(400).json({ status: false, data: {}, err: error })
    }
}

module.exports = {
    createUser,
    getUser,
    updateUser,
    getAllUsers,
    logoutUser,
    getCurrentUser,
    loginUser
};