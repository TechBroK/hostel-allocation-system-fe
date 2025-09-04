import React, { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import TogglePanel from "./TogglePanel";
import "../styles/Login.css";

const AuthForm = () => {
  const [active, setActive] = useState(false);

  return (
    <div className={`container ${active ? "active" : ""}`}>
      {/* Forms */}
      <LoginForm />
      <RegisterForm />

      {/* Toggle Panels */}
      <div className="toggle-box">
        <TogglePanel
          side="left"
          img="rema.png"
          title="Hello, Welcome!"
          text="Don't have an account?"
          buttonText="Register"
          onClick={() => setActive(true)}
        />
        <TogglePanel
          side="right"
          img="rema.png"
          title="Welcome Back!"
          text="Already have an account?"
          buttonText="LogIn"
          onClick={() => setActive(false)}
        />
      </div>
    </div>
  );
};

export default AuthForm;
