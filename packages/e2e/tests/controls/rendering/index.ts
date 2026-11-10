import { beforeAll } from '../../test';
import { installOriginWrapperUpdater } from '@fabricjs/data-updaters';

beforeAll(() => {
  installOriginWrapperUpdater();
  return {};
});
