import React, { useState } from "react";
import NavBar from "../components/Pins/NavBar";
import Feed from "../components/Pins/Feed";
import PinDetails from "../components/Pins/PinDetails";
import CreatePin from "../components/Pins/CreatePin";
import SearchPin from "../components/Pins/SearchPin";
import { Routes, Route } from "react-router-dom";

const PinsPage = ({ user }) => {
  const [searchTerms, setSearchTerms] = useState("");

  return (
    <div>
      <NavBar
        searchTerms={searchTerms}
        setSearchTerms={setSearchTerms}
        user={user && user}
      />

      <div>
        <Routes>
          <Route path="/" element={<Feed />} />

          <Route path="/category/:categoryId" element={<Feed />} />

          <Route
            path="/pin-detail/:pinId"
            element={<PinDetails user={user && user} />}
          />

          <Route
            path="/create-pin"
            element={<CreatePin user={user && user} />}
          />

          <Route
            path="/search"
            element={<SearchPin searchTerm={searchTerms} />}
          />
        </Routes>
      </div>
    </div>
  );
};

export default PinsPage;
