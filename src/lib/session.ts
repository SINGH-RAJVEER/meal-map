import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { auth, type Session, type User } from "./auth";

export const getUser = createServerFn({ method: "GET" }).handler(
  async (): Promise<
    { user: User; session: Session } | { user: null; session: null }
  > => {
    const request = getRequest();
    try {
      const session = await auth.api.getSession({
        headers: request.headers,
      });

      if (!session) {
        return { user: null, session: null };
      }

      return { user: session.user, session: session.session };
    } catch {
      return { user: null, session: null };
    }
  },
);
