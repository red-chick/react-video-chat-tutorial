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
    <section className="container">
      <GoogleLoginButton />
      <style jsx>{`
        .container {
          height: calc(100% - 70px);
          display: flex;
          justify-content: center;
          align-items: center;
        }
      `}</style>
    </section>
  );
};

export default login;
