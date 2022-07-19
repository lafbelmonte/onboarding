import App from '@lib/koa/server';
import vendors from '@routes/vendors';
import auth from '@routes/auth';

const app = new App(5000, [vendors, auth]);

app.start();

export default app.instance;
