import "./App.css";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-start mt-16 gap-6">
      <h1 className="text-2xl font-bold">Einkaufsliste</h1>
      <div className="flex justify-center items-center gap-4">
        <Input
          type="text"
          placeholder="Produkt hinzufügen"
          className="max-w-150"
        />
        <Input type="number" placeholder="0" className="max-w-15" />
      </div>
      <Button className="max-w-80">Hinzufügen</Button>
    </div>
  );
}

export default App;
