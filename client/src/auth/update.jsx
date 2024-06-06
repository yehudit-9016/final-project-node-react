import React, { useEffect, useRef} from "react";
import { useFormik } from 'formik';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import { AutoComplete } from "primereact/autocomplete";
import {  useUpdateMutation } from "./authApiSlice";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useDispatch } from "react-redux";
import { setToken } from "./authSlice";

export default function Update() {   
    const {_id, roles, phone, name,  email, address, } = useAuth()

    const dispatch = useDispatch()
    const [updateFunc, { isError, isSuccess, isLoading, data, error }] = useUpdateMutation()
    const toast = useRef(null);
    useEffect(() => {
        if (isSuccess) {
            dispatch(setToken(data))
            navigate('/')
        }
    })
    const navigate = useNavigate()
    const show = () => {
        toast.current.show({ severity: 'success', summary: 'Form Submitted' });
    };

    const formik = useFormik({
        initialValues: {
            _id: _id,
            name: name,
            email: email,
            address: address,
            phone: phone,
            roles: roles
        },
        validate: (data) => {
            let errors = {};

            if (!data.name) {
                errors.name = '.שדה חובה';
            }
            if (!data.password) {
                errors.password = '.שדה חובה';
            }
            
            if (!data.email) {
                errors.email = '.שדה חובה';
            }
            if (!data.phone) {
                errors.phone = '.שדה חובה';
            }
            return errors;
        },
        onSubmit: (data) => { 
             data && show();
            updateFunc(data);
        }
    });

    const isFormFieldInvalid = (name) => !!(formik.touched[name] && formik.errors[name]);

    const getFormErrorMessage = (name) => {
        return isFormFieldInvalid(name) ? <small className="p-error">{formik.errors[name]}</small> : <small className="p-error">&nbsp;</small>;
    };

    return (
      <><br/><br/>
      <div style={{marginTop:'200px'}}>
      <form onSubmit={formik.handleSubmit} className="flex flex-wrap  gap-3 p-fluid" style={{width:'50%',marginLeft:'25%'}}>
      <Toast ref={toast} />
      <h2>{isError && JSON.stringify(error)}</h2>
      <div className="flex-auto">
      <label htmlFor="value" className="font-bold block mb-2">שם</label>
                    <AutoComplete
                    inputId="ac_name"
                    name="name"
                    value = {formik.values.name}
                    className={classNames({ 'p-invalid': isFormFieldInvalid('name') })}
                    onChange={(e) => {
                        formik.setFieldValue('name', e.value);
                    }}
                />
                {getFormErrorMessage('name')}
      </div>
      <div className="flex-auto">
      <label htmlFor="value" className="flex-auto font-bold block mb-2">Email</label>

    <AutoComplete
        inputId="ac_email"
        name="email"
        value={formik.values.email}
        className={classNames({ 'p-invalid': isFormFieldInvalid('email') })}
        onChange={(e) => {
            formik.setFieldValue('email', e.value);
        }}
    />
    {getFormErrorMessage('email')}
      </div>
      <div className="flex-auto">
      <label htmlFor="value" className="font-bold block mb-2">כתובת</label>

        <AutoComplete
            inputId="ac_address"
            name="email"
            value={formik.values.address}
            onChange={(e) => {
                formik.setFieldValue('address', e.value);
            }}
        />
      </div>
      <div className="flex-auto">
      <label htmlFor="value" className="font-bold block mb-2">טלפון</label>

        <AutoComplete
            inputId="ac_phone"
            name="email"
            value={formik.values.phone}
            className={classNames({ 'p-invalid': isFormFieldInvalid('phone') })}
            onChange={(e) => {
                formik.setFieldValue('phone', e.value);
            }}
        />
        {getFormErrorMessage('phone')}
      </div>
      <Button label="Submit" type="submit" icon="pi pi-check" onClick={()=>{updateFunc(formik.values)}} style={{backgroundColor:'rgb(255,217,255)',border:'black'}}/>

        </form>
      </div>
        </>
    )
}