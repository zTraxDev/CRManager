import "express-session";

declare module "express-session" {
  interface SessionData {
    connected?: boolean;
    name?: string;
  }
}
