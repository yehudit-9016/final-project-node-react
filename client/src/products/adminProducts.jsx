import React, { useState, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Rating } from 'primereact/rating';
import { Toolbar } from 'primereact/toolbar';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton } from 'primereact/radiobutton';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { useCreateProductMutation, useDeleteProductMutation, useGetProductsQuery, useUpdateProductMutation } from './productApiSlic';


export default function AdminProducts() {
    const { data: products, isLoading, isError, error, refetch } = useGetProductsQuery()
    const [updateProductFunc, { isError:isErrorProduct,isSuccess:isSuccessProduct, isLoading:isLoadingProduct, data:dataProduct, error:errorProduct }] = useUpdateProductMutation()
    const [createProductFunc,{isErrorCreateProduct,isSuccess:isSuccessCreateProduct,isLoadingCreateProduct,dataCreateProduct,errorCreateProduct}]=useCreateProductMutation()
   const [deleteProductFunc, { data:dataDeleteProduct, isSuccess:isSuccessDeleteProduct }] =useDeleteProductMutation()

    let emptyProduct = {
        id: '',
        name: '',
        imageURL: '',
        description: '',
        category: null,
        price: 0,

    };

    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [product, setProduct] = useState(emptyProduct);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);


    const formatCurrency = (value) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    const openNew = () => {
        setProduct(emptyProduct);
        setSubmitted(false);
        setProductDialog(true);
    };

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
                const formData = new FormData();
                formData.append('_id', product._id)
                    formData.append('name',product.name);
                    formData.append('imageURL', selectedFile);
                    formData.append('price', product.price);
                    formData.append('description', product.description);
                    formData.append('category', product.category);
                    
                        selectedFile?.forEach((e) => {
                        formData.append('imageURL', e);
                    });
                    
                updateProductFunc(formData)
                setSelectedFile(null)
                const index = findIndexById(product.id);

                _products[index] = _product;
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
            } else {

                const formData = new FormData();
                    formData.append('name',product.name);
                    selectedFile?.forEach((e) => {
                        formData.append('imageURL', e);
                    });
                    formData.append('price', product.price);
                    formData.append('description', product.description);
                    formData.append('category', product.category);
                createProductFunc(formData).then(()=>refetch())
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
        deleteProductFunc({id:product._id})
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

    const onCategoryChange = (e) => {
        let _product = { ...product };

        _product['category'] = e.value;
        setProduct(_product);
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _product = { ...product };

        _product[`${name}`] = val;

        setProduct(_product);
    };
    const handleFileChange = (event) => {
        let a=[]
        for (let index = 0; index < event.target.files.length; index++) {
            a.push(event.target.files[index])
        }
        setSelectedFile(a);

      };

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _product = { ...product };

        _product[`${name}`] = val;

        setProduct(_product);
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="הוספת חדש" icon="pi pi-plus" severity="success" onClick={openNew} />
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />;
    };

    const imageBodyTemplate = (rowData) => {
        if(rowData.imageURL)
       { 
        return <img src={"http://localhost:1234/uploads/"+rowData.imageURL[0].split("\\")[2]} alt={rowData.image} className="shadow-2 border-round" style={{ width: '64px' }} />;
    }};

    const priceBodyTemplate = (rowData) => {
        return formatCurrency(rowData.price);
    };
    const descriptionBodyTemplate = (rowData) => {
        return formatCurrency(rowData.description);
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editProduct(rowData)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteProduct(rowData)} />
            </React.Fragment>
        );
    };


    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="...חיפוש" />
            </span>
            <h4 className="m-0">ניהול מוצרים</h4>

        </div>
    );
    const productDialogFooter = (
        <React.Fragment>
            <Button label="ביטול" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="שמירה" icon="pi pi-check" onClick={saveProduct} />
        </React.Fragment>
    );
    const deleteProductDialogFooter = (
        <React.Fragment>
            <Button label="לא" icon="pi pi-times" outlined onClick={hideDeleteProductDialog} />
            <Button label="כן" icon="pi pi-check" severity="danger" onClick={deleteProduct} />
        </React.Fragment>
    );
    const deleteProductsDialogFooter = (
        <React.Fragment>
            <Button label="לא" icon="pi pi-times" outlined onClick={hideDeleteProductsDialog} />
            <Button label="כן" icon="pi pi-check" severity="danger" onClick={deleteSelectedProducts} />
        </React.Fragment>
    );

    return (
        <><br/>
        <div>
            <Toast ref={toast} />
            <div className="card" style={{marginTop:'100px'}}>
                <Toolbar className="mb-4"  left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                <DataTable ref={dt} value={products} selection={selectedProducts}  onSelectionChange={(e) => setSelectedProducts(e.value)}
                        dataKey="id"  paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" globalFilter={globalFilter} header={header}>
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                    <Column field="imageURL" header="תמונה" body={imageBodyTemplate}></Column>
                    <Column field="price" header="מחיר" body={priceBodyTemplate} sortable style={{ minWidth: '8rem' }}></Column>
                    <Column field="description" header="תאור המוצר" body={descriptionBodyTemplate} sortable style={{ minWidth: '8rem' }}></Column>
                    <Column field="category" header="קטגוריה" sortable style={{ minWidth: '10rem' }}></Column>
                    <Column field="name" header="שם המוצר" sortable style={{ minWidth: '16rem' }}></Column>
                </DataTable>
            </div>


            <Dialog  visible={productDialog} dir={'rtl'} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="פרטי המוצר" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                {product.image && <img src={`https://primefaces.org/cdn/primereact/images/product/${product.image}`} alt={product.image} className="product-image block m-auto pb-3" />}
                <div className="field">
                    <label htmlFor="name" className="font-bold">
                        שם המוצר
                    </label>
                    <InputText id="name" value={product.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.name })} />
                    {submitted && !product.name && <small className="p-error">Name is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="description" className="font-bold">
                        תאור המוצר
                    </label>
                    <InputTextarea id="description" value={product.description} onChange={(e) => onInputChange(e, 'description')} required rows={3} cols={20} />
                </div>

            <input type="file" name="imageURL" multiple onChange={handleFileChange} />
                <div className="formgrid grid">
                    <div className="field col">
                        <label htmlFor="price" className="font-bold">
                            מחיר
                        </label>
                        <InputNumber id="price" value={product.price} onValueChange={(e) => onInputNumberChange(e, 'price')} mode="currency" currency="USD" locale="en-US" />
                    </div>
                </div>
                <div className ="field" >
                    <label className="mb-3 font-bold">קטגוריה</label>
                    <div className="formgrid grid" value={product.category}>
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="category1" name="category" value="צמיד" onChange={onCategoryChange} checked={product.category === 'צמיד'} />
                            <label htmlFor="category1">צמיד</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="category2" name="category" value="שרשרת" onChange={onCategoryChange} checked={product.category === 'שרשרת'} />
                            <label htmlFor="category2">שרשרת</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="category3" name="category" value="עגילים" onChange={onCategoryChange} checked={product.category === 'עגילים'} />
                            <label htmlFor="category3">עגילים</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="category4" name="category" value="טבעת" onChange={onCategoryChange} checked={product.category === 'טבעת'} />
                            <label htmlFor="category4">טבעת</label>
                        </div>
                    </div>
                </div>
            </Dialog>



            <Dialog visible={deleteProductDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {product && (
                        <span>
                            ?האם אתה בטוח שברצונך למחוק  <b>{product.name}</b>
                        </span>
                    )}
                </div>
            </Dialog>

            <Dialog visible={deleteProductsDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {product && <span>האם אתה בטוח שברצונך למחוק פריט זה?</span>}
                </div>
            </Dialog>
        </div>
        </>
    );
}
        
  



        