const _ = require("lodash");
const routeUtils = require("./utils.route.js");
const User = require("../../models/user.js");

module.exports = [
  // Read self
  {
    method: "GET",
    path: "/users/self",
    config: {
      description: "Read a user",
      tags: ["Users"],
    },
    handler: async (request, h) => {
      try {
        const { user } = request.auth.credentials;
        const res = await user.findComplete();
        return routeUtils.replyWith.found(res, h);
      } catch (err) {
        return routeUtils.handleErr(err, h);
      }
    },
  },

 

   // Read a user given user ID
   {
    method: "GET",
    path: "/users/{userId?}",
    config: {
      description: "Read a user given user ID",
      tags: ["Users"],
    },
    handler: async (request, h) => {

      const {userId} = request.params;

      try {
        const { user } = request.auth.credentials;
        const resRequester = await user.findComplete();
       
        if(!routeUtils.isAnAdmin(resRequester)) return routeUtils.replyWith.unauthorized()
        const resUser = await user.findOne(userId);
        return routeUtils.replyWith.found(resUser, h);
      } catch (err) {
        return routeUtils.handleErr(err, h);
      }
    },

    
  },

 
];
