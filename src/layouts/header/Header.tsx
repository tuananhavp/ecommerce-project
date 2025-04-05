import Countdown from "./Countdown";
import HeaderOption from "./HeaderOption";
import HeaderAction from "./HeaderAction";
import Navigation from "./Navigation";

const Header = () => {
  return (
    <header>
      <Countdown />
      <HeaderOption />
      <HeaderAction />
      <Navigation />
    </header>
  );
};

export default Header;
