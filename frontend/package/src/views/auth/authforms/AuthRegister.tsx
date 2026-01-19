import { Button, Label, TextInput } from "flowbite-react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

const AuthRegister = () => {
  const navigate = useNavigate();

  // form state
  const [form, setForm] = useState({
    fName: "",
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
     await axios.post("http://localhost:8081/api/auth/register", form);

      alert("Registration successful");
      navigate("/auth/login");
    } catch (error: any) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Name */}
      <div className="mb-4">
        <Label htmlFor="fName" value="Name" />
        <TextInput
          id="fName"
          name="fName"
          type="text"
          value={form.fName}
          onChange={handleChange}
          required
        />
      </div>

      {/* Email */}
      <div className="mb-4">
        <Label htmlFor="email" value="Email Address" />
        <TextInput
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
        />
      </div>

      {/* Password */}
      <div className="mb-6">
        <Label htmlFor="password" value="Password" />
        <TextInput
          id="password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
        />
      </div>

      <Button type="submit" className="w-full bg-primary text-white">
        Sign Up
      </Button>
    </form>
  );
};

export default AuthRegister;
