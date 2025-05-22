const Sequelize = require('sequelize');
const config = require('../config.json')
const sequelize = new Sequelize(config.mysql.database, config.mysql.username, config.mysql.password, {
    host: config.mysql.host,
    dialect: 'mysql',
    logging: false
});

const BanList = require('./banList')(sequelize);
const UcubeList = require('./ucubeList')(sequelize);
const BotState = require('./BotState')(sequelize);

module.exports = {
    sequelize,
    Sequelize,
    BanList,
    UcubeList,
    BotState
};
