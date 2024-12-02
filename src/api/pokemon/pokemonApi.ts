import axios, { AxiosInstance } from "axios";
import { NamedAPIResourceList } from "../../models/pokemon/common/resource";

const baseUrl = import.meta.env.VITE_POKEMON_API_URL;

const apiRequester: AxiosInstance = axios.create({
  baseURL: baseUrl,
  timeout: 5000, // 5 seconds
});

export const getPokemonListBy = async (
  offset: number,
  limit: number = 10
): Promise<NamedAPIResourceList> => {
  const result = await apiRequester.get(
    `/pokemon?limit=${limit}&offset=${offset}`
  );
  return result.data;
};
