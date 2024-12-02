import { useQuery } from "@tanstack/react-query";
import { NamedAPIResource } from "../models/pokemon/common/resource";
import { getPokemonById } from "../api/pokemon/pokemonApi";
import { Pokemon, PokemonType } from "../models/pokemon/pokemon";
import { useState } from "react";

interface PokemonCardProps {
  pokemonUrl: NamedAPIResource;
}

const extractIdFromUrl = (url: string): string | null => {
  const match = url.match(/pokemon\/(\d+)\//);
  return match ? match[1] : null;
};

export default function PokemonCard({ pokemonUrl }: PokemonCardProps) {
  const { name, url } = pokemonUrl;
  const [isFront, setIsFront] = useState(true);

  const id = extractIdFromUrl(url);

  const {
    data: pokemon,
    isLoading,
    isError,
    error,
  } = useQuery<Pokemon>({
    queryKey: ["pokemon", id],
    queryFn: () => {
      if (!id) throw new Error("Invalid ID");
      return getPokemonById(id);
    },
    enabled: !!id, // ID가 있을 때만 쿼리 실행
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading Pokémon data.</p>;

  if (!pokemon?.sprites?.other?.showdown?.front_default)
    console.log(pokemon?.name);

  console.log();
  return (
    <div className="mx-auto max-w-sm rounded-lg border border-gray-800 p-4 shadow-lg">
      <h1 className="mb-4 border-b text-2xl font-bold text-gray-800">{`${id}. ${
        pokemon?.name || "Unknown"
      }`}</h1>

      <div
        className="relative flex h-64 w-64 cursor-pointer items-end justify-center border-b"
        onClick={() => setIsFront(!isFront)}
      >
        {pokemon?.sprites?.other?.["official-artwork"]?.front_default && (
          <div
            className="absolute inset-0 z-0 opacity-20"
            style={{
              backgroundImage: `url(${pokemon.sprites.other["official-artwork"].front_default})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>
        )}

        <div
          className={`relative z-10 mb-4 transition-opacity duration-500 ${
            isFront ? "opacity-100" : "opacity-0"
          }`}
        >
          {pokemon?.sprites?.front_default && (
            <img
              src={
                pokemon?.sprites?.other?.showdown?.front_default ||
                pokemon?.sprites?.front_default
              }
              alt={`${pokemon.name} front`}
              className="object-contain"
            />
          )}
        </div>

        <div
          className={`absolute z-10 mb-4 transition-opacity duration-500 ${
            isFront ? "opacity-0" : "opacity-100"
          }`}
        >
          {pokemon?.sprites?.back_default && (
            <img
              src={
                pokemon?.sprites?.other?.showdown?.back_default ||
                pokemon?.sprites?.back_default
              }
              alt={`${pokemon.name} back`}
              className="object-contain"
            />
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {pokemon?.types?.map((pokemonType: PokemonType, idx: number) => (
          <span
            key={idx}
            className={`rounded-md px-2 py-1 text-sm font-medium`}
          >
            {pokemonType.type.name}
          </span>
        ))}
      </div>
    </div>
  );
}
