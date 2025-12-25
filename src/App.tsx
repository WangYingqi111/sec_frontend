import ScreenerPage from './components/ScreenerPage'; // 确保路径指向你存放该文件的位置
import 'antd/dist/reset.css'; // 导入 Ant Design 的样式，否则界面会乱

function App() {
  return (
    <div className="App">
      <ScreenerPage />
    </div>
  )
}

export default App