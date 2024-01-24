import { useState } from "react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";

function AccountInput({
  id,
  label = "",
  type = "text",
  placeholder,
  value,
  onChange,
}) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="relative flex items-center gap-x-2 overflow-hidden rounded-lg bg-blue-100 font-semibold shadow-lg md:text-xl">
      <label
        htmlFor={id}
        className="absolute p-2 text-xl text-black/80 md:text-2xl"
      >
        {label}
      </label>
      <input
        id={id}
        className="w-full bg-transparent py-4 pl-10 pr-8 outline-none placeholder:text-black/30 focus-within:bg-white/70"
        type={type === "password" ? (showPassword ? "text" : "password") : type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e)}
      />
      <button
        type="button"
        className={`absolute right-[6px] ${
          type === "password" ? "block" : "hidden"
        }`}
        onClick={() => setShowPassword((cur) => !cur)}
      >
        {type === "password" ? (
          showPassword ? (
            <IoMdEye />
          ) : (
            <IoMdEyeOff />
          )
        ) : null}
      </button>
    </div>
  );
}

export default AccountInput;
