import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect } from "react";

// firebase 모듈이 server-side 에서 로드되면 안 됨
const GoogleLoginButton = dynamic(
  () => import("../src/login/components/GoogleLoginButton"),
  {
    ssr: false,
  }
);

const login = () => {
  const router = useRouter();

  useEffect(() => {
    const user = window.localStorage.getItem("user");
    if (user) router.push("/");
  }, []);

  return (
    <>
      <GoogleLoginButton />
    </>
  );
};

export default login;
