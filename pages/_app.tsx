import dynamic from "next/dynamic";

const Header = dynamic(() => import("../src/common/components/Header"), {
  ssr: false,
});

const App = ({ Component }) => {
  return (
    <>
      <Header />
      <Component />
      <style jsx global>{`
        html,
        body,
        body > div {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
          height: 100%;
          background-color: #fafafa;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </>
  );
};

export default App;
