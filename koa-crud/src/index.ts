import App from './lib/koa/server';

import vendors from './routes/vendors';
import auth from './routes/auth';

console.log('test');

const app = new App(5000, [vendors, auth]);

app.start();

export default app.instance;
