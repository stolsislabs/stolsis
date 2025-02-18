import background from "/assets/loading.png";
import logo from "/assets/loading-logo.png";

export const GameLoading = () => {
  return (
    <div className="relative h-dscreen overflow-clip">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center animate-[pulse_30s_ease-in-out_infinite]"
        style={{ backgroundImage: `url('${background}')` }}
      />

      {/* Loader */}
      <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50">
        {/* Logo */}
        <div className="absolute top-1/4 left-0 flex justify-center items-center w-full h-20">
          <img src={logo} alt="banner" className="h-12 md:h-40" />
        </div>

        <p className="text-white text-center z-10 mt-4 sm:mt-12 text-stroke">
          Loading...
        </p>
      </div>
    </div>
  );
};
