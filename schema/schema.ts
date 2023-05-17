//**********************************ALL IMPORTS*********************************/

import dbConnection from "../config/dbConnection";
import { getJwt } from "../utils/jwttoken";
import validator from 'validator';
import genUniqueId from "../utils/getUniqueId";
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
} from "graphql";
import { isAuthenticateUser } from "../middleware/graphQlAuth";
import {validatePassword} from "../utils/InputValidators"


//**********************************Types*********************************/

const userType = new GraphQLObjectType({
  name: "user",
  fields: () => ({
    _id: { type: GraphQLString },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    message: { type: GraphQLString },
    token: { type: GraphQLString },
  }),
});


//**********************************Get DATA API********************************/

const Rootquery = new GraphQLObjectType({
  name: "userDetails",
  fields: {
    UserDetails: {
      type: new GraphQLList(userType),
      args: {
        _id: { type: GraphQLString },
      },
      resolve: async (parent, args, { req }): Promise<any> => {
        const driver = dbConnection();
        const session = driver.session({ database: "neo4j" });
        const result = await session.run(
          `MATCH (u:User {_id:'${args._id}'}) return u`
        );
        const res = result.records[0].get("u").properties;
        return [res];
      },
    },
    AllUserDetails: {
      type: new GraphQLList(userType),
      resolve: async (parent, args, context) => {
        const { req } = context;
        await isAuthenticateUser(req);
        const driver = dbConnection();
        const session = driver.session({ database: "neo4j" });
        const result = await session.run(`MATCH (u:User) return u`);
        const res = result.records.map((i) => i.get("u").properties);
        return res;
      },
    },
  },
});

//**********************************CHANGE DATA API*********************************/

const Mutation = new GraphQLObjectType({
  name: "mutation",
  fields: {

    //**********************************Registed User  End Point*********************************/

    RegisterUser: {
      type: userType,
      args: {
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      resolve: async (parent, args, { res }) => {
        if (!validator.isEmail(args.email)) {
          throw new Error('Invalid email address');
        }
        //password validation
       await validatePassword(args.password)

        const driver = dbConnection();
        const session = driver.session({ database: "neo4j" });
        const UniqueResult = await session.run(
          `MATCH (u:User {email :'${args.email}'} ) return u limit 1`
        );
        if (UniqueResult.records.length != 0) {
          if (
            args.email === UniqueResult.records[0].get("u").properties.email
          ) {
            throw new Error("this email is already used");
          }
        }
        const unique_id = genUniqueId();
        const result = await session.run(
          `CREATE (u:User {_id : '${unique_id}', name:'${args.name}',email:'${args.email}',password:'${args.password}'} ) return u`
        );
        const data2 = result.records.map((i) => i.get("u"));
        const token = getJwt(data2[0].properties);
        const resu = result.records[0].get("u").properties;
        res.cookie("token", token, {
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          httpOnly: false,
        });
        return resu
      },
    },

    //**********************************Update User  End Point*********************************/

    UserUpdate: {
      type: userType,
      args: {
        _id: { type: GraphQLString },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      resolve: async (parent, args) => {
        if (!validator.isEmail(args.email)) {
          throw new Error('Invalid email address');
        }
        //password validation
       await validatePassword(args.password)
        const driver = dbConnection();
        const session = driver.session({ database: "neo4j" });
        const result = await session.run(
          `MATCH (u:User {_id : '${args._id}'}) SET u.name= '${args.name}', u.email= '${args.email}', u.password= '${args.password}' return u`
        );
        const res = result.records[0].get("u").properties;
        return res;
      },
    },

    //**********************************Delete User  End Point*********************************/

    DeleteUser: {
      type: userType,
      args: {
        _id: { type: GraphQLString },
      },
      resolve: async (parent, args) => {
        const driver = dbConnection();
        const session = driver.session({ database: "neo4j" });
        await session.run(`MATCH (u:User {_id : '${args._id}'}) DELETE u`);
        return {
          message: "delete",
        };
      },
    },

    //**********************************Login User  End Point*********************************/

    LoginUser: {
      type: userType,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      resolve: async (parent, args, { res }) => {
        if (!args.email || !args.password) {
          throw new Error("please enter details");
        }
        if (!validator.isEmail(args.email)) {
          throw new Error('Invalid email address');
        }
        //password validation
       await validatePassword(args.password)

        const driver = dbConnection();
        const session = driver.session({ database: "neo4j" });
        const MatchResult = await session.run(
          `MATCH (u:User {email :'${args.email}'} ) return u limit 1`
        );
        if (MatchResult.records.length === 0) {
          throw new Error("please enter valid email");
        } else {
          if (
            args.password != MatchResult.records[0].get("u").properties.password
          ) {
            throw new Error("please enter correct Password");
          } else {
            const result = MatchResult.records[0].get("u").properties;
            const token = getJwt(MatchResult.records[0].get("u").properties);
            res.cookie("token", token, {
              expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
              httpOnly: false,
              secure: false,
              // sameSite:'none',
            });
            return result  
          }
        }
      },
    },

    //**********************************logout User  End Point*********************************/
    Logout: {
      type: GraphQLString,
      resolve: async (parent, args, { res }) => {
        res.cookie("token", null, {
          expires: new Date(Date.now()),
          httpOnly: true,
        });
        return "successfully logout";
      },
    },
  },
});

//**********************************SCHEMA EXPORTED*********************************/
const schema = new GraphQLSchema({ query: Rootquery, mutation: Mutation });
export default schema;
