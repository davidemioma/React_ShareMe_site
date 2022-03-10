import React from "react";
import classes from "./NavBar.module.css";
import { useNavigate, Link } from "react-router-dom";
import { IoMdAdd, IoMdSearch } from "react-icons/io";

const NavBar = ({ searchTerms, setSearchTerms, user }) => {
  const navigate = useNavigate();

  if (!user) {
    return null;
  }

  return (
    <div className={classes.navBar}>
      <div className={classes.input}>
        <IoMdSearch color={"black"} fontSize={21} />
        <input
          type="text"
          placeholder="Search"
          value={searchTerms}
          onChange={(e) => setSearchTerms(e.target.value)}
          onFocus={() => navigate("/search")}
        />
      </div>

      <div className={classes.links}>
        <Link to={`user-profile/${user?._id}`}>
          <img src={user?.image} alt="user image" />
        </Link>

        <Link className={classes.addBtn} to="/create-pin">
          <IoMdAdd />
        </Link>
      </div>
    </div>
  );
};

export default NavBar;
