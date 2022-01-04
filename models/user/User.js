import { Schema, model } from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import uniqueValidator from "mongoose-unique-validator";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: [true, "Please enter  userName"],
      unique: [true, "userName is already registered"],
    },
    email: {
      type: String,
      required: [true, "Please enter an email"],
      unique: [true, "Email is already registered"],
      lowercase: true,
      validate: [validator.isEmail, "Please enter an valid email"],
      sparse: true,
    },
    password: {
      type: String,
      minlength: [6, "Minimum password length is 6 characters"],
    },
    resetLink: {
      type: String,
      default: "",
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

// this method fire before doc save to db
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  const plainText = this.get("password");
  this.set("password", await bcrypt.hash(plainText, salt));
  next();
});

// static method to login user
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("Incorrect password");
  } else {
    throw Error("Incorrect email");
  }
};

userSchema.statics.addRefreshToken = async function (id, refreshToken) {
  const response = await this.findByIdAndUpdate(
    id,
    { refreshToken, resetLink: "" },
    { new: true },
    (err, user) => {
      if (err) {
        return err;
      } else {
        return user;
      }
    }
  ).clone();
  return response;
};

userSchema.statics.findUserForRefreshToken = async function (id, refreshToken) {
  const user = await this.findById(id);
  console.log(user);
  if (user && user.refreshToken === refreshToken) {
    return user;
  } else {
    throw Error("Invalid user");
  }
};

const User = model("user", userSchema);

userSchema.plugin(uniqueValidator, { message: "{PATH} already exist" });

export default User;
