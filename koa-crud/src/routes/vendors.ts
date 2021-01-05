const prefix = '/vendors';

const endPoints = (router: any) => {
  router.get(`${prefix}`, async (ctx) => {
    ctx.body = 'Hello World';
  });

  return router;
};

export default endPoints;
