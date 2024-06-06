
import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Tag } from 'primereact/tag';
import { classNames } from 'primereact/utils';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { useDispatch } from 'react-redux';
import { setToken } from '../auth/authSlice';
import { Checkbox } from "primereact/checkbox";
import { Link } from 'react-router-dom';
import { useGetProductsQuery } from "./productApiSlic"
import { useUpdateFavouriteMutation } from '../favourites/favouriteApiSlice';



export default function Products() {

    const token = localStorage.getItem('token');
    const { _id, favourites, isUser } = useAuth()
    const [layout, setLayout] = useState('grid');
    const [updateFavouriteFunc, { isSuccess, data }] = useUpdateFavouriteMutation()
    let { data: products, isLoading, isError, error } = useGetProductsQuery()
    const [newProducts, setNewProducts] = useState([]);

    const categories = [
        { name: 'צמיד', key: 'A' },
        { name: 'שרשרת', key: 'M' },
        { name: 'עגילים', key: 'P' },
        { name: 'טבעת', key: 'R' }
    ];
    const [selectedCategories, setSelectedCategories] = useState([categories]);
    const onCategoryChange = (e) => {
        let _selectedCategories = [...selectedCategories];
        if (e.checked)
            _selectedCategories.push(e.value);
        else
            _selectedCategories = _selectedCategories.filter(category => category.key !== e.value.key);

        setSelectedCategories(_selectedCategories);
        const x = [];
        products.filter(p => _selectedCategories.map((s, index) => {
            if (index > 0) {
                if (p.category == s.name) {
                    x.push(p)
                }
            }
        }))
        setNewProducts(x)
    };
    let Icon = "";
    let isFavourite = false
    const dispath = useDispatch()
    const handleAddClick = (productId) => {
        updateFavouriteFunc({ _id: _id, id: productId })
    }
    const navigate = useNavigate()
    useEffect(() => {
        if (isSuccess) {
            dispath(setToken(data))
            navigate("/products")
        }
    }, [isSuccess]);
    if (isLoading) return <h1>Loading</h1>
    // if (isError) return <h1>{error}</h1>
    const getSeverity = (product) => {
        switch (product.inventoryStatus) {
            case 'INSTOCK':
                return 'success';

            case 'LOWSTOCK':
                return 'warning';

            case 'OUTOFSTOCK':
                return 'danger';

            default:
                return null;
        }
    };
    const header2 = (
        <img alt="Card" src="https://primefaces.org/cdn/primereact/images/usercard.png" />
    );

    const listItem = (product, index, Icon) => {
        return (
            <div className="col-12" key={product.id}  >
                <div className={classNames('flex flex-column xl:flex-row xl:align-items-start p-4 gap-4', { 'border-top-1 surface-border': index !== 0 })}>
                    <Link to={`/product/${product._id}`} style={{ textDecorationLine: 'none' }} ><img className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" src={"http://localhost:1234/uploads/" + product.imageURL[0].split("\\")[2]} alt={product.name}
                        style={{ width: '50px' }} /></Link>
                    <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                        <div className="flex flex-column align-items-center sm:align-items-start gap-3">
                            <div className="text-2xl font-bold text-900" >{product.name}</div>
                            <div className="flex align-items-center gap-3">
                                <span className="flex align-items-center gap-2">
                                    <i className="pi pi-tag"></i>
                                    <span className="font-semibold">{product.category}</span>
                                </span>
                                <Tag value={product.inventoryStatus} severity={getSeverity(product)}></Tag>
                            </div>
                        </div>
                        <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                            <span className="text-2xl font-semibold">${product.price}</span>

                            <Button icon={Icon} style={{ color: 'rgb(255,217,255)' }} rounded text severity="info" className="p-button-rounded" onClick={() => handleAddClick(product._id)} ></Button>
                        </div>
                    </div>
                </div>
            </div>

        );
    };

    const gridItem = (product, Icon) => {
        return (
            <div className="col-12 sm:col-6 lg:col-12 xl:col-4 p-2" key={product.id} >
                <div className="p-4 border-1 surface-border surface-card border-round" style={{ height: "100%" }}>
                    <div className="flex flex-wrap align-items-center justify-content-between gap-2" style={{}}>
                        <div className="flex align-items-center gap-2">
                            <i className="pi pi-tag"></i>
                            <span className="font-semibold">{product.category}</span>
                        </div>
                        <Tag value={product.inventoryStatus} severity={getSeverity(product)}></Tag>
                    </div>
                    <div className="flex flex-column align-items-center gap-3 py-5">
                        <Link to={`/product/${product._id}`} style={{ width: "80%" }}>
                            <img className="w-9 shadow-2 border-round" src={"http://localhost:1234/uploads/" + product.imageURL[0].split("\\")[2]} alt={product.name} style={{ width: '50px' }} /></Link>
                        <div className="text-2xl font-bold">{product.name}</div>
                    </div>

                    <div className="flex align-items-center justify-content-between" style={{bottom:"-30px"}}>
                        <span className="text-2xl font-semibold">${product.price}</span>
                        <Button  icon={Icon} rounded text severity="info" className="p-button-rounded" onClick={() => handleAddClick(product._id)} style={{ color: 'rgb(255,217,255)'}} ></Button>
                    </div>
                </div>
                <br></br>           
            </div>
        );
    };
    const itemTemplate = (product, layout, index) => {
        if (!product) {
            return;
        }
        if (isUser) {
            if (token != "") {
                isFavourite = favourites?.find(f => f == product._id)
                if (isFavourite)
                    Icon = "pi pi-heart-fill";
                else
                    Icon = "pi pi-heart";
            }
            else
                Icon = "pi pi-heart"
        }
        if (layout === 'list') return listItem(product, index, Icon);
        else if (layout === 'grid') return gridItem(product, Icon);
    };

    const listTemplate = (products, layout) => {
        return <div className="grid grid-nogutter">{products.map((product, index) => itemTemplate(product, layout, index))}</div>;
    };

    const header = () => {
        return (
            <div className="flex justify-content-end">
                <DataViewLayoutOptions layout={layout} onChange={(e) => setLayout(e.value)} />
            </div>
        );
    };




    return (
        <><br></br>
            <div style={{ width: '100%', left: '0%', textAlign: 'center', marginTop: '100px', opacity: '0.9', backgroundImage: 'url(products.png)', height: '300px', backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>
                <br></br>
                <br></br>
                <h1 style={{ marginTop: '30px', fontSize: '100px' }}>Our Products:</h1>
            </div>
            <div class="flex">
                <div class="inline-block  font-bold text-center p-4 border-round" style={{ width: '85%' }}>
                    <div className="" >
                        {newProducts.length ? <DataView value={newProducts} listTemplate={listTemplate} layout={layout} header={header()} />
                            : <DataView value={products} listTemplate={listTemplate} layout={layout} header={header()} style={{ padding: '2%' }} />}
                    </div>
                </div>
                <div class="inline-block   font-bold text-center p-4 border-round" style={{ width: '15%', marginTop: '60px', marginRight: '10px' }}>
                        <div className="card">
                            <h2>סינון</h2>
                            <div className="card flex justify-content-center">
                                <div className="flex flex-column gap-3">
                                    {categories.map((category) => {
                                        return (
                                            <div key={category.key} className="flex align-items-center"  >
                                                <Checkbox inputId={category.key} name="category" value={category} onChange={onCategoryChange} checked={selectedCategories.some((item) => item.key === category.key)} />
                                                <label htmlFor={category.key} className="ml-2">
                                                    {category.name}
                                                </label>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                </div>
            </div></>

    )
}