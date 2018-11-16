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
    const item = await ctx.db.mutation.createItem({
      data: {
        ...args
      }
    }, info);

    return item;
  }

};

module.exports = Mutations;
