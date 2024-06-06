import React, { useEffect, useState } from 'react';
import { Menubar } from 'primereact/menubar';
import { Badge } from 'primereact/badge';
import { Link} from 'react-router-dom';
import { Button } from 'primereact/button';
import useAuth from '../hooks/useAuth';
import { useDispatch } from 'react-redux';
import { removeToken } from '../auth/authSlice';
import { Sidebar } from 'primereact/sidebar';
import Favourites from '../favourites/favourites';
import {useGetMassagesQuery} from "../massage/massageApiSlice"


export default function NavBar() {
    const [count, setCount] = useState(0);
    const {name, isAdmin} = useAuth()
    const { data: massages, isLoading, isSuccess, isError, error, refetch } = useGetMassagesQuery()
    let mone = 0;
    useEffect(()=>{
        if(isSuccess){
            massages.forEach(m=> m.massageStatus == 1? mone++: <></>)
            setCount(mone)
        }

    })    
    const dispatch = useDispatch()
    const [visibleRight, setVisibleRight] = useState(false);
    const itemRenderer = (item) => (
        <a className="flex align-items-center p-menuitem-link">
            <span className={item.icon} />
            <span className="mx-2">{item.label}</span>
            {item.badge  && <Badge className="ml-auto" value={item.badge} style={{backgroundColor: 'rgb(255,217,255)'}}/>}
            {item.shortcut && <span className="ml-auto border-1 surface-border border-round surface-100 text-xs p-1">{item.shortcut}</span>}
        </a>
    );
    const adminItems = [
        {
            label: <img alt="logo" src="e.png" height="50" className="mr-2"></img>,
            url:'/'

        },
        {
            label: 'ניהול מוצרים',
            icon: 'pi pi-search',
            url: '/adminProducts'
        },
        {
            label: 'מוצרים',
            icon: 'pi pi-search',
            url: '/products'
        },
        {
            label: 'ניהול משתמשים',
            icon: 'pi pi-user ', 
            url: '/adminUsers'                    
        },
        {
            label: `${name} שלום`,
            icon: 'pi pi-user',
            items: [
                {
                    label: 'רישום / התחברות',
                    icon: 'pi pi-bolt',
                    url: '/login'
                },
                {
                    label: <Button style={{color: 'white'}} rounded text severity="info" onClick={()=>dispatch(removeToken())}>התנתקות</Button>,
                    icon: 'pi pi-bolt',
                    url: '/'
                },
                {
                    label: 'עריכת פרטים אישיים',
                    icon: 'pi pi-user-edit ', 
                    url: '/update'                 
                },
                
                {
                    separator: true
                },
            ]}]
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
            label: `${name} שלום`,
            icon: 'pi pi-user',
            items: [
                {
                    label: 'התחברות',
                    icon: 'pi pi-bolt',
                    url: '/login'
                },
                {
                    label: <Button style={{color: 'white'}} rounded text severity="info" onClick={()=>dispatch(removeToken())}>התנתקות</Button>,
                    icon: 'pi pi-bolt',
                    url: '/'
                },
                {
                    label: 'עריכת פרטים אישיים',
                    icon: 'pi pi-user-edit ', 
                    url: '/update'                 
                },                
                {
                    separator: true
                },
            ]
            

        },
        {
            label: <Link to={"/massages"}><Button style={{color: 'white'}} rounded text severity="info" >ההודעות שלי</Button></Link>,
            icon: 'pi pi-envelope',
            badge:count,
            template: itemRenderer,
        },
    ];

    return (
        <>
        <Sidebar dir='rtl' visible={visibleRight} style={{width: "25%"}} position="right" onHide={() => setVisibleRight(false)}>
                <h2 style={{textAlign:'center'}}>מועדפים</h2>
               <Favourites/>
            </Sidebar>


        <div className="" style={{border:'5px solid rgb(255, 255, 255)' , position:'fixed' ,width:'98%' ,zIndex:'1000', opacity:'85%',alignItems:'center'}} >
        {isAdmin&&<Menubar model={adminItems} start={null}  />}
           {!isAdmin&& isSuccess&&<Menubar model={userItems} />} 
        </div></>
    )


}
        
