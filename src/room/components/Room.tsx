import { FC, useEffect, useState } from "react";
import AgoraRTC, {
  UID,
  IAgoraRTCRemoteUser,
  IMicrophoneAudioTrack,
  ICameraVideoTrack,
} from "agora-rtc-sdk-ng";
import { useRouter } from "next/router";

import Chat from "./Chat";

const client = AgoraRTC.createClient({ mode: "rtc", codec: "h264" });

let localTracks: [IMicrophoneAudioTrack, ICameraVideoTrack] | [] = [];

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
  const [joinedUser, setJoinedUser] = useState<IAgoraRTCRemoteUser | null>(
    null
  );
  const [leftUid, setLeftUid] = useState<UID | null>(null);
  const [publishedUserAndMeidaType, setPublishedUserAndMeidaType] = useState<
    [IAgoraRTCRemoteUser, "video" | "audio"] | null
  >(null);
  const [muteAudioUids, setMuteAudioUids] = useState<{
    [uid: string]: boolean;
  }>({});
  const [muteVideoUids, setMuteVideoUids] = useState<{
    [uid: string]: boolean;
  }>({});
  const [enabledAudio, setEnabledAudio] = useState(true);
  const [enabledVideo, setEnabledVideo] = useState(true);

  const {
    query: { roomId },
  } = useRouter();

  useEffect(() => {
    join();
    return leave;
  }, []);

  useEffect(() => {
    if (joinedUser) joined(joinedUser);
  }, [joinedUser]);

  useEffect(() => {
    if (leftUid) left(leftUid);
  }, [leftUid]);

  useEffect(() => {
    if (publishedUserAndMeidaType) subscribe(publishedUserAndMeidaType);
  }, [publishedUserAndMeidaType]);

  useEffect(() => {
    if (localTracks[0]) localTracks[0].setEnabled(enabledAudio);
  }, [enabledAudio]);

  useEffect(() => {
    if (localTracks[1]) localTracks[1].setEnabled(enabledVideo);
  }, [enabledVideo]);

  const join = async () => {
    try {
      if (roomId === "") return;

      client.on("user-joined", handleUserJoined);
      client.on("user-left", handleUserLeft);
      client.on("user-published", handleUserPublished);

      client.on("user-info-updated", (uid, message) => {
        if (message === "mute-audio") {
          const newMuteAudioUids = { ...muteAudioUids };
          newMuteAudioUids[uid] = true;
          setMuteAudioUids(newMuteAudioUids);
        }
        if (message === "unmute-audio") {
          const newMuteAudioUids = { ...muteAudioUids };
          delete newMuteAudioUids[uid];
          setMuteAudioUids(newMuteAudioUids);
        }
        if (message === "mute-video") {
          const newMuteVideoUids = { ...muteVideoUids };
          newMuteVideoUids[uid] = true;
          setMuteVideoUids(newMuteVideoUids);
        }
        if (message === "unmute-video") {
          const newMuteVideoUids = { ...muteVideoUids };
          delete newMuteVideoUids[uid];
          setMuteVideoUids(newMuteVideoUids);
        }
      });

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

  const handleUserJoined = (user: IAgoraRTCRemoteUser) => {
    setJoinedUser(user);
  };

  const handleUserLeft = (user: IAgoraRTCRemoteUser) => {
    setLeftUid(user.uid);
  };

  function handleUserPublished(user, mediaType) {
    setPublishedUserAndMeidaType([user, mediaType]);
  }

  const joined = (user: IAgoraRTCRemoteUser) => {
    setUids((uids) => [...uids, user.uid]);
  };

  const left = (uid: UID) => {
    const index = uids.findIndex((uidItem) => uidItem === uid);
    if (index !== -1) {
      const newUids = [...uids];
      newUids.splice(index, 1);
      setUids(newUids);
    }
    setLeftUid("");
  };

  const subscribe = async ([user, mediaType]: [
    IAgoraRTCRemoteUser,
    "video" | "audio"
  ]) => {
    await client.subscribe(user, mediaType);

    if (mediaType === "video") {
      if (!uids.includes(user.uid)) setUids((uids) => [...uids, user.uid]);
      if (user.videoTrack) user.videoTrack.play(`player-${user.uid}`);
    }

    if (mediaType === "audio") {
      if (user.audioTrack) user.audioTrack.play();
    }

    setPublishedUserAndMeidaType(null);
  };

  const toggleEnabledAudio = () => {
    setEnabledAudio(!enabledAudio);
  };

  const toggleEnabledVideo = () => {
    setEnabledVideo(!enabledVideo);
  };

  return (
    <section className="container">
      <section className="left">
        <div className="local-stream-wrapper">
          <div id="local-player" className="stream local-stream"></div>
          <button className="video-button" onClick={toggleEnabledVideo}>
            {enabledVideo ? "Video Off" : "Video On"}
          </button>
          {!enabledVideo && <span className="video-off">Video Off</span>}
          <button className="audio-button" onClick={toggleEnabledAudio}>
            {enabledAudio ? "Audio Off" : "Audio On"}
          </button>
        </div>
        <Chat />
      </section>
      <section className="right">
        {uids.map((uid) => (
          <div key={uid} className={"steam-wrapper"}>
            <div key={uid} className={"stream"} id={`player-${uid}`} />
            {muteVideoUids[uid] && <span className="video-off">Video Off</span>}
            {muteAudioUids[uid] && <span className="audio-off">Audio Off</span>}
          </div>
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

        .local-stream-wrapper {
          position: relative;
          border: 1px solid #eee;
          border-radius: 8px;
          box-shadow: 0 3px 10px 0 rgba(66, 66, 66, 0.05);
        }

        .local-stream-wrapper > .video-button {
          position: absolute;
          top: 10px;
          right: 10px;
          padding: 4px 10px;
        }

        .local-stream-wrapper > .audio-button {
          position: absolute;
          bottom: 10px;
          right: 10px;
          padding: 4px 10px;
        }

        .local-stream-wrapper > .video-off {
          position: absolute;
          left: 50%;
          top: 50%;
          color: red;
          font-weight: bold;
          transform: translateX(-50%) translateY(-50%);
        }

        .container > section.right {
          flex-grow: 1;
          display: flex;
          flex-wrap: wrap;
          align-content: flex-start;
          margin-left: 0;
        }

        .container > section.right > .steam-wrapper {
          position: relative;
          margin: 0 20px 20px 0;
          border: 1px solid #eee;
          border-radius: 8px;
          box-shadow: 0 3px 10px 0 rgba(66, 66, 66, 0.05);
          background: black;
        }

        .container > section.right > .steam-wrapper > .video-off {
          position: absolute;
          left: 50%;
          top: 50%;
          color: red;
          font-weight: bold;
          transform: translateX(-50%) translateY(-50%);
        }

        .container > section.right > .steam-wrapper > .audio-off {
          position: absolute;
          right: 10px;
          bottom: 10px;
          color: red;
        }

        .stream {
          width: 360px;
          height: 240px;
        }
      `}</style>
      <style jsx global>{`
        .stream > div {
          border-radius: 8px;
        }
      `}</style>
    </section>
  );
};

export default Room;
