import faker from 'faker';
import Survivor from '../models/Survivor.model';

export const survivorFactory = (survivor = {}): Survivor =>
  ({
    name: faker.name.findName(),
    age: faker.random.number({ min: 0, max: 100, precision: 1 }),
    gender: faker.random.arrayElement(['male', 'female']),
    inventory: {
      fijiWater: faker.random.number({ min: 0, max: 100, precision: 1 }),
      campbellSoup: faker.random.number({ min: 0, max: 100, precision: 1 }),
      firstAidPouch: faker.random.number({ min: 0, max: 100, precision: 1 }),
      ak47: faker.random.number({ min: 0, max: 100, precision: 1 }),
    },
    location: {
      longitude: faker.random.number({ min: -360, max: 360 }),
      latitude: faker.random.number({ min: -360, max: 360 }),
    },
    ...survivor,
  } as Survivor);

export default { survivorFactory };
