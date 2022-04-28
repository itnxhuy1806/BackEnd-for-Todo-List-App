import { Model, DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';
import environment from '../config/environment';

export default (sequelize) => {
    class User extends Model {
        static associate(models) {
            User.RefreshToken = User.hasOne(models.RefreshToken);
            User.TodoList = User.hasMany(models.TodoList);
        }
        static async hashPassword(password) {
            return bcrypt.hash(password, environment.saltRounds);
        }
        static async createNewUser({
            email,
            password,
            username,
            refreshToken,
        }) {
            return sequelize.transaction(() => {
                return User.create(
                    {
                        email,
                        password,
                        username,
                        RefreshToken: { token: refreshToken },
                    },
                    { include: [User.RefreshToken] }
                );
            });
        }
    }
    User.init(
        {
            email: {
                type: DataTypes.STRING(100),
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: {
                        msg: 'Not a valid email address',
                    },
                    notNull: {
                        msg: 'Email is required'
                    }
                },
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            username: {
                type: DataTypes.STRING(50),
                unique: true,
                validate: {
                    len: {
                        args: [2, 50],
                        msg: 'Username must contain between 2 and 50 characters',
                    },
                },
            },
        },
        {
            sequelize,
            modelName: 'User',
            defaultScope: { attributes: { exclude: ['password'] } },
            scopes: {
                withPassword: {
                    attributes: { include: ['password'] },
                },
            },
        }
    );

    User.prototype.comparePasswords = async function (password) {
        return bcrypt.compare(password, this.password);
    };

    User.beforeSave(async (user, options) => {
        if (user.password) {
            const hashedPassword = await User.hashPassword(user.password);
            user.password = hashedPassword;
        }
    });

    User.afterCreate((user, options) => {
        delete user.dataValues.password;
    })

    return User;
};