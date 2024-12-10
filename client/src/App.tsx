import useRouteElements from './hooks/useRouterElements'

function App() {
  const routeElements = useRouteElements()
  return <>{routeElements}</>
}

export default App
