/**
 * Färdig Supabase-mock för Vitest. Importeras via en mock-fabrik som löser
 * vi.mock-hoisting:
 *
 *   vi.mock("@/integrations/supabase/client", async () => {
 *     const m = await import("@/test/mocks/supabase");
 *     return m.createSupabaseMock();
 *   });
 *
 * Mocken är medvetet permissiv — varje from()-anrop returnerar en thenable
 * builder som svarar `{ data: [], error: null }` när den awaitas direkt, och
 * `{ data: null, error: null }` på maybeSingle()/single().
 */

interface ChannelObj {
  on: () => ChannelObj;
  subscribe: (cb?: (status: string) => void) => ChannelObj;
}

function makeChannel(): ChannelObj {
  const ch: ChannelObj = {
    on: () => ch,
    subscribe: (cb) => {
      cb?.("SUBSCRIBED");
      return ch;
    },
  };
  return ch;
}

function makeBuilder() {
  type B = Record<string, unknown> & { then: (r: (v: unknown) => unknown) => Promise<unknown> };
  const b = {} as B;
  Object.assign(b, {
    select: () => b,
    eq: () => b,
    neq: () => b,
    not: () => b,
    order: () => b,
    limit: () => b,
    maybeSingle: async () => ({ data: null, error: null }),
    single: async () => ({ data: null, error: { code: "PGRST116", message: "no rows" } }),
    insert: async () => ({ data: null, error: null }),
    upsert: async () => ({ data: null, error: null }),
    update: () => b,
    delete: () => b,
    then: (resolve: (v: { data: never[]; error: null }) => unknown) =>
      Promise.resolve({ data: [], error: null }).then(resolve),
  });
  return b;
}

export function createSupabaseMock() {
  return {
    supabase: {
      from: () => makeBuilder(),
      channel: () => makeChannel(),
      removeChannel: async () => undefined,
      auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
        getUser: async () => ({ data: { user: null }, error: null }),
        signOut: async () => ({ error: null }),
        signUp: async () => ({ data: { user: null }, error: null }),
        signInWithPassword: async () => ({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({
          data: { subscription: { unsubscribe: () => undefined } },
        }),
      },
      functions: { invoke: async () => ({ data: null, error: null }) },
      storage: {
        from: () => ({
          upload: async () => ({ data: null, error: null }),
          remove: async () => ({ data: null, error: null }),
          createSignedUrl: async () => ({ data: { signedUrl: null }, error: null }),
        }),
      },
    },
  };
}
