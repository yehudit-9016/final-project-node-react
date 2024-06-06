import { Dialog } from 'primereact/dialog';
import React, { useEffect, useRef } from "react";
import useAuth from "../hooks/useAuth"
import { useCreateMassageMutation, useGetMassagesQuery, useUpdateMassageMutation } from "./massageApiSlice"
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { useState } from "react";
import { ListBox } from 'primereact/listbox';
import { useNavigate } from "react-router-dom";
import { ScrollTop } from 'primereact/scrolltop';


export default function Massages() {
    const [newQuestion, setNewQuestion] = useState("");
    const [topic, setTopic] = useState('');
    const [contents, setContents] = useState('');

    const [updateMassageFunc, { isErrorMassage, isSuccess: isSuccessMassage, isLoadingMassage, data, errorMassage }] = useUpdateMassageMutation()
    const { data: massages, isLoading, isSuccess, isError, error, refetch } = useGetMassagesQuery()
    const [createMassageFunc, { isErrorMassageCreate, isSuccess: isSuccessMassageCreate, isLoadingMassageCreate, dataMassageCreate, errorMassageCreate }] = useCreateMassageMutation()
    const [selectedCountry, setSelectedCountry] = useState(null);

    const [visible, setVisible] = useState(false)
    const navigate = useNavigate()

    const handleUpdateMassage = () => {
        updateMassageFunc({ _id: selectedCountry._id, question: newQuestion }).then(() => refetch()).finally(() => setVisible(false))
    }
    useEffect(() => {
        if (isSuccessMassage) {
            setSelectedCountry(null)
        }
    }, [isSuccessMassage])

    useEffect(() => {
        if (isSuccess) {
            navigate('/massages')
        }
    }, [isSuccess])
    const footer = (
        <>
            <Button label="הוספת שיחה" style={{ color: 'black', backgroundColor: 'white', border: 'black' }} icon="pi pi-plus" onClick={() => setVisible(true)} />
        </>
    );
    const countries = massages?.map((massage) => massage)

    const countryTemplate = (option) => {
        return (
            <div className="flex align-items-center">
               <div style={{marginTop:'0px', height: '40px'}}> <h3 style={{marginTop:'0px'}}>{option.title}  {option.massageStatus == 1 ? '⚫' : '⚪'}</h3><h5 style={{marginTop:'-10px'}}>  {option.history[0]?.date && new Date(option.history[0].date).toLocaleString()}</h5></div>
            </div>
        );
    };

    return (
        <><br></br>
        <div className=" flex justify-content-center" style={{marginTop:'100px'}}>
            
            <div className=" flex justify-content-center" >
                <Card title="היסטורית שיחות" style={{textAlign:'center'}} footer={footer}>
                        <ListBox style={{ marginLeft: "0px" }} value={selectedCountry} onChange={(e) => setSelectedCountry(e.value)} options={countries} optionLabel="name"
                            itemTemplate={countryTemplate} className="w-full md:w-14rem" listStyle={{ maxHeight: '250px' }} />
                        <ScrollTop target="parent" threshold={100} className="w-2rem h-2rem border-round bg-primary" icon="pi pi-arrow-up text-base" />
                </Card>
            </div>

            <Card title="ההודעות שלי" style={{textAlign:'center'}} scrollable scrollHeight="200px" >
                <div style={{ width: '400px', height: '300px', 'overflow': 'auto' }}>
                    <h2>{isErrorMassageCreate && JSON.stringify(errorMassageCreate)}</h2>
                    <p className="m-0">
                        {selectedCountry?.history.map((h) => <h4 style={{ marginTop: '-15px' }}><div className="card flex justify-content-center" rounded text severity="info" style={{ color: 'black', direction: "ltr", marginTop: "5px", paddingTop: '2%', backgroundColor: 'rgb(175,225,255)', height: '30px', width: '60%', textAlign: 'center' }}>{h.questionh}</div><h5 style={{ marginTop: '-6px' }}>{new Date(h.date).toLocaleString()}</h5><p className="card flex justify-content-center" rounded text severity="info" style={{ direction: "rtl", margin: "140px", marginTop: "-20px", backgroundColor: 'gray', color: 'black', height: '30px', width: '60%', textAlign: 'center', paddingTop: '2%', }}> {h.answerh}</p></h4>)}
                        {selectedCountry?.question?  <h4><div className="card flex justify-content-center" rounded text severity="info" style={{ color: 'black', direction: "ltr", marginTop: "5px", paddingTop:'2%', backgroundColor: 'rgb(175,225,255)', height: '30px', width: '60%', textAlign: 'center' }}>{selectedCountry?.question}</div></h4> : <br />}

                    </p>
                    <ScrollTop target="parent" threshold={100} className="w-2rem h-2rem border-round bg-primary" icon="pi pi-arrow-up text-base" />

                </div>
                <br /><br />
                <div className="p-inputgroup flex-1" >
                {selectedCountry && <InputText placeholder="כתיבת הודעה"  style={{ width: '85%' }} rounded text severity="info"
                    onChange={(e) => { setNewQuestion(e.target.value) }} />}

                {selectedCountry &&<span className="p-inputgroup-addon"> <Button icon="pi pi-send" style={{ color: 'white', backgroundColor: 'transparent', border: 'black'}} onClick={() => handleUpdateMassage()} /></span>}
                </div>
            </Card>
            <Dialog visible={visible}
                modal
                onHide={() => setVisible(false)}
                content={({ hide }) => (
                    <div className="flex flex-column px-8 py-5 gap-4" style={{ borderRadius: '12px', backgroundColor:'black' , border:'solid 2px rgb(255,217,255)'}}>
                    <div className="inline-flex flex-column gap-2" >
                            <label htmlFor="נושא" className="font-semibold" style={{color:'white'}}>
                                    נושא      
                            </label>
                            <InputText inputId="ac" label="נושא" className="text-primary-50 bg-white-alpha-20 border-none p-3 " style={{color:'black'}} onChange={(e) => setTopic(e.target.value)}></InputText>      
                    </div>                  
                    <div className="inline-flex flex-column gap-2" >
                            <label htmlFor="תוכן ההודעה" className=" font-semibold" style={{color:'white'}}>
                                  תוכן ההודעה     
                            </label>
                            <InputText inputId="aj" label="תוכן ההודעה" className="text-primary-50 bg-white-alpha-20 border-none p-3 " style={{color:'black'}} onChange={(e) => setContents(e.target.value)}></InputText>      
                    </div>    
                    <div className="flex align-items-center gap-2">
                      <Button icon="pi pi-trash"  style={{backgroundColor: 'white'}} onClick={() =>  setVisible(false)} className="p-3 w-full  border-1 border-white-alpha-30 hover:bg-white-alpha-10"  />
                       <Button icon="pi pi-send" style={{backgroundColor: 'white'}} onClick={() => {
                            createMassageFunc({ title: topic, question: contents }).then(() => refetch()).finally(() => setVisible(false)); setVisible(false);
                              }} autoFocus className="p-3 w-full  border-1 border-white-alpha-30 hover:bg-white-alpha-10" />
                         </div>
                    </div>
                )}
            >
            </Dialog>
        </div></>
    )

}        

