import { FC, useEffect, useState } from "react";
import { db } from "../../common/utils/firebase";
import Link from "next/link";

const Rooms: FC = () => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const chatRef = db.collection("room");

    chatRef.orderBy("createdAt").onSnapshot((snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setRooms(data);
    });
  }, []);

  return (
    <>
      <section className="container">
        <ul>
          {rooms.map((room) => (
            <Link href={`/room/${room.id}`}>
              <li>
                <h1>{room.title}</h1>
              </li>
            </Link>
          ))}
        </ul>
      </section>
      <style jsx>{`
        ul {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        li {
          display: block;
          padding: 20px;
          background: white;
          margin: 20px;
          border: 1px solid #eee;
          border-radius: 8px;
          box-shadow: 0 3px 10px 0 rgba(66, 66, 66, 0.05);
          transition: 0.4s;
        }
        li:first-child {
          margin-top: 0;
        }
        h1 {
          margin: 0;
        }
        li:hover {
          box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.1);
          cursor: pointer;
        }
      `}</style>
    </>
  );
};

export default Rooms;
