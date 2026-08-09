import { Routes, Route, useLocation } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Plan from "./pages/Plan.jsx";
import Questions from "./pages/Questions.jsx";
import QuestionDetail from "./pages/QuestionDetail.jsx";
import Concepts from "./pages/Concepts.jsx";
import CoreSubjects from "./pages/CoreSubjects.jsx";
import CoreSubject from "./pages/CoreSubject.jsx";
import CoreConcept from "./pages/CoreConcept.jsx";
import CoreRevision from "./pages/CoreRevision.jsx";
import Account from "./pages/Account.jsx";

export default function App() {
  const location = useLocation();
  return (
    <Layout>
      <ErrorBoundary resetKey={location.pathname + location.hash}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/plan" element={<Plan />} />
          <Route path="/questions" element={<Questions />} />
          <Route path="/questions/:id" element={<QuestionDetail />} />
          <Route path="/concepts" element={<Concepts />} />
          <Route path="/core" element={<CoreSubjects />} />
          <Route path="/core/:subjectId" element={<CoreSubject />} />
          <Route path="/core/:subjectId/revision" element={<CoreRevision />} />
          <Route path="/core/:subjectId/:conceptId" element={<CoreConcept />} />
          <Route path="/account" element={<Account />} />
        </Routes>
      </ErrorBoundary>
    </Layout>
  );
}
