const router = require('express').Router();

// Bring in the User Registration, Authentication
const { checkRole, serializeUser, userRegister, userLogin , userAuth}= require("../utilities/Auth");

//----------------------------------------------------------

// Admin Registration Route
router.post("/register-admin", async (req, res) => {
    await userRegister(req.body, 'admin', res);
});

// Manager Registration Route
router.post("/register-manager", async (req, res) => {
    await userRegister(req.body, 'manager', res);
});

//------------------------------------------------------------

// Admin Login Route
router.post("/login-admin", async (req, res) => {
    await userLogin(req.body, 'admin', res);
});

// Manager Login Route
router.post("/login-manager", async (req, res) => {
    await userLogin(req.body, 'manager', res);
});

//-------------------------------------------------------------

//General Router
router.get("/profile", userAuth, async (req, res) => {
    res.json(serializeUser(req.user));
});


// Admin Protected Route
router.get("/protected-admin", userAuth, checkRole(['admin']), async (req, res) => {
    res.json({
        message: " Admin Protected Route",
        success: true
    })
});

// Manager Protected Route
router.get("/protected-manager", userAuth,checkRole(['manager']), async (req, res) => {
    res.json({
        message: "Manager Protected Route",
        success: true
    })
});

//----------------------------------------------------------------------------


module.exports= router;