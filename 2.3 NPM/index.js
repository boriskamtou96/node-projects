import generateName from 'sillyname';
import { randomSuperhero } from 'superheroes';

const heroName = randomSuperhero();
const sillyName = generateName();

console.log(`My name is ${sillyName} and I am ${heroName}`);
