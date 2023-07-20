const jwt = require('jsonwebtoken');
const OrganizationModel = require('../db/models/organization');
const EventModel = require('../db/models/event');

const authMiddleware = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decodedToken; // Attach the user to the request object for later use
    next();
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

//The `authMiddleware` function is used to protect routes that require authentication. 
//By using this middleware, you can ensure that only authorized users can access these routes. 

//IMPORTANT!!
//The `authMiddleware` function is assigning req.user to the user object.
//IMPORTANT!!


const isOrganization = async (req, res, next) => {
    const user = req.user;

    try {
        const organization = await OrganizationModel.findOne({email: user.email })
        if (!organization) {
            return res.status(401).json({ error: 'Not authorized  as an organization!' });
        }
        req.organization = organization;
        next();
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
   
}

//isOrganization is a middleware function that checks if the user is an organization. 
//this function should be used after the authMiddleware function.
// means that the user is already authenticated but checks if it's an organization. 

//IMPORTANT!!
//The `isOrganization` function is assigning req.organization to the organization object.
//IMPORTANT!!


//now we have access to the organization object after verifying the organization 
//and user now we can check its the owner of the event
const isEventOwner = async (req, res, next) => {
    const organization = req.organization;
    const eventId = req.params.id;
    try {
        const event = await EventModel.findById(eventId)
        if (event && event.organizer.equals(organization._id)) {
          // Organization is the owner of the event
          next();
        } else {
          // Organization is not the owner of the event
          res.status(403).send('Forbidden');
        }
      }
        catch (error) {
        console.log(error);
        res.redirect('/');
      }
}

//isEventOwner is a middleware function that checks if the Organization is the owner of the event. :)
//this function should be used after the authMiddleware and isOrganization functions.
// means that the user is already authenticated and is an organization but checks if it's the owner of the event.



module.exports = { authMiddleware, isOrganization , isEventOwner};