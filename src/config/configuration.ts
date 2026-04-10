export default () => ({
  auth: {
    jwtSecret: process.env.JWT_SECRET || 'dummy jwt secret',
    jwtExpiresIn: parseInt(process.env.JWT_EXPIRES_IN || '60', 10),
  },
});
