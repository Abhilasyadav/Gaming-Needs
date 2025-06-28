import Navbar from './Navbar';
import './style/Contact.css';

const Contact = () => {
  return (
    <>
    <Navbar />
    <div className="contact-container">
      <h1 className="contact-title">Contact Developer</h1>
      <p className="contact-subtitle">Have questions, suggestions, or want to collaborate? Feel free to reach out!</p>

      <div className="contact-info">
        <div className="contact-item">
          <h3>Email</h3>
          <a href="mailto:yadavabhilash2003@gmail.com">yadavabhilash2003@gmail.com</a>
        </div>

        <div className="contact-item">
          <h3>Phone</h3>
          <a href="tel:+917347845062">+91 73478 45062</a>
        </div>

        <div className="contact-item">
          <h3>Portfolio</h3>
          <a href="https://abhilashyadavportfolio.netlify.app/" target="_blank" rel="noopener noreferrer">
            abhilashyadavportfolio.netlify.app
          </a>
        </div>
      </div>
    </div>
    </>
  );
};

export default Contact;
