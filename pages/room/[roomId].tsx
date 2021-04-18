import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { FC, useEffect } from "react";

// agora-rtc-sdk-ng 모듈이 server-side 에서 로드되면 안 됨
const Room = dynamic(() => import("../../src/room/components/Room"), {
  ssr: false,
});

const RoomPage: FC = () => {
  const router = useRouter();

  useEffect(() => {
    const user = window.localStorage.getItem("user");
    if (!user) router.push("/login");
  }, []);

  return <Room />;
};

export default RoomPage;
