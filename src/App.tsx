import tw from 'tailwind-styled-components';

import { AppHeader } from './components/Header';
import { MainStack } from './components/MainStack';
import { TasksProvider } from './contexts/TaskContext';

const Wrapper = tw.div`
  flex
  flex-col
`

function App() {

  return (
    <Wrapper>
      <AppHeader/>
      {/* <TasksProvider> */}
        <MainStack/>
      {/* </TasksProvider> */}
    </Wrapper>
  )
}

export default App
