import React, { useState, useEffect } from "react";
import axios from "axios";
import Pagination from "@mui/material/Pagination";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";

const Favorites = ({ isLoggedIn, setIsLoggedIn }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [favChar, setIsFavChar] = useState([]);
  const [favCharsData, setFavCharsData] = useState([]);
  const [favComics, setIsFavComics] = useState([]);
  const [favComicsData, setIsFavComicsData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get("token");

        // console.log(token);
        const response = await axios.get(
          "http://localhost:3000/favorites-char",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const favCharsId = response.data;
        const favCharsData = [];
        setIsLoading(false);
        // console.log(chars);
        for (let i = 0; i < favCharsId.length; i++) {
          const id = favCharsId[i];
          try {
            const favCharResponse = await axios.get(
              `http://localhost:3000/character/${id}`
            );
            favCharsData.push(favCharResponse.data);
            // console.log(id);
          } catch (error) {
            console.log(error.message);
          }
        }
        setIsFavChar(favCharsId);
        setFavCharsData(favCharsData);
      } catch (error) {
        alert(error.response.data.message);
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get("token");

        // console.log(token);
        const response = await axios.get(
          "http://localhost:3000/favorites-comics",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response);
        const favComicsId = response.data;
        const favComicsData = [];
        // console.log(chars);
        for (let i = 0; i < favComicsId.length; i++) {
          const id = favComicsId[i];
          try {
            const favComicsResponse = await axios.get(
              `http://localhost:3000/comic/${id}`
            );
            favComicsData.push(favComicsResponse.data);
            // console.log(id);
          } catch (error) {
            console.log(error.message);
          }
        }
        setIsFavComics(favComicsId);
        setIsFavComicsData(favComicsData);
      } catch (error) {
        alert(error.response.data.message);
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);

  // console.log(favComicsData);

  return isLoading ? (
    <div>
      <p>Chargement</p>
    </div>
  ) : (
    <main className="favorites">
      <h1>Your favorites</h1>
      <h2>Characters</h2>
      <div className="char-list">
        {favCharsData.map((char) => (
          <div className="char-card" key={char._id}>
            <Link to={`/character/${char._id}`}>
              {char.thumbnail.path.includes("not_available") ||
              char.thumbnail.extension.includes("gif") ? (
                <img src="src/assets/placeholder.png" alt="character" />
              ) : (
                <img
                  src={`${char.thumbnail.path}/portrait_fantastic.${char.thumbnail.extension}`}
                  alt="character"
                />
              )}
              <div className="char-details">
                <p className="char-name">{char.name}</p>
                <p
                  className={
                    char.description
                      ? "char-description"
                      : "char-description-none"
                  }
                >
                  {char.description}
                </p>
              </div>
            </Link>
            <button
              className="fav-cta"
              onClick={async () => {
                try {
                  const token = Cookies.get("token");
                  await axios.delete("http://localhost:3000/favorites-char", {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                    data: { favChar: char._id },
                  });

                  const newFavChar = favChar.filter((id) => id !== char._id);
                  setIsFavChar(newFavChar);

                  const newFavCharData = favCharsData.filter(
                    (character) => character._id !== char._id
                  );
                  setFavCharsData(newFavCharData);
                } catch (error) {
                  console.log(error);
                }
              }}
            >
              <FaHeart className="heart-filled" />
            </button>
          </div>
        ))}
      </div>
      <h2>Comics</h2>
      <div className="comics-list">
        {favComicsData.map((comic) => {
          return (
            <div className="comic-card">
              <div className="comic-cover">
                {comic.thumbnail.path.includes("not_available") ||
                comic.thumbnail.extension.includes("gif") ? (
                  <img src="src/assets/placeholder.png" alt="comic" />
                ) : (
                  <img
                    src={`${comic.thumbnail.path}/portrait_uncanny.${comic.thumbnail.extension}`}
                    alt="comic"
                  />
                )}
              </div>
              <p className="comic-title">{comic.title}</p>
              <p className="comic-description">{comic.description}</p>
              <button
                className="fav-cta"
                onClick={async () => {
                  try {
                    const token = Cookies.get("token");
                    await axios.delete(
                      "http://localhost:3000/favorites-comics",
                      {
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                        data: { favComics: comic._id },
                      }
                    );

                    const newFavComics = favComics.filter(
                      (id) => id !== comic._id
                    );
                    setIsFavComics(newFavComics);

                    const newFavComicsData = favComicsData.filter(
                      (comic) => comic._id !== comic._id
                    );
                    setIsFavComicsData(newFavComicsData);
                  } catch (error) {
                    console.log(error);
                  }
                }}
              >
                <FaHeart className="heart-filled" />
              </button>
            </div>
          );
        })}
      </div>
    </main>
  );
};

export default Favorites;
