import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeORMConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres', // default username for postgres
  password: 'postgres', // default password for postgres
  database: 'Macro-app',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true,
};
