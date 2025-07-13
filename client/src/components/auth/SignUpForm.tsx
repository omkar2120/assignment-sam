

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { EyeCloseIcon, EyeIcon } from "../../icons";

export default function SignUpForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("User");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const validate = () => {
    const errors: any = {};
    if (!name.trim()) errors.name = "Name is required.";
    if (!email.trim()) {
      errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Invalid email format.";
    }
    if (!password) {
      errors.password = "Password is required.";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validate()) return;

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();

      if (res.ok) {
        navigate("/");
      } else {
        setError(data.message || "Signup failed");
      }
    } catch (err) {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="w-full max-w-md pt-10 mx-auto" />
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign Up
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Create your account by filling the form below.
            </p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <Label>
                  Full Name <span className="text-error-500">*</span>
                </Label>
                <Input
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {fieldErrors.name && (
                  <p className="text-xs text-red-500 mt-1">{fieldErrors.name}</p>
                )}
              </div>

              <div>
                <Label>
                  Email <span className="text-error-500">*</span>
                </Label>
                <Input
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {fieldErrors.email && (
                  <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>
                )}
              </div>

              <div>
                <Label>
                  Create New Password <span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-4 flex items-center cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    )}
                  </span>
                </div>
                {fieldErrors.password && (
                  <p className="text-xs text-red-500 mt-1">{fieldErrors.password}</p>
                )}
              </div>

              <div>
                <Label>
                  Role <span className="text-error-500">*</span>
                </Label>
                <select
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="User">User</option>
                  <option value="Manager">Manager</option>
                </select>
              </div>

              {error && (
                <p className="text-sm text-red-500 text-center">{error}</p>
              )}

              <Button
                className="w-full"
                size="sm"
                type="submit"
                disabled={loading}
              >
                {loading ? "Signing up..." : "Sign Up"}
              </Button>
            </div>
          </form>

          <div className="mt-5">
            <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
              Already have an account?{" "}
              <Link
                to="/"
                className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

