const { DataSource } = require('typeorm');

const config = {
	username: "postgres",
	host: "localhost",
	database: "postgres",
	type: 'postgres',
	password: "test",
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
  migrationsTableName: 'custom_migration_table',
  synchronize: false,
};

const dataSource = new DataSource(config);

module.exports = { dataSource };