import { createServerFn } from "@tanstack/react-start";
import { getRequest, setResponseHeader } from "@tanstack/react-start/server";
import { auth } from "./auth";
import { redirect } from "@tanstack/react-router";

export const signUp = createServerFn({ method: "POST" })
  .inputValidator(
    (data: { email: string; password: string; name: string }) => data,
  )
  .handler(async ({ data }) => {
    const { email, password, name } = data;

    // Validate input
    if (!email || !password || !name) {
      throw new Error("All fields are required");
    }

    if (password.length < 8) {
      throw new Error("Password must be at least 8 characters");
    }

    let result: Response;
    try {
      result = await auth.api.signUpEmail({
        body: {
          email,
          password,
          name,
        },
        asResponse: true,
      });
    } catch {
      throw new Error("Failed to create account");
    }

    if (!result.ok) {
      let details = "";
      try {
        details = await result.text();
      } catch {
        details = "";
      }
      const message = details?.trim()
        ? `Failed to create account: ${details}`
        : `Failed to create account (status ${result.status})`;
      throw new Error(message);
    }

    // Set the session cookie
    const setCookieHeader = result.headers.get("set-cookie");
    if (setCookieHeader) {
      setResponseHeader("Set-Cookie", setCookieHeader);
    }

    return { success: true };
  });

export const signIn = createServerFn({ method: "POST" })
  .inputValidator((data: { email: string; password: string }) => data)
  .handler(async ({ data }) => {
    const { email, password } = data;

    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    let result: Response;
    try {
      result = await auth.api.signInEmail({
        body: {
          email,
          password,
        },
        asResponse: true,
      });
    } catch {
      throw new Error("Invalid email or password");
    }

    if (!result.ok) {
      let details = "";
      try {
        details = await result.text();
      } catch {
        details = "";
      }
      const message = details?.trim()
        ? `Invalid email or password: ${details}`
        : `Invalid email or password (status ${result.status})`;
      throw new Error(message);
    }

    // Set the session cookie
    const setCookieHeader = result.headers.get("set-cookie");
    if (setCookieHeader) {
      setResponseHeader("Set-Cookie", setCookieHeader);
    }

    return { success: true };
  });

export const signOut = createServerFn({ method: "POST" }).handler(async () => {
  const request = getRequest();

  await auth.api.signOut({
    headers: request.headers,
  });

  throw redirect({ to: "/login" });
});
