// 1. Dependencies, settings and initialise app ------
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const exjwt = require('express-jwt');
const secretSalt = 'ahrwes89dfg7vz8rsg7dfvswzredgvfc879f3';
const Utils = require('./Utils.js');
const port = process.env.PORT || 8081;
const app = express();

// Enable CORS for all HTTP methods
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
 });

// 2. Middleware ------
// Body Parser
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

// json web token middleware
const jwtMW = exjwt({ secret: secretSalt });

// 3. Run server on port -----------
app.listen(port, () => {
    console.log(`running on port ${port}`);
});

// 4. Database Connection --------
mongoose.connect(
    'mongodb+srv://James:CoolEgg123@cluster0.sg99p.mongodb.net/PartsSite?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => {
        console.log("Connected to mongodb");
    })
    .catch(err => {
        console.log('Problem connecting to mongodb. Exiting...', err);
        process.exit();
    });




// 5. Models ----------
let Part = require('./models/Part.js');
let User = require('./models/User.js');
let Category = require('./models/Category.js');
let Vehicle = require('./models/Vehicle.js');

// 6. Routes ------------
// Homepage
app.get('/', (req, res) => {
    res.send("This is the homepage!");
});

// ************************ //
// ***** PARTS ROUTES ***** //
// ************************ //

// Parts - GET - get all parts
app.get('/api/parts/', (req, res) => {
    // check if the request url has ids param
    if(req.query.ids){
        // get only books that have those ids
        let idsArray = req.query.ids.split(',');
        Part.find({_id: {
            $in: idsArray
        }})
        .then((parts) => {
            if(parts.length == 0){
                res.status(400).send({ msg: 'No parts found'});
            }else{
                res.json(parts);
            }
       })
       .catch((err) => {
            console.log(err);
            res.status(500).send({
                msg: 'Problem finding parts',
                error: err.message
            });
       });

    }else if(req.query.category){
        // if category parameter is in query, get only parts form that category id
        Part.find({category_id: mongoose.Types.ObjectId(req.query.category)})
           
        .then((parts) => {
            if(parts.length == 0){
                res.status(400).send({ msg: 'No parts found'});
            }else{
                res.json(parts);
            }
       })
       .catch((err) => {
            console.log(err);
            res.status(500).send({
                msg: 'Problem finding parts',
                error: err.message
            });
       });

       }else if(req.query.vehicle){
        // if vehicle parameter is in query, get only parts form that vehicle id
        Part.find({vehicle_id: mongoose.Types.ObjectId(req.query.vehicle)})
           
        .then((parts) => {
            if(parts.length == 0){
                res.status(400).send({ msg: 'No parts found'});
            }else{
                res.json(parts);
            }
       })
       .catch((err) => {
            console.log(err);
            res.status(500).send({
                msg: 'Problem finding parts',
                error: err.message
            });
       });

    }else if(req.query.name){
        // if name parameter is in query, get only parts from that name
        Part.find({part_name_id: mongoose.Types.ObjectId(req.query.name)})
           
        .then((parts) => {
            if(parts.length == 0){
                res.status(400).send({ msg: 'No parts found'});
            }else{
                res.json(parts);
            }
       })
       .catch((err) => {
            console.log(err);
            res.status(500).send({
                msg: 'Problem finding parts',
                error: err.message
            });
       });

    }else{
        // get all the parts
        Part.find({})
        .then((parts) => {
             if(parts.length == 0){
                 res.status(400).send({ msg: 'No parts found'});
             }else{
                 res.json(parts);
             }
        })
        .catch((err) => {
             console.log(err);
             res.status(500).send({
                 msg: 'Problem finding parts',
                 error: err.message
             });
        });
    }
    


  
});

// Parts - POST - create part
app.post("/api/parts", (req, res) =>{
    if(!req.body) {
        res.status(400).send({msg: "Part content can't be empty"});
    }else{
        let newPart = new Part(req.body);
        newPart.save()
        .then((part) => {
            res.status(201).json(part);
        }).catch(err => {
            console.log(err);
            res.status(500).send({msg: "Couldn't create part"});
        });
        }
});

// Parts - GET - get single part
app.get("/api/parts/:id", (req, res) =>{
    Part.findById(req.params.id)
    .then((part) => {
        res.json(part);
    })
    .catch((err) => {
        console.log(err);
        if(err.kind == 'ObjectId'){
            res.status(404).send({ msg: 'part not found' });
        }else{
            res.status(500).send({
                msg: 'Problem finding parts',
                error: err.message
            });
        }
});

// Parts - PUT - Update part
app.put('/api/parts/:id', (req, res) => {
  if(!req.body) {
      res.status(400).send({msg: "Part content can't be empty"});
  }else{
      Part.findByIdAndUpdate(req.params.id, req.body, {new: true})
      .then((part)=> {
          res.json(part);
      })
      .catch((err) => {
          console.log(err);
          if(err.kind == 'ObjectId'){
              res.status(404).send({ msg: 'part not found'});
          }else{
              res.status(500).send({
                  msg: 'Problem updating part',
                  error: err.message
              });
          }
      });
  }
});
});

// Parts - DELETE - Delete parts
app.delete('/api/parts/:id', (req, res) => {
   Part.findByIdAndRemove(req.params.id)
   .then((part)=>{
       res.send({msg: "Part deleted"});
   })
   .catch((err) => {
       console.log(err);
       if(err.kind == 'ObjectId'){
           res.status(404).send({ msg: 'part not found'});
       }else{
           res.status(500).send({
               msg: 'Problem deleting part',
               error: err.message
           });
       }
   });
});

// ************************ //
// **** CATEGORY ROUTES ****//
// *************************//
app.get('/api/categories', (req, res) => {
    Category.find({})
    .then((categories) => {
        if(!categories){
            res.status(400).send({ msg: 'No categories found'});
        }else{
            res.json(categories);
        }
})
    .catch((err) => {
        console.log(err);
        res.status(500).send({
            msg: 'Problem finding category',
            error: err.message
        });
    });
});


// ************************ //
// ****** NAME ROUTES ******//
// *************************//
app.get('/api/part_names', (req, res) => {
    Name.find({})
    .then((names) => {
        if(!names){
            res.status(400).send({ msg: 'No categories found'});
        }else{
            res.json(names);
        }
})
    .catch((err) => {
        console.log(err);
        res.status(500).send({
            msg: 'Problem finding name',
            error: err.message
        });
    });
});

// ************************ //
// **** VEHICLE  ROUTES ****//
// *************************//
app.get('/api/vehicles', (req, res) => {
    Vehicle.find({})
    .then((vehicles) => {
        if(!vehicles){
            res.status(400).send({ msg: 'No vehicles found'});
        }else{
            res.json(vehicles);
        }
})
    .catch((err) => {
        console.log(err);
        res.status(500).send({
            msg: 'Problem finding vehicle',
            error: err.message
        });
    });
});



// ************************ //
// ***** USERS ROUTES ***** //
// ************************ //

// Users - GET - get all users
app.get('/api/users/', (req, res) => {
   User.find({})
   .then((users) => {
        if(users.length == 0){
            res.status(400).send({ msg: 'No users found'});
        }else{
            res.json(users);
        }
   })
   .catch((err) => {
        console.log(err);
        res.status(500).send({
            msg: 'Problem finding users',
            error: err.message
        });
   });
});

// Users - POST - create user
app.post("/api/users", (req, res) =>{
    if(!req.body) {
        res.status(400).send({msg: "User content can't be empty"});
    }else{
        let newUser = new User(req.body);
        newUser.save()
        .then((user) => {
            res.status(201).json(user);
        }).catch(err => {
            console.log(err);
            res.status(500).send({msg: "Couldn't create user"});
        });
        }
});

// Users - GET - get single user
app.get("/api/users/:id", (req, res) =>{
    User.findById(req.params.id)
    .then((user) => {
        res.json(user);
    })
    .catch((err) => {
        console.log(err);
        if(err.kind == 'ObjectId'){
            res.status(404).send({ msg: 'user not found' });
        }else{
            res.status(500).send({
                msg: 'Problem finding users',
                error: err.message
            });
        }
});

// Users - PUT - Update user
app.put('/api/users/:id', (req, res) => {
  if(!req.body) {
      res.status(400).send({msg: "User content can't be empty"});
  }else{
      User.findByIdAndUpdate(req.params.id, req.body, {new: true})
      .then((user)=> {
          res.json(user);
      })
      .catch((err) => {
          console.log(err);
          if(err.kind == 'ObjectId'){
              res.status(404).send({ msg: 'user not found'});
          }else{
              res.status(500).send({
                  msg: 'Problem updating user',
                  error: err.message
              });
          }
      });
  }
});
});

// Users - DELETE - Delete users
app.delete('/api/users/:id', (req, res) => {
   User.findByIdAndRemove(req.params.id)
   .then((user)=>{
       res.send({msg: "User deleted"});
   })
   .catch((err) => {
       console.log(err);
       if(err.kind == 'ObjectId'){
           res.status(404).send({ msg: 'user not found'});
       }else{
           res.status(500).send({
               msg: 'Problem deleting user',
               error: err.message
           });
       }
   });
});


// ************************ //
// ***** AUTH  ROUTES ***** //
// ************************ //

// Auth - signIn
app.post('/api/auth/signin', (req, res ) => {
    // 1. check if email and password are empty
    if(!req.body.email || !req.body.password){
        // send a 400 status response and message
        res.status(400).json({
            message: "No email / password provided"
        });
        return;
    }
    // 2. continue to check credentials
    // find the user in the database
    User.findOne({email: req.body.email})
    .then(user => {
        // check account doesn't exist
        if(user == null){
            res.status(400).json({
                message: 'No account found'
            });
            return;
        }
        //3. user exists, now check password
        if(Utils.verifyHash(req.body.password, user.password)){
            // SUCCESS! credentials matching
            // 1. create JWT token
            let token = jwt.sign(
            {
                _id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                vehicle: user.vehicle,
                vehicle_img: user.vehicle_img,
            },
            secretSalt,
            { expiresIn: 60 * 60 }
            );
            // 2. strip the password from the user object
            // should never send password back
            user.password = undefined;

            // 3. send back response
            res.json({
                token: token,
                user: user
            });
        }else{
            // Password didn't match!
            res.status(400).json({
                message: "Password / Email incorrect"
            });
        }
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            message: "Problem finding user",
            err: err
        });
    });
});

// Auth - Validate
app.get('/api/auth/validate', (req, res) =>{
    // get token
    let token = req.headers['authorization'].split(' ')[1];
    // validate token using jwt
    jwt.verify(token, secretSalt, (err, authData) => {
        if(err){
            console.log(err);
            res.sendStatus(403);
        }else{
            // token valid
            // send back to payload/authData as json
            res.json({
                user: authData
            });
        }
    });
});