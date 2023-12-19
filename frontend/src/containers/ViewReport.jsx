import React, { useState, useEffect } from "react";
import ViewReportCard from "./ViewReportCard";
import { useParams, useNavigate } from "react-router-dom";

const ViewReport = (isAuthenticated) => {
  const navigate = useNavigate();
  const { consumer_id } = useParams();
  const [report, setReport] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const userToken = localStorage.getItem("access");
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/get-report/${consumer_id}/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `JWT ${userToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch report data");
        }

        const data = await response.json();
        console.log(data);
        setReport(data.report);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchReport();
  }, [consumer_id]);

  if (!isAuthenticated) {
    navigate("/");
  }

  return (
    <div>
      <div className='mt-4'>
      <h1 style={h1color} className='display-4 text-center'>FIELD REPORT</h1>
      </div>
      {error && <p>Error: {error}</p>}
        <div>
          {report.map((raidDetail, index) => (
            <ViewReportCard key={index} raid_detail={raidDetail} />
          ))}
        </div>
    </div>
  );
};

const h1color = {
    color: '#116A7B'
  };

export default ViewReport;
