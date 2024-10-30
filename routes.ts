/**
 * An array of routes that are accessible only to log in users.
 * These routes requires authentication
 * @ty
 * pe {string[]}
 */
export const protectedRoutes = [
  "/new-question",
  "/dashboard",
  "/new-set",
  "/percentage",
  "/settings",
  "/profile",
  "/my-questions",
  "/my-sets",
  "/my-answers",
];
/**
 * An array of routes that are used for authentication
 * These routes will redirect login in users to slice seting
 * @type {string[]}
 */
export const authRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/error",
  "/auth/reset",
  "/auth/new-password",
];

/**
 * The prefix for API authentication routes
 * Routes that start witht the prefix are used to authentication purposess
 * @type {string}
 */

export const apiAuthPrefix = "/api/auth";

/**
 * The default redirecr path after login
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/settings";
