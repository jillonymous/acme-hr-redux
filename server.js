// TODO: separate out to db folder
const Sequelize = require('sequelize');
const { STRING, UUID, UUIDV4 } = Sequelize;
const conn = new Sequelize(
  process.env.DATABASE_URL || 'postgres://localhost/acme_hr'
);
const express = require('express');
const app = express();
const path = require('path');

app.use(express.json());

app.use('/dist', express.static('dist'));
app.use('/src', express.static('src'));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.post('/api/users', async (req, res, next) => {
  try {
    res.status(201).send(await User.create(req.body));
  } catch (err) {
    next(err);
  }
});

app.get('/api/users', async (req, res, next) => {
  try {
    res.send(await User.findAll());
  } catch (err) {
    next(err);
  }
});

app.get('/api/departments', async (req, res, next) => {
  try {
    res.send(await Department.findAll());
  } catch (err) {
    next(err);
  }
});

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

    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`Listening on port ${port}`));
  } catch (err) {
    console.log(err);
  }
};

init();
