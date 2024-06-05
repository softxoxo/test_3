import { MigrationInterface, QueryRunner } from 'typeorm';
import { User } from '../user/user.entity';
import { name, random } from 'faker';

export class SeedUsers1686584400000 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
	  const userRepository = queryRunner.connection.getRepository(User);
  
	  const users: User[] = [];
  
	  for (let i = 0; i < 1000000; i++) {
		const user = new User();
		user.firstName = name.firstName();
		user.lastName = name.lastName();
		user.age = Math.floor(random.number({ min: 1, max: 100 }));
		user.gender = random.boolean() ? 'male' : 'female';
		user.problems = random.boolean();
		users.push(user);
  
		if (users.length === 10000) {
		  await userRepository.save(users);
		  users.length = 0;
		}
	  }
  
	  if (users.length > 0) {
		await userRepository.save(users);
	  }
	}
  
	public async down(queryRunner: QueryRunner): Promise<void> {
	  await queryRunner.query('DELETE FROM "user"');
	}
  }