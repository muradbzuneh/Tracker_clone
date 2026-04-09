import {
  AtSignIcon,
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  MailIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import toast, { Toaster } from "react-hot-toast";

const Login = () => {
  const [state, setState] = useState<"login" | "signup">("signup");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const navigate = useNavigate();
  const { user, login, signup } = useAppContext();

  // ✅ Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    try {
      if (state === "login") {
        await login({ email, password }); // ✅ FIXED
      } else {
        await signup({ email, password, username }); // ✅ FIXED
      }
    } catch (error: any) {
      toast.error(error?.message || "Authentication failed");
    }

    setIsSubmitted(false);
  };

  // ✅ Redirect after login/signup
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <main>
      <Toaster />
      <form className="login-page-container" onSubmit={handleSubmit}>
        <h2 className="text-3xl font-medium text-gray-900 dark:text-white">
          {state === "login" ? "Sign In" : "Sign Up"}
        </h2>

        <p>
          {state === "login"
            ? "Please enter email and password to access"
            : "Please enter your details to create an account"}
        </p>

        {/* ✅ Username (only for signup) */}
        {state === "signup" && (
          <div className="mt-4">
            <label className="font-medium text-sm text-gray-900 dark:text-white">
              Username
            </label>
            <div className="relative mt-2">
              <AtSignIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4.5" />
              <input
                type="text"
                className="login-input pl-10"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
              />
            </div>
          </div>
        )}

        {/* ✅ Email */}
        <div className="mt-4">
          <label className="font-medium text-sm text-gray-900 dark:text-white">
            Email
          </label>
          <div className="relative mt-2">
            <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4.5" />
            <input
              type="email"
              className="login-input pl-10"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>
        </div>

        {/* ✅ Password */}
        <div className="mt-4">
          <label className="font-medium text-sm text-gray-900 dark:text-white">
            Password
          </label>
          <div className="relative mt-2">
            <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4.5" />
            <input
              type={showPassword ? "text" : "password"}
              className="login-input pl-10 pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />

            {/* 👁 Show/Hide Password */}
            <button
              type="button" // ✅ IMPORTANT (prevent form submit)
              className="absolute right-3 top-1/2 -translate-y-1/2"
              onClick={() => setShowPassword((p) => !p)}
            >
              {showPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
            </button>
          </div>
        </div>

        {/* ✅ Submit Button */}
        <button className="login-button mt-4" type="submit" disabled={isSubmitted}>
          {isSubmitted
            ? "Loading..."
            : state === "login"
            ? "Login"
            : "Sign Up"}
        </button>

        {/* ✅ Toggle */}
        <p className="mt-4 text-sm">
          {state === "login"
            ? "Don't have an account?"
            : "Already have an account?"}

          <button
            type="button"
            className="ml-2 text-blue-500"
            onClick={() =>
              setState(state === "login" ? "signup" : "login")
            }
          >
            {state === "login" ? "Sign up" : "Login"}
          </button>
        </p>
      </form>
    </main>
  );
};

export default Login;