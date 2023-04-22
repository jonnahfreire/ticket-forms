import tw from 'tailwind-styled-components';

import { AppHeader } from './components/Header';
import { MainStack } from './components/MainStack';

const Wrapper = tw.div`
  flex
  flex-col
`

function App() {

  return (
    <Wrapper>
      <AppHeader/>
        <MainStack/>
    </Wrapper>
  )
}

export default App
