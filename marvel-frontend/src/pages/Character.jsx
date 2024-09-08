import axios from "axios";
import { useParams, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import placeholder from "../assets/placeholder.png";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";

const Character = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState();
  const params = useParams();
  const location = useLocation();

  const { favChar } = location.state || {};

  useEffect(() => {
    try {
      const fetchData = async () => {
        const response = await axios.get(
          `http://localhost:3000/comics/${params.id}`
        );
        setData(response.data);
        setIsLoading(false);
      };
      //   console.log("id ->", params.id);
      fetchData();
    } catch (error) {
      console.log(error);
    }
  }, []);

  return isLoading ? (
    <div className="loading">
      <p>Loading ...</p>
    </div>
  ) : (
    <main>
      <section>
        <Link to="/characters">
          <div className="back">
            <p>
              <IoArrowBackCircleSharp />
            </p>
          </div>
        </Link>
        {/* {console.log(data)} */}
        <div
          className="hero-char"
          style={
            data.thumbnail.path.includes("not_available") ||
            data.thumbnail.extension.includes("gif")
              ? {
                  backgroundImage: `linear-gradient(#20202000, #202020), url(${placeholder})`,
                  backgroundSize: "Cover",
                }
              : {
                  backgroundImage: `linear-gradient(#20202000, #202020), url(${data.thumbnail.path}/portrait_uncanny.${data.thumbnail.extension})`,
                  backgroundSize: "cover",
                }
          }
        >
          <h1>{data.name}</h1>
          <button
            className="fav-cta"
            onClick={async () => {
              if (favChar.includes(params.id)) {
                try {
                  const token = Cookies.get("token");
                  await axios.delete("http://localhost:3000/favorites-char", {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                    data: { favChar: params.id },
                  });

                  const newFavChar = favChar.filter((id) => {
                    return id !== params.id;
                  });
                  // console.log(newFavChar);
                  setIsFavChar(newFavChar);
                  console.log(favChar);
                  // const index = favChar.indexOf(char._id);
                  // let newFavChar = [
                  //   ...favChar.slice(0, index),
                  //   ...favChar.slice(index + 1),
                  // ];
                  // setIsFavChar(newFavChar);
                  // console.log(newFavChar);
                } catch (error) {
                  console.log(error);
                }
              } else
                try {
                  const token = Cookies.get("token");
                  let newFavChar;

                  newFavChar = [...favChar, params.id];

                  await axios.post(
                    "http://localhost:3000/favorites-char",
                    { favChar: params.id },
                    {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  );
                  setIsFavChar(newFavChar);
                } catch (error) {
                  alert("You need to be connected");
                }
            }}
          >
            {favChar.includes(params.id) ? (
              <FaHeart className="heart-filled" />
            ) : (
              <FaRegHeart className="heart-empty" />
            )}
            {/* {console.log(favChar.includes(char._id))} */}
          </button>
        </div>
        <div className="description">
          <p>{data.description}</p>
        </div>
        <div className="comics-mentions">
          <h2>Featured comics</h2>
          <div className="all-comics">
            {data.comics.length === 0 ? (
              <div className="no-comics">
                <p>No comics available 😢</p>
              </div>
            ) : (
              data.comics.map((comics, index) => (
                <div key={index} className="comic-card">
                  <img
                    src={`${comics.thumbnail.path}/portrait_fantastic.${comics.thumbnail.extension}`}
                    alt="comic"
                  />
                  <p className="comic-title">{comics.title}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Character;
