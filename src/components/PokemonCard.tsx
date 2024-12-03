import { useQuery } from "@tanstack/react-query";
import { NamedAPIResource } from "../models/pokemon/common/resource";
import { getPokemonById } from "../api/pokemon/pokemonApi";
import {
  Pokemon,
  PokemonSprites,
  PokemonType,
} from "../models/pokemon/pokemon";
import { useState } from "react";
import cn from "classnames";
import { BsFillPatchQuestionFill } from "react-icons/bs";

interface PokemonCardProps {
  pokemonUrl: NamedAPIResource;
}

const extractIdFromUrl = (url: string): string | null => {
  const match = url.match(/pokemon\/(\d+)\//);
  return match ? match[1] : null;
};

export default function PokemonCard({ pokemonUrl }: PokemonCardProps) {
  const { name, url } = pokemonUrl;

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

  const officialArtworkUrl =
    pokemon?.sprites?.other?.["official-artwork"]?.front_default;

  const sprites: PokemonSprites | undefined = pokemon?.sprites;
  return (
    <div className="relative flex flex-col gap-2 rounded-lg border border-gray-800 p-2 shadow-lg">
      {officialArtworkUrl && <BackGroundImage url={officialArtworkUrl} />}

      {sprites && (
        <PokemonAnimatedCard pokemonName={name} pokemonSprites={sprites} />
      )}

      <h1 className="text-xl font-bold text-gray-800">{`${id}. ${
        pokemon?.name || "Unknown"
      }`}</h1>

      <PokemonTypePlatter types={pokemon?.types || []} />
    </div>
  );
}

const PokemonAnimatedCard = ({
  pokemonName,
  pokemonSprites,
}: {
  pokemonName: string;
  pokemonSprites: PokemonSprites;
}) => {
  const [isFront, setIsFront] = useState(true);

  const frontImage = null;
  // pokemonSprites.other?.showdown?.front_default ||
  // pokemonSprites.front_default;
  const backImage =
    pokemonSprites.other?.showdown?.back_default || pokemonSprites.back_default;

  return (
    <button
      className="flex h-48 items-end justify-center border-b md:h-64"
      onClick={() => setIsFront(!isFront)}
    >
      {frontImage ? (
        <PokemonImage
          className="relative z-10 mb-4"
          show={isFront}
          url={frontImage}
          alt={`${pokemonName} front`}
        />
      ) : (
        <BsFillPatchQuestionFill />
      )}
      {backImage ? (
        <PokemonImage
          className="absolute z-10 mb-4"
          show={!isFront}
          url={backImage}
          alt={`${pokemonName} back`}
        />
      ) : (
        <BsFillPatchQuestionFill />
      )}
    </button>
  );
};

const PokemonImage = ({
  className,
  show,
  url,
  alt,
}: {
  className?: string;
  show: boolean;
  url: string;
  alt: string;
}) => {
  return (
    <div
      className={cn(
        `cursor-pointer transition-opacity duration-500`,
        { "opacity-100": show },
        { "opacity-0": !show },
        className
      )}
    >
      <img src={url} alt={alt} className="object-contain" />
    </div>
  );
};

const BackGroundImage = ({ url }: { url: string }) => {
  return (
    <div
      className="absolute inset-0 z-0 opacity-20"
      style={{
        backgroundImage: `url(${url})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    ></div>
  );
};

const PokemonTypePlatter = ({ types }: { types: PokemonType[] }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {types.map((pokemonType: PokemonType, idx: number) => (
        <span
          key={idx}
          className={`rounded-md border-2 px-2 py-1 text-sm font-medium`}
        >
          {pokemonType.type.name}
        </span>
      ))}
    </div>
  );
};
