import axios from "axios";
import type {Movie} from '../types/movie'

interface FetchMoviesResult {
  results: Movie[], 
  total_pages: number

}

export const fetchMovies = async (query: string, page: number): Promise<FetchMoviesResult> => {
  const response = await axios.get<FetchMoviesResult>(
    `https://api.themoviedb.org/3/search/movie?query=${query}&page=${page}`,
    {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`},
    },
  );

  return response.data;
  
};
