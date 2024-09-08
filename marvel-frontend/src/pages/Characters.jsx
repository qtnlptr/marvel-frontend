import React, { useState, useEffect } from "react";
import axios from "axios";
import Pagination from "@mui/material/Pagination";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { Navigate, useNavigate } from "react-router-dom";

const Characters = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState();
  const [page, setPage] = useState(1);
  const [name, setName] = useState("");
  const [favChar, setIsFavChar] = useState([]);

  const pageSize = 20;

  useEffect(() => {
    try {
      const fetchData = async () => {
        let skip = 0;
        if (page !== 1) {
          skip = (page - 1) * 20;
        }

        let url = `http://localhost:3000/characters?`;

        if (name) {
          url = `http://localhost:3000/characters?skip=${skip}&name=${name}`;
        } else {
          url = `http://localhost:3000/characters?skip=${skip}`;
        }

        const response = await axios.get(url);
        setData(response.data);
        setIsLoading(false);
        // console.log("data ---->", response.data);

        const token = Cookies.get("token");

        const favResponse = await axios.get(
          "http://localhost:3000/favorites-char",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setIsFavChar(favResponse.data);
      };
      fetchData();
    } catch (error) {
      console.log(error);
    }
  }, [page, name]);

  // console.log("fav char ----->", favChar);

  return isLoading ? (
    <div className="loading">
      <p>Loading ...</p>
    </div>
  ) : (
    <div className="container-all">
      <section className="char-page">
        <div className="hero">
          <h2>Marvel characters</h2>
          <p>
            Get hooked on a hearty helping of heroes and villains from the
            humble House of Ideas!
          </p>
        </div>
        <h1>Featured characters</h1>
        <div className="search-box">
          <input
            className="search"
            type="search"
            value={name}
            placeholder="Search a character"
            onChange={(event) => {
              setName(event.target.value);
            }}
          />
          <span
            onClick={() => {
              setName("");
            }}
            className={name === "" && "invisible"}
          >
            Cancel
          </span>
          {/* {console.log("name---->", name)} */}
        </div>
        {/* {console.log(data.results)} */}
        <Pagination
          sx={{
            "& .MuiPaginationItem-root": { color: "white" },
            "& .MuiPaginationItem-page.Mui-selected": {
              backgroundColor: "red !important",
              color: "white !important",
            },
          }}
          color="primary"
          count={Math.ceil(data.count / pageSize)}
          page={page}
          onChange={(event, value) => setPage(value)}
          size="small"
          showFirstButton
          showLastButton
        />
        <div className="char-list">
          {data.results.map((char) => {
            return (
              <div className="char-card">
                <Link to={`/character/${char._id}`} state={{ favChar }}>
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
                  </div>{" "}
                </Link>
                {/* {console.log(favChar.includes(char._id))}; */}
                <button
                  className="fav-cta"
                  onClick={async () => {
                    if (favChar.includes(char._id)) {
                      try {
                        const token = Cookies.get("token");
                        await axios.delete(
                          "http://localhost:3000/favorites-char",
                          {
                            headers: {
                              Authorization: `Bearer ${token}`,
                            },
                            data: { favChar: char._id },
                          }
                        );

                        const newFavChar = favChar.filter((id) => {
                          return id !== char._id;
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

                        newFavChar = [...favChar, char._id];

                        await axios.post(
                          "http://localhost:3000/favorites-char",
                          { favChar: char._id },
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
                  {favChar.includes(char._id) ? (
                    <FaHeart className="heart-filled" />
                  ) : (
                    <FaRegHeart className="heart-empty" />
                  )}
                  {/* {console.log(favChar.includes(char._id))} */}
                </button>
              </div>
            );
          })}
        </div>
        <Pagination
          sx={{
            "& .MuiPaginationItem-root": { color: "white" },
            "& .MuiPaginationItem-page.Mui-selected": {
              backgroundColor: "red !important",
              color: "white !important",
            },
          }}
          color="primary"
          count={Math.ceil(data.count / pageSize)}
          page={page}
          onChange={(event, value) => setPage(value)}
          size="small"
          showFirstButton
          showLastButton
        />
        {/* {console.log(data.results)}; */}
      </section>
    </div>
  );
};

export default Characters;
