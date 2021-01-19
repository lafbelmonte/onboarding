import jwt from 'jsonwebtoken';
import { Context } from 'koa';

function verifyToken(
  ctx: Context,
): {
  allowed: boolean;
  userId: string;
} {
  const bearer = ctx.ctx.get('Authorization').split(' ');

  let allowed = true;
  let decoded;

  const token = bearer[1];

  if (bearer[0] !== 'Bearer') {
    allowed = false;
  }

  if (!token) {
    allowed = false;
  }
  try {
    decoded = jwt.verify(token, 'secret');
  } catch (e) {
    allowed = false;
  }

  return { allowed, userId: decoded };
}

function generateToken(payload: string): string {
  const token = jwt.sign(
    {
      data: payload,
    },
    'secret',
    { expiresIn: '1h' },
  );

  return token;
}

export { verifyToken, generateToken };
