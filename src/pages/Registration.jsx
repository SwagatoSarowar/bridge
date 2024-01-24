import AccountInput from "../components/AccountInput";
import { IoPerson } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import { FaLock } from "react-icons/fa";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { ToastContainer, Zoom, toast } from "react-toastify";
import { getDatabase, ref, set } from "firebase/database";

export default function Registration() {
  const auth = getAuth();
  const db = getDatabase();
  const navigate = useNavigate();

  const [signUpInfo, setSignUpInfo] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const validate = function (name, email, password, confirmPassword) {
    const errors = {};
    const emailRegEx = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    const passwordRegEx = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

    name ? null : (errors.name = "⛔ Name is required");

    email
      ? emailRegEx.test(email)
        ? null
        : (errors.email = "⛔ Invalid email address")
      : (errors.email = "⛔ Email is required");

    password
      ? confirmPassword
        ? passwordRegEx.test(password)
          ? password === confirmPassword
            ? null
            : (errors.confirmPassword = "⛔ Please enter same password")
          : (errors.password =
              "⛔ Password requirement (min. length 8, (A-Z), (a-z), (0-9))")
        : (errors.confirmPassword = "⛔ Password is required")
      : (errors.password = "⛔ Password is required");

    return errors;
  };

  const handleSignUp = function (e) {
    e.preventDefault();
    setErrors(
      validate(
        signUpInfo.name,
        signUpInfo.email,
        signUpInfo.password,
        signUpInfo.confirmPassword,
      ),
    );

    !Object.keys(
      validate(
        signUpInfo.name,
        signUpInfo.email,
        signUpInfo.password,
        signUpInfo.confirmPassword,
      ),
    ).length &&
      createUserWithEmailAndPassword(
        auth,
        signUpInfo.email,
        signUpInfo.password,
      )
        .then((userCredential) => {
          set(ref(db, "users/" + userCredential.user.uid), {
            username: signUpInfo.name,
            email: signUpInfo.email,
            profileImg: "https://placehold.co/315x315?text=profileImg",
            coverImg: "https://placehold.co/1240x496?text=coverImg",
          });
        })
        .then(() => {
          updateProfile(auth.currentUser, {
            displayName: signUpInfo.name,
            photoURL: "https://placehold.co/315x315?text=profileImg",
          });
        })
        .then(() =>
          sendEmailVerification(auth.currentUser).then(() => {
            setSignUpInfo({
              name: "",
              email: "",
              password: "",
              confirmPassword: "",
            });
            setTimeout(() => navigate("/login"), 3500);
            toast.success("Successfully registered. Please verify your email");
          }),
        )
        .catch((error) => {
          error.code.includes("auth/email-already-in-use") &&
            setErrors((cur) => ({
              ...cur,
              userEmail: "Email already in use",
            }));
        });
  };
  return (
    <div className="flex h-screen items-center justify-center bg-registration-img bg-cover bg-center bg-no-repeat">
      <ToastContainer
        position="top-center"
        transition={Zoom}
        autoClose={2500}
      />
      <div className="rounded-lg bg-black/30 p-4 shadow-[16px_16px_20px_0_rgba(0,0,0,0.4)] backdrop-blur-lg md:p-16">
        <h1 className="mb-5 text-center text-3xl font-light uppercase text-white md:text-5xl">
          Registration
        </h1>
        <form
          noValidate
          className="flex flex-col gap-y-3 md:w-[350px]"
          onSubmit={(e) => handleSignUp(e)}
        >
          <div className="flex flex-col gap-y-3 md:gap-y-8">
            <div>
              <AccountInput
                id="name"
                label={<IoPerson />}
                placeholder="Account Name"
                value={signUpInfo.name}
                onChange={(e) => {
                  setSignUpInfo((cur) => ({ ...cur, name: e.target.value }));
                  setErrors((cur) => ({ ...cur, name: "" }));
                }}
              />
              <p className="mt-1 h-[1rem] text-sm font-medium text-white md:text-base">
                {errors.name}
              </p>
            </div>
            <div>
              <AccountInput
                id="email"
                label={<MdEmail />}
                type="email"
                placeholder="Email"
                value={signUpInfo.email}
                onChange={(e) => {
                  setSignUpInfo((cur) => ({ ...cur, email: e.target.value }));
                  setErrors((cur) => ({ ...cur, email: "" }));
                }}
              />
              <p className="mt-1 h-[1rem] text-sm font-medium text-white md:text-base">
                {errors.email}
              </p>
            </div>
            <div>
              <AccountInput
                id="password"
                label={<FaLock />}
                placeholder="Password"
                type="password"
                value={signUpInfo.password}
                onChange={(e) => {
                  setSignUpInfo((cur) => ({
                    ...cur,
                    password: e.target.value,
                  }));
                  setErrors((cur) => ({ ...cur, password: "" }));
                }}
              />
              <p className="mt-1 h-[1rem] text-sm font-medium text-white md:text-base">
                {errors.password}
              </p>
            </div>
            <div>
              <AccountInput
                id="confirm-password"
                label={<FaLock />}
                placeholder="Confirm Password"
                type="password"
                value={signUpInfo.confirmPassword}
                onChange={(e) => {
                  setSignUpInfo((cur) => ({
                    ...cur,
                    confirmPassword: e.target.value,
                  }));
                  setErrors((cur) => ({ ...cur, confirmPassword: "" }));
                }}
              />
              <p className="mt-1 h-[1rem] text-sm font-medium text-white md:text-base">
                {errors.confirmPassword}
              </p>
            </div>
          </div>
          <button
            type="submit"
            className="rounded-full bg-green-500 py-2 font-medium text-white duration-200 hover:bg-green-600 md:py-3 md:text-lg"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-2 text-center font-medium text-white md:text-lg">
          Already have an account ?{" "}
          <Link
            to="/login"
            className="text-blue-300 duration-150 hover:text-blue-400"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
