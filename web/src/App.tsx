import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { SiteLayout } from "./components/Layouts";
import Home from "./pages/Home";
import { Smooth } from "./motion/Smooth";
import { Cursor } from "./motion/Cursor";
import { Preloader } from "./motion/Preloader";
import { PageTransition } from "./motion/PageTransition";

const Services = lazy(() => import("./pages/Services"));
const Plans = lazy(() => import("./pages/Plans"));
const Work = lazy(() => import("./pages/Work"));
const Founder = lazy(() => import("./pages/Founder"));
const Policy = lazy(() => import("./pages/Policy"));
const Contact = lazy(() => import("./pages/Contact"));
const Tools = lazy(() => import("./pages/Tools"));
const NotFound = lazy(() => import("./pages/NotFound"));
const RegionalHub = lazy(() => import("./pages/Regional").then((m) => ({ default: m.RegionalHub })));
const RegionalPage = lazy(() => import("./pages/Regional").then((m) => ({ default: m.RegionalPage })));
const PressIndex = lazy(() => import("./pages/Press").then((m) => ({ default: m.PressIndex })));
const Article = lazy(() => import("./pages/Press").then((m) => ({ default: m.Article })));

const MarketplaceHome = lazy(() => import("./pages/marketplace/MarketplaceHome"));
const CreatorApply = lazy(() => import("./pages/marketplace/CreatorApply"));
const NewCampaign = lazy(() => import("./pages/marketplace/NewCampaign"));
const Picker = lazy(() => import("./pages/marketplace/Picker"));

const Academy = lazy(() => import("./pages/academy/Academy"));
const Course = lazy(() => import("./pages/academy/Course"));

const LinksLanding = lazy(() => import("./pages/links/LinksLanding"));
const Builder = lazy(() => import("./pages/links/Builder"));
const PublicLink = lazy(() => import("./pages/links/PublicLink"));

function Loading() {
  return (
    <div className="wrap section" role="status" aria-live="polite">
      <p className="muted">Loading the page...</p>
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Smooth />
      <Cursor />
      <Preloader />
      <PageTransition />
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<Home />} />
          <Route path="services" element={<Services />} />
          <Route path="plans" element={<Plans />} />
          <Route path="store" element={<Navigate to="/plans" replace />} />
          <Route path="work" element={<Work />} />
          <Route path="founder" element={<Founder />} />
          <Route path="policy" element={<Policy />} />
          <Route path="contact" element={<Contact />} />
          <Route path="tools" element={<Tools />} />
          <Route path="regional" element={<RegionalHub />} />
          <Route path="regional/:slug" element={<RegionalPage />} />
          <Route path="press" element={<PressIndex />} />
          <Route path="press/:slug" element={<Article />} />

          <Route path="marketplace" element={<MarketplaceHome />} />
          <Route path="marketplace/creators/apply" element={<CreatorApply />} />
          <Route path="marketplace/campaigns/new" element={<NewCampaign />} />
          <Route path="marketplace/campaigns/:id/pick" element={<Picker />} />

          <Route path="academy" element={<Academy />} />
          <Route path="academy/:slug" element={<Course />} />

          <Route path="links" element={<LinksLanding />} />
          <Route path="links/builder" element={<Builder />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route path="l/:handle" element={<PublicLink />} />
      </Routes>
    </Suspense>
  );
}
