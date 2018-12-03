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
  },
  async updateItem(parent, args, ctx, info) {
    const updatedItem = { ...args };
    delete updatedItem.id;
    return ctx.db.mutation.updateItem({
      data: updatedItem,
      where: {
        id: args.id,
      }
    }, info);
  },
  async deleteItem(parent, args, ctx, info) {
    // find the item
    const where = {id: args.id}
    const item = await ctx.db.query.item({where})
    //TODO: see if the user is the owner of that item;
    const res = await ctx.db.mutation.deleteItem(
      {where},
      info
    )
    return res;
  }
};

module.exports = Mutations;
