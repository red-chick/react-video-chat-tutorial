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
            <li key={room.id}>
              <Link href={`/room/${room.id}`}>
                <h1>{room.title}</h1>
              </Link>
            </li>
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
          padding: 20px;
          margin: 0;
        }
        li:hover {
          box-shadow: none;
          cursor: pointer;
        }
      `}</style>
    </>
  );
};

export default Rooms;
