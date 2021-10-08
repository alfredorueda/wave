/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable jest/no-disabled-tests */

import React from "react";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import axios from "axios";
import { render, screen, waitFor, cleanup } from "../../utils/test-utils";
import "@testing-library/jest-dom";

import Tracks from "../../pages/Public/Tracks";

const userData = {
  email: "brahimcasas@hotmail.es",
  token:
    "eyJhbGciOiJSUzI1NiIsImtpZCI6IjM1MDM0MmIwMjU1MDAyYWI3NWUwNTM0YzU4MmVjYzY2Y2YwZTE3ZDIiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiQnJhaGltIEJlbmFsaWEiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EtL0FPaDE0R2ozZVphQVRRQTZRYXplLVdyNnZpU3Noa3ZUUm1DLUdoU0NqZUNFPXM5Ni1jIiwiaXNzIjoiaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tL3dhdmUtNWNjYmEiLCJhdWQiOiJ3YXZlLTVjY2JhIiwiYXV0aF90aW1lIjoxNjMzNTk5NjkwLCJ1c2VyX2lkIjoiVk1YMThjWnpmbE1yb1dpWmhyYlY5VGZvRHZqMiIsInN1YiI6IlZNWDE4Y1p6ZmxNcm9XaVpocmJWOVRmb0R2ajIiLCJpYXQiOjE2MzM2MDM2ODYsImV4cCI6MTYzMzYwNzI4NiwiZW1haWwiOiJicmFoaW1jYXNhc0Bob3RtYWlsLmVzIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZ29vZ2xlLmNvbSI6WyIxMDI4ODEyNzY5ODU3NzY2ODY4OTIiXSwiZW1haWwiOlsiYnJhaGltY2FzYXNAaG90bWFpbC5lcyJdfSwic2lnbl9pbl9wcm92aWRlciI6Imdvb2dsZS5jb20ifX0.VbRWaE9Gx-UfPIIqBKIwal6beFYhkTMn2o4jjptrpz28ypBY5UH8iJAE3PFp-S06ArE_BJEiwuUVbWsu7cmeNyQBSWQN6uFb2ZUF51EQM2G4BgV5Mo8EDfGzeUSI9eTzG4JBmEaHWogQ37BHGHfJzG5fD3eXaksSMRjfU9N6sPSG4nuQQN7lFClwdTS8eiv2RsMpCRM6hM50EzbbYph2jZhdfjPRnBFUK_4jOwWSih3c7YRyfUPsdF97qBAEfbAEXCC1irtwS0CxAyPxNqfmvL-leJdDrUxAsV5Ko86oG5dZAphtnygU7QvBsD0KJRmp6kNGKKDHOvMoVTq5FTjxvQ",
  firstName: "Brahim",
  lastName: "Benalia",
  profilePicture:
    "https://lh3.googleusercontent.com/a-/AOh14Gj3eZaATQA6Qaze-Wr6viSshkvTRmC-GhSCjeCE=s96-c",
  firebaseId: "VMX18cZzflMroWiZhrbV9TfoDvj2",
  isRegistering: false,
  isLogged: true,
  mongoId: "615486c478206d637454b5b6",
  emailVerified: true,
};

jest.mock("firebase/compat/app", () => {
  return {
    auth: jest.fn(() => {
      return {
        onAuthStateChanged: jest.fn().mockResolvedValue(userData),
      };
    }),
    apps: [],
    initializeApp: jest.fn(),
  };
});

const tracksData = {
  data: {
    data: [
      {
        popularity: 0,
        _id: "615478ce075f352c9f91f69b",
        name: "The big building",
        artist: "Bensound",
        url: "https://res.cloudinary.com/dz5nspe7f/video/upload/v1632147266/music-uploads/bensound-happyrock_bg3hh6.mp3",
        duration: 180,
        genreId: "6154269e1755f546b465a650",
        userId: "61542b5bd2fd325bfcb42a7d",
        album: {
          _id: "6156f57a87ccf70e9023b03c",
          thumbnail:
            "https://res.cloudinary.com/dz5nspe7f/image/upload/v1633088890/covers-preset/x5vy3gdag6wa5qkweera.jpg",
          title: "Mathias' Album",
        },
        likes: 2,
        isLiked: false,
      },
      {
        popularity: 0,
        _id: "6154862ab51025e9d25f5795",
        name: "Song 3",
        artist: "Bensound",
        url: "https://res.cloudinary.com/dz5nspe7f/video/upload/v1632147266/music-uploads/bensound-happyrock_bg3hh6.mp3",
        duration: 180,
        genreId: "6154269e1755f546b465a650",
        userId: "6154269e1755f546b465a648",
        album: {
          _id: "6154269e1755f546b465a65b",
          title: "Album 1",
          thumbnail:
            "https://images.unsplash.com/photo-1495615080073-6b89c9839ce0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=906&q=80",
        },
        likes: 1,
        isLiked: false,
      },
    ],
  },
};

describe("Tracks Page test", () => {
  afterEach(cleanup);

  test("Tracks page rendering", async () => {
    const history = createMemoryHistory();

    //* Esto funciona con el mock de axios.js asi { get: ...}
    // axios.get.mockResolvedValue(tracksData);
    // const result = await getMyTracks(0, 5, axios);
    // expect(result).toEqual(tracksData);

    //* Esto funciona con el mock de axios.js sin parametros
    axios.create.mockReturnThis();
    axios.get
      .mockResolvedValue({ data: { data: [] } })
      .mockResolvedValueOnce({ data: { data: [] } })
      .mockResolvedValueOnce(tracksData);

    render(
      <Router history={history}>
        <Tracks />
      </Router>,
    );

    // wait for App to load tracks
    const browserRouter = await waitFor(() =>
      screen.findAllByTestId("trackCard"),
    );

    // expect tracks to be rendered
    expect(browserRouter).toHaveLength(2);

    // tracks page rendered
    expect(screen.getByText(/my songs/i)).toBeInTheDocument();
  });
});
