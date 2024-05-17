import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1715801212253 implements MigrationInterface {
  name = 'Migrations1715801212253';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`picture\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`title\` varchar(255) NOT NULL, \`description\` text NULL, \`category\` enum ('FRONT', 'BACK', 'LEFT', 'RIGHT', 'INSIDE', 'ENGINE', 'TRUNK', 'WHEEL', 'DASHBOARD', 'SEAT', 'OTHER') NOT NULL DEFAULT 'FRONT', \`url\` text NOT NULL, \`key\` text NOT NULL, \`format\` varchar(10) NOT NULL, \`car_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`car\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`make\` varchar(255) NOT NULL, \`model\` varchar(255) NOT NULL, \`year\` int NOT NULL DEFAULT '2024', \`color\` varchar(255) NOT NULL, \`mileage\` int NOT NULL DEFAULT '0', \`fuelType\` enum ('Gasoline', 'Diesel', 'Electric', 'Hybrid', 'Gas') NOT NULL DEFAULT 'Gasoline', \`transmission\` enum ('Automatic', 'Manual') NOT NULL DEFAULT 'Manual', \`seats\` int NOT NULL DEFAULT '5', \`pricePerDay\` int NOT NULL DEFAULT '0', \`available\` tinyint NOT NULL DEFAULT 0, \`type\` enum ('Sedan', 'SUV', 'Truck', 'Van', 'Convertible', 'Coupe', 'Hatchback') NOT NULL DEFAULT 'Sedan', \`condition\` enum ('New', 'Used', 'Damaged') NOT NULL DEFAULT 'New', \`location\` text NOT NULL, \`licensePlate\` varchar(10) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`picture\` ADD CONSTRAINT \`FK_b215d9d07903dd6468acfd24eb5\` FOREIGN KEY (\`car_id\`) REFERENCES \`car\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`picture\` DROP FOREIGN KEY \`FK_b215d9d07903dd6468acfd24eb5\``,
    );
    await queryRunner.query(`DROP TABLE \`car\``);
    await queryRunner.query(`DROP TABLE \`picture\``);
  }
}
