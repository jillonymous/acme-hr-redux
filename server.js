const Sequelize = require('sequelize');
const { STRING, UUID, UUIDV4 } = Sequelize;
const conn = new Sequelize(
  process.env.DATABASE_URL || 'postgres://localhost/acme_hr'
);

const User = conn.define('user', {
  id: {
    type: UUID,
    defaultValue: UUIDV4,
    primaryKey: true,
  },
  name: {
    type: STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
});

const Department = conn.define('department', {
  id: {
    type: UUID,
    defaultValue: UUIDV4,
    primaryKey: true,
  },
  name: {
    type: STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
});

User.belongsTo(Department);
Department.hasMany(User);

const init = async () => {
  console.log('start');
  try {
    await conn.sync({ force: true });
    const [moe, lucy, larry, ethel, hr, engineering, finance] =
      await Promise.all([
        User.create({ name: 'Moe' }),
        User.create({ name: 'Lucy' }),
        User.create({ name: 'Larry' }),
        User.create({ name: 'Ethel' }),
        Department.create({ name: 'HR' }),
        Department.create({ name: 'Engineering' }),
        Department.create({ name: 'Finance' }),
      ]);

    lucy.departmentId = engineering.id;
    ethel.departmentId = engineering.id;
    larry.departmentId = hr.id;

    await Promise.all([lucy.save(), ethel.save(), larry.save()]);
  } catch (err) {
    console.log(err);
  }
};

init();
