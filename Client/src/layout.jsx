import React, { useState } from "react";
import Navbar from "./navbar";
import { Outlet } from "react-router-dom";

function Layout() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [totalHours, setTotalHours] = useState(0);

  return (
    <div className="app-wrapper">
      <Navbar
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        totalHours={totalHours}
      />
      <main>
        {/* context předáme všem vnořeným stránkám */}
        <Outlet context={{ selectedDate, setTotalHours, setSelectedDate }} />
      </main>
    </div>
  );
}

export default Layout;
