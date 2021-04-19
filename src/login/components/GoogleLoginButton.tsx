import { useRouter } from "next/router";
import { FC } from "react";
import { firebaseApp, provider } from "../../common/utils/firebase";

const GoogleLoginButton: FC = () => {
  const router = useRouter();

  const login = () => {
    firebaseApp
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        const { displayName, uid } = result.user;
        window.localStorage.setItem(
          "user",
          JSON.stringify({ name: displayName, uid })
        );
        router.push("/");
      });
  };
  return (
    <>
      <button onClick={login}>Sign in with Google</button>
      <style jsx>{`
        button {
          padding: 8px 10px;
        }
      `}</style>
    </>
  );
};

export default GoogleLoginButton;
