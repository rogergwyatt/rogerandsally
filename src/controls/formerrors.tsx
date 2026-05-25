import React from 'react';

interface IErrorMessage {
    message: string
}

const FormError = ({message} : IErrorMessage) =>{

    return(
    <div className="formError">
        {message}
    </div>
    );
}

interface IFormCompErrors {
    errors: {
        name:string[], 
        phone:string[], 
        email:string[], 
        zipcode:string[], 
        message:string[]
    }
}


const FormErrors = ({errors} : IFormCompErrors) => 
{
    return(
        <div className="formerrors">
            <div className="nameErrors">
                {errors.name.map((el)=> {return(<FormError message = {el} key="err1"/>)})}
            </div>
            <div className="phoneErrors">
                {errors.phone.map((el)=> {return(<FormError message = {el} key="err2"/>)})}
            </div>
            <div className="emailErrors">
                {errors.email.map((el)=> {return(<FormError message = {el}  key="err3"/>)})}
            </div>
            <div className="zipCodeErrors">
                {errors.zipcode.map((el)=> {return(<FormError message = {el}  key="err4"/>)})}
            </div>
            <div className="messageErrors">
                {errors.message.map((el)=> {return(<FormError message = {el}  key="err5"/>)})}
            </div>
        </div>
    );
};

export default FormErrors;