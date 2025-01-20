import './App.css';
// import MainApp from './MainApp';
import Chatbot from './components/ChatBot/Chatbot';
function App() {
  return (
    <div className="App">
      <h1 style={{ textAlign: 'center' }}>ChatGPT Chatbot</h1>
      <Chatbot />
        {/* <MainApp/> */}
    </div>
  );
}

export default App;
