import React from "react";
import { BallTriangle } from "react-loader-spinner";
import classes from "./Spinner.module.css";

const Spinner = ({ message }) => {
  return (
    <div className={classes.spinner}>
      <BallTriangle color="#00BFFF" height={50} width={200} />

      <p>{message}</p>
    </div>
  );
};

export default Spinner;
