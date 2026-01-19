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

    const result = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
      },
      asResponse: true,
    });

    if (!result.ok) {
      throw new Error("Failed to create account");
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

    const result = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
      asResponse: true,
    });

    if (!result.ok) {
      throw new Error("Invalid email or password");
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
