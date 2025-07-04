import React from "react";
import AuthForm from "../components/AuthForm";
import "../App.css";

const SignIn = ({ setUser }: { setUser: (user: any) => void }) => {
  return (
    <div className="flex-center">
      <AuthForm mode="sign-in" setUser={setUser} />
    </div>
  );
};

export default SignIn;
