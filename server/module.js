const { gql } = require('apollo-server');
const uuid = require('uuid');
const R = require('ramda');

let db = [
  {id: uuid.v4(), dessert: "Oreo",nutritionInfo: {calories: 437,fat: 18, carb: 63, protein: 4, } },
  {id: uuid.v4(), dessert: "Nougat", nutritionInfo: {calories: 360,fat: 19, carb: 50, protein: 37, } }
];

const typeDefs = gql`
  type NutritionInfo {
    calories: Int!
    fat: Int!
    carb: Int!
    protein: Int!
  }

  type Dessert {
    id: ID!
    dessert: String!
    nutritionInfo: NutritionInfo!
  }

  input DessertInput {
    dessert: String!
    calories: Int!
    fat: Int!
    carb: Int!
    protein: Int!
  }

  type Query {
    listDesserts: [Dessert]
    getDessert(id: ID): Dessert
  }

  type Mutation {
    createDessert(input: DessertInput!): Dessert
    removeDessert(id: ID!): Dessert
    resetDesserts: Dessert
  }
`;

const resolvers = {
  Query: {
    listDesserts: () => db,
    getDessert: (_, { id }) => R.find(R.propEq('id', id), db),
  },
  Mutation: {
    removeDessert: (_, { id }) => {
      const index = R.findIndex(R.propEq('id', id), db);
      if (index > -1) {
        db.splice(index, 1);
      }
    },
    resetDesserts: () => {
      db = [];
    },
    createDessert: (_, args) => {
      const newDessert = R.compose(
        R.omit(['carb', 'fat', 'calories', 'protein']),
        R.assoc('id', uuid.v4()),
        R.assocPath(['nutritionInfo', 'carb'], args.input.carb),
        R.assocPath(['nutritionInfo', 'fat'], args.input.fat),
        R.assocPath(['nutritionInfo', 'calories'], args.input.calories),
        R.assocPath(['nutritionInfo', 'protein'], args.input.protein),
      )(args.input);
      db.push(newDessert);
    },
  },
};

module.exports = {
  resolvers,
  typeDefs,
}
