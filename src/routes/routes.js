import React from 'react'
import { BrowserRouter, Routes as ReactRoutes, Route } from "react-router-dom";
import Enrollment from '../pages/Enrollment';
import FaceLogin from '../pages/FaceLogin';

const Routes = () => {
    return (
        <BrowserRouter>
            <ReactRoutes>
                <Route path="/" element={<FaceLogin />} />
                <Route path="/enrollment" element={<Enrollment />} />
                <Route
                    path="*"
                    element={<FaceLogin />}
                />
            </ReactRoutes>
        </BrowserRouter>
    )
}

export default Routes