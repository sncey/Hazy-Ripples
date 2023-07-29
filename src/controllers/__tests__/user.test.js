// const request = require('supertest');
// const jwt = require('jsonwebtoken');
// const app = require('../../app.js');
// const UserModel = require('../../db/models/user');
// const AccountModel = require('../../db/models/account');
// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');

// // Helper function to generate a JWT for testing
// const generateJWT = (user, jwtExp) => {
//   return jwt.sign(
//     {
//       id: user._id,
//       username: user.username,
//       exp: jwtExp,
//       iat: Math.floor(Date.now() / 1000), // Issued at date
//     },
//     process.env.JWT_SECRET
//   );
// };

// const checkErrorCode = (err, res) => {
//   if (err.code === 11000) {
//     const fieldName = Object.keys(err.keyValue)[0];
//     const errorMessage = `${fieldName} already used`;
//     return { status: 400, body: { error: errorMessage } };
//   }
//   return { status: 400, body: { error: err.message } };
// };

// describe('POST /user/signin', () => {
//   beforeEach(() => {
//     jest.clearAllMocks(); // Clear all previous mock calls before each test
//   });

//   it('should sign in a user with correct credentials and return a JWT', async () => {
//     const mockUser = {
//       emailOrUsername: 'test@example.com',
//       password: 'testpassword',
//       rememberMe: true,
//     };

//     const jwtExp = Math.floor(Date.now() / 1000) + 1209600; // 14 days expiration

//     // Mock the user object returned by the UserModel.findOne
//     const mockUserFromDB = {
//       _id: 'user_id',
//       email: 'test@example.com',
//       username: 'testuser',
//       account: new AccountModel({
//         password_hash: await bcrypt.hash('testpassword', 10), // Mock hashed password
//         comparePassword: jest.fn().mockResolvedValueOnce(true), // Mock the comparePassword method
//       }),
//     };

//     UserModel.findOne = jest.fn().mockResolvedValueOnce(mockUserFromDB);

//     // Mock the populate method on the virtual 'account' field
//     UserModel.findOne.mockReturnValueOnce({
//       populate: jest.fn().mockResolvedValueOnce(mockUserFromDB), // Mock the populate method
//     });

//     const mockToken = generateJWT(mockUserFromDB, jwtExp);

//     const response = await request(app).post('/user/signin').send(mockUser);

//     expect(response.body).toEqual(mockToken);
//     expect(response.header['set-cookie']).toBeDefined();
//     expect(response.header['set-cookie'][0]).toMatch(/jwt=.+; HttpOnly/);
//   });

//   it('should return an error when providing wrong credentials', async () => {
//     const mockUser = {
//       emailOrUsername: 'test@example.com',
//       password: 'wrongpassword',
//       rememberMe: true,
//     };

//     const jwtExp = Math.floor(Date.now() / 1000) + 1209600; // 14 days expiration

//     // Mock the user object returned by the UserModel.findOne
//     const mockUserFromDB = {
//       _id: 'user_id',
//       email: 'test@example.com',
//       username: 'testuser',
//       account: new AccountModel({
//         password_hash: await bcrypt.hash('testpassword', 10), // Mock hashed password
//         comparePassword: jest.fn().mockResolvedValueOnce(false), // Mock the comparePassword method
//       }),
//     };

//     UserModel.findOne = jest.fn().mockResolvedValueOnce(mockUserFromDB);

//     // Mock the populate method on the virtual 'account' field
//     UserModel.findOne.mockReturnValueOnce({
//       populate: jest.fn().mockResolvedValueOnce(mockUserFromDB), // Mock the populate method
//     });

//     const response = await request(app).post('/user/signin').send(mockUser);

//     const expectedResponse = checkErrorCode(
//       new Error('Wrong username or password'),
//       response
//     );

//     expect(response.status).toBe(expectedResponse.status);
//     expect(response.body).toEqual(expectedResponse.body);
//   });

//   it('should return an error when the user does not have an account', async () => {
//     const mockUser = {
//       emailOrUsername: 'test@example.com',
//       password: 'testpassword',
//       rememberMe: true,
//     };

//     const jwtExp = Math.floor(Date.now() / 1000) + 1209600; // 14 days expiration

//     // Mock the user object returned by the UserModel.findOne
//     const mockUserFromDB = {
//       _id: 'user_id',
//       email: 'test@example.com',
//       username: 'testuser',
//       account: null, // Mock account as null (user without an account)
//     };

//     UserModel.findOne = jest.fn().mockResolvedValueOnce(mockUserFromDB);

//     // Mock the populate method on the virtual 'account' field
//     UserModel.findOne.mockReturnValueOnce({
//       populate: jest.fn().mockResolvedValueOnce(mockUserFromDB), // Mock the populate method
//     });

//     const response = await request(app).post('/user/signin').send(mockUser);

//     const expectedResponse = checkErrorCode(
//       new Error("Couldn't find your account"),
//       response
//     );

//     expect(response.status).toBe(expectedResponse.status);
//     expect(response.body).toEqual(expectedResponse.body);
//   });
// });

// afterAll(async () => {
//   // Close the MongoDB connection after running all tests
//   await mongoose.connection.close();
// });




const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../../app.js');
const UserModel = require('../../db/models/user');
const AccountModel = require('../../db/models/account');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Helper function to generate a JWT for testing
const generateJWT = (user, jwtExp) => {
  return jwt.sign(
    {
      id: user._id,
      username: user.username,
      exp: jwtExp,
      iat: Math.floor(Date.now() / 1000), // Issued at date
    },
    process.env.JWT_SECRET
  );
};

jest.mock('../../db/models/user'); // Mocking the UserModel for testing purposes
jest.mock('../../db/models/account'); // Mocking the AccountModel for testing purposes

describe('POST /user/signin', () => {
  const req = {
    body: {
      emailOrUsername: 'testuser@example.com', // Replace with the test email or username
      password: 'Cl12345.', // Replace with the test password
      rememberMe: true, // Replace with the desired test value for rememberMe
    },
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    cookie: jest.fn(),
  };

  const fakeUser = {
    _id: '64bd6a7cdfba432d576a9e28', // Replace with a valid test user ID
    email: 'testuser@example.com', // Replace with the test email or username
    username: 'testuser', // Replace with the test username
    firstname: 'Test', // Replace with the test firstname
    lastname: 'User', // Replace with the test lastname
    phoneNumber: '5539292761', // Replace with the test phone number
    birthday: new Date('2000-01-07'), // Replace with the test birthday
    gender: 'male', // Replace with the test gender
    registered_at: new Date('2023-07-29T11:46:10.572+00:00'), // Replace with the test registered_at date
    avatar: 'string', // Replace with the test avatar URL
    events: [], // Replace with the test events array
    account: new AccountModel({
      password_hash: async () => {return await bcrypt.hash('Cl12345.', 10)}, // Mock hashed password
      comparePassword: jest.fn().mockResolvedValue(true), // Mock the comparePassword method
    }),
  };

  it('should sign in a user with correct credentials and return a JWT', async () => {
    // Mock the UserModel.findOne to return a fakeUser
    UserModel.findOne.mockResolvedValue(fakeUser);

    // Mock the populate method on the virtual 'account' field
    UserModel.findOne.mockReturnValueOnce({
      populate: jest.fn().mockResolvedValueOnce(fakeUser), // Mock the populate method
    });

    const jwtExp = Math.floor(Date.now() / 1000) + 1209600; // 14 days expiration
    const mockToken = generateJWT(fakeUser, jwtExp);

    const response = await request(app).post('/user/signin').send(req.body);

    expect(response.body).toEqual(mockToken);
    expect(response.header['set-cookie']).toBeDefined();
    expect(response.header['set-cookie'][0]).toMatch(/jwt=.+; HttpOnly/);
  });

  it('should return an error when providing wrong credentials', async () => {
    // Mock the UserModel.findOne to return null (no user found)
    UserModel.findOne.mockResolvedValue(null);

    const response = await request(app).post('/user/signin').send(req.body);

    const expectedResponse = { status: 400, body: { error: 'Wrong username or password' } };

    expect(response.status).toBe(expectedResponse.status);
    expect(response.body).toEqual(expectedResponse.body);
  });

  it('should return an error when the user does not have an account', async () => {
    // Mock the UserModel.findOne to return a fakeUser without an account
    const userWithoutAccount = { ...fakeUser, account: null };
    UserModel.findOne.mockResolvedValue(userWithoutAccount);

    const response = await request(app).post('/user/signin').send(req.body);

    const expectedResponse = { status: 400, body: { error: "Couldn't find your account" } };

    expect(response.status).toBe(expectedResponse.status);
    expect(response.body).toEqual(expectedResponse.body);
  });

  it('should return an error when invalid password is provided', async () => {
    // Mock the UserModel.findOne to return a fakeUser
    UserModel.findOne.mockResolvedValue(fakeUser);

    // Mock the comparePassword function to return false (password doesn't match)
    fakeUser.account.comparePassword.mockResolvedValue(false);

    const response = await request(app).post('/user/signin').send(req.body);

    const expectedResponse = { status: 400, body: { error: 'Wrong username or password' } };

    expect(response.status).toBe(expectedResponse.status);
    expect(response.body).toEqual(expectedResponse.body);
  });

  it('should return an error when an exception is thrown', async () => {
    const errorMessage = 'Test error message';
    // Mock the UserModel.findOne to throw an error
    UserModel.findOne.mockRejectedValueOnce(new Error(errorMessage));

    const response = await request(app).post('/user/signin').send(req.body);

    const expectedResponse = { status: 400, body: { error: errorMessage } };

    expect(response.status).toBe(expectedResponse.status);
    expect(response.body).toEqual(expectedResponse.body);
  });
});

afterAll(async () => {
  // Close the MongoDB connection after running all tests
  await mongoose.connection.close();
});
