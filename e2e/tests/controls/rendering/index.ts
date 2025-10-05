import { beforeAll } from '../../test';
import * as fabricExtensions from 'fabric/extensions';

beforeAll(() => {
  fabricExtensions.installOriginWrapperUpdater();
  return {};
});
