import { Outlet } from "react-router-dom";
import { AppHeader } from "./components/Header";
import tw from "tailwind-styled-components";


const Wrapper = tw.div`
  flex
  flex-col
  w-screen h-screen
`;

function App() {
  return (
    <Wrapper>
      <AppHeader />
      <Outlet />
    </Wrapper>
  );
}

export default App
