import React, { useState } from 'react';
import { Menubar } from 'primereact/menubar';
import { Button } from 'primereact/button';
import { useDispatch } from 'react-redux';
import { removeToken } from '../auth/authSlice';
import { Sidebar } from 'primereact/sidebar';
import Favourites from '../favourites/favourites';

export default function NavBarNew() {
    
       
    const dispatch = useDispatch()
    const [visibleRight, setVisibleRight] = useState(false);

    const userItems = [
        {
            label: <img alt="logo" src="e.png" height="50" className="mr-2"></img>,
            url:'/'

        },
        {
            label: 'מוצרים',
            icon: 'pi pi-search',
            url: '/products'
        },
       
        {
            label: <Button label='מועדפים' style={{color: 'white'}} rounded text severity='info' onClick={()=>setVisibleRight(true)}></Button>,
            icon: 'pi pi-heart',
        },
        {
            label: `שלום ישראל`,
            icon: 'pi pi-user',
            items: [
                {
                    label: 'התחברות',
                    icon: 'pi pi-bolt',
                    url: '/login'
                },                             
                {
                    separator: true
                },
            ]
            

        },
    ];

    return (
        <>
        <Sidebar dir='rtl' visible={visibleRight} style={{width: "25%"}} position="right" onHide={() => setVisibleRight(false)}>
                <h2 style={{textAlign:'center'}}>מועדפים</h2>
               <Favourites/>
            </Sidebar>


        <div className="" style={{border:'5px solid rgb(255, 255, 255)' , position:'fixed' ,width:'98%' ,zIndex:'1000', opacity:'85%',alignItems:'center'}} >
           <Menubar model={userItems}  /> 
        </div></>
    )


}