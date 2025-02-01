import './App.css';
import MainApp from './MainApp';
import MicrosoftStudioBot from './components/ChatBot/MicrosoftStudioBot';
import MainBot from './components/DeepSeek/MainBot';
function App() {
  return (
    <div className="App">
      {/* <h1 style={{ textAlign: 'center' }}>ChatGPT Chatbot</h1> */}
      <MicrosoftStudioBot />
        <MainApp/>
        <MainBot/>
    </div>
  );
}

export default App;
