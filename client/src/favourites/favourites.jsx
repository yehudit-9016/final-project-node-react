import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { useGetProductsQuery } from '../products/productApiSlic';
import { useDeleteFavouriteMutation } from './favouriteApiSlice';
import useAuth from '../hooks/useAuth';
import { useDispatch } from 'react-redux';
import { setToken } from '../auth/authSlice';
import { Column } from 'primereact/column';


export default function Favourites() {

    const [full_favourites, setFull_favourites] = useState([]);

    const { _id, favourites} = useAuth()

    const dispath = useDispatch()
    const { data: products, isLoading, isError, error, isSuccess: productsSuccess } = useGetProductsQuery()
    const [deleteFunc, { isSuccess, data }] = useDeleteFavouriteMutation()

    useEffect(()=>{
        if(productsSuccess){
            let arr = favourites?.map((f) => { return (products?.find(p => p._id == f)) })
            setFull_favourites(arr)
        }
    } ,[productsSuccess, favourites])
    

    const handleRemoveClick = (productId) => {
        deleteFunc({ _id: _id, id: productId })
    }
    useEffect(() => {
        if (isSuccess) {
            dispath(setToken(data))
        }
    }, [isSuccess])

    const imageBodyTemplate = (f) => {
        return (
         
            <div className='flex p-overlay-badge'>
                <img src={"http://localhost:1234/uploads/" + f.imageURL[0].split("\\")[2]} alt={f.name} className="w-6rem shadow-2 border-round" />
            </div>
        );
    };

    const priceBodyTemplate = (f) => {
        return(
        <div>
              {f.price} <br/><br/><br/>
              <Button icon="pi pi-heart-fill"  rounded text severity="info" style={{color:'rgb(255,217,255)'}} onClick={() => handleRemoveClick(f._id)}></Button>
        </div>)
       
        
    };

    const nameBodyTemplate = (f) => {
       return f.name;
    };

    if (isLoading) return <h1>Loading</h1>
    if (isError) return <h1>{error}</h1>
   
    return (

        <div className="card">
            {!full_favourites ? <>
           
                <img className=" xl:w-15rem  xl:block mx-auto" src={'heart.png'} alt={'heart'} style={{ marginTop: '100px' ,width:'180%'}} />
                    <h2 style={{ textAlign: 'center' }}>Oops! You have no favourites</h2>
            </>:
            full_favourites.length == 0 ?
                <>
                    <img className=" xl:w-15rem  xl:block mx-auto" src={'heart.png'} alt={'heart'} style={{ marginTop: '100px',width:'180%' }} />
                    <h2 style={{ textAlign: 'center' }}>Oops! You have no favourites</h2>
                </>
                :

                <div >
                    <DataTable value={full_favourites} scrollable scrollHeight="480px" tableStyle={{ minWidth: '80px', minHeight: '430px' }}>
                        <Column field="name" body={nameBodyTemplate} header="name"></Column>
                        <Column header="Image" body={imageBodyTemplate}></Column>
                        <Column field="price" header="Price" body={priceBodyTemplate}></Column>
                    </DataTable>


                    <div className="mt-auto">
                        <hr className="flex flex-wrap align-items-center justify-content-between gap-2" />
                    </div>

                </div>
}
            </div>

    )
} 




