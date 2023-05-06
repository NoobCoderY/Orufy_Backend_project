//**********************************ALL IMPORTS*********************************/
import { resolve } from "path";
import dbConnection from "../config/dbConnection";
import { getJwt } from "../utils/jwttoken";
import genUniqueId from "../utils/getUniqueId";
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
} from "graphql";
import { isAuthenticateUser } from "../middleware/graphQlAuth";
import { log } from "console";

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
      resolve: async (parent,args,context) => {
        const { req } = context;
           isAuthenticateUser(req)
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
    registerUser: {
      type: userType,
      args: {
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      resolve: async (parent, args, { res }) => {
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
          // domain: 'http://localhost:3000',
          // secure: true,
          // sameSite:'none',
          httpOnly:false
          
        
        });
        return {
          resu,
          token
        };
      },
    },

    //**********************************Update User  End Point*********************************/
    userUpdate: {
      type: userType,
      args: {
        _id: { type: GraphQLString },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      resolve: async (parent, args) => {
        const driver = dbConnection();
        const session = driver.session({ database: "neo4j" });
        const result = await session.run(
          `MATCH (u:User {_id : '${args._id}'}) SET u.name= '${args.name}', u.email= '${args.email}', u.password= '${args.password}' return u`
        );
        const r = result.records[0].get("u").properties;
        return r;
      },
    },

    //**********************************Delete User  End Point*********************************/

    deleteUser: {
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
    loginUser: {
      type: userType,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      resolve: async (parent, args, { res }) => {
        if (!args.email || !args.password) {
          throw new Error("please enter details");
        }
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
            return {
              result,
              token
            };
          }
        }
      },
    },

    //**********************************logout User  End Point*********************************/
    logout: {
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
