import { useState, useEffect } from "react";
import axios from "axios";

interface UserProfile {
  id: number;
  username: string;
  email: string;
  gender: string;
  birthYear: string;
  avatar: string;
  sportLevel: number;
}

const useAuth = (): [boolean, UserProfile | null] => {
  const [auth, setAuth] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios
      .get("http://localhost:8081/auth/verify")
      .then((res) => {
        if (res.data.status === "Success") {
          setAuth(true);
          axios
            .get("http://localhost:8081/user/profile")
            .then((profileRes) => {
              setUserProfile(profileRes.data.user);
            })
            .catch((profileErr) => {
              console.log(profileErr);
            });
        } else {
          setAuth(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return [auth, userProfile];
};

export default useAuth;
