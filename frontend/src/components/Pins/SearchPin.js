import React, { useEffect, useState } from "react";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";
import { client } from "../../Client";
import { feedQuery, searchQuery } from "../../utils/data";

const SearchPin = ({ searchTerm }) => {
  const [pins, setPins] = useState();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchTerm !== "") {
      setLoading(true);

      const query = searchQuery(searchTerm.toLowerCase());

      client.fetch(query).then((data) => {
        setPins(data);

        setLoading(false);
      });
    } else {
      setLoading(true);

      client.fetch(feedQuery).then((data) => {
        setPins(data);

        setLoading(false);
      });
    }
  }, [searchTerm]);

  return (
    <div>
      {loading && <Spinner message="Searching pins" />}

      {pins?.length > 0 && <MasonryLayout pins={pins} />}

      {pins?.length === 0 && searchTerm !== "" && !loading && (
        <h2 style={{ textAlign: "center" }}>No pins found</h2>
      )}
    </div>
  );
};

export default SearchPin;
