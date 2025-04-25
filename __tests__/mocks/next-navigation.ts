import { jest } from "@jest/globals";

// Create mock objects
export const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
};

export const mockSearchParams = {
  get: jest.fn((param) => {
    if (param === "username") return "TestUser";
    if (param === "isHost") return "true";
    return null;
  }),
};

export const mockParams = {
  roomId: "TEST123",
};

// Create mock functions
export const useRouter = jest.fn().mockImplementation(() => mockRouter);
export const useSearchParams = jest
  .fn()
  .mockImplementation(() => mockSearchParams);
export const useParams = jest.fn().mockImplementation(() => mockParams);

// Helper function to reset all navigation mocks
export function resetNavigationMocks() {
  useRouter.mockClear();
  useSearchParams.mockClear();
  useParams.mockClear();

  // Reset the mock implementations to their defaults
  useRouter.mockImplementation(() => mockRouter);
  useSearchParams.mockImplementation(() => mockSearchParams);
  useParams.mockImplementation(() => mockParams);

  // Reset the mock objects
  const routerKeys: Array<keyof typeof mockRouter> = [
    "push",
    "replace",
    "prefetch",
    "back",
    "forward",
  ];

  routerKeys.forEach((key) => {
    mockRouter[key].mockClear();
  });
}

// Helper function to set up the router mock with custom behavior
export function setupRouterMock(customRouter = {}) {
  const router = { ...mockRouter, ...customRouter };
  useRouter.mockImplementation(() => router);
  return router;
}

// Helper function to set up the search params mock with custom behavior
export function setupSearchParamsMock(customParams: Record<string, any> = {}) {
  const params = {
    ...mockSearchParams,
    get: jest.fn((param: string) => {
      if (customParams[param] !== undefined) {
        return customParams[param];
      }
      return mockSearchParams.get(param);
    }),
    ...customParams,
  };
  useSearchParams.mockImplementation(() => params);
  return params;
}

// Helper function to set up the params mock with custom behavior
export function setupParamsMock(customParams = {}) {
  const params = { ...mockParams, ...customParams };
  useParams.mockImplementation(() => params);
  return params;
}
