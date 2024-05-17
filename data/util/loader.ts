import { resolve } from 'path';
import { DataSource } from 'typeorm';
import {
  Builder,
  Loader,
  Parser,
  Resolver,
  fixturesIterator,
} from 'typeorm-fixtures-cli/dist';
import { CommandUtils } from 'typeorm/commands/CommandUtils';

/**
 * Loads fixtures into the data source.
 *
 * @param fixturesPath - The path to the fixtures.
 * @param dataSourcePath - The path to the data source.
 * @returns A promise that resolves when the fixtures are loaded.
 * @throws If an error occurs while loading the fixtures.
 */
export async function loadFixtures({
  fixturesPath,
  dataSourcePath,
}: {
  fixturesPath: string;
  dataSourcePath: string;
}): Promise<void> {
  let dataSource: DataSource | undefined = undefined;

  try {
    dataSource = await CommandUtils.loadDataSource(dataSourcePath);
    await dataSource.initialize();
    await dataSource.synchronize(true);

    const loader = new Loader();
    loader.load(resolve(fixturesPath));

    const resolver = new Resolver();
    const fixtures = resolver.resolve(loader.fixtureConfigs);
    const builder = new Builder(dataSource, new Parser(), false);

    for (const fixture of fixturesIterator(fixtures)) {
      const entity: any = await builder.build(fixture);
      await dataSource.getRepository(fixture.entity).save(entity);
    }
  } catch (err) {
    throw err;
  } finally {
    if (dataSource) {
      await dataSource.destroy();
    }
  }
}
