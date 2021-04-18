import dynamic from "next/dynamic";
import Head from "next/head";
import { useRouter } from "next/router";
import { FC, useEffect } from "react";

// firebase 모듈이 server-side 에서 로드되면 안 됨
const Rooms = dynamic(() => import("../src/home/components/Rooms"), {
  ssr: false,
});

const Home: FC = () => {
  const router = useRouter();

  useEffect(() => {
    const user = window.localStorage.getItem("user");
    if (!user) router.push("/login");
  }, []);

  return (
    <section className="container">
      <Head>
        <title>Video Chat Tutorial</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Rooms />
      <style jsx>{`
        .container {
          min-height: calc(100% - 70px);
        }
      `}</style>
    </section>
  );
};

export default Home;
