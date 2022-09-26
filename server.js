const express = require("express");

// expressQL
const expressGraphQL = require("express-graphql").graphqlHTTP;

const authors = [
  { id: 1, name: "Bill Gates" },
  { id: 2, name: "Steve jobs" },
  { id: 3, name: "李嘉誠" },
  { id: 4, name: "Jack Ma" },
  { id: 5, name: "Eric son" },
];

const books = [
  { id: 1, name: "Harry Potter and the Chamber of Secrets", authorId: 1 },
  { id: 2, name: "Harry Potter and Handboy Zidane", authorId: 1 },
  { id: 3, name: "Harry Potter and the Goblet of Fire", authorId: 1 },
  { id: 4, name: "How to find your job?", authorId: 2 },
  { id: 5, name: "Two Pets", authorId: 2 },
  { id: 6, name: "Dragon Ball Z - Kakarot", authorId: 3 },
  { id: 7, name: "This Lands is My Land", authorId: 3 },
  { id: 8, name: "Zombie Volleteen", authorId: 4 },
  { id: 9, name: "Final Fantasy 7 Remark Integrated", authorId: 5 },
  { id: 10, name: "Conqueror's Blade", authorId: 3 },
];

const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLInt,
} = require("graphql");

const app = express();

const AuthorType = new GraphQLObjectType({
  name: "Author",
  description: "This representation of Authors",
  fields: () => ({
    id: {
      type: GraphQLNonNull(GraphQLInt),
    },
    name: {
      type: GraphQLNonNull(GraphQLString),
    },
    books: {
      type: BookType,
      resolve: (author) => {
        return books.filter((b) => book.authorId === author.id);
      },
    },
  }),
});

const BookType = new GraphQLObjectType({
  name: "Book",
  description: "This representation of Books write by an author",
  fields: () => ({
    id: {
      type: GraphQLNonNull(GraphQLInt),
      description: "This is id field",
    },
    name: {
      type: GraphQLNonNull(GraphQLString),
    },
    authorId: {
      type: GraphQLNonNull(GraphQLInt),
    },
    author: {
      type: AuthorType,
      resolve: (book) => {
        return authors.find((a) => a.id === book.authorId);
      },
    },
  }),
});

const RootQueryType = new GraphQLObjectType({
  name: "Query",
  description: "Root Query",
  fields: () => ({
    book: {
      type: BookType,
      description: "A Single book",
      args: {
        id: {
          type: GraphQLInt,
        },
      },
      resolve: (parent, args) => books.find((b) => b.id === args.id),
    },

    author: {
      type: AuthorType,
      description: "A single Author",
      args: {
        id: {
          type: GraphQLInt,
        },
      },
      resolve: (parent, args) => {
        return authors.find((a) => a.id === args.id);
      },
    },

    books: {
      type: new GraphQLList(BookType),
      description: "List of all books now",
      resolve: () => books,
    },

    authors: {
      type: new GraphQLList(AuthorType),
      description: "List of all authors now",
      resolve: () => authors,
    },
  }),
});

// const schema = new GraphQLSchema({
//     query: new GraphQLObjectType({
//         name: 'HelloZidane',    // cannot space
//         fields: () => ({
//             message: {
//                 type: GraphQLString,
//                 resolve: (parent, args) => 'Hello world'
//             }
//         })
//     })
// })

const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root mutation',
    fields: () => ({
        addBook: {
            type: BookType,
            description: 'Add book',
            args: {
                name: {
                    type: GraphQLNonNull(GraphQLString)
                }
            }
        }
    })
})

const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType,
});

app.use(
  "/graphql",
  expressGraphQL({
    schema: schema,
    graphiql: true, // show UI graphQL
  })
);
app.listen(5000, () => console.log("server is running!!!"));
