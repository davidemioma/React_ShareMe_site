import React from "react";
import Pin from "./Pin";
import Masonry from "react-masonry-css";
import classes from "./MasonryLayout.module.css";

const breakpointColumnsObj = {
  default: 4,
  3000: 6,
  2000: 5,
  1200: 3,
  1000: 2,
  500: 1,
};

const MasonryLayout = ({ pins }) => {
  return (
    <Masonry
      className=""
      style={{ display: "flex", gap: "1rem" }}
      breakpointCols={breakpointColumnsObj}
    >
      {pins?.map((pin) => (
        <Pin key={pin._id} pin={pin} />
      ))}
    </Masonry>
  );
};

export default MasonryLayout;
