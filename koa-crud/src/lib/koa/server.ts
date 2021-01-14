import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-body';
import R from 'ramda';
import { ApolloServer } from 'apollo-server-koa';
import serializer from './serializer';
import { initializeDatabase } from '../mongoose';
import typeDefs from '../../graphql/typeDefs';
import resolvers from '../../graphql/resolvers';
import { verifyToken } from '../jwt/index';

class KoaApp {
  private app: Koa;

  private port: number;

  private router: Router;

  constructor(port: number, routes: any[]) {
    this.app = new Koa();
    this.port = port;
    this.router = new Router();
    this.initializeMiddlewares();
    this.initializeGraphQl();
    this.initializeRoutes(routes);
  }

  private initializeMiddlewares(): void {
    this.app.use(bodyParser());
  }

  private initializeGraphQl(): void {
    const graphQlserver = new ApolloServer({
      typeDefs,
      resolvers,
      context: verifyToken,
    });
    graphQlserver.applyMiddleware({ app: this.app, path: '/graphql' });
  }

  private initializeRoutes(routes: any[]) {
    R.map((route: any) => {
      const endPoints = route(this.router, serializer);
      this.app.use(endPoints.routes());
      return this.app;
    })(routes);
  }

  get instance(): Koa {
    return this.app;
  }

  public async start(): Promise<void> {
    await initializeDatabase();
    this.app.listen(this.port);
  }
}

export default KoaApp;
