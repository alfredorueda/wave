import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { fromBottom } from "../../utils/motionSettings";

import HeartIcon from "../SVGicons/HeartIcon";
import { PUBLIC } from "../../constants/routes";

import "./AlbumSquaredCard.scss";
import { likeAlbum } from "../../api/album-api";

export default function AlbumSquaredCard({
  albumId,
  albumTitle,
  userId,
  isLiked,
  colsMd = "6",
  updateLikedView = () => {},
}) {
  const [liked, setLiked] = useState(isLiked);
  const albumObject = {
    title: albumTitle,
    albumId: albumId,
    isLiked: isLiked,
    userId: userId,
  };

  const handleLike = async (e) => {
    e.preventDefault();
    const userLikes = !liked;

    try {
      await likeAlbum(albumId);
      updateLikedView(
        {
          ...albumObject,
          isLiked: userLikes,
          _id: albumId,
        },
        userLikes,
      );
      setLiked(userLikes);
    } catch (error) {
      toast(error.message, { type: "error" });
      setLiked(!liked);
    }
  };

  useEffect(() => {
    setLiked(isLiked);
  }, [isLiked]);

  const componentClasses = `col col-12 col-lg-${colsMd} col-xxl-4 p-2`;
  return (
    <Link to={`${PUBLIC.ALBUM}/${albumId}`} className={componentClasses}>
      <motion.div
        className="d-flex flex-column justify-content-between playlist-card fx-rounded py-3 px-4"
        // Animation settings
        variants={fromBottom}
      >
        <div
          className="heart-wrapper d-flex justify-content-end fnt-primary"
          data-testid="playlistCard"
        >
          <button
            className="text-center px-0"
            type="button"
            onClick={handleLike}
          >
            {liked ? <HeartIcon isFull /> : <HeartIcon />}
          </button>
        </div>

        <p className="fnt-input-bold fnt-light mb-0 truncate">
          {albumTitle.toUpperCase()}
        </p>
      </motion.div>
    </Link>
  );
}