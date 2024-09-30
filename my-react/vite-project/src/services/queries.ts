import {
  QueryClient,
  keepPreviousData,
  useInfiniteQuery,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { getProducts, getProduct, getProjects, getTodo, getTodoSIds } from "./api";
import { Product } from "../type/products";

export function useTodoIds() {
  return useQuery({
    queryKey: ["todos"],
    queryFn: getTodoSIds,
  });
}
export function useTodos(ids: (number | undefined)[] | undefined) {
  return useQueries({
    queries: (ids ?? []).map(id => {
      return {
        queryKey: ["todo", { id }],
        queryFn: () => getTodo(id!),
      };
    }),
  });
}

export function useProjects(page: number) {
  return useQuery({
    queryKey: ["projects", { page }],
    queryFn: () => getProjects(page),
    placeholderData: keepPreviousData,
  });
}

export function useProducts() {
  return useInfiniteQuery({
    queryKey: ["products"],
    queryFn: getProducts,
    initialPageParam: 0,
    getNextPageParam: (lastPage, _, lastParam) => {
      if (lastPage.length === 0) {
        return undefined;
      } else {
        return lastParam + 1;
      }
    },
    getPreviousPageParam: (_, __, fisrtParams) => {
      if (fisrtParams <= 1) {
        return undefined;
      } else {
        return fisrtParams - 1;
      }
    },
  });
}
export function useProduct(id: number | null) {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ["products", { id }],
    queryFn: () => getProduct(id!),
    enabled: !!id,
    placeholderData: () => {
      const cacheProducts = (
        queryClient.getQueryData(["products"]) as {
          pages: Product[] | undefined;
        }
      )?.pages?.flat(2);
      if (cacheProducts) {
        return cacheProducts.find(product => product.id === id);
      }
    },
  });
}
