export default async (): Promise<void> => {
  await (global as any).__MONGOD__.stop();
};
