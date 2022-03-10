import { useParams } from "react-router";
import { client } from "../../Client";
import { useState, useEffect } from "react";
import { feedQuery, searchQuery } from "../../utils/data";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";

const Feed = () => {
  const [pins, setPins] = useState();

  const [isLoading, setIsLoading] = useState(false);

  const { categoryId } = useParams();

  const ideaName = categoryId || "new";

  useEffect(() => {
    if (categoryId) {
      setIsLoading(true);

      const query = searchQuery(categoryId);

      client.fetch(query).then((data) => {
        setPins(data);

        setIsLoading(false);
      });
    } else {
      setIsLoading(true);

      client.fetch(feedQuery).then((data) => {
        setPins(data);

        setIsLoading(false);
      });
    }
  }, [categoryId]);

  if (isLoading) {
    return (
      <Spinner message={`We are adding ${ideaName} ideas to your feed!`} />
    );
  }

  if (!pins?.length) {
    return <h2 style={{ textAlign: "center" }}>No pins in this category</h2>;
  }

  return <div>{pins && <MasonryLayout pins={pins} />}</div>;
};

export default Feed;
