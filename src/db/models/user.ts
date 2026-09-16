import mongoose, { Schema, Document} from "mongoose";

// import { Schema, Document } from "mongoose";
const bcrypt = require("bcrypt");
import { userRolesEnum } from "../roles/userRoles"; 

export interface IUser extends Document {
  password: string;
  email: string;
  name: string;
  role: string;
  films: { id: string; isChecked: boolean }[];
  avatarURL?: string;
  googleId: string;
  token?: string;
  aiCredits: number;
  paidIntents: string[];
  isModified: (path: string) => boolean; // This is a Mongoose method available in documents.
}

/**
 * User Model
 */
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      select: true,
    },
    googleId: { type: String, unique: true, sparse: true },
    avatarURL: { type: String },
    authMethod: {
      type: String,
      enum: ["credentials", "google"],
      default: "credentials",
    },
    role: {
      type: String,
      enum: Object.values(userRolesEnum),
      default: userRolesEnum.USER,
    },
    aiCredits: { type: Number, default: 0, min: 0 },
    // Stripe PaymentIntent ids already credited, so a payment counts once.
    paidIntents: { type: [String], default: [], select: false },
    movies: [
      {
        movieId: {
          type: Number,
          required: true,
        },
        watched: {
          type: Boolean,
        },
        liked: {
          type: Boolean,
        }
      },
    ],
  },
  {
    /**
     * timestamps rerurn lines with data when object was made and update
     * versionKey didn't return vrsion of object
     */
    timestamps: true,
    versionKey: false,
  }
);

/**
 * Pre save  hook. Fires on Create and Save.
 */
userSchema.pre<IUser>("save", async function (next: (err?: Error) => void) {
  const user = this;

  if (!user.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    next();
  } catch (err) {
    next(err as Error);
  }
});

// userSchema.pre<IUser>("save", function (next) {
//   const user = this;

//   if (!user.password && !user.googleId) {
//     return next(new Error("Either password or googleAuthId is required"));
//   }

//   if (user.password && user.googleId) {
//     return next(new Error("Both password and googleAuthId cannot be present"));
//   }

//   next();
// });

/**
 * Custom method mongoose to validate password. Return promise boolean
 * @param {string} candidate
 * @param {string} hash
 * @returns {Promise<boolean>}
 */
userSchema.methods.checkPassword = (candidate: string, hash: string) => {
  bcrypt.compare(candidate, hash);
};

export default mongoose.models.User || mongoose.model("User", userSchema);
