const Datastore = require('nedb');
const db = new Datastore({ 'filename':'./boards', autoload: true });

module.exports = db;
