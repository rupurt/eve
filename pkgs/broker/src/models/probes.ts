import z from 'zod';

const Pong = z.object({
  pong: z.number(),
});

const probeModels = {
  Pong,
};

export { probeModels, Pong };
