const organizationController = require('../organization');
const OrganizationModel = require('../../db/models/organization');
const jwt = require('jsonwebtoken');
const sendEmail = require('../../utils/email');
const welcomeTemplate = require('../../emailTemplates/welcome');
const EventModel = require('../../db/models/event');

jest.mock('../../db/models/organization');
jest.mock('jsonwebtoken');
jest.mock('../../utils/email');
jest.mock('../../emailTemplates/welcome');
const checkErorrCodeMock = jest.fn();



describe('createAccount', () => {
    let req, res;
  
    beforeEach(() => {
      req = {
          body: {
              name: 'Test Organization',
              email: 'test@example.com',
              password: 'testpassword',
              confirmPassword: 'testpassword',
              description: 'Test organization description',
              phoneNumber: '1234567890',
              image: 'test_image.jpg',
          },
      };
      res = {
          json: jest.fn(),
          status: jest.fn(() => res),
          cookie: jest.fn(),
      };
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should create a new organization account', async () => {
        const jwtExp = Math.floor(Date.now() / 1000) + 86400;
        const token = 'test_token';
        const emailText = 'Welcome to Test Organization!';
        const organizationMock = {
            id: 'organization_id', // Set an example id for testing
            name: 'Test Organization',
            save: jest.fn().mockResolvedValue(),
        };
      
        OrganizationModel.findOne.mockResolvedValue(null);
        OrganizationModel.create.mockReturnValue(organizationMock);
        jwt.sign.mockReturnValue(token);
        welcomeTemplate.mockReturnValue(emailText);
      
        await organizationController.createAccount(req, res);

        // Expectations
        expect(res.status).not.toHaveBeenCalled(); // Ensure status is not called (no error)
        expect(res.json).toHaveBeenCalledWith(token);
        expect(res.cookie).toHaveBeenCalledWith('jwt', token, {
            httpOnly: false
        });
      
        expect(OrganizationModel.findOne).toHaveBeenCalledWith({
            email: 'test@example.com'
        });
        expect(OrganizationModel.create).toHaveBeenCalledWith({
          name: 'Test Organization',
              email: 'test@example.com',
              password: 'testpassword',
              description: 'Test organization description',
              phoneNumber: '1234567890',
              image: 'test_image.jpg',
        });
        expect(organizationMock.save).toHaveBeenCalled();
      
        expect(jwt.sign).toHaveBeenCalledWith({
                    id: organizationMock.id,
                    name: organizationMock.name, // Use organizationMock.name here
                    exp: jwtExp,
                    iat: expect.any(Number),
                },
                process.env.JWT_SECRET
        );
      
        expect(welcomeTemplate).toHaveBeenCalledWith('Test Organization');
        expect(sendEmail).toHaveBeenCalledWith('test@example.com', 'Welcome onboard', emailText);
      });
  
    it('should return error if passwords do not match', async () => {
      req.body.confirmPassword = 'differentPassword';
  
      await organizationController.createAccount(req, res);
  
      // Expectations
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
      error: 'Passwords do not match'
      });
      });
  
    it('should return error if organization email is already used', async () => {
      OrganizationModel.findOne.mockResolvedValue({
          name: 'Existing Organization'
      });
  
      await organizationController.createAccount(req, res);
  
      // Expectations
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
      error: 'test@example.com is already used'
      });
      });
  
    it('should handle other errors', async () => {
      const errorMessage = 'error inside the server';
      checkErorrCodeMock.mockImplementation((err, res) => {
        return res.status(500).json({
        error: errorMessage
        });
        });
    
      await organizationController.createAccount(req, res);
    
      // Expectations
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'test@example.com is already used' });
    })
});

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('test_token'),
}));

describe('signin', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        emailOrUsername: 'test@example.com', // Provide a valid email or username
        password: 'testpassword', // Provide a valid password
        rememberMe: false,
      },
    };
    res = {
      json: jest.fn(),
      status: jest.fn(() => res),
      cookie: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should sign in successfully and return a JWT token', async () => {
    const organizationMock = {
      comparePassword: jest.fn().mockResolvedValue(true), // Mock comparePassword
      id: 'organization_id', // Mock organization ID
      name: 'Test Organization', // Mock organization name
    };

    OrganizationModel.findOne.mockResolvedValue(organizationMock);

    await organizationController.signin(req, res);

    // Expectations
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith('test_token');
    expect(res.cookie).toHaveBeenCalledWith('jwt', 'test_token', { httpOnly: false });
    expect(jwt.sign).toHaveBeenCalledWith(
      {
        id: organizationMock.id,
        name: organizationMock.name,
        exp: expect.any(Number),
        iat: expect.any(Number),
      },
      process.env.JWT_SECRET
    );
  
  });

  it('should return error for wrong username or password', async () => {
    OrganizationModel.findOne.mockResolvedValue(null); // Simulate no organization found

    await organizationController.signin(req, res);

    // Expectations
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Wrong username or password' });
  });

  it('should return error for internal server error', async () => {
    OrganizationModel.findOne.mockRejectedValue(new Error('Internal server error'));

    await organizationController.signin(req, res);

    // Expectations
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
  });
});


describe('updateAccount', () => {
  let req, res;

  beforeEach(() => {
    req = {
      organization: {
        _id: 'organization_id', // Mock organization ID
      },
      body: {
        name: 'Updated Organization Name',
        email: 'updated@example.com',
        description: 'Updated organization description',
        image: 'updated_image.jpg',
        phone_number: '9876543210',
      },
    };
    res = {
      json: jest.fn(),
      status: jest.fn(() => res),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update organization details successfully', async () => {
    const updatedOrganizationMock = {
      _id: 'organization_id',
      save: jest.fn().mockResolvedValue(),
    };

    OrganizationModel.findById.mockResolvedValue(updatedOrganizationMock);

    await organizationController.updateAccount(req, res);

    // Expectations
    expect(OrganizationModel.findById).toHaveBeenCalledWith('organization_id');
    expect(updatedOrganizationMock.name).toBe('Updated Organization Name');
    expect(updatedOrganizationMock.email).toBe('updated@example.com');
    expect(updatedOrganizationMock.description).toBe('Updated organization description');
    expect(updatedOrganizationMock.image).toBe('updated_image.jpg');
    expect(updatedOrganizationMock.phone_number).toBe('9876543210');
    expect(updatedOrganizationMock.save).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      message: 'Organization details updated successfully',
      organization: updatedOrganizationMock,
    });
  });

  it('should return error if organization is not found', async () => {
    OrganizationModel.findById.mockResolvedValue(null);

    await organizationController.updateAccount(req, res);

    // Expectations
    expect(OrganizationModel.findById).toHaveBeenCalledWith('organization_id');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Organization not found' });
  });

  it('should handle errors while updating organization details', async () => {
    const errorMessage = 'Some error occurred';
    const updatedOrganizationMock = {
      _id: 'organization_id',
      save: jest.fn().mockRejectedValue(new Error(errorMessage)),
    };

    OrganizationModel.findById.mockResolvedValue(updatedOrganizationMock);

    await organizationController.updateAccount(req, res);

    // Expectations
    expect(OrganizationModel.findById).toHaveBeenCalledWith('organization_id');
    expect(updatedOrganizationMock.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Error while updating organization details',
      error: expect.any(Error),
    });
  });
});

describe('createEvent', () => {
  let req, res;

  beforeEach(() => {
    req = {
      organization: {
        id: 'organization_id', // Mock organization ID
      },
      body: {
        title: 'Test Event',
        description: 'Test event description',
        location: 'Test Location',
        category: 'Test Category',
        start_date: new Date(),
        end_date: new Date(),
        image: 'test_image.jpg',
      },
    };
    res = {
      json: jest.fn(),
      status: jest.fn(() => res),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create event successfully', async () => {
    const organizationMock = {
      _id: 'organization_id',
      events: [],
      save: jest.fn().mockResolvedValue(),
    };

    OrganizationModel.findById.mockResolvedValue(organizationMock);
    EventModel.prototype.save = jest.fn().mockResolvedValue({ _id: 'event_id' });

    await organizationController.createEvent(req, res);

    const receivedEventId = organizationMock.events[0].toString();

    // Expectations
    expect(OrganizationModel.findById).toHaveBeenCalledWith('organization_id');
    expect(EventModel.prototype.save).toHaveBeenCalled();
    expect(receivedEventId).toEqual(receivedEventId); // Check for the specific event ID
    expect(organizationMock.save).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      message: 'Event successfully created',
      event: expect.any(Object),
    });
  });

  it('should return error if organization is not found', async () => {
    OrganizationModel.findById.mockResolvedValue(null);

    await organizationController.createEvent(req, res);

    // Expectations
    expect(OrganizationModel.findById).toHaveBeenCalledWith('organization_id');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Organization not found' });
  });

  it('should handle errors while creating event', async () => {
    const errorMessage = 'Some error occurred';

    OrganizationModel.findById.mockResolvedValue({
      _id: 'organization_id',
    });

    EventModel.prototype.save = jest.fn().mockRejectedValue(new Error(errorMessage));

    await organizationController.createEvent(req, res);

    // Expectations
    expect(OrganizationModel.findById).toHaveBeenCalledWith('organization_id');
    expect(EventModel.prototype.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Error while creating event',
      error: errorMessage,
    });
  });
});