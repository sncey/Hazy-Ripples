require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');
const EventModel = require('../../db/models/event');
const jwt = require('jsonwebtoken');
const UserModel = require('../../db/models/user');

const user = {
    _id: new mongoose.Types.ObjectId(),
    username: 'testuser',
    email: 'testuser@testuser.com',
    firstname: "test",
    lastname: "user",
    password: "1-Zb34343434",
    confirmPassword: "1-Zb34343434",
    phoneNumber: 43235224575,
    birthday: "2002-10-20",
    gender: "male",
    avatar: "test"
};

const event = {
    _id: new mongoose.Types.ObjectId(),
    title: 'Test event',
    organizer: new mongoose.Types.ObjectId(),
    description: 'Sample event description',
    location: 'Sample location',
    category: 'Sample category',
    start_date: new Date().setDate(new Date().getDate() + 1),
    end_date: new Date().setDate(new Date().getDate() + 1),
    expired: false,
};

const payload = {
    email: user.email,
    username: user.username,
    id: user._id,
    isAdmin: false,
};

// Set up a test database connection
beforeAll(async () => {
        await mongoose.connect(process.env.MONGODB_TEST_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});
// Clear data from the test database after each test
afterEach(async () => {
    await UserModel.deleteMany({});
    await EventModel.deleteMany({});
});

// Close the test database connection after all tests
afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
});
describe('GET /events', () => {
    it('should get a list of non-expired events', async () => {
        const sampleEvents = [{
                title: 'Event 1',
                organizer: new mongoose.Types.ObjectId(),
                description: 'Sample event description',
                location: 'Sample location',
                category: 'Sample category',
                start_date: new Date(),
                end_date: new Date().setDate(new Date().getDate() + 1),
                expired: false,
            },
            {
                title: 'Event 2',
                organizer: new mongoose.Types.ObjectId(),
                description: 'Sample event description',
                location: 'Sample location',
                category: 'Sample category',
                start_date: new Date(),
                end_date: new Date().setDate(new Date().getDate() + 1),
                expired: true,
            },
        ];

        await EventModel.insertMany(sampleEvents);
        const response = await request(app).get('/events');
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1); // Only one non-expired event
    });

    it('should handle errors and return 500 status on server error', async () => {
                // Mock an error in the EventModel.find method
        jest.spyOn(EventModel, 'find').mockReturnValue({
            populate: jest.fn().mockRejectedValue(new Error('Database error'))
        });

        // Make a GET request to the endpoint
        const response = await request(app).get('/events');

        // Check the response status code
        expect(response.status).toBe(500);

        // Check the response body for error details
        expect(response.body).toHaveProperty('error', 'Database error');

        // Restore the original method to avoid affecting other tests
        EventModel.find.mockRestore();
    });
});

describe('POST /events/attend/:eventId', () => {
    it('should attend an event', async () => {
        await UserModel.create(user);
        await EventModel.create(event);

        const response = await request(app)
            .post(`/events/attend/${event._id}`)
            .set('Cookie', [`jwt=${jwt.sign(payload, process.env.JWT_SECRET)}`]);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'You are now attending the event');
        expect(response.body.event.attendees).toContain(user._id.toString());
    });

    it('should return 404 status if the event is not found', async () => {
        await UserModel.create(user);

        const response = await request(app)
            .post(`/events/attend/${new mongoose.Types.ObjectId()}`)
            .set('Cookie', [`jwt=${jwt.sign(payload, process.env.JWT_SECRET)}`]);

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message', 'Event not found or has already expired');
    });
    it('should return 400 status if the user is already attending the event', async () => {
        user.events = [event._id];

        await UserModel.create(user);
        await EventModel.create(event);

        const response = await request(app)
            .post(`/events/attend/${event._id}`)
            .set('Cookie', [`jwt=${jwt.sign(payload, process.env.JWT_SECRET)}`]);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'You are already attending this event');
    });

    it('should return 404 status if the user is not found', async () => {
                    await EventModel.create(event);
            const payload = {
                email: user.email,
                username: user.username,
                id: new mongoose.Types.ObjectId(),
                isAdmin: false,
            };

        const response = await request(app)
            .post(`/events/attend/${event._id}`)
            .set('Cookie', [`jwt=${jwt.sign(payload, process.env.JWT_SECRET)}`]);

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message', 'User not found');
        });
it('should return 404 status if the event has expired', async () => {
                event.expired = true;

    await UserModel.create(user);
    await EventModel.create(event);

    const response = await request(app)
        .post(`/events/attend/${event._id}`)
        .set('Cookie', [`jwt=${jwt.sign(payload, process.env.JWT_SECRET)}`]);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'Event not found or has already expired');
    });

it('should return 500 status on server error', async () => {
                jest.spyOn(EventModel, 'findById').mockRejectedValue(new Error('Database error'));

    const response = await request(app)
        .post(`/events/attend/${new mongoose.Types.ObjectId()}`)
        .set('Cookie', [`jwt=${jwt.sign(payload, process.env.JWT_SECRET)}`]);

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error', 'Database error');
    EventModel.findById.mockRestore();
    });
    });

describe('POST /events/unattend/:eventId', () => {
    it('should return 404 status if the event has expired', async () => {
                    event.expired = true;

    await UserModel.create(user);
    await EventModel.create(event);

    const response = await request(app)
        .post(`/events/unattend/${event._id}`)
        .set('Cookie', [`jwt=${jwt.sign(payload, process.env.JWT_SECRET)}`]);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'Event not found or has already expired');
    });

    it('should unattend an event', async () => {
    event.expired = false;

    await UserModel.create(user);
    await EventModel.create(event);

    const response = await request(app)
        .post(`/events/unattend/${event._id}`)
        .set('Cookie', [`jwt=${jwt.sign(payload, process.env.JWT_SECRET)}`]);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'You have unattended the event');
    expect(response.body.event.attendees).not.toContain(user._id.toString());
    });

    it('should return 404 status if the event is not found', async () => {
            await UserModel.create(user);

    const response = await request(app)
        .post(`/events/unattend/${new mongoose.Types.ObjectId()}`)
        .set('Cookie', [`jwt=${jwt.sign(payload, process.env.JWT_SECRET)}`]);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'Event not found or has already expired');
    });

    it('should return 400 status if the user is not attending the event', async () => {
            event.attendees = [];
            user.events = [];
            await UserModel.create(user);
            await EventModel.create(event);

    const response = await request(app)
        .post(`/events/unattend/${event._id}`)
        .set('Cookie', [`jwt=${jwt.sign(payload, process.env.JWT_SECRET)}`]);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'You are not attending this event');
    });


    it('should return 404 status if the user is not found', async () => {
            const payload = {
                email: user.email,
                username: user.username,
                id: new mongoose.Types.ObjectId(),
                isAdmin: false,
            };

    await EventModel.create(event);

    const response = await request(app)
        .post(`/events/unattend/${event._id}`)
        .set('Cookie', [`jwt=${jwt.sign(payload, process.env.JWT_SECRET)}`]);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'User not found');
    });

    it('should return 500 status on server error', async () => {
            jest.spyOn(EventModel, 'findById').mockRejectedValue(new Error('Database error'));

    const response = await request(app)
        .post(`/events/unattend/${new mongoose.Types.ObjectId()}`)
        .set('Cookie', [`jwt=${jwt.sign(payload, process.env.JWT_SECRET)}`]);

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error', 'Database error');
    EventModel.findById.mockRestore();
    });
});