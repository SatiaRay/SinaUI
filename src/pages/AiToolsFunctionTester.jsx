
import React, { useState } from "react";
import { aiToolsEndpoints } from "../services/ai_tools_function";

const AiToolsFunctionTester = () => {
  // State for submitRequest
  const [submitData, setSubmitData] = useState({
    mobile: "",
    address: "",
    lat: "",
    long: "",
    subject_id: "",
  });
  const [submitResult, setSubmitResult] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  // State for neshanSearch
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);

  const handleSubmitChange = (e) => {
    const { name, value } = e.target;
    setSubmitData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitResult(null);
    try {
      const res = await aiToolsEndpoints.submitRequest({
        ...submitData,
        subject_id: Number(submitData.subject_id),
      });
      setSubmitResult(res);
    } catch (err) {
      setSubmitResult(err?.toString() || err);
    }
    setSubmitLoading(false);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchLoading(true);
    setSearchResult(null);
    try {
      const res = await aiToolsEndpoints.neshanSearch({ term: searchTerm });
      setSearchResult(res);
    } catch (err) {
      setSearchResult(err?.toString() || err);
    }
    setSearchLoading(false);
  };

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h2>Test submitRequest (137 شهرداری)</h2>
      <form onSubmit={handleSubmitRequest} style={{ marginBottom: 24 }}>
        <input
          name="mobile"
          placeholder="Mobile"
          value={submitData.mobile}
          onChange={handleSubmitChange}
          style={{ display: "block", marginBottom: 8, width: "100%" }}
        />
        <input
          name="address"
          placeholder="Address"
          value={submitData.address}
          onChange={handleSubmitChange}
          style={{ display: "block", marginBottom: 8, width: "100%" }}
        />
        <input
          name="lat"
          placeholder="Latitude"
          value={submitData.lat}
          onChange={handleSubmitChange}
          style={{ display: "block", marginBottom: 8, width: "100%" }}
        />
        <input
          name="long"
          placeholder="Longitude"
          value={submitData.long}
          onChange={handleSubmitChange}
          style={{ display: "block", marginBottom: 8, width: "100%" }}
        />
        <input
          name="subject_id"
          placeholder="Subject ID (number)"
          value={submitData.subject_id}
          onChange={handleSubmitChange}
          style={{ display: "block", marginBottom: 8, width: "100%" }}
        />
        <button type="submit" disabled={submitLoading}>
          {submitLoading ? "Submitting..." : "Submit Request"}
        </button>
      </form>
      {submitResult && (
        <div style={{ background: "#f6f8fa", padding: 12, borderRadius: 4, marginBottom: 24 }}>
          <strong>Result:</strong>
          <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-all" }}>{JSON.stringify(submitResult, null, 2)}</pre>
        </div>
      )}

      <h2>Test neshanSearch (جستجوی نشان)</h2>
      <form onSubmit={handleSearch} style={{ marginBottom: 24 }}>
        <input
          name="searchTerm"
          placeholder="Search term"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ display: "block", marginBottom: 8, width: "100%" }}
        />
        <button type="submit" disabled={searchLoading}>
          {searchLoading ? "Searching..." : "Search"}
        </button>
      </form>
      {searchResult && (
        <div style={{ background: "#f6f8fa", padding: 12, borderRadius: 4 }}>
          <strong>Result:</strong>
          <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-all" }}>{JSON.stringify(searchResult, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default AiToolsFunctionTester;