import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { pool } from "./db";
import { storage } from "./storage";
import type { Express } from "express";
import type { User } from "@shared/schema";

declare global {
  namespace Express {
    interface User {
      id: number;
      googleId: string;
      name: string;
      email: string | null;
      profileImage: string | null;
    }
  }
}

export function setupAuth(app: Express) {
  const PgSession = connectPgSimple(session);

  if (process.env.NODE_ENV === "production") {
    if (!process.env.SESSION_SECRET) {
      throw new Error("SESSION_SECRET must be set in production");
    }
    app.set("trust proxy", 1);
  }

  app.use(
    session({
      store: new PgSession({
        pool,
        tableName: "session",
        createTableIfMissing: true,
      }),
      secret: process.env.SESSION_SECRET || "dev-session-secret-change-me",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
        sameSite: "lax",
      },
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((user: Express.User, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUserById(id);
      done(null, user || null);
    } catch (err) {
      done(err, null);
    }
  });

  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    const callbackURL = `${process.env.BASE_URL ?? "http://localhost:5000"}/auth/google/callback`;
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL,
        },
        async (_accessToken, _refreshToken, profile, done) => {
          try {
            const email = profile.emails?.[0]?.value ?? null;
            const photo = profile.photos?.[0]?.value ?? null;
            const user = await storage.upsertUser(
              profile.id,
              profile.displayName,
              email,
              photo
            );
            done(null, user);
          } catch (err) {
            done(err as Error, undefined);
          }
        }
      )
    );
  }
}
