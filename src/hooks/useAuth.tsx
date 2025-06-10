// hooks/useAuth.ts
import { useEffect, useState } from 'react';

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null); // null = 로딩중
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('https://gamzatech.site/api/v1/users/me/get/profile', {
          credentials: 'include', // httpOnly 쿠키 포함
        });

        console.log('Auth check response:', response);

        if (response.status === 200) {
          const data = await response.json();
          setIsLoggedIn(true);
          setUserProfile(data.data);
        } else {
          setIsLoggedIn(false);
          setUserProfile(null);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        setIsLoggedIn(false);
        setUserProfile(null);
      }
    };

    checkAuthStatus();
  }, []);

  return { isLoggedIn, userProfile };
}