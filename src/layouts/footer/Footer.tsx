import FooterBot from "./FooterBot";
import FooterMid from "./FooterMid";
import FooterTop from "./FooterTop";

const Footer = () => {
  return (
    <footer className="flex items-center justify-center px-3 py-12 bg-[#F3F4F6]">
      <div className="w-9/12">
        <FooterTop />
        <FooterMid />
        <FooterBot />
      </div>
    </footer>
  );
};

export default Footer;
