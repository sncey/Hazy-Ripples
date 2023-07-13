const mongoose = require('mongoose');

const organizationSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type:String,
        required: true,
        unique: true,
    },
    events: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
    }],

    description: {
        type: String,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    image: {
        type: String,
    },

})

module.exports = mongoose.model('Organization', organizationSchema);