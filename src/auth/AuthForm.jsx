import React, { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import TogglePanel from "./TogglePanel";
import "../styles/Login.css";
import Header from "../component/header";
import Footer from "../component/footer";

const AuthForm = () => {
  const [active, setActive] = useState(false);

  return (
   <>
   <Header />
    <div className={`container ${active ? "active" : ""}`}>
      {/* Forms */}
      <LoginForm />
      <RegisterForm />

      {/* Toggle Panels */}
      <div className="toggle-box">
        <TogglePanel
          side="left"
          title="Hello, Welcome!"
          text="Don't have an account?"
          buttonText="Register"
          onClick={() => setActive(true)}
        />
        <TogglePanel
          side="right"
          title="Welcome Back!"
          text="Already have an account?"
          buttonText="LogIn"
          onClick={() => setActive(false)}
        />
      </div>
    </div>
    <Footer />
    </>
  );
};

export default AuthForm;
