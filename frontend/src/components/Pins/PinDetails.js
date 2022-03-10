import React, { useState, useEffect, Fragment } from "react";
import classes from "./PinDetails.module.css";
import { MdDownloadForOffline } from "react-icons/md";
import { v4 as uuidv4 } from "uuid";
import { Link, useParams } from "react-router-dom";
import { client, urlFor } from "../../Client";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";
import { pinDetailQuery, pinDetailMorePinQuery } from "../../utils/data";

const PinDetails = ({ user }) => {
  const { pinId } = useParams();

  const [pinDetail, setPinDetail] = useState();

  const [addingComment, setAddingComment] = useState(false);

  const [relatedPins, setRelatedPins] = useState();

  const [comment, setComment] = useState("");

  const fetchPinDeatils = () => {
    const query = pinDetailQuery(pinId);

    if (query) {
      client.fetch(query).then((data) => {
        setPinDetail(data[0]);

        if (data[0]) {
          const newQuery = pinDetailMorePinQuery(data[0]);

          client.fetch(newQuery).then((res) => {
            setRelatedPins(res);
          });
        }
      });
    }
  };

  const addCommentHandler = () => {
    if (comment) {
      setAddingComment(true);

      client
        .patch(pinId)
        .setIfMissing({ comments: [] })
        .insert("after", "comments[-1]", [
          {
            comment,
            _key: uuidv4(),
            postedBy: { _type: "postedBy", _ref: user._id },
          },
        ])
        .commit()
        .then(() => {
          fetchPinDeatils();

          setComment("");

          setAddingComment(false);
        });
    }
  };

  useEffect(() => {
    fetchPinDeatils();
  }, [pinId]);

  if (!pinDetail) {
    return <Spinner message="Loading pin..." />;
  }

  return (
    <Fragment>
      {pinDetail && (
        <div className={classes.pin}>
          <div className={classes.pinDetail}>
            <img
              src={pinDetail?.image && urlFor(pinDetail?.image).url()}
              alt="user-post"
            />

            <div className={classes.pinContent}>
              <div className={classes.pinLinks}>
                <div>
                  <a
                    href={`${pinDetail.image.asset.url}?dl=`}
                    download
                    onClick={(e) => e.stopPropagation()}
                    className={classes.download}
                  >
                    <MdDownloadForOffline fontSize={20} color="black" />
                  </a>
                </div>

                <div>
                  <a
                    href={pinDetail.destination}
                    target="_blank"
                    rel="noreferrer"
                    className={classes.destLink}
                  >
                    {pinDetail.destination?.slice(8)}
                  </a>
                </div>
              </div>

              <div className={classes.profile}>
                <div>
                  <h1>{pinDetail.title}</h1>

                  <p>{pinDetail.about}</p>
                </div>

                <Link to={`/user-profile/${pinDetail?.postedBy._id}`}>
                  <img src={pinDetail?.postedBy.image} alt="user-img" />

                  <p>{pinDetail?.postedBy.userName}</p>
                </Link>
              </div>

              <h2>Comments</h2>

              {pinDetail.comments && (
                <div className={classes.comments}>
                  {pinDetail.comments.map((comment, i) => (
                    <div className={classes.comment} key={i}>
                      <Link to={`/user-profile/${comment.postedBy._id}`}>
                        <img
                          src={comment.postedBy.image}
                          alt="comment-user-img"
                        />
                      </Link>

                      <div>
                        <span>{comment.postedBy.userName}</span>

                        <span>{comment.comment}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className={classes.addComment}>
                <Link to={`/user-profile/${user?._id}`}>
                  <img src={user?.image} alt="user-img" />
                </Link>

                <input
                  type="text"
                  placeholder="Add a comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />

                <button type="button" onClick={addCommentHandler}>
                  {addingComment ? "Doing..." : "Done"}
                </button>
              </div>
            </div>
          </div>

          {relatedPins?.length > 0 ? (
            <div className={classes.relatedPins}>
              <h2>More like this</h2>

              <MasonryLayout pins={relatedPins} />
            </div>
          ) : (
            <Spinner message="Loading more pins..." />
          )}
        </div>
      )}
    </Fragment>
  );
};

export default PinDetails;
