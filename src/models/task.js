import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  class Task extends Model {
    static associate(models) {
      Task.belongsTo(models.TodoList, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        foreignKey: {
          allowNull: false,
        },
      });
    }
  }
  Task.init(
    {
      content: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          len: {
            args: [1, 100],
            msg: "Task content must contain between 2 and 50 characters",
          },
        },
      },
      description: {
        type: DataTypes.STRING(100),
        validate: {
          len: {
            args: [1, 255],
            msg: "Task content must contain between 2 and 50 characters",
          },
        },
      },
      checked: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
      },
    },
    {
      sequelize,
      modelName: "Task",
    }
  );
  return Task;
};
