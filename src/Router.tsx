import { Routes, Route } from "react-router-dom"

// Pages
import { Home } from "./pages/Home"
import { History } from "./pages/History"
import { DefaultLayout } from "./layouts/DefaultLayout"

export default function Router() {
    return (
        <Routes>
            <Route path="/" element={<DefaultLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/history" element={<History />} />
            </Route>


        </Routes>
    )
};
