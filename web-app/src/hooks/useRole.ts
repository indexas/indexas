import { useMemo } from 'react';
import { AuthStatus, useAuth } from 'components/site/context/AuthContext';
import { useApp } from 'components/site/context/AppContext';

export enum UserRole {
  VIEWER = "viewer",
  CREATOR = "creator",
  OWNER = "owner",
}

export const useRole = () => {
  const { status } = useAuth();
  const { viewedIndex } = useApp();

  const role = useMemo(() => {
    if (status === AuthStatus.IDLE || status === AuthStatus.LOADING) {
      return UserRole.VIEWER;
    }

    // console.log('role viewedIndex', viewedIndex);

    if (!viewedIndex) {
      return UserRole.VIEWER;
    }

    if (viewedIndex.roles?.owner) {
      return UserRole.OWNER;
    }

    if (viewedIndex.roles?.creator) {
      return UserRole.CREATOR;
    }

    return UserRole.VIEWER;
  }, [viewedIndex, status]);

  return {
    role,
    isOwner: role === UserRole.OWNER,
    isCreator: role === UserRole.OWNER || role === UserRole.CREATOR,
  }
};
