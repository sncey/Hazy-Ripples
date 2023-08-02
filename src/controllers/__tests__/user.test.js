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
  // Create and return the user
  return UserModel.create(userData);
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

  // it('should sign in successfully with valid credentials', async () => {
  //   const userData = {
  //     username: "testuser4",
  //     firstname: "Test",
  //     lastname: "User",
  //     password: "Cl12345.",
  //     confirmPassword: "Cl12345.",
  //     phoneNumber: 5539292766,
  //     email: "testuser4@example.com",
  //     birthday: "2000-01-07",
  //     gender: "male",
  //     avatar: "string"
  //   };
  
  //   // Mock UserModel.findOne to simulate that the user with the same email exists and has an account
  //   UserModel.findOne.mockResolvedValue({
  //     ...userData,
  //     account: {
  //       comparePassword: jest.fn().mockResolvedValue(true)
  //     }
  //   });

  //   UserModel.findOne.mockReturnValueOnce({
  //     populate: jest.fn().mockResolvedValueOnce(userData), // Mock the populate method
  //   });

  
  //   const signinData = {
  //     emailOrUsername: userData.email, // Use the user's email as the identifier
  //     password: 'Cl12345.', // Use the user's password
  //     rememberMe: false, // Set rememberMe to false
  //   };
  
  //    const userMock = new UserModel({
  //     ...userData,
  //     account: { comparePassword: jest.fn().mockResolvedValue(true) },
  //   });
  //   UserModel.prototype.populate = jest.fn().mockResolvedValue(userMock);

  //   // Make the HTTP request to test the signin endpoint
  //   const response = await request(app).post('/user/signin').send(signinData);
  //   console.log(response.body)
   
  //   // console.log(response.body)
  //   // Assertions
  //   expect(response.status).toBe(200);
  //   expect(response.body).toEqual(expect.any(String)); // We expect the response body to be a string (token)
  //   expect(sendEmail).not.toHaveBeenCalled(); // No email should be sent during signin
  //   expect(UserModel.findOne).toHaveBeenCalledWith({
  //     $or: [{ email: signinData.emailOrUsername }, { username: signinData.emailOrUsername }],
  //   });
    
  
  //   // Assert that the "jwt" cookie is set
  //   const cookies = response.header['set-cookie'][0].split(';');
  //   const jwtCookie = cookies.find(cookie => cookie.startsWith('jwt='));
  //   expect(jwtCookie).toBeTruthy();
  
  //   // Extract the JWT token from the cookie for further testing if needed
  //   const jwtToken = jwtCookie.split('=')[1];
  //   expect(jwtToken).toBe('mocked-jwt-token');
  // });
  

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

    await UserModel.create.mockResolvedValue(userData);

    // Mock AccountModel.prototype.save to simulate successful account creation
    AccountModel.prototype.save.mockResolvedValue();

    UserModel.findOne.mockReturnValueOnce({
      populate: jest.fn().mockResolvedValueOnce(), // Mock the populate method
    });
    // Mock UserModel.findOne to simulate that the user with the same email exists and has an account
    UserModel.findOne.mockResolvedValue({
      ...userData,
      account: {
        comparePassword: jest.fn().mockResolvedValue(true)
      }
    });
    // UserModel.findOne.mockReturnValueOnce({
    //   populate: jest.fn().mockResolvedValueOnce(), // Mock the populate method
    // });
  
    const signinData = {
      emailOrUsername: userData.email, // Use the user's email as the identifier
      password: 'Cl12345.', // Use the user's password
      rememberMe: false, // Set rememberMe to false
    };
  
    // Make the HTTP request to test the signin endpoint
    const response = await request(app).post('/user/signin').send(signinData);
    console.log(response.body)
    // Assertions
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.any(String)); // We expect the response body to be a string (token)
    expect(sendEmail).not.toHaveBeenCalled(); // No email should be sent during signin
    expect(UserModel.findOne).toHaveBeenCalledWith({
      $or: [{ email: signinData.emailOrUsername }, { username: signinData.emailOrUsername }],
    });
    expect(response.user.account.comparePassword).toHaveBeenCalledWith(
      signinData.password,
      userData.password_hash
    );
  
    // Assert that the "jwt" cookie is set
    const cookies = response.header['set-cookie'][0].split(';');
    const jwtCookie = cookies.find(cookie => cookie.startsWith('jwt='));
    expect(jwtCookie).toBeTruthy();
  
    // Extract the JWT token from the cookie for further testing if needed
    const jwtToken = jwtCookie.split('=')[1];
    expect(jwtToken).toBe('mocked-jwt-token');
  });
  
});



