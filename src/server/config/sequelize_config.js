require("@babel/register");

module.exports = {
  development: {
    host: "db",
    username: "postgres",
    password: "password",
    database: "noipm-db",
    dialect: "postgres",
    migrationStorageTableName: "sequelize_meta",
    seederStorage: "sequelize",
    seederStorageTableName: "sequelize_data",
    operatorsAliases: "0",
    logging: false,
    pool: {
      max: 10,
      min: 0,
      idle: 10000,
      acquire: 20000
    }
  },
  test1: {
    host: "localhost",
    storage: ":memory",
    dialect: "sqlite",
    //models: __dirname + "../policeDataManager/models",
    migrationStorageTableName: "sequelize_meta",
    seederStorage: "sequelize",
    seederStorageTableName: "sequelize_data",
    logging: console.log,
    operatorsAliases: "0",
    pool: {
      max: 10,
      min: 0,
      idle: 10000,
      acquire: 20000
    },
    retry: {
      match: [/SQLITE_BUSY/],
      name: "query",
      max: 10
    },
    transactionType: "IMMEDIATE"
  },
  test2: {
    host: "localhost",
    storage: ":memory",
    dialect: "sqlite",
   //gra models: __dirname + "../policeDataManager/models",
    migrationStorageTableName: "sequelize_meta",
    seederStorage: "sequelize",
    seederStorageTableName: "sequelize_data",
    logging: console.log,
    operatorsAliases: "0",
    pool: {
      max: 10,
      min: 0,
      idle: 10000,
      acquire: 20000
    },
    retry: {
      match: [/SQLITE_BUSY/],
      name: "query",
      max: 10
    },
    transactionType: "IMMEDIATE"
  },
  playground: {
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE_NAME,
    dialectOptions: {
      ssl: { rejectUnauthorized: false }
    },
    dialect: "postgres",
    operatorsAliases: "0",
    migrationStorageTableName: "sequelize_meta",
    seederStorage: "sequelize",
    seederStorageTableName: "sequelize_data",
    pool: {
      max: 10,
      min: 0,
      idle: 10000,
      acquire: 20000
    }
  },
  ci: {
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE_NAME,
    dialectOptions: {
      ssl: { rejectUnauthorized: false }
    },
    dialect: "postgres",
    operatorsAliases: "0",
    migrationStorageTableName: "sequelize_meta",
    seederStorage: "sequelize",
    seederStorageTableName: "sequelize_data",
    pool: {
      max: 10,
      min: 0,
      idle: 10000,
      acquire: 20000
    }
  },
  staging: {
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE_NAME,
    dialectOptions: {
      ssl: { rejectUnauthorized: false }
    },
    dialect: "postgres",
    operatorsAliases: "0",
    migrationStorageTableName: "sequelize_meta",
    seederStorage: "sequelize",
    seederStorageTableName: "sequelize_data",
    pool: {
      max: 15,
      min: 0,
      idle: 10000,
      acquire: 20000
    }
  },
  production: {
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE_NAME,
    dialectOptions: {
      ssl: { rejectUnauthorized: false }
    },
    dialect: "postgres",
    migrationStorageTableName: "sequelize_meta",
    seederStorage: "sequelize",
    seederStorageTableName: "sequelize_data",
    logging: false,
    operatorsAliases: "0",
    pool: {
      max: 100,
      min: 0,
      idle: 10000,
      acquire: 20000
    }
  }
};
