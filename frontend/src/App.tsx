import react from "react";
import { CardItem } from "./components";
import { DialogProvider } from "./contexts/DialogContext";

function App() {
  const [nobelArray, setNobelArray] = react.useState([]);
  const [error, setError] = react.useState("");
  const [searchValue, setSearchValue] = react.useState("");
  const [loading, setLoading] = react.useState(false);
  const [showTopButton, setShowTopButton] = react.useState(false);

  const itemListRef = react.useRef<HTMLUListElement>(null);

  const api = async (url: string) =>
    await fetch(`https://api.nobelprize.org/2.1${url}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        return data;
      })
      .catch((error) => {
        console.error("Erro:", error);
        return error;
      });

  const handleApiCall = async (param: string) => {
    setLoading(true);
    return await api(`/nobelPrizes?nobelPrizeYear=${+param}`)
      .then(({ nobelPrizes }) => {
        setLoading(false);
        return nobelPrizes;
      })
      .catch((error) => {
        console.error("Erro:", error);
        return error;
      });
  };

  const handleSubmit = async () => {
    if (Number.isNaN(Number(searchValue)) || searchValue.length !== 4) {
      setError(
        "The value must be a valid year number greater than 1901 in YYYY format."
      );
    } else {
      setNobelArray([]);
      setError("");

      const nobelArray = await handleApiCall(searchValue || "");
      setNobelArray(nobelArray);
    }
  };

  const scrollToTop = () => {
    if (itemListRef.current) {
      itemListRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  // Efeito para monitorar o scroll
  react.useEffect(() => {
    const listElement = itemListRef.current;

    const handleScroll = () => {
      console.log({ aaa: listElement?.scrollTop });
      if (listElement?.scrollTop && listElement?.scrollTop > 30) {
        setShowTopButton(true);
      } else {
        setShowTopButton(false);
      }
    };

    if (listElement) {
      listElement.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (listElement) {
        listElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  react.useEffect(() => {
    if (nobelArray.length > 0) {
      console.log({ nobelArray });
    }
  }, [nobelArray]);

  return (
    <DialogProvider>
      <header className="h-[50px] flex justify-center items-center p-4 bg-zinc-900 text-neutral-100 font-semibold">
        Nobel Prize Finder
      </header>
      <main className="bg-zinc-50 grid w-full h-[calc(100vh-50px)] grid-cols-[20rem_1fr] gap-6">
        <div className="border-r-1 border-zinc-400 bg-zinc-100 shadow-lg p-4 flex flex-col">
          <div className="flex items-center gap-2">
            <div className="flex flex-col">
              <label htmlFor="nobelSerchField" className="mr-2 mb-2">
                Search year:
              </label>
              <div className="flex flex-nowrap items-center">
                <input
                  id="nobelSerchTextArea"
                  type="search"
                  name="nobelSerchField"
                  placeholder="Insira o Ano AAAA"
                  className="border p-1 rounded"
                  onChange={(e) => setSearchValue(e.target.value)}
                />
                <button
                  id="submitSearch"
                  type="submit"
                  className="ml-2 px-2 py-1 border rounded cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSubmit();
                  }}
                >
                  &#128269;
                </button>
              </div>
            </div>
          </div>
          {error && (
            <p id="error" className="pt-2 text-red-500">
              {error}
            </p>
          )}
          <p id="info" className="pt-4">
            The database only accepts years from 1901 onwards
          </p>
        </div>
        <ul
          id="nobelList"
          className="border-l-1 border-zinc-400 bg-zinc-100 flex flex-col flex-nowrap p-4 max-h-[calc(100vh-50px)] overflow-auto"
          ref={itemListRef}
        >
          {nobelArray.length > 0 &&
            nobelArray.map((item, index) => (
              <>
                <CardItem key={index} item={item} />
              </>
            ))}
          {loading && (
            <div className="flex items-center justify-center w-full h-full">
              <p>Loading...</p>
            </div>
          )}
          {nobelArray.length === 0 && !loading && (
            <div className="flex items-center justify-center w-full h-full">
              <p>No data to display</p>
            </div>
          )}
          {showTopButton && (
            <button
              className="absolute bottom-4 right-4 rounded font-semibold border-1 bg-zinc-900 text-neutral-100 p-2"
              onClick={scrollToTop}
            >
              TOP
            </button>
          )}
        </ul>
      </main>
      <footer className="flex justify-center items-center p-4 bg-zinc-900 text-neutral-100 font-semibold">
        Made by Dangocan
      </footer>
    </DialogProvider>
  );
}

export default App;
