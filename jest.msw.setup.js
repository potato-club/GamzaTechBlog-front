const shouldSkipMsw = ['true', '1', 'yes'].includes(
  String(process.env.JEST_SKIP_MSW || '').toLowerCase(),
);

if (!shouldSkipMsw) {
  const { server } = require('./src/lib/__tests__/mocks/server');

  beforeAll(() => {
    server.listen({
      onUnhandledRequest: 'warn',
    });
  });

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => {
    server.close();
  });
}
