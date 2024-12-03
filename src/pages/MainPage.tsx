import { useInfiniteQuery } from "@tanstack/react-query";
import { getPokemonListBy } from "../api/pokemon/pokemonApi";
import { NamedAPIResourceList } from "../models/pokemon/common/resource";

import { getSearchParamsValue } from "../utils/url";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import PokemonList from "../components/PokemonList";

export default function MainPage() {
  const limit = 10;
  const {
    data,
    error,
    isError,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<NamedAPIResourceList>({
    queryKey: ["pokemonList"],
    queryFn: ({ pageParam = 0 }) =>
      getPokemonListBy(pageParam as number, limit),
    initialPageParam: 0,
    getNextPageParam: (lastPage: NamedAPIResourceList) => {
      return Number(getSearchParamsValue(lastPage.next, "offset")) || undefined;
    },
  }); // https://tanstack.com/query/latest/docs/framework/react/guides/infinite-queries

  const { ref, inView } = useInView({
    threshold: 1,
    triggerOnce: false,
  });
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView]);

  if (isLoading) return <div>Loading...</div>;
  if (isError)
    return (
      <div>
        Error: {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );

  const pokemonList = data?.pages.flatMap(page => page.results) || [];
  return (
    <div>
      <h1>Pokemon List</h1>

      <PokemonList pokemonList={pokemonList} />

      <div
        ref={ref}
        className="flex h-20 w-20 items-center justify-center bg-gray-300"
      ></div>
    </div>
  );
}
