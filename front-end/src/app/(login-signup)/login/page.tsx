'use client'


import FormInput from "@/Components/Inputs/formInput";
import { useState } from "react";
import LoginForm from "../components/loginForm";

export default function Login() {


    return (
        <div>
            <LoginForm onSubmit={async () => {}} />
        </div>
    ); 
}