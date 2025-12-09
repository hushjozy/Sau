import { removeItem } from "@lib/storage";
import { QueryCache, QueryClient } from "@tanstack/query-core";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
  queryCache: new QueryCache({
    onError: (error: any, query) => {
      console.error("error", error);
      let errorMsg = query?.meta?.errorMessage as string;
      if (errorMsg) {
        //toast.error(errorMsg);
      }
      if (error?.statusCode === 401 || error?.message === "Unauthorized") {
        // removeItem("accessToken");
        // removeItem("refreshToken");
        // removeItem("user");
      }
    },
  }),
});