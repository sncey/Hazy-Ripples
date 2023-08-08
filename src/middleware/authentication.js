const jwt = require("jsonwebtoken");
const OrganizationModel = require("../db/models/organization");
const EventModel = require("../db/models/event");
require("dotenv").config();

const isAdminMiddleware = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    try {
      // Verify and decode the JWT token
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

      // Assuming your JWT payload contains a field 'isAdmin' to indicate if the user is an admin
      if (decodedToken.isAdmin) {
        // The user is an admin, so allow access to the route
        req.user = decodedToken; // Attach the decoded user object to the request for later use if needed
        return next();
      }
    } catch (err) {
      // If there's an error while verifying the token, deny access
      res.status(403).json({ message: "Access denied" });
    }
  }

  // The user is not an admin or the token is missing/expired, so deny access
  res.status(403).json({ message: "Access denied" });
};

const isAuthenticated = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    if (
      req.path.includes("/signin") ||
      req.path.includes("/signup") ||
      req.path.includes("/forgotPassword") ||
      req.path.includes("/resetPassword")
    ) {
      return res.redirect(`${process.env.DOMAIN}/api-docs`);
    }
  }
  next();
};

const authMiddleware = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedToken; // Attach the user to the request object for later uses
    // console.log(req.user)
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
    const isOrganization = await OrganizationModel.findById({ _id: user.id });
    if (!isOrganization) {
      return res
        .status(401)
        .json({ error: "Not authorized  as an organization!" });
    }
    req.organization = isOrganization;
    next();
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

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
  const eventId = req.params.eventId;
  try {
    const event = await EventModel.findById(eventId);
    if(!event){
      res.status(403).send("couldnt find event");
    }
    if (event && event.organizer.equals(organization.id)) {
      // Organization is the owner of the event
      req.eventId = eventId
      next();
    } else {
      // Organization is not the owner of the event
      res.status(403).send("Forbidden");
    }
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
};

//isEventOwner is a middleware function that checks if the Organization is the owner of the event. :)
//this function should be used after the authMiddleware and isOrganization functions.
// means that the user is already authenticated and is an organization but checks if it's the owner of the event.

//IMPORTANT!!
//The `isEventOwner` function is assigning req.eventId to the eventId.
//IMPORTANT!!


module.exports = {
  isAdminMiddleware,
  authMiddleware,
  isOrganization,
  isEventOwner,
  isAuthenticated,
};
