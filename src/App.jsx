import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Experiences from "./components/Experiences";
import FeaturedRoutes from "./components/FeaturedRoutes";
import Meaningful from "./components/Meaningful";
import Footer from "./components/Footer";
import CoastalTrips from "./components/CoastalTrips";
import ScrollToTop from "./components/ScrollToTop";
import DestinationPage from "./components/DestinationPage";
import TravelJournal from "./components/TravelJournal";
import PlanTrip from "./components/PlanTrip";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Experiences />
      <FeaturedRoutes />
      <Meaningful />
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/coastal-trips" element={<CoastalTrips />} />
        <Route path="/destinations/:slug" element={<DestinationPage />} />
        <Route path="/travel-journal" element={<TravelJournal />} />
        <Route path="/plan-your-trip" element={<PlanTrip />} />
      </Routes>
    </>
  );
}