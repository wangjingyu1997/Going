import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import { Todo } from "../type/todos";
import { createTodo, deleteTodo, updateTodo } from "./api";
export function useCreateTodo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Todo) => createTodo(data),
    onMutate: () => {
      console.log("onMutate");
    },
    onError: () => {
      console.log("onError");
    },
    onSuccess: () => {
      console.log("onSuccess");
    },
    onSettled: (_, error) => {
      console.log("onSettled");
      if (error) {
        console.log(error);
      } else {
        queryClient.invalidateQueries({
          queryKey: ["todos"],
        });
      }
    },
  });
}
export function useUpdateTodo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Todo) => updateTodo(data),
    onSettled: async (_, error, variables) => {
      if (error) {
        console.log(error);
      } else {
        await queryClient.invalidateQueries({
          queryKey: ["todos"],
        });
        await queryClient.invalidateQueries({
          queryKey: ["todo", { id: variables.id }],
        });
      }
    },
  });
}
export function useDeleteTodo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteTodo(id),
    onSettled: async (_, error) => {
      if (error) {
        console.log(error);
      } else {
        await queryClient.invalidateQueries({
          queryKey: ["todos"],
        });
      }
    },
  });
}

