import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { db } from "../utils/firebase";

const Header = () => {
  const router = useRouter();
  console.log("router.pathname", router.pathname);
  return (
    <header>
      <h1>VideoChat</h1>
      <section className="right">
        {router.pathname === "/" && <AddNewRoom />}
        {router.pathname === "/room/[roomId]" && <Leave />}
      </section>
      <style jsx>{`
        header {
          height: 70px;
          display: flex;
          align-items: center;
          padding: 0 40px;
        }
        header > h1 {
          margin: 0;
        }
        .right {
          margin-left: auto;
        }
      `}</style>
    </header>
  );
};

const AddNewRoom = () => {
  const [roomTitle, setRoomTitle] = useState<string>("");
  const router = useRouter();

  const addRoom = () => {
    const user = JSON.parse(window.localStorage.getItem("user"));
    const id = Date.now();

    db.collection("room")
      .add({
        id: id,
        title: roomTitle,
        uname: user.name,
        uid: user.uid,
        createdAt: id,
      })
      .then(() => {
        setRoomTitle("");
        router.push(`/room/${id}`);
      });
  };

  return (
    <>
      <input
        type="text"
        onChange={(e) => setRoomTitle(e.target.value)}
        placeholder="방 이름을 입력해주세요"
      />
      <input type="submit" value="방 만들기" onClick={addRoom} />
      <style jsx>{`
        input {
          padding: 8px;
          margin-left: 10px;
        }
      `}</style>
    </>
  );
};

const Leave = () => {
  return (
    <>
      <Link href="/">
        <input type="button" value="나가기" />
      </Link>
      <style jsx>{`
        input {
          padding: 8px;
          margin-left: 10px;
        }
      `}</style>
    </>
  );
};

export default Header;
