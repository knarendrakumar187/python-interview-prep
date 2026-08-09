import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Plan from "./pages/Plan.jsx";
import Questions from "./pages/Questions.jsx";
import QuestionDetail from "./pages/QuestionDetail.jsx";
import Concepts from "./pages/Concepts.jsx";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/plan" element={<Plan />} />
        <Route path="/questions" element={<Questions />} />
        <Route path="/questions/:id" element={<QuestionDetail />} />
        <Route path="/concepts" element={<Concepts />} />
      </Routes>
    </Layout>
  );
}
