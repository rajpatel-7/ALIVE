import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Navbar from "./components/Navbar";
import Loader from "./components/Loader";

// Lazy load pages
const Home = lazy(() => import("./pages/Home"));
const Predict = lazy(() => import("./pages/Predict"));
const Result = lazy(() => import("./pages/Result"));
const Insights = lazy(() => import("./pages/Insights"));
const History = lazy(() => import("./pages/History"));
const About = lazy(() => import("./pages/About"));

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/predict" element={<Predict />} />
        <Route path="/result" element={<Result />} />
        <Route path="/history" element={<History />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/about/:section?" element={<About />} />
      </Routes>
    </AnimatePresence>
  );
}

import Background3D from "./components/Background3D";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen relative text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 font-sans">
        <Background3D />
        <div className="relative z-10">
          <Navbar />
          <Suspense fallback={<Loader />}>
            <div className="pt-20 pb-12">
              <AnimatedRoutes />
            </div>
          </Suspense>
        </div>
      </div>
    </Router>
  );
}