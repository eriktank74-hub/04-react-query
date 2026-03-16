import css from "./App.module.css";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Loader from "../Loader/Loader";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";
import SearchBar from "../SearchBar/SearchBar";
import toast, { Toaster } from "react-hot-toast";
import { fetchMovies } from "../../services/movieService";
import { useEffect, useState } from "react";
import type { Movie } from "../../types/movie";
import ReactPaginate from "react-paginate";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

function App() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { isPending, isError, data, } = useQuery({
    queryKey: ["movies", currentPage, query ], 
    queryFn: () => fetchMovies(query, currentPage),
    enabled: !!query,
    placeholderData: keepPreviousData
  });

  const totalPages = data?.total_pages || 1;
  const movies = data?.results;

  useEffect(() => {
    if (!movies?.length) {
      toast("No movies found for your request.");
    }
  }, [movies]);

  const onSelect = (movie: Movie) => {
    setSelectedMovie(movie);
  };
  const onClose = () => {
    setSelectedMovie(null);
  };

  return (
    <div className={css.app}>
      <SearchBar onSubmit={setQuery} />
      {totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages || 1}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setCurrentPage(selected + 1)}
          forcePage={currentPage - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
      <Toaster />
      {isPending ? (
        <Loader />
      ) : isError ? (
        <ErrorMessage />
      ) : movies?.length ? (
        <MovieGrid onSelect={onSelect} movies={movies} />
      ) : null}
      {selectedMovie && <MovieModal movie={selectedMovie} onClose={onClose} />}
    </div>
  );
}

export default App;
