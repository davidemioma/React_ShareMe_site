import React from "react";
import classes from "./Login.module.css";
import GoogleLogin from "react-google-login";
import { useNavigate } from "react-router";
import { FcGoogle } from "react-icons/fc";
import logo from "../../assets/logowhite.png";
import sharedVideo from "../../assets/share.mp4";
import { client } from "../../Client";

const Login = () => {
  const navigate = useNavigate();

  const responseGoogle = (response) => {
    localStorage.setItem("user", JSON.stringify(response.profileObj));

    const { name, googleId, imageUrl } = response?.profileObj;

    const doc = {
      _id: googleId,
      _type: "user",
      userName: name,
      image: imageUrl,
    };

    client.createIfNotExists(doc).then(() => {
      navigate("/", { replace: true });
    });
  };

  return (
    <div className={classes.container}>
      <div className={classes.login}>
        <video
          src={sharedVideo}
          type="video/mp4"
          loop
          muted
          controls={false}
          autoPlay
        />

        <div className={classes.overlay}>
          <div className={classes.content}>
            <img src={logo} width="130px" alt="logo" />

            <div>
              <GoogleLogin
                clientId={process.env.REACT_APP_GOOGLE_API_TOKEN}
                render={(renderProps) => (
                  <button
                    type="button"
                    className={classes.btn}
                    onClick={renderProps.onClick}
                    disabled={renderProps.disabled}
                  >
                    <FcGoogle fontSize={18} />
                    Sign in with google
                  </button>
                )}
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                cookiePolicy="single_host_origin"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
