import Form from "./components/Form"
import './App.css';
import Header from "./components/Header"

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Header />
      </header>
      <div className="form-section">
        <Form />

      </div>
      <div className="footer">

      </div>
    </div>
  );
}

export default App;
