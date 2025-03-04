export const queryKeys = {
  packages: {
    all: ['packages'] as const,
    list: (packages: string[]) => [...queryKeys.packages.all, packages] as const,
  },
} as const;
