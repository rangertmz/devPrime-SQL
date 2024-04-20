import React, { useState } from "react";
import ContentHeader from "./ContentHeader";
import "../styles/content.css";

const Content = () => {
  const [Consult, setConsult] = useState("");

  return (
    <div className='content'>
      <ContentHeader data={Consult} />
      <div className='form-consult'>
        <form action='' className='form'>
          <textarea
            className='input-form'
            autoComplete='off'
            id='consult'
            value={Consult}
            onChange={(v) => setConsult(v.target.value)}
          />
        </form>
      </div>
    </div>
  );
};

export default Content;
