import React, { useState, useEffect, useRef } from "react";
import classes from "./Home.module.css";
import { HiMenu } from "react-icons/hi";
import { AiFillCloseCircle } from "react-icons/ai";
import SideBar from "../SideBar/SideBar";
import UserProfile from "../UserProfile/UserProfile";
import PinsPage from "../../pages/PinsPage";
import { client } from "../../Client";
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";
import { userQuery } from "../../utils/data";
import { Routes, Route } from "react-router";

const Home = () => {
  const [toggleSideBar, setToggleSideBar] = useState(false);

  const [user, setUser] = useState();

  const userInfo =
    localStorage.getItem("user") !== "undefined"
      ? JSON.parse(localStorage.getItem("user"))
      : localStorage.clear();

  useEffect(() => {
    const query = userQuery(userInfo?.googleId);

    client.fetch(query).then((data) => {
      setUser(data[0]);
    });
  }, []);

  return (
    <div className={classes.container}>
      <nav className={classes.navBar}>
        <HiMenu fontSize={40} onClick={() => setToggleSideBar(true)} />

        <Link to="/">
          <img src={logo} width="100px" alt="Logo" />
        </Link>

        <Link to={`/user-profile/${user?._id}`}>
          <img className={classes.userImg} src={user?.image} alt="" />
        </Link>
      </nav>

      {toggleSideBar && (
        <div className={classes.modal}>
          <div className={classes.closeBtn}>
            <AiFillCloseCircle
              fontSize={30}
              onClick={() => setToggleSideBar(false)}
            />
          </div>

          <SideBar user={user && user} closeToggle={setToggleSideBar} />
        </div>
      )}

      <div className={classes.contents}>
        <div className={classes.sideBar}>
          <SideBar user={user && user} />
        </div>

        <div className={classes.content}>
          <Routes>
            <Route path="/user-profile/:userId" element={<UserProfile />} />

            <Route path="/*" element={<PinsPage user={user && user} />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Home;
