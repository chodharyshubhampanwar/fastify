export const createUserSchema = {
  body: {
    type: 'object',
    required: ['username', 'email', 'password'],
    properties: {
      username: { type: 'string' },
      email: { type: 'string', format: 'email' },
      password: { type: 'string', minLength: 6 },
    },
  },
};

export const getUserSchema = {
  headers: {
    type: 'object',
    required: ['authorization'],
    properties: {
      authorization: { type: 'string' },
    },
  },
};
