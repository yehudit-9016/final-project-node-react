import './App.css';
import NavBar from './Components/NavBar';
import "primereact/resources/themes/arya-blue/theme.css"
import "primereact/resources/primereact.min.css"
import "primeicons/primeicons.css"
import "primeflex/primeflex.css"
import { Route, Routes } from 'react-router-dom';
import Massages from './massage/massages';
import Home from './Components/home';
import Register from './auth/register';
import Login from './auth/login';
import Products from './products/products';
import Favourites from './favourites/favourites';
import Update from './auth/update';
import { useSelector } from 'react-redux';
import AdminProducts from './products/adminProducts';
import AdminUsers from './auth/adminUsers';
import AdminMassages from './massage/adminMassage';
import Product from './products/product';
import NavBarNew from './Components/NavBarNew';


function App() {
  const {isUserLoggedIn} = useSelector((state)=>state.auth);
  return (
    <>

   {isUserLoggedIn&&<NavBar/> }
   {!isUserLoggedIn&&<NavBarNew/>}
   <Routes>
   <Route path = '/' element = {<Home/>}/>
   {isUserLoggedIn && <Route path = '/massages' element = {<Massages/>}/>}
    <Route path = '/register' element = {<Register/>}/>
    <Route path = '/login' element = {<Login/>}/>
    <Route path = '/products' element = {<Products/>}/>
    <Route path = '/product/:id' element = {<Product/>}/>
   
    <Route path = '/adminUsers' element = {<AdminUsers/>}/>
    <Route path = '/adminProducts' element = {<AdminProducts/>}/>
    <Route path = '/adminMassages/:id' element = {<AdminMassages/>}/>

    {isUserLoggedIn && <Route path = '/favourites' element = {<Favourites/>}/>}
    {isUserLoggedIn && <Route path = '/update' element = {<Update/>}/>}
    {!isUserLoggedIn && <Route path = '/update' element = {<Login massage={true}/>}/>}
    {!isUserLoggedIn && <Route path = '/massages' element = {<Login massage={true}/>}/>}
    {!isUserLoggedIn && <Route path = '/favourites' element = {<Login massage={true}/>}/>}

   </Routes>
    </>

  );
}

export default App;