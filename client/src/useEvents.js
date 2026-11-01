import { useEffect, useState } from "react";
import { api } from "./api.js";

// Loads the event list (with live slot counts) from the server
export default function useEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const reload = () =>
    api("/events")
      .then(setEvents)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));

  useEffect(() => {
    reload();
  }, []);

  return { events, loading, error, reload };
}
