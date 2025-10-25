import { vi } from 'vitest';

// Create chrome API mock
const createChromeMock = () => ({
  storage: {
    sync: {
      get: vi.fn(),
      set: vi.fn()
    }
  },
  runtime: {
    getURL: vi.fn()
  },
  tabs: {
    query: vi.fn(),
    reload: vi.fn()
  }
});

// Setup chrome mock globally
global.chrome = createChromeMock();

// Reset mocks before each test
beforeEach(() => {
  global.chrome = createChromeMock();
});
