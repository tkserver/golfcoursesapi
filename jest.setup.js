global.console = {
  ...console,
  // Keep other logs as is and only suppress errors.
  error: jest.fn()
};