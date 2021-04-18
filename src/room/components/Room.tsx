import { FC, useEffect, useState } from "react";
import AgoraRTC, {
  ILocalTrack,
  UID,
  IAgoraRTCRemoteUser,
} from "agora-rtc-sdk-ng";
import { useRouter } from "next/router";

import { db, firebaseApp } from "../../common/utils/firebase";
import Chat from "./Chat";

const client = AgoraRTC.createClient({ mode: "rtc", codec: "h264" });
let localTracks: ILocalTrack[] = [];

export const options: {
  appId: string | undefined;
  token?: string;
  uid?: UID;
} = {
  appId: process.env.NEXT_PUBLIC_AGORA_APP_ID,
  token: undefined,
  uid: undefined,
};

const Room: FC = () => {
  const [uids, setUids] = useState<UID[]>([]);

  const {
    query: { roomId },
  } = useRouter();

  useEffect(() => {
    join();
    return leave;
  }, []);

  const join = async () => {
    try {
      if (roomId === "") return;

      client.on("user-published", subscribe);
      client.on("user-unpublished", unsubscribe);

      if (!options.appId) return;

      options.uid = await client.join(
        options.appId,
        roomId as string,
        options.token || null
      );

      localTracks[0] = await AgoraRTC.createMicrophoneAudioTrack();
      localTracks[1] = await AgoraRTC.createCameraVideoTrack();
      localTracks[1].play("local-player");

      await client.publish(localTracks);
    } catch (err) {
      console.error(err);
    }
  };

  const leave = () => {
    localTracks.forEach((track) => {
      track.stop();
      track.close();
    });

    localTracks = [];

    client.leave();
  };

  const subscribe = async (
    user: IAgoraRTCRemoteUser,
    mediaType: "video" | "audio"
  ) => {
    await client.subscribe(user, mediaType);

    if (mediaType === "video" && !uids.includes(user.uid)) {
      setUids((uids) => [...uids, user.uid]);
      if (user.videoTrack) user.videoTrack.play(`player-${user.uid}`);
    }

    if (mediaType === "audio") {
      if (user.audioTrack) user.audioTrack.play();
    }
  };

  const unsubscribe = (user: IAgoraRTCRemoteUser) => {
    const index = uids.findIndex((uid) => uid === user.uid);
    if (index !== -1) setUids([...uids].slice(index, 1));
  };

  return (
    <section className="container">
      <section className="left">
        <div id="local-player" className="stream local-stream"></div>
        <Chat />
      </section>
      <section className="right">
        {uids.map((uid) => (
          <div className={"stream"} id={`player-${uid}`} />
        ))}
      </section>
      <style jsx>{`
        .container {
          display: flex;
          height: calc(100% - 70px);
        }

        .container > section {
          margin: 0 20px 20px;
        }

        .container > section.right {
          flex-grow: 1;
          display: flex;
          flex-wrap: wrap;
          align-content: flex-start;
          margin-left: 0;
        }

        .container > section.right > div {
          margin: 0 20px 20px 0;
        }

        .stream {
          width: 360px;
          height: 240px;
        }
      `}</style>
      <style jsx global>{`
        .stream > div {
          border: 1px solid #eee;
          border-radius: 8px;
          box-shadow: 0 3px 10px 0 rgba(66, 66, 66, 0.05);
        }
      `}</style>
    </section>
  );
};

export default Room;
