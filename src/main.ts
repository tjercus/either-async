import { Maybe, Either, EitherAsync, Left, Right } from "purify-ts";

type Animal = {
  skin: string;
  legs: number;
}

type Machine = {
  weight: number;
  color: string;
}

type Combined = {
  skin: string;
  legs: number;
  weight: number;
  color: string;
}

type CustomError = {
  message: string;
}

/* ------------------------- test data --------------------------  */

const firstAnimal: Right<Animal> = ({ skin: "fur", legs: 4 });

const firstMachine: Right<Machine> = ({ weight: 100, color: "red" });

/* ------------------------- functions --------------------------  */

export const getAnimalFromApi = (): EitherAsync<CustomError, Animal> => {
  return EitherAsync(async ({ liftEither }) => {
    return liftEither(Right(firstAnimal))
  });
};

const getMachineFromApi = (): EitherAsync<CustomError, Machine> => {
  return EitherAsync(async ({ liftEither }) => {
    return liftEither(Right(firstMachine))
  });
};

const combineAnimalAndMachine = (animal: Animal) => (machine: Machine) => {
  return ({ ...animal, ...machine });
}

// Composing the two applicatives
// NOTE this does not work!
/*
 The error TypeError: otherValue.extract(...) is not a function you're encountering is likely due to a
 misunderstanding about how ap works in this context. The issue stems from trying to apply a curried function
 inside EitherAsync using ap and assuming the function will lift properly across the monadic structure.
 EitherAsync does not directly support the applicative ap pattern in the same way you would expect in Either or
 similar functional types. Specifically, the issue arises when trying to use ap for asynchronous
 computations like EitherAsync.
*/
// const combinedResult: EitherAsync<CustomError, Combined> =
//   EitherAsync.liftEither(Right(combineAnimalAndMachine)) // Lifting the combining function
//     .ap(getAnimalFromApi()) // Apply the first applicative (animal)
//     .ap(getMachineFromApi()) // Apply the second applicative (machine)

// Composing the two applicatives using chain and map
// NOTE this DOES work!
const combinedResult: EitherAsync<CustomError, Combined> =
  getAnimalFromApi().chain(
    (animal: Animal) => getMachineFromApi().map(
      (machine: Machine) => combineAnimalAndMachine(animal)(machine)
    )
  );

/* ---------------------------- runtime ---------------------------  */

const animalAndMachineEither: Either<CustomError, Combined> = await combinedResult.run();

// To run the flow using some pattern matching on the forked result
animalAndMachineEither.caseOf({
  Left: (error: CustomError) => {
    console.error("An error occurred:", error.message);
  },
  Right: (data: Combined) => {
    console.log("Success!", data);
  }
});
