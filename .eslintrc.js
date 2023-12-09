module.exports = {
  extends: "next/core-web-vitals",
  parserOptions: {
    project: './tsconfig.json',
  },
  plugins: ["@ts-safeql/eslint-plugin"],
  rules: {
    "no-console": ["warn"],
    "no-unused-vars": ["warn"],
    '@ts-safeql/check-sql': [
      'error',
      {
        connections: [
          {
            connectionUrl: process.env.DATABASE_URL,
            // The migrations path:
            migrationsDir: './prisma/migrations',
            targets: [
              // This makes `prisma.$queryRaw` and `prisma.$executeRaw` commands linted
              { tag: 'prisma.+($queryRaw|$executeRaw)', transform: '{type}[]' },
            ],
          },
        ],
      },
    ],
  },
}
