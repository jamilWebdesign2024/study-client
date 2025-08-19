import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";
import { Link } from "react-router";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-base-200 text-base-content pt-12 pb-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">

          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold flex items-center">
              <span className="badge badge-primary mr-2">Study</span>
              <span>Sphere</span>
            </h3>
            <p className="text-base-content/70">
              Empowering students and tutors to connect and learn in a seamless digital environment.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-primary transition-colors">
                <FaFacebook className="text-xl" />
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                <FaTwitter className="text-xl" />
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                <FaInstagram className="text-xl" />
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                <FaLinkedin className="text-xl" />
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                <FaYoutube className="text-xl" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/tutors" className="hover:text-primary transition-colors">
                  Find Tutors
                </Link>
              </li>
              <li>
                <Link to="/all-study-sessions" className="hover:text-primary transition-colors">
                  Study Sessions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MdLocationOn className="text-primary text-xl mt-1 flex-shrink-0" />
                <p className="text-base-content/70">
                  Firozshah Housing Estate, Akborshah, Chattogram
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <MdEmail className="text-primary text-xl" />
                <a href="mailto:info@studysphere.com" className="hover:text-primary transition-colors">
                  jamil@studysphere.com
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <MdPhone className="text-primary text-xl" />
                <a href="tel:+1234567890" className="hover:text-primary transition-colors">
                  +1 (234) 567-890
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div className="border-t border-accent/10 pt-6 text-center text-base-content/70">
          <p>
            &copy; {currentYear} StudySphere. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
