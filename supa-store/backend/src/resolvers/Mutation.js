const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Mutations = {
  // createDog(parent, args, ctx, info) {
  //   global.dogs = global.dogs || [];
  //   const newDog = {
  //     name: args.name
  //   }
  //   global.dogs.push(newDog)
  //   return newDog
  // }
  async createItem(parent, args, ctx, info) {
    const item = await ctx.db.mutation.createItem(
      {
        data: {
          ...args
        }
      },
      info
    );

    return item;
  },
  async updateItem(parent, args, ctx, info) {
    const updatedItem = { ...args };
    delete updatedItem.id;
    return ctx.db.mutation.updateItem(
      {
        data: updatedItem,
        where: {
          id: args.id
        }
      },
      info
    );
  },
  async deleteItem(parent, args, ctx, info) {
    // find the item
    const where = { id: args.id };
    const item = await ctx.db.query.item({ where });
    //TODO: see if the user is the owner of that item;
    const res = await ctx.db.mutation.deleteItem({ where }, info);
    return res;
  },
  async signup(parent, args, ctx, info) {
    args.email = args.email.toLowerCase();
    // hash their password
    const password = await bcrypt.hash(args.password, 10);
    const user = await ctx.db.mutation.createUser(
      {
        data: {
          ...args,
          password,
          permissions: { set: ['USER'] }
        }
      },
      info
    );
    // create the jwt token for them
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    // we set a cookie on the response
    ctx.response.cookie('token', token, {
      maxAge: 1000 * 60 * 60 * 24 * 365,
      httpOnly: true
    });
    // return the user to the browser
    return user;
  }
};

module.exports = Mutations;
