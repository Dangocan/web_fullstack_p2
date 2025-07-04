import react from "react";
import { CardItem } from "./components";
import { DialogProvider } from "./contexts/DialogContext";

// const API_URL = "https://api.nobelprize.org/2.1";
const API_URL = "http://localhost:3333";

function App() {
  const [nobelArray, setNobelArray] = react.useState([]);
  const [error, setError] = react.useState("");
  const [searchValue, setSearchValue] = react.useState("");
  const [loading, setLoading] = react.useState(false);
  const [showTopButton, setShowTopButton] = react.useState(false);
  const [isLoggedIn, setIsLoggedIn] = react.useState(false);
  const [loginEmail, setLoginEmail] = react.useState("");
  const [loginPassword, setLoginPassword] = react.useState("");
  const [loginError, setLoginError] = react.useState("");
  const [showCreateDialog, setShowCreateDialog] = react.useState(false);
  const [dateAwarded, setDateAwarded] = react.useState("");
  const [categoryEn, setCategoryEn] = react.useState("");
  const [laureates, setLaureates] = react.useState([
    { fullName: { id: "", en: "" }, orgName: { id: "", en: "" } },
  ]);
  const [createError, setCreateError] = react.useState("");

  const itemListRef = react.useRef<HTMLUListElement>(null);
  const loginDialogRef = react.useRef<HTMLDialogElement>(null);
  const createDialogRef = react.useRef<HTMLDialogElement>(null);

  const api = async (url: string) =>
    await fetch(`${API_URL}${url}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwtToken") || ""}`,
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
    if (!localStorage.getItem("jwtToken")) {
      setError("You must be logged in to search.");
      return;
    }
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

  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      setLoginError("Email and password are required.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Login failed");

      // ✅ Salva o token
      localStorage.setItem("jwtToken", data.jwtToken);
      setIsLoggedIn(true);
      setLoginError("");
      setError("");
      loginDialogRef.current?.close();
    } catch (err: any) {
      setLoginError(err.message);
    }
  };

  const handleLogout = () => {
    setError("");
    setNobelArray([]);
    setSearchValue("");
    localStorage.removeItem("jwtToken");
    setIsLoggedIn(false);
  };

  const handleCreateNobel = async () => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      setCreateError("You must be logged in.");
      return;
    }

    try {
      const body = {
        awardYear: Number(dateAwarded?.slice(0, 4)), // extrai ano da data
        dateAwarded,
        category: { en: categoryEn },
        laureates,
      };
      const response = await fetch(`${API_URL}/nobelPrizes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error creating Nobel entry");
      }

      createDialogRef.current?.close();
      // Opcional: você pode forçar um refetch dos dados
      alert("Nobel entry created successfully.");
    } catch (err: any) {
      setCreateError(err.message);
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

  react.useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <DialogProvider>
      <header className="h-[50px] flex justify-between items-center p-4 bg-zinc-900 text-neutral-100 font-semibold">
        <span>Nobel Prize Finder</span>
        {isLoggedIn ? (
          <button
            className="bg-red-600 hover:bg-red-500 px-4 py-1 rounded"
            onClick={handleLogout}
          >
            Logout
          </button>
        ) : (
          <button
            className="bg-zinc-700 hover:bg-zinc-600 px-4 py-1 rounded"
            onClick={() => loginDialogRef.current?.showModal()}
          >
            Login
          </button>
        )}
      </header>
      <main className="bg-zinc-50 grid w-full h-[calc(100vh-50px)] grid-cols-[20rem_1fr] gap-6">
        <div className="border-r-1 border-zinc-400 bg-zinc-100 shadow-lg p-4 flex flex-col">
          <button
            className="mb-4 bg-green-600 text-white rounded px-3 py-1 hover:bg-green-500"
            onClick={() => createDialogRef.current?.showModal()}
          >
            + Add Nobel
          </button>
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

      <dialog
        ref={loginDialogRef}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded shadow-xl w-96 max-w-full p-6 bg-white z-50"
      >
        <form
          method="dialog"
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <h2 className="text-lg font-semibold">Login</h2>
          <input
            type="email"
            placeholder="Email"
            className="border p-2 rounded"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="border p-2 rounded"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
          />
          {loginError && <p className="text-red-500 text-sm">{loginError}</p>}
          <div className="flex justify-end gap-2 mt-2">
            <button
              type="submit"
              className="bg-zinc-900 text-white px-4 py-2 rounded hover:bg-zinc-700"
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => loginDialogRef.current?.close()}
              className="border px-4 py-2 rounded hover:bg-zinc-200"
            >
              Cancelar
            </button>
          </div>
        </form>
      </dialog>

      <dialog
        ref={createDialogRef}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded shadow-xl w-[600px] max-w-full p-6 z-50"
      >
        <form
          method="dialog"
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleCreateNobel();
          }}
        >
          <h2 className="text-lg font-semibold">Add New Nobel</h2>
          <input
            type="date"
            placeholder="Date Awarded"
            className="border p-2 rounded"
            value={dateAwarded}
            onChange={(e) => setDateAwarded(e.target.value)}
          />
          <input
            type="text"
            placeholder="Category (EN)"
            className="border p-2 rounded"
            value={categoryEn}
            onChange={(e) => setCategoryEn(e.target.value)}
          />

          <h3 className="font-semibold mt-2">Laureates</h3>
          {laureates.map((laureate, index) => (
            <div
              key={index}
              className="grid grid-cols-2 gap-2 border p-2 rounded"
            >
              <input
                type="text"
                placeholder="Full Name ID"
                className="border p-1 rounded"
                value={laureate.fullName.id}
                onChange={(e) => {
                  const updated = [...laureates];
                  updated[index].fullName.id = e.target.value;
                  setLaureates(updated);
                }}
              />
              <input
                type="text"
                placeholder="Full Name (EN)"
                className="border p-1 rounded"
                value={laureate.fullName.en}
                onChange={(e) => {
                  const updated = [...laureates];
                  updated[index].fullName.en = e.target.value;
                  setLaureates(updated);
                }}
              />
              <input
                type="text"
                placeholder="Org Name ID"
                className="border p-1 rounded"
                value={laureate.orgName.id}
                onChange={(e) => {
                  const updated = [...laureates];
                  updated[index].orgName.id = e.target.value;
                  setLaureates(updated);
                }}
              />
              <input
                type="text"
                placeholder="Org Name (EN)"
                className="border p-1 rounded"
                value={laureate.orgName.en}
                onChange={(e) => {
                  const updated = [...laureates];
                  updated[index].orgName.en = e.target.value;
                  setLaureates(updated);
                }}
              />
            </div>
          ))}

          <button
            type="button"
            className="text-blue-600 hover:underline self-start"
            onClick={() =>
              setLaureates([
                ...laureates,
                { fullName: { id: "", en: "" }, orgName: { id: "", en: "" } },
              ])
            }
          >
            + Add Laureate
          </button>

          {createError && <p className="text-red-500">{createError}</p>}

          <div className="flex justify-end gap-2">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500"
            >
              Create
            </button>
            <button
              type="button"
              className="border px-4 py-2 rounded hover:bg-zinc-200"
              onClick={() => createDialogRef.current?.close()}
            >
              Cancel
            </button>
          </div>
        </form>
      </dialog>
    </DialogProvider>
  );
}

export default App;
