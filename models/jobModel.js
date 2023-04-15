const mongoose = require('mongoose');

const jobSchema = mongoose.Schema({
    companyName: {
        type: String,
        required: true
    },
    logoUrl: {
        type: String
    },
    jobPosition: {
        type: String,
        required: true
    },
    monthSalary: {
        type: Number,
        required: true
    },
    jobType: {
        type: String,
        required: true
    },
    workAt: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    jobDescription: {
        type: String,
        required: true
    },
    aboutCompany: {
        type: String,
        required: true
    },
    skills: {
        type: Array,
        required: true
    }

});

const Job = mongoose.model('job', jobSchema);

module.exports = Job;