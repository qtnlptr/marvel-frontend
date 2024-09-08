import { useState, useEffect } from "react";
import axios from "axios";
import Pagination from "@mui/material/Pagination";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import Cookies from "js-cookie";

const Comics = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState();
  const [page, setPage] = useState(1);
  const [title, setTitle] = useState("");
  const [favComics, setIsFavComics] = useState([]);

  const pageSize = 60;

  useEffect(() => {
    const fetchData = async () => {
      try {
        let skip = 0;
        if (page !== 1) {
          skip = (page - 1) * 20;
        }

        let url = `http://localhost:3000/comics?skip=${skip}`;
        if (title) {
          url += `&title=${title}`;
        }

        const response = await axios.get(url);
        setData(response.data);
        setIsLoading(false);

        const token = Cookies.get("token");

        const favResponse = await axios.get(
          "http://localhost:3000/favorites-comics",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setIsFavComics(favResponse.data);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchData();
  }, [page, title]);

  console.log(data);
  return isLoading ? (
    <div className="loading">
      <p>Loading ...</p>
    </div>
  ) : (
    <div className="container-all">
      <section className="comics-page">
        <div className="hero-comics">
          <h2>Marvel comics</h2>
          <p>Dive into the Marvel Universe!</p>
        </div>
        <div className="comics-list-top">
          <h1>Featured Comics</h1>
          <div className="search-box">
            <input
              className="search"
              type="search"
              value={title}
              placeholder="Search a comic"
              onChange={(event) => {
                setTitle(event.target.value);
              }}
            />

            <span
              onClick={() => {
                setTitle("");
              }}
              className={title === "" && "invisible"}
            >
              Cancel
            </span>
            {/* {console.log("title---->", title)} */}
          </div>
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
          className="pagination-comics"
        />
        <div className="comics-container">
          <div className="comics-list">
            {data.results.map((comic) => {
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
                    onClick={
                      favComics.includes(comic._id)
                        ? async () => {
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

                              const newFavComics = favComics.filter((id) => {
                                return id !== comic._id;
                              });
                              // console.log(newFavChar);
                              setIsFavComics(newFavComics);
                            } catch (error) {
                              console.log(error);
                            }
                          }
                        : async () => {
                            try {
                              const token = Cookies.get("token");
                              let newFavComics;

                              newFavComics = [...favComics, comic._id];

                              await axios.post(
                                "http://localhost:3000/favorites-comics",
                                { favComics: comic._id },
                                {
                                  headers: {
                                    Authorization: `Bearer ${token}`,
                                  },
                                }
                              );
                              setIsFavComics(newFavComics);
                            } catch (error) {
                              console.log(error);
                            }
                          }
                    }
                  >
                    {favComics.includes(comic._id) ? (
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
          className="pagination-comics"
        />
      </section>
    </div>
  );
};

export default Comics;
