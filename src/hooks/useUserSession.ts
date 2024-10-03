import {
  useMutationState,
  QueryClient,
  QueryCache,
  useQueryClient,
} from "@tanstack/react-query";
import { iUserSession } from "../types/auth";
import { queryClient } from "../App";
const useUserSession = (): iUserSession => {
  const queryClient = useQueryClient();

  const user = queryClient.getQueryData(["user"]);

  return user as unknown as iUserSession;
  // const queryCache = new QueryCache();
  // const query = queryCache.find({ queryKey: ["user"] });
  // console.log(query);
  // return query as unknown as iUserSession;
};
export default useUserSession;
