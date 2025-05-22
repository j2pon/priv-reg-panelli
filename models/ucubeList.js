module.exports = (sequelize, DataTypes) => {
    return sequelize.define('UcubeList', {
        userId: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        }
    });
};
