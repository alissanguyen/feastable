const mongoose = require('mongoose');

const Schema = mongoose.Schema;

mongoose.Promise = global.Promise

const md5 = require('md5');

const validator = require('validator');

const mongodbErrorHandler = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('password-local-mongoose');

const userSchema = new Schema({

});

