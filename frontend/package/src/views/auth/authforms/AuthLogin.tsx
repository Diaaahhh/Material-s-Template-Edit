import { Button, Label, TextInput, Checkbox } from "flowbite-react";
import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router";

const AuthLogin = () => {
  const navigate = useNavigate();

  // form state
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // handle submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8081/api/auth/login",
        form,
        { withCredentials: true }
      );
localStorage.setItem("token", response.data.token);
      alert("Login successful");
      navigate("/");
    } catch (error: any) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Email */}
      <div className="mb-4">
        <Label htmlFor="email" value="Email" />
        <TextInput
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
          className="form-rounded-xl"
        />
      </div>

      {/* Password */}
      <div className="mb-4">
        <Label htmlFor="password" value="Password" />
        <TextInput
          id="password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
          className="form-rounded-xl"
        />
      </div>

      {/* Remember me */}
      <div className="flex justify-between my-5">
        <div className="flex items-center gap-2">
          <Checkbox id="remember" />
          <Label htmlFor="remember" className="cursor-pointer">
            Remember this device
          </Label>
        </div>
        <Link to="/" className="text-primary text-sm font-medium">
          Forgot Password?
        </Link>
      </div>

      <Button type="submit" className="w-full bg-primary text-white rounded-xl">
        Sign in
      </Button>
    </form>
  );
};

export default AuthLogin;
