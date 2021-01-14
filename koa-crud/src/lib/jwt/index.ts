import jwt from 'jsonwebtoken';

function verifyToken(ctx) {
  const bearer = ctx.ctx.get('Authorization').split(' ');

  let allowed = true;

  const token = bearer[1];

  if (bearer[0] !== 'Bearer') {
    allowed = false;
  }

  if (!token) {
    allowed = false;
  }
  try {
    jwt.verify(token, 'secret');
  } catch (e) {
    allowed = false;
  }

  return { allowed };
}

function generateToken(payload) {
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
