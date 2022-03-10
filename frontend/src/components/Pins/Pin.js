import React, { useState } from "react";
import classes from "./Pin.module.css";
import { client, urlFor } from "../../Client";
import { v4 as uuidv4 } from "uuid";
import { Link, useNavigate } from "react-router-dom";
import { MdDownloadForOffline } from "react-icons/md";
import { AiTwotoneDelete } from "react-icons/ai";
import { BsFillArrowUpRightCircleFill } from "react-icons/bs";
import { fetchUser } from "../../utils/fetchUser";

const Pin = ({ pin }) => {
  const [postHovered, setPostHovered] = useState(false);

  const { postedBy, image, _id, destination, save } = pin;

  const navigate = useNavigate();

  const userInfo = fetchUser();

  const alreadySaved = !!save?.filter(
    (item) => item?.postedBy?._id === userInfo?.googleId
  )?.length;

  const savePin = (id) => {
    if (!alreadySaved) {
      client
        .patch(id)
        .setIfMissing({ save: [] })
        .insert("after", "save[-1]", [
          {
            _key: uuidv4(),
            userId: userInfo?.googleId,
            postedBy: {
              _type: "postedBy",
              _ref: userInfo?.googleId,
            },
          },
        ])
        .commit()
        .then(() => {
          window.location.reload();
        });
    }
  };

  const deletePin = (id) => {
    client.delete(id).then(() => {
      window.location.reload();
    });
  };

  return (
    <div>
      <div
        className={classes.pin}
        onMouseEnter={() => setPostHovered(true)}
        onMouseLeave={() => setPostHovered(false)}
        onClick={() => navigate(`/pin-detail/${_id}`)}
      >
        {image && (
          <img
            className={classes.pinImage}
            src={urlFor(image).width(250).url()}
            alt="user's post"
          />
        )}

        {postHovered && (
          <div className={classes.actions}>
            <div className={classes.top}>
              <div>
                <a
                  href={`${image?.asset?.url}?dl=`}
                  download
                  onClick={(e) => e.stopPropagation()}
                  className={classes.download}
                >
                  <MdDownloadForOffline fontSize={20} color="black" />
                </a>
              </div>

              {alreadySaved ? (
                <button type="button">{save?.length} Saved</button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();

                    savePin(_id);
                  }}
                  type="button"
                >
                  save
                </button>
              )}
            </div>

            <div className={classes.btm}>
              {destination && (
                <a
                  href={destination}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <BsFillArrowUpRightCircleFill color="black" />
                  {destination.length > 17
                    ? destination.slice(8, 17)
                    : destination.slice(8)}
                  ...
                </a>
              )}

              {postedBy?._id === userInfo?.googleId && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();

                    deletePin(_id);
                  }}
                >
                  <AiTwotoneDelete />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <Link className={classes.userLink} to={`/user-profile/${postedBy?._id}`}>
        <img src={postedBy?.image} alt="user profile" />

        <p>{postedBy?.userName}</p>
      </Link>
    </div>
  );
};

export default Pin;
