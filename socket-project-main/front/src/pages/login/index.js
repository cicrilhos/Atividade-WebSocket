import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { Client } from '../../api/client'
import { Socket } from '../../api/client'
import './style.css'

export default function Login() {
    const [nome, setNome] = useState('');


    const navigate = useNavigate();

    function enviarDados() {
        const user = { nome }
        console.log('Enviando:', user)

        Client.post('/login', user)
            .then(res => {
                console.log('Servidor respondeu:', res.data)
                alert('Login executado')
                Socket.connect()
                navigate("/home", { state: { nome } })
            })
            .catch(error => {
                console.error('Erro completo:', error)
            })
            .finally(() => {
                console.log('Requisição finalizada')
            })

    }


    useEffect(() => {
        // Este evento será disparado quando o socket se conectar
        Socket.on('connect', () => {
            console.log('Usuário conectado:', Socket.id);
        });

        return () => {
            Socket.off('connect');
        };

    }, []);

    return (
        <div className='tela-login'>
            <div className='header-login'>
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M5 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0m4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
                    <path d="m2.165 15.803.02-.004c1.83-.363 2.948-.842 3.468-1.105A9 9 0 0 0 8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6a10.4 10.4 0 0 1-.524 2.318l-.003.011a11 11 0 0 1-.244.637c-.079.186.074.394.273.362a22 22 0 0 0 .693-.125" />
                </svg>
                <h1>BATE PAPO</h1>
            </div>

            <div className='login'>
                <input
                    className='input-login'
                    placeholder='Digite seu nome'
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                />
                <div className='button-login' onClick={enviarDados}>
                    Entrar
                </div>
            </div>
        </div>
    );
}