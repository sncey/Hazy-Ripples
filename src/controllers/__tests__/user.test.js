const request = require('supertest');
const app = require('../../app');
const UserModel = require('../../db/models/user');
const AccountModel = require('../../db/models/account');
const sendEmail = require('../../utils/email');
const jwt = require('jsonwebtoken');
const mongoose = require('../../db/connection');
const authentication = require('../../middleware/authentication')

// Mocking mail sender
jest.mock('../../utils/email');
sendEmail.mockImplementation(() => Promise.resolve());

// Mocking models
jest.mock('../../db/models/account');
jest.mock('../../db/models/user');

// Mock the JWT token generation function
jest.mock('jsonwebtoken');
jwt.sign.mockReturnValue('mocked-jwt-token');

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
    await UserModel.create.mockResolvedValue(userData);

    // Mock AccountModel.prototype.save to simulate successful account creation
    AccountModel.prototype.save.mockResolvedValue();

    // Make the HTTP request to test the signup endpoint
    const response = await request(app).post('/user/signup').send(userData);

    // console.log(response.body)

    // Assertions
    // expect(response.body).toEqual(expect.any(String)); // We expect the response body to be a string (token)
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


describe('POST /user/signin', () => {
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

  it('should sign in successfully with valid credentials', async () => {
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

    // Mock UserModel.findOne to simulate that the user with the same email exists
    UserModel.findOne.mockResolvedValue(userData);

    // Mock AccountModel.findOne to simulate that the account for the user exists
    AccountModel.findOne.mockResolvedValue({
      comparePassword: jest.fn().mockResolvedValue(true)
    });

    const signinData = {
      emailOrUsername: userData.email, // Use the user's email as the identifier
      password: 'Cl12345.', // Use the user's password
      rememberMe: false, // Set rememberMe to false
    };

    // Make the HTTP request to test the signin endpoint
    const response = await request(app).post('/user/signin').send(signinData);
    // Assertions
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.any(String)); // We expect the response body to be a string (token)
    expect(sendEmail).not.toHaveBeenCalled(); // No email should be sent during signin
    expect(UserModel.findOne).toHaveBeenCalledWith({
      $or: [{ email: signinData.emailOrUsername }, { username: signinData.emailOrUsername }],
    });
    expect(AccountModel.findOne).toHaveBeenCalledWith({ user: userData._id });

    // Assert that the "jwt" cookie is set
    const cookies = response.header['set-cookie'][0].split(';');
    const jwtCookie = cookies.find(cookie => cookie.startsWith('jwt='));
    expect(jwtCookie).toBeTruthy();

    // Extract the JWT token from the cookie for further testing if needed
    const jwtToken = jwtCookie.split('=')[1];
    expect(jwtToken).toBe('mocked-jwt-token');
  });

  it('should return an error when user is not found', async () => {
    const signinData = {
      emailOrUsername: "nonexistentuser@example.com", // Non-existent email
      password: 'Cl12345.',
      rememberMe: false,
    };

    // Mock UserModel.findOne to simulate that the user does not exist
    UserModel.findOne.mockResolvedValue(null);

    // Make the HTTP request to test the signin endpoint
    const response = await request(app).post('/user/signin').send(signinData);

    // Assertions
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Wrong username or password" });
    expect(UserModel.findOne).toHaveBeenCalledWith({
      $or: [{ email: signinData.emailOrUsername }, { username: signinData.emailOrUsername }],
    });
    expect(AccountModel.findOne).not.toHaveBeenCalled(); // Ensure AccountModel.findOne is not called
    expect(sendEmail).not.toHaveBeenCalled(); // No email should be sent during signin
  });

  it('should return an error when user account is not found', async () => {
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

    const signinData = {
      emailOrUsername: userData.email, // Use the user's email as the identifier
      password: 'Cl12345.', // Use the user's password
      rememberMe: false, // Set rememberMe to false
    };

    // Mock UserModel.findOne to simulate that the user exists but the account does not
    UserModel.findOne.mockResolvedValue(userData);
    AccountModel.findOne.mockResolvedValue(null);

    // Make the HTTP request to test the signin endpoint
    const response = await request(app).post('/user/signin').send(signinData);

    // Assertions
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Couldn't find your account" });
    expect(UserModel.findOne).toHaveBeenCalledWith({
      $or: [{ email: signinData.emailOrUsername }, { username: signinData.emailOrUsername }],
    });
    expect(AccountModel.findOne).toHaveBeenCalledWith({ user: userData._id });
    expect(sendEmail).not.toHaveBeenCalled(); // No email should be sent during signin
  });

  it('should return an error when the password is incorrect', async () => {
    const userData = {
      username: "testuser4",
      firstname: "Test",
      lastname: "User",
      password: "Cl12345.", // Correct password
      confirmPassword: "Cl12345.",
      phoneNumber: 5539292766,
      email: "testuser4@example.com",
      birthday: "2000-01-07",
      gender: "male",
      avatar: "string"
    };

    const signinData = {
      emailOrUsername: userData.email, // Use the user's email as the identifier
      password: 'WrongPassword', // Incorrect password
      rememberMe: false, // Set rememberMe to false
    };

    // Mock UserModel.findOne to simulate that the user exists and the account exists
    UserModel.findOne.mockResolvedValue(userData);
    AccountModel.findOne.mockResolvedValue({
      comparePassword: jest.fn().mockResolvedValue(false), // Mock incorrect password comparison
    });

    // Make the HTTP request to test the signin endpoint
    const response = await request(app).post('/user/signin').send(signinData);

    // Assertions
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Wrong username or password" });
    expect(UserModel.findOne).toHaveBeenCalledWith({
      $or: [{ email: signinData.emailOrUsername }, { username: signinData.emailOrUsername }],
    });
    expect(AccountModel.findOne).toHaveBeenCalledWith({ user: userData._id });
    expect(sendEmail).not.toHaveBeenCalled(); // No email should be sent during signin
  });
});

const JWT_SECRET = 'your_secret';
describe('PUT /user', () => {
 
  it('should update user profile with valid data', async () => {
    // Mock user ID
    const userId = 'user_id';
  
    // Mock the JWT token with the user ID
    const token = jwt.sign({ id: userId }, JWT_SECRET);
  
    // Mock user data
    const userData = {
      _id: userId,
      username: 'oldUsername',
      firstname: 'Old Firstname',
      lastname: 'Old Lastname',
      phoneNumber: '1234567890',
      birthday: '1990-01-01',
      gender: 'male',
      avatar: 'oldAvatar',
    };
  
    // Mock the updated data
    const updateData = {
      password: 'newPassword',
      confirmPassword: 'newPassword',
      phoneNumber: '9876543210',
      birthday: '2000-02-02',
      username: 'newUsername',
      firstname: 'New Firstname',
      lastname: 'New Lastname',
      gender: 'female',
      avatar: 'newAvatar',
    };
  
    // Mock UserModel.findById to simulate user found in the database
    UserModel.findById.mockResolvedValue(userData); // <--- Mock the function with user data
  
    // Mock AccountModel.findOne to simulate account found in the database
    AccountModel.findOne.mockResolvedValue({});
  
    // Make the HTTP request to update the user profile
    const response = await request(app)
      .put('/user')
      .set('Cookie', [`jwt=${token}`]) // Attach the JWT token as a cookie
      .send(updateData);
    console.log(response.body);
  
    // Assertions
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User updated successfully');
  });


  it('should return 400 if passwords do not match', async () => {
    const token = jwt.sign({ id: 'user_id' }, JWT_SECRET);
    const updateData = {
      password: 'newPassword',
      confirmPassword: 'mismatchedPassword',
      phoneNumber: '9876543210',
      birthday: '2000-02-02',
      username: 'newUsername',
      firstname: 'New Firstname',
      lastname: 'New Lastname',
      gender: 'female',
      avatar: 'newAvatar',
    };

    const response = await request(app)
      .put('/user')
      .set('Cookie', [`jwt=${token}`]) // Attach the JWT token as a cookie
      .send(updateData);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('passwords do not match');
  });

});