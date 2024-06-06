import React, { useEffect} from "react";
import useAuth from "../hooks/useAuth"
import { useCreateMassageMutation, useGetMassagesQuery, useUpdateMassageMutation } from "./massageApiSlice"
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { useState } from "react";
import { ListBox } from 'primereact/listbox';
import { useNavigate, useParams } from "react-router-dom";

export default function AdminMassages() {
    const [newQuestion, setNewQuestion] = useState("");
    const {id} = useParams() 
    const [updateMassageFunc, { isErrorMassage, isSuccess:isSuccessMassage, isLoadingMassage, data, errorMassage }] = useUpdateMassageMutation()
    const {_id, username, roles, phone, name, favourites, email, address, password, isAdmin, isUser} = useAuth()
    const { data: massages, isLoading, isSuccess, isError, error, refetch } = useGetMassagesQuery()
    const [createMassageFunc,{isErrorMassageCreate,isSuccess:isSuccessMassageCreate,isLoadingMassageCreate, dataMassageCreate, errorMassageCreate}]=useCreateMassageMutation()
    const [selectedCountry, setSelectedCountry] = useState(null);

    const [visible, setVisible] = useState(false)
    const navigate = useNavigate()
    const handleUpdateMassage = ()=>{
        
        if(isAdmin){
            updateMassageFunc({_id:selectedCountry._id, answer:newQuestion}).then(() => refetch()).finally(() => setVisible(false)
            )
        }
        else{
             updateMassageFunc({_id:selectedCountry._id, question:newQuestion}).then(() => refetch()).finally(() => setVisible(false))
             

        }
        
    }
    useEffect(()=>{
        if(isSuccessMassage){
            setSelectedCountry(null)
        }
    },[isSuccessMassage])

        const countries = massages?.filter((massage) =>{return massage.user == id })
        const countryTemplate = (option) => {
                     return (
                         <div className="flex align-items-center">
                             <div style={{marginTop:'0px', height: '40px'}}> <h3 style={{marginTop:'0px'}}>{option.title}  {option.massageStatus == 1 ? '⚪' : '⚫'}</h3><h5 style={{marginTop:'-10px'}}>  {option.history[0]?.date && new Date(option.history[0].date).toLocaleString()}</h5></div>
                         </div>
                     );
                 };

    return (
        <>
        <br></br>
        <div className="card flex justify-content-center" style={{marginTop:'100px'}}>
            
        <div className=" flex justify-content-center" >
                <Card title="היסטורית שיחות" style={{textAlign:'center'}}>
                        <ListBox style={{ marginLeft: "0px" }} value={selectedCountry} onChange={(e) => setSelectedCountry(e.value)} options={countries} optionLabel="name"
                            itemTemplate={countryTemplate} className="w-full md:w-14rem" listStyle={{ maxHeight: '250px' }} />
                </Card>
            </div>
                  
            <Card title="ההודעות שלי" style={{textAlign:'center'}}  scrollable scrollHeight="200px">
            <div style={{ width: '400px', height: '300px', 'overflow': 'auto' }}>
            <h2>{isErrorMassageCreate && JSON.stringify(errorMassageCreate)}</h2>
                <p className ="m-90">
                   {selectedCountry?.history.map((h)=> <h4 style={{ marginTop: '-15px' }}><div className="card flex justify-content-center" rounded text severity="info" style={{ color: 'black', direction: "ltr", marginTop: "5px", paddingTop: '2%', backgroundColor: 'rgb(175,225,255)', height: '30px', width: '60%', textAlign: 'center' }}>{h.questionh}</div><h5 style={{ marginTop: '-6px' }}>{new Date(h.date).toLocaleString()}</h5><p className="card flex justify-content-center" rounded text severity="info" style={{ direction: "rtl", margin: "140px", marginTop: "-20px", backgroundColor: 'gray', color: 'black', height: '30px', width: '60%', textAlign: 'center', paddingTop: '2%', }}> {h.answerh}</p></h4>)}
                   {selectedCountry?.question?  <h4><div className="card flex justify-content-center" rounded text severity="info" style={{ color: 'black', direction: "ltr", marginTop: "5px", paddingTop:'2%', backgroundColor: 'rgb(175,225,255)', height: '30px', width: '60%', textAlign: 'center' }}>{selectedCountry?.question}</div></h4> : <br />}
                 
                </p>

             </div>
             <br/><br/>
             <div className="p-inputgroup flex-1" >
                {selectedCountry && <InputText placeholder="כתיבת הודעה"  style={{ width: '85%' }} rounded text severity="info"
                    onChange={(e) => { setNewQuestion(e.target.value) }} />}

                {selectedCountry &&<span className="p-inputgroup-addon"> <Button icon="pi pi-send" style={{ color: 'white', backgroundColor: 'transparent', border: 'black'}} onClick={() => handleUpdateMassage()} /></span>}
                </div>
            </Card>
            
        </div>
        </>
    )
}      