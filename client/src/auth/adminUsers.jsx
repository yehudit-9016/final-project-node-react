import React, { useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { RadioButton } from 'primereact/radiobutton';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { useCreateUserMutation, useGetAllUsersQuery, useUpdateMutation } from './authApiSlice';
import {  useNavigate } from 'react-router-dom';
import { useGetMassagesQuery } from '../massage/massageApiSlice';

export default function AdminProducts() {
    const { data: products, isLoading, isError, error, refetch } = useGetAllUsersQuery()
    const [updateUserFunc, { isError:isErrorUser,isSuccess:isSuccessUser, isLoading:isLoadingUser, data:dataUser, error:errorUser }] = useUpdateMutation()
    const [createUserFunc,{isErrorCreateUser,isSuccess:isSuccessCreateUser,isLoadingCreateUser,dataCreateUser,errorCreateUser}]=useCreateUserMutation()

    let emptyProduct = {
        id: null,
        name: '',
        username: '',
        address: '',
        roles: null,
        email: '',
        phone: ''
    };
    const { data: massages, isLoading: isLoadingMassage, isSuccess, isError:isErrorMassage, error: errorMassage} = useGetMassagesQuery()

    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [product, setProduct] = useState(emptyProduct);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    
    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    };

    const saveProduct = () => {
        setSubmitted(true);

        if (product.name.trim()) {
            let _products = [...products];
            let _product = { ...product };

            if (product._id) {
                
                updateUserFunc(product).then(() => refetch())

                const index = findIndexById(product.id);

                _products[index] = _product;
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
            } else {
                createUserFunc(product)
                _product.id = createId();
                _product.image = 'product-placeholder.svg';
                _products.push(_product);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
            }

            setProductDialog(false);
            setProduct(emptyProduct);
        }
    };

    const editProduct = (product) => {
        setProduct({ ...product });
        setProductDialog(true);
    };

    const confirmDeleteProduct = (product) => {
        setProduct(product);
        setDeleteProductDialog(true);
    };

    const deleteProduct = () => {
        let _products = products.filter((val) => val.id !== product.id);
        setDeleteProductDialog(false);
        setProduct(emptyProduct);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
    };

    const findIndexById = (id) => {
        let index = -1;

        for (let i = 0; i < products.length; i++) {
            if (products[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    const createId = () => {
        let id = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        return id;
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const deleteSelectedProducts = () => {
        let _products = products.filter((val) => !selectedProducts.includes(val));

        setDeleteProductsDialog(false);
        setSelectedProducts(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
    };

    const onRolesChange = (e) => {
        let _product = { ...product };

        _product['roles'] = e.value;
        setProduct(_product);
    };

    const leftToolbarTemplate = () => {
        return (
       <></>
        );
    };

    const rightToolbarTemplate = () => {
        return <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />;
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editProduct(rowData)} />
            </React.Fragment>
        );
    };
    const navigate = useNavigate()
    let status = []
    const openMassages = (rowData) => {
        return (
            <>
            
            {/* {status= massages?.filter(m=> {if(m.user === rowData._id) return m})} */}
            {/* {status = massages?.filter((massage) =>{return massage})} */}
            {/* status = rowData.massages?.forEach(m=> m.massageStatus == 0) */}
            {/* {console.log(status)} */}
            <React.Fragment>
               {status && <Button icon="pi pi-envelope" style={{color: 'white'}} rounded outlined className="mr-2" onClick={() => navigate(`/adminMassages/${rowData._id}`) }/>}
               {/* {!status && <Button icon="pi pi-envelope" style={{color: 'white'}} rounded outlined className="mr-2" onClick={() => navigate(`/adminMassages/${rowData._id}`) }/>} */}
            </React.Fragment>
            </>
        );
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
          
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="...חיפוש" />
            </span>
              <h4 className="m-0"> ניהול משתמשים</h4>
        </div>
    );
    const productDialogFooter = (
        <React.Fragment>
            <Button label="ביטול" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="שמירה" icon="pi pi-check" onClick={saveProduct} />
        </React.Fragment>
    );
   

    return (
        <><br/>
        <div>
            <Toast ref={toast} />
            <div className="card" style={{marginTop:'100px'}}>
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                <DataTable ref={dt} value={products} selection={selectedProducts} onSelectionChange={(e) => setSelectedProducts(e.value)}
                        dataKey="id"  paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} users" globalFilter={globalFilter} header={header}>
                    <Column header="עריכה" body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                    <Column field="roles" header="הרשאה" sortable style={{ minWidth: '10rem' }}></Column>
                    <Column field="phone" header="טלפון" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="email" header="Email" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="address" header="כתובת" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="name" header="שם" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column header="הודעות" body={openMassages} exportable={false} style={{ minWidth: '12rem' }}></Column>
                </DataTable>
            </div>


            <Dialog visible={productDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Product Details" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>

                <div className="field">
                    <label className="mb-3 font-bold">הרשאה</label>
                    <div className="formgrid grid">
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="roles1" name="roles" value="admin" onChange={onRolesChange} checked={product.roles === 'admin'} />
                            <label htmlFor="roles1">מנהל</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="roles2" name="roles" value="user" onChange={onRolesChange} checked={product.roles === 'user'} />
                            <label htmlFor="roles2">משתמש</label>
                        </div>
            
                    </div>
                </div>
            </Dialog>

        </div>
        </>
    );
}
        


        