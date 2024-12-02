import { useInfiniteQuery } from "@tanstack/react-query";
import { getPokemonListBy } from "../api/pokemon/pokemonApi";
import {
  NamedAPIResource,
  NamedAPIResourceList,
} from "../models/pokemon/common/resource";
import useIntersectionObserver from "../hooks/useIntersectionObserver";

const getSearchParamsValue = (url: string | null, key: string) => {
  if (!url) return null;

  const searchParams = new URL(url).searchParams;
  return searchParams.get(key);
};

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

  const [fetchTrigger] = useIntersectionObserver<HTMLDivElement>(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage(); // 다음 페이지 로드
    }
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError)
    return (
      <div>
        Error: {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );

  return (
    <div>
      <h1>Pokemon List</h1>
      <ul>
        {data?.pages.map(page =>
          page.results.map((pokemon: NamedAPIResource, index: number) => (
            <li key={index}>{pokemon.name}</li>
          ))
        )}
      </ul>

      <div
        ref={fetchTrigger}
        className="flex h-20 w-20 items-center justify-center bg-gray-300"
      ></div>
    </div>
  );
}
