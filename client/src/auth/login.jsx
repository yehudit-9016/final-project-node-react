import { useFormik } from 'formik';
import { Password } from 'primereact/password';
import { classNames } from 'primereact/utils';
import { AutoComplete } from "primereact/autocomplete";
import { useLoginMutation } from "./authApiSlice";
import { useNavigate } from "react-router-dom";
import { setToken } from "./authSlice";
import { useDispatch } from "react-redux";

import React, { useEffect} from 'react'; 
import { Divider } from 'primereact/divider';
import { Button } from 'primereact/button';
import { Link } from 'react-router-dom';

export default function Login({massage}) {
const [loginFunc, {isError, error, isSuccess, data }] = useLoginMutation()
    const navigate = useNavigate()
    const dispath = useDispatch()

    useEffect(()=>{
        if(isSuccess){
            dispath(setToken(data))           
            navigate('/')
        }
    }, [isSuccess])
  
    const formik = useFormik({
                initialValues: {
                    email:'',
                    password: ''
                    
                },
                validate: (data) => {
                    let errors = {};
        
                    if (!data.password){
                        errors.password = '.שדה חובה';
                    }
                    if (!data.email){
                        errors.email = '.שדה חובה';
                    }
        
                    return errors;
                },
                onSubmit: (data) => {
                   
                    loginFunc(data)
                }
            });
            const isFormFieldInvalid = (name) => !!(formik.touched[name] && formik.errors[name]);

    const getFormErrorMessage = (name) => {
        return isFormFieldInvalid(name) ?  <small className="p-error">{formik.errors[name]}</small> : <small className="p-error">&nbsp;</small>;
    };
    return (
        <><br/>
        <div className="card"  style={{marginTop:'100px'}}>
            {massage && <h2>אינך מזוהה, עליך להכנס</h2>}
            <div className="flex flex-column md:flex-row">
                <div className="w-full md:w-5 flex flex-column align-items-center justify-content-center gap-3 py-5">
                    <div className="flex flex-wrap justify-content-center align-items-center gap-2">
                    
                    <h2>{isError&& JSON.stringify(error)}</h2>
                        <label className="w-6rem">כתובת מייל</label>
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
                    <div className="flex flex-wrap justify-content-center align-items-center gap-2">
                        <label className="w-6rem">סיסמה</label>
                        <Password
                    inputId="in_password"
                    name="password"
                    rows={5}
                    cols={30}
                    className={classNames({ 'p-invalid': isFormFieldInvalid('password') })}
                    value={formik.values.password}
                    feedback={false}
                    onChange={(e) => {
                        formik.setFieldValue('password', e.target.value);
                    }}
                />
                
                {getFormErrorMessage('password')}
                    </div>
                         <Button label="Login" type="submit" icon="pi pi-check" onClick={formik.handleSubmit} style={{backgroundColor: 'rgb(255,217,255)' , border: 'black'}}/>
                </div>
                <div className="w-full md:w-2">
                    <Divider layout="vertical" className="hidden md:flex">
                        <b>OR</b>
                    </Divider>
                    <Divider layout="horizontal" className="flex md:hidden" align="center">
                        <b>OR</b>
                    </Divider>
                </div>
                <div className="w-full md:w-5 flex align-items-center justify-content-center py-5">
                <Link to='/register'><Button  label="Sign Up" icon="pi pi-user-plus" severity="success" className="w-10rem" style={{backgroundColor: 'rgb(255,217,255)', border: 'black'}}></Button></Link>
                </div>
                
            </div>
            
        </div>
        </>
    )
}


