import { ReactNode } from "react"; // ReactNode ইমপোর্ট করুন
import { Navigate } from "react-router"; 

// Props এর টাইপ ডিফাইন করার জন্য একটি Interface তৈরি করুন
interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = localStorage.getItem("token"); 

  if (!token) {
    // লগইন না থাকলে সরাসরি লগইন পেজে নিয়ে যাবে
    return <Navigate to="/auth/login" replace />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;