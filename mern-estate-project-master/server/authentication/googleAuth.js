import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import passport from 'passport';
import User from "../models/user.model.js"


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    passReqToCallback: true
},
    async function (request, accessToken, refreshToken, profile, done) {

        try {
            const user = await User.findOne({ email: profile._json.email })

            if (user) {
                return done(null, user);
            }

            const generatedPassword =
                Math.random().toString(36).slice(-8) +
                Math.random().toString(36).slice(-8);

            const newUser = new User({
                username:
                    profile.displayName.split(" ").join("").toLowerCase() +
                    Math.random().toString(36).slice(-4),
                email: profile.email,
                password: generatedPassword,
                avatar: profile.picture,
            });

            await newUser.save();

            return done(null, newUser);

        }
        catch (error) {
            console.log(error)
        }
    }
));




export default passport