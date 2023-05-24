import Form from "./components/Form"
import './App.css';
import Header from "./components/Header"
import Footer from "./components/Footer";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Header />
      </header>

      <div className="form">
        <h1>DSCO Intake Form</h1>
        <Form />
      </div>

      <div className="footer">
        <Footer />
      </div>
    </div>
  );
}

export default App;
