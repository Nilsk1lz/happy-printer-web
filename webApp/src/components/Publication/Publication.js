import React from "react";

export default function Publication({ publication }) {
  return (
    <>
      <h2 className="mt-5">{publication.name}</h2>
      <div>{publication.cron_description}</div>
      <div className="mt-3">{publication.description}</div>
    </>
  );
}
