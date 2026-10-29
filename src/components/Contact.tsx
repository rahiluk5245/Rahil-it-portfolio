import { MdArrowOutward, MdCopyright } from "react-icons/md";
import "./styles/Contact.css";

const Contact = () => {
  return (
    <div className="contact-section section-container" id="contact">
      <div className="contact-container">
        <h3>Contact</h3>
        <div className="contact-flex">
          <div className="contact-box">
            <h4>Email</h4>
            <p>
              <a href="mailto:chatme@rahiluk.com" target="blank" data-cursor="disable">
                Chatme@rahiluk.com
              </a>
              <br></br>
              <a href="mailto:rahiluk7244@gmail.com" target="blank" data-cursor="disable">
                rahiluk7244@gmail.com
              </a>
              <br></br>
              <h4>Phone</h4>
              <a href="https://wa.me/971558341400" target="blank" data-cursor='disable'>
                +971 55 834 1400
              </a>
            </p>
            <h4>Education</h4>
            <p>Bachelor of Computer Applications</p>
            <p>Practical Hardware Course</p>
            <p>Certified Professional Accountant(CPA) Course</p>


          </div>
          <div className="contact-box">
            <h4>Social</h4>

            <a
              href="https://www.linkedin.com/in/mohammed-rahil-n-r-0b3a10257"
              target="_blank"
              data-cursor="disable"
              className="contact-social"
            >
              Linkedin <MdArrowOutward />
            </a>
            <a
              href="https://x.com/rahil_uk"
              target="_blank"
              data-cursor="disable"
              className="contact-social"
            >
              Twitter <MdArrowOutward />
            </a>
            <a
              href="https://www.instagram.com/rahil_uk?igsh=dDM0NnUxMGZyejVy&utm_source=qr"
              target="_blank"
              data-cursor="disable"
              className="contact-social"
            >
              Instagram <MdArrowOutward />
            </a>
          </div>
          <div className="contact-box">
            <h2>
              Designed and Developed <br /> by <span>Mohammed Rahil N R</span>
            </h2>
            <h5>
              <MdCopyright /> 2026
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
