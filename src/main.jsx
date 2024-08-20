import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PagesRouter from "./routes/PagesRouter";
import ErrorPage from "./routes/ErrorPage";

const App = () => {
    return (
        <div className="app">
            <div className="content">
                <Routes>
                    <Route path="*" element={<PagesRouter />} errorElement={<ErrorPage />} />
                </Routes>
            </div>
        </div>
    );
};

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <App />
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>
);
