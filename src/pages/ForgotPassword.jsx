import AccountInput from "../components/AccountInput";
import { MdEmail } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";

export default function ForgotPassword() {
  const auth = getAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [error, setError] = useState("");

  const validate = function (email) {
    let error = "";
    const emailRegEx = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

    email
      ? emailRegEx.test(email)
        ? null
        : (error = "⛔ Invalid email address")
      : (error = "⛔ Email is required");

    return error;
  };

  const handleResetPassword = function (e) {
    e.preventDefault();
    setError(validate(email));

    !validate(email) &&
      sendPasswordResetEmail(auth, email)
        .then(() => {
          setTimeout(() => navigate("/login"), 2500);
          toast.success("A password reset email has been sent");
        })
        .catch((error) => {
          console.log(error.code);
        });
  };

  return (
    <div className="bg-forgotpassword-img flex h-screen items-center justify-center bg-cover bg-center bg-no-repeat">
      <ToastContainer autoClose={1500} position="top-center" />
      <div className="rounded-lg bg-black/30 p-16 shadow-[16px_16px_20px_0_rgba(0,0,0,0.4)] backdrop-blur-lg">
        <h1 className="mb-5 text-center text-4xl font-light uppercase text-white">
          Reset Password
        </h1>
        <form
          noValidate
          className="flex w-[350px] flex-col gap-y-10"
          onSubmit={(e) => handleResetPassword(e)}
        >
          <div>
            <AccountInput
              id="email"
              label={<MdEmail />}
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
            />
            <p className="mt-1 h-[1rem] font-medium text-white">{error}</p>
          </div>
          <div className="flex flex-col gap-y-4">
            <button
              type="submit"
              className="rounded-full bg-blue-500 py-3 text-lg font-medium text-white duration-200 hover:bg-blue-600"
            >
              Reset Password
            </button>
            <button
              onClick={() => navigate("/login")}
              type="button"
              className="rounded-full bg-red-500 py-3 text-lg font-medium text-white duration-200 hover:bg-red-600"
            >
              Back to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
