import axios, { AxiosInstance } from "axios";
import { NamedAPIResourceList } from "../../models/pokemon/common/resource";
import { Pokemon, PokemonSpecies } from "../../models/pokemon/pokemon";

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

export const getPokemonListByType = async (typeId: string | undefined) => {
  return await axios.get(`/type/${typeId}`).then(res => res.data);
};

export const getPokemonById = async (id: string): Promise<Pokemon> => {
  const result = await apiRequester.get(`/pokemon/${id}`);
  return result.data;
};

export const getPokemonSpeciesById = async (
  id: string
): Promise<PokemonSpecies> => {
  return await apiRequester.get(`/pokemon-species/${id}`).then(res => res.data);
};
