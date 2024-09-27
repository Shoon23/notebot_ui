import { useMutationState } from "@tanstack/react-query";
import { iUserSession } from "../types/auth";

const useUserSession = (): iUserSession => {
  const user = useMutationState({
    filters: { mutationKey: ["user"] },
    select: (mutation) => mutation.state.data,
  });

  return user[0] as iUserSession;
};
export default useUserSession;
