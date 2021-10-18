import React, { useState, useEffect } from "react";
import { Link, useRouteMatch, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../../../components/Button";
import JumboText from "../../../components/JumboText";
import Layout from "../../../components/Layout";
import {
  getUserById,
  getUserAlbums,
  getUserLikedAlbums,
} from "../../../api/users-api";
import { PUBLIC } from "../../../constants/routes";
import AlbumList from "../../../components/AlbumList/AlbumList";

function UserAlbums() {
  const [userCreatedAlbums, setUserCreatedAlbums] = useState([]);
  const [userLikedAlbums, setUserLikedAlbums] = useState([]);
  const [userPossessive, setUserPossessive] = useState([]);
  const history = useHistory();

  const { userId } = useRouteMatch(
    `${PUBLIC.USER_VIEW}/:userId${PUBLIC.ALBUMS}`,
  ).params;

  const loadUser = async () => {
    try {
      const { data } = await getUserById(userId);
      setUserPossessive(
        data.data.firstName.slice(-1) === "s"
          ? `${data.data.firstName}'`
          : `${data.data.firstName}'s`,
      );
    } catch (error) {
      if (error.response.status === 500) {
        toast("User not found", {
          type: "error",
        });
        history.push(PUBLIC.NOT_FOUND);
      } else {
        toast(error.message, { type: "error" });
      }
    }
  };

  const fetchCreatedAlbums = async () => {
    const init = 0;
    const limit = 12;
    try {
      const {
        data: { albums },
      } = await getUserAlbums(userId, init, limit);
      console.log(albums);
      setUserCreatedAlbums(albums);
    } catch (error) {
      toast(error.message, { type: "error" });
    }
  };

  const fetchLikedAlbums = async () => {
    const init = 0;
    const limit = 12;
    try {
      const {
        data: { likedAlbums },
      } = await getUserLikedAlbums(userId, init, limit);
      console.log(likedAlbums);
      setUserLikedAlbums(likedAlbums);
    } catch (error) {
      toast(error.message, { type: "error" });
    }
  };

  useEffect(() => {
    fetchCreatedAlbums();
    fetchLikedAlbums();
    loadUser();
  }, []);

  return (
    <Layout isNegative>
      <div className="row mb-3 mb-md-5">
        <div className="col col-12 col-md-9 mb-2 mb-md-0">
          <JumboText
            priText={`${userPossessive} Albums`}
            cols="12"
            isNegative
          />
        </div>
        <div className="d-flex justify-content-start justify-content-md-end col col-12 col-md-3 mb-4 mb-md-0">
          <div className="p-0 mt-2">
            <Link className="float-end" to={`${PUBLIC.USERS}/${userId}`}>
              <Button isNegative>Back</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="row g-5">
        <div className="col col-12 col-md-6 pb-5 pb-md-0">
          <div className="fnt-page-title mb-4">Created</div>
          {userCreatedAlbums && (
            <AlbumList
              albums={userCreatedAlbums}
              // onAddLikedColumn={handleAddLikedColumn}
            />
          )}
        </div>
        <div className="col col-12 col-md-6 pb-5 pb-md-0">
          <div className="fnt-page-title mb-4">Liked</div>
          {userLikedAlbums && (
            <AlbumList
              albums={userLikedAlbums}
              // onAddLikedColumn={handleAddLikedColumn}
            />
          )}
        </div>
      </div>
    </Layout>
  );
}

export default UserAlbums;
