const Sequelize = require('sequelize');
const glob = require('glob');
const path = require('path');
const config = require('../config/database.config');
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: 'mysql',
    logging: true
});

// Resolve path to models
const modelsPath = path.join(__dirname, '..', 'models');

// Find and load all model files
const modelFiles = glob.sync(path.join(modelsPath, '**/*.model.js'), { ignore: '**/node_modules/**' });

modelFiles.forEach((file) => {
    const model = require(file)(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
});

// Associate models if needed
Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
