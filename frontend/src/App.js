import ThemeProvider from "src/theme";
import Router from "src/routers";
function App() {
  return (
    <ThemeProvider>
      <Router />
    </ThemeProvider>
  );
}

export default App;
