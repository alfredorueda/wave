import { API } from "../constants/routes";
import { getCurrentUserToken } from "../services/auth";

const axios = require("axios").default;

export function makeTrackApi() {
  return axios.create({
    baseURL: `${API.MAIN}${API.TRACK}`,
  });
}

export async function uploadTrack(file = {}, api = makeTrackApi()) {
  const token = await getCurrentUserToken();

  return api.post(``, file, {
    headers: {
      Authorization: `Bearer ${token}`,
      // "Content-Type": `multipart/form-data; boundary="MyBoundary"`,
      "Content-Type": `multipart/form-data"`,
    },
  });
}

export async function deleteTrack(songId, api = makeTrackApi()) {
  console.log("Api function to delete --> ", songId);
  return api.delete(`/${songId}`);
}
