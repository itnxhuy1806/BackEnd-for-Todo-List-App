import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
    class Task extends Model {
        static associate(models) {
            Task.belongsTo(models.TodoList, {
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            })
        }
        static async createNewTask({ content, idTodoList }) {
            return sequelize.transaction(() => {
                return Task.create({ content });
                // return Task.create({ content, idTodoList }, { include: [Task.idTodoList] });
            });
        }
    }
    Task.init(
        {
            content: {
                type: DataTypes.STRING(100),
                validate: {
                    len: {
                        args: [1, 100],
                        msg: 'Task content must contain between 2 and 50 characters',
                    },
                },
            },
        },
        {
            sequelize,
            modelName: 'Task',
        }
    );
    return Task;
};