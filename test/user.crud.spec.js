"use strict";

const _ = require("lodash");
const { expect } = require("chai");
const { server } = require("./config/test.server.js");
const sequelize = require("../config/sequelize/setup.js");
const Test = require("./config/test.utils.js");

const uri = `${server.info.uri}/v0`;
const scope = {};

describe("User CRUD operations -", () => {
  before(async () => {
    await Test.setupDb();

    return Promise.resolve();
  });

  describe("GET /users/{userId}", () => {
    it("should read a given user's information if requester is an admin", async () => {
      
      // Creating a user that has an admin access

      scope.user = await sequelize.models.User.create({
        email: `user6@example.com`,
      });
      scope.accessToken = await scope.user.generateAccessToken();
      
      await Test.assignRoleForUser({
        user: scope.user,
        roleName: "owner",
      });
      await Test.assignRoleForUser({
        user: scope.user,
        roleName: "admin",
      });


      const { statusCode, result } = await server.inject({
        method: "get",
        url: `${uri}/users/1`,
        headers: {
          authorization: `Bearer ${scope.accessToken}`,
        },
      });

       // Assert a proper response
       expect(statusCode).to.equal(200);
       expect(result.id).to.equal(1);

    });

    it("should return 401 unauthorized if requester is not an admin", async () => {

      // Creating a user that does not have an admin access

      scope.user = await sequelize.models.User.create({
        email: `user10@example.com`,
      });
      scope.accessToken = await scope.user.generateAccessToken();
      console.log(scope.accessToken)

   
      
      await Test.assignRoleForUser({
        user: scope.user,
        roleName: "owner",
      });

    

      const { statusCode, result } = await server.inject({
        method: "get",
        url: `${uri}/users/1`,
        headers: {
          authorization: `Bearer ${scope.accessToken}`,
        },
      });

    
       // Assert a proper response
       expect(statusCode).to.equal(401);
       expect(result.message).to.equal("Unauthorized");

    });
  });

  describe("GET /self", () => {
    it("should read own information", async () => {
      // Create a user and a JWT access token for that user
      scope.user = await sequelize.models.User.create({
        email: `user3@example.com`,
      });
      scope.accessToken = await scope.user.generateAccessToken();
      
     
      // Add 2 roles to the user
      await Test.assignRoleForUser({
        user: scope.user,
        roleName: "owner",
      });
      await Test.assignRoleForUser({
        user: scope.user,
        roleName: "member",
      });
      await Test.assignRoleForUser({
        user: scope.user,
        roleName: "admin",
      });
    

  
      // Make the request
      const { statusCode, result } = await server.inject({
        method: "get",
        url: `${uri}/users/self`,
        headers: {
          authorization: `Bearer ${scope.accessToken}`,
        },
      });

      // Assert a proper response
      expect(statusCode).to.equal(200);
      expect(result.id).to.equal(scope.user.id);
      expect(result.uuid).to.equal(scope.user.uuid);
      expect(result.email).to.equal(scope.user.email);
      // expect(result.roles.length).to.equal(2);
      // expect(result.roles).to.have.members(["owner", "member"]);

      expect(result.roles.length).to.equal(3);
      expect(result.roles).to.have.members(["owner", "member", "admin"]);

      return Promise.resolve();
    });
  });
});
