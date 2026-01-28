// Mock Prisma client for testing

import { vi } from 'vitest';

export const mockPrismaClient = {
  prediction: {
    create: vi.fn(),
    findFirst: vi.fn(),
    findMany: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  districtPrediction: {
    create: vi.fn(),
    createMany: vi.fn(),
    findFirst: vi.fn(),
    findMany: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    deleteMany: vi.fn(),
  },
  proportionalPrediction: {
    create: vi.fn(),
    findFirst: vi.fn(),
    findMany: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  overallAnalysis: {
    create: vi.fn(),
    findFirst: vi.fn(),
    findMany: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  updateLog: {
    create: vi.fn(),
    findFirst: vi.fn(),
    findMany: vi.fn(),
    update: vi.fn(),
  },
  $transaction: vi.fn((callback: (tx: unknown) => Promise<unknown>) => callback(mockPrismaClient)),
  $connect: vi.fn(),
  $disconnect: vi.fn(),
};

// Helper to reset all mocks
export function resetPrismaMocks() {
  Object.values(mockPrismaClient).forEach((model) => {
    if (typeof model === 'object' && model !== null) {
      Object.values(model).forEach((method) => {
        if (typeof method === 'function' && 'mockReset' in method) {
          (method as ReturnType<typeof vi.fn>).mockReset();
        }
      });
    }
  });
}

// Helper to set up common mock returns
export function setupPrismaMocks(overrides: Record<string, unknown> = {}) {
  // Default mock returns for common queries
  mockPrismaClient.overallAnalysis.findFirst.mockResolvedValue(
    overrides.overallAnalysis ?? {
      id: 'mock-overall-1',
      cabinetApproval: 28.5,
      partySupport: { ldp: 32, cdp: 15 },
      seatProjection: { ldp: 200, cdp: 120 },
      createdAt: new Date(),
    }
  );

  mockPrismaClient.prediction.findFirst.mockResolvedValue(
    overrides.prediction ?? {
      id: 'mock-prediction-1',
      type: 'prefecture',
      targetId: 'tokyo',
      prediction: {},
      createdAt: new Date(),
    }
  );

  mockPrismaClient.districtPrediction.findMany.mockResolvedValue(
    overrides.districtPredictions ?? []
  );

  mockPrismaClient.proportionalPrediction.findFirst.mockResolvedValue(
    overrides.proportionalPrediction ?? {
      id: 'mock-proportional-1',
      blockId: 'tokyo',
      partySeats: { ldp: 5, cdp: 4 },
      createdAt: new Date(),
    }
  );

  mockPrismaClient.updateLog.findMany.mockResolvedValue(
    overrides.updateLogs ?? []
  );
}
