import './App.scss'
// import Product from './components/Products'
// import ProJects from './components/Projects'
// import Todo from './components/Todo'
// import Homie from './components/Homie'
// import Form from './components/Form'
import { KeepAlive, keepAliveTransfer } from './keep-alive'
import { BrowserRouter, Link, Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Hellow from './pages/Hellow'
// const AliveHomeView = keepAliveTransfer(Homie, 'homie')
// const AliveFormView = keepAliveTransfer(Form, 'form')

function App() {
  return (
    <>
      <KeepAlive>
        <BrowserRouter>
          <div>

            {/* <li>
                <Link to={'/'}>Homie</Link> &&&&&&  <Link to={'./components/Form'}>Form</Link>
              </li> */}
            {/* <Hellow></Hellow> */}
          </div>
          <div>
            {/* <Routes>
              <Route path='/' element={<AliveHomeView></AliveHomeView>} />
              <Route path='/components/Form' element={<AliveFormView></AliveFormView>} />
            </Routes> */}
          </div>
          {/* <Todo></Todo> */}
          {/* <Product></Product> */}
          {/* <ProJects></ProJects> */}
        </BrowserRouter>
      </KeepAlive>
    </>
  )
}

export default App
