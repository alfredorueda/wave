import React from "react";

function JumboText({
  priText = "Welcome to WaveApp.",
  secText = false,
  isNegative = false,
  cols = "6",
}) {
  return (
    <div className={`col col-12 col-md-${cols} p-0 fnt-jumbo`}>
      <p className={isNegative ? "fnt-light mb-0" : "fnt-primary mb-0"}>
        {priText}
      </p>
      {secText && <p className="fnt-secondary mb-0">{secText}</p>}
    </div>
  );
}

export default JumboText;