import { User } from "src/app/shared/interfaces/auth/user.interface";

export type UserState = {
  currentUser: User | null;
};

/** General App initial State */
export const initialUserState: UserState = {
  currentUser: null,
};
