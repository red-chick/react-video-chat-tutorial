import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import { db } from "../../common/utils/firebase";

const dateFormat = (createdAt) => {
  const date = new Date(createdAt);
  return `${date.getHours()}:${date.getMinutes()}`;
};

type Props = {
  isOpen: boolean;
  toggle: Function;
};

const Chat: FC<Props> = ({ isOpen, toggle }) => {
  const [chats, setChats] = useState([]);
  const [message, setMessage] = useState("");

  const {
    query: { roomId },
  } = useRouter();

  useEffect(() => {
    const chatRef = db.collection("chat");

    chatRef
      .where("roomId", "==", roomId)
      .orderBy("createdAt")
      .onSnapshot((snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setChats(data);
      });
  }, []);

  const addDocument = () => {
    const { uid, name: uname } = JSON.parse(
      window.localStorage.getItem("user")
    );

    const createdAt = Date.now();

    db.collection("chat").add({ message, roomId, uid, uname, createdAt });

    setMessage("");
  };

  return (
    <section className={`chat ${isOpen ? "open" : ""}`}>
      <section className="messages">
        <ul>
          {chats.map((chat) => {
            return (
              <li>
                <section>
                  <strong>{chat.uname}</strong> {chat.message}
                </section>
                <section className="date">{dateFormat(chat.createdAt)}</section>
              </li>
            );
          })}
        </ul>
      </section>
      <section className="input-wrapper">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyUp={(e) => {
            if (e.key === "Enter") addDocument();
          }}
          placeholder="메시지를 입력해주세요"
        />
        <button onClick={addDocument}>전송</button>
      </section>
      <style jsx>{`
        .chat {
          width: 360px;
          height: calc(100% - 260px);
          padding: 20px;
          border: 1px solid #eee;
          border-radius: 8px;
          box-shadow: 0 3px 10px 0 rgba(66, 66, 66, 0.05);
          background: white;
          margin-top: 20px;
          display: flex;
          flex-direction: column;
        }

        .messages {
          flex: 1;
          margin-bottom: 20px;
          overflow: auto;
        }

        .messages > ul {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .messages > ul > li {
          display: flex;
          padding-top: 10px;
        }

        .messages > ul > li:first-child {
          padding-top: 0;
        }

        .messages > ul > li > section > strong {
          margin-right: 4px;
        }

        .messages > ul > li > .date {
          color: #bdbdbd;
          margin-left: auto;
        }

        .input-wrapper {
          display: flex;
          padding: 10px;
          border-radius: 6px;
          background-color: #fafafa;
        }

        .input-wrapper > input {
          flex: 1;
          border: none;
          background-color: #fafafa;
          outline: none;
        }

        .input-wrapper > button {
          padding: 4px 20px;
        }

        @media screen and (max-width: 786px) {
          .chat {
            position: fixed;
            top: 100vh;
            left: 0;
            margin: 0;
            width: 100vw;
            height: calc(100vh - 140px - 56px);
            z-index: 1;
            transition: all 0.4s;
          }

          .chat.open {
            top: calc(140px + constant(safe-area-inset-bottom));
            top: calc(140px + env(safe-area-inset-bottom));
          }
        }
      `}</style>
    </section>
  );
};

export default Chat;
