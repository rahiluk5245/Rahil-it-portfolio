import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>IT Support Engineer</h4>
                <h5>Dr.Nutrition Headquarters</h5>
              </div>
              <h3>NOW</h3>
            </div>
            <p>Experience in troubleshooting hardware and software, supporting end-users, and maintaining reliable systems and networks.
              I also work with Microsoft Dynamics NAV and Business Central,
              helping ensure smooth business operations and resolving technical issues efficiently.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Artificial Intelligence and Machine Learning (Internship)</h4>
                <h5>Airobosoft Products & Services LLP</h5>
              </div>
              <h3>2024</h3>
            </div>
            <p>
              Completed an internship in Artificial Intelligence and Machine Learning, working on data analysis, model training,
              and implementing machine learning algorithms to solve real-world problems.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Accountant</h4>
                <h5>Manesh Associates Accountant & Tax Practitioners</h5>
              </div>
              <h3>2020</h3>
            </div>
            <p>Managed daily accounting operations including accounts payable, receivable, and bank reconciliations;
              handled GST and tax filings, payroll processing, and financial records while ensuring compliance and supporting audits and tax planning.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
