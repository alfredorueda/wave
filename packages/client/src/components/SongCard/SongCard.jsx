import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { PUBLIC } from "../../constants/routes";

import "./SongCard.scss";

export default function SongCard({
  songNumber,
  songImg,
  songName,
  artist,
  albumName,
  time,
  userId,
  playCounter = 0,
}) {
  const [isLiked, setIsLiked] = useState(false);
  const [isOwned, setIsOwned] = useState(false);
  const userState = useSelector((state) => state.user);

  const handleIsOwned = () => {
    if (userId === userState.mongoId) {
      setIsOwned(true);
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handlePlay = () => {
    console.log("playing =>", songName);
  };

  const handleEditSong = () => {
    console.log("editing =>", songName);
  };

  const handleDeleteSong = () => {
    console.log("Removing =>", songName);
  };

  const timeIntoString = (seconds) => {
    const data = parseInt(seconds, 10);
    let minute = Math.floor((data / 60) % 60);
    minute = minute < 10 ? `0${minute}` : minute;
    let second = data % 60;
    second = second < 10 ? `0${second}` : second;
    return `${minute}:${second}`;
  };

  const formatPlayCounter = (counter) => {
    const result = counter
      .toString()
      .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
    return result;
  };

  useEffect(() => {
    handleIsOwned();
  }, []);

  return (
    <div className="row card-hover fx-rounded" onDoubleClick={handlePlay}>
      <div className="col col-12 d-flex justify-content-between align-items-center py-2">
        <h3 className="m-0 px-2 fnt-song-bold text-start">{songNumber}</h3>
        <div className="play-hover" onClick={handlePlay} aria-hidden="true">
          <img className="fx-rounded mx-2" src={songImg} alt={songName} />
          <i className="fas fa-play fnt-white" />
        </div>
        <div className="d-flex fnt-primary px-2">
          <button className="text-center" type="button" onClick={handleLike}>
            {isLiked ? (
              <i className="fas fa-heart fnt-secondary" />
            ) : (
              <i className="far fa-heart fnt-secondary" />
            )}
          </button>
        </div>
        <div className=" px-2 col">
          <h3 className="m-0 text-start fnt-song-bold">{songName}</h3>
          <h4 className="m-0  text-start fnt-artist">{artist}</h4>
        </div>
        <Link
          className="m-0 text-start fnt-song-regular px-2 col"
          to={`${PUBLIC.ALBUMS}/${albumName}`}
        >
          {albumName}
        </Link>
        <h4 className="m-0 text-start fnt-song-regular px-2 col">
          {formatPlayCounter(playCounter)}
        </h4>
        <h4 className="m-0 text-start fnt-song-regular px-2 col">
          {timeIntoString(time)}
        </h4>
        <div className="dropdown">
          <button
            className="m-0 text-end"
            type="button"
            id="contextSongMenu"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="fas fa-ellipsis-h" />
          </button>
          {isOwned ? (
            <ul
              className="dropdown-menu dropdown-menu-end clr-secondary p-1"
              aria-labelledby="contextSongMenu"
            >
              <button
                className="dropdown-item fnt-light fnt-song-regular "
                type="button"
                onClick={handleEditSong}
              >
                Edit
              </button>
              <hr className="dropdown-wrapper m-0" />
              <button
                className="dropdown-item fnt-light fnt-song-regular"
                type="button"
                onClick={handleDeleteSong}
              >
                Delete
              </button>
            </ul>
          ) : (
            <ul
              className="dropdown-menu dropdown-menu-end clr-secondary p-1"
              aria-labelledby="contextSongMenu"
            >
              <Link to={`${PUBLIC.USERS}/${userId}`}>
                <p
                  className="dropdown-item fnt-light fnt-song-regular m-0"
                  type="button"
                >
                  Go to user
                </p>
              </Link>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
