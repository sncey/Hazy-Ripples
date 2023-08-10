# Hazy Ripples Project 👨‍💻

## Description 📝

Our project serves as a dynamic bridge, uniting individuals with non-profit organizations to create a profound societal impact through volunteering. By connecting users with events aligned to their passions, we foster a sense of purpose and collaboration, allowing interactions to extend beyond virtual boundaries. Together, we empower meaningful connections that fuel positive change, enriching communities and leaving an enduring legacy of unity and growth.

## Setup

1. Clone this repository.
2. `cd` into the directory.
3. `npm install` to install the dependencies.
4. `npm start` to run the server.
5. `npm test` to run the tests.

## Structure 🏗️

The project follows a well-organized directory structure to promote modularity and maintainability. Here's an overview of the key directories:
```bash
├── src
│   ├── app.js                    
│   ├── db
│   │   ├── connection.js
│   │   └── models
│   │       ├── event.js
│   │       ├── user.js
│   │       └── organization.js
│   ├── middleware
│   │   ├── authentication.js
│   │   └── authorization.js
│   ├── routes
│   │   ├── event.js
│   │   ├── user.js
│   │   ├── organization.js
│   │   └── index.js
│   └── __tests__
│       ├── event.test.js
│       ├── user.test.js
│       └── organization.test.js
│
├── .env
├── .gitignore
├── package-lock.json
├── .lintstagedrc
└── package.json
```

## Authentication 🔐
For authentication purposes, JWT tokens have been used which can only access certain endpoints after being authenticated by
the server. The token is generated when the user logs in and is stored in the session. The token is then sent to the server
with each request and the server verifies the token before sending the response. The token is valid for 24 hours and the user
has to log in again after the token expires.

## Authorization 🔑
For authorization purposes, the user's role is checked before sending the response. The user's role is stored in the session
and is sent to the server with each request. The server checks the user's role before sending the response. If the user's role
is not authorized to access the endpoint, the server sends a 401 Unauthorized or 403 Forbidden response.


## Models 🏛️

Our application consists of several essential data models that define the structure of our database entities. These models serve as the foundation for creating, storing, and managing data in our platform:

- 🧑‍💼 **Users**: Represents user profiles and their related information, facilitating seamless interactions and personalized experiences.
- 📅 **Events**: Defines the attributes of various events, including their titles, descriptions, dates, and other relevant details.
- 🏢 **Organizations**: Captures information about non-profit organizations, enabling effective collaboration and partnership.
- 👤 **Administrators**: Represents administrators of the platform with specialized privileges for managing users, events, and organizations.
- 💰 **Donation**: Describes the aspects of donations, including the donors, recipients, and transaction details.

These models are meticulously crafted using Mongoose schemas and reside within the `db/models` directory.

## Routes 🛤️

Our application features distinct routes that correspond to different entities and functionalities, allowing for efficient handling of various actions and requests:

- 👥 **Users**: Manages user-related operations, such as registration, login, profile management, and interaction with events.
- 📅 **Events**: Handles event-related functionalities, including event creation, retrieval, and updates.
- 🏢 **Organizations**: Provides routes for non-profit organizations to manage their accounts, events, and interactions.
- 🔑 **Administrators**: Facilitates administrative tasks, granting authorized personnel control over users, events, and organizations.

These routes are defined within the `routes` directory and offer comprehensive endpoints for user-friendly interactions.

## Controllers 🎮

Controllers serve as the core logic of our application, orchestrating and executing various actions based on user requests. Here's an overview of the key controllers and their functionalities:

- 🧑‍💼 **Users Controller**: Manages user-related operations, enabling registration, authentication, profile updates, and event interactions.
- 📅 **Events Controller**: Handles event-related tasks, including event creation, retrieval, and modification.
- 🏢 **Organizations Controller**: Governs non-profit organizations' functionalities, facilitating account management, event creation, and updates.
- 🔑 **Administrators Controller**: Facilitates administrative tasks, granting administrators control over users, events, and organizations.
- 💰 **Donation Controller**: Manages donation-related actions, such as initiating donations, tracking transactions, and reporting.

These controllers, located within the `controllers` directory, implement intricate business logic to ensure smooth platform operations.

## Middleware ⚙️

Middleware functions play a crucial role in enhancing the security, authentication, and authorization aspects of our platform. They provide a structured way to handle various tasks before processing requests or granting access. Here are the middleware functions used in our project:

- `isAdminMiddleware`: Checks if the user is an admin.
- `isAuthenticated`: Redirects unauthenticated users to the Swagger API documentation.
- `authMiddleware`: Verifies JWT token for authentication and attaches the user object to the request.
- `isOrganization`: Verifies if the authenticated user is an organization.
- `isEventOwner`: Checks if the authenticated organization is the owner of an event.
- `googleAuthMiddleware`: Handles Google OAuth authentication for user accounts. 🌐

These middleware functions collectively ensure a secure, organized, and seamless experience for users and organizations as they interact with our platform.


## Utils 🛠️

Utils are utility functions that serve specific purposes and enhance the functionality of our platform. They simplify complex tasks and streamline various processes. Here are the utils used in our project:

- `updateExpiredEvent`: This utility function is responsible for updating expired events using a cron job that runs every 15 minutes.
- `emailUtil`: Utilizes Nodemailer to send emails, ensuring effective communication with users and organizations.
- `googleAuthUtil`: Implements Passport.js and Google Strategy for Google OAuth authentication, enabling secure user login and registration.

These utility functions significantly contribute to the efficiency and reliability of our platform, enabling seamless event management, email communication, and secure user authentication.


## Database 📊

In this project we are using MongoDB database and set our models with Mongoose.
It includes a `user` collection, an `event` collection, a `donation` collection, and a `organization` collection. 
We are using referenced approach to connect two collections. 
The database connection is setup in db/connection.js.

API 🚀
We provide our APIs under different routes such as `user`, `event`, `donation`, `organization`, and `admin`. 
The routes are set up in routes/index.js.
These routes allow users, organizations, and administrators to interact with the platform and perform various actions.

## Tests 🧪

Jest and Supertest are utilized for testing.

## Guest Stories 📖

As a guest, I want to be able to:

- See all events.
- Login to my account.
- See the home page.
- Create an account.
- Filter events by category, location, and date.
- Search for events.

## User Stories 👥

As a user, I want to be able to:

- See all events and events I'm attending.
- Attend and unattend events.
- Update and delete my account.
- Filter events by category, location, and date.
- Search for events.
- Sign out.

## Organization Stories 🏢

As an organization, I want to be able to:

- Create and login to my account.
- Create, update, and delete events.
- See events I've created and attendees.
- Update and delete my account.
- Notify attendees about event changes.
- Filter events by category, location, and date.
- Search for events.

## Technologies Used 🛠️

- ![Node.js](https://img.shields.io/badge/Node.js-brightgreen)
- ![Express](https://img.shields.io/badge/Express-blue)
- ![MongoDB](https://img.shields.io/badge/MongoDB-green)
- ![Mongoose](https://img.shields.io/badge/Mongoose-yellow)
- ![Jest](https://img.shields.io/badge/Jest-red)
- ![Supertest](https://img.shields.io/badge/Supertest-blueviolet)
- ![Bcrypt](https://img.shields.io/badge/Bcrypt-orange)
- ![Jsonwebtoken](https://img.shields.io/badge/Jsonwebtoken-lightgrey)
- ![Dotenv](https://img.shields.io/badge/Dotenv-yellowgreen)
- ![Nodemon](https://img.shields.io/badge/Nodemon-brightgreen)
- ![Morgan](https://img.shields.io/badge/Morgan-blue)
- ![Nodemailer](https://img.shields.io/badge/Nodemailer-9cf)
- [![Passport.js](https://img.shields.io/badge/Passport.js-brightgreen)](http://www.passportjs.org/)
- [![Nodemailer](https://img.shields.io/badge/Nodemailer-red)](https://nodemailer.com/)
- [![Cron Job](https://img.shields.io/badge/Cron%20Job-lightblue)](https://www.npmjs.com/package/node-cron)
- [![Stripe](https://img.shields.io/badge/Stripe-informational)](https://stripe.com/)




## Environment Variables 🌐
All environment variables required by application should be defined before running it on production or development environments.
The environment variables are defined in .env file. The .env file is not included in the repository. You should create your own .env file and define the environment variables in it.
To run locally you need to have environment variables defined:
- PORT
- MONGODB_URI
- JWT_SECRET
- JWT_EXPIRES_IN
- JWT_COOKIE_EXPIRES_IN
- JWT_COOKIE_SECURE
- JWT_COOKIE_HTTPONLY


## Authors 👥

- [Ceyda Esen]()
<a href="https://www.linkedin.com/in/ceyda-esen/" target="blank"><img align="center" src="https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/linked-in-alt.svg" alt="hozifah hebbo" height="30" width="40" /></a>
<a href="https://github.com/tomiece317" target="blank"><img align="center" src="https://upload.wikimedia.org/wikipedia/commons/c/c2/GitHub_Invertocat_Logo.svg" alt="hozifah hebbo" height="30" width="40" /></a>
<br>


- [Rasam Rabiee]()
<a href="https://www.linkedin.com/in/rasam-rabiee" target="blank"><img align="center" src="https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/linked-in-alt.svg" alt="rasam rabiee" height="30" width="40" /></a>
<a href="https://github.com/cyberRasam" target="blank"><img align="center" src="https://upload.wikimedia.org/wikipedia/commons/c/c2/GitHub_Invertocat_Logo.svg" alt="rasam rabiee" height="30" width="40" /></a>
<br>

- [Badr Nasher]()
<a href="https://www.linkedin.com/in/bedreddin-naser-bb548518b/" target="blank"><img align="center" src="https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/linked-in-alt.svg" alt="badrnasher" height="30" width="40" /></a>
<a href="https://github.com/badrnasher" target="blank"><img align="center" src="https://upload.wikimedia.org/wikipedia/commons/c/c2/GitHub_Invertocat_Logo.svg" alt="badr nasher" height="30" width="40" /></a>
<br>

- [Houzifa Habbo]()
<a href="https://linkedin.com/in/hozifah hebbo" target="blank"><img align="center" src="https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/linked-in-alt.svg" alt="hozifah hebbo" height="30" width="40" /></a>
<a href="https://github.com/houzifahabbo" target="blank"><img align="center" src="https://upload.wikimedia.org/wikipedia/commons/c/c2/GitHub_Invertocat_Logo.svg" alt="hozifah hebbo" height="30" width="40" /></a>
