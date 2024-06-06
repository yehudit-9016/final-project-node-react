import React, { useState} from 'react';
import { Galleria } from 'primereact/galleria';
import { useGetProductByIdQuery } from './productApiSlic';
import {  useParams } from 'react-router-dom';
import { Divider } from 'primereact/divider';
import { Button } from 'primereact/button';
import { Sidebar } from 'primereact/sidebar';
import Favourites from '../favourites/favourites';
import useAuth from '../hooks/useAuth';
export default function Product() {
    const [visibleRight, setVisibleRight] = useState(false);

    const { id } = useParams()
    let { data: product, isLoading, isError, error, isSuccess } = useGetProductByIdQuery(id)

    const { isUser } = useAuth()

    const responsiveOptions = [
        {
            breakpoint: '991px',
            numVisible: 4
        },
        {
            breakpoint: '767px',
            numVisible: 3
        },
        {
            breakpoint: '575px',
            numVisible: 1
        }
    ];
    
    const itemTemplate = (item) => {
        return <img src={"http://localhost:1234/uploads/" + item.split("\\")[2]} alt={item.alt} style={{ width: '90000000vh', maxHeight: '420px' }} />;
    }

    const thumbnailTemplate = (item) => {
        return <img src={"http://localhost:1234/uploads/" + item.split("\\")[2]} alt={item.alt} style={{ width: '80px' }} />;
    }

    return (

        <>
            {isLoading && <></>}
            {!isLoading &&
                <>
                    
            <Sidebar dir='rtl' visible={visibleRight} style={{ width: "25%" }} position="right" onHide={() => setVisibleRight(false)}>
                        <h2 style={{textAlign:'center'}}>מועדפים</h2>
                        <Favourites/>
                    </Sidebar>
                    
                    <br></br>
                    <div className="" style={{ direction: 'rtl',  width: '80%', marginLeft: '0%',marginTop:'100px',backgroundRepeat:'no-repeat',backgroundSize:'cover'}}>
                        <div className="flex flex-column md:flex-row" style={{ width: '100%' }}>
                            <div className="flex-column md:flex-row" style={{ maxWidth: '500px', minWidth: '300px', padding: '1%' }}>
                                <h1><b style={{fontSize: '40px'}}>{product.name}</b></h1>
                                <h3><b>{product.description}</b></h3>
                                <div style={{backgroundColor:'white',opacity:'0.9',padding:'1px',width:'40%',left: '2.5%',zIndex:'100'}}></div>
                                <h3><b style={{fontSize: '30px'}}>מחיר: ₪{product.price}</b></h3>
                                
                                <div>
                                <br></br><br></br><br/>
                                    
                                    {isUser && <Button label='מועדפים' className='card flex justify-content-center' style={{ color: 'black', backgroundColor:'white', height: '8px', border:'white'}} onClick={() => setVisibleRight(true)} > </Button>}
                                </div>
                            </div>

                            <Divider layout="vertical" className="hidden md:flex" style={{ color: 'white' }}> </Divider>
                            <div className="flex flex-column md:flex-row" style={{ maxWidth: '500px', minWidth: '500px' }}>
                                <Galleria value={product.imageURL} responsiveOptions={responsiveOptions} numVisible={5} circular style={{ maxWidth: '500px' }}
                                    showItemNavigators showItemNavigatorsOnHover item={itemTemplate} thumbnail={thumbnailTemplate} />
                            </div>

                        </div>
                        
                    </div>
                    

                </>}
                <div style={{backgroundColor:'white',opacity:'0.9',padding:'3px',position: 'fixed',width:'95%',left: '2.5%',zIndex:'100', bottom: '20%'}}></div>
        </>
    )
}
