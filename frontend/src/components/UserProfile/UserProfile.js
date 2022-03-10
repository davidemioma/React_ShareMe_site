import React, { useEffect, useState } from "react";
import classes from "./UserProfile.module.css";
import { AiOutlineLogout } from "react-icons/ai";
import { useParams, useNavigate } from "react-router";
import { client } from "../../Client";
import {
  userQuery,
  userCreatedPinsQuery,
  userSavedPinsQuery,
} from "../../utils/data";
import MasonryLayout from "../Pins/MasonryLayout";
import Spinner from "../Pins/Spinner";
import { GoogleLogout } from "react-google-login";

const UserProfile = () => {
  const [user, setUser] = useState();

  const [pins, setPins] = useState();

  const [text, setText] = useState("Created");

  const [activeBtn, setActiveBtn] = useState("created");

  const navigate = useNavigate();

  const { userId } = useParams();

  const User =
    localStorage.getItem("user") !== "undefined"
      ? JSON.parse(localStorage.getItem("user"))
      : localStorage.clear();

  useEffect(() => {
    const query = userQuery(userId);

    client.fetch(query).then((data) => {
      setUser(data[0]);
    });
  }, [userId]);

  useEffect(() => {
    if (text === "Created") {
      const createdPinsQuery = userCreatedPinsQuery(userId);

      client.fetch(createdPinsQuery).then((data) => {
        setPins(data);
      });
    } else {
      const savedPinsQuery = userSavedPinsQuery(userId);

      client.fetch(savedPinsQuery).then((data) => {
        setPins(data);
      });
    }
  }, [userId, text]);

  const logoutHandler = () => {
    localStorage.clear();

    navigate("/login");
  };

  if (!user) {
    return <Spinner message="Loading profile" />;
  }

  return (
    <div className={classes.profile}>
      <div className={classes.userProfile}>
        <img
          className={classes.backImg}
          src="https://source.unsplash.com/1600x900/?nature,photography,technology"
          alt="banner-pic"
        />

        <img className={classes.userImg} src={user.image} alt="user-pic" />

        <div className={classes.logout}>
          {userId === User?.googleId && (
            <GoogleLogout
              clientId={process.env.REACT_APP_GOOGLE_API_TOKEN}
              render={(renderProps) => (
                <button
                  type="button"
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled}
                >
                  <AiOutlineLogout color={"red"} fontSize={21} />
                </button>
              )}
              onLogoutSuccess={logoutHandler}
              cookiePolicy="single_host_origin"
            />
          )}
        </div>
      </div>

      <div className={classes.userContent}>
        <h1>{user.userName}</h1>

        <div className={classes.buttons}>
          <button
            className={activeBtn === "created" ? `${classes.activeBtn}` : ""}
            type="button"
            onClick={(e) => {
              setText(e.target.textContent);

              setActiveBtn("created");
            }}
          >
            Created
          </button>

          <button
            className={activeBtn === "saved" ? `${classes.activeBtn}` : ""}
            type="button"
            onClick={(e) => {
              setText(e.target.textContent);

              setActiveBtn("saved");
            }}
          >
            Saved
          </button>
        </div>
      </div>

      {pins?.length > 0 ? (
        <div>
          <MasonryLayout pins={pins} />
        </div>
      ) : (
        <p className={classes.empty}>No Pins Found!</p>
      )}
    </div>
  );
};

export default UserProfile;
