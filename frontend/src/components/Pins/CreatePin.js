import React, { useState } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router";
import { categories } from "../../utils/data";
import { client } from "../../Client";
import Spinner from "./Spinner";
import classes from "./CreatePin.module.css";

const CreatePin = ({ user }) => {
  const [title, setTitle] = useState("");

  const [about, setAbout] = useState("");

  const [destination, setDestination] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [category, setCategory] = useState("");

  const [fields, setFields] = useState(false);

  const [imageAsset, setImageAsset] = useState(null);

  const [wrongImageType, setWrongImageType] = useState(false);

  const navigate = useNavigate();

  const uploadImage = (e) => {
    const { type, name } = e.target.files[0];

    if (
      type === "image/png" ||
      type === "image/svg" ||
      type === "image/jpeg" ||
      type === "image/gif" ||
      type === "image/tiff"
    ) {
      setWrongImageType(false);

      setIsLoading(true);

      client.assets
        .upload("image", e.target.files[0], {
          contentType: type,
          filename: name,
        })
        .then((docs) => {
          setImageAsset(docs);

          setIsLoading(false);
        })
        .catch((err) => {
          console.log("Upload failed:", err.message);
        });
    } else {
      setWrongImageType(true);

      setIsLoading(false);
    }
  };

  const createPin = () => {
    if (title && about && destination && imageAsset?._id && category) {
      const docs = {
        _type: "pin",
        title,
        about,
        destination,
        image: {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: imageAsset?._id,
          },
        },
        userId: user?._id,
        postedBy: {
          _type: "postedBy",
          _ref: user?._id,
        },
        category,
      };

      client.create(docs).then(() => {
        navigate("/");
      });
    } else {
      setFields(true);

      setTimeout(() => {
        setFields(false);
      }, 2000);
    }
  };

  return (
    <div className={classes.createPin}>
      {fields && <p className={classes.error}>Please add all fields.</p>}

      <div className={classes.content}>
        <div className={classes.upload}>
          <div className={classes.uploadContent}>
            {isLoading && <Spinner />}

            {wrongImageType && <p>It&apos;s wrong file type.</p>}

            {!imageAsset ? (
              <label>
                <div className={classes.imgAction}>
                  <div>
                    <AiOutlineCloudUpload fontSize={25} />

                    <p>Click to upload</p>
                  </div>

                  <p style={{ opacity: 0.4 }}>
                    Recommendation: Use high-quality JPG, JPEG, SVG, PNG, GIF or
                    TIFF less than 20MB
                  </p>
                </div>

                <input
                  className={classes.imgInput}
                  type="file"
                  name="upload-image"
                  onChange={uploadImage}
                />
              </label>
            ) : (
              <div className={classes.image}>
                <img src={imageAsset?.url} alt="uploaded-pic" />

                <button type="button" onClick={() => setImageAsset(null)}>
                  <MdDelete fontSize={20} />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className={classes.form}>
          <input
            className={classes.titleInput}
            type="text"
            placeholder="Add your title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {user && (
            <div className={classes.userInfo}>
              <img src={user.image} alt="user-profile" />

              <p>{user.userName}</p>
            </div>
          )}

          <input
            className={classes.aboutInput}
            type="text"
            placeholder="Tell everyone what you pin is about"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
          />

          <input
            className={classes.destInput}
            type="text"
            placeholder="Add a destination link"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />

          <div className={classes.select}>
            <p>Choose Pin Category</p>

            <select
              value={category}
              placeholder="Select category"
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="others">Select Category</option>

              {categories.map((item) => (
                <option key={item.name} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div className={classes.formBtn}>
            <button type="button" onClick={createPin}>
              Save pin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePin;
