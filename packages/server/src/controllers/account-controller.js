const db = require("../models");

const { cloudinary } = require("../services/cloudinary");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const writeFileAsync = promisify(fs.writeFile);
const { getPublicId } = require("../utils/cloudinaryUtils");

const { DEFAULT_PROFILE_PICTURE } = require("../utils/default-presets");

async function getAccount(req, res, next) {
  try {
    const { email } = req.user;
    const user = await db.User.findOne(
      { email },
      { email: 1, firstName: 1, lastName: 1, birthDate: 1, country: 1, _id: 0 },
    );

    res.status(200).send({
      data: user,
    });
  } catch (err) {
    res.status(500).send({
      error: err.message,
    });
    next(err);
  }
}

async function updateAccount(req, res, next) {
  try {
    const { firebaseId } = req.user;
    const { firstName, lastName, birthDate, country, email } = req.body;
    const { profilePicture } = await db.User.findOne(
      {
        firebaseId: firebaseId,
      },
      { profilePicture: 1, _id: 0 },
    );
    let profilePictureFile = req.files["profilePicture"];
    let isProfilePictureDefault = false;
    let profilePictureUrl = profilePicture;

    if (profilePictureFile) {
      // checking if old profile picture is the default one
      if (profilePicture === DEFAULT_PROFILE_PICTURE)
        isProfilePictureDefault = true;

      profilePictureFile = profilePictureFile[0];
      const profilePictureLocation = path.join(
        __dirname,
        "../../",
        "uploads",
        profilePictureFile.originalname,
      );

      // upload file
      await writeFileAsync(
        profilePictureLocation,
        Buffer.from(new Uint8Array(profilePictureFile.buffer)),
      );

      // upload to cloudinary
      const cldProfilePictureRes = await cloudinary.uploader.upload(
        profilePictureLocation,
        {
          upload_preset: "profile-pictures-preset",
          resource_type: "image",
          width: 300,
          height: 300,
          crop: "limit",
        },
      );
      profilePictureUrl = cldProfilePictureRes.secure_url;

      // delete old picture on cloudinary if found
      if (!isProfilePictureDefault) {
        const publicId = getPublicId(profilePicture);
        await cloudinary.uploader
          .destroy(publicId, {
            resource_type: "image",
          })
          .catch(() => undefined);
      }

      // delete uploaded file
      fs.unlink(profilePictureLocation, (err) => {
        if (err) throw err;
      });
    }

    const updatedAccount = await db.User.findOneAndUpdate(
      { firebaseId: firebaseId },
      {
        firstName: firstName,
        lastName: lastName,
        birthDate: birthDate,
        email: email,
        country: country,
        profilePicture: profilePictureUrl,
      },
      {
        new: true,
        projection: {
          firstName: 1,
          lastName: 1,
          birthDate: 1,
          email: 1,
          country: 1,
          profilePicture: 1,
        },
      },
    );

    res.status(200).send({
      id: updatedAccount._id,
      data: updatedAccount,
      message: "Success",
    });
  } catch (error) {
    res.status(500).send({
      error: error,
    });
    next(error);
  }
}

async function deleteAccount(req, res, next) {
  try {
    const { email } = req.user;

    const { profilePicture } = await db.User.findOne(
      { email: email },
      { profilePicture: 1, _id: 0 },
    );

    // checking if old profile picture is the default one
    if (profilePicture !== DEFAULT_PROFILE_PICTURE) {
      const publicId = getPublicId(profilePicture);
      await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
    }

    const deletedAccount = await db.User.findOneAndDelete({ email });

    // TODO: delete all account data

    if (!deletedAccount) res.status(404).send({ message: "User not found!" });

    res.status(200).send({
      data: deletedAccount,
      message: "Success",
    });
  } catch (error) {
    res.status(410).send({ error: error });
    next(error);
  }
}

module.exports = {
  deleteAccount: deleteAccount,
  getAccount: getAccount,
  updateAccount: updateAccount,
};
