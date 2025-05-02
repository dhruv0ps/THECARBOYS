const express = require("express");

var router = express.Router();

var bodyParser = require("body-parser");

module.exports = router;

var jsonParser = bodyParser.json();
router.use(jsonParser);
const userController = require("../controllers/userController")
const { authenticateTokenAdmin } = require("../config/auth")
const leadController = require("../controllers/leadController");
const vehicelController = require("../controllers/vehicleController");
const leadCategoryController = require("../controllers/leadCategoryController");
const twiloController = require("../controllers/twiloController");
const fileUpload = require("../config/multerConfig");
// auth login 

router.post("/loginUser", userController.loginUser)
router.get('/current', authenticateTokenAdmin, userController.getCurrentUser);
router.post('/logout', authenticateTokenAdmin, userController.logoutUser);
router.get('/user/:id', authenticateTokenAdmin, userController.getUser);
router.get('/user/', authenticateTokenAdmin, userController.getAllUsers);
router.post('/user/', authenticateTokenAdmin, userController.createUser);
router.post('/user/:id', authenticateTokenAdmin, userController.updateUser);
router.delete('/user/:id', authenticateTokenAdmin, userController.deleteUser);

// lead api

router.post("/addlead", authenticateTokenAdmin, leadController.createLead)
router.get("/leads", authenticateTokenAdmin, leadController.getAllLeads)
router.get("/leads/:id", authenticateTokenAdmin, leadController.getSinglelead)
router.put('/leads/:id', authenticateTokenAdmin, leadController.updateLead);
router.delete("/leads/:id", authenticateTokenAdmin, leadController.deleteLead);
router.post("/leaddashboard", authenticateTokenAdmin, leadController.topLead)
// Bulk updates 
router.patch("/leads/bulk-update", authenticateTokenAdmin, leadController.bulkupdates)
router.post("/lead/bulkupload", authenticateTokenAdmin, fileUpload.single('file'), leadController.bulkUpload)
// category
router.post("/leadcategory/add", authenticateTokenAdmin, leadCategoryController.createLeadCategory);
router.get("/leadcategory", authenticateTokenAdmin, leadCategoryController.getLeadCategory)
router.get("/leadcategory/:id", authenticateTokenAdmin, leadCategoryController.getLeadCategoryByid);
router.put("/updatecategory/:id", authenticateTokenAdmin, leadCategoryController.updateCategory)
router.delete("/leadcategory/:id", authenticateTokenAdmin, leadCategoryController.deleteCategoryController);

router.post("/vehicles/add", authenticateTokenAdmin, vehicelController.createVehicle)
router.post("/vehicle-bulkupload", authenticateTokenAdmin, fileUpload.single("file"), vehicelController.bulkUpload)
router.put("/vehicles/:id", authenticateTokenAdmin, vehicelController.updateVehicle);
router.delete("/vehicles/:id", authenticateTokenAdmin, vehicelController.deleteVehicle);
router.get("/vehicles", authenticateTokenAdmin, vehicelController.getAllVehicles);
router.get("/vehicles/:id", authenticateTokenAdmin, vehicelController.getVehicleById);
router.get("/models", authenticateTokenAdmin, vehicelController.getuniqueVehicles)

//sms


