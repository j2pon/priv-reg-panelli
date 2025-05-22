module.exports = (sequelize, DataTypes) => {
    return sequelize.define('BotState', {
        key: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        value: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });
};
