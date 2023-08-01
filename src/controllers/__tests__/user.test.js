const request = require('supertest');
const app = require('../../app');
const UserModel = require('../../db/models/user');
const AccountModel = require('../../db/models/account');
const sendEmail = require('../../utils/email');
const jwt = require('jsonwebtoken');
const mongoose = require('../../db/connection');
const bcrypt = require('bcrypt');

// Mocking mail sender
jest.mock('../../utils/email');
sendEmail.mockImplementation(() => Promise.resolve());

// Mocking models
jest.mock('../../db/models/account');
jest.mock('../../db/models/user');

// Mock the JWT token generation function
jest.mock('jsonwebtoken');
jwt.sign.mockReturnValue('mocked-jwt-token');

const createUser = async () => {
  const userData = {
    username: 'testuser3',
    firstname: 'Test',
    lastname: 'User',
    email: 'test3@example.com',
    phoneNumber: 9234567890,
    birthday: new Date('2000-01-01'),
    gender: 'male',
    avatar: 'https://example.com/avatar.png',
  };

  const user = await UserModel.create(userData);

  const account = new AccountModel({
    user: user, // Set the user field directly to the user's _id
    password_hash: 'TestPassword123.',
  });

  await account.save();

  return user;
};

describe('POST /user/signup', () => {
  // Connect to the test database before running the tests
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_TEST_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  // Disconnect from the database after running the tests
  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it('should create a new user and account with valid data', async () => {
    const userData = {
        username: "testuser4",
        firstname: "Test",
        lastname: "User",
        password: "Cl12345.",
        confirmPassword: "Cl12345.",
        phoneNumber: 5539292766,
        email: "testuser4@example.com",
        birthday: "2000-01-07",
        gender: "male",
        avatar: "string"
    };

    // Mock UserModel.findOne to simulate that no user with the same email exists
    UserModel.findOne.mockResolvedValue(null);

    // Mock UserModel.create to simulate successful user creation
    UserModel.create.mockResolvedValue(createUser);

    // Mock AccountModel.prototype.save to simulate successful account creation
    AccountModel.prototype.save.mockResolvedValue();

    // Make the HTTP request to test the signup endpoint
    const response = await request(app).post('/user/signup').send(userData);

    console.log(response.body)

    // Assertions
    expect(response.body).toBe('pamplemousse');
    expect(response).toThrow(TypeError);
    expect(response.status).toBe(200);
    expect(sendEmail).toHaveBeenCalledTimes(1);
    expect(sendEmail).toHaveBeenCalledWith(
      userData.email,
      'Welcome onboard',
      expect.any(String)
    );

    // Assert that the "jwt" cookie is set
    const cookies = response.header['set-cookie'][0].split(';');
    const jwtCookie = cookies.find(cookie => cookie.startsWith('jwt='));
    expect(jwtCookie).toBeTruthy();

    // Extract the JWT token from the cookie for further testing if needed
    const jwtToken = jwtCookie.split('=')[1];
    expect(jwtToken).toBe('mocked-jwt-token');
  });

  it('should return an error if passwords do not match', async () => {
    const userData = {
        username: "testuser4",
        firstname: "Test",
        lastname: "User",
        password: "Cl12345.",
        confirmPassword: "Cl12345.6",
        phoneNumber: "5539292766",
        email: "testuser5@example.com",
        birthday: "2000-01-07",
        gender: "male",
        avatar: "string"
    };

    const response = await request(app).post('/user/signup').send(userData);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('passwords do not match');
  });

  it('should return an error if email is already used', async () => {
    const existingUser = { email: 'test@example.com' };
    UserModel.findOne.mockResolvedValue(existingUser);

    const userData = {
        username: "testuser4",
        firstname: "Test",
        lastname: "User",
        password: "Cl12345.",
        confirmPassword: "Cl12345.",
        phoneNumber: "5539292766",
        email: "test@example.com",
        birthday: "2000-01-07",
        gender: "male",
        avatar: "string"
    };

    const response = await request(app).post('/user/signup').send(userData);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('test@example.com already used');
  });

});
