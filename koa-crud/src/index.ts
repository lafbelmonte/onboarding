import App from '@lib/koa/server';
import auth from '@routes/auth';
import vendors from '@routes/vendors';

const app = new App(5000, [vendors, auth]);

app.start();

export default app.instance;
