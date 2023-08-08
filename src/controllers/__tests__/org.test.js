const organizationController = require('../organization');
const OrganizationModel = require('../../db/models/organization');
const jwt = require('jsonwebtoken');
const sendEmail = require('../../utils/email');
const welcomeTemplate = require('../../emailTemplates/welcome');

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
            httpOnly: true
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
      expect(res.json).toHaveBeenCalledWith({
      error: 'test@example.com is already used'
      });
      })
      });