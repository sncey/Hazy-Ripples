const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
    title : {
        type: String,
        required: true,
    },
    organizer: {
        type: String,
        required:true,
        ref: 'Organization',
    },
    description: {
        type: String,
        required: true,
    },
    location: {
        type: String,
    },
    start_date: {
        type: Date,
        required: true,
    },
    end_date: {
        type: Date,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    image: {
        type: String,
    },
    is_published: {
        type: Boolean,
        default: false,
    },
    attendees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
})


module.exports = mongoose.model('Event', eventSchema);