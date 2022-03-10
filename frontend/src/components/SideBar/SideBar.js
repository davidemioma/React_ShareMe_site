import React from "react";
import classes from "./SideBar.module.css";
import { NavLink, Link } from "react-router-dom";
import { RiHomeFill } from "react-icons/ri";
import { IoIosArrowForward } from "react-icons/io";
import logo from "../../assets/logo.png";
import { categories } from "../../utils/data";

const SideBar = ({ user, closeToggle }) => {
  const handleCloseToggle = () => {
    if (closeToggle) closeToggle(false);
  };

  return (
    <div>
      <Link to="/">
        <img onClick={handleCloseToggle} width="150px" src={logo} alt="logo" />
      </Link>

      <div className={classes.contents}>
        <NavLink
          className={({ isActive }) =>
            isActive ? classes.isActive : classes.notActive
          }
          onClick={handleCloseToggle}
          to="/"
        >
          <RiHomeFill style={{ marginRight: "1rem" }} />
          Home
        </NavLink>

        <h3>Discover cateogries</h3>

        <div className={classes.categories}>
          {categories.slice(0, categories.length - 1).map((category) => (
            <NavLink
              key={category.name}
              className={({ isActive }) =>
                isActive ? classes.isActive : classes.notActive
              }
              to={`/category/${category.name}`}
              onClick={handleCloseToggle}
            >
              <img src={category.image} />
              {category.name}
            </NavLink>
          ))}
        </div>

        {user && (
          <Link
            className={classes.profile}
            onClick={handleCloseToggle}
            to={`/user-profile/${user._id}`}
          >
            <img src={user.image} />
            <p>{user.userName}</p>
            <IoIosArrowForward />
          </Link>
        )}
      </div>
    </div>
  );
};

export default SideBar;
