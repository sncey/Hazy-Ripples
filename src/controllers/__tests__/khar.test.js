// const request = require('supertest');
// const app = require('../../app'); 
// const UserModel = require('../../db/models/user');
// const AccountModel = require('../../db/models/account');
// const sendEmail = require('../../utils/email');
// const jwt = require('jsonwebtoken'); 
// const mongoose = require('../../db/connection')
// const bcrypt = require('bcrypt');

// //mocking mail sender 
// jest.mock('../../utils/email');
// sendEmail.mockImplementation(() => Promise.resolve()); 

// //mocking models 
// jest.mock('../../db/models/account');
// jest.mock('../../db/models/user');


// // Mock the JWT token generation function
// jest.mock('jsonwebtoken');
// jwt.sign.mockReturnValue('mocked-jwt-token');

// const createUser = async () => {
//   const userData = {
//     username: 'testuser',
//     firstname: 'Test',
//     lastname: 'User',
//     email: 'test@example.com',
//     phoneNumber: 1234567890,
//     birthday: new Date('2000-01-01'),
//     gender: 'male',
//     avatar: 'https://example.com/avatar.png',
//   };

//   const user = await UserModel.create(userData);

//   const account = new AccountModel({
//     user: user._id, // Set the user field directly to the user's _id
//     password_hash: 'TestPassword123.',
//   });

//   await account.save();

//   return user;
// };


// describe('POST /user/signup', () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//     jest.resetModules();
//   });
//   // Connect to the test database before running the tests
//   beforeAll(async () => {
//     await mongoose.connect(process.env.MONGODB_TEST_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//   });

//   // Disconnect from the database after running the tests
  

//   // Clear all mock implementations and reset modules before each test
//   beforeEach(() => {
//     jest.clearAllMocks();
//     jest.resetModules();
//   });

//   it('should create a new user and account with valid data', async () => {
//     const userData = {
//       username: 'john_doe',
//       firstname: 'John',
//       lastname: 'Doe',
//       password: 'TestPassword123.',
//       confirmPassword: 'TestPassword123.',
//       phoneNumber: 1234567890,
//       email: 'john.doe@example.com',
//       birthday: '2000-01-01',
//       gender: 'male',
//       avatar: 'https://example.com/avatar.png',
//     };

//     // Mock UserModel.findOne to simulate that no user with the same email exists
//     UserModel.findOne.mockResolvedValue(null);

//     // Mock UserModel.create to simulate successful user creation
//     UserModel.create.mockResolvedValue(createUser);

//     // Mock AccountModel.prototype.save to simulate successful account creation
//     AccountModel.prototype.save.mockResolvedValue();

//     // Make the HTTP request to test the signup endpoint
//     const response = await request(app).post('/user/signup').send(userData);

//     console.log(response.body);

//     // Assertions
//     expect(response.status).toBe(200);
//     expect(sendEmail).toHaveBeenCalledTimes(1);
//     expect(sendEmail).toHaveBeenCalledWith(
//       userData.email,
//       'Welcome onboard',
//       expect.any(String)
//     );

//     // Assert that the "jwt" cookie is set
//     const cookies = response.header['set-cookie'][0].split(';');
//     const jwtCookie = cookies.find(cookie => cookie.startsWith('jwt='));
//     expect(jwtCookie).toBeTruthy();

//     // Extract the JWT token from the cookie for further testing if needed
//     const jwtToken = jwtCookie.split('=')[1];
//     expect(jwtToken).toBe('mocked-jwt-token');
//   });

// });




// afterAll(async () => {
//   await mongoose.connection.close();
// })


