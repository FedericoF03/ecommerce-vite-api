import { useLocation } from "react-router-dom";
import { redirect } from "../utils/redirect";
import { useEffect } from "react";

export const Authentication = () => {
  const query = useLocation().search;

  useEffect(() => {
    const url = new URLSearchParams(query);
    if (url.get("code")) redirect(query);
  }, [query]);
  
  return (
    <>
      <button onClick={() => redirect()}>test red</button>
    </>
  );
};
