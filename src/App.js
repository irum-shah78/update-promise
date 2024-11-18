import ComplaintPage from "./pages/ComplaintPage";

function App() {
  return (
    <>
      <div className="font-sans">
        <header>
          <img
            src="https://dealers.updatepromise.com/hs-fs/hubfs/UpdatePromise_Primary_Logo.png?width=1848&height=362&name=UpdatePromise_Primary_Logo.png"
            alt="logo"
            className="w-52 h-12 mx-auto mt-10"
          />
        </header>
        <ComplaintPage />
      </div>
    </>
  );
}

export default App;
