module.exports = (sequelize, DataTypes) => {

    const Model = sequelize.define('User', {
        name: {
            type: DataTypes.STRING(50)
        },
        email: {
            type: DataTypes.STRING(50)
        },
        password: {
            type: DataTypes.STRING(200)
        },
        avatar: {
            type: DataTypes.STRING(300)
        },
        admin: {
            type: DataTypes.BOOLEAN
        }
    }, {
        tableName: 'users'
    });

    return Model;
};