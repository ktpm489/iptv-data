import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import db from "../config/dexie";

const useLiveFavorListData = () => {
  const [favorData, setFavorData] = useState([]);

  useLiveQuery(() => {
    db.favorLists.toArray((data) => {
      setFavorData(data);
    });
  }, []);
  return favorData;
};

export default useLiveFavorListData;
