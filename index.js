const cors = require('cors');
const exp = require('express');
const bp = require('body-parser');
const {connect} = require('mongoose');
const {success, error} = require('consola');
const passport = require('passport');

// App constants
const {DB, PORT} = require("./config");
// initialize the app
const app = exp();

// Middlewares
app.use(cors());
app.use(bp.json());
app.use(passport.initialize());


require('./middleware/passport')(passport);



// User Router Middleware
app.use('/api/users', require('./routes/users'));



// wrapper for async
const startApp = async () =>
{
    try
    {
        // Moongo DB connection
        await connect(DB,
            {
                useFindAndModify: true,
                useUnifiedTopology: true,
                useNewUrlParser: true
            });
        success(
            {message: ` Connected to DB \n${DB}`, badge: true});
        // Port listening start
        app.listen(PORT, () => success({message: `Server started ${PORT}`, badge: true}));
    }
    catch (err) {
        error({
            message: `Connection Error with DB\n${err}`, badge: true
        });
            startApp();
    }
};

startApp();