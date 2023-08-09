const DonationModel = require("../../db/models/donation");
const request = require("supertest");
const app = require("../../app");

require("dotenv").config();
const sendEmail = require("../../utils/email");
const jwt = require('jsonwebtoken');
const donationController = require("../donation");

jest.mock("jsonwebtoken");

jest.mock('../../utils/email');

jest.mock("stripe", () => {
    return () => ({
        checkout: {
            sessions: {
                create: jest.fn(() => ({
                    id: "mockSessionId",
                    url: "https://mock-stripe-checkout-url",
                })),
                listLineItems: jest.fn(() => ({
                    data: [{
                        amount_total: 10000,
                    }, ],
                }), ),
            },
        },
    });
});

const createMock = jest.spyOn(DonationModel, 'create').mockResolvedValue({
    _id: 'mockDonationId',
    sessionID: 'mockSessionId',
    amount: 100,
    donor: 'mockUserId',
    date: 'mockDate'

});

jest.spyOn(DonationModel, 'find').mockResolvedValue({
    _id: 'mockDonationId',
    sessionID: 'mockSessionId',
    amount: 100,
    donor: 'mockUserId',
    date: 'mockDate'
});
const jwtVerifyMock = jest.spyOn(jwt, 'verify').mockReturnValue({
    sessionID: 'mockSessionId',
    created: Date.now()
});
let authToken; // Store the JWT token for authenticated requests
let token;
beforeAll(() => {
            // Generate a mock JWT token for authentication
            authToken = jwt.sign({
                id: "mockUserId",
                username: "mockUser",
                email: "mockUser@mockUser.com",
                isAdmin: false, // Set this based on your user model
            }, process.env.JWT_SECRET);

    token = jwt.sign({
        sessionID: "mockSessionId",
        created: "mockDate",
        exp: Math.floor(Date.now() / 1000) + 3600,
        iat: Math.floor(Date.now() / 1000), // Issued at date
    }, process.env.JWT_SECRET);
    });

describe("Donation Controller", () => {

    // Test for checkout function
    describe("POST /donation/checkout", () => {
        it("should create a checkout session and redirect with token", async () => {
            const response = await request(app)
                .post("/donation/checkout")
                .set("Cookie", [`jwt=${authToken}`])
                .expect(303);

            expect(response.headers.location).toContain(
                "https://mock-stripe-checkout-url"
            );

            // Check if the token is created
            expect(jwt.sign).toHaveBeenCalled();
            // Check if the token is set in the cookie
            expect(response.headers["set-cookie"][0]).toContain("pSession=");

            // Check if the token is decoded
            expect(jwt.verify).toHaveBeenCalledTimes(1);
            expect(jwt.verify).toHaveBeenCalledWith(expect.any(String), process.env.JWT_SECRET);
        });
    });

    describe("GET /donation/success", () => {
        it("should complete donation and clear session cookie", async () => {

            const req = {
                user: {
                    id: 'mockUserId',
                    username: 'mockUser',
                    email: 'mockUser@mockUser.com'
                },
                cookies: {
                    pSession: 'mockSessionToken'
                }
            };

            const response = await request(app)
                .get("/donation/success")
                .set("Cookie", [`jwt=${authToken}`, `pSession=${token}`])
                .expect(200); // Adjust the status code based on your implementation

            expect(sendEmail).toHaveBeenCalledTimes(1);

            expect(response.text).toEqual("Success");
            expect(response.headers["set-cookie"][0]).toContain("pSession=");

            expect(createMock).toHaveBeenCalled();

            expect(jwtVerifyMock).toHaveBeenCalled();
            expect(jwtVerifyMock).toHaveBeenCalledWith(expect.any(String), process.env.JWT_SECRET);
            expect(jwt.verify).toHaveBeenCalled();
            expect(jwt.verify).toHaveBeenCalledWith(expect.any(String), process.env.JWT_SECRET);

            // Clean up mocks
            jwtVerifyMock.mockRestore();
            createMock.mockRestore();
        });
    });

    describe("GET /donation/cancel", () => {
        it('should respond with "Cancelled"', async () => {
            const response = await request(app)
                .get("/donation/cancel")
                .set("Cookie", [`jwt=${authToken}`])
                .expect(200);
            expect(response.text).toEqual("Cancelled");
        });
    });


    describe('GET /donation', () => {
        it('should return user donations', async () => {
            const mockUser = {
                id: 'mockUserId',
                username: 'mockUser',
                email: 'mockUser@mockUser.com'
            };
            const mockDonations = [{
                    _id: 'mockDonationId1',
                    amount: 100,
                    donor: 'mockUserId',
                    date: 'mockDate'
                },
                {
                    _id: 'mockDonationId2',
                    amount: 200,
                    donor: 'mockUserId',
                    date: 'mockDate'
                },
            ];

            // Mocking the request and response objects
            const mockReq = {
                user: mockUser
            };
            const mockRes = {
                json: jest.fn(),
                status: jest.fn(() => mockRes),
            };

            DonationModel.find.mockReturnValue({
                populate: jest.fn().mockResolvedValue(mockDonations),

            });

            // Calling the function and asserting expectations
            await donationController.getDonations(mockReq, mockRes);

            expect(DonationModel.find).toHaveBeenCalledWith({
                donor: 'mockUserId'
            });
            expect(mockRes.json).toHaveBeenCalledWith(mockDonations);
            expect(mockRes.status).not.toHaveBeenCalled();
        });
    });

    describe('GET /donation:id', () => {
        it('should return a specific donation', async () => {
            const mockUser = {
                id: 'mockUserId',
                username: 'mockUser',
                email: 'mockUser@mockUser.com'
            };
            const mockDonation = {
                _id: 'mockDonationId',
                amount: 100,
                donor: 'mockUserId',
                date: 'mockDate'
            };

            // Mocking the request and response objects
            const mockReq = {
                user: mockUser,
                params: {
                    id: 'mockDonationId'
                }
            };
            const mockRes = {
                json: jest.fn(),
                status: jest.fn(() => mockRes),
            };

            const findOneMock = jest.fn().mockReturnValue({
                populate: jest.fn().mockResolvedValue(mockDonation),
            });
            DonationModel.findOne = findOneMock;

            await donationController.getDonationById(mockReq, mockRes);

            expect(DonationModel.findOne).toHaveBeenCalledWith({
                _id: 'mockDonationId',
                donor: 'mockUserId'
            });
            expect(mockRes.json).toHaveBeenCalledWith(mockDonation);
            expect(mockRes.status).not.toHaveBeenCalled();
        });
    });
});