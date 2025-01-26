const express = require("express");

var router = express.Router();

var bodyParser = require("body-parser");

module.exports = router;

var jsonParser = bodyParser.json();
router.use(jsonParser);
const userController = require("../controllers/userController")
const {authenticateTokenAdmin} = require("../config/auth")
const  leadController = require("../controllers/leadController");
const  vehicelController = require("../controllers/vehicleController");
const leadCategoryController = require("../controllers/leadCategoryController");
const twiloController = require("../controllers/twiloController");
// auth login 

router.post("/loginUser",userController.loginUser)
router.get('/current', authenticateTokenAdmin, userController.getCurrentUser);
router.post('/logout', authenticateTokenAdmin, userController.logoutUser);
router.get('/user/:id', authenticateTokenAdmin, userController.getUser);
router.get('/user/',  userController.getAllUsers);
router.post('/user/',  userController.createUser);
router.post('/user/:id',  userController.updateUser);

// lead api

router.post("/addlead",leadController.createLead)
router.get("/leads",leadController.getAllLeads)
router.get("/leads/:id",leadController.getSinglelead)
router.put('/leads/:id', leadController.updateLead);
router.delete("/leads/:id",leadController.deleteLead);
router.post("/leaddashboard",leadController.topLead)
// Bulk updates 
router.patch("/leads/bulk-update",leadController.bulkupdates)

// category
router.post("/leadcategory/add",leadCategoryController.createLeadCategory);
router.get("/leadcategory",leadCategoryController.getLeadCategory)
router.get("/leadcategory/:id",leadCategoryController.getLeadCategoryByid);
router.put("/updatecategory/:id",leadCategoryController.updateCategory)
router.delete("/leadcategory/:id", leadCategoryController.deleteCategoryController);


router.post("/vehicles/add",vehicelController.createVehicle)
router.put("/vehicles/:id", vehicelController.updateVehicle);
router.delete("/vehicles/:id", vehicelController.deleteVehicle);
router.get("/vehicles", vehicelController.getAllVehicles);
router.get("/vehicles/:id", vehicelController.getVehicleById);
router.get("/models",vehicelController.getuniqueVehicles)

//sms


router.post("/send-sms/:id",twiloController.sendSMS);