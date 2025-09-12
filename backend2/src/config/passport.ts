import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv"
import { db } from "../db";
import { AuthProvider } from "@prisma/client";
import { userService } from "../services/userService";

dotenv.config()
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            callbackURL: process.env.CALLBACK_URL
        },

        async (accessToken, refreshToken, profile, done) => {
            try {
                console.log("OAuth Profile: ", profile)

                let user = await userService.findByGoogleId(profile.id);

                if (!user) {
                    const created = await userService.createUser({
                        username: profile.id,
                        name: profile.displayName,
                        email: profile.emails?.[0].value || '',
                        password: null,
                        provider: AuthProvider.GOOGLE
                    })

                    if (!created.success) {
                        return done(new Error("Failed to create user"));
                    }

                    user = created.user!
                } else {
                    await userService.updateLastLogin(user.id);
                }
                return done(null, user);
            }
            catch (err) {
                return done(err)
            }
        }
    )
);

passport.serializeUser((user: any, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
    try {
        const user = await db.user.findUnique({ where: { id } });
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});