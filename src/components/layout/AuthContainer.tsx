import Logo from "components/ui/Logo";
import { ReactNode } from "react";

const AuthContainer = ({ children }: { children: ReactNode }) => (
  <div className="bg-green-500 bg-opacity-50 w-screen h-screen flex">
    <div className="md:w-1/2 w-full bg-white md:rounded-r-[50px] pt-10 px-10">
      <Logo />

      {children}
    </div>
    <header className="w-1/2 pt-10 hidden md:block">
      <nav>
        <ul className="flex gap-20 items-center justify-center font-medium text-lg text-black text-opacity-80">
          <li>
            <a href="/">About Us</a>
          </li>
          <li>
            <a href="/">Contact Us</a>
          </li>
        </ul>
      </nav>
      <img
        alt="auth background"
        className="mt-20"
        src="https://www.workex.jobs/blog/wp-content/uploads/2019/11/Here%E2%80%99s-a-Quick-Guide-to-Applying-for-Jobs-wecompress.com_-scaled.png"
      />
    </header>
  </div>
);

export default AuthContainer;
