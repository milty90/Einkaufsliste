import "./App.css";
import { IconArrowBack, IconCheck } from "@tabler/icons-react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { useEffect, useState } from "react";
import { Trash } from "lucide-react";
import { ButtonGroup } from "./components/ui/button-group";
import { toast } from "sonner";

type ListItem = { item: string; piece: number; isDone: boolean };
const STORAGE_KEY = "list";

function App() {
  const [list, setList] = useState<ListItem[]>([]);
  const [item, setItem] = useState<string>("");
  const [piece, setPiece] = useState<number>(1);
  const [isDisabled, setIsDisabled] = useState(true);

  function showToast(color: "success" | "warning" | "info", message: string) {
    toast(message, {
      position: "top-center",
      style: {
        color:
          color === "success"
            ? "green"
            : color === "warning"
              ? "orange"
              : "black",
      },
    });
  }

  function isInputValid() {
    if (item === "") {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }

  function isDuplicate(item: string) {
    if (list.some((el) => el.item === item)) {
      showToast("warning", `Produkt ${item} existiert bereits.`);
      return true;
    } else {
      showToast("success", `Produkt ${item} wurde hinzugefügt.`);
      return false;
    }
  }

  function addToList() {
    if (item && piece > 0) {
      if (isDuplicate(item)) return;

      setList([{ item, piece, isDone: false }, ...list]);
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify([{ item, piece, isDone: false }, ...list]),
      );

      setItem("");
      setPiece(1);
      setIsDisabled(true);
    }
  }

  function filterArray(name: string, list: ListItem[]) {
    return list.filter((listItem) => listItem.item !== name);
  }

  function removeFromList(name: string) {
    const updatedList = filterArray(name, list);
    setList(updatedList);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
  }

  useEffect(() => {
    const storedList = localStorage.getItem(STORAGE_KEY);
    if (storedList) {
      setList(JSON.parse(storedList));
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start mt-12 gap-6">
      <h1 className="text-3xl font-bold mb-4">Einkaufsliste</h1>
      <div className="flex justify-between items-center w-md ">
        <Input
          type="text"
          placeholder="Produkt hinzufügen"
          className="w-90 text-sm"
          value={item}
          onChange={(e) => {
            setItem(e.target.value);
            isInputValid();
          }}
        />
        <Input
          type="number"
          min={1}
          placeholder="0"
          className="w-20 text-lg"
          value={piece}
          onChange={(e) => {
            setPiece(Number(e.target.value));
          }}
        />
      </div>
      <Button
        onClick={addToList}
        className="w-md mb-3 disabled:bg-gray-500"
        disabled={isDisabled}
      >
        Eintrag Hinzufügen
      </Button>
      {list.map((entry, item) => (
        <div
          key={item}
          className="flex w-md justify-between items-center mt-1 p-6 border rounded-2xl border-gray-300 shadow-lg"
        >
          <div className="flex flex-col items-start">
            <p
              className={`text-lg font-semibold ${entry.isDone ? "line-through text-gray-500" : ""}`}
            >
              {entry.item}
            </p>
            <p className="text-sm text-gray-500">Anzahl: {entry.piece}</p>
          </div>

          <Button
            className={entry.isDone ? "hidden" : "inline-flex w-33 h-9"}
            variant="outline"
            size="sm"
            onClick={() => {
              setList([
                ...filterArray(entry.item, list),
                { ...entry, isDone: true },
              ]);
            }}
          >
            <IconCheck /> Abhaken
          </Button>
          <ButtonGroup
            className={`justify-center items-center gap-1 ${entry.isDone ? "inline-flex" : "hidden"}`}
          >
            <Button
              onClick={() => {
                removeFromList(entry.item);
                showToast(
                  "info",
                  `Produkt ${entry.item} wurde erfolgreich gelöscht.`,
                );
              }}
              className="flex bg-red-400 text-white items-center gap-1 hover:bg-red-500"
            >
              <Trash />
            </Button>

            <Button
              onClick={() => {
                const updatedItem = { ...entry, isDone: false };
                setList([updatedItem, ...filterArray(entry.item, list)]);
              }}
              className="flex bg-gray-200 text-black items-center gap-1 hover:bg-gray-300"
            >
              <IconArrowBack /> Zurück
            </Button>
          </ButtonGroup>
        </div>
      ))}
    </div>
  );
}

export default App;
