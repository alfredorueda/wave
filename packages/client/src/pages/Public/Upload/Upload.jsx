import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { toast } from "react-toastify";

import Layout from "../../../components/Layout";
import uploadSchema from "./upload-in-schema";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import Select from "../../../components/Select";
import DragAndDrop from "../../../components/DragAndDrop";
import { uploadTrack } from "../../../api/tracks-api";
import { getGenres } from "../../../api/genre-api";

export default function Home() {
  const [genres, setGenres] = useState([]);

  useEffect(async () => {
    const { data } = await getGenres();

    if (data.genres) {
      const genresArr = data.genres.map((genre) => genre.name);
      genresArr.unshift("");
      setGenres(genresArr);
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      title: "",
      artist: "",
      album: "",
      genre: "",
      thumbnail: "",
      track: "",
    },
    validationSchema: uploadSchema,
    onSubmit: async (signInState) => {
      try {
        if (!signInState.track)
          return toast("Choose a track!", { type: "error" });

        const formData = new FormData();
        formData.append("title", signInState.title);
        formData.append("artist", signInState.artist);
        formData.append("album", signInState.album);
        formData.append("genre", signInState.genre);
        // formData.append("thumbnail", signInState.thumbnail);
        formData.append("track", signInState.track);

        console.log("formData", formData);
        await uploadTrack(formData);
        return toast("Track uploaded!", { type: "success" });
      } catch (error) {
        return toast(error.message, { type: "error" });
      }
    },
  });

  // const thumbnailOnChange = async (event) => {
  //   formik.setFieldValue("thumbnail", event.target.files[0]);
  // };

  const trackOnChange = async (files) => {
    formik.setFieldValue("track", files[0]);
  };

  return (
    <Layout isNegative>
      <div className="row ">
        <div className="col col-12 col-md-6 p-4">
          <p className="fnt-sidebar fnt-light">Upload your song</p>
          <DragAndDrop handleChange={trackOnChange} />
        </div>

        <div className="col col-12 col-md-6 mt-10 px-5">
          <form onSubmit={formik.handleSubmit}>
            <h1 className="fnt-subtitle-bold mb-4">Song details</h1>
            <div className="row">
              <Input
                label="title"
                type="title"
                id="title"
                classNames="col-12"
                placeholder="example: "
                isNegative
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.title}
                errorMessage={formik.errors.title}
                hasErrorMessage={formik.touched.title}
              />
              <Input
                label="artist"
                type="artist"
                id="artist"
                classNames="col-12"
                placeholder=""
                isNegative
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.artist}
                errorMessage={formik.errors.artist}
                hasErrorMessage={formik.touched.artist}
              />
              <Select
                classNames="col-12 col-md-6"
                label="genre"
                id="genre"
                type="select"
                isNegative
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.genre}
                errorMessage={formik.errors.genre}
                hasErrorMessage={formik.touched.genre}
                // options={["", "rock", "jazz"]}
                options={genres}
              />
              <Select
                classNames="col-12 col-md-6"
                label="album"
                id="album"
                type="select"
                isNegative
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.album}
                errorMessage={formik.errors.album}
                hasErrorMessage={formik.touched.album}
                options={["", "Album 1", "Album 2"]}
              />

              {/* <Input
                classNames="col-12 col-md-6"
                label="thumbnail"
                id="thumbnail"
                type="file"
                placeholder="Upload file"
                isNegative
                // handleChange={thumbnailOnChange}
                // handleBlur={thumbnailOnChange}
                // value={formik.values.thumbnail}
                errorMessage={formik.errors.thumbnail}
                hasErrorMessage={formik.touched.thumbnail}
              /> */}
            </div>

            <div className="d-flex justify-content-end my-5">
              <Button isNegative submitButton>
                Upload
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
