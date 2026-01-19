import { Button, Dropdown } from "flowbite-react";
import { Icon } from "@iconify/react";
import user1 from "/src/assets/images/profile/user-1.jpg";
import { Link, useNavigate } from "react-router"; // useNavigate ইমপোর্ট করুন

const Profile = () => {
  const navigate = useNavigate(); // নেভিগেশনের জন্য হুক কল করুন

  // Logout হ্যান্ডলার ফাংশন
  const handleLogout = () => {
    // ১. টোকেন মুছে ফেলুন
    localStorage.removeItem("token");
    
    // ২. ইউজারকে লগইন পেজে পাঠিয়ে দিন
    // navigate("/auth/login") এর বদলে রিফ্রেশ নিশ্চিত করতে window.location ব্যবহার করা ভালো
    window.location.href = "/auth/login"; 
  };

  return (
    <div className="relative group/menu">
      <Dropdown
        label=""
        className="rounded-sm w-44"
        dismissOnClick={false}
        renderTrigger={() => (
          <span className="h-10 w-10 hover:text-primary hover:bg-lightprimary rounded-full flex justify-center items-center cursor-pointer group-hover/menu:bg-lightprimary group-hover/menu:text-primary">
            <img
              src={user1}
              alt="logo"
              height="35"
              width="35"
              className="rounded-full"
            />
          </span>
        )}
      >
        <Dropdown.Item
          as={Link}
          to="/ui/form"
          className="px-3 py-3 flex items-center bg-hover group/link w-full gap-3 text-dark"
        >
          <Icon icon="solar:user-circle-outline" height={20} />
          My Profile
        </Dropdown.Item>
        <Dropdown.Item
          as={Link}
          to="/ui/table"
          className="px-3 py-3 flex items-center bg-hover group/link w-full gap-3 text-dark"
        >
          <Icon icon="solar:letter-linear" height={20} />
          My Account
        </Dropdown.Item>
        <Dropdown.Item
          as={Link}
          to="/"
          className="px-3 py-3 flex items-center bg-hover group/link w-full gap-3 text-dark"
        >
          <Icon icon="solar:checklist-linear" height={20} />
          My Dashboard
        </Dropdown.Item>
        
        <div className="p-3 pt-0">
          <Button 
            size={'sm'} 
            onClick={handleLogout} 
            className="mt-2 w-full border border-primary text-primary bg-transparent hover:bg-lightprimary outline-none focus:outline-none"
          >
            Logout
          </Button>
        </div>
      </Dropdown>
    </div>
  );
};

export default Profile;