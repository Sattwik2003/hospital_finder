import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotificationProvider from "./components/NotificationProvider";

import Home from "./pages/Home";
import Results from "./pages/Results";
import HospitalDetails from "./pages/HospitalDetails";
import AISearch from "./pages/AISearch";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  // debug: notification provider active
  // eslint-disable-next-line no-console
  console.log("NotificationProvider: active");

  return (
    <BrowserRouter>
      <NotificationProvider>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/results" element={<Results />} />
            <Route path="/hospital/:id" element={<HospitalDetails />} />
            <Route path="/ai-search" element={<AISearch />} />
          </Routes>
        </ErrorBoundary>
      </NotificationProvider>
    </BrowserRouter>
  );
}

export default App;