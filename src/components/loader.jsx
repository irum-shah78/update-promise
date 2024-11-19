const Loader = () => (
  <div className="flex flex-col justify-center items-center h-64">
    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-900"></div>
    <p className="text-center text-[#0E61A4]">
      {" "}
      Making best recommendations for you..
    </p>
  </div>
);
export default Loader;
