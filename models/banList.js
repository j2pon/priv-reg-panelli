module.exports = (sequelize, DataTypes) => {
    return sequelize.define('BanList', {
        userId: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        }
    });
};
