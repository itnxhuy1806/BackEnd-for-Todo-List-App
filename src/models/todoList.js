import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  class TodoList extends Model {
    static associate(models) {
      TodoList.Task = TodoList.hasMany(models.Task);
      TodoList.belongsTo(models.User, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        foreignKey: {
          allowNull: false,
        },
      });
    }
  }
  TodoList.init(
    {
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
          len: {
            args: [2, 50],
            msg: "TodoList name must contain between 2 and 50 characters",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "TodoList",
    }
  );
  return TodoList;
};
