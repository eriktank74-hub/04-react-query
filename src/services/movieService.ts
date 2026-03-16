import axios from "axios";
import type {Movie} from '../types/movie'

interface FetchMoviesResult {
  movies: Movie[],
  totalPages: number
}

export const fetchMovies = async (query: string, page: number): Promise<FetchMoviesResult> => {
  const response = await axios.get<{results: Movie[], total_pages: number}>(
    `https://api.themoviedb.org/3/search/movie?query=${query}&page=${page}`,
    {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`},
    },
  );

  return {
    movies: response.data.results as Movie[],
    totalPages: response.data.total_pages as number
  }
};
